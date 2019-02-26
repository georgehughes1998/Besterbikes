import React from 'react'
import {connect} from "react-redux";

import {loadStations, loadTrips} from "../../redux/actions";
import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import ListOfLiveItems from "../ListOfLiveItems";


class OperatorTasks extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) =>  {
                if(user)
                    this.retrieveFirebaseTrips();
            })};



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
        tasks: state.JSON.tasks
    };
};

export default connect(mapStateToProps, {loadTrips, loadStations})(OperatorTasks);