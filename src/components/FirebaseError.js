import React from 'react'
import { Message } from 'semantic-ui-react'


//Component to display Firebase error
const FirebaseError = (error) =>  {
    return(
        //Render firebase errors
        <Message>
            error
            message={error.error}
        </Message>
    )
};

export default FirebaseError;