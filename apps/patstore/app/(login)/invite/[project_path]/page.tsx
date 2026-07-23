import { Suspense } from "react";
import { compileAxiosError } from "@repo/provider";
import { DisplayProject, RegisterForm } from "../../content";
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

interface InviteProps {
  searchParams: Promise<{
    email: string;
    key: string;
  }>;
  params: Promise<{
    project_path: string;
  }>;
}

async function InviteContent({ searchParams, params }: InviteProps) {
  const { project_path } = await params;
  const response = await fetchProject(`${project_path}`);
  const { email, key } = await searchParams;

  if (response.success === false) {
    return (
      <p className="error_message">
        Dieses Projekt wurde nicht gefunden. Falls es sich um eine gültige
        Linkeinladung handelt, wenden Sie sich bitte an{" "}
        <a href="mailto:info@patwork.net">info@patwork.net</a>
      </p>
    );
  }

  return (
    <>
      <div>
        <DisplayProject project={response.project} />
        <br />
        <p>
          Sie wurden eingeladen, sich bei dem Projekt{" "}
          {response.project.name || "patstore"} anzumelden.
        </p>
      </div>
      <div>
        {email && key ? (
          <RegisterForm
            email={email}
            project={response.project}
            invitationKey={key}
          />
        ) : (
          <p className="error_message">
            Die Einladung ist ungültig. Falls es sich um eine gültige
            Linkeinladung handelt, wenden Sie sich bitte an{" "}
            <a href="mailto:info@patwork.net">info@patwork.net</a>.
          </p>
        )}
      </div>
    </>
  );
}

const Invite = ({ searchParams, params }: InviteProps) => {
  return (
    <Suspense fallback={<p>Laden...</p>}>
      <InviteContent searchParams={searchParams} params={params} />
    </Suspense>
  );
};

export default Invite;
