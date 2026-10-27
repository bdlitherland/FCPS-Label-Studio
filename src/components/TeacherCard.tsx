import React from 'react';
import { RecordData } from '../types';
import { GlenForestLogo } from './GlenForestLogo';
import { FcpsLogo } from './FcpsLogo';

interface TeacherCardProps {
  data: RecordData;
  schoolName?: string;
  districtName?: string;
  customLogoUrl?: string;
  customFcpsLogoUrl?: string;
  schoolAddress?: string;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  data,
  schoolName = 'Glen Forest Elementary School',
  districtName = 'Fairfax County Public Schools',
  customLogoUrl,
  customFcpsLogoUrl,
  schoolAddress = '5829 Glen Forest Drive, Falls Church, VA 22041',
}) => {
  const staffName =
    data.fullName ||
    (data as any).FullName ||
    (data as any)['Full Name'] ||
    data.staffName ||
    (data as any)['Staff Name'] ||
    data.studentName ||
    'Staff Member';

  const staffTitle =
    data.description ||
    (data as any).Description ||
    (data as any)['Description'] ||
    data.role ||
    (data as any).Role ||
    (data as any)['Role'] ||
    data.title ||
    (data as any).Title ||
    (data as any)['Title'] ||
    'Teacher / Staff';

  const staffId =
    data.samAccountName ||
    (data as any).SAMAccountName ||
    (data as any)['SAMAccountName'] ||
    (data as any)['SAM Account Name'] ||
    (data as any).samAccountName ||
    data.studentId ||
    (data as any)['Student ID'] ||
    data.barcode ||
    '—';

  return (
    <div
      className="relative w-[3.5in] h-[2in] bg-white border-2 border-slate-900 rounded-md p-2 flex flex-col justify-between overflow-hidden shadow-xs print:shadow-none print:border-none print:m-0 print:p-[0.1in]"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header: FCPS / District Logo on Left, School Name in Center, School Logo on Right */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-1 shrink-0">
        <div className="w-[0.45in] h-[0.45in] shrink-0 flex items-center justify-center">
          {customFcpsLogoUrl ? (
            <img src={customFcpsLogoUrl} alt="District Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <FcpsLogo className="h-full w-full object-contain" />
          )}
        </div>

        <div className="text-center flex-1 px-1 min-w-0">
          <h1 className="text-[12px] font-black text-slate-950 uppercase tracking-tight leading-none truncate" title={schoolName}>
            {schoolName}
          </h1>
          <p className="text-[8.5px] font-bold text-slate-700 tracking-wide mt-0.5 truncate" title={districtName}>
            {districtName}
          </p>
        </div>

        <div className="w-[0.45in] h-[0.45in] shrink-0 flex items-center justify-center">
          <GlenForestLogo customUrl={customLogoUrl} className="h-full w-full object-contain" />
        </div>
      </div>

      {/* Main Body: Responsibility of + Staff Name + Description / Role */}
      <div className="my-auto py-1 text-center flex flex-col justify-center items-center">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
          Responsibility Of:
        </p>
        <h2
          className="text-[17px] font-black text-slate-950 leading-tight tracking-tight mt-0.5"
          title={staffName}
        >
          {staffName}
        </h2>
        <div className="mt-1 flex items-center justify-center">
          <span className="px-2.5 py-0.5 bg-indigo-100/90 border border-indigo-300 text-indigo-950 font-extrabold text-[11px] rounded-md tracking-tight">
            {staffTitle}
          </span>
        </div>
      </div>

      {/* Bottom Footer: Staff ID & School Address */}
      <div className="border-t-2 border-slate-900 pt-1 flex justify-between items-center text-[8.5px] gap-2 shrink-0">
        <div className="font-mono text-slate-700 shrink-0">
          <span className="font-bold text-slate-900">Staff ID:</span>{' '}
          <span className="font-extrabold text-indigo-900">{staffId}</span>
        </div>
        <div className="font-bold text-slate-900 text-[8.5px] text-right truncate">
          {schoolAddress}
        </div>
      </div>
    </div>
  );
};


