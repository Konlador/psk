import http from "../../http-common";
import { React, useEffect, useState, useCallback } from "react";
import { Alert } from "@material-ui/lab";
import {
  Button,
  CircularProgress,
  Breadcrumbs,
  Typography
}  
 from "@material-ui/core";
import Link from '@material-ui/core/Link';

import { useSelector, useDispatch } from "react-redux";
// import { getAllVideos } from "../../Redux/videosSlice";
import {getAllVideos } from "../../Redux/videosSlice";
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
import useMoveFile from './ContextMenu/useMoveFile';
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
  const moveFile = useMoveFile();
  const binStatus = useSelector((state) => state.videos.binVideoStatus);
  const binError = useSelector((state) => state.videos.binVideoError);

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
    const moveToPreviousDirectory = {
      label: (
        <div 
          className="context-menu-item" 
          onClick={() =>  
          {//moveFile()
            
            const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
            const url_base = `/api/drive/${driveId}`;
            let axiosConfig = {
            headers: { "Content-Type": "application/json" },
          };
          for(var x in selected){
            http.put(`${url_base}/files/${selected[x].id}/move?newParentId=${rowProps.data.id}`, axiosConfig);
          }
          dispatch(getAllVideos(queryParams));
          }}
        >
          Move to folder
        </div>
      ),
    };
    const moveToFolder = {
      label: (
        <div 
          className="context-menu-item" 
          onClick={() =>  
          {//moveFile()
            
            const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
            const url_base = `/api/drive/${driveId}`;
            let axiosConfig = {
            headers: { "Content-Type": "application/json" },
          };
          for(var x in selected){
            http.put(`${url_base}/files/${selected[x].id}/move?newParentId=${rowProps.data.id}`, axiosConfig);
          }
          dispatch(getAllVideos(queryParams));
          }}
        >
          Move to folder
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
    
    if(video.type == "Domain.StorageItems.Folder"){
      menuProps.items.push(renameItem, binItem, moveToFolder)
    }
    if (video.state === 1 && !video.trashedExplicitly && video.type == "Domain.StorageItems.StorageItem") {
      menuProps.items.push(playItem, downloadItem, renameItem, binItem);
    } else if (video.state === 0) {
      menuProps.items.push(renameItem);
    } else if (video.trashedExplicitly) {
      menuProps.items.push(restoreItem, deleteItem);
    }
  };
  const [selected, setSelected] = useState({ 1: true, 2: true })

  const onSelectionChange = useCallback(({ selected: selectedMap, data }) => {
    setSelected(selectedMap)
  }, [])

  const rowClicked = useCallback((rowProps, event) => {
    console.log(rowProps.data);
    if(rowProps.data.type =="Domain.StorageItems.Folder"){

      const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
      let data = {
        driveId: driveId,
        parentId: rowProps.data.id,
        states: [0, 1],
        isTrashedExplicitly: false
      }
      queryParams.parentId = rowProps.data.id;
      dispatch(getAllVideos(data));
    }
  }, []);

  const backClicked = () => {

      const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
      let data = {
        driveId: driveId,
        parentId: null,
        states: [0, 1],
        isTrashedExplicitly: false
      }
      queryParams.parentId = null;
      dispatch(getAllVideos(data));
  }

  const createNewFolder = () => { 
    console.log('loool');
    let data = {
      name: 'New Folder',
      type: 1, //file.type, 0 - file, 1 - folder
      parentId: queryParams.parentId
      /*parentId: this.folder */
    };

    const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
    const url_base = `/api/drive/${driveId}`;
    let axiosConfig = {
    headers: { "Content-Type": "application/json" },
  };
  let thisFolderData = {
    driveId: driveId,
    parentId: queryParams.parentId,
    states: [0, 1],
    isTrashedExplicitly: false,
  }
  http.post(`${url_base}/new-folder`, data, axiosConfig)
  .then((response) => {
    dispatch(getAllVideos(thisFolderData));
  });
}
  
 // const rowClicked = (menuProps, { rowProps }) => {
   // const video = rowProps.data;
  //}



  const gridStyle = { minHeight: "90%" };

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
        <div className="buttons">
        <Button
          className="btn-back"
          color="disabled"
          variant="contained"
          component="span"
          onClick={backClicked}
          style={
            {visibility:queryParams.parentId==null?"hidden":"visible"}
          }
         // startIcon={<CloudUploadIcon />}
        >
          {'<Back'}
        </Button>
        
        <Button
          className="btn-create-folder"
          color="primary"
          variant="contained"
          component="span"
          onClick={createNewFolder}
         // startIcon={<CloudUploadIcon />}
        >
          Create folder
        </Button>
        </div>
        <ReactDataGrid
          idProperty="id"
          columns={queryParams.isTrashedExplicitly ? VIDEO_LIST_COLUMNS_BIN : VIDEO_LIST_COLUMNS_MAIN}
          dataSource={getDataSource}
          enableFiltering={false} 
          renderRowContextMenu={renderRowContextMenu}
          defaultSortInfo={{ name: 'size', dir: 1 }}
          showZebraRows={true}
          style={gridStyle}

          nativeScroll={false}
          enableSelection
          onRowClick={!queryParams.isTrashedExplicitly && rowClicked}
          onSelectionChange={onSelectionChange}
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
      <div className="display-videos-table">{renderContent}</div>
      {/* <p>
        Selected rows: {selected == null ? 'none' : JSON.stringify(Object.keys(selected))}.
      </p> */}


    </>
  );
};

VideosList.propTypes = { queryParams: PropTypes.objectOf(PropTypes.object) };
VideosList.defaultProps = {
  queryParams: { states: [0, 1], isTrashedExplicitly: false, parentId: null},
};