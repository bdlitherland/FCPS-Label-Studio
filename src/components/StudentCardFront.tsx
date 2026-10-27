import React from 'react';
import { RecordData } from '../types';
import { GlenForestLogo } from './GlenForestLogo';
import { BarcodeGenerator } from './BarcodeGenerator';
import { extractUsername, extractTeacherLastName, formatStudentFullName, formatGradeDisplay } from '../utils/studentDataHelpers';

interface StudentCardFrontProps {
  data: RecordData;
  schoolName?: string;
  schoolAddress?: string;
  schoolYear?: string;
  customLogoUrl?: string;
}

export const StudentCardFront: React.FC<StudentCardFrontProps> = ({
  data,
  schoolName = 'Glen Forest Elementary School',
  schoolAddress = 'Falls Church, VA',
  schoolYear = '2025-2026',
  customLogoUrl
}) => {
  const username = data.username || extractUsername(data.email, data.studentId) || data.studentId;
  const lunchId = data.lunchId || data.studentId || '—';
  const barcodeValue = data.barcode || username;
  const teacherLastName = extractTeacherLastName(data.staffName);
  const studentDisplayName = formatStudentFullName(data.firstName, data.lastName, data.studentName);
  const displayGrade = formatGradeDisplay(data.grade);

  return (
    <div
      className="relative w-[3.5in] h-[2in] bg-white border border-gray-300 rounded-sm p-2 flex flex-col justify-between overflow-hidden shadow-xs print:shadow-none print:border-none print:m-0 print:p-[0.1in] print:bg-white"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Header Row: School Name, Address & Year */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-1 shrink-0">
        <div className="min-w-0 pr-2">
          <h1 className="text-[10.5px] font-bold text-gray-900 leading-tight uppercase truncate" title={schoolName}>
            {schoolName}
          </h1>
          <p className="text-[8.5px] text-gray-600 font-medium truncate">
            {schoolAddress}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="inline-block bg-blue-50 text-blue-900 text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
            {schoolYear}
          </span>
        </div>
      </div>

      {/* Middle Content Row: Logo + Grade & Room + Teacher */}
      <div className="flex items-center justify-between my-1 px-0.5 gap-2">
        {/* School Logo Frame */}
        <div className="w-[1.05in] h-[0.75in] bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-1 shrink-0">
          <GlenForestLogo customUrl={customLogoUrl} className="h-full w-full object-contain" />
        </div>

        {/* Student Details & Credentials */}
        <div className="flex-1 space-y-1 text-right">
          <div className="bg-gray-100 rounded px-2 py-1 inline-block text-right">
            {displayGrade ? (
              <p className="text-[10.5px] font-bold text-gray-900">
                Grade: <span className="text-blue-900 font-extrabold">{displayGrade}</span>
              </p>
            ) : null}
            <p className="text-[10px] font-bold text-gray-800">
              Room: <span className="text-gray-900 font-extrabold">{data.roomNumber || '—'}</span>
            </p>
          </div>
          {teacherLastName && (
            <p className="text-[8.5px] text-gray-600 font-medium truncate" title={data.staffName}>
              Teacher: <span className="text-gray-900 font-bold">{teacherLastName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row: Student Name, Lunch ID, Barcode & Centered Computer Login */}
      <div className="pt-1 border-t border-gray-200 flex flex-col justify-end shrink-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="text-[11.5px] font-extrabold text-gray-900 truncate max-w-[2.0in]" title={studentDisplayName}>
            {studentDisplayName}
          </span>
          <div className="text-[9.5px] font-bold text-gray-800 space-x-2">
            <span>Lunch ID: <strong className="font-mono text-slate-950">{lunchId}</strong></span>
          </div>
        </div>

        {/* Barcode rendering */}
        <div className="w-full flex justify-center items-center h-[26px] overflow-hidden">
          <BarcodeGenerator
            value={barcodeValue || '1234567'}
            height={20}
            width={1.2}
            fontSize={8}
            displayValue={false}
          />
        </div>

        {/* Centered Computer Login information directly below barcode */}
        <div className="w-full flex justify-center items-center text-[7.5px] text-slate-700 font-bold mt-0.5">
          <span>Computer Login: <strong className="font-mono text-blue-950 font-black">{username}</strong></span>
        </div>
      </div>
    </div>
  );
};

