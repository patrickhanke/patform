import React from "react";
import { PatstoreProject } from "@repo/types";

const DisplayProject = ({ project }: { project?: PatstoreProject }) => {
  if (!project) {
    return (
      <div className="flex col a-ce gap-md ta-ce">
        <img
          src={"https://store.patwork.net/logo.png"}
          alt={"pattstore"}
          height={50}
          width={50}
        />
        <h2>patwork</h2>
      </div>
    );
  }

  return (
    <div className="flex col a-ce gap-md ta-ce">
      <img src={project.logo} alt={project.name} />
      <h2>{project.name}</h2>
    </div>
  );
};

export default DisplayProject;
