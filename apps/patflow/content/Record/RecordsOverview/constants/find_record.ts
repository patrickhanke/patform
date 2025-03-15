import { gql } from '@apollo/client';

const find_record = gql`
    query findRecord($params: RecordConstraints) {
        objects {
            findRecord(where: $params) {
                results {
                    user {
                        objectId
                        first_name
                        family_name
                    }
                    objectId
                    createdAt
                    year
                    dates
                    default_times
                }
            }
        }
    }
`;

export default find_record;
