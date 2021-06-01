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
import { getAllVideos } from "./videosSlice";
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
import SearchBar from "./SearchBar";
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
  const moveFile = useMoveFile();
  const binStatus = useSelector((state) => state.videos.binVideoStatus);
  const binError = useSelector((state) => state.videos.binVideoError);
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
      dispatch(getAllVideos(data));
    }
  }, []);

  const createNewFolder = () => { 
    console.log('loool');
    let data = {
      name: 'folderenijus2',
      type: 1, //file.type, 0 - file, 1 - folder
      /*parentId: this.folder */
    };
    const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
    const url_base = `/api/drive/${driveId}`;
    let axiosConfig = {
    headers: { "Content-Type": "application/json" },
  };
  http.post(`${url_base}/new-folder`, data, axiosConfig);
  }

  
 // const rowClicked = (menuProps, { rowProps }) => {
   // const video = rowProps.data;
  //}



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

  /******************** show errors if restore or bin failed *****************/  
  if (restoreStatus === REQUEST_STATUS.failed) {
    // TODO: show snackbar
    console.log('Restore failed: ', restoreError);
  }

  if (binStatus === REQUEST_STATUS.failed) {
    // TODO: show snackbar
    console.log('Bin failed: ', binError);
  }

  /******************************* render page *******************************/


  let renderContent;

  if (videoStatus === REQUEST_STATUS.loading) {
    renderContent = <CircularProgress />;
  } else if (error) {
    renderContent = <Alert severity="error">{error}</Alert>;
  } else {
    renderContent = (
     
      <>
        <SearchBar onChange={setSearchString}/>
        <Button
          className="btn-upload"
          color="primary"
          variant="contained"
          component="span"
          onClick={createNewFolder}
         // startIcon={<CloudUploadIcon />}
        >
          Upload
  </Button>
        <ReactDataGrid
          idProperty="id"
          columns={queryParams.isTrashedExplicitly ? VIDEO_LIST_COLUMNS_BIN : VIDEO_LIST_COLUMNS_MAIN}
          dataSource={getDataSource}
          enableFiltering={false} 
          renderRowContextMenu={renderRowContextMenu}
          showZebraRows={true}
          style={gridStyle}
          nativeScroll={false}
          enableSelection
          onRowClick={rowClicked}
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
 <Breadcrumbs maxItems={2} aria-label="breadcrumb">
      <Link color="inherit" href="#" onClick={rowClicked}>
        Home
      </Link>
      <Link color="inherit" href="#" onClick={rowClicked}>
        Catalog
      </Link>
      <Link color="inherit" href="#" onClick={rowClicked}>
        Accessories
      </Link>
      <Link color="inherit" href="#" onClick={rowClicked}>
        New Collection
      </Link>
      <Typography color="textPrimary">Belts</Typography>
    </Breadcrumbs>
      <div className="display-videos-table">{renderContent}</div>
      <p>
        Selected rows: {selected == null ? 'none' : JSON.stringify(Object.keys(selected))}.
      </p>
    </>
  );
};

VideosList.propTypes = { queryParams: PropTypes.objectOf(PropTypes.object) };
VideosList.defaultProps = {
  queryParams: { states: [0, 1], isTrashedExplicitly: false, parentId: null},
};