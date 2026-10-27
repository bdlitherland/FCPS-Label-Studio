import React, { useState, useEffect } from 'react';
import { RecordData, LabelTemplateType, PrintSideOption, PrintSettings } from './types';
import { DataEditor } from './components/DataEditor';
import { PrintSheetModal } from './components/PrintSheetModal';
import { DriveImportModal } from './components/DriveImportModal';
import { SiteProfileModal } from './components/SiteProfileModal';
import { GoogleDeployModal } from './components/GoogleDeployModal';
import { GlenForestLogo } from './components/GlenForestLogo';
import { safePrint, applyPrintPageStyles } from './utils/printHelpers';
import {
  Layers,
  Printer,
  Table,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  UserCheck,
  Laptop,
  Building2,
  Cloud
} from 'lucide-react';

export default function App() {
  // Roster Tab: 'students' | 'staff' | 'devices'
  const [activeRoster, setActiveRoster] = useState<'students' | 'staff' | 'devices'>('students');

  // Load student records from localStorage (strictly imported records)
  const [studentRecords, setStudentRecords] = useState<RecordData[]>(() => {
    const saved = localStorage.getItem('gfes_label_records');
    if (saved) {
      try {
        const parsed: RecordData[] = JSON.parse(saved);
        // Filter out legacy mock data seeds if any
        const real = parsed.filter(r => !['1', '2', '3', '4', '5', '8', '9'].includes(r.id));
        return real;
      } catch (e) {
        console.error('Failed to parse saved student records', e);
      }
    }
    return [];
  });

  // Load staff records separately from localStorage
  const [staffRecords, setStaffRecords] = useState<RecordData[]>(() => {
    const saved = localStorage.getItem('gfes_staff_records');
    if (saved) {
      try {
        const parsed: RecordData[] = JSON.parse(saved);
        // Filter out legacy mock data seeds if any
        const real = parsed.filter(r => !['6', '7', '10', 'staff_01', 'staff_02'].includes(r.id));
        return real;
      } catch (e) {
        console.error('Failed to parse saved staff records', e);
      }
    }
    return [];
  });

  // Load device records separately from localStorage
  const [deviceRecords, setDeviceRecords] = useState<RecordData[]>(() => {
    const saved = localStorage.getItem('gfes_device_records');
    if (saved) {
      try {
        const parsed: RecordData[] = JSON.parse(saved);
        // Filter out legacy mock data seeds if any
        const real = parsed.filter(r => !['dev_01', 'dev_02', 'dev_03'].includes(r.id));
        return real;
      } catch (e) {
        console.error('Failed to parse saved device records', e);
      }
    }
    return [];
  });

  // Active list based on roster tab
  const activeList =
    activeRoster === 'devices'
      ? deviceRecords
      : activeRoster === 'staff'
      ? staffRecords
      : studentRecords;

  const allRecords = [...studentRecords, ...staffRecords, ...deviceRecords];

  // Selected Record IDs for printing
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const all = [...studentRecords, ...staffRecords, ...deviceRecords];
    return all.map(r => r.id);
  });

  // Print & Label Settings (loaded from localStorage or default)
  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    const saved = localStorage.getItem('gfes_print_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          template: parsed.template || 'student-5874',
          printSide: parsed.printSide || 'duplex',
          schoolName: parsed.schoolName || 'Glen Forest Elementary School',
          districtName: parsed.districtName || 'Fairfax County Public Schools',
          schoolAddress: parsed.schoolAddress || '5829 Glen Forest Drive, Falls Church, VA 22041',
          schoolPhone: parsed.schoolPhone || '(703) 578-8000',
          schoolYear: parsed.schoolYear || '2025-2026',
          customLogoUrl: parsed.customLogoUrl || '',
          customFcpsLogoUrl: parsed.customFcpsLogoUrl || '',
          showGridLines: parsed.showGridLines ?? true,
          offsetXMm: parsed.offsetXMm || 0,
          offsetYMm: parsed.offsetYMm || 0,
          brotherHeaderText: parsed.brotherHeaderText || 'FAIRFAX COUNTY PUBLIC SCHOOLS',
          brotherTapeLength: parsed.brotherTapeLength || '2.0in',
          selectedIds: []
        };
      } catch (e) {
        console.error('Failed to parse saved print settings', e);
      }
    }
    return {
      template: 'student-5874',
      printSide: 'duplex',
      schoolName: 'Glen Forest Elementary School',
      districtName: 'Fairfax County Public Schools',
      schoolAddress: '5829 Glen Forest Drive, Falls Church, VA 22041',
      schoolPhone: '(703) 578-8000',
      schoolYear: '2025-2026',
      customLogoUrl: '',
      customFcpsLogoUrl: '',
      showGridLines: true,
      offsetXMm: 0,
      offsetYMm: 0,
      brotherHeaderText: 'FAIRFAX COUNTY PUBLIC SCHOOLS',
      brotherTapeLength: '2.0in',
      selectedIds: []
    };
  });

  // Save printSettings to localStorage on change
  useEffect(() => {
    localStorage.setItem('gfes_print_settings', JSON.stringify(printSettings));
  }, [printSettings]);

  // UI View Mode: 'editor' or 'print' (default to editor if no records yet)
  const [viewMode, setViewMode] = useState<'editor' | 'print'>(() => {
    return (studentRecords.length === 0 && staffRecords.length === 0 && deviceRecords.length === 0)
      ? 'editor'
      : 'editor';
  });
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isSiteProfileModalOpen, setIsSiteProfileModalOpen] = useState(false);
  const [isGoogleDeployModalOpen, setIsGoogleDeployModalOpen] = useState(false);

  // Auto-switch roster tab when template changes
  useEffect(() => {
    if (
      printSettings.template === 'staff-dymo' ||
      printSettings.template === 'teacher-5874' ||
      printSettings.template === 'teacher-5523'
    ) {
      setActiveRoster('staff');
    } else if (printSettings.template === 'brother-ptouch') {
      setActiveRoster('devices');
    }
  }, [printSettings.template]);

  // Auto-detect Google Apps Script (GAS) runtime & load sheet data if available
  useEffect(() => {
    const gas = (window as any).google?.script?.run;
    if (gas && typeof gas.getRosterFromSheet === 'function') {
      gas.withSuccessHandler((sheetRecords: RecordData[]) => {
        if (sheetRecords && sheetRecords.length > 0) {
          setStudentRecords(sheetRecords);
          setSelectedIds(prev => Array.from(new Set([...prev, ...sheetRecords.map(r => r.id)])));
        }
      }).getRosterFromSheet();
    }
  }, []);

  // Save student records to localStorage
  useEffect(() => {
    localStorage.setItem('gfes_label_records', JSON.stringify(studentRecords));
  }, [studentRecords]);

  // Save staff records separately to localStorage
  useEffect(() => {
    localStorage.setItem('gfes_staff_records', JSON.stringify(staffRecords));
  }, [staffRecords]);

  // Save device records separately to localStorage
  useEffect(() => {
    localStorage.setItem('gfes_device_records', JSON.stringify(deviceRecords));
  }, [deviceRecords]);

  // Sync selected records across all records
  const selectedRecords = allRecords.filter(r => selectedIds.includes(r.id));

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(Array.from(new Set([...selectedIds, ...ids])));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleUpdateRecords = (newRecords: RecordData[]) => {
    if (activeRoster === 'devices') {
      setDeviceRecords(newRecords);
    } else if (activeRoster === 'staff') {
      setStaffRecords(newRecords);
    } else {
      setStudentRecords(newRecords);
    }
  };

  const handleClearRosterRecords = () => {
    const rosterName =
      activeRoster === 'devices'
        ? 'Devices & Assets'
        : activeRoster === 'staff'
        ? 'Staff'
        : 'Student';
    if (
      confirm(
        `Are you sure you want to clear all ${rosterName} records? You can import new records from CSV or Google Drive anytime.`
      )
    ) {
      if (activeRoster === 'devices') {
        setDeviceRecords([]);
        setSelectedIds(prev => prev.filter(id => !deviceRecords.some(d => d.id === id)));
      } else if (activeRoster === 'staff') {
        setStaffRecords([]);
        setSelectedIds(prev => prev.filter(id => !staffRecords.some(s => s.id === id)));
      } else {
        setStudentRecords([]);
        setSelectedIds(prev => prev.filter(id => !studentRecords.some(st => st.id === id)));
      }
    }
  };

  // Quick print a single device on Brother P-Touch label
  const handleQuickPrintDevice = (id: string) => {
    setSelectedIds([id]);
    setPrintSettings(prev => ({
      ...prev,
      template: 'brother-ptouch'
    }));
    applyPrintPageStyles({
      template: 'brother-ptouch',
      brotherTapeLength: printSettings.brotherTapeLength || '2.0in',
    });
    setViewMode('print');
  };

  const handleBatchPrint = () => {
    if (viewMode !== 'print') {
      setViewMode('print');
    }
    safePrint({
      template: printSettings.template,
      brotherTapeLength: printSettings.brotherTapeLength || '2.0in',
    });
  };

  const handleUpdateSettings = (partial: Partial<PrintSettings>) => {
    setPrintSettings(prev => ({ ...prev, ...partial }));
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans flex flex-col print:bg-white print:min-h-0">
      {/* APP TOP NAVIGATION BAR (Frosted Glass style) */}
      <header className="glass-nav text-slate-800 sticky top-0 z-30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & School Branding */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsSiteProfileModalOpen(true)}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl p-1.5 text-white shadow-md flex items-center justify-center shrink-0">
              <GlenForestLogo customUrl={printSettings.customLogoUrl} className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight text-slate-900">
                  {printSettings.schoolName || 'Glen Forest ES'}
                </h1>
                <span className="bg-indigo-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  Label Studio
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {printSettings.districtName || 'Fairfax County Public Schools'} • Multi-Site Printing
              </p>
            </div>
          </div>

          {/* View Toggle Tabs (Data Roster vs Print Sheet) */}
          <div className="flex items-center p-1 bg-white/40 backdrop-blur-md rounded-full border border-white/40 shadow-inner">
            <button
              onClick={() => setViewMode('editor')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Roster Editor ({activeList.length})</span>
            </button>

            <button
              onClick={() => setViewMode('print')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'print'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Print Preview ({selectedIds.length})</span>
            </button>
          </div>

          {/* Quick Drive & Direct Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGoogleDeployModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
              title="Google Apps Script, Sheets, Firebase & Cloud Run Deployment Guide"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-200" />
              <span>Google Deploy Guide</span>
            </button>

            <button
              onClick={() => setIsSiteProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md border border-indigo-400/30"
              title="Change school address, name, district, logos & saved site presets"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-300" />
              <span>Site Setup</span>
            </button>

            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Google Drive</span>
            </button>

            <button
              onClick={handleBatchPrint}
              disabled={selectedRecords.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Batch ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* QUICK TEMPLATE SELECTOR STRIP (Frosted Strip) */}
      <div className="bg-white/20 backdrop-blur-md border-b border-white/20 text-slate-800 px-6 py-2.5 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Dropdowns */}
          <div className="flex items-center gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Format:</span>
            </div>

            <select
              value={printSettings.template}
              onChange={(e) =>
                handleUpdateSettings({ template: e.target.value as LabelTemplateType })
              }
              className="px-3.5 py-1.5 glass-input text-xs font-bold text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
            >
              <option value="ipad-5160">iPad Sticky Labels — Avery 5160 (30 per sheet)</option>
              <option value="student-5874">Business Card Labels — Student Double-Sided (Avery 5871 / 5874)</option>
              <option value="teacher-5874">Business Card Labels — Teacher / Staff (Avery 5871 / 5874)</option>
              <option value="student-5523">Name Badge Labels — Student Double-Sided (Avery 5523 / 5392)</option>
              <option value="teacher-5523">Name Badge Labels — Teacher / Staff (Avery 5523 / 5392)</option>
              <option value="staff-dymo">Staff Badges — Dymo Roll Printer (FullName & Title/Role)</option>
              <option value="charger-dymo">Charger Labels — Dymo Roll Printer (1 per label / 3.5" x 2")</option>
              <option value="charger-sheet">Charger Labels — Sheet Paper (Avery 8.5" x 11" — 6 per sheet)</option>
              <option value="brother-ptouch">Brother P-Touch Barcode — PT-2730 (0.7" Tape Labels)</option>
            </select>

            {(printSettings.template === 'student-5874' || printSettings.template === 'student-5523') && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-xs rounded-xl border border-white/40">
                <span className="font-bold text-slate-700 text-[11px]">Duplex Side:</span>
                <select
                  value={printSettings.printSide}
                  onChange={(e) =>
                    handleUpdateSettings({ printSide: e.target.value as PrintSideOption })
                  }
                  className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="duplex">Double-Sided (Both Front & Password Back)</option>
                  <option value="front">Front Page Only (Photo/Logo & Barcode)</option>
                  <option value="back">Back Page Only (Password Credentials)</option>
                </select>
              </div>
            )}
          </div>

          {/* Stat Pill */}
          <div className="flex items-center gap-3 text-xs text-slate-700">
            <span className="flex items-center gap-1.5 bg-white/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/50 shadow-2xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <strong>{selectedIds.length}</strong> of {activeList.length} records selected
            </span>
          </div>
        </div>
      </div>

      {/* MAIN BODY AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 print:p-0 print:m-0 print:max-w-none">
        {viewMode === 'editor' ? (
          <div className="space-y-4">
            <DataEditor
              records={activeList}
              activeRoster={activeRoster}
              onChangeRoster={setActiveRoster}
              studentCount={studentRecords.length}
              staffCount={staffRecords.length}
              deviceCount={deviceRecords.length}
              onUpdateRecords={handleUpdateRecords}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onOpenDriveModal={() => setIsDriveModalOpen(true)}
              onClearRoster={handleClearRosterRecords}
              onQuickPrintDevice={handleQuickPrintDevice}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <PrintSheetModal
              selectedRecords={selectedRecords}
              settings={printSettings}
              onUpdateSettings={handleUpdateSettings}
            />
          </div>
        )}
      </main>

      {/* GOOGLE DRIVE IMPORT MODAL */}
      <DriveImportModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onImportRecords={(imported) => {
          handleUpdateRecords(imported);
          setSelectedIds(imported.map(r => r.id));
        }}
      />

      {/* SITE BRANDING & PROFILE MODAL */}
      <SiteProfileModal
        isOpen={isSiteProfileModalOpen}
        onClose={() => setIsSiteProfileModalOpen(false)}
        settings={printSettings}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* GOOGLE DEPLOYMENT & NPM GUIDE MODAL */}
      <GoogleDeployModal
        isOpen={isGoogleDeployModalOpen}
        onClose={() => setIsGoogleDeployModalOpen(false)}
      />

      {/* FOOTER */}
      <footer className="glass-nav text-slate-500 text-xs py-4 px-6 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="font-medium">{printSettings.schoolName || 'School Site'} • {printSettings.districtName || 'Fairfax County Public Schools'}</span>
          <span className="font-medium">Frosted Glass • Avery Cards, Dymo & Brother P-Touch Studio</span>
        </div>
      </footer>
    </div>
  );
}
