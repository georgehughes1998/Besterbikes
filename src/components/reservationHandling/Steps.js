import React from 'react'
import {withRouter} from 'react-router-dom'
import {Icon, Step} from "semantic-ui-react";
import {reduxForm, formValueSelector } from "redux-form";
import validate from "./validate";
import connect from "react-redux/es/connect/connect";

let Steps = (props) => {

    //Change functionality of clicking steps to work with redux form
    const handleClick = (link) => props.history.push(link);

    //TODO: Implment complete
    const isComplete = (key) => {
        console.log(key);
        switch (key.title) {
            case "Select Bikes":
                return props.selectedBike.station && props.selectedBike.regularBikes && props.selectedBike.mountainBikes;
            case "Date and Time":
                return props.selectedDateAndTime.startTime && props.selectedDateAndTime.startDate;
            case "Review Order":
                return props.selectedBike.station;
            case "Payment":
                return props.paid.cardNumber && props.paid.CVV && props.paid.country && props.paid.expirationDate;


        }
    };


    const renderSteps = (Object.values(props.steps).map((key, index) => {
        return (
            <Step
                key={index}
                link
                onClick={() => handleClick(key.link)}
                completed = {isComplete(key)}
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
const selector = formValueSelector('reservebike') ;// <-- same as form name
Steps = connect(state => {
    // can select values individually
    const selectedBike = selector(state, 'station', 'mountainBikes', 'regularBikes');
    const selectedDateAndTime = selector(state, 'startDate', 'startTime');
    //TODO: Add conformiation
    const paid = selector(state, 'cardNumber', 'CVV', 'expirationDate', 'country');


    return {
        selectedBike,
        selectedDateAndTime,
        paid
    }
})(Steps);

export default withRouter(Steps)