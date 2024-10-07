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
  caste: { "ui:widget": "radio" },
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
