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
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  position: relative;
  border: 1.5px solid white;
  padding: 8px 32px;
  overflow: hidden;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -o-transition: all 1s ease;
  transition: all 1s ease;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
  &:before,
  &:after {
    content: "";
    aspect-ratio: 1 / 1;
    height: calc(3px + 100%);
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1.5px solid white;
    position: absolute;
    box-sizing: border-box;
  }
  &:after {
    right: 0;
    transform: translate(50%, 0px);
  }
  &:before {
    left: 0;
    transform: translate(-50%, 0px);
  }
`;

export const Content = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, max-content);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(0, max-content);
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

  @media (max-width: 768px) {
    display: none;
  }
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
  cursor: pointer;
  font-family: "Mazius Review Extra", sans-serif;
  background-color: transparent;
  color: white;
  margin-top: 8px;
  box-sizing: border-box;
  position: relative;
  border: 1.5px solid white;
  padding: 8px 32px;
  text-align: center;
  overflow: hidden;
  -webkit-transition: all 1s ease;
  -moz-transition: all 1s ease;
  -o-transition: all 1s ease;
  transition: all 1s ease;

  &:hover {
    opacity: 0.67;
    transform: scale(0.95);
  }
  &:before,
  &:after {
    content: "";
    aspect-ratio: 1 / 1;
    height: calc(3px + 100%);
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    border: 1.5px solid white;
    position: absolute;
    box-sizing: border-box;
  }
  &:after {
    right: 0;
    transform: translate(50%, -9.5px);
  }
  &:before {
    left: 0;
    transform: translate(-50%, -9.5px);
  }
`;
