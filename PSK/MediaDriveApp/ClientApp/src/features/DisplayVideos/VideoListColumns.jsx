import AutorenewIcon from "@material-ui/icons/Autorenew";

const getHeader = (title) => {
  return (cellProps) => {
    cellProps.showColumnMenuTool = false;
    return <div style={{ display: 'inline-block' }}>{title}</div>
  }
}

const renderDate = (data) => {
  const date = new Date(data);
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
};

const ID_COLUMN = {
  name: 'id',
  header: 'Id',
  defaultVisible: false,
};

const ROW_VERSION_COLUMN = {
  name: 'rowVersion',
  header: 'RowVersion',
  defaultVisible: false,
};


const TIME_CREATED_COLUMN = {
  name: 'timeCreated',
  header: getHeader('Time created'),
  render: ({ data }) =>  renderDate(data.timeCreated),
};

const TIME_TRASHED_COLUMN = {
  name: 'trashedTime',
  header: getHeader('Time trashed'),
  render: ({ data }) => renderDate(data.trashedTime),
};

const NAME_COLUMN = {
  name: 'name',
  header: getHeader('Name'),
  defaultFlex: 5,
  render: ({ data }) => {
    if (data.state === 0)
      return (<div style={{display: "flex", alignItems: "center"}}> {data.name} &nbsp;&nbsp;&nbsp; <AutorenewIcon /></div>); 
    return data.name;
  }
}

const SIZE_COLUMN = {
  name: 'size',
  header: getHeader('Size'),
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
};

export const VIDEO_LIST_COLUMNS_MAIN = [
  ID_COLUMN,
  ROW_VERSION_COLUMN,
  NAME_COLUMN,
  TIME_CREATED_COLUMN,
  SIZE_COLUMN
];

export const VIDEO_LIST_COLUMNS_BIN = [
    ID_COLUMN,
    NAME_COLUMN,
    TIME_TRASHED_COLUMN,
    SIZE_COLUMN
];