import { createContext } from 'react';
import { Localize } from '../modules/localize';

export const localizeContext = createContext(new Localize('en-US', {}));
