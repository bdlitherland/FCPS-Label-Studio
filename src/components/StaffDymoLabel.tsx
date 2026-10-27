import React from 'react';
import { RecordData } from '../types';
import { GlenForestLogo } from './GlenForestLogo';
import { FcpsLogo } from './FcpsLogo';
import { DymoOrientationType, DymoModelType } from './ChargerDymoLabel';

interface StaffDymoLabelProps {
  data: RecordData;
  schoolName?: string;
  districtName?: string;
  customLogoUrl?: string;
  customFcpsLogoUrl?: string;
  schoolAddress?: string;
  orientation?: DymoOrientationType;
  model?: DymoModelType;
  offsetX?: number; // in inches
  offsetY?: number; // in inches
}

export const StaffDymoLabel: React.FC<StaffDymoLabelProps> = ({
  data,
  schoolName = 'Glen Forest ES',
  districtName = 'Fairfax County Public Schools',
  customLogoUrl,
  customFcpsLogoUrl,
  schoolAddress = '5829 Glen Forest Drive, Falls Church, VA 22041',
  orientation = 'rotate90',
  model = '30857',
  offsetX = 0,
  offsetY = 0,
}) => {
  const is30857 = model === '30857';
  const horizW = is30857 ? '4.0in' : '3.5in';
  const horizH = is30857 ? '2.25in' : '2.0in';

  const vertW = is30857 ? '2.25in' : '2.0in';
  const vertH = is30857 ? '4.0in' : '3.5in';

  // Content safe boundaries inside printable margin
  const contentW = is30857 ? '3.75in' : '3.3in';
  const contentH = is30857 ? '2.05in' : '1.85in';

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

  const fullAddress = schoolAddress || '5829 Glen Forest Drive, Falls Church, VA 22041';

  // 1. Native Vertical Layout (Top to bottom roll feed)
  if (orientation === 'vertical') {
    return (
      <div
        className="flex items-center justify-center overflow-hidden shrink-0 print:m-0"
        style={{ width: vertW, height: vertH }}
      >
        <div
          className="bg-white border-2 border-slate-900 rounded-md p-2 flex flex-col justify-between text-slate-950 box-border shrink-0 print:border-2 print:border-black"
          style={{ width: '2.05in', height: is30857 ? '3.75in' : '3.3in', boxSizing: 'border-box' }}
        >
          {/* Top Logos */}
          <div className="flex justify-between items-center border-b border-slate-300 pb-1">
            <div className="w-[0.45in] h-[0.45in] flex items-center justify-center shrink-0">
              {customFcpsLogoUrl ? (
                <img src={customFcpsLogoUrl} alt="District Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <FcpsLogo className="h-full w-full object-contain" />
              )}
            </div>
            <div className="text-center px-0.5 min-w-0">
              <h1 className="text-[10px] font-extrabold text-blue-950 leading-tight uppercase truncate" title={schoolName}>
                {schoolName}
              </h1>
              <p className="text-[7.5px] font-semibold text-slate-600 truncate">Staff Badge</p>
            </div>
            <div className="w-[0.45in] h-[0.45in] flex items-center justify-center shrink-0">
              <GlenForestLogo customUrl={customLogoUrl} className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Center Staff Details */}
          <div className="my-auto py-2 text-center flex flex-col justify-center items-center">
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">
              RESPONSIBILITY OF:
            </p>
            <h2 className="text-[15px] font-black text-slate-950 leading-snug tracking-tight">
              {staffName}
            </h2>
            <div className="mt-1 inline-block px-2 py-0.5 bg-indigo-100/90 border border-indigo-300 rounded text-indigo-950 font-extrabold text-[10.5px]">
              {staffTitle}
            </div>
          </div>

          {/* Bottom School Address & Staff ID */}
          <div className="border-t border-slate-900 pt-1 text-center shrink-0 flex flex-col items-center text-[8px] gap-0.5">
            <div className="font-mono text-slate-700">
              <span className="font-bold text-slate-900">ID:</span>{' '}
              <span className="font-extrabold text-indigo-900">{staffId}</span>
            </div>
            <p className="font-bold text-slate-900 leading-tight">
              {fullAddress}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Common horizontal label layout (4.0" W x 2.25" H or 3.5" W x 2.0" H)
  const LabelContent = (
    <div
      className="bg-white border-2 border-slate-900 rounded-md p-2 flex flex-col justify-between text-slate-950 box-border shrink-0 print:border-2 print:border-black"
      style={{ width: contentW, height: contentH, boxSizing: 'border-box' }}
    >
      {/* Top Header: Logos on Left & Right + School Title */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-1 shrink-0">
        {/* Left: District Logo */}
        <div className="w-[0.55in] h-[0.55in] shrink-0 flex items-center justify-center">
          {customFcpsLogoUrl ? (
            <img src={customFcpsLogoUrl} alt="District Logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
          ) : (
            <FcpsLogo className="h-full w-full object-contain" />
          )}
        </div>

        {/* Center: School / District Title */}
        <div className="text-center flex-1 px-1 min-w-0">
          <h1 className="text-[13px] font-black text-slate-950 uppercase tracking-tight leading-none truncate" title={schoolName}>
            {schoolName}
          </h1>
          <p className="text-[9px] font-bold text-slate-700 tracking-wide mt-0.5 truncate" title={districtName}>
            {districtName}
          </p>
        </div>

        {/* Right: Glen Forest Eagles Logo */}
        <div className="w-[0.55in] h-[0.55in] shrink-0 flex items-center justify-center">
          <GlenForestLogo customUrl={customLogoUrl} className="h-full w-full object-contain" />
        </div>
      </div>

      {/* Main Staff Body: Name & Description / Role */}
      <div className="my-auto py-1 text-center flex flex-col justify-center items-center">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">
          RESPONSIBILITY OF:
        </p>
        <h2 className="text-[18px] sm:text-[20px] font-black text-slate-950 leading-tight tracking-tight">
          {staffName}
        </h2>
        
        <div className="mt-1 flex items-center justify-center">
          <span className="px-3 py-0.5 bg-indigo-100/90 border border-indigo-300 text-indigo-950 font-extrabold text-[12px] rounded-md tracking-tight">
            {staffTitle}
          </span>
        </div>
      </div>

      {/* Bottom Footer: Staff ID & School Address */}
      <div className="border-t-2 border-slate-900 pt-1 pb-0.5 px-1 flex justify-between items-center text-[9px] gap-2 shrink-0">
        <div className="font-mono text-slate-700 shrink-0">
          <span className="font-bold text-slate-900">Staff ID:</span>{' '}
          <span className="font-extrabold text-indigo-900">{staffId}</span>
        </div>
        <div className="font-bold text-slate-900 text-[8.5px] text-right truncate">
          {fullAddress}
        </div>
      </div>
    </div>
  );

  // 2. Rotated 90 degrees (Flex centered transform with precision X/Y offset)
  if (orientation === 'rotate90') {
    return (
      <div
        className="flex justify-center items-center overflow-hidden shrink-0 print:m-0 relative"
        style={{ width: vertW, height: vertH }}
      >
        <div
          className="flex justify-center items-center shrink-0"
          style={{
            width: horizW,
            height: horizH,
            transform: `translate(${offsetX}in, ${offsetY}in) rotate(90deg)`,
          }}
        >
          {LabelContent}
        </div>
      </div>
    );
  }

  // 3. Rotated 270 degrees / -90 degrees
  if (orientation === 'rotate270') {
    return (
      <div
        className="flex justify-center items-center overflow-hidden shrink-0 print:m-0 relative"
        style={{ width: vertW, height: vertH }}
      >
        <div
          className="flex justify-center items-center shrink-0"
          style={{
            width: horizW,
            height: horizH,
            transform: `translate(${offsetX}in, ${offsetY}in) rotate(-90deg)`,
          }}
        >
          {LabelContent}
        </div>
      </div>
    );
  }

  // 4. Landscape direct orientation
  return (
    <div
      className="flex justify-center items-center overflow-hidden shrink-0 print:m-0"
      style={{ width: horizW, height: horizH }}
    >
      {LabelContent}
    </div>
  );
};
