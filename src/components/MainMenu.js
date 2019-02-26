import React from 'react'
import {Link} from 'react-router-dom'
import SignOut from "./accountManagement/SignOut";
import {getUser} from "../firebase/authentication";
import {Container, Grid, Header, Icon} from "semantic-ui-react";
import PageContainer from "./PageContainer";

//TODO: Display message for each each user: Hello *Users first name*
//TODO: Refactor main menu and make pretty
class MainMenu extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    componentDidMount() {
        this.authenticateUser().then((user) => null);
    }

    render() {
        return (
            <PageContainer>
                <br/>
                <br/>

                <Container textAlign='center'>
                    <Header as="h1" color="blue">
                        Welcome Back
                    </Header>
                </Container>

                <br/>
                <br/>
                <br/>
                <br/>

                <Container>
                    <Grid stackable columns={4}>
                        <Grid.Column>
                            <Link to="/map">
                                <Container textAlign='center'>
                                    <Icon name="map" size="big" center color="black"/>
                                    <Header as="h3" textAlign='center' color="blue">Map</Header>
                                </Container>
                            </Link>
                        </Grid.Column>

                        <Grid.Column>
                            <Link to="/reservebike">
                                <Container textAlign='center'>
                                    <Icon name="calendar" size="big" center color="black"/>
                                    <Header as="h3" textAlign='center' color="blue">Reserve</Header>
                                </Container>
                            </Link>
                        </Grid.Column>

                        <Grid.Column>
                            <Link to="/unlockbike">
                                <Container textAlign='center'>
                                    <Icon name="unlock" size="big" center color="black"/>
                                    <Header as="h3" textAlign='center' color="blue">Unlock</Header>
                                </Container>
                            </Link>
                        </Grid.Column>

                        <Grid.Column>
                            <Link to="/mytrips">
                                <Container textAlign='center'>
                                    <Icon name="map signs" size="big" center color="black"/>
                                    <Header as="h3" textAlign='center' color="blue">My Trips</Header>
                                </Container>
                            </Link>
                        </Grid.Column>
                    </Grid>
                </Container>

                <br/>
                <br/>
                <br/>

                <SignOut/>
            </PageContainer>
        )
    }

}

export default MainMenu