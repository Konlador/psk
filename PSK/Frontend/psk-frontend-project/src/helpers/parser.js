//parses response from server
export default class Parser {
    static parseArray(names, data){
        let parsedData = [];

        for(let i = 0; i < data.length; i++) {
            let parsedRow = {};
            Object.keys(data[i]).forEach(key => {
                if(names.includes(key)){
                    parsedRow[key] = data[i][key];
                }
            });
            parsedData.push(parsedRow);
        }

        return parsedData;
    }
}

