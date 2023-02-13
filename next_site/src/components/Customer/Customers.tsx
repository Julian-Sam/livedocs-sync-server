import Collapsible from "react-collapsible";
import { PrettyPrintJson } from "../PrettyPrintJson";
import { Customer } from "./types";


export function Customers({ customers }: { customers: Customer[] }) {
    return (
      <div>
        <h2 className='items-center mx-auto max-w-lg font-bold text-3xl'>Customers ({customers.length} Results)</h2>
        <ul className='items-center mx-auto max-w-lg my-5 list-disc'>
          {customers.map((el: Customer, i: number) => (
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
  