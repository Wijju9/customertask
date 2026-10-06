import { Appointment, CustomerTask, Database, MasterItem, TaskStatus, User, UserType } from '../models/models';

/** Sample data shown the first time the app opens (before anything is saved). */

const WORK_NAMES = [
  'Notery',
  'Dastavej',
  'Notice',
  'inheritance',
  'Power of Attorney',
];

const RAKE_FILE_NAMES = [
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
];

// Column order: id, customer, workId, documents, notes, status, employeeId, created
type TaskRow = [number, string, number, number[], string, TaskStatus, number, string];

const TASK_ROWS: TaskRow[] = [
  [1, 'Rajesh Patel', 1, [1, 2, 3], 'Passport renewal application', 'Pending', 2, '2026-10-01T09:30'],
  [2, 'Amit Shah', 2, [1, 2], 'Tourist visa application', 'Process', 3, '2026-10-01T10:00'],
  [3, 'Priya Mehta', 3, [1, 2, 3, 4], 'ITR filing for FY 2025-26', 'Done', 2, '2026-10-01T10:30'],
  [4, 'Vivek Joshi', 4, [1, 2, 3], 'New GST registration', 'Pending', 4, '2026-10-01T11:00'],
  [5, 'Neha Patel', 5, [1, 2, 3, 4, 5], 'Private limited company registration', 'Process', 5, '2026-10-01T11:30'],
  [6, 'Karan Desai', 1, [1], 'New passport application', 'Done', 3, '2026-10-02T09:00'],
  [7, 'Pooja Shah', 2, [1, 2, 3, 4], 'Business visa documentation', 'Pending', 2, '2026-10-02T09:30'],
  [8, 'Rahul Mehta', 3, [1, 2], 'Income tax return filing', 'Process', 4, '2026-10-02T10:00'],
  [9, 'Hetal Joshi', 4, [1, 2, 3, 4, 5, 6], 'GST registration with complete documents', 'Done', 5, '2026-10-02T10:30'],
  [10, 'Manish Patel', 5, [1, 2], 'Company incorporation', 'Pending', 3, '2026-10-02T11:00'],
  [11, 'Bhavna Shah', 1, [1, 2, 3, 4], 'Passport renewal', 'Process', 2, '2026-10-03T09:00'],
  [12, 'Sanjay Mehta', 2, [1, 2, 3], 'Student visa application', 'Pending', 4, '2026-10-03T09:30'],
  [13, 'Rina Patel', 3, [1, 2, 3, 4, 5], 'ITR with investment details', 'Done', 5, '2026-10-03T10:00'],
  [14, 'Akash Shah', 4, [1, 2], 'GST amendment', 'Process', 3, '2026-10-03T10:30'],
  [15, 'Komal Joshi', 5, [1, 2, 3], 'LLP registration', 'Pending', 2, '2026-10-03T11:00'],
  [16, 'Nilesh Patel', 1, [1, 2], 'Passport correction', 'Done', 4, '2026-10-04T09:00'],
  [17, 'Divya Shah', 2, [1, 2, 3, 4, 5], 'Work visa application', 'Process', 5, '2026-10-04T09:30'],
  [18, 'Harsh Mehta', 3, [1, 2, 3], 'Business income tax return', 'Pending', 3, '2026-10-04T10:00'],
  [19, 'Jignesh Patel', 4, [1], 'GST certificate update', 'Done', 2, '2026-10-04T10:30'],
  [20, 'Anjali Shah', 5, [1, 2, 3, 4, 5, 6], 'Company registration with all documents', 'Process', 4, '2026-10-04T11:00'],
];

// Column order: id, customerTaskId, notes, date
type AppointmentRow = [number, number, string, string];

const APPOINTMENT_ROWS: AppointmentRow[] = [
  [1, 1, 'Discuss passport renewal documents', '2026-10-06T10:00'],
  [2, 5, 'Company registration document verification', '2026-10-06T11:30'],
  [3, 9, 'GST registration discussion', '2026-10-07T10:30'],
  [4, 13, 'Income tax return document review', '2026-10-07T12:00'],
  [5, 17, 'Work visa application consultation', '2026-10-08T15:00'],
];

function toMasterItems(names: string[]): MasterItem[] {
  return names.map((name, index) => ({ id: index + 1, name, isActive: true }));
}

function createUsers(): User[] {
  return [1, 2, 3, 4, 5].map((id) => {
    const isAdmin = id === 1;
    return {
      id,
      mobileNo: `987650000${id}`,
      email: isAdmin ? 'admin@company.com' : `employee${id - 1}@company.com`,
      password: isAdmin ? 'Admin@123' : 'Employee@123',
      userType: isAdmin ? UserType.Admin : UserType.Employee,
      isActive: true,
    };
  });
}

function createTasks(): CustomerTask[] {
  return TASK_ROWS.map(([id, name, workId, documents, notes, status, userId, created]) => ({
    id,
    name,
    whatsappNumber: String(9876510000 + id),
    workId,
    rakeFileId: workId, // each work has a matching rake file with the same id
    documents,
    notes,
    status,
    userId,
    isActive: true,
    createDate: `${created}:00`,
  }));
}

function createAppointments(): Appointment[] {
  return APPOINTMENT_ROWS.map(([id, customerId, notes, date]) => ({
    id,
    customerId,
    notes,
    adminId: 1,
    appointmentDate: `${date}:00`,
    isActive: true,
  }));
}

export function createSeedData(): Database {
  return {
    users: createUsers(),
    works: toMasterItems(WORK_NAMES),
    rakeFiles: toMasterItems(RAKE_FILE_NAMES),
    customerTasks: createTasks(),
    appointments: createAppointments(),
  };
}
