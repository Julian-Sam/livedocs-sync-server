import Collapsible from "react-collapsible";
import { PrettyPrintJson } from "../PrettyPrintJson";
import { Contact } from "./types";



export function Contacts({ contacts }: { contacts: Contact[] }) {
    return (
        <div>
            <h2 className='items-center mx-auto max-w-lg font-bold text-3xl'>Contacts ({contacts.length} Results)</h2>
            <ul className='items-center mx-auto max-w-lg my-5 list-disc'>
                {contacts.map((el: Contact, i: number) => (
                    <li className="my-4" key={i}>
                        <Collapsible trigger={<button className='rounded-lg'> {el.email}</button>}>
                            {<PrettyPrintJson data={el} />}
                        </Collapsible>
                    </li>
                ))}
            </ul>
        </div>
    );
}
