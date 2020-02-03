import React from "react";
import {
  exhibit,
  container,
  wrapper,
  info,
  title as title_,
  subtitle as subtitle_,
  date as date_,
  link as link_
} from "./exhibit.module.css";
import ExternalLinkIcon from "../images/external-link.svg";

interface ExhibitProps {
  title: string;
  subtitle: string;
  date: string;
  src?: string;
  custom?: React.ReactElement;
  link?: {
    href: string;
    text: string;
  };
}

const Exhibit: React.FC<ExhibitProps> = ({
  title,
  subtitle,
  date,
  src,
  custom,
  link
}) => {
  return (
    <div className={container}>
      <div className={wrapper}>
        <div className={info}>
          <div className={title_}>{title}</div>
          <div className={subtitle_}>{subtitle}</div>
          <div className={date_}>{date}</div>
          {link && (
            <div className={link_}>
              <a href={link.href}>{link.text}</a>
              <ExternalLinkIcon />
            </div>
          )}
        </div>
        {custom ? custom : <iframe className={exhibit} src={src}></iframe>}
      </div>
    </div>
  );
};

export default Exhibit;
