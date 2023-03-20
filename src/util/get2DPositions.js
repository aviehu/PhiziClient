import {sampledVideoWidth, scoreThreshold} from "./envVars";

export default function get2DPositions(poses) {
    const positions = poses.keypoints.filter((pos) => pos.score > scoreThreshold)
    return positions.map((pos) => {
        return {
            part: pos.name,
            x: sampledVideoWidth - pos.x,
            y: pos.y,
            z: pos.z
        }
    })
}
