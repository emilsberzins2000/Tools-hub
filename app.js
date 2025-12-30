/* Tools Hub — GitHub Pages / static
 * Big pack of client-side tools:
 * CALCULATORS:
 *  - BMI, BMR/TDEE, Macros, Body Fat (US Navy), Ideal Weight (Devine)
 *  - Loan, Mortgage, Compound Interest, Simple Interest, Savings Goal
 *  - VAT, Tip, Discount, Percentage
 *  - Unit Converter (length/weight/temp), Pace, Age, Date Difference, Work Hours
 *
 * CONVERTERS:
 *  - Image resize, compress, crop (basic center crop), JPG/PNG/WEBP conversion
 *  - Image -> PDF, Merge PDFs, Split/Extract pages, Rotate PDF pages, Reorder pages
 *
 * TEXT/DEV:
 *  - Base64 encode/decode, URL encode/decode
 *  - JSON formatter/minifier
 *  - SHA-256 hash
 *  - Lorem ipsum generator
 *
 * Notes:
 *  - Requires pdf-lib via CDN in index.html.
 */

const $ = (sel) => document.querySelector(sel);

const statusPill = $("#statusPill");
function setStatus(text, tone = "neutral") {
  statusPill.textContent = text;
  statusPill.style.color = tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--warn)" : "var(--muted)";
}

function bytesToHuman(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes, u = 0;
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++; }
  return `${n.toFixed(u === 0 ? 0 : 2)} ${units[u]}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

const tools = [
  // Calculators — Health/Fitness
  { id:"calc-bmi", name:"BMI Calculator", group:"Calculators", badge:"Health" },
  { id:"calc-bmr", name:"BMR / TDEE Calculator", group:"Calculators", badge:"Health" },
  { id:"calc-macros", name:"Macros Calculator", group:"Calculators", badge:"Health" },
  { id:"calc-bodyfat", name:"Body Fat (US Navy)", group:"Calculators", badge:"Health" },
  { id:"calc-ideal", name:"Ideal Weight (Devine)", group:"Calculators", badge:"Health" },

  // Calculators — Finance
  { id:"calc-loan", name:"Loan Payment Calculator", group:"Calculators", badge:"Finance" },
  { id:"calc-mortgage", name:"Mortgage Calculator", group:"Calculators", badge:"Finance" },
  { id:"calc-compound", name:"Compound Interest", group:"Calculators", badge:"Finance" },
  { id:"calc-simple-interest", name:"Simple Interest", group:"Calculators", badge:"Finance" },
  { id:"calc-savings-goal", name:"Savings Goal Planner", group:"Calculators", badge:"Finance" },
  { id:"calc-vat", name:"VAT Calculator", group:"Calculators", badge:"Finance" },
  { id:"calc-tip", name:"Tip Calculator", group:"Calculators", badge:"Finance" },
  { id:"calc-discount", name:"Discount Calculator", group:"Calculators", badge:"Finance" },
  { id:"calc-percent", name:"Percentage Calculator", group:"Calculators", badge:"Math" },

  // Calculators — Time/Utility
  { id:"calc-unit", name:"Unit Converter (Length/Weight/Temp)", group:"Calculators", badge:"Utility" },
  { id:"calc-pace", name:"Running Pace Calculator", group:"Calculators", badge:"Utility" },
  { id:"calc-age", name:"Age Calculator", group:"Calculators", badge:"Utility" },
  { id:"calc-date", name:"Date Difference", group:"Calculators", badge:"Utility" },
  { id:"calc-workhours", name:"Work Hours & Pay", group:"Calculators", badge:"Utility" },

  // Converters — Images
  { id:"conv-img-resize", name:"Image Resizer", group:"Converters", badge:"Images" },
  { id:"conv-img-compress", name:"Image Compressor", group:"Converters", badge:"Images" },
  { id:"conv-img-crop", name:"Image Crop (center)", group:"Converters", badge:"Images" },
  { id:"conv-img-format", name:"Image Format Converter (JPG/PNG/WEBP)", group:"Converters", badge:"Images" },

  // Converters — PDF
  { id:"conv-img-pdf", name:"Image → PDF", group:"Converters", badge:"PDF" },
  { id:"conv-pdf-merge", name:"Merge PDFs", group:"Converters", badge:"PDF" },
  { id:"conv-pdf-extract", name:"Extract PDF Pages", group:"Converters", badge:"PDF" },
  { id:"conv-pdf-rotate", name:"Rotate PDF Pages", group:"Converters", badge:"PDF" },
  { id:"conv-pdf-reorder", name:"Reorder PDF Pages", group:"Converters", badge:"PDF" },

  // Text tools
  { id:"txt-base64", name:"Base64 Encode / Decode", group:"Text Tools", badge:"Text" },
  { id:"txt-url", name:"URL Encode / Decode", group:"Text Tools", badge:"Text" },
  { id:"txt-json", name:"JSON Formatter / Minifier", group:"Text Tools", badge:"Dev" },
  { id:"txt-sha256", name:"SHA-256 Hash", group:"Text Tools", badge:"Dev" },
  { id:"txt-lorem", name:"Lorem Ipsum Generator", group:"Text Tools", badge:"Text" },
].map(t => ({...t, route:`#/tool/${t.id}`}));

function renderToolList(filter = "") {
  const q = filter.trim().toLowerCase();
  const list = tools.filter(t => !q || (t.name + " " + t.group + " " + t.badge).toLowerCase().includes(q));

  const grouped = {};
  for (const t of list) {
    grouped[t.group] = grouped[t.group] || [];
    grouped[t.group].push(t);
  }

  const toolList = $("#toolList");
  toolList.innerHTML = "";

  for (const group of Object.keys(grouped)) {
    const header = document.createElement("div");
    header.className = "small";
    header.style.margin = "8px 6px 2px";
    header.textContent = group.toUpperCase();
    toolList.appendChild(header);

    grouped[group].forEach(t => {
      const div = document.createElement("a");
      div.href = t.route;
      div.className = "tool";
      div.innerHTML = `
        <div>
          <div class="tool__name">${escapeHtml(t.name)}</div>
          <div class="tool__meta">${escapeHtml(t.badge)}</div>
        </div>
        <span class="badge">${escapeHtml(t.badge)}</span>
      `;
      toolList.appendChild(div);
    });
  }
}

function viewTemplate(title, desc, innerHtml) {
  return `
    <div class="card">
      <div class="h1">${escapeHtml(title)}</div>
      <p class="p">${escapeHtml(desc)}</p>
    </div>
    ${innerHtml}
  `;
}

function homeView() {
  const calcCount = tools.filter(t => t.group === "Calculators").length;
  const convCount = tools.filter(t => t.group === "Converters").length;
  const txtCount = tools.filter(t => t.group === "Text Tools").length;

  return viewTemplate(
    "Tools Hub",
    "Client-side calculators, PDF/image converters, and text utilities that run fully in your browser (GitHub Pages compatible).",
    `
    <div class="card">
      <div class="grid">
        <div class="card">
          <div class="h1">Calculators</div>
          <p class="p">${calcCount} tools</p>
          <a class="btn" href="#/calculators">Browse</a>
        </div>
        <div class="card">
          <div class="h1">Converters</div>
          <p class="p">${convCount} tools</p>
          <a class="btn" href="#/converters">Browse</a>
        </div>
        <div class="card">
          <div class="h1">Text Tools</div>
          <p class="p">${txtCount} tools</p>
          <a class="btn" href="#/text-tools">Browse</a>
        </div>
        <div class="card">
          <div class="h1">Monetize</div>
          <p class="p">Add AdSense units in sidebar + inside tool pages.</p>
          <a class="btn secondary" href="#/about">How it works</a>
        </div>
      </div>
      <div class="result small">Tip: Each tool can later become its own SEO page (separate HTML) if you want more Google traffic.</div>
    </div>
    `
  );
}

function listView(group) {
  const items = tools.filter(t => t.group.toLowerCase() === group.toLowerCase());
  const cards = items.map(t => `
    <div class="card">
      <div class="h1">${escapeHtml(t.name)}</div>
      <p class="p">${escapeHtml(t.badge)} tool</p>
      <a class="btn" href="${t.route}">Open</a>
    </div>
  `).join("");

  return viewTemplate(
    group,
    `All ${group.toLowerCase()} available on this site.`,
    `<div class="grid">${cards}</div>`
  );
}

/* -------------------- Shared helpers -------------------- */

async function loadImageFromFile(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
  URL.revokeObjectURL(url);
  return img;
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    if (mime === "image/png") canvas.toBlob(b => resolve(b), mime);
    else canvas.toBlob(b => resolve(b), mime, quality);
  });
}

function parsePageSpec(spec) {
  // "1,2,5-7" => [1,2,5,6,7]
  const out = new Set();
  const parts = spec.split(",").map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (p.includes("-")) {
      const [a,b] = p.split("-").map(x => parseInt(x.trim(), 10));
      if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) throw new Error("Invalid range.");
      const start = Math.min(a,b), end = Math.max(a,b);
      for (let i = start; i <= end; i++) out.add(i);
    } else {
      const n = parseInt(p, 10);
      if (!Number.isFinite(n) || n <= 0) throw new Error("Invalid page number.");
      out.add(n);
    }
  }
  return Array.from(out).sort((x,y)=>x-y);
}

function parseReorderSpec(spec, pageCount) {
  // "3,1,2,2" -> [3,1,2,2] (duplicates allowed)
  const parts = spec.split(",").map(s => s.trim()).filter(Boolean);
  if (!parts.length) throw new Error("Enter a page order, e.g. 3,1,2");
  const order = parts.map(x => parseInt(x, 10));
  for (const n of order) {
    if (!Number.isFinite(n) || n <= 0 || n > pageCount) throw new Error(`Page ${n} out of range (1..${pageCount}).`);
  }
  return order;
}

function formatMoney(n, currency="€"){
  if (!Number.isFinite(n)) return "—";
  return `${currency}${n.toFixed(2)}`;
}

/* -------------------- Views -------------------- */

// CALC: BMI
function viewBMI() {
  return viewTemplate(
    "BMI Calculator",
    "Enter height and weight to calculate BMI.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Height (cm)</div><input id="bmiH" class="input" type="number" value="168" min="50" max="250"/></div>
        <div><div class="label">Weight (kg)</div><input id="bmiW" class="input" type="number" value="61" min="10" max="300"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="bmiBtn">Calculate</button>
        <button class="btn secondary" id="bmiReset">Reset</button>
      </div>
      <div id="bmiOut" class="result"></div>
    </div>`
  );
}

// CALC: BMR/TDEE
function viewBMR() {
  return viewTemplate(
    "BMR / TDEE Calculator",
    "Mifflin–St Jeor estimate. TDEE = BMR × activity factor.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Sex</div>
          <select id="bmrSex" class="input">
            <option value="female" selected>Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div><div class="label">Age</div><input id="bmrAge" class="input" type="number" value="36" min="10" max="100"/></div>
        <div><div class="label">Height (cm)</div><input id="bmrH" class="input" type="number" value="168"/></div>
        <div><div class="label">Weight (kg)</div><input id="bmrW" class="input" type="number" value="61"/></div>
        <div>
          <div class="label">Activity</div>
          <select id="bmrAct" class="input">
            <option value="1.2">Sedentary (1.2)</option>
            <option value="1.375">Light (1.375)</option>
            <option value="1.55" selected>Moderate (1.55)</option>
            <option value="1.725">Very active (1.725)</option>
            <option value="1.9">Athlete (1.9)</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="bmrBtn">Calculate</button>
        <button class="btn secondary" id="bmrReset">Reset</button>
      </div>
      <div id="bmrOut" class="result"></div>
    </div>`
  );
}

// CALC: Macros
function viewMacros() {
  return viewTemplate(
    "Macros Calculator",
    "Set calorie target and macro split (protein/fat/carbs).",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Calories/day</div><input id="macCal" class="input" type="number" value="1800" min="0"/></div>
        <div><div class="label">Protein (g/day)</div><input id="macP" class="input" type="number" value="120" min="0"/></div>
        <div><div class="label">Fat (g/day)</div><input id="macF" class="input" type="number" value="60" min="0"/></div>
        <div><div class="label">Carbs (g/day) (auto)</div><input id="macC" class="input" type="number" value="0" min="0" disabled/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="macBtn">Calculate</button>
        <button class="btn secondary" id="macReset">Reset</button>
      </div>
      <div id="macOut" class="result"></div>
      <div class="small">Protein & Carbs = 4 kcal/g, Fat = 9 kcal/g.</div>
    </div>`
  );
}

// CALC: Body fat (US Navy)
function viewBodyFat() {
  return viewTemplate(
    "Body Fat (US Navy)",
    "Uses circumference measurements (approximate).",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Sex</div>
          <select id="bfSex" class="input">
            <option value="female" selected>Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div><div class="label">Height (cm)</div><input id="bfH" class="input" type="number" value="168"/></div>
        <div><div class="label">Neck (cm)</div><input id="bfNeck" class="input" type="number" value="34"/></div>
        <div><div class="label">Waist (cm)</div><input id="bfWaist" class="input" type="number" value="75"/></div>
        <div id="bfHipWrap">
          <div class="label">Hip (cm) (female)</div><input id="bfHip" class="input" type="number" value="95"/>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="bfBtn">Calculate</button>
      </div>
      <div id="bfOut" class="result"></div>
      <div class="small">Note: This is an estimate and can be off for some body types.</div>
    </div>`
  );
}

// CALC: Ideal weight (Devine)
function viewIdealWeight() {
  return viewTemplate(
    "Ideal Weight (Devine)",
    "Rough reference formula (commonly used clinically).",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Sex</div>
          <select id="iwSex" class="input">
            <option value="female" selected>Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div><div class="label">Height (cm)</div><input id="iwH" class="input" type="number" value="168"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="iwBtn">Calculate</button>
      </div>
      <div id="iwOut" class="result"></div>
    </div>`
  );
}

// Finance: Loan
function viewLoan() {
  return viewTemplate(
    "Loan Payment Calculator",
    "Amortized payment based on principal, APR and term.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Loan amount (€)</div><input id="loanP" class="input" type="number" value="10000"/></div>
        <div><div class="label">APR (%)</div><input id="loanApr" class="input" type="number" value="8.5" step="0.01"/></div>
        <div><div class="label">Term (years)</div><input id="loanY" class="input" type="number" value="3"/></div>
        <div><div class="label">Payments per year</div><input id="loanPPY" class="input" type="number" value="12"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="loanBtn">Calculate</button>
      </div>
      <div id="loanOut" class="result"></div>
    </div>`
  );
}

// Finance: Mortgage
function viewMortgage() {
  return viewTemplate(
    "Mortgage Calculator",
    "Monthly mortgage payment (principal+interest).",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Home price (€)</div><input id="mPrice" class="input" type="number" value="150000"/></div>
        <div><div class="label">Down payment (€)</div><input id="mDown" class="input" type="number" value="30000"/></div>
        <div><div class="label">APR (%)</div><input id="mApr" class="input" type="number" value="4.2" step="0.01"/></div>
        <div><div class="label">Term (years)</div><input id="mYears" class="input" type="number" value="25"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="mBtn">Calculate</button>
      </div>
      <div id="mOut" class="result"></div>
      <div class="small">Taxes/insurance not included (add later as optional fields if you want).</div>
    </div>`
  );
}

// Finance: Compound
function viewCompound() {
  return viewTemplate(
    "Compound Interest",
    "Future value with compounding + optional monthly contribution.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Initial (€)</div><input id="cP" class="input" type="number" value="1000"/></div>
        <div><div class="label">APR (%)</div><input id="cApr" class="input" type="number" value="7" step="0.01"/></div>
        <div><div class="label">Years</div><input id="cY" class="input" type="number" value="10" step="0.1"/></div>
        <div><div class="label">Compounds/year</div><input id="cN" class="input" type="number" value="12"/></div>
        <div><div class="label">Monthly contribution (€)</div><input id="cM" class="input" type="number" value="50"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="cBtn">Calculate</button>
      </div>
      <div id="cOut" class="result"></div>
    </div>`
  );
}

// Finance: Simple interest
function viewSimpleInterest() {
  return viewTemplate(
    "Simple Interest",
    "Interest = Principal × Rate × Time",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Principal (€)</div><input id="siP" class="input" type="number" value="5000"/></div>
        <div><div class="label">Rate (%) / year</div><input id="siR" class="input" type="number" value="5" step="0.01"/></div>
        <div><div class="label">Time (years)</div><input id="siT" class="input" type="number" value="3" step="0.1"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="siBtn">Calculate</button></div>
      <div id="siOut" class="result"></div>
    </div>`
  );
}

// Finance: Savings goal
function viewSavingsGoal() {
  return viewTemplate(
    "Savings Goal Planner",
    "Estimate monthly savings needed to reach a goal.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Goal amount (€)</div><input id="sgGoal" class="input" type="number" value="10000"/></div>
        <div><div class="label">Current saved (€)</div><input id="sgCur" class="input" type="number" value="500"/></div>
        <div><div class="label">Months</div><input id="sgMonths" class="input" type="number" value="18"/></div>
        <div><div class="label">APR (%) (optional)</div><input id="sgApr" class="input" type="number" value="0" step="0.01"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="sgBtn">Calculate</button></div>
      <div id="sgOut" class="result"></div>
    </div>`
  );
}

// VAT
function viewVAT() {
  return viewTemplate(
    "VAT Calculator",
    "Add VAT to net price or extract VAT from gross.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Amount (€)</div><input id="vatAmt" class="input" type="number" value="100"/></div>
        <div><div class="label">VAT rate (%)</div><input id="vatRate" class="input" type="number" value="21" step="0.01"/></div>
        <div>
          <div class="label">Mode</div>
          <select id="vatMode" class="input">
            <option value="add" selected>Add VAT (net → gross)</option>
            <option value="extract">Extract VAT (gross → net)</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="vatBtn">Calculate</button></div>
      <div id="vatOut" class="result"></div>
    </div>`
  );
}

// Tip
function viewTip() {
  return viewTemplate(
    "Tip Calculator",
    "Split bill, include tip %.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Bill (€)</div><input id="tipBill" class="input" type="number" value="50"/></div>
        <div><div class="label">Tip (%)</div><input id="tipPct" class="input" type="number" value="10"/></div>
        <div><div class="label">People</div><input id="tipPeople" class="input" type="number" value="2" min="1"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="tipBtn">Calculate</button></div>
      <div id="tipOut" class="result"></div>
    </div>`
  );
}

// Discount
function viewDiscount() {
  return viewTemplate(
    "Discount Calculator",
    "Calculate final price after discount.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Original price (€)</div><input id="dOrig" class="input" type="number" value="100"/></div>
        <div><div class="label">Discount (%)</div><input id="dPct" class="input" type="number" value="15" step="0.01"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="dBtn">Calculate</button></div>
      <div id="dOut" class="result"></div>
    </div>`
  );
}

// Percentage
function viewPercent() {
  return viewTemplate(
    "Percentage Calculator",
    "Common percentage operations.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">X</div><input id="pX" class="input" type="number" value="25"/></div>
        <div><div class="label">Y</div><input id="pY" class="input" type="number" value="200"/></div>
        <div><div class="label">Increase X by %</div><input id="pIncX" class="input" type="number" value="100"/></div>
        <div><div class="label">%</div><input id="pIncP" class="input" type="number" value="15" step="0.01"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="pBtn">Calculate</button></div>
      <div id="pOut" class="result"></div>
    </div>`
  );
}

// Unit converter
function viewUnit() {
  return viewTemplate(
    "Unit Converter",
    "Length, weight, temperature.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Category</div>
          <select id="uCat" class="input">
            <option value="length" selected>Length</option>
            <option value="weight">Weight</option>
            <option value="temp">Temperature</option>
          </select>
        </div>
        <div><div class="label">Value</div><input id="uVal" class="input" type="number" value="10" step="0.01"/></div>
        <div><div class="label">From</div><select id="uFrom" class="input"></select></div>
        <div><div class="label">To</div><select id="uTo" class="input"></select></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="uBtn">Convert</button>
        <button class="btn secondary" id="uSwap">Swap</button>
      </div>
      <div id="uOut" class="result"></div>
    </div>`
  );
}

// Pace
function viewPace() {
  return viewTemplate(
    "Running Pace Calculator",
    "Calculate pace from distance and time, or time from pace.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Distance (km)</div><input id="paceKm" class="input" type="number" value="5" step="0.01"/></div>
        <div><div class="label">Time (hh:mm:ss)</div><input id="paceTime" class="input" value="00:30:00"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="paceBtn">Calculate Pace</button>
      </div>
      <div id="paceOut" class="result"></div>
    </div>`
  );
}

// Age
function viewAge() {
  return viewTemplate(
    "Age Calculator",
    "Calculate age from birth date.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Birth date</div><input id="ageBirth" class="input" type="date"/></div>
        <div><div class="label">As of</div><input id="ageAsOf" class="input" type="date"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="ageBtn">Calculate</button>
        <button class="btn secondary" id="ageToday">Set today</button>
      </div>
      <div id="ageOut" class="result"></div>
    </div>`
  );
}

// Date diff
function viewDateDiff() {
  return viewTemplate(
    "Date Difference",
    "Calculate days between two dates.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Start date</div><input id="ddA" class="input" type="date"/></div>
        <div><div class="label">End date</div><input id="ddB" class="input" type="date"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="ddBtn">Calculate</button>
        <button class="btn secondary" id="ddPreset">Today + 7 days</button>
      </div>
      <div id="ddOut" class="result"></div>
    </div>`
  );
}

// Work hours
function viewWorkHours() {
  return viewTemplate(
    "Work Hours & Pay",
    "Compute total hours and estimated pay.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Start (HH:MM)</div><input id="whStart" class="input" value="09:00"/></div>
        <div><div class="label">End (HH:MM)</div><input id="whEnd" class="input" value="17:30"/></div>
        <div><div class="label">Break (minutes)</div><input id="whBreak" class="input" type="number" value="30"/></div>
        <div><div class="label">Hourly rate (€)</div><input id="whRate" class="input" type="number" value="10" step="0.01"/></div>
        <div><div class="label">Days</div><input id="whDays" class="input" type="number" value="5"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="whBtn">Calculate</button></div>
      <div id="whOut" class="result"></div>
    </div>`
  );
}

/* ----- Converters ----- */

function viewImgResize() {
  return viewTemplate(
    "Image Resizer",
    "Resize an image and download it (client-side).",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select image</div><input id="irFile" class="input" type="file" accept="image/*"/></div>
        <div>
          <div class="label">Format</div>
          <select id="irFmt" class="input">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>
        <div><div class="label">Width (px)</div><input id="irW" class="input" type="number" value="1200"/></div>
        <div><div class="label">Height (px)</div><input id="irH" class="input" type="number" value="1200"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="irBtn">Resize & Download</button></div>
      <div id="irOut" class="result"></div>
    </div>`
  );
}

function viewImgCompress() {
  return viewTemplate(
    "Image Compressor",
    "Compress by lowering quality (JPEG/WEBP).",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select image</div><input id="icFile" class="input" type="file" accept="image/*"/></div>
        <div><div class="label">Quality (0.1–1.0)</div><input id="icQ" class="input" type="number" value="0.75" min="0.1" max="1" step="0.05"/></div>
        <div>
          <div class="label">Format</div>
          <select id="icFmt" class="input">
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WEBP</option>
            <option value="image/png">PNG (no quality)</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="icBtn">Compress & Download</button></div>
      <div id="icOut" class="result"></div>
    </div>`
  );
}

function viewImgCrop() {
  return viewTemplate(
    "Image Crop (center)",
    "Center-crop to a target aspect ratio.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select image</div><input id="cropFile" class="input" type="file" accept="image/*"/></div>
        <div>
          <div class="label">Aspect ratio</div>
          <select id="cropRatio" class="input">
            <option value="1:1" selected>1:1 (square)</option>
            <option value="4:3">4:3</option>
            <option value="16:9">16:9</option>
            <option value="3:4">3:4 (portrait)</option>
          </select>
        </div>
        <div>
          <div class="label">Output format</div>
          <select id="cropFmt" class="input">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="cropBtn">Crop & Download</button></div>
      <div id="cropOut" class="result"></div>
    </div>`
  );
}

function viewImgFormat() {
  return viewTemplate(
    "Image Format Converter",
    "Convert between JPG/PNG/WEBP in your browser.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select image</div><input id="fmtFile" class="input" type="file" accept="image/*"/></div>
        <div>
          <div class="label">Convert to</div>
          <select id="fmtTo" class="input">
            <option value="image/png">PNG</option>
            <option value="image/jpeg" selected>JPG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>
        <div><div class="label">Quality (JPEG/WEBP)</div><input id="fmtQ" class="input" type="number" value="0.92" min="0.1" max="1" step="0.02"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="fmtBtn">Convert & Download</button></div>
      <div id="fmtOut" class="result"></div>
    </div>`
  );
}

function viewImgToPdf() {
  return viewTemplate(
    "Image → PDF",
    "Combine one or multiple images into a PDF.",
    `
    <div class="card">
      <div><div class="label">Select images</div><input id="ipFiles" class="input" type="file" accept="image/*" multiple/></div>
      <div class="row" style="margin-top:10px"><button class="btn" id="ipBtn">Create PDF & Download</button></div>
      <div id="ipOut" class="result"></div>
    </div>`
  );
}

function viewPdfMerge() {
  return viewTemplate(
    "Merge PDFs",
    "Merge multiple PDFs into one.",
    `
    <div class="card">
      <div><div class="label">Select PDFs (order matters)</div><input id="pmFiles" class="input" type="file" accept="application/pdf" multiple/></div>
      <div class="row" style="margin-top:10px"><button class="btn" id="pmBtn">Merge & Download</button></div>
      <div id="pmOut" class="result"></div>
    </div>`
  );
}

function viewPdfExtract() {
  return viewTemplate(
    "Extract PDF Pages",
    "Extract specific pages into a new PDF (e.g., 1,2,5-7).",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select PDF</div><input id="peFile" class="input" type="file" accept="application/pdf"/></div>
        <div><div class="label">Pages</div><input id="pePages" class="input" placeholder="e.g. 1,2,5-7"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="peBtn">Extract & Download</button></div>
      <div id="peOut" class="result"></div>
    </div>`
  );
}

function viewPdfRotate() {
  return viewTemplate(
    "Rotate PDF Pages",
    "Rotate all pages or only selected pages.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select PDF</div><input id="prFile" class="input" type="file" accept="application/pdf"/></div>
        <div>
          <div class="label">Degrees</div>
          <select id="prDeg" class="input">
            <option value="90">90°</option>
            <option value="180">180°</option>
            <option value="270">270°</option>
          </select>
        </div>
        <div><div class="label">Pages (optional)</div><input id="prPages" class="input" placeholder="blank = all, or 1,2,5-7"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="prBtn">Rotate & Download</button></div>
      <div id="prOut" class="result"></div>
    </div>`
  );
}

function viewPdfReorder() {
  return viewTemplate(
    "Reorder PDF Pages",
    "Create a new PDF with pages in your specified order (e.g., 3,1,2).",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Select PDF</div><input id="poFile" class="input" type="file" accept="application/pdf"/></div>
        <div><div class="label">New order</div><input id="poOrder" class="input" placeholder="e.g. 3,1,2"/></div>
      </div>
      <div class="row" style="margin-top:10px"><button class="btn" id="poBtn">Reorder & Download</button></div>
      <div id="poOut" class="result"></div>
      <div class="small">Duplicates allowed (e.g. 1,1,2 makes page 1 twice).</div>
    </div>`
  );
}

/* ----- Text Tools ----- */

function viewBase64() {
  return viewTemplate(
    "Base64 Encode / Decode",
    "Encode text to Base64 or decode Base64 to text.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Input</div>
          <textarea id="b64In" class="input" placeholder="Type or paste..."></textarea>
        </div>
        <div>
          <div class="label">Output</div>
          <textarea id="b64Out" class="input" placeholder="Result..." readonly></textarea>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="b64Enc">Encode</button>
        <button class="btn secondary" id="b64Dec">Decode</button>
        <button class="btn secondary" id="b64Copy">Copy output</button>
      </div>
    </div>`
  );
}

function viewUrlCodec() {
  return viewTemplate(
    "URL Encode / Decode",
    "Encode or decode URL components.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Input</div>
          <textarea id="urlIn" class="input" placeholder="Type or paste..."></textarea>
        </div>
        <div>
          <div class="label">Output</div>
          <textarea id="urlOut" class="input" placeholder="Result..." readonly></textarea>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="urlEnc">Encode</button>
        <button class="btn secondary" id="urlDec">Decode</button>
        <button class="btn secondary" id="urlCopy">Copy output</button>
      </div>
    </div>`
  );
}

function viewJsonTool() {
  return viewTemplate(
    "JSON Formatter / Minifier",
    "Format JSON nicely or minify it.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">JSON input</div>
          <textarea id="jsonIn" class="input" placeholder='{"hello":"world"}'></textarea>
        </div>
        <div>
          <div class="label">Output</div>
          <textarea id="jsonOut" class="input" readonly></textarea>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="jsonFmt">Format</button>
        <button class="btn secondary" id="jsonMin">Minify</button>
        <button class="btn secondary" id="jsonCopy">Copy output</button>
      </div>
    </div>`
  );
}

function viewSha256() {
  return viewTemplate(
    "SHA-256 Hash",
    "Compute a SHA-256 hash of text (browser crypto).",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Input</div>
          <textarea id="shaIn" class="input" placeholder="Type text..."></textarea>
        </div>
        <div>
          <div class="label">Hash (hex)</div>
          <textarea id="shaOut" class="input" readonly></textarea>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="shaBtn">Hash</button>
        <button class="btn secondary" id="shaCopy">Copy hash</button>
      </div>
    </div>`
  );
}

function viewLorem() {
  return viewTemplate(
    "Lorem Ipsum Generator",
    "Generate placeholder text.",
    `
    <div class="card">
      <div class="grid">
        <div><div class="label">Paragraphs</div><input id="lP" class="input" type="number" value="3" min="1" max="20"/></div>
        <div><div class="label">Sentences per paragraph</div><input id="lS" class="input" type="number" value="5" min="1" max="20"/></div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="lBtn">Generate</button>
        <button class="btn secondary" id="lCopy">Copy</button>
      </div>
      <div id="lOut" class="result"></div>
    </div>`
  );
}

/* -------------------- Handlers -------------------- */

function mountHandlers(toolId) {
  // CALC: BMI
  if (toolId === "calc-bmi") {
    const out = $("#bmiOut");
    const calc = () => {
      const h = parseFloat($("#bmiH").value);
      const w = parseFloat($("#bmiW").value);
      if (!(h > 0 && w > 0)) { out.textContent = "Enter valid values."; return; }
      const m = h / 100;
      const bmi = w / (m*m);
      let cls = "Normal";
      if (bmi < 18.5) cls = "Underweight";
      else if (bmi < 25) cls = "Normal";
      else if (bmi < 30) cls = "Overweight";
      else cls = "Obesity";
      out.textContent = `BMI: ${bmi.toFixed(2)}\nCategory: ${cls}`;
    };
    $("#bmiBtn").onclick = calc;
    $("#bmiReset").onclick = () => { $("#bmiH").value=168; $("#bmiW").value=61; out.textContent=""; };
    calc();
  }

  // CALC: BMR/TDEE
  if (toolId === "calc-bmr") {
    const out = $("#bmrOut");
    const calc = () => {
      const sex = $("#bmrSex").value;
      const age = parseFloat($("#bmrAge").value);
      const h = parseFloat($("#bmrH").value);
      const w = parseFloat($("#bmrW").value);
      const act = parseFloat($("#bmrAct").value);
      if (!(age>0 && h>0 && w>0 && act>0)) { out.textContent="Enter valid values."; return; }
      // Mifflin–St Jeor
      const s = (sex === "male") ? 5 : -161;
      const bmr = 10*w + 6.25*h - 5*age + s;
      const tdee = bmr * act;
      out.textContent = `BMR: ${Math.round(bmr)} kcal/day\nTDEE: ${Math.round(tdee)} kcal/day\nActivity factor: ${act}`;
    };
    $("#bmrBtn").onclick = calc;
    $("#bmrReset").onclick = () => {
      $("#bmrSex").value="female"; $("#bmrAge").value=36; $("#bmrH").value=168; $("#bmrW").value=61; $("#bmrAct").value="1.55";
      out.textContent="";
    };
    calc();
  }

  // CALC: Macros
  if (toolId === "calc-macros") {
    const out = $("#macOut");
    const calc = () => {
      const cal = parseFloat($("#macCal").value);
      const p = parseFloat($("#macP").value);
      const f = parseFloat($("#macF").value);
      if (!(cal>=0 && p>=0 && f>=0)) { out.textContent="Enter valid values."; return; }
      const used = p*4 + f*9;
      const rem = cal - used;
      const c = rem > 0 ? rem/4 : 0;
      $("#macC").value = Math.round(c);
      out.textContent = `Calories: ${cal}\nProtein: ${p}g (${p*4} kcal)\nFat: ${f}g (${f*9} kcal)\nCarbs: ${Math.round(c)}g (${Math.round(c)*4} kcal)\nRemaining kcal for carbs: ${Math.max(0, Math.round(rem))}`;
    };
    $("#macBtn").onclick = calc;
    $("#macReset").onclick = () => { $("#macCal").value=1800; $("#macP").value=120; $("#macF").value=60; $("#macC").value=0; out.textContent=""; };
    calc();
  }

  // CALC: Body fat
  if (toolId === "calc-bodyfat") {
    const out = $("#bfOut");
    const hipWrap = $("#bfHipWrap");
    const updateHip = () => {
      const sex = $("#bfSex").value;
      hipWrap.style.display = (sex === "female") ? "block" : "none";
    };
    const log10 = (x) => Math.log(x) / Math.LN10;

    const calc = () => {
      const sex = $("#bfSex").value;
      const h = parseFloat($("#bfH").value);
      const neck = parseFloat($("#bfNeck").value);
      const waist = parseFloat($("#bfWaist").value);
      const hip = parseFloat($("#bfHip")?.value || "0");

      if (!(h>0 && neck>0 && waist>0)) { out.textContent="Enter valid values."; return; }
      const heightIn = h / 2.54;
      const neckIn = neck / 2.54;
      const waistIn = waist / 2.54;
      const hipIn = hip / 2.54;

      let bf;
      if (sex === "male") {
        // %BF = 86.010*log10(waist-neck) - 70.041*log10(height) + 36.76
        bf = 86.010*log10(waistIn - neckIn) - 70.041*log10(heightIn) + 36.76;
      } else {
        // %BF = 163.205*log10(waist+hip-neck) - 97.684*log10(height) - 78.387
        if (!(hip>0)) { out.textContent="For female, hip is required."; return; }
        bf = 163.205*log10(waistIn + hipIn - neckIn) - 97.684*log10(heightIn) - 78.387;
      }
      bf = clamp(bf, 2, 60);
      out.textContent = `Estimated body fat: ${bf.toFixed(1)}%`;
    };

    $("#bfSex").onchange = () => { updateHip(); };
    $("#bfBtn").onclick = () => { updateHip(); calc(); };
    updateHip(); calc();
  }

  // CALC: Ideal weight (Devine)
  if (toolId === "calc-ideal") {
    const out = $("#iwOut");
    const calc = () => {
      const sex = $("#iwSex").value;
      const h = parseFloat($("#iwH").value);
      if (!(h>0)) { out.textContent="Enter valid height."; return; }
      // Devine uses inches over 5ft: male 50kg + 2.3kg/in; female 45.5kg + 2.3kg/in
      const inches = h / 2.54;
      const inchesOver5ft = Math.max(0, inches - 60);
      const base = (sex === "male") ? 50 : 45.5;
      const ideal = base + 2.3 * inchesOver5ft;
      out.textContent = `Ideal weight (Devine): ${ideal.toFixed(1)} kg`;
    };
    $("#iwBtn").onclick = calc;
    calc();
  }

  // Finance: Loan
  if (toolId === "calc-loan") {
    const out = $("#loanOut");
    const calc = () => {
      const P = parseFloat($("#loanP").value);
      const apr = parseFloat($("#loanApr").value)/100;
      const years = parseFloat($("#loanY").value);
      const ppy = parseInt($("#loanPPY").value,10);
      if (!(P>=0 && apr>=0 && years>=0 && ppy>=1)) { out.textContent="Enter valid values."; return; }
      const n = Math.round(years*ppy);
      if (n===0) { out.textContent=`Payment: €0\nTotal: ${formatMoney(P)}`; return; }
      const r = apr/ppy;
      const payment = (r===0) ? (P/n) : (P * (r*Math.pow(1+r,n)) / (Math.pow(1+r,n)-1));
      const total = payment*n;
      out.textContent = `Payment: ${formatMoney(payment)} per period\nTotal paid: ${formatMoney(total)}\nTotal interest: ${formatMoney(total-P)}\nPayments: ${n}`;
    };
    $("#loanBtn").onclick = calc;
    calc();
  }

  // Finance: Mortgage
  if (toolId === "calc-mortgage") {
    const out = $("#mOut");
    const calc = () => {
      const price = parseFloat($("#mPrice").value);
      const down = parseFloat($("#mDown").value);
      const apr = parseFloat($("#mApr").value)/100;
      const years = parseFloat($("#mYears").value);
      if (!(price>0 && down>=0 && apr>=0 && years>0 && down<price)) { out.textContent="Enter valid values (down < price)."; return; }
      const P = price - down;
      const n = Math.round(years*12);
      const r = apr/12;
      const payment = (r===0) ? (P/n) : (P * (r*Math.pow(1+r,n)) / (Math.pow(1+r,n)-1));
      const total = payment*n;
      out.textContent = `Loan amount: ${formatMoney(P)}\nMonthly payment: ${formatMoney(payment)}\nTotal paid: ${formatMoney(total)}\nTotal interest: ${formatMoney(total-P)}\nMonths: ${n}`;
    };
    $("#mBtn").onclick = calc;
    calc();
  }

  // Finance: Compound
  if (toolId === "calc-compound") {
    const out = $("#cOut");
    const calc = () => {
      const P = parseFloat($("#cP").value);
      const apr = parseFloat($("#cApr").value)/100;
      const years = parseFloat($("#cY").value);
      const n = parseInt($("#cN").value,10);
      const monthly = parseFloat($("#cM").value);
      if (!(P>=0 && apr>=0 && years>=0 && n>=1 && monthly>=0)) { out.textContent="Enter valid values."; return; }
      const periods = Math.round(years*n);
      const r = apr/n;
      let fv = P*Math.pow(1+r, periods);
      // monthly contributions approximated at monthly compounding: treat monthly as n=12 deposits
      // (simple and good enough for a tool hub)
      const mPeriods = Math.round(years*12);
      const mr = apr/12;
      let fvContrib = 0;
      if (mr === 0) fvContrib = monthly*mPeriods;
      else fvContrib = monthly * ((Math.pow(1+mr, mPeriods) - 1) / mr);
      const total = fv + fvContrib;
      out.textContent = `Future value (initial): ${formatMoney(fv)}\nFuture value (monthly contrib): ${formatMoney(fvContrib)}\nEstimated total: ${formatMoney(total)}\nYears: ${years}`;
    };
    $("#cBtn").onclick = calc;
    calc();
  }

  // Finance: Simple interest
  if (toolId === "calc-simple-interest") {
    const out = $("#siOut");
    const calc = () => {
      const P = parseFloat($("#siP").value);
      const r = parseFloat($("#siR").value)/100;
      const t = parseFloat($("#siT").value);
      if (!(P>=0 && r>=0 && t>=0)) { out.textContent="Enter valid values."; return; }
      const interest = P*r*t;
      out.textContent = `Interest: ${formatMoney(interest)}\nTotal: ${formatMoney(P+interest)}\nFormula: P×r×t`;
    };
    $("#siBtn").onclick = calc;
    calc();
  }

  // Finance: Savings goal
  if (toolId === "calc-savings-goal") {
    const out = $("#sgOut");
    const calc = () => {
      const goal = parseFloat($("#sgGoal").value);
      const cur = parseFloat($("#sgCur").value);
      const months = parseInt($("#sgMonths").value,10);
      const apr = parseFloat($("#sgApr").value)/100;
      if (!(goal>0 && cur>=0 && months>0 && apr>=0 && cur<goal)) { out.textContent="Enter valid values (current < goal)."; return; }
      const need = goal - cur;
      // If APR >0, approximate monthly compounding with equal monthly contributions
      const r = apr/12;
      let monthly;
      if (r === 0) monthly = need / months;
      else {
        // FV of annuity: PMT * (( (1+r)^n -1)/r )
        monthly = need / ((Math.pow(1+r, months) - 1) / r);
      }
      out.textContent = `Needed remaining: ${formatMoney(need)}\nMonthly savings: ${formatMoney(monthly)}\nMonths: ${months}\nAPR used: ${(apr*100).toFixed(2)}%`;
    };
    $("#sgBtn").onclick = calc;
    calc();
  }

  // VAT
  if (toolId === "calc-vat") {
    const out = $("#vatOut");
    const calc = () => {
      const amt = parseFloat($("#vatAmt").value);
      const rate = parseFloat($("#vatRate").value)/100;
      const mode = $("#vatMode").value;
      if (!(amt>=0 && rate>=0)) { out.textContent="Enter valid values."; return; }
      if (mode === "add") {
        const vat = amt*rate;
        out.textContent = `Net: ${formatMoney(amt)}\nVAT: ${formatMoney(vat)}\nGross: ${formatMoney(amt+vat)}`;
      } else {
        const net = amt/(1+rate);
        const vat = amt - net;
        out.textContent = `Gross: ${formatMoney(amt)}\nNet: ${formatMoney(net)}\nVAT: ${formatMoney(vat)}`;
      }
    };
    $("#vatBtn").onclick = calc;
    calc();
  }

  // Tip
  if (toolId === "calc-tip") {
    const out = $("#tipOut");
    const calc = () => {
      const bill = parseFloat($("#tipBill").value);
      const pct = parseFloat($("#tipPct").value)/100;
      const people = parseInt($("#tipPeople").value,10);
      if (!(bill>=0 && pct>=0 && people>=1)) { out.textContent="Enter valid values."; return; }
      const tip = bill*pct;
      const total = bill+tip;
      out.textContent = `Tip: ${formatMoney(tip)}\nTotal: ${formatMoney(total)}\nPer person: ${formatMoney(total/people)}`;
    };
    $("#tipBtn").onclick = calc;
    calc();
  }

  // Discount
  if (toolId === "calc-discount") {
    const out = $("#dOut");
    const calc = () => {
      const orig = parseFloat($("#dOrig").value);
      const pct = parseFloat($("#dPct").value)/100;
      if (!(orig>=0 && pct>=0)) { out.textContent="Enter valid values."; return; }
      const save = orig*pct;
      const final = orig-save;
      out.textContent = `Saved: ${formatMoney(save)}\nFinal price: ${formatMoney(final)}`;
    };
    $("#dBtn").onclick = calc;
    calc();
  }

  // Percent
  if (toolId === "calc-percent") {
    const out = $("#pOut");
    const calc = () => {
      const X = parseFloat($("#pX").value);
      const Y = parseFloat($("#pY").value);
      const incX = parseFloat($("#pIncX").value);
      const incP = parseFloat($("#pIncP").value)/100;
      let s = "";
      if (Number.isFinite(X) && Number.isFinite(Y) && Y !== 0) s += `${X} is ${(X/Y*100).toFixed(2)}% of ${Y}\n`;
      else s += "X is what % of Y? (need valid X and non-zero Y)\n";
      if (Number.isFinite(incX) && Number.isFinite(incP)) s += `${incX} increased by ${(incP*100).toFixed(2)}% = ${(incX*(1+incP)).toFixed(2)}\n`;
      out.textContent = s.trim();
    };
    $("#pBtn").onclick = calc;
    calc();
  }

  // Unit converter
  if (toolId === "calc-unit") {
    const units = {
      length: [
        {k:"m", name:"Meters (m)", toBase:v=>v, fromBase:v=>v},
        {k:"km", name:"Kilometers (km)", toBase:v=>v*1000, fromBase:v=>v/1000},
        {k:"cm", name:"Centimeters (cm)", toBase:v=>v/100, fromBase:v=>v*100},
        {k:"mm", name:"Millimeters (mm)", toBase:v=>v/1000, fromBase:v=>v*1000},
        {k:"in", name:"Inches (in)", toBase:v=>v*0.0254, fromBase:v=>v/0.0254},
        {k:"ft", name:"Feet (ft)", toBase:v=>v*0.3048, fromBase:v=>v/0.3048},
        {k:"mi", name:"Miles (mi)", toBase:v=>v*1609.344, fromBase:v=>v/1609.344},
      ],
      weight: [
        {k:"kg", name:"Kilograms (kg)", toBase:v=>v, fromBase:v=>v},
        {k:"g", name:"Grams (g)", toBase:v=>v/1000, fromBase:v=>v*1000},
        {k:"lb", name:"Pounds (lb)", toBase:v=>v*0.45359237, fromBase:v=>v/0.45359237},
        {k:"oz", name:"Ounces (oz)", toBase:v=>v*0.0283495231, fromBase:v=>v/0.0283495231},
      ],
      temp: [
        {k:"c", name:"Celsius (°C)", toBase:v=>v, fromBase:v=>v},
        {k:"f", name:"Fahrenheit (°F)", toBase:v=>(v-32)*(5/9), fromBase:v=>v*(9/5)+32},
        {k:"k", name:"Kelvin (K)", toBase:v=>v-273.15, fromBase:v=>v+273.15},
      ],
    };
    const out = $("#uOut");

    const fillSelect = (sel, arr) => {
      sel.innerHTML = "";
      arr.forEach(u => {
        const o = document.createElement("option");
        o.value = u.k; o.textContent = u.name;
        sel.appendChild(o);
      });
    };

    const catSel = $("#uCat");
    const fromSel = $("#uFrom");
    const toSel = $("#uTo");

    const refresh = () => {
      const cat = catSel.value;
      const arr = units[cat];
      fillSelect(fromSel, arr);
      fillSelect(toSel, arr);
      if (cat === "temp") { fromSel.value="c"; toSel.value="f"; }
      else if (cat === "length") { fromSel.value="m"; toSel.value="ft"; }
      else { fromSel.value="kg"; toSel.value="lb"; }
      out.textContent = "";
    };

    const convert = () => {
      const cat = catSel.value;
      const arr = units[cat];
      const v = parseFloat($("#uVal").value);
      if (!Number.isFinite(v)) { out.textContent="Enter a valid value."; return; }
      const from = arr.find(x=>x.k===fromSel.value);
      const to = arr.find(x=>x.k===toSel.value);
      const base = from.toBase(v);
      const res = to.fromBase(base);
      out.textContent = `${v} ${from.k} = ${res.toFixed(6)} ${to.k}`;
    };

    catSel.onchange = refresh;
    $("#uBtn").onclick = convert;
    $("#uSwap").onclick = () => { const a=fromSel.value; fromSel.value=toSel.value; toSel.value=a; convert(); };

    refresh();
  }

  // Pace
  if (toolId === "calc-pace") {
    const out = $("#paceOut");
    const parseHMS = (s) => {
      const parts = s.trim().split(":").map(x=>x.trim());
      if (parts.length === 2) parts.unshift("0");
      if (parts.length !== 3) throw new Error("Use hh:mm:ss or mm:ss");
      const [h,m,sec] = parts.map(n => parseInt(n,10));
      if (![h,m,sec].every(Number.isFinite)) throw new Error("Invalid time");
      return h*3600 + m*60 + sec;
    };
    const fmtPace = (secondsPerKm) => {
      const m = Math.floor(secondsPerKm/60);
      const s = Math.round(secondsPerKm - m*60);
      return `${m}:${String(s).padStart(2,"0")} /km`;
    };
    const calc = () => {
      const km = parseFloat($("#paceKm").value);
      if (!(km>0)) { out.textContent="Distance must be > 0."; return; }
      try{
        const t = parseHMS($("#paceTime").value);
        const pace = t / km;
        out.textContent = `Pace: ${fmtPace(pace)}\nTotal seconds: ${t}\nDistance: ${km} km`;
      }catch(e){
        out.textContent = `Error: ${e.message}`;
      }
    };
    $("#paceBtn").onclick = calc;
    calc();
  }

  // Age
  if (toolId === "calc-age") {
    const out = $("#ageOut");
    const setToday = () => {
      const now = new Date();
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      $("#ageAsOf").valueAsDate = d;
    };
    const calc = () => {
      const birth = $("#ageBirth").valueAsDate;
      const asOf = $("#ageAsOf").valueAsDate;
      if (!birth || !asOf) { out.textContent="Select both dates."; return; }
      let years = asOf.getFullYear() - birth.getFullYear();
      let months = asOf.getMonth() - birth.getMonth();
      let days = asOf.getDate() - birth.getDate();
      if (days < 0) {
        const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
        days += prevMonth.getDate();
        months -= 1;
      }
      if (months < 0) { months += 12; years -= 1; }
      const diffDays = Math.round((asOf - birth) / (1000*60*60*24));
      out.textContent = `Age: ${years} years, ${months} months, ${days} days\nTotal days: ${diffDays}`;
    };
    $("#ageBtn").onclick = calc;
    $("#ageToday").onclick = () => { setToday(); calc(); };
    // defaults
    setToday();
  }

  // Date diff
  if (toolId === "calc-date") {
    const out = $("#ddOut");
    const preset = () => {
      const now = new Date();
      const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const b = new Date(a); b.setDate(b.getDate()+7);
      $("#ddA").valueAsDate = a;
      $("#ddB").valueAsDate = b;
    };
    const calc = () => {
      const a = $("#ddA").valueAsDate;
      const b = $("#ddB").valueAsDate;
      if (!a || !b) { out.textContent="Select both dates."; return; }
      const days = Math.round((b-a)/(1000*60*60*24));
      out.textContent = `Difference: ${days} day(s)`;
    };
    $("#ddBtn").onclick = calc;
    $("#ddPreset").onclick = () => { preset(); calc(); };
    preset(); calc();
  }

  // Work hours
  if (toolId === "calc-workhours") {
    const out = $("#whOut");
    const parseHM = (s) => {
      const [h,m] = s.split(":").map(x=>parseInt(x,10));
      if (![h,m].every(Number.isFinite)) throw new Error("Invalid time");
      return h*60 + m;
    };
    const calc = () => {
      try{
        const start = parseHM($("#whStart").value);
        const end = parseHM($("#whEnd").value);
        const br = parseFloat($("#whBreak").value);
        const rate = parseFloat($("#whRate").value);
        const days = parseInt($("#whDays").value,10);
        if (!(br>=0 && rate>=0 && days>=1)) { out.textContent="Enter valid values."; return; }
        let mins = end - start - br;
        if (mins < 0) mins += 24*60; // allow overnight shifts
        const hours = mins/60;
        const totalHours = hours*days;
        const pay = totalHours*rate;
        out.textContent = `Hours/day: ${hours.toFixed(2)}\nTotal hours: ${totalHours.toFixed(2)}\nEstimated pay: ${formatMoney(pay)}`;
      }catch(e){
        out.textContent = `Error: ${e.message}`;
      }
    };
    $("#whBtn").onclick = calc;
    calc();
  }

  // Converters: Image resize
  if (toolId === "conv-img-resize") {
    const out = $("#irOut");
    $("#irBtn").onclick = async () => {
      const file = $("#irFile").files?.[0];
      const w = parseInt($("#irW").value,10);
      const h = parseInt($("#irH").value,10);
      const fmt = $("#irFmt").value;
      if (!file) { out.textContent="Select an image first."; return; }
      if (!(w>0 && h>0)) { out.textContent="Enter valid width/height."; return; }

      setStatus("Resizing…","warn");
      try{
        const img = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        const blob = await canvasToBlob(canvas, fmt, 0.92);
        const ext = fmt.includes("png") ? "png" : fmt.includes("webp") ? "webp" : "jpg";
        downloadBlob(blob, `resized.${ext}`);
        out.textContent = `Input: ${bytesToHuman(file.size)}\nOutput: ${bytesToHuman(blob.size)}\nSize: ${w}×${h}px`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Image compress
  if (toolId === "conv-img-compress") {
    const out = $("#icOut");
    $("#icBtn").onclick = async () => {
      const file = $("#icFile").files?.[0];
      const q = parseFloat($("#icQ").value);
      const fmt = $("#icFmt").value;
      if (!file) { out.textContent="Select an image first."; return; }

      setStatus("Compressing…","warn");
      try{
        const img = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img,0,0);
        const blob = await canvasToBlob(canvas, fmt, q);
        const ext = fmt.includes("png") ? "png" : fmt.includes("webp") ? "webp" : "jpg";
        downloadBlob(blob, `compressed.${ext}`);
        out.textContent = `Input: ${bytesToHuman(file.size)}\nOutput: ${bytesToHuman(blob.size)}\nQuality: ${fmt==="image/png"?"N/A":q}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Image crop center
  if (toolId === "conv-img-crop") {
    const out = $("#cropOut");
    $("#cropBtn").onclick = async () => {
      const file = $("#cropFile").files?.[0];
      if (!file) { out.textContent="Select an image first."; return; }
      const ratioStr = $("#cropRatio").value;
      const fmt = $("#cropFmt").value;
      const [rw,rh] = ratioStr.split(":").map(n=>parseFloat(n));
      if (!(rw>0 && rh>0)) { out.textContent="Invalid ratio."; return; }

      setStatus("Cropping…","warn");
      try{
        const img = await loadImageFromFile(file);
        const target = rw/rh;
        const src = img.width/img.height;

        let sx=0, sy=0, sw=img.width, sh=img.height;
        if (src > target) { // too wide
          sw = Math.round(img.height*target);
          sx = Math.round((img.width - sw)/2);
        } else { // too tall
          sh = Math.round(img.width/target);
          sy = Math.round((img.height - sh)/2);
        }

        const canvas = document.createElement("canvas");
        canvas.width = sw; canvas.height = sh;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

        const blob = await canvasToBlob(canvas, fmt, 0.92);
        const ext = fmt.includes("png") ? "png" : fmt.includes("webp") ? "webp" : "jpg";
        downloadBlob(blob, `cropped_${ratioStr.replace(":","x")}.${ext}`);
        out.textContent = `Crop: ${ratioStr}\nOutput size: ${sw}×${sh}px\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Image format
  if (toolId === "conv-img-format") {
    const out = $("#fmtOut");
    $("#fmtBtn").onclick = async () => {
      const file = $("#fmtFile").files?.[0];
      if (!file) { out.textContent="Select an image first."; return; }
      const to = $("#fmtTo").value;
      const q = parseFloat($("#fmtQ").value);
      setStatus("Converting…","warn");
      try{
        const img = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img,0,0);
        const blob = await canvasToBlob(canvas, to, q);
        const ext = to.includes("png") ? "png" : to.includes("webp") ? "webp" : "jpg";
        downloadBlob(blob, `converted.${ext}`);
        out.textContent = `Input: ${bytesToHuman(file.size)}\nOutput: ${bytesToHuman(blob.size)}\nTo: ${ext.toUpperCase()}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Image -> PDF
  if (toolId === "conv-img-pdf") {
    const out = $("#ipOut");
    $("#ipBtn").onclick = async () => {
      const files = Array.from($("#ipFiles").files || []);
      if (!files.length) { out.textContent="Select images first."; return; }
      setStatus("Building PDF…","warn");
      try{
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const isPng = file.type === "image/png";
          const img = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, {x:0,y:0,width:img.width,height:img.height});
        }
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], {type:"application/pdf"});
        downloadBlob(blob, "images.pdf");
        out.textContent = `Images: ${files.length}\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Merge PDFs
  if (toolId === "conv-pdf-merge") {
    const out = $("#pmOut");
    $("#pmBtn").onclick = async () => {
      const files = Array.from($("#pmFiles").files || []);
      if (files.length < 2) { out.textContent="Select at least 2 PDFs."; return; }
      setStatus("Merging…","warn");
      try{
        const { PDFDocument } = PDFLib;
        const merged = await PDFDocument.create();
        let pagesTotal = 0;
        for (const f of files) {
          const doc = await PDFDocument.load(await f.arrayBuffer());
          const pages = await merged.copyPages(doc, doc.getPageIndices());
          pages.forEach(p => merged.addPage(p));
          pagesTotal += pages.length;
        }
        const outBytes = await merged.save();
        const blob = new Blob([outBytes], {type:"application/pdf"});
        downloadBlob(blob, "merged.pdf");
        out.textContent = `Files: ${files.length}\nPages: ${pagesTotal}\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Extract pages
  if (toolId === "conv-pdf-extract") {
    const out = $("#peOut");
    $("#peBtn").onclick = async () => {
      const file = $("#peFile").files?.[0];
      const spec = ($("#pePages").value || "").trim();
      if (!file) { out.textContent="Select a PDF."; return; }
      if (!spec) { out.textContent="Enter pages e.g. 1,2,5-7"; return; }
      setStatus("Extracting…","warn");
      try{
        const pagesWanted = parsePageSpec(spec);
        const { PDFDocument } = PDFLib;
        const src = await PDFDocument.load(await file.arrayBuffer());
        const pageCount = src.getPageCount();
        for (const p of pagesWanted) if (p > pageCount) throw new Error(`Page ${p} out of range (1..${pageCount}).`);

        const outDoc = await PDFDocument.create();
        const indices = pagesWanted.map(p=>p-1);
        const pages = await outDoc.copyPages(src, indices);
        pages.forEach(pg => outDoc.addPage(pg));

        const bytes = await outDoc.save();
        const blob = new Blob([bytes], {type:"application/pdf"});
        downloadBlob(blob, "extracted.pdf");
        out.textContent = `Selected: ${pagesWanted.join(", ")}\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Rotate pages
  if (toolId === "conv-pdf-rotate") {
    const out = $("#prOut");
    $("#prBtn").onclick = async () => {
      const file = $("#prFile").files?.[0];
      const deg = parseInt($("#prDeg").value,10);
      const spec = ($("#prPages").value || "").trim();
      if (!file) { out.textContent="Select a PDF."; return; }
      setStatus("Rotating…","warn");
      try{
        const { PDFDocument, degrees } = PDFLib;
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const pageCount = doc.getPageCount();
        let targets;
        if (!spec) targets = Array.from({length:pageCount}, (_,i)=>i+1);
        else targets = parsePageSpec(spec);

        for (const p of targets) if (p>pageCount) throw new Error(`Page ${p} out of range (1..${pageCount}).`);
        for (const p of targets) {
          const page = doc.getPage(p-1);
          const current = page.getRotation().angle || 0;
          page.setRotation(degrees((current + deg) % 360));
        }
        const bytes = await doc.save();
        const blob = new Blob([bytes], {type:"application/pdf"});
        downloadBlob(blob, "rotated.pdf");
        out.textContent = `Rotated pages: ${targets.length} of ${pageCount}\nDegrees: ${deg}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Converters: Reorder pages
  if (toolId === "conv-pdf-reorder") {
    const out = $("#poOut");
    $("#poBtn").onclick = async () => {
      const file = $("#poFile").files?.[0];
      const spec = ($("#poOrder").value || "").trim();
      if (!file) { out.textContent="Select a PDF."; return; }
      if (!spec) { out.textContent="Enter new order e.g. 3,1,2"; return; }
      setStatus("Reordering…","warn");
      try{
        const { PDFDocument } = PDFLib;
        const src = await PDFDocument.load(await file.arrayBuffer());
        const pageCount = src.getPageCount();
        const order = parseReorderSpec(spec, pageCount);
        const outDoc = await PDFDocument.create();
        const indices = order.map(n=>n-1);
        const pages = await outDoc.copyPages(src, indices);
        pages.forEach(p => outDoc.addPage(p));
        const bytes = await outDoc.save();
        const blob = new Blob([bytes], {type:"application/pdf"});
        downloadBlob(blob, "reordered.pdf");
        out.textContent = `Order: ${order.join(", ")}\nPages out: ${order.length}`;
        setStatus("Done","ok");
      }catch(e){
        out.textContent = `Error: ${e.message || e}`;
        setStatus("Error","warn");
      }
    };
  }

  // Text: Base64
  if (toolId === "txt-base64") {
    const inEl = $("#b64In"), outEl = $("#b64Out");
    $("#b64Enc").onclick = () => { outEl.value = btoa(unescape(encodeURIComponent(inEl.value))); };
    $("#b64Dec").onclick = () => {
      try { outEl.value = decodeURIComponent(escape(atob(inEl.value.trim()))); }
      catch { outEl.value = "Invalid Base64 input."; }
    };
    $("#b64Copy").onclick = async () => { await navigator.clipboard.writeText(outEl.value); setStatus("Copied","ok"); };
  }

  // Text: URL
  if (toolId === "txt-url") {
    const inEl = $("#urlIn"), outEl = $("#urlOut");
    $("#urlEnc").onclick = () => { outEl.value = encodeURIComponent(inEl.value); };
    $("#urlDec").onclick = () => { try{ outEl.value = decodeURIComponent(inEl.value); } catch { outEl.value="Invalid encoded input."; } };
    $("#urlCopy").onclick = async () => { await navigator.clipboard.writeText(outEl.value); setStatus("Copied","ok"); };
  }

  // Text: JSON
  if (toolId === "txt-json") {
    const inEl = $("#jsonIn"), outEl = $("#jsonOut");
    $("#jsonFmt").onclick = () => {
      try { outEl.value = JSON.stringify(JSON.parse(inEl.value), null, 2); }
      catch { outEl.value = "Invalid JSON."; }
    };
    $("#jsonMin").onclick = () => {
      try { outEl.value = JSON.stringify(JSON.parse(inEl.value)); }
      catch { outEl.value = "Invalid JSON."; }
    };
    $("#jsonCopy").onclick = async () => { await navigator.clipboard.writeText(outEl.value); setStatus("Copied","ok"); };
  }

  // Text: SHA-256
  if (toolId === "txt-sha256") {
    const inEl = $("#shaIn"), outEl = $("#shaOut");
    $("#shaBtn").onclick = async () => {
      const data = new TextEncoder().encode(inEl.value);
      const hash = await crypto.subtle.digest("SHA-256", data);
      const hex = Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
      outEl.value = hex;
    };
    $("#shaCopy").onclick = async () => { await navigator.clipboard.writeText(outEl.value); setStatus("Copied","ok"); };
  }

  // Text: Lorem
  if (toolId === "txt-lorem") {
    const out = $("#lOut");
    const base = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ];
    const gen = (p, s) => {
      const paras = [];
      for (let i=0;i<p;i++){
        const sentences = [];
        for (let j=0;j<s;j++){
          sentences.push(base[(i+j)%base.length]);
        }
        paras.push(sentences.join(" "));
      }
      return paras.join("\n\n");
    };
    $("#lBtn").onclick = () => {
      const p = clamp(parseInt($("#lP").value,10)||1, 1, 50);
      const s = clamp(parseInt($("#lS").value,10)||5, 1, 50);
      out.textContent = gen(p,s);
    };
    $("#lCopy").onclick = async () => { await navigator.clipboard.writeText(out.textContent); setStatus("Copied","ok"); };
    $("#lBtn").click();
  }
}

/* -------------------- Router -------------------- */

function render(route) {
  const view = $("#view");
  setStatus("Ready");

  if (route === "#/" || route === "" || route === "#/home") { view.innerHTML = homeView(); return; }
  if (route === "#/calculators") { view.innerHTML = listView("Calculators"); return; }
  if (route === "#/converters") { view.innerHTML = listView("Converters"); return; }
  if (route === "#/text-tools") { view.innerHTML = listView("Text Tools"); return; }

  if (route === "#/about") {
    view.innerHTML = viewTemplate(
      "About",
      "This site is static and works on GitHub Pages. Tools run fully in your browser.",
      `<div class="card">
        <p class="p">To monetize: apply for AdSense, then place ad units in the sidebar and inside tool pages.</p>
        <p class="p">To grow traffic: create SEO pages for your best tools (separate HTML pages), link them from the homepage, and submit a sitemap.</p>
      </div>`
    );
    return;
  }

  if (route === "#/privacy") {
    view.innerHTML = viewTemplate(
      "Privacy",
      "Client-side processing only (no uploads).",
      `<div class="card">
        <p class="p">Files are processed locally in your browser. This site does not upload your files to a server.</p>
        <p class="p">If you add ads/analytics, those providers may collect standard usage data per their policies.</p>
      </div>`
    );
    return;
  }

  const toolMatch = route.match(/^#\/tool\/(.+)$/);
  if (toolMatch) {
    const toolId = toolMatch[1];
    if (!tools.find(t => t.id === toolId)) {
      view.innerHTML = viewTemplate("Not found", "Tool not found.", `<div class="card"><a class="btn" href="#/home">Back home</a></div>`);
      return;
    }

    let html = "";
    switch (toolId) {
      // calculators
      case "calc-bmi": html = viewBMI(); break;
      case "calc-bmr": html = viewBMR(); break;
      case "calc-macros": html = viewMacros(); break;
      case "calc-bodyfat": html = viewBodyFat(); break;
      case "calc-ideal": html = viewIdealWeight(); break;

      case "calc-loan": html = viewLoan(); break;
      case "calc-mortgage": html = viewMortgage(); break;
      case "calc-compound": html = viewCompound(); break;
      case "calc-simple-interest": html = viewSimpleInterest(); break;
      case "calc-savings-goal": html = viewSavingsGoal(); break;
      case "calc-vat": html = viewVAT(); break;
      case "calc-tip": html = viewTip(); break;
      case "calc-discount": html = viewDiscount(); break;
      case "calc-percent": html = viewPercent(); break;

      case "calc-unit": html = viewUnit(); break;
      case "calc-pace": html = viewPace(); break;
      case "calc-age": html = viewAge(); break;
      case "calc-date": html = viewDateDiff(); break;
      case "calc-workhours": html = viewWorkHours(); break;

      // converters
      case "conv-img-resize": html = viewImgResize(); break;
      case "conv-img-compress": html = viewImgCompress(); break;
      case "conv-img-crop": html = viewImgCrop(); break;
      case "conv-img-format": html = viewImgFormat(); break;

      case "conv-img-pdf": html = viewImgToPdf(); break;
      case "conv-pdf-merge": html = viewPdfMerge(); break;
      case "conv-pdf-extract": html = viewPdfExtract(); break;
      case "conv-pdf-rotate": html = viewPdfRotate(); break;
      case "conv-pdf-reorder": html = viewPdfReorder(); break;

      // text tools
      case "txt-base64": html = viewBase64(); break;
      case "txt-url": html = viewUrlCodec(); break;
      case "txt-json": html = viewJsonTool(); break;
      case "txt-sha256": html = viewSha256(); break;
      case "txt-lorem": html = viewLorem(); break;

      default:
        html = viewTemplate("Not implemented", "This tool isn't implemented yet.", `<div class="card"></div>`);
    }

    view.innerHTML = html;
    mountHandlers(toolId);
    return;
  }

  view.innerHTML = viewTemplate("Not found", "Page not found.", `<div class="card"><a class="btn" href="#/home">Back home</a></div>`);
}

function boot() {
  renderToolList("");
  const search = $("#search");
  search.addEventListener("input", () => renderToolList(search.value));
  window.addEventListener("hashchange", () => render(location.hash));
  if (!location.hash) location.hash = "#/home";
  render(location.hash);
}

boot();
