import { TextButton } from "./button";
import { FlexRow } from "./flex";
import { Icon, IconName } from "./icon";
import React from "react";

interface InputRightButtonProps {
  icon: IconName
  style?: object
  onClick: ()=>void
}
export const InputRightButton = ({ icon, style, onClick }: InputRightButtonProps) => {

  const styles = {
    flexRow: {
      height: 52,
      marginTop: -30,
      marginRight: -22,
      width: 52
    },
  };

  if(style)
    Object.assign(styles.flexRow, style);

  return (
    <TextButton onClick={onClick}>
      <FlexRow justifyContent={'center'} alignItems={'center'} style={styles.flexRow}>
        <Icon name={icon} />
      </FlexRow>
    </TextButton>
  );
};
