import { calcAngles } from '../util/calc'
import get3DPositions from "../util/get3DPositions";

export default function isMatching(wantedPose, userPose) {
    const wantedPose3D = wantedPose.keypoints3D
    const userPose3D = get3DPositions(userPose[0])
    const wantedPoseAngles = calcAngles(wantedPose3D)
    const userPoseAngles = calcAngles(userPose3D)
    const ans = []
    for (let i = 0; i < wantedPoseAngles.length; i++) {
        const wantedAngle = wantedPoseAngles[i]
        const userAngle = userPoseAngles[i]
        if (wantedAngle !== -1 && userAngle === -1) {
            break
        }
        if (Math.abs(wantedAngle.angle - userAngle.angle) > 15) {
            break
        }
        if(wantedAngle !== -1) {
            ans.push(wantedAngle)
        }
    }
    console.log(ans)
    return ans
}




