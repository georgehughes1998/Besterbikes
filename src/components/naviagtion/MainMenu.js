import React from 'react'
import {Link} from 'react-router-dom'
import SignOut from "../accountManagement/SignOut";
import {getUser} from "../../firebase/authentication";
import {Container, Grid, Header, Icon} from "semantic-ui-react";
import PageContainer from "../PageContainer";
import {getJSONFromFile} from "../../dataHandling/handleJSON";
import connect from "react-redux/es/connect/connect";
import {loadWebPages} from "../../redux/actions/index";

//TODO: Display message for each each user: Hello *Users first name*
//TODO: Refactor main menu and make pretty
class MainMenu extends React.Component {

    constructor(props){
        super(props);
        this.state =
            {
                webPages: {},
                menuItems:[
                {
                    link: "/signin",
                    icon: "",
                    name: ""
                },
                {
                    link: "/signin",
                    icon: "",
                    name: ""
                },
                {
                    link: "/signin",
                    icon: "",
                    name: ""
                },
                {
                    link: "/signin",
                    icon: "",
                    name: ""
                },
            ]}
        };

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null)
            this.props.history.push("signin");
        return user
    };

    renderUserSpecificContent(user) {
        if(user!=null){
            switch (user.type) {
                case "customer":
                    this.setState({menuItems: this.state.webPages.customer});
                    this.props.loadWebPages(this.state.menuItems);
                    return;
                case "operator":
                    this.setState({menuItems: this.state.webPages.operator});
                    this.props.loadWebPages(this.state.menuItems);
                    return;
                case "manager":
                    this.setState({menuItems: this.state.webPages.manager});
                    this.props.loadWebPages(this.state.menuItems);
                    return;
            }
            return;
        }
    }

    renderMenuIcons(){
        var icons = [];

        if(this.state.menuItems) {
            // for (let i = 0; i < 2; i++) {
            //
            //     icons.push(
            //       <Grid.Row>
            //             <Link to={this.state.menuItems[i].link ? this.state.menuItems[i].link : "/signin"}>
            //                 <Container textAlign='center'>
            //                     <Icon name={this.state.menuItems[i].icon} size="big" center color="black"/>
            //                     <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[i].name}</Header>
            //                 </Container>
            //             </Link>
            //         </Grid.Row>
            //     )
            //
            // }

            //TODO: make this less awful
            icons.push(
                <Grid container verticalAlign='middle' centered columns={'equal'}>
                <Grid.Row centered >
                    <Grid.Column centered>
                        <Link to={this.state.menuItems[0].link ? this.state.menuItems[0].link : "/signin"}>
                            <Container textAlign='center'>
                                <Icon name={this.state.menuItems[0].icon} size="huge" center  color="black" />
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[0].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>
                    <Grid.Column centered>
                        <Link to={this.state.menuItems[1].link ? this.state.menuItems[1].link : "/signin"}>
                            <Container textAlign={'center'}>
                                <Icon name={this.state.menuItems[1].icon} size="huge" center color="black"/>
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[1].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row centered>
                    <Grid.Column centered>
                        <Link to={this.state.menuItems[2].link ? this.state.menuItems[2].link : "/signin"}>
                            <Container textAlign='center'>
                                <Icon name={this.state.menuItems[2].icon} size="huge" center  color="black" />
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[2].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>
                    <Grid.Column centered>
                        <Link to={this.state.menuItems[3].link ? this.state.menuItems[3].link : "/signin"}>
                            <Container textAlign='center'>
                                <Icon name={this.state.menuItems[3].icon} size="huge" center  color="black" />
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[3].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>

                </Grid.Row>
                </Grid>

            )

        }

        return icons;
    }

    componentDidMount() {
        this.authenticateUser().then((user) => this.renderUserSpecificContent(user));
        this.getWebPagesJSON();
    }

    async getWebPagesJSON() {
        const webPages = JSON.parse(await getJSONFromFile("/JSONFiles/webPages.json"));
        this.setState({webPages: webPages});
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


                <Container>
                    <Grid stackable columns={4}>
                        {this.renderMenuIcons()}
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

const mapStateToProps = (state) => {
    return {
        webPages: state.user.webPages
    }
};

export default connect(
    mapStateToProps,
    {loadWebPages}
)(MainMenu);