import React from "react";
import ellipse from '../../images/icons/ellipse.svg';
import node from '../../images/icons/node.svg';
import stakedTokens from '../../images/icons/staked_tokens.svg';
import staked from '../../images/icons/staked.svg';
import unstaking from '../../images/icons/unstaking.svg';
import unstake from '../../images/icons/unstake.svg';
import importSVG from '../../images/icons/import.svg';
import eyeOn from '../../images/icons/eye_on.svg';
import cpu from '../../images/icons/cpu.svg';
import barChart from '../../images/icons/bar_chart.svg';
import wallet from '../../images/icons/wallet.svg';
import chevronRight from '../../images/icons/chevron-right.svg';
import target from '../../images/icons/target.svg';

interface IconProps {
  name: "node"|"ellipse"|"staked"|"unstaking"|"unstake"|"stakedTokens"|"import"|"eyeOn"|"cpu"|"barChart"|"wallet"|"chevronRight"|"target"
  style?: React.CSSProperties
}
export const Icon = ({ name, style = {} }: IconProps) => {
  const sources = {
    ellipse,
    node,
    staked,
    unstaking,
    unstake,
    stakedTokens,
    import: importSVG,
    eyeOn,
    cpu,
    barChart,
    wallet,
    chevronRight,
    target,
  };
  const src = sources[name];
  return (
    <img src={src} style={style} alt={`${name} icon`} />
  );
};
