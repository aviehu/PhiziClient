import {scoreThreshold} from "./envVars";

export default function get3DPositions(poses) {
    const positions2 = poses.keypoints3D.filter((pos) => pos.score > scoreThreshold)
    return  positions2.map((pos) => {
        return {
            part: pos.name,
            x: pos.x * -1,
            y: pos.y,
            z: pos.z
        }
    })
}