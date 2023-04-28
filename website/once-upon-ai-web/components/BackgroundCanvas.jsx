import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';

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
  //   console.log("init BackgroundCanvas");
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [idleTimeoutId, setIdleTimeoutId] = useState(null);
	const [requestId, setRequestId] = useState(null);
  const createBackground = () => {
    console.log('createBackground');

    if (!canvasRef.current) {
      console.log('window undefined');
      return;
    }

    const CanvasWidth = window.innerWidth;
    const CanvasHeight = window.innerHeight;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let  grad = null;
    let  color = 255;

		const drawGradient = (x, y) => {
			console.log(CanvasWidth, CanvasHeight);
			ctx.fillStyle = 'rgba(78,119,191,1)';
			ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
			// x = Math.round(x);
			// y = Math.round(y);
			try {
				grad = ctx.createRadialGradient(x, y, 0, x + 100, y + 100, 250);
			} catch (e) {
				// console.log(e);
				grad = ctx.createRadialGradient(
					CanvasWidth / 2,
					CanvasHeight / 2,
					0,
					CanvasWidth / 2 + 100,
					CanvasHeight / 2 + 100,
					250
				);
			}
			// grad = ctx.createRadialGradient(0, 0, 64, 128, 64, 320);
			grad.addColorStop(0, 'rgba(247,223,137,1)');
			grad.addColorStop(1, 'rgba(255,255,255,0)');
			//   console.log(CanvasHeight, CanvasWidth);
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
		};
	
		const handleMouseMove = (evt) => {
			const { x, y } = getMousePos(canvas, evt);
			drawGradient(x, y)
			setMousePosition({ x, y });
			setIsMouseMoving(true);
			drawGradient(x, y);
			clearTimeout(idleTimeoutId);
		};
	
		const handleMouseIdle = () => {
			setIsMouseMoving(false);
			setIdleTimeoutId(null);
			const bounceBack = () => {
				const { x, y } = mousePosition;
				console.log(x, y)
				const nextX = x;
				const nextY = y;
				drawGradient(nextX, nextY);
				if (!isMouseMoving) {
					setIdleTimeoutId(requestAnimationFrame(bounceBack));
					//setTimeout(bounceBack, 100)
				}
			};
			requestAnimationFrame(bounceBack);
		};
		const getMousePos = (canvas, evt) => {
			var rect = canvas.getBoundingClientRect(), // abs. size of element
				scaleX = canvas.width / rect.width, // relationship bitmap vs. element for x
				scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y
	
			return {
				x: Math.round((evt.clientX - rect.left) * scaleX), // scale mouse coordinates after they have
				y: Math.round((evt.clientY - rect.top) * scaleY), // been adjusted to be relative to element
			};
	
			
		};
		document.addEventListener("mousemove", handleMouseMove);
    setIdleTimeoutId(setTimeout(handleMouseIdle, 500));

    drawGradient(mousePosition.x, mousePosition.y);

    // return () => {
    //   clearTimeout(idleTimeoutId);
    //   document.removeEventListener("mousemove", handleMouseMove);
    // };
	};
  

  useEffect(() => {
    createBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <StyledCanvas ref={canvasRef} id='canvas' />;
}
