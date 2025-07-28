import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PatstoreUser } from "@repo/types";

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest) {

  // exclude paths
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files ||
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  // handle token
  const token = request.cookies.get("patstore_token")?.value;
  let user: PatstoreUser | null = null as PatstoreUser | null;

  const response = NextResponse.next();

  if (token) {
     const httpHeaders = {
      "X-Parse-Session-Token": token || "",
      "X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
      "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || "",
    };

    const headers = new Headers(httpHeaders);
    const userData = await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
      method: "GET",
      headers,
    })
      .then((response) => response.json())
      .catch(() => {
        console.log("error");
      });
      console.log({userData})

      if (userData) {
        user = userData;
      } else {
        response.cookies.set("patstore_token", "", { maxAge: 0 });
        return NextResponse.redirect(new URL("/login", request.url));
      }
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }


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

  if (!user && !isApplicationPath) {
    return NextResponse.next();
  } else if (!user && isApplicationPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // check if user has role access to route

  let projectArray: string[] = [];

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
