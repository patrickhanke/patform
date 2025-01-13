import { gql } from '@apollo/client';

const get_user_settings  = gql`
    query getUserSettings($id: ID!) {
        objects {
            get_User (objectId: $id) {
                objectId
                username
                settings
            }
        }
    }
`;


export default get_user_settings;