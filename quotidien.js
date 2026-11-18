'use strict';
/* Everyday maths: 12 short activities of 8 questions each.
   Each question: [question, picture text, right answer, choices, explanation].
   Numbers change with the question number, and the right answer is not always in the same place.
   At the end, the result is saved in the student's account (activity "q-<name>", level 1). */
(function () {
const TITRES = {
  monnaie: 'Préparer un achat', horaire: 'Organiser sa journée', quantites: 'Préparer du matériel', budget: 'Respecter un budget',
  mesure: 'Choisir une longueur', trajet: 'Suivre un trajet', change: 'Calculer la monnaie', duree: 'Calculer une durée',
  groupes: 'Préparer des groupes', calendrier: 'Lire un calendrier', temperature: 'Lire un thermomètre', recette: 'Mesurer des ingrédients',
  mosaique: 'Compléter une mosaïque', balance: 'Équilibrer la balance', parking: 'Stationner au bon endroit',
  boites: 'Remplir les boîtes', tickets: 'Préparer deux achats', plan: 'Construire un rectangle'
};
const TOTAL = 8;
const cle = new URLSearchParams(location.search).get('a');
const mode = TITRES[cle] ? cle : 'monnaie';
const $ = id => document.getElementById(id);
const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const OBJETS = [['📒', 'un cahier'], ['✏️', 'un crayon'], ['🧃', 'un jus'], ['🍎', 'une pomme'], ['📏', 'une règle'], ['🧢', 'une casquette']];
/* put the right answer at a place that changes with the question number */
const placer = (bonne, autres, n) => { const l = [...new Set(autres)].filter(x => x !== bonne).slice(0, 2); l.splice(n % 3, 0, bonne); return l; };
const dollars = v => v + ' $';

function question(k, n) {
  const a = 2 + (n * 3) % 5, b = 1 + n % 3;
  switch (k) {
    case 'monnaie': { const [e1, o1] = OBJETS[n % 6], [e2, o2] = OBJETS[(n + 2) % 6];
      return ['Combien dois-tu payer en tout ?', `${e1} ${a} $   +   ${e2} ${b} $`, dollars(a + b), placer(dollars(a + b), [dollars(a + b + 1), dollars(Math.max(1, a + b - 1)), dollars(a + b + 2)], n), `${a} + ${b} = ${a + b}. Tu paies ${a + b} $.`]; }
    case 'change': { const p = 2 + (n * 5) % 8;
      return ['Tu paies avec un billet de 10 $. Combien te rend-on ?', `Prix : ${p} $\nTu donnes : 10 $`, dollars(10 - p), placer(dollars(10 - p), [dollars(10 - p + 1), dollars(p), dollars(Math.max(0, 10 - p - 1))], n), `10 − ${p} = ${10 - p}. On te rend ${10 - p} $.`]; }
    case 'horaire': { const act = ['Lecture', 'Maths', 'Récréation', 'Dîner'], d = 8 + n % 2, cible = n % 4;
      const lignes = act.map((x, j) => `${d + j} h : ${x}`).join('\n');
      return [`À quelle heure commence : ${act[cible]} ?`, lignes, `${d + cible} h`, placer(`${d + cible} h`, [`${d + cible + 1} h`, `${d + (cible + 2) % 4} h`, `${d + cible + 2} h`], n), `Lis la ligne « ${act[cible]} » : ${d + cible} h.`]; }
    case 'quantites':
      return ['Combien de crayons manque-t-il ?', `Il faut ${a + b} crayons.\nTu en as ${a}.`, String(b), placer(String(b), [String(b + 1), String(a), String(b + 2), String(b + 3)], n), `${a} + ${b} = ${a + b}. Il manque ${b} crayons.`];
    case 'budget': { const budget = 5 + n % 4, ok = n % 3, prix = [0, 1, 2].map(j => j === ok ? budget - 1 - n % 2 : budget + 1 + j);
      const lettres = ['A', 'B', 'C'];
      return ['Quel article peux-tu acheter avec ton budget ?', `Budget : ${budget} $\nA : ${prix[0]} $   B : ${prix[1]} $   C : ${prix[2]} $`, lettres[ok], lettres, `${lettres[ok]} coûte ${prix[ok]} $ : c’est moins que ${budget} $.`]; }
    case 'mesure': { const g = n % 3, base = 4 + n % 5, L = [0, 1, 2].map(j => j === g ? base + 3 : base + (j + n) % 2);
      return ['Quelle ficelle est la plus longue ?', `A : ${L[0]} cm\nB : ${L[1]} cm\nC : ${L[2]} cm`, ['A', 'B', 'C'][g], ['A', 'B', 'C'], `${L[g]} cm, c’est le plus grand nombre.`]; }
    case 'trajet': { const D = [['Droite', '●  →  →  ◆'], ['Gauche', '◆  ←  ←  ●'], ['En haut', '◆\n↑\n●'], ['En bas', '●\n↓\n◆']][n % 4];
      return ['Pour aller du point ● à la cible ◆, où vas-tu ?', D[1], D[0], placer(D[0], ['Droite', 'Gauche', 'En haut', 'En bas'], n), `Suis les flèches : ${D[0].toLowerCase()}.`]; }
    case 'duree': { const h = 8 + n % 4, d = 1 + (n * 2) % 3;
      return ['Combien d’heures dure l’activité ?', `Début : ${h} h\nFin : ${h + d} h`, `${d} h`, placer(`${d} h`, [`${d + 1} h`, `${h} h`, `${d + 2} h`], n), `De ${h} h à ${h + d} h : ${d} heure${d > 1 ? 's' : ''}.`]; }
    case 'groupes': { const g = 2 + n % 2, par = 2 + n % 3;
      return ['Combien de crayons dans chaque groupe ?', `${g * par} crayons\n${g} groupes égaux`, String(par), placer(String(par), [String(par + 1), String(g), String(par + 2), String(par + 3)], n), `${g * par} ÷ ${g} = ${par}.`]; }
    case 'calendrier': { const j = n % 7, apres = n % 2 === 0, rep = JOURS[(j + (apres ? 1 : 6)) % 7];
      return [`Quel jour vient ${apres ? 'après' : 'avant'} ${JOURS[j]} ?`, JOURS.map(x => x === JOURS[j] ? `[${x}]` : x).join('  '), rep, placer(rep, [JOURS[(j + 2) % 7], JOURS[(j + 5) % 7], JOURS[j]], n), `Dans la semaine : ${JOURS[(j + 6) % 7]}, ${JOURS[j]}, ${JOURS[(j + 1) % 7]}.`]; }
    case 'temperature': { const h = n % 3, t = [0, 1, 2].map(k2 => k2 === h ? 12 + n : 5 + k2 + n % 4);
      return ['Où fait-il le plus chaud ?', `A : ${t[0]} °C\nB : ${t[1]} °C\nC : ${t[2]} °C`, ['A', 'B', 'C'][h], ['A', 'B', 'C'], `${t[h]} °C, c’est la température la plus haute.`]; }
    case 'mosaique': { const formes = ['●', '■', '▲'], m = 2 + n % 2, suite = Array.from({ length: 5 }, (_, j) => formes[(j + n) % m]), rep = formes[(5 + n) % m];
      return ['Quelle forme vient ensuite ?', suite.join('   ') + '   ?', rep, placer(rep, formes, n), 'Le motif se répète toujours dans le même ordre.']; }
    case 'balance':
      return ['Quel poids manque pour équilibrer la balance ?', `⚖️  ${a + b} kg = ${a} kg + ?`, `${b} kg`, placer(`${b} kg`, [`${b + 1} kg`, `${a + b} kg`, `${b + 2} kg`], n), `${a} + ${b} = ${a + b}. Il manque ${b} kg.`];
    case 'parking': { const col = n % 3, row = Math.floor(n / 3) % 3, rep = 'ABC'[col] + (row + 1);
      return ['Sur quelle place est garée la voiture ?', '', rep, placer(rep, ['ABC'[(col + 1) % 3] + (row + 1), 'ABC'[col] + ((row + 1) % 3 + 1), 'ABC'[(col + 2) % 3] + ((row + 2) % 3 + 1)], n), 'Lis d’abord la lettre de la colonne, puis le numéro de la ligne.']; }
    case 'boites': { const pleins = 1 + n % 4;
      return ['Combien de places restent libres dans la boîte ?', `Une boîte de 5 places contient ${pleins} jeton${pleins > 1 ? 's' : ''}.`, String(5 - pleins), placer(String(5 - pleins), [String(6 - pleins), String(pleins), String(Math.max(0, 4 - pleins))], n), `${pleins} + ${5 - pleins} = 5.`]; }
    case 'tickets': { const [e1, o1] = OBJETS[(n + 1) % 6], [e2, o2] = OBJETS[(n + 4) % 6], p1 = 3 + n % 4, p2 = 2 + (n * 2) % 5;
      return ['Combien coûtent les deux articles ensemble ?', `${e1} ${p1} $
${e2} ${p2} $`, dollars(p1 + p2), placer(dollars(p1 + p2), [dollars(p1 + p2 + 1), dollars(p1 + p2 - 1), dollars(p1 + p2 + 2)], n), `${p1} + ${p2} = ${p1 + p2}.`]; }
    case 'plan': { const r = 2 + n % 3, c = 2 + (n * 3) % 4, tot = r * c;
      return ['Combien de carreaux contient le rectangle ?', `${r} rangées de ${c} carreaux`, String(tot), placer(String(tot), [String(tot + 1), String(r + c), String(tot - 1)], n), `${r} rangées de ${c} : ${Array(r).fill(c).join(' + ')} = ${tot}.`]; }
    default: /* recette */
      return ['Combien de cuillères faut-il encore ajouter ?', `La recette : ${a + b} cuillères.\nTu en as mis ${a}.`, String(b), placer(String(b), [String(b + 1), String(a + b), String(b + 2)], n), `${a} + ${b} = ${a + b}. Il faut encore ${b} cuillères.`];
  }
}

function dessin(k, n) {
  const v = $('visual');
  const grille = (rows, cols, f) => { const g = document.createElement('div'); g.className = 'mini-grid'; g.style.gridTemplateColumns = `repeat(${cols}, minmax(36px, 58px))`;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const x = document.createElement('span'); const d = f(r, c); x.textContent = d[0]; if (d[1]) x.className = 'filled'; g.append(x); }
    v.append(g); };
  if (k === 'parking') { const col = n % 3, row = Math.floor(n / 3) % 3; grille(4, 4, (r, c) => r === 0 ? [c ? 'ABC'[c - 1] : '', false] : c === 0 ? [String(r), false] : (r - 1 === row && c - 1 === col ? ['🚗', true] : ['', false])); }
  if (k === 'boites') { const pleins = 1 + n % 4; grille(1, 5, (r, c) => [c < pleins ? '●' : '', c < pleins]); }
  if (k === 'plan') { const r = 2 + n % 3, c = 2 + (n * 3) % 4; grille(r, c, () => ['', true]); }
}
let i = 0, fini = false, erreur = false, points = 0, debut = Date.now();
function afficher() {
  fini = false; erreur = false;
  const q = question(mode, i);
  $('title').textContent = TITRES[mode]; document.title = TITRES[mode] + ' · MathHorizon';
  $('count').textContent = `Question ${i + 1} sur ${TOTAL}`; $('progress').value = i;
  $('question').textContent = q[0]; $('visual').textContent = q[1]; dessin(mode, i);
  $('feedback').textContent = ''; $('next').hidden = true; $('restart').hidden = true; $('save-status').textContent = '';
  $('choices').replaceChildren();
  for (const v of q[3]) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = v;
    b.onclick = () => {
      if (fini) return;
      if (v === q[2]) {
        fini = true; if (!erreur) points++;
        $('feedback').textContent = 'Bien joué ! ' + q[4]; $('next').hidden = false;
        for (const x of $('choices').children) x.disabled = true; $('next').focus();
      } else { erreur = true; b.disabled = true; $('feedback').textContent = 'Essaie encore. ' + q[4]; }
    };
    $('choices').append(b);
  }
}
/* save the result in the student's account (same accounts as Mathéroute and Horizons) */
async function enregistrer() {
  const s = $('save-status');
  if (!window.EC || !EC.connecte()) { s.textContent = 'Ton résultat n’est pas enregistré : tu n’es pas connecté.'; return; }
  s.textContent = 'Enregistrement de ton résultat…';
  const r = await EC.enregistrerNiveau({ activity: 'q-' + mode, level: 1, score: points, total: TOTAL, seconds: Math.min(86400, Math.round((Date.now() - debut) / 1000)) });
  s.textContent = r.ok ? '✓ Résultat enregistré dans ton compte.' : r.raison === 'enseignante' ? 'Compte enseignante : les résultats ne sont pas enregistrés.' : 'Ton résultat n’a pas été enregistré. ' + (r.message || '');
}
$('next').onclick = () => {
  if (!fini) return;
  i++;
  if (i < TOTAL) { afficher(); return; }
  $('progress').value = TOTAL; $('count').textContent = `${TOTAL} sur ${TOTAL}`;
  $('question').textContent = 'Activité terminée !';
  $('visual').textContent = `${points} / ${TOTAL} du premier coup`;
  $('choices').replaceChildren(); $('feedback').textContent = 'Bravo pour tes efforts.';
  $('next').hidden = true; $('restart').hidden = false; $('restart').focus();
  enregistrer();
};
$('restart').onclick = () => { i = 0; points = 0; debut = Date.now(); afficher(); };
$('listen').onclick = () => {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance($('question').textContent + ' ' + $('visual').textContent.replace(/\n/g, '. '));
  u.lang = 'fr-CA'; u.rate = .85; speechSynthesis.cancel(); speechSynthesis.speak(u);
};
afficher();
})();
