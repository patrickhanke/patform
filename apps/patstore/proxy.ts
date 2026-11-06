import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  fetchSessionUser,
  getSessionCookieName,
  isActiveAccessGrant,
  modulesForAccessClass,
  OBJECT_ID_PATTERN,
  parseRest,
  recordAccessPath,
} from "@repo/provider/server";
import type { PatstoreUserAccess } from "@repo/types";

const PUBLIC_FILE = /\.(.*)$/;

const SUPERUSER_ONLY_PATHS = ["/admin", "/settings"];

const matchesPath = (pathname: string, path: string) =>
  path === "/"
    ? pathname === "/"
    : pathname === path || pathname.startsWith(`${path}/`);

const redirectToLogin = (request: NextRequest) => {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(getSessionCookieName(), "", { maxAge: 0 });
  return response;
};

type ProjectModule = {
  objectId: string;
  path?: string;
  name?: string;
  connected_class?: string;
  position?: number;
};

const projectWhere = (projectId: string) =>
  JSON.stringify({
    project: { __type: "Pointer", className: "Project", objectId: projectId },
  });

const fetchProjectModules = async (projectId: string): Promise<ProjectModule[]> => {
  const { data } = await parseRest<{ results?: ProjectModule[] }>(
    `classes/Module?where=${encodeURIComponent(projectWhere(projectId))}`,
    { useMasterKey: true }
  );
  return data.results || [];
};

const findAllowedModulePaths = async (
  projectId: string,
  userId: string,
  modules: ProjectModule[]
): Promise<string[]> => {
  const roleWhere = JSON.stringify({
    project: { __type: "Pointer", className: "Project", objectId: projectId },
    users: { __type: "Pointer", className: "_User", objectId: userId },
  });
  const { data: roleData } = await parseRest<{ results?: { modules?: string[] }[] }>(
    `classes/_Role?where=${encodeURIComponent(roleWhere)}`,
    { useMasterKey: true }
  );
  const allowedModuleIds = (roleData.results || []).flatMap(
    (role) => role.modules || []
  );

  return modules
    .filter((module) => module.path && allowedModuleIds.includes(module.objectId))
    .map((module) => module.path as string);
};

const recordBelongsToProject = async (
  className: string,
  id: string,
  projectId: string
) => {
  const { status, data } = await parseRest<{
    project?: { objectId?: string } | string;
  }>(`classes/${className}/${id}`, { useMasterKey: true });
  if (status !== 200) return false;
  const project = data.project;
  const objectProjectId = typeof project === "string" ? project : project?.objectId;
  return objectProjectId === projectId;
};

const pathMatchesGrant = (
  pathname: string,
  grant: PatstoreUserAccess,
  modules: ProjectModule[]
) =>
  modulesForAccessClass(modules, grant.className).some((module) => {
    const path = recordAccessPath(module.path, grant.id);
    return !!path && matchesPath(pathname, path);
  });

const hasGrantedRecordAccess = async (
  pathname: string,
  projectId: string,
  grants: PatstoreUserAccess[] | undefined,
  modules: ProjectModule[]
) => {
  const matches = (grants || []).filter(
    (grant) => isActiveAccessGrant(grant) && pathMatchesGrant(pathname, grant, modules)
  );
  if (matches.length === 0) return false;
  const owned = await Promise.all(
    matches.map((grant) => recordBelongsToProject(grant.className, grant.id, projectId))
  );
  return owned.some(Boolean);
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  API routes check the session themselves
    pathname.startsWith("/static") || // exclude static files ||
    pathname.startsWith("/login") || // exclude login files ||
    pathname.startsWith("/invite") || // exclude invite files ||
    pathname.startsWith("/password") || // exclude password files ||
    pathname.startsWith("/datenschutz") || // exclude datenschutz files ||
    pathname.startsWith("/impressum") || // exclude impressum files ||
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let user;
  try {
    user = await fetchSessionUser(sessionToken);
  } catch {
    // Parse did not reject the session. Leave the cookie in place; a cleared
    // cookie here logs the browser out for every following request.
    return NextResponse.next();
  }

  if (!user) {
    return redirectToLogin(request);
  }

  if (user.is_superuser === true) {
    return NextResponse.next();
  }

  if (SUPERUSER_ONLY_PATHS.some((path) => matchesPath(pathname, path))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  const projects = user.projects || [];
  const cookieProjectId = request.cookies.get("patstore_project_id")?.value;
  const projectId =
    cookieProjectId &&
    OBJECT_ID_PATTERN.test(cookieProjectId) &&
    projects.includes(cookieProjectId)
      ? cookieProjectId
      : projects[0];

  if (!projectId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const modules = await fetchProjectModules(projectId);
    const allowedPaths = await findAllowedModulePaths(
      projectId,
      user.objectId,
      modules
    );

    if (allowedPaths.some((path) => matchesPath(pathname, path))) {
      return NextResponse.next();
    }

    const granted = await hasGrantedRecordAccess(
      pathname,
      projectId,
      user.access,
      modules
    );
    if (!granted) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (err: any) {
    console.error("Error checking module access:", err.message);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
