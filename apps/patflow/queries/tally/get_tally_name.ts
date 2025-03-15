import { gql } from '@apollo/client';

const get_tally_name = gql`
    query GetTallyName($id: ID!) {
        objects {
            getTally(objectId: $id) {
                objectId
                name
            }
        }
    }
`;

export default get_tally_name;
