import { Contact } from "@/components/Contacts/types";
import { Customer } from "@/components/Customer/types";

export interface ResponseType {
  slug: string;
  customers: Customer[];
  contacts: Contact[];
}
