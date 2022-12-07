import { serverURL } from "./envVars";

export default async function sendRecording(recording) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recording)
    };
    await fetch(`${serverURL}/image`, requestOptions)
}