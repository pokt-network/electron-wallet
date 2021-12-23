import { FlexColumn } from './flex';

interface MainContainerProps {
  children: any
}
export const MainContainer = ({ children }: MainContainerProps) => {

  const styles = {
    container: {
      flexGrow: 1,
      paddingLeft: 45,
      paddingRight: 45,
    },
  };

  return (
    <FlexColumn style={styles.container}>
      {children}
    </FlexColumn>
  );
};
