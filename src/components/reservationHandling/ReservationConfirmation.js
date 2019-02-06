import React from 'react'
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";

class ReservationComplete extends React.Component {

    state = {modalOpen: true}

    handleOpen = () => this.setState({modalOpen: true})

    handleClose = () => this.setState({modalOpen: false})


    render() {
        return (
            <Modal

                open={this.state.modalOpen}
                onClose={this.handleClose}
                basic
                size='small'
            >
                <Header icon='browser' content='Cookies policy'/>
                <Modal.Content>
                    <h3>Reservation Complete</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={this.handleClose} inverted>
                        <Icon name='checkmark'/> Got it
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

};

export default ReservationComplete