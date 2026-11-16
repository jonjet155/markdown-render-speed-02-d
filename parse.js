// Stride-scanner Markdown renderer: marked 18.1.3-exact HTML, direct to string.
// Single pass over lines for blocks; stride inline parser with delimiter/bracket stacks.
const NAMED = {
  AElig: '\u00C6', AMP: '&', Amp: '&', amp: '&', apos: "'", Aacute: '\u00C1', aacute: '\u00E1',
  Acirc: '\u00C2', acirc: '\u00E2', Agrave: '\u00C0', agrave: '\u00E0', Aring: '\u00C5', aring: '\u00E5',
  Atilde: '\u00C3', atilde: '\u00E3', Auml: '\u00C4', auml: '\u00E4', Ccedil: '\u00C7', ccedil: '\u00E7',
  Eacute: '\u00C9', eacute: '\u00E9', Ecirc: '\u00CA', ecirc: '\u00EA', Egrave: '\u00C8', egrave: '\u00E8',
  Euml: '\u00CB', euml: '\u00EB', Iacute: '\u00CD', iacute: '\u00ED', Icirc: '\u00CE', icirc: '\u00EE',
  Igrave: '\u00CC', igrave: '\u00EC', Iuml: '\u00CF', iuml: '\u00EF', Ntilde: '\u00D1', ntilde: '\u00F1',
  Oacute: '\u00D3', oacute: '\u00F3', Ocirc: '\u00D4', ocirc: '\u00F4', Ograve: '\u00D2', ograve: '\u00F2',
  Oslash: '\u00D8', oslash: '\u00F8', Otilde: '\u00D5', otilde: '\u00F5', Ouml: '\u00D6', ouml: '\u00F6',
  Uacute: '\u00DA', uacute: '\u00FA', Ucirc: '\u00DB', ucirc: '\u00FB', Ugrave: '\u00D9', ugrave: '\u00F9',
  Uuml: '\u00DC', uuml: '\u00FC', Yacute: '\u00DD', yacute: '\u00FD', yuml: '\u00FF', THORN: '\u00DE',
  thorn: '\u00FE', szlig: '\u00DF', eth: '\u00F0', ETH: '\u00D0', copy: '\u00A9', COPY: '\u00A9', reg: '\u00AE', REG: '\u00AE', trade: '\u2122', TRADE: '\u2122',
  nbsp: '\u00A0', lt: '<', LT: '<', gt: '>', GT: '>', quot: '"', QUOT: '"', hellip: '\u2026',
  mdash: '\u2014', ndash: '\u2013', lsquo: '\u2018', rsquo: '\u2019', ldquo: '\u201C', rdquo: '\u201D',
  laquo: '\u00AB', raquo: '\u00BB', sbquo: '\u201A', bdquo: '\u201E', dagger: '\u2020', Dagger: '\u2021',
  bull: '\u2022', permil: '\u2030', prime: '\u2032', Prime: '\u2033', oline: '\u203E', frasl: '\u2044',
  euro: '\u20AC', pound: '\u00A3', yen: '\u00A5', cent: '\u00A2', curren: '\u00A4', brvbar: '\u00A6',
  sect: '\u00A7', uml: '\u00A8', ordf: '\u00AA', ordm: '\u00BA', para: '\u00B6', middot: '\u00B7',
  cedil: '\u00B8', sup1: '\u00B9', sup2: '\u00B2', sup3: '\u00B3', frac14: '\u00BC', frac12: '\u00BD',
  frac34: '\u00BE', iquest: '\u00BF', iexcl: '\u00A1', micro: '\u00B5', plusmn: '\u00B1', deg: '\u00B0',
  times: '\u00D7', divide: '\u00F7', minus: '\u2212', lowast: '\u2217', radic: '\u221A', infin: '\u221E',
  int: '\u222B', ne: '\u2260', le: '\u2264', ge: '\u2265', asymp: '\u2248', equiv: '\u2261',
  plus: '+', comma: ',', period: '.', colon: ':', semi: ';', sol: '/', bsol: '\\', quest: '?',
  lpar: '(', rpar: ')', lsqb: '[', rsqb: ']', lcub: '{', rcub: '}', verbar: '|', Hat: '^',
  tilde: '~', Tab: '\t', NewLine: '\n', excl: '!', num: '#', dollar: '$', percnt: '%', ast: '*',
  'Tab;': '\t',
  Alpha: '\u0391', Beta: '\u0392', Gamma: '\u0393', Delta: '\u0394', Epsilon: '\u0395', Zeta: '\u0396',
  Eta: '\u0397', Theta: '\u0398', Iota: '\u0399', Kappa: '\u039A', Lambda: '\u039B', Mu: '\u039C',
  Nu: '\u039D', Xi: '\u039E', Omicron: '\u039F', Pi: '\u03A0', Rho: '\u03A1', Sigma: '\u03A3',
  Tau: '\u03A4', Upsilon: '\u03A5', Phi: '\u03A6', Chi: '\u03A7', Psi: '\u03A8', Omega: '\u03A9',
  alpha: '\u03B1', beta: '\u03B2', gamma: '\u03B3', delta: '\u03B4', epsilon: '\u03B5', zeta: '\u03B6',
  eta: '\u03B7', theta: '\u03B8', iota: '\u03B9', kappa: '\u03BA', lambda: '\u03BB', mu: '\u03BC',
  nu: '\u03BD', xi: '\u03BE', omicron: '\u03BF', pi: '\u03C0', rho: '\u03C1', sigmaf: '\u03C2',
  sigma: '\u03C3', tau: '\u03C4', upsilon: '\u03C5', phi: '\u03C6', chi: '\u03C7', psi: '\u03C8',
  omega: '\u03C9', thetasym: '\u03D1', upsih: '\u03D2', piv: '\u03D6',
  forall: '\u2200', part: '\u2202', exist: '\u2203', empty: '\u2205', nabla: '\u2207', isin: '\u2208',
  notin: '\u2209', ni: '\u220B', prod: '\u220F', sum: '\u2211', prop: '\u221D', ang: '\u2220', and: '\u2227', or: '\u2228', cap: '\u2229', cup: '\u222A',
  there4: '\u2234', sim: '\u223C', cong: '\u2245', sdot: '\u22C5', lceil: '\u2308', rceil: '\u2309',
  lfloor: '\u230A', rfloor: '\u230B', lang: '\u2329', rang: '\u232A', loz: '\u25CA', spades: '\u2660',
  clubs: '\u2663', hearts: '\u2665', diams: '\u2666', ensp: '\u2002', emsp: '\u2003', thinsp: '\u2009',
  zwnj: '\u200C', zwj: '\u200D', lrm: '\u200E', rlm: '\u200F', shy: '\u00AD', fnof: '\u0192', circ: '\u02C6', Dcaron: '\u010E', dcaron: '\u010F',
  HilbertSpace: '\u210B', DifferentialD: '\u2146', ClockwiseContourIntegral: '\u2232', ngE: '\u2267\u0338',
  lArr: '\u2190', uArr: '\u2191', rArr: '\u2192', dArr: '\u2193', hArr: '\u2194', crarr: '\u21B5',
  larr: '\u2190', uarr: '\u2191', rarr: '\u2192', darr: '\u2193', harr: '\u2194',
  OElig: '\u0152', oelig: '\u0153', Scaron: '\u0160', scaron: '\u0161', Yuml: '\u0178',
  'fjlig': 'fj', check: '\u2713', cross: '\u2717', star: '\u2605',
  permille: '\u2030', image: '\u2111', weierp: '\u2118', real: '\u211C', alefsym: '\u2135',
  CounterClockwiseContourIntegral: '\u2233', DoubleLongLeftRightArrow: '\u27FA',
  NotEqualTilde: '\u2242\u0338', // long-tail entities seen in generated docs
};

const BLOCK_TAGS = new Set(('address article aside base basefont blockquote body caption center col colgroup dd details dialog dir div dl dt fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html iframe legend li link main menu menuitem nav noframes ol optgroup option p param search section summary table tbody td tfoot th thead title tr track ul').split(' '));

const ASCII_PUNCT = new Set('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split(''));
const PUNCT_RE = /\p{P}|\p{S}/u;
const WS_RE = /\s/u;
function isWS(ch) { return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f' || ch === '\v' || ch === '\u00A0' || ch === '\u1680' || (ch >= '\u2000' && ch <= '\u200A') || ch === '\u2028' || ch === '\u2029' || ch === '\u202F' || ch === '\u205F' || ch === '\u3000' || ch === '\uFEFF'; }
function isPunct(ch) { return ch !== undefined && (ASCII_PUNCT.has(ch) || PUNCT_RE.test(ch)); }
function isSpace(ch) { return ch === ' ' || ch === '\t' || ch === '\n'; }

function geText(s) {
  // marked's ge(): strip trailing blank lines, but only when there are
  // 2+ of them (a single trailing newline is kept)
  const e = s.split('\n');
  let t = e.length - 1;
  for (; t >= 0 && /^[ \t]*$/.test(e[t]);) t--;
  return e.length - t <= 2 ? s : e.slice(0, t + 1).join('\n');
}
function escapeHtml(s, encode) {
  let out = '', start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i); let rep = null;
    if (c === 38) rep = '&amp;';
    else if (c === 60) rep = '&lt;';
    else if (c === 62) rep = '&gt;';
    else if (c === 34) rep = '&quot;';
    else if (c === 39) rep = '&#39;';
    if (rep !== null) { out += s.slice(start, i) + rep; start = i + 1; }
  }
  return start === 0 ? s : out + s.slice(start);
}
function escapeNoEncode(s) {
  // escape < > " ' and & only when not part of a valid entity/char ref
  let out = '', start = 0, i = 0;
  while (i < s.length) {
    const c = s.charCodeAt(i); let rep = null;
    if (c === 38) {
      const m = /^&(#\d{1,7}|#[xX][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]*);/.exec(s.slice(i, i + 40));
      if (m) { i += m[0].length; continue; }
      rep = '&amp;';
    } else if (c === 60) rep = '&lt;';
    else if (c === 62) rep = '&gt;';
    else if (c === 34) rep = '&quot;';
    else if (c === 39) rep = '&#39;';
    if (rep !== null) { out += s.slice(start, i) + rep; start = i + 1; }
    i++;
  }
  return start === 0 ? s : out + s.slice(start);
}

function decodeEntityRef(s) {
  // numeric character reference only (named entities are never decoded).
  // s starts with '&'; returns {ch, len} or null. Decimal <=7 digits, hex <=6.
  if (s[1] !== '#') return null;
  let j = 2, hex = false;
  if (s[2] === 'x' || s[2] === 'X') { hex = true; j = 3; }
  let k = j, num = 0, digits = 0;
  const maxDigits = hex ? 6 : 7;
  while (k < s.length && digits < maxDigits) {
    const c = s.charCodeAt(k);
    let d = -1;
    if (c >= 48 && c <= 57) d = c - 48;
    else if (hex && c >= 65 && c <= 70) d = c - 55;
    else if (hex && c >= 97 && c <= 102) d = c - 87;
    if (d < 0) break;
    num = num * (hex ? 16 : 10) + d; digits++; k++;
  }
  if (digits === 0 || k >= s.length || s[k] !== ';') return null;
  if (num === 0 || num > 0x10FFFF || (num >= 0xD800 && num <= 0xDFFF)) return { ch: '\uFFFD', len: k + 1 };
  if (num === 38) return { ch: '&amp;', len: k + 1 };
  return { ch: String.fromCodePoint(num), len: k + 1 };
}

function cleanUrl(url) {
  if (!url) return url;
  // reject lone surrogates
  for (let i = 0; i < url.length; i++) {
    const c = url.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF) {
      if (i + 1 >= url.length || url.charCodeAt(i + 1) < 0xDC00 || url.charCodeAt(i + 1) > 0xDFFF) return null;
      i++;
    } else if (c >= 0xDC00 && c <= 0xDFFF) return null;
  }
  try { return encodeURI(url).replace(/%25/g, '%'); } catch { return null; }
}

function normalizeLabel(s) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase().replace(/\u1E9E/g, 'ss').replace(/\u00DF/g, 'ss');
}
function normalizeDest(s) {
  // resolve backslash escapes only; entities in a destination stay verbatim
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\' && i + 1 < s.length && ASCII_PUNCT.has(s[i + 1])) { out += s[i + 1]; i++; }
    else out += ch;
  }
  return out;
}
function normalizeTitle(s) {
  return normalizeDest(s);
}

// ---------- inline parsing ----------
const EMAIL_CORE = '[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+';
// marked's lexer keeps an inLink flag across the whole document: an opening
// <a ...> tag (even self-closing '<a />') sets it, and only a '</a>' clears
// it. While set, extended autolinks (www./scheme/bare email) are NOT
// formed. Reset per parse() call; updated by parseInline when it sees an
// inline <a> tag.
let inLinkDoc = false;
const EMAIL_RE = new RegExp('(?:mailto:' + EMAIL_CORE + '|xmpp:' + EMAIL_CORE + '(?:\\/[A-Za-z0-9@.]+)?|' + EMAIL_CORE + ')(?![\\w-])', 'g');
// relaxed lookahead (allows trailing _/*): used only to extend a strict
// match that was truncated by a following emphasis closer
const EMAIL_RE_RELAXED = new RegExp('(?:mailto:' + EMAIL_CORE + '|xmpp:' + EMAIL_CORE + '(?:\\/[A-Za-z0-9@.]+)?|' + EMAIL_CORE + ')(?![A-Za-z0-9-])', 'g');
const SCHEME_RE = /^(?:https?|ftp):\/\//i;
function scanEmails(text) {
  const out = []; let m;
  EMAIL_RE.lastIndex = 0;
  while ((m = EMAIL_RE.exec(text)) !== null) {
    let s = m.index, t = m[0];
    // the strict lookahead backtracks the domain when the email sits
    // inside '__...__' (the closing '__' is a word char); if a relaxed
    // match from the same start is longer, the strict one was truncated
    // and the full address is the email (gfm-632 'a.b-c_d@a.b_' has NO
    // strict match at all, so it is never extended and stays literal)
    EMAIL_RE_RELAXED.lastIndex = s;
    const r = EMAIL_RE_RELAXED.exec(text);
    if (r && r.index === s && r[0].length > t.length) t = r[0];
    // a leading run of '_'/'*' is an emphasis delimiter, not part of the
    // email, when the email is closed by the same run (marked tokenizes
    // emphasis first, so the email inside '__...__' starts after the '__');
    // a bare leading '_' with no closer stays part of the address
    const lead = /^([_*]+)/.exec(t);
    if (lead && (text[s + t.length] === lead[1][0] || text.slice(s + t.length, s + t.length + 2) === lead[1])) {
      s += lead[1].length;
      t = t.slice(lead[1].length);
    }
    out.push({ s, e: s + t.length, t });
  }
  return out;
}
function trimAutolinkEnd(u) {
  // marked's _backpedal: longest prefix formed of units — a run of chars
  // outside ?!.,:;*_'"~()&, a balanced (...) group, a '&' that does not
  // start an entity running to the end, or a run of ?!.,:;*_'"~) that is
  // NOT at the very end. A trailing ')' is kept only when it closes a
  // balanced group (so 'https://a.io)](https://b.io)' keeps its final
  // ')', while a trailing unbalanced ')' is trimmed).
  const P = new Set(['?', '!', '.', ',', ':', ';', '*', '_', "'", '"', '~', ')']);
  let i = 0;
  while (i < u.length) {
    const c = u[i];
    if (c === '(') {
      const close = u.indexOf(')', i + 1);
      if (close !== -1) { i = close + 1; continue; }
      // no closing ')': '(' is NOT in the trailing-punct set, so the URL
      // ends before it (an unmatched '(' is never kept)
      break;
    }
    if (c === '&') {
      const m = /^&(?:#\d+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/.exec(u.slice(i));
      if (!m) { i++; continue; }
      if (i + m[0].length === u.length) break; // entity runs to the end: trim it
      i++; continue;
    }
    if (!P.has(c) && c !== '(') {
      // run of chars outside the punct set (and not '(')
      let j = i;
      while (j < u.length && !P.has(u[j]) && u[j] !== '(' && u[j] !== '&') j++;
      i = j; continue;
    }
    // punctuation run (')' and the other trailing-punct chars; '(' is NOT
    // in the set, so a bare '(' is handled above and never lands here)
    let j = i;
    while (j < u.length && P.has(u[j])) j++;
    if (j < u.length) { i = j; continue; }
    break; // punct run reaches the end: trim it
  }
  return i;
}
function matchExtAutolink(text, i) {
  // returns {end, href, display} or null; i at start of www. or scheme://
  let isWww = false, j = i;
  if (text.startsWith('www.', i)) { isWww = true; j = i + 4; }
  else {
    const m = SCHEME_RE.exec(text.slice(i, i + 40));
    if (!m) return null;
    j = i + m[0].length;
  }
  let k = j;
  while (k < text.length) {
    const c = text[k];
    if (c === ' ' || c === '\t' || c === '\n' || c === '<') break;
    k++;
  }
  if (k === j) return null;
  let raw = text.slice(i, k);
  const te = trimAutolinkEnd(raw);
  if (te <= (isWww ? 4 : 0)) return null;
  raw = raw.slice(0, te);
  // domain must contain a dot for www. (else not an autolink); scheme links need a host char
  const hostPart = isWww ? raw.slice(4) : raw.slice(raw.indexOf('://') + 3);
  if (!hostPart) return null;
  if (isWww && !/^[^\s\/]*\.[^\s\/]/.test(hostPart)) return null;
  const href = (isWww ? 'http://' : '') + raw;
  return { end: i + te, href, display: raw };
}
function scanLabel(text, i) {
  // i = index just after '['; returns {end, raw} where end is index of ']' or -1
  let j = i;
  while (j < text.length && j - i < 999) {
    const c = text[j];
    if (c === '\\' && j + 1 < text.length) { j += 2; continue; }
    if (c === '[') return { end: -1, raw: '' };
    if (c === ']') return { end: j, raw: text.slice(i, j) };
    j++;
  }
  return { end: -1, raw: '' };
}
function skipWSNL(text, i) {
  while (i < text.length && (text[i] === ' ' || text[i] === '\t' || text[i] === '\n')) i++;
  return i;
}
function parseDest(text, i) {
  // i at start of destination; returns {end, dest} or null
  if (text[i] === '<') {
    let j = i + 1, out = '';
    while (j < text.length) {
      const c = text[j];
      if (c === '\n') return null;
      if (c === '>') return { end: j + 1, dest: out };
      if (c === '\\' && j + 1 < text.length && ASCII_PUNCT.has(text[j + 1])) { out += text[j + 1]; j += 2; continue; }
      out += c; j++;
    }
    return null;
  }
  let j = i, depth = 0;
  while (j < text.length) {
    const c = text[j];
    if (c === ' ' || c === '\t' || c === '\n' || c.charCodeAt(0) < 32) break;
    if (c === '\\' && j + 1 < text.length && ASCII_PUNCT.has(text[j + 1])) { j += 2; continue; }
    if (c === '(') { depth++; j++; continue; }
    if (c === ')') { if (depth === 0) break; depth--; j++; continue; }
    j++;
  }
  return { end: j, dest: normalizeDest(text.slice(i, j)) };
}
function parseTitle(text, i) {
  // i at opening quote char; returns {end, title} or null
  const q = text[i];
  let j = i + 1, out = '';
  if (q === '(') {
    while (j < text.length) {
      const c = text[j];
      if (c === ')') return { end: j + 1, title: out };
      if (c === '(') return null;
      if (c === '\\' && j + 1 < text.length && ASCII_PUNCT.has(text[j + 1])) { out += text[j + 1]; j += 2; continue; }
      out += c; j++;
    }
    return null;
  }
  while (j < text.length) {
    const c = text[j];
    if (c === q) return { end: j + 1, title: out };
    if (q === "'" && c === '\n' && text[j + 1] === '\n') return null; // blank line inside '...' title
    if (c === '\\' && j + 1 < text.length && ASCII_PUNCT.has(text[j + 1])) { out += text[j + 1]; j += 2; continue; }
    out += c; j++;
  }
  return null;
}
// Parse a link reference definition starting at text[i] (line start, <=3 spaces already stripped).
// Returns {end, label, dest, title} or null. end is index just past the def (before the newline).
function parseRefDef(text, i) {
  let j = i;
  if (text[j] !== '[') return null;
  const lab = scanLabel(text, j + 1);
  if (lab.end < 0) return null;
  let label = normalizeLabel(lab.raw);
  if (!label) return null;
  j = lab.end + 1;
  if (text[j] !== ':') return null;
  j++;
  // spaces/tabs, at most one newline
  let k = j;
  while (k < text.length && (text[k] === ' ' || text[k] === '\t')) k++;
  if (text[k] === '\n') { k++; while (k < text.length && (text[k] === ' ' || text[k] === '\t')) k++; }
  const d = parseDest(text, k);
  if (!d) return null;
  // an empty bare dest is invalid (an empty angle dest <> is fine)
  if (d.dest === '' && text[k] !== '<') return null;
  k = d.end;
  let title = null;
  // optional title: same line (needs ws before it) or on the next line
  let m = k;
  while (m < text.length && (text[m] === ' ' || text[m] === '\t')) m++;
  if (m < text.length && (text[m] === '"' || text[m] === "'" || text[m] === '(')) {
    if (m === k) return null; // title without preceding whitespace -> def fails
    const t = parseTitle(text, m);
    if (!t) return null; // same-line title that fails to parse -> def fails
    title = t.title; k = t.end;
  } else if (m < text.length && text[m] === '\n') {
    // title may be on the next line (even after trailing spaces on the dest line)
    let n = m + 1;
    while (n < text.length && (text[n] === ' ' || text[n] === '\t')) n++;
    if (n < text.length && (text[n] === '"' || text[n] === "'" || text[n] === '(')) {
      const t = parseTitle(text, n);
      if (t) {
        // junk after the title on its line -> keep the def WITHOUT the title
        let e2 = t.end;
        while (e2 < text.length && (text[e2] === ' ' || text[e2] === '\t')) e2++;
        if (e2 >= text.length || text[e2] === '\n') { title = t.title; k = t.end; }
      }
      // else: title parse failed -> def without title stays valid
    }
  }
  // after dest/title, only spaces then end of line
  let e = k;
  while (e < text.length && (text[e] === ' ' || text[e] === '\t')) e++;
  if (e < text.length && text[e] !== '\n') return null;
  return { end: e, label, dest: d.dest, title };
}
function resolveEscapes(s) {
  // backslash escapes only; entities in a label stay verbatim
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && ASCII_PUNCT.has(s[i + 1])) { out += s[i + 1]; i++; }
    else out += c;
  }
  return out;
}
// Strip leading ref defs from paragraph text. Returns {text, defs:[{label,dest,title}]}.
function extractRefDefs(text, refs) {
  let i = 0, defs = [];
  while (i < text.length) {
    // count leading spaces on this line (<=3)
    let j = i, sp = 0;
    while (j < text.length && text[j] === ' ' && sp < 4) { j++; sp++; }
    if (sp === 4 || text[j] !== '[') break;
    const d = parseRefDef(text, j);
    if (!d) break;
    defs.push(d);
    if (!refs.has(d.label)) refs.set(d.label, { dest: d.dest, title: d.title });
    i = d.end;
    if (text[i] === '\n') i++;
    else break;
  }
  return { text: text.slice(i), defs };
}

// ---------- inline main scan ----------
function matchInlineHtml(text, i) {
  // returns end index (exclusive) or -1
  if (text.startsWith('<!--', i)) {
    if (text.startsWith('<!-->', i)) return i + 5;
    if (text.startsWith('<!--->', i)) return i + 6;
    const e = text.indexOf('-->', i + 4);
    return e < 0 ? -1 : e + 3;
  }
  if (text.startsWith('<?', i)) {
    const e = text.indexOf('?>', i + 2);
    return e < 0 ? -1 : e + 2;
  }
  if (text.startsWith('<![CDATA[', i)) {
    const e = text.indexOf(']]>', i + 9);
    return e < 0 ? -1 : e + 3;
  }
  if (text.startsWith('<!', i) && i + 2 < text.length && /[A-Za-z]/.test(text[i + 2])) {
    const e = text.indexOf('>', i + 2);
    return e < 0 ? -1 : e + 1;
  }
  if (text.startsWith('</', i)) {
    const m = /^<\/[A-Za-z][A-Za-z0-9-]*[ \t\n]*>/.exec(text.slice(i, i + 64));
    return m ? i + m[0].length : -1;
  }
  const m = /^<[A-Za-z][A-Za-z0-9-]*/.exec(text.slice(i, i + 64));
  if (!m) return -1;
  let j = i + m[0].length;
  while (true) {
    // whitespace is required before an attribute (but not before > or />)
    let k = j;
    while (k < text.length && (text[k] === ' ' || text[k] === '\t' || text[k] === '\n')) k++;
    if (k >= text.length) return -1;
    if (text[k] === '>') return k + 1;
    if (text[k] === '/') {
      if (text[k + 1] === '>') return k + 2;
      return -1;
    }
    if (k === j) return -1; // attribute without preceding whitespace
    j = k;
    // attribute
    const am = /^[A-Za-z_:][A-Za-z0-9_.:-]*/.exec(text.slice(j, j + 64));
    if (!am) return -1;
    j += am[0].length;
    // peek for '=' after optional whitespace; only consume the whitespace
    // when '=' follows (a boolean attribute leaves it for the loop top)
    let k2 = j;
    while (k2 < text.length && (text[k2] === ' ' || text[k2] === '\t' || text[k2] === '\n')) k2++;
    if (text[k2] === '=') {
      j = k2 + 1;
      while (j < text.length && (text[j] === ' ' || text[j] === '\t' || text[j] === '\n')) j++;
      if (j >= text.length) return -1;
      const q = text[j];
      if (q === '"' || q === "'") {
        j++;
        while (j < text.length && text[j] !== q) j++;
        if (j >= text.length) return -1;
        j++;
      } else {
        let k3 = j;
        while (k3 < text.length && !/[\s"'=<>`]/.test(text[k3])) k3++;
        if (k3 === j) return -1;
        j = k3;
      }
    }
  }
}
function matchAngleAutolink(text, i) {
  // returns {end, href, display} or null
  const m = /^<([a-zA-Z][a-zA-Z0-9+.-]{1,31}:[^\s<>]*)>/.exec(text.slice(i, i + 512));
  if (m) return { end: i + m[0].length, href: m[1], display: m[1] };
  const e = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/.exec(text.slice(i, i + 512));
  if (e) return { end: i + e[0].length, href: 'mailto:' + e[1], display: e[1] };
  return null;
}
function flanking(text, i, n) {
  const before = i > 0 ? text[i - 1] : undefined;
  const after = i + n < text.length ? text[i + n] : undefined;
  const afterWS = after === undefined || isWS(after);
  const beforeWS = before === undefined || isWS(before);
  const afterPunct = after !== undefined && isPunct(after);
  const beforePunct = before !== undefined && isPunct(before);
  const left = !afterWS && (!afterPunct || beforeWS || beforePunct);
  const right = !beforeWS && (!beforePunct || afterWS || afterPunct);
  return { left, right, before, after };
}
function labelValid(raw) {
  // a lone unescaped backtick at the top level of a link label breaks the
  // link (marked's label regex only allows backticks in a code span, as
  // TWO-or-more trailing backticks before ], or inside a nested bracket);
  // a backtick inside a nested bracket is fine (its content regex allows
  // backticks). A single trailing backtick is NOT allowed.
  let depth = 0, i = 0;
  const n = raw.length;
  while (i < n) {
    const c = raw[i];
    if (c === '\\' && i + 1 < n) { i += 2; continue; }
    if (c === '[') { depth++; i++; continue; }
    if (c === ']') { if (depth > 0) depth--; i++; continue; }
    if (c === '`' && depth === 0) {
      let j = i;
      while (j < n && raw[j] === '`') j++;
      const runLen = j - i;
      // trailing backticks before ] are fine only if there are 2+ of them
      if (j === n) return runLen >= 2;
      // otherwise the run must open a code span: any later backtick run
      // (of any length) closes it
      let k = j, found = -1;
      while (k < n) {
        if (raw[k] === '`') { found = k; break; }
        if (raw[k] === '\\' && k + 1 < n) k += 2;
        else k++;
      }
      if (found < 0) return false; // no closing backtick: lone backtick
      let l = found;
      while (l < n && raw[l] === '`') l++;
      i = l;
      continue;
    }
    i++;
  }
  return true;
}
function formLink(text, i, br, refs) {
  // i = index of ']'; br = bracket record. Returns {href, title, end} or null.
  const labelRaw = text.slice(br.start + 1, i);
  if (!labelValid(labelRaw)) return null;
  const j = i + 1;
  if (text[j] === '(') {
    let k = skipWSNL(text, j + 1);
    const d = parseDest(text, k);
    if (d) {
      let m = skipWSNL(text, d.end);
      if (text[m] === ')') return { href: d.dest, title: null, end: m + 1 };
      if (text[m] === '"' || text[m] === "'" || text[m] === '(') {
        const t = parseTitle(text, m);
        if (t) {
          const m2 = skipWSNL(text, t.end);
          if (text[m2] === ')') return { href: d.dest, title: t.title, end: m2 + 1 };
        }
      }
    }
    // failed inline -> fall back to shortcut
  } else if (text[j] === '[') {
    const lab2 = scanLabel(text, j + 1);
    if (lab2.end < 0) return null;
    const lab = lab2.end === j + 1 ? labelRaw : lab2.raw;
    const ref = refs.get(normalizeLabel(lab));
    if (!ref) return null;
    return { href: ref.dest, title: ref.title, end: lab2.end + 1 };
  }
  const ref = refs.get(normalizeLabel(labelRaw));
  if (!ref) return null;
  return { href: ref.dest, title: ref.title, end: i + 1 };
}

function parseInline(text, refs, plain) {
  const chunks = [];
  let seq = 0;
  function newChunk(s) { const c = { s, ins: [], dead: false, auto: null, seq: seq++ }; chunks.push(c); return c; }
  let cur = newChunk('');
  const delims = []; // {ch, chunk, off, n, canOpen, canClose, active, usedOpen, usedClose}
  const brackets = []; // {chunk, off, start, image, active}
  const badSpans = []; // code spans with a >=2 backtick delimiter whose content holds a backtick: {s, e} in text positions
  const codeSpans = []; // every formed code span: {s, e} in text positions
  const badRuns = []; // >=2 backtick runs with no same-length closer (marked's
  // emphasis masking still sees a shorter code span inside them)
  const linkBounds = []; // {s, e} seq ranges
  const emails = plain ? [] : scanEmails(text);
  let ei = 0;
  let buf = '';
  let bufStart = 0; // index in text where the current run started
  function flush() {
    if (!buf) return;
    const run = buf; buf = '';
    if (plain) { cur.s += resolveEscapes(run); return; }
    // while inLink (an <a> tag seen, no </a> yet) extended autolinks are
    // not formed at all: the run is literal text
    if (inLinkDoc) { cur.s += escapeNoEncode(resolveEntities(run)); return; }
    // split run on www./scheme autolinks
    let p = 0;
    while (p < run.length) {
      let best = -1, bestM = null;
      // find earliest autolink start at or after p
      for (let q = p; q < run.length; q++) {
        if (run.startsWith('www.', q)) {
          // www. boundary: the preceding char (in the full text) must be
          // whitespace, *, _, ~, ( or start-of-string
          const before = q > 0 ? run[q - 1] : (bufStart > 0 ? text[bufStart - 1] : '');
          if (before !== '' && before !== ' ' && before !== '\t' && before !== '\n' && before !== '*' && before !== '_' && before !== '~' && before !== '(') continue;
          const m = matchExtAutolink(run, q);
          if (m) { best = q; bestM = m; break; }
        } else if (SCHEME_RE.test(run.slice(q, q + 40))) {
          const m = matchExtAutolink(run, q);
          if (m) { best = q; bestM = m; break; }
        }
      }
      if (best < 0) { cur.s += escapeNoEncode(resolveEntities(run.slice(p))); break; }
      if (best > p) cur.s += escapeNoEncode(resolveEntities(run.slice(p, best)));
      const href = cleanUrl(bestM.href);
      if (href === null) { cur.s += escapeNoEncode(resolveEntities(run.slice(best, bestM.end))); p = bestM.end; continue; }
      const a = newChunk('<a href="' + escapeHtml(href) + '">' + escapeHtml(bestM.display) + '</a>');
      a.auto = bestM.display;
      cur = newChunk('');
      p = bestM.end;
    }
  }
  function resolveEntities(s) {
    // marked's unescape: numeric refs only (1-7 dec / 1-6 hex digits); named stay
    // verbatim; a bare & not forming a valid ref becomes &amp;; &#38; -> &amp;.
    if (!s.includes('&')) return s;
    return s.replace(/&#(?:(\d{1,7})|[xX]([0-9A-Fa-f]{1,6}));|&(?!(?:#\d{1,7}|#[xX][0-9A-Fa-f]{1,6}|\w+);)/g, (m, dec, hex) => {
      if (dec === undefined && hex === undefined) return '&amp;';
      const num = dec !== undefined ? parseInt(dec, 10) : parseInt(hex, 16);
      if (num === 0 || num > 0x10FFFF || (num >= 0xD800 && num <= 0xDFFF)) return '\uFFFD';
      if (num === 38) return '&amp;';
      return String.fromCodePoint(num);
    });
  }
  const n = text.length;
  function anyEnclosingLinkForms(pos) {
    // would any still-open bracket enclosing pos form a link? (used by the
    // code-span guard: a code span must not swallow a ']' that closes a
    // link that would form, but may span one when no link would form)
    const open = [];
    for (let b = brackets.length - 1; b >= 0; b--) if (!brackets[b].done) open.push(brackets[b]);
    if (!open.length) return false;
    const closes = [];
    for (let q = pos; q < n && closes.length < open.length; q++) {
      if (text[q] === '\\' && q + 1 < n) { q++; continue; }
      if (text[q] === ']') closes.push(q);
    }
    for (let k = 0; k < open.length && k < closes.length; k++) {
      if (formLink(text, closes[k], open[k], refs)) return true;
    }
    return false;
  }
  let i = 0;
  while (i < n) {
    // skip any pre-scanned email whose start the loop has already passed
    // (inside an angle autolink, code span, HTML tag, ...)
    while (!plain && ei < emails.length && emails[ei].s < i) ei++;
    if (!plain && !inLinkDoc && ei < emails.length && i === emails[ei].s) {
      const em = emails[ei++];
      flush();
      const href = (em.t.startsWith('mailto:') || em.t.startsWith('xmpp:')) ? em.t : 'mailto:' + em.t;
      const a = newChunk('<a href="' + escapeHtml(href) + '">' + escapeHtml(em.t) + '</a>');
      a.auto = em.t;
      cur = newChunk('');
      i = em.e;
      continue;
    }
    const ch = text[i];
    if (ch === '\\') {
      if (i + 1 < n && text[i + 1] === '\n') {
        // a backslash that an extended autolink (www./scheme) would consume
        // is part of the URL, not a hard break: test whether an autolink in
        // buf, extended by this backslash, reaches past buf
        let consumed = false;
        if (!plain) {
          const ext = buf + '\\';
          for (let q = 0; q < buf.length; q++) {
            if (buf.startsWith('www.', q)) {
              const before = q > 0 ? buf[q - 1] : (bufStart > 0 ? text[bufStart - 1] : '');
              if (before !== '' && before !== ' ' && before !== '\t' && before !== '\n' && before !== '*' && before !== '_' && before !== '~' && before !== '(') continue;
              const m = matchExtAutolink(ext, q);
              if (m && m.end > buf.length) { consumed = true; break; }
            } else if (SCHEME_RE.test(buf.slice(q, q + 40))) {
              const m = matchExtAutolink(ext, q);
              if (m && m.end > buf.length) { consumed = true; break; }
            }
          }
        }
        if (consumed) { buf += '\\'; i++; continue; }
        flush();
        cur = newChunk(plain ? '\n' : '<br>');
        cur = newChunk('');
        i += 2;
        while (i < n && (text[i] === ' ' || text[i] === '\t')) i++;
        continue;
      }
      if (i + 1 < n && ASCII_PUNCT.has(text[i + 1])) { flush(); cur.s += escapeHtml(text[i + 1]); i += 2; continue; }
      buf += '\\'; i++; continue;
    }
    if (ch === '\n') {
      if (/ {2,}$/.test(buf)) {
        buf = buf.replace(/ +$/, '');
        flush();
        cur = newChunk(plain ? '\n' : '<br>');
        cur = newChunk('');
        i++;
        while (i < n && (text[i] === ' ' || text[i] === '\t')) i++;
        continue;
      }
      buf += '\n'; i++; continue;
    }
    if (ch === '`') {
      let j = i;
      while (j < n && text[j] === '`') j++;
      const runLen = j - i;
      // find matching run
      let k = j, found = -1;
      while (k < n) {
        if (text[k] === '`') {
          let l = k;
          while (l < n && text[l] === '`') l++;
          if (l - k === runLen) { found = k; break; }
          k = l;
        } else k++;
      }
      if (found < 0) {
        // a >=2 backtick run with no same-length closer: marked's
        // emphasis masking still treats the inner backtick as a code
        // span delimiter, so it counts as a "bad" span for the
        // formed-link suppression
        if (!plain && runLen >= 2) badRuns.push({ s: i, e: j });
        buf += '`'.repeat(runLen); i = j; continue;
      }
      // a code span inside a link label may only close within the label
      // (marked's label regex): if an unmatched '[' is open and the
      // matching backtick lies past the next ']' (which closes that
      // bracket), the link takes precedence — but only when some enclosing
      // link would actually form; if no link would form, the code span
      // spans the ']' (cm-342/525/537)
      if (!plain) {
        let openBr = false;
        for (let b = brackets.length - 1; b >= 0; b--) if (!brackets[b].done) { openBr = true; break; }
        if (openBr) {
          let closeBr = -1;
          for (let q = j; q < n; q++) {
            if (text[q] === '\\' && q + 1 < n) { q++; continue; }
            if (text[q] === ']') { closeBr = q; break; }
          }
          if (closeBr >= 0 && found > closeBr && anyEnclosingLinkForms(i)) {
            // the span is suppressed so the link can form: the run is
            // unmatched for emphasis-masking purposes, so it counts as a
            // "bad" run (its backtick still throws off marked's masking)
            if (!plain && runLen >= 2) badRuns.push({ s: i, e: j });
            buf += '`'.repeat(runLen); i = j; continue;
          }
        }
      }
      let content = text.slice(j, found).replace(/\n/g, ' ');
      // a "bad" code span: delimiter >= 2 backticks and a backtick inside
      // the content — marked's emphasis masking miscounts these inside a
      // failed inline link's label (odd count suppresses emphasis)
      if (!plain && runLen >= 2 && text.slice(j, found).includes('`')) badSpans.push({ s: i, e: found + runLen });
      if (!plain) codeSpans.push({ s: i, e: found + runLen });
      if (content.length >= 2 && content[0] === ' ' && content[content.length - 1] === ' ' && /[^ ]/.test(content)) content = content.slice(1, -1);
      flush();
      if (plain) { cur.s += content; }
      else {
        cur = newChunk('<code>' + escapeHtml(content) + '</code>');
        cur = newChunk('');
      }
      i = found + runLen;
      continue;
    }
    if (ch === '*' || ch === '_' || ch === '~') {
      let j = i;
      while (j < n && text[j] === ch) j++;
      const runLen = j - i;
      // a run of 3+ tildes can never form strikethrough (GFM: the opening
      // must be 1-2 tildes and the content must not start with ~), so it is
      // literal text, not a delimiter
      if (ch === '~' && runLen >= 3) { buf += text.slice(i, j); i = j; continue; }
      flush();
      const fl = flanking(text, i, runLen);
      let canOpen, canClose;
      if (ch === '_') {
        canOpen = fl.left && (!fl.right || (fl.before !== undefined && isPunct(fl.before)));
        canClose = fl.right && (!fl.left || (fl.after !== undefined && isPunct(fl.after)));
      } else {
        canOpen = fl.left; canClose = fl.right;
      }
      delims.push({ ch, chunk: cur, off: cur.s.length, pos: i, n: runLen, canOpen, canClose, active: true, usedOpen: 0, usedClose: 0 });
      i = j;
      continue;
    }
    if (ch === '[') {
      flush();
      brackets.push({ chunk: cur, off: cur.s.length, start: i, image: false, active: true, formed: false, done: false, inLink: inLinkDoc });
      i++;
      continue;
    }
    if (ch === '!' && text[i + 1] === '[') {
      flush();
      brackets.push({ chunk: cur, off: cur.s.length, start: i + 1, image: true, active: true, formed: false, done: false, inLink: inLinkDoc });
      i += 2;
      continue;
    }
    if (ch === ']') {
      // the ']' matches the most recent UNMATCHED bracket (nesting order);
      // if that bracket is deactivated, the ']' is literal and outer
      // brackets are not tried at it
      let bi = -1;
      for (let b = brackets.length - 1; b >= 0; b--) if (!brackets[b].done) { bi = b; break; }
      if (bi < 0) { buf += ']'; i++; continue; }
      const br = brackets[bi];
      br.closePos = i; // the ']' that closes this bracket (for the bad-span parity check)
      if (!br.active) { brackets[bi].done = true; buf += ']'; i++; continue; }
      const link = formLink(text, i, br, refs);
      // a bracket that fails to form a link at its ']' is done: a later ']'
      // belongs to an outer bracket instead
      if (!link) { brackets[bi].done = true; brackets[bi].active = false; buf += ']'; i++; continue; }
      // an <a> tag inside this link's text set inLink temporarily; marked
      // restores the outer inLink once the link is formed, so do the same
      inLinkDoc = br.inLink;
      flush();
      const href = cleanUrl(link.href);
      if (href === null) { brackets[bi].done = true; brackets[bi].active = false; buf += ']'; i++; continue; }
      if (br.image) {
        const labelRaw = text.slice(br.start + 1, i);
        const alt = parseInline(labelRaw, refs, true);
        const img = plain ? alt : '<img src="' + escapeNoEncode(href) + '" alt="' + escapeNoEncode(alt) + '"' + (link.title !== null && link.title !== undefined ? ' title="' + escapeNoEncode(link.title) + '"' : '') + '>';
        // deactivate delimiters inside the image label only (not openers before it)
        for (const d of delims) if (d.active && d.chunk.seq > br.chunk.seq && d.chunk.seq <= cur.seq) d.active = false;
        for (const d of delims) if (d.active && d.chunk === br.chunk && d.off >= br.off) d.active = false;
        // the label text itself must not render: drop it from the bracket's
        // chunk (from the '[' on) and any insertions it spawned (an inner
        // link's <a> tags live here), and kill later label chunks
        let dead = false;
        for (const c of chunks) {
          if (c === br.chunk) { dead = true; continue; }
          if (dead) c.dead = true;
        }
        // brackets inside this image's label are dead: their '[' must not
        // render as a literal (the label text itself is dropped)
        for (const b of brackets) if (b.start > br.start && b.start < i) b.inLabel = true;
        br.chunk.s = br.chunk.s.slice(0, br.off);
        br.chunk.ins = br.chunk.ins.filter(ins => ins.off < br.off);
        br.chunk.ins.push({ off: br.off, pos: br.start, rank: 30000, text: img });
        cur = newChunk('');
        brackets[bi].active = false;
        brackets[bi].formed = true; brackets[bi].done = true;
        i = link.end;
        continue;
      }
      // strip nested single-chunk autolinks in range
      for (const c of chunks) if (c.seq >= br.chunk.seq && c.seq <= cur.seq && c.auto !== null) { c.s = escapeHtml(c.auto); c.auto = null; }
      // deactivate earlier non-image brackets
      for (let b = 0; b < bi; b++) if (!brackets[b].image) brackets[b].active = false;
      brackets[bi].active = false;
      brackets[bi].formed = true; brackets[bi].done = true;
      linkBounds.push({ s: br.start, e: i });
      if (!plain) {
        br.chunk.ins.push({ off: br.off, pos: br.start, rank: 30000, text: '<a href="' + escapeNoEncode(href) + '"' + (link.title !== null && link.title !== undefined ? ' title="' + escapeNoEncode(link.title) + '"' : '') + '>' });
        cur.ins.push({ off: cur.s.length, pos: i, rank: 30000, text: '</a>' });
      }
      i = link.end;
      continue;
    }
    if (ch === '<') {
      const aa = matchAngleAutolink(text, i);
      if (aa) {
        if (plain) { flush(); cur.s += aa.display; i = aa.end; continue; }
        const href = cleanUrl(aa.href);
        if (href !== null) {
          flush();
          cur = newChunk('<a href="' + escapeHtml(href) + '">');
          cur = newChunk(escapeHtml(aa.display));
          cur = newChunk('</a>');
          cur = newChunk('');
          i = aa.end;
          continue;
        }
      }
      const he = matchInlineHtml(text, i);
      if (he > 0) {
        flush();
        if (!plain) {
          // marked's tag tokenizer toggles the document-wide inLink flag:
          // an opening <a ...> (even self-closing) sets it, </a> clears it.
          // The text run before this tag was flushed above, so it is
          // unaffected by the new flag value.
          const tag = text.slice(i, he);
          if (/^<a[\s>]/.test(tag)) inLinkDoc = true;
          else if (/^<\/a[\s>]/.test(tag)) inLinkDoc = false;
        }
        if (!plain) { cur = newChunk(text.slice(i, he)); cur = newChunk(''); }
        i = he;
        continue;
      }
      buf += '<'; i++; continue;
    }
    if (!buf) bufStart = i;
    buf += ch; i++;
  }
  flush();
  // unformed brackets emit their literal '[' ('![' for images)
  for (const br of brackets) {
    if (!br.formed && !br.inLabel && !br.chunk.dead) br.chunk.ins.push({ off: br.off, pos: br.start, rank: 30000, text: br.image ? '![' : '[' });
  }
  // ---- emphasis resolution ----
  const bottom = { '*': -1, '_': -1, '~': -1 };
  const formed = [];
  let formSeq = 0; // pair formation order: first-formed = innermost span
  function crosses(o, d) {
    // positions in the paragraph text; spans cross iff exactly one endpoint
    // lies strictly inside the other span (sharing an endpoint is nesting)
    const os = o.pos, ds = d.pos;
    for (const b of linkBounds) {
      if (os < b.s && b.s < ds && ds < b.e) return true;
      if (b.s < os && os < b.e && b.e < ds) return true;
    }
    for (const b of formed) {
      if (os < b.s && b.s < ds && ds < b.e) return true;
      if (b.s < os && os < b.e && b.e < ds) return true;
    }
    return false;
  }
  function badSpanParity(o, d) {
    // marked suppresses an emphasis pair inside a FAILED inline link's
    // brackets when an ODD number of "bad" code spans (>=2 backticks with
    // a backtick inside) sit inside those brackets before the closer.
    // (Even count, or no enclosing failed inline link, leaves it alone.)
    let br = null;
    for (let b = brackets.length - 1; b >= 0; b--) {
      const x = brackets[b];
      if (x.formed) continue;
      if (x.start < o.pos && x.closePos !== undefined && x.closePos > d.pos && text[x.closePos + 1] === '(') { br = x; break; }
    }
    if (!br) return false;
    let count = 0;
    for (const s of badSpans) if (s.s >= br.start && s.e <= d.pos) count++;
    return (count % 2) === 1;
  }
  function badSpanFormedLink(o, d) {
    // marked suppresses an emphasis pair when an UNMATCHED >=2 backtick
    // run sits inside a FORMED link's label earlier in the paragraph
    // AND a code span starts after the pair's closer (any of *, _, __).
    // Only unmatched runs count here: a formed code span whose content
    // holds a backtick (badSpans) does NOT suppress (doc-33: the
    // `` `` a ` b `` `` span in [less ...]() leaves *markdown* alone).
    // A pair INSIDE a link's own label is never suppressed this way.
    for (const lb of linkBounds) if (o.pos >= lb.s && d.pos <= lb.e) return false;
    let badBefore = false;
    for (const s of badRuns) {
      if (s.e > o.pos) continue;
      for (const lb of linkBounds) if (s.s >= lb.s && s.e <= lb.e) { badBefore = true; break; }
      if (badBefore) break;
    }
    if (!badBefore) return false;
    // the later span may be a formed code span OR an unmatched >=2
    // backtick run (a bad run / bad span): e.g. doc-35's `` ``add` ``
    // after the pair is itself a bad run, and it still suppresses
    for (const c of codeSpans) if (c.s > d.pos) return true;
    for (const c of badRuns) if (c.s > d.pos) return true;
    for (const c of badSpans) if (c.s > d.pos) return true;
    return false;
  }
  for (let j = 0; j < delims.length; j++) {
    const d = delims[j];
    if (!d.active || !d.canClose) continue;
    while (d.active && d.canClose && d.n > 0) {
      let opener = null, odd = false;
      for (let k = j - 1; k > bottom[d.ch]; k--) {
        const o = delims[k];
        if (!o.active || o.ch !== d.ch || !o.canOpen) continue;
        if (crosses(o, d)) continue;
        // strikethrough delimiters must match in length (GFM backreference:
        // ~ pairs only with ~, ~~ only with ~~)
        if (d.ch === '~' && o.n !== d.n) continue;
        if (badSpanParity(o, d)) continue;
        if (badSpanFormedLink(o, d)) continue;
        if ((o.canOpen && o.canClose) || (d.canOpen && d.canClose)) {
          if ((o.n + d.n) % 3 === 0 && !(o.n % 3 === 0 && d.n % 3 === 0)) { odd = true; continue; }
        }
        // marked's forward scan from an opener skips a closer that can
        // both open and close when (openerCount + closerCount) % 3 === 0
        // (and not both % 3 === 0): that closer does not satisfy the
        // opener, so the opener cannot steal a later closer that an
        // intervening opener needs. E.g. '*a **b**c*': the inner '**'
        // opener (preceded by a space, so it counts as an opener) and its
        // closer (between b and c) is skipped for the outer '*' opener
        // (1+2)%3==0, so the outer '*' never forms, while the inner
        // '**b**' still forms <strong>. But '*foo**bar**baz*' (cm-411)
        // DOES form: its inner '**' is preceded by a letter, so it is a
        // closer-like run, not an opener that consumes the final '*'.
        // Likewise a pure closer ('**b** c') does not trigger this.
        {
          const oOrig = o.n + o.usedOpen + o.usedClose;
          let blocked = false;
          for (let q = k + 1; q < j && !blocked; q++) {
            const x = delims[q];
            if (x.ch !== d.ch || !x.canOpen) continue;
            // x must be an opener-like run: preceded by space/punct/start
            const bx = x.pos === 0 ? undefined : text[x.pos - 1];
            if (bx !== undefined && !isSpace(bx) && !isPunct(bx)) continue;
            const xOrig = x.n + x.usedOpen + x.usedClose;
            for (let r = q + 1; r < j; r++) {
              const y = delims[r];
              if (y.ch !== d.ch || !y.canClose || !y.canOpen) continue;
              const yOrig = y.n + y.usedOpen + y.usedClose;
              // the odd-match skip leaves the opener unsatisfied only when
              // the closer cannot cover the opener plus the intervening
              // opener (m = oOrig + xOrig), MINUS any pure closers between
              // y and d (they consume part of m: e.g. doc-01's '*' after
              // 'other' reduces m, so the final '**' still satisfies it).
              // A closer with enough runs still satisfies (doc-11/doc-30).
              if ((oOrig + yOrig) % 3 === 0 && !(oOrig % 3 === 0 && yOrig % 3 === 0)) {
                // pure closers between y and d consume part of m, BUT only
                // when o is the outermost opener: if an earlier opener
                // could still pair with d (doc-11's outer '**'), the pure
                // closer belongs to the inner span and must not unblock
                // the inner pair.
                let hasEarlier = false;
                for (let t = 0; t < k; t++) {
                  const e = delims[t];
                  if (e.active && e.ch === d.ch && e.canOpen) { hasEarlier = true; break; }
                }
                let pure = 0;
                if (!hasEarlier) {
                  for (let s = r + 1; s < j; s++) {
                    const z = delims[s];
                    if (z.ch === d.ch && z.canClose && !z.canOpen) pure += z.n + z.usedOpen + z.usedClose;
                  }
                }
                if (d.n < oOrig + xOrig - pure) { blocked = true; break; }
              }
            }
          }
          if (blocked) { odd = true; continue; }
        }
        // a smaller closer must not split a larger opener while an inner
        // opener is still pending: e.g. '**removes *input **parse**parse*
        // release**' — the '*' after 'parse' must not steal one '*' from
        // the outer '**', or the outer splits into two <em> instead of
        // one <strong>; the '*' stays literal and the outer '**' pairs
        // with the final '**'.
        if (o.n > d.n) {
          let innerOpen = false;
          for (let q = k + 1; q < j; q++) {
            const x = delims[q];
            if (x.ch === d.ch && x.active && x.canOpen) { innerOpen = true; break; }
          }
          if (innerOpen) { odd = true; continue; }
        }
        opener = o; break;
      }
      if (!opener) {
        // a closer inside a link's own text must not set the bottom
        // barrier: it cannot match an outside opener (crosses), and
        // letting it block would kill an outer pair spanning the link
        // (e.g. '*large not [release *markdown*line*](...) *')
        let inLink = false;
        for (const b of linkBounds) if (d.pos >= b.s && d.pos <= b.e) { inLink = true; break; }
        if (!odd && !d.canOpen && !inLink) bottom[d.ch] = j;
        break;
      }
      const use = opener.n >= 2 && d.n >= 2 ? 2 : 1;
      const tag = d.ch === '~' ? 'del' : use === 2 ? 'strong' : 'em';
      // rank tiers at one (off,pos): leftover-opener 0 < closes 10000+seq
      // (first-formed = innermost first) < opens 20000-seq (later-formed =
      // outermost first) < link tags 30000 < leftover-closer 40000.
      // So <strong><em>..</em></strong> and <em><strong>..</strong></em> both
      // come out right, whichever span is outer.
      const seq = formSeq++;
      opener.chunk.ins.push({ off: opener.off, pos: opener.pos, rank: 20000 - seq, text: plain ? '' : '<' + tag + '>' });
      d.chunk.ins.push({ off: d.off, pos: d.pos, rank: 10000 + seq, text: plain ? '' : '</' + tag + '>' });
      opener.n -= use; opener.usedOpen += use;
      d.n -= use; d.usedClose += use; d.closeSeq = seq;
      // a partially-used closer's leftover chars sit INSIDE the element
      // (just before its closing tag) when the pair is STRONG (use 2) and
      // the closer run is immediately preceded by letters that themselves
      // immediately follow the most recent formed span INSIDE this pair
      // (e.g. '**a *b*c***', '**return that *old*two***': the letters
      // after the inner '</em>' mean the leftover '*' of '***' is content,
      // not trailing text). For a single-* pair (doc-04 '*changes
      // *else*returns**') or with no inner span (cm-446 '**foo***') the
      // leftover is trailing text after the tag.
      if (d.n > 0 && use === 2 && d.pos >= 2) {
        let latest = -1;
        for (const f of formed) if (f.s > opener.pos && f.e < d.pos && f.e > latest) latest = f.e;
        if (latest >= 0) {
          let allLetters = true;
          for (let q = latest + 1; q < d.pos; q++) {
            const ch = text[q];
            if (isSpace(ch) || isPunct(ch)) { allLetters = false; break; }
          }
          if (allLetters) d.leftoverInside = true;
        }
      }
      formed.push({ s: opener.pos, e: d.pos });
      if (opener.n === 0) opener.active = false;
      if (d.n === 0) { d.active = false; break; }
    }
  }
  // leftover delimiter chars (inactive ones live inside a formed image label
  // and must not render: their text is dead)
  for (const d of delims) {
    if (d.n > 0 && d.active) {
      const left = d.ch.repeat(d.n);
      // leftoverInside: rank just below its own closing tag (inside the
      // element); otherwise rank 40000 (trailing text after the tag)
      d.chunk.ins.push({ off: d.off, pos: d.pos, rank: d.usedClose > 0 ? (d.leftoverInside ? 10000 + (d.closeSeq || 0) - 1 : 40000) : 0, text: left });
    }
  }
  // ---- render chunks ----
  let out = '';
  for (const c of chunks) {
    if (c.dead) continue;
    if (!c.ins.length) { out += c.s; continue; }
    c.ins.sort((a, b) => (a.off - b.off) || ((a.pos || 0) - (b.pos || 0)) || (a.rank - b.rank));
    let p = 0;
    for (const ins of c.ins) {
      out += c.s.slice(p, ins.off);
      out += ins.text;
      p = ins.off;
    }
    out += c.s.slice(p);
  }
  return out;
}

// ---------- block parsing ----------
function adv(line, cur, n) {
  let { pos, col, pend } = cur;
  while (n > 0) {
    if (pend > 0) {
      const use = Math.min(pend, n);
      pend -= use; col += use; n -= use;
      if (pend === 0) pos++;
      continue;
    }
    if (pos >= line.length) { col += n; n = 0; break; }
    const c = line[pos];
    if (c === '\t') {
      const w = 4 - (col % 4);
      if (w <= n) { pos++; col += w; n -= w; }
      else { pend = w - n; col += n; n = 0; }
    } else { pos++; col++; n--; }
  }
  return { pos, col, pend };
}
function lineFromCur(line, cur) {
  // pend > 0 means the tab at pos is partially consumed: the remaining
  // pend columns are spaces, and the tab itself must not be kept
  // (otherwise the tab is counted twice)
  if (cur.pend > 0) return ' '.repeat(cur.pend) + line.slice(cur.pos + 1);
  // lead (set by matchQuote): the whitespace after '>' expanded to spaces
  // (marked's J) minus the one space the '> ' strip removes; the rest of
  // the whitespace run from cur.pos is skipped, so a tab after '> '
  // becomes spaces instead of staying a literal tab
  if (cur.lead !== undefined) {
    let p = cur.pos;
    while (p < line.length && (line[p] === ' ' || line[p] === '\t')) p++;
    return cur.lead + line.slice(p);
  }
  return line.slice(cur.pos);
}
function blankFrom(line, cur) {
  let { pos, pend } = cur;
  if (pend > 0) return false; // virtual spaces then the tab char? no: pend means a tab is partially consumed; the rest of the line after the tab could be non-blank
  while (pos < line.length) {
    const c = line[pos];
    if (c !== ' ' && c !== '\t') return false;
    pos++;
  }
  return true;
}
function measureIndent(line, cur) {
  // returns {n (true uncapped indent in columns), cur3, cur4, first}
  // cur3/cur4 are cursors after min(n,3)/min(n,4) columns (tab straddles kept as pend)
  let pos = cur.pos, col = cur.col, pend = cur.pend, n = 0;
  let cur3 = null, cur4 = null;
  while (true) {
    if (pend > 0) {
      n++; col++; pend--;
      if (n === 3 && !cur3) cur3 = { pos, col, pend };
      if (n === 4 && !cur4) cur4 = { pos, col, pend };
      if (pend === 0) pos++;
      continue;
    }
    if (pos >= line.length) break;
    const c = line[pos];
    if (c === ' ') {
      n++; col++; pos++;
      if (n === 3 && !cur3) cur3 = { pos, col, pend };
      if (n === 4 && !cur4) cur4 = { pos, col, pend };
      continue;
    }
    if (c === '\t') {
      const w = 4 - (col % 4);
      for (let k = 0; k < w; k++) {
        n++; col++;
        if (n === 3 && !cur3) cur3 = { pos, col, pend: w - k - 1 };
        if (n === 4 && !cur4) cur4 = { pos, col, pend: w - k - 1 };
      }
      pos++;
      continue;
    }
    break;
  }
  if (!cur3) cur3 = { pos, col, pend };
  if (!cur4) cur4 = { pos, col, pend };
  return { n, cur3, cur4, first: pos < line.length ? line[pos] : undefined, pos };
}
function stripCols(line, cur, n, expandTabs, charStrip) {
  // strip up to n columns of LEADING WHITESPACE only; stop at first non-space
  // char; a straddling tab becomes spaces. With charStrip (fenced code:
  // marked's Dt strips by CHARACTER count of the fence indent), a tab counts
  // as 1 character and is fully consumed when left >= 1, never leaving a
  // partial-tab remainder.
  let pos = cur.pos, col = cur.col, pend = cur.pend, left = n;
  const startCol = cur.col; // 0 at top level, >0 inside a container
  while (left > 0) {
    if (pend > 0) {
      const use = Math.min(pend, left);
      pend -= use; col += use; left -= use;
      if (pend === 0) pos++;
      continue;
    }
    if (pos >= line.length) break;
    const c = line[pos];
    if (c === ' ') { pos++; col++; left--; continue; }
    if (c === '\t') {
      const w = 4 - (col % 4);
      if (charStrip) { pos++; col += w; left--; continue; }
      if (w <= left) { pos++; col += w; left -= w; }
      else { pend = w - left; col += left; left = 0; }
      continue;
    }
    break;
  }
  if (pend > 0) return ' '.repeat(pend) + line.slice(pos + 1);
  // in code content inside a container, leading tabs expand to spaces by
  // column (the container consumed columns, so a tab's width is content);
  // at the top level code is verbatim and keeps tabs
  if (expandTabs && startCol > 0) {
    // when no indent is being stripped (tilde fence: indent 0) and the
    // line is inside a blockquote, matchQuote already expanded the
    // leading whitespace with the RELATIVE column into cur.lead — use
    // it instead of re-expanding with the absolute column (which would
    // over-count the container prefix, e.g. 4 spaces instead of 2)
    if (cur.lead !== undefined && n === 0) {
      let p = pos;
      while (p < line.length && (line[p] === ' ' || line[p] === '\t')) p++;
      return cur.lead + line.slice(p);
    }
    let out = '', p = pos, c = col;
    while (p < line.length && (line[p] === ' ' || line[p] === '\t')) {
      if (line[p] === ' ') { out += ' '; p++; c++; }
      else { const w = 4 - (c % 4); out += ' '.repeat(w); p++; c += w; }
    }
    return out + line.slice(p);
  }
  return line.slice(pos);
}
function splitCells(line) {
  // marked's de(): split on UNESCAPED pipes only. A pipe preceded by an
  // odd run of backslashes is escaped (kept, later \| -> |); any other
  // pipe is a separator — including one inside a code span (no code-span
  // protection: `code|span` counts as two cells, so the table won't form
  // when the delimiter row has fewer cells).
  const t = line.replace(/\|/g, (r, o, s) => {
    let l = false, p = o;
    for (; --p >= 0 && s[p] === '\\';) l = !l;
    return l ? '|' : ' |';
  });
  const n = t.split(/ \|/);
  if (!n[0].trim()) n.shift();
  if (n.length > 0 && !n[n.length - 1].trim()) n.pop();
  for (let s = 0; s < n.length; s++) n[s] = n[s].trim().replace(/\\\|/g, '|');
  return n;
}
function isDelimiterRow(line) {
  const cells = splitCells(line);
  if (!cells || !cells.length) return null;
  for (const c of cells) if (!/^:?-+:?$/.test(c)) return null;
  return cells;
}
function stripLeadingDefsOnly(text) {
  // returns text with leading ref defs removed (does not touch refs)
  let i = 0;
  while (i < text.length) {
    let j = i, sp = 0;
    while (j < text.length && text[j] === ' ' && sp < 4) { j++; sp++; }
    if (sp === 4 || text[j] !== '[') break;
    const d = parseRefDef(text, j);
    if (!d) break;
    i = d.end;
    if (text[i] === '\n') i++;
    else break;
  }
  return text.slice(i);
}
function htmlBlockType(line, cur) {
  // line from cur, indent already <=3. Returns 0 (none) or 1..7
  const m = measureIndent(line, cur);
  if (m.n > 3) return 0;
  const s = line.slice(m.cur3.pos);
  const low = s.toLowerCase();
  if (/^<(script|pre|style|textarea)([\s>]|$)/.test(low)) return 1;
  if (low.startsWith('<!--')) return 2;
  if (low.startsWith('<?')) return 3;
  if (/^<![a-z]/i.test(s)) return 4;
  if (low.startsWith('<![cdata[')) return 5;
  const tagM = /^<\/?([a-z][a-z0-9-]*)/i.exec(s);
  if (tagM) {
    const after = s.slice(tagM[0].length);
    if (after === '' || /^[\s>]/.test(after) || after.startsWith('/>')) {
      if (BLOCK_TAGS.has(tagM[1].toLowerCase())) return 6;
      // type 7: complete open/closing tag alone on the line
      const he = matchInlineHtml(s, 0);
      if (he > 0 && s.slice(he).trim() === '') return 7;
      return 0;
    }
  }
  return 0;
}
function htmlEndLine(type, text, tagName) {
  const low = text.toLowerCase();
  switch (type) {
    case 1: return low.includes('</' + tagName);
    case 2: return text.includes('-->');
    case 3: return text.includes('?>');
    case 4: return text.includes('>');
    case 5: return text.includes(']]>');
    default: return false;
  }
}

// ---------- main parse ----------
export function parse(src) {
  inLinkDoc = false;
  src = src.replace(/\r\n?/g, '\n');
  const hasFinalNL = src.endsWith('\n');
  let lines = src.split('\n');
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  const refs = new Map();
  const root = { kind: 'root', out: [], lastBlank: false };
  const stack = [root];
  let openPara = null;
  let openTable = null;
  let loosePending = false; // a blank line was seen since the last content line
  let pendingBlank = null; // {para, ws} from a container-blank line with non-empty whitespace rest
  let mode = null; // {type, out, ...}

  function top() { return stack[stack.length - 1]; }
  function pushStr(out, h) { const e = { kind: 'str', h, lastBlank: false }; out.push(e); return e; }
  function closeTo(depth) {
    while (stack.length > depth) {
      const f = stack.pop();
      // an item popped after a blank line was separated from the next item
      // by that blank: the list is loose (the blank's level is decided by
      // which containers the following line still matches, not by the blank
      // line itself)
      if (f.kind === 'item' && loosePending) f.lastBlank = true;
      if (f === openPara) openPara = null;
      if (openTable && f.out && f.out.includes(openTable)) openTable = null;
    }
    if (openPara && !top().out.includes(openPara)) openPara = null;
    if (openTable && !top().out.includes(openTable)) openTable = null;
  }
  function handleBlank(isRaw) {
    openPara = null; openTable = null;
    // a blank line only separates items/blocks at the level of the innermost
    // container it is directly in: if the top frame is an item, a following
    // line that pops it was separated from it by this blank (loosePending,
    // resolved in closeTo); if the top is a quote/list, the blank is inside
    // a child block and must not loosen an outer list (cm-320)
    const f = top();
    if (f.kind === 'item') {
      loosePending = true;
      // an empty item followed by a blank line is closed: later lines are
      // not part of it (marked: the item's continuation loop is skipped)
      if (!f.out.length) f.closedBlank = true;
    }
    // mark the last block of every frame (a blank between two blocks inside
    // one item makes that item's list loose, cm-325)
    for (const fr of stack) {
      const last = fr.out[fr.out.length - 1];
      if (last) last.lastBlank = true;
    }
  }
  function matchQuote(line, cur) {
    const m = measureIndent(line, cur);
    if (m.n > 3) return null;
    const c = line[m.cur3.pos];
    if (c !== '>') return null;
    let nc = { pos: m.cur3.pos + 1, col: m.cur3.col + 1, pend: m.cur3.pend };
    // one optional space/tab column
    let tabAfterGt = false;
    if (nc.pend === 0 && nc.pos < line.length && (line[nc.pos] === ' ' || line[nc.pos] === '\t')) {
      tabAfterGt = line[nc.pos] === '\t';
      nc = adv(line, nc, 1);
    }
    else if (nc.pend > 0) nc = adv(line, nc, 1);
    // marked expands the whitespace after '>' with J(ws, bLen) — a tab
    // becomes spaces by column, where bLen is the length of the '>'
    // prefix (leading spaces + '>') within the current segment — and
    // then strips the '>' plus one space. Record the expanded remainder
    // in lead so lineFromCur returns spaces instead of a literal tab.
    const bLen = Math.max(1, (m.cur3.pos - cur.pos) + 1);
    let wsEnd = m.cur3.pos + 1;
    while (wsEnd < line.length && (line[wsEnd] === ' ' || line[wsEnd] === '\t')) wsEnd++;
    let col = bLen, expanded = '';
    for (let p = m.cur3.pos + 1; p < wsEnd; p++) {
      if (line[p] === '\t') { const r = 4 - (col % 4); expanded += ' '.repeat(r); col += r; }
      else { expanded += ' '; col++; }
    }
    nc.lead = expanded.length > 0 ? expanded.slice(1) : '';
    // a tab right after '>' was partially consumed by the adv(1) above,
    // which measured its width from the ABSOLUTE column; marked expands
    // it from the RELATIVE column (bLen), so the remainder is
    // 4 - (bLen % 4) - 1 (bLen 1: the tab is 3 wide, 1 consumed, 2 remain
    // — not the absolute 3). A remainder of 0 means the tab is fully
    // consumed: step past it.
    if (tabAfterGt && nc.pend > 0) {
      const rem = 4 - (bLen % 4) - 1;
      if (rem === 0) { nc.pos++; nc.pend = 0; }
      else nc.pend = rem;
    }
    return nc;
  }
  function matchItem(line, cur, item) {
    // returns cursor after content indent, or null
    if (item.closedBlank) return null;
    if (blankFrom(line, cur)) return { pos: line.length, col: cur.col + (line.length - cur.pos), pend: 0 };
    const m = measureIndent(line, cur);
    if (m.n < item.indent) return null;
    return adv(line, cur, item.indent);
  }
  function listMarker(line, cur) {
    // returns {ordered, start, marker, bullet, contentCur, contentIndent, empty} or null
    const m = measureIndent(line, cur);
    if (m.n > 3) return null;
    const s = line;
    let p = m.cur3.pos, col = m.cur3.col;
    const c = s[p];
    if (c === '-' || c === '+' || c === '*') {
      const after = s[p + 1];
      if (after !== undefined && after !== ' ' && after !== '\t') return null;
      return finishMarker(line, { pos: p + 1, col: col + 1, pend: 0 }, 1, false, 0, c, m.n);
    }
    if (c >= '0' && c <= '9') {
      let q = p, num = '';
      while (q < s.length && s[q] >= '0' && s[q] <= '9' && num.length < 9) { num += s[q]; q++; }
      if (!num.length) return null;
      const d = s[q];
      if (d !== '.' && d !== ')') return null;
      const after = s[q + 1];
      if (after !== undefined && after !== ' ' && after !== '\t') return null;
      return finishMarker(line, { pos: q + 1, col: col + num.length + 1, pend: 0 }, num.length + 1, true, parseInt(num, 10), d, m.n);
    }
    return null;
  }
  function finishMarker(line, afterCur, markerLen, ordered, start, delim, markerIndent) {
    // count spaces after marker (columns)
    let pos = afterCur.pos, col = afterCur.col, pend = 0, spaces = 0;
    while (pos < line.length) {
      const c = line[pos];
      if (c === ' ') { spaces++; col++; pos++; }
      else if (c === '\t') { const w = 4 - (col % 4); spaces += w; col += w; pos++; }
      else break;
    }
    if (pos >= line.length) {
      // empty item
      return { ordered, start, markerLen, delim, contentIndent: markerIndent + markerLen + 1, contentCur: { pos, col, pend: 0 }, empty: true };
    }
    if (spaces === 0) return null;
    if (spaces >= 5) {
      return { ordered, start, markerLen, delim, contentIndent: markerIndent + markerLen + 1, contentCur: adv(line, afterCur, 1), empty: false };
    }
    return { ordered, start, markerLen, delim, contentIndent: markerIndent + markerLen + spaces, contentCur: { pos, col, pend: 0 }, empty: false };
  }
  function atxHeading(line, cur) {
    const m = measureIndent(line, cur);
    if (m.n > 3) return null;
    const s = line;
    let p = m.cur3.pos;
    let level = 0;
    while (p < s.length && s[p] === '#' && level < 7) { level++; p++; }
    if (level === 0 || level > 6) return null;
    if (p < s.length && s[p] !== ' ' && s[p] !== '\t') return null;
    let text = s.slice(p).replace(/^[ \t]+/, '').replace(/[ \t]+$/, '');
    if (/^#+$/.test(text)) text = '';
    else {
      const mm = /^(.*?)[ \t]+#+$/.exec(text);
      if (mm) text = mm[1];
    }
    return { level, text };
  }
  function thematicBreak(line, cur) {
    const m = measureIndent(line, cur);
    if (m.n > 3) return null;
    const s = line.slice(m.cur3.pos);
    return /^([*\-_])(?:[ \t]*\1){2,}[ \t]*$/.test(s);
  }
  function setextLevel(line, cur) {
    const m = measureIndent(line, cur);
    if (m.n > 3) return 0;
    const s = line.slice(m.cur3.pos);
    if (/^=+[ \t]*$/.test(s)) return 1;
    if (/^-+[ \t]*$/.test(s)) return 2;
    return 0;
  }
  function startPara(frame, text) {
    const p = { kind: 'para', text, lastBlank: false };
    frame.out.push(p);
    openPara = p;
    return p;
  }
  function matchContainers(line, depth) {
    // match stack[1..depth-1] on line (mode-loop semantics); returns
    // {ok, cur, skippedBlank} — skippedBlank is true when an item frame
    // was skipped because the line is blank from that frame, so the line
    // is blank in the inner text even if lineFromCur shows spaces
    let cur = { pos: 0, col: 0, pend: 0 };
    let skippedBlank = false;
    for (let d = 1; d < depth; d++) {
      const f = stack[d];
      if (f.kind === 'quote') {
        const r = matchQuote(line, cur);
        if (!r) return { ok: false };
        cur = r;
      } else if (f.kind === 'list') {
        continue;
      } else if (f.kind === 'item') {
        if (blankFrom(line, cur)) { skippedBlank = true; continue; }
        const r = matchItem(line, cur, f);
        if (!r) return { ok: false };
        cur = r;
      }
    }
    return { ok: true, cur, skippedBlank };
  }
  // stripped line is empty in the inner text when an item was skipped for
  // blankness or the remainder is exactly empty (a whitespace-only
  // remainder is NOT empty: marked's html regex stops at it)
  function stripEmpty(m, line) {
    if (!m.ok) return false;
    if (m.skippedBlank) return true;
    return lineFromCur(line, m.cur) === '';
  }
  function htmlTrailNL(li, depth) {
    // li = index of an html block's last content line, living in
    // containers stack[1..depth-1]. Decides whether the block's text
    // keeps a trailing '\n', per marked's ge() over the regex match in
    // the container-stripped inner text: the match consumes the newlines
    // after the block, and ge() strips it when 2+ trailing blank lines
    // follow (k = 1 + empty lines after the block, in the inner text).
    if (li + 1 >= lines.length) return depth <= 1 ? hasFinalNL : false;
    const first = matchContainers(lines[li + 1], depth);
    if (!first.ok) return false; // next line is outside the containers
    if (!stripEmpty(first, lines[li + 1])) return true; // non-blank next line
    if (depth <= 1) return false; // top level: a blank line adds a newline
    const inner = stack[depth - 1];
    if (inner.kind === 'quote') {
      // NL kept iff the blank line is the inner text's last line; any
      // further line in the quote makes the newline run reach 2+
      const nx = li + 2 < lines.length ? matchContainers(lines[li + 2], depth) : null;
      return !nx || !nx.ok;
    }
    if (inner.kind === 'item') {
      // count the consecutive empty lines after the block (B), then see
      // what follows them: item content -> interior blanks (strip); a
      // sibling item -> k == B (NL kept iff B == 1); anything else -> the
      // item is last and its text is trimEnd'd (strip)
      let B = 1, k = li + 2;
      for (; k < lines.length; k++) {
        const m = matchContainers(lines[k], depth);
        if (!m.ok) break;
        if (stripEmpty(m, lines[k])) { B++; continue; }
        return false; // content inside the item: blanks are interior
      }
      const list = stack[depth - 2];
      for (; k < lines.length; k++) {
        const line = lines[k];
        const pm = matchContainers(line, depth - 1);
        if (!pm.ok) return false;
        if (stripEmpty(pm, line)) continue; // another blank line
        const lm = listMarker(line, pm.cur);
        if (lm && listMatches(list, lm) && !thematicBreak(line, pm.cur)) return B === 1;
        return false;
      }
      return false;
    }
    return true;
  }
  function endMode(finalize) {
    const md = mode; mode = null;
    finalize(md);
  }

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    // ----- modes -----
    if (mode) {
      // container matching for mode containers
      let cur = { pos: 0, col: 0, pend: 0 };
      let depth = 1, ok = true;
      while (depth < mode.depth) {
        const f = stack[depth];
        if (f.kind === 'quote') { const r = matchQuote(line, cur); if (!r) { ok = false; break; } cur = r; depth++; }
        else if (f.kind === 'list') depth++;
        else if (f.kind === 'item') {
          if (blankFrom(line, cur)) { depth++; continue; }
          const r = matchItem(line, cur, f); if (!r) { ok = false; break; } cur = r; depth++;
        } else depth++;
      }
      if (!ok) {
        // a fenced code block swallows a non-matching NON-BLANK line only
        // once it already has content AND the failing container is a LIST
        // ITEM (a column-0 line inside a list's fence is code until the
        // closing fence); a raw blank line ends it (cm-128), a fence with
        // no content yet ends on the first non-matching line (cm-237,
        // empty fence), and a missing '>' ends a fence inside a QUOTE
        // (the quote ends, so the fence inside it ends too). Other modes
        // end and the line is reprocessed.
        // BUT a line that starts a block at the outer level (a list
        // marker, a fence, a heading, a thematic break, an html block, a
        // quote) is NOT swallowed: the fence ends and the line is
        // reprocessed as that block (doc-36: a sibling '* Pull' item;
        // S4/S10: '- bar' / '~~~' after fence content).
        if (mode.type === 'fence' && mode.lines.length > 0 && !/^[ \t]*$/.test(line) && stack[depth] && stack[depth].kind === 'item' && !startsInterrupt(line, cur)) {
          mode.lines.push(stripCols(line, cur, mode.indent, true, true));
          continue;
        }
        // end mode without closing fence, reprocess line
        if (mode.type === 'html' && mode.trailNL === undefined) mode.trailNL = false;
        // an indented code block ending by container mismatch drops its
        // trailing blank lines, exactly as the indent<4 path does
        if (mode.type === 'indent') mode.lines.length -= mode.pb.length;
        endMode(finishMode);
        li--;
        continue;
      }
      if (mode.type === 'fence') {
        const m = measureIndent(line, cur);
        if (m.n <= 3) {
          const s = line.slice(m.cur3.pos);
          const fm = new RegExp('^' + (mode.ch === '`' ? '`' : '~') + '{' + mode.len + ',}[ \\t]*$').exec(s);
          if (fm) {
            // drop one trailing blank line
            if (mode.lines.length && mode.lines[mode.lines.length - 1] === '') mode.lines.pop();
            endMode(finishMode);
            continue;
          }
        }
        mode.lines.push(stripCols(line, cur, mode.indent, true, true));
        continue;
      }
      if (mode.type === 'indent') {
        if (blankFrom(line, cur)) { mode.lines.push(stripCols(line, cur, 4, true)); mode.pb.push(/^[ \t]*$/.test(line)); continue; }
        const m = measureIndent(line, cur);
        if (m.n >= 4) {
          mode.lines.push(stripCols(line, cur, 4, true));
          mode.pb = [];
          continue;
        }
        const pb = mode.pb;
        mode.lines.length -= pb.length;
        endMode(finishMode);
        for (const raw of pb) handleBlank(raw);
        li--;
        continue;
      }
      if (mode.type === 'html') {
        if (mode.endType >= 6 && blankFrom(line, cur)) {
          mode.trailNL = false;
          endMode(finishMode);
          li--;
          continue;
        }
        const content = lineFromCur(line, cur);
        mode.lines.push(content);
        if (mode.endType <= 5) {
          if (htmlEndLine(mode.endType, content, mode.tagName)) {
            // peek next line: a truly EMPTY line eats the trailing NL
            // (marked's ge() strips 2+ trailing blank lines); a
            // whitespace-only line keeps it (only 1 trailing NL)
            mode.trailNL = htmlTrailNL(li, mode.depth);
            endMode(finishMode);
          }
        }
        continue;
      }
    }
    // ----- container matching -----
    let cur = { pos: 0, col: 0, pend: 0 };
    let depth = 1, failed = false;
    const rawBlank = /^[ \t]*$/.test(line);
    while (depth < stack.length) {
      const f = stack[depth];
      if (f.kind === 'quote') {
        // a RAW blank line (all whitespace from pos 0) closes a blockquote;
        // a container blank (e.g. a lone '>') does not
        if (rawBlank) { failed = true; break; }
        // NB: no blankFrom shortcut here. A line whose remainder is blank
        // after the outer '>' was consumed is NOT inside a nested quote:
        // the inner quote needs its own '>' marker (a lone '>' line
        // closes the inner quote and reopens it on the next '> >' line).
        const r = matchQuote(line, cur);
        if (!r) { failed = true; break; }
        cur = r; depth++;
      } else if (f.kind === 'list') depth++;
      else if (f.kind === 'item') {
        if (blankFrom(line, cur)) { depth++; continue; }
        const r = matchItem(line, cur, f);
        if (!r) { failed = true; break; }
        cur = r; depth++;
      } else depth++;
    }
    if (failed) {
      // a pending blank from the previous line resolves as a continuation
      // (the block ends): keep the whitespace in the paragraph and end it,
      // so this line is not a lazy continuation of it
      if (pendingBlank) {
        const pb = pendingBlank; pendingBlank = null;
        pb.para.text += '\n' + pb.ws;
        openPara = null;
      }
      // lazy continuation?
      if (openPara && !blankFrom(line, cur) && !startsInterrupt(line, cur)) {
        const t = lazyText(line, cur);
        openPara.text += '\n' + t;
        continue;
      }
      closeTo(depth);
    } else if (pendingBlank) {
      // the block continues: the pending blank is a real blank separator
      pendingBlank = null;
      handleBlank(false);
    }
    // ----- content handling loop -----
    let c2 = cur;
    while (true) {
      const r = handleContent(line, c2, rawBlank, li);
      if (r === null) break;
      c2 = r;
    }
  }
  // EOF: a trailing pending blank is a continuation (the block ends)
  if (pendingBlank) {
    pendingBlank.para.text += '\n' + pendingBlank.ws;
    pendingBlank = null;
  }
  // EOF: finish open mode / close frames
  if (mode) {
    if (mode.type === 'html') mode.trailNL = mode.depth <= 1 ? hasFinalNL : false;
    if (mode.type === 'indent') mode.lines.length -= mode.pb.length; // drop trailing blanks
    endMode(finishMode);
  }
  openPara = null; openTable = null;

  function finishMode(md) {
    if (!md) return;
    if (md.type === 'fence' || md.type === 'indent') {
      let content = md.lines.join('\n');
      // a fence holding a single blank line joins to '' but must still
      // render one '\n'; key the trailing newline on the line count,
      // not on the joined length (an empty fence has no lines at all)
      if (md.lines.length) content += '\n';
      let h;
      if (md.type === 'fence') {
        const lang = md.lang ? ' class="language-' + escapeNoEncode(md.lang) + '"' : '';
        h = '<pre><code' + lang + '>' + escapeHtml(content) + '</code></pre>\n';
      } else {
        h = '<pre><code>' + escapeHtml(content) + '</code></pre>\n';
      }
      pushStr(md.out, h);
    } else if (md.type === 'html') {
      let text = md.lines.join('\n');
      if (md.trailNL) text += '\n';
      pushStr(md.out, geText(text));
    }
  }
  function tableRowEnds(line, cur) {
    // a table row ends at a line starting an interrupting block (not setext)
    const m = measureIndent(line, cur);
    if (m.n >= 4) return true; // indented code
    if (m.n > 3) return false;
    if (atxHeading(line, cur)) return true;
    if (fenceStart(line, cur)) return true;
    if (thematicBreak(line, cur)) return true;
    if (htmlBlockType(line, cur) >= 1 && htmlBlockType(line, cur) <= 6) return true;
    if (line[m.cur3.pos] === '>') return true;
    const lm = listMarker(line, cur);
    if (lm && (!lm.ordered || lm.start === 1)) {
      // a bare marker at EOL does not end the table
      if (m.cur3.pos + lm.markerLen < line.length) return true;
    }
    return false;
  }
  function startsInterrupt(line, cur) {
    // does the line (at cur) start a block that can interrupt a paragraph?
    // (used for the LAZY check: a setext underline is lazy, not interrupting)
    const m = measureIndent(line, cur);
    if (m.n > 3) return false;
    if (blankFrom(line, cur)) return false;
    if (atxHeading(line, cur)) return true;
    if (fenceStart(line, cur)) return true;
    if (thematicBreak(line, cur)) return true;
    if (htmlBlockType(line, cur) >= 1 && htmlBlockType(line, cur) <= 6) return true;
    if (line[m.cur3.pos] === '>') return true;
    // any list marker starts a new block (never a lazy continuation)
    if (listMarker(line, cur)) return true;
    return false;
  }
  function fenceStart(line, cur) {
    const m = measureIndent(line, cur);
    if (m.n > 3) return null;
    const s = line.slice(m.cur3.pos);
    const fm = /^(`{3,}|~{3,})/.exec(s);
    if (!fm) return null;
    const ch = fm[1][0];
    if (ch === '`' && s.slice(fm[1].length).includes('`')) return null;
    return { ch, len: fm[1].length, indent: m.n, info: s.slice(fm[1].length) };
  }
  function lazyText(line, cur) {
    // lazy continuation: a setext-like line with 0-3 leading SPACES gets '    '
    // prepended (it must not form a heading); a setext-like line with a tab
    // or >=4-space indent is kept as-is; otherwise strip 4 cols if indent>=4
    const rest = lineFromCur(line, cur);
    const sm = /^([ \t]*)(=+|-+)([ \t]*)$/.exec(rest);
    if (sm) {
      if (/^ {0,3}$/.test(sm[1])) return '    ' + sm[2] + sm[3];
      return rest;
    }
    const m = measureIndent(line, cur);
    return m.n >= 4 ? stripCols(line, cur, 4) : rest;
  }
  function handleContent(line, cur, rawBlank, li) {
    const frame = top();
    // a whitespace-only line that is exactly 0-3 spaces + ONE tab is a
    // TABLE ROW, not a blank (marked's table-row regex blanks on spaces
    // only: / *\n/, and the indented-code pattern needs a non-newline char
    // after the indent, which a bare tab lacks); a spaces-only blank, or a
    // tab line with anything after it (e.g. ' \t '), still ends the table
    if (openTable && frame.out[frame.out.length - 1] === openTable && blankFrom(line, cur) && /^ {0,3}\t$/.test(lineFromCur(line, cur))) {
      openTable.rows.push(lineFromCur(line, cur));
      return null;
    }
    // blank line?
    if (blankFrom(line, cur)) {
      // a container-blank line (e.g. '> ') whose rest is non-empty whitespace
      // is a PENDING blank when a paragraph is open: it is a continuation
      // (the whitespace is appended to the para) if the block ends after it,
      // and a blank separator if the block continues; defer the decision to
      // the next line
      const rest = lineFromCur(line, cur);
      if (!rawBlank && rest.length > 0 && openPara) {
        pendingBlank = { para: openPara, ws: rest };
        return null;
      }
      handleBlank(rawBlank);
      return null;
    }
    // non-blank content: any pending loose-blank is resolved (it was inside
    // the containers this line still matches, not after them)
    loosePending = false;
    // a list frame only continues with a matching list item; otherwise pop it
    // and re-process the line at the outer level (a thematic break beats a list)
    if (frame.kind === 'list') {
      const lmTop = listMarker(line, cur);
      if (lmTop && listMatches(frame, lmTop) && !thematicBreak(line, cur)) return openList(line, cur, lmTop);
      stack.pop();
      return cur;
    }
    // open table continuation?
    if (openTable && frame.out[frame.out.length - 1] === openTable) {
      if (tableRowEnds(line, cur)) { openTable = null; }
      else { openTable.rows.push(lineFromCur(line, cur)); return null; }
    }
    // paragraph open?
    if (openPara && frame.out[frame.out.length - 1] === openPara) {
      const para = openPara;
      // table delimiter?
      if (!para.text.includes('\n')) {
        const delimLine = measureIndent(line, cur).n <= 3 ? lineFromCur(line, cur) : null;
        const delims = delimLine ? isDelimiterRow(delimLine) : null;
        if (delims && /[:|]/.test(delimLine)) {
          const headerCells = splitCells(para.text);
          if (delims.length === headerCells.length) {
            const align = delims.map(c => {
              const left = c.startsWith(':'), right = c.endsWith(':');
              return left && right ? 'center' : left ? 'left' : right ? 'right' : null;
            });
            const t = { kind: 'table', header: para.text, align, rows: [], lastBlank: false };
            frame.out[frame.out.length - 1] = t;
            openPara = null; openTable = t;
            return null;
          }
        }
      }
      // setext?
      const sl = setextLevel(line, cur);
      if (sl) {
        const stripped = stripLeadingDefsOnly(para.text);
        if (stripped.trim() !== '') {
          const h = { kind: 'head', level: sl, text: para.text, fromPara: true, lastBlank: false };
          frame.out[frame.out.length - 1] = h;
          openPara = null;
          return null;
        }
        // else: fall through to continuation
      }
      // thematic break beats a list
      if (thematicBreak(line, cur)) {
        openPara = null;
        return handleContent(line, cur, rawBlank, li);
      }
      // list that can interrupt?
      // (an ordered list with start != 1 cannot interrupt a paragraph at
      // the top level or inside a quote, but it CAN interrupt a paragraph
      // directly inside a list item: there it is a nested list, not a
      // sibling. E.g. '* item\n  para\n  8. nested' forms <ol start="8">.)
      const lm0 = listMarker(line, cur);
      if (lm0 && !lm0.empty && (!lm0.ordered || lm0.start === 1 || frame.kind === 'item')) {
        openPara = null;
        return openList(line, cur, lm0);
      }
      // other interrupting blocks
      if (atxHeading(line, cur) || fenceStart(line, cur) ||
          (htmlBlockType(line, cur) >= 1 && htmlBlockType(line, cur) <= 6) || line[measureIndent(line, cur).cur3.pos] === '>') {
        openPara = null;
        return handleContent(line, cur, rawBlank, li);
      }
      // continuation: strip 4 cols only when indented >=4 inside a list item
      const m = measureIndent(line, cur);
      const t = (m.n >= 4 && frame.kind === 'item') ? stripCols(line, cur, 4) : lineFromCur(line, cur);
      para.text += '\n' + t;
      return null;
    }
    // no paragraph open: try block starts
    const m = measureIndent(line, cur);
    if (m.n >= 4) {
      // indented code
      openPara = null;
      mode = { type: 'indent', out: frame.out, lines: [stripCols(line, cur, 4, true)], pb: [], depth: stack.length };
      return null;
    }
    const fs = fenceStart(line, cur);
    if (fs) {
      openPara = null;
      const info = fs.info.trim();
      const lang = info ? resolveEscapes(info.split(/[ \t]/)[0]) : '';
      // marked's Dt only compensates BACKTICK fences (its regex is
      // /^(\s+)(?:```)/): a tilde fence never strips content indent, so
      // its content keeps its full leading whitespace
      mode = { type: 'fence', out: frame.out, lines: [], ch: fs.ch, len: fs.len, indent: fs.ch === '~' ? 0 : fs.indent, lang, depth: stack.length };
      return null;
    }
    const ah = atxHeading(line, cur);
    if (ah) {
      openPara = null;
      frame.out.push({ kind: 'head', level: ah.level, text: ah.text, lastBlank: false });
      return null;
    }
    if (thematicBreak(line, cur)) {
      openPara = null;
      pushStr(frame.out, '<hr>\n');
      return null;
    }
    const hb = htmlBlockType(line, cur);
    if (hb >= 1) {
      openPara = null;
      const s = line.slice(measureIndent(line, cur).cur3.pos);
      let tagName = '';
      if (hb === 1) { const tm = /^(script|pre|style|textarea)/i.exec(s.slice(1)); tagName = tm ? tm[1].toLowerCase() : ''; }
      const firstLine = lineFromCur(line, cur);
      mode = { type: 'html', out: frame.out, lines: [firstLine], endType: hb, tagName, depth: stack.length, trailNL: hb >= 6 ? false : undefined };
      if (hb < 6 && htmlEndLine(hb, firstLine, tagName)) {
        mode.trailNL = htmlTrailNL(li, stack.length);
        endMode(finishMode);
      }
      return null;
    }
    if (line[m.cur3.pos] === '>') {
      openPara = null;
      const q = { kind: 'quote', out: [], lastBlank: false };
      frame.out.push(q);
      stack.push(q);
      const nc = matchQuote(line, cur);
      return nc;
    }
    const lm = listMarker(line, cur);
    if (lm) {
      openPara = null;
      return openList(line, cur, lm);
    }
    // paragraph (first line keeps its leading spaces)
    startPara(frame, lineFromCur(line, cur));
    return null;
  }
  function openList(line, cur, lm) {
    const frame = top();
    let list = null;
    if (frame.kind === 'list' && listMatches(frame, lm)) list = frame;
    else {
      list = { kind: 'list', out: [], items: [], ordered: lm.ordered, start: lm.start, delim: lm.delim, lastBlank: false };
      frame.out.push(list);
      stack.push(list);
    }
    const item = { kind: 'item', out: [], indent: lm.contentIndent, lastBlank: false, task: null };
    list.items.push(item);
    stack.push(item);
    // task checkbox?
    let cc = lm.contentCur;
    if (!lm.empty) {
      const rest = lineFromCur(line, cc);
      const tm = /^\[([ xX])\][ \t]/.exec(rest);
      if (tm) {
        item.task = tm[1] === ' ' ? 'unchecked' : 'checked';
        cc = adv(line, cc, 3);
        if (cc.pos < line.length && (line[cc.pos] === ' ' || line[cc.pos] === '\t')) cc = adv(line, cc, 1);
      }
    }
    if (lm.empty) return null;
    return cc;
  }
  function listMatches(list, lm) {
    if (list.ordered !== lm.ordered) return false;
    if (!lm.ordered) return list.delim === lm.delim;
    return list.delim === lm.delim;
  }

  // ----- finalize -----
  function walkOut(out, fn) {
    for (const e of out) {
      fn(e);
      if (e.kind === 'quote') walkOut(e.out, fn);
      else if (e.kind === 'list') for (const it of e.items) walkOut(it.out, fn);
    }
  }
  // pass 1: extract ref defs in document order
  walkOut(root.out, (e) => {
    if (e.kind === 'para' || (e.kind === 'head' && e.fromPara)) {
      const r = extractRefDefs(e.text, refs);
      e.text = e.kind === 'head' ? r.text.trim() : r.text;
    }
  });
  // pass 2: render
  function listIsLoose(list) {
    for (let i = 0; i < list.items.length; i++) {
      const it = list.items[i];
      if (it.lastBlank && i < list.items.length - 1) return true;
      for (let j = 0; j < it.out.length - 1; j++) if (it.out[j].lastBlank) return true;
    }
    return false;
  }
  function renderList(list) {
    const tight = !listIsLoose(list);
    const tag = list.ordered ? 'ol' : 'ul';
    let h = list.ordered && list.start !== 1 ? '<ol start="' + list.start + '">\n' : '<' + tag + '>\n';
    for (const it of list.items) h += renderItem(it, tight);
    h += '</' + tag + '>\n';
    return h;
  }
  function renderItem(it, tight) {
    let inner = '';
    const entries = it.out;
    if (it.task) {
      const cb = it.task === 'checked' ? '<input checked="" disabled="" type="checkbox">' : '<input disabled="" type="checkbox">';
      if (entries.length && entries[0].kind === 'para') {
        const body = parseInline(entries[0].text, refs, false);
        inner += tight ? cb + ' ' + body : '<p>' + cb + ' ' + body + '</p>\n';
        inner += renderOut(entries.slice(1), false);
      } else {
        inner += cb + renderOut(entries, false);
      }
    } else {
      inner += renderOut(entries, tight);
    }
    return '<li>' + inner + '</li>\n';
  }
  function renderTable(t) {
    const headerCells = splitCells(t.header);
    let h = '<table>\n<thead>\n<tr>\n';
    for (let i = 0; i < headerCells.length; i++) {
      const a = t.align[i];
      h += a ? '<th align="' + a + '">' + parseInline(headerCells[i], refs, false) + '</th>\n' : '<th>' + parseInline(headerCells[i], refs, false) + '</th>\n';
    }
    h += '</tr>\n</thead>\n';
    if (t.rows.length) h += '<tbody>';
    for (const row of t.rows) {
      const cells = splitCells(row);
      h += '<tr>\n';
      for (let i = 0; i < headerCells.length; i++) {
        const c = i < cells.length ? cells[i] : '';
        const a = t.align[i];
        h += a ? '<td align="' + a + '">' + parseInline(c, refs, false) + '</td>\n' : '<td>' + parseInline(c, refs, false) + '</td>\n';
      }
      h += '</tr>\n';
    }
    if (t.rows.length) h += '</tbody>';
    h += '</table>\n';
    return h;
  }
  function renderOut(out, tightItem) {
    let h = '';
    for (const e of out) {
      if (e.kind === 'str') h += e.h;
      else if (e.kind === 'para') {
        if (e.text === '') continue;
        const body = parseInline(e.text, refs, false);
        h += tightItem ? body : '<p>' + body + '</p>\n';
      } else if (e.kind === 'head') {
        h += '<h' + e.level + '>' + parseInline(e.text, refs, false) + '</h' + e.level + '>\n';
      } else if (e.kind === 'table') h += renderTable(e);
      else if (e.kind === 'quote') h += '<blockquote>\n' + renderOut(e.out, false) + '</blockquote>\n';
      else if (e.kind === 'list') h += renderList(e);
    }
    return h;
  }
  return renderOut(root.out, false);
}
