import React from 'react';
import { RecordData } from '../types';
import { BarcodeGenerator } from './BarcodeGenerator';
import { GlenForestLogo } from './GlenForestLogo';
import { StaffDymoLabel } from './StaffDymoLabel';
import { Zap } from 'lucide-react';
import { formatGradeDisplay } from '../utils/studentDataHelpers';

export type DymoOrientationType = 'vertical' | 'rotate90' | 'rotate270' | 'landscape';
export type DymoModelType = '30857' | '30256';

interface ChargerDymoLabelProps {
  data: RecordData;
  schoolName?: string;
  customLogoUrl?: string;
  orientation?: DymoOrientationType;
  model?: DymoModelType;
  offsetX?: number; // in inches
  offsetY?: number; // in inches
}

export const ChargerDymoLabel: React.FC<ChargerDymoLabelProps> = ({
  data,
  schoolName = 'Glen Forest ES',
  customLogoUrl,
  orientation = 'rotate90',
  model = '30857',
  offsetX = 0,
  offsetY = 0,
}) => {
  const displayGrade = formatGradeDisplay(data.grade);

  // If record is for a staff member, render the Teacher / Staff Dymo Label
  if (data.grade === 'Staff' || (data as any).grade === 'Staff') {
    return (
      <StaffDymoLabel
        data={data}
        schoolName={schoolName}
        customLogoUrl={customLogoUrl}
        orientation={orientation}
        model={model}
        offsetX={offsetX}
        offsetY={offsetY}
      />
    );
  }

  const is30857 = model === '30857';
  const horizW = is30857 ? '4.0in' : '3.5in';
  const horizH = is30857 ? '2.25in' : '2.0in';
  const vertW = is30857 ? '2.25in' : '2.0in';
  const vertH = is30857 ? '4.0in' : '3.5in';

  // Safe inner content dimensions (leaves 0.1in - 0.12in printer margin safe-zone)
  const contentW = is30857 ? '3.75in' : '3.3in';
  const contentH = is30857 ? '2.05in' : '1.85in';

  // 1. Native Vertical Layout (No rotation)
  if (orientation === 'vertical') {
    return (
      <div
        className="bg-white border-2 border-slate-900 rounded-md p-2.5 flex flex-col justify-between overflow-hidden text-slate-950 box-border print:border-2 print:border-black shrink-0"
        style={{ width: vertW, height: vertH, boxSizing: 'border-box' }}
      >
        {/* Top Header */}
        <div className="border-b-2 border-slate-900 pb-1.5 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 min-w-0">
            {customLogoUrl ? (
              <img
                src={customLogoUrl}
                alt="Logo"
                className="w-5 h-5 object-contain shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <GlenForestLogo className="w-5 h-5 shrink-0" />
            )}
            <div className="min-w-0">
              <h1 className="text-[10.5px] font-black leading-none text-slate-950 uppercase truncate">
                {schoolName}
              </h1>
              <p className="text-[8px] font-extrabold text-indigo-900 flex items-center gap-0.5 mt-0.5">
                <Zap className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                <span>Charger Label</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950 text-white px-1.5 py-0.5 rounded text-[8.5px] font-extrabold text-center leading-tight">
            {displayGrade ? `Grade: ${displayGrade} | ` : ''}Room: {data.roomNumber || '—'}
          </div>
        </div>

        {/* Student Name & Teacher */}
        <div className="my-1.5 text-center">
          <p className="text-[14px] font-black text-slate-950 leading-snug break-words">
            {data.studentName}
          </p>
          <p className="text-[10px] text-slate-700 font-bold truncate mt-1">
            Teacher: <span className="text-slate-950 font-extrabold">{data.staffName || 'Staff'}</span>
          </p>
        </div>

        {/* Student ID & Barcode */}
        <div className="border-t-2 border-slate-900 pt-1.5 flex flex-col items-center gap-1">
          <div className="text-center">
            <span className="block text-[7.5px] font-black text-slate-500 uppercase tracking-wider">
              Student ID
            </span>
            <span className="text-[12px] font-black font-mono text-slate-950">
              {data.studentId || data.barcode || '—'}
            </span>
          </div>

          <div className="h-[26px] w-[1.8in] flex justify-center items-center">
            <BarcodeGenerator
              value={data.barcode || data.studentId || '1234567'}
              height={24}
              width={1.0}
              fontSize={8}
              displayValue={false}
            />
          </div>
        </div>
      </div>
    );
  }

  // Common horizontal label layout (Safe 3.75" W x 2.05" H for 30857)
  const LabelContent = (
    <div
      className="bg-white border-2 border-slate-900 rounded-md p-2 flex flex-col justify-between overflow-hidden text-slate-950 box-border shrink-0 print:border-2 print:border-black"
      style={{ width: contentW, height: contentH, boxSizing: 'border-box' }}
    >
      {/* Top Header Banner */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-1">
        <div className="flex items-center gap-2 min-w-0">
          {customLogoUrl ? (
            <img
              src={customLogoUrl}
              alt="Logo"
              className="w-5.5 h-5.5 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <GlenForestLogo className="w-5.5 h-5.5 shrink-0" />
          )}
          <div className="min-w-0">
            <h1 className="text-[12px] font-black tracking-tight leading-none text-slate-950 uppercase truncate">
              {schoolName}
            </h1>
            <p className="text-[9px] font-extrabold text-indigo-900 flex items-center gap-0.5 mt-0.5">
              <Zap className="w-3 h-3 fill-indigo-600 text-indigo-600" />
              <span>Charger Label</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-950 text-white px-2.5 py-0.5 rounded text-[9px] font-extrabold text-center shrink-0 leading-tight">
          {displayGrade ? (
            <>
              Gr: {displayGrade}
              <br />
            </>
          ) : null}
          Rm: {data.roomNumber || '—'}
        </div>
      </div>

      {/* Student Name & Teacher */}
      <div className="my-1">
        <p className="text-[15px] font-black text-slate-950 leading-tight truncate" title={data.studentName}>
          {data.studentName}
        </p>
        <p className="text-[10px] text-slate-700 font-bold truncate mt-0.5">
          Teacher: <span className="text-slate-950 font-extrabold">{data.staffName || 'Staff'}</span>
        </p>
      </div>

      {/* Bottom Student ID & Barcode */}
      <div className="flex justify-between items-center pt-1 border-t-2 border-slate-900 mt-0.5 px-1">
        <div className="shrink-0">
          <span className="block text-[7.5px] font-black text-slate-500 uppercase tracking-wider">
            Student ID
          </span>
          <span className="text-[12px] font-black font-mono text-slate-950">
            {data.studentId || data.barcode || '—'}
          </span>
        </div>

        <div className="h-[24px] flex justify-center items-center pr-6">
          <BarcodeGenerator
            value={data.barcode || data.studentId || '1234567'}
            height={22}
            width={0.95}
            fontSize={8}
            displayValue={false}
          />
        </div>
      </div>
    </div>
  );

  // 2. Rotated 90 degrees (Flex centered transform with precision X/Y offset)
  if (orientation === 'rotate90') {
    return (
      <div
        className="flex items-center justify-center overflow-hidden bg-white box-border shrink-0"
        style={{ width: vertW, height: vertH }}
      >
        <div
          className="flex items-center justify-center shrink-0"
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
        className="flex items-center justify-center overflow-hidden bg-white box-border shrink-0"
        style={{ width: vertW, height: vertH }}
      >
        <div
          className="flex items-center justify-center shrink-0"
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

  // 4. Native Landscape
  return LabelContent;
};


