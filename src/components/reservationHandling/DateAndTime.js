import React from 'react'
import {reduxForm} from 'redux-form'
import validate from './validate'
import {Button, Container, Form, Header, Icon, Progress, Segment} from "semantic-ui-react";


const DateAndTime = (props) => {

    const {handleSubmit, previousPage} = props;

    return (
        <Segment attached='top'>

            <Progress percent="50" attached="top" indicating/>
            <Form onSubmit={handleSubmit}>
                {/*TODO: Implment search to display stations by Category*/}
                <Header as='h2'>
                    <Icon name='calendar'/>
                    <Header.Content>
                        Date and Time
                        <Header.Subheader>Choose your start date and time</Header.Subheader>
                    </Header.Content>
                </Header>
                <Form.Field>
                    <label>Start Date</label>
                    <input type='date'/>
                </Form.Field>
                <Form.Field>
                    <label>Start Time</label>
                    <input type='time'/>
                </Form.Field>

                <Container textAlign='center'>
                    <Button type="button" className="previous" onClick={previousPage} color="red">Go Back</Button>
                    <Button type="submit" className="next" color="green">Next</Button>
                </Container>
            </Form>
        </Segment>
    )

};

export default reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false,
    validate
})(DateAndTime)