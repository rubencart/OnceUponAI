import React, { useState } from "react";
import styled from "@emotion/styled";

const StyledCanvas = styled.canvas`
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    filter: brightness(0.4);
`;

export default function BackgroundCanvas() {
    return (
    <StyledCanvas id="canvas" />
    );
}
