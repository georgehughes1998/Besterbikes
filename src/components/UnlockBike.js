import React from 'react'
import PageContainer from "./PageContainer";
import {Container} from "semantic-ui-react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";

export const UnlockBike = () => {
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

                <Dropdown fluid selection options={[{key: "HDKW8273HD", value: "HDKW8273HD", text: "HDKW8273HD"}]}/>

                <br/>

                <Segment>
                    <Header as="h1">HDKW8273HD</Header>
                </Segment>

            </Container>
        </PageContainer>
    )
};

export default UnlockBike