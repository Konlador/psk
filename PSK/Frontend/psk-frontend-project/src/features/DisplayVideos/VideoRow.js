import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import GetAppSharpIcon from '@material-ui/icons/GetAppSharp';
import Button from '@material-ui/core/Button';
import { COLUMNS } from './VideoConstants';
import { COLUMNS_NAMES } from './VideoConstants';

export const VideoRow = (props) => {  
    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={props.video.id}>
          {COLUMNS.map((column) => {
            const value = props.video[column.id];
            return (
              <TableCell key={column.id} align={column.align} style={{display: column.display}}>
                {column.format && column.id === COLUMNS_NAMES[2] ? column.format(value) : value}
              </TableCell>
            );
          })}
           <TableCell>
                <Button variant="contained"><GetAppSharpIcon/></Button>
            </TableCell>
        </TableRow>)
  }