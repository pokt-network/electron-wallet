import { MONOSPACE_FONT_FAMILY, TEXT_STYLES } from '@pokt-foundation/ui';

const textStyleToObj = (obj: object): object => Object
  .entries(obj)
  .filter(([key, val]) => key !== 'fontWeight')
  .map(([key, val]) => {
    switch(key) {
      case 'size':
        return ['fontSize', val];
      case 'weight':
        return ['fontWeight', val];
      case 'transform':
        return ['textTransform', val];
      case 'lineHeight':
        return ['lineHeight', val];
      case 'monospace':
        return ['fontFamily', `"${MONOSPACE_FONT_FAMILY}", monospace`];
      default:
        return [key, val];
    }
  })
  .filter(arr => arr)
  .reduce((obj: object, [key, val]) => ({
    ...obj,
    [key]: val,
  }), {});

export const textStyle = (key: string): object => {
  // @ts-ignore
  const obj = TEXT_STYLES[key] || {};
  return textStyleToObj(obj);
};
