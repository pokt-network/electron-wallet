import * as uuid from 'uuid';

export interface AddressItemData {
  id?: string
  name: string
  address: string
}

export class AddressItem {

  id: string;
  name: string;
  address: string;

  constructor(data: AddressItemData) {
    this.id = data.id || uuid.v4();
    this.name = data.name || '';
    this.address = data.address || '';
  }

  toObject(): AddressItemData {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
    };
  }

}
