import React from 'react'
import { reduxForm } from 'redux-form'
import validate from './validate'
import {Button, Form, Progress, Segment, Dropdown, Icon, Header, Container} from "semantic-ui-react";

const Payment = (props) => {
    const { handleSubmit, pristine, previousPage, submitting } = props;

    return (
        <Segment attached='top'>

            <Progress percent="90" attached="top" indicating/>
            <Form onSubmit={handleSubmit}>

                <Header as='h2'>
                    <Icon name='payment' />
                    <Header.Content>
                        Payment
                        <Header.Subheader>Select your payment method and pay for you trip</Header.Subheader>
                    </Header.Content>
                </Header>

                <Form.Field>
                    <label>Card Number</label>
                    <input type='text'/>
                </Form.Field>
                <Form.Field>
                    <label>Expiration Date</label>
                    <input type='date'/>
                </Form.Field>
                <Form.Field>
                    <label>CVV</label>
                    <input type='date'/>
                </Form.Field>
                <Form.Field>
                    <label>Country</label>
                    <Dropdown
                        search
                        fluid
                        selection
                        multiple
                    />
                </Form.Field>
                <Container textAlign='center'>
                    <Button type="button" className="previous" onClick={previousPage} color="red">Go Back</Button>
                    <Button type="submit" color="green">Submit</Button>
                </Container>
            </Form>
        </Segment>
    )
}
export default reduxForm({
    form: 'reservebike', //Form name is same
    destroyOnUnmount: false,
    validate
})(Payment)