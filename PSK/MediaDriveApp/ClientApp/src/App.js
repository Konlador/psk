import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UploadPage from "./pages/UploadPage/UploadPage";
import VideosPage from "./pages/VideosPage/VideosPage";
import BinPage from "./pages/BinPage/BinPage";
import { getBuildDate } from "./utils/utils";
import withClearCache from "./ClearCache";
import packageJson from "../package.json";
import useSnackbar from "./components/Layout/Snackbars/useSnackbar";

const ClearCacheComponent = withClearCache(MainApp);

function App() {
    return <ClearCacheComponent />;
}

function MainApp() {
    const snackbar = useSnackbar();

    useEffect(() => {
        console.log("Build date: " + getBuildDate(packageJson.buildDate));
    }, [])

    let renderSnackbar = snackbar();

    return (
        <div className="App">
            {renderSnackbar}
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={VideosPage}></Route>
                    <Route path="/upload" component={UploadPage}></Route>
                    <Route path="/videos" component={VideosPage}></Route>
                    <Route path="/bin" component={BinPage}></Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
