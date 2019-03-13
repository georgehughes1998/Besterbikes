import React from 'react'
import withRouter from "react-router/es/withRouter";
import PageContainer from "../PageContainer";
import ListOfLiveTrips from "../ListOfLiveTrips";
import {getUser} from "../../firebase/authentication";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import {getTrips} from "../../firebase/reservations";
import {SubmissionError} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {loadStations, loadTrips} from "../../redux/actions";

class CustomerDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: {}
        };
    }

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user == null) {
            this.props.history.push("/signin");
        } else if (user.type !== "manager") {
            this.props.history.push("/");
        }

        console.log(user);
        this.setState({"currentUser": user});
        return user
    };

    componentDidMount() {
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.retrieveFirebaseTrips();
            })
    }

    //Communicates with firebase to load in all trips
    retrieveFirebaseTrips = async () => {
        if(this.state.currentUser.uid){
            const obj = await getTrips(this.state.currentUser.uid);

            if (obj) {
                this.props.loadTrips(obj);
            } else {
                throw new SubmissionError({
                    _error: obj.message
                });
            }
        }
    };

    render() {
        return (
            <PageContainer>
                <Segment raised>

                    <br/>
                    <Container textAlign='left'>
                        <Header as={"h1"}>Customer Details</Header>
                        <p>
                            <strong>Forename: </strong>
                            {this.state.currentUser.name?this.state.currentUser.name["firstName"]:null}
                        </p>
                        <p>
                            <strong>Surname: </strong>
                            {this.state.currentUser.name?this.state.currentUser.name["lastName"]:null}
                        </p>
                        <p>
                            <strong>Date of Birth: </strong>
                            {this.state.currentUser.dateOfBirth?this.state.currentUser.dateOfBirth:null}
                        </p>
                        <p>
                            <strong>ID: </strong>
                            {this.state.currentUser.uid?this.state.currentUser.uid:null}
                        </p>
                    </Container>
                    <br/>


                </Segment>

                <ListOfLiveTrips/>
                {/*{this.props.location.state.customerID}*/}
            </PageContainer>
        )
    }
}


export default withRouter(connect(mapStateToProps, {loadTrips, loadStations})(CustomerDetails));