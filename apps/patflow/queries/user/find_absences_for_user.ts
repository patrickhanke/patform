import { gql } from '@apollo/client';

const find_vacations_for_user = gql`
    query findAbsencesForUser ($id: _UserPointer!, $year: Float!) {
        objects {
            findAbsence (where: {user: {_eq: $id}, _and:{ year: {_eq: $year}}}, order: start_date_DESC) {
                results {
                    objectId
                    start_date
                    end_date
                    state
                    comment 
                    type
                    year
                    user {
                        objectId
                        username
                        first_name
                        family_name  
                        email
                        portrait 
                    }
                    created_by {
                        objectId
                        username
                        first_name
                        family_name  
                        email
                        portrait 
                    }
                }
            }
        }
    }
`;

export default find_vacations_for_user;