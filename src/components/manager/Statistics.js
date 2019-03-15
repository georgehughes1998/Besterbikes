import React from 'react'
import PageContainer from "../PageContainer";
import {getStatistics} from "../../firebase/statistics";
import SubmissionError from "redux-form/es/SubmissionError";

class Statistics extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            DMY: "daily",
            authentication: {
                signIn: ""
            },
            date: {},
            reports: {},
            reservation: {},
            station: {},
            task: {}

        };
    }

    retrieveStatistic = async () => {
        console.log("Retrieving stat");

        const obj = await getStatistics(["authentication_signIn"], 2019, 3, 12);

        if (obj) {
            console.log(obj);
            console.log(obj["authentication_signIn"]["2019"]["3"]["14"]);
            this.setState({authentication: {signIn : obj["authentication_signIn"]["2019"]["3"]["14"]}});
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

    componentDidMount(){
        this.retrieveStatistic();
    }

    render(){
        return(
            <PageContainer>

            </PageContainer>
        )
    }
}

export default Statistics