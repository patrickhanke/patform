import React, { FC } from 'react';
import { ImageUploader, Select, TextInput, ColorPicker } from '@repo/ui';
import { EditStaffDataProps, RoleSelect } from '../types';
import { UserRole } from '@repo/types';

const EditStaffData: FC<EditStaffDataProps> = ({
    staffMember = [],
    setStaffMember,
    errors,
    roles,
}) => {
    return (
        <form>
            <TextInput
                label="Vorname"
                id={'first_name'}
                onChange={value =>
                    setStaffMember(draft => {
                        draft.first_name = value;
                    })
                }
                errors={errors}
            />
            <TextInput
                label="Nachname"
                id={'family_name'}
                onChange={value =>
                    setStaffMember(draft => {
                        draft.family_name = value;
                    })
                }
                errors={errors}
            />
            <TextInput
                label="E-Mail"
                id={'email'}
                type="email"
                onChange={value =>
                    setStaffMember(draft => {
                        draft.email = value;
                    })
                }
                errors={errors}
            />
            <Select
                label="Rolle auswählen"
                id="role"
                errors={errors}
                options={roles.map((role: UserRole) => ({
                    value: role.objectId,
                    id: role.objectId,
                    label: role.name,
                }))}
                value={roles
                    .map((role: UserRole) => ({
                        value: role.objectId,
                        id: role.objectId,
                        label: role.name,
                    }))
                    .find(
                        (roleToFind: RoleSelect) =>
                            roleToFind.id === staffMember.role
                    )}
                onChange={value =>
                    setStaffMember(draft => {
                        draft.role = value.value;
                    })
                }
            />
            <TextInput
                label="Passwort"
                type="password"
                id={'password'}
                onChange={value =>
                    setStaffMember(draft => {
                        draft.password = value;
                    })
                }
                errors={errors}
            />
            <TextInput
                label="Passwort wiederholen"
                type="password"
                id={'repeat_password'}
                onChange={value =>
                    setStaffMember(draft => {
                        draft.repeat_password = value;
                    })
                }
                errors={errors}
            />
        </form>
    );
};

export default EditStaffData;
