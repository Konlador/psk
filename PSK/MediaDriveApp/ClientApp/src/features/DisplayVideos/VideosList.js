import { React, useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "../../Redux/videosSlice";
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
import "./videosList.scss";

export const VideosList = ({ queryParams }) => {
  const dispatch = useDispatch();
  const [contextVideo, setContextVideo] = useState({});
  const [menuItemOpen, setMenuItemOpen] = useState(MENU_ITEMS.none);
  const downloadVideo = useDownloadVideo();

  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector((state) => state.videos.status);

  const restoreVideo = useRestoreVideo();
  const binVideo = useBinVideo();

  const deleteStatus = useSelector((state) => state.videos.deleteVideoStatus);

  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    dispatch(getAllVideos(queryParams));
  }, []);

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

  const gridStyle = { minHeight: 550 };

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
      </div>
    </>
  );
};

VideosList.propTypes = { queryParams: PropTypes.objectOf(PropTypes.object) };
VideosList.defaultProps = {
  queryParams: { states: [0, 1], isTrashedExplicitly: false },
};