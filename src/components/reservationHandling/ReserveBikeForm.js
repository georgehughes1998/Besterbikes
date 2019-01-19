import React, { Component, PropTypes } from 'react'
import SelectBikes from './SelectBikes'
import DateAndTime from './DateAndTime'
import Confirmation from "./ReviewOrder";
import Payment from "./Payment";

//Code from semantic UI React to handle multistep form
class ReserveBikeForm extends Component {
    constructor(props) {
        super(props);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.state = {
            page: 1
        }
    }
    nextPage() {
        this.setState({ page: this.state.page + 1 })
    }

    previousPage() {
        this.setState({ page: this.state.page - 1 })
    }

    render() {
        const { onSubmit } = this.props;
        const { page } = this.state;

        return (<div>
                {page === 1 && <SelectBikes onSubmit={this.nextPage}/>}
                {page === 2 && <DateAndTime previousPage={this.previousPage} onSubmit={this.nextPage}/>}
                {page === 3 && <Confirmation previousPage={this.previousPage} onSubmit={this.nextPage}/>}
                {page === 4 && <Payment previousPage={this.previousPage} onSubmit={onSubmit}/>}
            </div>
        )
    }
}

export default ReserveBikeForm