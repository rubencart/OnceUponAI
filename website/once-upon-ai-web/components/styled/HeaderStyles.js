import styled from "@emotion/styled";

export const HeaderWrapper = styled.header`
  min-height: 80px;
  padding: 1rem 2rem;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeaderContainer = styled.header`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
  }
`;

export const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MenuItems = styled.nav`
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.a`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const NavList = styled.ul`
  text-align: center;
  display: flex;
  list-style: none;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    flex-direction: column;
    margin-top: ${(props) => (props.isOpen ? "16px" : "")};
    gap: 4px;
  }
`;

export const NavItem = styled.li`
  border-bottom: 3px solid transparent;

  &:hover {
    border-bottom: 2px solid black;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-bottom: 0.5rem;
  }
`;

export const NavLink = styled.a`
  color: #333;
  text-decoration: none;
  font-weight: bold;
`;
