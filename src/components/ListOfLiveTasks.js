//Displays all Trips by mapping over returned Trips
import {Form, Grid, Header, Icon, Segment} from "semantic-ui-react";
import React from "react";
import Modal from "semantic-ui-react/dist/commonjs/modules/Modal/Modal";
import Input from "semantic-ui-react/dist/commonjs/elements/Input/Input";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import OperatorDropdown from "./dropdowns/OperatorDropdown";

class listOfLiveTasks extends React.Component {

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
    //Render single reservation with provided paramters
    renderItem = ({color, iconNames, iconColors, status, category, opertaor, deadline, comments, taskId}) => {
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
                </Grid>
            </Segment>
        )
    };
    getItemValues = (task, index) => {

        let keys = Object.keys(this.props.items);

        const headerSub = ``;

        switch (task['status']) {
            case "pending":
                return this.renderItem({
                    color: "purple",
                    iconNames: ["cancel", "check circle outline", "arrow alternate circle right outline"],
                    iconColors: ["red", "green", "purple"],
                    status: "Pending",
                    category: task["category"],
                    opertaor: task["operator"],
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
            case "Cancel":
                this.props.handleUpdateStatus(taskId, "cancelled");
                return;
            case "check circle outline":
                this.props.handleUpdateStatus(taskId, "complete");
                return;
            case "arrow alternate circle right outline":
                this.setState({"modalTask": taskId});
                this.setState({"modalHeader": "Reassign Task"});
                this.setState({"modalSubHeader": "Please enter a comment for the reassigned task"});
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
        this.setState({open: false});
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
            opertaors: []
        };
    }

    render() {
        return (
            <div>
                {this.renderItems()}

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
                                onChange={(e) => (this.setState({"modalMessage": e.target.value}))}
                            />
                            <OperatorDropdown
                                operators={this.props.operators}
                                onChange={(operator) => this.setState({"modalOperator": operator})}
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
            </div>
        )
    }
}

export default listOfLiveTasks;
