import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {Form, Button, Dropdown, Container, Progress, Segment, Label, Icon, Header} from 'semantic-ui-react'

import validate from './validate'
import Map from "../Map";


const SelectBikes =(props) =>{

        const { handleSubmit } = props;

        return(
            <Segment attached='top'>

                    <Progress percent="20" attached="top" indicating/>

                    {/*Implment search to display stations by Category*/}
                    <Form onSubmit={handleSubmit}>

                        <Header as='h2'>
                            <Icon name='bicycle' />
                            <Header.Content>
                                Select Bikes
                                <Header.Subheader>Choose your start station and number of bikes</Header.Subheader>
                            </Header.Content>
                        </Header>

                        <Map/>

                        <Form.Field>
                            <label>Station</label>
                            {/*TODO: Implment search to display stations by Category*/}
                            <Dropdown
                                search
                                fluid
                                selection
                            />
                        </Form.Field>

                        <Form.Field>
                            <label>Bikes</label>
                            {/*TODO: Implment search to display stations by Category*/}
                            <Dropdown
                                search
                                fluid
                                selection
                                multiple
                            />
                        </Form.Field>

                        <Container textAlign='center'>
                            <Button type="submit" className="next" color="green">Next</Button>
                        </Container>
                    </Form>

                </Segment>
        )

};

export default reduxForm({
    form: 'reservebike',              // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
    validate
})(SelectBikes)