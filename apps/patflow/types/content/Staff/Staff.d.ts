export type StaffMember = {
    objectId: string;
    first_name: string;
    family_name: string;
    email: string;
    portrait: ApplicationTypes.Image;
    created_by?: UserTypes.User;
    color: string;
};
