import React, { Suspense } from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import LayoutContext from "./components/LayoutContext";
import SiteHeader from "./content/SiteHeader";
import RenderSidebar from "./components/RenderSidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAppBootstrapData } from "@repo/provider";
import { PatflowProject, PatflowUserRole } from "@repo/types";

const SESSION_COOKIE =
	process.env.SESSION_TOKEN || "patflow_session_token";

export const metadata = {
  title: "patflow",
  description: "PH",
};

const getData = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const cookieProjectId = cookieStore.get(
    `${process.env.APP_NAME}_project_id`
  )?.value;

  if (!token) {
    redirect("/login");
  }

  const httpHeaders = {
    "X-Parse-Session-Token": token,
    "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
    "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
  };

  const headers = new Headers(httpHeaders);

  const user = await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
    method: "GET",
    headers,
    cache: "no-store",
  }).then((response) => response.json());

  if (!user?.objectId) {
    redirect("/login");
  }

  const projectId =
    cookieProjectId && user?.projects?.includes(cookieProjectId)
      ? cookieProjectId
      : user?.projects?.[0];

  const { project, roles } = await fetchAppBootstrapData<
    PatflowProject,
    PatflowUserRole
  >({
    appId: "patflow",
    projectId,
    sessionToken: token,
  });

  return { user, project, roles };
};

async function AppShell({ children }: { children: React.ReactNode }) {
  const { user, project, roles } = await getData();

  return (
    <LayoutContext user={user} project={project} roles={roles}>
      <div className="layout">
        <RenderSidebar user={user} />

        <div className="main_content" id="main_content">
          <div className="content_container" id="page_content">
            <SiteHeader />

            <div className="content" id="content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </LayoutContext>
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
        <Suspense fallback={<div className="layout" />}>
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
