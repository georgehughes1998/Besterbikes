import React from 'react'
import withRouter from "react-router/es/withRouter";
import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import {SubmissionError} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {loadOperators, loadStations, loadTasks} from "../../redux/actions";
import Button from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import {getTasks, reassignTask, updateTaskStatus} from "../../firebase/tasks";
import ListOfLiveTasks from "../ListOfLiveTasks";
import {getJSONFromFile} from "../../dataHandling/handleJSON";
import {getOperators} from "../../firebase/users";

class OperatorDetails extends React.Component {

    async getStations() {
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        this.props.loadStations(stations)
    }

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
    handleReassignTask = async (taskID, comment, operatorId) => {
        const obj = await reassignTask(taskID, comment, operatorId);
        if (obj) {
            this.retrieveOperatorTasks();
        }
    };

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user == null) {
            this.props.history.push("/signin");
        } else if (user.type !== "manager") {
            this.props.history.push("/");
        }

        // console.log(user);
        this.setState({"currentUser": user});
        return user;
    };
    //Communicates with firebase to load in all trips
    retrieveOperatorTasks = () => {
        console.log(this.props.history.location.state.operatorID);
        return getTasks(this.props.history.location.state.operatorID).then((obj => {
            console.log(obj);
            this.props.loadTasks(obj);
        }));
    };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: {}
        };
    }

    retrieveOperators = async () => {
        const obj = await getOperators();
        if (obj) {
            this.props.loadOperators(obj);
            this.setState({"operators": obj});
        }
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user){
                    this.retrieveOperators();
                    this.getStations();
                    this.retrieveOperatorTasks();
                }
            })
    }

    render() {
        return (
            <PageContainer>
                <Segment raised>

                    <br/>
                    <Container textAlign='left'>
                        <Header as={"h1"}>Operator Details</Header>
                        <p>
                            <strong>Forename: </strong>
                            {this.props.history.location.state.operator.name ? this.props.history.location.state.operator.name["firstName"] : null}
                        </p>
                        <p>
                            <strong>Surname: </strong>
                            {this.props.history.location.state.operator.name ? this.props.history.location.state.operator.name["lastName"] : null}
                        </p>
                        <p>
                            <strong>Date of Birth: </strong>
                            {this.props.history.location.state.operator.dateOfBirth ? this.props.history.location.state.operator.dateOfBirth : null}
                        </p>
                        <p>
                            <strong>ID: </strong>
                            {this.props.history.location.state.operatorID ? this.props.history.location.state.operatorID : null}
                        </p>

                        <Button onClick={() => this.props.history.push("/users")}>
                            Return to all users
                        </Button>

                    </Container>
                    <br/>


                </Segment>

                {/*{console.log(this.props.trips)}*/}
                {/*{console.log(this.props.stations)}*/}

                <ListOfLiveTasks
                    items={this.props.tasks}
                    stations={this.props.stations}
                    operators={this.props.operators}
                    handleUpdateStatus={(taskID, status) => this.handleUpdateStatus(taskID, status)}
                    handleReassignTask={(taskID, comment, operatorId) => this.handleReassignTask(taskID, comment, operatorId)}
                />
                {/*{this.props.location.state.operatorID}*/}
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

export default withRouter(connect(mapStateToProps, {loadTasks, loadOperators, loadStations})(OperatorDetails));