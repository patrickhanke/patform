import React, { useContext } from 'react'
import find_users from './constants/find_users'
import { useQuery } from '@apollo/client'
import { Form, Page } from '@repo/ui'
import { AppContext } from '../../../provider'

const ProjectUsers = ({params}: {params: {project_id: string}}) => {
    const {getCurrentProject} = useContext(AppContext);

    const {data, loading, error} = useQuery(find_users, {variables: {project: params.project_id}})
    if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;

	const users = data?.objects.find_User.results;
    
	return (
		<Page 
			title={`${getCurrentProject(params.project_id)?.name} - Nutzer`}
			emptyContent={true}
		>
			<Form 
				fields={settings_fields}
				data={users}
				formSubmitHandler={(values) => {
					updateData({
						className: 'Project',
						objectId: project.objectId,
						updateObject: {
							name: values.name
						}
					});
				}}
				useWithDebounce
			/>
		</Page>
  )
}

export default ProjectUsers