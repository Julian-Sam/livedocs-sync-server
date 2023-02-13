"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = void 0;
const throttled_queue_1 = __importDefault(require("throttled-queue"));
const exponential_backoff_1 = require("exponential-backoff");
const userAccounts_1 = require("../../data/userAccounts");
function isStripeResponse(service, response) {
    return service === 'stripe';
}
function isHubspotResponse(service, response) {
    return service === 'hubspot';
}
function responseCallback(name, service, response) {
    if (isStripeResponse(service, response)) {
    }
    else if (isHubspotResponse(service, response)) {
        const x = response.results;
    }
}
const servicesMetaData = {
    stripe: {
        apiEndpoint: "https://api.stripe.com/v1/customers",
        throttleQueue: (0, throttled_queue_1.default)(100, 1500),
        responseCallback: responseCallback
    },
    hubspot: {
        apiEndpoint: "https://api.hubapi.com/crm/v3/objects/contacts",
        throttleQueue: (0, throttled_queue_1.default)(150, 1500),
        responseCallback: responseCallback
    }
};
// Use our stripe/hubspot mock server for dev
if (process.env.ENVIRONMENT !== 'production') {
    servicesMetaData.stripe.apiEndpoint = 'http://127.0.0.1:8000/stripe-api/';
    servicesMetaData.hubspot.apiEndpoint = 'http://127.0.0.1:8000/hubspot-api/';
}
const sync = () => {
    const fetchAPI = (endpoint, access_token) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            })
                .then(response => {
                // Fails the promise on a throttle response, so we can retry the request
                // (Usually fetch() does not reject the promise if there is a response, but we 
                // need the promise to fail so we can retry the request on a throttle response)
                if (response.status === 429) {
                    console.error("thrrotle");
                    reject({ error: "Throttled!" });
                }
                return response;
            })
                .then((response) => response.json())
                .then(data => resolve(data))
                .catch(error => {
                console.error("Invalid response");
                reject(error);
            });
        });
    });
    const getData = (serviceMetadata, access_token) => __awaiter(void 0, void 0, void 0, function* () {
        // Throttle queue will input the action into a queue and run as per stated throttle rate
        return serviceMetadata.throttleQueue(() => {
            // Perform 3 retries with exponential backoff in case the request fails
            return (0, exponential_backoff_1.backOff)(() => fetchAPI(serviceMetadata.apiEndpoint, access_token), {
                jitter: 'full',
                numOfAttempts: 3,
                maxDelay: 1500
            });
        });
    });
    for (const [name, { service, access_token }] of userAccounts_1.userAccounts) {
        const serviceMetadata = servicesMetaData[service];
        getData(serviceMetadata, access_token)
            .then((response) => serviceMetadata.responseCallback(name, service, response))
            .catch((err) => console.log(`Could not sync data for user ${name}! (${err.message || err})`));
    }
};
exports.sync = sync;
