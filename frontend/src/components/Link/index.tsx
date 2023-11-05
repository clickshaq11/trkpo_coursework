import { ComponentPropsWithRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Link.module.scss';

function StyledLink(props: ComponentPropsWithRef<typeof Link>) {
  return (
    <Link {...props} className={`${styles.link} ${props.className}`}></Link>
  );
}

export { StyledLink };
