import { serverURL } from "./envVars";

function fixRecording(recording) {
    return recording.map((rec) => {
        return rec.keypoints.reduce((prev, curr) => {
            prev[curr.part] = {
                x: curr.position.x,
                y: curr.position.y,
                score: curr.score
            }
            return prev
        }, {})
    })
}

export default async function sendRecording(recording) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fixRecording(recording))
    };
    await fetch(`${serverURL}/image`, requestOptions)
}