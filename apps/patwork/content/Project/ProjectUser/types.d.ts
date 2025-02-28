import { Project } from ".@repo/types";

export type ProjectUser = {
    objectId: string;
    email: string;
    portrait: string;
    username: string;
    project: Project;

}