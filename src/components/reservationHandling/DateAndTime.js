import React from 'react'
import {reduxForm} from 'redux-form'
import validate from './validate'
import ReservationHandlingForm from "./ReservationHandlingForm";
import {getBackwardCurrentDateString, getCurrentTimeString} from "../../firebase/time";


//Component that passes relevant fields to ReservationHandlingForm for a reserving a bike process
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
                    back: {
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
    initialValues: {startDate: getBackwardCurrentDateString(), startTime: getCurrentTimeString()},
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
    validate
})(DateAndTime)