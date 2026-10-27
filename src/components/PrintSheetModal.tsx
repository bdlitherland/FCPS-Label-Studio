import React, { useState, useMemo, useEffect } from 'react';
import { RecordData, LabelTemplateType, PrintSideOption, PrintSettings } from '../types';
import { StudentCardFront } from './StudentCardFront';
import { StudentCardBack } from './StudentCardBack';
import { StudentCardSingleSided } from './StudentCardSingleSided';
import { TeacherCard } from './TeacherCard';
import { IpadLabel5160 } from './IpadLabel5160';
import { ChargerDymoLabel, DymoOrientationType, DymoModelType } from './ChargerDymoLabel';
import { StaffDymoLabel } from './StaffDymoLabel';
import { BrotherPTouchLabel } from './BrotherPTouchLabel';
import { SiteProfileModal } from './SiteProfileModal';
import { applyPrintPageStyles, safePrint, BrotherOrientationType } from '../utils/printHelpers';
import {
  sortRecordsForPrint,
  extractTeacherLastName,
  getStudentLastName,
  getStudentFirstName,
  getGradeRank,
  isExcludedGrade,
  formatGradeDisplay
} from '../utils/studentDataHelpers';
import {
  Printer,
  Sliders,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Grid,
  Info,
  Building2,
  School,
  ArrowDownAZ,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface PrintSheetModalProps {
  selectedRecords: RecordData[];
  settings: PrintSettings;
  onUpdateSettings: (newSettings: Partial<PrintSettings>) => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  selectedRecords,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [dymoOrientation, setDymoOrientation] = useState<DymoOrientationType>('rotate90');
  const [dymoModel, setDymoModel] = useState<DymoModelType>('30857');
  const [dymoOffsetX, setDymoOffsetX] = useState<number>(0);
  const [dymoOffsetY, setDymoOffsetY] = useState<number>(0);
  const [brotherOrientation, setBrotherOrientation] = useState<BrotherOrientationType>('horizontal');
  const [sortOrder, setSortOrder] = useState<'grade-teacher-student' | 'teacher-student' | 'student-last-name' | 'original'>('grade-teacher-student');
  const [printGradeFilter, setPrintGradeFilter] = useState<string>('all');

  // Immediately synchronize browser @page print media rules in document.head
  // This guarantees Chrome print preview receives the exact page size before print dialog opens
  useEffect(() => {
    applyPrintPageStyles({
      template: settings.template,
      dymoModel,
      dymoOrientation,
      brotherTapeLength: settings.brotherTapeLength || '2.0in',
      brotherOrientation,
    });
  }, [settings.template, dymoModel, dymoOrientation, settings.brotherTapeLength, brotherOrientation]);

  const handlePrint = () => {
    safePrint({
      template: settings.template,
      dymoModel,
      dymoOrientation,
      brotherTapeLength: settings.brotherTapeLength || '2.0in',
      brotherOrientation,
    });
  };

  const isDymo30857 = dymoModel === '30857';
  const dymoVertW = isDymo30857 ? '2.25in' : '2.0in';
  const dymoVertH = isDymo30857 ? '4.0in' : '3.5in';
  const dymoHorizW = isDymo30857 ? '4.0in' : '2.25in';
  const dymoHorizH = isDymo30857 ? '2.25in' : '2.0in';

  const dymoSheetW = dymoOrientation === 'landscape' ? dymoHorizW : dymoVertW;
  const dymoSheetH = dymoOrientation === 'landscape' ? dymoHorizH : dymoVertH;

  const isDymoTemplate = settings.template === 'charger-dymo' || settings.template === 'staff-dymo';
  const isBrotherPTouch = settings.template === 'brother-ptouch';
  const brotherTapeLength = settings.brotherTapeLength || '3.2in';
  const isStaffTemplate = settings.template === 'teacher-5874' || settings.template === 'teacher-5523' || settings.template === 'staff-dymo';

  const isStudentTemplate = settings.template === 'student-5874' || settings.template === 'student-5523' || settings.template === 'ipad-5160';

  // Extract unique valid grades present in the selected records (excluding PS, HS, 00 for student badges)
  const uniqueSelectedGrades = useMemo(() => {
    const validRecords = isStudentTemplate
      ? selectedRecords.filter(r => !isExcludedGrade(r.grade))
      : selectedRecords;
    const grades = Array.from(new Set(validRecords.map(r => r.grade).filter(Boolean) as string[]));
    return grades.sort((a, b) => {
      const rankA = getGradeRank(a);
      const rankB = getGradeRank(b);
      if (rankA !== rankB) return rankB - rankA; // Highest grade first
      return a.localeCompare(b);
    });
  }, [selectedRecords, isStudentTemplate]);

  // Filter records by grade and exclude non-printing grades (PS, HS, 00)
  const filteredSelectedRecords = useMemo(() => {
    let base = selectedRecords;
    // Automatically exclude non-grades PS, HS, 00 for student badge printing
    if (isStudentTemplate) {
      base = base.filter(r => !isExcludedGrade(r.grade));
    }
    if (printGradeFilter === 'all') return base;
    return base.filter(r => {
      const rGrade = (r.grade || '').toString().trim().toLowerCase();
      const fGrade = printGradeFilter.toString().trim().toLowerCase();
      return (
        rGrade === fGrade ||
        rGrade.replace(/^0+/, '') === fGrade.replace(/^0+/, '') ||
        rGrade === `grade ${fGrade}` ||
        rGrade === `gr ${fGrade}` ||
        `grade ${rGrade}` === fGrade
      );
    });
  }, [selectedRecords, printGradeFilter, isStudentTemplate]);

  // Apply sorting based on selected sortOrder
  let displayRecords = [...filteredSelectedRecords];
  if (sortOrder === 'grade-teacher-student') {
    displayRecords = sortRecordsForPrint(filteredSelectedRecords);
  } else if (sortOrder === 'teacher-student') {
    displayRecords.sort((a, b) => {
      const teacherA = extractTeacherLastName(a.staffName).toLowerCase();
      const teacherB = extractTeacherLastName(b.staffName).toLowerCase();
      if (teacherA !== teacherB) {
        if (!teacherA) return 1;
        if (!teacherB) return -1;
        return teacherA.localeCompare(teacherB);
      }
      const lastA = getStudentLastName(a).toLowerCase();
      const lastB = getStudentLastName(b).toLowerCase();
      if (lastA !== lastB) return lastA.localeCompare(lastB);
      return getStudentFirstName(a).localeCompare(getStudentFirstName(b));
    });
  } else if (sortOrder === 'student-last-name') {
    displayRecords.sort((a, b) => {
      const lastA = getStudentLastName(a).toLowerCase();
      const lastB = getStudentLastName(b).toLowerCase();
      if (lastA !== lastB) return lastA.localeCompare(lastB);
      return getStudentFirstName(a).localeCompare(getStudentFirstName(b));
    });
  }

  // Calculate pages count
  const itemsPerPage =
    settings.template === 'ipad-5160'
      ? 30
      : isDymoTemplate || isBrotherPTouch
      ? 1
      : settings.template === 'charger-sheet'
      ? 6
      : 10;
  const totalPages = Math.ceil(displayRecords.length / itemsPerPage) || 1;

  // Split records into page chunks
  const pageChunks: RecordData[][] = [];
  for (let i = 0; i < displayRecords.length; i += itemsPerPage) {
    pageChunks.push(displayRecords.slice(i, i + itemsPerPage));
  }
  if (pageChunks.length === 0) {
    pageChunks.push([]);
  }

  return (
    <div className="glass-card rounded-2xl shadow-xl flex flex-col overflow-hidden print:bg-transparent print:border-none print:shadow-none print:p-0 print:m-0">
      {/* Settings & Template Control Header (Hidden in Print) */}
      <div className="p-4 border-b border-white/30 bg-white/40 backdrop-blur-md text-slate-800 flex flex-wrap items-center justify-between gap-4 print:hidden">
        {/* Template Selector Dropdown */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Label Template:
            </span>
          </div>

          <select
            value={settings.template}
            onChange={(e) =>
              onUpdateSettings({ template: e.target.value as LabelTemplateType })
            }
            className="px-3.5 py-1.5 glass-input text-slate-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="ipad-5160">
              iPad Sticky Labels (Avery 5160 — 30/sheet)
            </option>
            <option value="student-5874">
              Student Business Cards — Double Sided (Avery 5871 / 5874 — 10/sheet)
            </option>
            <option value="teacher-5874">
              Teacher / Staff Cards (Avery 5871 / 5874 — 10/sheet)
            </option>
            <option value="student-5523">
              Student Name Badges — Double Sided (Avery 5523 / 5392 — 10/sheet)
            </option>
            <option value="teacher-5523">
              Teacher / Staff Badges (Avery 5523 / 5392 — 10/sheet)
            </option>
            <option value="staff-dymo">
              Staff Labels — Dymo Roll Printer (1 per label)
            </option>
            <option value="charger-dymo">
              Charger Labels — Dymo Roll Printer (1 per label)
            </option>
            <option value="charger-sheet">
              Charger Labels — Sheet Paper (Avery 8.5" x 11" — 6/sheet)
            </option>
            <option value="brother-ptouch">
              Brother P-Touch Barcode — PT-2730 (0.7" Tape Labels)
            </option>
          </select>

          {/* Brother P-Touch Barcode Controls */}
          {isBrotherPTouch && (
            <>
              <div className="flex items-center gap-2 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                <span className="text-xs text-emerald-950 font-bold flex items-center gap-1">
                  <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">SAVE TAPE</span>
                  Tape Length:
                </span>
                <select
                  value={settings.brotherTapeLength || '2.0in'}
                  onChange={(e) => onUpdateSettings({ brotherTapeLength: e.target.value })}
                  className="bg-transparent text-emerald-950 font-black text-xs focus:outline-none cursor-pointer"
                >
                  <option value="1.8in">1.8" — Ultra Compact Saver (1.8" × 0.7")</option>
                  <option value="2.0in">2.0" — Compact Saver [Recommended] (2.0" × 0.7")</option>
                  <option value="2.2in">2.2" — Standard Compact (2.2" × 0.7")</option>
                  <option value="2.5in">2.5" — Medium Tape (2.5" × 0.7")</option>
                  <option value="3.0in">3.0" — Wide Tape (3.0" × 0.7")</option>
                  <option value="3.2in">3.2" — Extra Wide Tape (3.2" × 0.7")</option>
                </select>
              </div>

              {/* Feed Direction Control for Brother PT-2730 */}
              <div className="flex items-center gap-2 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                <span className="text-xs text-emerald-950 font-bold">Feed Direction:</span>
                <select
                  value={brotherOrientation}
                  onChange={(e) => setBrotherOrientation(e.target.value as BrotherOrientationType)}
                  className="bg-transparent text-emerald-950 font-black text-xs focus:outline-none cursor-pointer"
                >
                  <option value="horizontal">Horizontal (Standard Along Tape Length)</option>
                  <option value="rotate90">Rotated 90° (Feed Along 0.7" Narrow Edge)</option>
                  <option value="rotate270">Rotated -90° (Reverse 90°)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
                <span className="text-xs text-slate-700 font-bold">Header Text:</span>
                <input
                  type="text"
                  value={settings.brotherHeaderText ?? 'FAIRFAX COUNTY PUBLIC SCHOOLS'}
                  onChange={(e) => onUpdateSettings({ brotherHeaderText: e.target.value })}
                  placeholder="FCPS Header"
                  className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none w-48"
                />
              </div>
            </>
          )}

          {/* Grade Level Filter (Allows printing specific grade) */}
          {uniqueSelectedGrades.length > 0 && (
            <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
              <span className="text-xs text-slate-700 font-bold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                Grade Filter:
              </span>
              <select
                value={printGradeFilter}
                onChange={(e) => setPrintGradeFilter(e.target.value)}
                className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="all">All Grades ({selectedRecords.length} cards)</option>
                {uniqueSelectedGrades.map(g => {
                  const count = selectedRecords.filter(r => {
                    const rGrade = (r.grade || '').toString().trim().toLowerCase();
                    const fGrade = g.toString().trim().toLowerCase();
                    return rGrade === fGrade || rGrade.replace(/^0+/, '') === fGrade.replace(/^0+/, '');
                  }).length;
                  return (
                    <option key={g} value={g}>
                      Grade {g} ({count} cards)
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Universal Print Sort Mode Selector */}
          <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
            <span className="text-xs text-slate-700 font-bold flex items-center gap-1">
              <ArrowDownAZ className="w-3.5 h-3.5 text-indigo-600" />
              Sort Order:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="grade-teacher-student">Highest Grade → Teacher (A-Z) → Student (A-Z)</option>
              <option value="teacher-student">Teacher (A-Z) → Student (A-Z)</option>
              <option value="student-last-name">Student Last Name (A-Z)</option>
              <option value="original">Original Selection Order</option>
            </select>
          </div>

          {/* Student Layout / Side Option when student-5874 or student-5523 is selected */}
          {(settings.template === 'student-5874' || settings.template === 'student-5523') && (
            <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
              <span className="text-xs text-slate-700 font-bold">Card Layout:</span>
              <select
                value={settings.printSide}
                onChange={(e) =>
                  onUpdateSettings({ printSide: e.target.value as PrintSideOption })
                }
                className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="single">Single-Sided (All-in-One: Lunch ID, Login, Password & Barcode)</option>
                <option value="duplex">Duplex (2-Sided: Front Photo/Logo + Back Passwords)</option>
                <option value="front">Front Only (Logo, Name, Lunch ID & Barcode)</option>
                <option value="back">Back Only (Login, Password & Barcode)</option>
              </select>
            </div>
          )}

          {/* Dymo Roll Options */}
          {isDymoTemplate && (
            <>
              {/* Dymo Label Model Option */}
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
                <span className="text-xs text-slate-700 font-bold">Label Roll:</span>
                <select
                  value={dymoModel}
                  onChange={(e) => setDymoModel(e.target.value as DymoModelType)}
                  className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="30857">DYMO 30857 Name Badge (4" × 2-1/4" / 2.25" × 4.0")</option>
                  <option value="30256">DYMO 30256 / Standard (3.5" × 2.0" / 2.0" × 3.5")</option>
                </select>
              </div>

              {/* Dymo Roll Orientation Option */}
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
                <span className="text-xs text-slate-700 font-bold">Roll Feed Direction:</span>
                <select
                  value={dymoOrientation}
                  onChange={(e) =>
                    setDymoOrientation(e.target.value as DymoOrientationType)
                  }
                  className="bg-transparent text-indigo-900 font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="rotate90">
                    Rotated 90° (Text Along Roll Length — Standard)
                  </option>
                  <option value="rotate270">
                    Rotated -90° (Reverse Text Along Roll Length)
                  </option>
                  <option value="vertical">
                    Vertical (Top-to-Bottom Feed)
                  </option>
                  <option value="landscape">
                    Landscape (Direct Wide Feed)
                  </option>
                </select>
              </div>
              {/* Position Fine-Tuning Nudge Option */}
              <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
                <span className="text-xs text-slate-700 font-bold">Margin Shift Nudge:</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-bold">Left/Right:</span>
                  <input
                    type="number"
                    step="0.02"
                    value={dymoOffsetX}
                    onChange={(e) => setDymoOffsetX(parseFloat(e.target.value) || 0)}
                    className="w-14 bg-white text-indigo-900 font-bold text-xs px-1.5 py-0.5 rounded border border-slate-300 focus:outline-none"
                    title="Horizontal Shift in inches (+ moves right/towards barcode, - moves left/towards name)"
                  />
                  <span className="text-[10px] text-slate-500 font-bold ml-1">Up/Down:</span>
                  <input
                    type="number"
                    step="0.02"
                    value={dymoOffsetY}
                    onChange={(e) => setDymoOffsetY(parseFloat(e.target.value) || 0)}
                    className="w-14 bg-white text-indigo-900 font-bold text-xs px-1.5 py-0.5 rounded border border-slate-300 focus:outline-none"
                    title="Vertical Shift in inches (+ moves down, - moves up)"
                  />
                  <span className="text-[10px] text-slate-400">in</span>
                </div>
              </div>
            </>
          )}

          {/* Sheet Template Printer Alignment Offset Option */}
          {!isDymoTemplate && !isBrotherPTouch && (
            <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/50 shadow-2xs">
              <span className="text-xs text-slate-700 font-bold">Printer Nudge Shift:</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-bold">Left/Right:</span>
                <input
                  type="number"
                  step="0.5"
                  value={settings.offsetXMm || 0}
                  onChange={(e) =>
                    onUpdateSettings({ offsetXMm: parseFloat(e.target.value) || 0 })
                  }
                  className="w-14 bg-white text-indigo-900 font-bold text-xs px-1.5 py-0.5 rounded border border-slate-300 focus:outline-none"
                  title="Horizontal Shift in mm (+ moves right, - moves left)"
                />
                <span className="text-[10px] text-slate-500 font-bold ml-1">Up/Down:</span>
                <input
                  type="number"
                  step="0.5"
                  value={settings.offsetYMm || 0}
                  onChange={(e) =>
                    onUpdateSettings({ offsetYMm: parseFloat(e.target.value) || 0 })
                  }
                  className="w-14 bg-white text-indigo-900 font-bold text-xs px-1.5 py-0.5 rounded border border-slate-300 focus:outline-none"
                  title="Vertical Shift in mm (+ moves down, - moves up)"
                />
                <span className="text-[10px] text-slate-400">mm</span>
              </div>
            </div>
          )}
        </div>

        {/* Print & Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Printer Destination Profile Indicator */}
          <div className="hidden lg:flex items-center text-[11px] font-black">
            {isBrotherPTouch && (
              <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <strong>Target: Brother PT-2730</strong> ({brotherTapeLength} × 0.7")
              </span>
            )}
            {isDymoTemplate && (
              <span className="bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                <strong>Target: DYMO {dymoModel}</strong> ({dymoSheetW} × {dymoSheetH})
              </span>
            )}
            {!isBrotherPTouch && !isDymoTemplate && (
              <span className="bg-blue-100 text-blue-950 border border-blue-300 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <strong>Target: HP / Laser Printer</strong> (Letter 8.5" × 11")
              </span>
            )}
          </div>

          <button
            onClick={() => setIsSiteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border border-indigo-400/30"
            title="Change school name, district, address, and logos for multi-site sharing"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-300" />
            <span className="truncate max-w-[1.8in]">{settings.schoolName || 'School Site'} Branding</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'preview' ? 'settings' : 'preview')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white/80 border border-white/60 text-slate-700 hover:bg-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Alignment & Logo</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={selectedRecords.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-full text-xs font-extrabold shadow-md transition-all cursor-pointer hover:shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>Print {selectedRecords.length} Labels / Cards</span>
          </button>
        </div>
      </div>

      {/* Brother P-Touch Tape Saver Guidance Banner */}
      {isBrotherPTouch && (
        <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200/80 flex items-center justify-between text-xs text-emerald-950 flex-wrap gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-emerald-600 text-white rounded-md font-extrabold text-[10px] uppercase tracking-wider">
              TAPE SAVER ACTIVE
            </span>
            <span className="font-bold">
              Digital length reduced to <strong className="underline text-emerald-950">{settings.brotherTapeLength || '2.0in'}</strong>
            </span>
          </div>
          <div className="text-[11px] text-emerald-900 font-medium">
            💡 <strong>Printer Setting Tip:</strong> Set Brother printer driver Margin to <strong>"Chain Printing"</strong> or <strong>"Small Margins"</strong> to stop the printer hardware from feeding extra blank tape before each cut!
          </div>
        </div>
      )}

      {/* Settings Drawer (Hidden in Print) */}
      {activeTab === 'settings' && (
        <div className="p-4 bg-white/50 backdrop-blur-md border-b border-white/30 flex flex-wrap gap-6 text-xs text-slate-800 print:hidden">
          {/* Logo Upload */}
          <div className="space-y-1.5 min-w-[280px] flex-1">
            <label className="font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>School Logo Override (PNG/JPG/SVG)</span>
              </span>
              {settings.customLogoUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ customLogoUrl: '' })}
                  className="text-[10px] text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset Default Logo
                </button>
              )}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Paste image URL or upload file..."
                value={settings.customLogoUrl}
                onChange={(e) => onUpdateSettings({ customLogoUrl: e.target.value })}
                className="flex-1 px-3 py-1.5 glass-input rounded-xl text-xs font-medium"
              />
              <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-2xs">
                <span>Browse File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        if (evt.target?.result) {
                          onUpdateSettings({ customLogoUrl: evt.target.result as string });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-500">
              Upload your school's PNG/JPG/SVG logo. Replaces the default Eagles emblem on all labels & cards.
            </p>
          </div>

          {/* Printer Calibration Adjustments */}
          <div className="space-y-1.5 min-w-[200px]">
            <label className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Print Calibration Offsets (mm)</span>
            </label>
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-600 block font-medium">X Offset (Left/Right):</span>
                <input
                  type="number"
                  step="0.5"
                  value={settings.offsetXMm}
                  onChange={(e) => onUpdateSettings({ offsetXMm: parseFloat(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 glass-input rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-600 block font-medium">Y Offset (Top/Bottom):</span>
                <input
                  type="number"
                  step="0.5"
                  value={settings.offsetYMm}
                  onChange={(e) => onUpdateSettings({ offsetYMm: parseFloat(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 glass-input rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Show Grid Lines */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-indigo-600" />
              <span>Visual Cut Guides</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={settings.showGridLines}
                onChange={(e) => onUpdateSettings({ showGridLines: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium">Show border gridlines on screen preview</span>
            </label>
          </div>
        </div>
      )}

      {/* Info Notice Banner (Hidden in Print) */}
      <div className="px-4 py-2.5 bg-indigo-500/10 border-b border-indigo-500/10 flex items-center justify-between text-xs text-indigo-950 font-medium print:hidden">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            {settings.template === 'ipad-5160' && (
              <strong>Avery 5160 Sticky Labels:</strong>
            )}
            {(settings.template === 'student-5874' || settings.template === 'student-5523') && (
              <strong>Avery {settings.template === 'student-5523' ? '5523 / 5392' : '5871 / 5874'} Double-Sided Student Cards:</strong>
            )}
            {(settings.template === 'teacher-5874' || settings.template === 'teacher-5523') && (
              <strong>Avery {settings.template === 'teacher-5523' ? '5523 / 5392' : '5871 / 5874'} Teacher / Staff Cards:</strong>
            )}
            {settings.template === 'staff-dymo' && (
              <strong>Staff Labels — DYMO {isDymo30857 ? '30857 Badge (4" × 2-1/4")' : '30256 (3.5" × 2")'} Roll Printer:</strong>
            )}
            {settings.template === 'charger-dymo' && (
              <strong>Charger Labels — DYMO {isDymo30857 ? '30857 Badge (4" × 2-1/4")' : '30256 (3.5" × 2")'} Roll Printer:</strong>
            )}
            {settings.template === 'charger-sheet' && (
              <strong>Charger Labels — Sheet Paper (6 Labels per Sheet):</strong>
            )}
            {' '}
            {selectedRecords.length} records selected • Total Pages: {totalPages * ((settings.template === 'student-5874' || settings.template === 'student-5523') && settings.printSide === 'duplex' ? 2 : 1)}
          </span>
        </div>
        <span className="text-[11px] text-indigo-700 font-semibold">
          Set browser print margins to "None" & scale to "100%" for exact label alignment
        </span>
      </div>

      {/* PRINT PREVIEW CONTAINER (On screen interactive scroll + CSS print styles) */}
      <div className="printable-sheet-container p-6 bg-slate-200/80 overflow-y-auto max-h-[680px] flex flex-col items-center gap-8 print:p-0 print:m-0 print:bg-white print:overflow-visible print:max-h-none print:gap-0">
        {selectedRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center max-w-md my-8 shadow-sm border border-slate-200 print:hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3">
              <Printer className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Records to Print</h3>
            <p className="text-xs text-slate-500 mt-1">
              Import your roster CSV or Google Drive Sheet in the Roster Editor, then select the records you want to generate labels for.
            </p>
          </div>
        ) : (
          pageChunks.map((chunk, pageIndex) => (
            <React.Fragment key={`page_${pageIndex}`}>
              {/* FRONT / MAIN PAGE */}
              {((settings.template !== 'student-5874' && settings.template !== 'student-5523') || settings.printSide !== 'back') && (
                <div
                  className={`printable-sheet ${
                    isDymoTemplate
                      ? dymoOrientation === 'landscape'
                        ? 'dymo-single'
                        : 'dymo-single-rotated'
                      : ''
                  } bg-white shadow-lg print:shadow-none print:m-0 relative box-border transition-all flex items-center justify-center ${
                    settings.showGridLines ? 'border border-dashed border-blue-300 print:border-none' : ''
                  }`}
                  style={{
                    width: isBrotherPTouch
                      ? (brotherOrientation === 'rotate90' || brotherOrientation === 'rotate270' ? '0.7in' : brotherTapeLength)
                      : isDymoTemplate
                      ? dymoSheetW
                      : '8.5in',
                    height: isBrotherPTouch
                      ? (brotherOrientation === 'rotate90' || brotherOrientation === 'rotate270' ? brotherTapeLength : '0.7in')
                      : isDymoTemplate
                      ? dymoSheetH
                      : '11.0in',
                    maxHeight: (!isDymoTemplate && !isBrotherPTouch) ? '11.0in' : undefined,
                    overflow: 'hidden',
                    padding:
                      settings.template === 'ipad-5160'
                        ? '0.5in 0.1875in'
                        : isDymoTemplate || isBrotherPTouch
                        ? '0'
                        : '0.5in 0.75in',
                    transform: (!isDymoTemplate && !isBrotherPTouch) ? `translate(${settings.offsetXMm}mm, ${settings.offsetYMm}mm)` : undefined,
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Page Indicator Tag for Screen */}
                  <div className="absolute top-2 right-3 text-[10px] font-bold bg-slate-800 text-slate-200 px-2 py-0.5 rounded print:hidden shadow-xs z-10">
                    Page {pageIndex + 1} of {totalPages} {
                      (settings.template === 'student-5874' || settings.template === 'student-5523')
                        ? settings.printSide === 'single'
                          ? '(Single-Sided All-in-One)'
                          : settings.printSide === 'duplex'
                          ? '(Front Side)'
                          : '(Front Only)'
                        : ''
                    }
                  </div>

                  {/* BROTHER P-TOUCH BARCODE LABEL */}
                  {settings.template === 'brother-ptouch' && (
                    <div className="flex justify-center items-center w-full h-full overflow-hidden">
                      {chunk.map((record) => (
                        <BrotherPTouchLabel
                          key={`ptouch_${record.id}`}
                          data={record}
                          headerText={settings.brotherHeaderText || settings.districtName || settings.schoolName}
                          tapeLength={brotherTapeLength}
                          orientation={brotherOrientation}
                        />
                      ))}
                    </div>
                  )}

                  {/* GRID FOR AVERY 5160 (3 cols x 10 rows, exact 2.625" x 1.0" per label) */}
                  {settings.template === 'ipad-5160' && (
                    <div
                      className="grid justify-items-center items-center"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 2.625in)',
                        gridTemplateRows: 'repeat(10, 1.0in)',
                        columnGap: '0.125in',
                        rowGap: '0in',
                        width: '8.125in',
                        height: '10.0in',
                        boxSizing: 'border-box'
                      }}
                    >
                      {chunk.map((record) => (
                        <IpadLabel5160
                          key={`5160_${record.id}`}
                          data={record}
                          schoolName={settings.schoolName}
                        />
                      ))}
                    </div>
                  )}

                  {/* GRID FOR AVERY 5874 / 5523 STUDENT (2 cols x 5 rows, exact 3.5" x 2.0" per card) */}
                  {(settings.template === 'student-5874' || settings.template === 'student-5523') && (
                    <div
                      className="grid justify-items-center items-center"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 3.5in)',
                        gridTemplateRows: 'repeat(5, 2.0in)',
                        columnGap: '0in',
                        rowGap: '0in',
                        width: '7.0in',
                        height: '10.0in',
                        boxSizing: 'border-box'
                      }}
                    >
                      {chunk.map((record) => (
                        settings.printSide === 'single' ? (
                          <StudentCardSingleSided
                            key={`std_single_${record.id}`}
                            data={record}
                            schoolName={settings.schoolName}
                            schoolAddress={settings.schoolAddress}
                            schoolYear={settings.schoolYear}
                            customLogoUrl={settings.customLogoUrl}
                          />
                        ) : (
                          <StudentCardFront
                            key={`std_front_${record.id}`}
                            data={record}
                            schoolName={settings.schoolName}
                            schoolAddress={settings.schoolAddress}
                            schoolYear={settings.schoolYear}
                            customLogoUrl={settings.customLogoUrl}
                          />
                        )
                      ))}
                    </div>
                  )}

                  {/* GRID FOR AVERY 5874 / 5523 TEACHER (2 cols x 5 rows, exact 3.5" x 2.0" per card) */}
                  {(settings.template === 'teacher-5874' || settings.template === 'teacher-5523') && (
                    <div
                      className="grid justify-items-center items-center"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 3.5in)',
                        gridTemplateRows: 'repeat(5, 2.0in)',
                        columnGap: '0in',
                        rowGap: '0in',
                        width: '7.0in',
                        height: '10.0in',
                        boxSizing: 'border-box'
                      }}
                    >
                      {chunk.map((record) => (
                        <TeacherCard
                          key={`tch_${record.id}`}
                          data={record}
                          schoolName={settings.schoolName}
                          districtName={settings.districtName}
                          schoolAddress={settings.schoolAddress}
                          customLogoUrl={settings.customLogoUrl}
                          customFcpsLogoUrl={settings.customFcpsLogoUrl}
                        />
                      ))}
                    </div>
                  )}

                  {/* SINGLE DYMO STAFF LABEL */}
                  {settings.template === 'staff-dymo' && (
                    <div className="flex justify-center items-center w-full h-full overflow-hidden">
                      {chunk.map((record) => (
                        <StaffDymoLabel
                          key={`staff_dymo_${record.id}`}
                          data={record}
                          schoolName={settings.schoolName}
                          districtName={settings.districtName}
                          schoolAddress={settings.schoolAddress}
                          customLogoUrl={settings.customLogoUrl}
                          customFcpsLogoUrl={settings.customFcpsLogoUrl}
                          orientation={dymoOrientation}
                          model={dymoModel}
                          offsetX={dymoOffsetX}
                          offsetY={dymoOffsetY}
                        />
                      ))}
                    </div>
                  )}

                  {/* SINGLE DYMO CHARGER LABEL */}
                  {settings.template === 'charger-dymo' && (
                    <div className="flex justify-center items-center w-full h-full overflow-hidden">
                      {chunk.map((record) => (
                        <ChargerDymoLabel
                          key={`dymo_${record.id}`}
                          data={record}
                          schoolName={settings.schoolName}
                          customLogoUrl={settings.customLogoUrl}
                          orientation={dymoOrientation}
                          model={dymoModel}
                          offsetX={dymoOffsetX}
                          offsetY={dymoOffsetY}
                        />
                      ))}
                    </div>
                  )}

                  {/* GRID FOR DYMO CHARGER LABELS ON SHEET PAPER (2 cols x 3 rows, 6 per page) */}
                  {settings.template === 'charger-sheet' && (
                    <div
                      className="grid justify-items-center items-center py-4"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 3.5in)',
                        gridTemplateRows: 'repeat(3, 2.25in)',
                        columnGap: '0.5in',
                        rowGap: '0.5in',
                        width: '7.5in',
                        height: '8.25in',
                        boxSizing: 'border-box',
                        alignContent: 'start',
                        justifyContent: 'center'
                      }}
                    >
                      {chunk.map((record) => (
                        <ChargerDymoLabel
                          key={`charger_sheet_${record.id}`}
                          data={record}
                          schoolName={settings.schoolName}
                          customLogoUrl={settings.customLogoUrl}
                          orientation="landscape"
                          model={dymoModel}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BACK PAGE FOR DUPLEX STUDENT CARDS (Avery 5874 / 5523 Student Back) */}
              {(settings.template === 'student-5874' || settings.template === 'student-5523') && (settings.printSide === 'duplex' || settings.printSide === 'back') && (
                <div
                  className={`printable-sheet bg-white shadow-lg print:shadow-none print:m-0 relative box-border transition-all ${
                    settings.showGridLines ? 'border border-dashed border-amber-300 print:border-none' : ''
                  }`}
                  style={{
                    width: '8.5in',
                    height: '11.0in',
                    maxHeight: '11.0in',
                    overflow: 'hidden',
                    padding: '0.5in 0.75in',
                    transform: `translate(${settings.offsetXMm}mm, ${settings.offsetYMm}mm)`,
                    boxSizing: 'border-box'
                  }}
                >
                  <div className="absolute top-2 right-3 text-[10px] font-bold bg-amber-800 text-amber-100 px-2 py-0.5 rounded print:hidden shadow-xs">
                    Page {pageIndex + 1} (Back Side - Passwords)
                  </div>

                  {/* Back side columns are horizontally swapped for long-edge duplex alignment */}
                  <div
                    className="grid justify-items-center items-center"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 3.5in)',
                      gridTemplateRows: 'repeat(5, 2.0in)',
                      columnGap: '0in',
                      rowGap: '0in',
                      width: '7.0in',
                      height: '10.0in',
                      boxSizing: 'border-box'
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((rowIdx) => {
                      const frontLeft = chunk[rowIdx * 2];
                      const frontRight = chunk[rowIdx * 2 + 1];
                      return (
                        <React.Fragment key={`back_row_${rowIdx}`}>
                          {/* Left column on back matches front Right */}
                          {frontRight ? (
                            <StudentCardBack
                              key={`std_back_${frontRight.id}`}
                              data={frontRight}
                              schoolName={settings.schoolName}
                            />
                          ) : (
                            <div className="w-[3.5in] h-[2.0in]" />
                          )}
                          {/* Right column on back matches front Left */}
                          {frontLeft ? (
                            <StudentCardBack
                              key={`std_back_${frontLeft.id}`}
                              data={frontLeft}
                              schoolName={settings.schoolName}
                            />
                          ) : (
                            <div className="w-[3.5in] h-[2.0in]" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Site Profile & Branding Modal */}
      <SiteProfileModal
        isOpen={isSiteModalOpen}
        onClose={() => setIsSiteModalOpen(false)}
        settings={settings}
        onUpdateSettings={onUpdateSettings}
      />
    </div>
  );
};
