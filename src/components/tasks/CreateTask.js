import React from 'react'

import {getUser} from "../../firebase/authentication";
import PageContainer from "../PageContainer";
import {Button, Container, Dropdown, Form, Header, TextArea} from "semantic-ui-react";
import {getOperators} from "../../firebase/users";
import connect from "react-redux/es/connect/connect";
import {loadOperators} from "../../redux/actions";
import OperatorDropdown from "../dropdowns/OperatorDropdown";

class CreateTask extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            category: "",
            description: "",
            operator: ""
        }
    };

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    retrieveOperators = async () => {
        const obj = await getOperators();
        if (obj) {
            this.props.loadOperators(obj);
        } else {

        }
    };

    componentDidMount() {
        this.retrieveOperators()
            .then((user) =>  {
                if(user)
                    this.retrieveOperators();
                console.log(this.props.trips)
            })};

    //TODO: Add firebase function to create a task
    handleSubmit = async (values) => {
        // return reportIssue(this.state.category, this.state.description)
        //     .then((obj) => {
        //
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         throw new SubmissionError({
        //             _error: err.message
        //         })
        //     })
        console.log(values)
    };

        render() {
            return (
                <PageContainer>
                    <br/>
                    <Container textAlign='center'>
                        <Form>

                            <Header as="h1">Create a Task</Header>

                            <Dropdown
                                selection
                                search
                                placeholder='Select Category'
                                options={[  {key: "bikeFault", value: "Bike Fault", text: "Bike Fault"},
                                    {key: "stationFault", value: "Station Fault", text: "Station Fault"},
                                    {key: "feedback", value: "Feedback", text: "Feedback"}
                                ]}
                                onChange={(param, data) => this.setState({"category": data.value})}
                            />

                            <br/>
                            <br/>

                            <OperatorDropdown
                                placeholder = 'Select Operator'
                                trips = {this.props.trips}
                                handleSubmit = {(param, data) => this.setState({"operator": data.value})}
                            />



                            <br/>
                            <br/>
                            <TextArea
                                autoHeight
                                placeholder={"Please describe your query here"}
                                rows={10}
                                onChange={(param, data) => this.setState({"description": data.value})}
                            />

                            <br/>
                            <br/>
                            <Button
                                content={this.props.button}
                                onClick={() => this.props.handleSubmit(this.state)}
                            />

                        </Form>
                    </Container>
                </PageContainer>
            )
        }

}

const mapStateToProps = (state) => {
    return {
        operators: state.JSON.operators
    }
};

export default connect(mapStateToProps, {loadOperators})(CreateTask);



