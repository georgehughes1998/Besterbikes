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