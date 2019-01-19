import React from 'react'
import {Link} from 'react-router-dom'
import SignOut from "./accountManagement/SignOut";
import {authenticate} from "../firebase/authentication";
import {Container, Grid, Header, Icon, Segment} from "semantic-ui-react";

//TODO: Display message for each each user: Hello *Users first name*
class MainMenu extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await authenticate();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    componentDidMount() {
        this.authenticateUser().then((user) => console.log(user));
    }

    render() {
        return (
            <Container>
                <br/>
                <Container textAlign='center'>
                    <Header as="h1">
                        Welcome Back
                    </Header>
                </Container>

                <Segment placeholder>
                    <Grid doubling columns={4}>
                        <Grid.Column>
                            <Link to="/map">
                                <Container textAlign='center'>
                                    <Icon name="map" size="massive" center color="blue"/>
                                    <Header as="h2" textAlign='center'>Map</Header>
                                </Container>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link to="/reservebike">
                                <Container textAlign='center'>
                                    <Icon name="calendar" size="massive" center color="blue"/>
                                    <Header as="h2" textAlign='center'>Reserve</Header>
                                </Container>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link to="/unlock">
                                <Container textAlign='center'>
                                    <Icon name="unlock" size="massive" center color="blue"/>
                                    <Header as="h2" textAlign='center'>Unlock</Header>
                                </Container>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link to="/mytrips">
                                <Container textAlign='center'>
                                    <Icon name="map signs" size="massive" center color="blue"/>
                                    <Header as="h2" textAlign='center'>My Trips</Header>
                                </Container>
                            </Link>
                        </Grid.Column>
                    </Grid>
                </Segment>

                <SignOut/>
            </Container>
        )
    }

}

export default MainMenu