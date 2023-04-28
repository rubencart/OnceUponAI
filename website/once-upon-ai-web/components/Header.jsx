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
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "next-i18next";

const Hide = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
`;

const Header = () => {
  const { t } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const navItems = [
    { name: "nav_start_tour", path: "/start-your-tour" },
    // { name: "nav_discover_artworks", path: "/discover-artworks" }, // TODO: Add, if needed, at a later stage
    { name: "nav_about", path: "https://nerdlab.be/" },
    { name: "nav_faq", path: "/faq-help" },
  ];

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Top>
          <Title href="/">Once Upon AI</Title>
          <Hide>
            <Hamburger toggled={isNavOpen} toggle={handleHamburgerClick} />
          </Hide>
        </Top>
        <MenuItems>
          <NavList isOpen={isNavOpen}>
            {navItems.map((item, index) => (
              <NavItem key={index}>
                <NavLink href={item.path}>{t(item.name)}</NavLink>
              </NavItem>
            ))}

            <LanguageSwitcher />
          </NavList>
        </MenuItems>
      </HeaderContainer>
    </HeaderWrapper>
  );
};

export default Header;
