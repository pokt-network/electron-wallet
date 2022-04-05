import React from "react";
import ellipse from '../../images/icons/ellipse.svg';
import node from '../../images/icons/node.svg';
import stakedTokens from '../../images/icons/staked_tokens.svg';
import staked from '../../images/icons/staked.svg';
import unstaking from '../../images/icons/unstaking.svg';
import unstake from '../../images/icons/unstake.svg';
import importSVG from '../../images/icons/import.svg';
import eyeOn from '../../images/icons/eye_on.svg';
import eyeOff from '../../images/icons/eye_off.svg';
import cpu from '../../images/icons/cpu.svg';
import barChart from '../../images/icons/bar_chart.svg';
import wallet from '../../images/icons/wallet.svg';
import chevronRight from '../../images/icons/chevron-right.svg';
import target from '../../images/icons/target.svg';
import user from '../../images/icons/user.svg';
import bookOpen from '../../images/icons/book_open.svg';
import logOut from '../../images/icons/log_out.svg';
import remove from '../../images/icons/remove.svg';
import copyGreen from '../../images/icons/copy-green.svg';
import error from '../../images/icons/error.svg';
import backspace from '../../images/icons/backspace.svg';
import copyBlue from '../../images/icons/copy_blue.svg';
import locked from '../../images/icons/locked.svg';
import download from '../../images/icons/download.svg';
import send from '../../images/icons/send.svg';
import search from '../../images/icons/search.svg';
import questionCircle from '../../images/icons/question-circle.svg';
import quitCircle from '../../images/icons/quit-circle.svg';

export type IconName = "search"|"send"|"download"|"locked"|"node"|"ellipse"|"staked"|"unstaking"|"unstake"|"stakedTokens"|"import"|"eyeOn"|"eyeOff"|"cpu"|"barChart"|"wallet"|"chevronRight"|"target"|"user"|"bookOpen"|"logOut"|"remove"|"copyGreen"|"error"|"backspace"|"copyBlue"|"questionCircle"|"quitCircle"

interface IconProps {
  name: IconName
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
    eyeOff,
    cpu,
    barChart,
    wallet,
    chevronRight,
    target,
    user,
    bookOpen,
    logOut,
    remove,
    copyBlue,
    copyGreen,
    error,
    backspace,
    locked,
    download,
    send,
    search,
    questionCircle,
    quitCircle,
  };
  const src = sources[name];
  return (
    <img src={src} style={style} alt={`${name} icon`} />
  );
};
