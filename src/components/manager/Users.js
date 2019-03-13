import React from 'react'
import {connect} from "react-redux";
import PageContainer from "../PageContainer";
import {getUser} from "../../firebase/authentication";
import {getUsersOfType} from "../../firebase/users"
import {SubmissionError} from "redux-form";
import {loadCustomers, loadOperators} from "../../redux/actions";
import List from "semantic-ui-react/dist/commonjs/elements/List/List";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Menu from "semantic-ui-react/dist/commonjs/collections/Menu/Menu";
import withRouter from "react-router/es/withRouter";


class Users extends React.Component {

    handleUserClick = (customer, customerID) => {
        if (this.state.userType === "customer") {
            this.props.history.push({
                pathname: '/customerdetails',
                state: {customer: customer, customerID: customerID}
            })
        }
    };
    renderListItems = () => {
        if (this.state.userType === "customer" && this.props.customers) {
            return Object.values(this.props.customers).map((key, index) => {

                let keys = Object.keys(this.props.customers);

                return (
                    <List.Item onClick={() => this.handleUserClick(key, keys[index])}>
                        <List.Icon name='bicycle' size='large' verticalAlign='middle'/>
                        <List.Content>
                            <List.Header>
                                {`${key.name["firstName"]} ${key.name["lastName"]}`}
                            </List.Header>

                            <Header as={"h5"}>
                                ID: {keys[index]}
                            </Header>
                        </List.Content>
                    </List.Item>

                )
            })
        } else if (this.state.userType === "operator" && this.props.operators) {
            return Object.values(this.props.operators).map((key, index) => {

                let keys = Object.keys(this.props.operators);

                return (
                    <List.Item onClick={() => this.handleUserClick(keys, keys[index])}>
                        <List.Icon name='bicycle' size='large' verticalAlign='middle'/>
                        <List.Content>
                            <List.Header>
                                {`${key.name["firstName"]} ${key.name["lastName"]}`}
                            </List.Header>

                            <Header as={"h4"}>
                                ID: {keys[index]}
                            </Header>
                        </List.Content>
                    </List.Item>
                )
            })
        } else {
            return (
                <div>
                    No users to display
                </div>
            )
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
        return user
    };
    //Communicates with firebase to load in all trips
    retrieveUsers = async (userType) => {
        const obj = await getUsersOfType(userType);
        if (obj) {
            console.log(userType, obj);
            {
                userType === "customer" ? this.props.loadCustomers(obj) : this.props.loadOperators(obj)
            }
            ;
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            userType: "customer"
        };
    }

    componentDidMount() {
        console.log("Mounted");
        this.authenticateUser()
            .then((user) => {
                if (user)
                    this.retrieveUsers("customer");
                this.retrieveUsers("operator");
            })
    };

    render() {

        return (
            <PageContainer>

                <br/>
                <Container textAlign='center'>
                    <Header as={"h1"}>Users</Header>
                </Container>
                <br/>

                <Menu pointing secondary widths={2}>
                    <Menu.Item name="customers" active={this.state.userType === "customer"}
                               onClick={() => this.setState({"userType": "customer"})}/>
                    <Menu.Item name="operators" active={this.state.userType === "operator"}
                               onClick={() => this.setState({"userType": "operator"})}/>
                </Menu>

                <Container>
                    <br/>
                    <Header as={"h2"}>{`List of ${this.state.userType}s`}</Header>
                    <List celled size={"huge"}>
                        {this.renderListItems()}
                    </List>
                </Container>
            </PageContainer>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        customers: state.JSON.customers,
        operators: state.JSON.operators
    };
};

export default withRouter(connect(mapStateToProps, {loadCustomers, loadOperators})(Users));