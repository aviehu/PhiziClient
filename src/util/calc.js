import joints from "./joints";
import { LENGTH_PAIRS } from "./pairs";

export function dist(p1, p2) {
    if (p1 != null && p2 != null) {
        return Math.sqrt(
            Math.pow(p1[0] - p2[0], 2) +
            Math.pow(p1[1] - p2[1], 2) +
            Math.pow(p1[2] - p2[2], 2)
        )
    }
    return -1;
}

export function findCoord(body, p) {
    try {
        const { x, y, z } = body.find((part) => part.part === p)
        return [x, y, z]
    }
    catch {
        return null
    }
}

export function findAngle(p1, p2, p3) {
    const ab = dist(p1, p2);
    const bc = dist(p2, p3);
    const ac = dist(p1, p3);
    const angle = (Math.pow(ab, 2) + Math.pow(bc, 2) - Math.pow(ac, 2)) / (2 * ab * bc);
    return Math.acos(angle) * (180 / Math.PI)
}

export function calculateAngle(name, points) {
    if (!points[0] || !points[1] || !points[2]) {
        return -1;
    }
    const angle = findAngle(points[0], points[1], points[2]);
    return { name, angle }
}

export function calcAngles(positions) {
    const keys = Object.keys(joints);
    const result = keys.map((key) => {
        const joint = joints[key]
        const points = [findCoord(positions, joint.p1), findCoord(positions, joint.p2), findCoord(positions, joint.p3)]
        return calculateAngle(key, points)
    })
    return result
}

export function calcLengths(positions) {
    const result = LENGTH_PAIRS.map((pair) => {
        const from = pair[0];
        const to = pair[1];
        const length = dist(findCoord(positions, from), findCoord(positions, to))
        return { from, to, length }
    })
    return result.filter((coord) => coord.length > 0)
}
