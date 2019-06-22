import React from 'react'
import {Link} from "react-router-dom";
import {Container, Divider, Image} from 'semantic-ui-react'

import AccountForm from "./AccountHandlingForm";
import PageContainer from "../PageContainer";
import connect from "react-redux/es/connect/connect";
import {loadCurrentUser} from "../../redux/actions";
import {getUser} from "../../firebase/authentication";


//Component that passes relevant fields to PageContainer for a signin
class SignIn extends React.Component{

    // If user is signed in then checks redux and retrieves and adds user if necessary by querying firebase
    getUserDetails = async (authUser = "") => {

        let userDetails = this.props.loadCurrentUser();

        if (!(userDetails.payload)) {
            userDetails = await getUser();
            this.props.loadCurrentUser(userDetails);
            if (userDetails === null)
                this.props.history.push("signin");
        }

        return userDetails

    };

    render(){
        return (
            <PageContainer>

                {/*Use procedure to show image from: https://support.awesome-table.com/hc/en-us/articles/115002196665-Display-images-from-Google-Drive*/}

                <Image
                    src={"https://drive.google.com/thumbnail?id=1DWfv569MmvtLipSX_vFQVihtJcbbmiTx"}
                    size='small'
                    alt="Besterbikes Logo"
                    centered
                />

                <Divider horizontal>Sign In</Divider>

                {/*Sign In Form*/}
                <AccountForm

                    getUserDetails={this.getUserDetails}

                    fields={{
                        Email: {
                            name: 'email',
                            label: 'Email',
                            type: 'text'
                        },
                        Password: {
                            name: 'password',
                            label: 'Password',
                            type: 'password'
                        }
                    }}

                    errors={this.error}

                    operation={{
                        text: "Sign In",
                        link: "/"
                    }}

                />


                <Container textAlign='center'>
                    <Link to="/signup">
                        Don't have an account, Sign Up
                    </Link>
                </Container>


            </PageContainer>
        )
    }

};


const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser
    };
};

export default connect(mapStateToProps, {loadCurrentUser})(SignIn);