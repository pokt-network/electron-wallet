import React from 'react';
import { useTheme } from '@pokt-foundation/ui';

interface CardProps {
  children?: any
  style?: React.CSSProperties
}
export const Card = ({ children, style = {} }: CardProps) => {

  const poktTheme = useTheme();
  const { backgroundInverted } = poktTheme;

  const combinedStyle = {
    backgroundColor: `rgba(${backgroundInverted.r}, ${backgroundInverted.g}, ${backgroundInverted.b}, .05)`,
    ...style,
  };

  return (
    <div style={combinedStyle}>{children}</div>
  );
};
