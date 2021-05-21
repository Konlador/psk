import React, { useEffect } from "react";
import "./leftsidebar.scss";
import { Limiter } from "./Limiter";
import { useSelector, useDispatch } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getLimiters, selectLimiters } from "../../../Redux/limitersSlice";
import { REQUEST_STATUS } from "../../../common/constants";

export const LeftSidebar = (props) => {
  const dispatch = useDispatch();
  const { limiters, status, error } = useSelector(selectLimiters);
  const isLoading = status === REQUEST_STATUS.loading;

  useEffect(() => {
    if (status === REQUEST_STATUS.idle) {
      dispatch(getLimiters({}));
    }
  }, [status]);

  const convertToMb = (value) => parseInt(value / (1024 * 1024));

  let renderContent;

  if (isLoading) {
    renderContent = <CircularProgress />;
  } else if (error) {
    renderContent = <span>Something went wrong</span>;
  } else {
    renderContent = (
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
    <div className="left-sidebar">
      <div className="left-sidebar__content">{renderContent}</div>
    </div>
  );
};
