import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UploadPage from "./pages/UploadPage/UploadPage";
import HomePage from "./pages/HomePage/HomePage";
import VideosPage from "./pages/VideosPage/VideosPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/upload" component={UploadPage}>
            <UploadPage></UploadPage>
          </Route>
          <Route path="/videos" component={VideosPage}>
            <VideosPage></VideosPage>
          </Route>
          <Route path="/" component={HomePage}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
