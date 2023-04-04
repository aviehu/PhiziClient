import ClientController from "./components/ClientController";
import RegisterPage from "./LoginPage/RegisterPage";
import LoginPage from "./LoginPage/LoginPage";
import {
    BrowserRouter as Router,
    Route,
    Routes
} from "react-router-dom";

function App() {

    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" Component={LoginPage}/>
                    <Route path="/app" Component={ClientController}/>
                    <Route path="/register" Component={RegisterPage}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
