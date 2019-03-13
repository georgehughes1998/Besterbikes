import React from 'react'
import withRouter from "react-router/es/withRouter";
import PageContainer from "../PageContainer";
import ListOfLiveTrips from "../ListOfLiveTrips";
import {getUser} from "../../firebase/authentication";

class CustomerDetails extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user == null) {
            this.props.history.push("/signin");
        } else if (user.type !== "manager") {
            this.props.history.push("/");
        }
        return user
    };

    componentDidMount() {
        this.authenticateUser()
    }

    render() {
        return (
            <PageContainer>
                Customer Details

                <ListOfLiveTrips/>
                {this.props.location.state.customerID}
            </PageContainer>
        )
    }
}

export default withRouter(CustomerDetails)