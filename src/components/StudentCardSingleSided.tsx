import React from 'react';
import { RecordData } from '../types';
import { GlenForestLogo } from './GlenForestLogo';
import { BarcodeGenerator } from './BarcodeGenerator';
import { Key, User, Utensils } from 'lucide-react';
import { extractUsername, extractTeacherLastName, formatStudentFullName, formatGradeDisplay } from '../utils/studentDataHelpers';

interface StudentCardSingleSidedProps {
  data: RecordData;
  schoolName?: string;
  schoolAddress?: string;
  schoolYear?: string;
  customLogoUrl?: string;
}

export const StudentCardSingleSided: React.FC<StudentCardSingleSidedProps> = ({
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
      className="relative w-[3.5in] h-[2in] bg-white border border-slate-300 rounded-sm p-2 flex flex-col justify-between overflow-hidden shadow-xs print:shadow-none print:border-none print:m-0 print:p-[0.08in] print:bg-white"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header: School Info + Mascot Logo + Badge Year */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-[0.38in] h-[0.38in] bg-slate-50 border border-slate-200 rounded flex items-center justify-center p-0.5 shrink-0">
            <GlenForestLogo customUrl={customLogoUrl} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[10px] font-black text-slate-900 leading-tight uppercase truncate" title={schoolName}>
              {schoolName}
            </h1>
            <p className="text-[7.5px] text-slate-500 font-bold truncate">
              Student Credential & Badge
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-block bg-blue-50 text-blue-900 text-[8px] font-black px-1.5 py-0.5 rounded border border-blue-200 uppercase">
            {schoolYear}
          </span>
        </div>
      </div>

      {/* Middle Row: Student Name & Core Credentials Grid */}
      <div className="flex-1 my-1 flex flex-col justify-center gap-1">
        {/* Student Name + Grade + Room + Teacher (Last Name) */}
        <div className="flex justify-between items-baseline">
          <div className="text-[11.5px] font-black text-slate-950 truncate max-w-[2.0in]" title={studentDisplayName}>
            {studentDisplayName}
          </div>
          <div className="text-[8px] font-extrabold text-slate-700">
            {displayGrade && (
              <>Gr: <span className="text-blue-900 font-black">{displayGrade}</span> | </>
            )}
            Rm: <span className="text-slate-900 font-black">{data.roomNumber || '—'}</span>
            {teacherLastName && (
              <span className="ml-1 text-slate-600 font-semibold">| T: <strong className="text-slate-900">{teacherLastName}</strong></span>
            )}
          </div>
        </div>

        {/* Credentials Grid: Lunch ID & Computer Login Username & Password */}
        <div className="grid grid-cols-3 gap-1 bg-slate-50/90 border border-slate-200 rounded p-1 text-[8px]">
          {/* Lunch ID (Student ID) */}
          <div className="bg-white border border-slate-200 rounded px-1 py-0.5 flex flex-col justify-center">
            <span className="text-[7px] font-extrabold text-slate-500 uppercase tracking-tight flex items-center gap-0.5">
              <Utensils className="w-2 h-2 text-indigo-600" />
              Lunch ID
            </span>
            <span className="text-[9.5px] font-black font-mono text-slate-950 truncate">
              {lunchId}
            </span>
          </div>

          {/* Computer Login Username */}
          <div className="bg-white border border-slate-200 rounded px-1 py-0.5 flex flex-col justify-center">
            <span className="text-[7px] font-extrabold text-slate-500 uppercase tracking-tight flex items-center gap-0.5">
              <User className="w-2 h-2 text-blue-600" />
              Computer Login
            </span>
            <span className="text-[9.5px] font-black font-mono text-blue-950 truncate" title={username}>
              {username}
            </span>
          </div>

          {/* Password */}
          <div className="bg-amber-50 border border-amber-300 rounded px-1 py-0.5 flex flex-col justify-center">
            <span className="text-[7px] font-extrabold text-amber-900 uppercase tracking-tight flex items-center gap-0.5">
              <Key className="w-2 h-2 text-amber-700" />
              Password
            </span>
            <span className="text-[9px] font-black font-mono text-amber-950 truncate select-all" title={data.password || 'GFES#2026'}>
              {data.password || 'GFES#2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Barcode scanning Username + Centered Computer Login below */}
      <div className="pt-0.5 border-t border-slate-200 flex flex-col items-center justify-end shrink-0">
        <div className="w-full flex justify-center items-center h-[24px] overflow-hidden">
          <BarcodeGenerator
            value={barcodeValue || '1234567'}
            height={20}
            width={1.2}
            fontSize={8}
            displayValue={false}
          />
        </div>

        {/* Centered Computer Login info directly under barcode */}
        <div className="w-full flex justify-center items-center text-[7.5px] text-slate-700 font-bold mt-0.5">
          <span>Computer Login: <strong className="font-mono text-blue-950 font-black">{username}</strong></span>
        </div>
      </div>
    </div>
  );
};
