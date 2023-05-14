import AppPage from "./pages/AppPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AddPoseForm from "./components/AddPoseForm";
import AdminPage from "./pages/AdminPage";
import UsersPage from "./pages/UsersPage";
import AppBar from './components/AppBar'

import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import SessionPage from "./pages/SessionPage";
import PoseFromWebcam from "./components/PoseFromWebcam";
import AddPosePage from "./pages/AddPosePage";

function App() {

    return (
            
        <AppBar>
            <Router>
                <Routes>
                    <Route path="/" Component={LoginPage} />
                    <Route path="/app" Component={AppPage} />
                    <Route path="/register" Component={RegisterPage} />
                    <Route path="/poses" Component={AddPosePage} />
                    <Route path="/admin" Component={AdminPage} />
                    <Route path="/users" Component={UsersPage} />
                    <Route path="/sessions" Component={SessionPage} />
                    <Route path="/poses/webcam" Component={PoseFromWebcam} />
                </Routes>
            </Router>
        </AppBar>
    );
}

export default App;
