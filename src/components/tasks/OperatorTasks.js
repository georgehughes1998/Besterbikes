import React from 'react'
import {connect} from "react-redux";

import {loadStations, loadTasks} from "../../redux/actions";
import PageContainer from "../PageContainer";
import {getUserDetails} from "../../firebase/authentication";
import ListOfLiveItems from "../ListOfLiveItems";
import {SubmissionError} from "redux-form";
import {getTasks} from "../../firebase/tasks";


class OperatorTasks extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUserDetails();
        if (user == null){
            this.props.history.push("/signin");
        }else if(user.type !== "operator"){
            this.props.history.push("/");
        }
        return user
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) =>  {
                if(user)
                    this.retrieveOperatorTasks();
            })};


    //Communicates with firebase to load in all trips
    retrieveOperatorTasks = async () => {
        const obj = await getTasks();
        if (obj) {
            this.props.loadTasks(obj);
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

    render() {

        return (
            <PageContainer>
                <ListOfLiveItems
                    items={this.props.tasks}
                />

            </PageContainer>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        tasks: state.JSON.tasks,
        stations: state.JSON.stations
    };
};

export default connect(mapStateToProps, {loadTasks, loadStations})(OperatorTasks);