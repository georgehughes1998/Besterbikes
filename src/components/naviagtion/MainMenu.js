import React from 'react'
import {Link} from 'react-router-dom'
import SignOut from "../accountManagement/SignOut";
import {getUser} from "../../firebase/authentication";
import {Container, Grid, Header, Icon} from "semantic-ui-react";
import PageContainer from "../PageContainer";
import {getJSONFromFile} from "../../handleJSON";
import connect from "react-redux/es/connect/connect";
import {loadWebPages} from "../../redux/actions/index";

//TODO: Display message for each each user: Hello *Users first name*
//TODO: Refactor main menu and make pretty
class MainMenu extends React.Component {

    constructor(props){
        super(props);
        this.state =
            {
                userType: "",
                webPages:{},
                menuItems:[
                {
                    link: "",
                    icon: "",
                    name: ""
                },
                {
                    link: "",
                    icon: "",
                    name: ""
                },
                {
                    link: "",
                    icon: "",
                    name: ""
                },
                {
                    link: "",
                    icon: "",
                    name: ""
                },
            ]}
        };

    async componentDidMount() {
        console.log(this.state);
        await this.getWebPagesJSON();
        await this.authenticateUser();
        console.log(this.state);
        await this.renderUserSpecificContent();
        console.log(this.state);
        console.log("");
    }

    async getWebPagesJSON() {
        const webPages = await JSON.parse(await getJSONFromFile(window.location.origin + "/JSONFiles/webpages.json"));
        this.setState({webPages: webPages});
    }

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = async () => {
        const user = await getUser();
        if (user === null){
            this.props.history.push("signin");
        }else if (user.type === "customer") {
            this.setState({"userType" : "customer"})
        }else if (user.type === "operator") {
            this.setState({"userType" : "operator"})
        }else if (user.type === "manager") {
            this.setState({"userType" : "manager"})
        }

        return user;
    };

    renderUserSpecificContent() {
        if(this.state.userType!=null){
            switch (this.state.userType) {
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
        let icons = [];

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
                <Grid verticalAlign='middle' centered columns = {2}>
                <Grid.Row centered >
                    <Grid.Column>
                        <Link to={this.state.menuItems[0].link ? this.state.menuItems[0].link : "/signin"}>
                            <Container textAlign='center'>
                                <Icon name={this.state.menuItems[0].icon} size="huge" center  color="black" />
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[0].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>
                    <Grid.Column >
                        <Link to={this.state.menuItems[1].link ? this.state.menuItems[1].link : "/signin"}>
                            <Container textAlign='center'>
                                <Icon name={this.state.menuItems[1].icon} size="huge" center color="black"/>
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[1].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row centered>
                    <Grid.Column >
                        <Link to={this.state.menuItems[2].link ? this.state.menuItems[2].link : "/signin"}>
                            <Container textAlign='center'>
                                <Icon name={this.state.menuItems[2].icon} size="huge" center  color="black" />
                                <Header as="h3" textAlign='center' color="blue">{this.state.menuItems[2].name}</Header>
                            </Container>
                        </Link>
                    </Grid.Column>
                    <Grid.Column >
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
                <br/>


                <Container>
                    <Grid stackable columns={4}>
                        {this.renderMenuIcons()}
                    </Grid>
                </Container>

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