import React from 'react'
import {Link} from "react-router-dom";

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "./AccountPageContainer";


class SignIn extends React.Component {

    render(){
        return(
            <AccountPageContainer>
                {/*TODO: Gdrive image not working on mobile, throws 403*/}
                <img className="ui centered medium image"
                     alt="Besterbikes Logo"
                     src="https://lh6.googleusercontent.com/jsF13Ay0tZSL5qr7Bcoj1H84O9tePF-U0XsC3Z2mRikOFkE9Bf-lmppDB-V-Kf32etoUP-Aw2vcTXrp2lNqT=w1920-h903"
                />

                <div className="ui horizontal divider">Sign In</div>

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

                    operation={{
                        text: "Sign In",
                        link: "/"
                    }}

                />

                <Link to="/Signup" className="ui center aligned grid">
                    <div className="column">
                        Don't have an account, Sign Up
                    </div>
                </Link>

            </AccountPageContainer>
        )
    }
}

export default SignIn