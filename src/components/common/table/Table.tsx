import "ka-table/style.css";

import React, { memo } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Table } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";

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
