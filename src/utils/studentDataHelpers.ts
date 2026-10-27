import { RecordData } from '../types';

/**
 * Removes middle initials (single letters with or without dots, e.g. "I.", "I", "M.", "M")
 * from names while preserving full names.
 */
export function removeMiddleInitials(str?: string): string {
  if (!str) return '';
  const trimmed = str.trim();
  const words = trimmed.split(/\s+/);
  if (words.length <= 1) {
    // If it's a single word like "Alexis", return it
    return trimmed;
  }
  // Filter out single letter tokens or single letter with dot (e.g. "I.", "I", "M.", "M")
  const filtered = words.filter((word) => !/^[A-Za-z]\.?$/.test(word));
  if (filtered.length > 0) {
    return filtered.join(' ');
  }
  return trimmed;
}

/**
 * Formats student full name in the "First Last" format without middle initials.
 * If First Name and Last Name are given: "First Last"
 * If rawName is "Last, First M" or "Last, First": extracts to "First Last"
 */
export function formatStudentFullName(firstName?: string, lastName?: string, rawName?: string): string {
  const fName = removeMiddleInitials(firstName?.trim() || '');
  const lName = removeMiddleInitials(lastName?.trim() || '');

  if (fName && lName) {
    return `${fName} ${lName}`;
  }
  if (fName) return fName;

  if (rawName) {
    const trimmed = rawName.trim();
    if (trimmed.includes(',')) {
      const parts = trimmed.split(',');
      const last = removeMiddleInitials(parts[0].trim());
      const first = removeMiddleInitials(parts.slice(1).join(' ').trim());
      if (first && last) {
        return `${first} ${last}`;
      }
      return first || last;
    }
    return removeMiddleInitials(trimmed);
  }

  if (lName) return lName;
  return 'Student';
}

/**
 * Extracts just the teacher's last name from names formatted as:
 * - "Last, First M" -> "Last"
 * - "First Last" -> "Last"
 * - "Last" -> "Last"
 */
export function extractTeacherLastName(staffName?: string): string {
  if (!staffName) return '';
  const trimmed = staffName.trim();
  if (trimmed.includes(',')) {
    return removeMiddleInitials(trimmed.split(',')[0].trim());
  }
  // If "April Marcot" (First Last), extract last word if no comma
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    return removeMiddleInitials(parts[parts.length - 1].trim());
  }
  return removeMiddleInitials(trimmed);
}

/**
 * Extracts student last name from record
 */
export function getStudentLastName(record: Partial<RecordData>): string {
  if (record.lastName && record.lastName.trim()) {
    return removeMiddleInitials(record.lastName.trim());
  }
  const raw = record.studentName || (record as any)['Student Name'] || (record as any)['FullName'] || '';
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.includes(',')) {
    return removeMiddleInitials(trimmed.split(',')[0].trim());
  }
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) {
    return removeMiddleInitials(parts.slice(1).join(' ').trim());
  }
  return removeMiddleInitials(trimmed);
}

/**
 * Extracts student first name from record
 */
export function getStudentFirstName(record: Partial<RecordData>): string {
  if (record.firstName && record.firstName.trim()) {
    return removeMiddleInitials(record.firstName.trim());
  }
  const raw = record.studentName || (record as any)['Student Name'] || (record as any)['FullName'] || '';
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',');
    return removeMiddleInitials((parts[1] || '').trim());
  }
  const parts = trimmed.split(/\s+/);
  return removeMiddleInitials(parts[0] || '');
}

/**
 * Checks if a grade is an excluded/non-printing grade (PS, HS, 00, 0, Preschool, Head Start).
 */
export function isExcludedGrade(gradeStr?: string): boolean {
  if (!gradeStr) return false;
  const cleaned = gradeStr.toString().trim().toUpperCase();
  return (
    cleaned === 'PS' ||
    cleaned === 'HS' ||
    cleaned === '00' ||
    cleaned === '0' ||
    cleaned === 'PRESCHOOL' ||
    cleaned === 'HEAD START' ||
    cleaned === 'HEADSTART'
  );
}

/**
 * Formats grade for display on badges/cards:
 * - Strips leading zero (e.g. "05" -> "5", "03" -> "3", "01" -> "1")
 * - If grade is PS, HS, 00, or invalid, returns empty string to prevent printing PS/HS/00.
 */
export function formatGradeDisplay(gradeStr?: string): string {
  if (!gradeStr) return '';
  if (isExcludedGrade(gradeStr)) {
    return '';
  }
  const cleaned = gradeStr.toString().trim().toUpperCase();
  if (/^0[1-9]$/.test(cleaned)) {
    return cleaned.replace(/^0/, '');
  }
  return cleaned;
}

/**
 * Computes numerical rank for grades for descending sorting (highest grade first).
 * Grade 12 -> 12, Grade 5 -> 5, Grade 1 -> 1, K -> 0, PK -> -1, Staff -> -100
 */
export function getGradeRank(gradeStr?: string): number {
  if (!gradeStr) return -999;
  const cleaned = gradeStr.toString().trim().toLowerCase();
  if (cleaned.includes('staff')) return -100;
  if (cleaned === 'ps' || cleaned === 'hs' || cleaned === '00' || cleaned === '0') return -500;
  if (cleaned.includes('pre') || cleaned.includes('pk')) return -1;
  if (cleaned === 'k' || cleaned === 'kg' || cleaned.includes('kindergarten')) {
    return 0;
  }
  const match = cleaned.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  return -999;
}

/**
 * Sorts student/staff records for printing:
 * 1. Highest grade first (e.g. 5, 4, 3, 2, 1, K, PK)
 * 2. Teacher last name (A-Z)
 * 3. Student last name (A-Z)
 * 4. Student first name (A-Z)
 */
export function sortRecordsForPrint(records: RecordData[]): RecordData[] {
  return [...records].sort((a, b) => {
    // 1. Grade descending (highest grade first)
    const rankA = getGradeRank(a.grade);
    const rankB = getGradeRank(b.grade);
    if (rankA !== rankB) {
      return rankB - rankA;
    }

    // 2. Teacher last name (A-Z)
    const teacherA = extractTeacherLastName(a.staffName).toLowerCase();
    const teacherB = extractTeacherLastName(b.staffName).toLowerCase();
    if (teacherA !== teacherB) {
      if (!teacherA) return 1;
      if (!teacherB) return -1;
      return teacherA.localeCompare(teacherB);
    }

    // 3. Student last name (A-Z)
    const lastA = getStudentLastName(a).toLowerCase();
    const lastB = getStudentLastName(b).toLowerCase();
    if (lastA !== lastB) {
      if (!lastA) return 1;
      if (!lastB) return -1;
      return lastA.localeCompare(lastB);
    }

    // 4. Student first name (A-Z)
    const firstA = getStudentFirstName(a).toLowerCase();
    const firstB = getStudentFirstName(b).toLowerCase();
    return firstA.localeCompare(firstB);
  });
}

/**
 * Truncates an email address to extract just the username (e.g. "jsmith24@fcpsschools.net" -> "jsmith24")
 */
export function extractUsername(emailOrUsername?: string, fallbackId?: string): string {
  if (!emailOrUsername) return fallbackId || '';
  const trimmed = emailOrUsername.trim();
  if (trimmed.includes('@')) {
    return trimmed.split('@')[0].trim();
  }
  return trimmed;
}

/**
 * Normalizes and ensures student record fields:
 * - Student Name = Formatted as "First Last" without middle initials
 * - Lunch ID = studentId / FCPS ID
 * - Username = Student Email 1 truncated (strip @fcpsschools.net)
 * - Barcode = Username (for barcode scanning)
 * - Teacher Name = Just the last name (from "Last, First M" or "First Last")
 */
export function normalizeStudentRecord(item: Partial<RecordData>, index: number = 0): RecordData {
  // Check email and username
  const emailRaw = item.email || (item as any)['Student Email 1'] || (item as any)['Student Email'] || (item as any)['Email'] || '';
  const studentIdRaw = item.studentId || (item as any)['Student ID'] || (item as any)['Lunch ID'] || (item as any)['FCPS ID'] || `${1850000 + index}`;
  
  let username = item.username || (item as any)['Username'] || (item as any)['username'] || '';
  if (!username && emailRaw) {
    username = extractUsername(emailRaw);
  } else if (!username) {
    username = studentIdRaw;
  }

  // Barcode should always be the username
  const barcode = item.barcode || username || studentIdRaw;

  // Student name handling in "First Last" format without middle initials
  const rawStudentName = item.studentName || (item as any)['Student Name'] || (item as any)['FullName'] || (item as any)['Full Name'] || (item as any)['Name'] || '';
  const lastName = removeMiddleInitials(item.lastName || (item as any)['Last Name'] || '');
  const firstName = removeMiddleInitials(item.firstName || (item as any)['First Name'] || '');
  const studentName = formatStudentFullName(firstName, lastName, rawStudentName);

  const grade = item.grade || (item as any)['Grade'] || '03';
  const rawStaffName = item.staffName || (item as any)['Staff Name'] || (item as any)['Teacher'] || (item as any)['Teacher Name'] || '';
  const staffName = extractTeacherLastName(rawStaffName);
  const roomNumber = item.roomNumber || (item as any)['Room Name'] || (item as any)['Room Number'] || (item as any)['Room'] || '';
  const stateTestingId = item.stateTestingId || (item as any)['State Testing ID'] || (item as any)['Testing ID'] || '';
  const password = item.password || (item as any)['Password'] || 'GFES#2026';
  const pin = item.pin || (item as any)['PIN'] || (studentIdRaw ? studentIdRaw.slice(-4) : '1234');

  return {
    id: item.id || `rec_${Date.now()}_${index}`,
    studentName,
    studentId: studentIdRaw,
    lunchId: studentIdRaw,
    username,
    email: emailRaw || (username.includes('@') ? username : `${username}@fcpsschools.net`),
    stateTestingId,
    firstName,
    lastName,
    grade,
    staffName,
    roomNumber,
    password,
    barcode,
    pin,
    role: item.role || 'Student',
    hasSleeve: item.hasSleeve || (item as any)['Has Sleeve'] || 'Yes',
    hasCharger: item.hasCharger || (item as any)['Has Charger'] || 'Yes',
    hasLaptop: item.hasLaptop || (item as any)['Has Laptop'] || 'Yes',
    attendingSummerPrograms: item.attendingSummerPrograms || (item as any)['Attending Summer'] || 'No',
    deviceCheckedOutForSummer: item.deviceCheckedOutForSummer || (item as any)['Checked Out Summer'] || 'No',
    updatedAt: item.updatedAt || new Date().toISOString().split('T')[0],
    updatedBy: item.updatedBy || 'SIS Sync'
  };
}
