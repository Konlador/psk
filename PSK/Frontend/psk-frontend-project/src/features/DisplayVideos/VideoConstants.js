export const COLUMNS_NAMES = ['id', 'name', 'timeCreated', 'size'];

export const COLUMNS = [
    {
      id: COLUMNS_NAMES[0],
      label: 'Id',
      minWidth: 170,
      align: 'left',
      display: 'none'
    },
    {
      id: COLUMNS_NAMES[1],
      label: 'Name',
      minWidth: 170,
      align: 'left',
    },
    {
      id: COLUMNS_NAMES[2],
      label: 'Time created',
      minWidth: 170,
      align: 'left',
      format: (value) => {
        const date = new Date(value);
        let formattedDate = date.getFullYear();

        formattedDate += "-";

        if(date.getMonth() < 10){
            formattedDate += "0";
        }

        formattedDate += date.getMonth();
        formattedDate += "-";

        if(date.getDate() < 10){
            formattedDate += "0";
        }

        formattedDate += date.getDate();

        return formattedDate;}
    },
    {
      id: COLUMNS_NAMES[3],
      label: 'Size',
      minWidth: 170,
      align: 'left'
    }
  ];