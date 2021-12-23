interface MainBodyProps {
  children: any
}
export const MainBody = ({ children }: MainBodyProps) => {

  const styles = {
    container: {
      flexGrow: 1,
      paddingTop: 41,
      paddingLeft: 25,
    },
  };
  return (
    <div style={styles.container}>{children}</div>
  );
};
