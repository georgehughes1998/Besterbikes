import React from 'react'
import AccountForm from "./AccountForm";
import {Link} from "react-router-dom";

const SignUp = () => {

    return(
        <div>
            <div className="ui horizontal divider">Sign Up</div>

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

                button={{
                    text: "Sign Up",
                    link: "/"
                }}

                link={{
                    text: "Sign In",
                    link: "/signin"
                }}
            />

            <Link to="/SignIn" className="ui center aligned grid">
                Already have an account, Sign In
            </Link>

        </div>
    )
}

//TODO: Add validation for SignIn

export default SignUp