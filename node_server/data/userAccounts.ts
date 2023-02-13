var fs = require('fs');

type InputDataType = Map<string, {
    service: Services;
    access_token: string;
}>

var json_data = JSON.parse(fs.readFileSync('data/userAccounts.json', 'utf8'));
export const userAccounts = new Map(Object.entries(json_data)) as InputDataType;
