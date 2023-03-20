export default async function getCameraRatio() {
    const features = {
        audio: true,
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    };
    const display = await navigator.mediaDevices.getUserMedia(features);
    const settings = display.getVideoTracks()[0].getSettings();
    return settings.width / settings.height
}