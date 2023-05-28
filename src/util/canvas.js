import colorMap from "./colorMap";
import { POSE_PAIRS } from "./pairs";
import get2DPositions from "./get2DPositions";

export function clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
}

export function drawLines(ctx, positions, color) {
    POSE_PAIRS.forEach((pair) => {
        const from = pair[0]
        const to = pair[1]
        const fromPoint = positions.find((pos) => pos.part === from)
        const toPoint = positions.find((pos) => pos.part === to)
        if (fromPoint && toPoint) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(fromPoint.x, fromPoint.y)
            ctx.lineTo(toPoint.x, toPoint.y)
            ctx.stroke()
        }
    })
}

export function drawCircles(ctx, positions, matchingJoints) {
    function isMatching(pos) {
        return matchingJoints.find((matchingJoint) => pos.part === matchingJoint.name)
    }
    positions.forEach((pos) => {
        ctx.beginPath();
        ctx.fillStyle =  matchingJoints && isMatching(pos) ? 'rgb(2,248,19)' : 'rgb(255,223,0)'
        ctx.arc(pos.x, pos.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    })
}

export function drawUserSkeleton(ctx, positions, canvasRef, matchingJoints) {
    if (positions) {
        const poses2D = get2DPositions(positions)
        clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
        drawLines(ctx, poses2D, "rgb(26,255,255)")
        drawCircles(ctx, poses2D, matchingJoints)
    }
}

export function drawWantedPoseSkeleton(ctx, positions, canvasRef) {
    if (positions) {
        clearCanvas(ctx, canvasRef.current.width, canvasRef.current.height)
        drawLines(ctx, positions, "rgb(255,0,127)")
        drawCircles(ctx, positions)
    }
}
