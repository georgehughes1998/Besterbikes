import React from "react";
import {getUser} from "../firebase/authentication";
import CustomerUnlockBike from "./customer/CustomerUnlockBike";
import OperatorUnlockBike from "./operator/OperatorUnlockBike";
import PageContainer from "./PageContainer";
import {Container, Header, Icon} from "semantic-ui-react";

class UnlockBike extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user == null) {
            this.props.history.push("/signin");
        } else if (user.type === "manager") {
            this.props.history.push("/");
        } else {
            this.setState({"userType": user.type})
        }
        return user
    };

    constructor(props) {
        super(props);
        this.state = {
            userType: ""
        };
    }

    renderUserSpecificContent() {
        if (this.state.userType === "customer") {
            return <CustomerUnlockBike/>
        } else if (this.state.userType === "operator") {
            return <OperatorUnlockBike/>
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.authenticateUser()
    }

    render() {
        return (
            <PageContainer>
                <Container textAlign='center'>

                    <br/>
                    <br/>
                    <Icon name="wifi" size="massive"/>

                    <Header as="h1">
                        Unlock Bike
                    </Header>

                    <Header.Subheader>
                        Place your mobile device against the reader at one of our bike stands.
                    </Header.Subheader>

                    <br/>

                    {/*<Icon name="mobile alternate" size="huge"/>*/}

                    <Header.Subheader>
                        Alternatively, select your trip below and enter the displayed code
                    </Header.Subheader>

                    <br/>

                    {this.state.userType === "" ? null : this.renderUserSpecificContent()}
                </Container>
            </PageContainer>
        )
    }
}

export default UnlockBike