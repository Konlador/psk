import { useDispatch, useSelector } from 'react-redux';
import { REQUEST_STATUS } from '../../../common/constants';
import PositionedSnackbar from './PositionedSnackbar';
import { resetRestore, resetDelete, resetBin } from '../../../Redux/videosSlice';
import { reset as resetUpload } from '../../../Redux/uploadSlice';

const useSnackbar = () => { 
  const dispatch = useDispatch();

  const videoStatus = useSelector((state) => state.videos.status);
  const videosError = useSelector((state) => state.videos.error);

  const restoreStatus = useSelector((state) => state.videos.restoreVideoStatus);
  const restoreError = useSelector((state) => state.videos.restoreVideoError);

  const binStatus = useSelector((state) => state.videos.binVideoStatus);
  const binError = useSelector((state) => state.videos.binVideoError);

  const deleteStatus = useSelector((state) => state.videos.deleteVideoStatus);
  const deleteError = useSelector((state) => state.videos.deleteVideoError);

  const uploadStatus = useSelector((state) => state.upload.status);
  const uploadMessage = useSelector((state) => state.upload.message);

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
        error: `Bin failed. ${binError} Refresh the page`, 
        showOnSuccess: true, 
        success: "Item successfully moved to bin" ,
        reset: () => dispatch(resetBin()),
      },
      { 
        status: deleteStatus, 
        error: `Delete failed. ${deleteError} Refresh the page`, 
        showOnSuccess: true, 
        success: "Item successfully deleted" ,
        reset: () => dispatch(resetDelete()),
      },
      { 
        status: restoreStatus, 
        error: `Restore failed. ${restoreError} Refresh the page`, 
        showOnSuccess: true, 
        success: "Item successfully restored" ,
        reset: () => dispatch(resetRestore()),
      },
      { 
        status: uploadStatus, 
        error: uploadMessage, 
        showOnSuccess: true, 
        success: uploadMessage,
        reset: () => dispatch(resetUpload()),
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

  return getSnackbar;
}

export default useSnackbar;