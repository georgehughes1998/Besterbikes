import React from 'react'
import {getUser} from "../../firebase/authentication";
import {Button, Container, Dropdown, Form, Header, TextArea} from "semantic-ui-react";
import PageContainer from "../PageContainer";

class Report extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            category: "",
            description: ""
        }
    };

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    //TODO: Add firebase function to make report
    handleSubmit = async () => {
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
        console.log(this.state)
    };

    render() {
        return (
            <PageContainer>
                <br/>
                <Container textAlign='center'>
                    <Form>

                        <Header as="h1">How can we help?</Header>

                        <br/>
                        <Dropdown
                            selection
                            search
                            placeholder='Select Category'
                            options={[
                                {key: "bikeFault", value: "Bike Fault", text: "Bike Fault"},
                                {key: "complaint", value: "Complaint", text: "Complaint"},
                                {key: "feedback", value: "Feedback", text: "Feedback"}
                            ]}
                            onChange={(param, data) => this.setState({"category": data.value})}
                        />

                        <br/>
                        <br/>
                        <TextArea
                            autoHeight
                            placeholder = "Please describe your query here"
                            rows={10}
                            onChange={(param, data) => this.setState({"description": data.value})}
                        />

                        <br/>
                        <br/>
                        <Button
                            content="Send Report"
                            onClick={() => this.handleSubmit()}
                        />

                    </Form>
                </Container>
            </PageContainer>
        )
    }
}

export default Report;