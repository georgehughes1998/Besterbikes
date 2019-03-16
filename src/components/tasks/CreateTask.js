import React from 'react'

import {getUser} from "../../firebase/authentication";
import PageContainer from "../PageContainer";
import {Button, Container, Dropdown, Form, Header, TextArea} from "semantic-ui-react";
import {getOperators} from "../../firebase/users";
import connect from "react-redux/es/connect/connect";
import {loadOperators} from "../../redux/actions";
import OperatorDropdown from "../dropdowns/OperatorDropdown";
import {makeNewTask} from "../../firebase/tasks";
import FirebaseError from "../FirebaseError";
import ConfirmationModal from "../ConfirmationModal";

class CreateTask extends React.Component {

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
            this.setState({"operators": obj});
        } else {

        }
    };
    //TODO: Add firebase function to create a task
    handleSubmit = async () => {
        console.log("this.state");
        return makeNewTask({
            category: this.state.category,
            operator: this.state.operator,
            comment: this.state.description
        })
            .then((obj) => {
                console.log(obj)
                this.setState({taskCreated: true});
            })
            .catch((err) => {
                console.log(err);
                // this.serState = err.message;
            })
    };

    constructor(props) {
        super(props);
        this.state = {
            category: "",
            description: "",
            operator: "",
            taskCreated: false
        }
    };

    componentDidMount() {
        this.authenticateUser().then(
            this.retrieveOperators()
                .then((user) => {
                    if (user)
                        this.retrieveOperators();
                })
        )

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
                            options={[{key: "bikeFault", value: "Bike Fault", text: "Bike Fault"},
                                {key: "stationFault", value: "Station Fault", text: "Station Fault"}
                            ]}
                            onChange={(param, data) => this.setState({"category": data.value})}
                        />

                        <br/>
                        <br/>

                        <OperatorDropdown
                            placeholder='Select Operator'
                            operators={this.props.operators}
                            onChange={(operator) => this.setState({"operator": operator})}
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
                        {this.state.error != "" ? <FirebaseError error={this.state.error}/> : null}
                        <Button
                            content="Create Task"
                            onClick={() => this.handleSubmit(this.state)}
                        />

                    </Form>
                </Container>

                {this.state.taskCreated ?
                    <ConfirmationModal
                        icon='send'
                        header='Task Created'
                        text={`Your ${this.state.category} has been registered and assiged to an operator`}
                        link="/"
                        linkText="Return to main menu"
                    />
                    : null}
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



