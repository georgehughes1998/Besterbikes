import React from 'react'
import {Link} from "react-router-dom";
import {reduxForm} from "redux-form";
import {Container, Divider, Image} from 'semantic-ui-react'

import AccountForm from "./AccountHandlingForm";
import PageContainer from "../PageContainer";


//Component that passes relevant fields to PageContainer for a signin
const SignIn = ({error}) => {

    return (
        <PageContainer>

            {/*Use procedure to show image from: https://support.awesome-table.com/hc/en-us/articles/115002196665-Display-images-from-Google-Drive*/}

            <Image
                src={"https://drive.google.com/thumbnail?id=1DWfv569MmvtLipSX_vFQVihtJcbbmiTx"}
                size='small'
                alt="Besterbikes Logo"
                centered
            />

            <Divider horizontal>Sign In</Divider>

            {/*Sign In Form*/}
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
                    }
                }}

                errors={error}

                operation={{
                    text: "Sign In",
                    link: "/"
                }}

            />


            <Container textAlign='center'>
                <Link to="/signup">
                    Don't have an account, Sign Up
                </Link>
            </Container>


        </PageContainer>
    )
};

export default reduxForm({
    form: 'AccountHandlingForm',
})(SignIn);