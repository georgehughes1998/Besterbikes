import React from "react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import {Container} from "semantic-ui-react";

class CustomLoader extends React.Component {
    render() {
        return (
            <Modal
                open={true}
                basic
                size='small'
            >

                <Container textAlign='center'>
                    {/*<Dimmer active>*/}
                    <Icon.Group size='huge'>
                        <Icon loading size='big' name='circle notch'/>
                        <Icon name={this.props.icon}/>
                    </Icon.Group>

                    <Header as={"h1"} inverted>{this.props.text} </Header>
                    {/*</Dimmer>*/}
                </Container>
            </Modal>
        )
    }
}

export default CustomLoader;
