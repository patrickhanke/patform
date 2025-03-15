import { gql } from '@apollo/client';

const get_tally_entries = gql`
    query GetTallyentries($id: ID!) {
        objects {
            getTally(objectId: $id) {
                objectId
                entries
            }
        }
    }
`;

export default get_tally_entries;
