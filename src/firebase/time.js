export const minAgeLimit = 16;

export const getCurrentDateString = () => {
    const time = new Date();

    const currentDate = ("0" + time.getDate()).slice(-2) + "-" +
        ("0" + (time.getMonth()+1)).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        time.getFullYear();

    return currentDate;
};

export const getCurrentTimeString = () => {
    const time = new Date();

    const currentTime =
        ("0" + time.getHours()).slice(-2)
        + ":" +
        ("0" + time.getMinutes()).slice(-2);

    return currentTime;
};

export const getDateString = (dateObject) => {

    const currentDate = ("0" + dateObject.getDate()).slice(-2) + "-" +
        ("0" + (dateObject.getMonth()+1)).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        dateObject.getFullYear();

    return currentDate;

};

export const getTimeString = (dateObject) => {

    const currentTime =
        ("0" + dateObject.getHours()).slice(-2)
        + ":" +
        ("0" + dateObject.getMinutes()).slice(-2);

    return currentTime;

};


export const getDay = () => {
    const time = new Date();
    return time.getDate();
};


export const getMonth = () => {
    const time = new Date();
    return time.getMonth()+1;
};


export const getYear = () => {
    const time = new Date();
    return time.getFullYear();
};


export const validateDateOfBirth = (dateOfBirthString) => {

    const dateOfBirth = Date.parse(dateOfBirthString);

    if (!dateOfBirth)
        throw new Error("Invalid date of birth.");

    const time = new Date();
    time.setFullYear(time.getFullYear()-minAgeLimit);

    if (dateOfBirth > time)
        throw new Error(`You must be ${minAgeLimit} or older to use the system.`);

};