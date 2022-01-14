import { FlexRow } from './flex';
import React from 'react';
import { useTheme } from '@pokt-foundation/ui';
import { TextButton } from './button';
import { BodyText2 } from './text';

interface SwitcherProps {
  labels: string[]
  selected: number;
  onChange: (idx: number) => void
}
export const Switcher = ({ labels, selected, onChange }: SwitcherProps) => {

  const theme = useTheme();

  return (
    <FlexRow justifyContent={'space-evenly'}>
      {labels
        .map((label, idx) => {
          const style = {
            paddingTop: 16,
            paddingBottom: 16,
            textAlign: 'center',
            borderTopStyle: 'solid',
            borderTopWidth: 2,
            borderTopColor: idx === selected ? theme.accent : '#32404f',
            flexGrow: 1,
            flexBasis: '1px',
          };
          const onClick = () => {
            onChange(idx);
          };
          return (
            <TextButton key={idx + label} style={style as React.CSSProperties} onClick={onClick}><BodyText2>{label}</BodyText2></TextButton>
          );
        })
      }
    </FlexRow>
  );
};
