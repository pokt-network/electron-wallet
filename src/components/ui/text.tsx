import styled from 'styled-components';

interface BodyTextBaseProps {
  fontSize: number
}
export const BodyTextBase = styled.span<BodyTextBaseProps>`
  font-weight: 400;
  font-style: normal;
  font-size: ${({ fontSize }) => fontSize}px;
  line-height: ${({ fontSize }) => fontSize * 1.4}px;
`;

interface BodyTextProps {
  children?: any,
  style?: object
}
export const BodyText1 = ({ children, style = {} }: BodyTextProps) => (
  <BodyTextBase style={style} fontSize={16}>{children}</BodyTextBase>
);
export const BodyText2 = ({ children, style = {} }: BodyTextProps) => (
  <BodyTextBase style={style} fontSize={14}>{children}</BodyTextBase>
);
export const BodyText3 = ({ children, style = {} }: BodyTextProps) => (
  <BodyTextBase style={style} fontSize={12}>{children}</BodyTextBase>
);
export const BodyText4 = ({ children, style = {} }: BodyTextProps) => (
  <BodyTextBase style={style} fontSize={9}>{children}</BodyTextBase>
);
