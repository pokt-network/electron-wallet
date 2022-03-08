import React from 'react';
import { useTheme } from '@pokt-foundation/ui';

interface CardProps {
  children?: any
  round?: boolean
  style?: React.CSSProperties
  noBackgroundColor?: boolean
}
export const Card = ({ children, noBackgroundColor = false, round = false, style = {} }: CardProps) => {

  const poktTheme = useTheme();
  const { backgroundInverted } = poktTheme;

  let combinedStyle = {
    ...(!noBackgroundColor ? {backgroundColor: `rgba(${backgroundInverted.r}, ${backgroundInverted.g}, ${backgroundInverted.b}, .05)`} : {}),
    borderRadius: round ? 10 : 0,
    ...style,
  };

  return (
    <div style={combinedStyle}>{children}</div>
  );
};
