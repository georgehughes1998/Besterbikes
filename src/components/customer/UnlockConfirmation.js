import React from 'react'
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import withRouter from "react-router/es/withRouter";
import {reduxForm} from "redux-form";

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
                <Header icon='lock open' content='Bike Unlocked'/>
                <Modal.Content>
                    {/*TODO: Display station name*/}
                    <h3>
                        Enjoy the ride!
                    </h3>
                    <Header.Subheader>
                        {`Your bike ID reference number is ${this.props.activeBikeID}`}
                    </Header.Subheader>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => this.props.history.push("/")} inverted>
                        <Icon name='checkmark'/> Return to main menu
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