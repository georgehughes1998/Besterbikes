import React from 'react'
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";
import {Grid} from "semantic-ui-react";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";

class StatisticSegment extends React.Component{

    renderStatistics = () => {
            if (this.props) {
                return Object.values(this.props.values).map((key, index) => {
                    return (
                        <Grid.Column widths={1}>
                            <Header as='h1'>{key.value}</Header>
                            <Header as='h4'>{key.name}</Header>
                        </Grid.Column>

                    )
                })
            }
    };

    render(){
        return(
            <Segment>
                <Container textAlign='center'>
                    <Header as='h2'>
                        <Icon name={this.props.icon} />
                        <Header.Content>
                            {this.props.name}
                        </Header.Content>
                    </Header>
                    <br/>
                    <Grid columns='equal'>
                        {this.renderStatistics()}
                    </Grid>
                </Container>
            </Segment>
        )
    }
}

export default StatisticSegment