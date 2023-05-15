import {calcAngles} from '../util/calc'
import get3DPositions from "../util/get3DPositions";

export default function isMatching(wantedPose, userPose) {
    const wantedPoseAngles = calcAngles(get3DPositions(wantedPose))
    const userPoseAngles = calcAngles(get3DPositions(userPose))
    for (let i = 0; i < wantedPoseAngles.length; i++) {
        if (Math.abs(wantedPoseAngles[i].angle - userPoseAngles[i].angle) > 15) {
            return false
        }
    }
    return true
}




