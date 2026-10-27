import React, { useState } from 'react';
import { RecordData } from '../types';
import Papa from 'papaparse';
import { normalizeStudentRecord } from '../utils/studentDataHelpers';
import {
  HardDrive,
  X,
  FileSpreadsheet,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface DriveImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRecords: (records: RecordData[]) => void;
}

export const DriveImportModal: React.FC<DriveImportModalProps> = ({
  isOpen,
  onClose,
  onImportRecords
}) => {
  const [pasteText, setPasteText] = useState('');
  const [activeTab, setActiveTab] = useState<'drive' | 'paste' | 'template'>('drive');

  if (!isOpen) return null;

  const handleParsePastedCSV = () => {
    if (!pasteText.trim()) {
      alert('Please paste CSV data into the text box first.');
      return;
    }

    Papa.parse(pasteText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as any[];
        const newRecords: RecordData[] = parsed.map((item, index) =>
          normalizeStudentRecord(item, index)
        );

        if (newRecords.length > 0) {
          onImportRecords(newRecords);
          onClose();
        } else {
          alert('No valid records found in pasted text.');
        }
      },
      error: (err) => {
        alert(`Parsing error: ${err.message}`);
      }
    });
  };

  const sampleHeadersCSV = `Student Name,Student ID,State Testing ID,Last Name,First Name,Grade,Staff Name,Room Name,Student Email 1
"Marroquin Romero, Alexis I.","1859599","VA9827361","Marroquin Romero","Alexis","03","Marcot, April M","307","amarroquin@fcpsschools.net"
"Vasquez Lopez, Sofia M.","1928374","VA8817263","Vasquez Lopez","Sofia","02","Miller, Jennifer K","204","svasquez@fcpsschools.net"
"Khatri, Aarav K.","1774920","VA7728194","Khatri","Aarav","04","Martinez, David L","412","akhatri@fcpsschools.net"`;

  const copySampleHeaders = () => {
    navigator.clipboard.writeText(sampleHeadersCSV);
    alert('SIS Sync CSV template copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-modal rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="p-4 bg-white/40 border-b border-white/30 backdrop-blur-md text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Google Drive & Sheet Data Importer</h3>
              <p className="text-xs text-slate-500 font-medium">Import student passwords and label data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white/40 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/30 bg-white/30 text-xs font-bold text-slate-600 p-1 gap-1">
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex-1 py-2.5 px-4 text-center rounded-xl transition-all cursor-pointer ${
              activeTab === 'drive'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            Google Drive Connection
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2.5 px-4 text-center rounded-xl transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            Paste CSV / Sheet Text
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`flex-1 py-2.5 px-4 text-center rounded-xl transition-all cursor-pointer ${
              activeTab === 'template'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            Header Template
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <h4 className="font-bold text-sm text-emerald-900">Google Workspace Sync Ready</h4>
                  <p className="mt-1 font-medium text-emerald-900/80">
                    Connect your Google Drive or Google Sheets to automatically read your student roster spreadsheet directly into Glen Forest Label Studio.
                  </p>
                </div>
              </div>

              <div className="border border-dashed border-white/60 rounded-2xl p-8 text-center bg-white/40 backdrop-blur-sm">
                <FileSpreadsheet className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Select Google Sheet from Drive</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 font-medium">
                  Open your Google Drive file picker to select your student password file.
                </p>

                <div className="flex justify-center gap-3">
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Google Drive</span>
                  </a>
                  <button
                    onClick={() => setActiveTab('paste')}
                    className="px-5 py-2 bg-white/80 border border-white/60 text-slate-700 rounded-full text-xs font-bold hover:bg-white shadow-2xs transition-all"
                  >
                    Paste Sheet Copy Instead
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Paste copied rows from Google Sheets or CSV:
              </label>
              <textarea
                rows={7}
                placeholder={`id,studentName,studentId,grade,staffName,password,barcode,pin,roomNumber,hasSleeve,hasCharger,hasLaptop,attendingSummerPrograms,deviceCheckedOutForSummer,updatedAt,updatedBy
1,"Marroquin Romero, Alexis I.","1859599","03","April Marcot","GFES#Alexis2026","1859599","1234","307","Yes","Yes","Yes","No","No","2026-07-21","Admin"`}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="w-full p-3 glass-input rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={copySampleHeaders}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Sample CSV Format</span>
                </button>

                <button
                  onClick={handleParsePastedCSV}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold shadow-md cursor-pointer hover:shadow-lg transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Import Records</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-3 text-xs text-slate-700">
              <p className="font-bold text-slate-900">
                Required Google Sheet / CSV Column Headers:
              </p>
              <div className="p-3 bg-slate-900/90 text-indigo-300 rounded-xl font-mono text-[11px] overflow-x-auto select-all shadow-inner">
                id studentName studentId grade staffName password barcode pin roomNumber hasSleeve hasCharger hasLaptop attendingSummerPrograms deviceCheckedOutForSummer updatedAt updatedBy
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11.5px] font-medium">
                <li><strong>studentName:</strong> Full name of student (e.g. "Marroquin Romero, Alexis I.")</li>
                <li><strong>studentId:</strong> 7-digit FCPS student ID (e.g. "1859599")</li>
                <li><strong>grade:</strong> Student grade level ("03", "02", "Staff")</li>
                <li><strong>staffName:</strong> Homeroom teacher name ("April Marcot")</li>
                <li><strong>password:</strong> Network & iPad login password</li>
                <li><strong>barcode:</strong> Barcode value (defaults to studentId if blank)</li>
                <li><strong>roomNumber:</strong> Room number ("307")</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
