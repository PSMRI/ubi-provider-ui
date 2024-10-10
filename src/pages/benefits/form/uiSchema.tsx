export const generalInformationUiSchema = {
  benefitName: {
    "ui:widget": "text",
    "ui:options": {
      label: "Benefit Name",
      placeholder: "Benefit name",
      classNames: "column-left",
    },
  },
  benefitProvider: {
    "ui:widget": "text",
    "ui:options": {
      label: "Benefit Provider",
      placeholder: "Benefit provider",
      classNames: "column-left",
    },
  },
  benefitSponsor1: {
    "ui:widget": "text",
    "ui:options": {
      label: "Benefit Sponsor-1",
      placeholder: "Benefit Sponsor 1 Name",
    },
    "ui:classNames": "half-width", // Add a class for styling
  },
  sponsor1Entity: {
    "ui:widget": "select",
    "ui:options": {
      label: "Sponsor-1 Entity Type",
      placeholder: "Select Entity Type",
    },
    "ui:classNames": "half-width", // Add a class for styling
  },
  sponsor1Share: {
    "ui:widget": "select",
    "ui:options": {
      label: "Sponsor-1 Share (Percentage)",
      placeholder: "Select Share Percentage",
    },
    "ui:classNames": "half-width", // Add a class for styling
  },
  description: {
    "ui:widget": "text",
    "ui:options": {
      label: "Description",
      placeholder: "Benefit Description",
    },
  },
};

export const eligibilityUiSchema = {
  class: { "ui:widget": "select" },
  marks: { "ui:widget": "select" },
  minQualification: { "ui:widget": "select" },
  fieldOfStudy: { "ui:widget": "select" },
  attendancePercentage: { "ui:widget": "select" },
  annualIncome: { "ui:widget": "select" },
  domicile: { "ui:widget": "select" },
  age: { "ui:widget": "select" },
  eligibleChildren: { "ui:widget": "select" },
  gender: { "ui:widget": "radio" },
  caste: { "ui:widget": "checkboxes" },
  disability: { "ui:widget": "radio" },
  dayScholar: { "ui:widget": "radio" },
};

export const financialInformaionUiSchema = {
  parentOccupation: { "ui:widget": "select" },
  amountPerBeneficiaryCategory: {
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
      "ui:widget": "select",
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
        "ui:widget": "select",
      },
    },
  },
  maxBeneficiariesLimit: { "ui:widget": "radio" },
};

export const termsAndConditionUiSchema = {
  academicYear: { "ui:widget": "radio" },
  forOneYear: { "ui:widget": "radio" },
  applicationDeadlineDate: { "ui:widget": "select" },
  extendDeadlineDate: {
    "ui:widget": "select",
  },
  validDate: {
    "ui:widget": "select",
  },
  beneficieryCategory: {
    "ui:widget": "select",
  },
  beneficieryAmount: {
    "ui:widget": "select",
  },

  renewalApplicable: { "ui:widget": "radio" },
};
