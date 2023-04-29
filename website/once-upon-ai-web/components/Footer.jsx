import styled from "@emotion/styled";
import { MenuItems, NavItem, Title } from "./styled/HeaderStyles";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "next-i18next";

const StyledFooter = styled.footer`
  padding: 1rem 2rem;
  text-align: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
	align-items: center;
  * {
    font-size: 0.85rem;
  }
`;

const SponsorDiv = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
	justify-content: center;
	height: 50px;
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: right;
  }
`;

const NavList = styled.ul`
  text-align: center;
  display: flex;
  list-style: none;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: right;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
`;

export default function Footer() {
  const { t } = useTranslation();
  const navItems = [
    // { name: "privacy_policy", path: "/privacy-policy" }, // TODO: Add?
    // { name: "terms_and_conditions", path: "/terms-and-conditions" }, // TODO: Add?
    { name: "nav_about", path: "/about-nerdlab" },
    { name: "nav_faq", path: "/faq-help" },
  ];

  return (
    <StyledFooter>
      <Title href="/">Once Upon AI by Nerdlab</Title>
      <SponsorDiv> 
        <a href="https://uia-initiative.eu/en" target="_blank" style={{ height: "100%"}}><img src="/logo-europa.png" alt="logo-collectie" style={{ height: "100%", borderRadius: "50px" }}/></a>
        <a href="https://www.collectie.gent/" target="_blank" style={{ height: "100%"}}><img src="/logo-collectie.jpg" alt="logo-europa" style={{ height: "100%", borderRadius: "50px" }}/></a>
      </SponsorDiv>
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
