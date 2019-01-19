import React from 'react'

import PageContainer from "../PageContainer";
import Steps from "./Steps";
import ReservationHandlingFormWizard from "./ReservationHandlingFormWizard";
import {Segment} from "semantic-ui-react";


const ReserveBikeContainer = (props) => {
    {/*TODO: Review content of steps and mark as complete storing state in redux*/
    }
    return (
        <PageContainer>

            <Segment attached='top'>
                <ReservationHandlingFormWizard/>

                <Steps
                    steps={{
                        Bikes: {
                            title: 'Select Bikes',
                            content: 'Choose your station and number of bikes',
                            icon: 'bicycle',
                            link: '/reservebike/bikes',

                        },
                        DateAndTime: {
                            title: 'Date and Time',
                            content: 'Choose your start station and time',
                            icon: 'calendar',
                            link: '/reservebike/dateandtime'
                        },
                        ReviewOrder: {
                            title: 'Review Order',
                            content: 'Review your order',
                            icon: 'check',
                            link: '/reservebike/revieworder'
                        },
                        Payment: {
                            title: 'Payment',
                            content: 'Select your payment method',
                            icon: 'payment',
                            link: '/reservebike/payment'
                        }
                    }}
                />
            </Segment>

        </PageContainer>
    )
};

export default ReserveBikeContainer