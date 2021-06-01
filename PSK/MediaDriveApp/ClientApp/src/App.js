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
import LoginPage from "./pages/LoginPage/LoginPage";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

const ClearCacheComponent = withClearCache(MainApp);

function App() {
  return <ClearCacheComponent />;
}
function ProtectedRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={VideosPage}></Route>
      <Route path="/upload" component={UploadPage}></Route>
      <Route path="/videos" component={VideosPage}></Route>
      <Route path="/bin" component={BinPage}></Route>
    </Switch>
  );
}
function UnprotectedRoutes() {
  return (
    <Switch>
      <Route path="/videos" component={LoginPage}></Route>
      {/* Pakeisti i login */}
    </Switch>
  );
}

function MainApp() {
  const snackbar = useSnackbar();

  useEffect(() => {
    console.log("Build date: " + getBuildDate(packageJson.buildDate));
  }, []);

  let renderSnackbar = snackbar();

  return (
    <div className="App">
      {renderSnackbar}

      <BrowserRouter>
         <AuthenticatedTemplate> 
          <ProtectedRoutes />
         </AuthenticatedTemplate> 
         <UnauthenticatedTemplate>
          <UnprotectedRoutes />
        </UnauthenticatedTemplate> 
      </BrowserRouter>
    </div>
  );
}

export default App;
