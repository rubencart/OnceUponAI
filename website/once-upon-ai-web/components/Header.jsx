import React, { useState } from "react";
import {
  HeaderContainer,
  Top,
  Title,
  NavList,
  NavItem,
  NavLink,
  MenuItems,
  HeaderWrapper,
} from "./styled/HeaderStyles";
import styled from "@emotion/styled";
import Hamburger from "hamburger-react";

const Hide = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const navItems = [
    { name: "Start Your Tour", path: "/start-your-tour" },
    { name: "Discover Artworks", path: "/discover-artworks" },
    { name: "About Nerdlab", path: "/about-nerdlab" },
    { name: "FAQ & Help", path: "/faq-help" },
  ];

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Top>
          <Title>Once Upon AI</Title>
          <Hide>
            <Hamburger toggled={isNavOpen} toggle={handleHamburgerClick} />
          </Hide>
        </Top>
        <MenuItems>
          <NavList isOpen={isNavOpen}>
            {navItems.map((item, index) => (
              <NavItem key={index}>
                <NavLink href={item.path}>{item.name}</NavLink>
              </NavItem>
            ))}
          </NavList>
        </MenuItems>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
