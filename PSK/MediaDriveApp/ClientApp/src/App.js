import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UploadPage from "./pages/UploadPage/UploadPage";
import HomePage from "./pages/HomePage/HomePage";
import VideosPage from "./pages/VideosPage/VideosPage";
import BinPage from "./pages/BinPage/BinPage";
import { getBuildDate } from "./utils/utils";
import withClearCache from "./ClearCache";
import packageJson from "../package.json";

const ClearCacheComponent = withClearCache(MainApp);

function App() {
    return <ClearCacheComponent />;
}

function MainApp() {
    useEffect(() => {
        console.log("Build date: " + getBuildDate(packageJson.buildDate));
    }, [])
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/upload" component={UploadPage}></Route>
                    <Route path="/videos" component={VideosPage}></Route>
                    <Route path="/bin" component={BinPage}></Route>
                    <Route path="/" component={HomePage}></Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
