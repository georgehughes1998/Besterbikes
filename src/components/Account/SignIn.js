import React from 'react'
import AccountForm from "./AccountForm";
import {Link} from "react-router-dom";

const SignIn = () => {

        return(
            <div>
                {/*TODO: Gdrive not working on mobile*/}
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

                    button={{
                        text: "Sign In",
                        link: "/"
                    }}

                    link={{
                        text: "Sign Up",
                        link: "/signup"
                    }}
                />

                <Link to="/Signup" className="ui center aligned grid">
                    <div className="column">
                        Don't have an account, Sign Up
                    </div>
                </Link>

            </div>
        )
}

//TODO: Add validation for SignIn

export default SignIn