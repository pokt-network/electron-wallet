import circle from '../../images/big-shapes/circle.svg';
import square from '../../images/big-shapes/square.svg';
import triangle from '../../images/big-shapes/triangle.svg';

export type BigShapeType = "circle"|"square"|"triangle"

interface BigShapeProps {
  size?: "md"|"lg"
  name: BigShapeType
  style?: object
}
export const BigShape = ({ name, size = 'md', style = {}}: BigShapeProps) => {
  const sources = {
    circle,
    square,
    triangle
  };
  return (
    <img alt={name} style={style} src={sources[name]} />
  );
};
