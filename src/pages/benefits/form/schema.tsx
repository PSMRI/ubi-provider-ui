import { JSONSchema7 } from "json-schema"; // Use this for the schema type
export const generalInfoSchema: JSONSchema7 = {
  title: "",
  type: "object",
  required: [
    "benefitName",
    "benefitProvider",
    "benefitSponsor1",
    "sponsor1Entity",
    "sponsor1Share",
  ],
  properties: {
    benefitName: { type: "string", title: "Benefit Name" },
    benefitProvider: { type: "string", title: "Benefit Provider" },
    benefitSponsor1: { type: "string", title: "Benefit Sponsor-1" },
    sponsor1Entity: {
      type: "string",
      title: "Sponsor-1 Entity Type",
      enum: [
        "NON_PROFIT",
        "CORPORATE",
        "GOVERNMENT",
        "INSTITUTE",
        "FOUNDATION",
        "INDIVIDUAL",
      ],
    },
    sponsor1Share: { type: "string", title: "Sponsor-1 Share (Percentage)" },

    "": {
      type: "array",
      title: "",
      items: {
        type: "object",
        properties: {
          benefitSponsor: { type: "string", title: "Benefit Sponsor" },
          sponsorEntity: {
            type: "string",
            title: "Sponsor Entity Type",
            enum: [
              "NON_PROFIT",
              "CORPORATE",
              "GOVERNMENT",
              "INSTITUTE",
              "FOUNDATION",
              "INDIVIDUAL",
            ],
          },
          sponsorShare: { type: "string", title: "Sponsor Share (Percentage)" },
        },
      },
    },
    description: { type: "string", title: "Description" },
  },
};
export const eligibilityCriteriaSchema: JSONSchema7 = {
  title: "",
  type: "object",

  required: ["gender", "disability", "domicile"],
  properties: {
    gender: {
      type: "boolean",
      title: "Gender",
      enum: ["Male", "Female", "Both"],
    },
    class: { type: "string", title: "Class", enum: ["10th", "12th", "Other"] },
    marks: {
      type: "string",
      title: "Marks (Minimum Required)",
      enum: ["60%", "70%", "Other"],
    },

    minQualification: {
      type: "string",
      title: "Minimum Qualification",
      enum: ["10th", "12th", "Other"],
    },
    fieldOfStudy: {
      type: "string",
      title: "Field of Study",
      enum: ["Arts", "Science", "Other"],
    },
    attendancePercentage: {
      type: "string",
      title: "Attendance Percentage",
      enum: ["60%", "70%", "Other"],
    },

    annualIncome: {
      type: "string",
      title: "Annual Income",
      enum: ["Below 1,00,000/-", "Below 5,00,000/-", "Other"],
    },
    caste: {
      type: "array",
      title: "Caste",
      items: {
        type: "string",
        enum: ["General", "SC", "ST", "OBC"],
      },
      uniqueItems: true, // Prevents duplicate selections
    },
    disability: {
      type: "boolean",
      title: "Disability",
      enum: [
        "Yes (only students with Disability can apply)",
        "No (anyone can apply)",
      ],
    },
    domicile: {
      type: "string",
      title: "Domicile",
      enum: ["Madhya Pradesh", "Maharashtra", "Other"],
    },
    dayScholar: {
      type: "string",
      title: "Dayscholar/Hostler",
      enum: ["Hosteler", "Dayscholar", "Not Applicable"],
    },

    age: {
      type: "string",
      title: "Age",
      enum: ["18", "25", "Other"],
    },
    eligibleChildren: {
      type: "string",
      title: "Eligible children from one family (Max limit)",
      enum: ["1", "2", "Other"],
    },
  },
};

export const financialInformationSchema: JSONSchema7 = {
  title: "",
  type: "object",
  required: ["maxBeneficiariesLimit"],
  properties: {
    parentOccupation: {
      type: "string",
      title: "Parent's Occupation",
    },
    amountPerBeneficiaryCategory: {
      type: "object",
      title: "Amount Per Beneficiary Category",
      properties: {
        beneficieryCaste: {
          type: "string",
          title: "Beneficiary Caste",
          enum: ["SC", "ST", "Others"],
        },
        beneficieryType: {
          type: "string",
          title: "Beneficiary Type",
          enum: ["HOSTELER", "DAYSCHOLAR", "BOTH"],
        },
        beneficieryCategory: {
          type: "string",
          title: "Beneficiary Category",
          enum: ["Merit-based", "Need-based", "Others"],
        },
        beneficieryAmount: {
          type: "string",
          title: "Amount",
        },
      },
    },
    "": {
      type: "array",
      title: "",
      items: {
        type: "object",
        properties: {
          beneficieryCaste: {
            type: "string",
            title: "Beneficiary Caste",
            enum: ["SC", "ST", "Others"],
          },
          beneficieryType: {
            type: "string",
            title: "Beneficiary Type",
            enum: ["HOSTELER", "DAYSCHOLAR", "BOTH"],
          },
          beneficieryCategory: {
            type: "string",
            title: "Beneficiary Category",
            enum: ["Merit-based", "Need-based", "Others"],
          },
          beneficieryAmount: {
            type: "string",
            title: "Amount",
          },
        },
      },
    },
    maxBeneficiariesLimit: {
      type: "boolean",
      title: "Max Beneficiaries Limit",
    },
    numberText: { type: "string", title: "Number" },
  },
};

export const termsAndConditionSchema: JSONSchema7 = {
  title: "",
  type: "object",

  properties: {
    academicYear: {
      type: "boolean",
      title:
        "Avail this Benefit in case any other govt. Benefit is availed in the same academic year",
    },
    forOneYear: {
      type: "boolean",
      title:
        "If the student fails, Benefit studying in any class will be available only for one year",
    },
    applicationDeadlineDate: {
      type: "string",
      title: "Application Deadline Date",
    },
    extendDeadlineDate: {
      type: "string",
      title: "Extend Deadline Date",
    },
    validDate: {
      type: "string",
      title: "Valid Till Date",
    },
    renewalApplicable: { type: "boolean", title: "Auto Renewal Applicable" },
  },
};
