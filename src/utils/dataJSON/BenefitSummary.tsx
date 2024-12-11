export const tableHeader = [
  { id: 1, label: "Name" },
  { id: 2, label: "Applicants" },
  { id: 3, label: "Approved" },
  { id: 4, label: "Rejected" },
  { id: 5, label: "Disbursal Pending" },
  { id: 6, label: "Deadline" },
  { id: 7, label: "Action" },
];

export const visualRepresentation = {
  applicantsDisbursals: Array.from({ length: 7 }, (_, i) => ({
    label: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleString(
      "en-us",
      { weekday: "long" }
    ),
    count: Math.floor(Math.random() * 100),
  })),
  gender: [
    { label: "Male", count: 13 },
    { label: "Female", count: 27 },
    { label: "Others", count: 60 },
  ],
  caste: [
    { label: "SC", count: 13 },
    { label: "ST", count: 27 },
    { label: "OBC", count: 60 },
  ],
  standard: [
    { label: "15-25", count: 13 },
    { label: "25-35", count: 27 },
    { label: "45-55", count: 60 },
  ],
  ratio: [
    { label: "Day Scholars", count: 13 },
    { label: "Hostlers", count: 27 },
    { label: "Others", count: 60 },
  ],
};

export const tableData = Array.from({ length: 30 }, (_, i) => {
  const statusList = ["Active", "Closed", "Drafts"];
  const status = statusList[Math.floor(i / 10)];
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    name: `Pre-Matric Scholarship-SC ${status} ${Math.floor(
      Math.random() * 1000
    )}`,
    applicants: Math.floor(Math.random() * 1000),
    approved: Math.floor(Math.random() * 1000),
    rejected: Math.floor(Math.random() * 1000),
    disbursalPending: Math.floor(Math.random() * 1000),
    deadline: `${Math.floor(Math.random() * 12) + 1} ${
      Math.floor(Math.random() * 28) + 1
    }, ${Math.floor(Math.random() * 3) + 2021}`,
    status,
  };
});

export const cardData = [
  {
    id: 1,
    title: "Pre-Matric Scholarship-General",
    totalApplications: 4325,
    totalDisbursed: "1,00,000",
  },
  {
    id: 2,
    title: "Pre-Matric Scholarship-ST",
    totalApplications: 4325,
    totalDisbursed: "1,00,000",
  },
  {
    id: 3,
    title: "Pre-Matric Scholarship-SC",
    totalApplications: 4325,
    totalDisbursed: "1,00,000",
  },
];
