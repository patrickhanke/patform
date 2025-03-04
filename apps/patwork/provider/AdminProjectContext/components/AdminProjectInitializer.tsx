import React, { FC } from 'react'
import styles from '../AdminProjectContext.module.scss'
import Image from 'next/image';

import logo from  '../images/patwork_logo.png';
import { AdminProjectInitializerProps } from '../types';


const AdminProjectInitializer: FC<AdminProjectInitializerProps> = ({loading, error, project}) => {


    return (
        <div className={styles.project_initializer_container}>
            <div>
                <Image
                    src={logo}
                    // width={135}
                    style={{borderRadius: '0px'}}
                    height={120}
                    alt="Hausmeister App"
                />
                <h3>
                    {loading ?? 'Projekt wird geladen...'}
                    {error && 'Fehler beim Laden des Projekts, bitte wenden Sie sich an den Administrator'}
                    {!loading && !project && 'Fehler beim Laden des Projekts, bitte wenden Sie sich an den Administrator'}
                </h3>
            </div>
        </div>
    )
}

export default AdminProjectInitializer