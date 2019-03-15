import React from 'react'
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import withRouter from "react-router/es/withRouter";
import {reduxForm} from "redux-form";
import {getPrettyString} from "../../prettyString";

class ReservationComplete extends React.Component {

    state = {modalOpen: true};

    handleOpen = () => this.setState({modalOpen: true});

    handleClose = () => this.setState({modalOpen: false});

    render() {
        return (
            <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}
                basic
                size='small'
            >
                {console.log(this.props._reduxForm.values)}
                <Header icon='calendar' content='Reservation Complete'/>
                <Modal.Content>
                    {/*TODO: Display station name*/}
                    <h3>
                        {`You're all booked for your trip on
                        ${getPrettyString(this.props._reduxForm.values.startDate)} at
                        ${this.props._reduxForm.values.startTime} starting from
                        ${getPrettyString(this.props._reduxForm.values.station)}`}
                    </h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => this.props.history.push("/mytrips")} inverted>
                        <Icon name='checkmark'/> View my trips
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

};

export default withRouter(reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false
})(ReservationComplete))