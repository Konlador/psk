import CheckIcon from "@material-ui/icons/Check";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import DeleteIcon from "@material-ui/icons/Delete";

export const VIDEO_LIST_COLUMNS = [
    {
      name: 'id',
      header: 'Id',
      defaultVisible: false,
    },
    {
      name: "state",
      header: "Status",
      defaultWidth: 90,
      render: ({ data }) => {
        if (data.state === 0)
          return <AutorenewIcon />;
        else if(data.trashedExplicitly)
          return <DeleteIcon />;
        return <CheckIcon />;
      }
    },
    {
      name: 'name',
      header: 'Name',
      defaultFlex: 5,
    },
    {
      name: 'timeCreated',
      header: 'Time created',
      render: ({ data }) => {
        const date = new Date(data.timeCreated);
        let formattedDate = date.getFullYear();

        formattedDate += "-";

        if(date.getMonth() < 10){
            formattedDate += "0";
        }

        formattedDate += date.getMonth()+1;
        formattedDate += "-";

        if(date.getDate() < 10){
            formattedDate += "0";
        }

        formattedDate += date.getDate();

        return formattedDate;
      }
    },
    {
      name: 'size',
      header: 'Size',
      type: 'number',
      render: ({ data }) => {
        let size = data.size;
        const divider = 1024;
        const metrics = ['B', 'KB', 'MB', 'GB', 'TB'];

        let possibleReduceCount = metrics.length-1;
        while(size >= divider && possibleReduceCount > 0){
          size = size/divider;
          possibleReduceCount--;
        }

        const formattedValue = (size.toString().indexOf('.') !== -1 ? size.toFixed(2) : size) + ' ' + metrics[metrics.length - possibleReduceCount-1];
        return formattedValue;
      }
    }
  ];