import React from 'react';
import { RecordData } from '../types';
import { BarcodeGenerator } from './BarcodeGenerator';
import { extractUsername, extractTeacherLastName, formatStudentFullName, formatGradeDisplay } from '../utils/studentDataHelpers';

interface IpadLabel5160Props {
  data: RecordData;
  schoolName?: string;
}

export const IpadLabel5160: React.FC<IpadLabel5160Props> = ({
  data,
  schoolName = 'Glen Forest ES',
}) => {
  const username = data.username || extractUsername(data.email, data.studentId) || data.studentId;
  const lunchId = data.lunchId || data.studentId || '—';
  const barcodeValue = data.barcode || username;
  const teacherLastName = extractTeacherLastName(data.staffName);
  const studentDisplayName = formatStudentFullName(data.firstName, data.lastName, data.studentName);
  const pinValue = data.pin || (lunchId && lunchId !== '—' ? lunchId.slice(-4) : '1234');
  const passValue = data.password || 'GFES#2026';
  const displayGrade = formatGradeDisplay(data.grade);

  return (
    <div
      className="relative w-[2.625in] h-[1in] bg-white border border-gray-300 rounded-2xs p-1 flex flex-col justify-between overflow-hidden text-gray-900 shadow-2xs print:shadow-none print:border-none print:p-[0.04in]"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header: School & Grade/Room */}
      <div className="flex justify-between items-center text-[7.5px] font-bold text-blue-900 border-b border-gray-200 pb-0.5 leading-none">
        <span className="truncate font-extrabold max-w-[1.6in]" title={schoolName}>
          {schoolName} — iPad
        </span>
        <span className="bg-blue-50 text-blue-950 px-1 py-0.2 rounded text-[7px] font-extrabold border border-blue-200 shrink-0">
          {displayGrade ? `Gr: ${displayGrade} | ` : ''}Rm: {data.roomNumber || '—'}
        </span>
      </div>

      {/* Main Student Name & Teacher */}
      <div className="flex justify-between items-center my-0.5 gap-1">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold text-slate-950 leading-tight truncate" title={studentDisplayName}>
            {studentDisplayName}
          </p>
          {teacherLastName && (
            <p className="text-[7px] text-slate-600 truncate font-medium">
              Teacher: <span className="font-bold text-slate-900">{teacherLastName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Lunch ID / Username / Password Credential Grid */}
      <div className="grid grid-cols-3 gap-0.5 bg-slate-50 border border-slate-200 rounded p-0.5 text-center my-0.5 text-[6.5px] font-mono leading-none">
        <div className="px-0.5">
          <span className="block text-[5.5px] font-extrabold text-slate-500 font-sans uppercase">Lunch ID</span>
          <span className="font-extrabold text-slate-900 truncate block">{lunchId}</span>
        </div>
        <div className="border-x border-slate-200 px-0.5">
          <span className="block text-[5.5px] font-extrabold text-blue-700 font-sans uppercase">User</span>
          <span className="font-extrabold text-blue-950 truncate block" title={username}>{username}</span>
        </div>
        <div className="px-0.5">
          <span className="block text-[5.5px] font-extrabold text-amber-700 font-sans uppercase">Password</span>
          <span className="font-extrabold text-amber-950 truncate block">{passValue}</span>
        </div>
      </div>

      {/* Bottom Barcode */}
      <div className="flex justify-between items-center h-[14px] pt-0.5 border-t border-gray-100">
        <span className="text-[6.5px] font-mono font-bold text-slate-600 truncate max-w-[1.1in]" title={`Barcode: ${barcodeValue}`}>
          Scan: {barcodeValue}
        </span>
        <div className="h-[12px] w-[1.1in] flex justify-end">
          <BarcodeGenerator
            value={barcodeValue || '1234567'}
            height={12}
            width={0.9}
            fontSize={7}
            displayValue={false}
          />
        </div>
      </div>
    </div>
  );
};

