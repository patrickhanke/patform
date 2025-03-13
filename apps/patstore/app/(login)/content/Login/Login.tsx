'use client';

import { useCallback, useEffect, useState } from 'react';
import './styles.scss';
import LoginForm from './components/LoginForm';
import { usePathname } from 'next/navigation';
import { axiosclient } from '@repo/provider';
import DisplayProject from './components/DisplayProject';
import { LoadingIndicator } from '@repo/ui';

const Login = () => {
	const path = usePathname();
	const [project, setProject] = useState();
	const [loading, setLoading] = useState(false);

	const getProject = useCallback(async () => {
		if (path !== '/login' ) {
			setLoading(true);
			await axiosclient().post('functions/get-project-from-path', {path})
			.then(response => {
				console.log(response);
				setProject(response.data.result);
				setLoading(false);
			})
			.catch(error =>{ 
				console.error(error.message)
				setLoading(false);
			});
			setLoading(false);
		}
	}, [path])

	console.log(loading);
	

	useEffect(() => {
		getProject();
	}, [path])

	if (loading) {
		return <LoadingIndicator />
	}
	
	return (
		<>
			<DisplayProject project={project} />
			<LoginForm />
		</>
	);
};

export default Login;