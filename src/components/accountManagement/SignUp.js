import React from 'react'
import {Link} from "react-router-dom";
import {Container, Divider} from 'semantic-ui-react'

import AccountForm from "./AccountHandlingForm";
import PageContainer from "../PageContainer";


//Component that passes relevant fields to PageContainer for a sign Up
const SignUp = () => {

        return(
            <PageContainer>
                <Divider horizontal>Sign Up</Divider>

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
                        text: "Sign Up",
                        link: "/"
                    }}

                />

                <Container textAlign='center'>
                     <Link to="/signin">
                        Already have an account, Sign In
                    </Link>
                </Container>

            </PageContainer>
        )

};

export default SignUp
