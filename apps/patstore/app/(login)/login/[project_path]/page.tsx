import { Suspense } from "react";
import { compileAxiosError } from "@repo/provider";
import { DisplayProject, LoginForm } from "../../content";
import axios from "axios";

const fetchProject = async (path: string) => {
  if (path !== "/login") {
    const axiosclient = axios.create({
      baseURL: process.env.SASHIDO_API_URL,
      headers: {
        "X-Parse-Application-Id": process.env.SASHIDO_APP_ID,
        "X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY,
      },
    });

    const res = await axiosclient
      .post("functions/get_project_from_path", { path })
      .then((response) => response.data.result)
      .catch((err) => compileAxiosError(err.message));
    return res;
  }
};

async function LoginContent({
  params,
}: {
  params: Promise<{ project_path: string }>;
}) {
  const { project_path } = await params;
  const response = await fetchProject(`${project_path}`);

  if (response.success === false) {
    return (
      <p>
        Projekt nicht gefunden. Falls es sich um einen gültigen Link hanelt,
        wenden Sie sich bitten an{" "}
        <a href="mailto:info@patwork.net">info@patwork.net </a>
      </p>
    );
  }

  return (
    <>
      <DisplayProject project={response.project} />
      <LoginForm />
    </>
  );
}

const Login = ({
  params,
}: {
  params: Promise<{ project_path: string }>;
}) => {
  return (
    <Suspense fallback={<p>Laden...</p>}>
      <LoginContent params={params} />
    </Suspense>
  );
};

export default Login;
