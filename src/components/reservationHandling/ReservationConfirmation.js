import React from 'react'
import withRouter from "react-router/es/withRouter";
import {reduxForm} from "redux-form";
import {getPrettyString} from "../../dataHandling/prettyString";
import ConfirmationModal from "../ConfirmationModal";

class ReservationComplete extends React.Component {

    state = {modalOpen: true};

    handleOpen = () => this.setState({modalOpen: true});

    handleClose = () => this.setState({modalOpen: false});

    render() {
        return (
            <ConfirmationModal
                icon='calendar'
                header='Reservation Complete'
                text={`You're all booked for your trip on
                        ${getPrettyString(this.props._reduxForm.values.startDate)} at
                        ${this.props._reduxForm.values.startTime} starting from
                        ${getPrettyString(this.props._reduxForm.values.station)}`}
                link="/mytrips"
                linkText="View my trips"
            />
        )
    }

};

export default withRouter(reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false
})(ReservationComplete))