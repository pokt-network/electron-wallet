import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import React, { useEffect } from 'react';
import { setWindowSize } from '../../reducers/app-reducer';

export const AppContainer = ({ children }: {children: any}) => {

  const dispatch = useDispatch();
  const {
    windowWidth,
    windowHeight,
  } = useSelector(({ appState }: RootState) => appState);

  useEffect(() => {
    window.addEventListener('resize', e => {
      if(!e.target)
        return;
      const { innerWidth, innerHeight } = e.target as Window;
      dispatch(setWindowSize({innerWidth, innerHeight}));
    });
  }, [dispatch]);

  const style: React.CSSProperties = {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    left: 0,
    top: 0,
    overflowX: 'hidden',
    overflowY: 'hidden',
  };

  return (
    <div style={style}>{children}</div>
  );
}
