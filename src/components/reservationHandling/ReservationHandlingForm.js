import React from 'react'
import {Button, Container, Form, Header, Icon, Message, Progress, Segment} from "semantic-ui-react";
import {Field, reduxForm, SubmissionError} from "redux-form";
import {makeReservations} from "../../firebase/reservations";
import StationDropdown from "../StationDropdown";
import FirebaseError from "../FirebaseError";
import ReservationComplete from "./ReservationConfirmation";

//TODO: Implement search to display stations by Category*
//Class to render a form related to firestore regarding reserving a bike flow and handle the submission
class ReservationHandlingForm extends React.Component {

    //Calls firebase to submit details from form and manage any errors
    onSubmit = async (formValues) => {
        //TODO: If successful then Show complete screen with order overview
        if (this.props.header.title === "Payment") {
            return makeReservations(formValues)
                .then((obj) => {
                    this.setState({success: "success"})
                })
                .catch((err) => {
                    console.log(err);
                    throw new SubmissionError({
                        _error: err.message
                    })
                })
        } else {
            this.props.operations.next.link();
        }

    };
    //Renders JSX elements for the header of step in the reservation flow
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
                        <StationDropdown input={{input}}/>
                        {this.renderReduxError(meta)}
                    </Form.Field>
                );

            case "readOnly":
                return (
                    //TODO: Display station text not value
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
                    <Form.Field required>
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
    //Renders JSX buttons for form
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
                    return null;
            }

        }
    );

    constructor(props) {
        super(props);
        this.state = {};
    }

    //Renders main body of an reservationHandlingForm
    render() {
        return (
            <div>
                <Segment attached='top'>

                    <Progress
                        percent={this.props.header.progress}
                        attached="top"
                        indicating
                        size="big"
                    />
                    <Progress
                        percent={this.props.header.progress}
                        attached="bottom"
                        indicating
                        size="tiny"
                    />

                    <Form onSubmit={this.props.handleSubmit(this.onSubmit)} error>
                        {this.renderHeader(this.props.header)}

                        {this.props.header.title === "Select Bikes"? this.props.renderMap():null }

                        {this.renderFields}
                        {this.props.error ? <FirebaseError error={this.props.error}/> : null}
                        <Container textAlign='center'>
                            {this.renderButtons}
                        </Container>

                        {this.state.success ? <ReservationComplete/> : null}

                    </Form>
                </Segment>
            </div>
        )
    }
}

//TODO: Validate using regex and stop negative bikes
const validate = (formValues) => {

    const errors = {};

    if (/([0-2][1-9])|10|20|30|31\/([0][1-9])|10|11|12\/(19[0-9][0-9])|(200[0-9])/.test(formValues.expirationDate)) {
        errors.expirationDate = 'Invalid date'
    }

    return errors;

};

export default reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false,
    validate
})(ReservationHandlingForm)