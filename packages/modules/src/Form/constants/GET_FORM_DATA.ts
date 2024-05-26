const { gql } =  require( '@apollo/client');

const GET_FORM_DATA = gql`
    query formData {
        objects {
            findForms (where: {type: {_eq: "contact"}}) {
                results {
                    objectId
                    data
                    type
                    createdAt
                }
            }
        }
    }

`;

export default GET_FORM_DATA;