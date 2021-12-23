import { createContext } from 'react';
import { MasterPasswordUtils } from '../modules/master-password';

export const masterPasswordContext = createContext<{masterPassword: MasterPasswordUtils|null, setMasterPassword: (masterPassword: MasterPasswordUtils|null) => void}>({
  masterPassword: null,
  setMasterPassword: () => {}
});
