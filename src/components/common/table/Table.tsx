import "ka-table/style.css";

import { Table } from "ka-table";
import { memo } from "react";

const TableWrapper = (props: any) => {
  return <Table rowKeyField={"name"} {...props} />;
};

export default memo(TableWrapper);
