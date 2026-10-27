export interface RecordData {
  id: string;
  studentName: string;
  studentId: string; // Lunch ID / FCPS Student ID
  lunchId?: string; // Explicit alias for Lunch ID
  username?: string; // Student username (truncated from Student Email 1)
  email?: string; // Student Email 1 (username@fcpsschools.net)
  stateTestingId?: string;
  firstName?: string;
  lastName?: string;
  grade: string;
  staffName: string;
  password: string;
  barcode: string; // Scans username
  pin?: string;
  role?: string;
  title?: string;
  fullName?: string;
  description?: string;
  samAccountName?: string;
  roomNumber: string;
  hasSleeve?: boolean | string;
  hasCharger?: boolean | string;
  hasLaptop?: boolean | string;
  attendingSummerPrograms?: boolean | string;
  deviceCheckedOutForSummer?: boolean | string;
  // Device Asset Inventory Report Fields
  serialNumber?: string;
  assetTag?: string;
  make?: string;
  model?: string;
  deviceType?: string;
  site?: string;
  usage?: string;
  usability?: string;
  lifecycle?: string;
  ownedBy?: string;
  statusReason?: string;
  poNumber?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export type LabelTemplateType =
  | 'ipad-5160'
  | 'student-5874'
  | 'teacher-5874'
  | 'student-5523'
  | 'teacher-5523'
  | 'staff-dymo'
  | 'charger-dymo'
  | 'charger-sheet'
  | 'brother-ptouch';

export type PrintSideOption = 'single' | 'front' | 'back' | 'duplex';

export interface PrintSettings {
  template: LabelTemplateType;
  printSide: PrintSideOption; // for student-5874 & student-5523
  schoolName: string;
  districtName: string;
  schoolAddress: string;
  schoolPhone?: string;
  schoolYear: string;
  customLogoUrl: string;
  customFcpsLogoUrl?: string;
  showGridLines: boolean;
  offsetXMm: number;
  offsetYMm: number;
  selectedIds: string[];
  brotherHeaderText?: string;
  brotherTapeLength?: string;
}
