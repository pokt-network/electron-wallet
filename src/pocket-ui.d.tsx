// @ts-ignore
declare module '@pokt-foundation/ui' {

  import React from 'react';

  interface MainProps {
    children?: any;
    theme?: string;
  }
  export class Main extends React.Component<any, any> {}

  const DataView: {

  }

  const textStyle: (name: string) => string;

  const TEXT_STYLES: {
    title1: {},
    title2: {},
    title3: {},
    title4: {},
  };

  const DEFAULT_FONT_FAMILY: string;
  const MONOSPACE_FONT_FAMILY: string;

  const useTheme: () => any;

  export class Button extends React.Component<any, any> {}
  export class Field extends React.Component<any, any> {}
  export class TextInput extends React.Component<any, any> {}

}
