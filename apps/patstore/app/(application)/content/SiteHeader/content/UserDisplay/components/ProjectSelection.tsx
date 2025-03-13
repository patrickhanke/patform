import { generateGraphQLQuery, ProjectContext } from '@repo/provider';
import React, { FC, useCallback, useContext, useState } from 'react'
import { useQuery } from '@apollo/client';
import { ProjectSelectionProps } from '../types';
import { ElementSelectInterface, SelectElement, SlideIn } from '@repo/ui';
import { PatstoreProject } from '@repo/types';

const ProjectSelection: FC<ProjectSelectionProps> = ({projects, selectProject, setSelectProject}) => {
    const {project, loadProject} = useContext(ProjectContext);
    const [selectedProject, setSelectedProject] = useState<SelectElement[]>([{value: project.objectId, label: project.name}]);
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
    const projectSelectHandler = useCallback(() => {
        if (selectedProject && selectedProject[0] && selectedProject[0].value !== project.objectId) {
            loadProject(selectedProject[0].value)
        }
        setSelectProject(false)
    }, [selectedProject, project])

    const disabled = useCallback(() => {
        if (!selectedProject || !selectedProject[0]) {
            return true
        }
        if (selectedProject[0].value === project.objectId) {
            return true
        }
        return false
    }, [selectedProject, project]) 

console.log(selectedProject);


    return (
        <SlideIn
            header='Projektauswahle'
            isOpen={selectProject}
            cancel={() => setSelectProject(false)}
            confirm={() => projectSelectHandler()}
            preventClickOutside
            disabled={[false, disabled()]}
            errors={[]}
        >
            <label>
                {projects.length > 1 ? 'Projekte' : 'Projekt'}
            </label>
            <ElementSelectInterface 
                elements={data?.objects.findProject.results.map((project: PatstoreProject) => ({
                    value: project.objectId,
                    label: project.name
                } as const))}
                onSelect={(value) => setSelectedProject(value)}
                selectedElements={selectedProject}
                max={1}
            />
        </SlideIn>
    )
}

export default ProjectSelection