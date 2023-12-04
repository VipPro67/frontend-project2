import { NavLink, NavLinkProps } from 'react-router-dom';

type Props = NavLinkProps & {
  src: string;
  alt: string;
};

const HeaderLink = (props: Props) => {
  return (
    <NavLink
      className={({ isActive }) =>
        `${
          isActive ? 'underline text-green-900/70' : ''
        } underline-offset-2 hover:underline hover:text-green-900/60`
      }
      {...props}
    >
      <img
        src={props.src}
        alt={props.alt}
        height={20}
        width={20}
        className="mx-3"
        title={props.alt}
      />
    </NavLink>
  );
};

export default HeaderLink;
