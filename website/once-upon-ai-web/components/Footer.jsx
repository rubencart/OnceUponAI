import styled from "@emotion/styled";
import { MenuItems, NavItem, Title } from "./styled/HeaderStyles";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "next-i18next";

const StyledFooter = styled.footer`
  /* background-color: #ececec; */
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;

  * {
    font-size: 0.85rem;
  }
`;

const NavList = styled.ul`
  text-align: center;
  display: flex;
  list-style: none;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: right;
  }
`;

const NavLink = styled.a`
  color: #333;
  text-decoration: none;
`;

export default function Footer() {
  const { t } = useTranslation();
  const navItems = [
    { name: "privacy_policy", path: "/privacy-policy" },
    { name: "terms_and_conditions", path: "/terms-and-conditions" },
    { name: "nav_about", path: "/about-nerdlab" },
    { name: "nav_faq", path: "/faq-help" },
  ];

  return (
    <StyledFooter>
      <Title href="/">Once Upon AI by Nerdlab</Title>
      <MenuItems>
        <NavList>
          {navItems.map((item, index) => (
            <NavItem key={index}>
              <NavLink href={item.path}>{t(item.name)}</NavLink>
            </NavItem>
          ))}
          <LanguageSwitcher />
        </NavList>
      </MenuItems>
    </StyledFooter>
  );
}
