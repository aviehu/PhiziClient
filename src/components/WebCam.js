import Webcam from "react-webcam";
import Canvas from "./Canvas";
import {useEffect, useState} from "react";

export default function WebCam() {
    const [positions, setPoisitions] = useState({})

    async function onClickHandler(getScreenshot) {
        const imageSrc = getScreenshot({width: 1920, height: 1080});
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({image: imageSrc})
        };
        const response = await fetch(`http://localhost:3001/image`, requestOptions)
        const ans = JSON.parse(await response.json())
        setPoisitions(ans)
    }

    return (
        <div style={{position:"relative"}}>
            <Webcam style={{zIndex:0, width:"640", height:"480", position:"absolute", left:0, top:0}} screenshotQuality={0.5} mirrored={true} videoConstraints={{facingMode: "user"}} screenshotFormat="image/jpeg">
                {({ getScreenshot }) => (
                    <button style={{position:"absolute", zIndex:10}} onClick={() => onClickHandler(getScreenshot)}>
                        Capture photo
                    </button>
                )}
            </Webcam>
            <Canvas positions={positions}></Canvas>
        </div>

    )
}