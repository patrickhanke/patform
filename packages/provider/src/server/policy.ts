import "server-only";
import {
  AccessContext,
  AccessError,
  canAccessProject,
  OBJECT_ID_PATTERN,
} from "./access";
import { parseRest } from "./sashido";

export const CLASS_NAME_PATTERN = /^_?[A-Za-z][A-Za-z0-9_]{0,63}$/;

// Fields that must never be returned to or written by non-superusers through master-key requests.
export const SECRET_FIELDS = [
  "password_key",
  "sessionToken",
  "authData",
  "_hashed_password",
  "_email_verify_token",
  "_perishable_token",
];

const MEMBER_MASTER_KEY_SYSTEM_CLASSES = ["_User", "_Role"];

// patstore marks admin roles with `admin: true`, patflow with `type` "admin" / "office".
const ADMIN_ROLE_TYPES = ["admin", "office"];

type ParseObject = Record<string, any>;

export const normalizeClassName = (className: string | null | undefined) => {
  const name = className === "User" ? "_User" : className;

  if (!name || !CLASS_NAME_PATTERN.test(name)) {
    throw new AccessError(400, "Ungültiger Klassenname");
  }

  return name;
};

export const assertObjectId = (objectId: unknown): string => {
  if (typeof objectId !== "string" || !OBJECT_ID_PATTERN.test(objectId)) {
    throw new AccessError(400, "Ungültige objectId");
  }
  return objectId;
};

export const projectPointer = (projectId: string) => ({
  __type: "Pointer",
  className: "Project",
  objectId: projectId,
});

const pointerId = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "objectId" in value) {
    return (value as { objectId: string }).objectId;
  }
  return undefined;
};

export const projectIdsOf = (className: string, object: ParseObject) => {
  if (className === "_User") {
    return (object.projects as string[]) || [];
  }
  if (className === "Project") {
    return [object.objectId as string];
  }
  const projectId = pointerId(object.project);
  return projectId ? [projectId] : [];
};

export const scopeWhere = (className: string, projectId: string) => {
  if (className === "_User") {
    return { projects: projectId };
  }
  if (className === "Project") {
    return { objectId: projectId };
  }
  return { project: projectPointer(projectId) };
};

export const assertMemberMayUseMasterKey = (className: string) => {
  if (
    className.startsWith("_") &&
    !MEMBER_MASTER_KEY_SYSTEM_CLASSES.includes(className)
  ) {
    throw new AccessError(403, "Keine Berechtigung für diese Klasse");
  }
};

export const stripSecretFields = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(stripSecretFields) as T;
  }
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>)
        .filter(([key]) => !SECRET_FIELDS.includes(key))
        .map(([key, value]) => [key, stripSecretFields(value)]),
    ) as T;
  }
  return data;
};

// Any `project` pointer written by a client must point to a project the user may access.
export const assertProjectPointer = (
  context: AccessContext,
  updateObject: ParseObject,
) => {
  if (updateObject.project === undefined || updateObject.project === null) {
    return;
  }
  if (!canAccessProject(context, pointerId(updateObject.project))) {
    throw new AccessError(403, "Kein Zugriff auf dieses Projekt");
  }
};

const assertUsersInProject = async (users: unknown, projectId: string) => {
  if (!Array.isArray(users)) {
    return;
  }
  for (const user of users) {
    const objectId = assertObjectId(pointerId(user));
    const target = await fetchObjectWithMasterKey("_User", objectId);
    if (!projectIdsOf("_User", target).includes(projectId)) {
      throw new AccessError(403, "Nutzer gehört nicht zum Projekt");
    }
  }
};

export const fetchObjectWithMasterKey = async (
  className: string,
  objectId: string,
) => {
  const { status, data } = await parseRest<ParseObject>(
    `classes/${className}/${objectId}`,
    { useMasterKey: true },
  );
  if (status !== 200) {
    throw new AccessError(404, "Objekt nicht gefunden");
  }
  return data;
};

// The target of a master-key update/delete must belong to the request project and must not be a superuser.
export const assertMemberMayModify = async (
  className: string,
  objectId: string,
  projectId: string,
) => {
  if (className === "Project") {
    throw new AccessError(403, "Kein Zugriff auf dieses Objekt");
  }

  const target = await fetchObjectWithMasterKey(className, objectId);

  if (!projectIdsOf(className, target).includes(projectId)) {
    throw new AccessError(403, "Kein Zugriff auf dieses Objekt");
  }
  if (className === "_User" && target.is_superuser === true) {
    throw new AccessError(403, "Kein Zugriff auf dieses Objekt");
  }
};

export const isProjectAdmin = async (
  context: AccessContext,
  projectId: string,
) => {
  if (context.isSuperuser) {
    return true;
  }
  if (!context.projectIds.includes(projectId)) {
    return false;
  }

  const where = JSON.stringify({
    users: {
      __type: "Pointer",
      className: "_User",
      objectId: context.user.objectId,
    },
  });
  const { data } = await parseRest<{ results?: ParseObject[] }>(
    `classes/_Role?where=${encodeURIComponent(where)}&limit=1000`,
    { useMasterKey: true },
  );

  return (data.results || []).some(
    (role) =>
      (role.admin === true || ADMIN_ROLE_TYPES.includes(role.type)) &&
      projectIdsOf("_Role", role).includes(projectId),
  );
};

// Managing users and role memberships is limited to project admins; other members may only update
// their own user. Returns whether the caller is a project admin.
export const authorizeUserManagement = async (
  context: AccessContext,
  {
    className,
    operation,
    objectId,
    projectId,
  }: {
    className: string;
    operation: "create" | "update" | "delete";
    objectId?: string;
    projectId: string;
  },
) => {
  if (!MEMBER_MASTER_KEY_SYSTEM_CLASSES.includes(className)) {
    return false;
  }

  const isAdmin = await isProjectAdmin(context, projectId);
  const isOwnUser =
    className === "_User" &&
    operation === "update" &&
    objectId === context.user.objectId;

  if (!isAdmin && !isOwnUser) {
    throw new AccessError(
      403,
      "Nur Projekt-Administratoren dürfen Nutzer und Rollen verwalten",
    );
  }

  return isAdmin;
};

// Removes/forces fields so that a project member using the master key cannot escalate privileges
// or write into other projects.
export const sanitizeMemberWrite = async ({
  className,
  updateObject,
  projectId,
  isCreate,
  isAdmin = false,
}: {
  className: string;
  updateObject: ParseObject;
  projectId: string;
  isCreate: boolean;
  isAdmin?: boolean;
}): Promise<ParseObject> => {
  const data: ParseObject = { ...updateObject };

  delete data.ACL;
  SECRET_FIELDS.forEach((field) => delete data[field]);

  if (className === "Project") {
    throw new AccessError(403, "Keine Berechtigung");
  }

  if (className === "_Role") {
    if (isCreate || !isAdmin) {
      throw new AccessError(403, "Keine Berechtigung");
    }
    const allowed = ["users", "updated_by"];
    Object.keys(data).forEach((key) => {
      if (!allowed.includes(key)) {
        delete data[key];
      }
    });
    await assertUsersInProject(data.users?.objects, projectId);
    return data;
  }

  if (className === "_User") {
    delete data.is_superuser;
    delete data.has_access;
    if (isCreate) {
      data.is_superuser = false;
      data.projects = [projectId];
    } else {
      delete data.projects;
    }
    delete data.roles;
    delete data.role;
    if (data.project !== undefined) {
      data.project = projectPointer(projectId);
    }
    return data;
  }

  data.project = projectPointer(projectId);
  return data;
};
