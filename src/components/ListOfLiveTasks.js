//Displays all Trips by mapping over returned Trips
import {Form, Grid, Header, Icon, Segment} from "semantic-ui-react";
import React from "react";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import OperatorDropdown from "./dropdowns/OperatorDropdown";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Comment from "semantic-ui-react/dist/commonjs/views/Comment/Comment";
import TaskStatusDropdown from "./dropdowns/TaskStatusDropdown";
import {getPrettyString} from "../dataHandling/prettyString";

class ListOfLiveTasks extends React.Component {

    renderItems = () => {
        if (this.props.items) {
            return Object.values(this.props.items).map((key, index) => {
                return (
                    <div>
                        {this.getItemValues(key, index)}
                    </div>

                )
            })
        }
    };
    renderIcons = (iconNames, iconColors, status, taskId) => {
        return Object.values(iconNames).map((key, index) => {
            return (
                <div>
                    <Grid.Row onClick={() => this.handleIconClick(key, taskId)}>
                        <Icon name={key} color={iconColors[index]} size="big"/>
                    </Grid.Row>
                </div>

            )
        })
    };

    renderComments = (comments) => {
        return Object.values(comments).map((key, index) => {
            return (
                <Comment>
                    {console.log(key)}
                    <Comment.Avatar as={"div"}>
                        <Icon name={"bicycle"}/>
                    </Comment.Avatar>
                    <Comment.Content>
                            {/*TODO: Refactor so operator name displays*/}
                            <Comment.Author>{key.user}</Comment.Author>
                            <Comment.Metadata>{key.time.date} {key.time.time}</Comment.Metadata>
                            <Comment.Text>{key.comment}</Comment.Text>
                    </Comment.Content>
                </Comment>
            )
        })
    };

    //Render single reservation with provided paramters
    renderItem = ({color, iconNames, iconColors, status, category, opertaor, deadline, comments, taskId}) => {
        console.log(this.state.viewTasksWithStatus, status);
        if (this.state.viewTasksWithStatus.length === 0 || this.state.viewTasksWithStatus.includes(status)) {
            return (
                //TODO: Make this into own prop

                <Segment color={color} fluid>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={13}>
                                <Header
                                    as='h1'
                                    content={category}
                                />
                                <Header
                                    as='h5'
                                    content={`Deadline: ${deadline["date"]} at ${deadline["time"]}`}
                                    subheader={`Task ID: ${taskId}`}
                                />

                                <Header as="h4" color={color}>{status}</Header>
                            </Grid.Column>

                            <Grid.Column width={1} verticalAlign='middle'>
                                {this.renderIcons(iconNames, iconColors, status, taskId)}
                            </Grid.Column>
                        </Grid.Row>
                        <Comment.Group>
                            <Header as='h3' dividing>
                                Comments
                            </Header>
                            {this.renderComments(comments)}
                        </Comment.Group>
                    </Grid>
                </Segment>

        )}
    };
    getItemValues = (task, index) => {

        let keys = Object.keys(this.props.items);

        const headerSub = ``;

        switch (task['status']) {
            case "pending":
                return this.renderItem({
                    color: "purple",
                    iconNames: ["check circle outline", "arrow alternate circle right outline"],
                    iconColors: ["green", "purple"],
                    status: "Pending",
                    category: task["category"],
                    opertaor: task["operator"],
                    deadline: task["deadline"],
                    comments: task["comments"],
                    // `Bike available from ${startTime}`,
                    taskId: keys[index],
                });
            case "complete":
                return this.renderItem({
                    color: "green",
                    iconNames: [],
                    iconColors: [],
                    status: "Complete",
                    category: task["category"],
                    opertaor: task["operator"],
                    deadline: task["deadline"],
                    comments: task["comments"],
                    // `Bike available from ${startTime}`,
                    taskId: keys[index],
                });
            case "reassigned":
                return this.renderItem({
                    color: "red",
                    iconNames: [],
                    iconColors: [],
                    status: "Reassigned",
                    category: task["category"],
                    opertaor: "",
                    deadline: task["deadline"],
                    comments: task["comments"],
                    // `Bike available from ${startTime}`,
                    taskId: keys[index],
                });

            default:
                return (<div>No more Trips to display</div>)
        }
    };
    //Function to handle click of an icon depending on it's functionality
    handleIconClick = (icon, taskId) => {

        switch (icon) {
            case "check circle outline":
                console.log(taskId);
                this.props.handleUpdateStatus(taskId, "complete");
                return;
            case "arrow alternate circle right outline":
                this.setState({"modalTask": taskId});
                this.setState({"modalHeader": "Reassign Task"});
                this.setState({"modalSubHeader": "Please fill out the following fields to reassign a task"});
                this.setState({"modaPlaceholder": "Comment"});
                this.setState({"modalOpen": true});
                return;
            default:
                this.props.handleReport();
                return;
        }
    };
    closeModal = () => {
        console.log(this.state);
        this.props.handleReassignTask(this.state.modalTask, this.state.modalMessage, this.state.modalOperator);
        this.setState({modalOpen: false});
    };

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            modalMessage: "",
            modalOperator: "",
            modalHeader: "",
            modalSubHeader: "",
            modalTask: "",
            opertaors: [],
            viewTasksWithStatus: []
        };
    }

    render() {
        return (
            <div>
                <br/>
                <Container textAlign='center'>
                    <TaskStatusDropdown
                        onChange={(value) => this.setState({"viewTasksWithStatus": value})}
                    />
                </Container>
                <br/>

                {this.renderItems()}

                {/*TODO: Seperate component for this modal*/}
                <Modal
                    open={this.state.modalOpen}
                    onClose={() => this.setState({"modalOpen": false})}
                >
                    <Modal.Header>{this.state.modalHeader}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <p>{this.state.modalSubHeader}</p>
                            <Input
                                value={this.state.modalMessage}
                                onChange={(e) => {
                                    (this.setState({"modalMessage": e.target.value}))
                                }}
                                placeholder={this.state.modaPlaceholder}
                            />
                            <br/>
                            <br/>
                            <OperatorDropdown
                                operators={this.props.operators}
                                onChange={(operator) => this.setState({"modalOperator": operator})}
                                placeholder={"Please select an operator"}
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.closeModal()} negative>
                            No
                        </Button>
                        <Button
                            onClick={() => this.closeModal()}
                            positive
                            labelPosition='right'
                            icon='checkmark'
                            content='Submit'
                        />
                    </Modal.Actions>

                </Modal>

                <Segment>
                    <Header as='h2' icon textAlign='center'>
                        <Header.Content>No more tasks to display</Header.Content>
                    </Header>
                </Segment>
            </div>
        )
    }
}

export default ListOfLiveTasks;
