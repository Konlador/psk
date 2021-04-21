import { React, useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "./videosSlice";
// import { COLUMNS } from "./VideoConstants";
// import { VideoRow } from "./VideoRow";
import { REQUEST_STATUS } from "../../common/constants";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import CheckIcon from "@material-ui/icons/Check";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import "./displayVideos.scss";

const useStyles = makeStyles({
  container: {
    maxHeight: "60vh",
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const DisplayVideos = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector((state) => state.videos.status);
  const error = useSelector((state) => state.videos.error);

  useEffect(() => {
    if (videoStatus === REQUEST_STATUS.idle) {
      dispatch(getAllVideos({ states: props.fileStatus }));
    }
  }, [dispatch, videoStatus, props.fileStatus]);

  let isLoading = false;

  if (videoStatus === REQUEST_STATUS.loading) {
    isLoading = true;
  }

  const gridStyle = { minHeight: 550 };

  const defaultFilterValue = [
    { name: "name", operator: "startsWith", type: "string" },
    { name: "timeCreated", operator: "gte", type: "number" },
    { name: "size", operator: "gte", type: "number" },
  ];
  //multiple column sort
  const defaultSortInfo = [
    { name: "name", dir: 1 },
    { name: "timeCreated", dir: -1 },
    { name: "size", dir: -2 },
  ];
  const renderRowContextMenu = (menuProps, { rowProps }) => {
    menuProps.autoDismiss = true;
    menuProps.items = [
      {
        label: "Row " + rowProps.rowIndex,
      },
      { label: "Bin" },
      { label: "Play" },
      { label: "Edit" },
    ];
  };

  const statusIcon = (icon_status) => {
    console.log(icon_status);
    return icon_status === 0 ? (
      <AutorenewIcon />
    ) : icon_status === 1 ? (
      <CheckIcon />
    ) : (
      <DeleteIcon />
    );
  };

  const columns = [
    {
      name: "id",
      header: "Id",
      defaultVisible: false,
      defaultWidth: 60,
    },
    {
      name: "status",
      header: "Status",
      defaultFlex: 0.3,
      type: "number",
      render: ({ value }) => console.log(videos),
    },
    { name: "name", header: "Name", defaultFlex: 2 },
    { name: "timeCreated", header: "Time Created", defaultFlex: 1 },
    { name: "size", header: "Size", defaultFlex: 1, type: "number" },
  ];
  const [selected, setSelected] = useState(null);

  // const onSelectionChange = useCallback(({ selected: selectedMap, data }) => {
  //   console.log(selectedMap);
  //   const newSelected = Object.keys(selectedMap).map((name) => name);

  //   setSelected(newSelected);
  // }, []);

  // const loadData = () => {
  //   return fetch(DATASET_URL).then(
  //     (response) => {
  //       return response.json();
  //     }
  //   );
  // };

  // const dataSource = useCallback(getAllVideos(), []);
  const scrollProps = Object.assign(
    {},
    ReactDataGrid.defaultProps.scrollProps,
    {
      autoHide: true,
      alwaysShowTrack: false,
      scrollThumbWidth: 10,
      scrollThumbOverWidth: 15,
      scrollThumbStyle: {
        background: "#3f51b5",
      },
    }
  );

  return (
    <>
      {/* <p>
        Selected rows: {selected == null ? "none" : JSON.stringify(selected)}.
      </p> */}
      <div className="display-videos-table">
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoading && !error ? (
          <ReactDataGrid
            idProperty="id"
            columns={columns}
            dataSource={videos}
            defaultFilterValue={defaultFilterValue}
            defaultSortInfo={defaultSortInfo}
            renderRowContextMenu={renderRowContextMenu}
            showZebraRows={true}
            style={gridStyle}
            editable={true}
            nativeScroll={false}
            enableSelection
            multiSelect
            theme="default-light"
            scrollProps={scrollProps}
            // onSelectionChange={onSelectionChange}
            onChange={() => console.log("Text changed")}
          />
        ) : isLoading ? (
          <CircularProgress />
        ) : null}
      </div>
    </>
  );
};
DisplayVideos.propTypes = { fileStatus: PropTypes.array };
DisplayVideos.defaultProps = {
  fileStatus: [0, 1],
};
