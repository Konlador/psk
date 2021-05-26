import React from "react";
import { Layout } from "../../components/Layout/Layout";
import "./loginPage.scss";
import Button from "@material-ui/core/Button";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page__title">CANOPUS VIDEOTEKA</div>
      <div className="login-page__small-description"></div>
      <div className="login-page__button-wrapper">
        <button
          className="login-page__button"
          // onClick={handleLogin}
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
