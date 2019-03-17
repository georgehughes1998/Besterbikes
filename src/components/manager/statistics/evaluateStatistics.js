const getDailySum = (individualStat, y, m, d) =>{
    let daily = individualStat[y][m][d];
    return Number(daily)
};

const getMonthlySum = (individualStat, y, m) => {
    let sum = 0;

    Object.values(individualStat[y][m]).map((d) => {
        sum += d;
    });
    return sum;
};

const getYearlySum = (individualStat, y) =>{
    let sum = 0;
    Object.values(individualStat[y]).map((m) => {
        Object.values(m).map((d) => {
            sum += d;
        })

    });
    return sum;
};

const sumFirestoreStatObj = (individualStat, timescale, y, m, d) => {

    switch (timescale){
        case "Daily":
            return getDailySum(individualStat, y, m, d);
        case "Monthly":
            return getMonthlySum(individualStat, y, m);
        case "Yearly":
            return getYearlySum(individualStat, y);

    }
};

export const getIndividualValues = ({retrievedStatistics, timescale, y, m, d}) => {

    let keys = Object.keys(retrievedStatistics);
    let groupStatisticArray = [];

    Object.values(retrievedStatistics).map((individualStat, index) => {
        groupStatisticArray.push({name: keys[index], value: sumFirestoreStatObj(individualStat, timescale, y, m, d)})
    });

    return groupStatisticArray;
};