import React from "react";
import "@repo/styles/global";
import "@repo/styles/layout";
import LayoutContext from "./components/LayoutContext";
import SiteHeader from "./content/SiteHeader";
import RenderSidebar from "./components/RenderSidebar";
import Head from "next/head";
import { cookies } from "next/headers";

export const metadata = {
  title: "patflow",

  description: "PH",
};

const getData = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(process.env.SESSION_TOKEN)?.value;

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

  return user;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getData();
  console.log({'patflow user': user});
  

  return (
    <html lang="de">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>patflow</title>
      </Head>
      <body>
        <div className="layout">
          <LayoutContext>
            <RenderSidebar user={user} />

            <div className="main_content" id="main_content">
              <div className="content_container" id="page_content">
                <SiteHeader />

                <div className="content" id="content">
                  {children}
                </div>
              </div>
            </div>
          </LayoutContext>
        </div>
      </body>
    </html>
  );
}
