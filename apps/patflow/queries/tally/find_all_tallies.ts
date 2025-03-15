import { gql } from '@apollo/client';

const find_all_tallies = gql`
    query FindAllTallies {
        objects {
            findTally {
                results {
                    objectId
                    name
                    entries
                }
            }
        }
    }
`;

export default find_all_tallies;
