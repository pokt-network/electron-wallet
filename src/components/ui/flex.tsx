import React from 'react';

interface FlexOptions {
  wrap?: ('nowrap'|'wrap'|'wrap-reverse')
  justifyContent?: ('flex-start'|'flex-end'|'center'|'space-between'|'space-around'|'space-evenly')
  alignItems?: ('stretch'|'flex-start'|'flex-end'|'center')
  gap?: string
}

interface FlexProps extends FlexOptions {
  direction: ('row'|'row-reverse'|'column'|'column-reverse')
  children?: any
  style?: React.CSSProperties
}
const Flex = (props: FlexProps) => {
  const {
    children,
    style = {},
    direction = 'row',
    wrap = 'nowrap',
    justifyContent = 'flex-start',
    alignItems = 'stretch',
    gap = '0',
  } = props;
  const combinedStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent,
    alignItems,
    gap,
    ...style,
  };
  return (
    <div style={combinedStyle}>{children}</div>
  );
};

export interface FlexColRowProps extends FlexOptions {
  children?: any
  style?: React.CSSProperties
}
export const FlexColumn = (props: FlexColRowProps) => {
  return (
    <Flex direction={'column'} {...props} />
  );
};
export const FlexRow = (props: FlexColRowProps) => {
  return (
    <Flex direction={'row'} {...props} />
  );
};
