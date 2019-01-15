import React from 'react'
import {Field, reduxForm} from "redux-form";

import {signIn, signUp, signOut} from "../../firebase/authentication";
import { SubmissionError } from "redux-form";
import FirebaseError from '../FirebaseError'
import {withRouter} from "react-router-dom";


//Class to render a form related to firebase authentication and handle the submission
class AccountHandlingForm extends React.Component{

    //Navigates or throws an error after a user has attempted to sign into firebase
    onAttemptedSignIn = (obj) => {
            if(obj.user){
                this.props.history.push("/")
            }else {
                throw new SubmissionError({
                    _error: obj.message
                });
            }
        };

    //Calls firebase to handle account correctly depending on what account process is being carried out
    onSubmit = async (formValues) => {

        //Uses operation prop to determine which firebase process to follow
        //Await keyword ensures that firebase has time to carry out operation and return a user object or error
        switch(this.props.operation.text){
                case "Sign In":
                    if(formValues.email && formValues.password) {
                        const obj = await signIn(formValues);
                        this.onAttemptedSignIn(obj)
                    }
                    return;

                case "Sign Up":
                    if(formValues.email && formValues.password) {
                        const obj = await signUp(formValues);
                        this.onAttemptedSignIn(obj)
                    }
                    return;

                case "Sign Out":
                    this.props.history.push("/signin");
                    await signOut();
                    return;

                default:
                    return null;
            }

    };

    //Renders Error for individual fields if they're invalid using semantic UI and redux forms
    renderReduxError = ({error, touched}) => {
        if (touched && error){
            return(
                <div className="ui error message">
                    <div className="header">{error}</div>
                </div>
            )
        }
    };

    //Renders JSX elements for each field in the redux form if they exist
    renderInput = ({input, label, type, meta}) => {

        const classname = `field ${meta.error && meta.touched ? 'error' : ''}`;

        return(
            <div className={classname}>
                <label>{label}</label>
                <input {...input} placeholder={label} type={type}/>
                {this.renderReduxError(meta)}
            </div>
        )
    };

    //Renders Redux Form Fields for all the props passed in from the parent component
    renderFields = Object.values(this.props.fields).map((key, index) => {
        return(
            <Field
                key = {index}
                name = {key.name}
                component = {this.renderInput}
                label = {key.label}
                type = {key.type}
            />
        )
    });

    //Renders main body of an account handling form
    render(){
        return(

            <form className="ui container middle aligned center aligned grid form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="column">

                    {this.renderFields}

                    {/*Firebase error displayed if an erro is returned after submission of form*/}
                    {this.props.error?<FirebaseError error={this.props.error}/>:null}

                    <br/>
                        <button className="ui big primary button">
                            {this.props.operation.text}
                        </button>
                    <br/>

                </div>
            </form>
        )
    }
}

//Validates inputs using redux forms
const validate = (formValues) => {

    // TODO: Fix validation and Use functions in Props object to validate
    const errors = {};

        if(!formValues.email){
            errors.email = "You must enter a valid Email address"
        }if(!formValues.password){
            errors.password = "You must enter a valid Password"
        }if(!formValues.forename){
        errors.forename = "You must enter a valid Forename"
        }if(!formValues.surname){
            errors.surname = "You must enter a valid Surname"
        }if(!formValues.dateOfBirth){
            errors.dateOfBirth = "You must enter a valid Date Of Birth"
        }



    return errors;

    };

export default withRouter(reduxForm({
    form: 'AccountHandlingForm',
    validate
})(AccountHandlingForm));