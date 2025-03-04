import React, { FC } from 'react'
import styles from '../ProjectContext.module.scss'
import Image from 'next/image';

import lettering from  '../images/patstore_lettering.png';
import logo from  '../images/patstore_logo.png';
import { ProjectInitializerProps } from '../types';
import {LoadingIndicator} from '@repo/ui';

const ProjectInitializer: FC<ProjectInitializerProps> = ({loading, error, project}) => {
    if (!loading && project) {
        return null
    }
    
    return (
        <div className={styles.project_initializer_container}>
            <Image
                src={logo}
                // width={135}
                style={{borderRadius: '0px'}}
                width={120}
                alt="Hausmeister App"
            />
            <Image
                src={lettering}
                // width={135}
                style={{borderRadius: '0px'}}
                width={120}
                alt="Hausmeister App"
            />
            <h3>

                {loading && <LoadingIndicator />}
                {error && 'Fehler beim Laden des Projekts, bitte wenden Sie sich an den Administrator'}
                {!loading && !project && 'Fehler beim Laden des Projekts, bitte wenden Sie sich an den Administrator'}
            </h3>
        </div>
    )
}

export default ProjectInitializer