import { MainHeader, MainHeaderTitle } from "./main-header";
import { TextButton } from "./button";
import { activeViews, links } from "../../constants";
import { Header5 } from "./header";
import React, { useContext, useState } from "react";
import { localizeContext } from "../../hooks/localize-hook";
import { APIContext } from "../../hooks/api-hook";
import { Icon } from "./icon";
import { FlexRow } from "./flex";
import { Card } from "./card";
import { BodyText3 } from "./text";
import { masterPasswordContext } from "../../hooks/master-password-hook";
import { MasterPassword } from "../../modules/master-password";
import { useDispatch } from "react-redux";
import { setActiveView } from '../../reducers/app-reducer';

interface AppHeaderProps {
  title: string
}

export const AppHeader = ({ title = '' }: AppHeaderProps) => {

  const [ showProfileDropdown, setShowProfileDropdown ] = useState(false);

  const styles = {
    profileButtonContainer: {
      marginLeft: 49,
      position: 'relative',
    },
    profileIconContainer: {
      height: 30,
    },
    card: {
      width: 269,
      // height: 98,
      borderRadius: 10,
      position: 'absolute',
      top: 42,
      right: -10,
      // zIndex: 2000,
      background: 'linear-gradient(180deg, #121C25 0%, #2C313C 100%)',
    },
    dropdownFlexRow: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 18,
      paddingBottom: 18,
    },
    dropdownButton1: {
      width: '100%',
      borderRadius: 10,
    },
    dropdownButton2: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 10,
    }
  };

  const dispatch = useDispatch();
  const api = useContext(APIContext);
  const localize = useContext(localizeContext);
  const { setMasterPassword } = useContext(masterPasswordContext);

  const onProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };
  const onLogOutClick = () => {
    setShowProfileDropdown(false);
    setMasterPassword(MasterPassword(''));
    dispatch(setActiveView({activeView: activeViews.START}));
  };
  const onAddressBookClick = () => {
    setShowProfileDropdown(false);
    dispatch(setActiveView({activeView: activeViews.ADDRESS_BOOK}));
  };

  return (
    <MainHeader>
      <MainHeaderTitle>{title}</MainHeaderTitle>
      <TextButton onClick={() => api.openExternal(links.BUY_POCKET)}>
        <Header5>{localize.text('Buy POKT', 'universal')}</Header5>
      </TextButton>
      <div style={styles.profileButtonContainer as React.CSSProperties}>
        <TextButton onClick={onProfileClick}>
          <FlexRow justifyContent={'center'} alignItems={'center'} style={styles.profileIconContainer}>
            <Icon name={'user'} />
          </FlexRow>
        </TextButton>
        {showProfileDropdown ?
          <Card noBackgroundColor={true} style={styles.card as React.CSSProperties}>
            <div>
              <TextButton style={styles.dropdownButton1} onClick={onLogOutClick}>
                <FlexRow justifyContent={'space-between'} style={styles.dropdownFlexRow}>
                  <BodyText3>{localize.text('Log out', 'universal')}</BodyText3>
                  <Icon name={'logOut'} />
                </FlexRow>
              </TextButton>
            </div>
            <div>
              <TextButton style={styles.dropdownButton2} onClick={onAddressBookClick}>
                <FlexRow justifyContent={'space-between'} style={styles.dropdownFlexRow}>
                  <BodyText3>{localize.text('Address Book', 'universal')}</BodyText3>
                  <Icon name={'bookOpen'} />
                </FlexRow>
              </TextButton>
            </div>
          </Card>
          :
          null
        }
      </div>
    </MainHeader>
  );
}
