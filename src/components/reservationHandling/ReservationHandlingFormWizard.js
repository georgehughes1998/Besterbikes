import React, {Component, PropTypes} from 'react'
import SelectBikes from './SelectBikes'
import DateAndTime from './DateAndTime'
import Confirmation from "./ReviewOrder";
import Payment from "./Payment";

//Code from semantic UI React to handle multistep form
class ReservationHandlingFormWizard extends Component {
    constructor(props) {
        super(props);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.state = {
            page: 1
        }
    }

    nextPage() {
        this.setState({page: this.state.page + 1})
    }

    previousPage() {
        this.setState({page: this.state.page - 1})
    }

    render() {
        const {page} = this.state;

        return (<div>
                {page === 1 && <SelectBikes currentPageName="SelectBikes" onSubmit={this.nextPage}/>}
                {page === 2 && <DateAndTime currentPageName="DateAndTime" previousPage={this.previousPage} onSubmit={this.nextPage}/>}
                {page === 3 && <Confirmation currentPageName="Confirmation" previousPage={this.previousPage} onSubmit={this.nextPage}/>}
                {page === 4 && <Payment currentPageName="Payment" previousPage={this.previousPage} onSubmit={() => this.props}/>}
            </div>
        )
    }
}

export default ReservationHandlingFormWizard