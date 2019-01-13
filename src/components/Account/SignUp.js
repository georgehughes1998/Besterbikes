import React from 'react'
import AccountForm from "./AccountForm";

const SignUp = () => {

    return(
        <div>

            {/*Divider Line*/}
            <div className="ui horizontal divider">
                Sign Up
            </div>

            {/*Log In Form*/}
            <AccountForm
                fields={{
                    Email: {
                        name: 'email',
                        label: 'Email'
                    },
                    Password: {
                        name: 'password',
                        label: 'Password'
                    },
                    Forename: {
                        name: 'forename',
                        label: 'First Name'
                    },
                    Surname:{
                        name: 'surname',
                        label: 'Surname'
                    },
                    DateOfBirth:{
                        name: 'dateOfBirth',
                        label: 'Date of Birth'
                    }
                }}

                button={{
                    text: "Sign Up",
                    link: "/"
                }}

                link={{
                    text: "Sign In",
                    link: "/signIn"
                }}
            />

        </div>
    )
}

//TODO: Add validation for SignIn

export default SignUp