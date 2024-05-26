const { gql } =  require( '@apollo/client');

const GET_FORM_DATA = gql`
    query formData($id: ContentPointer!) {
        objects {
            findData (where: {content: {_eq: $id}}) {
                results {
                    objectId
                    createdAt
                    data
                    type
                }
            }
        }
    }

`;

export default GET_FORM_DATA;