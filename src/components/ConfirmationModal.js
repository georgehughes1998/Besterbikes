import React from 'react'
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import withRouter from "react-router/es/withRouter";

class confirmationModal extends React.Component {

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
                <Header icon={this.props.icon} content={this.props.header}/>
                <Modal.Content>
                    <h3>
                        {this.props.text}
                    </h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => this.props.history.push(this.props.link)} inverted>
                        <Icon name='checkmark'/> {this.props.linkText}
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

};

export default withRouter(confirmationModal)