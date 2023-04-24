import styled from "@emotion/styled";
import { MenuItems, NavItem } from "./styled/HeaderStyles";

const StyledFooter = styled.footer`
  background-color: #ececec;
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
  const navItems = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-and-conditions" },
    { name: "About Nerdlab", path: "/about-nerdlab" },
    { name: "FAQ & Help", path: "/faq-help" },
  ];

  return (
    <StyledFooter>
      <h1>Once Upon AI</h1>
      <MenuItems>
        <NavList>
          {navItems.map((item, index) => (
            <NavItem key={index}>
              <NavLink href={item.path}>{item.name}</NavLink>
            </NavItem>
          ))}
        </NavList>
      </MenuItems>
    </StyledFooter>
  );
}
