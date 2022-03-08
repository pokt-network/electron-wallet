import { Subject } from "rxjs";
import { AddressItem, AddressItemData } from "./address-item";
import * as uuid from 'uuid';

export class AddressController {

  _addresses: AddressItem[] = [];

  events = {
    addressesChanged: new Subject<AddressItem[]>(),
    addressCreated: new Subject<AddressItem>(),
    addressDeleted: new Subject<string>(),
  };

  addAddress(addressData: AddressItemData, newAddress = false): void {
    const address = new AddressItem(addressData);
    if(newAddress)
      this.events.addressCreated.next(address);
    this._addresses.push(address);
    this.events.addressesChanged.next(this.getAddresses());
  }

  createAddress(name: string, address: string): string {
    const id = uuid.v4();
    this.addAddress({id, name, address}, true);
    return id;
  }

  deleteAddress(id: string): boolean {
    const idx = this._addresses.findIndex(a => a.id === id);
    if(idx < 0)
      return false;
    this._addresses.splice(idx, 1);
    this.events.addressDeleted.next(id);
    this.events.addressesChanged.next(this.getAddresses());
    return true;
  }

  getAddresses(): AddressItem[] {
    return [...this._addresses];
  }

}
