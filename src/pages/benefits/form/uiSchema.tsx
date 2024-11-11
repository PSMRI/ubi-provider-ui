export const generalInformationUiSchema = {
  benefitName: {
    "ui:widget": "text",
    "ui:column": 6, // Half-width for two-column layout
    "ui:options": {
      label: "Benefit Name",
      placeholder: "Benefit name",
      classNames: "column-left",
    },
  },
  benefitProvider: {
    "ui:widget": "text",
    "ui:column": 6,
    "ui:options": {
      label: "Benefit Provider",
      placeholder: "Benefit provider",
      classNames: "column-left",
    },
  },
  benefitSponsor1: {
    "ui:widget": "text",
    "ui:column": 6,
    "ui:options": {
      label: "Benefit Sponsor-1",
      placeholder: "Benefit Sponsor 1 Name",
    },
    "ui:classNames": "half-width", // Add a class for styling
  },
  sponsor1Entity: {
    "ui:widget": "select",
    "ui:column": 6,
    "ui:options": {
      label: "Sponsor-1 Entity Type",
      placeholder: "Select Entity Type",
    },
    "ui:classNames": "half-width", // Add a class for styling
  },
  sponsor1Share: {
    "ui:widget": "text",
    "ui:column": 6,
    "ui:options": {
      label: "Sponsor-1 Share (Percentage)",
      placeholder: "Enter Share Percentage",
    },
    "ui:classNames": "half-width", // Add a class for styling
  },
  description: {
    "ui:widget": "text",
    "ui:column": 12,
    "ui:options": {
      label: "Description",
      placeholder: "Benefit Description",
    },
  },
};

export const eligibilityUiSchema = {
  class: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Classes", // Add placeholder here
    },
  },
  marks: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Marks", // Add placeholder here
    },
  },
  minQualification: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Qualification", // Add placeholder here
    },
  },
  fieldOfStudy: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Subject", // Add placeholder here
    },
  },
  attendancePercentage: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Range", // Add placeholder here
    },
  },
  annualIncome: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Range", // Add placeholder here
    },
  },
  domicile: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select State(s)", // Add placeholder here
    },
  },
  age: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Age", // Add placeholder here
    },
  },
  eligibleChildren: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Limit", // Add placeholder here
    },
  },
  gender: { "ui:widget": "radio" },
  caste: { "ui:widget": "checkboxes" },
  disability: { "ui:widget": "radio" },
  dayScholar: { "ui:widget": "radio" },
};

export const financialInformaionUiSchema = {
  parentOccupation: {
    "ui:widget": "select",
    "ui:options": {
      placeholder: "Select Parent's Occupation", // Add placeholder here
    },
  },
  amountPerBeneficiaryCategory: {
    beneficieryCaste: {
      "ui:widget": "select",
      "ui:options": {
        placeholder: "Beneficiary Caste", // Add placeholder here
      },
    },
    beneficieryType: {
      "ui:widget": "select",
      "ui:options": {
        placeholder: "Beneficiary Type", // Add placeholder here
      },
    },
    beneficieryCategory: {
      "ui:widget": "select",
      "ui:options": {
        placeholder: "Beneficiary Category", // Add placeholder here
      },
    },
    beneficieryAmount: {
      "ui:widget": "text",
      "ui:options": {
        placeholder: "Amount", // Add placeholder here
      },
    },
  },
  "": {
    items: {
      beneficieryCaste: {
        "ui:widget": "select",
      },
      beneficieryType: {
        "ui:widget": "select",
      },
      beneficieryCategory: {
        "ui:widget": "select",
      },
      beneficieryAmount: {
        "ui:widget": "text",
      },
    },
  },
  maxBeneficiariesLimit: { "ui:widget": "radio" },
};

export const termsAndConditionUiSchema = {
  academicYear: { "ui:widget": "radio" },
  forOneYear: { "ui:widget": "radio" },
  applicationDeadlineDate: {
    "ui:widget": "DateWidget",
    "ui:options": {
      placeholder: "Set Deadline", // Add placeholder here
    },
  },
  extendDeadlineDate: {
    "ui:widget": "DateWidget",
    "ui:options": {
      placeholder: "Set Deadline", // Add placeholder here
    },
  },
  validDate: {
    "ui:widget": "DateWidget",
    "ui:options": {
      placeholder: "Set Validity", // Add placeholder here
    },
  },
  beneficieryCategory: {
    "ui:widget": "text",
  },
  beneficieryAmount: {
    "ui:widget": "text",
  },

  renewalApplicable: { "ui:widget": "radio" },
};
