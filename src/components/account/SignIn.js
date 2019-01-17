import React from 'react'
import {Link} from "react-router-dom";
import {reduxForm} from "redux-form";
import {Divider, Image, Container} from 'semantic-ui-react'

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "../PageContainer";



//Component that passes relevant fields to AccountPageContainer for a signin
const SignIn = ({error}) => {

        return(
            <AccountPageContainer>
                {/*Use procedure to show image from: https://support.awesome-table.com/hc/en-us/articles/115002196665-Display-images-from-Google-Drive*/}
                <Image
                    src={"https://drive.google.com/thumbnail?id=1DWfv569MmvtLipSX_vFQVihtJcbbmiTx"}
                    size='medium'
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

                    errors = {error}

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


            </AccountPageContainer>
        )
};

export default reduxForm({
    form: 'AccountHandlingForm',
})(SignIn);