import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import {Form, Progress, Segment, Button, Icon, Header, Container} from "semantic-ui-react";


const ReviewOrder = (props) =>{

    const { handleSubmit, previousPage } = props;

    return(
        <Segment attached='top'>

            <Progress percent="70" attached="top" indicating/>
            <Form onSubmit={handleSubmit}>
                <Header as='h2'>
                    <Icon name='check' />
                    <Header.Content>
                       Review Order
                        <Header.Subheader>Check over your orders details before paying</Header.Subheader>
                    </Header.Content>
                </Header>
                <Container textAlign='center'>
                    <Button type="button" className="previous" onClick={previousPage} color="red">Go Back</Button>
                    <Button type="submit" className="next" color="green">Proceed To Payment</Button>
                </Container>
            </Form>
        </Segment>
    )

};

export default reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false,
    validate
})(ReviewOrder)