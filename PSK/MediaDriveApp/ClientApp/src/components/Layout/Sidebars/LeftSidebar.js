import React, { useEffect } from "react";
import "./leftsidebar.scss";
import { Limiter } from "./Limiter";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getLimiters, selectLimiters } from "../../../Redux/limitersSlice";
import { REQUEST_STATUS } from "../../../common/constants";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import { Link } from "react-router-dom";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { useMsal } from "@azure/msal-react";

export const LeftSidebar = (props) => {
  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "hidden",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();
  const { limiters, status, error } = useSelector(selectLimiters);
  const isLoading = status === REQUEST_STATUS.loading;
  const { instance } = useMsal();
  const handleLogout = () => {
    instance.logoutRedirect({
    postLogoutRedirectUri: "/",
    });
  }

  useEffect(() => {
    if (status === REQUEST_STATUS.idle) {
      dispatch(getLimiters({}));
    }
  }, [status]);
  const convertToMb = (value) => parseInt(value / (1024 * 1024));

  let renderLimiter;

  if (isLoading) {
    renderLimiter = <CircularProgress />;
  } else if (error) {
    renderLimiter = <span>Something went wrong</span>;
  } else {
    renderLimiter = (
      <>
        <Limiter
          value={(limiters.totalStorageUsed / limiters.capacity) * 100}
        ></Limiter>
        <br />
        <span className="left-sidebar__nof">
          Used {convertToMb(limiters.totalStorageUsed)} MB from{" "}
          {convertToMb(limiters.capacity)} MB
        </span>
        <br />
        <span className="left-sidebar__nof">
          Number of Files: {limiters.numberOfFiles}
        </span>
      </>
    );
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className="appbar__toolbar">
          <Typography variant="h6" noWrap>
            Canopus videoteka
          </Typography>
          <button className="appbar__logout" onClick={handleLogout}>
            <ExitToAppOutlinedIcon fontSize="large" style={{ fill: "white" }} />
          </button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {/* <Divider /> */}

            <ListItem button component={Link} to="/videos">
              <ListItemIcon>
                <VideoLibraryIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Videos"}
                className="left-sidebar__list-text"
              />
            </ListItem>
            {/* <Divider /> */}

            <ListItem button component={Link} to="/upload">
              <ListItemIcon>
                <BackupRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Upload"}
                className="left-sidebar__list-text"
              />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/bin">
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText
                primary={"Bin"}
                className="left-sidebar__list-text"
              />
            </ListItem>
            <div className="left-sidebar__limiter">{renderLimiter}</div>

            {/* <Divider /> */}
          </List>
        </div>
      </Drawer>
    </div>
  );
};
