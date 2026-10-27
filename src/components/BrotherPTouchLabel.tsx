import React from 'react';
import { RecordData } from '../types';
import { BarcodeGenerator } from './BarcodeGenerator';

export interface BrotherPTouchLabelProps {
  data: RecordData;
  headerText?: string;
  tapeLength?: string; // e.g., '3.2in', '3.0in', '3.5in', '2.5in'
  orientation?: 'horizontal' | 'rotate90' | 'rotate270';
  offsetX?: number; // in inches
  offsetY?: number; // in inches
  className?: string;
}

export const BrotherPTouchLabel: React.FC<BrotherPTouchLabelProps> = ({
  data,
  headerText = 'FAIRFAX COUNTY PUBLIC SCHOOLS',
  tapeLength = '2.0in',
  orientation = 'horizontal',
  offsetX = 0,
  offsetY = 0,
  className = ''
}) => {
  // Use assetTag or barcode or studentId
  const assetTagValue =
    data.assetTag ||
    data.barcode ||
    data.studentId ||
    '0098184741';

  // Format asset tag for display below barcode (e.g. "00981 84741" if 10 digits, or raw string)
  const formatAssetTagDisplay = (val: string) => {
    const clean = val.replace(/\s+/g, '');
    if (clean.length === 10 && /^\d+$/.test(clean)) {
      return `${clean.slice(0, 5)} ${clean.slice(5)}`;
    }
    return val;
  };

  const formattedDisplay = formatAssetTagDisplay(assetTagValue);
  // Clean raw string for Code 128 barcode encoding
  const barcodeValue = assetTagValue.replace(/\s+/g, '');

  const labelCore = (
    <div
      className={`relative bg-white text-black border border-slate-900 rounded-2xs flex flex-col items-center justify-center overflow-hidden px-1 py-[1px] print:border-none print:shadow-none print:m-0 shadow-xs select-none ${className}`}
      style={{
        width: tapeLength,
        height: '0.7in', // Exact 0.7" Brother P-Touch Tape Width
        boxSizing: 'border-box',
        transform: orientation === 'horizontal' ? `translate(${offsetX}in, ${offsetY}in)` : undefined
      }}
    >
      {/* Top Header Text: FAIRFAX COUNTY PUBLIC SCHOOLS */}
      <div className="w-full text-center leading-none mb-[1px]">
        <h1 className="text-[7pt] font-black tracking-tight text-slate-950 uppercase leading-none truncate px-0.5">
          {headerText}
        </h1>
      </div>

      {/* Center Barcode (Code 128) */}
      <div className="w-full flex justify-center items-center my-0 overflow-hidden max-h-[0.38in]">
        <BarcodeGenerator
          value={barcodeValue || '0000000000'}
          format="CODE128"
          height={26}
          width={1.2}
          displayValue={false}
          className="max-h-[0.36in] max-w-full object-contain"
        />
      </div>

      {/* Bottom Text: Formatted Asset Tag Number */}
      <div className="w-full text-center leading-none mt-[1px]">
        <span className="text-[9.5pt] font-black tracking-wider text-slate-950 font-mono leading-none">
          {formattedDisplay}
        </span>
      </div>
    </div>
  );

  if (orientation === 'rotate90') {
    return (
      <div
        className="flex items-center justify-center overflow-hidden bg-white box-border shrink-0"
        style={{ width: '0.7in', height: tapeLength }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: tapeLength,
            height: '0.7in',
            transform: `translate(${offsetX}in, ${offsetY}in) rotate(90deg)`,
          }}
        >
          {labelCore}
        </div>
      </div>
    );
  }

  if (orientation === 'rotate270') {
    return (
      <div
        className="flex items-center justify-center overflow-hidden bg-white box-border shrink-0"
        style={{ width: '0.7in', height: tapeLength }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: tapeLength,
            height: '0.7in',
            transform: `translate(${offsetX}in, ${offsetY}in) rotate(-90deg)`,
          }}
        >
          {labelCore}
        </div>
      </div>
    );
  }

  return labelCore;
};
