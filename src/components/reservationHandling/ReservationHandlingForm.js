import React from 'react'
import {Button, Container, Dropdown, Form, Header, Icon, Message, Progress, Segment} from "semantic-ui-react";
import {Field, reduxForm} from "redux-form";
import {makeReservations} from "../../firebase/authentication";
import validate from "./validate";


class ReservationHandlingForm extends React.Component {

    onSubmit = async (formValues) => {

        if(this.props.header.title === "Payment"){
        //TODO: Show complete screen
            const obj = await makeReservations(formValues);
            console.log("obj")
        }else{
            this.props.operations.next.link();
        }

    };

    renderHeader = (header) => {
        return (
            <Header as='h2'>
                <Icon name={header.icon}/>
                <Header.Content>
                    {header.title}
                    <Header.Subheader>{header.description}</Header.Subheader>
                </Header.Content>
            </Header>
        )
    };

    //Renders Error for individual fields if they're invalid using semantic UI and redux forms
    renderReduxError = ({error, touched}) => {

        if (touched && error) {
            return (
                <Message
                    error
                    header={error}
                />
            )
        }
    };

    //Renders JSX elements for each field in the redux form if they exist
    renderInput = ({input, label, type, meta}) => {

        switch (type) {
            case "dropdown":
                return (
                    <Form.Field required>
                        <label>{label}</label>
                            <Dropdown
                                fluid
                                selection
                                search
                                placeholder='Select Country'
                                options={[{ key: 'angular', text: 'Angular', value: 'angular' }]}
                                value={input.value}
                                onChange={(param, data) => input.onChange(data.value)}
                            />
                        {this.renderReduxError(meta)}
                    </Form.Field>
                );

            case "readOnly":
                return (
                    <Form.Field>
                        <label>{label}</label>
                        <input
                            {...input}
                            readOnly
                        />
                    </Form.Field>
                );

            default:
                return (
                    <Form.Field>
                        <label>{label}</label>
                        <input
                            {...input}
                            type={type}
                        />
                        {this.renderReduxError(meta)}
                    </Form.Field>
                );

        }
    };

    //Renders Redux Form Fields for all the props passed in from the parent component
    renderFields = Object.values(this.props.fields).map((key, index) => {
        return (
            <Field
                name={key.name}
                component={this.renderInput}
                key={index}
                label={key.label}
                type={key.type}
            />
        )
    });

    renderButtons = Object.values(this.props.operations).map((key, index) => {
        switch (key.type) {
            case "submit":
                return <Button
                    key={index}
                    type={key.type}
                    className={key.className}
                    color={key.color}
                >
                    {key.text}
                    </Button>;
            case "button":
                return <Button
                    key={index}
                    onClick={key.link}
                    type={key.type}
                    className={key.className}
                    color={key.color}
                >
                    {key.text}
                    </Button>;

            default:
                return;
        }
    });


    render() {
        return (
            <div>
                <Segment attached='top'>

                    <Progress percent={this.props.header.progress} attached="top" indicating/>

                    {/*Implement search to display stations by Category*/}
                    <Form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                        {this.renderHeader(this.props.header)}
                        {this.renderFields}
                        <Container textAlign='center'>
                            {this.renderButtons}
                        </Container>
                    </Form>
                </Segment>
            </div>
        )
    }
}

export default reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false,
    validate
})(ReservationHandlingForm)