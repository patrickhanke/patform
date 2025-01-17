import { gql } from '@apollo/client';

const find_all_staff  = gql`
    query findAllWorkers {
        objects {
            find_User (order: family_name_DESC, where: {is_worker: {_eq: true}}) {
                results {
                    objectId
                    first_name
                    family_name
                    is_worker
                    portrait
                    color
                    time_settings
                    role {
                        objectId
                        name
                        type
                    }
                    createdAt
                }
            }
        }
    }
`;

export default find_all_staff;