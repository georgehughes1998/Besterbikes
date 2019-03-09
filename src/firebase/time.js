export const getCurrentDateString = () =>
{
    const time = new Date();

    const currentDate = time.getFullYear() + "-" +
        ("0" + time.getMonth()).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        ("0" + time.getDay()).slice(-2);

    return currentDate;
};

export const getCurrentTimeString = () =>
{
    const time = new Date();

    const currentTime =
        ("0" + time.getHours()).slice(-2)
        + ":" +
        ("0" + time.getMinutes()).slice(-2);

    return currentTime;
};

export const getDateString = (dateObject) => {

    const currentDate = dateObject.getFullYear() + "-" +
        ("0" + dateObject.getMonth()).slice(-2) //slice(-2) returns the last two chars of the string
        + "-" +
        ("0" + dateObject.getDay()).slice(-2);

    return currentDate;

};

export const getTimeString = (dateObject) => {

    const currentTime =
        ("0" + dateObject.getHours()).slice(-2)
        + ":" +
        ("0" + dateObject.getMinutes()).slice(-2);

    return currentTime;

};


export const getDay = () =>
{
    const time = new Date();

    return time.getDay();
};


export const getMonth = () =>
{
    const time = new Date();

    return time.getMonth();
};


export const getYear = () =>
{
    const time = new Date();

    return time.getFullYear();
};