import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";
import Container from "semantic-ui-react/dist/commonjs/elements/Container/Container";
import {getPrettyString} from "../../../dataHandling/prettyString";

class DMYDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            y: new Date().getFullYear(),
            m: new Date().getMonth()+1,
            d: new Date().getDate(),
            updateNeeded: false
        }
    };


    daysInMonth = (iMonth, iYear) => {
        const date =  new Date(iYear, iMonth, 32).getDate();
        console.log(date);
        return (32 - date);
    };

    renderDailyDropdown() {

        const days = [];
        console.log(this.state.m);
        const daysInMonth = this.daysInMonth(this.state.m - 1, this.state.y);
        console.log(daysInMonth);

        for (let d = 1; d < daysInMonth + 1; d++) {
            days.push(
                {
                    key: d,
                    text: d,
                    value: d
                }
            )
        }

        return (
            <div>
                {this.renderMonthlyDropdown()}
                <br/>

                <Dropdown
                    clearable
                    selection
                    search
                    fluid
                    value={this.state.d}
                    text={`Day: ${this.state.d}`}
                    placeholder={"Please select day"}
                    options=  {days}
                    onChange={(param, data) => this.setState({d: data.value, updateNeeded:true})}
                />
            </div>
        )
    }

    renderMonthlyDropdown() {

        const months = [];

        for (let m = 1; m < 13; m++) {
            months.push(
                {
                    key: m,
                    text: getPrettyString(m),
                    value: m
                }
            )
        }

        return (
            <div>
                {this.renderYearlyDropdown()}
                <br/>
                <Dropdown
                    clearable
                    selection
                    fluid
                    search
                    text={`Month: ${getPrettyString(this.state.m)}`}
                    value={this.state.m}
                    placeholder={"Please select month"}
                    options=  {months}
                    onChange={(param, data) => this.setState({m: data.value, updateNeeded:true})}
                />
            </div>
        )
    }

    renderYearlyDropdown() {

        const y = new Date().getFullYear();
        return (
            <Dropdown
                clearable
                selection
                search
                fluid
                text={`Year: ${this.state.y}`}
                value={this.state.y}
                placeholder={"Please select year"}
                options=  {[{
                    key: y,
                    text: y,
                    value: y
                }]}
                onChange={(param, data) => this.setState({y: data.value, updateNeeded:true})}
            />
        )
    }

    componentDidUpdate(){
        if(this.state.updateNeeded){
            switch (this.props.state.timescale) {
                case("Yearly"):
                    if(this.state.y){
                        this.props.onChange({y: this.state.y});
                        this.setState({updateNeeded: false});
                        return;
                    }
                case("Monthly"):
                    if(this.state.m){
                        this.props.onChange({m: this.state.m, y: this.state.y});
                        this.setState({updateNeeded: false});
                        return;
                    }
                case("Daily"):
                    if(this.state.d){
                        this.props.onChange({d:this.state.d, m: this.state.m, y: this.state.y});
                        this.setState({updateNeeded: false});
                        return;
                    }
            }
        }

    };

    render() {
        switch (this.props.state.timescale) {
            case("Daily"):
                return (
                    <Container>
                        {this.renderDailyDropdown()}
                    </Container>
                );
            case("Monthly"):
                return (
                    <Container>
                        {this.renderMonthlyDropdown()}
                    </Container>
                );
            case("Yearly"):
                return (
                    <Container>
                        {this.renderYearlyDropdown()}
                    </Container>
                )
        }
    }
};

export default DMYDropdown
