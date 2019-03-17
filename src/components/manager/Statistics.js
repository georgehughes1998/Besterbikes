// import React from 'react'
// import PageContainer from "../PageContainer";
// import {getAuthenticationStatistics, getStatistics} from "../../firebase/statistics";
// import SubmissionError from "redux-form/es/SubmissionError";
// import {VictoryLine, VictoryChart, VictoryTheme, VictoryLabel} from 'victory';
//
// const data = [
//     {x: "02-03-19", y: 15},
//     {x: "03-03-19", y: 10},
//     {x: "04-03-19", y: 2},
//     {x: "05-03-19", y: 10},
//     {x: "06-03-19", y: 29},
//     {x: "07-03-19", y: 10},
//     {x: "08-03-19", y: 10},
//     {x: "09-03-19", y: 12},
//     {x: "10-03-19", y: 19},
// ];
//
// class Statistics extends React.Component {
//
//     retrieveStatistic = async () => {
//         console.log("Retrieving stat");
//
//         const obj = await getAuthenticationStatistics(2019, 3, 12);
//
//         if (obj) {
//             console.log(obj);
//             console.log(obj["authentication_signIn"]["2019"]["3"]["14"]);
//             this.setState({authentication: {signIn: obj["authentication_signIn"]["2019"]["3"]["14"]}});
//         } else {
//             throw new SubmissionError({
//                 _error: obj.message
//             });
//         }
//     };
//
//
//     getChart(xName,yName,theData) {
//
//         return (
//
//             <VictoryChart
//                 theme={VictoryTheme.grayscale}
//                 width={700} height={300}
//
//                 padding={{top: 50, bottom: 50, left: 30, right: 30}}
//                 domainPadding={20}
//             >
//
//                 <VictoryLine
//                     data={theData}
//                     interpolation={'natural'}
//                     style={{ data: { stroke: "#2976c4", strokeWidth: 5, strokeLinecap: "round" } }}
//                     labelComponent={<VictoryLabel renderInPortal dy={-10}/>}
//                     labels={(datum) => datum[yName]}
//
//                     x={xName}
//                     y={yName}
//                 />
//
//             </VictoryChart>
//
//         );
//
//     };
//
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             DMY: "daily",
//             authentication: {
//                 signIn: ""
//             },
//             date: {},
//             reports: {},
//             reservation: {},
//             station: {},
//             task: {}
//
//         };
//     }
//
//     componentDidMount() {
//         this.retrieveStatistic();
//     }
//
//
//     render() {
//         return (
//             <PageContainer>
//                 {this.getChart("x","y",data)}
//             </PageContainer>
//
//         )
//     }
// }
//
//
// export default Statistics