import { React, useEffect, useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "./videosSlice";
import { COLUMNS } from "./VideoTableColumns";
import { REQUEST_STATUS } from "../../common/constants";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import PropTypes from "prop-types";
import "./displayVideos.scss";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const DisplayVideosTest = (props) => {
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
            columns={COLUMNS}
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
DisplayVideosTest.propTypes = { fileStatus: PropTypes.array };
DisplayVideosTest.defaultProps = {
  fileStatus: [0, 1],
};
