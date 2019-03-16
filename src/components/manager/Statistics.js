import React from 'react'
import PageContainer from "../PageContainer";
import {getAuthenticationStatistics, getStatistics} from "../../firebase/statistics";
import SubmissionError from "redux-form/es/SubmissionError";

class Statistics extends React.Component {

    retrieveStatistic = async () => {
        console.log("Retrieving stat");

        const obj = await getAuthenticationStatistics(2019, 3, 12);

        if (obj) {
            console.log(obj);
            console.log(obj["authentication_signIn"]["2019"]["3"]["14"]);
            this.setState({authentication: {signIn: obj["authentication_signIn"]["2019"]["3"]["14"]}});
        } else {
            throw new SubmissionError({
                _error: obj.message
            });
        }
    };

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

    componentDidMount() {
        this.retrieveStatistic();
    }

    render() {
        return (
            <PageContainer>

            </PageContainer>
        )
    }
}

export default Statistics