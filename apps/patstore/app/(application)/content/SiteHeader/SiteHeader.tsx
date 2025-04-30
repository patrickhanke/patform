"use client";

import { useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderComponent } from "./types";
import { UserDisplay } from "./content/UserDisplay";
import { PatstoreAppContext } from "@repo/provider";
import { Module } from "@repo/types";

const SiteHeader = ({ title }: SiteHeaderComponent) => {
  const { project } = useContext(PatstoreAppContext);
  const { pageTitle } = useContext(PatstoreAppContext);
  const pathname = usePathname();

  console.log(pathname);
  const modules: Module[] = useMemo(() => {
    return project.modules.results.map((module: Module) => ({
      name: module.name,
      path: module.path,
      objectId: module.objectId
    }));
  }, [project])
  
  // Generate breadcrumbs from the current route
  const breadcrumbs = pathname
    .split("/")
    .filter((segment) => segment) // Remove empty segments
    .map((segment, index, array) => ({
      name: modules.find(module => module.path === segment.replace(/-/g, " "))?.name, // Replace dashes with spaces
      href: "/" + array.slice(0, index + 1).join("/"), // Construct the path
    }));

    console.log({breadcrumbs, pathname, modules});
    

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.siteheader_container}>
          <div>
            <nav aria-label="breadcrumbs">
              /
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.href}>
                  <a href={crumb.href}>{crumb.name}</a>
                  {index < breadcrumbs.length - 1 && " / "}
                </span>
              ))}
            </nav>
            <h1>{pageTitle || title}</h1>
          </div>
          <div className={styles.siteheader_right_container}>
            <UserDisplay />
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteHeader;
