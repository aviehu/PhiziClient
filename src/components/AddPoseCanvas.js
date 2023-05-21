import { sampledVideoWidth } from "../util/envVars";
import { useEffect, useRef } from "react";
import { drawWantedPoseSkeleton } from "../util/canvas";

export default function AddPoseCanvas({ cameraRatio, targetPose }) {

    const canvasRef = useRef()
    useEffect(() => {
        if (!canvasRef || !canvasRef.current || !targetPose) {
            return
        }
        const ctx = canvasRef.current.getContext('2d')
        drawWantedPoseSkeleton(ctx, targetPose, canvasRef)
    }, [canvasRef.current])

    return (
        <canvas width={`${sampledVideoWidth}px`} height={`${sampledVideoWidth / cameraRatio}px`} ref={canvasRef} style={{ zIndex: 6, width: 800, height: 800 / cameraRatio, marginLeft: -800 }} />
    )
}