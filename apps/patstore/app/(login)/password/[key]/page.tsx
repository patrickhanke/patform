'use server';

import React from 'react';
import axios from 'axios';
import { PasswordForm, DisplayProject } from '../../content';
import { compileAxiosError } from '@repo/provider';

const fetchUserData = async (email: string, key: string) => {
    const axiosclient = axios.create({
        baseURL: process.env.SASHIDO_API_URL,
        headers: {
            'X-Parse-Application-Id': process.env.SASHIDO_APP_ID,
            'X-Parse-REST-API-Key': process.env.SASHIDO_REST_KEY,
        },
    }); 

    const res = await axiosclient.post('functions/get-user-from-password-key', {
        email,
        key,
    })
    .then(response => response.data.result)
    .catch(err => compileAxiosError(err));

    return res;
};

interface PasswordProps {
    searchParams: {
        email: string;
    };
    params: {
        key: string;
    };
}

const Password = async ({ searchParams, params }: PasswordProps) => {
    const { email } = searchParams;
    const { key } = params;

    const response = await fetchUserData(email, key);

    return (
        <>
            <DisplayProject />
            <p>Passwort zurücksetzen</p>
            {response.success === false && response.message ? 
                <>
                    <p>
                        {response.message} <br /> <br />
                        <a href='/link' >Zurück zum Login</a>
                    </p>
                  
                </>
            :
                <PasswordForm email={email} passwordKey={key} userId={response.user.objectId}  />
            }
        </>
    );
};

export default Password;