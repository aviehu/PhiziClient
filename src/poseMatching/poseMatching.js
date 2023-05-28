import {calcAngles, findAngle} from '../util/calc'
import get3DPositions from "../util/get3DPositions";

export default function isMatching(wantedPoseAngles, userPose) {
    const userPose3D = get3DPositions(userPose[0])
    const userPoseAngles = calcAngles(userPose3D)
    const ans = []
    for (let i = 0; i < wantedPoseAngles.length; i++) {
        const wantedAngle = wantedPoseAngles[i]
        const userAngle = userPoseAngles[i]
        if ((wantedAngle !== -1 && userAngle === -1)
        ||  Math.abs(wantedAngle.angle - userAngle.angle) > 15
        ||  findAngle(wantedAngle.normal, [0,0,0], userAngle.normal) > 20) {
            console.log(findAngle(wantedAngle.normal, [0,0,0], userAngle.normal))
            break
        }
        if(wantedAngle !== -1) {
            ans.push(wantedAngle)
        }
    }
    return ans
}

// function getNormalVector(p1, p2, p3) {
//     const v1 = new THREE.Vector3().subVectors(p2, p1);
//     const v2 = new THREE.Vector3().subVectors(p3, p1);
//     const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();
//     return normal;
// }