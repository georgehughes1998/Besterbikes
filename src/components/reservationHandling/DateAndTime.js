import React from 'react'
import {reduxForm} from 'redux-form'
import validate from './validate'
import {Button, Container, Form, Header, Icon, Progress, Segment} from "semantic-ui-react";
import ReservationHandlingForm from "./ReservationHandlingForm";


const DateAndTime = (props) => {

    return (
        <div>
            <ReservationHandlingForm
                header={{
                    title: "Date and Time",
                    description: "Choose your start date and time",
                    progress: 50,
                    icon: "calendar"
                }}

                fields={{
                    startDate: {
                        name: 'startDate',
                        label: 'Start Date',
                        type: 'date',
                    },
                    startTime: {
                        name: 'startTime',
                        label: 'Start Time',
                        type: 'time',
                    }

                }}

                operations={{
                    back:{
                        link: props.previousPage,
                        type: 'button',
                        className: 'previous',
                        color: 'red',
                        text: 'Back'
                    },
                    next: {
                        link: props.onSubmit,
                        type: 'submit',
                        className: 'next',
                        color: 'green',
                        text: 'Next'
                    }
                }}
            />
        </div>
    )
};

export default reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false,
    validate
})(DateAndTime)