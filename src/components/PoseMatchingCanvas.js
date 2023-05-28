import { sampledVideoWidth } from "../util/envVars";
import { useEffect, useRef } from "react";
import { drawUserSkeleton, drawWantedPoseSkeleton } from "../util/canvas";

export default function PoseMatchingCanvas({ cameraRatio, targetPose }) {

    const canvasRef = useRef()
    useEffect(() => {
        if (!canvasRef || !canvasRef.current || !targetPose) {
            return
        }
        const ctx = canvasRef.current.getContext('2d')
        drawWantedPoseSkeleton(ctx, targetPose, canvasRef)
    }, [canvasRef.current, targetPose])

    return (
        <canvas
            width={`${sampledVideoWidth}px`}
            height={`${sampledVideoWidth / cameraRatio}px`}
            ref={canvasRef}
            style={{
                backgroundColor:'rgba(0,0,0,0.5)',
                position: "absolute",
                zIndex: 6,
                width: 200,
                height: 200 / cameraRatio,
                marginLeft: -600,
                marginTop: -600 / cameraRatio,
                borderStyle: 'solid',
                borderColor: 'white',
                borderRadius:'5%',
            }}
        />
    )
}