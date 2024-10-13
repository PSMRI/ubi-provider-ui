import "ka-table/style.css";

import { Table } from "ka-table";
import { EditingMode, SortingMode } from "ka-table/enums";
import { memo } from "react";

const App = (props) => {
  return (
    <Table
      editingMode={EditingMode.Cell}
      rowKeyField={"name"}
      sortingMode={SortingMode.Single}
      {...props}
    />
  );
};

export default memo(App);
