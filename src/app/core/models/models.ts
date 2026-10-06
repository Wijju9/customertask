/**
 * Data shapes used across the app.
 * They mirror the tables in the original FileDesk database
 * (Users, Works, RakeFiles, CustomerTasks, Appointments).
 */

export const TASK_STATUSES = ['Pending', 'Process', 'Done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Numbers of the documents a customer can hand over ("Doc 1" ... "Doc 6"). */
export const DOCUMENT_NUMBERS = [1, 2, 3, 4, 5, 6] as const;

export const UserType = { Admin: 1, Employee: 2 } as const;
export type UserType = (typeof UserType)[keyof typeof UserType];

export interface User {
  id: number;
  mobileNo: string;
  email: string;
  /** Demo only. A real backend must store a password hash, never plain text. */
  password: string;
  userType: UserType;
  isActive: boolean;
}

/** A lookup row. Used for both "Works" and "Rake files". */
export interface MasterItem {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CustomerTask {
  id: number;
  name: string;
  whatsappNumber: string;
  workId: number;
  rakeFileId: number;
  documents: number[];
  notes: string;
  status: TaskStatus;
  /** The employee this task is assigned to. */
  userId: number;
  isActive: boolean;
  /** Local date-time, e.g. "2026-10-01T09:30:00". */
  createDate: string;
}

export interface Appointment {
  id: number;
  customerId: number;
  notes: string;
  adminId: number;
  /** Local date-time, e.g. "2026-10-06T10:00:00". */
  appointmentDate: string;
  isActive: boolean;
}

export interface Database {
  users: User[];
  works: MasterItem[];
  rakeFiles: MasterItem[];
  customerTasks: CustomerTask[];
  appointments: Appointment[];
}

/** The two lookup lists that share one management screen. */
export type MasterKey = 'works' | 'rakeFiles';
