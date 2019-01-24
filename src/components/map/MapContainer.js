import React from 'react'
import {BesterbikesMap} from "./BesterbikesMap";
import {Container, Segment} from "semantic-ui-react";


//TODO: Contact Calum to get map working
class MapContainer extends React.Component {



    render() {
        return (
            <Container>
                <Segment>

                    <BesterbikesMap/>
                </Segment>
            </Container>
        )
    }

}

export default MapContainer
