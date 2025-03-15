import { gql } from '@apollo/client';

const get_property_settings = gql`
    query getObjectSettings($id: ID!) {
        objects {
            getProperty(objectId: $id) {
                objectId
                name
                settings
            }
        }
    }
`;

export default get_property_settings;
