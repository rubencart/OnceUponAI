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
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const LeftBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const RightBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Title = styled.h2`
  margin-bottom: 8px;
`;

export const Description = styled.p`
  display: flex;
  column-count: 2;
  column-gap: 16px;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Artwork = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-image: url("your-image-url-here");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;

  background-color: lightgrey;
`;

export const Distance = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  font-size: 0.8rem;
`;

export const ArtworkTitle = styled.h3`
  margin: auto;
  align-self: center;
`;

export const MoreInfoButton = styled.button`
  align-self: center;
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
