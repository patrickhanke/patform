import { generateGraphQLQuery, ProjectContext } from '@repo/provider';
import React, { FC, useContext } from 'react'
import { useQuery } from '@apollo/client';
import { ProjectSelectionProps } from '../types';
import { ElementSelectInterface } from '@repo/ui';

const ProjectSelection: FC<ProjectSelectionProps> = ({projects}) => {
    
    const {project, loadProject} = useContext(ProjectContext);
    const {data} = useQuery(generateGraphQLQuery({
        type: 'find',
        objectName: 'Project',
        fields: ['name', 'objectId']
    }), {
        variables: {
            params: {
                objectId: {
                    _in: projects
                }
            }
        }
    })
    const projectSelectHandler = (value: any) => {
        if (value[0].value !== project.objectId) {
            loadProject(value[0].value)
        }
    }

    return (
        <div>
            <label>
                {projects.length > 1 ? 'Projekte' : 'Projekt'}
            </label>
            <ElementSelectInterface 
                elements={data?.objects.findProject.results.map((project: any) => ({
                    value: project.objectId,
                    label: project.name
                }))}
                onSelect={(value) => projectSelectHandler(value)}
                selectedElements={[{value: project.objectId, label: project.name}]}
                max={1}
            />
        </div>
    )
}

export default ProjectSelection