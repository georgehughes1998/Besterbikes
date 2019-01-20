import React from 'react'
import {reduxForm} from 'redux-form'

import validate from './validate'
import ReservationHandlingForm from "./ReservationHandlingForm";
import BesterbikesMap from '../map/BesterbikesMap'


// TODO: Move map into segment and fix diaplsy issues
//Component that passes relevant fields to ReservationHandlingForm for a reserving a bike process
const SelectBikes = (props) => {
    return (
        <div>

            <BesterbikesMap/>

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
                        type: 'dropdown'
                    },
                    mountainBikes: {
                        name: 'mountainBikes',
                        label: 'Mountain Bikes',
                        type: 'number'
                    },
                    regularBikes: {
                        name: 'regularBikes',
                        label: 'Regular Bikes',
                        type: 'number'
                    },

                }}

                operations={{
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
    form: 'reservebike',              // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
    validate
})(SelectBikes)