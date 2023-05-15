import { calcAngles } from '../util/calc'
import get3DPositions from "../util/get3DPositions";

export default function isMatching(wantedPose, userPose) {
    console.log("Entered isMatching")
    const wantedPoseAngles = calcAngles(get3DPositions(wantedPose))
    console.log("got wanted pose angles")
    const userPoseAngles = calcAngles(get3DPositions(userPose))
    console.log("got uaer pose angles")
    for (let i = 0; i < wantedPoseAngles.length; i++) {
        const wantedAngle = wantedPoseAngles[i]
        const userAngle = userPoseAngles[i]
        if (wantedAngle !== -1 && userAngle === -1) {
            return false
        }
        if (Math.abs(wantedAngle.angle - userAngle.angle) > 15) {
            return false
        }
    }
    return true
}




