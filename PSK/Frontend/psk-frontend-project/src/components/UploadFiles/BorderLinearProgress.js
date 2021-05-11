import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core";

//------------LINEAR PROGRESS-------------------------------
const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

export default BorderLinearProgress;