import React, { Suspense } from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import LayoutContext from "./components/LayoutContext";
import RenderSidebar from "./components/RenderSidebar";
import { cookies } from "next/headers";
import { SiteHeader } from "./content/SiteHeader";
import { fetchAppBootstrapData } from "@repo/provider";
import { PatstoreProject, PatstoreRoleClass } from "@repo/types";

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
  const token = cookieStore.get("patstore_token")?.value;
  const cookieProjectId = cookieStore.get(
    `${process.env.APP_NAME}_project_id`
  )?.value;

  const httpHeaders = {
    "X-Parse-Session-Token": token || "",
    "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
    "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
  };

  const headers = new Headers(httpHeaders);

  const user = await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
    method: "GET",
    headers,
  }).then((response) => response.json());

  const projectId =
    cookieProjectId && user?.projects?.includes(cookieProjectId)
      ? cookieProjectId
      : user?.projects?.[0];

  const { project, roles } = await fetchAppBootstrapData<
    PatstoreProject,
    PatstoreRoleClass
  >({
    appId: "patstore",
    projectId,
    sessionToken: token,
  });

  return { user, project, roles };
};

async function AppShell({ children }: { children: React.ReactNode }) {
  const { user, project, roles } = await getData();

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
