import React from 'react'
import {Field, reduxForm} from 'redux-form'

class SignIn extends React.Component{
    renderInput = ({input, label}) => {

        return(
            <div className="ui container">
                <div className="ui input">
                    <label>{label}</label>
                    <input {...input}/>
                </div>
            </div>
            )
    };

    onSubmit(formValues){
        console.log(formValues)
    }

    render(){
        return(
            <div>

                {/*Besterbikes Logo */}{/*TODO Get new logo and put here, GDRIVE not working on mobile*/}
                <img className="ui centered medium image"
                     alt="Besterbikes Logo"
                     src="https://lh6.googleusercontent.com/jsF13Ay0tZSL5qr7Bcoj1H84O9tePF-U0XsC3Z2mRikOFkE9Bf-lmppDB-V-Kf32etoUP-Aw2vcTXrp2lNqT=w1920-h903"
                />

                {/*Divider Line*/}
                <div className="ui horizontal divider">
                    Log In
                </div>

                {/*Log In Form*/}
                <form className="ui container middle aligned center aligned grid" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                    <div className="column">

                        <Field>
                            name = "email"
                            component = {this.renderInput}
                            label = "Email:"
                        </Field>

                        <Field>
                            name = "password"
                            component = {this.renderInput}
                            label = "Password:"
                        </Field>


                        <br/>

                        <button className="ui big primary button">
                            Log In
                        </button>


                        <button className="ui big button">
                            Sign Up
                        </button>

                    </div>
                </form>
            </div>
        )
    }
}

export default reduxForm({
    form: 'signIn'
})(SignIn);