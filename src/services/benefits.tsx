import { tableData } from "../utils/dataJSON/BenefitSummary";
import axios from "axios";

export const getAll = async () => {
  //   const response = await axios.get(`http://localhost:3001/api/benefits`);

  return tableData;
};
interface BenefitRequestInfo {
  apiId: string;
  ver?: string | null;
  ts?: string | null;
  action?: string | null;
  did?: string | null;
  key?: string | null;
  msgId: string;
  authToken: string;
  userInfo: {
    id: number;
    uuid: string;
    userName: string;
    name: string;
    mobileNumber: string;
    emailId: string;
    type: string;
    active: boolean;
    tenantId: string;
  };
}

interface SponsorData {
  id: string;
  benefitSponsor: string;
  sponsorEntity: string;
  sponsorShare: string;
  type: string;
}

interface Benefit {
  benefitName: string;
  benefitProvider: string;
  benefitDescription: string;
  sponsors: SponsorData[];
  status: string;
}
interface BenefitAmountCategory {
  beneficiaryCaste: string;
  beneficiaryType: string;
  beneficiaryCategory: string;
  beneficiaryAmount: number;
}
interface TermsAndCondition {
  academicYear?: boolean;
  failYear?: boolean;
  deadlineDate?: string;
  extendDeadlineDate: string;
  validDate: string;
  renewableApplicable: boolean;
}
interface BenefitPayload {
  RequestInfo: BenefitRequestInfo;
  Benefit: Benefit;
}

interface BenefitAmountCategoryPayload {
  RequestInfo: BenefitRequestInfo;
  Benefit: Benefit;
  BenefitAmountCategory: BenefitAmountCategory[];
}
interface BenefitTermsAndCondition {
  RequestInfo: BenefitRequestInfo;
  Benefit: Benefit;
  TermsAndCondition: TermsAndCondition;
}
export default { getAll };

export const createBenefitForm = async (payload: BenefitPayload) => {
  try {
    const response = await axios.post(`/benefits/v1/_create`, payload);
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateForm = async (
  payload:
    | BenefitPayload
    | BenefitAmountCategoryPayload
    | BenefitTermsAndCondition
) => {
  try {
    const response = await axios.post(`/benefits/v1/_update`, payload);
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
