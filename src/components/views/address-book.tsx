import React, { useContext, useState } from 'react';
import { Sidebar } from '../ui/sidebar';
import { FlexRow } from '../ui/flex';
import { MainContainer } from '../ui/main-container';
import { localizeContext } from '../../hooks/localize-hook';
import { AppHeader } from "../ui/app-header";
import { TextInput, useTheme } from "@pokt-foundation/ui";
import { MainBody } from "../ui/main-body";
import * as _ from 'lodash';
import { BodyText2 } from "../ui/text";
import { Icon } from "../ui/icon";
import { TextButton } from "../ui/button";
import { ModalConfirm } from "../ui/modal-confirm";
import { Header5 } from "../ui/header";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AddressControllerContext } from "../../hooks/address-hook";
import { APIContext } from "../../hooks/api-hook";

export const AddressBook = () => {

  const [ filterText, setFilterText ] = useState('');
  const [ showConfirmDeleteModal, setShowConfirmDeleteModal ] = useState(false);
  const [ selectedAddressId, setSelectedAddressId ] = useState('');

  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const theme = useTheme();
  const {
    addresses,
  } = useSelector(({ appState }: RootState) => appState);
  const addressController = useContext(AddressControllerContext);

  const styles = {
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    inputContainer: {
      display: 'block',
      width: 808,
      maxWidth: '100%',
    },
    listContainer: {
      display: 'block',
      width: 808,
      maxWidth: '100%',
    },
    listItem: {
      listStyleType: 'none',
    },
    listItemRow: {
      paddingLeft: 40,
      paddingRight: 20,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: '#32404F',
      height: 60,
    },
    col1: {
      width: 200,
      minWidth: 200,
    },
    col2: {
      flexGrow: 1,
      color: theme.accent,
    },
    col3: {

    },
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilterText(e.target.value);
  };

  const trimmedFilterText = filterText.trim();

  const filterPatt = new RegExp(
    trimmedFilterText
      .toLowerCase()
      .split(/\s+/g)
      .map(s => s.trim())
      .map(s => _.escapeRegExp(s))
      .join('\\s+')
  );

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const onDeleteClick = (id: string) => {
    setSelectedAddressId(id);
    setShowConfirmDeleteModal(true);
  };
  const onDeleteModalCancel = () => {
    setShowConfirmDeleteModal(false);
    setSelectedAddressId('');
  };
  const onDeleteModalConfirm = () => {
    setShowConfirmDeleteModal(false);
    setSelectedAddressId('');
    addressController?.deleteAddress(selectedAddressId);
  };

  const onAddressCopy = (address: string) => {
    api.copyToClipboard(address);
  };

  return (
    <FlexRow style={styles.container as React.CSSProperties}>
      <Sidebar />
      <MainContainer>
        <AppHeader title={localize.text('Address Book', 'addressBook')} />
        <MainBody>
          <div style={styles.inputContainer}>
            <TextInput type={'text'} value={filterText} onChange={onInputChange}
                       placeholder={localize.text('Enter name to filter addresses', 'addressBook')}
                       wide={true} autofocus={true} />
          </div>
          <div style={styles.listContainer}>
            <FlexRow justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'} style={styles.listItemRow as React.CSSProperties}>
              <Header5 style={styles.col1}>{localize.text('Name', 'addressBook')}</Header5>
              <Header5>{localize.text('Address', 'addressBook')}</Header5>
            </FlexRow>
            <ul>
              {addresses
                .filter(a => trimmedFilterText ? filterPatt.test(a.name.toLowerCase()) : true)
                .map(a => {
                  return (
                    <li key={a.id} style={styles.listItem as React.CSSProperties}>
                      <FlexRow justifyContent={'flex-start'} wrap={'nowrap'} alignItems={'center'} style={styles.listItemRow as React.CSSProperties}>
                        <BodyText2 style={styles.col1}>{a.name}</BodyText2>
                        <FlexRow style={styles.col2} justifyContent={'flex-start'} alignItems={'center'}>
                          <BodyText2 style={{marginRight: 18}}>{a.address}</BodyText2>
                          <TextButton onClick={() => onAddressCopy(a.address)} title={localize.text('Copy address', 'addressBook')}>
                            <FlexRow justifyContent={'center'} alignItems={'center'}>
                              <Icon name={'copyGreen'} />
                            </FlexRow>
                          </TextButton>
                        </FlexRow>
                        <TextButton style={styles.col3} title={localize.text('Delete address', 'addressBook')} onClick={() => onDeleteClick(a.id)}>
                          <FlexRow justifyContent={'center'} alignItems={'center'}>
                            <Icon name={'remove'} />
                          </FlexRow>
                        </TextButton>
                      </FlexRow>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </MainBody>
        {showConfirmDeleteModal ?
          <ModalConfirm title={localize.text('Delete Address', 'addressBook')} text={localize.text('Are you sure you want to delete {{name}}-{{address}} from the address book?', 'addressBook', {name: selectedAddress?.name, address: selectedAddress?.address.slice(-4)})} confirmButtonText={localize.text('Delete', 'addressBook')} onCancel={onDeleteModalCancel} onConfirm={onDeleteModalConfirm} />
          :
          null
        }
      </MainContainer>
    </FlexRow>
  );
}
