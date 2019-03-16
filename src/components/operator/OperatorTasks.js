import React from 'react'
import {connect} from "react-redux";

import {loadStations, loadTasks} from "../../redux/actions/index";
import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import {SubmissionError} from "redux-form";
import {getTasks, reassignTask, updateTaskStatus} from "../../firebase/tasks";
import ListOfLiveTasks from "../ListOfLiveTasks";
import {getOperators} from "../../firebase/users";
import {loadOperators} from "../../redux/actions";


class OperatorTasks extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user == null) {
            this.props.history.push("/signin");
        } else if (user.type !== "operator") {
            this.props.history.push("/");
        }
        return user
    };

    retrieveOperators = async () => {
        const obj = await getOperators();
        if (obj) {
            this.props.loadOperators(obj);
            this.setState({"operators": obj});
        }
    };

    //Cancels a reservation using firebase and updates displayed trips
    handleUpdateStatus = (taskId, status) => {
        console.log(taskId, status);
        return updateTaskStatus(taskId, status)
            .then((obj) => {
                console.log(obj);
                this.retrieveOperatorTasks();
            })
            .catch((err) => {
                console.log(err);
                throw new SubmissionError({
                    _error: err.message
                })
            })
    };

    //Communicates with firebase to load in all trips
    retrieveOperatorTasks = () => {
        return getTasks().then((obj => {
            this.props.loadTasks(obj)
        }))
    };

    //Communicates with firebase to load in all trips
    handleReassignTask = async (taskID, comment, operatorId) => {
        const obj = await reassignTask(taskID, comment, operatorId);
        if (obj) {
            console.log(obj);
            this.retrieveOperatorTasks();
        }
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user) {
                    this.retrieveOperators();
                    this.retrieveOperatorTasks();
                }
            })
    };

    render() {
        return (
            <PageContainer>
                <ListOfLiveTasks
                    items={this.props.tasks}
                    stations={this.props.stations}
                    operators={this.props.operators}
                    handleUpdateStatus={(taskID, status) => this.handleUpdateStatus(taskID, status)}
                    handleReassignTask={(taskID, comment, operatorId) => this.handleReassignTask(taskID, comment, operatorId)}
                />
            </PageContainer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tasks: state.JSON.tasks,
        stations: state.JSON.stations,
        operators: state.JSON.operators
    };
};

export default connect(mapStateToProps, {loadTasks, loadStations, loadOperators})(OperatorTasks);