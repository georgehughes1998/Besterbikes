//The following function retrives a JSON file from public repo
export const getJSONFromFile = (jsonFilePath) => {

    return fetch(jsonFilePath)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            return JSON.stringify(myJson)
        });

};
