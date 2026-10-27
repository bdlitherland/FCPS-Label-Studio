import React, { useState, useRef } from 'react';
import { PrintSettings } from '../types';
import { GlenForestLogo } from './GlenForestLogo';
import { FcpsLogo } from './FcpsLogo';
import {
  Building2,
  Upload,
  Download,
  Image as ImageIcon,
  Save,
  Trash2,
  RotateCcw,
  CheckCircle2,
  X,
  School,
  MapPin,
  Calendar,
  Sparkles,
  FileCode,
  Tag
} from 'lucide-react';

export interface SitePreset {
  id: string;
  name: string;
  settings: Partial<PrintSettings>;
}

const DEFAULT_PRESETS: SitePreset[] = [
  {
    id: 'gfes-default',
    name: 'Glen Forest ES (FCPS Default)',
    settings: {
      schoolName: 'Glen Forest Elementary School',
      districtName: 'Fairfax County Public Schools',
      schoolAddress: '5829 Glen Forest Drive, Falls Church, VA 22041',
      schoolPhone: '(703) 578-8000',
      schoolYear: '2025-2026',
      customLogoUrl: '',
      customFcpsLogoUrl: '',
      brotherHeaderText: 'FAIRFAX COUNTY PUBLIC SCHOOLS'
    }
  },
  {
    id: 'generic-fcps',
    name: 'Generic FCPS School',
    settings: {
      schoolName: 'Fairfax County Public School',
      districtName: 'Fairfax County Public Schools',
      schoolAddress: 'Fairfax, VA',
      schoolPhone: '(703) 555-0100',
      schoolYear: '2025-2026',
      customLogoUrl: '',
      customFcpsLogoUrl: '',
      brotherHeaderText: 'FAIRFAX COUNTY PUBLIC SCHOOLS'
    }
  },
  {
    id: 'generic-elem',
    name: 'Generic Elementary School',
    settings: {
      schoolName: 'Lincoln Elementary School',
      districtName: 'Public School District',
      schoolAddress: '100 Education Way, Suite A',
      schoolPhone: '(555) 123-4567',
      schoolYear: '2025-2026',
      customLogoUrl: '',
      customFcpsLogoUrl: '',
      brotherHeaderText: 'PUBLIC SCHOOL DISTRICT'
    }
  }
];

interface SiteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onUpdateSettings: (newSettings: Partial<PrintSettings>) => void;
}

export const SiteProfileModal: React.FC<SiteProfileModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const [savedPresets, setSavedPresets] = useState<SitePreset[]>(() => {
    const saved = localStorage.getItem('gfes_site_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved site presets', e);
      }
    }
    return DEFAULT_PRESETS;
  });

  const [presetNameInput, setPresetNameInput] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'logos' | 'presets'>('info');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const districtLogoFileInputRef = useRef<HTMLInputElement>(null);
  const importProfileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Save current settings as a custom preset
  const handleSaveCurrentAsPreset = () => {
    const title = presetNameInput.trim() || `${settings.schoolName || 'Custom Site'} Profile`;
    const newPreset: SitePreset = {
      id: `preset_${Date.now()}`,
      name: title,
      settings: {
        schoolName: settings.schoolName,
        districtName: settings.districtName,
        schoolAddress: settings.schoolAddress,
        schoolPhone: settings.schoolPhone,
        schoolYear: settings.schoolYear,
        customLogoUrl: settings.customLogoUrl,
        customFcpsLogoUrl: settings.customFcpsLogoUrl,
        brotherHeaderText: settings.brotherHeaderText
      }
    };

    const updated = [newPreset, ...savedPresets];
    setSavedPresets(updated);
    localStorage.setItem('gfes_site_presets', JSON.stringify(updated));
    setPresetNameInput('');
    showToast(`Saved preset "${title}" successfully!`);
  };

  // Apply a preset
  const handleApplyPreset = (preset: SitePreset) => {
    onUpdateSettings(preset.settings);
    showToast(`Applied site profile "${preset.name}"`);
  };

  // Delete a custom preset
  const handleDeletePreset = (id: string) => {
    if (confirm('Are you sure you want to delete this saved site preset?')) {
      const updated = savedPresets.filter(p => p.id !== id);
      setSavedPresets(updated);
      localStorage.setItem('gfes_site_presets', JSON.stringify(updated));
      showToast('Preset deleted');
    }
  };

  // Export current site config as JSON
  const handleExportProfile = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      schoolName: settings.schoolName,
      districtName: settings.districtName,
      schoolAddress: settings.schoolAddress,
      schoolPhone: settings.schoolPhone,
      schoolYear: settings.schoolYear,
      customLogoUrl: settings.customLogoUrl,
      customFcpsLogoUrl: settings.customFcpsLogoUrl,
      brotherHeaderText: settings.brotherHeaderText,
      brotherTapeLength: settings.brotherTapeLength,
      offsetXMm: settings.offsetXMm,
      offsetYMm: settings.offsetYMm
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(settings.schoolName || 'site').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_branding.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Site profile configuration file downloaded!');
  };

  // Import site profile JSON
  const handleImportProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.schoolName || json.districtName) {
          onUpdateSettings({
            schoolName: json.schoolName || settings.schoolName,
            districtName: json.districtName || settings.districtName,
            schoolAddress: json.schoolAddress || settings.schoolAddress,
            schoolPhone: json.schoolPhone || settings.schoolPhone,
            schoolYear: json.schoolYear || settings.schoolYear,
            customLogoUrl: json.customLogoUrl ?? settings.customLogoUrl,
            customFcpsLogoUrl: json.customFcpsLogoUrl ?? settings.customFcpsLogoUrl,
            brotherHeaderText: json.brotherHeaderText || settings.brotherHeaderText,
            brotherTapeLength: json.brotherTapeLength || settings.brotherTapeLength,
            offsetXMm: json.offsetXMm ?? settings.offsetXMm,
            offsetYMm: json.offsetYMm ?? settings.offsetYMm
          });
          showToast(`Successfully imported profile for ${json.schoolName || 'Site'}!`);
        } else {
          alert('Invalid profile JSON file. Missing school details.');
        }
      } catch (err) {
        alert('Could not parse JSON profile file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/95 rounded-2xl shadow-2xl border border-white/50 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <Building2 className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Site Branding & School Profile
              </h2>
              <p className="text-xs text-indigo-200 font-medium">
                Customize school details, address, logos & headers for multi-site sharing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-t-xl font-bold text-xs flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'bg-white border-slate-200 text-indigo-950 shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <School className="w-4 h-4 text-indigo-600" />
            <span>School Info</span>
          </button>

          <button
            onClick={() => setActiveTab('logos')}
            className={`px-4 py-2 rounded-t-xl font-bold text-xs flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'logos'
                ? 'bg-white border-slate-200 text-indigo-950 shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Logos & Emblems</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-t-xl font-bold text-xs flex items-center gap-2 border-t border-x transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-white border-slate-200 text-indigo-950 shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Saved Sites ({savedPresets.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          
          {/* TAB 1: School Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-indigo-950 leading-relaxed font-medium">
                  Changes made here instantly update across all printable templates (Avery student cards, teacher IDs, DYMO charger stickers, Brother P-Touch asset tags, and iPad labels).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-indigo-600" />
                    <span>School Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => onUpdateSettings({ schoolName: e.target.value })}
                    placeholder="e.g. Glen Forest Elementary School"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Appears in card headers, Dymo labels & back-side titles.
                  </p>
                </div>

                {/* District Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>District / Organization Name</span>
                  </label>
                  <input
                    type="text"
                    value={settings.districtName || ''}
                    onChange={(e) => onUpdateSettings({ districtName: e.target.value })}
                    placeholder="e.g. Fairfax County Public Schools"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Appears under school name on staff cards & labels.
                  </p>
                </div>

                {/* School Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>School Address Line</span>
                  </label>
                  <input
                    type="text"
                    value={settings.schoolAddress}
                    onChange={(e) => onUpdateSettings({ schoolAddress: e.target.value })}
                    placeholder="e.g. 5829 Glen Forest Drive, Falls Church, VA 22041"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Printed in footers on staff cards & DYMO staff labels.
                  </p>
                </div>

                {/* School Phone */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>School Phone (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={settings.schoolPhone || ''}
                    onChange={(e) => onUpdateSettings({ schoolPhone: e.target.value })}
                    placeholder="e.g. (703) 578-8000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                </div>

                {/* School Year */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>School Year</span>
                  </label>
                  <input
                    type="text"
                    value={settings.schoolYear}
                    onChange={(e) => onUpdateSettings({ schoolYear: e.target.value })}
                    placeholder="e.g. 2025-2026"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Badge year tag on student card fronts.
                  </p>
                </div>

                {/* Brother P-Touch Barcode Header */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Brother P-Touch Tape Header Text</span>
                  </label>
                  <input
                    type="text"
                    value={settings.brotherHeaderText || ''}
                    onChange={(e) => onUpdateSettings({ brotherHeaderText: e.target.value })}
                    placeholder="e.g. FAIRFAX COUNTY PUBLIC SCHOOLS"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <p className="text-[10px] text-slate-500">
                    Top text printed above barcode on Brother 0.7" tape labels.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Logos & Emblems */}
          {activeTab === 'logos' && (
            <div className="space-y-6">
              
              {/* Main School Mascot Logo */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      School Mascot / Main Emblem Logo
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Printed on Student Cards, Teacher Cards, Charger Stickers, and Staff Badges.
                    </p>
                  </div>
                  {settings.customLogoUrl && (
                    <button
                      onClick={() => onUpdateSettings({ customLogoUrl: '' })}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to Default Eagle Logo
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center p-2 shrink-0 shadow-2xs">
                    <GlenForestLogo customUrl={settings.customLogoUrl} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.customLogoUrl || ''}
                        onChange={(e) => onUpdateSettings({ customLogoUrl: e.target.value })}
                        placeholder="Paste image URL (https://... or data:image/...)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                      />
                      <button
                        onClick={() => logoFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <input
                        ref={logoFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                onUpdateSettings({ customLogoUrl: ev.target.result as string });
                                showToast('School logo image loaded!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Supports PNG, JPG, WebP, or SVG format. Transparent background recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* District / Org Secondary Logo */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      District / Secondary Logo
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Printed on left header of Teacher Cards and Staff Dymo Badges.
                    </p>
                  </div>
                  {settings.customFcpsLogoUrl && (
                    <button
                      onClick={() => onUpdateSettings({ customFcpsLogoUrl: '' })}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to FCPS Seal
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center p-2 shrink-0 shadow-2xs">
                    {settings.customFcpsLogoUrl ? (
                      <img
                        src={settings.customFcpsLogoUrl}
                        alt="District Logo"
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FcpsLogo className="max-h-full max-w-full object-contain" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.customFcpsLogoUrl || ''}
                        onChange={(e) => onUpdateSettings({ customFcpsLogoUrl: e.target.value })}
                        placeholder="Paste district logo URL (https://...)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                      />
                      <button
                        onClick={() => districtLogoFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <input
                        ref={districtLogoFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                onUpdateSettings({ customFcpsLogoUrl: ev.target.result as string });
                                showToast('District logo image loaded!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Saved Sites & Shareability */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              
              {/* Save Current as Preset */}
              <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 space-y-2">
                <h3 className="font-extrabold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Save className="w-4 h-4 text-indigo-600" />
                  Save Current Site Profile As Preset
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    placeholder={`e.g. ${settings.schoolName || 'My School Site'}`}
                    className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-xl font-bold text-slate-900 text-xs"
                  />
                  <button
                    onClick={handleSaveCurrentAsPreset}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Preset</span>
                  </button>
                </div>
              </div>

              {/* Saved Presets List */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Available Site Profiles</span>
                  <span className="text-[10px] text-slate-500 font-normal">Click "Apply" to switch current site variables</span>
                </h3>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {savedPresets.map((preset) => {
                    const isCurrent =
                      preset.settings.schoolName === settings.schoolName &&
                      preset.settings.districtName === settings.districtName;

                    return (
                      <div
                        key={preset.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-blue-50/90 border-blue-300 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-xs">{preset.name}</span>
                            {isCurrent && (
                              <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Active Site
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">
                            {preset.settings.schoolName} • {preset.settings.districtName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApplyPreset(preset)}
                            disabled={isCurrent}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-slate-200 text-slate-500 cursor-default'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                            }`}
                          >
                            {isCurrent ? 'Active' : 'Apply Site'}
                          </button>
                          {!DEFAULT_PRESETS.some(dp => dp.id === preset.id) && (
                            <button
                              onClick={() => handleDeletePreset(preset.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                              title="Delete preset"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Export & Import File Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3 justify-between items-center">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-slate-900 text-xs block">Share & Migrate Site Settings</span>
                  <span className="text-[10px] text-slate-500 block">Export or import `.json` profile files for team sharing across school sites.</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportProfile}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Profile</span>
                  </button>

                  <button
                    onClick={() => importProfileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold border border-slate-300 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Import JSON</span>
                  </button>
                  <input
                    ref={importProfileInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportProfile}
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <div className="text-[11px] text-slate-600">
            Current Active Site: <strong className="text-slate-900">{settings.schoolName || 'Glen Forest ES'}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Done & Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
