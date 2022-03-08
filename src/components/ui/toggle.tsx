import toggleOn from '../../images/toggle-on.svg';
import toggleOff from '../../images/toggle-off.svg';
import { useContext } from "react";
import { localizeContext } from "../../hooks/localize-hook";
import { TextButton } from "./button";
import { FlexRow } from "./flex";
import React from 'react';

interface ToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean)=>void
  style?: React.CSSProperties
}
export const Toggle = ({ enabled, onToggle, style ={} }: ToggleProps) => {

  const localize = useContext(localizeContext);

  return (
    <TextButton onClick={() => onToggle(!enabled)} style={style}>
      <FlexRow wrap={'nowrap'} justifyContent={'center'} alignItems={'center'}>
        <img src={enabled ? toggleOn : toggleOff} alt={enabled ? localize.text('Enabled', 'universal') : localize.text('Disabled', 'universal')} />
      </FlexRow>
    </TextButton>
  );
};
