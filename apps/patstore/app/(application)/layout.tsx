import React, { Suspense } from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import LayoutContext from "./components/LayoutContext";
import RenderSidebar from "./components/RenderSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SiteHeader } from "./content/SiteHeader";
import { fetchAppBootstrapData } from "@repo/provider";
import { fetchSessionUser, getSessionCookieName } from "@repo/provider/server";
import { PatstoreProject, PatstoreRoleClass, PatstoreUser } from "@repo/types";

// The providers pages need (Apollo, AppContext) only become available once
// AppShell resolves the cookie-based user/project fetch below, so children
// can't be rendered in a fallback ahead of that. Instant-navigation
// validation is opted out for this segment rather than faked with an
// unusable fallback.
// export const instant = false;

export const metadata = {
  title: "Patstore App",
  description: "PH",
};

const getData = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;
  const cookieProjectId = cookieStore.get(
    `${process.env.APP_NAME}_project_id`
  )?.value;

  if (!token) {
    redirect("/login");
  }

  let user: PatstoreUser | null;
  try {
    user = (await fetchSessionUser(token)) as PatstoreUser | null;
  } catch (error) {
    console.error(
      "users/me unavailable:",
      error instanceof Error ? error.message : error
    );
    return { unavailable: true as const };
  }

  if (!user?.objectId) {
    redirect("/login");
  }

  const projectId =
    cookieProjectId && user.projects?.includes(cookieProjectId)
      ? cookieProjectId
      : user.projects?.[0];

  const { project, roles } = await fetchAppBootstrapData<
    PatstoreProject,
    PatstoreRoleClass
  >({
    appId: "patstore",
    projectId,
    sessionToken: token,
  });

  return { unavailable: false as const, user, project, roles };
};

async function AppShell({ children }: { children: React.ReactNode }) {
  const data = await getData();

  if (data.unavailable) {
    return (
      <div className={"layout"}>
        <div className={"content"}>
          <p>
            Die Anmeldung konnte nicht geprüft werden. Bitte laden Sie die
            Seite in einem Moment neu.
          </p>
        </div>
      </div>
    );
  }

  const { user, project, roles } = data;

  return (
    <div className={"layout"}>
      <LayoutContext user={user} project={project} roles={roles}>
        <RenderSidebar user={user} />
        <div className={"main_content"} id="main_content">
          <div className={"content_container"} id="page_content">
            <SiteHeader />
            <div className={"content"} id="content">
              {children}
            </div>
          </div>
        </div>
      </LayoutContext>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Suspense fallback={<div className={"layout"} />}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
  