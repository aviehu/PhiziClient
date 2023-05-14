import ClientController from "./components/ClientController";
import RegisterPage from "./LoginPage/RegisterPage";
import LoginPage from "./LoginPage/LoginPage";
import PosesPage from "./LoginPage/PosesPage";
import AdminPage from "./LoginPage/AdminPage";
import UsersPage from "./LoginPage/UsersPage";
import logo from './logo.jpeg';
import AppBar from './components/AppBar'
import Test from './components/Test'
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";
import SessionPage from "./LoginPage/SessionPage";

function App() {

    return (
            
        <AppBar>
            <Router>
                <Routes>
                    <Route path="/" Component={LoginPage} />
                    <Route path="/app" Component={ClientController} />
                    <Route path="/register" Component={RegisterPage} />
                    <Route path="/poses" Component={PosesPage} />
                    <Route path="/admin" Component={AdminPage} />
                    <Route path="/users" Component={UsersPage} />
                    <Route path="/sessions" Component={SessionPage} />
                </Routes>
            </Router>
        </AppBar>
    );
}

export default App;
