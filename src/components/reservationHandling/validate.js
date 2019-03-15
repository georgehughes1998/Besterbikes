//TODO: Implement app wide vaidation
const validate = values => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = 'First name is required'
    }
    if (!values.lastName) {
        errors.lastName = 'Surname is required'
    }
    if (!values.email) {
        errors.email = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if(!values.station){
        errors.station = "You must select a valid station to reserve a bike"
    }

    if(!values.mountainBikes && !values.regularBikes){
        errors.regularBikes = "You must select at least 1 bike to rent"
    }

    //TODO: Fix error that is preventing this from showing
    if(!values.startDate) {
        errors.startDate = "You must select a valid start date for your reservation"
    }

    if(!values.startTime) {
        errors.startTime = "You must select a valid start time for your reservation"
    }

    if(!values.startTime && !values.startDate) {
        errors.startTime = "You must select a valid start date and time for your reservation"
    }

    //TODO: Refactor Georges duplicate code
    const startTimeDate = Date.parse(values.startDate + " " + values.startTime);
    const currentTime = new Date();

    if(startTimeDate < currentTime){
        errors.startTime = "Cannot book a reservation in the past"
    }

    if(startTimeDate > (new Date).setHours(currentTime.getHours() + 24)){
        errors.startTime = "Cannot book a reservation more than 24 hours ahead"
    }

    return errors
};

export default validate