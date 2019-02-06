import React from 'react'
import {Field, reduxForm, SubmissionError} from "redux-form";
import {withRouter} from "react-router-dom";
import {Button, Container, Form, Message} from 'semantic-ui-react'

import {setUserDetails, signIn, signOut, signUp} from "../../firebase/authentication";
import FirebaseError from '../FirebaseError'


//Class to render a form related to firebase authentication and handle the submission
class AccountHandlingForm extends React.Component {

    //Navigates or throws an error after a user has attempted to sign into firebase
    onAttemptedSignIn = (obj) => {
        if (obj.user) {
            this.props.history.push("/")
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

    //Calls firebase to handle accountManagement correctly depending on what accountManagement process is being carried out
    onSubmit = async (formValues) => {

        //Uses operation prop to determine which firebase process to follow
        //Await ensures that firebase has time to carry out operation and return a user object or error
        switch (this.props.operation.text) {
            case "Sign In":
                if (formValues.email && formValues.password) {
                    const obj = await signIn(formValues);
                    this.onAttemptedSignIn(obj)
                }
                return;

            case "Sign Up":
                if (formValues.email && formValues.password) {
                    const obj = await signUp(formValues);
                    this.onAttemptedSignIn(obj)
                }
                return;

            case "Sign Out":
                this.props.history.push("/signin");
                await signOut();
                return;

            case "Save Changes":
                this.props.history.push("/");
                await setUserDetails(formValues);
                return;

            default:
                return null;
        }

    };

    //Renders Error for individual fields if they're invalid using semantic UI and redux forms
    renderReduxError = ({error, touched}) => {

        if (touched && error) {
            return (
                <Message
                    error
                    header={error}
                />
            )
        }
    };

    //TODO: Render SignUp with values of user already entered
    //Renders JSX elements for each field in the redux form if they exist
    renderInput = ({input, label, type, meta}) => {

        return (
            <Form.Field required>
                <label>{label}</label>
                <input
                    {...input}
                    type={type}
                />
                {this.renderReduxError(meta)}
            </Form.Field>
        )
    };

    //Renders Redux Form Fields for all the props passed in from the parent component
    renderFields = Object.values(this.props.fields).map((key, index) => {
        return (
            <Field
                name={key.name}
                component={this.renderInput}
                key={index}
                label={key.label}
                type={key.type}
            />
        )
    });

    //Renders main body of an accountManagement handling form
    render() {
        return (

            <Container>
                <Form onSubmit={this.props.handleSubmit(this.onSubmit)} error>

                    {this.renderFields}

                    {/*Firebase error displayed if an error is returned after submission of form*/}
                    {this.props.error ? <FirebaseError error={this.props.error}/> : null}

                    <br/>

                    <Container textAlign='center'>
                        <Button size="big" primary color='red'>
                            {this.props.operation.text}
                        </Button>
                    </Container>

                    <br/>
                </Form>

            </Container>
        )
    }
}

// TODO: Fix validation and Use functions in Props object to validate
//Validates inputs using redux forms
const validate = (formValues) => {

    const errors = {};

    if (!formValues.email) {
        errors.email = "You must enter a valid Email address"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
        errors.email = 'Invalid email address'
    }
    if (!formValues.password) {
        errors.password = "You must enter a valid Password"
    }
    if (!formValues.forename) {
        errors.forename = "You must enter a valid Forename"
    }
    if (!formValues.surname) {
        errors.surname = "You must enter a valid Surname"
    }
    if (!formValues.dateOfBirth) {
        errors.dateOfBirth = "You must enter a valid Date Of Birth"
        // } else if (/([0-2][1-9])|10|20|30|31\/([0][1-9])|10|11|12\/(19[0-9][0-9])|(200[0-9])/.test(formValues.dateOfBirth)) {
        //     errors.dateOfBirth = 'Invalid Date of Birth'
    }

    return errors;

};

export default withRouter(reduxForm({
    form: 'AccountHandlingForm',
    validate
})(AccountHandlingForm));