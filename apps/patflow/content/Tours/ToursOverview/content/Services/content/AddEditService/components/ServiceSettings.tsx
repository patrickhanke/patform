import { Divider, ElementSelectInterface } from '@repo/ui';
import React, { FC, useCallback, useMemo } from 'react';
import { ServiceSettingsProps } from '../types';
import { cloneDeep } from 'lodash-es';

const ServiceSettings: FC<ServiceSettingsProps> = ({
    service,
    onChange,
    showDeleteButton,
    setDelete,
}) => {
    const interfaceElement: FC<{ title: string; text: string }> = useCallback(
        ({ title, text }) => (
            <div className="flex col a-fs j-sp">
                <h3>{title}</h3>
                <p>{text}</p>
            </div>
        ),
        [service]
    );

    const elements = useMemo(
        () => [
            {
                value: 'continue',
                label: 'Fortsetzen',
                selected: service.settings.continue,
                element: interfaceElement({
                    title: 'Fortsetzen',
                    text: 'Die Leistung nach dem Ende des Jahre fortsetzen',
                }),
                disabled: service.type === 'dates',
            },
            {
                value: 'repeat',
                label: 'Wiederholen',
                selected: service.settings.repeat,
                element: interfaceElement({
                    title: 'Wiederholen',
                    text: 'Die Leistung im nächsten Jahr wiederholen',
                }),
                disabled: service.type === 'interval',
            },
        ],
        [service]
    );

    console.log({ showDeleteButton });

    return (
        <div>
            <ElementSelectInterface
                title="Einstellungen"
                elements={elements}
                selectedElements={elements}
                onSelect={elements => {
                    console.log(elements);
                    const serviceCopy = cloneDeep(service);
                    serviceCopy.settings = {
                        continue: elements.find(el => el.value === 'continue')
                            ?.selected,
                        repeat: elements.find(el => el.value === 'repeat')
                            ?.selected,
                    };
                    onChange(serviceCopy);
                }}
                max={10}
                selectProperty={true}
            />
            {showDeleteButton && (
                <>
                    <Divider showLine={false} />
                    <button
                        className="full_button red md"
                        onClick={() => setDelete(true)}
                    >
                        Leistung löschen
                    </button>
                </>
            )}
        </div>
    );
};

export default ServiceSettings;
