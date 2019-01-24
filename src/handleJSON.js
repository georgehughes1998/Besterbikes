
//The following function retrives a JSON file from public repo
export const getJSONFromFile = (jsonFilePath) => {
    fetch(jsonFilePath)
        .then(async (response) => {
            const JSON = await response.json();
            return JSON;
        })
};