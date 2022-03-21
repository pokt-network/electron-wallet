import React from 'react';

interface MainBodyProps {
  children: any
}
export const MainBody = ({ children }: MainBodyProps) => {

  const styles = {
    container: {
      flexGrow: 1,
      // paddingTop: 41,
      // paddingLeft: 25,
      position: 'relative',
    },
    innerContainer: {
      position: 'absolute',
      left: 25,
      right: 0,
      top: 41,
      bottom: 0
    },
  };
  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.innerContainer as React.CSSProperties}>{children}</div>
    </div>
  );
};
