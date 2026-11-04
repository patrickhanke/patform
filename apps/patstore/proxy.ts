import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  fetchSessionUser,
  getSessionCookieName,
  OBJECT_ID_PATTERN,
  parseRest,
} from "@repo/provider/server";

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

const findAllowedModulePaths = async (
  projectId: string,
  userId: string
): Promise<string[]> => {
  const projectWhere = {
    project: { __type: "Pointer", className: "Project", objectId: projectId },
  };

  const roleWhere = JSON.stringify({
    ...projectWhere,
    users: { __type: "Pointer", className: "_User", objectId: userId },
  });
  const { data: roleData } = await parseRest<{ results?: { modules?: string[] }[] }>(
    `classes/_Role?where=${encodeURIComponent(roleWhere)}`,
    { useMasterKey: true }
  );
  const allowedModuleIds = (roleData.results || []).flatMap(
    (role) => role.modules || []
  );

  if (allowedModuleIds.length === 0) {
    return [];
  }

  const { data: moduleData } = await parseRest<{
    results?: { objectId: string; path?: string }[];
  }>(
    `classes/Module?where=${encodeURIComponent(JSON.stringify(projectWhere))}`,
    { useMasterKey: true }
  );

  return (moduleData.results || [])
    .filter((module) => module.path && allowedModuleIds.includes(module.objectId))
    .map((module) => module.path as string);
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

  const user = await fetchSessionUser(
    request.cookies.get(getSessionCookieName())?.value
  ).catch(() => null);

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
    const allowedPaths = await findAllowedModulePaths(projectId, user.objectId);

    if (!allowedPaths.some((path) => matchesPath(pathname, path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (err: any) {
    console.error("Error checking module access:", err.message);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
