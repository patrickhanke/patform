'use server';

import { compileAxiosError } from '@repo/provider';
import { DisplayProject, RegisterForm } from '../../content';
import './styles.scss';
import axios from 'axios';

const fetchProject = async (path: string) => {
    if (path !== '/login' ) {
        const axiosclient = axios.create({
            baseURL: process.env.SASHIDO_API_URL,
            headers: {
                'X-Parse-Application-Id': process.env.SASHIDO_APP_ID,
                'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
            },
        }); 

        const res = await axiosclient.post('functions/get-project-from-path', {path})
            .then(response => response.data.result)
            .catch(err => compileAxiosError(err.message));
        return res
    }
}

interface InviteProps {
    searchParams: URLSearchParams;
    params: {
        project_path: string;
    };
}

const Invite: React.FC<InviteProps> = async ({ searchParams, params }) => {
    const response = await fetchProject(`/${params.project_path}`);
    const email = searchParams.get('email');
    const key = searchParams.get('key');
    console.log(email, key);

    if (response.success === false) {
        return (
            <p className='error_message'>
                Dieses Projekt wurde nicht gefunden.
                Falls es sich um eine gültige Linkeinladung handelt, wenden Sie sich bitte an <a href="mailto:info@patwork.net">info@patwork.net</a>
            </p>
        );
    }

    return (
        <>
            <div>
                <DisplayProject project={response.project} />
                <br />
                <p>
                    Sie wurden eingeladen, sich bei dem Projekt {response.project.name || 'patstore'} anzumelden.
                </p>
            </div>
            <div>
                {email && key ? (
                    <RegisterForm email={email} project={response.project} invitationKey={key} />
                ) : (
                    <p className='error_message'>
                        Die Einladung ist ungültig.
                        Falls es sich um eine gültige Linkeinladung handelt, wenden Sie sich bitte an <a href="mailto:info@patwork.net">info@patwork.net</a>.
                    </p>
                )}
            </div>
        </>
    );
};

export default Invite;