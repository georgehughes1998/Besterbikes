import React from 'react'
import AccountForm from "./AccountForm";

const SignIn = () => {

        return(
            <div>
                {/*Besterbikes Logo */}
                {/*TODO Get new logo and put here, GDRIVE not working on mobile*/}
                <img className="ui centered medium image"
                     alt="Besterbikes Logo"
                     src="https://lh6.googleusercontent.com/jsF13Ay0tZSL5qr7Bcoj1H84O9tePF-U0XsC3Z2mRikOFkE9Bf-lmppDB-V-Kf32etoUP-Aw2vcTXrp2lNqT=w1920-h903"
                />

                {/*Divider Line*/}
                <div className="ui horizontal divider">
                    Sign In
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

            </div>
        )
}

//TODO: Add validation for SignIn

export default SignIn