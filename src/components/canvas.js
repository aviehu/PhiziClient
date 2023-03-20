import colorMap from "../util/colorMap";
import {POSE_PAIRS} from "../util/pairs";

export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0,0, width, height)
}

export function drawLines(ctx, positions) {
    POSE_PAIRS.forEach((pair) => {
        const from = pair[0]
        const to = pair[1]
        const fromPoint = positions.find((pos) => pos.part === from)
        const toPoint = positions.find((pos) => pos.part === to)
        if(fromPoint && toPoint) {
            ctx.strokeStyle = "rgb(26,255,255)";
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(fromPoint.x, fromPoint.y)
            ctx.lineTo(toPoint.x, toPoint.y)
            ctx.stroke()
        }
    })
}

export function drawCircles(ctx, positions) {
    positions.forEach((pos) => {
        ctx.beginPath();
        ctx.fillStyle = colorMap[pos.part]
        ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    })
}
