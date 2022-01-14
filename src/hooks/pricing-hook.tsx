import { createContext } from 'react';
import { Pricing } from '../modules/pricing';

export const PricingContext = createContext(new Pricing({}));
