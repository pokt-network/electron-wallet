import styled from 'styled-components';
import { useTheme } from '@pokt-foundation/ui';
import { PRIMARY_TEXT, PRIMARY_TEXT_INVERTED, PRIMARY_TEXT_RGB } from '../../constants';
import React from 'react';

// const defaultBorderWidth = 2;

const generateSizeCSS = (size: ('lg'|'md'|'sm'), hoverBorderWidth?: number): string => {
  let borderWidth = 2, width, fontSize, lineHeight, fontWeight, paddingX, paddingY;
  switch(size) {
    case 'lg':
      width = 219;
      paddingY = 16;
      paddingX = 28;
      fontSize = 16;
      lineHeight = 20;
      fontWeight = 700;
      break;
    case 'md':
      width = 196;
      paddingY = 14;
      paddingX = 28;
      fontSize = 14;
      lineHeight = 16;
      fontWeight = 700;
      break;
    case 'sm':
      width = 176;
      paddingY = 12;
      paddingX = 20;
      fontSize = 14;
      lineHeight = 16;
      fontWeight = 400;
  }
  let hoverCSS = '';
  if(hoverBorderWidth) {
    let diff = hoverBorderWidth - borderWidth;
    const hoverPaddingX = paddingX - diff;
    const hoverPaddingY = paddingY - diff;
    hoverCSS = `
  &:hover {
    border-width: ${hoverBorderWidth}px;
    padding: ${hoverPaddingY}px ${hoverPaddingX}px;
  }
`;
  }
  return `
  border-width: ${borderWidth}px;
  width: ${width}px;
  padding: ${paddingY}px ${paddingX}px;
  font-size: ${fontSize}px;
  line-height: ${lineHeight}px;
  font-weight: ${fontWeight};
${hoverCSS}
`;
};

interface ButtonBaseProps {
  backgroundColor: string
  borderColor: string
  color: string
  hoverBackgroundColor: string
  hoverBorderColor: string
  hoverColor: string
  activeBackgroundColor: string
  activeBorderColor: string
  activeColor: string
  focusBackgroundColor?: string
  focusBorderColor: string
  focusColor: string
  disabledBackgroundColor: string
  disabledBorderColor: string
  disabledColor: string
  title: string
  type: string
  style: object
  size: ('lg'|'md'|'sm')
  hoverBorderWidth?: number
}
const ButtonBase = styled.button<ButtonBaseProps>`
${({ size, hoverBorderWidth }) => generateSizeCSS(size, hoverBorderWidth)}
  cursor: pointer;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  border-color: ${({ borderColor }) => borderColor};
  border-style: solid;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  outline: none;
  box-shadow: none;
  font-style: normal;
  transition: all 50ms ease-in-out;
  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor};
    border-color: ${({ hoverBorderColor }) => hoverBorderColor};
    color: ${({ hoverColor }) => hoverColor};
    ${({ hoverBorderWidth }) => hoverBorderWidth ? `border-width: ${hoverBorderWidth}px;` : ''}
  }
  &:active {
    background-color: ${({ activeBackgroundColor }) => activeBackgroundColor};
    border-color: ${({ activeBorderColor }) => activeBorderColor};
    color: ${({ activeColor }) => activeColor};
  }
  &:focus-visible {
    ${({ focusBackgroundColor }) => focusBackgroundColor ? `background-color: ${focusBackgroundColor};`: ''}
    border-color: ${({ focusBorderColor }) => focusBorderColor};
    color: ${({ focusColor }) => focusColor};
  }
  &:disabled {
    cursor: default;
    background-color: ${({ disabledBackgroundColor }) => disabledBackgroundColor};
    border-color: ${({ disabledBorderColor }) => disabledBorderColor};
    color: ${({ disabledColor }) => disabledColor};
  }
`;

interface ButtonProps {
  children: any
  disabled?: boolean
  size?: ('lg'|'md'|'sm')
  type?: ('button'|'submit')
  style?: object
  title?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}
export const ButtonPrimary = ({ children, disabled = false, size = 'lg', style = {}, title = '', type = 'button', onClick }: ButtonProps) => {

  const theme = useTheme();

  return (
    <ButtonBase
      disabled={disabled}
      size={size}
      backgroundColor={theme.accent}
      borderColor={theme.accent}
      color={PRIMARY_TEXT}
      hoverBackgroundColor={theme.accentHover}
      hoverBorderColor={theme.accentHover}
      hoverColor={`rgba(${PRIMARY_TEXT_RGB.r}, ${PRIMARY_TEXT_RGB.g}, ${PRIMARY_TEXT_RGB.b}, .8)`}
      activeBackgroundColor={'transparent'}
      activeBorderColor={theme.accent}
      activeColor={PRIMARY_TEXT_INVERTED}
      focusBorderColor={theme.accentAlternative}
      focusColor={PRIMARY_TEXT}
      disabledBackgroundColor={'#32404f'}
      disabledBorderColor={'#32404f'}
      disabledColor={'#898d92'}
      style={style}
      title={title}
      onClick={onClick}
      type={type}>{children}</ButtonBase>
  );
};

export const ButtonSecondary = ({ children, disabled = false, size = 'lg', style = {}, title = '', type = 'button', onClick }: ButtonProps) => {

  const theme = useTheme();

  return (
    <ButtonBase
      disabled={disabled}
      size={size}
      backgroundColor={'transparent'}
      borderColor={PRIMARY_TEXT_INVERTED}
      color={PRIMARY_TEXT_INVERTED}
      hoverBackgroundColor={'transparent'}
      hoverBorderColor={PRIMARY_TEXT_INVERTED}
      hoverBorderWidth={disabled ? undefined : 4}
      hoverColor={PRIMARY_TEXT_INVERTED}
      activeBackgroundColor={'transparent'}
      activeBorderColor={theme.accent}
      activeColor={PRIMARY_TEXT_INVERTED}
      focusBorderColor={theme.accentAlternative}
      focusColor={PRIMARY_TEXT_INVERTED}
      disabledBackgroundColor={'transparent'}
      disabledBorderColor={'#32404f'}
      disabledColor={'#898d92'}
      style={style}
      title={title}
      onClick={onClick}
      type={type}>{children}</ButtonBase>
  );
};

const StyledTextButton = styled.button<{hoverBackground?: string}>`
  background: transparent;
  outline: none;
  box-shadow: none;
  border-style: none;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  cursor: pointer;
  &:hover, &:active, &:focus {
    text-decoration: ${props => props.hoverBackground ? 'none' : 'underline'};
    ${props => props.hoverBackground ? `background-color:${props.hoverBackground}` : ''}
  }
`;
export const TextButton = ({ children, hoverBackground, style = {}, title = '', type = 'button', onClick }: {children: any, type?: "button"|"submit", style?: object, hoverBackground?: string, title?: string, onClick: () => void}) => {
  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };
  return (
    <StyledTextButton style={style} hoverBackground={hoverBackground} onClick={onButtonClick} title={title} type={type}>{children}</StyledTextButton>
  );
};
