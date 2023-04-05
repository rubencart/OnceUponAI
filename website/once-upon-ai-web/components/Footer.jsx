import styled from "@emotion/styled";
import { MenuItems, NavItem, NavLink } from "./styled/HeaderStyles";

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

export const NavList = styled.ul`
  text-align: center;
  display: flex;
  list-style: none;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: right;
  }
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
