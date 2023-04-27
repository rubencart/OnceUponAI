import styled from "@emotion/styled";
import Link from "next/link";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

export const BackButton = styled(Link)`
  border: 1px solid black;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
`;

export const Content = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, max-content);  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  grid-row: 1 / span 2;
`;

export const RightBlock = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto; /* Define the height of the first row based on its content */
  flex-direction: column;
  gap: 16px; 
  max-height: 100%;
`;

export const ArtworkSidebar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: scroll;
  max-height: 743px;
`;

export const Title = styled.h2`
  margin-bottom: 8px;
`;

export const Description = styled.p`
  display: flex;
  column-count: 2;
  column-gap: 16px;
`;

export const RouteContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: end;
  gap: 8px;
`;

export const SaveRoutebutton = styled.button`
  align-self: flex-end;
  padding: 8px 16px;
  cursor: pointer;
`;
