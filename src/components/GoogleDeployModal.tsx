import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Terminal,
  FileSpreadsheet,
  Flame,
  Cloud,
  Globe,
  ExternalLink,
  Laptop,
  CheckCircle2,
  HelpCircle,
  Layers
} from 'lucide-react';

interface GoogleDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDeployModal: React.FC<GoogleDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'firebase' | 'cloudrun' | 'cloudshell'>('sheets');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in print:hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                Google Deployment & npm Guide
                <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Google Specific
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Official guide for Google Apps Script, Google Sheets, Google Firebase & Google Cloud Run
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>1. Google Sheets & Apps Script (Workspace)</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'firebase'
                ? 'border-amber-500 text-amber-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>2. Google Firebase Hosting (Free Web App)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudshell')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'cloudshell'
                ? 'border-blue-600 text-blue-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>3. Google Cloud Shell (No Local Install)</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudrun')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'cloudrun'
                ? 'border-indigo-600 text-indigo-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Cloud className="w-4 h-4 text-indigo-600" />
            <span>4. Google Cloud Run (GCP Container)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 flex-1">
          {/* TAB 1: Google Sheets & Apps Script */}
          {activeTab === 'sheets' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-emerald-900 text-xs">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-emerald-950 mb-1">
                    Native Google Sheets & Google Workspace Integration
                  </p>
                  <p>
                    Because Glen Forest Elementary School uses Google Workspace (FCPS), this app includes a pre-configured <code className="bg-emerald-100 font-bold px-1.5 py-0.5 rounded">Code.gs</code> and <code className="bg-emerald-100 font-bold px-1.5 py-0.5 rounded">appsscript.json</code>. Running <code className="bg-emerald-100 font-bold px-1.5 py-0.5 rounded">npm run build</code> generates a 100% self-contained single-file HTML bundle (<code className="bg-emerald-100 font-bold px-1.5 py-0.5 rounded">dist/index.html</code>) designed to run inside Google Sheets as a sidebar or modal!
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Build the self-contained bundle with npm
                  </h4>
                  <button
                    onClick={() => handleCopy('npm install && npm run build', 'gas-npm')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    {copiedId === 'gas-npm' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'gas-npm' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600">
                  Run in your terminal (or Google Cloud Shell):
                </p>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg flex items-center justify-between">
                  <code>npm install &amp;&amp; npm run build</code>
                </div>
                <p className="text-xs text-slate-500">
                  This creates <code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">dist/index.html</code> containing all JavaScript, CSS, and SVG logos in one file.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Open Google Sheets &amp; Apps Script Editor
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 pl-2">
                  <li>Open your FCPS Google Sheet (with your student/staff roster).</li>
                  <li>Click <strong>Extensions</strong> in the top menu &gt; <strong>Apps Script</strong>.</li>
                  <li>In the Apps Script editor:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-600">
                      <li>Copy and paste the code from <code className="font-mono font-bold text-slate-900">Code.gs</code> (in this repository) into the existing <code className="font-mono">Code.gs</code> file.</li>
                      <li>Click <strong>+</strong> next to Files &gt; choose <strong>HTML</strong>. Name the file exactly <code className="font-mono font-bold text-emerald-800">index</code>.</li>
                      <li>Open <code className="font-mono">dist/index.html</code> on your computer, copy its entire contents, and paste it into the new <code className="font-mono">index.html</code> in Apps Script.</li>
                    </ul>
                  </li>
                  <li>Click the <strong>Save</strong> disk icon (or Ctrl+S).</li>
                </ol>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Deploy as a Google Sheets Tool or Standalone Web App
                </h4>
                <div className="text-xs space-y-2 text-slate-700">
                  <p>
                    <strong>Option A — Direct Google Sheets Menu:</strong> Reload your Google Sheet. A new menu item titled <strong>Glen Forest Label Studio</strong> will appear! Click <em>Open Label Studio (Modal Dialog)</em> to print directly from the live sheet.
                  </p>
                  <p>
                    <strong>Option B — Standalone Google Web App URL:</strong>
                    In Apps Script, click <strong>Deploy</strong> &gt; <strong>New deployment</strong> &gt; Select type <strong>Web app</strong>:
                  </p>
                  <ul className="list-disc list-inside pl-4 text-slate-600 space-y-1">
                    <li>Execute as: <strong>Me</strong> (or User accessing the web app)</li>
                    <li>Who has access: <strong>Anyone within Fairfax County Public Schools</strong> (or Anyone)</li>
                    <li>Click <strong>Deploy</strong> and copy your permanent Google web app URL!</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Google Firebase Hosting */}
          {activeTab === 'firebase' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-xs">
                <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-amber-950 mb-1">
                    Google Firebase Hosting (Recommended for Web URL)
                  </p>
                  <p>
                    Firebase Hosting is Google's high-speed CDN hosting platform. It is 100% free for school applications, provisions free SSL, and allows custom domains (e.g., <code className="bg-amber-100 font-bold px-1.5 py-0.5 rounded">labels.glenforest.org</code> or <code className="bg-amber-100 font-bold px-1.5 py-0.5 rounded">&lt;project&gt;.web.app</code>). A <code className="bg-amber-100 font-bold px-1.5 py-0.5 rounded">firebase.json</code> file is already created in this project!
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Install the Firebase CLI &amp; Login with Google
                  </h4>
                  <button
                    onClick={() => handleCopy('npm install -g firebase-tools && firebase login', 'fb-cli')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    {copiedId === 'fb-cli' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'fb-cli' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg space-y-1">
                  <div>npm install -g firebase-tools</div>
                  <div>firebase login</div>
                </div>
                <p className="text-xs text-slate-500">
                  This opens a browser tab to log in with your Google / FCPS account.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Initialize Firebase (One-Time Setup)
                  </h4>
                  <button
                    onClick={() => handleCopy('firebase init hosting', 'fb-init')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    {copiedId === 'fb-init' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'fb-init' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg">
                  <code>firebase init hosting</code>
                </div>
                <p className="text-xs text-slate-600">
                  Select your Firebase project. When prompted:
                </p>
                <ul className="text-xs list-disc list-inside pl-2 space-y-1 text-slate-600">
                  <li>Public directory: <strong>dist</strong></li>
                  <li>Configure as a single-page app (SPA): <strong>Yes</strong></li>
                  <li>Set up automatic builds with GitHub: <strong>No</strong> (or Yes if desired)</li>
                  <li>Overwrite index.html? <strong>No</strong></li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Build and Deploy with One Command
                  </h4>
                  <button
                    onClick={() => handleCopy('npm run deploy:firebase', 'fb-deploy')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    {copiedId === 'fb-deploy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'fb-deploy' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg">
                  <code>npm run deploy:firebase</code>
                </div>
                <p className="text-xs text-slate-600">
                  This compiles the application and deploys it straight to Google Firebase CDN. Within seconds, your live URL is active at:
                </p>
                <div className="bg-amber-100 text-amber-950 font-mono text-xs p-2 rounded border border-amber-200">
                  https://&lt;your-project-id&gt;.web.app
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Google Cloud Shell */}
          {activeTab === 'cloudshell' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-blue-900 text-xs">
                <Terminal className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-blue-950 mb-1">
                    Run via Google Cloud Shell (Zero Local Installations)
                  </p>
                  <p>
                    School computers often block installing Node.js or npm. Google Cloud Shell provides a free browser terminal in Google Cloud with Node, npm, Git, and gcloud already pre-installed by Google!
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Steps to Run in Google Cloud Shell
                </h4>
                <ol className="list-decimal list-inside space-y-3 text-xs text-slate-700">
                  <li>
                    Navigate to <a href="https://shell.cloud.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline inline-flex items-center gap-1">shell.cloud.google.com <ExternalLink className="w-3 h-3" /></a> and sign in with your Google account.
                  </li>
                  <li>
                    Clone or upload your project files into Cloud Shell.
                  </li>
                  <li>
                    Run the following commands in the terminal:
                    <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg my-2 space-y-1">
                      <div>npm install</div>
                      <div>npm run dev</div>
                    </div>
                  </li>
                  <li>
                    In the top right of the Cloud Shell terminal, click the <strong>Web Preview</strong> button (icon with an eye and browser window) &gt; click <strong>Change port to 3000</strong> &gt; click <strong>Preview</strong>.
                  </li>
                  <li>
                    The Label Generator will open in a new tab running directly in your Google cloud environment!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: Google Cloud Run */}
          {activeTab === 'cloudrun' && (
            <div className="space-y-5">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3 text-indigo-900 text-xs">
                <Cloud className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-indigo-950 mb-1">
                    Google Cloud Run (GCP Enterprise Container)
                  </p>
                  <p>
                    Google Cloud Run runs containers directly on Google's scalable infrastructure. A production-ready <code className="bg-indigo-100 font-bold px-1.5 py-0.5 rounded">Dockerfile</code> is already included in this repository.
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">Deploying to Google Cloud Run via gcloud CLI</h4>
                  <button
                    onClick={() => handleCopy('gcloud run deploy glen-forest-labels --source . --region us-east1 --allow-unauthenticated', 'gcloud-deploy')}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-700 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    {copiedId === 'gcloud-deploy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'gcloud-deploy' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-lg space-y-1">
                  <div>gcloud auth login</div>
                  <div>gcloud config set project YOUR_GCP_PROJECT_ID</div>
                  <div>gcloud run deploy glen-forest-labels --source . --region us-east1 --allow-unauthenticated</div>
                </div>
                <p className="text-xs text-slate-600">
                  Google Cloud Build will automatically build the container and deploy to an HTTPS endpoint on Google Cloud Run.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tested with Google Apps Script V8, Google Firebase 13+, and Google Cloud SDK</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
