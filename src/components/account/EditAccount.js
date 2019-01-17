import React from 'react'
import {Divider} from 'semantic-ui-react'

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "../PageContainer";


//Component that passes relevant fields to AccountPageContainer for editing account details
const EditAccount = () => {

    return(
        <AccountPageContainer>
            <Divider horizontal>Edit Account Details</Divider>

            {/*Sign Up Form*/}
            <AccountForm
                fields={{
                    Email: {
                        name: 'email',
                        label: 'Email',
                        type: 'text'
                    },
                    Password: {
                        name: 'password',
                        label: 'Password',
                        type: 'password'
                    },
                    Forename: {
                        name: 'forename',
                        label: 'First Name',
                        type: 'text'
                    },
                    Surname:{
                        name: 'surname',
                        label: 'Surname',
                        type: 'text'
                    },
                    DateOfBirth:{
                        name: 'dateOfBirth',
                        label: 'Date of Birth',
                        type: 'date'
                    }
                }}

                operation={{
                    text: "Save Changes",
                    link: "/"
                }}

            />

        </AccountPageContainer>
    )

};

export default EditAccount
