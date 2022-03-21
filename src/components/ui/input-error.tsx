import { FlexRow } from "./flex";
import { Icon } from "./icon";
import { BodyText1 } from "./text";
import { useTheme } from '@pokt-foundation/ui';
import React from 'react';

interface InputErrorMessageProps {
  message: string
  style?: object
}
export const InputErrorMessage = ({ message, style }: InputErrorMessageProps) => {

  const poktTheme = useTheme();
  const { error } = poktTheme;

  const styles = {
    flexRow: {
      marginBottom: 10,
    },
  };

  if(style)
    Object.assign(styles.flexRow, style);

  return (
    <FlexRow style={styles.flexRow} justifyContent={'flex-start'} alignItems={'center'} wrap={'nowrap'} gap={'10px'}>
      <Icon name={'error'} />
      <BodyText1 style={{color: error}}>{message}</BodyText1>
    </FlexRow>
  );
}
