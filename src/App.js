import AppPage from "./pages/AppPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import AppBar from './components/PhiziAppBar'

import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import SessionPage from "./pages/SessionPage";
import AddPosePage from "./pages/AddPosePage";

function App() {

    return (
        <Router>
            <AppBar>
                <Routes>
                    <Route path="/" Component={LoginPage} />
                    <Route path="/app" Component={AppPage} />
                    <Route path="/register" Component={RegisterPage} />
                    <Route path="/poses" Component={AddPosePage} />
                    <Route path="/users" Component={UsersPage} />
                    <Route path="/sessions" Component={SessionPage} />
                </Routes>
            </AppBar>
        </Router>
    );
}

export default App;
