// Stripe
type StripeCustomerData = {
    email: string;
    [key: string]: any
}

type StripeResponseType = {
    data: StripeCustomerData[];
    [key: string]: any
}

// Hubspot
type HubspotContactData = {
    properties: {
        email: string;
        [key: string]: any;
    }
    [key: string]: any
}

type HubspotResponseType = {
    results: HubspotContactData[];
}

// Services
type Services = "stripe" | "hubspot"

type ServiceMetaDataType = {
    apiEndpoint: string,
    throttleQueue: <Return = unknown>(fn: () => Return | Promise<Return>) => Promise<Return>;
}

type ServicesMetaDataType = {
    [key in Services]: ServiceMetaDataType;
};
