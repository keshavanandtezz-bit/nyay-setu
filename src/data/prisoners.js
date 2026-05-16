export const prisoners = [
  {
    prisoner_id: "KA/BLR/2024/001",
    prisoner_name: "Ramesh Kumar Nair",
    age: 34,
    arrest_date: "2024-01-15",
    prison_location: "Central Prison, Parappana Agrahara, Bengaluru",
    district: "Bengaluru Urban",
    charges: "Theft and criminal trespass under IPC",
    ipc_sections: "IPC 379, IPC 447, IPC 411",
    lawyer_assigned: "Adv. Suresh Bhat",
    lawyer_phone: "9845012345",
    case_status: "Trial in Progress",
    court: "Sessions Court, Bengaluru",
    judge: "Hon. Justice K. Ramakrishna",
    next_hearing_date: "2025-06-10",
    family_contact: "9900112233",
    case_number: "SC/BLR/2024/1182",
    hearings: [
      { date: "2024-02-20", outcome: "Case registered, bail denied", next_date: "2024-04-15", delay_reason: "Witness not present" },
      { date: "2024-04-15", outcome: "Bail application filed", next_date: "2024-06-01", delay_reason: "Judge on leave" },
      { date: "2024-06-01", outcome: "Bail rejected, charge sheet submitted", next_date: "2024-09-10", delay_reason: "None" },
      { date: "2024-09-10", outcome: "Cross examination of witness", next_date: "2025-01-20", delay_reason: "Lawyer not available" },
      { date: "2025-01-20", outcome: "Arguments heard partially", next_date: "2025-06-10", delay_reason: "Court backlog" },
    ]
  },
  {
    prisoner_id: "KA/MYS/2024/047",
    prisoner_name: "Suresh Babu Gowda",
    age: 28,
    arrest_date: "2023-08-03",
    prison_location: "District Prison, Mysuru",
    district: "Mysuru",
    charges: "Assault and causing grievous hurt",
    ipc_sections: "IPC 323, IPC 325, IPC 506",
    lawyer_assigned: "Not assigned yet",
    lawyer_phone: null,
    case_status: "Awaiting Trial",
    court: "JMFC Court, Mysuru",
    judge: "Hon. Justice P. Srinivas",
    next_hearing_date: "2025-05-28",
    family_contact: "9741234567",
    case_number: "JMFC/MYS/2023/887",
    hearings: [
      { date: "2023-09-01", outcome: "First hearing, remand extended", next_date: "2023-11-15", delay_reason: "Chargesheet pending" },
      { date: "2023-11-15", outcome: "Chargesheet filed", next_date: "2024-02-20", delay_reason: "None" },
      { date: "2024-02-20", outcome: "Bail plea rejected", next_date: "2024-07-10", delay_reason: "Complainant absent" },
      { date: "2024-07-10", outcome: "Adjourned", next_date: "2025-01-15", delay_reason: "Judge transfer" },
      { date: "2025-01-15", outcome: "Adjourned again", next_date: "2025-05-28", delay_reason: "No lawyer for accused" },
    ]
  },
  {
    prisoner_id: "KA/TUK/2023/112",
    prisoner_name: "Manjunath Reddy",
    age: 45,
    arrest_date: "2023-03-18",
    prison_location: "District Prison, Tumkur",
    district: "Tumakuru",
    charges: "Cheating and fraud under IPC",
    ipc_sections: "IPC 420, IPC 406, IPC 120B",
    lawyer_assigned: "Adv. Kavitha Rao",
    lawyer_phone: "9632587410",
    case_status: "Trial in Progress",
    court: "Sessions Court, Tumkur",
    judge: "Hon. Justice M. Nagaraj",
    next_hearing_date: "2025-06-05",
    family_contact: "9876543210",
    case_number: "SC/TUK/2023/445",
    hearings: [
      { date: "2023-05-10", outcome: "Bail denied, remand extended", next_date: "2023-08-22", delay_reason: "None" },
      { date: "2023-08-22", outcome: "Witnesses examined", next_date: "2024-01-30", delay_reason: "Witness non-appearance" },
      { date: "2024-01-30", outcome: "Arguments started", next_date: "2024-05-15", delay_reason: "None" },
      { date: "2024-05-15", outcome: "Adjourned", next_date: "2024-11-20", delay_reason: "Lawyer on leave" },
      { date: "2024-11-20", outcome: "Partially heard", next_date: "2025-06-05", delay_reason: "Court backlog" },
    ]
  },
  {
    prisoner_id: "KA/HBL/2024/033",
    prisoner_name: "Pradeep Singh Rathod",
    age: 22,
    arrest_date: "2024-07-10",
    prison_location: "District Prison, Hubballi",
    district: "Dharwad",
    charges: "Drug possession and sale under NDPS Act",
    ipc_sections: "NDPS Act Sec 20, Sec 29",
    lawyer_assigned: "Legal Aid — Adv. Anand Kulkarni",
    lawyer_phone: "8765432109",
    case_status: "Under Investigation",
    court: "Special NDPS Court, Hubballi",
    judge: "Hon. Justice R. Patil",
    next_hearing_date: "2025-05-22",
    family_contact: "9845678901",
    case_number: "NDPS/HBL/2024/78",
    hearings: [
      { date: "2024-08-15", outcome: "Bail denied, remanded to judicial custody", next_date: "2024-10-20", delay_reason: "None" },
      { date: "2024-10-20", outcome: "Investigation report submitted", next_date: "2025-02-18", delay_reason: "FSL report pending" },
      { date: "2025-02-18", outcome: "Chargesheet filed", next_date: "2025-05-22", delay_reason: "None" },
    ]
  },
  {
    prisoner_id: "KA/BLR/2022/556",
    prisoner_name: "Venkatesh Pillai",
    age: 52,
    arrest_date: "2022-05-12",
    prison_location: "Central Prison, Parappana Agrahara, Bengaluru",
    district: "Bengaluru Urban",
    charges: "Murder and destruction of evidence",
    ipc_sections: "IPC 302, IPC 201, IPC 34",
    lawyer_assigned: "Adv. Raghunath Sharma",
    lawyer_phone: "9980011223",
    case_status: "Trial in Progress",
    court: "Sessions Court, Bengaluru",
    judge: "Hon. Justice S. Venkataraman",
    next_hearing_date: "2025-06-18",
    family_contact: "9741122334",
    case_number: "SC/BLR/2022/334",
    hearings: [
      { date: "2022-06-20", outcome: "Bail denied", next_date: "2022-09-15", delay_reason: "None" },
      { date: "2022-09-15", outcome: "Chargesheet filed", next_date: "2023-01-10", delay_reason: "None" },
      { date: "2023-01-10", outcome: "Witnesses examined", next_date: "2023-06-20", delay_reason: "None" },
      { date: "2023-06-20", outcome: "Cross examination", next_date: "2024-01-15", delay_reason: "Witness non-appearance" },
      { date: "2024-01-15", outcome: "Arguments heard", next_date: "2024-08-20", delay_reason: "Judge on leave" },
      { date: "2024-08-20", outcome: "Adjourned", next_date: "2025-02-10", delay_reason: "Court backlog" },
      { date: "2025-02-10", outcome: "Partial arguments", next_date: "2025-06-18", delay_reason: "None" },
    ]
  }
];

export function searchPrisoners(query) {
  const q = query.toLowerCase().trim();
  return prisoners.filter(p =>
    p.prisoner_id.toLowerCase().includes(q) ||
    p.prisoner_name.toLowerCase().includes(q) ||
    p.case_number.toLowerCase().includes(q)
  );
}

export function getDaysInCustody(arrestDate) {
  const arrest = new Date(arrestDate);
  const today = new Date();
  return Math.floor((today - arrest) / (1000 * 60 * 60 * 24));
}

export function getAlertStatus(days, ipcSections) {
  const isSerious = ipcSections.includes('302') || ipcSections.includes('NDPS');
  const maxDays = isSerious ? 90 : 60;
  if (days > maxDays + 30) return 'red';
  if (days > maxDays) return 'orange';
  return 'green';
}