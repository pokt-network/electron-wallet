import { MainHeader, MainHeaderTitle } from "./main-header";
import { TextButton } from "./button";
import { links } from "../../constants";
import { Header5 } from "./header";
import React, { useContext } from "react";
import { localizeContext } from "../../hooks/localize-hook";
import { APIContext } from "../../hooks/api-hook";

interface AppHeaderProps {
  title: string
}

export const AppHeader = ({ title = '' }: AppHeaderProps) => {

  const api = useContext(APIContext);
  const localize = useContext(localizeContext);

  return (
    <MainHeader>
      <MainHeaderTitle>{title}</MainHeaderTitle>
      <TextButton onClick={() => api.openExternal(links.BUY_POCKET)}>
        <Header5>{localize.text('Buy POKT', 'universal')}</Header5>
      </TextButton>
    </MainHeader>
  );
}
