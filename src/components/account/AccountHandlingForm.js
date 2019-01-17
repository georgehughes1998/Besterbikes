import React from 'react'
import {Field, reduxForm, SubmissionError} from "redux-form";
import {withRouter} from "react-router-dom";
import { Message, Form, Container, Button } from 'semantic-ui-react'

import {signIn, signUp, signOut} from "../../firebase/authentication";
import FirebaseError from '../FirebaseError'



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
                <Message
                    error
                    header = 'Please review this field'
                    content = {error}
                />
            )
        }
    };

    //Renders JSX elements for each field in the redux form if they exist
    renderInput = ({input, label, type, meta}) => {

        return(
            <Form.Field>
                <label>{label}</label>
                <input
                    {...input}
                    type = {type}
                />
                {this.renderReduxError(meta)}
            </Form.Field>
        )
    };

    //Renders Redux Form Fields for all the props passed in from the parent component
    renderFields = Object.values(this.props.fields).map((key, index) => {
        return(
            <Field
                name = {key.name}
                component = {this.renderInput}
                key = {index}
                label = {key.label}
                type = {key.type}
            />
        )
    });

    //Renders main body of an account handling form
    render(){
        return(

            <Container>
                {/*<form className="ui container middle aligned center aligned grid form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>*/}


                    <Form onSubmit={this.props.handleSubmit(this.onSubmit)} error>

                            {this.renderFields}

                            {/*Firebase error displayed if an error is returned after submission of form*/}
                            {this.props.error?<FirebaseError error={this.props.error}/>:null}

                            <br/>

                            <Container textAlign='center'>
                                <Button size="big" primary >
                                    {this.props.operation.text}
                                </Button>
                            </Container>

                            <br/>

                    </Form>

            </Container>
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