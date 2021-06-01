import React from "react";
import "./loginPage.scss";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";

function LoginPage() {
  const { instance } = useMsal();
  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => {
      console.error(e);
    });
  }

  return (
    <div className="login-page">
      <div className="login-page__title">CANOPUS VIDEOTEKA</div>
      <div className="login-page__small-description"></div>
      <div className="login-page__button-wrapper">
        <button
          className="login-page__button"
          onClick={handleLogin}
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className="login-page__button-text">ENTER </span>

          <PlayCircleOutlineIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
