# Glen Forest Label Studio — Google Run & Deployment Guide

This application is built for Fairfax County Public Schools (Glen Forest Elementary School) to generate and print iPad Sticky Labels (Avery 5160), Double-Sided Student Badges (Avery 5874/5523), Staff Badges, Dymo Charger Labels, and Brother P-Touch Continuous Tape.

The application is tailored specifically for **Google Workspace & Google Cloud Platform (GCP)** environments:
- **GitHub Pages (Free Static Web Hosting)**: Deploy and host directly on GitHub with zero server cost using automated GitHub Actions (`.github/workflows/deploy.yml`).
- **Google Sheets & Google Apps Script**: Run as an integrated Google Sheet add-on, dialog modal, or standalone Google Workspace Web App (`Code.gs` + `appsscript.json`).
- **Google Firebase Hosting**: Deploy as a lightning-fast, secure, free Google-hosted web app with SSL and custom domain support (`firebase.json`).
- **Google Cloud Run**: Run as a containerized microservice on Google Cloud Platform with auto-scaling (`Dockerfile`).
- **Google Cloud Shell**: Run directly in a web browser without installing anything on locked-down school computers.
- **Google Sites**: Embed directly into FCPS staff portals or internal school intranets.

---

## 1. Quick Prerequisites

You can run and deploy this project either **locally on your computer** or **directly inside Google Cloud Shell** (no local software installation required).

### If Running on your Computer:
- **Node.js**: v18.x, v20.x, or v22.x LTS ([nodejs.org](https://nodejs.org/))
- **npm**: v9+ (included with Node.js)
- Verify in your terminal:
  ```bash
  node -v
  npm -v
  ```

### If Running in Google Cloud Shell (No Local Install Needed):
If your school district (FCPS) laptop restricts software installations, you can use **Google Cloud Shell** for free:
1. Open [https://shell.cloud.google.com](https://shell.cloud.google.com) in Google Chrome.
2. Google Cloud Shell provides a browser-based Linux terminal with Node.js, npm, Git, and Google Cloud SDK (`gcloud`) already pre-installed.

---

## 2. Running the App with npm

### Step 1: Install Dependencies
In the root directory containing `package.json`:
```bash
npm install
```

### Step 2: Start the Vite Development Server
```bash
npm run dev
```
- Open `http://localhost:3000` in Google Chrome.
- *(In Google Cloud Shell: Click the **Web Preview** icon in the upper-right corner &gt; **Change port to 3000** &gt; **Preview**).*

### Step 3: Type Checking & Linting
Ensure there are no TypeScript syntax errors:
```bash
npm run lint
```

### Step 4: Build for Production
```bash
npm run build
```
- Vite compiles the entire application into the `dist/` directory.
- Thanks to `vite-plugin-singlefile`, all HTML, CSS, JavaScript, and SVG logos are compiled into a single self-contained file (`dist/index.html`). This is specifically required for Google Apps Script HTML Service.

---

## 3. Hosting Directly on GitHub (GitHub Pages — Free & Automated)

**Yes, absolutely!** This application is 100% client-side (built with React, TypeScript, and Vite). All student roster data and custom printer formats are saved locally in the browser's `localStorage` or loaded directly via CSV import. No external database or backend server is needed, making it ideal for **free, direct hosting on GitHub Pages**.

The repository has already been configured for GitHub hosting:
- `vite.config.ts` has `base: './'` enabled so all assets load correctly regardless of whether the repository is at a subpath (`https://<username>.github.io/<repo-name>/`) or custom domain.
- A ready-to-run GitHub Actions workflow has been created in `.github/workflows/deploy.yml`.

### Step 1: Push your Code to GitHub
In your local terminal:
```bash
git init
git add .
git commit -m "Initial commit for Glen Forest Label Studio"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPOSITORY-NAME>.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. Go to your repository on [GitHub.com](https://github.com).
2. Click **Settings** (top tab bar) &gt; **Pages** (in the left sidebar under *Code and automation*).
3. Under **Build and deployment**:
   - Change **Source** to: **GitHub Actions**.
4. That's it! GitHub Actions will automatically trigger the workflow in `.github/workflows/deploy.yml`, compile your Vite application (`npm run build`), and deploy the `dist/` bundle.

### Step 3: Access your Live App
Once the workflow finishes (typically ~45 seconds):
- Your live app URL will be displayed in **Settings &gt; Pages**:
  ```
  https://<YOUR-GITHUB-USERNAME>.github.io/<YOUR-REPOSITORY-NAME>/
  ```
- Any future changes pushed to `main` will automatically build and update the site.

---

## 4. Deploying to Google Apps Script / Google Sheets (Workspace Add-on)

This allows teachers and staff to open their student roster in **Google Sheets** and generate labels with a single click, reading roster data directly from the active spreadsheet tab.

### Method A: Copy & Paste via Google Apps Script Editor (Zero CLI Setup)
1. In your terminal, build the project:
   ```bash
   npm run build
   ```
2. Open your FCPS Google Sheet (or go to [https://script.google.com](https://script.google.com)).
3. In Google Sheets, click **Extensions** &gt; **Apps Script**.
4. In the Apps Script code editor:
   - **Code.gs**: Copy the contents of `Code.gs` from this repository and paste them into the Apps Script `Code.gs` file.
   - **index.html**: In the left sidebar of Apps Script, click **+ (Add a file)** &gt; choose **HTML**. Name it exactly `index`.
   - Open `dist/index.html` on your computer in any text editor (Notepad, VS Code, or TextEdit), copy all contents (`Ctrl+A` / `Cmd+A` &gt; `Copy`), and paste into the `index.html` file in Google Apps Script.
5. Click the **Save project** floppy disk icon (or `Ctrl+S`).
6. **To use inside Google Sheets**:
   - Reload your Google Sheet tab in Chrome.
   - A new menu item will appear: **Glen Forest Label Studio**.
   - Click **Open Label Studio (Modal Dialog)** to launch the application directly on top of your student spreadsheet!
7. **To deploy as a Standalone Google Web App URL**:
   - In Apps Script, click **Deploy** (top right) &gt; **New deployment**.
   - Click the gear icon &gt; Select **Web app**.
   - **Description**: `Glen Forest Label Studio v1.0`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone within Fairfax County Public Schools` (or `Anyone`)
   - Click **Deploy** and copy your permanent Google Web App URL (ends in `/exec`).

### Method B: Automated Deployment using Google's Clasp CLI (`@google/clasp`)
Google provides the **clasp** (Command Line Apps Script Projects) tool to push code directly:
1. Install Clasp:
   ```bash
   npm install -g @google/clasp
   ```
2. Enable the Google Apps Script API at [https://script.google.com/home/usersettings](https://script.google.com/home/usersettings).
3. Log in with your Google account:
   ```bash
   clasp login
   ```
4. Create a new Google Sheet script or clone your existing script:
   ```bash
   clasp clone <YOUR_APPS_SCRIPT_SCRIPT_ID>
   ```
5. Build and push:
   ```bash
   npm run build
   cp dist/index.html ./index.html
   clasp push
   clasp deploy --description "Production Release"
   ```

---

## 5. Deploying to Google Firebase Hosting (Recommended for Public / District Web URL)

Google Firebase Hosting delivers your application over Google's global CDN with free automated SSL certificates and custom domains (e.g., `labels.fcps.edu` or `glen-forest-labels.web.app`).

This repository already includes the pre-configured `firebase.json` file.

### Step 1: Install Firebase CLI & Authenticate
```bash
npm install -g firebase-tools
firebase login
```
*(A browser window will open asking you to sign into your Google account).*

### Step 2: Initialize Firebase (One-Time Setup)
```bash
firebase init hosting
```
- Select **Use an existing project** (or create a new Google Cloud/Firebase project).
- When prompted:
  - What do you want to use as your public directory? &rarr; Type `dist` and press Enter.
  - Configure as a single-page app (rewrite all urls to /index.html)? &rarr; Type `y` and press Enter.
  - Set up automatic builds and deploys with GitHub? &rarr; Type `n` (or `y` if you want GitHub Actions).
  - File dist/index.html already exists. Overwrite? &rarr; Type `N` (do not overwrite).

### Step 3: Build & Deploy with npm
Run the shortcut npm script:
```bash
npm run deploy:firebase
```
*(Or manually: `npm run build && firebase deploy --only hosting`)*

### Output:
Firebase outputs your live Google-hosted URLs:
```
✔ Deploy complete!
Hosting URL: https://<your-project-id>.web.app
Hosting URL: https://<your-project-id>.firebaseapp.com
```

---

## 6. Deploying to Google Cloud Run (GCP Enterprise Container)

If your school district runs an enterprise Google Cloud Platform (GCP) organization, you can deploy Glen Forest Label Studio to **Google Cloud Run** using the included production `Dockerfile`.

### Step 1: Install Google Cloud SDK (`gcloud`)
Install the Google Cloud SDK or run directly inside **Google Cloud Shell** (`shell.cloud.google.com`).

### Step 2: Authenticate and Set GCP Project
```bash
gcloud auth login
gcloud config set project <YOUR_GCP_PROJECT_ID>
```

### Step 3: Build & Deploy in One Command
```bash
npm run deploy:gcloud
```
*(Or run directly:)*
```bash
gcloud run deploy glen-forest-labels \
  --source . \
  --region us-east1 \
  --platform managed \
  --allow-unauthenticated
```

Google Cloud Build will automatically build the container from `Dockerfile` and provide an HTTPS production URL on Google Cloud Run.

---

## 7. Embedding in Google Sites (FCPS School Portal)

Fairfax County Public Schools frequently uses Google Sites for staff portals.

1. Obtain your deployed URL from **Google Firebase Hosting** (e.g. `https://gfes-labels.web.app`) or **Google Apps Script Web App** (ends in `/exec`).
2. Open your school's **Google Site** in edit mode.
3. In the right panel, click **Embed**.
4. Choose **By URL** and paste your deployment URL.
5. Resize the embedded frame on the page to full width.
6. Teachers and staff can now open the Label Studio directly within the school Google Site!

---

## 8. Printing Best Practices for Google Chrome

When generating prints in Google Chrome:
1. Press `Ctrl + P` (Windows / Chromebook) or `Cmd + P` (Mac).
2. **Destination**: Select your laser printer (or Dymo / Brother printer).
3. **Scale**: Must be set to **100% / Actual Size** (never select "Fit to printable area" or Avery alignment will shift).
4. **Margins**: Set to **None** or **Default** as instructed on screen.
5. **Duplex (Two-Sided)**: For Avery 5874 / 5523 student badges, enable two-sided printing and select **Flip on Long Edge**.
