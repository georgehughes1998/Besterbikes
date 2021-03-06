import React from 'react'
import {reduxForm} from 'redux-form'
import validate from './validate'
import ReservationHandlingForm from "./ReservationHandlingForm";


//Component that passes relevant fields to ReservationHandlingForm for a reserving a bike process
const Payment = (props) => {

    return (
        <div>
            <ReservationHandlingForm
                header={{
                    title: "Payment",
                    description: "Select your payment method and pay for you trip",
                    progress: 90,
                    icon: "payment"
                }}

                fields={{
                    paymentMethod: {
                        name: 'paymentMethod',
                        label:
                            'Standard fare is charged at the start of the trip and subsequently every 30 minutes that a bike is away from a station.\n' +
                            'A trip cannot exceed 24 hours - a bike must be returned to any BesterBikes station within 24 hours otherwise the bike is considered lost and a fine of £20 is charged.' +
                            'Tick this box to use your prevalidated payment method.' +
                            '\n',
                        type: 'checkbox',
                    },
                    // cardNumber: {
                    //     name: 'cardNumber',
                    //     label: 'Card Number',
                    //     type: 'number',
                    // },
                    // expirationDate: {
                    //     name: 'expirationDate',
                    //     label: 'Expiration Date',
                    //     type: 'date',
                    // },
                    // CVV: {
                    //     name: 'CVV',
                    //     label: 'CVV',
                    //     type: 'number',
                    // }
                    // country: {
                    //     name: 'country',
                    //     label: 'Country',
                    //     type: 'dropdown',
                    // },
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
                    },

                }}
            />

        </div>
    )
};
export default reduxForm({
    form: 'reservebike', //Form name is same
    destroyOnUnmount: false,
    validate
})(Payment)