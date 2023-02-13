"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAccounts = void 0;
var fs = require('fs');
var json_data = JSON.parse(fs.readFileSync('data/userAccounts.json', 'utf8'));
exports.userAccounts = new Map(Object.entries(json_data));
