import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";
import {Form} from "semantic-ui-react";

class DMYDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    };

    renderYearlyDropdown() {

        const y = new Date().getFullYear();
        return (
            <Dropdown
                clearable
                selection
                search
                value={this.state.y}
                placeholder={"Please select year"}
                options=  {[{
                    key: y,
                    text: y,
                    value: y
                }]}
                onChange={(param, data) => this.setState({y: data.value})}
            />
        )
    }

    componentDidUpdate(){
        switch (this.props.state.timescale) {
            case("Yearly"):
                if(this.state.y){
                    this.props.onChange({y: this.state.y});
                    return
                }

        }
    };

    render() {
        switch (this.props.state.timescale) {
            case("Daily"):
                return (
                    <div>
                        Daily
                    </div>
                )
            case("Monthly"):
                return (
                    <div>
                        Monthly
                    </div>
                )
            case("Yearly"):
                return (
                    <Form>
                        {this.renderYearlyDropdown()}
                    </Form>
                )
        }
    }
};

export default DMYDropdown
