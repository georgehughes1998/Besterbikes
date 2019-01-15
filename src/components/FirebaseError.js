import React from 'react'


//Component to display Firebase error
const FirebaseError = (error) =>  {
    return(
        //Render firebase errors
        <div className="ui error message">
            <div className="header">
                <strong>{error.error}</strong>
            </div>
        </div>
    )
};

export default FirebaseError;