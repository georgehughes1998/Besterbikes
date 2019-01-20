import React from 'react'
import {reduxForm} from 'redux-form'
import validate from './validate'
import ReservationHandlingForm from "./ReservationHandlingForm";


//TODO: Implment confirmation after order
const ReviewOrder = (props) => {

    return (
        <div>
            <ReservationHandlingForm
                fields={{
                    station: {
                        name: 'station',
                        label: 'Station',
                        type: 'readOnly',
                    },
                    mountainBikes: {
                        name: 'mountainBikes',
                        label: 'Mountain Bikes',
                        type: 'readOnly',
                    },
                    regularBikes: {
                        name: 'regularBikes',
                        label: 'Regular Bikes',
                        type: 'readOnly',
                    },
                    startDate: {
                        name: 'startDate',
                        label: 'Start Date',
                        type: 'readOnly',
                    },
                    startTime: {
                        name: 'startTime',
                        label: 'Start Time',
                        type: 'readOnly',
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
})(ReviewOrder)