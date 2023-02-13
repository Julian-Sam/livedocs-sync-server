import { useEffect, useState } from "react";
import { ResponseType } from './types'

export const useFetch = (getData: (query: string) => Promise<any>) => {
    const [data, setData] = useState<ResponseType>({
        slug: "",
        customers: [],
        contacts: []
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const fetchData = async () => {
                try {
                    const res = await getData(data.slug);
                    setData({ ...data, contacts: res.contacts, customers: res.customers });
                } catch (err) {
                    console.error(err);
                }
            };
            fetchData();
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [data.slug]);

    return { data, setData };
};

