import { compileAxiosError } from "@repo/provider";
import { DisplayProject, LoginForm } from "../content";
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
      .post("functions/get-project-from-path", { path })
      .then((response) => response.data.result)
      .catch((err) => compileAxiosError(err.message));
    return res;
  }
};

const Login = async ({ params }: { params: { project_path: string } }) => {
  const response = await fetchProject(`/${params.project_path}`);

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
};

export default Login;
