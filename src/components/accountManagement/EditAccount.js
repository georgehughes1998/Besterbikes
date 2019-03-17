import React from 'react'
import {Divider} from 'semantic-ui-react'

import AccountForm from "./AccountHandlingForm";
import PageContainer from "../PageContainer";
import SignOut from "./SignOut";
import {getUser} from "../../firebase/authentication";


//Component that passes relevant fields to PageContainer for editing accountManagement details
class EditAccount extends React.Component {

    //Checks if user is logged in and redirects to sign in if not
    authenticateUser = () => {
        return getUser()
            .then(user => {
                if (user === null)
                    this.props.history.push("signin");
                this.setState({currentUser: user});
                return user
            });
    };

    async componentDidMount() {
        await this.authenticateUser();
    }

//TODO: Make fields display current users details
    render() {
        return (
            <PageContainer>
                <Divider horizontal>Edit Account Details</Divider>

                {/*Sign Up Form*/}
                <AccountForm
                    fields={{
                        //TODO: Implement so these fields can be changed
                        Email: {
                            name: 'updateEmail',
                            label: 'Email',
                            type: 'text'
                        },
                        Password: {
                            name: 'updatePassword',
                            label: 'Password',
                            type: 'password'
                        },
                        Forename: {
                            name: 'updateForename',
                            label: 'First Name',
                            type: 'text'
                        },
                        Surname: {
                            name: 'updateSurname',
                            label: 'Surname',
                            type: 'text'
                        },
                        DateOfBirth: {
                            name: 'updateDateOfBirth',
                            label: 'Date of Birth',
                            type: 'date'
                        }
                    }}

                    operation={{
                        text: "Save Changes",
                        link: "/"
                    }}

                />

                {/*TODO: Fix so signs out and naviagtes to home page*/}
                <SignOut/>

            </PageContainer>
        )
    }


};

export default EditAccount
