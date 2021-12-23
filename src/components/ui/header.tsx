import styled from 'styled-components';

const baseHeaderStyles = (fontSize: number) => `
  font-weight: 700;
  font-style: normal;
  font-size: ${fontSize}px;
  line-height: ${fontSize * 1.1}px;
`;

export const Header1 = styled.h1`
${baseHeaderStyles(50)}
`;
export const Header2 = styled.h2`
${baseHeaderStyles(48)}
`;
export const Header3 = styled.h3`
${baseHeaderStyles(36)}
`;
export const Header4 = styled.h4`
${baseHeaderStyles(24)}
`;
export const Header5 = styled.h5`
${baseHeaderStyles(18)}
`;
