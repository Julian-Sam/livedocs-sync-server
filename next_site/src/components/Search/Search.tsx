import { Dispatch, SetStateAction } from "react";
import { ResponseType } from '../../hooks/types'

export function Search({ data, setData }: { data: ResponseType, setData: Dispatch<SetStateAction<ResponseType>> }) {
    return (
        <input
            className='flex items-center mx-auto max-w-lg w-1/2 my-10 border-b-2 border-grey focus:border-black focus:outline-none'
            type="search"
            onChange={(e) => setData({ ...data, slug: e.target.value })}
            placeholder="Search email ..."
        />
    );
};