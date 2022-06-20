import { TextButton } from '../ui/button';
import { links } from '../../constants';
import { Header5 } from '../ui/header';
import React, { useContext } from 'react';
import { APIContext } from '../../hooks/api-hook';
import { localizeContext } from '../../hooks/localize-hook';

export const BuyPoktButton = () => {

  const api = useContext(APIContext);
  const localize = useContext(localizeContext);

  return (
    <TextButton onClick={() => api.openExternal(links.BUY_POCKET)}>
      <Header5>{localize.text('Buy POKT', 'universal')}</Header5>
    </TextButton>
  );
};
