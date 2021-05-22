import { React, useEffect, useState } from "react";
import { Alert } from "@material-ui/lab";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos, resetBin, resetDelete, resetRestore } from "../../Redux/videosSlice";
import { VIDEO_LIST_COLUMNS_MAIN, VIDEO_LIST_COLUMNS_BIN } from "./VideoListColumns";
import { REQUEST_STATUS } from "../../common/constants";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import filter from '@inovua/reactdatagrid-community/filter'
import "@inovua/reactdatagrid-community/index.css";
import PropTypes from "prop-types";
import PlayMenuItem from './ContextMenu/PlayMenuItem';
import RenameMenuItem from './ContextMenu/RenameMenuItem';
import DeleteMenuItem from './ContextMenu/DeleteMenuItem';
import { MENU_ITEMS } from './videosConstants';
import useDownloadVideo from './ContextMenu/useDownloadVideo';
import useRestoreVideo from './ContextMenu/useRestoreVideo';
import useBinVideo from './ContextMenu/useBinVideo';
import { reset as resetLimiters } from "../../Redux/limitersSlice";
import SearchBar from "./SearchBar";
import PositionedSnackbar from '../../components/Layout/Snackbars/PositionedSnackbar';
import "./videosList.scss";

export const VideosList = ({ queryParams }) => {
  const dispatch = useDispatch();
  const [contextVideo, setContextVideo] = useState({});
  const [menuItemOpen, setMenuItemOpen] = useState(MENU_ITEMS.none);
  const downloadVideo = useDownloadVideo();

  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector((state) => state.videos.status);
  const videosError = useSelector((state) => state.videos.error);

  const restoreVideo = useRestoreVideo();
  const restoreStatus = useSelector((state) => state.videos.restoreVideoStatus);
  const restoreError = useSelector((state) => state.videos.restoreVideoError);

  const binVideo = useBinVideo();
  const binStatus = useSelector((state) => state.videos.binVideoStatus);
  const binError = useSelector((state) => state.videos.binVideoError);

  const deleteStatus = useSelector((state) => state.videos.deleteVideoStatus);
  const deleteError = useSelector((state) => state.videos.deleteVideoError);

  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    dispatch(getAllVideos(queryParams));
  }, []);

  const gridStyle = { minHeight: 550 };

  /*const defaultFilterValue = [
    { name: "name", operator: "contains", type: "string", value: '' },
    { name: queryParams.isTrashedExplicitly ? "trashedTime" : "timeCreated", operator: "after", type: "date", value: '' },
    { name: "size", operator: "gte", type: "number", value: '' },
  ];*/

  const openMenuItem = (video, menuItem) => {
    setContextVideo(video);
    setMenuItemOpen(menuItem);
  };

  const closeMenuItem = () => {
    setMenuItemOpen(MENU_ITEMS.none);
  };

  const renderRowContextMenu = (menuProps, { rowProps }) => {
    menuProps.autoDismiss = true;
    menuProps.items = [];

    const video = rowProps.data;

    const playItem = {
      label: (
        <div
          className="context-menu-item"
          onClick={() => openMenuItem(video, MENU_ITEMS.play)}
        >
          Play
        </div>
      ),
    };

    const downloadItem = {
      label: (
        <div 
          className="context-menu-item" 
          onClick={() => downloadVideo(video)}
        >
          Download
        </div>
      ),
    };

    const renameItem = {
      label: (
        <div
          className="context-menu-item"
          onClick={() => openMenuItem(video, MENU_ITEMS.rename)}
        >
          Rename
        </div>
      ),
    };

    const binItem = {
        label: (
          <div
            className="context-menu-item"
            onClick={() => binVideo(video)}
          >
            Bin
          </div>
        ),
    };

    const restoreItem = {
      label: (
        <div 
          className="context-menu-item" 
          onClick={() => restoreVideo(video)}
        >
          Restore
        </div>
      ),
    };

    const deleteItem = {
      label: (
        <div 
          className="context-menu-item" 
          onClick={() => openMenuItem(video, MENU_ITEMS.delete)}
        >
          Delete
        </div>
      ),
    };

    if (video.state === 1 && !video.trashedExplicitly) {
      menuProps.items.push(playItem, downloadItem, renameItem, binItem);
    } else if (video.state === 0) {
      menuProps.items.push(renameItem);
    } else if (video.trashedExplicitly) {
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

  const getDataSource = () => {
    const filterValue = [
      { name: 'name', operator: 'contains', type: 'string', value: searchString }
    ];
    return filter(videos, filterValue);
  };

  /******************** handle actions results  *****************/
  

  const getSnackbar = () => {
    const actionsResults = [];
    actionsResults.push(
      { 
        status: videoStatus, 
        error: videosError, 
        showOnSuccess: false,
        success: null,
        reset: null,
      },
      { 
        status: binStatus, 
        error: `Bin operation failed. ${binError}. Refresh the page`, 
        showOnSuccess: true, 
        success: "Item successfully moved to bin" ,
        reset: () => dispatch(resetBin()),
      },
      { 
        status: deleteStatus, 
        error: `Delete operation failed. ${deleteError}. Refresh the page`, 
        showOnSuccess: true, 
        success: "Item successfully deleted" ,
        reset: () => dispatch(resetDelete()),
      },
      { 
        status: restoreStatus, 
        error: `Restore operation failed. ${restoreError}. Refresh the page`, 
        showOnSuccess: true, 
        success: "Item successfully restored" ,
        reset: () => dispatch(resetRestore()),
      },
    );

    for(let i = 0; i < actionsResults.length; i++) {
      if (actionsResults[i].status === REQUEST_STATUS.failed ) {
        return <PositionedSnackbar 
                  open={true} 
                  message={actionsResults[i].error} 
                  severity="error"
                  reset={actionsResults[i].reset ? actionsResults[i].reset : null}
              />;
      }

      if (actionsResults[i].status === REQUEST_STATUS.success && actionsResults[i].showOnSuccess) {
        return <PositionedSnackbar 
                  open={true} 
                  message={actionsResults[i].success} 
                  severity="success"
                  reset={actionsResults[i].reset ? actionsResults[i].reset : null}
              />;
      }
    }

    return null;
  }

  /************************** handle action results ***************************/
  let renderSnackbar = getSnackbar();

  if (deleteStatus === REQUEST_STATUS.success) {
    dispatch(resetLimiters());
  }

  /******************************* render page *******************************/
  let renderContent;

  if (videoStatus === REQUEST_STATUS.loading) {
    renderContent = <CircularProgress />;
  } if (videoStatus === REQUEST_STATUS.success) {
    renderContent = (
      <>
        <SearchBar onChange={setSearchString}/>
        <ReactDataGrid
          idProperty="id"
          columns={queryParams.isTrashedExplicitly ? VIDEO_LIST_COLUMNS_BIN : VIDEO_LIST_COLUMNS_MAIN}
          dataSource={getDataSource}
          enableFiltering={false} 
          renderRowContextMenu={renderRowContextMenu}
          defaultSortInfo={{ name: 'name', dir: 1 }}
          showZebraRows={true}
          style={gridStyle}
          nativeScroll={false}
          enableSelection
          multiSelect
          theme="default-light"
          scrollProps={scrollProps}
          onChange={() => console.log("Text changed")}
        />
        <PlayMenuItem
          video={contextVideo}
          isOpen={menuItemOpen === MENU_ITEMS.play}
          close={closeMenuItem}
        />
        <RenameMenuItem
          video={contextVideo}
          isOpen={menuItemOpen === MENU_ITEMS.rename}
          close={closeMenuItem}
        />
        <DeleteMenuItem
          video={contextVideo}
          isOpen={menuItemOpen === MENU_ITEMS.delete}
          close={closeMenuItem}
        />
      </>
    );
  }

  return (
    <>
      <div className="display-videos-table">
        {renderContent}
        {renderSnackbar}
      </div>
    </>
  );
};

VideosList.propTypes = { queryParams: PropTypes.objectOf(PropTypes.object) };
VideosList.defaultProps = {
  queryParams: { states: [0, 1], isTrashedExplicitly: false },
};