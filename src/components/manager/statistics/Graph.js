import React from "react";
import {VictoryLine, VictoryChart, VictoryTheme, VictoryLabel} from 'victory';
import Segment from "./SimpleStatisticSegment";

var theData, theX, theY, theText;

const theData = [
    {x: "02-03-19", y: 15},
    {x: "03-03-19", y: 10},
    {x: "04-03-19", y: 2},
    {x: "05-03-19", y: 10},
    {x: "06-03-19", y: 29},
    {x: "07-03-19", y: 10},
    {x: "08-03-19", y: 10},
    {x: "09-03-19", y: 12},
    {x: "10-03-19", y: 19},
];


class Graph extends React.Component {

    getChart() {

        // if (this.props) {
        //     if (this.props.x)
        //         const x = this.props.x;
        //     if (this.props.y)
        //         let y = this.props.y;
        // }

        let data = theData;
        let text = theText;
        let x = theX;
        let y = theY;

        console.log(this.props);

        if (this.props) {
            if (this.props.data)
                data = this.props.data;
            if (this.props.x)
                x = this.props.x;
            if (this.props.y)
                y = this.props.y;
            if (this.props.text)
                text = this.props.text;
        }

        return (

            <VictoryChart
                theme={VictoryTheme.grayscale}
                width={700} height={300}

                padding={{top: 50, bottom: 50, left: 30, right: 30}}
                domainPadding={20}
            >
                <VictoryLabel text={text} x={225} y={30} textAnchor="middle"/>

                <VictoryLine
                    data={data}
                    interpolation={'natural'}
                    style={{ data: { stroke: "#2976c4", strokeWidth: 5, strokeLinecap: "round" } }}
                    labelComponent={<VictoryLabel renderInPortal dy={-10}/>}
                    labels={(datum) => datum[y]}

                    x={x}
                    y={y}
                />

            </VictoryChart>

        );

    };

    constructor(props)
    {
        super(props);

        this.state = {
            x: theX,
            y: theY,
            data: theData
        };
    }


    render() {
        return (
            <div>
                {this.getChart(this.state.x,this.state.y,this.state.data)}
            </div>
        );
    }


}


export default Graph