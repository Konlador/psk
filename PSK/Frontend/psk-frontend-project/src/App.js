import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UploadPage from "./pages/UploadPage/UploadPage";
import HomePage from "./pages/HomePage/HomePage";
import VideosPage from "./pages/VideosPage/VideosPage";
import VideosPageTest from "./pages/VideosPage/VideosPageTest";
import BinPage from "./pages/BinPage/BinPage";
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
          <Route path="/videosTest" component={VideosPageTest} />
          <Route path="/bin" component={BinPage}></Route>
          <Route path="/" component={HomePage}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
