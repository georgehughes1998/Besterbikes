import React from 'react'
import {Button, Container, Dropdown, Form, Header, TextArea} from "semantic-ui-react";
import PageContainer from "./PageContainer";

class SimpleForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            category: "",
            description: ""
        }
    };

    render() {
        return (
            <PageContainer>
                <br/>
                <Container textAlign='center'>
                    <Form>

                        <Header as="h1">{this.props.title}</Header>

                        <br/>
                        <Dropdown
                            selection
                            search
                            placeholder='Select Category'
                            options={this.props.dropdown}
                            onChange={(param, data) => this.setState({"category": data.value})}
                        />

                        <br/>
                        <br/>
                        <TextArea
                            autoHeight
                            placeholder = {this.props.textArea}
                            rows={10}
                            onChange={(param, data) => this.setState({"description": data.value})}
                        />

                        <br/>
                        <br/>
                        <Button
                            content= {this.props.button}
                            onClick={() => this.props.handleSubmit(this.state)}
                        />

                    </Form>
                </Container>
            </PageContainer>
        )
    }
}

export default SimpleForm;