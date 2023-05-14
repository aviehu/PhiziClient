
// export default function Test(){
//     const webcamRef = useRef(null)
//     return(
//         <div style={{position: 'absolute', backgroundColor: 'red', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
//             <Webcam
//                     ref={webcamRef}
//                     style={{ zIndex: 0, position: "absolute", left: 0, top: 0 }}
//                     mirrored={true}
//                     videoConstraints={{ facingMode: "user", width: sampledVideoWidth, height: sampledVideoWidth / cameraRatio, }}
//                     width={250}
//                     height={250 / cameraRatio}
//                 >
//             </Webcam>
//             <div style={{backgroundColor: 'blue', width: 400, height: 400 }}>
            
//                 {/* <canvas width={`${sampledVideoWidth}px`} height={`${sampledVideoWidth / cameraRatio}px`} ref={canvasRef} style={{ zIndex: 5, position: "absolute", left: 0, top: 0, width: clientWebcamRef.current.video.clientWidth, height: clientWebcamRef.current.video.clientHeight, objectFit: 'contain' }} /> */}
//             </div>

//         </div>
//     )
// }