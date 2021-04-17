// import React from "react";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
// import { VideoRow } from "./VideoRow";

// const initialState = {
//   mouseX: null,
//   mouseY: null,
// };

// export const VideoContextMenu = (props) => {
//   const [state, setState] = React.useState(initialState);

//   const handleClick = (event) => {
//     event.preventDefault();
//     setState({
//       mouseX: event.clientX - 2,
//       mouseY: event.clientY - 4,
//     });
//   };

//   const handleClose = () => {
//     setState(initialState);
//   };

//   return (
//     <div onContextMenu={handleClick} style={{ cursor: "context-menu" }}>
//       <VideoRow video={props.video} />
//       <Menu
//         keepMounted
//         open={state.mouseY !== null}
//         onClose={handleClose}
//         anchorReference="anchorPosition"
//         anchorPosition={
//           state.mouseY !== null && state.mouseX !== null
//             ? { top: state.mouseY, left: state.mouseX }
//             : undefined
//         }
//       >
//         <MenuItem onClick={handleClose}>Play</MenuItem>
//         <MenuItem onClick={handleClose}>Rename</MenuItem>
//         <MenuItem onClick={handleClose}>Download</MenuItem>
//         <MenuItem onClick={handleClose}>Delete</MenuItem>
//       </Menu>
//     </div>
//   );
// };
// // DisplayVideos.propTypes = { fileStatus: PropTypes.array };
