import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Customers } from '@/components/Customer/Customers';
import { Contacts } from '@/components/Contacts/Contacts';
import { useFetch } from '@/hooks/useFetch';
import { searchAPI } from '@/services/searchAPI';
import { Search } from '@/components/Search/Search';


export default function Home() {
  const { data, setData } = useFetch(searchAPI);

  return (
    <div>
      <Search data={data} setData={setData} />
      <Customers customers={data.customers} />
      <Contacts contacts={data.contacts} />
    </div>
  )
}
