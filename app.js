/* Tools Hub (GitHub Pages / static)
 * Includes:
 *  - Calculators: BMI, Loan, Date Diff, Percentage
 *  - Converters: Image Resize, Image Compress, JPG<->PNG, Image->PDF, Merge PDFs, Split PDF
 * Requires:
 *  - pdf-lib script tag in index.html
 */

const $ = (sel) => document.querySelector(sel);

const statusPill = $("#statusPill");
function setStatus(text, tone = "neutral") {
  statusPill.textContent = text;
  statusPill.style.color = tone === "ok" ? "var(--ok)" : tone === "warn" ? "var(--warn)" : "var(--muted)";
}

function bytesToHuman(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) { n /= 1024; u++; }
  return `${n.toFixed(u === 0 ? 0 : 2)} ${units[u]}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}

const tools = [
  // Calculators
  { id:"calc-bmi", name:"BMI Calculator", group:"Calculators", badge:"Health", route:"#/tool/calc-bmi" },
  { id:"calc-loan", name:"Loan Payment Calculator", group:"Calculators", badge:"Finance", route:"#/tool/calc-loan" },
  { id:"calc-date", name:"Date Difference", group:"Calculators", badge:"Productivity", route:"#/tool/calc-date" },
  { id:"calc-percent", name:"Percentage Calculator", group:"Calculators", badge:"Math", route:"#/tool/calc-percent" },

  // Converters
  { id:"conv-img-resize", name:"Image Resizer", group:"Converters", badge:"Images", route:"#/tool/conv-img-resize" },
  { id:"conv-img-compress", name:"Image Compressor", group:"Converters", badge:"Images", route:"#/tool/conv-img-compress" },
  { id:"conv-jpg-png", name:"JPG ↔ PNG Converter", group:"Converters", badge:"Images", route:"#/tool/conv-jpg-png" },
  { id:"conv-img-pdf", name:"Image → PDF", group:"Converters", badge:"PDF", route:"#/tool/conv-img-pdf" },
  { id:"conv-pdf-merge", name:"Merge PDFs", group:"Converters", badge:"PDF", route:"#/tool/conv-pdf-merge" },
  { id:"conv-pdf-split", name:"Split PDF (pages)", group:"Converters", badge:"PDF", route:"#/tool/conv-pdf-split" },
];

function renderToolList(filter = "") {
  const q = filter.trim().toLowerCase();
  const list = tools.filter(t => {
    if (!q) return true;
    return (t.name + " " + t.group + " " + t.badge).toLowerCase().includes(q);
  });

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

  return viewTemplate(
    "Tools Hub",
    "Free calculators and client-side converters that work on GitHub Pages. No files are uploaded to a server.",
    `
    <div class="card">
      <div class="grid">
        <div class="card">
          <div class="h1">Calculators</div>
          <p class="p">${calcCount} tools. Finance, health, math, productivity.</p>
          <a class="btn" href="#/calculators">Browse calculators</a>
        </div>
        <div class="card">
          <div class="h1">Converters</div>
          <p class="p">${convCount} tools. Images + PDFs (merge/split). All in-browser.</p>
          <a class="btn" href="#/converters">Browse converters</a>
        </div>
      </div>
      <div class="result small">Tip: add more tools as new routes + tool cards. This structure is ready for SEO pages later.</div>
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

/* -------------------- Calculators -------------------- */

function calcBMIView() {
  return viewTemplate(
    "BMI Calculator",
    "Enter height and weight to calculate BMI.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Height (cm)</div>
          <input id="bmiHeight" class="input" type="number" min="50" max="250" value="168" />
        </div>
        <div>
          <div class="label">Weight (kg)</div>
          <input id="bmiWeight" class="input" type="number" min="10" max="300" value="61" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="bmiBtn">Calculate</button>
        <button class="btn secondary" id="bmiReset">Reset</button>
      </div>
      <div id="bmiOut" class="result"></div>
      <div class="small">BMI is a rough indicator; it doesn’t measure body composition.</div>
    </div>
    `
  );
}

function calcLoanView() {
  return viewTemplate(
    "Loan Payment Calculator",
    "Calculate monthly payment using principal, interest rate, and term.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Loan amount (€)</div>
          <input id="loanAmount" class="input" type="number" min="0" step="100" value="10000" />
        </div>
        <div>
          <div class="label">APR (%)</div>
          <input id="loanApr" class="input" type="number" min="0" step="0.01" value="8.5" />
        </div>
        <div>
          <div class="label">Term (years)</div>
          <input id="loanYears" class="input" type="number" min="0" step="1" value="3" />
        </div>
        <div>
          <div class="label">Payments per year</div>
          <input id="loanPpy" class="input" type="number" min="1" step="1" value="12" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="loanBtn">Calculate</button>
        <button class="btn secondary" id="loanReset">Reset</button>
      </div>
      <div id="loanOut" class="result"></div>
      <div class="small">Formula: standard amortized payment.</div>
    </div>
    `
  );
}

function calcDateDiffView() {
  return viewTemplate(
    "Date Difference",
    "Calculate number of days between two dates.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Start date</div>
          <input id="dateA" class="input" type="date" />
        </div>
        <div>
          <div class="label">End date</div>
          <input id="dateB" class="input" type="date" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="dateBtn">Calculate</button>
        <button class="btn secondary" id="dateToday">Set today + 7 days</button>
      </div>
      <div id="dateOut" class="result"></div>
    </div>
    `
  );
}

function calcPercentView() {
  return viewTemplate(
    "Percentage Calculator",
    "Quick percentage operations.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">X is what % of Y?</div>
          <input id="pX" class="input" type="number" value="25" />
        </div>
        <div>
          <div class="label">Y</div>
          <input id="pY" class="input" type="number" value="200" />
        </div>
        <div>
          <div class="label">Increase X by %</div>
          <input id="pIncX" class="input" type="number" value="100" />
        </div>
        <div>
          <div class="label">%</div>
          <input id="pIncP" class="input" type="number" value="15" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="percentBtn">Calculate</button>
        <button class="btn secondary" id="percentReset">Reset</button>
      </div>
      <div id="percentOut" class="result"></div>
    </div>
    `
  );
}

/* -------------------- Converters (Client-side) -------------------- */

function convImageResizeView() {
  return viewTemplate(
    "Image Resizer",
    "Resize images in your browser. No uploads.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Select image</div>
          <input id="resizeFile" class="input" type="file" accept="image/*" />
        </div>
        <div>
          <div class="label">Output format</div>
          <select id="resizeFmt" class="input">
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>
        <div>
          <div class="label">Width (px)</div>
          <input id="resizeW" class="input" type="number" min="1" value="1200" />
        </div>
        <div>
          <div class="label">Height (px)</div>
          <input id="resizeH" class="input" type="number" min="1" value="1200" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="resizeBtn">Resize & Download</button>
      </div>
      <div id="resizeOut" class="result"></div>
    </div>
    `
  );
}

function convImageCompressView() {
  return viewTemplate(
    "Image Compressor",
    "Compress JPEG/WEBP by lowering quality (client-side).",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Select image</div>
          <input id="compressFile" class="input" type="file" accept="image/*" />
        </div>
        <div>
          <div class="label">Quality (0.1–1.0)</div>
          <input id="compressQ" class="input" type="number" min="0.1" max="1" step="0.05" value="0.75" />
        </div>
        <div>
          <div class="label">Output format</div>
          <select id="compressFmt" class="input">
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WEBP</option>
            <option value="image/png">PNG (no quality)</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="compressBtn">Compress & Download</button>
      </div>
      <div id="compressOut" class="result"></div>
    </div>
    `
  );
}

function convJpgPngView() {
  return viewTemplate(
    "JPG ↔ PNG Converter",
    "Convert images in your browser using Canvas.",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Select image</div>
          <input id="jpFile" class="input" type="file" accept="image/*" />
        </div>
        <div>
          <div class="label">Convert to</div>
          <select id="jpTo" class="input">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
          </select>
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="jpBtn">Convert & Download</button>
      </div>
      <div id="jpOut" class="result"></div>
    </div>
    `
  );
}

function convImageToPdfView() {
  return viewTemplate(
    "Image → PDF",
    "Combine one or multiple images into a PDF (client-side).",
    `
    <div class="card">
      <div>
        <div class="label">Select images</div>
        <input id="imgPdfFiles" class="input" type="file" accept="image/*" multiple />
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="imgPdfBtn">Create PDF & Download</button>
      </div>
      <div id="imgPdfOut" class="result"></div>
      <div class="small">Tip: use JPG images for smaller PDFs.</div>
    </div>
    `
  );
}

function convPdfMergeView() {
  return viewTemplate(
    "Merge PDFs",
    "Merge multiple PDFs into one (client-side).",
    `
    <div class="card">
      <div>
        <div class="label">Select PDFs (in merge order)</div>
        <input id="mergePdfs" class="input" type="file" accept="application/pdf" multiple />
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="mergeBtn">Merge & Download</button>
      </div>
      <div id="mergeOut" class="result"></div>
    </div>
    `
  );
}

function convPdfSplitView() {
  return viewTemplate(
    "Split PDF (pages)",
    "Extract specific pages from a PDF. Example: 1,2,5-7",
    `
    <div class="card">
      <div class="grid">
        <div>
          <div class="label">Select PDF</div>
          <input id="splitPdf" class="input" type="file" accept="application/pdf" />
        </div>
        <div>
          <div class="label">Pages</div>
          <input id="splitPages" class="input" placeholder="e.g., 1,2,5-7" />
        </div>
      </div>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="splitBtn">Split & Download</button>
      </div>
      <div id="splitOut" class="result"></div>
      <div class="small">Pages are 1-based (first page is 1).</div>
    </div>
    `
  );
}

/* -------------------- Tool Logic -------------------- */

async function loadImageFromFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await new Promise((res, rej) => { img.onload = () => res(); img.onerror = rej; });
    return img;
  } finally {
    // URL is revoked after draw in conversion functions if needed
  }
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    if (mime === "image/png") {
      canvas.toBlob(b => resolve(b), mime);
    } else {
      canvas.toBlob(b => resolve(b), mime, quality);
    }
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

function mountHandlers(toolId) {
  // CALC: BMI
  if (toolId === "calc-bmi") {
    const out = $("#bmiOut");
    const calc = () => {
      const h = parseFloat($("#bmiHeight").value);
      const w = parseFloat($("#bmiWeight").value);
      if (!h || !w) { out.textContent = "Enter valid height and weight."; return; }
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
    $("#bmiReset").onclick = () => { $("#bmiHeight").value = 168; $("#bmiWeight").value = 61; out.textContent=""; };
    calc();
  }

  // CALC: Loan
  if (toolId === "calc-loan") {
    const out = $("#loanOut");
    const calc = () => {
      const P = parseFloat($("#loanAmount").value);
      const apr = parseFloat($("#loanApr").value) / 100;
      const years = parseFloat($("#loanYears").value);
      const ppy = parseInt($("#loanPpy").value, 10);

      if (!(P >= 0) || !(apr >= 0) || !(years >= 0) || !(ppy >= 1)) {
        out.textContent = "Enter valid values.";
        return;
      }

      const n = Math.round(years * ppy);
      if (n === 0) { out.textContent = `No term. Total: €${P.toFixed(2)}`; return; }

      const r = apr / ppy;
      let payment;
      if (r === 0) {
        payment = P / n;
      } else {
        payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      const total = payment * n;
      const interest = total - P;

      out.textContent =
        `Payment: €${payment.toFixed(2)} per period\n` +
        `Total paid: €${total.toFixed(2)}\n` +
        `Total interest: €${interest.toFixed(2)}\n` +
        `Payments: ${n}`;
    };

    $("#loanBtn").onclick = calc;
    $("#loanReset").onclick = () => {
      $("#loanAmount").value = 10000;
      $("#loanApr").value = 8.5;
      $("#loanYears").value = 3;
      $("#loanPpy").value = 12;
      out.textContent = "";
    };
    calc();
  }

  // CALC: Date diff
  if (toolId === "calc-date") {
    const out = $("#dateOut");
    const todayBtn = $("#dateToday");
    const calcBtn = $("#dateBtn");
    const setDefault = () => {
      const now = new Date();
      const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const b = new Date(a); b.setDate(b.getDate() + 7);
      $("#dateA").valueAsDate = a;
      $("#dateB").valueAsDate = b;
    };
    const calc = () => {
      const a = $("#dateA").valueAsDate;
      const b = $("#dateB").valueAsDate;
      if (!a || !b) { out.textContent = "Pick both dates."; return; }
      const ms = b.getTime() - a.getTime();
      const days = Math.round(ms / (1000*60*60*24));
      out.textContent = `Difference: ${days} day(s)`;
    };
    todayBtn.onclick = () => { setDefault(); calc(); };
    calcBtn.onclick = calc;
    setDefault();
    calc();
  }

  // CALC: Percentage
  if (toolId === "calc-percent") {
    const out = $("#percentOut");
    const calc = () => {
      const X = parseFloat($("#pX").value);
      const Y = parseFloat($("#pY").value);
      const incX = parseFloat($("#pIncX").value);
      const incP = parseFloat($("#pIncP").value) / 100;

      let s = "";
      if (Number.isFinite(X) && Number.isFinite(Y) && Y !== 0) {
        s += `${X} is ${(X / Y * 100).toFixed(2)}% of ${Y}\n`;
      } else {
        s += "X is what % of Y? (need valid X and non-zero Y)\n";
      }

      if (Number.isFinite(incX) && Number.isFinite(incP)) {
        const newVal = incX * (1 + incP);
        s += `${incX} increased by ${(incP*100).toFixed(2)}% = ${newVal.toFixed(2)}\n`;
      }
      out.textContent = s.trim();
    };

    $("#percentBtn").onclick = calc;
    $("#percentReset").onclick = () => {
      $("#pX").value = 25;
      $("#pY").value = 200;
      $("#pIncX").value = 100;
      $("#pIncP").value = 15;
      out.textContent = "";
    };
    calc();
  }

  // CONV: Resize
  if (toolId === "conv-img-resize") {
    const out = $("#resizeOut");
    $("#resizeBtn").onclick = async () => {
      const file = $("#resizeFile").files?.[0];
      if (!file) { out.textContent = "Select an image first."; return; }

      const w = parseInt($("#resizeW").value, 10);
      const h = parseInt($("#resizeH").value, 10);
      const fmt = $("#resizeFmt").value;

      if (!(w > 0 && h > 0)) { out.textContent = "Enter valid width & height."; return; }

      setStatus("Resizing…", "warn");
      try {
        const img = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        const blob = await canvasToBlob(canvas, fmt, 0.92);
        const ext = fmt.includes("png") ? "png" : fmt.includes("webp") ? "webp" : "jpg";
        downloadBlob(blob, `resized.${ext}`);

        out.textContent = `Input: ${bytesToHuman(file.size)}\nOutput: ${bytesToHuman(blob.size)}\nSize: ${w}×${h}px`;
        setStatus("Done", "ok");
      } catch (e) {
        out.textContent = `Error: ${e?.message || e}`;
        setStatus("Error", "warn");
      }
    };
  }

  // CONV: Compress
  if (toolId === "conv-img-compress") {
    const out = $("#compressOut");
    $("#compressBtn").onclick = async () => {
      const file = $("#compressFile").files?.[0];
      if (!file) { out.textContent = "Select an image first."; return; }

      const q = parseFloat($("#compressQ").value);
      const fmt = $("#compressFmt").value;

      setStatus("Compressing…", "warn");
      try {
        const img = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);

        const blob = await canvasToBlob(canvas, fmt, q);
        const ext = fmt.includes("png") ? "png" : fmt.includes("webp") ? "webp" : "jpg";
        downloadBlob(blob, `compressed.${ext}`);

        out.textContent = `Input: ${bytesToHuman(file.size)}\nOutput: ${bytesToHuman(blob.size)}\nQuality: ${fmt === "image/png" ? "N/A" : q}`;
        setStatus("Done", "ok");
      } catch (e) {
        out.textContent = `Error: ${e?.message || e}`;
        setStatus("Error", "warn");
      }
    };
  }

  // CONV: JPG<->PNG
  if (toolId === "conv-jpg-png") {
    const out = $("#jpOut");
    $("#jpBtn").onclick = async () => {
      const file = $("#jpFile").files?.[0];
      if (!file) { out.textContent = "Select an image first."; return; }

      const to = $("#jpTo").value;
      setStatus("Converting…", "warn");
      try {
        const img = await loadImageFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);

        const blob = await canvasToBlob(canvas, to, 0.92);
        const ext = to.includes("png") ? "png" : "jpg";
        downloadBlob(blob, `converted.${ext}`);

        out.textContent = `Input: ${bytesToHuman(file.size)}\nOutput: ${bytesToHuman(blob.size)}\nTo: ${ext.toUpperCase()}`;
        setStatus("Done", "ok");
      } catch (e) {
        out.textContent = `Error: ${e?.message || e}`;
        setStatus("Error", "warn");
      }
    };
  }

  // CONV: Image -> PDF
  if (toolId === "conv-img-pdf") {
    const out = $("#imgPdfOut");
    $("#imgPdfBtn").onclick = async () => {
      const files = Array.from($("#imgPdfFiles").files || []);
      if (!files.length) { out.textContent = "Select one or more images."; return; }

      setStatus("Building PDF…", "warn");
      try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const isPng = file.type === "image/png";
          const img = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);

          const page = pdfDoc.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        downloadBlob(blob, "images.pdf");

        out.textContent = `Images: ${files.length}\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done", "ok");
      } catch (e) {
        out.textContent = `Error: ${e?.message || e}`;
        setStatus("Error", "warn");
      }
    };
  }

  // CONV: Merge PDFs
  if (toolId === "conv-pdf-merge") {
    const out = $("#mergeOut");
    $("#mergeBtn").onclick = async () => {
      const files = Array.from($("#mergePdfs").files || []);
      if (files.length < 2) { out.textContent = "Select at least 2 PDFs."; return; }

      setStatus("Merging…", "warn");
      try {
        const { PDFDocument } = PDFLib;
        const merged = await PDFDocument.create();

        let totalPages = 0;
        for (const f of files) {
          const bytes = await f.arrayBuffer();
          const doc = await PDFDocument.load(bytes);
          const pages = await merged.copyPages(doc, doc.getPageIndices());
          pages.forEach(p => merged.addPage(p));
          totalPages += pages.length;
        }

        const outBytes = await merged.save();
        const blob = new Blob([outBytes], { type:"application/pdf" });
        downloadBlob(blob, "merged.pdf");

        out.textContent = `Files: ${files.length}\nPages: ${totalPages}\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done", "ok");
      } catch (e) {
        out.textContent = `Error: ${e?.message || e}`;
        setStatus("Error", "warn");
      }
    };
  }

  // CONV: Split PDF
  if (toolId === "conv-pdf-split") {
    const out = $("#splitOut");
    $("#splitBtn").onclick = async () => {
      const file = $("#splitPdf").files?.[0];
      const spec = ($("#splitPages").value || "").trim();
      if (!file) { out.textContent = "Select a PDF."; return; }
      if (!spec) { out.textContent = "Enter pages, e.g., 1,2,5-7"; return; }

      setStatus("Splitting…", "warn");
      try {
        const pagesWanted = parsePageSpec(spec);

        const { PDFDocument } = PDFLib;
        const srcBytes = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(srcBytes);
        const pageCount = srcDoc.getPageCount();

        // Validate
        for (const p of pagesWanted) {
          if (p > pageCount) throw new Error(`Page ${p} is out of range (PDF has ${pageCount} pages).`);
        }

        const outDoc = await PDFDocument.create();
        const indices = pagesWanted.map(p => p - 1);
        const pages = await outDoc.copyPages(srcDoc, indices);
        pages.forEach(pg => outDoc.addPage(pg));

        const outBytes = await outDoc.save();
        const blob = new Blob([outBytes], { type:"application/pdf" });
        downloadBlob(blob, "split.pdf");

        out.textContent = `Selected pages: ${pagesWanted.join(", ")}\nOutput: ${bytesToHuman(blob.size)}`;
        setStatus("Done", "ok");
      } catch (e) {
        out.textContent = `Error: ${e?.message || e}`;
        setStatus("Error", "warn");
      }
    };
  }
}

/* -------------------- Router -------------------- */

function render(route) {
  const view = $("#view");
  setStatus("Ready");

  if (route === "#/" || route === "" || route === "#/home") {
    view.innerHTML = homeView();
    return;
  }
  if (route === "#/calculators") {
    view.innerHTML = listView("Calculators");
    return;
  }
  if (route === "#/converters") {
    view.innerHTML = listView("Converters");
    return;
  }
  if (route === "#/about") {
    view.innerHTML = viewTemplate(
      "About",
      "This site runs entirely in your browser and can be hosted on GitHub Pages.",
      `<div class="card"><p class="p">Add more tools by creating a new route and handler in <b>app.js</b>.</p></div>`
    );
    return;
  }
  if (route === "#/privacy") {
    view.innerHTML = viewTemplate(
      "Privacy",
      "Basic privacy note for a client-side tools site.",
      `<div class="card">
        <p class="p">Files are processed locally in your browser. This site does not upload your files to a server.</p>
        <p class="p">If you add ads/analytics later, those providers may collect standard usage data according to their policies.</p>
      </div>`
    );
    return;
  }

  // Tool routes
  const toolMatch = route.match(/^#\/tool\/(.+)$/);
  if (toolMatch) {
    const toolId = toolMatch[1];
    const tool = tools.find(t => t.id === toolId);
    if (!tool) {
      view.innerHTML = viewTemplate("Not found", "Tool not found.", `<div class="card"><a class="btn" href="#/home">Back home</a></div>`);
      return;
    }

    let html = "";
    switch (toolId) {
      case "calc-bmi": html = calcBMIView(); break;
      case "calc-loan": html = calcLoanView(); break;
      case "calc-date": html = calcDateDiffView(); break;
      case "calc-percent": html = calcPercentView(); break;

      case "conv-img-resize": html = convImageResizeView(); break;
      case "conv-img-compress": html = convImageCompressView(); break;
      case "conv-jpg-png": html = convJpgPngView(); break;
      case "conv-img-pdf": html = convImageToPdfView(); break;
      case "conv-pdf-merge": html = convPdfMergeView(); break;
      case "conv-pdf-split": html = convPdfSplitView(); break;

      default:
        html = viewTemplate("Not implemented", "This tool is not implemented yet.", `<div class="card"></div>`);
    }
    view.innerHTML = html;
    // mount handlers after DOM is set
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

