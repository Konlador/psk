import { React, useEffect, useState } from "react";
import { Alert } from '@material-ui/lab';
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "./videosSlice";
import { VIDEO_LIST_COLUMNS } from "./VideoListColumns";
import { REQUEST_STATUS } from "../../common/constants";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import PropTypes from "prop-types";
import PlayMenuItem from './ContextMenu/PlayMenuItem';
import RenameMenuItem from './ContextMenu/RenameMenuItem';
import DeleteMenuItem from './ContextMenu/DeleteMenuItem';
import { MENU_ITEMS } from './videosConstants';
import useDownloadVideo from './ContextMenu/useDownloadVideo';
import useRestoreVideo from './ContextMenu/useRestoreVideo';
import useBinVideo from './ContextMenu/useBinVideo';
import "./videosList.scss";


export const VideosList = ({ queryParams }) => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector((state) => state.videos.status);
  const error = useSelector((state) => state.videos.error);
  const [contextVideo, setContextVideo] = useState({});
  const [menuItemOpen, setMenuItemOpen] = useState(MENU_ITEMS.none);
  const downloadVideo = useDownloadVideo();
  const restoreVideo = useRestoreVideo();
  const restoreError = useSelector((state) => state.videos.restoreVideoError);
  const restoreStatus = useSelector((state) => state.videos.restoreVideoStatus);
  const binVideo = useBinVideo();
  const binStatus = useSelector((state) => state.videos.binVideoStatus);
  const binError = useSelector((state) => state.videos.binVideoError);

  useEffect(() => {
    if(videoStatus === REQUEST_STATUS.idle) {
      dispatch(getAllVideos(queryParams));
    }
  }, [menuItemOpen]);

  const gridStyle = { minHeight: 550 };

  const defaultFilterValue = [
    { name: "name", operator: "startsWith", type: "string" },
    { name: "timeCreated", operator: "gte", type: "number" },
   // { name: "size", operator: "gte", type: "number" },
  ];
  //multiple column sort
  const defaultSortInfo = [
    { name: "name", dir: 1 },
    { name: "timeCreated", dir: -1 },
    { name: "size", dir: -2 },
  ];

  const openMenuItem = (video, menuItem) => {
    setContextVideo(video);
    setMenuItemOpen(menuItem);
  }

  const closeMenuItem = () => {
    setMenuItemOpen(MENU_ITEMS.none);
  }

  const renderRowContextMenu = (menuProps, { rowProps }) => {
    menuProps.autoDismiss = true;
    menuProps.items = [];

    const video = rowProps.data;

    const playItem = { 
      label: <div className="context-menu-item" onClick={() => openMenuItem(video, MENU_ITEMS.play)}>Play</div>
    };

    const downloadItem = {
      label: <div className="context-menu-item" onClick={() => downloadVideo(video)}>Download</div>
    };

    const renameItem = {
      label: <div className="context-menu-item" onClick={() => openMenuItem(video, MENU_ITEMS.rename)}>Rename</div>
    };

    const binItem = {
      label: <div className="context-menu-item" onClick={() => binVideo(video)}>Bin</div>
    };

    const restoreItem = {
      label: <div className="context-menu-item" onClick={() => restoreVideo(video)}>Restore</div>
    };

    const deleteItem = {
      label: <div className="context-menu-item" onClick={() => openMenuItem(video, MENU_ITEMS.delete)}>Delete</div>
    };

    if(video.state === 1 && !video.trashedExplicitly) {
      menuProps.items.push(playItem, downloadItem, renameItem, binItem);
    } 
    else if (video.state === 0) {
      menuProps.items.push(renameItem);
    } 
    else if(video.trashedExplicitly) {
      menuProps.items.push(restoreItem, deleteItem);
    }
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

  /******************** show errors if restore or bin failed *****************/  
  if (restoreStatus === REQUEST_STATUS.failed) {
    // TODO: show snackbar
    console.log('Restore failed: ', restoreError);
  }

  if (binStatus === REQUEST_STATUS.failed) {
    // TODO: show snackbar
    console.log('Bin failed: ', binError);
  }

  /************************************* render page *******************************/
  let renderContent;

  if (videoStatus === REQUEST_STATUS.loading) {
    renderContent = <CircularProgress />;
  }
  else if(error) {
    renderContent = <Alert severity="error">{error}</Alert>;
  }
  else {
    renderContent = (
      <>
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
        />
        <PlayMenuItem video={contextVideo}  isOpen={menuItemOpen === MENU_ITEMS.play} close={closeMenuItem} />
        <RenameMenuItem video={contextVideo}  isOpen={menuItemOpen === MENU_ITEMS.rename} close={closeMenuItem} />
        <DeleteMenuItem video={contextVideo}  isOpen={menuItemOpen === MENU_ITEMS.delete} close={closeMenuItem} />
      </>)
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

VideosList.propTypes = { queryParams: PropTypes.objectOf(PropTypes.object) };
VideosList.defaultProps = {queryParams: {states: [0, 1], isTrashedExplicitly: false}}
