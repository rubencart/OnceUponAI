const pageLoad = () => {
    let CanvasWidth = window.innerWidth;
    let CanvasHeight = window.innerHeight;

    let canvas = document.getElementsByTagName('canvas')[0],
        ctx = null,
        grad = null,
        color = 255;

    if (canvas.getContext('2d')) {
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
        ctx.fillStyle = 'rgba(78,119,191,1)';
        ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
        grad = ctx.createRadialGradient(0, 0, 64, 128, 64, 320);
        grad.addColorStop(0, 'rgba(247,223,137,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;

        ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);

        document.addEventListener('mousemove', function (evt) {
            let {
                x,
                y
            } = getMousePos(canvas, evt);
            console.log(x, y);
            ctx.fillStyle = 'rgba(78,119,191,1)';
            ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
            x = Math.round(x);
            y = Math.round(y);
            try{
                grad = ctx.createRadialGradient(x, y, 0, x + 100, y + 100, 250);
            }catch(e){
                console.log(e);
                grad = ctx.createRadialGradient(CanvasWidth/2, CanvasHeight/2, 0, CanvasWidth/2 + 100, CanvasHeight/2 + 100, 250);
            }
            // grad = ctx.createRadialGradient(0, 0, 64, 128, 64, 320);
            grad.addColorStop(0, 'rgba(247,223,137,1)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            console.log(CanvasHeight, CanvasWidth)
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);
        }, false);
    }
}

const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width, // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y

    return {
        x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
    }
}


document.onload = pageLoad();