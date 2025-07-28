import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PatstoreUser } from "@repo/types";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files ||
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("patstore_token")?.value;
  const loggedInCookie = request.cookies.get("patstore_logged_in")?.value || "";
  let loggedIn = loggedInCookie === "true" || false;

  if (!token) {
    loggedIn = false;
  }

  const httpHeaders = {
    "X-Parse-Session-Token": token || "",
    "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
    "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
  };

  const headers = new Headers(httpHeaders);
  let user: PatstoreUser | null = null as PatstoreUser | null;

  let projectArray: string[] = [];

  let isApplicationPath = true;

  if (request.nextUrl.pathname.includes("/login")) {
    isApplicationPath = false;
  }

  if (request.nextUrl.pathname.includes("/invite")) {
    isApplicationPath = false;
  }

  if (request.nextUrl.pathname.includes("/password")) {
    isApplicationPath = false;
  }

 

  try {
    const data = await fetch(`${process.env.SASHIDO_API_URL}classes/Project`, {
      method: "GET",
      headers: {
        "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
        "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
      },
    });

    if (data.ok) {
      const projects = await data.json();
      projects.results.forEach((project: any) => {
        projectArray.push(`/${project.path}`);
      });
    } else {
      console.error("Failed to fetch projects:", data.status, data.statusText);
    }
  } catch (err: any) {
    console.error("Error fetching projects:", err.message);
  }

  if (projectArray.length > 0) {
    projectArray.forEach((project) => {
      if (request.nextUrl.pathname.includes(project)) {
        isApplicationPath = false;
      }
    });
  }

  if (!token && !isApplicationPath) {
    return NextResponse.next();
  } else if (!token && isApplicationPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .then((actualData: PatstoreUser & { sessionToken: string }) => {
        if (actualData.sessionToken === token && !loggedIn) {
          loggedIn = true;
        }
        user = actualData;
      })
      .catch(() => {
        console.log("error");

        loggedIn = false;
      });
  }

  const response = NextResponse.next();

  if (!user && isApplicationPath === true) {
    console.info("deleting cookie 110", request.cookies.get("patstore_token"));
    response.cookies.set("patstore_token", "", { maxAge: 0 });
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (isApplicationPath === false) {
    console.info("deleting cookie 115", request.cookies.get("patstore_token"));
    response.cookies.set("patstore_token", "", { maxAge: 0 });
  }

  if (loggedIn) {
    response.cookies.set("patstore_logged_in", "true");
  } else {
    if (request.nextUrl.pathname.includes("/login")) {

      response.cookies.set("patstore_logged_in", "false");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  const projectId = process.env.PROJECT_ID;
    
  let roleModuleArray: string[] = [];
  try {
    const data = await fetch(
      `https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/1/classes/_Role?where={"project":{"__type":"Pointer","className":"Project","objectId":"${projectId}"}}`,
      {
        method: "GET",
        headers: {
          "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
          "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
          "X-Parse-Master-Key": process.env.SASHIDO_MASTER_KEY || "",
        },
      },
    );
    if (data.ok) {
      const roles = await data.json();
      
        if (user && user.roles && Array.isArray(user.roles)) {
            roles.results.forEach((role: any) => {
                if (user && user.roles.includes(role.objectId)) {
                    if (role.modules) {
                        role.modules.forEach((module: string) => {
                            roleModuleArray.push(module);
                        });
                    }
                }
            });
        }
       
    } else {
      console.error("Failed to fetch modules:", data.status, data.statusText);
    }
  } catch (err: any) {
    console.error("Error fetching modules:", err.message);
  }

  const pathArray: string[] = ["/"];
  try {
    const data = await fetch(
      `https://pg-app-uefbsna5l6ijyse42wipewpjwu804d.scalabl.cloud/1/classes/Module?where={"project":{"__type":"Pointer","className":"Project","objectId":"${projectId}"}}`,
      {
        method: "GET",
        headers: {
          "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
          "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
        },
      },
    );

    if (data.ok) {
      const modules = await data.json();
      modules.results.forEach((module: any) => {
        if (roleModuleArray.includes(module.objectId)) {
          pathArray.push(module.path);
        }
      });
    } else {
      console.error("Failed to fetch modules:", data.status, data.statusText);
    }
  } catch (err: any) {
    console.error("Error fetching modules:", err.message);
  }

  console.log({pathArray});
  

  if (
    !pathArray.includes(request.nextUrl.pathname) &&
    user?.is_superuser === false
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
