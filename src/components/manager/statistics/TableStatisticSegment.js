import React from 'react'
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import Header from "semantic-ui-react/dist/commonjs/elements/Header/Header";
import Icon from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import {Grid} from "semantic-ui-react";
import Segment from "semantic-ui-react/dist/commonjs/elements/Segment/Segment";

class TableStatisticSegment extends React.Component{

    renderStatistics = () => {
        console.log(this.props.values.retrievedStatistics)

        this.props.values.retrievedStatistics.map((key, index) => {
            console.log(key)
            console.log(index)
        })
    };




    render(){
        return(
            <Segment>
                {/*{console.log("Seg", this.props)}*/}
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

export default TableStatisticSegment