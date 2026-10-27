import React from 'react';
import { RecordData } from '../types';
import { Key, Shield, User } from 'lucide-react';
import { BarcodeGenerator } from './BarcodeGenerator';
import { extractUsername, extractTeacherLastName, formatStudentFullName, formatGradeDisplay } from '../utils/studentDataHelpers';

interface StudentCardBackProps {
  data: RecordData;
  schoolName?: string;
}

export const StudentCardBack: React.FC<StudentCardBackProps> = ({
  data,
  schoolName = 'Glen Forest Elementary School'
}) => {
  const username = data.username || extractUsername(data.email, data.studentId) || data.studentId;
  const lunchId = data.lunchId || data.studentId || '—';
  const barcodeValue = data.barcode || username;
  const teacherLastName = extractTeacherLastName(data.staffName);
  const studentDisplayName = formatStudentFullName(data.firstName, data.lastName, data.studentName);
  const displayGrade = formatGradeDisplay(data.grade);

  return (
    <div
      className="relative w-[3.5in] h-[2in] bg-slate-50 border border-slate-300 rounded-sm p-2 flex flex-col justify-between overflow-hidden shadow-xs print:shadow-none print:border-none print:m-0 print:p-[0.1in] print:bg-white"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-blue-200 pb-1 bg-blue-900 text-white -mx-2 -mt-2 px-2 py-1.5">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Student Login & Credentials
          </span>
        </div>
        <span className="text-[8.5px] font-medium text-blue-100 opacity-90 truncate max-w-[1.2in]">
          {schoolName}
        </span>
      </div>

      {/* Student Identity & Lunch ID & Username */}
      <div className="mt-1 flex justify-between items-center bg-white border border-slate-200 rounded px-2 py-1 gap-1">
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span className="text-[11px] font-extrabold text-slate-900 truncate" title={studentDisplayName}>
            {studentDisplayName}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
            Lunch ID: <strong className="text-slate-950">{lunchId}</strong>
          </span>
        </div>
      </div>

      {/* Computer Login & Password Row */}
      <div className="my-0.5 grid grid-cols-2 gap-1.5">
        {/* Computer Login */}
        <div className="bg-blue-50/80 border border-blue-200 rounded p-1 flex flex-col items-center justify-center text-center">
          <span className="text-[7.5px] font-extrabold text-blue-900 uppercase tracking-tight">
            Computer Login
          </span>
          <span className="text-[11px] font-black font-mono text-blue-950 truncate max-w-full select-all" title={username}>
            {username}
          </span>
        </div>

        {/* Password */}
        <div className="bg-amber-50 border border-amber-300 rounded p-1 flex flex-col items-center justify-center text-center shadow-2xs">
          <div className="flex items-center gap-0.5 text-[7.5px] font-extrabold text-amber-900 uppercase tracking-tight">
            <Key className="w-2.5 h-2.5 text-amber-700" />
            <span>FCPS Password</span>
          </div>
          <span className="text-[11px] font-black font-mono text-amber-950 truncate max-w-full select-all" title={data.password || 'GFES#2026'}>
            {data.password || 'GFES#2026'}
          </span>
        </div>
      </div>

      {/* Footer Info: Grade, Room, Teacher last name & Barcode */}
      <div className="flex justify-between items-center text-[8.5px] text-slate-700 font-medium pt-0.5 border-t border-slate-200">
        <div>
          {displayGrade && (
            <>
              <span>Gr: <strong className="text-slate-900">{displayGrade}</strong></span>
              <span className="mx-1">•</span>
            </>
          )}
          <span>Rm: <strong className="text-slate-900">{data.roomNumber || '—'}</strong></span>
          {teacherLastName && (
            <span className="ml-1 text-slate-600 font-medium">({teacherLastName})</span>
          )}
        </div>
        <div className="h-[20px] w-[1.1in] flex justify-end">
          <BarcodeGenerator
            value={barcodeValue || '1234567'}
            height={18}
            width={0.95}
            fontSize={7}
            displayValue={false}
          />
        </div>
      </div>
    </div>
  );
};

