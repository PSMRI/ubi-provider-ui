//Heading

export const tableHeader = [
  { id: 1, label: "Name" },
  { id: 2, label: "Applicants" },
  { id: 3, label: "Approved" },
  { id: 4, label: "Rejected" },
  { id: 5, label: "Disbursal Pending" },
  { id: 6, label: "Deadline" },
  { id: 7, label: "Action" },
];

// Sample data in JSON format
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
    }, ${Math.floor(Math.random() * 2025) + 2020}`,
    status,
  };
});

// sample data for card on dashboard
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
