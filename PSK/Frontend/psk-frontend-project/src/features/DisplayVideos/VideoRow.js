import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import COLUMNS from './Columns';

export const VideoRow = (props) => {  
    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={props.video.id}>
          {COLUMNS.map((column) => {
            const value = props.video[column.id];
            return (
              <TableCell key={column.id} align={column.align}>
                {column.format && typeof value === 'number' ? column.format(value) : value}
              </TableCell>
            );
          })}
        </TableRow>)
  }