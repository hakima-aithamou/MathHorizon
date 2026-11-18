/* Animated lesson: drawings that appear step by step, each sentence read aloud by the device voice
   (the same voice as the 🔊 button). Replaces a video for an activity that has `animee: 'id'`.
   Usage: LeconAnimee.monter(container, 'fractions') */
(function () {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const VERT = '#2a9d74', VIOLET = '#7a5bd6', ROUGE = '#e0573f', GRIS = '#cfd8e0', ENCRE = '#16324f';

/* ---------- small SVG drawing helpers (return markup strings) ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const txt = (x, y, t, o) => { o = o || {}; return `<text x="${x}" y="${y}" text-anchor="${o.ancre || 'middle'}" font-size="${o.taille || 26}" font-weight="${o.gras === false ? 400 : 800}" fill="${o.couleur || ENCRE}"${o.cls ? ` class="${o.cls}"` : ''}>${esc(t)}</text>`; };
/* bar cut in n equal parts; pris = number of coloured parts; compte = parts highlighted with their number */
function barre(x, y, w, h, n, pris, coul, compte, cls) {
  let s = `<g${cls ? ` class="${cls}"` : ''}>`; const p = w / n;
  for (let i = 0; i < n; i++) {
    s += `<rect x="${x + i * p}" y="${y}" width="${p}" height="${h}" fill="${i < pris ? coul : '#fff'}" stroke="${ENCRE}" stroke-width="3"/>`;
    if (compte && i < compte) s += txt(x + i * p + p / 2, y + h / 2 + 11, String(i + 1), { taille: 30, couleur: i < pris ? '#fff' : VIOLET, cls: 'apparait' });
  }
  return s + '</g>';
}
/* unequal bar (for "parts pas égales") */
function barreInegale(x, y, h, largeurs) { let s = '', cx = x; largeurs.forEach(l => { s += `<rect x="${cx}" y="${y}" width="${l}" height="${h}" fill="#fff" stroke="${ENCRE}" stroke-width="3"/>`; cx += l; }); return s; }
/* circle cut in n parts, pris coloured */
function cercle(cx, cy, r, n, pris, coul) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    s += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${n === 1 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${i < pris ? coul : '#fff'}" stroke="${ENCRE}" stroke-width="3"/>`;
  }
  return s;
}
/* stacked fraction with a bar; hautCoul / basCoul colour the numbers; labels on the right */
function frac(x, y, num, den, o) {
  o = o || {}; const t = o.taille || 64, l = t * .75;
  let s = txt(x, y, num, { taille: t, couleur: o.hautCoul || ENCRE, cls: o.clsHaut });
  s += `<line x1="${x - l / 2}" y1="${y + t * .22}" x2="${x + l / 2}" y2="${y + t * .22}" stroke="${ENCRE}" stroke-width="${t / 14}" stroke-linecap="round"/>`;
  s += txt(x, y + t * 1.05, den, { taille: t, couleur: o.basCoul || ENCRE, cls: o.clsBas });
  if (o.etiqHaut) s += `<g class="apparait">${txt(x + l / 2 + 22, y - t * .3, '← ' + o.etiqHaut, { ancre: 'start', taille: 24, couleur: o.hautCoul || VERT })}</g>`;
  if (o.etiqBas) s += `<g class="apparait">${txt(x + l / 2 + 22, y + t * .78, '← ' + o.etiqBas, { ancre: 'start', taille: 24, couleur: o.basCoul || VIOLET })}</g>`;
  return s;
}
const bille = (x, y, c) => `<circle cx="${x}" cy="${y}" r="22" fill="${c}" stroke="${ENCRE}" stroke-width="2.5"/>`;

/* ---------- the lessons: each step has a subtitle and phrases {dit (spoken), ecrit (shown), scene (svg)} ---------- */
const LECONS = {
fractions: { titre: 'Les fractions', etapes: [
  { sous: 'Une fraction', phrases: [
    { dit: 'Une fraction, c’est une partie d’un tout.', scene: () => cercle(400, 190, 120, 4, 0, VERT) },
    { dit: 'Le tout est partagé en parts égales.', scene: () => cercle(400, 190, 120, 4, 0, VERT) + txt(400, 360, 'parts égales', { couleur: VERT, cls: 'apparait' }) },
    { dit: 'On prend une ou plusieurs parts.', scene: () => cercle(400, 190, 120, 4, 3, VERT) }] },
  { sous: 'Des parts égales ?', phrases: [
    { dit: 'Ici, les 4 parts ont la même taille. Ce sont des parts égales.', scene: () => barre(90, 120, 260, 80, 4, 0, VERT) + txt(220, 250, '✓ Parts égales', { couleur: VERT }) },
    { dit: 'Ici, les parts n’ont pas la même taille. Ce ne sont pas des parts égales.', scene: () => barre(90, 120, 260, 80, 4, 0, VERT) + txt(220, 250, '✓ Parts égales', { couleur: VERT }) + `<g class="apparait">${barreInegale(450, 120, 80, [40, 80, 30, 110])}${txt(580, 250, '✗ Parts pas égales', { couleur: ROUGE })}</g>` },
    { dit: 'Pour une fraction, il faut toujours des parts égales.', scene: () => barre(90, 120, 260, 80, 4, 0, VERT) + txt(220, 250, '✓ Parts égales', { couleur: VERT }) + barreInegale(450, 120, 80, [40, 80, 30, 110]) + txt(580, 250, '✗ Parts pas égales', { couleur: ROUGE }) }] },
  { sous: 'Le nombre du bas : le dénominateur', phrases: [
    { dit: 'Voici une barre partagée en parts égales.', scene: () => barre(60, 150, 400, 100, 4, 0, VERT) },
    { dit: 'Je compte toutes les parts : 1, 2, 3, 4.', ecrit: 'Je compte toutes les parts : 1, 2, 3, 4.', scene: () => barre(60, 150, 400, 100, 4, 0, VERT, 4) },
    { dit: 'Il y a 4 parts en tout. J’écris 4 en bas.', scene: () => barre(60, 150, 400, 100, 4, 0, VERT, 4) + `<g class="apparait">${frac(570, 150, '', '4', { basCoul: VIOLET })}</g>` },
    { dit: 'Le nombre du bas s’appelle le dénominateur.', ecrit: 'Le nombre du bas : le DÉNOMINATEUR.', scene: () => barre(60, 150, 400, 100, 4, 0, VERT, 4) + frac(570, 150, '', '4', { basCoul: VIOLET, etiqBas: 'dénominateur' }) },
    { dit: 'Le dénominateur dit en combien de parts égales on partage.', scene: () => barre(60, 150, 400, 100, 4, 0, VERT, 4) + frac(570, 150, '', '4', { basCoul: VIOLET, etiqBas: 'dénominateur' }) }] },
  { sous: 'Le nombre du haut : le numérateur', phrases: [
    { dit: 'Maintenant, je colorie des parts : 1, 2, 3.', scene: () => barre(60, 150, 400, 100, 4, 3, VERT) + frac(570, 150, '', '4', { basCoul: VIOLET }) },
    { dit: 'J’ai pris 3 parts. J’écris 3 en haut.', scene: () => barre(60, 150, 400, 100, 4, 3, VERT) + frac(570, 150, '3', '4', { hautCoul: VERT, basCoul: VIOLET, clsHaut: 'apparait' }) },
    { dit: 'Le nombre du haut s’appelle le numérateur.', ecrit: 'Le nombre du haut : le NUMÉRATEUR.', scene: () => barre(60, 150, 400, 100, 4, 3, VERT) + frac(570, 150, '3', '4', { hautCoul: VERT, basCoul: VIOLET, etiqHaut: 'numérateur' }) },
    { dit: 'Le numérateur dit combien de parts on prend.', scene: () => barre(60, 150, 400, 100, 4, 3, VERT) + frac(570, 150, '3', '4', { hautCoul: VERT, basCoul: VIOLET, etiqHaut: 'numérateur', etiqBas: 'dénominateur' }) }] },
  { sous: 'Lire une fraction', phrases: [
    { dit: '3 parts sur 4 parts égales. On lit : trois quarts.', ecrit: '3 parts sur 4 : trois quarts.', scene: () => barre(60, 150, 400, 100, 4, 3, VERT) + frac(570, 150, '3', '4', { hautCoul: VERT, basCoul: VIOLET, etiqHaut: 'parts prises', etiqBas: 'parts en tout' }) },
    { dit: 'Le dénominateur donne le nom de la part. 2 parts : un demi.', ecrit: '2 parts : un demi', scene: () => barre(60, 150, 400, 100, 2, 1, VERT) + frac(570, 150, '1', '2', { hautCoul: VERT, basCoul: VIOLET }) },
    { dit: '3 parts : un tiers.', scene: () => barre(60, 150, 400, 100, 3, 1, VERT) + frac(570, 150, '1', '3', { hautCoul: VERT, basCoul: VIOLET }) },
    { dit: '4 parts : un quart.', scene: () => barre(60, 150, 400, 100, 4, 1, VERT) + frac(570, 150, '1', '4', { hautCoul: VERT, basCoul: VIOLET }) }] },
  { sous: 'Une fraction d’un ensemble', phrases: [
    { dit: 'Voici 5 billes. Le dénominateur est 5 : il y a 5 billes en tout.', scene: () => [0, 1, 2, 3, 4].map(i => bille(220 + i * 80, 150, GRIS)).join('') + frac(400, 255, '', '5', { taille: 54, basCoul: VIOLET }) },
    { dit: '2 billes sont rouges. Le numérateur est 2.', scene: () => [0, 1, 2, 3, 4].map(i => bille(220 + i * 80, 150, i < 2 ? ROUGE : GRIS)).join('') + frac(400, 255, '2', '5', { taille: 54, hautCoul: ROUGE, basCoul: VIOLET, clsHaut: 'apparait' }) },
    { dit: '2 billes rouges sur 5 : deux cinquièmes.', scene: () => [0, 1, 2, 3, 4].map(i => bille(220 + i * 80, 150, i < 2 ? ROUGE : GRIS)).join('') + frac(400, 255, '2', '5', { taille: 54, hautCoul: ROUGE, basCoul: VIOLET }) }] },
  { sous: 'Comparer des fractions', phrases: [
    { dit: 'Un demi et un quart. Les deux barres ont la même longueur.', scene: () => frac(80, 95, '1', '2', { taille: 40 }) + barre(130, 80, 420, 60, 2, 1, VERT) + frac(80, 225, '1', '4', { taille: 40 }) + barre(130, 210, 420, 60, 4, 1, VIOLET) },
    { dit: 'Un demi est plus grand qu’un quart.', scene: () => frac(80, 95, '1', '2', { taille: 40 }) + barre(130, 80, 420, 60, 2, 1, VERT) + frac(80, 225, '1', '4', { taille: 40 }) + barre(130, 210, 420, 60, 4, 1, VIOLET) + txt(400, 330, '1 demi > 1 quart', { couleur: VERT, cls: 'apparait' }) },
    { dit: 'Plus le dénominateur est grand, plus les parts sont petites.', scene: () => frac(80, 95, '1', '2', { taille: 40 }) + barre(130, 80, 420, 60, 2, 1, VERT) + frac(80, 225, '1', '4', { taille: 40 }) + barre(130, 210, 420, 60, 4, 1, VIOLET) + txt(400, 330, '1 demi > 1 quart', { couleur: VERT }) }] },
  { sous: 'Des fractions équivalentes', phrases: [
    { dit: 'Un demi et deux quarts.', scene: () => frac(80, 95, '1', '2', { taille: 40 }) + barre(130, 80, 420, 60, 2, 1, VERT) + frac(80, 225, '2', '4', { taille: 40 }) + barre(130, 210, 420, 60, 4, 2, VIOLET) },
    { dit: 'La partie coloriée est pareille. Un demi égale deux quarts.', scene: () => frac(80, 95, '1', '2', { taille: 40 }) + barre(130, 80, 420, 60, 2, 1, VERT) + frac(80, 225, '2', '4', { taille: 40 }) + barre(130, 210, 420, 60, 4, 2, VIOLET) + `<line x1="340" y1="60" x2="340" y2="290" stroke="${ROUGE}" stroke-width="4" stroke-dasharray="10 8" class="apparait"/>` + txt(400, 340, '1 demi = 2 quarts', { couleur: VERT, cls: 'apparait' }) }] },
  { sous: 'Une fraction d’un nombre : un quart de 12', phrases: [
    { dit: 'Voici 12 jetons. Je veux un quart de 12.', scene: () => Array.from({ length: 12 }, (_, i) => bille(130 + i * 49, 170, '#3b82d6')).join('') },
    { dit: 'Un quart : le dénominateur est 4. Je partage les 12 jetons en 4 groupes égaux.', scene: () => [0, 1, 2, 3].map(g => `<rect x="${45 + g * 185}" y="125" width="165" height="90" rx="14" fill="#f4f8fb" stroke="${ENCRE}" stroke-width="3" class="apparait"/>` + [0, 1, 2].map(j => bille(85 + g * 185 + j * 43, 170, '#3b82d6')).join('')).join('') + frac(400, 300, '1', '4', { taille: 44, basCoul: VIOLET }) },
    { dit: 'Dans un groupe, il y a 3 jetons. Un quart de 12, c’est 3.', ecrit: 'Un quart de 12, c’est 3.', scene: () => [0, 1, 2, 3].map(g => `<rect x="${45 + g * 185}" y="125" width="165" height="90" rx="14" fill="${g === 0 ? '#e6f6ef' : '#f4f8fb'}" stroke="${g === 0 ? VERT : ENCRE}" stroke-width="${g === 0 ? 6 : 3}"/>` + [0, 1, 2].map(j => bille(85 + g * 185 + j * 43, 170, '#3b82d6')).join('')).join('') + txt(400, 320, '12 ÷ 4 = 3', { taille: 34, couleur: VERT, cls: 'apparait' }) }] },
  { sous: 'À retenir', phrases: [
    { dit: 'En haut, le numérateur : les parts que l’on prend. En bas, le dénominateur : les parts égales en tout.', ecrit: 'En haut : le numérateur. En bas : le dénominateur.', scene: () => barre(60, 150, 400, 100, 4, 3, VERT) + frac(570, 150, '3', '4', { hautCoul: VERT, basCoul: VIOLET, etiqHaut: 'numérateur', etiqBas: 'dénominateur' }) }] }
] }
};

/* ---------- player ---------- */
function voixFr() {
  const v = 'speechSynthesis' in window ? speechSynthesis.getVoices() : [];
  return v.find(x => /fr[-_]CA/i.test(x.lang)) || v.find(x => /^fr/i.test(x.lang) && /google|natural|online/i.test(x.name)) || v.find(x => /^fr/i.test(x.lang)) || null;
}
function monter(box, id) {
  const L = LECONS[id]; if (!L) return false;
  const liste = []; L.etapes.forEach((e, k) => e.phrases.forEach((p, j) => liste.push({ k, j, sous: e.sous, p })));
  box.innerHTML = '';
  const racine = document.createElement('div'); racine.className = 'la';
  racine.innerHTML = `<div class="la-titre">${esc(L.titre)}</div><div class="la-sous"></div>
    <svg class="la-scene" viewBox="0 0 800 400" role="img"></svg>
    <p class="la-texte" aria-live="polite"></p>
    <div class="la-barre"><div class="la-avance"></div></div>
    <div class="la-boutons"><button type="button" class="la-b la-debut" aria-label="Recommencer">⏮</button><button type="button" class="la-b la-prec" aria-label="Phrase précédente">◀</button><button type="button" class="la-b la-jouer">▶ Écouter la leçon</button><button type="button" class="la-b la-suiv" aria-label="Phrase suivante">▶▶</button></div>`;
  box.append(racine);
  const q = s => racine.querySelector(s);
  let i = 0, enCours = false, jeton = 0, minuteur = null;
  function montrer() {
    const it = liste[i];
    q('.la-sous').textContent = it.sous;
    q('.la-scene').innerHTML = it.p.scene();
    q('.la-scene').setAttribute('aria-label', it.p.ecrit || it.p.dit);
    q('.la-texte').textContent = it.p.ecrit || it.p.dit;
    q('.la-avance').style.width = (100 * (i + 1) / liste.length) + '%';
  }
  function arreter() { enCours = false; jeton++; clearTimeout(minuteur); if ('speechSynthesis' in window) speechSynthesis.cancel(); q('.la-jouer').textContent = i >= liste.length - 1 ? '↻ Réécouter' : '▶ Continuer'; }
  function dire() {
    const t = ++jeton, it = liste[i], dit = it.p.dit;
    const suite = () => { if (t !== jeton || !enCours) return; if (i < liste.length - 1) { i++; montrer(); minuteur = setTimeout(dire, 500); } else arreter(); };
    const attente = 1800 + dit.length * 75; // fallback when no voice or no "end" event
    const v = voixFr();
    if (v) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(dit.replace(/’/g, "'"));
      u.voice = v; u.lang = v.lang; u.rate = .85;
      u.onend = () => { clearTimeout(minuteur); minuteur = setTimeout(suite, 900); };
      speechSynthesis.speak(u);
      minuteur = setTimeout(suite, attente * 1.8);
    } else minuteur = setTimeout(suite, attente);
  }
  q('.la-jouer').onclick = () => { if (enCours) return arreter(); if (i >= liste.length - 1 && q('.la-jouer').textContent.includes('Réécouter')) { i = 0; montrer(); } enCours = true; q('.la-jouer').textContent = '⏸ Pause'; dire(); };
  q('.la-suiv').onclick = () => { const r = enCours; arreter(); if (i < liste.length - 1) i++; montrer(); if (r) q('.la-jouer').click(); };
  q('.la-prec').onclick = () => { const r = enCours; arreter(); if (i > 0) i--; montrer(); if (r) q('.la-jouer').click(); };
  q('.la-debut').onclick = () => { arreter(); i = 0; montrer(); q('.la-jouer').textContent = '▶ Écouter la leçon'; };
  /* stop the voice when the box is closed */
  const det = box.closest('details'); if (det) det.addEventListener('toggle', () => { if (!det.open) arreter(); });
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  montrer();
  return true;
}
window.LeconAnimee = { monter, existe: id => !!LECONS[id] };
})();
