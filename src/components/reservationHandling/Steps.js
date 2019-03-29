import React from 'react'
import {withRouter} from 'react-router-dom'
import {Icon, Step} from "semantic-ui-react";
import {formValueSelector, reduxForm} from "redux-form";
import connect from "react-redux/es/connect/connect";


//Display semantic UI steps at bottom of form that are marked complete when relevant fields from form has values
let Steps = (props) => {

    const handleClick = (link) => props.history.push(link);


    const isComplete = (key) => {
        //console.log(props);
        switch (key.title) {
            case "Select Bikes":
                return props.fields.station && props.fields.roadBikes && props.fields.mountainBikes;
            case "Date and Time":
                return props.fields.startTime && props.fields.startDate;
            case "Review Order":
                return props.fields.station && props.fields.roadBikes && props.fields.mountainBikes && props.fields.startTime && props.fields.startDate;
            case "Payment":
                return props.fields.cardNumber && props.fields.CVV && props.fields.country && props.fields.expirationDate;
            default:
                return;
        }
    };


    const renderSteps = (Object.values(props.steps).map((key, index) => {
        return (
            <Step
                key={index}
                link
                onClick={() => handleClick(key.link)}
                completed={isComplete(key)}
            >
                <Icon name={key.icon}/>
                <Step.Content>
                    <Step.Title>{key.title}</Step.Title>
                    <Step.Content>{key.content}</Step.Content>
                </Step.Content>
            </Step>
        )
    }));

    return (
        <Step.Group
            fluid
            widths={4}
            size="small"
            attached='bottom'
        >
            {renderSteps}
        </Step.Group>
    )
};

// Decorate with redux-form
Steps = reduxForm({
    form: 'reservebike' // a unique identifier for this form
})(Steps);

// Decorate with connect to read form values
const selector = formValueSelector('reservebike');// <-- same as form name
Steps = connect(state => {
    // can select values individually
    const fields = selector(state,
        'station',
        'mountainBikes',
        'roadBikes',
        'startDate',
        'startTime',
        'cardNumber',
        'CVV',
        'expirationDate',
        'country',
    );
    //TODO: Add conformiation

    return {
        fields
    }
})(Steps);

export default withRouter(Steps)