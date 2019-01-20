import React from 'react'

import PageContainer from "../PageContainer";
import Steps from "./Steps";
import ReservationHandlingFormWizard from "./ReservationHandlingFormWizard";
import {Segment} from "semantic-ui-react";


const ReserveBikeContainer = () => {
    {/*TODO: Review content of steps and mark as complete storing state in redux*/}
    return (
        <PageContainer>

            <Segment attached='top'>
                <ReservationHandlingFormWizard/>

                <Steps
                    steps={{
                        Bikes: {
                            title: 'Select Bikes',
                            content: 'Choose your start station and number of bikes',
                            icon: 'bicycle',
                        },
                        DateAndTime: {
                            title: 'Date and Time',
                            content: 'Choose your start date and time',
                            icon: 'calendar',
                        },
                        ReviewOrder: {
                            title: 'Review Order',
                            content: 'Review your order before payin',
                            icon: 'check',
                        },
                        Payment: {
                            title: 'Payment',
                            content: 'Select your payment method and pay for you trip',
                            icon: 'payment',
                        }
                    }}
                />
            </Segment>

        </PageContainer>
    )
};

export default ReserveBikeContainer