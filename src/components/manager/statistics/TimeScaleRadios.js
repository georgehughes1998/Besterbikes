import React from "react";
import Radio from "semantic-ui-react/dist/commonjs/addons/Radio/Radio";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid/Grid";

class TimeScaleRadios extends React.Component{

    renderRadios = () => {
        return ["Daily", "Monthly", "Yearly"].map((timescale) => {
            console.log(timescale, this.props.timescale);
            return(
                <Grid.Column>
                    <Radio
                        label={timescale}
                        name={timescale}
                        value={timescale}
                        checked={this.props.timescale === timescale}
                        onChange={(param, data) => this.props.onChange(data)}
                    />
                </Grid.Column>
            )
        })
    }

    render(){
        return (
            <Grid columns='equal'>
                {this.renderRadios()}
            </Grid>
        )
    }
};

export default TimeScaleRadios
