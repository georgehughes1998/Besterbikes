const getDailySum = (individualStat, y, m, d) => {
    if (individualStat[y][m]) {
        if (individualStat[y][m][d]) {
            let daily = individualStat[y][m][d];
            return Number(daily)
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

const getMonthlySum = (individualStat, y, m) => {
    if (individualStat[y]) {
        let sum = 0;

        if (individualStat[y][m]) {
            Object.values(individualStat[y][m]).map((d) => {
                sum += d;
            });

            return sum;
        } else {
            return 0
        }
    } else {
        return 0;
    }

};

const getYearlySum = (individualStat, y) => {
    if (individualStat) {
        let sum = 0;
        Object.values(individualStat[y]).map((m) => {
            Object.values(m).map((d) => {
                sum += d;
            })

        });
        return sum;
    } else {
        return 0;
    }

};

const sumFirestoreStatObj = (individualStat, timescale, y, m, d) => {

    switch (timescale) {
        case "Daily":
            if (d)
                return getDailySum(individualStat, y, m, d);
            else
                return 0;
        case "Monthly":
            if (m)
                return getMonthlySum(individualStat, y, m);
            else
                return 0;
        case "Yearly":
            if (y)
                return getYearlySum(individualStat, y);
            else
                return 0;

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