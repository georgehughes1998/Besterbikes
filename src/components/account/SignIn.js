import React from 'react'
import {Link} from "react-router-dom";

import AccountForm from "./AccountHandlingForm";
import AccountPageContainer from "./AccountPageContainer";
import {reduxForm} from "redux-form";


//Component that passes relevant fields to AccountPageContainer for a signin
const SignIn = ({error}) => {

        return(
            <AccountPageContainer>
                {/*Use procedure to show image from: https://support.awesome-table.com/hc/en-us/articles/115002196665-Display-images-from-Google-Drive*/}
                <img className="ui centered medium image"
                     src="https://drive.google.com/thumbnail?id=1DWfv569MmvtLipSX_vFQVihtJcbbmiTx"
                     alt="Besterbikes Logo"
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

                    errors = {error}

                    operation={{
                        text: "Sign In",
                        link: "/"
                    }}

                />

                <Link to="/signup" className="ui center aligned grid">
                    <div className="column">
                        Don't have an account, Sign Up
                    </div>
                </Link>

            </AccountPageContainer>
        )
};

export default reduxForm({
    form: 'AccountHandlingForm',
})(SignIn);