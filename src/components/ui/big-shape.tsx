import circle from '../../images/big-shapes/circle.svg';
import circleLg from '../../images/big-shapes/circle-lg.svg';
import square from '../../images/big-shapes/square.svg';
import squareLg from '../../images/big-shapes/square-lg.svg';
import triangle from '../../images/big-shapes/triangle.svg';
import triangleLg from '../../images/big-shapes/triangle-lg.svg';

export type BigShapeType = "circle"|"square"|"triangle"

interface BigShapeProps {
  size?: "md"|"lg"
  name: BigShapeType
  style?: object
}
export const BigShape = ({ name, size = 'md', style = {}}: BigShapeProps) => {
  const sources = {
    circle: size === 'lg' ? circleLg : circle,
    square: size === 'lg' ? squareLg : square,
    triangle: size === 'lg' ? triangleLg : triangle,
  };
  return (
    <img alt={name} style={style} src={sources[name]} />
  );
};
