import { createContext } from "react";
import { AddressController } from "../modules/address-controller";

export const AddressControllerContext = createContext<AddressController|null>(null);
