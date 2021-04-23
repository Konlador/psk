import { React, useEffect } from "react";
import { Alert } from '@material-ui/lab';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "./videosSlice";
import { VIDEO_LIST_COLUMNS } from "./VideoListColumns";
import { REQUEST_STATUS } from "../../common/constants";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import PropTypes from "prop-types";
import "./displayVideos.scss";

export const DisplayVideos = ({ queryParams }) => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector((state) => state.videos.status);
  const error = useSelector((state) => state.videos.error);

  useEffect(() => {
    dispatch(getAllVideos(queryParams));
  }, []);

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

  // const [selected, setSelected] = useState(null);

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

  let renderContent;

  if (videoStatus === REQUEST_STATUS.loading) {
    renderContent = <CircularProgress />;
  }
  else if(error) {
    renderContent = <Alert severity="error">{error}</Alert>;
  }
  else {
    renderContent = (
      <ReactDataGrid
          idProperty="id"
          columns={VIDEO_LIST_COLUMNS}
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
      />)
  }

  return (
    <>
      {/* <p>
        Selected rows: {selected == null ? "none" : JSON.stringify(selected)}.
      </p> */}
      <div className="display-videos-table">
        {renderContent}
      </div>
    </>
  );
};

DisplayVideos.propTypes = { queryParams: PropTypes.objectOf(PropTypes.object) };
DisplayVideos.defaultProps = {queryParams: {states: [0, 1], isTrashedExplicitly: false}}
