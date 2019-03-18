import Dropdown from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import React from "react";
import {getAccessories} from "../../firebase/accessories";
import {reduxForm} from "redux-form";
import validate from "../reservationHandling/validate";

class AccessoriesDropdown extends React.Component {

    getAccessories = (station) => {
        return getAccessories(station).then((obj) => {
            console.log(obj);
            this.setState({accessories: obj})
        });
    }

    createDropdownObject = () => {

        let DropdownArray = [];

        const station = this.props._reduxForm.values.station;

        if(station){
            this.getAccessories(station)
        }

        // if(this.state.accessories){
        //     this.props.accessories.map((key, index) => {
        //         DropdownArray.push({key: key, value: key, text: key});
        //         return DropdownArray;
        //     });
        // }

        return DropdownArray
    };

    render() {
        return (
            <Dropdown
                clearable
                selection
                search
                options={this.createDropdownObject()}
                onChange={(param, data) => this.props.onChange(data.value)}
            />
        )
    }

};

const mapStateToProps = (state) => {
    return {form: state.form}
};

export default reduxForm({
    form: 'reservebike',  //Form name is same
    destroyOnUnmount: false,
    validate
})(AccessoriesDropdown)