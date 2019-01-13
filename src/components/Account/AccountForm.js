import React from 'react'
import {Field, reduxForm} from "redux-form";
import { Link } from "react-router-dom";

import {signIn, signUp} from "../Firebase/authentication";

//Class to render a form based on props
class AccountForm extends React.Component{

    //Calls firebase to handle account correctly using form values
    onSubmit = (formValues) => {
            if (this.props.button.text == 'Sign In'){
                signIn(formValues)
            }else if (this.props.link.text == 'Sign Up'){
                signUp(formValues)
            }
    };

    // Renders JSX elements for fields in redux form
    renderInput = ({input, label}) => {
        return(
            <div className="field">
                <label>{label}</label>
                <input {...input}/>
            </div>
        )
    };

    //Renders Redux Form Fields for all props
    renderFields = Object.values(this.props.fields).map((key, index) => {
        return(
            <Field
                key = {index}
                name = {key.name}
                component = {this.renderInput}
                label = {key.label}
            />
        )
    });

    //Renders main body of form
    render(){
        return(

            <form className="ui container middle aligned center aligned grid form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <div className="column">
                        <div className="column">

                            {this.renderFields}

                            <button className="ui big primary button container">
                                {this.props.button.text}
                            </button>

                            <br/>
                            <Link to={this.props.button.link} className="blue">
                                {this.props.link.text}
                            </Link>

                        </div>
                </div>
            </form>
        )
    }
};

export default reduxForm({
    form: 'AccountForm'
})(AccountForm);