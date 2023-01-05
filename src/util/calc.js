// elbow, shoulder, knee, hip   
// export const anglesNum = process.env.anglesNum;
// export const anglesSet = process.env.angles;
//import fs from 'fs'
import joints from "./joints";
import {POSE_PAIRS} from "./drawLines"
// import joints from './joints.json' assert { type: 'JSON' };
//import { serverURL } from "./envVars";

// export default async function sendRecording(angles) {
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(recording)
//     };
//     await fetch(`${serverURL}/image`, requestOptions)
// }


function dist(p1, p2) {
    if(p1 != null && p2!= null){
    return Math.sqrt(
        Math.pow(p1[0] - p2[0], 2) +
        Math.pow(p1[1] - p2[1], 2) +
        Math.pow(p1[2] - p2[2], 2)
    
    )}
    return -1;
}
// Function to find the angle in 3D space
function find_angle(p1, p2, p3) {
    const ab = dist(p1, p2);
    const bc = dist(p2, p3);
    const ac = dist(p1, p3);

    const angle = (Math.pow(ab, 2) + Math.pow(bc, 2) - Math.pow(ac, 2)) / (2 * ab * bc);
    return Math.acos(angle) * (180 / Math.PI)
}


function calculate_angle(name, points,anglesJson) {
    if (points[0] == null || points[1] == null || points[2] == null) {
        return -1;
    }
    const angle = find_angle(points[0], points[1], points[2]);
    anglesJson.push({ name: name, angle: angle });

}

export function angles(body) {
    const anglesJson = [];
    
        const keys = Object.keys(joints);
        const result = keys.map((key) => {
            let joint = joints[key]
            let points = [find_coord(body, joint.p1), find_coord(body, joint.p2), find_coord(body, joint.p3)]
            calculate_angle(key, points,anglesJson)
        })
        return anglesJson


    }


function find_coord(body, p) {
    try {
        let { x, y, z } = body.find((part) => part.part === p)
        return [x, y, z]
    }
    catch {
        return null
    }
}
export function find_lengths(body){
    const lengths = [];
    
        const result = POSE_PAIRS.map((pair) => {
            const from = pair[0];
            const to = pair[1];
            const length = dist(find_coord(body,from),find_coord(body,to))
            lengths.push({ from: from, to: to, length: length});

            // let points = [find_coord(body, joint.p1), find_coord(body, joint.p2), find_coord(body, joint.p3)]
            
        })
        
        return lengths.filter((coord)=>coord.length > 0)


}