import throttledQueue from 'throttled-queue';
import { backOff } from "exponential-backoff";
import { userAccounts } from "../../../data/userAccounts"
import { isStripeResponse, saveStripeResponseToDB } from "./stripe"
import { isHubspotResponse, saveHubspotResponseToDB } from "./hubspot"

const responseCallback = (name: string, service: Services, response: unknown) => {
  if (isStripeResponse(service, response)) {
    saveStripeResponseToDB(name, response);
  }
  else if (isHubspotResponse(service, response)) {
    saveHubspotResponseToDB(name, response);
  }
}

const servicesMetaData: ServicesMetaDataType = {
  stripe: {
    apiEndpoint: "https://api.stripe.com/v1/customers",
    throttleQueue: throttledQueue(100, 1000, true), // at most 100 requests per second
  },
  hubspot: {
    apiEndpoint: "https://api.hubapi.com/crm/v3/objects/contacts",
    throttleQueue: throttledQueue(150, 1000, true), // at most 150 requests per second
  }
}

// Use our stripe/hubspot mock server for dev
if (process.env.ENVIRONMENT !== 'production') {
  servicesMetaData.stripe.apiEndpoint = 'http://127.0.0.1:8000/stripe-api/';
  servicesMetaData.hubspot.apiEndpoint = 'http://127.0.0.1:8000/hubspot-api/';
}

export const sync = () => {
  const fetchAPI = async (endpoint: string, access_token: string) => {
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
            console.error("thrrotle")
            reject({ error: "Throttled!" });
          }
          return response;
        })
        .then((response) => response.json())
        .then(data => resolve(data))
        .catch(error => {
          console.error("Invalid response")
          reject(error)
        })
    });
  }

  const getData = async (serviceMetadata: ServiceMetaDataType, access_token: string) => {
    // Throttle queue will input the action into a queue and run as per stated throttle rate
    return serviceMetadata.throttleQueue(() => {
      // Perform 3 retries with exponential backoff in case the request fails
      return backOff(() => fetchAPI(serviceMetadata.apiEndpoint, access_token), {
        jitter: 'full',  // include randomness in retry delay
        numOfAttempts: 3,
        maxDelay: 1500
      });
    });
  }


  for (const [name, { service, access_token }] of userAccounts) {
    const serviceMetadata = servicesMetaData[service as keyof typeof servicesMetaData];
    getData(serviceMetadata, access_token)
      .then((response) => responseCallback(name, service, response))
      .catch((err) => console.log(`Could not sync data for user ${name}! (${err.message || err})`))
  }
}




