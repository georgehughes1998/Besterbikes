import React from 'react'
import {reduxForm} from 'redux-form'

import validate from './validate'
import ReservationHandlingForm from "./ReservationHandlingForm";
import {Segment} from "semantic-ui-react";
import {getJSONFromFile} from "../../handleJSON";
import MapContainer from "../map/MapContainer";
import {BesterbikesMap} from "../map/BesterbikesMap";

//TODO: Render values in dropdown
// TODO: Move map into segment and fix diaplsy issues
//Component that passes relevant fields to ReservationHandlingForm for a reserving a bike process
class SelectBikes extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            options: ""
        }
    }

    componentDidMount(){
        if((this.state.options === "")){
            this.getStations()
        }
    }

    getStations = async () =>{
        const stations = JSON.parse(await getJSONFromFile("/JSONFiles/stations.json"));
        // console.log("MAP JSON RETRIVED");
        const options =  Object.values(stations).map((key, index) => ({key: index, value: index, text : key.name}));
        this.setState({options});
        // console.log(this.state.options);
    };

    render(){
        return (
            <Segment.Group>

                <Segment style={{minHeight:"300px"}}>
                    <div>
                        <BesterbikesMap style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            marginRight: "14px",
                            marginLeft: "-14px",
                            marginTop: "-14px",
                            marginBottom: "20px",
                            position: "absolute"
                        }}/>
                    </div>
                </Segment>

                <ReservationHandlingForm
                    header={{
                        title: "Select Bikes",
                        description: "Choose your start station and number of bikes",
                        progress: 20,
                        icon: "bicycle"
                    }}

                    fields={{
                        station: {
                            name: 'station',
                            label: 'Station',
                            type: 'dropdown',
                            values: this.state.options
                        },
                        mountainBikes: {
                            name: 'mountainBikes',
                            label: 'Mountain Bikes',
                            type: 'number'
                        },
                        regularBikes: {
                            name: 'regularBikes',
                            label: 'Regular Bikes',
                            type: 'number'
                        },

                    }}

                    operations={{
                        next: {
                            link: this.props.onSubmit,
                            type: 'submit',
                            className: 'next',
                            color: 'green',
                            text: 'Next'
                        }
                    }}
                />

            </Segment.Group>
        )
    }


};

export default reduxForm({
    form: 'reservebike',              // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
    validate
})(SelectBikes)