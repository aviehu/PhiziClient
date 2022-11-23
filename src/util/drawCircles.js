import colorMap from "./colorMap";

export default function drawCircles(ctx, positions) {
    positions.forEach((pos) => {
        ctx.beginPath();
        ctx.fillStyle = colorMap[pos.part]
        ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
        ctx.fill();
    })
}