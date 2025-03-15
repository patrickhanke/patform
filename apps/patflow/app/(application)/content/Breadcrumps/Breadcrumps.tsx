'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import styles from './Breadcrumps.module.scss'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import useFindItem from './hooks/useFindItem'

interface PathElement {
    value: string
    label: string
}

const Breadcrumps = () => {
    const [path, setPath] = useState([] as Array<PathElement>)
    const pathname = usePathname()
    const findItemLabel = useFindItem()

    useEffect(() => {
        const windowPath = pathname
        const pathArray = windowPath !== null ? windowPath.split('/') : []

        const pathCopy: Array<PathElement> = [{ value: '/', label: 'App' }]
        pathArray.forEach(pathArrayElement => {
            if (pathArrayElement) {
                pathCopy.push({
                    label: findItemLabel(pathArrayElement, [
                        { value: 'name', label: 'name' },
                    ]),
                    value:
                        pathCopy.length - 1 === 0
                            ? pathCopy[pathCopy.length - 1].value +
                              pathArrayElement
                            : pathCopy[pathCopy.length - 1].value +
                              `/${pathArrayElement}`,
                })
            }
        })

        setPath(pathCopy)
    }, [pathname])

    return (
        <div
            className={styles.header_breadcrumps}
            aria-label="breadcrumb"
        >
            {path.map((pathElement, index): ReactNode => {
                return (
                    <React.Fragment key={pathElement.value}>
                        {index < path.length && index !== 0 && (
                            <span style={{ fontWeight: 600 }}>/</span>
                        )}
                        <Link
                            className={styles.breadcrumps}
                            href={pathElement.value}
                        >
                            {pathElement?.label}
                        </Link>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default Breadcrumps
