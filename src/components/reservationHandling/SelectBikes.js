import React from 'react'
import {reduxForm} from 'redux-form'

import validate from './validate'
import ReservationHandlingForm from "./ReservationHandlingForm";
import {Segment} from "semantic-ui-react";
import BesterbikesMap from "../map/BesterbikesMap";

//TODO: Render values in dropdown
// TODO: Move map into segment and fix diaplsy issues
//Component that passes relevant fields to ReservationHandlingForm for a reserving a bike process
class SelectBikes extends React.Component {


    renderMap = () => {
        return (
            <Segment style={{minHeight: "300px"}}>
                <div>
                    <BesterbikesMap style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        marginRight: "14px",
                        marginLeft: "-14px",
                        marginTop: "-14px",
                        marginBottom: "20px",
                        position: "absolute"
                    }}/>
                </div>
            </Segment>
        )
    };

    render() {
        return (
            <Segment.Group>

                <ReservationHandlingForm
                    header={{
                        title: "Select Bikes",
                        description: "Choose your start station and number of bikes",
                        progress: 20,
                        icon: "bicycle"
                    }}

                    renderMap={() => this.renderMap()}

                    fields={{
                        station: {
                            name: 'station',
                            label: 'Station',
                            type: 'stationDropdown'
                        },
                        mountainBikes: {
                            name: 'mountainBikes',
                            label: 'Mountain Bikes',
                            type: 'bikeDropdown'
                        },
                        roadBikes: {
                            name: 'roadBikes',
                            label: 'Road Bikes',
                            type: 'bikeDropdown'
                        },

                    }}

                    operations={{
                        next: {
                            link: this.props.onSubmit,
                            type: 'submit',
                            className: 'next',
                            color: 'green',
                            text: 'Next'
                        }
                    }}
                />

            </Segment.Group>
        )
    }
}

export default reduxForm({
    form: 'reservebike',              // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
    validate
})(SelectBikes)