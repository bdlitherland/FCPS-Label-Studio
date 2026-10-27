import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorProps {
  value: string;
  format?: 'CODE128' | 'CODE39';
  height?: number;
  width?: number;
  fontSize?: number;
  displayValue?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  format = 'CODE128',
  height = 36,
  width = 1.4,
  fontSize = 11,
  displayValue = true,
  className = '',
  style
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          height,
          width,
          fontSize,
          displayValue,
          margin: 0,
          background: 'transparent',
          lineColor: '#000000',
          font: 'monospace'
        });
      } catch (err) {
        console.warn('JsBarcode render error for value:', value, err);
      }
    }
  }, [value, format, height, width, fontSize, displayValue]);

  if (!value) return null;

  return (
    <svg
      ref={svgRef}
      className={`max-w-full ${className}`}
      style={style}
    />
  );
};
