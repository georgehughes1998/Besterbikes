import React from 'react'
import {Link} from "react-router-dom";

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "./AccountPageContainer";

class SignUp extends React.Component {

    render(){
        return(
            <AccountPageContainer>
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

                    operation={{
                        text: "Sign Up",
                        link: "/"
                    }}

                />

                <Link to="/SignIn" className="ui center aligned grid">
                    Already have an account, Sign In
                </Link>

            </AccountPageContainer>
        )
    }

}

export default SignUp
