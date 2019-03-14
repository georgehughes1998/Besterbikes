//The following function retrives a JSON file from public repo
export const getJSONFromFile = (jsonFilePath) => {

    return fetch(jsonFilePath, {
        headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    })
        .then(function (response) {
            console.log(response);
            // console.log(response.json());
            return response.json();
        })
        .then(function (myJson) {
            return JSON.stringify(myJson)
        });

};
