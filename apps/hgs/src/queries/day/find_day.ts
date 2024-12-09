import { gql } from '@apollo/client';

const find_day  = gql`
    query findDay($params: DayConstraints) {
        objects {
            findDay (where: $params) {
                results {
                    objectId
                    year
                    month
                    date
                    is_working_day
                    time
                    default_time
                    absence {
                        objectId
                        start_date
                        end_date
                        state
                        type
                    }
                    saldo
                    type
                    user {
                        objectId
                    }
                    record {
                        objectId
                    }
                }
            }
        }
    }
`;

export default find_day;