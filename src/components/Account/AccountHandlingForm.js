import React from 'react'
import {Field, reduxForm} from "redux-form";

import {signIn, signUp, signOut} from "../../firebase/authentication";


//Class to render a form based on props given from an account component
class AccountHandlingForm extends React.Component{

    //Calls firebase to handle account correctly depending on what account process is being carried out
    onSubmit = (formValues) => {

        //Uses operation prop to determine which firebase process to follow
        switch(this.props.operation.text){
            case "Sign In":
                return signIn(formValues);
            case "Sign Up":
                return signUp(formValues);
            case "Sign Out":
                return signOut();
            default:
                return null;
        }

    };

    //Renders Error if field is invalid using semantic UI and redux forms
    renderError = ({error, touched}) => {
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
                {this.renderError(meta)}
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

    //Renders main body of form
    render(){
        return(

            <form className="ui container middle aligned center aligned grid form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="column">

                    {this.renderFields}

                    <button className="ui big primary button">
                        {this.props.operation.text}
                    </button>

                    <br/>

                </div>
            </form>
        )
    }
};

//Validates inputs using redux forms
const validate = (formValues) => {

    const errors = {};

        if(!formValues.email){
            errors.email = "You must enter a valid email"
        }

        //Attempt to iterate through props and render each ones validation
        // TODO: Fux validation and Use functions in Props object to validate
        // if(this){
        //     Object.values(this.props.fields).map((key, index) => {
        //         if (!formValues.key.name) {
        //             errors.key.name = "You must enter a valid " + key
        //         }
        //     });
        // }

    return errors;

    };

export default reduxForm({
    form: 'AccountHandlingForm',
    validate
})(AccountHandlingForm);