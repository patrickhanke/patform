import { ApplicationTypes } from '.';

export type UserRoleTypes = 'worker' | 'office' | 'admin'

export type UserRole = {
    objectId: string,
    name: strting,
    type: UserRoleTypes,
    color: 'primary' | 'secondary' | 'info' | 'warning'
    users: {
        results: Pick<User, 'objectId', 'username'>[]
    },
    roles: {
        results: UserRole[]
    }
}

export type User = {
    objectId: string,
    email: string,
    username: string,
    first_name: string,
    family_name: string,
    is_superuser: boolean,
    type: string,
    role: UserRole,
    is_worker: boolean,
    portrait: ApplicationTypes.Image
}

export type UserDisplayData = Pick<User, 'objectId' | 'family_name'|'first_name'|'email'|'portrait'>;

export type CreateUser =  Pick<User, 'family_name'|'first_name'|'email'|'portrait'> & {password: string, repeat_password: string, role: string}