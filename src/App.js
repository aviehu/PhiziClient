import AppPage from "./pages/AppPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import AppBar from './components/PhiziAppBar'
import UserProvider from './hooks/UserProvider'
import WelcomePage from './pages/WelcomePage'
import SessionPage from "./pages/SessionPage";
import AddPosePage from "./pages/AddPosePage";
import ScoresPage from "./pages/ScoresPage";
import EditUserProfile from "./components/EditUserProfile";
import backGroundImg from "./purpleBackground.jpg"
import ScorePage from "./pages/ScoresPage";

import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";



function App() {

    return (
        <Router>
            <UserProvider>
                <AppBar>
                <div style={{
                    height:'100%',
                    weight:'100%',
                    backgroundImage: `url(${backGroundImg})`,
                    backgroundRepeat: "no-repeat",
                    BackgroundPosition: 'fixed',
                    backgroundSize: "cover",
                    }}>
                    <Routes>
                        <Route path="/" Component={WelcomePage}/>
                        <Route path="/login" Component={LoginPage} />
                        <Route path="/app" Component={AppPage} />
                        <Route path="/register" Component={RegisterPage} />
                        <Route path="/poses" Component={AddPosePage} />
                        <Route path="/users" Component={UsersPage} />
                        <Route path="/sessions" Component={SessionPage} />
                        <Route path="/scores" Component={ScoresPage} />
                        <Route path="/editUserProfile" Component={EditUserProfile} />
                        <Route path="/scores" Component={ScorePage} />
                    </Routes>
                </div>
                </AppBar>
            </UserProvider>
        </Router>
    );
}

export default App;
