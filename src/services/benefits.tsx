import { tableData } from "../utils/dataJSON/BenefitSummary";

export const getAll = async () => {
  //   const response = await axios.get(`http://localhost:3001/api/benefits`);

  return tableData;
};

export default { getAll };
