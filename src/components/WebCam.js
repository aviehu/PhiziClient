import Webcam from "react-webcam";
export default function WebCam() {

    return (
        <Webcam screenshotQuality={0.6} mirrored={true} videoConstraints={{facingMode: "user"}} screenshotFormat="image/jpeg">
            {({ getScreenshot }) => (
                <button
                    onClick={async () => {
                        const imageSrc = getScreenshot()
                        console.log(imageSrc)
                        const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({image: imageSrc})
                        };
                        await fetch(`http://localhost:3001/image`, requestOptions)
                    }}
                >
                    Capture photo
                </button>
            )}
        </Webcam>
    )
}