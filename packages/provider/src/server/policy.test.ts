import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const parseRest = vi.fn();
vi.mock("./sashido", () => ({
  parseRest: (...args: unknown[]) => parseRest(...args),
  getSessionCookieName: () => "patstore_token",
}));

import {
  assertMemberMayModify,
  assertMemberMayUseMasterKey,
  assertProjectPointer,
  authorizeUserManagement,
  isProjectAdmin,
  normalizeClassName,
  sanitizeMemberWrite,
  scopeWhere,
  stripSecretFields,
} from "./policy";
import { AccessContext } from "./access";

const member: AccessContext = {
  sessionToken: "r:token",
  user: { objectId: "user1", projects: ["projA"] },
  isSuperuser: false,
  projectIds: ["projA"],
  activeProjectId: "projA",
};

describe("server data policy", () => {
  beforeEach(() => {
    parseRest.mockReset();
  });

  it("rejects class names that could traverse to other Parse endpoints", () => {
    expect(() => normalizeClassName("../users")).toThrow();
    expect(() => normalizeClassName("Article/abc")).toThrow();
    expect(normalizeClassName("User")).toBe("_User");
  });

  it("blocks master-key access to system classes other than _User/_Role", () => {
    expect(() => assertMemberMayUseMasterKey("_Session")).toThrow();
    expect(() => assertMemberMayUseMasterKey("_Installation")).toThrow();
    expect(() => assertMemberMayUseMasterKey("_User")).not.toThrow();
    expect(() => assertMemberMayUseMasterKey("Article")).not.toThrow();
  });

  it("scopes user queries to the project", () => {
    expect(scopeWhere("_User", "projA")).toEqual({ projects: "projA" });
    expect(scopeWhere("Article", "projA")).toEqual({
      project: { __type: "Pointer", className: "Project", objectId: "projA" },
    });
  });

  it("rejects project pointers to foreign projects", () => {
    expect(() =>
      assertProjectPointer(member, {
        project: { __type: "Pointer", className: "Project", objectId: "projB" },
      }),
    ).toThrow();
  });

  it("prevents members from granting superuser or foreign projects", async () => {
    const created = await sanitizeMemberWrite({
      className: "_User",
      updateObject: { is_superuser: true, projects: ["projB"], name: "x" },
      projectId: "projA",
      isCreate: true,
    });
    expect(created.is_superuser).toBe(false);
    expect(created.projects).toEqual(["projA"]);

    const updated = await sanitizeMemberWrite({
      className: "_User",
      updateObject: {
        is_superuser: true,
        projects: ["projB"],
        ACL: {},
        name: "x",
      },
      projectId: "projA",
      isCreate: false,
    });
    expect(updated).toEqual({ name: "x" });
  });

  it("rejects roles from other projects", async () => {
    parseRest.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [{ objectId: "role1", project: { objectId: "projB" } }],
      },
    });
    await expect(
      sanitizeMemberWrite({
        className: "_User",
        updateObject: { roles: ["role1"] },
        projectId: "projA",
        isCreate: false,
        isAdmin: true,
      }),
    ).rejects.toThrow();
  });

  it("strips role changes from non-admin members", async () => {
    const updated = await sanitizeMemberWrite({
      className: "_User",
      updateObject: {
        roles: ["adminRole"],
        role: { objectId: "adminRole" },
        name: "x",
      },
      projectId: "projA",
      isCreate: false,
    });
    expect(updated).toEqual({ name: "x" });
    expect(parseRest).not.toHaveBeenCalled();

    await expect(
      sanitizeMemberWrite({
        className: "_Role",
        updateObject: { users: { __op: "AddRelation", objects: [] } },
        projectId: "projA",
        isCreate: false,
      }),
    ).rejects.toThrow();
  });

  it("only lets non-admin members update their own user", async () => {
    parseRest.mockResolvedValue({
      status: 200,
      data: {
        results: [
          { objectId: "role1", admin: false, project: { objectId: "projA" } },
        ],
      },
    });

    await expect(
      authorizeUserManagement(member, {
        className: "_User",
        operation: "update",
        objectId: "user1",
        projectId: "projA",
      }),
    ).resolves.toBe(false);

    for (const request of [
      { className: "_User", operation: "update" as const, objectId: "user2" },
      { className: "_User", operation: "create" as const },
      { className: "_User", operation: "delete" as const, objectId: "user1" },
      { className: "_Role", operation: "update" as const, objectId: "role1" },
    ]) {
      await expect(
        authorizeUserManagement(member, { ...request, projectId: "projA" }),
      ).rejects.toThrow();
    }

    await expect(
      authorizeUserManagement(member, {
        className: "Article",
        operation: "delete",
        objectId: "a1",
        projectId: "projA",
      }),
    ).resolves.toBe(false);
  });

  it("recognizes admin roles of the project only", async () => {
    parseRest.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          { objectId: "r1", admin: true, project: { objectId: "projB" } },
        ],
      },
    });
    await expect(isProjectAdmin(member, "projA")).resolves.toBe(false);

    parseRest.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          { objectId: "r2", admin: true, project: { objectId: "projA" } },
        ],
      },
    });
    await expect(isProjectAdmin(member, "projA")).resolves.toBe(true);

    parseRest.mockResolvedValueOnce({
      status: 200,
      data: {
        results: [
          { objectId: "r3", type: "office", project: { objectId: "projA" } },
        ],
      },
    });
    await expect(isProjectAdmin(member, "projA")).resolves.toBe(true);

    await expect(isProjectAdmin(member, "projB")).resolves.toBe(false);
  });

  it("forbids modifying superusers or objects of other projects", async () => {
    parseRest.mockResolvedValueOnce({
      status: 200,
      data: { objectId: "u2", projects: ["projA"], is_superuser: true },
    });
    await expect(
      assertMemberMayModify("_User", "u2", "projA"),
    ).rejects.toThrow();

    parseRest.mockResolvedValueOnce({
      status: 200,
      data: { objectId: "a1", project: { objectId: "projB" } },
    });
    await expect(
      assertMemberMayModify("Article", "a1", "projA"),
    ).rejects.toThrow();

    await expect(
      assertMemberMayModify("Project", "projA", "projA"),
    ).rejects.toThrow();
  });

  it("strips secret fields from responses", () => {
    expect(
      stripSecretFields({
        results: [{ objectId: "u1", password_key: { key: "k" } }],
      }),
    ).toEqual({ results: [{ objectId: "u1" }] });
  });
});
