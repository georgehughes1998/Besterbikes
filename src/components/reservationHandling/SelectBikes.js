import React from 'react'
import {reduxForm} from 'redux-form'

import validate from './validate'
import Map from "../map/Map";
import ReservationHandlingForm from "./ReservationHandlingForm";


const SelectBikes = (props) => {

    return (
        <div>
            <Map/>

            <ReservationHandlingForm
                header={{
                    title: "Select Bikes",
                    description: "Choose your start station and number of bikes",
                    progress: 20,
                    icon: "bicycle"
                }}

                fields={{
                    station: {
                        name: 'station',
                        label: 'Station',
                        type: 'dropdown',
                    },
                    bikes: {
                        name: 'bikes',
                        label: 'Bikes',
                        type: 'dropdown',
                        dropdownParams: "multiple"
                    },

                }}

                operation={{
                    link: props.handleSubmit,
                    type: 'submit',
                    className: 'next',
                    color: 'green',
                    text: 'Next'
                }}
            />

        </div>
    )

};

export default reduxForm({
    form: 'reservebike',              // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
    validate
})(SelectBikes)