//Minimum age to use the system
export const minAgeLimit = 16;

//Get the current date as a string
export const getCurrentDateString = () => {
    const time = new Date();

    const currentDate = ("0" + time.getDate()).slice(-2) + "-" +
        ("0" + (time.getMonth() + 1)).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        time.getFullYear();

    return currentDate;
};

//Get the current time as a string
export const getCurrentTimeString = () => {
    const time = new Date();

    const currentTime =
        ("0" + time.getHours()).slice(-2)
        + ":" +
        ("0" + time.getMinutes()).slice(-2);

    return currentTime;
};

//Get the given date as a string
export const getDateString = (dateObject) => {

    const currentDate = ("0" + dateObject.getDate()).slice(-2) + "-" +
        ("0" + (dateObject.getMonth() + 1)).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        dateObject.getFullYear();

    return currentDate;

};

//Get the given time as a string
export const getTimeString = (dateObject) => {

    const currentTime =
        ("0" + dateObject.getHours()).slice(-2)
        + ":" +
        ("0" + dateObject.getMinutes()).slice(-2);

    return currentTime;

};

//Get the current day of the month
export const getDay = () => {
    const time = new Date();
    return time.getDate();
};

//Get the current month
export const getMonth = () => {
    const time = new Date();
    return time.getMonth() + 1; //For some reason, January is 0 so adding one for consistency
};

//Get the current year
export const getYear = () => {
    const time = new Date();
    return time.getFullYear();
};


//Function to ensure a given birth date is old enough to use the system
export const validateDateOfBirth = (dateOfBirthString) => {

    //Parse the given date as a number
    const dateOfBirth = Date.parse(dateOfBirthString);

    //If null, then no date was given so throw an error
    if (!dateOfBirth)
        throw new Error("Invalid date of birth.");

    //Get the current time and subtract the age limit from its year
    const time = new Date();
    time.setFullYear(time.getFullYear() - minAgeLimit);

    //Throw an error if the date given is more recent than the result of subtracting
    if (dateOfBirth > time)
        throw new Error(`You must be ${minAgeLimit} or older to use the system.`);

};


//Get the current date string but backwards because React forms require American date format
//when setting initial values for fields.
export const getBackwardCurrentDateString = () => {
    const time = new Date();

    const currentDate = time.getFullYear() + "-" +
        ("0" + (time.getMonth() + 1)).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        ("0" + time.getDate()).slice(-2);

    return currentDate;
};