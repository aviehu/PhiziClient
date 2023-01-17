const joints = {
    "left_elbow": {
        "p1": "left_wrist",
        "p2": "left_elbow",
        "p3": "left_shoulder"
    },
    "right_elbow": {
        "p1": "right_wrist",
        "p2": "right_elbow",
        "p3": "right_shoulder"
    },
    "left_shoulder": {
        "p1": "left_elbow",
        "p2": "left_shoulder",
        "p3": "left_hip"
    },
    "right_shoulder": {
        "p1": "right_elbow",
        "p2": "right_shoulder",
        "p3": "right_hip"
    },
    "left_hip": {
        "p1": "left_shoulder",
        "p2": "left_hip",
        "p3": "left_knee"
    },
    "right_hip": {
        "p1": "right_shoulder",
        "p2": "right_hip",
        "p3": "right_knee"
    },
    "left_knee": {
        "p1": "left_hip",
        "p2": "left_knee",
        "p3": "left_ankle"
    },
    "right_knee": {
        "p1": "right_hip",
        "p2": "right_knee",
        "p3": "right_ankle"
    }
}
export default joints