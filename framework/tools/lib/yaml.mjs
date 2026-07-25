// Parseur YAML minimal, zéro dépendance — SOUS-ENSEMBLE suffisant pour workflows/*.yaml.
// Supporte : commentaires (#), maps imbriquées (indentation 2 espaces), séquences de blocs
// ("- " valeurs scalaires ou maps), flow inline [a, b] et {k: v}, scalaires quotés/non quotés,
// booléens et nombres. NE supporte PAS : ancres, block scalars (| >), multi-docs.
// Contrainte assumée : indentation par pas de 2 espaces.

function parseScalar(s) {
  s = s.trim();
  if (s === '') return null;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null' || s === '~') return null;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  return s;
}

function parseFlow(s) {
  s = s.trim();
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return splitTop(inner).map(parseScalar);
  }
  if (s.startsWith('{') && s.endsWith('}')) {
    const inner = s.slice(1, -1).trim();
    const obj = {};
    if (!inner) return obj;
    for (const part of splitTop(inner)) {
      const i = part.indexOf(':');
      obj[part.slice(0, i).trim()] = parseScalar(part.slice(i + 1));
    }
    return obj;
  }
  return parseScalar(s);
}

// Découpe sur virgules de premier niveau (ignore celles dans [] {} "").
function splitTop(s) {
  const out = [];
  let depth = 0, q = null, cur = '';
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '[' || ch === '{') { depth++; cur += ch; continue; }
    if (ch === ']' || ch === '}') { depth--; cur += ch; continue; }
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function stripComment(line) {
  let q = null, out = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { out += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; out += ch; continue; }
    if (ch === '#' && (i === 0 || line[i - 1] === ' ')) break;
    out += ch;
  }
  return out;
}

export function parseYaml(text) {
  const raw = text.split(/\r?\n/);
  const lines = [];
  for (const l of raw) {
    const noc = stripComment(l).replace(/\s+$/, '');
    if (noc.trim() === '') continue;
    const indent = noc.length - noc.trimStart().length;
    lines.push({ indent, content: noc.trim() });
  }
  let idx = 0;

  function parseBlock(minIndent) {
    // Séquence ?
    if (idx < lines.length && lines[idx].indent >= minIndent && lines[idx].content.startsWith('- ')) {
      const arr = [];
      const seqIndent = lines[idx].indent;
      while (idx < lines.length && lines[idx].indent === seqIndent && lines[idx].content.startsWith('- ')) {
        const rest = lines[idx].content.slice(2).trim();
        if (rest.includes(':') && !rest.startsWith('[') && !rest.startsWith('{')) {
          // élément map : réécrire comme map à indentation seqIndent+2
          lines[idx] = { indent: seqIndent + 2, content: rest };
          arr.push(parseBlock(seqIndent + 2));
        } else {
          arr.push(parseFlow(rest));
          idx++;
        }
      }
      return arr;
    }
    // Map
    const obj = {};
    const mapIndent = lines[idx].indent;
    while (idx < lines.length && lines[idx].indent === mapIndent && !lines[idx].content.startsWith('- ')) {
      const line = lines[idx].content;
      const ci = line.indexOf(':');
      const key = line.slice(0, ci).trim();
      const after = line.slice(ci + 1).trim();
      idx++;
      if (after === '') {
        // valeur imbriquée
        if (idx < lines.length && lines[idx].indent > mapIndent) obj[key] = parseBlock(mapIndent + 1);
        else obj[key] = null;
      } else {
        obj[key] = parseFlow(after);
      }
    }
    return obj;
  }

  if (lines.length === 0) return {};
  return parseBlock(lines[0].indent);
}
