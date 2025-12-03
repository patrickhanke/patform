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
    pathname.startsWith("/login") || // exclude login files ||
    pathname.startsWith("/invite") || // exclude invite files ||
    pathname.startsWith("/password") || // exclude password files ||
    pathname.startsWith("/datenschutz") || // exclude datenschutz files ||
    pathname.startsWith("/impressum") || // exclude impressum files ||
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  // handle token
  const token = request.cookies.get("patstore_token")?.value;
  let user: PatstoreUser | null = null as PatstoreUser | null;

  const response = NextResponse.next();

  if (token) {
      console.log({token})
 
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
        return null;
      });
      console.log({userData})

      if (userData?.objectId) {
        user = userData;
      } else {
        response.cookies.set("patstore_token", "", { maxAge: 0 });
        return NextResponse.redirect(new URL("/login", request.url));
      }
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log({user})

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

  const projectId = request.cookies.get("patstore_project_id")?.value;
  
  console.log({projectId})
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
  const hasAcces = !!pathArray.find((path) => request.nextUrl.pathname.includes(path));

  if (
    !hasAcces &&
    user?.is_superuser === false
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
