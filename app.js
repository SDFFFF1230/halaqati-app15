"use strict";
const { useState, useEffect, useMemo, useRef } = React;
const Icon = ({ name, size = 20, className = "" }) => {
    return React.createElement("i", { "data-lucide": name, style: { width: size, height: size }, className: `inline-block ${className}` });
};
// إشعار غير حاجب (Toast) بدل نافذة alert الحاجبة
const notify = (msg) => {
    try {
        const bad = /(تعذّر|تعذر|غير كاف|يرجى|لا توجد|لا يوجد|غير صالح|خطأ)/.test(String(msg));
        let box = document.getElementById('hl-toast-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'hl-toast-box';
            box.setAttribute('role', 'status');
            box.setAttribute('aria-live', 'polite');
            document.body.appendChild(box);
        }
        const el = document.createElement('div');
        el.className = 'hl-toast ' + (bad ? 'hl-toast-bad' : 'hl-toast-ok');
        el.textContent = String(msg);
        box.appendChild(el);
        setTimeout(() => { el.classList.add('hl-toast-out'); setTimeout(() => el.remove(), 300); }, bad ? 4200 : 2800);
    }
    catch (e) {
        window.alert(msg);
    }
};
const TERMS_VERSION = '2';
const TERMS_UPDATED = 'أكتوبر 2026';
const LICENSEE = 'مؤسسة دار الأرقم';
const OWNER = 'سيف الدين مكية';
const APP_VERSION = '1.0.0';
const TERMS_SECTIONS = [
    { h: '1. الإذن', p: 'تُمنح مؤسسة دار الأرقم إذناً باستخدام تطبيق «حلقتي» داخل المؤسسة لإدارة حلقاتها ومتابعة طلابها. ويحق لها توزيعه على معلميها وإداريّيها العاملين فيها.' },
    { h: '2. الملكية', p: 'التطبيق وتصميمه وشيفرته واسمه وشعاره ملك لصاحبه. ولا ينقل هذا الإذن الملكية إلى أحد.' },
    { h: '3. عدم المشاركة خارج المؤسسة', p: 'لا يجوز نسخ التطبيق أو إرساله أو نشره أو بيعه أو إعطاؤه لأي شخص أو جهة من خارج المؤسسة، ولا رفعه على أي متجر أو موقع.' },
    { h: '4. عدم الحصرية', p: 'يحق لصاحب التطبيق تطويره وإتاحته لجهات أخرى.' },
    { h: '5. البيانات', p: 'التطبيق يعمل دون إنترنت وتبقى البيانات على جهاز المستخدم، ولا يطّلع عليها صاحب التطبيق، وهي ملك للمؤسسة. وتتحمّل المؤسسة ومعلموها مسؤولية حماية الأجهزة وأخذ موافقة أولياء الأمور على حفظ بيانات أبنائهم.' },
    { h: '6. النسخ الاحتياطي', p: 'بيانات التطبيق محفوظة على الجهاز نفسه، لذا قد تضيع عند حذف التطبيق أو مسح بياناته من إعدادات الجهاز، أو عند تعطّل الجهاز أو استبداله، ولا تنتقل إلى جهاز آخر من تلقاء نفسها. على المستخدم حفظ نسخة احتياطية بانتظام من الإعدادات.' },
    { h: '7. إخلاء المسؤولية', p: 'يُقدَّم التطبيق «كما هو» دون ضمان خلوّه من الأخطاء أو عمله دون انقطاع، ولا يتحمل صاحبه مسؤولية فقدان البيانات أو أي ضرر ناتج عن الاستخدام. ودقة التقارير المرسلة لأولياء الأمور مسؤولية المعلم.' },
    { h: '8. التحديثات', p: 'قد تُحدَّث هذه الشروط مع تطوير التطبيق، واستمرار الاستخدام يعني الموافقة على المعدَّل منها.' },
];
const TermsParties = () => (React.createElement("div", { className: "rounded-2xl bg-gray-50 border border-gray-100 p-3 space-y-1 text-[12px] font-bold" },
    React.createElement("p", { className: "text-gray-500" },
        "\u0627\u0644\u0645\u0623\u0630\u0648\u0646 \u0644\u0647\u0627: ",
        React.createElement("span", { className: "text-gray-800" }, LICENSEE)),
    React.createElement("p", { className: "text-gray-500" },
        "\u0635\u0627\u062D\u0628 \u0627\u0644\u062A\u0637\u0628\u064A\u0642: ",
        React.createElement("span", { className: "text-gray-800" }, OWNER))));
const STORAGE_KEY = 'halaqati_app_data_v2';
// بطاقة مؤشر (KPI): عنوان واضح + فاصل صغير + قيمة بارزة + وصف مختصر، لكل معلومة مساحتها الخاصة
const KPI_ACCENTS = {
    emerald: { bar: 'border-emerald-500', chip: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-700' },
    blue: { bar: 'border-blue-500', chip: 'bg-blue-50 text-blue-600', value: 'text-blue-700' },
    amber: { bar: 'border-amber-500', chip: 'bg-amber-50 text-amber-600', value: 'text-amber-600' },
    orange: { bar: 'border-orange-500', chip: 'bg-orange-50 text-orange-600', value: 'text-orange-600' },
    red: { bar: 'border-red-500', chip: 'bg-red-50 text-red-600', value: 'text-red-600' },
};
const KpiCard = ({ label, value, hint, icon, accent = 'emerald' }) => {
    const a = KPI_ACCENTS[accent];
    return (React.createElement("div", { className: `bg-white rounded-3xl card-shadow border-b-4 ${a.bar} p-4 min-w-0 flex flex-col gap-2` },
        React.createElement("div", { className: "flex items-center gap-2 min-w-0" },
            React.createElement("span", { className: `shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${a.chip}` },
                React.createElement(Icon, { name: icon, size: 16 })),
            React.createElement("p", { className: "text-[12px] font-black text-gray-600 leading-snug" }, label)),
        React.createElement("div", { className: "h-px bg-gray-100" }),
        React.createElement("p", { className: `text-3xl font-black leading-none ${a.value}` }, value),
        hint && React.createElement("p", { className: "text-[10.5px] font-bold text-gray-400 leading-snug" }, hint)));
};
// توحيد الحروف العربية المتشابهة لتسهيل البحث بالاسم (أ/إ/آ → ا، ة → ه، ى → ي) وإزالة التشكيل
const normalizeArabic = (str) => (str || '')
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
// ===================== الشعار =====================
// شعار حَلَقَتي: حلقة من الطلاب (النقاط) حول كتاب مفتوح، النقطة الذهبية العليا ترمز للمعلّم
const Logo = ({ size = 40, symbolOnly = false, className = '' }) => (React.createElement("svg", { width: size, height: size, viewBox: "0 0 120 120", className: className, xmlns: "http://www.w3.org/2000/svg", role: "img", "aria-label": "\u0634\u0639\u0627\u0631 \u062D\u0644\u0642\u062A\u064A" },
    !symbolOnly && (React.createElement(React.Fragment, null,
        React.createElement("defs", null,
            React.createElement("linearGradient", { id: "hlg-grad", x1: "0", y1: "0", x2: "1", y2: "1" },
                React.createElement("stop", { offset: "0", stopColor: "#10b981" }),
                React.createElement("stop", { offset: "1", stopColor: "#065f46" }))),
        React.createElement("rect", { width: "120", height: "120", rx: "28", fill: "url(#hlg-grad)" }))),
    Array.from({ length: 12 }, (_, k) => {
        const a = (k * 30 - 90) * Math.PI / 180;
        return React.createElement("circle", { key: k, cx: 60 + 49 * Math.cos(a), cy: 60 + 49 * Math.sin(a), r: k === 0 ? 5 : 3.4, fill: k === 0 ? '#fbbf24' : '#ffffff', opacity: k === 0 ? 1 : 0.85 });
    }),
    React.createElement("path", { d: "M60 47 C52 40 38 39 27 43 L27 80 C38 76 52 77 60 84 Z", fill: "#ffffff" }),
    React.createElement("path", { d: "M60 47 C68 40 82 39 93 43 L93 80 C82 76 68 77 60 84 Z", fill: "#ffffff" }),
    React.createElement("g", { stroke: "#047857", strokeWidth: "2", strokeLinecap: "round", fill: "none", opacity: "0.4" },
        React.createElement("path", { d: "M33 52 C40 50 47 51 54 55" }),
        React.createElement("path", { d: "M33 60 C40 58 47 59 54 63" }),
        React.createElement("path", { d: "M33 68 C40 66 47 67 54 71" }),
        React.createElement("path", { d: "M87 52 C80 50 73 51 66 55" }),
        React.createElement("path", { d: "M87 60 C80 58 73 59 66 63" }),
        React.createElement("path", { d: "M87 68 C80 66 73 67 66 71" })),
    React.createElement("path", { d: "M60 47 L60 84", stroke: "#fbbf24", strokeWidth: "2.4", strokeLinecap: "round" })));
// ===================== محرك التقاط التقارير (صورة / PDF) =====================
// نرسم التقرير عبر SVG/foreignObject: المتصفح نفسه يرسم النص العربي فتبقى الحروف متصلة وصحيحة،
// بدل محاكاة الرسم حرفاً حرفاً (كما تفعل html2canvas) والتي تفصل حروف الكلمات العربية.
let __embeddedFontCss = null;
let __fontFailAt = 0;
const fetchWithTimeout = async (url, ms) => {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), ms);
    try {
        return await fetch(url, { signal: c.signal });
    }
    finally {
        clearTimeout(t);
    }
};
const bufferToBase64 = (buf) => {
    const bytes = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000)
        s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
};
// نضمّن خط Tajawal داخل الصورة (يُجلب مرة واحدة ثم يُحفظ)، وإن تعذّر نكمل بخط النظام العربي
const getEmbeddedFontCss = async () => {
    if (__embeddedFontCss)
        return __embeddedFontCss;
    if (Date.now() - __fontFailAt < 60000)
        return '';
    try {
        const res = await fetchWithTimeout('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap', 7000);
        if (!res.ok)
            throw new Error('css');
        const css = await res.text();
        const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)].filter(m => m[1] === 'arabic' || m[1] === 'latin');
        let out = '';
        for (const m of blocks) {
            const u = m[2].match(/url\((https:[^)]+)\)/);
            if (!u)
                continue;
            const fr = await fetchWithTimeout(u[1], 9000);
            if (!fr.ok)
                continue;
            out += m[2].replace(u[0], `url(data:font/woff2;base64,${bufferToBase64(await fr.arrayBuffer())})`) + '\n';
        }
        if (!out)
            throw new Error('nofonts');
        __embeddedFontCss = out;
        return out;
    }
    catch (e) {
        __fontFailAt = Date.now();
        return '';
    }
};
// أنماط الصفحة (Tailwind المحلي + أنماط التطبيق) لتُحقن داخل الصورة
const collectPageCss = () => {
    let css = '';
    for (const sheet of Array.from(document.styleSheets)) {
        let rules;
        try {
            rules = sheet.cssRules;
        }
        catch (e) {
            continue;
        }
        if (!rules)
            continue;
        for (const r of Array.from(rules)) {
            if (r.type === 3)
                continue;
            css += r.cssText + '\n';
        }
    }
    return css.replace(/\]\]>/g, '');
};
const captureNodeToCanvas = async (node, scale = 2) => {
    if (document.fonts && document.fonts.ready) {
        try {
            await document.fonts.ready;
        }
        catch (e) { }
    }
    const rect = node.getBoundingClientRect();
    const w = Math.ceil(rect.width), h = Math.ceil(rect.height);
    if (!w || !h)
        throw new Error('empty-node');
    scale = Math.max(1, Math.min(scale, 14000 / h, 14000 / w));
    const fontCss = await getEmbeddedFontCss();
    const xhtml = new XMLSerializer().serializeToString(node);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}" viewBox="0 0 ${w} ${h}"><style><![CDATA[${collectPageCss()}\n${fontCss}]]></style><foreignObject x="0" y="0" width="${w}" height="${h}">${xhtml}</foreignObject></svg>`;
    // نستخدم data URL (وليس blob URL) لأن المتصفح يعتبر الـ canvas "ملوّثاً" ولا يسمح بتصديره عند استخدام blob مع foreignObject
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    try {
        const img = new Image();
        img.src = url;
        await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('svg-load')); });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        const draw = () => { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
        draw();
        // الرسم الثاني يضمن ظهور الخط المضمّن بعد فك ترميزه
        if (fontCss) {
            await new Promise(r => setTimeout(r, 200));
            draw();
        }
        return canvas;
    }
    finally {
        // لا شيء لتحريره: data URL
    }
};
// نتحقق ما إذا كانت الصورة الملتقطة فارغة فعلياً (كل البكسلات تقريباً بيضاء)
const isCanvasBlank = (canvas) => {
    try {
        const tw = 60, th = 60;
        const tmp = document.createElement('canvas');
        tmp.width = tw;
        tmp.height = th;
        const tctx = tmp.getContext('2d');
        tctx.drawImage(canvas, 0, 0, tw, th);
        const data = tctx.getImageData(0, 0, tw, th).data;
        let nonWhite = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245)
                nonWhite++;
        }
        return nonWhite < 3;
    }
    catch (e) {
        return false;
    }
};
// حدود العناصر التي لا يجوز تقطيعها بين صفحتين (صفوف الجداول + كل عنصر يحمل avoid-break)، نسبة لأعلى التقرير
const getSafeBreakPoints = (containerEl) => {
    if (!containerEl)
        return [];
    const top0 = containerEl.getBoundingClientRect().top;
    const pts = [];
    containerEl.querySelectorAll('tr, .avoid-break').forEach(el => {
        const r = el.getBoundingClientRect();
        pts.push({ top: r.top - top0, bottom: r.bottom - top0 });
    });
    return pts;
};
// بناء ملف PDF حقيقي (صفحات A4) من صورة التقرير دون أي مكتبة خارجية
const buildPdfFromCanvas = async (canvas, breakPoints, header) => {
    const PW = 595.28, PH = 841.89;
    const pageW = canvas.width;
    const pageH = Math.round(pageW * PH / PW);
    const marginTop = Math.round(pageW * 0.022);
    const marginBottom = Math.round(pageW * 0.05);
    const usable = pageH - marginTop - marginBottom;
    const slices = [];
    const hdrH = header ? Math.round(header.bottom - header.top) : 0; // ارتفاع رأس الجدول المكرَّر في الصفحات التالية
    let cursor = 0;
    let fit = 1; // إذا كان التقرير أطول من الصفحة بقدر بسيط (حتى 8%) نصغّره قليلاً ليبقى في صفحة واحدة
    if (canvas.height > usable && canvas.height <= usable * 1.08) {
        fit = usable / canvas.height;
        slices.push([0, canvas.height]);
        cursor = canvas.height;
    }
    while (cursor < canvas.height - 1) {
        const avail = (slices.length > 0 && hdrH && cursor > header.bottom) ? usable - hdrH : usable;
        let cut = Math.min(cursor + avail, canvas.height);
        if (cut < canvas.height) {
            let moved = true, guard = 0;
            while (moved && guard++ < 50) {
                moved = false;
                for (const bp of breakPoints) {
                    if (bp.top < cut && bp.bottom > cut && bp.top > cursor) {
                        cut = bp.top;
                        moved = true;
                    }
                }
            }
            if (cut - cursor < avail * 0.2)
                cut = Math.min(cursor + avail, canvas.height);
        }
        slices.push([cursor, cut]);
        cursor = cut;
    }
    // لا نترك صفحة أخيرة شبه فارغة: نضمّ الشريحة الأخيرة الصغيرة جداً إلى ما قبلها
    if (slices.length > 1 && slices[slices.length - 1][1] - slices[slices.length - 1][0] < 70) {
        const last = slices.pop();
        slices[slices.length - 1][1] = last[1];
    }
    const jpegs = [];
    for (let i = 0; i < slices.length; i++) {
        const [a, b] = slices[i];
        const pc = document.createElement('canvas');
        pc.width = pageW;
        pc.height = pageH;
        const ctx = pc.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageW, pageH);
        const dw = pageW * fit, dh = (b - a) * fit;
        let y0 = marginTop;
        if (i > 0 && hdrH && a > header.bottom) {
            // نكرّر رأس الجدول أعلى كل صفحة تالية ليبقى معنى الأعمدة واضحاً
            ctx.drawImage(canvas, 0, header.top, pageW, hdrH, 0, y0, pageW, hdrH);
            y0 += hdrH;
        }
        ctx.drawImage(canvas, 0, a, pageW, b - a, (pageW - dw) / 2, y0, dw, dh);
        ctx.fillStyle = '#9ca3af';
        ctx.font = `${Math.round(pageW * 0.0125)}px Tajawal, "Noto Sans Arabic", sans-serif`;
        ctx.textAlign = 'center';
        ctx.direction = 'rtl';
        ctx.fillText(`حَلَقَتي  •  صفحة ${i + 1} من ${slices.length}`, pageW / 2, pageH - Math.round(pageW * 0.022));
        const jb = await new Promise(r => pc.toBlob(r, 'image/jpeg', 0.92));
        jpegs.push(new Uint8Array(await jb.arrayBuffer()));
    }
    const enc = new TextEncoder();
    const chunks = [];
    let offset = 0;
    const offs = [];
    const push = (d) => { const b = typeof d === 'string' ? enc.encode(d) : d; chunks.push(b); offset += b.length; };
    const n = jpegs.length;
    const objCount = 2 + n * 3;
    push('%PDF-1.4\n');
    offs[1] = offset;
    push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
    const kids = Array.from({ length: n }, (_, i) => `${5 + 3 * i} 0 R`).join(' ');
    offs[2] = offset;
    push(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${n} >>\nendobj\n`);
    for (let i = 0; i < n; i++) {
        const imgId = 3 + 3 * i, cId = 4 + 3 * i, pId = 5 + 3 * i;
        offs[imgId] = offset;
        push(`${imgId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pageW} /Height ${pageH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegs[i].length} >>\nstream\n`);
        push(jpegs[i]);
        push('\nendstream\nendobj\n');
        const content = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`;
        offs[cId] = offset;
        push(`${cId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
        offs[pId] = offset;
        push(`${pId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 ${imgId} 0 R >> >> /Contents ${cId} 0 R >>\nendobj\n`);
    }
    const xrefPos = offset;
    let xref = `xref\n0 ${objCount + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objCount; i++)
        xref += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
    push(xref + `trailer\n<< /Size ${objCount + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);
    return new Blob(chunks, { type: 'application/pdf' });
};
const blobToBase64 = (blob) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1]);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
});
// مشاركة/حفظ ملف: داخل تطبيق أندرويد عبر نافذة المشاركة الأصلية، وفي المتصفح عبر المشاركة أو التنزيل
const shareFile = async (blob, filename, mime, title) => {
    const cap = window.Capacitor;
    const native = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    if (native && cap.Plugins && cap.Plugins.Filesystem && cap.Plugins.Share) {
        const ext = (filename.split('.').pop() || 'bin').replace(/[^a-z0-9]/gi, '');
        const tmpName = `halaqati-${Date.now()}.${ext}`;
        const written = await cap.Plugins.Filesystem.writeFile({ path: tmpName, data: await blobToBase64(blob), directory: 'CACHE' });
        await cap.Plugins.Share.share({ title, text: title, url: written.uri, dialogTitle: title });
        return 'native';
    }
    const file = new File([blob], filename, { type: mime });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title, text: title });
        return 'share';
    }
    // عند التنزيل المباشر نستخدم اسم ملف بحروف لاتينية مضمونة الامتداد (بعض المتصفحات تُسقط الأسماء العربية فيضيع .png/.pdf)
    let dlName = filename;
    if (!/^[\x20-\x7E]+$/.test(filename)) {
        const ext = (filename.split('.').pop() || 'bin').replace(/[^a-z0-9]/gi, '');
        const d = new Date();
        const p2 = (n) => String(n).padStart(2, '0');
        dlName = `halaqati-report-${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}${p2(d.getSeconds())}.${ext}`;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = dlName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
    return 'download';
};
function App() {
    const [activeTab, setActiveTab] = useState(() => {
        try {
            const t = new URLSearchParams(window.location.search).get('tab');
            return ['session', 'students', 'reports'].includes(t) ? t : 'dashboard';
        }
        catch (e) {
            return 'dashboard';
        }
    });
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [settings, setSettings] = useState({
        halakaName: 'حلقة الإيمان',
        teacherName: 'الشيخ محمد',
        reportFormat: 'detailed'
    });
    const [reportMode, setReportMode] = useState('monthly'); // monthly | custom
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const [reportMonth, setReportMonth] = useState(currentMonthStr);
    const [reportFrom, setReportFrom] = useState(new Date().toISOString().slice(0, 10));
    const [reportTo, setReportTo] = useState(new Date().toISOString().slice(0, 10));
    const [exporting, setExporting] = useState(false);
    const reportRef = useRef(null);
    const studentReportRef = useRef(null);
    // قوالب مخصصة فقط لتصدير الصورة/PDF: عريضة ومؤطّرة بهوية التطبيق، منفصلة تماماً عن بطاقة الجوال الضيقة المعروضة على الشاشة
    const halakaExportRef = useRef(null);
    const studentExportRef = useRef(null);
    const pointsExportRef = useRef(null);
    const [reportSection, setReportSection] = useState(null); // null | 'halaqa' | 'student'
    const [selectedReportStudentId, setSelectedReportStudentId] = useState(null);
    const [studentSearchQuery, setStudentSearchQuery] = useState('');
    const [studentKashfType, setStudentKashfType] = useState('summary'); // summary | detailed
    const [halakaReportType, setHalakaReportType] = useState('detailed'); // summary | detailed
    const [selectedSessionDate, setSelectedSessionDate] = useState(new Date().toISOString().split('T')[0]);
    const [showSessionHistory, setShowSessionHistory] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetConfirmText, setResetConfirmText] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);
    const [exportJob, setExportJob] = useState(null); // null | { kind: 'halaka'|'student'|'points', format: 'image'|'pdf', fileTitle, shareTitle }
    const [sessionSearchQuery, setSessionSearchQuery] = useState('');
    const [guideSeen, setGuideSeen] = useState(() => { try {
        return localStorage.getItem('halaqati_guide_seen') === '1';
    }
    catch (e) {
        return false;
    } });
    const [theme, setTheme] = useState(() => { try {
        return localStorage.getItem('halaqati_theme') === 'dark' ? 'dark' : 'light';
    }
    catch (e) {
        return 'light';
    } });
    useEffect(() => {
        const isDark = theme === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        const m = document.querySelector('meta[name=theme-color]');
        if (m)
            m.setAttribute('content', isDark ? '#0b1220' : '#047857');
        try {
            localStorage.setItem('halaqati_theme', theme);
        }
        catch (e) { }
    }, [theme]);
    const [termsOk, setTermsOk] = useState(() => { try {
        return localStorage.getItem('halaqati_terms_v' + TERMS_VERSION) === '1';
    }
    catch (e) {
        return false;
    } });
    const acceptTerms = () => { try {
        localStorage.setItem('halaqati_terms_v' + TERMS_VERSION, '1');
    }
    catch (e) { } setTermsOk(true); };
    const markGuideSeen = () => { try {
        localStorage.setItem('halaqati_guide_seen', '1');
    }
    catch (e) { } setGuideSeen(true); };
    // Load Data
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setStudents(parsed.students || []);
                setSessions(parsed.sessions || []);
                setTransactions(parsed.transactions || []);
                setSettings(parsed.settings || settings);
            }
            catch (e) {
                console.error("Error parsing local storage", e);
            }
        }
    }, []);
    // Save Data & Render Icons
    useEffect(() => {
        const data = { students, sessions, settings, transactions };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        if (window.lucide)
            window.lucide.createIcons();
    }, [students, sessions, settings, transactions, activeTab]);
    // أيقونات التقرير المفتوح: تُحوَّل إلى SVG عند فتح التقرير أو تبديل نوعه/فترته أو انتهاء التصدير
    // (كانت تبقى فارغة لأن التأثير أعلاه لا يراقب هذه الحالات)
    useEffect(() => {
        if (window.lucide)
            window.lucide.createIcons();
    }, [reportSection, selectedReportStudentId, halakaReportType, studentKashfType, reportMode, reportMonth, reportFrom, reportTo, exporting, exportJob]);
    // Date Formatting
    const getTodayDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('ar-EG', options);
    };
    const formatDate = (isoString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(isoString).toLocaleDateString('ar-EG', options);
    };
    const todayKey = new Date().toISOString().split('T')[0];
    // Dashboard Stats
    const stats = useMemo(() => {
        const todaySession = sessions.find(s => s.date === todayKey);
        return {
            totalStudents: students.filter(s => s.active).length,
            presentToday: todaySession ? todaySession.records.filter(r => r.status === 'present').length : 0,
            lateToday: todaySession ? todaySession.records.filter(r => r.status === 'late').length : 0,
            absentToday: todaySession ? todaySession.records.filter(r => r.status === 'absent' || r.status === 'absent_excused').length : 0,
            excusedToday: todaySession ? todaySession.records.filter(r => r.status === 'absent_excused').length : 0,
            unexcusedToday: todaySession ? todaySession.records.filter(r => r.status === 'absent').length : 0,
        };
    }, [students, sessions, todayKey]);
    // Points Logic
    const getStudentPoints = (studentId) => {
        return transactions
            .filter(t => t.studentId === studentId)
            .reduce((sum, t) => sum + t.pointsChange, 0);
    };
    const getStudentPointsForDate = (studentId, dateStr) => {
        return transactions
            .filter(t => t.studentId === studentId && t.date.startsWith(dateStr))
            .reduce((sum, t) => sum + t.pointsChange, 0);
    };
    const getStudentTodayPoints = (studentId) => getStudentPointsForDate(studentId, todayKey);
    const addPointsTransaction = (studentId, pointsChange, type, note = '') => {
        const newTransaction = {
            id: Date.now().toString(),
            studentId,
            pointsChange,
            type,
            note,
            date: new Date().toISOString()
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };
    // Handlers
    const addStudent = (e) => {
        e.preventDefault();
        const name = e.target.studentName.value;
        if (!name)
            return;
        const newStudent = {
            id: Date.now().toString(),
            name,
            phone: e.target.parentPhone.value,
            active: true,
            joinDate: new Date().toISOString()
        };
        setStudents([...students, newStudent]);
        e.target.reset();
    };
    const toggleStudentStatus = (id) => {
        setStudents(students.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };
    const deleteStudent = (id) => {
        if (confirm("هل أنت متأكد من حذف هذا الطالب نهائياً؟")) {
            setStudents(students.filter(s => s.id !== id));
            setTransactions(transactions.filter(t => t.studentId !== id));
        }
    };
    const saveSessionRecord = (studentId, field, value, dateStr = selectedSessionDate) => {
        setSessions(prev => {
            const sessionIndex = prev.findIndex(s => s.date === dateStr);
            let newSessions = [...prev];
            if (sessionIndex === -1) {
                newSessions.push({
                    date: dateStr,
                    records: [{ studentId, [field]: value }]
                });
            }
            else {
                const recordIndex = newSessions[sessionIndex].records.findIndex(r => r.studentId === studentId);
                if (recordIndex === -1) {
                    newSessions[sessionIndex].records.push({ studentId, [field]: value });
                }
                else {
                    newSessions[sessionIndex].records[recordIndex][field] = value;
                }
            }
            return newSessions;
        });
    };
    const getRecord = (studentId, dateStr = selectedSessionDate) => {
        const session = sessions.find(s => s.date === dateStr);
        return (session === null || session === void 0 ? void 0 : session.records.find(r => r.studentId === studentId)) || {
            status: 'none',
            hifzPages: '', hifzNote: '', hifzPassed: '',
            reviewPages: '', reviewNote: '', reviewPassed: '',
            rating: 'جيد'
        };
    };
    // حذف تسجيل يوم كامل نهائياً (يستخدم من صفحة السجل أو من داخل شاشة الجلسة)
    const deleteSessionDay = (dateStr) => {
        setSessions(prev => prev.filter(s => s.date !== dateStr));
    };
    const confirmDeleteDay = (dateStr) => {
        if (confirm(`سيتم حذف كل تسجيلات يوم ${formatDisplayDateShort(dateStr)} نهائياً (الحضور، الحفظ، المراجعة) ولا يمكن التراجع. هل أنت متأكد؟`)) {
            deleteSessionDay(dateStr);
            if (selectedSessionDate === dateStr)
                setSelectedSessionDate(todayKey);
        }
    };
    // مسح تسجيل طالب واحد ضمن يوم معيّن (بدون التأثير على بقية الطلاب أو الأيام الأخرى)
    const clearStudentRecordForDate = (studentId, dateStr) => {
        setSessions(prev => prev.map(s => {
            if (s.date !== dateStr)
                return s;
            return { ...s, records: s.records.filter(r => r.studentId !== studentId) };
        }));
    };
    // كل الأيام القابلة للتصفح: كل يوم فيه تسجيلات + اليوم الحالي دائماً
    const browsableDates = useMemo(() => {
        const set = new Set(sessions.map(s => s.date));
        set.add(todayKey);
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [sessions, todayKey]);
    const sessionDatesSorted = useMemo(() => {
        return [...sessions].map(s => s.date).sort((a, b) => b.localeCompare(a));
    }, [sessions]);
    const currentDateIndex = browsableDates.indexOf(selectedSessionDate);
    const canGoPrevDate = currentDateIndex > 0;
    const canGoNextDate = currentDateIndex !== -1 && currentDateIndex < browsableDates.length - 1;
    const goPrevDate = () => { if (canGoPrevDate)
        setSelectedSessionDate(browsableDates[currentDateIndex - 1]); };
    const goNextDate = () => { if (canGoNextDate)
        setSelectedSessionDate(browsableDates[currentDateIndex + 1]); };
    // نتيجة بحث الجلسات: نص البحث بعد إزالة المسافات الزائدة وتوحيد الحروف، ويعمل مع أي جزء من الاسم
    const sessionQueryNorm = normalizeArabic(sessionSearchQuery.trim());
    const sessionStudents = students.filter(s => s.active && (!sessionQueryNorm || normalizeArabic(s.name).includes(sessionQueryNorm)));
    const formatDisplayDateShort = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' });
    };
    // تحويل بيانات الحفظ/المراجعة إلى نص جاهز للنسخ بصيغة: عدد الصفحات، الملاحظة، ✓/✗
    const formatFieldLine = (pages, note, passed) => {
        const parts = [];
        if (pages !== '' && pages !== undefined && pages !== null)
            parts.push(`${pages}صفحة`);
        if (note)
            parts.push(note);
        if (passed === 'yes')
            parts.push('✓');
        else if (passed === 'no')
            parts.push('إعادة ✗');
        return parts.join('، ');
    };
    const copySessionReport = (dateStr) => {
        const session = sessions.find(s => s.date === dateStr);
        if (!session)
            return notify("لا توجد بيانات مسجلة لهذا اليوم");
        const isToday = dateStr === todayKey;
        let presentCount = 0, lateCount = 0, absentCount = 0;
        let report = `━━━━━━━━━━━━━━\n`;
        report += `📖 تقرير حلقة (${settings.halakaName})\n`;
        report += `📅 ${isToday ? getTodayDate() : formatDisplayDateShort(dateStr)}\n`;
        report += `━━━━━━━━━━━━━━\n`;
        students.filter(s => s.active).forEach((s, index) => {
            const r = session.records.find(rec => rec.studentId === s.id) || { status: 'absent' };
            const dayPoints = getStudentPointsForDate(s.id, dateStr);
            if (r.status === 'present')
                presentCount++;
            else if (r.status === 'late')
                lateCount++;
            else
                absentCount++;
            report += `${index + 1}️⃣ ${s.name}\n`;
            if (r.status === 'present' || r.status === 'late') {
                report += r.status === 'late' ? `🕒 متأخر\n` : `✔ حاضر\n`;
                const hifzLine = formatFieldLine(r.hifzPages, r.hifzNote, r.hifzPassed);
                const reviewLine = formatFieldLine(r.reviewPages, r.reviewNote, r.reviewPassed);
                if (hifzLine)
                    report += `📌 حفظ: ${hifzLine}\n`;
                if (reviewLine)
                    report += `📌 مراجعة: ${reviewLine}\n`;
                report += `⭐ تقييم: ${r.rating || 'جيد'}\n`;
            }
            else if (r.status === 'absent_excused') {
                report += `✖ غائب (بعذر)\n`;
            }
            else {
                report += `✖ غائب (غير مبرر)\n`;
            }
            if (dayPoints > 0) {
                report += `🎯 نقاط اليوم: +${dayPoints} نقطة\n`;
            }
            else if (dayPoints < 0) {
                report += `🔻 نقاط اليوم: ${dayPoints} نقطة\n`;
            }
            report += `──────────────\n`;
        });
        report += `الحضور: ${presentCount}\n`;
        report += `التأخر: ${lateCount}\n`;
        report += `الغياب: ${absentCount}\n`;
        report += `━━━━━━━━━━━━━━`;
        const textArea = document.createElement("textarea");
        textArea.value = report;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        notify("تم نسخ تقرير الجلسة بنجاح!");
    };
    const copyTodayReport = () => copySessionReport(todayKey);
    const copyPointsReport = () => {
        const activeStudents = students.filter(s => s.active);
        if (activeStudents.length === 0)
            return notify("لا يوجد طلاب لنسخ تقريرهم");
        let report = `━━━━━━━━━━━━━━\n`;
        report += `🏅 تقرير النقاط (${settings.halakaName})\n`;
        report += `📅 ${getTodayDate()}\n`;
        report += `━━━━━━━━━━━━━━\n`;
        let total = 0;
        activeStudents.forEach((s, index) => {
            const pts = getStudentPoints(s.id);
            total += pts;
            report += `${index + 1}️⃣ ${s.name}\n`;
            report += `الرصيد: ${pts} نقطة\n`;
            report += `──────────────\n`;
        });
        report += `إجمالي نقاط الحلقة: ${total} نقطة\n`;
        report += `━━━━━━━━━━━━━━`;
        const textArea = document.createElement("textarea");
        textArea.value = report;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        notify("تم نسخ تقرير الأرصدة بنجاح!");
    };
    // تحديد نطاق التاريخ (من - إلى) بناءً على الوضع المختار: شهري أو فترة مخصصة
    const getReportRange = () => {
        if (reportMode === 'monthly') {
            const [y, m] = reportMonth.split('-').map(Number);
            const from = `${reportMonth}-01`;
            const lastDay = new Date(y, m, 0).getDate();
            const to = `${reportMonth}-${String(lastDay).padStart(2, '0')}`;
            return { from, to };
        }
        return { from: reportFrom, to: reportTo };
    };
    // حساب بيانات التقرير الدوري لكل طالب: مجموع صفحات الحفظ/المراجعة (فقط ما تم تسجيله ✓) وأيام الحضور/الغياب
    const periodReportData = useMemo(() => {
        const { from, to } = getReportRange();
        const rangeSessions = sessions.filter(s => s.date >= from && s.date <= to);
        return students.filter(s => s.active).map(student => {
            let hifzTotal = 0, reviewTotal = 0, presentCount = 0, lateCount = 0, absentCount = 0, excusedCount = 0;
            rangeSessions.forEach(sess => {
                const r = sess.records.find(rec => rec.studentId === student.id);
                if (!r || !r.status || r.status === 'none')
                    return;
                if (r.status === 'present' || r.status === 'late') {
                    if (r.status === 'late')
                        lateCount++;
                    else
                        presentCount++;
                    if (r.hifzPassed === 'yes')
                        hifzTotal += parseFloat(r.hifzPages) || 0;
                    if (r.reviewPassed === 'yes')
                        reviewTotal += parseFloat(r.reviewPages) || 0;
                }
                else if (r.status === 'absent_excused') {
                    excusedCount++;
                }
                else if (r.status === 'absent') {
                    absentCount++;
                }
            });
            return { student, hifzTotal, reviewTotal, presentCount, lateCount, absentCount, excusedCount, totalDays: presentCount + lateCount + absentCount + excusedCount };
        });
    }, [students, sessions, reportMode, reportMonth, reportFrom, reportTo]);
    // إجمالي الحلقة كاملة: مجموع صفحات الحفظ والمراجعة لكل الطلاب مجتمعين خلال نفس الفترة
    const overallTotals = useMemo(() => {
        return periodReportData.reduce((acc, row) => {
            acc.hifzTotal += row.hifzTotal;
            acc.reviewTotal += row.reviewTotal;
            acc.presentTotal += row.presentCount;
            acc.lateTotal += row.lateCount;
            acc.absentTotal += row.absentCount;
            acc.excusedTotal += row.excusedCount;
            return acc;
        }, { hifzTotal: 0, reviewTotal: 0, presentTotal: 0, lateTotal: 0, absentTotal: 0, excusedTotal: 0 });
    }, [periodReportData]);
    const copyPeriodReport = () => {
        const { from, to } = getReportRange();
        if (periodReportData.length === 0)
            return notify("لا يوجد طلاب لعرض تقريرهم");
        let report = `━━━━━━━━━━━━━━\n`;
        report += `📊 تقرير الحضور والحفظ (${settings.halakaName})\n`;
        report += `📅 من ${from} إلى ${to}\n`;
        report += `━━━━━━━━━━━━━━\n`;
        report += `🕌 إجمالي الحلقة:\n`;
        report += `عدد الطلاب: ${periodReportData.length} | حضور: ${overallTotals.presentTotal} | تأخر: ${overallTotals.lateTotal}\n`;
        report += `غياب بعذر: ${overallTotals.excusedTotal} | غياب بدون عذر: ${overallTotals.absentTotal}\n`;
        report += `📌 إجمالي صفحات الحفظ: ${overallTotals.hifzTotal}\n`;
        report += `📌 إجمالي صفحات المراجعة: ${overallTotals.reviewTotal}\n`;
        report += `━━━━━━━━━━━━━━\n`;
        if (halakaReportType === 'detailed') {
            periodReportData.forEach((row, index) => {
                report += `${index + 1}️⃣ ${row.student.name}\n`;
                report += `إجمالي الأيام: ${row.totalDays} | حضور: ${row.presentCount} | تأخر: ${row.lateCount}\n`;
                report += `غياب بعذر: ${row.excusedCount} | غياب بدون عذر: ${row.absentCount}\n`;
                report += `📌 مجموع الحفظ: ${row.hifzTotal} صفحة\n`;
                report += `📌 مجموع المراجعة: ${row.reviewTotal} صفحة\n`;
                report += `──────────────\n`;
            });
        }
        report += `━━━━━━━━━━━━━━`;
        const textArea = document.createElement("textarea");
        textArea.value = report;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        notify("تم نسخ التقرير بنجاح!");
    };
    // رسم التقرير المؤقت إلى صورة: المحرك الجديد أولاً، وإن فشل نجرّب html2canvas (إن كانت محمّلة)
    const renderExportCanvas = async (ref) => {
        const node = ref.current;
        if (!node)
            throw new Error('no-node');
        try {
            const c = await captureNodeToCanvas(node, 2);
            if (!isCanvasBlank(c))
                return c;
        }
        catch (e) {
            console.warn('capture engine failed', e);
        }
        if (window.html2canvas) {
            const c2 = await window.html2canvas(node, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
            if (c2 && !isCanvasBlank(c2))
                return c2;
        }
        throw new Error('capture-failed');
    };
    const shareElementAsImage = async (ref, fileTitle, shareTitle) => {
        try {
            setExporting(true);
            const canvas = await renderExportCanvas(ref);
            const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
            if (!blob)
                throw new Error('blob');
            await shareFile(blob, `${fileTitle}.png`, 'image/png', shareTitle);
        }
        catch (err) {
            if (!(err && err.name === 'AbortError')) {
                console.error(err);
                notify("تعذّر تجهيز الصورة، الرجاء المحاولة مرة أخرى.");
            }
        }
        finally {
            setExporting(false);
        }
    };
    const shareElementAsPDF = async (ref, fileTitle, shareTitle) => {
        try {
            setExporting(true);
            const node = ref.current;
            const breakPoints = getSafeBreakPoints(node);
            const widthPx = node ? node.getBoundingClientRect().width : 1;
            const canvas = await renderExportCanvas(ref);
            const k = canvas.width / widthPx;
            const th = node ? node.querySelector('thead') : null;
            const nodeTop = node ? node.getBoundingClientRect().top : 0;
            const header = th ? { top: (th.getBoundingClientRect().top - nodeTop) * k, bottom: (th.getBoundingClientRect().bottom - nodeTop) * k } : null;
            const blob = await buildPdfFromCanvas(canvas, breakPoints.map(b => ({ top: b.top * k, bottom: b.bottom * k })), header);
            await shareFile(blob, `${fileTitle}.pdf`, 'application/pdf', shareTitle);
        }
        catch (err) {
            if (!(err && err.name === 'AbortError')) {
                console.error(err);
                notify("تعذّر تجهيز ملف PDF، الرجاء المحاولة مرة أخرى.");
            }
        }
        finally {
            setExporting(false);
        }
    };
    // ===== تصدير التقارير (صورة/PDF) =====
    // قالب التصدير العريض لا يوجد في الصفحة إلا خلال عملية التصدير نفسها: نركّبه، نلتقطه، ثم نزيله.
    // بهذا لا يتجاور مع التقرير المعروض للمستخدم ولا يظهر في الطباعة.
    const startExport = (kind, format, fileTitle, shareTitle) => {
        if (exporting || exportJob)
            return;
        setExporting(true);
        setExportJob({ kind, format, fileTitle, shareTitle });
    };
    const exportRow = exportJob && exportJob.kind === 'student'
        ? periodReportData.find(r => r.student.id === selectedReportStudentId)
        : null;
    const exportRange = getReportRange();
    // بيانات تقرير النقاط (تُستخدم في العرض وفي قالب التصدير)
    const pointsRows = students.filter(s => s.active).map(st => ({ student: st, points: getStudentPoints(st.id) }));
    const pointsTotal = pointsRows.reduce((sum, r) => sum + r.points, 0);
    const pointsMax = pointsRows.reduce((m, r) => Math.max(m, r.points), 0);
    const pointsTop = pointsRows.length ? pointsRows.reduce((best, r) => (r.points > best.points ? r : best), pointsRows[0]) : null;
    useEffect(() => {
        if (!exportJob)
            return;
        let cancelled = false;
        (async () => {
            // ننتظر رسم القالب المؤقت في الصفحة، ثم نحوّل أيقوناته إلى SVG قبل الالتقاط
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            await new Promise(r => setTimeout(r, 150)); // مهلة قصيرة ليُنهي Tailwind توليد أنماط القالب المؤقت
            if (cancelled)
                return;
            if (window.lucide)
                window.lucide.createIcons();
            const ref = exportJob.kind === 'halaka' ? halakaExportRef : (exportJob.kind === 'points' ? pointsExportRef : studentExportRef);
            try {
                if (!ref.current) {
                    notify("تعذّر تجهيز التقرير للتصدير، الرجاء المحاولة مرة أخرى.");
                }
                else if (exportJob.format === 'pdf') {
                    await shareElementAsPDF(ref, exportJob.fileTitle, exportJob.shareTitle);
                }
                else {
                    await shareElementAsImage(ref, exportJob.fileTitle, exportJob.shareTitle);
                }
            }
            finally {
                setExporting(false);
                setExportJob(null);
            }
        })();
        return () => { cancelled = true; };
    }, [exportJob]);
    const statusLabel = (status) => status === 'present' ? 'حاضر' : (status === 'late' ? 'متأخر' : (status === 'absent_excused' ? 'غائب بعذر' : 'غائب'));
    // سجل الأيام التفصيلي لطالب واحد ضمن الفترة المختارة، لبناء الكشف الرسمي
    const studentDayLog = useMemo(() => {
        if (!selectedReportStudentId)
            return [];
        const { from, to } = getReportRange();
        return sessions
            .filter(s => s.date >= from && s.date <= to)
            .map(sess => {
            const r = sess.records.find(rec => rec.studentId === selectedReportStudentId);
            if (!r || !r.status || r.status === 'none')
                return null;
            const attended = r.status === 'present' || r.status === 'late';
            return {
                date: sess.date,
                status: r.status,
                hifzLine: attended ? (formatFieldLine(r.hifzPages, r.hifzNote, r.hifzPassed) || '—') : '—',
                reviewLine: attended ? (formatFieldLine(r.reviewPages, r.reviewNote, r.reviewPassed) || '—') : '—',
                rating: attended ? (r.rating || '—') : '—'
            };
        })
            .filter(Boolean)
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [selectedReportStudentId, sessions, reportMode, reportMonth, reportFrom, reportTo]);
    const copyStudentReport = (row) => {
        const { from, to } = getReportRange();
        let report = `━━━━━━━━━━━━━━\n`;
        report += `📋 تقرير أداء الطالب\n`;
        report += `👤 ${row.student.name}\n`;
        report += `🕌 ${settings.halakaName}\n`;
        report += `📅 من ${from} إلى ${to}\n`;
        report += `━━━━━━━━━━━━━━\n`;
        report += `إجمالي الأيام: ${row.totalDays} | حضور: ${row.presentCount} | تأخر: ${row.lateCount}\n`;
        report += `غياب بعذر: ${row.excusedCount} | غياب بدون عذر: ${row.absentCount}\n`;
        report += `📌 مجموع الحفظ: ${row.hifzTotal} صفحة\n`;
        report += `📌 مجموع المراجعة: ${row.reviewTotal} صفحة\n`;
        report += `━━━━━━━━━━━━━━\n`;
        studentDayLog.forEach(entry => {
            report += `${entry.date} — ${statusLabel(entry.status)}\n`;
            if (entry.status === 'present' || entry.status === 'late') {
                report += `حفظ: ${entry.hifzLine} | مراجعة: ${entry.reviewLine} | تقييم: ${entry.rating}\n`;
            }
            report += `──────────────\n`;
        });
        report += `━━━━━━━━━━━━━━`;
        const textArea = document.createElement("textarea");
        textArea.value = report;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        notify("تم نسخ التقرير بنجاح!");
    };
    // رأس رسمي موحّد لكل من تقرير الحلقة وكشف الطالب
    const ReportLetterhead = ({ title, subtitle }) => (React.createElement("div", { className: "avoid-break text-center pb-4 mb-4" },
        React.createElement("div", { className: "h-1 w-20 bg-gradient-to-l from-emerald-600 via-yellow-500 to-emerald-600 rounded-full mx-auto mb-3" }),
        React.createElement("div", { className: "flex items-center justify-center gap-3 mb-3" },
            React.createElement(Logo, { size: 50 }),
            React.createElement("div", { className: "text-right" },
                React.createElement("h2", { className: "font-black text-emerald-900 text-lg leading-tight" }, settings.halakaName),
                React.createElement("p", { className: "text-[10px] text-gray-500 font-bold" },
                    "\u0625\u0634\u0631\u0627\u0641: ",
                    settings.teacherName))),
        React.createElement("div", { className: "inline-flex items-center gap-1.5 bg-emerald-700 text-white px-5 py-1.5 rounded-full shadow-sm" },
            React.createElement(Icon, { name: "file-text", size: 12 }),
            React.createElement("h3", { className: "font-black text-[11px]" }, title)),
        subtitle && React.createElement("p", { className: "text-[10px] text-gray-400 mt-2 font-bold" }, subtitle),
        React.createElement("div", { className: "h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent mt-4" })));
    // صندوق إحصائية بحجم أكبر مخصص لقوالب التصدير العريضة (وليس لبطاقة الجوال الصغيرة)
    const ExportStatBox = ({ label, value, color, icon, sub }) => (React.createElement("div", { className: `avoid-break rounded-2xl text-center ${color}`, style: { padding: '16px 8px' } },
        icon && React.createElement(Icon, { name: icon, size: 20, className: "mx-auto mb-1 opacity-80" }),
        React.createElement("p", { className: "text-[12px] font-bold opacity-80" }, label),
        React.createElement("p", { className: "text-[30px] font-black leading-none mt-2" }, value),
        sub && React.createElement("p", { className: "text-[11px] font-bold opacity-80 mt-2" }, sub)));
    // إطار موحّد لكل الصور/PDF المُصدّرة: رأس بهوية التطبيق (الشعار + الاسم + الحلقة) ثم عنوان التقرير والمحتوى والتذييل
    const ExportFrame = ({ title, chip, periodText, children }) => (React.createElement("div", { dir: "rtl", className: "bg-white", style: { width: '840px', fontFamily: "'Tajawal','Noto Sans Arabic','Noto Kufi Arabic',sans-serif", lineHeight: 1.5, color: '#1f2937' } },
        React.createElement("div", { style: { padding: '14px' } },
            React.createElement("div", { className: "bg-white", style: { border: '2px solid #047857', borderRadius: '26px', overflow: 'hidden' } },
                React.createElement("div", { className: "bg-gradient-to-l from-emerald-800 via-emerald-700 to-teal-600 text-white", style: { padding: '26px 34px' } },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "flex items-center", style: { gap: '16px' } },
                            React.createElement("div", { style: { borderRadius: '24px', padding: '4px', background: 'rgba(255,255,255,0.22)' } },
                                React.createElement(Logo, { size: 68 })),
                            React.createElement("div", null,
                                React.createElement("h1", { className: "font-black leading-none", style: { fontSize: '34px' } }, "\u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                                React.createElement("p", { className: "font-bold text-emerald-100", style: { fontSize: '13px', marginTop: '8px' } }, "\u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u062D\u0644\u0642\u0627\u062A \u062A\u062D\u0641\u064A\u0638 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645"))),
                        React.createElement("div", { style: { background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', borderRadius: '18px', padding: '10px 20px', textAlign: 'right' } },
                            React.createElement("p", { style: { fontSize: '11px', opacity: 0.8 } }, "\u0627\u0644\u062D\u0644\u0642\u0629"),
                            React.createElement("p", { className: "font-black", style: { fontSize: '19px' } }, settings.halakaName),
                            React.createElement("p", { style: { fontSize: '11.5px', opacity: 0.9, marginTop: '2px' } },
                                "\u0628\u0625\u0634\u0631\u0627\u0641: ",
                                settings.teacherName)))),
                React.createElement("div", { className: "bg-gradient-to-l from-yellow-400 via-yellow-300 to-yellow-500", style: { height: '5px' } }),
                React.createElement("div", { className: "avoid-break text-center", style: { padding: '28px 34px 4px' } },
                    React.createElement("h2", { className: "font-black text-emerald-900", style: { fontSize: '27px' } }, title),
                    React.createElement("div", { className: "flex items-center justify-center", style: { gap: '10px', marginTop: '12px' } },
                        chip && React.createElement("span", { className: "font-black bg-emerald-700 text-white", style: { fontSize: '12px', padding: '5px 16px', borderRadius: '999px' } }, chip),
                        periodText && React.createElement("span", { className: "font-bold text-gray-500 bg-gray-100", style: { fontSize: '12px', padding: '5px 16px', borderRadius: '999px' } }, periodText))),
                React.createElement("div", { style: { padding: '20px 34px 26px' } },
                    children,
                    React.createElement("div", { className: "avoid-break", style: { marginTop: '34px', paddingTop: '22px', borderTop: '2px dotted #d1d5db' } },
                        React.createElement("div", { className: "flex justify-between items-end text-gray-400", style: { fontSize: '12px' } },
                            React.createElement("div", { className: "text-right" },
                                React.createElement("p", { className: "font-bold text-gray-500" }, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0635\u062F\u0627\u0631"),
                                React.createElement("p", { style: { marginTop: '2px' } }, new Date().toLocaleDateString('ar-EG'))),
                            React.createElement("div", { className: "text-center" },
                                React.createElement("div", { style: { width: '68px', height: '68px', borderRadius: '999px', border: '2px dashed #d1d5db', margin: '0 auto 6px' } }),
                                React.createElement("p", { style: { borderTop: '1px solid #d1d5db', paddingTop: '4px', width: '150px' } }, "\u062A\u0648\u0642\u064A\u0639 \u0627\u0644\u0645\u0639\u0644\u0645 / \u0627\u0644\u0645\u0634\u0631\u0641"))))),
                React.createElement("div", { className: "avoid-break bg-emerald-50 text-center", style: { padding: '12px 20px', borderTop: '1px solid #d1fae5' } },
                    React.createElement("p", { className: "font-bold text-emerald-800", style: { fontSize: '11.5px' } }, "\u062A\u0645 \u0625\u0635\u062F\u0627\u0631 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0622\u0644\u064A\u0627\u064B \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                    React.createElement("p", { className: "font-bold text-emerald-700 opacity-70", style: { fontSize: '10.5px', marginTop: '2px' } },
                        "\u062A\u0637\u0648\u064A\u0631: \u0633\u064A\u0641 \u0627\u0644\u062F\u064A\u0646 \u0645\u0643\u064A\u0629 \u2014 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \u00A9 ",
                        new Date().getFullYear()))))));
    const StatBox = ({ label, value, color, icon }) => (React.createElement("div", { className: `avoid-break rounded-2xl py-3 px-1.5 text-center shadow-sm min-w-0 ${color}` },
        icon && React.createElement(Icon, { name: icon, size: 14, className: "mx-auto mb-1 opacity-80" }),
        React.createElement("p", { className: "text-[9.5px] font-bold opacity-80 leading-snug min-h-[26px] flex items-center justify-center break-words" }, label),
        React.createElement("p", { className: "text-lg font-black mt-1 leading-none" }, value)));
    const ReportFooter = () => (React.createElement("div", { className: "avoid-break" },
        React.createElement("div", { className: "flex justify-between items-end pt-6 mt-5 border-t-2 border-dotted border-gray-200 text-[9px] text-gray-400" },
            React.createElement("div", { className: "text-right" },
                React.createElement("p", { className: "font-bold" }, "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0625\u0635\u062F\u0627\u0631"),
                React.createElement("p", null, new Date().toLocaleDateString('ar-EG'))),
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-1 mx-auto" },
                    React.createElement(Icon, { name: "shield-check", size: 16, className: "text-gray-300" })),
                React.createElement("p", { className: "border-t border-gray-300 pt-1 w-24" }, "\u062A\u0648\u0642\u064A\u0639 \u0627\u0644\u0645\u0639\u0644\u0645 / \u0627\u0644\u0645\u0634\u0631\u0641"))),
        React.createElement("p", { className: "text-center text-[8px] text-gray-300 font-bold mt-3" }, "\u062A\u0645 \u0625\u0635\u062F\u0627\u0631 \u0647\u0630\u0627 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0622\u0644\u064A\u0627\u064B \u0639\u0628\u0631 \u0646\u0638\u0627\u0645 \u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
        React.createElement("p", { className: "text-center text-[8px] text-gray-300 font-bold mt-1" },
            "\u062A\u0637\u0648\u064A\u0631: \u0633\u064A\u0641 \u0627\u0644\u062F\u064A\u0646 \u0645\u0643\u064A\u0629 \u2014 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \u00A9 ",
            new Date().getFullYear())));
    const handleRedeemPoints = (e) => {
        e.preventDefault();
        const pointsToRedeem = parseInt(e.target.pointsAmount.value);
        const note = e.target.redeemNote.value || 'صرف مكافأة / رحلة';
        if (!pointsToRedeem || pointsToRedeem <= 0)
            return notify("يرجى إدخال عدد نقاط صحيح");
        const currentPoints = getStudentPoints(selectedStudentId);
        if (pointsToRedeem > currentPoints) {
            return notify(`رصيد النقاط غير كافٍ! رصيد الطالب الحالي هو ${currentPoints} نقطة.`);
        }
        addPointsTransaction(selectedStudentId, -pointsToRedeem, 'redeem', `صرف ${pointsToRedeem} نقطة: ${note}`);
        e.target.reset();
        notify("تم صرف النقاط بنجاح وتسجيل الحركة.");
    };
    // إعادة الضبط: تحذف فقط التسجيلات اليومية (الحضور/الحفظ/المراجعة) في كل الأيام
    // ولا تمس أسماء الطلاب أو أرصدة النقاط أو إعدادات الحلقة إطلاقاً
    const performFullReset = () => {
        setSessions([]);
        setSelectedSessionDate(todayKey);
        setShowResetModal(false);
        setResetConfirmText('');
        notify("تم حذف كل التسجيلات اليومية بنجاح. أسماء الطلاب وأرصدة النقاط والإعدادات لم تتأثر.");
    };
    // دالة تصدير البيانات (النسخ الاحتياطي)
    const exportData = async () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data)
            return notify("لا توجد بيانات لتصديرها");
        try {
            const blob = new Blob([data], { type: "application/json" });
            await shareFile(blob, `halaqati_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json', 'نسخة احتياطية - حلقتي');
        }
        catch (err) {
            if (!(err && err.name === 'AbortError'))
                notify("تعذّر حفظ النسخة الاحتياطية، حاول مرة أخرى.");
        }
    };
    // دالة استيراد البيانات (الاستعادة): تستبدل كل بيانات الجهاز بمحتوى النسخة الاحتياطية
    const importData = (e) => {
        const file = e.target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                if (!parsed || !Array.isArray(parsed.students)) {
                    notify("ملف النسخة الاحتياطية غير صالح أو تالف.");
                    return;
                }
                if (!confirm("سيتم استبدال كل البيانات الموجودة على هذا الجهاز ببيانات النسخة الاحتياطية. هل تريد المتابعة؟"))
                    return;
                const restored = {
                    students: parsed.students,
                    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
                    transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
                    settings: parsed.settings || settings,
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
                notify("تم استعادة البيانات بنجاح! سيتم تحديث الصفحة.");
                setTimeout(() => window.location.reload(), 1200);
            }
            catch (error) {
                notify("حدث خطأ أثناء قراءة الملف.");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };
    return (React.createElement("div", { className: "max-w-md mx-auto min-h-screen pb-24 relative" },
        React.createElement("header", { className: `bg-emerald-700 text-white shadow-lg no-print ${activeTab === 'dashboard' ? 'px-6 pb-6 rounded-b-[40px]' : 'px-5 pb-3 rounded-b-[28px]'}`, style: { paddingTop: activeTab === 'dashboard' ? 'max(1.5rem, env(safe-area-inset-top))' : 'max(0.75rem, env(safe-area-inset-top))' } },
            React.createElement("div", { className: `flex justify-between items-center ${activeTab === 'dashboard' ? 'mb-4' : ''}` },
                React.createElement("button", { onClick: () => setShowDrawer(true), "aria-label": "\u0641\u062A\u062D \u0627\u0644\u0642\u0627\u0626\u0645\u0629", className: "bg-white/20 p-2.5 rounded-full" },
                    React.createElement(Icon, { name: "menu", size: 22 })),
                React.createElement("div", { className: "text-center flex-1 px-2 min-w-0" },
                    React.createElement("h1", { className: `${activeTab === 'dashboard' ? 'text-2xl' : 'text-xl'} font-black` }, "\u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                    React.createElement("p", { className: "text-emerald-100 text-xs opacity-80 truncate" },
                        settings.halakaName,
                        " - \u0628\u0625\u0634\u0631\u0627\u0641 ",
                        settings.teacherName)),
                React.createElement(Logo, { size: activeTab === 'dashboard' ? 44 : 38 })),
            activeTab === 'dashboard' && (React.createElement("div", { className: "bg-white/10 p-3 rounded-2xl flex justify-between items-center" },
                React.createElement("span", { className: "text-sm font-bold" }, getTodayDate()),
                React.createElement(Icon, { name: "calendar", size: 18 })))),
        React.createElement("main", { className: "p-4 mt-2" },
            activeTab === 'dashboard' && (React.createElement("div", { className: "space-y-4" },
                students.length === 0 && !guideSeen && (React.createElement("div", { className: "bg-gradient-to-l from-emerald-700 to-teal-600 text-white rounded-3xl p-5 flex items-center gap-4 shadow-lg" },
                    React.createElement(Logo, { size: 52 }),
                    React.createElement("div", { className: "flex-1 min-w-0" },
                        React.createElement("h4", { className: "font-black text-base" }, "\u0623\u0647\u0644\u0627\u064B \u0628\u0643 \u0641\u064A \u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                        React.createElement("p", { className: "text-[11.5px] text-emerald-100 font-bold mt-1 leading-relaxed" }, "\u062A\u0639\u0631\u0651\u0641 \u0639\u0644\u0649 \u062E\u0637\u0648\u0627\u062A \u0627\u0644\u0628\u062F\u0621 \u0645\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062D\u0644\u0642\u0629 \u062D\u062A\u0649 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631."),
                        React.createElement("div", { className: "flex gap-2 mt-3" },
                            React.createElement("button", { onClick: () => { markGuideSeen(); setActiveTab('guide'); }, className: "bg-white text-emerald-700 font-black text-xs px-4 py-2 rounded-full" }, "\u0627\u0628\u062F\u0623 \u0627\u0644\u062F\u0644\u064A\u0644"),
                            React.createElement("button", { onClick: markGuideSeen, className: "bg-white/15 text-white font-bold text-xs px-4 py-2 rounded-full" }, "\u062A\u062E\u0637\u064A"))))),
                (() => {
                    const total = stats.totalStudents;
                    const recorded = stats.presentToday + stats.lateToday + stats.excusedToday + stats.unexcusedToday;
                    const pct = total > 0 ? Math.min(100, Math.round((recorded / total) * 100)) : 0;
                    const done = total > 0 && recorded >= total;
                    if (total === 0) {
                        return (React.createElement("div", { className: "bg-white rounded-3xl card-shadow border border-emerald-100 p-6 text-center space-y-3" },
                            React.createElement("div", { className: "w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center" },
                                React.createElement(Icon, { name: "user-plus", size: 26 })),
                            React.createElement("h4", { className: "font-black text-emerald-900 text-base" }, "\u0627\u0628\u062F\u0623 \u0628\u0625\u0636\u0627\u0641\u0629 \u0637\u0644\u0627\u0628 \u062D\u0644\u0642\u062A\u0643"),
                            React.createElement("p", { className: "text-xs text-gray-500 font-bold leading-relaxed" }, "\u0623\u0636\u0641 \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0637\u0644\u0627\u0628 \u0623\u0648\u0644\u0627\u064B\u060C \u062B\u0645 \u0633\u062C\u0651\u0644 \u062D\u0636\u0648\u0631\u0647\u0645 \u0648\u0642\u0631\u0627\u0621\u062A\u0647\u0645 \u0641\u064A \u0643\u0644 \u062C\u0644\u0633\u0629."),
                            React.createElement("button", { onClick: () => setActiveTab('students'), className: "bg-emerald-600 text-white px-6 py-2.5 rounded-full font-black text-sm shadow-md" }, "\u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0644 \u0637\u0627\u0644\u0628")));
                    }
                    return (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "bg-gradient-to-l from-emerald-700 to-teal-600 text-white rounded-3xl p-5 shadow-lg space-y-3" },
                            React.createElement("div", { className: "flex items-center justify-between gap-3" },
                                React.createElement("div", { className: "min-w-0" },
                                    React.createElement("h4", { className: "font-black text-base" }, "\u062C\u0644\u0633\u0629 \u0627\u0644\u064A\u0648\u0645"),
                                    React.createElement("p", { className: "text-[12px] text-emerald-100 font-bold mt-0.5" }, done ? 'اكتمل تسجيل جميع الطلاب' : recorded === 0 ? 'لم يُسجَّل أحد بعد' : `سُجّل ${recorded} من ${total} طالب`)),
                                React.createElement("button", { onClick: () => setActiveTab('session'), className: "shrink-0 bg-white text-emerald-700 px-5 py-2.5 rounded-full font-black text-sm shadow-md" }, done ? 'مراجعة' : recorded === 0 ? 'ابدأ الآن' : 'أكمل')),
                            React.createElement("div", { className: "h-2 rounded-full bg-white/20 overflow-hidden", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": pct, "aria-label": "\u062A\u0642\u062F\u0645 \u062A\u0633\u062C\u064A\u0644 \u062C\u0644\u0633\u0629 \u0627\u0644\u064A\u0648\u0645" },
                                React.createElement("div", { className: "h-full rounded-full bg-yellow-300 transition-all", style: { width: pct + '%' } }))),
                        React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                            React.createElement(KpiCard, { label: "\u0627\u0644\u062D\u0636\u0648\u0631 \u0627\u0644\u064A\u0648\u0645", value: stats.presentToday, hint: "\u0633\u064F\u062C\u0651\u0644\u0648\u0627 \u062D\u0627\u0636\u0631\u064A\u0646", icon: "check-circle", accent: "blue" }),
                            React.createElement(KpiCard, { label: "\u0627\u0644\u0645\u062A\u0623\u062E\u0631\u0648\u0646 \u0627\u0644\u064A\u0648\u0645", value: stats.lateToday, hint: "\u0633\u064F\u062C\u0651\u0644\u0648\u0627 \u0645\u062A\u0623\u062E\u0631\u064A\u0646", icon: "clock", accent: "amber" }),
                            React.createElement(KpiCard, { label: "\u063A\u064A\u0627\u0628 \u0628\u0639\u0630\u0631", value: stats.excusedToday, hint: "\u0633\u064F\u062C\u0651\u0644\u0648\u0627 \u063A\u0627\u0626\u0628\u064A\u0646 \u0628\u0639\u0630\u0631", icon: "user-x", accent: "orange" }),
                            React.createElement(KpiCard, { label: "\u063A\u064A\u0627\u0628 \u0628\u063A\u064A\u0631 \u0639\u0630\u0631", value: stats.unexcusedToday, hint: "\u0633\u064F\u062C\u0651\u0644\u0648\u0627 \u063A\u0627\u0626\u0628\u064A\u0646 \u0628\u062F\u0648\u0646 \u0639\u0630\u0631", icon: "user-x", accent: "red" })),
                        React.createElement("button", { onClick: () => setActiveTab('students'), className: "w-full bg-white rounded-2xl card-shadow border border-gray-100 p-4 flex items-center justify-between" },
                            React.createElement("span", { className: "flex items-center gap-3" },
                                React.createElement("span", { className: "w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center" },
                                    React.createElement(Icon, { name: "users", size: 18 })),
                                React.createElement("span", { className: "text-sm font-black text-gray-700" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0637\u0644\u0627\u0628")),
                            React.createElement("span", { className: "flex items-center gap-2" },
                                React.createElement("span", { className: "text-xl font-black text-emerald-700" }, total),
                                React.createElement(Icon, { name: "chevron-left", size: 16, className: "text-gray-300" })))));
                })())),
            activeTab === 'session' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "flex justify-between items-center mb-2" },
                    React.createElement("div", null,
                        React.createElement("h3", { className: "font-black text-gray-800 text-lg" }, selectedSessionDate === todayKey ? 'تسجيل الجلسة اليومية' : 'تعديل سجل يوم سابق'),
                        React.createElement("p", { className: "text-[11px] text-gray-400 font-bold" }, formatDisplayDateShort(selectedSessionDate))),
                    React.createElement("button", { onClick: () => copySessionReport(selectedSessionDate), className: "text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1" },
                        React.createElement(Icon, { name: "share-2", size: 14 }),
                        " \u0646\u0633\u062E \u0627\u0644\u062A\u0642\u0631\u064A\u0631")),
                React.createElement("div", { className: "relative no-print" },
                    React.createElement("span", { className: "absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none" },
                        React.createElement(Icon, { name: "search", size: 16 })),
                    React.createElement("input", { type: "text", value: sessionSearchQuery, onChange: (e) => setSessionSearchQuery(e.target.value), placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0637\u0627\u0644\u0628...", "aria-label": "\u0627\u0628\u062D\u062B \u0639\u0646 \u0637\u0627\u0644\u0628", className: "w-full h-10 bg-white border border-gray-100 card-shadow rounded-2xl pr-10 pl-10 text-sm font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-400" }),
                    sessionSearchQuery && (React.createElement("button", { onClick: () => setSessionSearchQuery(''), "aria-label": "\u0645\u0633\u062D \u0627\u0644\u0628\u062D\u062B", className: "absolute inset-y-0 left-2 flex items-center px-1 text-gray-400 hover:text-red-500" },
                        React.createElement(Icon, { name: "x", size: 16 })))),
                React.createElement("div", { className: "flex items-center justify-between bg-white rounded-2xl p-2 border border-gray-100 card-shadow no-print" },
                    React.createElement("button", { onClick: goPrevDate, disabled: !canGoPrevDate, className: `p-2 rounded-xl transition-colors ${canGoPrevDate ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-200'}` },
                        React.createElement(Icon, { name: "chevron-right", size: 18 })),
                    React.createElement("button", { onClick: () => setShowSessionHistory(true), className: "flex-1 flex items-center justify-center gap-2 text-xs font-black text-gray-600 py-1" },
                        React.createElement(Icon, { name: "calendar", size: 14, className: "text-emerald-600" }),
                        "\u062A\u0635\u0641\u062D \u0633\u062C\u0644 \u0627\u0644\u0623\u064A\u0627\u0645"),
                    React.createElement("button", { onClick: goNextDate, disabled: !canGoNextDate, className: `p-2 rounded-xl transition-colors ${canGoNextDate ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-200'}` },
                        React.createElement(Icon, { name: "chevron-left", size: 18 }))),
                selectedSessionDate !== todayKey && (React.createElement("div", { className: "flex items-center justify-between bg-orange-50 border border-orange-100 rounded-2xl p-3 no-print flex-wrap gap-2" },
                    React.createElement("span", { className: "text-[11px] font-bold text-orange-700 flex items-center gap-1" },
                        React.createElement(Icon, { name: "info", size: 13 }),
                        " \u0623\u0646\u062A \u062A\u0639\u0631\u0636/\u062A\u0639\u062F\u0651\u0644 \u0633\u062C\u0644 \u064A\u0648\u0645 \u0633\u0627\u0628\u0642"),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", { onClick: () => setSelectedSessionDate(todayKey), className: "text-[11px] font-black bg-white text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200" }, "\u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u064A\u0648\u0645"),
                        React.createElement("button", { onClick: () => confirmDeleteDay(selectedSessionDate), className: "text-[11px] font-black bg-white text-red-600 px-3 py-1.5 rounded-full border border-red-200" }, "\u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645")))),
                students.filter(s => s.active).length === 0 && (React.createElement("p", { className: "text-center text-gray-400 py-10" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0645\u0636\u0627\u0641\u064A\u0646 \u062D\u0627\u0644\u064A\u0627\u064B")),
                students.filter(s => s.active).length > 0 && sessionStudents.length === 0 && (React.createElement("p", { className: "text-center text-xs text-gray-400 py-8" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C \u0645\u0637\u0627\u0628\u0642\u0629")),
                sessionStudents.map(student => {
                    const record = getRecord(student.id);
                    const dayPoints = getStudentPointsForDate(student.id, selectedSessionDate);
                    return (React.createElement("div", { key: student.id, className: "bg-white p-4 rounded-3xl card-shadow border border-gray-100 space-y-4 relative" },
                        React.createElement("div", { className: "flex flex-col gap-3" },
                            React.createElement("div", { className: "flex justify-between items-center" },
                                React.createElement("h4", { className: "font-black text-emerald-800" }, student.name),
                                React.createElement("div", { className: "flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-200" },
                                    selectedSessionDate === todayKey && (React.createElement("button", { onClick: () => addPointsTransaction(student.id, 1, 'add', 'إضافة يومية'), className: "text-emerald-600 hover:bg-emerald-100 p-1 rounded-full transition-colors" },
                                        React.createElement(Icon, { name: "plus", size: 16 }))),
                                    React.createElement("span", { className: "text-sm font-black w-6 text-center", dir: "ltr", style: { color: dayPoints < 0 ? '#ef4444' : (dayPoints > 0 ? '#059669' : '#9ca3af') } }, dayPoints),
                                    selectedSessionDate === todayKey && (React.createElement("button", { onClick: () => addPointsTransaction(student.id, -1, 'deduct', 'خصم يومي'), className: "text-red-500 hover:bg-red-100 p-1 rounded-full transition-colors" },
                                        React.createElement(Icon, { name: "minus", size: 16 }))))),
                            React.createElement("div", { className: "flex gap-1" },
                                React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'status', 'present'), className: `px-2 py-1.5 flex-1 rounded-xl text-xs font-bold transition-all ${record.status === 'present' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u062D\u0627\u0636\u0631"),
                                React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'status', 'late'), className: `px-2 py-1.5 flex-1 rounded-xl text-xs font-bold transition-all ${record.status === 'late' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u0645\u062A\u0623\u062E\u0631"),
                                React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'status', 'absent'), className: `px-2 py-1.5 flex-1 rounded-xl text-xs font-bold transition-all ${record.status === 'absent' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u063A\u0627\u0626\u0628"),
                                React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'status', 'absent_excused'), className: `px-2 py-1.5 flex-1 rounded-xl text-xs font-bold transition-all ${record.status === 'absent_excused' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u0628\u0639\u0630\u0631"),
                                record.status !== 'none' && (React.createElement("button", { onClick: () => clearStudentRecordForDate(student.id, selectedSessionDate), title: "\u0645\u0633\u062D \u062A\u0633\u062C\u064A\u0644 \u0647\u0630\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 \u0644\u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645", className: "px-2 py-1.5 rounded-xl text-gray-400 bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-all" },
                                    React.createElement(Icon, { name: "x", size: 14 }))))),
                        (record.status === 'present' || record.status === 'late') && (React.createElement("div", { className: "grid grid-cols-1 gap-4 pt-3 border-t border-gray-50" },
                            React.createElement("div", null,
                                React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0627\u0644\u062D\u0641\u0638 \u0627\u0644\u064A\u0648\u0645\u064A"),
                                React.createElement("div", { className: "flex gap-2" },
                                    React.createElement("input", { type: "number", step: "0.25", min: "0", className: "w-20 bg-gray-50 border-none rounded-xl p-2 text-sm text-center font-black text-emerald-700 focus:ring-1 focus:ring-emerald-500", placeholder: "\u0635\u0641\u062D\u0627\u062A", value: record.hifzPages, onChange: (e) => saveSessionRecord(student.id, 'hifzPages', e.target.value) }),
                                    React.createElement("input", { className: "flex-1 bg-gray-50 border-none rounded-xl p-2 text-sm focus:ring-1 focus:ring-emerald-500", placeholder: "\u0645\u0644\u0627\u062D\u0638\u0629\u060C \u0645\u062B\u0627\u0644: \u0645\u0646 \u0633\u0648\u0631\u0629 \u0627\u0644\u0645\u0644\u0643", value: record.hifzNote, onChange: (e) => saveSessionRecord(student.id, 'hifzNote', e.target.value) })),
                                React.createElement("div", { className: "flex gap-1 mt-1.5" },
                                    React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'hifzPassed', 'yes'), className: `px-3 py-1 flex-1 rounded-lg text-[11px] font-black transition-all ${record.hifzPassed === 'yes' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}` }, "\u2713 \u0646\u0627\u062C\u062D"),
                                    React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'hifzPassed', 'no'), className: `px-3 py-1 flex-1 rounded-lg text-[11px] font-black transition-all ${record.hifzPassed === 'no' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}` }, "\u2717 \u0625\u0639\u0627\u062F\u0629"))),
                            React.createElement("div", null,
                                React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"),
                                React.createElement("div", { className: "flex gap-2" },
                                    React.createElement("input", { type: "number", step: "0.25", min: "0", className: "w-20 bg-gray-50 border-none rounded-xl p-2 text-sm text-center font-black text-emerald-700 focus:ring-1 focus:ring-emerald-500", placeholder: "\u0635\u0641\u062D\u0627\u062A", value: record.reviewPages, onChange: (e) => saveSessionRecord(student.id, 'reviewPages', e.target.value) }),
                                    React.createElement("input", { className: "flex-1 bg-gray-50 border-none rounded-xl p-2 text-sm focus:ring-1 focus:ring-emerald-500", placeholder: "\u0645\u0644\u0627\u062D\u0638\u0629\u060C \u0645\u062B\u0627\u0644: \u062C\u0632\u0621 \u0639\u0645", value: record.reviewNote, onChange: (e) => saveSessionRecord(student.id, 'reviewNote', e.target.value) })),
                                React.createElement("div", { className: "flex gap-1 mt-1.5" },
                                    React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'reviewPassed', 'yes'), className: `px-3 py-1 flex-1 rounded-lg text-[11px] font-black transition-all ${record.reviewPassed === 'yes' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}` }, "\u2713 \u0646\u0627\u062C\u062D"),
                                    React.createElement("button", { onClick: () => saveSessionRecord(student.id, 'reviewPassed', 'no'), className: `px-3 py-1 flex-1 rounded-lg text-[11px] font-black transition-all ${record.reviewPassed === 'no' ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400'}` }, "\u2717 \u0625\u0639\u0627\u062F\u0629"))),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement("label", { className: "text-[10px] font-black text-gray-400" }, "\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0639\u0627\u0645:"),
                                React.createElement("select", { className: "bg-gray-50 text-xs font-bold rounded-lg p-1 outline-none text-emerald-700", value: record.rating || 'جيد', onChange: (e) => saveSessionRecord(student.id, 'rating', e.target.value) },
                                    React.createElement("option", null, "\u0645\u0645\u062A\u0627\u0632"),
                                    React.createElement("option", null, "\u062C\u064A\u062F \u062C\u062F\u0627\u064B"),
                                    React.createElement("option", null, "\u062C\u064A\u062F"),
                                    React.createElement("option", null, "\u064A\u062D\u062A\u0627\u062C \u0645\u062A\u0627\u0628\u0639\u0629")))))));
                }))),
            activeTab === 'students' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "bg-white p-6 rounded-3xl card-shadow border border-gray-100" },
                    React.createElement("h3", { className: "font-black text-gray-800 mb-4" }, "\u0625\u0636\u0627\u0641\u0629 \u0637\u0627\u0644\u0628 \u062C\u062F\u064A\u062F"),
                    React.createElement("form", { onSubmit: addStudent, className: "space-y-3" },
                        React.createElement("input", { name: "studentName", required: true, className: "w-full bg-gray-50 border-none rounded-2xl p-3 text-sm", placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u0643\u0627\u0645\u0644..." }),
                        React.createElement("input", { name: "parentPhone", className: "w-full bg-gray-50 border-none rounded-2xl p-3 text-sm text-right", placeholder: "\u0631\u0642\u0645 \u0648\u0644\u064A \u0627\u0644\u0623\u0645\u0631 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)", dir: "ltr" }),
                        React.createElement("button", { className: "w-full bg-emerald-600 text-white font-black py-3 rounded-2xl shadow-lg shadow-emerald-200" }, "\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0637\u0627\u0644\u0628"))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("h3", { className: "font-black text-gray-800 px-2 mt-4" }, "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0637\u0644\u0627\u0628"),
                    students.map(s => (React.createElement("div", { key: s.id, className: "bg-white p-4 rounded-3xl card-shadow border border-gray-100 flex justify-between items-center" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: `w-10 h-10 rounded-full flex items-center justify-center font-black ${s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}` }, s.name[0]),
                            React.createElement("div", null,
                                React.createElement("p", { className: `font-black ${!s.active ? 'text-gray-400 line-through' : 'text-gray-800'}` }, s.name),
                                React.createElement("p", { className: "text-[10px] text-gray-400" }, s.phone || 'بدون هاتف'))),
                        React.createElement("div", { className: "flex gap-2" },
                            React.createElement("button", { onClick: () => toggleStudentStatus(s.id), className: `p-2 rounded-xl ${s.active ? 'text-orange-500 bg-orange-50' : 'text-emerald-500 bg-emerald-50'}` },
                                React.createElement(Icon, { name: s.active ? "pause" : "play", size: 16 })),
                            React.createElement("button", { onClick: () => deleteStudent(s.id), className: "p-2 rounded-xl text-red-500 bg-red-50" },
                                React.createElement(Icon, { name: "trash-2", size: 16 }))))))))),
            activeTab === 'reports' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("h3", { className: "font-black text-gray-800 text-lg px-2 no-print" }, "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631"),
                React.createElement("div", { className: "bg-white p-6 rounded-3xl card-shadow border border-gray-100 space-y-5" },
                    React.createElement("h4", { className: "font-black text-gray-800 border-b border-gray-100 pb-3 no-print" }, "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0631\u0633\u0645\u064A\u0629"),
                    !reportSection && (React.createElement("div", { className: "space-y-3 no-print" },
                        React.createElement("button", { onClick: () => setReportSection('points'), className: "w-full flex items-center justify-between p-4 rounded-2xl border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors" },
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement("div", { className: "bg-amber-500 text-white p-2.5 rounded-xl" },
                                    React.createElement(Icon, { name: "award", size: 20 })),
                                React.createElement("div", { className: "text-right" },
                                    React.createElement("p", { className: "font-black text-amber-800 text-sm" }, "\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0646\u0642\u0627\u0637"),
                                    React.createElement("p", { className: "text-[10px] text-gray-500" }, "\u0623\u0631\u0635\u062F\u0629 \u0646\u0642\u0627\u0637 \u0643\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 (\u0646\u0633\u062E \u0623\u0648 \u0635\u0648\u0631\u0629 \u0623\u0648 PDF)"))),
                            React.createElement(Icon, { name: "chevron-left", size: 18, className: "text-amber-600" })),
                        React.createElement("button", { onClick: () => setReportSection('halaqa'), className: "w-full flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors" },
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement("div", { className: "bg-emerald-600 text-white p-2.5 rounded-xl" },
                                    React.createElement(Icon, { name: "bar-chart-3", size: 20 })),
                                React.createElement("div", { className: "text-right" },
                                    React.createElement("p", { className: "font-black text-emerald-900 text-sm" }, "\u062A\u0642\u0631\u064A\u0631 \u0623\u062F\u0627\u0621 \u0627\u0644\u062D\u0644\u0642\u0629 \u0627\u0644\u0634\u0627\u0645\u0644"),
                                    React.createElement("p", { className: "text-[10px] text-gray-500" }, "\u0623\u062F\u0627\u0621 \u0643\u0644 \u0627\u0644\u0637\u0644\u0627\u0628 \u0645\u062C\u062A\u0645\u0639\u064A\u0646 \u062E\u0644\u0627\u0644 \u0641\u062A\u0631\u0629 \u0645\u062D\u062F\u062F\u0629"))),
                            React.createElement(Icon, { name: "chevron-left", size: 18, className: "text-emerald-600" })),
                        React.createElement("button", { onClick: () => setReportSection('student'), className: "w-full flex items-center justify-between p-4 rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors" },
                            React.createElement("div", { className: "flex items-center gap-3" },
                                React.createElement("div", { className: "bg-blue-600 text-white p-2.5 rounded-xl" },
                                    React.createElement(Icon, { name: "user-circle", size: 20 })),
                                React.createElement("div", { className: "text-right" },
                                    React.createElement("p", { className: "font-black text-blue-900 text-sm" }, "\u062A\u0642\u0631\u064A\u0631 \u0623\u062F\u0627\u0621 \u0627\u0644\u0637\u0627\u0644\u0628"),
                                    React.createElement("p", { className: "text-[10px] text-gray-500" }, "\u062A\u0642\u0631\u064A\u0631 \u0625\u062C\u0645\u0627\u0644\u064A \u0623\u0648 \u062A\u0641\u0635\u064A\u0644\u064A \u064A\u0648\u0645\u064A \u0644\u0637\u0627\u0644\u0628 \u0648\u0627\u062D\u062F"))),
                            React.createElement(Icon, { name: "chevron-left", size: 18, className: "text-blue-600" })))),
                    reportSection === 'points' && (React.createElement("div", { className: "space-y-4" },
                        React.createElement("button", { onClick: () => setReportSection(null), className: "flex items-center gap-1 text-xs font-black text-emerald-700 no-print" },
                            React.createElement(Icon, { name: "arrow-right", size: 14 }),
                            " \u0631\u062C\u0648\u0639 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631"),
                        React.createElement("div", { className: "grid grid-cols-3 gap-2" },
                            React.createElement(StatBox, { label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628", value: pointsRows.length, color: "bg-gray-100 text-gray-700", icon: "users" }),
                            React.createElement(StatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0646\u0642\u0627\u0637", value: pointsTotal, color: "bg-emerald-100 text-emerald-700", icon: "award" }),
                            React.createElement(StatBox, { label: "\u0623\u0639\u0644\u0649 \u0631\u0635\u064A\u062F", value: pointsMax, color: "bg-amber-100 text-amber-700", icon: "trophy" })),
                        React.createElement("div", { className: "space-y-2" },
                            pointsRows.map(pr => (React.createElement("div", { key: pr.student.id, onClick: () => { setSelectedStudentId(pr.student.id); setActiveTab('student_profile'); }, className: "flex justify-between items-center p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100" },
                                React.createElement("span", { className: "font-black text-sm text-gray-800" }, pr.student.name),
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement("span", { className: `px-3 py-1 rounded-full text-xs font-black ${pr.points < 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`, dir: "rtl" },
                                        pr.points,
                                        " \u0646\u0642\u0637\u0629"),
                                    React.createElement(Icon, { name: "chevron-right", size: 16, className: "text-gray-400" }))))),
                            pointsRows.length === 0 && (React.createElement("p", { className: "text-center text-xs text-gray-400 py-6" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0646\u0634\u0637\u0648\u0646 \u062D\u0627\u0644\u064A\u0627\u064B"))),
                        React.createElement("div", { className: "grid grid-cols-3 gap-2 no-print" },
                            React.createElement("button", { onClick: copyPointsReport, className: "bg-emerald-50 text-emerald-700 font-black py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-emerald-100 transition-colors text-xs" },
                                React.createElement(Icon, { name: "copy", size: 15 }),
                                " \u0646\u0633\u062E"),
                            React.createElement("button", { onClick: () => startExport('points', 'image', `تقرير-النقاط-${settings.halakaName}`, `تقرير نقاط ${settings.halakaName}`), disabled: exporting || !!exportJob, className: "bg-teal-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-teal-700 transition-colors text-xs disabled:opacity-50" },
                                React.createElement(Icon, { name: "image", size: 15 }),
                                " \u0635\u0648\u0631\u0629"),
                            React.createElement("button", { onClick: () => startExport('points', 'pdf', `تقرير-النقاط-${settings.halakaName}`, `تقرير نقاط ${settings.halakaName}`), disabled: exporting || !!exportJob, className: "bg-red-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-700 transition-colors text-xs disabled:opacity-50" },
                                React.createElement(Icon, { name: "file-text", size: 15 }),
                                " PDF")))),
                    reportSection === 'halaqa' && (React.createElement("div", { className: "space-y-4" },
                        React.createElement("div", { className: "space-y-4 no-print" },
                            React.createElement("button", { onClick: () => setReportSection(null), className: "flex items-center gap-1 text-xs font-black text-emerald-700" },
                                React.createElement(Icon, { name: "arrow-right", size: 14 }),
                                " \u0631\u062C\u0648\u0639 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631"),
                            React.createElement("div", { className: "flex gap-2" },
                                React.createElement("button", { onClick: () => setReportMode('monthly'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${reportMode === 'monthly' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u062A\u0642\u0631\u064A\u0631 \u0634\u0647\u0631\u064A"),
                                React.createElement("button", { onClick: () => setReportMode('custom'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${reportMode === 'custom' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u0641\u062A\u0631\u0629 \u0645\u062E\u0635\u0635\u0629")),
                            reportMode === 'monthly' ? (React.createElement("div", null,
                                React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u0634\u0647\u0631"),
                                React.createElement("input", { type: "month", value: reportMonth, onChange: (e) => setReportMonth(e.target.value), className: "w-full bg-gray-50 border-none rounded-xl p-3 text-sm" }))) : (React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                React.createElement("div", null,
                                    React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0645\u0646 \u062A\u0627\u0631\u064A\u062E"),
                                    React.createElement("input", { type: "date", value: reportFrom, onChange: (e) => setReportFrom(e.target.value), className: "w-full bg-gray-50 border-none rounded-xl p-3 text-sm" })),
                                React.createElement("div", null,
                                    React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0625\u0644\u0649 \u062A\u0627\u0631\u064A\u062E"),
                                    React.createElement("input", { type: "date", value: reportTo, onChange: (e) => setReportTo(e.target.value), className: "w-full bg-gray-50 border-none rounded-xl p-3 text-sm" })))),
                            React.createElement("div", { className: "flex gap-2" },
                                React.createElement("button", { onClick: () => setHalakaReportType('summary'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${halakaReportType === 'summary' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u0625\u062C\u0645\u0627\u0644\u064A"),
                                React.createElement("button", { onClick: () => setHalakaReportType('detailed'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${halakaReportType === 'detailed' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u062A\u0641\u0635\u064A\u0644\u064A (\u0643\u0644 \u0637\u0627\u0644\u0628)"))),
                        React.createElement("div", { className: "print-area p-1 rounded-3xl bg-gradient-to-br from-emerald-200 via-yellow-100 to-emerald-200" },
                            React.createElement("div", { ref: reportRef, className: "bg-white p-4 rounded-[20px]" },
                                React.createElement(ReportLetterhead, { title: halakaReportType === 'summary' ? 'تقرير أداء الحلقة - إجمالي' : 'تقرير أداء الحلقة - تفصيلي', subtitle: `الفترة: من ${getReportRange().from} إلى ${getReportRange().to}` }),
                                halakaReportType === 'summary' ? (React.createElement(React.Fragment, null,
                                    React.createElement("div", { className: "grid grid-cols-4 gap-2 mb-2" },
                                        React.createElement(StatBox, { label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628", value: periodReportData.length, color: "bg-gray-100 text-gray-700", icon: "users" }),
                                        React.createElement(StatBox, { label: "\u062D\u0636\u0648\u0631", value: overallTotals.presentTotal, color: "bg-emerald-100 text-emerald-700", icon: "check-circle" }),
                                        React.createElement(StatBox, { label: "\u062A\u0623\u062E\u0631", value: overallTotals.lateTotal, color: "bg-amber-100 text-amber-700", icon: "clock" }),
                                        React.createElement(StatBox, { label: "\u0628\u0639\u0630\u0631", value: overallTotals.excusedTotal, color: "bg-orange-100 text-orange-700", icon: "alert-circle" })),
                                    React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4" },
                                        React.createElement(StatBox, { label: "\u063A\u064A\u0627\u0628 \u0628\u062F\u0648\u0646 \u0639\u0630\u0631", value: overallTotals.absentTotal, color: "bg-red-100 text-red-700", icon: "x-circle" }),
                                        React.createElement(StatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062D\u0641\u0638", value: overallTotals.hifzTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "bookmark" }),
                                        React.createElement(StatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", value: overallTotals.reviewTotal, color: "bg-gradient-to-br from-teal-600 to-teal-800 text-white", icon: "repeat" })))) : (React.createElement(React.Fragment, null,
                                    React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4" },
                                        React.createElement(StatBox, { label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628", value: periodReportData.length, color: "bg-gray-100 text-gray-700", icon: "users" }),
                                        React.createElement(StatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062D\u0641\u0638", value: overallTotals.hifzTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "bookmark" }),
                                        React.createElement(StatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", value: overallTotals.reviewTotal, color: "bg-gradient-to-br from-teal-600 to-teal-800 text-white", icon: "repeat" })),
                                    React.createElement("table", { className: "w-full text-[9px] text-center border-collapse table-fixed border border-gray-200 rounded-xl overflow-hidden" },
                                        React.createElement("thead", null,
                                            React.createElement("tr", { className: "bg-gradient-to-l from-emerald-700 to-emerald-600 text-white" },
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '5%' } }, "#"),
                                                React.createElement("th", { className: "p-1.5 font-black text-right", style: { width: '22%' } }, "\u0627\u0644\u0637\u0627\u0644\u0628"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '9%' } }, "\u0627\u0644\u0623\u064A\u0627\u0645"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '10%' } }, "\u062D\u0636\u0648\u0631"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '9%' } }, "\u062A\u0623\u062E\u0631"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '9%' } }, "\u0628\u0639\u0630\u0631"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '10%' } }, "\u062F\u0648\u0646 \u0639\u0630\u0631"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '13%' } }, "\u0627\u0644\u062D\u0641\u0638"),
                                                React.createElement("th", { className: "p-1.5 font-black", style: { width: '13%' } }, "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"))),
                                        React.createElement("tbody", null,
                                            periodReportData.length === 0 && (React.createElement("tr", null,
                                                React.createElement("td", { colSpan: "9", className: "p-4 text-gray-400" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0645\u0636\u0627\u0641\u064A\u0646 \u062D\u0627\u0644\u064A\u0627\u064B"))),
                                            periodReportData.map((row, i) => (React.createElement("tr", { key: row.student.id, className: i % 2 === 0 ? 'bg-white' : 'bg-emerald-50/40' },
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 font-bold text-gray-400" }, i + 1),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 font-black text-emerald-900 text-right break-words" }, row.student.name),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100" }, row.totalDays),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-emerald-700 font-bold" }, row.presentCount),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-amber-600 font-bold" }, row.lateCount),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-orange-600 font-bold" }, row.excusedCount),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-red-600 font-bold" }, row.absentCount),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 font-bold" }, row.hifzTotal),
                                                React.createElement("td", { className: "p-1.5 border-t border-gray-100 font-bold" }, row.reviewTotal))))),
                                        periodReportData.length > 0 && (React.createElement("tfoot", null,
                                            React.createElement("tr", { className: "bg-emerald-100 font-black" },
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300", colSpan: "2" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300" }, overallTotals.presentTotal + overallTotals.lateTotal + overallTotals.absentTotal + overallTotals.excusedTotal),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300 text-emerald-700" }, overallTotals.presentTotal),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300 text-amber-600" }, overallTotals.lateTotal),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300 text-orange-600" }, overallTotals.excusedTotal),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300 text-red-600" }, overallTotals.absentTotal),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300" }, overallTotals.hifzTotal),
                                                React.createElement("td", { className: "p-1.5 border-t-2 border-emerald-300" }, overallTotals.reviewTotal))))))),
                                React.createElement(ReportFooter, null))),
                        React.createElement("div", { className: "grid grid-cols-2 gap-2 pt-1 no-print" },
                            React.createElement("button", { onClick: copyPeriodReport, className: "bg-emerald-50 text-emerald-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors text-xs" },
                                React.createElement(Icon, { name: "copy", size: 16 }),
                                " \u0646\u0633\u062E \u0646\u0635\u064A"),
                            React.createElement("button", { onClick: () => window.print(), className: "bg-blue-50 text-blue-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-xs" },
                                React.createElement(Icon, { name: "printer", size: 16 }),
                                " \u0637\u0628\u0627\u0639\u0629"),
                            React.createElement("button", { onClick: () => startExport('halaka', 'image', `تقرير-الحلقة-${settings.halakaName}`, `تقرير ${settings.halakaName}`), disabled: exporting || !!exportJob, className: "bg-teal-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors text-xs disabled:opacity-50" },
                                React.createElement(Icon, { name: "image", size: 16 }),
                                " \u0645\u0634\u0627\u0631\u0643\u0629 \u0643\u0635\u0648\u0631\u0629"),
                            React.createElement("button", { onClick: () => startExport('halaka', 'pdf', `تقرير-الحلقة-${settings.halakaName}`, `تقرير ${settings.halakaName}`), disabled: exporting || !!exportJob, className: "bg-red-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors text-xs disabled:opacity-50" },
                                React.createElement(Icon, { name: "file-text", size: 16 }),
                                " \u0645\u0634\u0627\u0631\u0643\u0629 PDF")))),
                    reportSection === 'student' && !selectedReportStudentId && (React.createElement("div", { className: "space-y-3 no-print" },
                        React.createElement("button", { onClick: () => { setReportSection(null); setStudentSearchQuery(''); }, className: "flex items-center gap-1 text-xs font-black text-emerald-700" },
                            React.createElement(Icon, { name: "arrow-right", size: 14 }),
                            " \u0631\u062C\u0648\u0639 \u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631"),
                        React.createElement("div", { className: "relative" },
                            React.createElement(Icon, { name: "search", size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" }),
                            React.createElement("input", { value: studentSearchQuery, onChange: (e) => setStudentSearchQuery(e.target.value), placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628...", className: "w-full bg-gray-50 border-none rounded-xl p-3 pr-9 text-sm" })),
                        React.createElement("div", { className: "space-y-2 max-h-96 overflow-y-auto" },
                            students.filter(s => s.active && s.name.includes(studentSearchQuery)).map(s => (React.createElement("div", { key: s.id, onClick: () => setSelectedReportStudentId(s.id), className: "flex justify-between items-center p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100" },
                                React.createElement("span", { className: "font-black text-sm text-gray-800" }, s.name),
                                React.createElement(Icon, { name: "chevron-left", size: 16, className: "text-gray-400" })))),
                            students.filter(s => s.active && s.name.includes(studentSearchQuery)).length === 0 && (React.createElement("p", { className: "text-center text-xs text-gray-400 py-6" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0627\u0644\u0628 \u0645\u0637\u0627\u0628\u0642 \u0644\u0644\u0628\u062D\u062B"))))),
                    reportSection === 'student' && selectedReportStudentId && (() => {
                        const row = periodReportData.find(r => r.student.id === selectedReportStudentId);
                        const { from, to } = getReportRange();
                        return (React.createElement("div", { className: "space-y-4" },
                            React.createElement("div", { className: "space-y-4 no-print" },
                                React.createElement("div", { className: "flex items-center justify-between" },
                                    React.createElement("button", { onClick: () => setSelectedReportStudentId(null), className: "flex items-center gap-1 text-xs font-black text-blue-700" },
                                        React.createElement(Icon, { name: "arrow-right", size: 14 }),
                                        " \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0637\u0627\u0644\u0628"),
                                    React.createElement("button", { onClick: () => { setReportSection(null); setSelectedReportStudentId(null); }, className: "text-[10px] text-gray-400 font-bold" }, "\u0631\u062C\u0648\u0639 \u0644\u0644\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629")),
                                React.createElement("div", { className: "flex gap-2" },
                                    React.createElement("button", { onClick: () => setReportMode('monthly'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${reportMode === 'monthly' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u062A\u0642\u0631\u064A\u0631 \u0634\u0647\u0631\u064A"),
                                    React.createElement("button", { onClick: () => setReportMode('custom'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${reportMode === 'custom' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u0641\u062A\u0631\u0629 \u0645\u062E\u0635\u0635\u0629")),
                                reportMode === 'monthly' ? (React.createElement("div", null,
                                    React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0627\u062E\u062A\u0631 \u0627\u0644\u0634\u0647\u0631"),
                                    React.createElement("input", { type: "month", value: reportMonth, onChange: (e) => setReportMonth(e.target.value), className: "w-full bg-gray-50 border-none rounded-xl p-3 text-sm" }))) : (React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                    React.createElement("div", null,
                                        React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0645\u0646 \u062A\u0627\u0631\u064A\u062E"),
                                        React.createElement("input", { type: "date", value: reportFrom, onChange: (e) => setReportFrom(e.target.value), className: "w-full bg-gray-50 border-none rounded-xl p-3 text-sm" })),
                                    React.createElement("div", null,
                                        React.createElement("label", { className: "text-[10px] font-black text-gray-400 block mb-1" }, "\u0625\u0644\u0649 \u062A\u0627\u0631\u064A\u062E"),
                                        React.createElement("input", { type: "date", value: reportTo, onChange: (e) => setReportTo(e.target.value), className: "w-full bg-gray-50 border-none rounded-xl p-3 text-sm" })))),
                                React.createElement("div", { className: "flex gap-2" },
                                    React.createElement("button", { onClick: () => setStudentKashfType('summary'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${studentKashfType === 'summary' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u062A\u0642\u0631\u064A\u0631 \u0625\u062C\u0645\u0627\u0644\u064A"),
                                    React.createElement("button", { onClick: () => setStudentKashfType('detailed'), className: `flex-1 py-2 rounded-xl text-xs font-black transition-all ${studentKashfType === 'detailed' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}` }, "\u062A\u0642\u0631\u064A\u0631 \u062A\u0641\u0635\u064A\u0644\u064A (\u0633\u062C\u0644 \u064A\u0648\u0645\u064A)"))),
                            !row ? (React.createElement("p", { className: "text-center text-xs text-gray-400 py-6" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0644\u0647\u0630\u0627 \u0627\u0644\u0637\u0627\u0644\u0628 \u0636\u0645\u0646 \u0627\u0644\u0641\u062A\u0631\u0629 \u0627\u0644\u0645\u062E\u062A\u0627\u0631\u0629")) : (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "print-area p-1 rounded-3xl bg-gradient-to-br from-blue-200 via-yellow-100 to-blue-200" },
                                    React.createElement("div", { ref: studentReportRef, className: "bg-white p-4 rounded-[20px]" },
                                        React.createElement(ReportLetterhead, { title: studentKashfType === 'summary' ? 'تقرير أداء الطالب - إجمالي' : 'تقرير أداء الطالب - تفصيلي', subtitle: `الفترة: من ${from} إلى ${to}` }),
                                        React.createElement("div", { className: "bg-blue-50 border border-blue-100 rounded-xl p-3 flex justify-between items-center mb-4" },
                                            React.createElement("div", null,
                                                React.createElement("p", { className: "text-[9px] text-gray-500 font-bold" }, "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628"),
                                                React.createElement("p", { className: "font-black text-blue-900 text-sm" }, row.student.name)),
                                            React.createElement(Icon, { name: "user-circle", size: 30, className: "text-blue-600" })),
                                        React.createElement("div", { className: "grid grid-cols-4 gap-2 mb-2" },
                                            React.createElement(StatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u064A\u0627\u0645", value: row.totalDays, color: "bg-gray-100 text-gray-700", icon: "calendar" }),
                                            React.createElement(StatBox, { label: "\u062D\u0636\u0648\u0631", value: row.presentCount, color: "bg-emerald-100 text-emerald-700", icon: "check-circle" }),
                                            React.createElement(StatBox, { label: "\u062A\u0623\u062E\u0631", value: row.lateCount, color: "bg-amber-100 text-amber-700", icon: "clock" }),
                                            React.createElement(StatBox, { label: "\u0628\u0639\u0630\u0631", value: row.excusedCount, color: "bg-orange-100 text-orange-700", icon: "alert-circle" })),
                                        React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4" },
                                            React.createElement(StatBox, { label: "\u063A\u064A\u0627\u0628 \u0628\u062F\u0648\u0646 \u0639\u0630\u0631", value: row.absentCount, color: "bg-red-100 text-red-700", icon: "x-circle" }),
                                            React.createElement(StatBox, { label: "\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062D\u0641\u0638", value: row.hifzTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "bookmark" }),
                                            React.createElement(StatBox, { label: "\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", value: row.reviewTotal, color: "bg-gradient-to-br from-teal-600 to-teal-800 text-white", icon: "repeat" })),
                                        studentKashfType === 'detailed' && (React.createElement(React.Fragment, null,
                                            React.createElement("p", { className: "text-[11px] font-black text-gray-600 mb-2 px-1" }, "\u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u064A\u0648\u0645\u064A \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A"),
                                            React.createElement("table", { className: "w-full text-[9px] text-center border-collapse table-fixed border border-gray-200 rounded-xl overflow-hidden" },
                                                React.createElement("thead", null,
                                                    React.createElement("tr", { className: "bg-gradient-to-l from-blue-700 to-blue-600 text-white" },
                                                        React.createElement("th", { className: "p-1.5 font-black", style: { width: '16%' } }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"),
                                                        React.createElement("th", { className: "p-1.5 font-black", style: { width: '14%' } }, "\u0627\u0644\u062D\u0627\u0644\u0629"),
                                                        React.createElement("th", { className: "p-1.5 font-black", style: { width: '26%' } }, "\u0627\u0644\u062D\u0641\u0638"),
                                                        React.createElement("th", { className: "p-1.5 font-black", style: { width: '26%' } }, "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"),
                                                        React.createElement("th", { className: "p-1.5 font-black", style: { width: '18%' } }, "\u0627\u0644\u062A\u0642\u064A\u064A\u0645"))),
                                                React.createElement("tbody", null,
                                                    studentDayLog.length === 0 && (React.createElement("tr", null,
                                                        React.createElement("td", { colSpan: "5", className: "p-4 text-gray-400" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u062C\u0644\u0627\u062A \u0636\u0645\u0646 \u0647\u0630\u0647 \u0627\u0644\u0641\u062A\u0631\u0629"))),
                                                    studentDayLog.map((entry, i) => (React.createElement("tr", { key: entry.date, className: i % 2 === 0 ? 'bg-white' : 'bg-blue-50/40' },
                                                        React.createElement("td", { className: "p-1.5 border-t border-gray-100 font-bold text-gray-500", dir: "ltr" }, entry.date),
                                                        React.createElement("td", { className: `p-1.5 border-t border-gray-100 font-bold ${entry.status === 'present' ? 'text-emerald-700' : entry.status === 'late' ? 'text-amber-600' : entry.status === 'absent_excused' ? 'text-orange-600' : 'text-red-600'}` }, statusLabel(entry.status)),
                                                        React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-gray-700 break-words" }, entry.hifzLine),
                                                        React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-gray-700 break-words" }, entry.reviewLine),
                                                        React.createElement("td", { className: "p-1.5 border-t border-gray-100 text-gray-500 break-words" }, entry.rating)))))))),
                                        React.createElement(ReportFooter, null))),
                                React.createElement("div", { className: "grid grid-cols-2 gap-2 pt-1 no-print" },
                                    React.createElement("button", { onClick: () => copyStudentReport(row), className: "bg-emerald-50 text-emerald-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors text-xs" },
                                        React.createElement(Icon, { name: "copy", size: 16 }),
                                        " \u0646\u0633\u062E \u0646\u0635\u064A"),
                                    React.createElement("button", { onClick: () => window.print(), className: "bg-blue-50 text-blue-700 font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-xs" },
                                        React.createElement(Icon, { name: "printer", size: 16 }),
                                        " \u0637\u0628\u0627\u0639\u0629"),
                                    React.createElement("button", { onClick: () => startExport('student', 'image', `تقرير-أداء-${row.student.name}`, `تقرير أداء ${row.student.name}`), disabled: exporting || !!exportJob, className: "bg-teal-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors text-xs disabled:opacity-50" },
                                        React.createElement(Icon, { name: "image", size: 16 }),
                                        " \u0645\u0634\u0627\u0631\u0643\u0629 \u0643\u0635\u0648\u0631\u0629"),
                                    React.createElement("button", { onClick: () => startExport('student', 'pdf', `تقرير-أداء-${row.student.name}`, `تقرير أداء ${row.student.name}`), disabled: exporting || !!exportJob, className: "bg-red-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors text-xs disabled:opacity-50" },
                                        React.createElement(Icon, { name: "file-text", size: 16 }),
                                        " \u0645\u0634\u0627\u0631\u0643\u0629 PDF"))))));
                    })()))),
            activeTab === 'student_profile' && selectedStudentId && (() => {
                const student = students.find(s => s.id === selectedStudentId);
                const points = getStudentPoints(selectedStudentId);
                const studentTransactions = transactions.filter(t => t.studentId === selectedStudentId).sort((a, b) => new Date(b.date) - new Date(a.date));
                if (!student)
                    return null;
                return (React.createElement("div", { className: "space-y-4 animate-in slide-in-from-left" },
                    React.createElement("div", { className: "flex items-center gap-3 px-2" },
                        React.createElement("button", { onClick: () => { setActiveTab('reports'); setSelectedStudentId(null); }, className: "bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-emerald-600" },
                            React.createElement(Icon, { name: "arrow-right", size: 20 })),
                        React.createElement("h3", { className: "font-black text-gray-800 text-lg" }, "\u0645\u0644\u0641 \u0646\u0642\u0627\u0637 \u0627\u0644\u0637\u0627\u0644\u0628")),
                    React.createElement("div", { className: "bg-gradient-to-br from-emerald-600 to-teal-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden" },
                        React.createElement("div", { className: "absolute -left-8 -bottom-8 opacity-10" },
                            React.createElement(Logo, { size: 150, symbolOnly: true })),
                        React.createElement("div", { className: "relative" },
                            React.createElement("p", { className: "text-emerald-100 text-[11px] font-bold" }, "\u0627\u0644\u0637\u0627\u0644\u0628"),
                            React.createElement("h2", { className: "font-black text-xl mt-1 mb-5" }, student.name),
                            React.createElement("div", { className: "bg-white/15 rounded-2xl p-4 flex items-end justify-between" },
                                React.createElement("div", null,
                                    React.createElement("p", { className: "text-emerald-100 text-[11px] font-bold mb-1" }, "\u0631\u0635\u064A\u062F \u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0645\u062A\u0627\u062D"),
                                    React.createElement("div", { className: "flex items-baseline gap-2" },
                                        React.createElement("span", { className: "text-4xl font-black leading-none" }, points),
                                        React.createElement("span", { className: "text-sm font-bold text-emerald-100" }, "\u0646\u0642\u0637\u0629"))),
                                React.createElement(Icon, { name: "award", size: 30, className: "text-yellow-300" })))),
                    React.createElement("div", { className: "bg-white p-5 rounded-3xl card-shadow border border-gray-100" },
                        React.createElement("h4", { className: "font-black text-gray-800 mb-4 flex items-center gap-2" },
                            React.createElement(Icon, { name: "gift", size: 18, className: "text-orange-500" }),
                            "\u0635\u0631\u0641 \u0646\u0642\u0627\u0637 (\u0631\u062D\u0644\u0629 \u0623\u0648 \u0647\u062F\u064A\u0629)"),
                        React.createElement("form", { onSubmit: handleRedeemPoints, className: "space-y-3" },
                            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                                React.createElement("div", null,
                                    React.createElement("label", { className: "text-[10px] font-bold text-gray-400 block mb-1" }, "\u0639\u062F\u062F \u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0645\u0631\u0627\u062F \u0635\u0631\u0641\u0647\u0627"),
                                    React.createElement("input", { name: "pointsAmount", type: "number", min: "1", required: true, className: "w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-black text-emerald-700", placeholder: "\u0645\u062B\u0627\u0644: 50" })),
                                React.createElement("div", null,
                                    React.createElement("label", { className: "text-[10px] font-bold text-gray-400 block mb-1" }, "\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"),
                                    React.createElement("input", { name: "redeemNote", className: "w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm", placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0647\u062F\u064A\u0629/\u0627\u0644\u0631\u062D\u0644\u0629" }))),
                            React.createElement("button", { className: "w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl shadow-md transition-colors mt-2 flex justify-center items-center gap-2" },
                                React.createElement(Icon, { name: "check-circle", size: 18 }),
                                " \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0635\u0631\u0641"))),
                    React.createElement("div", { className: "bg-white p-5 rounded-3xl card-shadow border border-gray-100" },
                        React.createElement("h4", { className: "font-black text-gray-800 mb-4 flex items-center gap-2" },
                            React.createElement(Icon, { name: "history", size: 18, className: "text-blue-500" }),
                            "\u0633\u062C\u0644 \u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0646\u0642\u0627\u0637"),
                        React.createElement("div", { className: "space-y-3" },
                            studentTransactions.length === 0 && (React.createElement("p", { className: "text-center text-xs text-gray-400 py-4" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u062D\u0631\u0643\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u062D\u062A\u0649 \u0627\u0644\u0622\u0646")),
                            studentTransactions.map(tx => (React.createElement("div", { key: tx.id, className: "flex justify-between items-center p-3 border border-gray-50 rounded-xl bg-gray-50/50" },
                                React.createElement("div", { className: "flex items-center gap-3" },
                                    React.createElement("div", { className: `p-2 rounded-full ${tx.type === 'add' ? 'bg-emerald-100 text-emerald-600' :
                                            tx.type === 'redeem' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}` },
                                        React.createElement(Icon, { name: tx.type === 'add' ? 'plus' : tx.type === 'redeem' ? 'gift' : 'minus', size: 14 })),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "text-xs font-bold text-gray-800" }, tx.note || (tx.type === 'add' ? 'إضافة نقاط' : tx.type === 'redeem' ? 'صرف نقاط' : 'خصم نقاط')),
                                        React.createElement("p", { className: "text-[9px] text-gray-400" }, formatDate(tx.date)))),
                                React.createElement("span", { className: `text-sm font-black ${tx.pointsChange > 0 ? 'text-emerald-600' : 'text-red-500'}`, dir: "rtl" },
                                    tx.pointsChange > 0 ? '+' : '',
                                    tx.pointsChange,
                                    " \u0646\u0642\u0637\u0629"))))))));
            })(),
            activeTab === 'settings' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "bg-white p-5 rounded-3xl card-shadow border border-gray-100 space-y-3" },
                    React.createElement("h4", { className: "font-black text-blue-600 text-sm flex items-center gap-2" },
                        React.createElement(Icon, { name: "shield-check", size: 18 }),
                        "\u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A (\u0623\u0645\u0627\u0646 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A)"),
                    React.createElement("p", { className: "text-[10px] text-gray-500" }, "\u0627\u062D\u0641\u0638 \u0646\u0633\u062E\u0629 \u0645\u0646 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0644\u062A\u062C\u0646\u0628 \u0636\u064A\u0627\u0639\u0647\u0627 \u0623\u0648 \u0644\u0627\u0633\u062A\u0639\u0627\u062F\u062A\u0647\u0627 \u0641\u064A \u062C\u0647\u0627\u0632 \u0622\u062E\u0631."),
                    React.createElement("button", { onClick: exportData, className: "w-full bg-blue-50 text-blue-700 font-bold py-3 rounded-2xl border border-blue-100 flex justify-center items-center gap-2 hover:bg-blue-100 transition-colors" },
                        React.createElement(Icon, { name: "download", size: 18 }),
                        " \u062A\u062D\u0645\u064A\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 (\u0645\u0644\u0641)"),
                    React.createElement("label", { className: "w-full bg-gray-50 text-gray-700 font-bold py-3 rounded-2xl border border-gray-200 flex justify-center items-center gap-2 cursor-pointer mt-2 hover:bg-gray-100 transition-colors" },
                        React.createElement(Icon, { name: "upload", size: 18 }),
                        " \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0645\u0646 \u0645\u0644\u0641",
                        React.createElement("input", { type: "file", accept: ".json,application/json", onChange: importData, className: "hidden" }))),
                React.createElement("div", { className: "rounded-3xl overflow-hidden card-shadow border border-gray-100 bg-white" },
                    React.createElement("div", { className: "p-5 text-white", style: { background: 'linear-gradient(135deg,#059669,#0f766e)' } },
                        React.createElement("div", { className: "flex items-center gap-4" },
                            React.createElement("div", { className: "shrink-0 w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-black text-3xl" }, (settings.halakaName || 'ح').trim().charAt(0)),
                            React.createElement("div", { className: "min-w-0 flex-1" },
                                React.createElement("h3", { className: "font-black text-lg truncate" }, settings.halakaName || 'اسم الحلقة'),
                                React.createElement("p", { className: "text-emerald-100 text-xs font-bold truncate mt-0.5" },
                                    "\u0628\u0625\u0634\u0631\u0627\u0641: ",
                                    settings.teacherName || '—'))),
                        React.createElement("div", { className: "grid grid-cols-3 gap-2 mt-4" }, [[students.filter(s => s.active).length, 'طالب نشط'], [sessions.length, 'يوم مسجّل'], [APP_VERSION, 'الإصدار']].map(([v, l]) => (React.createElement("div", { key: l, className: "bg-white/15 rounded-2xl py-2 text-center" },
                            React.createElement("p", { className: "font-black text-lg leading-tight" }, v),
                            React.createElement("p", { className: "text-[10px] font-bold text-emerald-100" }, l)))))),
                    React.createElement("div", { className: "p-5 space-y-4" },
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("h4", { className: "font-black text-gray-800 text-sm" }, "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A \u0644\u0644\u062D\u0644\u0642\u0629"),
                            React.createElement("span", { className: "text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-1" }, "\u062A\u064F\u062D\u0641\u0638 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u2713")),
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-[11px] font-bold text-gray-400 block px-1 mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u062D\u0644\u0642\u0629"),
                            React.createElement("input", { value: settings.halakaName, onChange: (e) => setSettings({ ...settings, halakaName: e.target.value }), placeholder: "\u0645\u062B\u0627\u0644: \u062D\u0644\u0642\u0629 \u0627\u0644\u0625\u064A\u0645\u0627\u0646", className: "w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-sm font-bold" })),
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-[11px] font-bold text-gray-400 block px-1 mb-1" }, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0634\u0631\u0641 / \u0627\u0644\u0634\u064A\u062E"),
                            React.createElement("input", { value: settings.teacherName, onChange: (e) => setSettings({ ...settings, teacherName: e.target.value }), placeholder: "\u0645\u062B\u0627\u0644: \u0627\u0644\u0634\u064A\u062E \u0645\u062D\u0645\u062F", className: "w-full bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-sm font-bold" })),
                        React.createElement("p", { className: "text-[10px] text-gray-400 font-bold leading-relaxed" }, "\u064A\u0638\u0647\u0631 \u0627\u0644\u0627\u0633\u0645\u0627\u0646 \u0641\u064A \u0631\u0623\u0633 \u0643\u0644 \u062A\u0642\u0631\u064A\u0631 \u062A\u0646\u0633\u062E\u0647 \u0623\u0648 \u062A\u0635\u062F\u0651\u0631\u0647."))),
                React.createElement("div", { className: "bg-white p-4 rounded-3xl card-shadow border border-gray-100 space-y-2" },
                    React.createElement("h4", { className: "font-black text-red-600 text-sm px-2" }, "\u0625\u062C\u0631\u0627\u0621\u0627\u062A \u062E\u0637\u064A\u0631\u0629"),
                    React.createElement("button", { onClick: () => setShowResetModal(true), className: "w-full bg-red-50 text-red-600 font-bold py-3 rounded-2xl border border-red-100 flex justify-center items-center gap-2" },
                        React.createElement(Icon, { name: "rotate-ccw", size: 16 }),
                        " \u0625\u0639\u0627\u062F\u0629 \u0636\u0628\u0637"),
                    React.createElement("p", { className: "text-[10px] text-gray-400 px-2 leading-relaxed" }, "\u064A\u062D\u0630\u0641 \u0643\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629 (\u0627\u0644\u062D\u0636\u0648\u0631\u060C \u0627\u0644\u062D\u0641\u0638\u060C \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629) \u0644\u0643\u0644 \u0627\u0644\u0623\u064A\u0627\u0645. \u0644\u0627 \u064A\u062D\u0630\u0641 \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0637\u0644\u0627\u0628 \u0648\u0644\u0627 \u0623\u0631\u0635\u062F\u0629 \u0646\u0642\u0627\u0637\u0647\u0645 \u0648\u0644\u0627 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062D\u0644\u0642\u0629."),
                    React.createElement("button", { onClick: () => { if (confirm("سيتم مسح كل البيانات! هل أنت متأكد؟")) {
                            localStorage.clear();
                            window.location.reload();
                        } }, className: "w-full text-gray-400 text-xs py-2" }, "\u0645\u0633\u062D \u0643\u0627\u0641\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0646 \u0627\u0644\u062C\u0647\u0627\u0632 (\u0646\u0647\u0627\u0626\u064A)")))),
            activeTab === 'guide' && (() => {
                const steps = [
                    { icon: 'settings', title: 'سجّل بيانات الحلقة', text: 'من القائمة الجانبية افتح «الإعدادات» واكتب اسم الحلقة واسم الشيخ المشرف.', go: 'settings', goLabel: 'فتح الإعدادات' },
                    { icon: 'users', title: 'أضف الطلاب', text: 'من تبويب «الطلاب» أضف أسماء طلاب الحلقة.', go: 'students', goLabel: 'فتح الطلاب' },
                    { icon: 'play-circle', title: 'ابدأ الجلسة', text: 'من تبويب «الجلسة» (أو زر «ابدأ الآن» في الرئيسية) ستجد بطاقة لكل طالب.', go: 'session', goLabel: 'فتح الجلسة' },
                    { icon: 'check-circle', title: 'سجّل حالة كل طالب', text: 'اختر لكل طالب: حاضر، متأخر، غائب، أو غائب بعذر. عند اختيار «حاضر» أو «متأخر» تنفتح بطاقة التسميع، أما الغياب فتبقى البطاقة مطوية.' },
                    { icon: 'bookmark', title: 'سجّل الحفظ والمراجعة', text: 'اكتب عدد الصفحات المسمَّعة، ثم حدّد النتيجة: «ناجح ✓» إذا أتقن الطالب، أو «إعادة ✗» إذا احتاج إعادة. كرّر ذلك لخانة المراجعة.' },
                    { icon: 'copy', title: 'انسخ تقرير الجلسة وأرسله', text: 'اضغط «نسخ التقرير» أعلى صفحة الجلسة ثم الصقه في مجموعة أولياء أمور الطلاب.' },
                    { icon: 'bar-chart-3', title: 'استخرج تقرير أداء الحلقة', text: 'من تبويب «التقارير» اختر تقرير أداء الحلقة (إجمالي أو تفصيلي) وحدّد الشهر أو فترة مخصصة، ثم شاركه كصورة أو PDF في نهاية الشهر أو في أي وقت.', go: 'reports', goLabel: 'فتح التقارير' },
                    { icon: 'award', title: 'النقاط والمكافآت', text: 'أضف نقاطاً للطالب أو اخصمها من بطاقته في الجلسة، وتابع رصيده وصرفه لهدية أو رحلة من «تقرير النقاط» ثم ملف الطالب.' },
                    { icon: 'shield-check', title: 'احفظ نسخة احتياطية', text: 'من «الإعدادات» حمّل نسخة احتياطية بين حين وآخر، ويمكنك استعادتها في أي جهاز آخر.', go: 'settings', goLabel: 'فتح الإعدادات' },
                ];
                return (React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", { className: "flex items-center gap-3 px-2" },
                        React.createElement("button", { onClick: () => setActiveTab('dashboard'), className: "bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-emerald-600" },
                            React.createElement(Icon, { name: "arrow-right", size: 20 })),
                        React.createElement("div", null,
                            React.createElement("h3", { className: "font-black text-gray-800 text-lg" }, "\u062F\u0644\u064A\u0644 \u0627\u0644\u0628\u062F\u0621"),
                            React.createElement("p", { className: "text-[11px] text-gray-400 font-bold" }, "\u062E\u0637\u0648\u0627\u062A \u0628\u0633\u064A\u0637\u0629 \u0644\u062A\u0628\u062F\u0623 \u0627\u0644\u0639\u0645\u0644 \u0639\u0644\u0649 \u0627\u0644\u062A\u0637\u0628\u064A\u0642"))),
                    React.createElement("div", { className: "space-y-3" }, steps.map((st, i) => (React.createElement("div", { key: i, className: "bg-white rounded-3xl card-shadow border border-gray-100 p-4 flex gap-3" },
                        React.createElement("div", { className: "shrink-0 w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm" }, i + 1),
                        React.createElement("div", { className: "min-w-0 flex-1" },
                            React.createElement("div", { className: "flex items-center gap-2 mb-1" },
                                React.createElement(Icon, { name: st.icon, size: 15, className: "text-emerald-600" }),
                                React.createElement("h4", { className: "font-black text-gray-800 text-sm" }, st.title)),
                            React.createElement("p", { className: "text-[12px] text-gray-500 font-bold leading-relaxed" }, st.text),
                            st.go && (React.createElement("button", { onClick: () => setActiveTab(st.go), className: "mt-2 text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full" }, st.goLabel)))))))));
            })(),
            activeTab === 'terms' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "flex items-center gap-3 px-2" },
                    React.createElement("button", { onClick: () => setActiveTab('about'), className: "bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-emerald-600" },
                        React.createElement(Icon, { name: "arrow-right", size: 20 })),
                    React.createElement("h3", { className: "font-black text-gray-800 text-lg" }, "\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0648\u0627\u0644\u062A\u0631\u062E\u064A\u0635")),
                React.createElement("div", { className: "bg-white p-5 rounded-3xl card-shadow border border-gray-100 space-y-4" },
                    React.createElement("p", { className: "text-[11px] font-bold text-gray-400" },
                        "\u0622\u062E\u0631 \u062A\u062D\u062F\u064A\u062B: ",
                        TERMS_UPDATED),
                    React.createElement(TermsParties, null),
                    TERMS_SECTIONS.map(s => (React.createElement("div", { key: s.h },
                        React.createElement("h4", { className: "font-black text-emerald-800 text-sm mb-1" }, s.h),
                        React.createElement("p", { className: "text-[13px] text-gray-600 leading-7 font-medium" }, s.p)))),
                    React.createElement("p", { className: "text-[10px] text-gray-300 font-bold text-center pt-2 border-t border-gray-100" },
                        "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \u00A9 ",
                        new Date().getFullYear(),
                        " \u0633\u064A\u0641 \u0627\u0644\u062F\u064A\u0646 \u0645\u0643\u064A\u0629")))),
            activeTab === 'about' && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", { className: "flex items-center gap-3 px-2" },
                    React.createElement("button", { onClick: () => setActiveTab('dashboard'), className: "bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-emerald-600" },
                        React.createElement(Icon, { name: "arrow-right", size: 20 })),
                    React.createElement("h3", { className: "font-black text-gray-800 text-lg" }, "\u062D\u0648\u0644 \u0627\u0644\u062A\u0637\u0628\u064A\u0642")),
                React.createElement("div", { className: "bg-white p-6 rounded-3xl card-shadow border border-gray-100 text-center space-y-4" },
                    React.createElement(Logo, { size: 88, className: "mx-auto" }),
                    React.createElement("div", null,
                        React.createElement("h2", { className: "font-black text-emerald-900 text-xl" }, "\u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                        React.createElement("p", { className: "text-xs text-gray-400 font-bold mt-1" }, "\u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u062D\u0644\u0642\u0627\u062A \u062A\u062D\u0641\u064A\u0638 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645")),
                    React.createElement("div", { className: "h-px bg-gray-100" }),
                    React.createElement("div", { className: "space-y-1" },
                        React.createElement("p", { className: "text-[10px] text-gray-400 font-bold" }, "\u062A\u0637\u0648\u064A\u0631"),
                        React.createElement("p", { className: "font-black text-gray-800" }, "\u0633\u064A\u0641 \u0627\u0644\u062F\u064A\u0646 \u0645\u0643\u064A\u0629")),
                    React.createElement("div", { className: "space-y-1" },
                        React.createElement("p", { className: "text-[10px] text-gray-400 font-bold" }, "\u0627\u0644\u0625\u0635\u062F\u0627\u0631"),
                        React.createElement("p", { className: "font-black text-gray-800" }, APP_VERSION)),
                    React.createElement("div", { className: "inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 text-[11px] font-black" },
                        React.createElement(Icon, { name: "shield-check", size: 13 }),
                        " \u0645\u0631\u062E\u064E\u0651\u0635 \u0644\u0647: ",
                        LICENSEE),
                    React.createElement("button", { onClick: () => setActiveTab('terms'), className: "w-full flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 text-sm font-bold text-emerald-800" },
                        React.createElement("span", null, "\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0648\u0627\u0644\u062A\u0631\u062E\u064A\u0635"),
                        React.createElement(Icon, { name: "chevron-left", size: 16 })),
                    React.createElement("p", { className: "text-[10px] text-gray-300 font-bold" },
                        "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \u00A9 ",
                        new Date().getFullYear()))))),
        exportJob && (React.createElement("div", { className: "export-stage no-print", "aria-hidden": "true" },
            exportJob.kind === 'halaka' && (React.createElement("div", { ref: halakaExportRef },
                React.createElement(ExportFrame, { title: "\u062A\u0642\u0631\u064A\u0631 \u0623\u062F\u0627\u0621 \u0627\u0644\u062D\u0644\u0642\u0629", chip: halakaReportType === 'summary' ? 'إجمالي' : 'تفصيلي', periodText: `الفترة: من ${exportRange.from} إلى ${exportRange.to}` }, halakaReportType === 'summary' ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "grid grid-cols-4 gap-3 mb-3" },
                        React.createElement(ExportStatBox, { label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628", value: periodReportData.length, color: "bg-gray-100 text-gray-700", icon: "users" }),
                        React.createElement(ExportStatBox, { label: "\u062D\u0636\u0648\u0631", value: overallTotals.presentTotal, color: "bg-emerald-100 text-emerald-700", icon: "check-circle" }),
                        React.createElement(ExportStatBox, { label: "\u062A\u0623\u062E\u0631", value: overallTotals.lateTotal, color: "bg-amber-100 text-amber-700", icon: "clock" }),
                        React.createElement(ExportStatBox, { label: "\u063A\u064A\u0627\u0628 \u0628\u0639\u0630\u0631", value: overallTotals.excusedTotal, color: "bg-orange-100 text-orange-700", icon: "alert-circle" })),
                    React.createElement("div", { className: "grid grid-cols-3 gap-3" },
                        React.createElement(ExportStatBox, { label: "\u063A\u064A\u0627\u0628 \u0628\u062F\u0648\u0646 \u0639\u0630\u0631", value: overallTotals.absentTotal, color: "bg-red-100 text-red-700", icon: "x-circle" }),
                        React.createElement(ExportStatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062D\u0641\u0638", value: overallTotals.hifzTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "bookmark" }),
                        React.createElement(ExportStatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", value: overallTotals.reviewTotal, color: "bg-gradient-to-br from-teal-600 to-teal-800 text-white", icon: "repeat" })))) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "grid grid-cols-3 gap-3 mb-6" },
                        React.createElement(ExportStatBox, { label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628", value: periodReportData.length, color: "bg-gray-100 text-gray-700", icon: "users" }),
                        React.createElement(ExportStatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062D\u0641\u0638", value: overallTotals.hifzTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "bookmark" }),
                        React.createElement(ExportStatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", value: overallTotals.reviewTotal, color: "bg-gradient-to-br from-teal-600 to-teal-800 text-white", icon: "repeat" })),
                    React.createElement("div", { style: { border: '1px solid #a7f3d0', borderRadius: '16px', overflow: 'hidden' } },
                        React.createElement("table", { className: "w-full text-center", style: { borderCollapse: 'collapse', fontSize: '13.5px' } },
                            React.createElement("thead", null,
                                React.createElement("tr", { className: "bg-emerald-700 text-white" },
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '5%' } }, "#"),
                                    React.createElement("th", { className: "p-3 font-black text-right", style: { width: '23%' } }, "\u0627\u0644\u0637\u0627\u0644\u0628"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '9%' } }, "\u0627\u0644\u0623\u064A\u0627\u0645"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '10%' } }, "\u062D\u0636\u0648\u0631"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '9%' } }, "\u062A\u0623\u062E\u0631"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '9%' } }, "\u0628\u0639\u0630\u0631"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '10%' } }, "\u062F\u0648\u0646 \u0639\u0630\u0631"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '12.5%' } }, "\u0627\u0644\u062D\u0641\u0638"),
                                    React.createElement("th", { className: "p-3 font-black", style: { width: '12.5%' } }, "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"))),
                            React.createElement("tbody", null,
                                periodReportData.length === 0 && (React.createElement("tr", null,
                                    React.createElement("td", { colSpan: "9", className: "p-6 text-gray-400" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0645\u0636\u0627\u0641\u064A\u0646 \u062D\u0627\u0644\u064A\u0627\u064B"))),
                                periodReportData.map((prow, i) => (React.createElement("tr", { key: prow.student.id, className: i % 2 === 0 ? 'bg-white' : 'bg-emerald-50' },
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 font-bold text-gray-400" }, i + 1),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 font-black text-emerald-900 text-right" }, prow.student.name),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100" }, prow.totalDays),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 text-emerald-700 font-bold" }, prow.presentCount),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 text-amber-600 font-bold" }, prow.lateCount),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 text-orange-600 font-bold" }, prow.excusedCount),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 text-red-600 font-bold" }, prow.absentCount),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 font-bold" }, prow.hifzTotal),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 font-bold" }, prow.reviewTotal))))),
                            periodReportData.length > 0 && (React.createElement("tfoot", null,
                                React.createElement("tr", { className: "bg-emerald-100 font-black" },
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400", colSpan: "2" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400" }, overallTotals.presentTotal + overallTotals.lateTotal + overallTotals.absentTotal + overallTotals.excusedTotal),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400 text-emerald-700" }, overallTotals.presentTotal),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400 text-amber-600" }, overallTotals.lateTotal),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400 text-orange-600" }, overallTotals.excusedTotal),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400 text-red-600" }, overallTotals.absentTotal),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400" }, overallTotals.hifzTotal),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400" }, overallTotals.reviewTotal))))))))))),
            exportJob.kind === 'student' && exportRow && (React.createElement("div", { ref: studentExportRef },
                React.createElement(ExportFrame, { title: "\u062A\u0642\u0631\u064A\u0631 \u0623\u062F\u0627\u0621 \u0627\u0644\u0637\u0627\u0644\u0628", chip: studentKashfType === 'summary' ? 'إجمالي' : 'تفصيلي', periodText: `الفترة: من ${exportRange.from} إلى ${exportRange.to}` },
                    React.createElement("div", { className: "avoid-break bg-emerald-50 flex justify-between items-center mb-5", style: { border: '1px solid #a7f3d0', borderRadius: '18px', padding: '16px 22px' } },
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-gray-500 font-bold", style: { fontSize: '12px' } }, "\u0627\u0633\u0645 \u0627\u0644\u0637\u0627\u0644\u0628"),
                            React.createElement("p", { className: "font-black text-emerald-900", style: { fontSize: '22px', marginTop: '2px' } }, exportRow.student.name)),
                        React.createElement(Icon, { name: "user-circle", size: 44, className: "text-emerald-600" })),
                    React.createElement("div", { className: "grid grid-cols-4 gap-3 mb-3" },
                        React.createElement(ExportStatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u064A\u0627\u0645", value: exportRow.totalDays, color: "bg-gray-100 text-gray-700", icon: "calendar" }),
                        React.createElement(ExportStatBox, { label: "\u062D\u0636\u0648\u0631", value: exportRow.presentCount, color: "bg-emerald-100 text-emerald-700", icon: "check-circle" }),
                        React.createElement(ExportStatBox, { label: "\u062A\u0623\u062E\u0631", value: exportRow.lateCount, color: "bg-amber-100 text-amber-700", icon: "clock" }),
                        React.createElement(ExportStatBox, { label: "\u063A\u064A\u0627\u0628 \u0628\u0639\u0630\u0631", value: exportRow.excusedCount, color: "bg-orange-100 text-orange-700", icon: "alert-circle" })),
                    React.createElement("div", { className: "grid grid-cols-3 gap-3 mb-6" },
                        React.createElement(ExportStatBox, { label: "\u063A\u064A\u0627\u0628 \u0628\u062F\u0648\u0646 \u0639\u0630\u0631", value: exportRow.absentCount, color: "bg-red-100 text-red-700", icon: "x-circle" }),
                        React.createElement(ExportStatBox, { label: "\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u062D\u0641\u0638", value: exportRow.hifzTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "bookmark" }),
                        React.createElement(ExportStatBox, { label: "\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", value: exportRow.reviewTotal, color: "bg-gradient-to-br from-teal-600 to-teal-800 text-white", icon: "repeat" })),
                    studentKashfType === 'detailed' && (React.createElement(React.Fragment, null,
                        React.createElement("p", { className: "font-black text-gray-600 avoid-break", style: { fontSize: '15px', marginBottom: '10px' } }, "\u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u064A\u0648\u0645\u064A \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A"),
                        React.createElement("div", { style: { border: '1px solid #a7f3d0', borderRadius: '16px', overflow: 'hidden' } },
                            React.createElement("table", { className: "w-full text-center", style: { borderCollapse: 'collapse', fontSize: '13px' } },
                                React.createElement("thead", null,
                                    React.createElement("tr", { className: "bg-emerald-700 text-white" },
                                        React.createElement("th", { className: "p-3 font-black", style: { width: '16%' } }, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E"),
                                        React.createElement("th", { className: "p-3 font-black", style: { width: '13%' } }, "\u0627\u0644\u062D\u0627\u0644\u0629"),
                                        React.createElement("th", { className: "p-3 font-black", style: { width: '27%' } }, "\u0627\u0644\u062D\u0641\u0638"),
                                        React.createElement("th", { className: "p-3 font-black", style: { width: '27%' } }, "\u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"),
                                        React.createElement("th", { className: "p-3 font-black", style: { width: '17%' } }, "\u0627\u0644\u062A\u0642\u064A\u064A\u0645"))),
                                React.createElement("tbody", null,
                                    studentDayLog.length === 0 && (React.createElement("tr", null,
                                        React.createElement("td", { colSpan: "5", className: "p-6 text-gray-400" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0633\u062C\u0644\u0627\u062A \u0636\u0645\u0646 \u0647\u0630\u0647 \u0627\u0644\u0641\u062A\u0631\u0629"))),
                                    studentDayLog.map((entry, i) => (React.createElement("tr", { key: entry.date, className: i % 2 === 0 ? 'bg-white' : 'bg-emerald-50' },
                                        React.createElement("td", { className: "p-3 border-t border-emerald-100 font-bold text-gray-500", dir: "ltr" }, entry.date),
                                        React.createElement("td", { className: `p-3 border-t border-emerald-100 font-bold ${entry.status === 'present' ? 'text-emerald-700' : entry.status === 'late' ? 'text-amber-600' : entry.status === 'absent_excused' ? 'text-orange-600' : 'text-red-600'}` }, statusLabel(entry.status)),
                                        React.createElement("td", { className: "p-3 border-t border-emerald-100 text-gray-700" }, entry.hifzLine),
                                        React.createElement("td", { className: "p-3 border-t border-emerald-100 text-gray-700" }, entry.reviewLine),
                                        React.createElement("td", { className: "p-3 border-t border-emerald-100 text-gray-500" }, entry.rating)))))))))))),
            exportJob.kind === 'points' && (React.createElement("div", { ref: pointsExportRef },
                React.createElement(ExportFrame, { title: "\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u0646\u0642\u0627\u0637", chip: "\u0623\u0631\u0635\u062F\u0629 \u0627\u0644\u0637\u0644\u0627\u0628", periodText: `حتى تاريخ: ${new Date().toLocaleDateString('ar-EG')}` },
                    React.createElement("div", { className: "grid grid-cols-3 gap-3 mb-6" },
                        React.createElement(ExportStatBox, { label: "\u0639\u062F\u062F \u0627\u0644\u0637\u0644\u0627\u0628", value: pointsRows.length, color: "bg-gray-100 text-gray-700", icon: "users" }),
                        React.createElement(ExportStatBox, { label: "\u0625\u062C\u0645\u0627\u0644\u064A \u0646\u0642\u0627\u0637 \u0627\u0644\u062D\u0644\u0642\u0629", value: pointsTotal, color: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white", icon: "award" }),
                        React.createElement(ExportStatBox, { label: "\u0623\u0639\u0644\u0649 \u0631\u0635\u064A\u062F", value: pointsMax, color: "bg-amber-100 text-amber-700", icon: "trophy", sub: pointsTop ? pointsTop.student.name : '' })),
                    React.createElement("div", { style: { border: '1px solid #a7f3d0', borderRadius: '16px', overflow: 'hidden' } },
                        React.createElement("table", { className: "w-full", style: { borderCollapse: 'collapse', fontSize: '14px' } },
                            React.createElement("thead", null,
                                React.createElement("tr", { className: "bg-emerald-700 text-white" },
                                    React.createElement("th", { className: "p-3 font-black text-center", style: { width: '7%' } }, "#"),
                                    React.createElement("th", { className: "p-3 font-black text-right", style: { width: '33%' } }, "\u0627\u0644\u0637\u0627\u0644\u0628"),
                                    React.createElement("th", { className: "p-3 font-black text-right", style: { width: '40%' } }, "\u0627\u0644\u0631\u0635\u064A\u062F"),
                                    React.createElement("th", { className: "p-3 font-black text-center", style: { width: '20%' } }, "\u0627\u0644\u0646\u0642\u0627\u0637"))),
                            React.createElement("tbody", null,
                                pointsRows.length === 0 && (React.createElement("tr", null,
                                    React.createElement("td", { colSpan: "4", className: "p-6 text-center text-gray-400" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0637\u0644\u0627\u0628 \u0645\u0636\u0627\u0641\u064A\u0646 \u062D\u0627\u0644\u064A\u0627\u064B"))),
                                pointsRows.map((pr, i) => (React.createElement("tr", { key: pr.student.id, className: i % 2 === 0 ? 'bg-white' : 'bg-emerald-50' },
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 text-center font-bold text-gray-400" }, i + 1),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100 font-black text-emerald-900 text-right" }, pr.student.name),
                                    React.createElement("td", { className: "p-3 border-t border-emerald-100" },
                                        React.createElement("div", { style: { height: '10px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' } },
                                            React.createElement("div", { style: { height: '10px', borderRadius: '999px', background: pr.points < 0 ? '#ef4444' : '#10b981', width: `${pointsMax > 0 ? Math.max(0, Math.min(100, (pr.points / pointsMax) * 100)) : 0}%` } }))),
                                    React.createElement("td", { className: `p-3 border-t border-emerald-100 text-center font-black ${pr.points < 0 ? 'text-red-600' : 'text-emerald-700'}` }, pr.points))))),
                            pointsRows.length > 0 && (React.createElement("tfoot", null,
                                React.createElement("tr", { className: "bg-emerald-100 font-black" },
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400", colSpan: "3" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0646\u0642\u0627\u0637 \u0627\u0644\u062D\u0644\u0642\u0629"),
                                    React.createElement("td", { className: "p-3 border-t-2 border-emerald-400 text-center text-emerald-800" }, pointsTotal))))))))))),
        !termsOk && (React.createElement("div", { className: "fixed inset-0 bg-black/70 z-[300] flex items-end sm:items-center justify-center p-3 no-print" },
            React.createElement("div", { className: "bg-white rounded-3xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl overflow-hidden" },
                React.createElement("div", { className: "p-5 pb-3 text-center border-b border-gray-100" },
                    React.createElement(Logo, { size: 56, className: "mx-auto mb-2" }),
                    React.createElement("h3", { className: "font-black text-emerald-900 text-lg" }, "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                    React.createElement("p", { className: "text-[11px] font-bold text-gray-400 mt-1" }, "\u064A\u0631\u062C\u0649 \u0642\u0631\u0627\u0621\u0629 \u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0648\u0627\u0644\u062A\u0631\u062E\u064A\u0635 \u0642\u0628\u0644 \u0627\u0644\u0628\u062F\u0621")),
                React.createElement("div", { className: "p-5 overflow-y-auto space-y-3" },
                    React.createElement(TermsParties, null),
                    TERMS_SECTIONS.map(s => (React.createElement("div", { key: s.h },
                        React.createElement("h4", { className: "font-black text-emerald-800 text-[13px] mb-0.5" }, s.h),
                        React.createElement("p", { className: "text-xs text-gray-600 leading-6 font-medium" }, s.p))))),
                React.createElement("div", { className: "p-4 border-t border-gray-100" },
                    React.createElement("button", { onClick: acceptTerms, className: "w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl shadow-md" }, "\u0623\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0623\u0628\u062F\u0623"))))),
        showDrawer && (React.createElement("div", { onClick: () => setShowDrawer(false), className: "fixed inset-0 bg-black/40 z-[105] no-print" })),
        React.createElement("div", { className: `fixed top-0 right-0 h-full w-72 max-w-[82%] bg-white z-[110] shadow-2xl transform transition-transform duration-300 flex flex-col no-print ${showDrawer ? 'translate-x-0' : 'translate-x-full'}` },
            React.createElement("div", { className: "flex items-center justify-between px-4 pt-4 pb-3" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(Logo, { size: 32 }),
                    React.createElement("span", { className: "font-black text-emerald-800 text-base" }, "\u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A")),
                React.createElement("button", { onClick: () => setShowDrawer(false), "aria-label": "\u0625\u063A\u0644\u0627\u0642", className: "p-2 rounded-full text-gray-400 hover:bg-gray-100" },
                    React.createElement(Icon, { name: "x", size: 18 }))),
            React.createElement("div", { className: "mx-4 mb-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 flex items-center gap-3" },
                React.createElement("div", { className: "shrink-0 w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-lg" }, (settings.halakaName || 'ح').trim().charAt(0)),
                React.createElement("div", { className: "min-w-0 flex-1" },
                    React.createElement("p", { className: "font-black text-gray-800 text-sm truncate" }, settings.halakaName),
                    React.createElement("p", { className: "text-[11px] font-bold text-gray-500 truncate" },
                        "\u0628\u0625\u0634\u0631\u0627\u0641: ",
                        settings.teacherName)),
                React.createElement("button", { onClick: () => { setActiveTab('settings'); setSelectedStudentId(null); setShowDrawer(false); }, "aria-label": "\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0644\u0642\u0629", className: "shrink-0 p-2 rounded-lg text-emerald-700 hover:bg-emerald-100" },
                    React.createElement(Icon, { name: "edit-3", size: 15 }))),
            React.createElement("div", { className: "mx-4 mb-3" },
                React.createElement("p", { className: "text-[10px] font-bold text-gray-400 mb-1.5 px-1" }, "\u0645\u0638\u0647\u0631 \u0627\u0644\u062A\u0637\u0628\u064A\u0642"),
                React.createElement("div", { className: "grid grid-cols-2 gap-1 bg-gray-100 rounded-xl p-1" }, [['light', '☀️ نهاري'], ['dark', '🌙 ليلي']].map(([k, l]) => (React.createElement("button", { key: k, onClick: () => setTheme(k), className: `py-1.5 rounded-lg text-[11px] font-black transition-colors ${theme === k ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500'}` }, l))))),
            React.createElement("div", { className: "px-3 space-y-1 flex-1 overflow-y-auto" }, [
                { id: 'guide', icon: 'compass', label: 'دليل البدء', sec: 'التعليمات' },
                { id: 'settings', icon: 'settings', label: 'الإعدادات والملف الشخصي', sec: 'الحلقة والبيانات' },
                { id: 'about', icon: 'info', label: 'حول التطبيق', sec: 'معلومات' },
                { id: 'terms', icon: 'shield-check', label: 'شروط الاستخدام والترخيص' },
            ].map(item => (React.createElement(React.Fragment, { key: item.id },
                item.sec && React.createElement("p", { className: "text-[10px] font-black text-gray-400 px-3 pt-3 pb-1" }, item.sec),
                React.createElement("button", { onClick: () => { setActiveTab(item.id); setSelectedStudentId(null); setShowDrawer(false); }, className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'}` },
                    React.createElement("span", { className: `shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === item.id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500'}` },
                        React.createElement(Icon, { name: item.icon, size: 16 })),
                    React.createElement("span", { className: "flex-1 text-right" }, item.label),
                    React.createElement(Icon, { name: "chevron-left", size: 14, className: "text-gray-300" })))))),
            React.createElement("div", { className: "px-4 py-3 text-center border-t border-gray-100 space-y-1" },
                React.createElement("div", { className: "flex items-center justify-center gap-1.5" },
                    React.createElement(Logo, { size: 18 }),
                    React.createElement("span", { className: "text-[11px] font-black text-gray-500" }, "\u062D\u064E\u0644\u064E\u0642\u064E\u062A\u064A"),
                    React.createElement("span", { className: "text-[10px] font-bold text-gray-400", dir: "ltr" },
                        "v",
                        APP_VERSION)),
                React.createElement("p", { className: "text-[10px] text-gray-400 font-bold" },
                    "\u0645\u0631\u062E\u064E\u0651\u0635 \u0644\u0640 ",
                    LICENSEE),
                React.createElement("p", { className: "text-[10px] text-gray-300 font-bold" },
                    "\u062A\u0637\u0648\u064A\u0631: ",
                    OWNER,
                    " \u00B7 \u00A9 ",
                    new Date().getFullYear()))),
        showResetModal && (React.createElement("div", { className: "fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-4 no-print" },
            React.createElement("div", { className: "bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl" },
                React.createElement("div", { className: "flex flex-col items-center text-center gap-2" },
                    React.createElement("div", { className: "bg-red-100 text-red-600 p-3 rounded-full" },
                        React.createElement(Icon, { name: "alert-triangle", size: 28 })),
                    React.createElement("h3", { className: "font-black text-red-700 text-lg" }, "\u062A\u0623\u0643\u064A\u062F \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0636\u0628\u0637"),
                    React.createElement("p", { className: "text-xs text-gray-500 leading-relaxed" },
                        "\u0633\u064A\u062A\u0645 \u062D\u0630\u0641 ",
                        React.createElement("span", { className: "font-black text-red-600" }, "\u0643\u0644 \u0627\u0644\u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629"),
                        " (",
                        sessions.length,
                        " \u064A\u0648\u0645 \u0645\u0633\u062C\u0651\u0644 \u062D\u0627\u0644\u064A\u0627\u064B) \u0628\u0634\u0643\u0644 \u0646\u0647\u0627\u0626\u064A\u060C \u0648\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621 \u0623\u0628\u062F\u0627\u064B.",
                        React.createElement("br", null),
                        React.createElement("br", null),
                        React.createElement("span", { className: "font-bold text-gray-600" }, "\u0644\u0646 \u064A\u062A\u0645 \u062D\u0630\u0641:"),
                        " \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0637\u0644\u0627\u0628\u060C \u0623\u0631\u0635\u062F\u0629 \u0627\u0644\u0646\u0642\u0627\u0637\u060C \u0623\u0648 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u062D\u0644\u0642\u0629.")),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("label", { className: "text-[10px] font-bold text-gray-400 block px-1" }, "\u0644\u0644\u062A\u0623\u0643\u064A\u062F\u060C \u0627\u0643\u062A\u0628 \u0643\u0644\u0645\u0629 \"\u062D\u0630\u0641\" \u0641\u064A \u0627\u0644\u062D\u0642\u0644 \u0628\u0627\u0644\u0623\u0633\u0641\u0644:"),
                    React.createElement("input", { value: resetConfirmText, onChange: (e) => setResetConfirmText(e.target.value), className: "w-full bg-gray-50 border-2 border-red-100 rounded-2xl p-3 text-center font-black text-red-700 focus:ring-1 focus:ring-red-400", placeholder: "\u062D\u0630\u0641", dir: "rtl" })),
                React.createElement("div", { className: "flex gap-2" },
                    React.createElement("button", { onClick: () => { setShowResetModal(false); setResetConfirmText(''); }, className: "flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl" }, "\u0625\u0644\u063A\u0627\u0621"),
                    React.createElement("button", { disabled: resetConfirmText.trim() !== 'حذف', onClick: performFullReset, className: `flex-1 font-black py-3 rounded-2xl text-white transition-all ${resetConfirmText.trim() === 'حذف' ? 'bg-red-600 shadow-lg shadow-red-200' : 'bg-red-200 cursor-not-allowed'}` }, "\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A\u0627\u064B"))))),
        showSessionHistory && (React.createElement("div", { className: "fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-4 no-print", onClick: () => setShowSessionHistory(false) },
            React.createElement("div", { className: "bg-white rounded-3xl p-5 max-w-sm w-full max-h-[75vh] flex flex-col shadow-2xl", onClick: (e) => e.stopPropagation() },
                React.createElement("div", { className: "flex justify-between items-center mb-3" },
                    React.createElement("h3", { className: "font-black text-gray-800 flex items-center gap-2" },
                        React.createElement(Icon, { name: "calendar", size: 18, className: "text-emerald-600" }),
                        " \u0633\u062C\u0644 \u0627\u0644\u0623\u064A\u0627\u0645 \u0627\u0644\u0633\u0627\u0628\u0642\u0629"),
                    React.createElement("button", { onClick: () => setShowSessionHistory(false), className: "text-gray-400 p-1" },
                        React.createElement(Icon, { name: "x", size: 20 }))),
                React.createElement("div", { className: "overflow-y-auto space-y-2 flex-1" },
                    sessionDatesSorted.length === 0 && (React.createElement("p", { className: "text-center text-xs text-gray-400 py-8" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u064A \u0623\u064A\u0627\u0645 \u0645\u0633\u062C\u0644\u0629 \u0628\u0639\u062F")),
                    sessionDatesSorted.map(date => {
                        const sess = sessions.find(s => s.date === date);
                        const presentCount = sess.records.filter(r => r.status === 'present').length;
                        const lateCount = sess.records.filter(r => r.status === 'late').length;
                        const absentCount = sess.records.filter(r => r.status === 'absent' || r.status === 'absent_excused').length;
                        return (React.createElement("div", { key: date, className: `w-full flex justify-between items-center p-3 rounded-2xl border transition-colors ${date === selectedSessionDate ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-transparent'}` },
                            React.createElement("button", { onClick: () => { setSelectedSessionDate(date); setShowSessionHistory(false); }, className: "flex-1 text-right" },
                                React.createElement("span", { className: "text-xs font-black text-gray-700 block" },
                                    formatDisplayDateShort(date),
                                    date === todayKey ? ' (اليوم)' : ''),
                                React.createElement("span", { className: "text-[10px] font-bold text-gray-400 flex items-center gap-2 mt-0.5 flex-wrap" },
                                    React.createElement("span", { className: "text-emerald-600" },
                                        "\u2714 \u062D\u0627\u0636\u0631 ",
                                        presentCount),
                                    React.createElement("span", { className: "text-amber-600" },
                                        "\uD83D\uDD52 \u062A\u0623\u062E\u0631 ",
                                        lateCount),
                                    React.createElement("span", { className: "text-red-500" },
                                        "\u2716 \u063A\u0627\u0626\u0628 ",
                                        absentCount))),
                            React.createElement("button", { onClick: () => confirmDeleteDay(date), title: "\u062D\u0630\u0641 \u062A\u0633\u062C\u064A\u0644\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u064A\u0648\u0645", className: "text-gray-300 hover:text-red-500 p-2 transition-colors" },
                                React.createElement(Icon, { name: "trash-2", size: 15 }))));
                    }))))),
        React.createElement("nav", { className: "fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-gray-100 p-2 flex justify-around items-center no-print z-50 rounded-t-[30px] shadow-2xl" },
            React.createElement("button", { onClick: () => { setActiveTab('dashboard'); setSelectedStudentId(null); }, className: `flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400'}` },
                React.createElement(Icon, { name: "home", size: 20 }),
                React.createElement("span", { className: "text-[10px] font-black mt-1" }, "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629")),
            React.createElement("button", { onClick: () => { setActiveTab('session'); setSelectedStudentId(null); }, className: `flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'session' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400'}` },
                React.createElement(Icon, { name: "edit-3", size: 20 }),
                React.createElement("span", { className: "text-[10px] font-black mt-1" }, "\u0627\u0644\u062C\u0644\u0633\u0629")),
            React.createElement("button", { onClick: () => { setActiveTab('students'); setSelectedStudentId(null); }, className: `flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'students' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400'}` },
                React.createElement(Icon, { name: "users", size: 20 }),
                React.createElement("span", { className: "text-[10px] font-black mt-1" }, "\u0627\u0644\u0637\u0644\u0627\u0628")),
            React.createElement("button", { onClick: () => { setActiveTab('reports'); setSelectedStudentId(null); }, className: `flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'reports' || activeTab === 'student_profile' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-400'}` },
                React.createElement(Icon, { name: "bar-chart-3", size: 20 }),
                React.createElement("span", { className: "text-[10px] font-black mt-1" }, "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631")))));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
// تسجيل الـ Service Worker: يخزّن الصفحة والمكتبات بعد أول فتح ناجح بالإنترنت،
// حتى يستمر التطبيق بالعمل لاحقاً بدون إنترنت
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(() => { });
    });
}
