import styled from 'styled-components';
import { getTheme } from '../../utils/utils';

const StyledNavbar = styled.div`
  position: relative;
  background: ${getTheme('colors.default.gradient')};
  box-shadow: ${getTheme('shadows.regular')};

  .nav-link {
    font-size: 15px;
    font-weight: 600;
    margin-right: 32px;
    cursor: pointer;
    color: #fff;
    :hover {
      color: ${getTheme('colors.tertiary.light')} !important;
    }
  }
  .nav-link:last-child {
    margin-right: 0px;
  }

  .root-child {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 5;
  }
  .root:hover {
    .root-child {
      display: block;
    }
  }

  .child {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    z-index: 5;
  }
  .parent:hover > .child {
    display: block;
  }

  .dropdown-icon {
    color: ${getTheme('colors.text.muted')};
  }
  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

export default StyledNavbar;
