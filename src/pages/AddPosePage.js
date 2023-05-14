import {useState} from "react";
import PoseFromWebcam from "../components/PoseFromWebcam";
import AddPoseForm from "../components/AddPoseForm";
import api from "../util/api";

export default function AddPosePage() {
    const [poseFromWebcam, setPoseFromWebcam] = useState(false)
    const [goals, setGoals] = useState([]);
    const [name, setName] = useState("");
    const [keypoints, setKeypoints] = useState([])

    async function submitForm() {
        await api.sendPose({name, goals, keypoints})
    }

    return (
        <div>
            { poseFromWebcam ?
                <PoseFromWebcam
                    setKeypoints={setKeypoints}
                    switchView = {() => setPoseFromWebcam(!poseFromWebcam)}
                /> :
                <AddPoseForm
                    goals={goals}
                    name={name}
                    setKeypoints={setKeypoints}
                    setGoals={setGoals}
                    setName={setName}
                    submitForm={submitForm}
                    switchView = {() => setPoseFromWebcam(!poseFromWebcam)}
                /> }
        </div>
    )
}