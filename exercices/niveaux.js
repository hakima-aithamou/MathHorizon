'use strict';
/* =====================================================================
   LEVELS OF THE MATHEMATICS ACTIVITIES
   Each activity contains levels of 10 exercises, from the easiest
   to the hardest. The questions are always in the same order
   (fixed-seed generator): every student sees the same thing.
   To change a level: change its title, its description or the
   function that builds its 10 questions.
   ===================================================================== */
(function () {
const N = 15; // exercises per level

/* --- fixed-seed pseudo-random generator (same questions for everyone) --- */
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
const int=(r,min,max)=>min+Math.floor(r()*(max-min+1));
const pick=(r,list)=>list[Math.floor(r()*list.length)];
/* Builds N unique questions from a drawing function. */
function make(seed,draw){const r=rng(seed),out=[],seen=new Set();let guard=0;while(out.length<N&&guard++<5000){const q=draw(r,out.length);if(q==null)continue;const k=JSON.stringify(q);if(!seen.has(k)){seen.add(k);out.push(q)}}return out}
const rep=(s,n)=>Array(n).fill(s).join(' ');

/* ============================ CALCULATIONS ============================ */
const calc=(a,op,b,blank,extra)=>Object.assign({type:'calcul',v:[a,b,op==='+'?a+b:op==='−'?a-b:a*b],op,blank},extra||{});
const calculs={id:'calculs',titre:'Calculs',icone:'+ −',couleur:'#0d5d6e',
 consigne:'Écris le nombre manquant dans la case jaune.',
 niveaux:[
 {titre:'Additionner jusqu’à 10',description:'Avec des dessins pour compter.',
  questions:()=>make(101,r=>{const a=int(r,1,5),b=int(r,1,5);const e=pick(r,['🍎','⭐','🔵','🟢']);return calc(a,'+',b,2,{dessin:rep(e,a)+'   +   '+rep(e,b),aide:'Compte tous les dessins.'})})},
 {titre:'Soustraire jusqu’à 10',description:'Avec des dessins : on retire des jetons.',
  questions:()=>make(102,r=>{const a=int(r,3,10),b=int(r,1,a-1);const e=pick(r,['🍎','⭐','🔵','🟢']);return calc(a,'−',b,2,{dessin:rep(e,a),aide:'Tu as '+a+' dessins. Cache-en '+b+' avec ton doigt. Combien en reste-t-il ?'})})},
 {titre:'Additionner jusqu’à 20',description:'Sans dessin, résultats entre 11 et 20.',
  questions:()=>make(103,r=>{const a=int(r,4,12),b=int(r,Math.max(1,11-a),20-a);return calc(a,'+',b,2,{aide:'Pars du plus grand nombre et compte en avançant.'})})},
 {titre:'Soustraire jusqu’à 20',description:'Sans dessin.',
  questions:()=>make(104,r=>{const a=int(r,11,20),b=int(r,2,9);return calc(a,'−',b,2,{aide:'Pars de '+a+' et recule.'})})},
 {titre:'Trouver le nombre manquant',description:'Le trou n’est pas toujours à la fin.',
  questions:()=>make(105,r=>{const op=pick(r,['+','−']);if(op==='+'){const a=int(r,2,12),b=int(r,2,8);return calc(a,'+',b,int(r,0,1),{aide:'Quel nombre faut-il ajouter ou enlever pour que l’égalité soit vraie ?'})}const a=int(r,8,20),b=int(r,2,7);return calc(a,'−',b,int(r,0,1),{aide:'Quel nombre faut-il ajouter ou enlever pour que l’égalité soit vraie ?'})})},
 {titre:'Additionner jusqu’à 100',description:'Les dizaines avec les dizaines, les unités avec les unités.',
  questions:()=>make(106,r=>{const a=int(r,1,6)*10+int(r,0,4),b=int(r,1,3)*10+int(r,0,5);return calc(a,'+',b,2,{aide:'Additionne d’abord les dizaines, puis les unités.'})})},
 {titre:'Soustraire jusqu’à 100',description:'Sans regrouper.',
  questions:()=>make(107,r=>{const a=int(r,4,9)*10+int(r,5,9),b=int(r,1,3)*10+int(r,0,5);return calc(a,'−',b,2,{aide:'Soustrais d’abord les dizaines, puis les unités.'})})},
 {titre:'Calculer en regroupant',description:'Additions et soustractions jusqu’à 100.',
  questions:()=>make(108,r=>{if(r()<.5){const a=int(r,1,5)*10+int(r,5,9),b=int(r,1,3)*10+int(r,5,9);return calc(a,'+',b,2,{aide:'Les unités font 10 ou plus : regroupe 10 unités en 1 dizaine.'})}const a=int(r,4,9)*10+int(r,0,4),b=int(r,1,3)*10+int(r,5,9);return calc(a,'−',b,2,{aide:'Il faut regrouper : défais 1 dizaine en 10 unités.'})})},
 {titre:'Multiplier : tables de 2, 5 et 10',description:'Des groupes de même taille.',
  questions:()=>make(109,r=>{const t=pick(r,[2,5,10]),n=int(r,1,10);return calc(n,'×',t,2,{aide:n+' groupes de '+t+'. Compte de '+t+' en '+t+'.'})})},
 {titre:'Multiplier : tables de 3 et 4',description:'',
  questions:()=>make(110,r=>{const t=pick(r,[3,4]),n=int(r,1,10);return calc(n,'×',t,r()<.8?2:1,{aide:'Compte de '+t+' en '+t+'.'})})},
 {titre:'Multiplier : tables de 6 à 9',description:'Le défi final des calculs.',
  questions:()=>make(111,r=>{const t=int(r,6,9),n=int(r,2,9);return calc(n,'×',t,r()<.8?2:pick(r,[0,1]),{aide:'Utilise une table que tu connais : par exemple 6 × '+t+' = 5 × '+t+' + '+t+'.'})})}
 ]};

/* ============================ TIME ============================ */
const heure=(h,m)=>({type:'heure',h,m});
const lireHeure={id:'heure',titre:'Lire l’heure',icone:'🕘',couleur:'#08665d',
 consigne:'Quelle heure indique l’horloge ? La petite aiguille montre les heures, la grande aiguille montre les minutes.',
 niveaux:[
 {titre:'Les heures justes',description:'La grande aiguille est sur le 12.',questions:()=>make(201,r=>heure(int(r,1,12),0))},
 {titre:'Les heures et demie',description:'La grande aiguille est sur le 12 ou sur le 6.',questions:()=>make(202,(r,i)=>heure(int(r,1,12),i%3===0?0:30))},
 {titre:'Les quarts d’heure',description:'La grande aiguille est sur le 3 ou sur le 9.',questions:()=>make(203,(r,i)=>heure(int(r,1,12),[15,45,15,45,30][i%5]))},
 {titre:'De 5 en 5 minutes (1)',description:'Les minutes de 5 à 25.',questions:()=>make(204,r=>heure(int(r,1,12),pick(r,[5,10,15,20,25])))},
 {titre:'De 5 en 5 minutes (2)',description:'Toutes les minutes par bonds de 5.',questions:()=>make(205,r=>heure(int(r,1,12),pick(r,[35,40,45,50,55,5,20])))}
 ]};

/* ============================ MEASUREMENT ============================ */
const mesures={id:'mesures',titre:'Mesurer et comparer',icone:'📏',couleur:'#08665d',
 consigne:'Observe les deux bandes.',
 niveaux:[
 {titre:'La bande la plus longue',description:'Comparer deux longueurs.',
  questions:()=>make(301,r=>{const a=int(r,2,14);let b=int(r,2,14);if(Math.abs(a-b)<3)b=a>8?a-4:a+4;return{type:'choix',texte:'Quelle bande est la plus longue ?',visuel:{bandes:[a,b]},choix:['Bande A','Bande B'],reponse:a>b?0:1,aide:'Regarde où se termine chaque bande.'}})},
 {titre:'La bande la plus courte',description:'Comparer deux longueurs.',
  questions:()=>make(302,r=>{const a=int(r,2,14);let b=int(r,2,14);if(Math.abs(a-b)<2)b=a>8?a-3:a+3;return{type:'choix',texte:'Quelle bande est la plus courte ?',visuel:{bandes:[a,b]},choix:['Bande A','Bande B'],reponse:a<b?0:1,aide:'La plus courte se termine en premier.'}})},
 {titre:'Trouver la différence (jusqu’à 10 cm)',description:'Combien manque-t-il à la bande A ?',
  questions:()=>make(303,r=>{const a=int(r,1,8),d=int(r,1,Math.min(10,12-a));return{type:'nombre',texte:'Combien de centimètres faut-il ajouter à la bande A pour atteindre la longueur de la bande B ?',visuel:{bandes:[a,a+d],regle:true},reponse:d,unite:'cm',aide:'Compte les centimètres entre la fin de la bande A et la fin de la bande B.'}})},
 {titre:'Trouver la différence (jusqu’à 30 cm)',description:'',
  questions:()=>make(304,r=>{const a=int(r,5,20),d=int(r,3,10);return{type:'nombre',texte:'Combien de centimètres faut-il ajouter à la bande A pour atteindre la longueur de la bande B ?',visuel:{bandes:[a,a+d]},reponse:d,unite:'cm',aide:'Calcule '+(a+d)+' − '+a+'.'}})},
 {titre:'Trouver la différence (jusqu’à 100 cm)',description:'',
  questions:()=>make(305,r=>{const a=int(r,10,60),d=int(r,5,35);return{type:'nombre',texte:'Quelle est la différence de longueur entre les deux bandes ?',visuel:{bandes:[a,a+d]},reponse:d,unite:'cm',aide:'Calcule la plus grande longueur moins la plus petite.'}})}
 ]};

/* ============================ SHARING ============================ */
const part=(total,groupes)=>({type:'nombre',texte:'Répartis les '+total+' jetons entre '+groupes+' personnes. Chaque personne doit en avoir autant.',visuel:{jetons:total,groupes},reponse:total/groupes,unite:'jetons par personne',aide:'Donne un jeton à chaque personne, chacune son tour, jusqu’à ce qu’il n’en reste plus.'});
const partage={id:'partage',titre:'Partager équitablement',icone:'÷',couleur:'#0d5d6e',
 video:'videos/Partager-equitablement.mp4',
 consigne:'Combien de jetons chaque personne reçoit-elle ?',
 niveaux:[
 {titre:'Partager entre 2 personnes',description:'De 2 à 30 jetons.',questions:()=>[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30].map(t=>part(t,2))},
 {titre:'Partager entre 3 personnes',description:'De 3 à 45 jetons.',questions:()=>[3,6,9,12,15,18,21,24,27,30,33,36,39,42,45].map(t=>part(t,3))},
 {titre:'Partager entre 4 ou 5 personnes',description:'',questions:()=>make(403,r=>{const g=pick(r,[4,5]);return part(g*int(r,1,8),g)})},
 {titre:'Partager entre 6 à 10 personnes',description:'De plus grands groupes.',questions:()=>make(404,r=>{const g=int(r,6,10);return part(g*int(r,2,6),g)})}
 ]};

/* ================= ONES, TENS, HUNDREDS (place value) =================
   Types "nombre", "choix" and "position" (table); visuals "blocs" and "chiffres". */
const pl=(n,mot)=>n+' '+(n>1?mot+'s':mot);       // 0 tens, 1 ten, 3 tens
const plU=n=>n+' '+(n>1?'unités':'unité');
const plUM=n=>n+' '+(n>1?'unités de mille':'unité de mille');
const chif=(n,k)=>Math.floor(n/10**k)%10;
const NOMPOS=['unités','dizaines','centaines','unités de mille'];
const mil=n=>n>=1000?Math.floor(n/1000)+'\u202f'+String(n%1000).padStart(3,'0'):String(n); // 4 743
const LECON_BLOCS=['Un petit cube, c’est 1 unité.','Une barre de 10 cubes, c’est 1 dizaine : 10 unités.','Une plaque de 10 barres, c’est 1 centaine : 100 unités.','Compte d’abord les centaines, puis les dizaines, puis les unités.'];
const LECON_TAB=['Chaque chiffre a sa place : U pour les unités, D pour les dizaines, C pour les centaines, UM pour les unités de mille.','On lit le nombre de gauche à droite, mais la colonne des unités est toujours à droite.','S’il n’y a rien dans une colonne, on écrit 0.'];
const LECON_VAL=['La valeur d’un chiffre dépend de sa place.','Dans 472, le 7 est aux dizaines : il vaut 7 dizaines, donc 70.','Aux centaines, un 4 vaut 400. Aux unités, un 2 vaut 2.'];
const LECON_ECH=['10 unités = 1 dizaine.','10 dizaines = 1 centaine.','10 centaines = 1 unité de mille.','C’est ce qu’on fait quand on regroupe.'];
const valeur={id:'valeur',titre:'Unités, dizaines, centaines : tout ensemble',icone:'C D U',couleur:'#08565f',
 video:'videos/Unites-dizaines-centaines.mp4',
 consigne:'Observe bien la place de chaque chiffre.',
 niveaux:[
 {titre:'Compter les blocs jusqu’à 99',description:'Des dizaines et des unités.',lecon:LECON_BLOCS,questions:()=>make(1201,r=>{const d=int(r,1,9),u=int(r,0,9),n=d*10+u;return{type:'nombre',texte:'Combien de petits cubes y a-t-il en tout ? Compte les dizaines, puis les unités.',visuel:{blocs:{d,u}},reponse:n,aide:pl(d,'dizaine')+' et '+plU(u)+', ça fait '+n+'.'}})},
 {titre:'Compter les blocs jusqu’à 999',description:'Des centaines, des dizaines et des unités.',lecon:LECON_BLOCS,questions:()=>make(1202,r=>{const c=int(r,1,6),d=int(r,0,9),u=int(r,0,9),n=c*100+d*10+u;return{type:'nombre',texte:'Combien de petits cubes y a-t-il en tout ? Compte les centaines, les dizaines, puis les unités.',visuel:{blocs:{c,d,u}},reponse:n,aide:pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+', ça fait '+n+'.'}})},
 {titre:'Le tableau : dizaines et unités',description:'Écrire chaque chiffre à sa place.',lecon:LECON_TAB,questions:()=>make(1203,r=>{const n=int(r,10,99);return{type:'position',n:2,v:n,texte:'Écris le nombre '+n+' dans le tableau : un chiffre dans chaque case.',aide:'Dans '+n+', il y a '+pl(chif(n,1),'dizaine')+' et '+plU(chif(n,0))+'.'}})},
 {titre:'Le tableau : jusqu’aux centaines',description:'Attention aux zéros !',lecon:LECON_TAB,questions:()=>make(1204,r=>{const c=int(r,1,9),d=r()<.3?0:int(r,0,9),u=r()<.2?0:int(r,0,9),n=c*100+d*10+u;return{type:'position',n:3,v:n,texte:'Écris le nombre '+n+' dans le tableau.',aide:'Dans '+n+' : '+pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+'.'}})},
 {titre:'Le chiffre des…',description:'Trouver le chiffre à une place donnée.',lecon:LECON_TAB,questions:()=>make(1205,r=>{const n=int(r,102,987),k=int(r,0,2);return{type:'nombre',texte:'Dans le nombre '+n+', quel est le chiffre des '+NOMPOS[k]+' ?',visuel:{chiffres:{n,pos:-1}},reponse:chif(n,k),aide:'Les unités sont tout à droite, puis les dizaines, puis les centaines.'}})},
 {titre:'Que vaut ce chiffre ?',description:'La valeur dépend de la place.',lecon:LECON_VAL,questions:()=>make(1206,r=>{let n,k,c;do{n=int(r,102,987);k=int(r,0,2);c=chif(n,k)}while(c===0||String(n).split('').filter(x=>x==c).length>1);const v=c*10**k;const l=[v,...[0,1,2].filter(j=>j!==k).map(j=>c*10**j),c*1000].slice(0,4).map(mil);return quizQ(r,{type:'choix',texte:'Dans '+n+', que vaut le chiffre '+c+' en couleur ?',visuel:{chiffres:{n,pos:k}},oral:'Dans '+n+', que vaut le chiffre '+c+' ? Réponds : '+l.join(', ou ')+'.',aide:'Le '+c+' est aux '+NOMPOS[k]+' : il vaut '+mil(v)+'.'},l)})},
 {titre:'Composer un nombre',description:'Des centaines, des dizaines et des unités → un nombre.',lecon:LECON_BLOCS,questions:()=>make(1207,r=>{const c=int(r,1,9),d=r()<.35?0:int(r,1,9),u=r()<.25?0:int(r,1,9),n=c*100+d*10+u;return{type:'nombre',texte:pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+' : quel est ce nombre ?',reponse:n,aide:'Écris '+c+' aux centaines, '+d+' aux dizaines et '+u+' aux unités.'}})},
 {titre:'Décomposer un nombre',description:'Par exemple : 547 = 500 + 40 + 7.',lecon:LECON_VAL,questions:()=>make(1208,r=>{let n;do n=int(r,111,999);while(chif(n,1)===0||chif(n,0)===0);const P=[chif(n,2)*100,chif(n,1)*10,chif(n,0)],k=int(r,0,2),aff=P.map((x,j)=>j===k?'?':x);return{type:'nombre',texte:'Complète : '+n+' = '+aff.join(' + '),oral:'Complète : '+n+' égale '+aff.map(x=>x==='?'?'combien':x).join(' plus ')+'. Quel nombre manque ?',reponse:P[k],aide:n+' = '+P.join(' + ')+'.'}})},
 {titre:'Échanger : 10 pour 1',description:'Le lien avec regrouper.',lecon:LECON_ECH,questions:()=>make(1209,r=>{const t=int(r,0,4);
   if(t===0){const u=int(r,11,19);return{type:'nombre',texte:u+' unités, c’est 1 dizaine et combien d’unités ?',reponse:u-10,aide:'10 unités font 1 dizaine. Il reste '+(u-10)+'.'}}
   if(t===1){const d=int(r,11,19);return{type:'nombre',texte:d+' dizaines, c’est 1 centaine et combien de dizaines ?',reponse:d-10,aide:'10 dizaines font 1 centaine. Il reste '+(d-10)+'.'}}
   if(t===2){const c=int(r,2,9);return{type:'nombre',texte:pl(c,'centaine')+', c’est combien de dizaines ?',reponse:c*10,aide:'1 centaine = 10 dizaines, donc '+c+' centaines = '+(c*10)+' dizaines.'}}
   if(t===3){const d=int(r,1,9),u=int(r,10,19);return{type:'nombre',texte:pl(d,'dizaine')+' et '+u+' unités : quel est ce nombre ?',reponse:d*10+u,aide:'Regroupe : '+u+' unités = 1 dizaine et '+plU(u-10)+'. Ça fait '+(d*10+u)+'.'}}
   const c=int(r,1,8),d=int(r,10,19);return{type:'nombre',texte:pl(c,'centaine')+' et '+d+' dizaines : quel est ce nombre ?',reponse:c*100+d*10,aide:'Regroupe : '+d+' dizaines = 1 centaine et '+pl(d-10,'dizaine')+'. Ça fait '+(c*100+d*10)+'.'}})},
 {titre:'Jusqu’aux unités de mille',description:'Des nombres jusqu’à 9 999.',lecon:['10 centaines = 1 unité de mille (1 000).','Les unités de mille sont à gauche des centaines.','S’il n’y a rien dans une colonne, on écrit 0.'],questions:()=>make(1210,r=>{const m=int(r,1,9),c=r()<.3?0:int(r,0,9),d=r()<.3?0:int(r,0,9),u=int(r,0,9),n=m*1000+c*100+d*10+u,t=int(r,0,2);
   if(t===0)return{type:'position',n:4,v:n,texte:'Écris le nombre '+mil(n)+' dans le tableau.',aide:'Dans '+mil(n)+' : '+plUM(m)+', '+pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+'.'};
   if(t===1)return{type:'nombre',texte:plUM(m)+', '+pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+' : quel est ce nombre ?',reponse:n,aide:'Écris un chiffre par colonne : '+m+', '+c+', '+d+', '+u+'.'};
   const k=int(r,0,3);return{type:'nombre',texte:'Dans le nombre '+mil(n)+', quel est le chiffre des '+NOMPOS[k]+' ?',visuel:{chiffres:{n,pos:-1}},reponse:chif(n,k),aide:'De droite à gauche : unités, dizaines, centaines, unités de mille.'}})}
 ]};

/* ===================== WHOLE NUMBERS (6 activities) =====================
   composer, egal, comparer, situer, sortes, proprietes.
   chx(): choice question (right answer = l[0] before shuffling). */
const chx=(r,base,l)=>{const ch=melange(r,l.map(String));return Object.assign({type:'choix',choix:ch,reponse:ch.indexOf(String(l[0]))},base)};
const nb=(r,a,b)=>int(r,a,b);
const diffs=(r,n,a,b,exclure)=>{const o=[];let g=0;while(o.length<n&&g++<500){const v=int(r,a,b);if(!o.includes(v)&&!(exclure||[]).includes(v))o.push(v)}return o};
const estPremier=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true};
const diviseurs=n=>{const o=[];for(let d=1;d<=n;d++)if(n%d===0)o.push(d);return o};
const CARRES=[1,4,9,16,25,36,49,64,81,100,121,144],TRIS=[1,3,6,10,15,21,28,36,45,55,66,78];
const SIGNES=['<','=','>'],LIRE_SIGNE={'<':'plus petit que','=':'égal à','>':'plus grand que'};
function cmpQ(r,a,b){const bon=a<b?'<':a>b?'>':'=';return{type:'choix',signe:true,texte:'Choisis le bon signe : '+mil(a)+' ? '+mil(b),visuel:{grand:mil(a)+'  ?  '+mil(b)},choix:SIGNES.slice(),reponse:SIGNES.indexOf(bon),
  oral:'Compare '+a+' et '+b+'. '+a+' est-il plus petit que, égal à, ou plus grand que '+b+' ?',aide:mil(a)+' est '+LIRE_SIGNE[bon]+' '+mil(b)+'. Compare d’abord le chiffre le plus à gauche.'}}
function ordreQ(r,liste,sens){const rep=liste.slice().sort((x,y)=>sens==='decroissant'?y-x:x-y);return{type:'ordre',nombres:melange(r,liste),reponse:rep,sens,texte:sens==='decroissant'?'Range les nombres en ordre décroissant : du plus grand au plus petit.':'Range les nombres en ordre croissant : du plus petit au plus grand.',aide:'Cherche d’abord le '+(sens==='decroissant'?'plus grand':'plus petit')+' nombre, puis le suivant.'}}

/* ---------- 1. Composing and decomposing ---------- */
const LEC_COMP=['Composer, c’est former un nombre avec ses parties : 3 centaines, 4 dizaines et 5 unités font 345.','Décomposer, c’est séparer un nombre en parties : 345 = 300 + 40 + 5.','On peut décomposer de plusieurs façons : 345 = 2 centaines + 14 dizaines + 5 unités.'];
const composer={id:'composer',titre:'Composer et décomposer un nombre',icone:'345',couleur:'#08565f',video:'videos/Composer-decomposer.mp4',consigne:'Trouve le nombre ou la partie qui manque.',niveaux:[
 {titre:'Composer avec C, D, U',description:'Des centaines, des dizaines et des unités.',lecon:LEC_COMP,questions:()=>make(1301,r=>{const c=nb(r,1,9),d=nb(r,0,9),u=nb(r,0,9),n=c*100+d*10+u;return{type:'nombre',texte:pl(c,'centaine')+' + '+pl(d,'dizaine')+' + '+plU(u)+' = ?',oral:pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+'. Quel est ce nombre ?',reponse:n,aide:'Écris '+c+' aux centaines, '+d+' aux dizaines et '+u+' aux unités : '+n+'.'}})},
 {titre:'Composer dans le désordre',description:'Attention : les parties ne sont pas dans l’ordre.',lecon:LEC_COMP,questions:()=>make(1302,r=>{const c=nb(r,1,9),d=nb(r,1,9),u=nb(r,1,9),n=c*100+d*10+u,P=melange(r,[plU(u),pl(d,'dizaine'),pl(c,'centaine')]);return{type:'nombre',texte:P.join(' + ')+' = ?',oral:P.join(', ')+'. Quel est ce nombre ?',reponse:n,aide:'Range d’abord : '+c+' centaines, '+d+' dizaines, '+u+' unités. Ça fait '+n+'.'}})},
 {titre:'Décomposer : 300 + 40 + 5',description:'Trouver la partie qui manque.',lecon:LEC_COMP,questions:()=>make(1303,r=>{let n;do n=nb(r,111,999);while(chif(n,1)===0||chif(n,0)===0);const P=[chif(n,2)*100,chif(n,1)*10,chif(n,0)],k=nb(r,0,2),aff=P.map((x,j)=>j===k?'?':x);return{type:'nombre',texte:'Complète : '+n+' = '+aff.join(' + '),oral:n+' égale '+aff.map(x=>x==='?'?'combien':x).join(' plus ')+'.',reponse:P[k],aide:n+' = '+P.join(' + ')+'.'}})},
 {titre:'Décomposer en mots',description:'Combien de centaines, de dizaines, d’unités ?',lecon:LEC_COMP,questions:()=>make(1304,r=>{const n=nb(r,101,999),k=nb(r,0,2),P=[chif(n,2),chif(n,1),chif(n,0)],m=['centaines','dizaines','unités'],aff=P.map((x,j)=>(j===2-k?'?':x)+' '+m[j]);return{type:'nombre',texte:'Complète : '+n+' = '+aff.join(' + '),oral:n+' égale '+aff.map(x=>x.replace('?','combien de')).join(', plus ')+'.',reponse:chif(n,k),aide:'Dans '+n+' : '+P[0]+' centaines, '+P[1]+' dizaines et '+P[2]+' unités.'}})},
 {titre:'Une autre façon de décomposer',description:'Par exemple : 345 = 2 centaines + 14 dizaines + 5 unités.',lecon:LEC_COMP,questions:()=>make(1305,r=>{const c=nb(r,2,9),d=nb(r,0,9),u=nb(r,0,9),n=c*100+d*10+u,t=nb(r,0,1);
   if(t===0)return{type:'nombre',texte:'Complète : '+n+' = '+pl(c-1,'centaine')+' + ? dizaines + '+plU(u),oral:n+' égale '+pl(c-1,'centaine')+', plus combien de dizaines, plus '+plU(u)+' ?',reponse:d+10,aide:'1 centaine = 10 dizaines. Donc '+d+' + 10 = '+(d+10)+' dizaines.'};
   return{type:'nombre',texte:'Complète : '+n+' = ? dizaines + '+plU(u),oral:n+' égale combien de dizaines, plus '+plU(u)+' ?',reponse:c*10+d,aide:c+' centaines = '+(c*10)+' dizaines. Avec les '+d+' dizaines, ça fait '+(c*10+d)+' dizaines.'}})},
 {titre:'Combien de dizaines en tout ?',description:'Dans 340, il y a 34 dizaines.',lecon:['Pour savoir combien de dizaines il y a en tout, cache le chiffre des unités.','Dans 340, il y a 34 dizaines. Dans 1 200, il y a 12 centaines.'],questions:()=>make(1306,r=>{const t=nb(r,0,1);if(t===0){const n=nb(r,12,98)*10;return{type:'nombre',texte:'Combien de dizaines y a-t-il en tout dans '+mil(n)+' ?',reponse:n/10,aide:'Cache le 0 des unités : il reste '+(n/10)+'.'}}const n=nb(r,11,49)*100;return{type:'nombre',texte:'Combien de centaines y a-t-il en tout dans '+mil(n)+' ?',reponse:n/100,aide:'Cache les deux 0 : il reste '+(n/100)+'.'}})},
 {titre:'Jusqu’aux unités de mille',description:'Composer et décomposer jusqu’à 9 999.',lecon:['1 unité de mille = 10 centaines = 1 000.','4 728 = 4 000 + 700 + 20 + 8.'],questions:()=>make(1307,r=>{const m=nb(r,1,9),c=nb(r,0,9),d=nb(r,0,9),u=nb(r,1,9),n=m*1000+c*100+d*10+u;
   if(r()<.5)return{type:'nombre',texte:plUM(m)+' + '+pl(c,'centaine')+' + '+pl(d,'dizaine')+' + '+plU(u)+' = ?',oral:plUM(m)+', '+pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+'. Quel est ce nombre ?',reponse:n,aide:'Un chiffre par colonne : '+m+', '+c+', '+d+', '+u+'.'};
   const P=[m*1000,c*100,d*10,u].filter(x=>x>0),j=int(r,0,P.length-1),aff=P.map((x,i)=>i===j?'?':mil(x));return{type:'nombre',texte:'Complète : '+mil(n)+' = '+aff.join(' + '),oral:n+' égale '+aff.map(x=>x==='?'?'combien':x).join(' plus ')+'.',reponse:P[j],aide:mil(n)+' = '+P.map(mil).join(' + ')+'.'}})}
]};

/* ---------- 2. One number, several ways (2 + 3 = 1 + 4) ---------- */
const LEC_EGAL=['Un nombre peut s’écrire de plusieurs façons.','2 + 3 = 5 et 1 + 4 = 5, donc 2 + 3 = 1 + 4.','Le signe = veut dire : « a la même valeur que ».','Si un nombre diminue de 1, l’autre augmente de 1 : la somme ne change pas.'];
const fauxSomme=(r,s)=>{let a,b;do{a=nb(r,0,s);b=nb(r,0,s)}while(a+b===s||a+b>s+3||a+b<s-3);return a+' + '+b};
const egal={id:'egal',titre:'Un nombre, plusieurs façons',icone:'2+3',couleur:'#08565f',video:'videos/Un-nombre-plusieurs-facons.mp4',consigne:'Les deux côtés du signe = ont la même valeur.',niveaux:[
 {titre:'Quelle addition fait aussi… ?',description:'Les nombres jusqu’à 10.',lecon:LEC_EGAL,questions:()=>make(1401,r=>{const s=nb(r,4,10),a=nb(r,1,s-1),b=s-a;let c;do c=nb(r,0,s);while(c===a);const bonne=c+' + '+(s-c);const l=[bonne];while(l.length<4){const f=fauxSomme(r,s);if(!l.includes(f))l.push(f)}return chx(r,{texte:a+' + '+b+' = '+s+'. Quelle addition fait aussi '+s+' ?',visuel:{grand:a+' + '+b+' = '+s},aide:bonne+' = '+s+', comme '+a+' + '+b+'.'},l)})},
 {titre:'Compléter l’égalité',description:'Par exemple : 2 + 3 = 1 + ?',lecon:LEC_EGAL,questions:()=>make(1402,r=>{const s=nb(r,5,10),a=nb(r,1,s-1),c=nb(r,0,s);if(c===a)return null;return{type:'nombre',texte:'Complète : '+a+' + '+(s-a)+' = '+c+' + ?',oral:a+' plus '+(s-a)+' égale '+c+' plus combien ?',visuel:{grand:a+' + '+(s-a)+' = '+c+' + ?'},reponse:s-c,aide:a+' + '+(s-a)+' = '+s+'. Il faut '+(s-c)+' pour aller de '+c+' à '+s+'.'}})},
 {titre:'Vrai ou faux ?',description:'Les deux côtés sont-ils égaux ?',lecon:LEC_EGAL,questions:()=>make(1403,r=>{const s=nb(r,5,12),a=nb(r,1,s-1),c=nb(r,0,s),vrai=r()<.5,d=vrai?s-c:s-c+pick(r,[-2,-1,1,2]);if(d<0||c===a)return null;const g=a+' + '+(s-a),dr=c+' + '+d;return chx(r,{texte:'Est-ce vrai ? '+g+' = '+dr,visuel:{grand:g+' = '+dr},oral:'Est-ce vrai ? '+a+' plus '+(s-a)+' égale '+c+' plus '+d+'. Réponds : vrai ou faux.',aide:g+' = '+s+' et '+dr+' = '+(c+d)+'. '+(vrai?'C’est pareil : vrai.':'Ce n’est pas pareil : faux.')},vrai?['Vrai','Faux']:['Faux','Vrai'])})},
 {titre:'Jusqu’à 20',description:'Par exemple : 8 + 7 = 10 + ?',lecon:LEC_EGAL.concat(['Astuce : 8 + 7 = 10 + 5. On donne 2 au 8 pour faire 10.']),questions:()=>make(1404,r=>{const a=nb(r,6,9),b=nb(r,3,9),s=a+b;if(s<=10)return null;return{type:'nombre',texte:'Complète : '+a+' + '+b+' = 10 + ?',oral:a+' plus '+b+' égale 10 plus combien ?',visuel:{grand:a+' + '+b+' = 10 + ?'},reponse:s-10,aide:a+' + '+b+' = '+s+', et '+s+' = 10 + '+(s-10)+'.'}})},
 {titre:'Avec la soustraction',description:'Par exemple : 9 − 3 = 8 − ?',lecon:['9 − 3 = 6 et 8 − 2 = 6, donc 9 − 3 = 8 − 2.','Si les deux nombres diminuent de 1, la différence ne change pas.'],questions:()=>make(1405,r=>{const a=nb(r,6,15),b=nb(r,1,a-2),dif=a-b,c=a-nb(r,1,3);if(c-dif<0)return null;return{type:'nombre',texte:'Complète : '+a+' − '+b+' = '+c+' − ?',oral:a+' moins '+b+' égale '+c+' moins combien ?',visuel:{grand:a+' − '+b+' = '+c+' − ?'},reponse:c-dif,aide:a+' − '+b+' = '+dif+'. '+c+' − '+(c-dif)+' = '+dif+' aussi.'}})},
 {titre:'Plus grands nombres',description:'Par exemple : 38 + 25 = 40 + ?',lecon:LEC_EGAL.concat(['Astuce : 38 + 25 = 40 + 23. On donne 2 au 38 pour faire 40.']),questions:()=>make(1406,r=>{const a=nb(r,2,9)*10-nb(r,1,3),b=nb(r,12,49),k=Math.ceil(a/10)*10;return{type:'nombre',texte:'Complète : '+a+' + '+b+' = '+k+' + ?',oral:a+' plus '+b+' égale '+k+' plus combien ?',visuel:{grand:a+' + '+b+' = '+k+' + ?'},reponse:a+b-k,aide:'On ajoute '+(k-a)+' à '+a+' pour faire '+k+', donc on enlève '+(k-a)+' à '+b+' : '+(a+b-k)+'.'}})}
]};

/* ---------- 3. Comparing and ordering ---------- */
const LEC_CMP=['< veut dire « plus petit que » : 3 < 8.','> veut dire « plus grand que » : 8 > 3.','La pointe montre toujours le plus petit nombre.','Pour comparer : regarde d’abord combien de chiffres, puis compare de gauche à droite.'];
const LEC_ORD=['Ordre croissant : du plus petit au plus grand (comme un escalier qui monte).','Ordre décroissant : du plus grand au plus petit (comme un escalier qui descend).'];
const comparer={id:'comparer',titre:'Comparer et ordonner',icone:'< >',couleur:'#08565f',video:'videos/Comparer-ordonner.mp4',consigne:'Compare les nombres.',niveaux:[
 {titre:'Comparer jusqu’à 100',description:'Choisir <, = ou >.',lecon:LEC_CMP,questions:()=>make(1501,r=>{const a=nb(r,1,99),b=r()<.15?a:nb(r,1,99);return cmpQ(r,a,b)})},
 {titre:'Comparer jusqu’à 1 000',description:'Les centaines d’abord.',lecon:LEC_CMP,questions:()=>make(1502,r=>{const a=nb(r,100,999);const b=r()<.4?a+pick(r,[-10,10,-1,1,-100,100,90,-90]):r()<.1?a:nb(r,100,999);return b<1?null:cmpQ(r,a,b)})},
 {titre:'Comparer jusqu’à 9 999',description:'Attention aux nombres qui se ressemblent.',lecon:LEC_CMP,questions:()=>make(1503,r=>{const a=nb(r,1000,9999);const b=r()<.5?Number(String(a).split('').reverse().join('')):a+pick(r,[-1,1,-10,10,-100,100,900,-900]);return(b<10||b===a)?null:cmpQ(r,a,b)})},
 {titre:'Le plus grand, le plus petit',description:'Trouver le bon nombre parmi 4.',lecon:['Compare les centaines, puis les dizaines, puis les unités.'],questions:()=>make(1504,r=>{const big=r()<.5,base=nb(r,1,8)*100,l=diffs(r,4,base,base+199);const rep=big?Math.max(...l):Math.min(...l);return chx(r,{texte:'Quel est le '+(big?'plus grand':'plus petit')+' nombre ?',aide:'Compare les centaines, puis les dizaines, puis les unités. Le '+(big?'plus grand':'plus petit')+' est '+rep+'.'},[rep,...l.filter(x=>x!==rep)])})},
 {titre:'Ordre croissant jusqu’à 100',description:'Du plus petit au plus grand.',lecon:LEC_ORD,questions:()=>make(1505,r=>ordreQ(r,diffs(r,4,1,99),'croissant'))},
 {titre:'Ordre décroissant jusqu’à 100',description:'Du plus grand au plus petit.',lecon:LEC_ORD,questions:()=>make(1506,r=>ordreQ(r,diffs(r,4,1,99),'decroissant'))},
 {titre:'Ordonner jusqu’à 1 000',description:'Croissant ou décroissant : lis bien !',lecon:LEC_ORD,questions:()=>make(1507,r=>{const b=nb(r,1,7)*100;return ordreQ(r,diffs(r,5,b,b+250),r()<.5?'croissant':'decroissant')})},
 {titre:'Ordonner jusqu’à 9 999',description:'Des nombres qui se ressemblent.',lecon:LEC_ORD,questions:()=>make(1508,r=>{const b=nb(r,1,8)*1000,l=diffs(r,5,b,b+1500),q=ordreQ(r,l,r()<.5?'croissant':'decroissant');q.affiche=mil;return q})}
]};

/* ---------- 4. Locating a number ---------- */
const situer={id:'situer',titre:'Situer un nombre',icone:'↔',couleur:'#08565f',video:'videos/Situer-un-nombre.mp4',consigne:'Trouve la place du nombre.',niveaux:[
 {titre:'Entre deux nombres',description:'Quel nombre est entre les deux ?',lecon:['Un nombre est entre a et b s’il est plus grand que a et plus petit que b.','Entre 34 et 38, il y a 35, 36 et 37.'],questions:()=>make(1601,r=>{const a=nb(r,5,90),b=a+nb(r,3,6),bon=nb(r,a+1,b-1),f=[a-nb(r,1,4),b+nb(r,1,4),pick(r,[a,b])];return chx(r,{texte:'Quel nombre est entre '+a+' et '+b+' ?',aide:bon+' est plus grand que '+a+' et plus petit que '+b+'.'},[bon,...f])})},
 {titre:'Entre deux dizaines',description:'57 est entre 50 et 60.',lecon:['Pour trouver les dizaines autour d’un nombre, regarde le chiffre des dizaines.','57 : 5 dizaines. Il est entre 50 et 60.'],questions:()=>make(1602,r=>{let n;do n=nb(r,11,99);while(n%10===0);const d=Math.floor(n/10)*10;return chx(r,{texte:'Le nombre '+n+' est entre…',aide:n+' a '+(d/10)+' dizaines : il est entre '+d+' et '+(d+10)+'.'},[d+' et '+(d+10),(d-10)+' et '+d,(d+10)+' et '+(d+20),(d/10)+' et '+(d/10+1)])})},
 {titre:'Entre deux centaines',description:'347 est entre 300 et 400.',lecon:['Regarde le chiffre des centaines.','347 : 3 centaines. Il est entre 300 et 400.'],questions:()=>make(1603,r=>{let n;do n=nb(r,110,989);while(n%100===0);const c=Math.floor(n/100)*100;return chx(r,{texte:'Le nombre '+n+' est entre…',aide:n+' a '+(c/100)+' centaines : il est entre '+mil(c)+' et '+mil(c+100)+'.'},[mil(c)+' et '+mil(c+100),mil(c+100)+' et '+mil(c+200),mil(c-100>=0?c-100:c+200)+' et '+mil(c-100>=0?c:c+300),Math.floor(n/10)*10+' et '+(Math.floor(n/10)*10+10)])})},
 {titre:'Le nombre qui manque dans la liste',description:'Une liste rangée en ordre croissant.',lecon:['Dans une liste en ordre croissant, chaque nombre est plus grand que celui d’avant.','Le nombre qui manque doit être entre ses deux voisins.'],questions:()=>make(1604,r=>{const l=diffs(r,5,10,99).sort((x,y)=>x-y);const k=nb(r,1,3);if(l[k+1]-l[k-1]<3)return null;const bon=l[k];const vis=l.map((x,i)=>i===k?'?':x);const f=diffs(r,3,1,99,[]).filter(x=>x<l[k-1]||x>l[k+1]).slice(0,3);if(f.length<3)return null;return chx(r,{texte:'Quel nombre peut aller à la place du point d’interrogation ?',visuel:{liste:vis},oral:'La liste est : '+vis.map(x=>x==='?'?'un nombre caché':x).join(', ')+'. Quel nombre peut aller à la place du nombre caché ?',aide:'Il faut un nombre entre '+l[k-1]+' et '+l[k+1]+'.'},[bon,...f])})},
 {titre:'Où placer ce nombre ?',description:'Trouver sa place dans une liste rangée.',lecon:['Compare le nombre avec chaque nombre de la liste, de gauche à droite.','Il se place juste avant le premier nombre plus grand que lui.'],questions:()=>make(1605,r=>{const l=diffs(r,4,10,990).sort((x,y)=>x-y),n=nb(r,1,999);if(l.includes(n))return null;const k=l.filter(x=>x<n).length;const pos=j=>j===0?'avant '+l[0]:j===l.length?'après '+l[l.length-1]:'entre '+l[j-1]+' et '+l[j];const opts=[0,1,2,3,4].map(pos),bon=pos(k);return chx(r,{texte:'La liste est rangée en ordre croissant. Où places-tu '+n+' ?',visuel:{liste:l},oral:'La liste est : '+l.join(', ')+'. Où places-tu '+n+' ?',aide:'Réponse : '+bon+'.'},[bon,...opts.filter(x=>x!==bon).slice(0,3)])})},
 {titre:'Le plus proche',description:'68 est plus proche de 70 que de 60.',lecon:['Regarde le chiffre des unités.','De 0 à 4 : on est plus proche de la dizaine d’en bas. De 5 à 9 : de la dizaine d’en haut.'],questions:()=>make(1606,r=>{let n;do n=nb(r,11,99);while(n%10===0||n%10===5);const d=Math.floor(n/10)*10,bon=n%10<5?d:d+10;return chx(r,{texte:'Le nombre '+n+' est-il plus proche de '+d+' ou de '+(d+10)+' ?',aide:'De '+d+' à '+n+' : '+(n-d)+' pas. De '+n+' à '+(d+10)+' : '+(d+10-n)+' pas.'},[bon,bon===d?d+10:d])})}
]};

/* ---------- 5. Kinds of numbers ---------- */
const sortes={id:'sortes',titre:'Sortes de nombres',icone:'2·3·5',couleur:'#08565f',video:'videos/Sortes-de-nombres.mp4',consigne:'Observe bien le nombre.',niveaux:[
 {titre:'Pair ou impair ?',description:'Avec des points en paires.',lecon:['Un nombre pair peut faire des paires sans reste : 2, 4, 6, 8, 10…','Un nombre impair a toujours 1 point tout seul : 1, 3, 5, 7, 9…'],questions:()=>make(1701,r=>{const n=nb(r,2,20);return chx(r,{texte:'Fais des paires. Le nombre '+n+' est-il pair ou impair ?',visuel:{motif:{forme:'paires',n}},aide:n%2?'Il reste 1 point tout seul : '+n+' est impair.':'Tous les points ont un ami : '+n+' est pair.'},n%2?['impair','pair']:['pair','impair'])})},
 {titre:'Pair ou impair : grands nombres',description:'Regarde le chiffre des unités.',lecon:['Un nombre est pair si son chiffre des unités est 0, 2, 4, 6 ou 8.','Il est impair si son chiffre des unités est 1, 3, 5, 7 ou 9.'],questions:()=>make(1702,r=>{const n=nb(r,21,9999);return chx(r,{texte:'Le nombre '+mil(n)+' est-il pair ou impair ?',visuel:{chiffres:{n,pos:0}},aide:'Le chiffre des unités est '+(n%10)+' : '+mil(n)+' est '+(n%2?'impair':'pair')+'.'},n%2?['impair','pair']:['pair','impair'])})},
 {titre:'Les nombres carrés',description:'Des points qui forment un carré.',lecon:['Un nombre carré, c’est un nombre multiplié par lui-même : 3 × 3 = 9.','Avec ses points, on peut faire un carré.','Les premiers nombres carrés : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.'],questions:()=>make(1703,r=>{const k=nb(r,2,8),t=nb(r,0,1);if(t===0)return{type:'nombre',texte:'Combien de points y a-t-il dans ce carré ?',visuel:{motif:{forme:'carre',n:k}},reponse:k*k,aide:k+' rangées de '+k+' points : '+k+' × '+k+' = '+(k*k)+'.'};const f=diffs(r,3,2,60,CARRES);return chx(r,{texte:'Lequel est un nombre carré ?',aide:k*k+' = '+k+' × '+k+'. On peut faire un carré de '+k+' sur '+k+'.'},[k*k,...f])})},
 {titre:'Les nombres triangulaires',description:'Des points qui forment un triangle.',lecon:['Un nombre triangulaire se forme avec des rangées : 1, puis 2, puis 3…','1, 3, 6, 10, 15, 21, 28 sont triangulaires.','Pour trouver le suivant, on ajoute une rangée de 1 point de plus.'],questions:()=>make(1704,r=>{const k=nb(r,2,7),T=k*(k+1)/2,t=nb(r,0,2);if(t===0)return{type:'nombre',texte:'Combien de points y a-t-il dans ce triangle ?',visuel:{motif:{forme:'triangle',n:k}},reponse:T,aide:Array.from({length:k},(_,i)=>i+1).join(' + ')+' = '+T+'.'};if(t===1)return{type:'nombre',texte:'Les nombres triangulaires : '+TRIS.slice(0,k).join(', ')+'… Quel est le suivant ?',visuel:{motif:{forme:'triangle',n:k}},reponse:(k+1)*(k+2)/2,aide:'On ajoute une rangée de '+(k+1)+' points : '+T+' + '+(k+1)+' = '+((k+1)*(k+2)/2)+'.'};const f=diffs(r,3,2,40,TRIS);return chx(r,{texte:'Lequel est un nombre triangulaire ?',aide:T+' = '+Array.from({length:k},(_,i)=>i+1).join(' + ')+'.'},[T,...f])})},
 {titre:'Premier ou composé ? (jusqu’à 30)',description:'Compter les diviseurs.',lecon:['Un nombre premier a exactement 2 diviseurs : 1 et lui-même. Exemple : 7.','Un nombre composé a plus de 2 diviseurs. Exemple : 6 (1, 2, 3, 6).','Attention : 1 n’est ni premier ni composé.'],questions:()=>make(1705,r=>{const n=nb(r,2,30),p=estPremier(n);return chx(r,{texte:'Le nombre '+n+' est-il premier ou composé ?',aide:'Les diviseurs de '+n+' : '+diviseurs(n).join(', ')+'. '+(p?'Seulement 2 diviseurs : premier.':'Plus de 2 diviseurs : composé.')},p?['premier','composé']:['composé','premier'])})},
 {titre:'Premier ou composé ? (jusqu’à 100)',description:'Essaie de diviser par 2, 3, 5, 7.',lecon:['Pour savoir si un nombre est composé, essaie de le diviser par 2, 3, 5 ou 7.','S’il se divise sans reste, il est composé.','S’il ne se divise par aucun, il est premier.'],questions:()=>make(1706,r=>{let n;do n=nb(r,31,99);while(n%2===0&&r()<.6);const p=estPremier(n),d=[2,3,5,7].find(x=>n%x===0&&n!==x);return chx(r,{texte:'Le nombre '+n+' est-il premier ou composé ?',aide:p?n+' ne se divise ni par 2, ni par 3, ni par 5, ni par 7 : il est premier.':n+' = '+d+' × '+(n/d)+' : il est composé.'},p?['premier','composé']:['composé','premier'])})},
 {titre:'Trouve le bon nombre',description:'Pair, impair, carré, triangulaire, premier, composé.',lecon:['Pair : finit par 0, 2, 4, 6, 8. Impair : finit par 1, 3, 5, 7, 9.','Carrés : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.','Triangulaires : 1, 3, 6, 10, 15, 21, 28, 36, 45, 55.','Premiers : 2, 3, 5, 7, 11, 13, 17, 19, 23, 29…'],questions:()=>make(1707,r=>{const S=[['pair',n=>n%2===0],['impair',n=>n%2===1],['carré',n=>CARRES.includes(n)],['triangulaire',n=>TRIS.includes(n)],['premier',estPremier],['composé',n=>n>3&&!estPremier(n)]];const[nom,f]=pick(r,S);const oui=[],non=[];for(let n=2;n<=60;n++)(f(n)?oui:non).push(n);const bon=pick(r,oui),faux=melange(r,non).slice(0,3);return chx(r,{texte:'Lequel est un nombre '+nom+' ?',aide:bon+' est un nombre '+nom+'.'},[bon,...faux])})},
 {titre:'Vrai ou faux ?',description:'Des phrases sur les nombres.',lecon:['Lis bien toute la phrase avant de répondre.','Un nombre peut être de plusieurs sortes : 36 est pair, carré et triangulaire !'],questions:()=>make(1708,r=>{const n=nb(r,2,50);const P=[['pair',n%2===0],['impair',n%2===1],['carré',CARRES.includes(n)],['triangulaire',TRIS.includes(n)],['premier',estPremier(n)],['composé',n>3&&!estPremier(n)]];const[nom,v]=pick(r,P);return chx(r,{texte:'Vrai ou faux : '+n+' est un nombre '+nom+'.',aide:n+(v?' est bien':' n’est pas')+' un nombre '+nom+'. Diviseurs de '+n+' : '+diviseurs(n).join(', ')+'.'},v?['Vrai','Faux']:['Faux','Vrai'])})}
]};

/* ---------- 6. Properties of whole numbers ---------- */
const proprietes={id:'proprietes',titre:'Propriétés des nombres naturels',icone:'0 1 2…',couleur:'#08565f',video:'videos/Proprietes-nombres-naturels.mp4',consigne:'Utilise la propriété pour trouver la réponse.',niveaux:[
 {titre:'Avant, après',description:'Le nombre qui vient juste avant ou juste après.',lecon:['Les nombres naturels : 0, 1, 2, 3, 4… On commence à 0.','Après un nombre, on ajoute 1. Avant un nombre, on enlève 1.','Il n’y a pas de plus grand nombre naturel : on peut toujours ajouter 1.'],questions:()=>make(1801,r=>{const n=pick(r,[nb(r,10,99),nb(r,1,9)*100-pick(r,[0,1]),nb(r,1,9)*1000-pick(r,[0,1]),nb(r,100,999)]),ap=r()<.5;return{type:'nombre',texte:'Quel nombre vient juste '+(ap?'après':'avant')+' '+mil(n)+' ?',reponse:ap?n+1:n-1,aide:ap?mil(n)+' + 1 = '+mil(n+1)+'.':mil(n)+' − 1 = '+mil(n-1)+'.'}})},
 {titre:'L’ordre ne change rien (addition)',description:'7 + 5 = 5 + 7.',lecon:['On peut changer l’ordre des nombres dans une addition : 7 + 5 = 5 + 7.','Le résultat est le même.'],questions:()=>make(1802,r=>{const a=nb(r,3,99),b=nb(r,3,99);return{type:'nombre',texte:'Complète : '+a+' + '+b+' = '+b+' + ?',oral:a+' plus '+b+' égale '+b+' plus combien ?',visuel:{grand:a+' + '+b+' = '+b+' + ?'},reponse:a,aide:'L’ordre ne change rien : '+a+' + '+b+' = '+b+' + '+a+'.'}})},
 {titre:'L’ordre ne change rien (multiplication)',description:'3 × 4 = 4 × 3.',lecon:['On peut aussi changer l’ordre dans une multiplication : 3 × 4 = 4 × 3.','3 rangées de 4 ou 4 rangées de 3 : c’est 12 dans les deux cas.'],questions:()=>make(1803,r=>{const a=nb(r,2,9),b=nb(r,2,9);if(a===b)return null;return{type:'nombre',texte:'Complète : '+a+' × '+b+' = '+b+' × ?',oral:a+' fois '+b+' égale '+b+' fois combien ?',visuel:{grand:a+' × '+b+' = '+b+' × ?'},reponse:a,aide:a+' × '+b+' = '+b+' × '+a+' = '+(a*b)+'.'}})},
 {titre:'Regrouper autrement',description:'(2 + 3) + 4 = 2 + (3 + 4).',lecon:['Dans une addition de 3 nombres, on peut commencer par la paire qu’on veut.','(2 + 3) + 4 = 5 + 4 = 9 et 2 + (3 + 4) = 2 + 7 = 9.','Astuce : cherche les nombres qui font 10 ensemble.'],questions:()=>make(1804,r=>{const a=nb(r,1,9),b=nb(r,1,9),c=nb(r,1,9),t=nb(r,0,1);if(t===0)return{type:'nombre',texte:'Complète : ('+a+' + '+b+') + '+c+' = '+a+' + ('+b+' + ?)',oral:'Parenthèse '+a+' plus '+b+', plus '+c+', égale '+a+' plus, parenthèse '+b+' plus combien ?',visuel:{grand:'('+a+' + '+b+') + '+c+' = '+a+' + ('+b+' + ?)'},reponse:c,aide:'Les mêmes nombres, regroupés autrement : '+c+'.'};const x=nb(r,1,9),y=10-x,z=nb(r,2,9);return{type:'nombre',texte:'Calcule : '+x+' + '+z+' + '+y+' = ?',oral:x+' plus '+z+' plus '+y+'. Combien ?',visuel:{grand:x+' + '+z+' + '+y+' = ?'},reponse:x+y+z,aide:'Astuce : '+x+' + '+y+' = 10, puis 10 + '+z+' = '+(10+z)+'.'}})},
 {titre:'Les nombres spéciaux : 0 et 1',description:'+ 0, × 1, × 0.',lecon:['Ajouter 0 ne change rien : 8 + 0 = 8.','Multiplier par 1 ne change rien : 8 × 1 = 8.','Multiplier par 0 donne toujours 0 : 8 × 0 = 0.'],questions:()=>make(1805,r=>{const n=nb(r,2,999),t=nb(r,0,3);const E=[[n+' + 0',n,'Ajouter 0 ne change rien.'],[n+' × 1',n,'Multiplier par 1 ne change rien.'],[n+' × 0',0,'Multiplier par 0 donne toujours 0.'],['0 + '+n,n,'Ajouter 0 ne change rien.']][t];return{type:'nombre',texte:'Calcule : '+E[0]+' = ?',oral:E[0].replace('×','fois').replace('+','plus')+'. Combien ?',visuel:{grand:E[0]+' = ?'},reponse:E[1],aide:E[2]}})},
 {titre:'Pair + pair, impair + impair…',description:'Le résultat est-il pair ou impair ?',lecon:['pair + pair = pair (4 + 6 = 10).','impair + impair = pair (3 + 5 = 8).','pair + impair = impair (4 + 3 = 7).'],questions:()=>make(1806,r=>{const a=nb(r,11,99),b=nb(r,11,99),s=a+b;return chx(r,{texte:a+' + '+b+' : le résultat est-il pair ou impair ? (Pas besoin de calculer !)',oral:a+' plus '+b+'. Le résultat est-il pair ou impair ?',aide:a+' est '+(a%2?'impair':'pair')+', '+b+' est '+(b%2?'impair':'pair')+' : le résultat est '+(s%2?'impair':'pair')+'.'},s%2?['impair','pair']:['pair','impair'])})},
 {titre:'Vrai ou faux : les nombres naturels',description:'Ce qu’il faut savoir.',lecon:['Les nombres naturels sont 0, 1, 2, 3… sans fin.','Ils n’ont pas de virgule et ne sont pas négatifs.'],questions:()=>fixe(1807,[
   r=>chx(r,{texte:'Vrai ou faux : 0 est un nombre naturel.',aide:'Les nombres naturels commencent à 0.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : il existe un plus grand nombre naturel.',aide:'On peut toujours ajouter 1 : il n’y a pas de plus grand nombre naturel.'},['Faux','Vrai']),
   r=>chx(r,{texte:'Vrai ou faux : 3,5 est un nombre naturel.',aide:'Un nombre naturel n’a pas de virgule.'},['Faux','Vrai']),
   r=>chx(r,{texte:'Vrai ou faux : chaque nombre naturel a un nombre qui vient juste après lui.',aide:'Après n, il y a toujours n + 1.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : 0 a un nombre naturel juste avant lui.',aide:'0 est le premier nombre naturel : il n’y a rien avant.'},['Faux','Vrai']),
   r=>chx(r,{texte:'Vrai ou faux : 25 + 17 = 17 + 25.',aide:'L’ordre ne change rien dans une addition.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : 9 − 4 = 4 − 9.',aide:'Dans une soustraction, l’ordre compte : 9 − 4 = 5, mais on ne peut pas enlever 9 à 4 avec les nombres naturels.'},['Faux','Vrai']),
   r=>chx(r,{texte:'Vrai ou faux : 125 × 0 = 125.',aide:'Multiplier par 0 donne toujours 0.'},['Faux','Vrai']),
   r=>chx(r,{texte:'Vrai ou faux : 6 × 7 = 7 × 6.',aide:'L’ordre ne change rien dans une multiplication.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : la somme de deux nombres impairs est toujours paire.',aide:'impair + impair = pair. Exemple : 3 + 5 = 8.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : 48 + 0 = 48.',aide:'Ajouter 0 ne change rien.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : 1 000 est un nombre naturel.',aide:'C’est un nombre entier, sans virgule et pas négatif : il est naturel.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : (4 + 5) + 6 = 4 + (5 + 6).',aide:'On peut regrouper les nombres d’une addition comme on veut : 15 dans les deux cas.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : le nombre qui vient juste avant 300 est 299.',aide:'300 − 1 = 299.'},['Vrai','Faux']),
   r=>chx(r,{texte:'Vrai ou faux : 7 × 1 = 1.',aide:'Multiplier par 1 ne change rien : 7 × 1 = 7.'},['Faux','Vrai'])])()}
]};

/* ================= COMPLETING ADDITIONS AND SUBTRACTIONS =================
   Types "calcul" (yellow box anywhere), "trous" (hidden digits in columns), "nombre" (small problems). */
const AID_ADD=(a,c)=>'Pour trouver le nombre qui manque dans une addition, on soustrait : '+c+' − '+a+' = '+(c-a)+'. Vérifie : '+a+' + '+(c-a)+' = '+c+'.';
const LEC_COMPL=['Addition et soustraction vont ensemble : 5 + 3 = 8, donc 8 − 3 = 5 et 8 − 5 = 3.','Il manque un nombre dans une addition ? On soustrait.','Il manque le premier nombre d’une soustraction ? On additionne.','On peut aussi compter en avançant : de 5 à 8, il y a 3.'];
function complQ(r,max,min){const op=pick(r,['+','−']),pos=int(r,0,1);
  if(op==='+'){const a=int(r,min,max-min),b=int(r,min,max-a),c=a+b;return pos===0?calc(a,'+',b,1,{aide:AID_ADD(a,c)}):calc(a,'+',b,0,{aide:AID_ADD(b,c)})}
  const a=int(r,2*min,max),b=int(r,min,a-min),c=a-b;return pos===0?calc(a,'−',b,1,{aide:'Pour trouver le nombre qu’on enlève : '+a+' − '+c+' = '+b+'. Vérifie : '+a+' − '+b+' = '+c+'.'}):calc(a,'−',b,0,{aide:'Il manque le premier nombre : on additionne. '+c+' + '+b+' = '+a+'.'})}
function trouQ(r,op,n,nb){for(let g=0;g<300;g++){let a,b;const lo=10**(n-1);
    if(op==='+'){a=int(r,lo,10**n-1);b=int(r,lo,10**n-1);if(a+b>=10**n)continue}else{a=int(r,lo+lo,10**n-1);b=int(r,lo,a-1);if(a-b<lo)continue}
    const res=op==='+'?a+b:a-b,cols=melange(r,[...Array(n).keys()]).slice(0,nb);
    const cache=cols.map(i=>[int(r,0,2),i]);
    if(op==='+'?nbRegAdd(a,b)===0&&r()<.6:nbRegSou(a,b)===0&&r()<.6)continue;
    return{type:'trous',a,b,op,r:res,n,cache,aide:op==='+'?'Colonne par colonne, depuis les unités : chiffre du haut + chiffre du bas (+ 1 si tu as regroupé) donne le chiffre du résultat.':'Colonne par colonne, depuis les unités : vérifie avec l’addition. Le résultat + le nombre du bas = le nombre du haut.'}}}
const completer={id:'completer',titre:'Compléter des additions et des soustractions',icone:'□ + 5',couleur:'#0d5d6e',video:'videos/Completer-operations.mp4',consigne:'Écris le nombre manquant dans la case jaune.',niveaux:[
 {titre:'L’addition à compléter (jusqu’à 20)',description:'Par exemple : 7 + ? = 12.',lecon:LEC_COMPL,questions:()=>make(1901,r=>{const a=int(r,2,12),b=int(r,2,20-a),c=a+b;return r()<.5?calc(a,'+',b,1,{aide:AID_ADD(a,c)}):calc(a,'+',b,0,{aide:AID_ADD(b,c)})})},
 {titre:'La soustraction à compléter (jusqu’à 20)',description:'Par exemple : 15 − ? = 9 ou ? − 4 = 7.',lecon:LEC_COMPL,questions:()=>make(1902,r=>{const a=int(r,6,20),b=int(r,2,a-2),c=a-b;return r()<.5?calc(a,'−',b,1,{aide:'On enlève combien ? '+a+' − '+c+' = '+b+'.'}):calc(a,'−',b,0,{aide:'Il manque le premier nombre : on additionne. '+c+' + '+b+' = '+a+'.'})})},
 {titre:'Compléter avec des dizaines',description:'Par exemple : 40 + ? = 70.',lecon:LEC_COMPL,questions:()=>make(1903,r=>{const q=complQ(r,9,1);q.v=q.v.map(x=>x*10);q.aide=q.aide.replace(/\d+/g,m=>String(Number(m)*10));return q})},
 {titre:'Compléter jusqu’à 100',description:'Additions et soustractions.',lecon:LEC_COMPL,questions:()=>make(1904,r=>complQ(r,100,11))},
 {titre:'Compléter à 10, à 100, à 1 000',description:'Par exemple : 37 + ? = 100.',lecon:['Pour aller à 100 : d’abord jusqu’à la dizaine suivante, puis jusqu’à 100.','37 + 3 = 40, puis 40 + 60 = 100. Donc 37 + 63 = 100.'],questions:()=>make(1905,r=>{const t=pick(r,[10,100,100,1000]);const a=t===10?int(r,1,9):t===100?int(r,11,89):int(r,11,89)*10;return calc(a,'+',t-a,1,{aide:a+' + '+(t-a)+' = '+mil(t)+'. Avance d’abord jusqu’à la '+(t===10?'':'dizaine ')+'suivante.'})})},
 {titre:'Compléter jusqu’à 1 000',description:'De plus grands nombres.',lecon:LEC_COMPL,questions:()=>make(1906,r=>complQ(r,999,101))},
 {titre:'Chiffres cachés : addition',description:'Retrouver les chiffres qui manquent en colonnes.',lecon:['Travaille une colonne à la fois, en commençant par les unités.','Si les unités font 10 ou plus, on regroupe : 1 dizaine va en haut de la colonne des dizaines.'],questions:()=>make(1907,r=>trouQ(r,'+',int(r,2,3),2))},
 {titre:'Chiffres cachés : soustraction',description:'Vérifie avec l’addition.',lecon:['Travaille une colonne à la fois, en commençant par les unités.','Pour vérifier une soustraction : le résultat + le nombre du bas = le nombre du haut.'],questions:()=>make(1908,r=>trouQ(r,'−',3,int(r,2,3)))},
 {titre:'Petits problèmes',description:'Trouver le nombre qui manque dans une histoire.',lecon:['Lis l’histoire deux fois.','Cherche ce que tu sais et ce qui manque.','Écris l’opération avec une case vide, puis complète-la.'],questions:()=>make(1909,r=>{const[N,P]=pick(r,[['Léa','elle'],['Sami','il'],['Noah','il'],['Inès','elle'],['Adam','il'],['Maya','elle']]),[O,G]=pick(r,[['billes','f'],['cartes','f'],['perles','f'],['autocollants','m']]),deO=(/^[aeiouéè]/.test(O)?'d’':'de ')+O,Pm=P[0].toUpperCase()+P.slice(1),t=int(r,0,3);
   if(t===0){const a=int(r,12,45),b=int(r,5,30);return{type:'nombre',texte:N+' a '+a+' '+O+'. On lui en donne d’autres. Maintenant, '+P+' en a '+(a+b)+'. Combien lui en a-t-on donné ?',reponse:b,aide:a+' + ? = '+(a+b)+'. On soustrait : '+(a+b)+' − '+a+' = '+b+'.'}}
   if(t===1){const a=int(r,30,90),b=int(r,5,a-10);return{type:'nombre',texte:N+' a '+a+' '+O+'. '+Pm+' en perd '+(G==='f'?'quelques-unes':'quelques-uns')+'. Il en reste '+(a-b)+'. Combien en a-t-'+P+' perdu ?',reponse:b,aide:a+' − ? = '+(a-b)+'. '+a+' − '+(a-b)+' = '+b+'.'}}
   if(t===2){const c=int(r,10,40),b=int(r,5,30);return{type:'nombre',texte:N+' donne '+b+' '+O+' à un ami. Il lui en reste '+c+'. Combien '+deO+' '+N+' avait-'+P+' au début ?',reponse:b+c,aide:'? − '+b+' = '+c+'. On additionne : '+c+' + '+b+' = '+(b+c)+'.'}}
   const a=int(r,20,70),c=int(r,a+10,100);return{type:'nombre',texte:N+' a '+a+' '+O+'. '+Pm+' en voudrait '+c+'. Combien lui en manque-t-il ?',reponse:c-a,aide:a+' + ? = '+c+'. '+c+' − '+a+' = '+(c-a)+'.'}})}
]};

/* ================= FRACTIONS ================= Fractions are written "[3/4]": the engine shows them with a fraction bar. */
const F=(n,d)=>'['+n+'/'+d+']';
const pgcd=(a,b)=>b?pgcd(b,a%b):a;
const fauxFrac=(r,n,d,k)=>{const o=[],vu=new Set([n+'/'+d]);let g=0;while(o.length<k&&g++<200){const c=pick(r,[[d-n,d],[n,d+1],[n+1,d],[Math.max(1,n-1),d],[d,n],[n,d*2]]);if(c[0]<1||c[1]<2||c[0]>c[1]*2)continue;const key=c[0]+'/'+c[1];if(!vu.has(key)){vu.add(key);o.push(F(c[0],c[1]))}}return o};
const LEC_FRAC=['Une fraction, c’est une partie d’un tout partagé en parts égales.','Le nombre du bas (dénominateur) dit en combien de parts égales on a partagé.','Le nombre du haut (numérateur) dit combien de parts on prend.','Exemple : [3/4], c’est 3 parts sur 4 parts égales.'];
const fractions={id:'fractions',titre:'Les fractions',icone:'¾',couleur:'#0d5d6e',animee:'fractions',consigne:'Observe bien les parts.',niveaux:[
 {titre:'Des parts égales ?',description:'Une fraction a toujours des parts égales.',lecon:['Pour faire une fraction, il faut des parts égales : toutes de la même grandeur.','Si une part est plus grande qu’une autre, ce ne sont pas des parts égales.'],questions:()=>make(2001,r=>{const d=int(r,2,6),eg=r()<.5;const L=eg?null:Array.from({length:d},()=>int(r,1,4));if(L&&L.every(x=>x===L[0]))L[0]+=2;return chx(r,{texte:'Cette bande est-elle partagée en parts égales ?',visuel:{frac:{forme:'inegal',d,n:0,largeurs:L}},aide:eg?'Toutes les parts ont la même largeur : oui, elles sont égales.':'Certaines parts sont plus larges que d’autres : elles ne sont pas égales.'},eg?['Oui, les parts sont égales','Non, les parts ne sont pas égales']:['Non, les parts ne sont pas égales','Oui, les parts sont égales'])})},
 {titre:'Un demi, un tiers, un quart',description:'Une seule part coloriée.',lecon:LEC_FRAC.concat(['[1/2] : un demi (la moitié). [1/3] : un tiers. [1/4] : un quart.']),questions:()=>make(2002,r=>{const d=pick(r,[2,3,4]),f=pick(r,['barre','cercle']);return chx(r,{texte:'Quelle fraction de la forme est coloriée ?',visuel:{frac:{forme:f,d,n:1}},aide:'Compte toutes les parts : '+d+'. Une seule est coloriée : '+F(1,d)+'.'},[F(1,d),...[2,3,4,5].filter(x=>x!==d).slice(0,2).map(x=>F(1,x))])})},
 {titre:'Lire une fraction',description:'Combien de parts coloriées, sur combien ?',lecon:LEC_FRAC,questions:()=>make(2003,r=>{const d=int(r,2,8),n=int(r,1,d-1),f=pick(r,['barre','cercle']);return chx(r,{texte:'Quelle fraction de la forme est coloriée ?',visuel:{frac:{forme:f,d,n}},aide:n+' parts coloriées sur '+d+' parts égales : '+F(n,d)+'.'},[F(n,d),...fauxFrac(r,n,d,3)])})},
 {titre:'Colorier une fraction',description:'Touche les parts pour les colorier.',lecon:LEC_FRAC.concat(['Pour colorier [2/5] : la forme a 5 parts, colorie-en 2.']),questions:()=>make(2004,r=>{const d=int(r,2,8),n=int(r,1,d-1);return{type:'fraccolor',forme:pick(r,['barre','cercle']),d,n,texte:'Colorie '+F(n,d)+' de la forme.',aide:'Le nombre du haut, '+n+', dit combien de parts colorier.'}})},
 {titre:'Fraction d’un ensemble',description:'Des billes : combien sont rouges ?',lecon:['Une fraction peut aussi parler d’un groupe d’objets.','S’il y a 5 billes et 2 sont rouges : [2/5] des billes sont rouges.'],questions:()=>make(2005,r=>{const t=int(r,3,10),n=int(r,1,t-1);return chx(r,{texte:'Quelle fraction des billes est rouge ?',visuel:{frac:{forme:'ensemble',total:t,n}},aide:n+' billes rouges sur '+t+' billes en tout : '+F(n,t)+'.'},[F(n,t),...fauxFrac(r,n,t,3)])})},
 {titre:'Comparer des fractions',description:'Laquelle est la plus grande ?',lecon:['Même dénominateur : la plus grande fraction a le plus grand numérateur. [3/5] > [2/5].','Même numérateur : plus il y a de parts, plus chaque part est petite. [1/3] > [1/6].','Regarde les bandes : la plus longue partie coloriée est la plus grande fraction.'],questions:()=>make(2006,r=>{let a,b,c,d;if(r()<.5){c=d=int(r,3,10);a=int(r,1,c-1);b=int(r,1,c-1);if(a===b)return null}else{a=b=int(r,1,3);c=int(r,a+1,10);d=int(r,a+1,10);if(c===d)return null}const v1=a/c,v2=b/d,bon=v1>v2?'A : '+F(a,c):'B : '+F(b,d);return chx(r,{texte:'Quelle fraction est la plus grande : A ('+F(a,c)+') ou B ('+F(b,d)+') ?',visuel:{frac:{forme:'deux',paires:[[a,c],[b,d]]}},oral:'Quelle fraction est la plus grande : A, '+a+' sur '+c+', ou B, '+b+' sur '+d+' ?',aide:c===d?'Même nombre de parts : compare les numérateurs.':'Même numérateur : la fraction avec les parts les plus grandes (le plus petit dénominateur) est la plus grande.'},[bon,bon[0]==='A'?'B : '+F(b,d):'A : '+F(a,c)])})},
 {titre:'Fractions équivalentes',description:'[1/2] = [2/4] = [3/6]',lecon:['Des fractions équivalentes ont la même valeur : la même longueur coloriée.','On multiplie le haut et le bas par le même nombre : [1/2] = [2/4] (× 2).'],questions:()=>make(2007,r=>{const d=pick(r,[2,3,4,5]),n=int(r,1,d-1),k=int(r,2,4),haut=r()<.5;return{type:'nombre',texte:'Complète : '+F(n,d)+' = '+(haut?'[?/'+(d*k)+']':'['+(n*k)+'/?]'),oral:n+' sur '+d+' égale '+(haut?'combien sur '+(d*k):(n*k)+' sur combien')+' ?',visuel:{frac:{forme:'deux',paires:[[n,d],[n*k,d*k]]}},reponse:haut?n*k:d*k,aide:'On a multiplié par '+k+' : '+F(n,d)+' = '+F(n*k,d*k)+'.'}})},
 {titre:'Fractions sur la droite numérique',description:'Où est le point ?',lecon:['Entre 0 et 1, la droite est partagée en parts égales.','Compte les bonds depuis 0 jusqu’au point : c’est le numérateur.','Le nombre de parts entre 0 et 1, c’est le dénominateur.'],questions:()=>make(2008,r=>{const d=int(r,2,8),n=int(r,1,d-1);return chx(r,{texte:'Quelle fraction est au point rouge ?',visuel:{frac:{forme:'droite',d,n}},aide:'Entre 0 et 1 il y a '+d+' parts. Le point est au bond '+n+' : '+F(n,d)+'.'},[F(n,d),...fauxFrac(r,n,d,2)])})},
 {titre:'Fraction d’un nombre',description:'[1/4] de 12, [2/3] de 9…',lecon:['Pour trouver [1/4] de 12 : partage 12 en 4 groupes égaux. 12 ÷ 4 = 3.','Pour [3/4] de 12 : un groupe vaut 3, alors 3 groupes valent 9.'],questions:()=>make(2009,r=>{const d=pick(r,[2,3,4,5,10]),k=int(r,1,d>5?5:6),t=d*int(r,2,6),n=r()<.5?1:int(r,1,d-1);return{type:'nombre',texte:'Combien font '+F(n,d)+' de '+t+' ?',visuel:t<=24?{frac:{forme:'ensemble',total:t,n:0}}:undefined,reponse:n*t/d,aide:t+' ÷ '+d+' = '+(t/d)+(n>1?', puis '+(t/d)+' × '+n+' = '+(n*t/d):'')+'.'}})},
 {titre:'Additionner et soustraire',description:'Même dénominateur : [2/5] + [1/5]',lecon:['Quand le dénominateur est le même, on additionne (ou on soustrait) seulement les numérateurs.','[2/5] + [1/5] = [3/5]. Le dénominateur ne change pas : ce sont toujours des cinquièmes.'],questions:()=>make(2010,r=>{const d=int(r,3,10),a=int(r,1,d-1),plus=r()<.6;let b,res;if(plus){b=int(r,1,d-a);res=a+b}else{b=int(r,1,a);res=a-b;if(!res)return null}return{type:'nombre',texte:'Complète : '+F(a,d)+(plus?' + ':' − ')+F(b,d)+' = [?/'+d+']',oral:a+' sur '+d+(plus?' plus ':' moins ')+b+' sur '+d+' égale combien sur '+d+' ?',visuel:{frac:{forme:'barre',d,n:plus?a:a}},reponse:res,aide:'Même dénominateur : '+a+(plus?' + ':' − ')+b+' = '+res+'. Réponse : '+F(res,d)+'.'}})}
]};

/* ================= DIVISION ================= */
const LEC_DIV=['Diviser, c’est partager en parts égales ou faire des groupes égaux.','12 ÷ 3 = 4 : 12 partagé en 3, cela fait 4 dans chaque part.','La division est le contraire de la multiplication : 3 × 4 = 12, donc 12 ÷ 3 = 4.'];
const divQ=(r,tables,maxF)=>{const b=pick(r,tables),q=int(r,1,maxF||10);return calc(b*q,'÷',b,2,{v:[b*q,b,q],aide:'Pense à la table de '+b+' : '+b+' × '+q+' = '+(b*q)+', donc '+(b*q)+' ÷ '+b+' = '+q+'.'})};
const division={id:'division',titre:'La division',icone:'÷',couleur:'#0d5d6e',video:'videos/La-division.mp4',consigne:'Écris le nombre manquant dans la case jaune.',niveaux:[
 {titre:'Partager en parts égales',description:'Combien chacun reçoit-il ?',lecon:LEC_DIV,questions:()=>make(2101,r=>{const g=int(r,2,5),c=int(r,2,5),t=g*c;return{type:'nombre',texte:t+' jetons sont partagés également entre '+g+' amis. Combien de jetons chaque ami reçoit-il ?',visuel:{jetons:t,groupes:g},reponse:c,aide:'Donne un jeton à chacun, à tour de rôle : '+t+' ÷ '+g+' = '+c+'.'}})},
 {titre:'Faire des groupes égaux',description:'Combien de groupes ?',lecon:['Faire des groupes : 12 jetons, des groupes de 4. Combien de groupes ?','On compte les groupes de 4 : 12 ÷ 4 = 3 groupes.'],questions:()=>make(2102,r=>{const c=int(r,2,5),g=int(r,2,6),t=g*c;return{type:'nombre',texte:'Tu as '+t+' jetons. Tu fais des groupes de '+c+'. Combien de groupes peux-tu faire ?',visuel:{jetons:t,groupes:0},reponse:g,aide:'Entoure des groupes de '+c+' : '+t+' ÷ '+c+' = '+g+' groupes.'}})},
 {titre:'Division et multiplication',description:'3 × ? = 12, donc 12 ÷ 3 = ?',lecon:LEC_DIV,questions:()=>make(2103,r=>{const b=int(r,2,9),q=int(r,2,9);return r()<.5?calc(b,'×',q,1,{aide:'Cherche dans la table de '+b+'.'}):calc(b*q,'÷',b,2,{v:[b*q,b,q],aide:'Pense à '+b+' × ? = '+(b*q)+'. La réponse est '+q+'.'})})},
 {titre:'Diviser par 2, 5 et 10',description:'Les tables faciles.',lecon:['Diviser par 2 : prendre la moitié.','Diviser par 10 : 50 ÷ 10 = 5.','Diviser par 5 : compte de 5 en 5.'],questions:()=>make(2104,r=>divQ(r,[2,5,10]))},
 {titre:'Diviser par 3 et 4',description:'',lecon:['Diviser par 4 : c’est la moitié de la moitié. 20 ÷ 2 = 10, 10 ÷ 2 = 5.','Diviser par 3 : pense à la table de 3.'],questions:()=>make(2105,r=>divQ(r,[3,4]))},
 {titre:'Diviser par 6, 7, 8 et 9',description:'Les tables plus difficiles.',lecon:['Utilise la multiplication : 56 ÷ 8 ? Je cherche 8 × ? = 56. C’est 7.'],questions:()=>make(2106,r=>divQ(r,[6,7,8,9]))},
 {titre:'Division avec un reste',description:'17 ÷ 5 = 3, reste 2',lecon:['Parfois, le partage ne tombe pas juste : il reste quelque chose.','17 ÷ 5 : 5 × 3 = 15, il reste 2. On écrit : 17 ÷ 5 = 3 reste 2.','Le reste est toujours plus petit que le diviseur.'],questions:()=>make(2107,r=>{const b=int(r,2,9),q=int(r,1,9),rs=int(r,1,b-1),t=b*q+rs;return{type:'reste',texte:'Calcule : '+t+' ÷ '+b+' = ? reste ?',oral:'Combien fait '+t+' divisé par '+b+', et quel est le reste ?',visuel:{jetons:t<=40?t:0,groupes:0},q,r:rs,aide:b+' × '+q+' = '+(b*q)+'. Il reste '+t+' − '+(b*q)+' = '+rs+'.'}})},
 {titre:'Problèmes de division',description:'Des situations de la vie.',lecon:['Lis le problème deux fois.','Partager ou faire des groupes ? Les deux, c’est une division.','Attention au reste : parfois il faut un groupe de plus !'],questions:()=>make(2108,r=>{const t=int(r,0,3);
   if(t===0){const g=int(r,2,6),c=int(r,3,8);return{type:'nombre',texte:'Une enseignante a '+(g*c)+' crayons. Elle les partage également entre '+g+' tables. Combien de crayons y a-t-il sur chaque table ?',reponse:c,aide:(g*c)+' ÷ '+g+' = '+c+'.'}}
   if(t===1){const c=int(r,4,8),g=int(r,2,6);return{type:'nombre',texte:'Il y a '+(c*g)+' œufs. Une boîte contient '+c+' œufs. Combien de boîtes faut-il ?',reponse:g,aide:(c*g)+' ÷ '+c+' = '+g+' boîtes.'}}
   if(t===2){const p=int(r,4,6),n=p*int(r,2,5)+int(r,1,p-1),rep=Math.ceil(n/p);return{type:'nombre',texte:n+' élèves vont au musée. Une auto peut transporter '+p+' élèves. Combien d’autos faut-il pour que tout le monde y aille ?',reponse:rep,aide:n+' ÷ '+p+' = '+Math.floor(n/p)+' reste '+(n%p)+'. Il faut une auto de plus pour les '+(n%p)+' élèves qui restent : '+rep+' autos.'}}
   const p=int(r,2,5)*5,n=int(r,2,6);return{type:'nombre',texte:'Un paquet de '+n+' cartes coûte '+(p*n)+' ¢. Combien coûte une carte ?',reponse:p,aide:(p*n)+' ÷ '+n+' = '+p+' ¢.'}})},
 {titre:'Diviser des dizaines et des centaines',description:'80 ÷ 4, 600 ÷ 3',lecon:['80 ÷ 4 : c’est 8 dizaines ÷ 4 = 2 dizaines, donc 20.','600 ÷ 3 : 6 centaines ÷ 3 = 2 centaines, donc 200.'],questions:()=>make(2109,r=>{const b=int(r,2,9),q=int(r,1,9),m=pick(r,[10,100]);return calc(b*q*m,'÷',b,2,{v:[b*q*m,b,q*m],aide:(b*q)+' '+(m===10?'dizaines':'centaines')+' ÷ '+b+' = '+q+' '+(m===10?'dizaines':'centaines')+', donc '+(q*m)+'.'})})},
 {titre:'Diviser un nombre à 2 chiffres',description:'84 ÷ 4 = 80 ÷ 4 + 4 ÷ 4',lecon:['On décompose le nombre en parties faciles à diviser.','84 ÷ 4 : 80 ÷ 4 = 20 et 4 ÷ 4 = 1. Donc 84 ÷ 4 = 21.','72 ÷ 3 : 60 ÷ 3 = 20 et 12 ÷ 3 = 4. Donc 72 ÷ 3 = 24.'],questions:()=>make(2110,r=>{const b=int(r,2,6),q=int(r,11,Math.floor(99/b)),t=b*q,dz=Math.floor(q/10)*10*b;return calc(t,'÷',b,2,{v:[t,b,q],aide:'Décompose : '+dz+' ÷ '+b+' = '+(dz/b)+' et '+(t-dz)+' ÷ '+b+' = '+((t-dz)/b)+'. Total : '+q+'.'})})}
]};

/* ================= ADDING AND SUBTRACTING WITH REGROUPING =================
   Column calculation (type "colonnes" in moteur.js). The word used is always "regrouper" (regroup). */
const dig=(x,i)=>Math.floor(x/10**i)%10;
const nbRegAdd=(a,b)=>{let c=0,r=0;for(let i=0;i<4;i++){const t=dig(a,i)+dig(b,i)+r;r=t>=10?1:0;c+=r}return c};
const nbRegSou=(a,b)=>{let c=0,r=0;for(let i=0;i<4;i++){const t=dig(a,i)-r-dig(b,i);r=t<0?1:0;c+=r}return c};
const col=(a,op,b,aide)=>{const r=op==='+'?a+b:a-b;return{type:'colonnes',a,b,op,r,n:String(Math.max(a,b,r)).length,aide}};
/* Draws a and b until exactly the wanted number of regroupings is reached. */
const tire=(r,op,min,max,nb,minB)=>{for(let g=0;g<500;g++){let a=int(r,min,max),b=int(r,minB||min,max);if(op==='−'&&b>a)[a,b]=[b,a];if(op==='+'&&a+b>999)continue;if(op==='−'&&a===b)continue;const k=op==='+'?nbRegAdd(a,b):nbRegSou(a,b);if(typeof nb==='function'?nb(k,a,b):k===nb)return[a,b]}return[min+1,min]};
const AIDE_ADD0='Additionne les unités, puis les dizaines. Ici, pas besoin de regrouper.',AIDE_ADD='Si les unités font 10 ou plus : regroupe 10 unités en 1 dizaine. Écris le 1 en haut de la colonne des dizaines.';
const AIDE_SOU0='Soustrais les unités, puis les dizaines. Ici, pas besoin de regrouper.',AIDE_SOU='Si le chiffre du haut est plus petit : regroupe. Défais 1 dizaine en 10 unités, puis soustrais.';
const regrouper={id:'regrouper',titre:'Additionner et soustraire en regroupant',icone:'⁺¹⁰',couleur:'#0d5d6e',
 video:'videos/Additionner-soustraire-en-regroupant.mp4',
 consigne:'Calcule en colonnes. Commence toujours par les unités, à droite.',
 niveaux:[
 {titre:'Additionner sans regrouper',description:'Deux chiffres. On commence par les unités.',questions:()=>make(1101,r=>{const[a,b]=tire(r,'+',10,88,0);return col(a,'+',b,AIDE_ADD0)})},
 {titre:'Additionner en regroupant les unités',description:'10 unités deviennent 1 dizaine.',questions:()=>make(1102,r=>{const[a,b]=tire(r,'+',12,79,(k,a,b)=>k===1&&a+b<100);return col(a,'+',b,AIDE_ADD)})},
 {titre:'Additionner avec 3 chiffres',description:'Un seul regroupement.',questions:()=>make(1103,r=>{const[a,b]=tire(r,'+',105,789,1,21);return col(a,'+',b,AIDE_ADD+' 10 dizaines deviennent 1 centaine.')})},
 {titre:'Additionner en regroupant deux fois',description:'Les unités, puis les dizaines.',questions:()=>make(1104,r=>{const[a,b]=tire(r,'+',115,789,2,45);return col(a,'+',b,AIDE_ADD+' Si les dizaines font 10 ou plus, regroupe aussi : 10 dizaines deviennent 1 centaine.')})},
 {titre:'Soustraire sans regrouper',description:'Deux chiffres. On commence par les unités.',questions:()=>make(1105,r=>{const[a,b]=tire(r,'−',11,99,0);return col(a,'−',b,AIDE_SOU0)})},
 {titre:'Soustraire en regroupant une dizaine',description:'1 dizaine devient 10 unités.',questions:()=>make(1106,r=>{const[a,b]=tire(r,'−',21,98,1,11);return col(a,'−',b,AIDE_SOU)})},
 {titre:'Soustraire avec 3 chiffres',description:'Un seul regroupement.',questions:()=>make(1107,r=>{const[a,b]=tire(r,'−',120,989,(k,a,b)=>k===1&&a-b>=100,21);return col(a,'−',b,AIDE_SOU+' S’il manque des dizaines, défais 1 centaine en 10 dizaines.')})},
 {titre:'Soustraire en regroupant deux fois',description:'Aussi avec des zéros, comme 300 − 146.',questions:()=>make(1108,r=>{let a,b;if(r()<.4){for(let g=0;g<200;g++){a=int(r,2,9)*100+pick(r,[0,int(r,1,9)]);b=int(r,101,a-30);if(nbRegSou(a,b)>=2)break}}else[a,b]=tire(r,'−',200,989,2,101);return col(a,'−',b,AIDE_SOU+' Avec un zéro aux dizaines : défais d’abord 1 centaine en 10 dizaines, puis 1 dizaine en 10 unités.')})},
 {titre:'Additions et soustractions mêlées',description:'Lis bien le signe avant de commencer.',questions:()=>make(1109,r=>{if(r()<.5){const[a,b]=tire(r,'+',105,789,k=>k>=1,21);return col(a,'+',b,'C’est une addition. '+AIDE_ADD)}const[a,b]=tire(r,'−',150,989,k=>k>=1,21);return col(a,'−',b,'C’est une soustraction. '+AIDE_SOU)})}
 ]};

/* ================= ADDING AND SUBTRACTING BY DECOMPOSING =================
   Type "decompose" in moteur.js: each number is split into tens and ones, written one under the other with a bar.
   donnees = the decompositions are already written; regroupe = the top number is regrouped (52 = 40 + 12). */
const dec=(a,op,b,o)=>Object.assign({type:'decompose',a,b,op,r:op==='+'?a+b:a-b},o||{});
const AIDE_DEC_ADD='Additionne les dizaines ensemble, puis les unités ensemble. Ensuite, additionne les deux résultats.';
const AIDE_DEC_SOU='Soustrais les dizaines ensemble, puis les unités ensemble. Ensuite, additionne les deux résultats.';
const AIDE_DEC_REG='Il n’y a pas assez d’unités en haut : regroupe. Défais 1 dizaine en 10 unités. Par exemple, 52 = 40 + 12.';
/* Two-digit numbers: no regrouping (units sum < 10, or top units >= bottom units). */
const paireDec=(r,op,regroupe)=>{for(let g=0;g<500;g++){let a=int(r,21,89),b=int(r,11,79);if(op==='−'&&b>a)[a,b]=[b,a];if(a===b)continue;const ua=a%10,ub=b%10;
 if(op==='+'){if(a+b>99)continue;if(regroupe?ua+ub>=10:ua+ub<10)return[a,b]}
 else{if(regroupe?(ua<ub&&a-b>=10):(ua>=ub&&Math.floor(a/10)>Math.floor(b/10)))return[a,b]}}return op==='+'?[24,13]:[57,32]};
const decomposer={id:'decomposer',titre:'Additionner et soustraire en décomposant',icone:'50+2',couleur:'#0d5d6e',
 consigne:'Décompose chaque nombre en dizaines et en unités, puis calcule.',
 niveaux:[
 {titre:'Additionner : décompositions données',description:'On additionne les dizaines, puis les unités.',lecon:['52 = 50 + 2 : 5 dizaines et 2 unités.','On additionne les dizaines ensemble, puis les unités ensemble.','Exemple : 15 + 12 → (10 + 10) + (5 + 2) = 20 + 7 = 27.'],questions:()=>make(2101,r=>{const[a,b]=paireDec(r,'+');return dec(a,'+',b,{donnees:true,aide:AIDE_DEC_ADD})})},
 {titre:'Additionner : décompose toi-même',description:'Écris les dizaines et les unités de chaque nombre.',questions:()=>make(2102,r=>{const[a,b]=paireDec(r,'+');return dec(a,'+',b,{aide:'Écris chaque nombre en dizaines + unités. 24 = 20 + 4. '+AIDE_DEC_ADD})})},
 {titre:'Soustraire : décompositions données',description:'On soustrait les dizaines, puis les unités.',lecon:['On soustrait les dizaines ensemble, puis les unités ensemble.','Exemple : 52 − 41 → (50 − 40) + (2 − 1) = 10 + 1 = 11.'],questions:()=>make(2103,r=>{const[a,b]=paireDec(r,'−');return dec(a,'−',b,{donnees:true,aide:AIDE_DEC_SOU})})},
 {titre:'Soustraire : décompose toi-même',description:'Écris les dizaines et les unités de chaque nombre.',questions:()=>make(2104,r=>{const[a,b]=paireDec(r,'−');return dec(a,'−',b,{aide:'Écris chaque nombre en dizaines + unités. 63 = 60 + 3. '+AIDE_DEC_SOU})})},
 {titre:'Additionner : les unités font 10 ou plus',description:'On regroupe : 12 unités = 1 dizaine et 2 unités.',lecon:['27 + 35 → (20 + 30) + (7 + 5) = 50 + 12.','12 unités, c’est 1 dizaine et 2 unités : on regroupe.','50 + 12 = 62.'],questions:()=>make(2105,r=>{const[a,b]=paireDec(r,'+',true);return dec(a,'+',b,{aide:AIDE_DEC_ADD+' Si les unités font 10 ou plus, regroupe : 10 unités font 1 dizaine.'})})},
 {titre:'Soustraire en regroupant',description:'Pas assez d’unités en haut : 52 = 40 + 12.',lecon:['52 − 37 : on ne peut pas faire 2 − 7.','On regroupe : on défait 1 dizaine en 10 unités. 52 = 40 + 12.','(40 − 30) + (12 − 7) = 10 + 5 = 15.'],questions:()=>make(2106,r=>{const[a,b]=paireDec(r,'−',true);return dec(a,'−',b,{regroupe:true,aide:AIDE_DEC_REG})})},
 {titre:'Additions et soustractions mêlées',description:'Lis bien le signe avant de commencer.',questions:()=>make(2107,r=>{const op=r()<.5?'+':'−',g=r()<.4;const[a,b]=paireDec(r,op,g);return dec(a,op,b,{regroupe:op==='−'&&g,aide:op==='+'?AIDE_DEC_ADD:g?AIDE_DEC_REG:AIDE_DEC_SOU})})}
 ]};

/* ============================ PATTERNS ============================ */
const suite=(start,step,len)=>{const nums=[];for(let i=0;i<len;i++)nums.push(start+i*step);return{type:'nombre',texte:'Observe la suite. Quel nombre vient ensuite ?',visuel:{suite:nums},reponse:start+len*step,aide:step>0?'Chaque nombre augmente de '+step+'.':'Chaque nombre diminue de '+(-step)+'.'}};
const suites={id:'suites',titre:'Compléter une suite',icone:'2 4 6',couleur:'#12525c',
 consigne:'Trouve le nombre qui vient ensuite.',
 niveaux:[
 {titre:'Compter de 1 en 1',description:'',questions:()=>make(501,r=>suite(int(r,1,20),1,5))},
 {titre:'Compter de 2, de 5 ou de 10',description:'',questions:()=>make(502,r=>{const s=pick(r,[2,5,10]);return suite(s*int(r,0,5),s,4)})},
 {titre:'Compter de 3 ou de 4',description:'',questions:()=>make(503,r=>{const s=pick(r,[3,4]);return suite(int(r,0,12),s,4)})},
 {titre:'Les suites qui descendent',description:'On enlève à chaque fois.',questions:()=>make(504,r=>{const s=pick(r,[1,2,5,10]);return suite(s*int(r,5,10)+(s===1?int(r,0,9):0),-s,4)})},
 {titre:'Toutes les suites',description:'Monter ou descendre, avec de grands bonds.',questions:()=>make(505,r=>{const s=pick(r,[3,4,6,7,8,9,15,20,25]);return r()<.5?suite(int(r,0,30),s,4):suite(s*int(r,6,12),-s,4)})}
 ]};

/* ===================== READING POSITIONS ON A MAP =====================
   Gradual introduction to the Cartesian plane (type "plan" in moteur.js).
   Levels 1 to 8: first quadrant. Levels 9 to 14: negative numbers (−5 to 5).
   Modes: case, caseLire, deplacer, lire, placer, mystere, partie. */
const LETTRES='ABCDE';
const neg=v=>v<0?'−'+(-v):String(v);
const coord=(x,y)=>'('+neg(x)+', '+neg(y)+')';
/* Three choices to read a point: the right answer and two traps, shuffled. */
function choixPoint(r,x,y,pieges){const l=[[x,y]];for(const p of pieges)if(!l.some(o=>o[0]===p[0]&&o[1]===p[1]))l.push(p);
  let k=-1;while(l.length<3){const d=[[x+1,y],[x,y+1],[x-1,y],[x,y-1]][++k];if(!l.some(o=>o[0]===d[0]&&o[1]===d[1]))l.push(d)}
  const m=l.map(p=>[r(),p]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);return{choix:m.map(p=>coord(p[0],p[1])),reponse:m.findIndex(p=>p[0]===x&&p[1]===y)}}
const AIDE_LIRE='Lis d’abord en bas, sur l’axe rouge (x), puis sur le côté, sur l’axe bleu (y).';
const AIDE_PLACER='Pars de 0 : avance sur l’axe rouge (x), puis monte vers le nombre de l’axe bleu (y).';
const AIDE_NEG='Le signe − veut dire : à gauche pour x, vers le bas pour y.';
const lire=(r,x,y,o,pieges,aide)=>Object.assign({type:'plan',mode:'lire',min:0,max:6,pt:[x,y],aide:aide||AIDE_LIRE},o,choixPoint(r,x,y,pieges));
const placer=(x,y,o,aide)=>Object.assign({type:'plan',mode:'placer',min:0,max:6,cible:[x,y],aide:aide||AIDE_PLACER},o);
const nz=(r,a,b)=>{let v;do v=int(r,a,b);while(v===0);return v};
function deplacer(x,y,o,direct){
  const pas=(n,s1,s2)=>n>0?s1+' de '+n:s2+' de '+(-n);
  const texte=direct?'Va au point '+coord(x,y)+' avec les flèches, puis clique sur Vérifier.'
    :pas(x,'Avance','Recule')+(x>0?' vers la droite':' vers la gauche')+', puis '+pas(y,'monte','descends')+'. Utilise les flèches, puis clique sur Vérifier.';
  return Object.assign({type:'plan',mode:'deplacer',min:0,max:6,cible:[x,y],texte,aide:'Avance ou recule d’abord sur l’axe rouge, puis monte ou descends.'},o)}
const mystere=(pts,forme,o)=>pts.map((p,k)=>Object.assign({type:'plan',mode:'mystere',min:0,max:8,pts,k,forme,cible:p,aide:AIDE_PLACER},o));
function rectangle(r,o){const n=o.min<0;for(;;){const x1=int(r,o.min,o.max-3),y1=int(r,o.min,o.max-3),x2=int(r,x1+3,o.max),y2=int(r,y1+2,o.max);
  if(n&&!(x1<0&&y1<0||x1<0&&y2<0||x2>0&&y1<0))continue;
  const c=[[x1,y1],[x2,y1],[x2,y2],[x1,y2]],k=int(r,0,3),m=[0,1,2,3].filter(j=>j!==k);
  return Object.assign({type:'plan',mode:'placer',cible:c[k],donnes:m.map((j,t)=>['ABC'[t],c[j][0],c[j][1]]),
    texte:'A, B et C sont trois coins d’un rectangle. Clique sur le quatrième coin D, puis sur Vérifier.',aide:'Le coin D est sur la même ligne qu’un coin et sur la même colonne qu’un autre.'},o)}}
const DECOR_ILE=['🌴','⛰️','🏠','🌳','⛵','🐢'];
function carte(r,o,mode){const pris=new Set();const lib=()=>{for(;;){const x=int(r,o.min,o.max),y=int(r,o.min,o.max),k=x+','+y;if(x&&y&&!pris.has(k)){pris.add(k);return[x,y]}}};
  const deco=[0,1,2].map(k=>[...lib(),DECOR_ILE[(k+int(r,0,5))%6]]);
  if(mode==='lire'){const [x,y]=lib(),objet=pick(r,[['⛵','le bateau'],['🐢','la tortue'],['🏠','la cabane']]);
    return Object.assign({type:'plan',mode:'lire',pt:[x,y],emoji:objet[0],deco:deco.filter(d=>d[2]!==objet[0]),texte:'Sur la carte de l’île, quelle est la position de '+objet[1]+' ?',aide:AIDE_LIRE},o,choixPoint(r,x,y,o.min<0?[[y,x],[-x,y]]:[[y,x]]))}
  const [x,y]=lib();return Object.assign({type:'plan',mode:'placer',cible:[x,y],deco,tresor:true,texte:'Le trésor est caché en '+coord(x,y)+'. Clique sur sa cachette, puis sur Vérifier.',aide:AIDE_PLACER},o)}
const MAISON=[[1,1],[7,1],[7,4],[4,7],[1,4]],DIAMANT=[[2,6],[6,6],[8,4],[4,0],[0,4]];
const MAISON_N=[[-4,-4],[4,-4],[4,1],[0,5],[-4,1]],CRAYON=[[-5,2],[2,2],[5,0],[2,-2],[-5,-2]];
const QUART=[['En haut à gauche',-1,1],['En haut à droite',1,1],['En bas à gauche',-1,-1],['En bas à droite',1,-1]];
const PLEIN={min:-5,max:5};
const trajets={id:'trajets',titre:'Lire des positions sur un plan',icone:'(x, y)',couleur:'#08665d',
 consigne:'Repère-toi sur le plan.',
 niveaux:[
 {titre:'La grille',description:'Une lettre en bas, un chiffre sur le côté (comme C2).',
  questions:()=>make(1101,(r,i)=>{let c,l;do{c=int(r,0,4);l=int(r,0,4)}while(c===l);
    if(i%2===0)return{type:'plan',mode:'case',cible:[c,l],reponse:LETTRES[c]+(l+1),texte:'Clique sur la case '+LETTRES[c]+(l+1)+', puis sur Vérifier.',aide:'Trouve d’abord la lettre en bas, puis monte jusqu’au chiffre.'};
    const e=pick(r,['⭐','❤️','🐱','🍎','⚽']),bon=LETTRES[c]+(l+1),inv=LETTRES[l]+(c+1),aut=LETTRES[c]+(((l+2)%5)+1);
    const ch=[bon,inv,aut].map(s=>[r(),s]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
    return{type:'plan',mode:'caseLire',cible:[c,l],emoji:e,choix:ch,reponse:ch.indexOf(bon),texte:'Dans quelle case est le dessin ?',aide:'Lis d’abord la lettre en bas, puis le chiffre sur le côté.'}})},
 {titre:'Se déplacer',description:'Partir de (0, 0) : avancer vers la droite, puis monter.',
  questions:()=>make(1102,(r,i)=>deplacer(int(r,1,5),int(r,1,5),{},i>=6))},
 {titre:'Lire un point',description:'Plan de 0 à 6 : trouver la position d’un point.',
  questions:()=>make(1103,r=>{let x,y;do{x=int(r,1,6);y=int(r,1,6)}while(x===y);return lire(r,x,y,{},[[y,x]])})},
 {titre:'Placer un point',description:'Plan de 0 à 6 : cliquer à la bonne position.',
  questions:()=>make(1104,r=>placer(int(r,1,6),int(r,1,6)))},
 {titre:'Sur les axes',description:'Les points avec un 0, posés sur un axe.',
  questions:()=>make(1105,(r,i)=>{const v=int(r,1,6),surX=r()<.5,x=surX?v:0,y=surX?0:v;
    const aide=surX?'0 pas vers le haut : le point reste sur l’axe rouge.':'0 pas vers la droite : le point reste sur l’axe bleu.';
    return i%2?lire(r,x,y,{},[[y,x],[v,v]],aide):placer(x,y,{},aide)})},
 {titre:'Dessin mystère',description:'Placer les points dans l’ordre : un dessin apparaît.',
  questions:()=>mystere(MAISON,'une maison').concat(mystere(DIAMANT,'un diamant'))},
 {titre:'Plan de 0 à 10',description:'Grande grille, nombres écrits de 2 en 2.',
  questions:()=>make(1107,(r,i)=>{let x,y;do{x=int(r,1,10);y=int(r,1,10)}while(x===y||x%2+y%2===0);const o={max:10,pas:2},aide='Les nombres sont écrits de 2 en 2 : compte les lignes entre deux nombres.';
    return i%2?lire(r,x,y,o,[[y,x]],aide):placer(x,y,o,aide)})},
 {titre:'Chasse au trésor',description:'Coin d’un rectangle et carte de l’île.',
  questions:()=>{const r=rng(1108),o={min:0,max:8};return[rectangle(r,o),carte(r,o,'lire'),carte(r,o,'placer'),rectangle(r,o),carte(r,o,'lire'),carte(r,o,'placer'),rectangle(r,o),carte(r,o,'lire'),carte(r,o,'placer'),rectangle(r,o)]}},
 {titre:'Les quatre parties',description:'Plan de −5 à 5 : où est le point ?',
  questions:()=>make(1109,(r,i)=>{const q=QUART[(i+int(r,0,3))%4],x=q[1]*int(r,1,5),y=q[2]*int(r,1,5);
    return{type:'plan',mode:'partie',...PLEIN,pt:[x,y],choix:QUART.map(t=>t[0]),reponse:QUART.indexOf(q),texte:'Dans quelle partie du plan est le point P ?',aide:'Regarde d’abord à gauche ou à droite de l’axe bleu, puis en haut ou en bas de l’axe rouge.'}})},
 {titre:'Se déplacer partout',description:'Partir du centre : à gauche et en bas, c’est négatif.',
  questions:()=>make(1110,(r,i)=>{let x,y;do{x=nz(r,-5,5);y=nz(r,-5,5)}while(x>0&&y>0);return deplacer(x,y,PLEIN,i>=6)})},
 {titre:'Lire un point négatif',description:'Plan de −5 à 5 : lire les deux nombres et leur signe.',
  questions:()=>make(1111,r=>{let x,y;do{x=nz(r,-5,5);y=nz(r,-5,5)}while(Math.abs(x)===Math.abs(y)||(x>0&&y>0));return lire(r,x,y,PLEIN,[[Math.abs(x),Math.abs(y)],[y,x]],AIDE_NEG)})},
 {titre:'Placer un point négatif',description:'Plan de −5 à 5 : cliquer à la bonne position.',
  questions:()=>make(1112,r=>{let x,y;do{x=int(r,-5,5);y=int(r,-5,5)}while((x>=0&&y>=0)||(!x&&!y));return placer(x,y,PLEIN,AIDE_NEG)})},
 {titre:'Dessin mystère négatif',description:'Un dessin qui traverse les quatre parties du plan.',
  questions:()=>mystere(MAISON_N,'une maison',PLEIN).concat(mystere(CRAYON,'un crayon',PLEIN))},
 {titre:'Trésor sur le plan complet',description:'Rectangles et carte au trésor de −5 à 5.',
  questions:()=>{const r=rng(1114),o=PLEIN;return[rectangle(r,o),carte(r,o,'lire'),carte(r,o,'placer'),rectangle(r,o),carte(r,o,'lire'),carte(r,o,'placer'),rectangle(r,o),carte(r,o,'lire'),carte(r,o,'placer'),rectangle(r,o)]}}
 ]};

/* ===================== DRAWING ON A PLANE =====================
   Type "dessin" in moteur.js: a shape is drawn on the plane, the student reads the
   position of each vertex (horizontal steps = x, vertical steps = y) and completes the table.
   Animated demo of point A in exercises 1 and 2 of each level (button afterwards). */
const FORMES={
 segment:[['un segment',[[0,0],[3,2]]],['un segment',[[0,3],[4,0]]],['un segment',[[0,0],[5,1]]],['un segment',[[1,0],[0,4]]]],
 triangle:[['un triangle',[[0,0],[4,0],[2,3]]],['un triangle',[[0,0],[3,0],[0,4]]],['un triangle',[[0,0],[4,1],[1,4]]],['un triangle',[[1,0],[5,2],[0,3]]]],
 quadri:[['un carré',[[0,0],[3,0],[3,3],[0,3]]],['un rectangle',[[0,0],[5,0],[5,2],[0,2]]],['un rectangle',[[0,0],[4,0],[4,3],[0,3]]],['un losange',[[2,0],[4,2],[2,4],[0,2]]],['un parallélogramme',[[0,0],[4,0],[5,3],[1,3]]]],
 cinq:[['une maison',[[0,0],[4,0],[4,3],[2,5],[0,3]]],['un pentagone',[[1,0],[3,0],[4,2],[2,4],[0,2]]],['un panneau',[[0,0],[3,0],[5,2],[3,4],[0,4]]]],
 avances:[['la lettre L',[[0,0],[3,0],[3,1],[1,1],[1,4],[0,4]]],['une flèche',[[0,1],[3,1],[3,0],[5,2],[3,4],[3,3],[0,3]]],['un hexagone',[[1,0],[3,0],[4,2],[3,4],[1,4],[0,2]]]],
 grands:[['un sapin',[[3,0],[5,0],[5,2],[8,2],[4,8],[0,2],[3,2]]],['une fusée',[[2,0],[6,0],[6,6],[4,9],[2,6]]],['une maison',[[0,0],[6,0],[6,5],[3,8],[0,5]]],['un bateau',[[0,3],[9,3],[7,0],[2,0]]]],
 centre:[['un carré',[[-2,-2],[2,-2],[2,2],[-2,2]]],['un losange',[[0,3],[3,0],[0,-3],[-3,0]]],['un triangle',[[-3,-2],[3,-2],[0,3]]],['un rectangle',[[-4,-1],[3,-1],[3,2],[-4,2]]]],
 centreAvance:[['une maison',[[-3,-3],[3,-3],[3,1],[0,4],[-3,1]]],['une flèche',[[-4,-1],[1,-1],[1,-3],[4,0],[1,3],[1,1],[-4,1]]],['un hexagone',[[-2,-3],[2,-3],[4,0],[2,3],[-2,3],[-4,0]]]]
};
/* Places the shape on the plane graded from −max to +max, to go in all 4 directions.
   "partie" mode: the whole shape in one part of the plane (the exercise's part, in turn);
   "axe" mode: one side of the shape touches an axis; "libre" mode: anywhere (it can cross the axes). */
const QUADRANTS=[[1,1],[-1,1],[-1,-1],[1,-1]];
function placerForme(r,pts,o,mode,i){
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),w=Math.max(...xs)-Math.min(...xs),h=Math.max(...ys)-Math.min(...ys);
  if(mode==='centre'){const dx=int(r,Math.max(-1,o.min-Math.min(...xs)),Math.min(1,o.max-Math.max(...xs))),dy=int(r,Math.max(-1,o.min-Math.min(...ys)),Math.min(1,o.max-Math.max(...ys)));return pts.map(([x,y])=>[x+dx,y+dy])}
  const base=pts.map(([x,y])=>[x-Math.min(...xs),y-Math.min(...ys)]);
  if(mode==='libre'){const dx=int(r,o.min,o.max-w),dy=int(r,o.min,o.max-h);return base.map(([x,y])=>[x+dx,y+dy])}
  const [sx,sy]=QUADRANTS[i%4],bas=mode==='axe'?0:1;
  let dx=int(r,bas,o.max-w),dy=int(r,bas,o.max-h);
  if(mode==='axe'){if(r()<.5)dx=0;else dy=0}
  return base.map(([x,y])=>[sx*(x+dx),sy*(y+dy)])}
function dessinQ(r,famille,o,i,mode,extra){const [nom,forme]=pick(r,FORMES[famille]);const pts=placerForme(r,forme,o,mode,i);
  return Object.assign({type:'dessin',...o,forme:nom,pts,demo:i<2,texte:'Voici '+nom+'. Lis la position de chaque point et complète la table de valeurs.',
    aide:'Pour chaque point : compte d’abord les pas horizontaux depuis 0 (x : à droite +, à gauche −), puis les pas verticaux (y : en haut +, en bas −).'},extra)}
const P6={min:-6,max:6},P10={min:-10,max:10,pas:2};
const dessins={id:'dessins',titre:'Dessiner sur un plan',icone:'(x, y)',couleur:'#08665d',
 video:'videos/Plan-cartesien-le-signe.mp4',
 consigne:'Lis la position des points du dessin.',
 niveaux:[
 {titre:'Découvrir le plan',description:'Pas horizontaux = x, pas verticaux = y, dans les 4 sens. Un point à la fois.',intro:'plan',
  questions:()=>make(1301,(r,i)=>{const [sx,sy]=i<3?[1,1]:QUADRANTS[(i-2)%4];let x,y;do{x=int(r,1,5);y=int(r,1,5)}while(x===y);
    return{type:'dessin',min:-6,max:6,forme:'un point',pts:[[sx*x,sy*y]],noms:['P'],demo:false,texte:'Combien de pas horizontaux (x) et de pas verticaux (y) faut-il pour aller de 0 au point P ? Écris-les dans la table.',
      aide:'Horizontal : à droite, x est positif ; à gauche, x est négatif (−). Vertical : en haut, y est positif ; en bas, y est négatif (−).'}})},
 {titre:'Un segment',description:'Deux points, dans une des quatre parties du plan.',questions:()=>make(1302,(r,i)=>dessinQ(r,'segment',P6,i,'partie'))},
 {titre:'Un triangle',description:'Trois points, dans une des quatre parties du plan.',questions:()=>make(1303,(r,i)=>dessinQ(r,'triangle',P6,i,'partie'))},
 {titre:'Carrés et rectangles',description:'Quatre points, dans une des quatre parties du plan.',questions:()=>make(1304,(r,i)=>dessinQ(r,'quadri',P6,i,'partie'))},
 {titre:'Des points sur les axes',description:'Quand un point touche un axe, x ou y vaut 0.',lecon:['Si un point est posé sur l’axe rouge, il n’a fait aucun pas vertical : y = 0.','Si un point est posé sur l’axe bleu, il n’a fait aucun pas horizontal : x = 0.'],
  questions:()=>make(1305,(r,i)=>dessinQ(r,pick(r,['triangle','quadri']),P6,i,'axe'))},
 {titre:'Cinq points',description:'Maison, pentagone, panneau, n’importe où sur le plan.',questions:()=>make(1306,(r,i)=>dessinQ(r,'cinq',P6,i,'libre'))},
 {titre:'Formes avancées',description:'La lettre L, une flèche, un hexagone (6 ou 7 points).',questions:()=>make(1307,(r,i)=>dessinQ(r,'avances',P6,i,'libre'))},
 {titre:'Grand plan de −10 à 10',description:'Nombres écrits de 2 en 2 : compte bien les pas.',lecon:['Sur ce grand plan, les nombres sont écrits seulement de 2 en 2, d’un côté comme de l’autre.','Pour un nombre impair, compte les lignes : entre 2 et 4, il y a 3 ; entre −2 et −4, il y a −3.'],
  questions:()=>make(1308,(r,i)=>dessinQ(r,'grands',P10,i,i%3===2?'libre':'partie'))},
 {titre:'Autour de 0',description:'Des formes qui traversent les quatre parties du plan.',lecon:['Une même forme peut avoir des points dans les quatre parties du plan.','Regarde bien le signe de chaque nombre : à gauche ou en bas, il est négatif (−).'],
  questions:()=>make(1309,(r,i)=>dessinQ(r,'centre',P6,i,'centre'))},
 {titre:'Formes avancées autour de 0',description:'Maison, flèche, hexagone autour de 0.',
  questions:()=>make(1310,(r,i)=>dessinQ(r,'centreAvance',P6,i,'centre'))}
 ]};

/* ===================== DRAWING A LINE WITH A TABLE OF VALUES =====================
   Type "droite" in moteur.js. Each level has a short explanation ("lecon"),
   opened on the first exercise. Rules y = a·x + b with whole numbers. */
const regle=(a,b)=>'y = '+(a===1?'':a)+'x'+(b>0?' + '+b:b<0?' − '+(-b):'');
const regleOrale=(a,b)=>'y égale '+(a===1?'':a+' ')+'x'+(b>0?' plus '+b:b<0?' moins '+(-b):'');
const valeurY=(a,b,x)=>a*x+b;
const tableDe=(a,b,xs)=>({a,b,regle:regle(a,b),regleOrale:regleOrale(a,b),xs,ys:xs.map(x=>valeurY(a,b,x))});
const D1={min:0,max:10},DN={min:-6,max:6};
/* Chooses a rule whose y values all stay on the plane. */
function regleAuHasard(r,o,as,bs,xs){for(;;){const a=pick(r,as),b=pick(r,bs);if(xs.every(x=>{const y=a*x+b;return y>=o.min&&y<=o.max}))return[a,b]}}
const trois=(r,choix)=>{const l=choix.slice();const out=[];while(out.length<3){const k=int(r,0,l.length-1);out.push(l.splice(k,1)[0])}return out.sort((p,q)=>p-q)};
const droites={id:'droites',titre:'La droite · niveau avancé',icone:'y = ax + b',couleur:'#12525c',
 consigne:'Utilise la table de valeurs.',
 niveaux:[
 {titre:'Lire une table de valeurs',description:'Chaque colonne relie une valeur de x à une valeur de y.',
  lecon:['Une table de valeurs a deux lignes : en haut les valeurs de x, en bas les valeurs de y.','Chaque colonne va ensemble. Si la colonne montre x = 2 et y = 5, alors quand x vaut 2, y vaut 5.'],
  questions:()=>make(1201,(r,i)=>{const [a,b]=pick(r,[[1,int(r,1,4)],[int(r,2,3),0],[2,1]]);const t=tableDe(a,b,[0,1,2,3,4]);const k=int(r,0,4);
    return i%3===2?{type:'droite',mode:'tableLire',table:t,cherche:'x',k,reponse:t.xs[k],texte:'Dans la table, quand y = '+neg(t.ys[k])+', combien vaut x ?',aide:'Trouve '+neg(t.ys[k])+' dans la ligne du bas (y), puis regarde le nombre juste au-dessus.'}
      :{type:'droite',mode:'tableLire',table:t,cherche:'y',k,reponse:t.ys[k],texte:'Dans la table, quand x = '+t.xs[k]+', combien vaut y ?',aide:'Trouve '+t.xs[k]+' dans la ligne du haut (x), puis descends dans la même colonne.'}})},
 {titre:'Compléter : y = x + b',description:'Remplacer x par un nombre, puis additionner.',
  lecon:['La règle dit comment trouver y à partir de x.','Pour y = x + 3, on remplace x par le nombre de la colonne. Exemple : x = 2, alors y = 2 + 3 = 5.'],
  questions:()=>make(1202,(r,i)=>{const t=tableDe(1,int(r,1,6),[0,1,2,3,4]);return{type:'droite',mode:'completer',table:t,trous:i<5?[int(r,1,4)]:trois(r,[0,1,2,3,4]).slice(0,2),aide:'Ajoute '+t.b+' au nombre de x.'}})},
 {titre:'Compléter : y = ax',description:'Multiplier x par un nombre.',
  lecon:['y = 2x veut dire y = 2 × x.','Exemple : pour x = 4, y = 2 × 4 = 8. Pour x = 0, y = 0.'],
  questions:()=>make(1203,(r,i)=>{const t=tableDe(int(r,2,5),0,[0,1,2,3,4]);return{type:'droite',mode:'completer',table:t,trous:i<5?[int(r,1,4)]:trois(r,[1,2,3,4]).slice(0,2),aide:'Multiplie le nombre de x par '+t.a+'.'}})},
 {titre:'Compléter : y = ax + b',description:'Deux étapes : multiplier, puis additionner.',
  lecon:['La règle y = 2x + 1 se calcule en deux étapes.','1. Multiplier : 2 × x.  2. Additionner : + 1.','Exemple : pour x = 3, 2 × 3 = 6, puis 6 + 1 = 7. Donc y = 7.'],
  questions:()=>make(1204,(r,i)=>{const t=tableDe(int(r,2,3),int(r,1,4),[0,1,2,3,4]);return{type:'droite',mode:'completer',table:t,trous:i<4?[int(r,1,4)]:trois(r,[0,1,2,3,4]).slice(0,i<7?2:3),aide:'Calcule d’abord '+t.a+' × x, puis ajoute '+t.b+'.'}})},
 {titre:'De la colonne au point',description:'Une colonne de la table devient un point (x, y).',
  lecon:['Chaque colonne de la table devient un point du plan.','La colonne x = 2, y = 5 devient le point (2, 5) : 2 vers la droite, puis 5 vers le haut.'],
  questions:()=>make(1205,r=>{const xs=[0,1,2,3,4];const [a,b]=regleAuHasard(r,D1,[1,2],[0,1,2,3,4,5],xs);const t=tableDe(a,b,xs),k=int(r,0,4);
    return{type:'droite',mode:'pointTable',...D1,table:t,k,cibles:[[t.xs[k],t.ys[k]]],texte:'Place le point qui correspond à la colonne colorée, puis clique sur Vérifier.',aide:'Le nombre du haut (x) se lit sur l’axe rouge, le nombre du bas (y) sur l’axe bleu.'}})},
 {titre:'Placer tous les points',description:'Les points de la table sont alignés : la droite apparaît.',
  lecon:['Place un point pour chaque colonne de la table.','Si les points sont bien placés, ils sont alignés : on peut tracer une droite qui passe par tous les points.'],
  questions:()=>make(1206,r=>{const xs=trois(r,[0,1,2,3,4,5]);const [a,b]=regleAuHasard(r,D1,[1,2,3],[0,1,2,3,4],xs);const t=tableDe(a,b,xs);
    return{type:'droite',mode:'placerTous',...D1,table:t,cibles:t.xs.map((x,k)=>[x,t.ys[k]]),texte:'Place les 3 points de la table sur le plan, puis clique sur Vérifier.',aide:'Une colonne = un point. Clique encore sur un point pour l’enlever.'}})},
 {titre:'Compléter et tracer',description:'Calculer les y, puis placer les points.',
  lecon:['Pour tracer une droite avec une règle :','1. Compléter la table de valeurs avec la règle.','2. Placer chaque point (x, y) sur le plan.','3. Les points alignés forment la droite.'],
  questions:()=>make(1207,r=>{const xs=trois(r,[0,1,2,3,4]);const [a,b]=regleAuHasard(r,D1,[1,2,3],[0,1,2,3,4],xs);const t=tableDe(a,b,xs);
    return{type:'droite',mode:'completerTracer',...D1,table:t,trous:[0,1,2],cibles:t.xs.map((x,k)=>[x,t.ys[k]]),texte:'Complète la table avec la règle '+t.regle+', place les 3 points, puis clique sur Vérifier.',aide:'Calcule chaque y avec la règle, puis place un point pour chaque colonne.'}})},
 {titre:'Lire une droite',description:'Trouver y sur la droite pour une valeur de x.',
  lecon:['La droite passe par beaucoup de points.','Pour trouver y quand x = 4 : pars de 4 sur l’axe rouge, monte jusqu’à la droite, puis lis le nombre sur l’axe bleu.'],
  questions:()=>make(1208,r=>{const [a,b]=regleAuHasard(r,D1,[1,2],[0,1,2,3,4],[0,4]);const xmax=Math.floor((10-b)/a),x=int(r,1,Math.min(5,xmax));const t=tableDe(a,b,[]);
    return{type:'droite',mode:'lireDroite',...D1,table:t,x,reponse:valeurY(a,b,x),texte:'Sur la droite, quand x = '+x+', combien vaut y ?',aide:'Pars de '+x+' sur l’axe rouge, monte jusqu’à la droite, puis regarde l’axe bleu.'}})},
 {titre:'Trouver la règle',description:'Quelle règle marche pour toute la table ?',
  lecon:['Pour trouver la règle, essaie-la sur chaque colonne.','La bonne règle donne le bon y pour toutes les colonnes, pas seulement pour une.'],
  questions:()=>make(1209,r=>{const a=int(r,1,3),b=int(r,a===1?1:0,4);const t=tableDe(a,b,[0,1,2,3]);
    /* Trap: a rule that only works for the x = 1 column. */
    const p1=[a+b,0],p2=a===1?[2,b-1]:[a,b+1];const ch=[[a,b],p1,p2].filter((p,k,l)=>l.findIndex(o=>o[0]===p[0]&&o[1]===p[1])===k);
    while(ch.length<3)ch.push([a+ch.length,b]);const m=ch.map(p=>[r(),p]).sort((u,v)=>u[0]-v[0]).map(u=>u[1]);
    return{type:'droite',mode:'regle',table:t,choix:m.map(p=>regle(p[0],p[1])),reponse:m.findIndex(p=>p[0]===a&&p[1]===b),texte:'Quelle règle donne cette table de valeurs ?',aide:'Essaie chaque règle avec x = 0, puis avec x = 2.'}})},
 {titre:'Avec des nombres négatifs',description:'Plan de −6 à 6 : x et y peuvent être négatifs.',
  lecon:['x peut être un nombre négatif.','Exemple avec y = 2x + 1 et x = −2 : 2 × (−2) = −4, puis −4 + 1 = −3. Le point est (−2, −3).','Un nombre négatif de x va vers la gauche, un nombre négatif de y va vers le bas.'],
  questions:()=>make(1210,(r,i)=>{const xs=[int(r,-3,-1),int(r,0,1),int(r,2,3)];const [a,b]=regleAuHasard(r,DN,[1,2],[-3,-2,-1,1,2,3],xs);const t=tableDe(a,b,xs),c=t.xs.map((x,k)=>[x,t.ys[k]]);
    if(i<4)return{type:'droite',mode:'completer',table:t,trous:i%2?[0,2]:[0,1],aide:'Avec x négatif : '+t.a+' × un nombre négatif donne un nombre négatif.'};
    if(i<7)return{type:'droite',mode:'placerTous',...DN,table:t,cibles:c,texte:'Place les 3 points de la table sur le plan, puis clique sur Vérifier.',aide:'Un x négatif va vers la gauche, un y négatif va vers le bas.'};
    return{type:'droite',mode:'completerTracer',...DN,table:t,trous:[0,1,2],cibles:c,texte:'Complète la table avec la règle '+t.regle+', place les 3 points, puis clique sur Vérifier.',aide:'Calcule chaque y avec la règle. Attention aux signes.'}})}
 ]};

/* ===================== CHALLENGES: RIDDLES AND LOGIC CHALLENGES =====================
   Activities of the Challenges page (categorie:'defis'), medium level.
   Engine types: "quiz" (choice + explanation), "memo" (pairs), "simon" (colour sequence). */
const melange=(r,l)=>l.map(x=>[r(),x]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
/* Choice question: the right answer is l[0] before shuffling. */
function quizQ(r,base,l,expl){const ch=melange(r,l);return Object.assign({type:'quiz',choix:ch,reponse:ch.indexOf(l[0]),expl},base)}
const devin=(r,indices,l,expl)=>quizQ(r,{titre:'Qui suis-je ?',indices,aide:'Relis chaque indice : la bonne réponse les respecte tous.'},l,expl);
const fixe=(seed,liste)=>()=>{const r=rng(seed);return liste.map(f=>f(r))};
/* Number riddles: 4 choices in a range, only one has the property. */
const PROP=[[n=>n%2===0,'Je suis pair.'],[n=>n%2===1,'Je suis impair.'],[n=>n%3===0,'Je suis un multiple de 3.'],[n=>n%5===0,'Je suis un multiple de 5.'],[n=>n%4===0,'Je suis un multiple de 4.']];
const sommeCh=n=>String(n).split('').reduce((s,c)=>s+Number(c),0);
function devinNombre(r,min,max,deux){for(;;){const a=int(r,min,max-6),choix=[];while(choix.length<4){const v=int(r,a,a+6);if(!choix.includes(v))choix.push(v)}
  const n=choix[0],props=PROP.filter(p=>p[0](n)).map(p=>[p[0],p[1]]);props.push([v=>sommeCh(v)===sommeCh(n),'La somme de mes chiffres est '+sommeCh(n)+'.']);
  const lo=Math.min(...choix),hi=Math.max(...choix),ind=['Je suis entre '+(lo-1)+' et '+(hi+1)+'.'];
  const bonnes=deux?props.flatMap((p,i)=>props.slice(i+1).map(q=>[p,q])):props.map(p=>[p]);
  const ok=bonnes.filter(ps=>choix.filter(v=>ps.every(p=>p[0](v))).length===1);
  if(!ok.length||n<10&&min>=10)continue;const ps=pick(r,ok);return devin(r,ind.concat(ps.map(p=>p[1])),choix.map(String),n+' respecte tous les indices.')}}
const OBJETS=[
 [['J’ai des aiguilles, mais je ne couds pas.','Je ne parle pas, mais je te dis l’heure.'],['🕰️ Une horloge','🧵 Un fil','🌲 Un sapin','📌 Une punaise'],'Les aiguilles de l’horloge montrent l’heure.'],
 [['J’ai des dents, mais je ne mange pas.','Je sers à démêler les cheveux.'],['Un peigne','Une scie','Une fourchette','Une brosse à dents'],'Le peigne a des dents pour les cheveux.'],
 [['J’ai un lit, mais je ne dors jamais.','Je coule, mais je ne tombe pas.'],['🏞️ Une rivière','⛰️ Une montagne','🛣️ Une route','🌧️ La pluie'],'Le lit d’une rivière, c’est le fond où l’eau coule.'],
 [['J’ai des touches, mais je n’ouvre aucune porte.','On m’utilise pour écrire à l’ordinateur.'],['⌨️ Un clavier','🔑 Une clé','🔒 Un cadenas','📱 Un téléphone'],'Les touches du clavier servent à écrire.'],
 [['Je monte et je descends…','… mais je ne bouge jamais.'],['Un escalier','Un ascenseur','Une balançoire','Un ballon'],'On monte et on descend l’escalier, mais lui ne bouge pas.'],
 [['Plus je sèche…','… plus je deviens mouillée.'],['Une serviette','Un parapluie','Un savon','Un manteau'],'La serviette sèche ton corps et devient mouillée.'],
 [['J’ai un cou, mais pas de tête.','J’ai deux bras, mais pas de mains.'],['👕 Une chemise','👖 Un pantalon','🧢 Une casquette','🧦 Une chaussette'],'La chemise a un col (un cou) et deux manches (des bras).'],
 [['On doit me casser avant de m’utiliser.','Je viens souvent d’une poule.'],['🥚 Un œuf','🥛 Un verre','🍽️ Une assiette','🎈 Un ballon'],'On casse l’œuf avant de le cuisiner.'],
 [['J’ai des pages, mais je ne suis pas un livre.','Je sers à compter les jours et les mois.'],['📅 Un calendrier','📰 Un journal','📓 Un cahier','🕰️ Une horloge'],'Le calendrier montre les jours et les mois.'],
 [['Je suis pleine de trous…','… mais je garde l’eau.'],['🧽 Une éponge','🪣 Un seau','🍶 Une bouteille','Une passoire'],'L’éponge garde l’eau dans ses petits trous.']];
const NATURE=[
 [['Je suis un mammifère.','Je vis dans l’océan.','Je respire par un trou sur ma tête.'],['🐋 Une baleine','🦈 Un requin','🐙 Une pieuvre','🐠 Un poisson'],'La baleine est un mammifère : elle respire de l’air.'],
 [['Je suis un reptile.','Je change de couleur pour me cacher.'],['🦎 Un caméléon','🐍 Un serpent','🐢 Une tortue','🐊 Un crocodile'],'Le caméléon change de couleur.'],
 [['Je suis un insecte.','Avant, j’étais une chenille.'],['🦋 Un papillon','🐝 Une abeille','🐞 Une coccinelle','🐜 Une fourmi'],'La chenille devient un papillon.'],
 [['Je dors presque tout l’hiver.','Je suis grand et brun.','J’aime le miel et le poisson.'],['🐻 Un ours','🦊 Un renard','🐺 Un loup','🦌 Un cerf'],'L’ours hiberne pendant l’hiver.'],
 [['Je construis des barrages sur les rivières.','Je suis sur la pièce de 5 cents.'],['🦫 Un castor','🦦 Une loutre','🦝 Un raton laveur','🐿️ Un écureuil'],'Le castor est un symbole du Canada.'],
 [['Je tombe du ciel en hiver.','Je suis blanche et froide.','Chacun de mes flocons est différent.'],['❄️ La neige','🌧️ La pluie','🌫️ Le brouillard','🧊 La glace'],'La neige tombe en flocons.'],
 [['Je suis une étoile.','Je donne la lumière et la chaleur à la Terre.'],['☀️ Le Soleil','🌙 La Lune','🪐 Saturne','⭐ L’étoile polaire'],'Le Soleil est l’étoile la plus proche de nous.'],
 [['Je suis un arbre.','Ma feuille est sur le drapeau du Canada.'],['🍁 L’érable','🌳 Le chêne','🌲 Le sapin','Le bouleau'],'La feuille d’érable est sur le drapeau.'],
 [['Je suis un oiseau, mais je ne vole pas.','Je nage très bien.','Je vis près du pôle Sud.'],['🐧 Le manchot','🦅 L’aigle','🦉 Le hibou','🦆 Le canard'],'Le manchot nage, mais ne vole pas.'],
 [['J’ai huit pattes.','Je tisse une toile pour attraper les insectes.'],['🕷️ L’araignée','🐜 La fourmi','🐝 L’abeille','🪲 Le scarabée'],'L’araignée a 8 pattes ; les insectes en ont 6.']];
const MONDE=[
 [['Je suis la capitale du Canada.','La rivière des Outaouais passe près de moi.'],['Ottawa','Toronto','Montréal','Québec'],'Ottawa est la capitale du Canada.'],
 [['Je suis la plus grande province du Canada.','On y parle surtout français.'],['Le Québec','L’Ontario','La Colombie-Britannique','L’Alberta'],'Le Québec est la plus grande province.'],
 [['Je suis un océan.','Je suis à l’ouest du Canada.'],['🌊 Le Pacifique','L’Atlantique','L’Arctique','L’océan Indien'],'La Colombie-Britannique touche l’océan Pacifique.'],
 [['Je suis le plus grand pays du monde.','Le Canada est juste après moi.'],['La Russie','La Chine','Les États-Unis','Le Brésil'],'La Russie est le plus grand pays ; le Canada est le 2e.'],
 [['Je suis la ville la plus peuplée du Canada.','J’ai la tour CN.'],['Toronto','Vancouver','Ottawa','Montréal'],'La tour CN est à Toronto.'],
 [['Je suis un continent.','Le Canada, les États-Unis et le Mexique sont sur moi.'],['L’Amérique du Nord','L’Europe','L’Asie','L’Amérique du Sud'],'Le Canada est en Amérique du Nord.'],
 [['Je suis une planète.','Je suis la plus proche du Soleil.'],['Mercure','Vénus','Mars','La Terre'],'Mercure est la première planète.'],
 [['Je suis un pays.','Je suis le voisin du Canada, au sud.'],['Les États-Unis','Le Mexique','La France','Le Groenland'],'Les États-Unis sont au sud du Canada.'],
 [['Je suis une langue.','Je suis la langue la plus parlée au Brésil.'],['Le portugais','L’espagnol','Le français','L’anglais'],'Au Brésil, on parle portugais.'],
 [['Je suis un pays d’Europe.','La tour Eiffel est chez moi.'],['La France','L’Italie','L’Espagne','La Belgique'],'La tour Eiffel est à Paris, en France.']];
const devinListe=(seed,liste)=>fixe(seed,liste.map(([i,c,e])=>r=>devin(r,i,c,e)));

/* ---------- Logic challenges ---------- */
const INTRUS_L=[
 [['🥕 Carotte','🍎 Pomme','🍌 Banane','🍇 Raisin'],'La carotte est un légume ; les autres sont des fruits.'],
 [['7','2','4','8','10'],'7 est impair ; les autres sont pairs.'],
 [['25','10','20','30','40'],'25 n’est pas un multiple de 10.'],
 [['Triangle','Carré','Rectangle','Losange'],'Le triangle a 3 côtés ; les autres en ont 4.'],
 [['🐔 Poule','🐶 Chien','🐱 Chat','🐰 Lapin'],'La poule a 2 pattes ; les autres en ont 4.'],
 [['Juillet','Lundi','Mardi','Jeudi'],'Juillet est un mois ; les autres sont des jours.'],
 [['🚲 Vélo','🚗 Auto','🚌 Autobus','🚚 Camion'],'Le vélo n’a pas de moteur.'],
 [['15','4','8','12','16'],'15 n’est pas un multiple de 4.'],
 [['Carré','Rouge','Bleu','Jaune'],'Carré est une forme ; les autres sont des couleurs.'],
 [['🍕 Pizza','🥛 Lait','🧃 Jus','💧 Eau'],'La pizza se mange ; les autres se boivent.']];
const intrusNiv=()=>{const r=rng(1401);return INTRUS_L.map(([l,e])=>quizQ(r,{titre:'Trouve l’intrus : celui qui ne suit pas la règle des autres.',aide:'Cherche ce que les autres ont en commun.'},l,e))};
function suiteQ(r,i){const t=i%5;let s,rep,e,faux;
  if(t===0){const a=int(r,1,20),k=int(r,2,9);s=[0,1,2,3].map(j=>a+j*k);rep=a+4*k;e='On ajoute '+k+' chaque fois.';faux=[rep+1,rep-k+1]}
  else if(t===1){const k=int(r,2,7),a=k*int(r,6,9);s=[0,1,2,3].map(j=>a-j*k);rep=a-4*k;e='On enlève '+k+' chaque fois.';faux=[rep+k,rep-1]}
  else if(t===2){const k=pick(r,[2,3]),a=int(r,1,3);s=[0,1,2,3].map(j=>a*k**j);rep=a*k**4;e='Chaque nombre est multiplié par '+k+'.';faux=[s[3]+(s[3]-s[2]),rep+k]}
  else if(t===3){const E=melange(r,['🔴','🔵','🟢','🟡','⭐','🔺']),m=pick(r,[[0,1,1],[0,0,1],[0,1,2]]);s=[0,1,2,3,4,5,6].map(j=>E[m[j%3]]);const rr=E[m[7%3]];
    const ch=[rr,...E.slice(0,3).filter(x=>x!==rr)].slice(0,3);return quizQ(r,{titre:'Quelle forme vient ensuite ?',suite:s,aide:'Trouve le groupe qui se répète.'},ch,'Le groupe de 3 se répète.')}
  else{const a=int(r,1,3);s=[0,1,2,3].map(j=>(a+j)*(a+j));rep=(a+4)*(a+4);e='Ce sont les carrés : '+(a+4)+' × '+(a+4)+' = '+rep+'.';faux=[rep-1,s[3]+(s[3]-s[2])]}
  const l=[rep,...faux.filter((v,k,arr)=>v!==rep&&arr.indexOf(v)===k)];while(l.length<3)l.push(rep+l.length*2);
  return quizQ(r,{titre:'Quel nombre vient ensuite ?',suite:s.map(String),aide:'Compare chaque nombre avec le suivant.'},l.map(String),e)}
function symbQ(r,i){const t=i%5,E=melange(r,['🍎','🍌','⭐','🌙','🔺','🔵','🐱','🐶','🍩','🍪']),X=E[0],Y=E[1];let eq,q,rep,e;
  if(t===0){const a=int(r,2,12);eq=[X+' + '+X+' = '+2*a];q=X;rep=a;e=a+' + '+a+' = '+2*a+'.'}
  else if(t===1){const a=int(r,2,9),b=int(r,1,9);eq=[X+' + '+X+' = '+2*a,X+' + '+Y+' = '+(a+b)];q=Y;rep=b;e=X+' = '+a+', donc '+Y+' = '+(a+b)+' − '+a+' = '+b+'.'}
  else if(t===2){const a=int(r,2,6),k=int(r,2,4),b=int(r,1,9);eq=[X+' × '+k+' = '+a*k,X+' + '+Y+' = '+(a+b)];q=Y;rep=b;e=X+' = '+a+', donc '+Y+' = '+b+'.'}
  else if(t===3){const a=int(r,2,8),b=int(r,1,6);eq=[X+' + '+X+' + '+X+' = '+3*a,Y+' = '+X+' + '+b];q=Y;rep=a+b;e=X+' = '+a+', donc '+Y+' = '+a+' + '+b+' = '+(a+b)+'.'}
  else{const b=int(r,1,5),a=b+int(r,1,5);eq=[X+' + '+Y+' = '+(a+b),X+' − '+Y+' = '+(a-b)];q=X;rep=a;e=a+' + '+b+' = '+(a+b)+' et '+a+' − '+b+' = '+(a-b)+', donc '+X+' = '+a+'.'}
  const l=[rep,rep+1,Math.abs(rep-2)||rep+3].filter((v,k,arr)=>arr.indexOf(v)===k);while(l.length<3)l.push(rep+5);
  return quizQ(r,{titre:'Chaque symbole vaut toujours le même nombre.',equations:eq,question:q+' = ?',aide:'Trouve d’abord le symbole qui est seul dans une équation.'},l.map(String),e)}
const PRENOMS=['Léa','Sam','Noé','Mia','Zoé','Léo','Emma','Adam','Lina','Tom','Inès','Yanis'];
const voy=w=>/^[aeiouyéèêàâîôûAEIOUYÉÈÊÀÂÎÔÛ]/.test(w),de=w=>(voy(w)?'d’':'de ')+w,que=w=>(voy(w)?'qu’':'que ')+w;
function enigmeQ(r,i){const t=i%4,N=melange(r,PRENOMS);
  if(t===0){const [a,b,c]=N,obj=pick(r,['billes','livres','cartes','autocollants']);const q=r()<.5;
    return quizQ(r,{titre:'Lis bien l’énigme.',texte:a+' a plus '+de(obj)+' '+que(b)+'. '+b+' a plus '+de(obj)+' '+que(c)+'. Qui a le '+(q?'plus':'moins')+' '+de(obj)+' ?',aide:'Range les trois personnes dans l’ordre.'},q?[a,b,c]:[c,b,a],a+' en a le plus, puis '+b+', puis '+c+'.')}
  if(t===1){const o=pick(r,[['poule','œuf','pond','œufs'],['abeille','fleur','visite','fleurs'],['élève','livre','lit','livres']]),n=int(r,2,4),j=int(r,3,5);
    return quizQ(r,{titre:'Lis bien l’énigme.',texte:'Une '+o[0]+' '+o[2]+' 1 '+o[1]+' par jour. Combien de '+o[3]+' pour '+n+' '+o[0]+'s en '+j+' jours ?',aide:'Multiplie le nombre de '+o[0]+'s par le nombre de jours.'},[String(n*j),String(n+j),String(n*j+n)],n+' × '+j+' = '+n*j+'.')}
  if(t===2){const [a,b,c]=N,A=melange(r,['un chat','un chien','un poisson']);
    return quizQ(r,{titre:'Lis bien l’énigme.',texte:a+', '+b+' et '+c+' ont chacun un animal : '+A.join(', ')+'. '+b+' a '+A[1]+'. '+a+' n’a pas '+A[2].replace(/^un /,'de ')+'. Qui a '+A[2]+' ?',aide:'Élimine les personnes une par une.'},[c,a,b],b+' a '+A[1]+' et '+a+' n’a pas '+A[2].replace(/^un /,'de ')+' : c’est '+c+'.')}
  const P=[['Un fermier a 17 moutons. Tous sauf 9 s’enfuient. Combien de moutons reste-t-il ?',['9','8','17'],'« Tous sauf 9 » s’enfuient : il en reste 9.'],
   ['Tom a 3 sœurs. Chaque sœur a un seul frère. Combien d’enfants y a-t-il dans la famille ?',['4','6','7'],'Le seul frère, c’est Tom : 3 + 1 = 4.'],
   ['Dans une course, tu dépasses la personne en 2e place. À quelle place es-tu ?',['2e','1re','3e'],'Tu prends sa place : la 2e.']];
  const [tx,l,e]=P[Math.floor(i/4)%3];return quizQ(r,{titre:'Attention, c’est un piège !',texte:tx,aide:'Lis chaque mot : la question est plus simple qu’elle en a l’air.'},l,e)}
function pairesCalc(r,n){const out=[],vus=new Set();while(out.length<n){const t=int(r,0,3);let a,b,res;
  if(t===0){a=int(r,2,9);b=int(r,2,9);res=a+b;out.push([a+' + '+b,String(res)])}
  else if(t===1){a=int(r,2,9);b=int(r,2,9);res=a*b;out.push([a+' × '+b,String(res)])}
  else if(t===2){a=int(r,10,20);b=int(r,2,9);res=a-b;out.push([a+' − '+b,String(res)])}
  else{b=int(r,2,5);res=int(r,2,9);out.push([b*res+' ÷ '+b,String(res)])}
  const v=out[out.length-1][1];if(vus.has(v))out.pop();else vus.add(v)}return out}
const SIMON_COUL=['rouge','bleu','vert','jaune'];
const simonQ=(r,long,envers)=>({type:'simon',suite:Array.from({length:long},()=>pick(r,SIMON_COUL)),envers});
const devinettes={id:'devinettes',titre:'Devinettes',icone:'❓',couleur:'#5a3fb0',categorie:'defis',
 consigne:'Lis les indices, puis choisis la réponse.',
 niveaux:[
 {titre:'Devinettes de nombres',description:'Deux indices pour trouver le nombre.',questions:()=>make(1501,r=>devinNombre(r,2,40,false))},
 {titre:'Objets à double sens',description:'Des devinettes avec un piège dans les mots.',questions:devinListe(1502,OBJETS)},
 {titre:'Animaux et nature',description:'Mammifères, insectes, arbres et saisons.',questions:devinListe(1503,NATURE)},
 {titre:'Nombres plus grands',description:'Trois indices, des nombres jusqu’à 99.',questions:()=>make(1504,r=>devinNombre(r,10,99,true))},
 {titre:'Le Canada et le monde',description:'Villes, pays, océans et planètes.',questions:devinListe(1505,MONDE)}
 ]};
const logique={id:'logique',titre:'Défis de logique',icone:'🧠',couleur:'#3d47a8',categorie:'defis',
 consigne:'Observe bien, puis réponds.',
 niveaux:[
 {titre:'L’intrus',description:'Trouver celui qui ne suit pas la règle.',questions:intrusNiv},
 {titre:'Les suites',description:'Trouver ce qui vient ensuite.',questions:()=>make(1402,(r,i)=>suiteQ(r,i))},
 {titre:'Les symboles',description:'Chaque symbole cache un nombre.',questions:()=>make(1403,(r,i)=>symbQ(r,i))},
 {titre:'Les énigmes',description:'Lire, comparer, déduire. Attention aux pièges !',questions:()=>make(1404,(r,i)=>enigmeQ(r,i))},
 {titre:'Mémoire des calculs',description:'Retrouver un calcul et son résultat : 4 paires.',questions:()=>{const r=rng(1405);return [0,1,2].map(()=>({type:'memo',paires:pairesCalc(r,4)}))}},
 {titre:'Grande mémoire',description:'6 paires de calculs.',questions:()=>{const r=rng(1406);return [0,1].map(()=>({type:'memo',paires:pairesCalc(r,6)}))}},
 {titre:'Suite de couleurs',description:'Regarder, retenir, refaire : de 3 à 6 couleurs.',questions:()=>{const r=rng(1407);return [3,3,4,4,5,6].map(n=>simonQ(r,n,false))}},
 {titre:'Couleurs à l’envers',description:'Refaire la suite en commençant par la fin.',questions:()=>{const r=rng(1408);return [3,3,4,4,5].map(n=>simonQ(r,n,true))}}
 ]};

/* ============================ FINANCES ============================ */
/* Items with a realistic price range [emoji, name, min price, max price]. */
const ART=[['🍎','Pomme',1,2],['🥪','Sandwich',4,8],['🧃','Jus',2,4],['🍪','Biscuit',1,3],['📓','Cahier',2,5],['✏️','Crayon',1,3],['🧸','Ourson',8,15],['⚽','Ballon',6,15],['🧢','Casquette',8,15],['🎒','Sac',10,19],['🍌','Banane',1,2],['🧁','Muffin',2,4],['🖍️','Boîte de crayons',3,7],['🧦','Chaussettes',3,8]];
const prixDe=(r,a,max)=>int(r,a[2],Math.max(a[2],Math.min(a[3],max||99)));
/* Picture blocks for the finance situations (drawn by moteur.js): bill, coin, item, wallet/account, unknown, group of items.
   Few words: the picture and the calculation line carry the situation. "oral" is the full sentence read aloud. */
const FB=(v,titre)=>({k:'billet',v,titre}),FP=(v,titre)=>({k:'piece',v,titre}),FA=(e,n,p,titre)=>({k:'article',e,n,p,titre}),
 FW=(v,titre,e)=>({k:'porte',v,titre,e:e||'👛'}),FI=(titre,e)=>({k:'inconnu',titre,e:e||'🪙'}),FG=(items,titre)=>({k:'groupe',items,titre});
const fin=o=>Object.assign({type:'finance'},o);
/* Read-aloud helpers: "une pomme à 2 dollars". */
const UNE=['Pomme','Casquette','Banane','Boîte de crayons'],DES=['Chaussettes'];
const avecUn=n=>(DES.includes(n)?'des ':UNE.includes(n)?'une ':'un ')+n.toLowerCase();
const dol=v=>v+(v>1?' dollars':' dollar');
const finances={id:'finances',titre:'Gestion des finances',icone:'💵',couleur:'#215e63',
 consigne:'Regarde le dessin, puis réponds.',
 niveaux:[
 {titre:'Le plus cher, le moins cher',description:'Comparer des prix.',
  questions:()=>make(701,(r,i)=>{let s,p;do{s=[];while(s.length<3){const a=pick(r,ART);if(!s.find(x=>x[1]===a[1]))s.push(a)}p=s.map(a=>prixDe(r,a))}while(new Set(p).size<3);const cher=i%2===0;const best=p.indexOf(cher?Math.max(...p):Math.min(...p));return fin({title:cher?'⬆️ Le plus cher':'⬇️ Le moins cher',items:s.map((a,k)=>[a[0],a[1],p[k]]),question:cher?'Clique sur le plus cher.':'Clique sur le moins cher.',type2:'choice',cliquer:true,choices:s.map(a=>a[1]),answer:best,explain:'Compare les prix : '+p.join(' $, ')+' $.'})})},
 {titre:'Additionner deux prix',description:'Combien faut-il payer ?',
  questions:()=>make(702,r=>{const a=pick(r,ART);let b=pick(r,ART);while(b===a)b=pick(r,ART);const x=prixDe(r,a,12),y=prixDe(r,b,12);return fin({title:'🧾 À la caisse',schema:{blocs:[FA(a[0],a[1],x),'+',FA(b[0],b[1],y),'=',FI('Tu paies','🧾')],calc:[[x+' $','+',y+' $','=','?']]},oral:'Tu achètes '+avecUn(a[1])+' à '+dol(x)+' et '+avecUn(b[1])+' à '+dol(y)+'. Combien dois-tu payer en tout ?',question:'Combien en tout ?',type2:'number',answer:x+y,explain:x+' + '+y+' = '+(x+y)+' $'})})},
 {titre:'Rendre la monnaie',description:'Payer avec un billet de 10 $ ou de 20 $.',
  questions:()=>make(703,r=>{const a=pick(r,ART),prix=prixDe(r,a,19),billet=prix<10&&r()<.5?10:20;return fin({title:'🪙 La monnaie',schema:{blocs:[FB(billet,'Tu donnes'),'−',FA(a[0],a[1],prix,'Ça coûte'),'=',FI('On te rend')],calc:[[billet+' $','−',prix+' $','=','?']]},oral:'Tu achètes '+avecUn(a[1])+' à '+dol(prix)+'. Tu paies avec un billet de '+billet+' dollars. Combien de monnaie dois-tu recevoir ?',question:'Combien de monnaie ?',type2:'number',answer:billet-prix,explain:billet+' − '+prix+' = '+(billet-prix)+' $'})})},
 {titre:'Respecter un budget',description:'Est-ce que j’ai assez d’argent ?',
  questions:()=>make(704,(r,i)=>{const a=pick(r,ART);let b=pick(r,ART);while(b===a)b=pick(r,ART);const x=prixDe(r,a,12),y=prixDe(r,b,12),budget=i%2?x+y+int(r,0,4):x+y-int(r,1,4);
   if(i%3===2){const reste=Math.max(budget,x+y+1);return fin({title:'👛 Ce qui reste',schema:{blocs:[FW(reste,'Tu as'),'−',FG([[a[0],a[1],x],[b[0],b[1],y]],'Tu achètes'),'=',FI('Il te reste','👛')],calc:[[reste+' $','−',x+' $','−',y+' $','=','?']]},oral:'Tu as '+dol(reste)+'. Tu achètes '+avecUn(a[1])+' à '+dol(x)+' et '+avecUn(b[1])+' à '+dol(y)+'. Combien d’argent te reste-t-il ?',question:'Combien te reste-t-il ?',type2:'number',answer:reste-x-y,explain:reste+' − '+x+' − '+y+' = '+(reste-x-y)+' $'})}
   return fin({title:'👛 Mon budget',schema:{blocs:[FW(budget,'Tu as'),'→',FG([[a[0],a[1],x],[b[0],b[1],y]],'Tu veux')],calc:[[x+' $','+',y+' $','=','?']]},oral:'Tu as '+dol(budget)+'. Tu veux '+avecUn(a[1])+' à '+dol(x)+' et '+avecUn(b[1])+' à '+dol(y)+'. Peux-tu acheter les deux ?',question:'Peux-tu acheter les deux ?',type2:'choice',choices:['✅ Oui','❌ Non'],answer:x+y<=budget?0:1,explain:x+' + '+y+' = '+(x+y)+' $. Tu as '+budget+' $.'})})},
 {titre:'Faire de bons choix',description:'Besoins, envies et vraies bonnes affaires.',questions:()=>FIN_CHOIX.map(fin)},
 {titre:'Situations du quotidien',description:'Des problèmes en plusieurs étapes.',questions:()=>FIN_QUOTIDIEN.map(fin)}
 ]};
/* Level 5: good choices (hand-written). */
const FIN_CHOIX=[
 {title:'🏷️ La vraie bonne affaire',story:'Les 2 chandails sont pareils.',items:[['👕','Magasin A',30,'au lieu de 40 $'],['👕','Magasin B',28]],cliquer:true,question:'Clique sur le moins cher.',type2:'choice',choices:['Magasin A','Magasin B'],answer:1,oral:'Les deux chandails sont identiques. Au magasin A, il coûte 30 dollars au lieu de 40 dollars. Au magasin B, il coûte 28 dollars. Où est-il le moins cher ?',explain:'On paie 30 $ au magasin A et 28 $ au magasin B.'},
 {title:'🎒 Besoin ou envie ?',story:'🎒💔 Ton sac d’école est cassé.',items:[['🎒','Nouveau sac',30],['🎮','Jeu vidéo',30]],cliquer:true,question:'Que dois-tu acheter ?',type2:'choice',choices:['Le nouveau sac','Le jeu vidéo'],answer:0,oral:'Ton sac d’école est cassé. Tu peux acheter un seul article : un nouveau sac ou un jeu vidéo. Que dois-tu acheter ?',explain:'Le sac est un besoin : il remplace celui qui est cassé.'},
 {title:'🎬 Une sortie',schema:{blocs:[FW(20,'Tu as'),'→',FG([['🎬','Cinéma',12],['🍿','Popcorn',5],['🥤','Boisson',4]],'Tu veux')],calc:[['12 $','+','5 $','+','4 $','=','?']]},question:'Peux-tu acheter les trois ?',type2:'choice',choices:['✅ Oui','❌ Non'],answer:1,oral:'Tu as 20 dollars. Tu veux le cinéma à 12 dollars, le popcorn à 5 dollars et une boisson à 4 dollars. Peux-tu acheter les trois ?',explain:'12 + 5 + 4 = 21 $. Il manque 1 $.'},
 {title:'🏷️ Une vraie promotion ?',items:[['🏷️','Prix normal',20],['🏷️','Prix en solde',24]],question:'Le prix en solde est…',type2:'choice',choices:['⬇️ plus bas','⬆️ plus haut','= pareil'],answer:1,oral:'Le prix normal est 20 dollars. Le prix en solde est 24 dollars. Le prix en solde est-il plus bas, plus haut ou pareil ?',explain:'24 $ est plus que 20 $ : ce n’est pas une vraie promotion.'},
 {title:'🪙 Qui a 7 $ ?',money:[['Alex','2 $ + 2 $ + 1 $ + 1 $'],['Léa','2 $ + 2 $ + 2 $ + 1 $'],['Sam','2 $ + 1 $ + 1 $ + 1 $']],cliquer:true,question:'Clique sur l’enfant qui a 7 $.',type2:'choice',choices:['Alex','Léa','Sam'],answer:1,explain:'Léa : 2 + 2 + 2 + 1 = 7 $.'},
 {title:'🧺 Le panier le moins cher',money:[['Panier A','5 $ + 3 $ + 2 $'],['Panier B','6 $ + 4 $ + 3 $']],cliquer:true,question:'Clique sur le panier le moins cher.',type2:'choice',choices:['Panier A','Panier B'],answer:0,explain:'Panier A : 10 $. Panier B : 13 $.'},
 {title:'🐷 Dépenser ou économiser ?',schema:{blocs:[FW(40,'Tu as','🐷'),'→',FA('🚲','Vélo',80,'Tu veux')]},question:'Que fais-tu pour avoir le vélo ?',type2:'choice',choices:['🎮 J’achète un jeu à 35 $','🐷 Je garde mon argent'],answer:1,oral:'Tu as 40 dollars. Tu veux un vélo à 80 dollars. Un jeu coûte 35 dollars. Que fais-tu pour avoir le vélo ?',explain:'En gardant ton argent, il ne te manque que 40 $ pour le vélo.'},
 {title:'🎒 Lequel choisir ?',items:[['🎒','Sac vert',15],['🎒','Sac rouge',18,'Promotion !'],['🎒','Sac jaune',12]],cliquer:true,question:'Clique sur le moins cher.',type2:'choice',choices:['Le sac vert','Le sac rouge','Le sac jaune'],answer:2,oral:'Trois sacs presque pareils : le sac vert à 15 dollars, le sac rouge en promotion à 18 dollars et le sac jaune à 12 dollars. Lequel coûte le moins cher ?',explain:'12 $ est moins que 15 $ et 18 $.'},
 {title:'🧃 Le paquet',story:'Tu veux 2 jus.',items:[['🧃','2 jus séparés',6,'3 $ + 3 $'],['🧃🧃','Le paquet de 2',5]],cliquer:true,question:'Clique sur le moins cher.',type2:'choice',choices:['Deux jus séparés','Le paquet de 2'],answer:1,oral:'Tu veux 2 jus. Un jus coûte 3 dollars. Le paquet de 2 jus coûte 5 dollars. Qu’est-ce qui coûte le moins cher ?',explain:'3 $ + 3 $ = 6 $. Le paquet coûte 5 $.'},
 {title:'👛 Avec 10 $',story:'👛 Tu as 10 $.',items:[['🍎','Pomme',2],['🥪','Sandwich',5],['🧃','Jus',3],['🍪','Biscuit',4]],question:'Choisis 3 articles. Pas plus de 10 $.',type2:'basket',count:3,budget:10,explain:'Additionne les trois prix. Le total doit être 10 $ ou moins.'}
];
/* Level 6: everyday situations in several steps (hand-written). */
const FIN_QUOTIDIEN=[
 {title:'🪙 La bonne monnaie',schema:{blocs:[FB(10,'Tu donnes'),'−',FA('🚗','Petite voiture',6,'Ça coûte'),'=',FI('On te rend')],calc:[['10 $','−','6 $','=','?']]},question:'Combien doit-on te rendre ?',type2:'number',answer:4,oral:'La petite voiture coûte 6 dollars. Tu donnes 10 dollars. Combien doit-on te rendre ?',explain:'10 − 6 = 4 $'},
 {title:'🪙 Combien en retour ?',schema:{blocs:[FB(20,'Tu donnes'),'−',FA('🧸','Ourson',13,'Ça coûte'),'=',FI('On te rend')],calc:[['20 $','−','13 $','=','?']]},question:'Combien de monnaie ?',type2:'choice',choices:['5 $','7 $','9 $'],answer:1,oral:'Tu achètes un ourson à 13 dollars. Tu donnes un billet de 20 dollars. Combien de monnaie dois-tu recevoir ?',explain:'20 − 13 = 7 $'},
 {title:'🧾 Une erreur sur le reçu ?',receipt:[['🍕 Pizza',8],['🥤 Boisson',2],['🍪 Biscuit',2]],reportedTotal:14,question:'Quel est le bon total ?',type2:'number',answer:12,oral:'Sur le reçu : pizza à 8 dollars, boisson à 2 dollars et biscuit à 2 dollars. Le reçu dit 14 dollars. Quel est le bon total ?',explain:'8 + 2 + 2 = 12 $'},
 {title:'💳 La carte de débit',schema:{blocs:[FA('👟','Chaussures',45,'Ça coûte'),'−',FW(40,'Ton compte','💳'),'=',FI('Il manque','❓')],calc:[['45 $','−','40 $','=','?']]},question:'Combien manque-t-il ?',type2:'number',answer:5,oral:'Ton compte contient 40 dollars. Les chaussures coûtent 45 dollars. Combien manque-t-il ?',explain:'45 − 40 = 5 $'},
 {title:'🎧 Les écouteurs',schema:{blocs:[FA('🎧','Écouteurs',25,'Ça coûte'),'−',{k:'argent',parts:[['billet',20],['piece',2]],titre:'Tu as'},'=',FI('Il manque','❓')],calc:[['20 $','+','2 $','=','22 $'],['25 $','−','22 $','=','?']]},question:'Combien te manque-t-il ?',type2:'number',answer:3,oral:'Tu veux des écouteurs à 25 dollars. Tu as un billet de 20 dollars et une pièce de 2 dollars. Combien te manque-t-il ?',explain:'20 + 2 = 22 $. 25 − 22 = 3 $'},
 {title:'🍔 Compose ton repas',story:'👛 Tu as 12 $.',items:[['🍔','Hamburger',6],['🍟','Frites',4],['🥤','Boisson',3],['🍎','Pomme',2]],question:'Choisis 3 articles. Pas plus de 12 $.',type2:'basket',count:3,budget:12,explain:'Additionne les trois prix. Le total doit être 12 $ ou moins.'},
 {title:'👛 Ce qui reste',receipt:[['Article 1',12],['Article 2',8],['Article 3',9]],reportedTotal:29,totalLabel:'TOTAL',schema:{blocs:[FW(30,'Tu as'),'−',FA('🧾','Total',29,'Tu paies'),'=',FI('Il te reste','👛')],calc:[['30 $','−','29 $','=','?']]},question:'Combien te reste-t-il ?',type2:'number',answer:1,oral:'Ton budget est de 30 dollars. Tes trois articles coûtent 12, 8 et 9 dollars : le total est 29 dollars. Combien te reste-t-il ?',explain:'30 − 29 = 1 $'},
 {title:'☕ Petit ou grand café ?',schema:{blocs:[FG([['☕','Grand',3],['☕','Grand',3]],'2 grands cafés'),'−',FG([['☕','Petit',2],['☕','Petit',2]],'2 petits cafés'),'=',FI('Tu économises','🐷')],calc:[['3 $','+','3 $','=','6 $'],['2 $','+','2 $','=','4 $'],['6 $','−','4 $','=','?']]},question:'Combien économises-tu avec les petits cafés ?',type2:'number',answer:2,oral:'Le petit café coûte 2 dollars. Le grand café coûte 3 dollars. Tu achètes un café chaque jour pendant 2 jours. Combien économises-tu en choisissant le petit café ?',explain:'Grands : 6 $. Petits : 4 $. 6 − 4 = 2 $'},
 {title:'🍱 Le dîner',schema:{blocs:[FG([['🍱','Lundi',4],['🍱','Mardi',4],['🍱','Mercredi',4]],'3 jours'),'=',FI('Tu dépenses','👛')],calc:[['4 $','+','4 $','+','4 $','=','?']]},question:'Combien dépenses-tu en 3 jours ?',type2:'number',answer:12,oral:'Ton dîner coûte 4 dollars par jour. Tu manges à la cafétéria lundi, mardi et mercredi. Combien dépenses-tu ?',explain:'4 + 4 + 4 = 12 $'},
 {title:'🐷 Économiser pour un ballon',schema:{blocs:[FA('⚽','Ballon',18,'Ça coûte'),'−',FW(11,'Tu as','🐷'),'=',FI('Il manque','❓')],calc:[['18 $','−','11 $','=','?']]},question:'Combien dois-tu encore économiser ?',type2:'number',answer:7,oral:'Le ballon coûte 18 dollars. Tu as déjà 11 dollars. Combien dois-tu encore économiser ?',explain:'18 − 11 = 7 $'}
];

/* ============================ SHAPES ============================ */
const FORMES_NOMS={cercle:'Cercle',triangle:'Triangle',carre:'Carré',rectangle:'Rectangle',pentagone:'Pentagone',hexagone:'Hexagone',ovale:'Ovale',losange:'Losange'};
const forme=(f,choix,extra)=>Object.assign({type:'choix',texte:'Quel est le nom de cette forme ?',visuel:{forme:f},choix,reponse:choix.indexOf(FORMES_NOMS[f]),aide:'Compte les côtés et regarde s’ils sont droits ou arrondis.'},extra||{});
const BASE=['Cercle','Triangle','Carré','Rectangle'];
const prop=(f,texte,choix,rep,rot)=>({type:'choix',texte,visuel:{forme:f,rotation:rot||0},choix,reponse:choix.indexOf(rep),aide:'Compte en posant ton doigt sur chaque côté ou chaque coin.'});
const formes={id:'formes',titre:'Les formes géométriques',icone:'△ ○ □',couleur:'#08665d',
 consigne:'Observe bien la forme.',
 niveaux:[
 {titre:'Les quatre formes de base',description:'Cercle, triangle, carré, rectangle.',
  questions:()=>['cercle','triangle','carre','rectangle','triangle','cercle','rectangle','carre','cercle','triangle','carre','rectangle','triangle','carre','rectangle'].map((f,i)=>forme(f,BASE,{visuel:{forme:f,rotation:i>=8?[25,40,15,30,45,20,35][i-8]:0}}))},
 {titre:'D’autres formes',description:'Pentagone, hexagone, ovale, losange…',
  questions:()=>[['pentagone',0],['ovale',0],['hexagone',0],['losange',0],['carre',30],['triangle',40],['pentagone',20],['rectangle',20],['hexagone',15],['ovale',30],['losange',20],['cercle',0],['pentagone',35],['hexagone',30],['losange',45]].map(([f,rot],i)=>{const all=Object.values(FORMES_NOMS);const r=rng(800+i);const ch=[FORMES_NOMS[f]];while(ch.length<4){const c=pick(r,all);if(!ch.includes(c))ch.push(c)}ch.sort();return forme(f,ch,{visuel:{forme:f,rotation:rot}})})},
 {titre:'Les côtés et les sommets',description:'Compter et reconnaître les propriétés.',
  questions:()=>[prop('triangle','Combien de côtés possède cette forme ?',['2','3','4','5'],'3'),prop('carre','Combien de sommets (coins) possède cette forme ?',['3','4','5','6'],'4'),prop('pentagone','Combien de côtés possède cette forme ?',['3','4','5','6'],'5'),prop('hexagone','Combien de sommets possède cette forme ?',['4','5','6','8'],'6'),prop('cercle','Combien de sommets possède cette forme ?',['0','1','2','4'],'0'),prop('rectangle','Cette forme a quatre angles droits, deux côtés longs et deux côtés courts. Quel est son nom ?',['Rectangle','Triangle','Cercle','Pentagone'],'Rectangle'),prop('carre','Cette forme a quatre côtés égaux et quatre angles droits. Quel est son nom ?',['Carré','Losange','Ovale','Triangle'],'Carré'),prop('losange','Combien de côtés possède cette forme ?',['3','4','5','6'],'4'),prop('triangle','Combien de sommets possède cette forme ?',['2','3','4','5'],'3',30),prop('ovale','Cette forme possède-t-elle des côtés droits ?',['Oui','Non'],'Non')]},
 {titre:'Compter les formes',description:'Combien de triangles, de carrés, de rectangles et de cercles vois-tu ?',
  questions:()=>['sapin','poisson','maison','camion','bonhomme','fusee','voilier','robot','train','chateau'].map(id=>({type:'compter',figure:id}))},
 {titre:'Colorier selon la légende : 3 formes',description:'Cercles en rouge, carrés en vert, triangles en jaune.',
  questions:()=>['bateau','maison','fusee','chateau','train','ville','ciel','sapin','neige','fleurs'].map(id=>({type:'colorier',dessin:id,legende:L3}))},
 {titre:'Colorier selon la légende : 6 formes',description:'Cercles, carrés, rectangles, triangles, ovales et hexagones.',
  questions:()=>['montgolfiere','jardin','espace','parc','plage','bord','aquarium','ferme','port','ruche'].map(id=>({type:'colorier',dessin:id}))},
 {titre:'Trouver une forme parmi beaucoup d’autres',description:'Des dessins avec plus de formes.',questions:()=>SCENES.slice(2,12).map((s,i)=>({type:'scene',scene:i+2,cible:['triangle','carre','cercle','rectangle'][i%4],decor:true}))}
 ]};
/* Pictures made of shapes (levels 6 and 7: find a shape). */
const R=(type,x,y,w,h)=>({type,tag:'rect',a:{x,y,width:w,height:h}}),C=(x,y,r)=>({type:'cercle',tag:'circle',a:{cx:x,cy:y,r}}),T=(a,b,c)=>({type:'triangle',tag:'polygon',a:{points:[a,b,c].map(v=>v.join(',')).join(' ')}});
const SCENES=[
{name:'Maison',parts:[R('carre',180,160,160,160),T([160,160],[260,55],[360,160]),R('rectangle',240,245,40,75),C(260,125,19)]},
{name:'Sapin',parts:[R('rectangle',245,245,30,80),T([260,45],[190,140],[330,140]),T([260,120],[165,220],[355,220]),T([260,190],[145,285],[375,285])]},
{name:'Fusée',parts:[R('rectangle',225,130,70,160),T([225,130],[260,55],[295,130]),C(260,195,22),T([225,235],[175,295],[225,295])]},
{name:'Bonhomme',parts:[C(260,90,40),R('carre',215,140,90,90),R('rectangle',215,240,30,85),R('rectangle',275,240,30,85)]},
{name:'Train',parts:[R('rectangle',140,175,235,90),R('carre',140,100,75,75),C(195,290,30),C(325,290,30)]},
{name:'Voilier',parts:[T([245,55],[245,220],[140,220]),T([265,100],[265,220],[350,220]),R('rectangle',130,240,250,55),C(255,267,17)]},
{name:'Robot',parts:[R('carre',215,65,90,90),R('rectangle',200,175,120,130),C(240,110,12),C(280,110,12)]},
{name:'Poisson',parts:[C(280,180,90),T([185,180],[115,105],[115,255]),T([265,90],[310,45],[340,110]),C(315,160,13)]},
{name:'Camion',parts:[R('rectangle',215,105,180,140),R('carre',125,155,90,90),C(175,270,30),C(340,270,30)]},
{name:'Fleur',parts:[C(260,130,45),C(260,65,25),R('rectangle',250,180,20,145),T([240,265],[170,210],[180,280])]},
{name:'Château',parts:[R('rectangle',145,155,230,170),T([145,155],[205,65],[265,155]),R('carre',170,195,35,35),C(300,220,25)]},
{name:'Montgolfière',parts:[C(260,120,85),R('carre',225,260,70,70),R('rectangle',225,210,12,50),R('rectangle',283,210,12,50)]}];
const DECOR=[R('carre',425,260,45,45),C(70,75,28),T([70,160],[35,225],[105,225]),R('rectangle',405,85,80,35),C(450,190,18),T([30,300],[70,250],[110,300])];

/* ================= SHAPES: COUNTING AND COLOURING (levels 4 and 5) =================
   Picture pieces: fR = square or rectangle (square if width = height),
   fC = circle, fT = triangle, fE = oval, fH = hexagon, fD = decoration (line not counted).
   The last argument is the colour (pictures to count only). */
const fR=(x,y,w,h,f)=>({type:w===h?'carre':'rectangle',tag:'rect',a:{x,y,width:w,height:h},f});
const fC=(cx,cy,r,f)=>({type:'cercle',tag:'circle',a:{cx,cy,r},f});
const fT=(points,f)=>({type:'triangle',tag:'polygon',a:{points},f});
const fE=(cx,cy,rx,ry,f)=>({type:'ovale',tag:'ellipse',a:{cx,cy,rx,ry},f});
const fH=(cx,cy,s,f)=>({type:'hexagone',tag:'polygon',a:{points:[[cx-s,cy],[cx-s/2,cy-s*.866],[cx+s/2,cy-s*.866],[cx+s,cy],[cx+s/2,cy+s*.866],[cx-s/2,cy+s*.866]].map(p=>p.map(v=>Math.round(v*10)/10).join(',')).join(' ')},f});
const fD=d=>({type:null,tag:'path',a:{d}});
const vagues=(x1,x2,y)=>{let d='M'+x1+' '+y;for(let x=x1;x<x2;x+=40)d+=' q10 -10 20 0 t20 0';return fD(d)};
const COUL={rouge:'#e53935',bleu:'#1e63c6',jaune:'#f7c843',orange:'#f08a24',vert:'#3aa655',brun:'#8b5a2b',gris:'#c9d1da',ciel:'#9fd3f2',beige:'#fbe3c5',violet:'#8e5bd1',marine:'#1d3f73'};
const K=COUL;

/* Colour pictures: the student counts the triangles, squares, rectangles and circles. */
const FIGURES={
 sapin:{nom:'Le sapin',parts:[fD('M60 330 H460'),fT('260,35 195,125 325,125',K.vert),fT('260,95 175,205 345,205',K.vert),fT('260,165 155,275 365,275',K.vert),fR(245,275,30,55,K.brun)]},
 camion:{nom:'Le camion',parts:[fD('M40 320 H480'),fR(200,80,230,160,K.bleu),fR(110,140,90,100,K.jaune),fR(130,155,45,45,K.ciel),fR(100,240,340,20,K.gris),fC(160,285,30,K.marine),fC(310,285,30,K.marine),fC(385,285,30,K.marine)]},
 bonhomme:{nom:'Le bonhomme',parts:[fT('220,95 260,40 300,95',K.orange),fC(260,125,30,K.beige),fR(215,160,90,90,K.bleu),fR(165,165,50,18,K.beige),fR(305,165,50,18,K.beige),fR(222,250,30,70,K.vert),fR(268,250,30,70,K.vert),fR(212,320,40,15,K.brun),fR(268,320,40,15,K.brun)]},
 robot:{nom:'Le robot',parts:[fD('M260 48 V75'),fC(260,40,9,K.rouge),fR(196,95,14,30,K.jaune),fR(310,95,14,30,K.jaune),fR(210,75,100,70,K.bleu),fC(240,103,12,K.ciel),fC(280,103,12,K.ciel),fR(245,125,30,8,K.rouge),fR(165,165,40,15,K.gris),fR(315,165,40,15,K.gris),fR(205,155,110,110,K.vert),fR(222,180,20,20,K.orange),fR(250,180,20,20,K.jaune),fR(278,180,20,20,K.orange),fR(222,265,28,60,K.jaune),fR(270,265,28,60,K.jaune),fR(212,325,45,15,K.bleu),fR(263,325,45,15,K.bleu)]},
 poisson:{nom:'Le poisson',parts:[fT('120,110 120,250 200,180',K.bleu),fT('255,95 290,40 320,95',K.bleu),fT('255,265 290,320 320,265',K.bleu),fC(285,180,95,K.jaune),fC(330,155,13,K.marine),fC(420,125,10,K.ciel),fC(442,92,14,K.ciel),fC(458,55,9,K.ciel)]},
 maison:{nom:'La maison',parts:[fD('M60 320 H460'),fT('150,160 260,62 370,160',K.rouge),fR(180,160,160,160,K.beige),fC(260,122,20,K.ciel),fR(198,190,40,40,K.ciel),fR(282,190,40,40,K.ciel),fR(240,250,40,70,K.brun),fC(150,298,22,K.vert),fC(370,298,22,K.vert)]},
 voilier:{nom:'Le voilier',parts:[vagues(60,460,325),fR(255,60,10,190,K.brun),fT('265,60 310,75 265,90',K.rouge),fT('248,85 248,240 150,240',K.jaune),fT('272,100 272,240 360,240',K.bleu),fR(140,250,240,55,K.violet),fC(190,277,14,K.ciel),fC(260,277,14,K.ciel),fC(330,277,14,K.ciel),fC(440,70,30,K.jaune)]},
 fusee:{nom:'La fusée',parts:[fT('225,210 175,270 225,270',K.bleu),fT('295,210 345,270 295,270',K.bleu),fR(225,120,70,150,K.gris),fT('225,120 260,50 295,120',K.rouge),fC(260,165,20,K.ciel),fR(245,205,30,30,K.ciel),fR(235,270,50,18,K.rouge),fT('240,288 280,288 260,335',K.orange)]},
 train:{nom:'Le train',parts:[fD('M40 282 H480'),fC(330,80,18,K.gris),fC(362,52,22,K.gris),fR(100,105,120,15,K.jaune),fR(110,120,100,100,K.vert),fR(135,140,50,50,K.ciel),fR(300,110,26,50,K.jaune),fR(210,160,170,60,K.rouge),fT('380,175 380,220 420,220',K.bleu),fR(110,220,270,14,K.marine),fC(150,252,28,K.orange),fC(240,254,26,K.orange),fC(320,254,26,K.orange)]},
 chateau:{nom:'Le château',parts:[fD('M60 320 H460'),fD('M140 70 V40'),fD('M380 70 V40'),fT('140,40 170,50 140,60',K.bleu),fT('380,40 410,50 380,60',K.bleu),fR(185,200,22,22,K.gris),fR(249,200,22,22,K.gris),fR(313,200,22,22,K.gris),fR(170,220,180,100,K.gris),fR(110,130,60,190,K.gris),fR(350,130,60,190,K.gris),fT('105,130 140,70 175,130',K.rouge),fT('345,130 380,70 415,130',K.rouge),fR(128,160,24,24,K.bleu),fR(128,230,24,24,K.bleu),fR(368,160,24,24,K.bleu),fR(368,230,24,24,K.bleu),fR(242,260,36,60,K.brun)]}
};

/* Colouring key (as on the worksheets): each kind of shape has its colour. */
const LEGENDE={cercle:['rouge','#e53935'],carre:['vert','#2e9e44'],rectangle:['bleu','#1e63c6'],triangle:['jaune','#f7c843'],ovale:['mauve','#8e44ad'],hexagone:['brun','#8b5a2b']};
const L3=['cercle','carre','triangle'],L4=['cercle','carre','rectangle','triangle'],L6=L4.concat(['ovale','hexagone']);
/* Sun: a circle surrounded by 8 triangle rays. */
const soleil=(cx,cy,r)=>{const P=(d,a)=>Math.round(cx+d*Math.cos(a))+','+Math.round(cy+d*Math.sin(a));const out=[];for(let k=0;k<8;k++){const a=k*Math.PI/4;out.push(fT(P(r+8,a-.24)+' '+P(r+8,a+.24)+' '+P(r+30,a)))}out.push(fC(cx,cy,r));return out};
/* Flower: 6 round petals around a round centre. */
const fleurRonde=(x,y)=>{const out=[];for(let k=0;k<6;k++){const a=k*Math.PI/3;out.push(fC(Math.round(x+30*Math.cos(a)),Math.round(y+30*Math.sin(a)),17))}out.push(fC(x,y,20));return out};
/* Flower: 4 oval petals around a round centre. */
const fleurOvale=(x,y)=>[fE(x,y-30,12,18),fE(x,y+30,12,18),fE(x-30,y,18,12),fE(x+30,y,18,12),fC(x,y,15)];
/* Fish: triangle tail, oval body, round eye. d = 1 (facing right) or -1. */
const poisson=(x,y,d)=>[fT((x-36*d)+','+y+' '+(x-70*d)+','+(y-24)+' '+(x-70*d)+','+(y+24)),fE(x,y,42,24),fC(x+22*d,y-6,6)];
/* Bee: oval wings, oval body, round head. */
const abeille=(x,y)=>[fE(x-4,y-18,12,9),fE(x+10,y-18,12,9),fE(x,y,22,13),fC(x+26,y-2,9)];
/* Row of hexagons. */
const hexas=(x0,y,s,n,pas)=>Array.from({length:n},(_,k)=>fH(x0+k*pas,y,s));

/* Pictures to colour (black outlines): the student colours each shape according to the key. */
const COLORIAGES={
 maison:{nom:'La maison et le soleil',legende:L4,parts:[fD('M10 350 H590'),
  fT('78,42 102,42 90,14'),fT('78,118 102,118 90,146'),fT('52,68 52,92 24,80'),fT('128,68 128,92 156,80'),fC(90,80,32),
  fT('220,170 330,85 440,170'),fC(330,138,18),fR(240,170,180,180),fR(260,195,45,45),fR(355,195,45,45),fR(310,270,40,80),
  fT('495,250 540,150 585,250'),fR(528,250,24,100)]},
 bateau:{nom:'Les bateaux',legende:L4,parts:[vagues(20,580,330),vagues(20,580,360),fC(525,70,35),
  fT('95,140 95,250 45,250'),fT('105,160 105,250 150,250'),fR(40,255,115,30),
  fR(280,150,40,40),fR(220,190,160,60),fR(240,205,30,30),fR(285,205,30,30),fR(330,205,30,30),
  fR(170,250,260,60),fC(230,280,14),fC(300,280,14),fC(370,280,14)]},
 train:{nom:'Le train',legende:L4,parts:[fD('M10 302 H590'),fD('M310 240 H330'),fD('M450 240 H470'),
  fC(140,128,14),fC(165,100,19),
  fT('90,215 90,260 55,260'),fR(90,200,130,60),fR(120,160,24,40),fR(220,170,90,90),fR(240,190,50,50),
  fR(330,190,120,70),fR(345,205,35,35),fR(400,205,35,35),
  fR(470,190,110,70),fC(500,225,15),fC(550,225,15),
  fC(125,280,20),fC(195,280,20),fC(265,280,20),fC(360,280,20),fC(420,280,20),fC(500,280,20),fC(550,280,20)]},
 ville:{nom:'La ville',legende:L4,parts:[fD('M10 270 H590'),fD('M240 60 V25'),
  fC(555,48,28),
  fT('20,170 80,100 140,170'),fC(80,143,15),fR(30,170,100,100),fR(42,185,28,28),fR(87,215,30,55),
  fR(240,25,40,22),fR(180,60,120,210),fR(198,80,30,30),fR(252,80,30,30),fR(198,130,30,30),fR(252,130,30,30),fR(198,180,30,30),fR(252,180,30,30),fR(225,216,30,54),
  fT('330,160 395,95 460,160'),fC(395,137,13),fR(340,160,110,110),fR(355,180,80,30),
  fT('500,145 540,95 580,145'),fT('492,195 540,130 588,195'),fT('484,245 540,175 596,245'),fR(533,245,14,25)]},
 montgolfiere:{nom:'La montgolfière',legende:L6,parts:[fD('M10 330 H590'),fD('M240 195 L278 240 M360 195 L322 240'),fD('M95 290 V330'),fD('M520 340 V385'),
  fT('78,32 102,32 90,6'),fT('78,108 102,108 90,134'),fT('52,58 52,82 24,70'),fT('128,58 128,82 156,70'),fC(90,70,30),
  fE(470,65,42,24),fE(525,82,30,18),
  fE(300,110,78,95),fR(275,240,50,50),
  fR(40,250,110,40),
  fH(80,365,24),fH(160,365,24),fH(240,365,24),fH(320,365,24),fH(400,365,24),
  fE(520,252,14,20),fE(520,318,14,20),fE(487,285,20,14),fE(553,285,20,14),fC(520,285,16)]},
 parc:{nom:'Le parc',legende:L6,parts:[fD('M10 290 H590'),
  fE(150,40,40,20),fE(560,50,30,18),
  fE(80,130,50,75),fC(65,105,12),fC(95,132,12),fC(68,160,12),fR(70,205,20,85),
  fC(250,120,60),fR(222,92,22,22),fR(256,92,22,22),fR(222,126,22,22),fR(256,126,22,22),fR(240,180,20,110),
  fT('400,110 440,50 480,110'),fT('390,160 440,90 490,160'),fT('380,210 440,140 500,210'),fR(430,210,20,80),
  fH(60,345,26),fH(140,345,26),fH(220,345,26),fH(300,345,26),fH(380,345,26),fH(460,345,26),
  fE(548,345,40,22)]},
 fusee:{nom:'La fusée dans le ciel',legende:L4,parts:[fD('M10 380 H590'),
  fC(500,80,40),fC(110,90,20),fC(150,300,14),fT('470,230 485,200 500,230'),fT('90,190 105,160 120,190'),fT('520,330 535,300 550,330'),
  fT('260,230 210,300 260,300'),fT('340,230 390,300 340,300'),fR(260,120,80,180),fT('260,120 300,40 340,120'),fC(300,165,22),fR(285,215,30,30),
  fT('275,300 325,300 300,355'),fR(220,360,160,20)]},
 chateau:{nom:'Le château',legende:L4,parts:[fD('M10 370 H590'),fD('M165 70 V35'),fD('M435 70 V35'),fT('165,35 195,45 165,55'),fT('435,35 465,45 435,55'),
  fC(530,70,35),
  fR(130,150,70,220),fR(400,150,70,220),fT('120,150 165,70 210,150'),fT('390,150 435,70 480,150'),
  fR(210,205,25,25),fR(260,205,25,25),fR(315,205,25,25),fR(365,205,25,25),fR(200,230,200,140),fR(275,290,50,80),
  fC(165,200,14),fC(435,200,14),fR(150,260,30,30),fR(420,260,30,30)]},
 jardin:{nom:'Le jardin',legende:L6,parts:[fD('M10 300 H590'),fD('M150 245 V300'),fD('M450 245 V300'),
  fE(120,60,45,22),fE(185,72,35,18),fC(520,70,32),
  fE(150,170,12,18),fE(150,230,12,18),fE(120,200,18,12),fE(180,200,18,12),fC(150,200,15),
  fE(450,170,12,18),fE(450,230,12,18),fE(420,200,18,12),fE(480,200,18,12),fC(450,200,15),
  fT('260,170 310,120 360,170'),fR(270,170,80,80),fC(310,205,14),fR(302,250,16,50),
  fH(75,350,24),fH(165,350,24),fH(255,350,24),fH(345,350,24),fH(435,350,24),fH(525,350,24)]},
 ciel:{nom:'Le soleil et les nuages',legende:L3,parts:[fD('M10 360 H590'),fD('M482 350 V360 M498 350 V360'),
  ...soleil(115,105,38),
  fC(310,95,30),fC(355,72,36),fC(402,95,30),fC(470,175,24),fC(505,155,30),fC(542,175,24),
  fT('230,250 300,185 370,250'),fR(245,250,110,110),fR(280,280,40,40),
  fT('440,350 490,250 540,350')]},
 sapin:{nom:'Le sapin décoré',legende:L3,parts:[fD('M10 370 H590'),fD('M285 330 V370 H315 V330'),
  fT('288,44 312,44 300,16'),fT('300,44 225,150 375,150'),fT('300,110 195,240 405,240'),fT('300,185 160,330 440,330'),
  fC(285,120,12),fC(318,175,13),fC(255,215,13),fC(345,225,13),fC(300,275,14),fC(225,305,13),fC(375,305,13),
  fC(70,70,10),fC(160,130,8),fC(500,80,10),fC(545,170,8),fC(110,210,8),fC(470,200,9),
  fR(60,300,70,70),fR(140,320,50,50),fR(460,310,60,60),fR(530,330,40,40)]},
 fleurs:{nom:'Les fleurs',legende:L3,parts:[fD('M10 390 H590'),fD('M130 195 V320 M300 195 V320 M470 195 V320'),
  ...[130,300,470].flatMap(x=>[fT(x+',290 '+(x-55)+',255 '+(x-42)+',300'),fT(x+',270 '+(x+55)+',235 '+(x+42)+',280'),fR(x-35,320,70,70),...fleurRonde(x,145)])]},
 neige:{nom:'Le bonhomme de neige',legende:L3,parts:[fD('M10 360 H590'),fD('M255 58 H345'),fD('M120 250 V285 M480 250 V285'),
  fT('70,250 120,160 170,250'),fT('80,195 120,110 160,195'),fT('430,250 480,160 530,250'),fT('440,195 480,110 520,195'),
  fC(300,290,68),fC(300,180,50),fC(300,98,40),fR(272,8,56,50),
  fC(285,90,7),fC(315,90,7),fT('300,100 300,114 334,107'),fC(300,160,7),fC(300,182,7),fC(300,204,7),
  fC(60,60,8),fC(200,40,9),fC(420,50,8),fC(550,90,9),fC(230,120,7),fC(380,130,8),
  fR(400,310,50,50),fR(160,320,40,40)]},
 ruche:{nom:'La ruche',legende:L6,parts:[fD('M10 350 H590'),fD('M190 60 H420 M300 60 V87'),fD('M480 315 V350 M560 315 V350'),
  ...soleil(70,70,28),
  fH(300,110,26),fH(300,155,26),fH(300,200,26),fH(339,132,26),fH(339,177,26),fH(261,132,26),fH(261,177,26),
  ...abeille(450,120),...abeille(470,200),...abeille(150,220),
  fR(100,270,12,80),fR(76,215,60,60),
  fT('200,350 212,320 224,350'),fT('240,350 252,320 264,350'),fT('330,350 342,320 354,350'),fT('380,350 392,320 404,350'),
  ...fleurOvale(480,285),...fleurOvale(560,285)]},
 ferme:{nom:'La ferme',legende:L6,parts:[fD('M10 330 H590'),fD('M262 285 H400 M262 310 H400'),fD('M430 290 V325 M465 290 V325 M535 312 V330 M560 312 V330'),
  ...soleil(530,70,28),fE(290,60,42,20),fE(340,72,30,16),
  fT('70,180 155,95 240,180'),fC(155,150,14),fR(80,180,150,150),fR(135,195,40,40),fR(135,260,40,70),
  fR(270,265,14,65),fR(310,265,14,65),fR(350,265,14,65),fR(390,265,14,65),
  fE(450,280,45,28),fC(500,262,15),fE(548,300,30,20),fC(578,292,10),
  ...hexas(60,368,20,8,60)]},
 aquarium:{nom:'L’aquarium',legende:L6,parts:[fD('M10 30 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0'),fD('M10 340 H590'),
  fD('M60 340 q-15 -30 0 -60 t0 -60 M400 340 q-15 -30 0 -55 t0 -55'),
  ...poisson(170,120,1),...poisson(440,95,-1),...poisson(260,240,1),
  fC(215,70,8),fC(228,45,6),fC(400,45,9),fC(330,190,7),fC(345,165,5),
  fR(450,230,24,110),fR(546,230,24,110),fT('450,230 462,205 474,230'),fT('546,230 558,205 570,230'),fR(474,260,72,72),fR(500,272,20,20),fR(500,300,20,32),
  ...hexas(60,365,16,6,60)]},
 plage:{nom:'La plage',legende:L6,parts:[fD('M10 120 H590'),vagues(20,580,165),fD('M10 210 H590'),
  ...soleil(85,62,26),
  fR(355,140,130,20),fT('415,140 415,70 365,140'),fT('425,140 425,85 470,140'),
  fR(176,250,8,95),fT('110,250 180,200 250,250'),fR(230,322,110,40),fC(400,300,25),
  fR(460,295,70,70),fR(460,258,30,30),fR(500,258,30,30),fT('475,258 475,236 492,247'),
  fE(70,350,16,10),fE(120,375,12,8),fE(565,380,14,9),
  fH(60,280,16),fH(300,250,14),fH(570,300,14)]},
 espace:{nom:'Dans l’espace',legende:L6,parts:[
  fC(90,90,45),fE(510,300,85,18),fC(510,300,52),fC(470,70,20),
  fR(270,140,60,150),fT('270,140 300,70 330,140'),fT('270,230 235,290 270,290'),fT('330,230 365,290 330,290'),fC(300,185,18),fT('285,290 315,290 300,330'),
  fC(130,262,22),fE(130,282,62,18),
  fR(110,170,50,20),fR(200,170,50,20),fR(160,160,40,40),
  fH(420,170,18),fH(225,60,16),fH(560,170,16),fH(400,330,14),
  fT('40,220 48,205 56,220'),fT('380,40 388,25 396,40'),fT('560,30 568,15 576,30'),fT('230,350 238,335 246,350')]},
 port:{nom:'Le port',legende:L6,parts:[fD('M10 240 H590'),vagues(20,580,355),vagues(20,580,380),fD('M450 215 V240 M530 218 V240'),
  fC(545,50,28),fE(350,50,40,18),fE(400,60,30,14),
  fT('30,150 85,100 140,150'),fC(85,130,10),fR(40,150,90,90),fR(58,168,22,22),fR(92,168,22,22),fR(75,205,20,35),
  fR(170,90,100,150),fR(185,105,25,25),fR(230,105,25,25),fR(185,145,25,25),fR(230,145,25,25),fR(210,200,20,40),
  fT('290,150 345,95 400,150'),fR(300,150,90,90),fR(318,170,55,25),fR(335,205,20,35),
  fE(450,175,30,42),fE(530,185,25,35),
  ...hexas(30,262,13,6,32),...hexas(420,262,13,6,32),
  fR(285,262,30,30),fR(215,292,170,40),fC(250,312,9),fC(300,312,9),fC(350,312,9)]},
 bord:{nom:'Au bord de l’eau',legende:L6,parts:[vagues(20,580,315),fD('M307 70 V245'),fD('M80 300 V345'),
  fT('78,32 102,32 90,6'),fT('78,108 102,108 90,134'),fT('52,58 52,82 24,70'),fT('128,58 128,82 156,70'),fC(90,70,30),
  fE(400,60,40,22),
  fR(310,70,40,22),fT('300,92 300,240 210,240'),fT('315,110 315,240 390,240'),fR(200,245,210,50),fC(250,270,13),fC(305,270,13),fC(360,270,13),
  fT('460,140 515,100 570,140'),fR(470,140,90,90),fR(485,160,25,25),fR(522,180,24,50),
  fE(80,227,14,20),fE(80,293,14,20),fE(47,260,20,14),fE(113,260,20,14),fC(80,260,16),
  fH(170,365,22),fH(250,365,22),fH(330,365,22),fH(410,365,22)]}
};


/* ===================== COUNTING: TENS, HUNDREDS, THOUSANDS =====================
   Three simple lessons (ASD students, elementary): short sentences, one thing at a time.
   Each lesson has its video. The "Ones, tens, hundreds" video groups all three. */
const suiteCompte=(debut,pas,n,f)=>{const l=[];for(let k=0;k<n;k++)l.push(debut+k*pas);const rep=debut+n*pas;
  return{type:'nombre',texte:'Quel nombre vient après ?',visuel:{grand:l.map(f||mil).join(', ')+', ?'},oral:'Quel nombre vient après ? '+l.join(', '),reponse:rep,aide:'On ajoute '+mil(pas)+' chaque fois.'}};
const LEC_DIZ=['Une barre a 10 cubes.','1 barre = 1 dizaine = 10.','On compte les barres : 10, 20, 30…','Puis on compte les cubes : 31, 32, 33…'];
const dizaines={id:'dizaines',titre:'Les dizaines',icone:'10 20',couleur:'#9a5612',video:'videos/Les-dizaines.mp4',consigne:'Compte de 10 en 10.',niveaux:[
 {titre:'Compter les barres',description:'Jusqu’à 5 barres.',lecon:LEC_DIZ,questions:()=>make(1501,r=>{const d=int(r,1,5);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les barres de dix en dix. Combien de cubes ?',visuel:{blocs:{d}},reponse:d*10,aide:'Compte : '+Array.from({length:d},(_,k)=>10*(k+1)).join(', ')+'.'}})},
 {titre:'Encore des barres',description:'Jusqu’à 10 barres.',lecon:LEC_DIZ,questions:()=>make(1502,r=>{const d=int(r,3,10);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les barres de dix en dix. Combien de cubes ?',visuel:{blocs:{d}},reponse:d*10,aide:'Compte : '+Array.from({length:d},(_,k)=>10*(k+1)).join(', ')+'.'}})},
 {titre:'De 10 en 10',description:'10, 20, 30, ?',lecon:LEC_DIZ,questions:()=>make(1503,r=>suiteCompte(10*int(r,1,6),10,3))},
 {titre:'Combien de dizaines ?',description:'50, c’est 5 dizaines.',lecon:LEC_DIZ,questions:()=>make(1504,r=>{const d=int(r,1,9);return{type:'nombre',texte:d*10+', c’est combien de dizaines ?',visuel:{grand:String(d*10)},reponse:d,aide:d*10+', c’est '+pl(d,'barre')+' de 10.'}})},
 {titre:'Barres et cubes',description:'Des dizaines et quelques unités.',lecon:LEC_DIZ,questions:()=>make(1505,r=>{const d=int(r,1,5),u=int(r,1,5);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les barres, puis les cubes. Combien de cubes ?',visuel:{blocs:{d,u}},reponse:d*10+u,aide:'Barres : '+d*10+'. Puis les cubes : '+Array.from({length:u},(_,k)=>d*10+k+1).join(', ')+'.'}})},
 {titre:'Barres et cubes jusqu’à 99',description:'Compte les barres, puis les cubes.',lecon:LEC_DIZ,questions:()=>make(1506,r=>{const d=int(r,1,9),u=int(r,0,9);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les barres, puis les cubes. Combien de cubes ?',visuel:{blocs:{d,u}},reponse:d*10+u,aide:pl(d,'dizaine')+' et '+plU(u)+' : '+(d*10+u)+'.'}})},
 {titre:'De 10 en 10, autrement',description:'24, 34, 44, ?',lecon:LEC_DIZ,questions:()=>make(1507,r=>suiteCompte(int(r,1,9)+10*int(r,0,4),10,3))},
 {titre:'10 de plus',description:'On ajoute une barre.',lecon:['10 de plus : on ajoute 1 barre.','Le chiffre des dizaines monte de 1.','24 → 34'],questions:()=>make(1508,r=>{const n=int(r,11,89),pm=r()<.7;if(!pm&&n<20)return null;return{type:'nombre',texte:pm?'10 de plus que '+n+' ?':'10 de moins que '+n+' ?',visuel:{grand:n+(pm?' + 10':' − 10')},oral:pm?'Dix de plus que '+n+' ?':'Dix de moins que '+n+' ?',reponse:pm?n+10:n-10,aide:pm?'On ajoute 1 barre : les dizaines montent de 1.':'On enlève 1 barre : les dizaines baissent de 1.'}})}]};
const LEC_CEN=['Une plaque a 10 barres.','1 plaque = 1 centaine = 100.','On compte les plaques : 100, 200, 300…','Puis les barres : 310, 320…'];
const centaines={id:'centaines',titre:'Les centaines',icone:'100 200',couleur:'#2b7a3b',video:'videos/Les-centaines.mp4',consigne:'Compte de 100 en 100.',niveaux:[
 {titre:'Compter les plaques',description:'Jusqu’à 5 plaques.',lecon:LEC_CEN,questions:()=>make(1601,r=>{const c=int(r,1,5);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les plaques de cent en cent. Combien de cubes ?',visuel:{blocs:{c}},reponse:c*100,aide:'Compte : '+Array.from({length:c},(_,k)=>100*(k+1)).join(', ')+'.'}})},
 {titre:'Encore des plaques',description:'Jusqu’à 9 plaques.',lecon:LEC_CEN,questions:()=>make(1602,r=>{const c=int(r,3,9);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les plaques de cent en cent. Combien de cubes ?',visuel:{blocs:{c}},reponse:c*100,aide:'Compte : '+Array.from({length:c},(_,k)=>100*(k+1)).join(', ')+'.'}})},
 {titre:'De 100 en 100',description:'100, 200, 300, ?',lecon:LEC_CEN,questions:()=>make(1603,r=>suiteCompte(100*int(r,1,6),100,3))},
 {titre:'Combien de centaines ?',description:'300, c’est 3 centaines.',lecon:LEC_CEN,questions:()=>make(1604,r=>{const c=int(r,1,9);return{type:'nombre',texte:c*100+', c’est combien de centaines ?',visuel:{grand:String(c*100)},reponse:c,aide:c*100+', c’est '+pl(c,'plaque')+' de 100.'}})},
 {titre:'Plaques et barres',description:'Des centaines et des dizaines.',lecon:LEC_CEN,questions:()=>make(1605,r=>{const c=int(r,1,5),d=int(r,1,5);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les plaques, puis les barres. Combien de cubes ?',visuel:{blocs:{c,d}},reponse:c*100+d*10,aide:'Plaques : '+c*100+'. Puis les barres : '+Array.from({length:d},(_,k)=>c*100+10*(k+1)).join(', ')+'.'}})},
 {titre:'Plaques, barres et cubes',description:'Jusqu’à 999.',lecon:LEC_CEN,questions:()=>make(1606,r=>{const c=int(r,1,9),d=int(r,0,9),u=int(r,0,9);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les plaques, les barres, puis les cubes. Combien de cubes ?',visuel:{blocs:{c,d,u}},reponse:c*100+d*10+u,aide:pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+' : '+(c*100+d*10+u)+'.'}})},
 {titre:'De 100 en 100, autrement',description:'120, 220, 320, ?',lecon:LEC_CEN,questions:()=>make(1607,r=>suiteCompte(10*int(r,1,9)+100*int(r,0,4),100,3))},
 {titre:'100 de plus',description:'On ajoute une plaque.',lecon:['100 de plus : on ajoute 1 plaque.','Le chiffre des centaines monte de 1.','245 → 345'],questions:()=>make(1608,r=>{const n=int(r,101,899),pm=r()<.7;if(!pm&&n<200)return null;return{type:'nombre',texte:pm?'100 de plus que '+n+' ?':'100 de moins que '+n+' ?',visuel:{grand:n+(pm?' + 100':' − 100')},oral:pm?'Cent de plus que '+n+' ?':'Cent de moins que '+n+' ?',reponse:pm?n+100:n-100,aide:pm?'On ajoute 1 plaque : les centaines montent de 1.':'On enlève 1 plaque : les centaines baissent de 1.'}})}]};
const LEC_MIL=['10 plaques empilées font un gros cube.','1 gros cube = 1 millier = 1 000.','On compte : 1 000, 2 000, 3 000…','Le tableau a 4 colonnes : UM (les milliers), C, D, U.'];
const milliers={id:'milliers',titre:'Les milliers',icone:'1 000',couleur:'#623aa0',video:'videos/Les-milliers.mp4',consigne:'Compte de 1 000 en 1 000.',niveaux:[
 {titre:'10 centaines = 1 millier',description:'Le gros cube.',lecon:LEC_MIL,questions:()=>make(1701,r=>{const t=int(r,0,2);
   if(t===0)return chx(r,{texte:'10 plaques, c’est combien de cubes ?',visuel:{blocs:{c:10}},aide:'10 plaques de 100 = 1 000.'},['1 000','100','10']);
   if(t===1)return chx(r,{texte:'1 gros cube, c’est combien de cubes ?',visuel:{blocs:{m:1}},aide:'1 gros cube = 1 millier = 1 000.'},['1 000','100','10']);
   const c=int(r,1,3);return chx(r,{texte:'Combien de plaques font 1 millier ?',aide:'10 centaines = 1 millier.'},['10','100',String(c)])})},
 {titre:'Compter les gros cubes',description:'1 000, 2 000, 3 000…',lecon:LEC_MIL,questions:()=>make(1702,r=>{const m=int(r,1,5);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les gros cubes de mille en mille. Combien de cubes ?',visuel:{blocs:{m}},reponse:m*1000,aide:'Compte : '+Array.from({length:m},(_,k)=>mil(1000*(k+1))).join(', ')+'.'}})},
 {titre:'De 1 000 en 1 000',description:'1 000, 2 000, ?',lecon:LEC_MIL,questions:()=>make(1703,r=>suiteCompte(1000*int(r,1,6),1000,3))},
 {titre:'Combien de milliers ?',description:'3 000, c’est 3 milliers.',lecon:LEC_MIL,questions:()=>make(1704,r=>{const m=int(r,1,9);return{type:'nombre',texte:mil(m*1000)+', c’est combien de milliers ?',visuel:{grand:mil(m*1000)},reponse:m,aide:mil(m*1000)+', c’est '+pl(m,'gros cube')+' de 1 000.'}})},
 {titre:'Gros cubes et plaques',description:'Des milliers et des centaines.',lecon:LEC_MIL,questions:()=>make(1705,r=>{const m=int(r,1,4),c=int(r,1,5);return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les gros cubes, puis les plaques. Combien de cubes ?',visuel:{blocs:{m,c}},reponse:m*1000+c*100,aide:'Gros cubes : '+mil(m*1000)+'. Puis les plaques : '+Array.from({length:c},(_,k)=>mil(m*1000+100*(k+1))).join(', ')+'.'}})},
 {titre:'Le tableau M C D U',description:'Un chiffre dans chaque case.',lecon:LEC_MIL,questions:()=>make(1706,r=>{const m=int(r,1,9),c=int(r,0,9),d=r()<.3?0:int(r,0,9),u=int(r,0,9),n=m*1000+c*100+d*10+u;return{type:'position',n:4,v:n,texte:'Écris '+mil(n)+' dans le tableau.',aide:m+' millier'+(m>1?'s':'')+', '+pl(c,'centaine')+', '+pl(d,'dizaine')+', '+plU(u)+'.'}})},
 {titre:'Tous les blocs',description:'Milliers, centaines, dizaines, unités.',lecon:LEC_MIL,questions:()=>make(1707,r=>{const m=int(r,1,3),c=int(r,0,4),d=int(r,0,4),u=int(r,0,5),n=m*1000+c*100+d*10+u;return{type:'nombre',texte:'Combien de cubes ?',oral:'Compte les gros cubes, les plaques, les barres, puis les cubes.',visuel:{blocs:{m,c,d,u}},reponse:n,aide:m+' millier'+(m>1?'s':'')+', '+pl(c,'centaine')+', '+pl(d,'dizaine')+', '+plU(u)+' : '+mil(n)+'.'}})},
 {titre:'1 000 de plus',description:'On ajoute un gros cube.',lecon:['1 000 de plus : on ajoute 1 gros cube.','Le chiffre des milliers monte de 1.','2 345 → 3 345'],questions:()=>make(1708,r=>{const n=int(r,1001,8999),pm=r()<.7;if(!pm&&n<2000)return null;return{type:'nombre',texte:pm?'1 000 de plus que '+mil(n)+' ?':'1 000 de moins que '+mil(n)+' ?',visuel:{grand:mil(n)+(pm?' + 1 000':' − 1 000')},oral:pm?'Mille de plus que '+n+' ?':'Mille de moins que '+n+' ?',reponse:pm?n+1000:n-1000,aide:pm?'Les milliers montent de 1.':'Les milliers baissent de 1.'}})}]};

/* ======================= WORD PROBLEMS (math in context) =======================
   One level per content of the site. Short sentences, a name, a real situation.
   The help shows the calculation; additions and subtractions say "regrouper". */
const PERS=[['Léa','elle'],['Sam','il'],['Noé','il'],['Lina','elle'],['Adam','il'],['Inès','elle'],['Malik','il'],['Zoé','elle'],['Yanis','il'],['Sofia','elle']];
const OBJ=[['🍎','pommes'],['🍪','biscuits'],['🎈','ballons'],['🖍️','crayons'],['🐟','poissons'],['⭐','autocollants'],['🚗','petites autos'],['🧁','petits gâteaux']];
const LEC_PB=['Pour résoudre un problème :','1. Je lis le problème (ou j’écoute avec 🔊).','2. Je trouve les nombres importants.','3. Je choisis l’opération : +, −, × ou ÷.','4. Je calcule.','5. Je vérifie : est-ce que ma réponse a du sens ?'];
const deObj=o=>(/^[aeiouéèêh]/i.test(o)?'d’':'de ')+o;
const Maj=s=>s[0].toUpperCase()+s.slice(1);
const emo=(e,n)=>Array(n).fill(e).join('');
const deux=r=>{const a=pick(r,PERS);let b=pick(r,PERS);while(b[0]===a[0])b=pick(r,PERS);return[a,b]};
const pb=(texte,reponse,aide,extra)=>Object.assign({type:'nombre',texte,reponse,aide},extra||{});
/* column addition / subtraction help with the word "regrouper" */
function aideAdd(a,b){const u=a%10+b%10,d=Math.floor(a/10)+Math.floor(b/10);return u>=10?'En colonnes : '+(a%10)+' + '+(b%10)+' = '+u+'. J’écris '+(u-10)+' et je regroupe 1 dizaine. '+Math.floor(a/10)+' + '+Math.floor(b/10)+' + 1 = '+(d+1)+'. Réponse : '+(a+b)+'.':a+' + '+b+' = '+(a+b)+'.'}
function aideSous(a,b){return a%10<b%10?'En colonnes : '+(a%10)+' − '+(b%10)+', c’est impossible. Je regroupe 1 dizaine en 10 unités : '+(a%10+10)+' − '+(b%10)+' = '+(a%10+10-b%10)+'. Puis '+(Math.floor(a/10)-1)+' − '+Math.floor(b/10)+' = '+(Math.floor(a/10)-1-Math.floor(b/10))+'. Réponse : '+(a-b)+'.':a+' − '+b+' = '+(a-b)+'.'}
const FR_MOTS={2:['un demi','demis'],3:['un tiers','tiers'],4:['un quart','quarts'],5:['un cinquième','cinquièmes'],6:['un sixième','sixièmes'],8:['un huitième','huitièmes']};
const fracDit=(n,d)=>n===1?FR_MOTS[d][0]:['','un','deux','trois','quatre','cinq','six','sept'][n]+' '+FR_MOTS[d][1];
const problemes={id:'problemes',titre:'Problèmes en contexte',icone:'🧩',couleur:'#7a4fb5',
 consigne:'Lis le problème. Écris la réponse dans la case.',
 niveaux:[
 {titre:'Additionner jusqu’à 10',description:'On ajoute : en tout, maintenant, ensemble.',lecon:LEC_PB.concat(['Mots qui disent « + » : en tout, ensemble, de plus, il en reçoit.']),
  questions:()=>make(4101,r=>{const[p,il]=pick(r,PERS),[e,o]=pick(r,OBJ),a=int(r,1,5),b=int(r,1,5),t=int(r,0,2);
   const tx=[p+' a '+a+' '+o+'. '+Maj(il)+' en reçoit '+b+' de plus. Combien '+deObj(o)+' a-t-'+il+' maintenant ?','Il y a '+a+' '+o+' sur la table. '+p+' en ajoute '+b+'. Combien '+deObj(o)+' y a-t-il en tout ?',p+' a '+a+' '+o+'. Son ami en a '+b+'. Combien '+deObj(o)+' ont-ils ensemble ?'][t];
   return pb(tx,a+b,a+' + '+b+' = '+(a+b)+'.',{visuel:{grand:emo(e,a)+'  +  '+emo(e,b)}})})},
 {titre:'Soustraire jusqu’à 10',description:'On enlève : il en reste combien ?',lecon:LEC_PB.concat(['Mots qui disent « − » : il en reste, il donne, il perd, il mange.']),
  questions:()=>make(4102,r=>{const[p,il]=pick(r,PERS),[e,o]=pick(r,OBJ),a=int(r,4,10),b=int(r,1,a-1),v=pick(r,['donne','perd','range']);
   return pb(p+' a '+a+' '+o+'. '+Maj(il)+' en '+v+' '+b+'. Combien lui en reste-t-il ?',a-b,a+' − '+b+' = '+(a-b)+'.',{visuel:{grand:emo(e,a)+'   − '+b}})})},
 {titre:'Additionner et soustraire jusqu’à 20',description:'L’autobus, la bibliothèque, la classe.',lecon:LEC_PB,
  questions:()=>make(4103,r=>{const t=int(r,0,3),a=int(r,6,14),b=int(r,2,6);
   if(t===0)return pb('Il y a '+a+' personnes dans l’autobus 🚌. À l’arrêt, '+b+' personnes montent. Combien de personnes y a-t-il dans l’autobus ?',a+b,a+' + '+b+' = '+(a+b)+'.');
   if(t===1)return pb('Il y a '+a+' personnes dans l’autobus 🚌. À l’arrêt, '+b+' personnes descendent. Combien de personnes reste-t-il ?',a-b,a+' − '+b+' = '+(a-b)+'.');
   const[p,il]=pick(r,PERS);
   if(t===2)return pb(p+' emprunte '+b+' livres 📚 lundi et '+(a-b)+' livres mardi. Combien de livres a-t-'+il+' empruntés ?',a,b+' + '+(a-b)+' = '+a+'.');
   const c=a+b;return pb('La classe a '+c+' crayons ✏️. '+a+' crayons sont dans les pots. Combien de crayons sont sur les tables ?',b,c+' − '+a+' = '+b+'.')})},
 {titre:'Comparer : combien de plus ?',description:'Qui en a le plus ? Combien de plus ou de moins ?',lecon:LEC_PB.concat(['Pour trouver « combien de plus », je fais une soustraction : le plus grand moins le plus petit.']),
  questions:()=>make(4104,r=>{const[[p],[q,il2]]=deux(r),a=int(r,5,30),b=a+int(r,2,15),t=int(r,0,2),[o]=[pick(r,['billes','cartes','autocollants','points'])];
   if(t===0)return pb(p+' a '+a+' '+o+'. '+q+' a '+b+' '+o+'. Combien '+deObj(o)+' '+q+' a-t-'+il2+' de plus que '+p+' ?',b-a,b+' − '+a+' = '+(b-a)+'.');
   if(t===1)return pb(p+' a '+a+' '+o+'. '+q+' a '+b+' '+o+'. Combien '+deObj(o)+' '+p+' a-t-'+(PERS.find(x=>x[0]===p)[1])+' de moins que '+q+' ?',b-a,b+' − '+a+' = '+(b-a)+'.');
   const x=r()<.5;return chx(r,{texte:p+' a lu '+(x?b:a)+' livres. '+q+' a lu '+(x?a:b)+' livres. Qui a lu le plus de livres ?',aide:'Je compare : '+Math.max(a,b)+' est plus grand que '+Math.min(a,b)+'.'},[x?p:q,x?q:p])})},
 {titre:'Additionner en regroupant',description:'Jusqu’à 100, en colonnes.',lecon:LEC_PB.concat(['Je calcule en colonnes : les unités d’abord.','Si les unités font 10 ou plus, je regroupe 10 unités en 1 dizaine.']),
  questions:()=>make(4105,r=>{let a=int(r,15,58),b=int(r,15,40);if(a%10+b%10<10)b+=10-((a%10+b%10)%10)>9?1:(10-(a%10+b%10));if(a%10+b%10<10||a+b>99)return null;const t=int(r,0,2);
   const tx=['La classe de 3e a ramassé '+a+' canettes ♻️. La classe de 4e en a ramassé '+b+'. Combien de canettes ont-elles ramassées en tout ?','Au spectacle, il y a '+a+' élèves dans la salle. '+b+' parents arrivent. Combien de personnes y a-t-il dans la salle ?','Un fermier a cueilli '+a+' citrouilles 🎃 lundi et '+b+' mardi. Combien de citrouilles a-t-il cueillies ?'][t];
   return pb(tx,a+b,aideAdd(a,b))})},
 {titre:'Soustraire en regroupant',description:'Jusqu’à 100, en colonnes.',lecon:LEC_PB.concat(['Je calcule en colonnes : les unités d’abord.','Si je ne peux pas enlever les unités, je regroupe 1 dizaine en 10 unités.']),
  questions:()=>make(4106,r=>{const a=int(r,31,95),b=int(r,12,a-8);if(a%10>=b%10)return null;const t=int(r,0,2),[p,il]=pick(r,PERS);
   const tx=['La salle a '+a+' places. '+b+' places sont occupées. Combien de places sont libres ?',p+' a '+a+' $ dans sa tirelire 🐷. '+Maj(il)+' dépense '+b+' $. Combien lui reste-t-il ?','Le livre a '+a+' pages. '+p+' a déjà lu '+b+' pages. Combien de pages lui reste-t-il à lire ?'][t];
   return pb(tx,a-b,aideSous(a,b),t===1?{unite:'$'}:{})})},
 {titre:'Dizaines et centaines',description:'Des boîtes de 10, des paquets de 100.',lecon:LEC_PB.concat(['1 boîte de 10 = 1 dizaine. 1 paquet de 100 = 1 centaine.']),
  questions:()=>make(4107,r=>{const t=int(r,0,2),[p]=pick(r,PERS);
   if(t===0){const d=int(r,2,9),u=int(r,1,9);return pb('Les crayons sont vendus en boîtes de 10. '+p+' a '+d+' boîtes et '+u+' crayons seuls. Combien de crayons a-t-'+(PERS.find(x=>x[0]===p)[1])+' ?',d*10+u,d+' dizaines et '+u+' unités = '+(d*10+u)+'.',{visuel:{blocs:{d,u}}})}
   if(t===1){const c=int(r,1,5),d=int(r,0,9),u=int(r,0,9);return pb('Un paquet contient 100 feuilles. Il y a '+c+' paquets de 100, '+d+' paquets de 10 et '+u+' feuilles seules. Combien de feuilles en tout ?',c*100+d*10+u,c+' centaines, '+d+' dizaines, '+u+' unités = '+(c*100+d*10+u)+'.',{visuel:{blocs:{c,d,u}}})}
   const n=int(r,23,98);return pb('On range '+n+' billes dans des sacs de 10. Combien de sacs pleins peut-on faire ?',Math.floor(n/10),n+', c’est '+Math.floor(n/10)+' dizaines et '+n%10+' unités : '+Math.floor(n/10)+' sacs pleins.')})},
 {titre:'Le nombre manquant',description:'Combien faut-il encore ?',lecon:LEC_PB.concat(['« Combien faut-il encore ? » : je cherche ce qui manque.','Je peux compter à partir du petit nombre, ou faire le grand moins le petit.']),
  questions:()=>make(4108,r=>{const t=int(r,0,2),[p,il]=pick(r,PERS),tot=pick(r,[20,25,30,40,50,60]),a=int(r,5,tot-3);
   const tx=['Il faut '+tot+' chaises pour la fête 🎉. Il y en a déjà '+a+'. Combien de chaises faut-il encore apporter ?',p+' veut avoir '+tot+' autocollants. '+Maj(il)+' en a '+a+'. Combien lui en manque-t-il ?','Le casse-tête a '+tot+' pièces 🧩. '+p+' en a déjà placé '+a+'. Combien de pièces reste-t-il à placer ?'][t];
   return pb(tx,tot-a,a+' + ? = '+tot+'. '+tot+' − '+a+' = '+(tot-a)+'.')})},
 {titre:'Des groupes égaux (×)',description:'Des boîtes, des rangées, des paquets.',lecon:LEC_PB.concat(['« Chaque boîte contient… » : des groupes égaux.','Je peux additionner plusieurs fois le même nombre, ou multiplier.']),
  questions:()=>make(4109,r=>{const g=int(r,2,5),n=int(r,2,6),t=int(r,0,2),[e,o]=[['🥚','œufs'],['🌷','fleurs'],['🍪','biscuits']][t];
   const tx=['Il y a '+g+' boîtes. Chaque boîte contient '+n+' œufs. Combien d’œufs y a-t-il en tout ?','Il y a '+g+' pots. Dans chaque pot, il y a '+n+' fleurs. Combien de fleurs en tout ?','Il y a '+g+' assiettes avec '+n+' biscuits sur chaque assiette. Combien de biscuits en tout ?'][t];
   return pb(tx,g*n,Array(g).fill(n).join(' + ')+' = '+g+' × '+n+' = '+(g*n)+'.',{visuel:{grand:Array(g).fill(emo(e,n)).join('   ')}})})},
 {titre:'Partager également (÷)',description:'Chacun reçoit la même chose.',lecon:LEC_PB.concat(['« Partager également » : chaque personne reçoit la même quantité.','Je fais une division : le total ÷ le nombre de personnes.']),
  questions:()=>make(4110,r=>{const g=int(r,2,5),n=int(r,2,6),tot=g*n,[p]=pick(r,PERS),t=int(r,0,1);
   if(t===0)return pb(p+' partage '+tot+' biscuits 🍪 également entre '+g+' amis. Combien de biscuits chaque ami reçoit-il ?',n,tot+' ÷ '+g+' = '+n+', car '+g+' × '+n+' = '+tot+'.',{visuel:{jetons:tot,groupes:g}});
   return pb('Il y a '+tot+' élèves. On fait des équipes de '+n+' élèves. Combien d’équipes peut-on faire ?',g,tot+' ÷ '+n+' = '+g+', car '+g+' × '+n+' = '+tot+'.')})},
 {titre:'Partager avec un reste',description:'Il en reste ? Il faut une auto de plus ?',lecon:LEC_PB.concat(['Parfois, le partage ne tombe pas juste : il y a un reste.','Je lis bien la question : on veut les groupes pleins, le reste, ou assez de place pour tout le monde ?']),
  questions:()=>make(4111,r=>{const g=int(r,3,6),q=int(r,2,6),re=int(r,1,g-1),tot=g*q+re,t=int(r,0,2);
   if(t===0)return pb('Il y a '+tot+' billes. On les met dans des sacs de '+g+'. Combien de sacs pleins peut-on faire ?',q,tot+' ÷ '+g+' = '+q+' reste '+re+' : '+q+' sacs pleins.');
   if(t===1)return pb('Il y a '+tot+' billes. On les met dans des sacs de '+g+'. Combien de billes reste-t-il hors des sacs ?',re,tot+' ÷ '+g+' = '+q+' reste '+re+'.');
   return pb(tot+' élèves vont au musée. Chaque auto 🚗 transporte '+g+' élèves. Combien d’autos faut-il pour que tous les élèves partent ?',q+1,tot+' ÷ '+g+' = '+q+' reste '+re+'. Les '+re+' élèves qui restent ont besoin d’une auto de plus : '+(q+1)+' autos.')})},
 {titre:'Les fractions',description:'Une pizza, des ballons, la moitié.',lecon:LEC_PB.concat(['Une fraction : le nombre de parts prises sur le nombre de parts égales.','La moitié = [1/2] : je partage en 2 parts égales.']),
  questions:()=>make(4112,r=>{const t=int(r,0,2),[p,il]=pick(r,PERS);
   if(t===0){const d=pick(r,[2,3,4,6,8]),n=int(r,1,d-1),faux=[d===2?'[1/3]':'['+n+'/'+(d-1)+']','['+d+'/'+n+']'].filter(x=>x!=='['+n+'/'+d+']');
    return chx(r,{texte:'Une pizza 🍕 est coupée en '+d+' parts égales. '+p+' mange '+n+' part'+(n>1?'s':'')+'. Quelle fraction de la pizza a-t-'+il+' mangée ?',oral:'Une pizza est coupée en '+d+' parts égales. '+p+' mange '+n+' part'+(n>1?'s':'')+'. Quelle fraction de la pizza a-t-'+il+' mangée ? Réponds : '+fracDit(n,d)+', ou une autre fraction.',visuel:{frac:{forme:'cercle',d,n}},aide:n+' part'+(n>1?'s':'')+' sur '+d+' : ['+n+'/'+d+'].'},['['+n+'/'+d+']',...[...new Set(faux)].slice(0,2)])}
   if(t===1){const tot=pick(r,[4,5,6,8]),n=int(r,1,tot-1);
    return chx(r,{texte:'Il y a '+tot+' ballons 🎈. '+n+' ballon'+(n>1?'s sont rouges':' est rouge')+'. Quelle fraction des ballons '+(n>1?'sont rouges':'est rouge')+' ?',oral:'Il y a '+tot+' ballons. '+n+(n>1?' sont rouges':' est rouge')+'. Quelle fraction des ballons est rouge ?',visuel:{frac:{forme:'ensemble',total:tot,n}},aide:n+' ballon'+(n>1?'s':'')+' sur '+tot+' : ['+n+'/'+tot+'].'},['['+n+'/'+tot+']','['+(tot-n)+'/'+tot+']','['+tot+'/'+n+']'].filter((x,i,l)=>l.indexOf(x)===i).concat(n===tot-n?['['+n+'/'+(tot+1)+']']:[]))}
   const n=2*int(r,2,10);return pb(p+' a '+n+' bonbons 🍬. '+Maj(il)+' en donne la moitié à sa sœur. Combien de bonbons donne-t-'+il+' ?',n/2,'La moitié de '+n+' : '+n+' ÷ 2 = '+n/2+'.')})},
 {titre:'Mesurer des longueurs',description:'Des rubans, des tables, une clôture.',lecon:LEC_PB.concat(['Je garde la même unité : des centimètres (cm) ou des mètres (m).']),
  questions:()=>make(4113,r=>{const t=int(r,0,2);
   if(t===0){const a=int(r,25,90),b=int(r,8,a-10);return pb('Un ruban mesure '+a+' cm. On en coupe '+b+' cm. Quelle longueur de ruban reste-t-il ?',a-b,aideSous(a,b).replace(/Réponse : (\d+)/,'Réponse : $1 cm'),{unite:'cm'})}
   if(t===1){const a=int(r,40,90),b=int(r,20,a-5);return pb('Une table mesure '+a+' cm de long. Le banc mesure '+b+' cm. Combien de centimètres la table a-t-elle de plus que le banc ?',a-b,a+' − '+b+' = '+(a-b)+' cm.',{unite:'cm'})}
   const l=int(r,3,9),w=int(r,2,l);return pb('Un jardin rectangulaire mesure '+l+' m de long et '+w+' m de large. On met une clôture tout autour. Combien de mètres de clôture faut-il ?',2*(l+w),'Le tour : '+l+' + '+w+' + '+l+' + '+w+' = '+2*(l+w)+' m.',{unite:'m'})})},
 {titre:'Le temps qui passe',description:'Des heures et des minutes.',lecon:LEC_PB.concat(['1 heure = 60 minutes.','Pour trouver une durée : l’heure de la fin moins l’heure du début.']),
  questions:()=>make(4114,r=>{const t=int(r,0,2),[p,il]=pick(r,PERS);
   if(t===0){const d=int(r,1,4),n=int(r,1,3);return pb('Le film commence à '+d+' h. Il dure '+n+' heure'+(n>1?'s':'')+'. À quelle heure finit-il ?',d+n,d+' h + '+n+' h = '+(d+n)+' h.',{unite:'h'})}
   if(t===1){const d=int(r,8,11),f=d+int(r,1,4);return pb('La sortie commence à '+d+' h et finit à '+f+' h. Combien d’heures dure la sortie ?',f-d,f+' − '+d+' = '+(f-d)+' heures.',{unite:'h'})}
   const a=pick(r,[10,15,20,25]),b=pick(r,[10,15,20,30]);return pb(p+' lit '+a+' minutes le matin et '+b+' minutes le soir. Combien de minutes lit-'+il+' dans la journée ?',a+b,a+' + '+b+' = '+(a+b)+' minutes.',{unite:'min'})})},
 {titre:'L’argent',description:'Payer, rendre la monnaie, économiser.',lecon:LEC_PB.concat(['Rendre la monnaie : l’argent donné moins le prix.','Économiser chaque semaine : des groupes égaux.']),
  questions:()=>make(4115,r=>{const t=int(r,0,3),[p,il]=pick(r,PERS);
   if(t===0){const prix=int(r,2,9),b=pick(r,[5,10,20].filter(x=>x>prix));return pb('Un jus coûte '+prix+' $. '+p+' paie avec un billet de '+b+' $. Combien d’argent lui rend-on ?',b-prix,b+' − '+prix+' = '+(b-prix)+' $.',{unite:'$'})}
   if(t===1){const a=int(r,2,9),b=int(r,1,6);return pb('Un cahier coûte '+a+' $ et un crayon coûte '+b+' $. Combien coûtent les deux ensemble ?',a+b,a+' + '+b+' = '+(a+b)+' $.',{unite:'$'})}
   if(t===2){const s=int(r,2,5),n=int(r,2,6);return pb(p+' économise '+s+' $ chaque semaine. Combien d’argent a-t-'+il+' après '+n+' semaines ?',s*n,s+' × '+n+' = '+s*n+' $.',{unite:'$'})}
   const a=int(r,10,30),prix=a+int(r,3,20);return pb(p+' a '+a+' $. '+Maj(il)+' veut acheter un jeu à '+prix+' $. Combien d’argent lui manque-t-il ?',prix-a,prix+' − '+a+' = '+(prix-a)+' $.',{unite:'$'})})},
 {titre:'Des suites dans la vie',description:'Chaque jour, chaque semaine : la même règle.',lecon:LEC_PB.concat(['Je trouve la règle : on ajoute toujours le même nombre.','Je continue la suite jusqu’à la réponse.']),
  questions:()=>make(4116,r=>{const t=int(r,0,1),[p,il]=pick(r,PERS);
   if(t===0){const s=pick(r,[2,3,5,10]),j=int(r,4,6);const l=Array.from({length:3},(_,k)=>s*(k+1));return pb(p+' lit '+s+' pages par jour. Après le jour 1 : '+l[0]+' pages. Jour 2 : '+l[1]+'. Jour 3 : '+l[2]+'. Combien de pages aura-t-'+il+' lues après le jour '+j+' ?',s*j,'La règle : + '+s+' chaque jour. '+Array.from({length:j},(_,k)=>s*(k+1)).join(', ')+'.',{visuel:{liste:l.concat(['…','?'])}})}
   const d=int(r,2,6),s=int(r,2,4),sem=int(r,4,5);return pb('Une plante mesure '+d+' cm. Elle grandit de '+s+' cm chaque semaine. Combien mesure-t-elle après '+sem+' semaines ?',d+s*sem,'La règle : + '+s+' cm chaque semaine. '+[d].concat(Array.from({length:sem},(_,k)=>d+s*(k+1))).join(', ')+' cm.',{unite:'cm'})})},
 {titre:'Défi : deux étapes',description:'Deux calculs pour une réponse.',lecon:LEC_PB.concat(['Il y a deux calculs à faire.','Je fais le premier calcul, puis j’utilise sa réponse pour le deuxième.']),
  questions:()=>make(4117,r=>{const t=int(r,0,2),[p,il]=pick(r,PERS);
   if(t===0){const a=int(r,10,20),b=int(r,2,6),c=int(r,1,4);if(b+c>=a)return null;return pb(p+' a '+a+' $. '+Maj(il)+' achète un livre à '+b+' $ et un crayon à '+c+' $. Combien d’argent lui reste-t-il ?',a-b-c,'1) '+b+' + '+c+' = '+(b+c)+' $. 2) '+a+' − '+(b+c)+' = '+(a-b-c)+' $.',{unite:'$'})}
   if(t===1){const g=int(r,2,4),n=int(r,4,8),d=int(r,1,g*n-2);return pb('Il y a '+g+' sacs de '+n+' billes. '+p+' donne '+d+' billes à son ami. Combien de billes reste-t-il ?',g*n-d,'1) '+g+' × '+n+' = '+g*n+' billes. 2) '+g*n+' − '+d+' = '+(g*n-d)+'.')}
   const a=int(r,8,15),b=int(r,2,6),c=int(r,2,8);return pb('Il y a '+a+' personnes dans l’autobus 🚌. À l’arrêt, '+b+' personnes descendent et '+c+' personnes montent. Combien de personnes y a-t-il maintenant ?',a-b+c,'1) '+a+' − '+b+' = '+(a-b)+'. 2) '+(a-b)+' + '+c+' = '+(a-b+c)+'.')})}
 ]};


/* ============================ MULTIPLICATION TABLES ============================ */
/* One level per table, then mixed tables and the missing factor. Pictures of groups for the first questions of the small tables. */
const EMO_T=['🍎','⭐','🔵','🟢','🍪'];
function tableQ(r,t,k,blank){const e=pick(r,EMO_T);const extra={aide:k+' × '+t+', c’est '+k+' groupes de '+t+'. Compte de '+t+' en '+t+'.'};if(t<=5&&k<=5&&blank===2)extra.dessin=Array(k).fill(rep(e,t).replace(/ /g,'')).join('\u2003\u2003');return r()<.5?calc(k,'×',t,blank,extra):calc(t,'×',k,blank,Object.assign({},extra,{aide:t+' × '+k+' = '+k+' × '+t+'. Compte de '+t+' en '+t+'.'}))}
const LEC_T={1:['Multiplier par 1 ne change rien : 1 × 7 = 7.'],2:['× 2, c’est le double : 2 × 6 = 6 + 6 = 12.','Compte de 2 en 2 : 2, 4, 6, 8, 10…'],3:['Compte de 3 en 3 : 3, 6, 9, 12, 15…'],4:['× 4, c’est le double du double : 4 × 3 = 6 + 6 = 12.','Compte de 4 en 4 : 4, 8, 12, 16, 20…'],5:['Compte de 5 en 5 : 5, 10, 15, 20…','Le résultat finit toujours par 0 ou par 5.'],6:['6 × 4 = 5 × 4 + 4 = 20 + 4 = 24.','Compte de 6 en 6 : 6, 12, 18, 24, 30…'],7:['7 × 3 = 5 × 3 + 2 × 3 = 15 + 6 = 21.','Compte de 7 en 7 : 7, 14, 21, 28, 35…'],8:['× 8, c’est le double de × 4 : 8 × 3 = 12 + 12 = 24.','Compte de 8 en 8 : 8, 16, 24, 32, 40…'],9:['9 × 4 = 10 × 4 − 4 = 40 − 4 = 36.','Les deux chiffres du résultat font 9 : 36 → 3 + 6 = 9.'],10:['× 10 : on ajoute un 0 à la fin : 10 × 7 = 70.']};
function niveauTable(t,seed){return{titre:'La table de '+t,description:t+' × 1 jusqu’à '+t+' × 10.',lecon:LEC_T[t],questions:()=>make(seed,(r,i)=>{const k=int(r,1,10);return tableQ(r,t,k,i<10?2:pick(r,[0,1,2]))})}}
const tables={id:'tables',titre:'Les tables de multiplication',icone:'×',couleur:'#7a4fb5',
 consigne:'Écris le nombre manquant dans la case jaune.',
 niveaux:[
 niveauTable(2,2201),niveauTable(3,2202),niveauTable(4,2203),niveauTable(5,2204),niveauTable(6,2205),niveauTable(7,2206),niveauTable(8,2207),niveauTable(9,2208),
 {titre:'Les tables de 1 et de 10',description:'Les plus faciles.',lecon:LEC_T[1].concat(LEC_T[10]),questions:()=>make(2209,(r,i)=>tableQ(r,pick(r,[1,10]),int(r,1,10),i<11?2:pick(r,[0,1])))},
 {titre:'Tables de 2 à 5 mélangées',description:'2, 3, 4 et 5.',lecon:['Si tu ne sais pas, compte par bonds : 4 × 3 → 3, 6, 9, 12.'],questions:()=>make(2210,r=>tableQ(r,int(r,2,5),int(r,1,10),2))},
 {titre:'Tables de 6 à 9 mélangées',description:'Les plus difficiles.',lecon:['Utilise une table que tu connais : 7 × 6 = 5 × 6 + 2 × 6 = 30 + 12 = 42.'],questions:()=>make(2211,r=>tableQ(r,int(r,6,9),int(r,2,10),2))},
 {titre:'Toutes les tables',description:'De 1 à 10, dans le désordre.',lecon:['L’ordre ne change rien : 3 × 8 = 8 × 3.'],questions:()=>make(2212,r=>tableQ(r,int(r,1,10),int(r,1,10),2))},
 {titre:'Le nombre qui manque',description:'Quel nombre multiplier ?',lecon:['6 × ? = 30 : compte de 6 en 6 jusqu’à 30. 6, 12, 18, 24, 30 → 5 bonds.'],questions:()=>make(2213,r=>tableQ(r,int(r,2,9),int(r,2,10),pick(r,[0,1])))}
 ]};

/* ============================ MATHHORIZON ============================
   Extra-support levels for students who need more time (ASD):
   - a model to look at first ("Regarde"), shown on every exercise;
   - one short instruction, small numbers, only 8 exercises;
   - usually: exercises 1 to 4 = pick between 2 answers, 5 to 8 = write the answer.
   They are appended AFTER the regular levels, so the level numbers
   already saved for the students do not change. */
{ // block scope: these names stay local
const HZ_TAG='MathHorizon · ';
/* liste: 8 builders f(r, firstHalf) → question */
function hzNiveau(titre,description,modele,seed,liste){return{hz:true,titre:HZ_TAG+titre,description,modele,questions:()=>{const r=rng(seed);return liste.map((f,k)=>f(r,k<4))}}}
/* Choice between 2 answers in the first half, written answer in the second half. */
const hzQ=(base,bonne,fausse,ecrit)=>(r,choix)=>choix?chx(r,Object.assign({},base),[mil(bonne),mil(fausse)]):Object.assign({type:'nombre',reponse:bonne},base,ecrit||{});
/* Always a choice between 2 answers (words, signs…). */
const hzC=(base,bonne,fausse)=>r=>chx(r,Object.assign({},base),[bonne,fausse]);
/* A ready-made question of another type (columns, clock, grid…). */
const hzF=q=>()=>q;
const EMH=['🍎','⭐','🔵','🟢','🍪'];
const dots=(e,n)=>Array(n).fill(e).join('');
const compte=(pas,n,depart)=>Array.from({length:n},(_,k)=>mil((depart||pas)+k*pas)).join(', ');
const de1a=(a,b)=>Array.from({length:b-a+1},(_,k)=>a+k).join(', ');
const H={};
const ajoute=(id,...niv)=>{H[id]=niv};

/* ---------- Shapes ---------- */
const NOMF={cercle:'Cercle',carre:'Carré',triangle:'Triangle',rectangle:'Rectangle'};
const AIDEF={cercle:'Le cercle est tout rond.',carre:'Le carré a 4 côtés droits et pareils.',triangle:'Le triangle a 3 côtés.',rectangle:'Le rectangle a 4 côtés : 2 longs et 2 courts.'};
const hzForme=(f,autre)=>hzC({texte:'Quel est le nom de cette forme ?',visuel:{forme:f,rotation:0},aide:AIDEF[f]},NOMF[f],NOMF[autre]);
const COTES={triangle:3,carre:4,rectangle:4,pentagone:5,hexagone:6};
ajoute('formes',
 hzNiveau('Le cercle et le carré','Deux formes seulement.',{texte:'Le carré a 4 côtés pareils. Le cercle est tout rond.',visuel:{forme:'carre'}},2901,['cercle','carre','carre','cercle','cercle','carre','carre','cercle'].map(f=>hzForme(f,f==='cercle'?'carre':'cercle'))),
 hzNiveau('Le triangle et le rectangle','Deux formes seulement.',{texte:'Le triangle a 3 côtés. Le rectangle a 4 côtés.',visuel:{forme:'triangle'}},2902,['triangle','rectangle','rectangle','triangle','rectangle','triangle','triangle','rectangle'].map(f=>hzForme(f,f==='triangle'?'rectangle':'triangle'))),
 hzNiveau('Compter les côtés','Avec ton doigt : 1, 2, 3…',{texte:'Le triangle a 3 côtés : 1, 2, 3.',visuel:{forme:'triangle'}},2903,['carre','triangle','rectangle','pentagone','triangle','carre','hexagone','pentagone'].map(f=>hzQ({texte:'Combien de côtés a cette forme ?',visuel:{forme:f,rotation:0},aide:'Mets ton doigt sur un côté et fais le tour en comptant : 1, 2, 3…'},COTES[f],COTES[f]+1)))
);

/* ---------- Calculations ---------- */
const hzPlus=(a,b,k,dessin)=>hzQ({texte:a+' + '+b+' = ?',oral:a+' plus '+b+', combien ?',visuel:dessin===false?undefined:{grand:dots(EMH[k%5],a)+'  +  '+dots(EMH[k%5],b)},aide:'Compte tous les dessins : '+de1a(1,a+b)+'.'},a+b,a+b+1);
const hzMoins=(a,b,k)=>hzQ({texte:a+' − '+b+' = ?',oral:a+' moins '+b+', combien ?',visuel:{grand:dots(EMH[k%5],a-b)+dots('❌',b)},aide:'Les ❌ sont enlevés. Compte les dessins qui restent : '+de1a(1,a-b)+'.'},a-b,a-b+1);
ajoute('calculs',
 hzNiveau('Additionner avec des dessins','Jusqu’à 5.',{texte:'2 + 1 : je compte tous les dessins. 1, 2, 3. Donc 2 + 1 = 3.',visuel:{grand:'🍎🍎  +  🍎'}},2911,[[1,1],[2,1],[1,3],[2,2],[3,1],[2,3],[1,4],[3,2]].map(([a,b],k)=>hzPlus(a,b,k))),
 hzNiveau('Enlever avec des dessins','Jusqu’à 5.',{texte:'4 − 1 : on enlève 1 (❌). Il reste 3 dessins. Donc 4 − 1 = 3.',visuel:{grand:'🍎🍎🍎❌'}},2912,[[3,1],[4,2],[5,1],[4,1],[5,2],[3,2],[5,3],[4,3]].map(([a,b],k)=>hzMoins(a,b,k))),
 hzNiveau('Additionner jusqu’à 10','Avec des dessins.',{texte:'4 + 2 : je pars de 4, puis je compte 5, 6. Donc 4 + 2 = 6.',visuel:{grand:'🔵🔵🔵🔵  +  🔵🔵'}},2913,[[4,2],[3,3],[5,2],[2,6],[4,4],[5,3],[6,3],[5,5]].map(([a,b],k)=>hzQ({texte:a+' + '+b+' = ?',oral:a+' plus '+b+', combien ?',visuel:{grand:dots(EMH[k%5],a)+'  +  '+dots(EMH[k%5],b)},aide:'Pars de '+a+' et compte en avançant : '+de1a(a+1,a+b)+'.'},a+b,a+b+1)))
);

/* ---------- Multiplication tables ---------- */
const hzTable=(t,k,i)=>hzQ({texte:k+' × '+t+' = ?',oral:k+' groupes de '+t+', combien ?',visuel:{grand:Array(k).fill(dots(EMH[i%5],t)).join('   ')},aide:k+' groupes de '+t+'. Compte de '+t+' en '+t+' : '+compte(t,k)+'.'},k*t,k*t+1);
const LH=[1,2,3,2,4,3,5,1];
ajoute('tables',
 hzNiveau('La table de 2','Des groupes de 2.',{texte:'3 × 2 : 3 groupes de 2. Je compte 2, 4, 6. Donc 3 × 2 = 6.',visuel:{grand:'🍎🍎   🍎🍎   🍎🍎'}},2921,LH.map((k,i)=>hzTable(2,k,i))),
 hzNiveau('La table de 5','Des groupes de 5.',{texte:'2 × 5 : 2 groupes de 5. Je compte 5, 10. Donc 2 × 5 = 10.',visuel:{grand:'⭐⭐⭐⭐⭐   ⭐⭐⭐⭐⭐'}},2922,LH.map((k,i)=>hzTable(5,k,i))),
 hzNiveau('La table de 10','Des groupes de 10.',{texte:'2 × 10 : 2 groupes de 10. Je compte 10, 20. Donc 2 × 10 = 20.',visuel:{blocs:{d:2}}},2923,LH.map(k=>hzQ({texte:k+' × 10 = ?',oral:k+' groupes de 10, combien ?',visuel:{blocs:{d:k}},aide:'Compte de 10 en 10 : '+compte(10,k)+'.'},k*10,k*10+1)))
);

/* ---------- Missing number ---------- */
const hzTrou=(a,s,k)=>(r,c)=>hzQ({texte:a+' + ? = '+s,oral:a+' plus combien égale '+s+' ?',visuel:c?{grand:dots(EMH[k%5],a)+' + ❓ = '+s}:undefined,aide:'Compte à partir de '+a+' jusqu’à '+s+' : '+de1a(a+1,s)+'. Tu as compté '+(s-a)+'.'},s-a,s-a+1)(r,c);
ajoute('completer',
 hzNiveau('Le nombre caché jusqu’à 5','? + … = …',{texte:'2 + ? = 5. Je compte de 2 jusqu’à 5 : 3, 4, 5. J’ai compté 3. Donc 2 + 3 = 5.',visuel:{grand:'🍎🍎 + 🍎🍎🍎 = 5'}},2931,[[2,3],[1,4],[3,5],[2,4],[1,3],[4,5],[3,4],[2,5]].map(([a,s],k)=>hzTrou(a,s,k))),
 hzNiveau('Le nombre caché jusqu’à 10','',{texte:'6 + ? = 8. Je compte de 6 jusqu’à 8 : 7, 8. J’ai compté 2. Donc 6 + 2 = 8.',visuel:{grand:'6 + 2 = 8'}},2932,[[5,7],[6,9],[4,8],[7,10],[3,6],[5,9],[8,10],[2,7]].map(([a,s],k)=>hzTrou(a,s,k))),
 hzNiveau('La soustraction cachée','… − ? = …',{texte:'5 − ? = 3. Combien faut-il enlever ? 5, 4, 3 : on enlève 2. Donc 5 − 2 = 3.',visuel:{grand:'🍎🍎🍎❌❌'}},2933,[[5,3],[4,1],[6,4],[5,2],[7,5],[6,3],[8,6],[9,5]].map(([s,v],k)=>(r,c)=>hzQ({texte:s+' − ? = '+v,oral:s+' moins combien égale '+v+' ?',visuel:c?{grand:dots(EMH[k%5],v)+dots('❓',s-v)}:undefined,aide:'Recule de '+s+' jusqu’à '+v+' en comptant les pas : il y en a '+(s-v)+'.'},s-v,s-v+1)(r,c)))
);

/* ---------- Fractions ---------- */
const hzFrac=(forme,d,n,autre)=>(r,c)=>c?chx(r,{texte:'Quelle fraction est coloriée ?',visuel:{frac:{forme,d,n}},aide:n+' part'+(n>1?'s':'')+' coloriée'+(n>1?'s':'')+' sur '+d+' parts égales : '+F(n,d)+'.'},[F(n,d),autre])
  :(r()<.5?{type:'nombre',texte:'En combien de parts égales est-ce partagé ?',visuel:{frac:{forme,d,n}},reponse:d,aide:'Compte toutes les parts, coloriées ou non.'}:{type:'nombre',texte:'Combien de parts sont coloriées ?',visuel:{frac:{forme,d,n}},reponse:n,aide:'Compte seulement les parts en couleur.'});
ajoute('fractions',
 hzNiveau('La moitié','2 parts égales.',{texte:'Coupé en 2 parts égales, 1 part coloriée : [1/2], une moitié.',visuel:{frac:{forme:'cercle',d:2,n:1}}},2941,[['barre',1],['cercle',2],['cercle',1],['barre',2],['barre',1],['cercle',1],['barre',2],['cercle',1]].map(([f,n])=>hzFrac(f,2,n,F(n===1?2:1,2)))),
 hzNiveau('Les quarts','4 parts égales.',{texte:'Coupé en 4 parts égales, 3 parts coloriées : [3/4].',visuel:{frac:{forme:'barre',d:4,n:3}}},2942,[['barre',1],['cercle',3],['barre',2],['cercle',1],['barre',3],['cercle',2],['barre',1],['cercle',3]].map(([f,n])=>hzFrac(f,4,n,F(n===2?1:4-n,4)))),
 hzNiveau('Demi, tiers, quart','Une part coloriée.',{texte:'Le nombre du bas dit en combien de parts on coupe : [1/3], c’est 1 part sur 3.',visuel:{frac:{forme:'barre',d:3,n:1}}},2943,[['barre',2,3],['cercle',3,4],['barre',4,2],['cercle',2,4],['barre',3,2],['cercle',4,3],['barre',2,4],['cercle',3,2]].map(([f,d,a])=>hzFrac(f,d,1,F(1,a))))
);

/* ---------- Sharing and division ---------- */
const hzPart=(t,g,qui)=>hzQ({texte:'Partage '+t+' jetons entre '+g+' '+qui+'. Combien pour chacun ?',visuel:{jetons:t,groupes:g},aide:'Donne un jeton à chacun, chacun son tour, jusqu’à ce qu’il n’en reste plus. Chacun en a '+(t/g)+'.'},t/g,t/g+1);
ajoute('division',
 hzNiveau('Diviser par 2 avec des jetons','Partager en 2.',{texte:'6 ÷ 2 : 6 jetons pour 2 amis. Un pour toi, un pour moi… Chacun en a 3.',visuel:{jetons:6,groupes:2}},2951,[4,6,2,8,6,10,4,8].map(t=>hzPart(t,2,'amis'))),
 hzNiveau('Diviser par 3 avec des jetons','Partager en 3.',{texte:'6 ÷ 3 : 6 jetons pour 3 amis. Chacun en a 2.',visuel:{jetons:6,groupes:3}},2952,[6,3,9,12,6,9,3,12].map(t=>hzPart(t,3,'amis'))),
 hzNiveau('× et ÷ vont ensemble','Une table aide à diviser.',{texte:'3 × 2 = 6, donc 6 ÷ 2 = 3.',visuel:{grand:'3 × 2 = 6   →   6 ÷ 2 = 3'}},2953,[[2,3],[5,2],[10,2],[2,4],[5,3],[2,5],[10,3],[5,4]].map(([b,q])=>hzQ({texte:(b*q)+' ÷ '+b+' = ?',oral:(b*q)+' divisé par '+b+', combien ?',visuel:{grand:q+' × '+b+' = '+(b*q)},aide:q+' × '+b+' = '+(b*q)+', donc '+(b*q)+' ÷ '+b+' = '+q+'.'},q,q+1)))
);
ajoute('partage',
 hzNiveau('Partager entre 2 personnes','Petits nombres.',{texte:'6 jetons pour 2 personnes : un pour toi, un pour moi… Chacun en a 3.',visuel:{jetons:6,groupes:2}},2961,[2,4,6,4,8,6,10,2].map(t=>hzPart(t,2,'personnes'))),
 hzNiveau('Partager entre 3 personnes','Petits nombres.',{texte:'6 jetons pour 3 personnes : chacun en a 2.',visuel:{jetons:6,groupes:3}},2962,[3,6,9,6,3,9,12,6].map(t=>hzPart(t,3,'personnes'))),
 hzNiveau('Partager entre 4 personnes','Petits nombres.',{texte:'8 jetons pour 4 personnes : chacun en a 2.',visuel:{jetons:8,groupes:4}},2963,[4,8,12,4,8,12,16,8].map(t=>hzPart(t,4,'personnes')))
);

/* ---------- Tens ---------- */
ajoute('dizaines',
 hzNiveau('La barre de 10','1, 2 ou 3 barres.',{texte:'1 barre = 10 cubes.',visuel:{blocs:{d:1}}},1551,[1,2,1,3,2,3,1,2].map(d=>hzQ({texte:'Combien de cubes ?',oral:'Compte les barres : dix, vingt… Combien de cubes ?',visuel:{blocs:{d}},aide:'Compte avec ton doigt : '+compte(10,d)+'.'},d*10,d))),
 hzNiveau('Compter de 10 en 10','10, 20, 30…',{texte:'On ajoute 1 barre : + 10.',visuel:{grand:'10, 20, 30'}},1552,[10,20,30,10,40,20,50,30].map(d=>hzQ({texte:'Quel nombre vient après ?',oral:'Quel nombre vient après ? '+d+', '+(d+10),visuel:{grand:d+', '+(d+10)+', ?'},aide:'On ajoute 1 barre : + 10. '+(d+10)+' + 10 = '+(d+20)+'.'},d+20,d+11))),
 hzNiveau('Barres et cubes','Un peu de barres, un peu de cubes.',{texte:'1 barre et 2 cubes : 10, 11, 12.',visuel:{blocs:{d:1,u:2}}},1553,[[2,1],[1,3],[2,2],[1,1],[3,1],[2,3],[1,4],[3,2]].map(([d,u])=>hzQ({texte:'Combien de cubes ?',oral:'Compte les barres, puis les cubes. Combien de cubes ?',visuel:{blocs:{d,u}},aide:'Les barres : '+compte(10,d)+'. Puis les cubes : '+de1a(d*10+1,d*10+u)+'.'},d*10+u,d+u)))
);

/* ---------- Hundreds ---------- */
const hzPlaques=c=>hzQ({texte:'Combien de cubes ?',oral:'Compte les plaques : cent, deux cents… Combien de cubes ?',visuel:{blocs:{c}},aide:'Compte avec ton doigt : '+compte(100,c)+'.'},c*100,c*10);
const hzSuite100=d=>hzQ({texte:'Quel nombre vient après ?',oral:'Quel nombre vient après ? '+d+', '+(d+100),visuel:{grand:d+', '+(d+100)+', ?'},aide:'On ajoute 1 plaque : + 100. '+(d+100)+' + 100 = '+(d+200)+'.'},d+200,d+101);
const hzPlBar=(c,d)=>hzQ({texte:'Combien de cubes ?',oral:'Compte les plaques, puis les barres. Combien de cubes ?',visuel:{blocs:{c,d}},aide:'Les plaques : '+compte(100,c)+'. Puis les barres : '+compte(10,d,c*100+10)+'.'},c*100+d*10,c+d);
ajoute('centaines',
 hzNiveau('La plaque de 100','1, 2 ou 3 plaques.',{texte:'1 plaque = 100 cubes.',visuel:{blocs:{c:1}}},1651,[1,2,1,3,2,3,1,2].map(hzPlaques)),
 hzNiveau('Compter de 100 en 100','100, 200, 300…',{texte:'On ajoute 1 plaque : + 100.',visuel:{grand:'100, 200, 300'}},1652,[100,200,300,100,400,200,500,300].map(hzSuite100)),
 hzNiveau('Plaques et barres','Un peu de plaques, un peu de barres.',{texte:'1 plaque et 2 barres : 100, 110, 120.',visuel:{blocs:{c:1,d:2}}},1653,[[1,1],[2,1],[1,3],[2,2],[1,2],[3,1],[2,3],[1,1]].map(([c,d])=>hzPlBar(c,d)))
);

/* ---------- Thousands ---------- */
const hzGros=m=>hzQ({texte:'Combien de cubes ?',oral:'Compte les gros cubes : mille, deux mille… Combien de cubes ?',visuel:{blocs:{m}},aide:'Compte avec ton doigt : '+compte(1000,m)+'.'},m*1000,m*100);
const hzSuite1000=d=>hzQ({texte:'Quel nombre vient après ?',oral:'Quel nombre vient après ? '+d+', '+(d+1000),visuel:{grand:mil(d)+', '+mil(d+1000)+', ?'},aide:'On ajoute 1 gros cube : + 1 000. '+mil(d+1000)+' + 1 000 = '+mil(d+2000)+'.'},d+2000,d+1100);
const hzCombienM=m=>hzQ({texte:mil(m*1000)+', c’est combien de gros cubes ?',oral:m*1000+', c’est combien de gros cubes ?',visuel:{blocs:{m}},aide:'Compte les gros cubes : '+compte(1000,m)+'. Ça fait '+pl(m,'gros cube')+'.'},m,m*10);
ajoute('milliers',
 hzNiveau('Le gros cube','1, 2 ou 3 gros cubes.',{texte:'10 plaques font 1 gros cube. 1 gros cube = 1 000 cubes.',visuel:{blocs:{m:1}}},1751,[1,2,1,3,2,3,1,2].map(hzGros)),
 hzNiveau('Compter de 1 000 en 1 000','1 000, 2 000, 3 000…',{texte:'On ajoute 1 gros cube : + 1 000.',visuel:{grand:'1 000, 2 000, 3 000'}},1752,[1000,2000,3000,1000,4000,2000,5000,3000].map(hzSuite1000)),
 hzNiveau('Combien de milliers ?','3 000, c’est 3 gros cubes.',{texte:'2 000, c’est 2 gros cubes.',visuel:{blocs:{m:2}}},1753,[3,1,4,2,5,1,3,2].map(hzCombienM))
);

/* ---------- Place value ---------- */
ajoute('valeur',
 hzNiveau('Combien de barres ?','Les barres sont les dizaines.',{texte:'23 : 2 barres (2 dizaines) et 3 cubes (3 unités).',visuel:{blocs:{d:2,u:3}}},1291,[[3,1],[1,4],[4,2],[2,5],[3,4],[5,1],[1,3],[4,3]].map(([d,u])=>hzQ({texte:'Combien de barres (dizaines) ?',visuel:{blocs:{d,u}},aide:'Compte seulement les barres de 10 : il y en a '+d+'.'},d,u))),
 hzNiveau('Le chiffre des dizaines','Le chiffre de gauche.',{texte:'34 : le 3 est aux dizaines. 3 dizaines = 30.',visuel:{chiffres:{n:34,pos:1}}},1292,[52,17,46,29,63,71,58,24].map(n=>hzQ({texte:'Dans '+n+', combien de dizaines ?',visuel:{chiffres:{n,pos:1}},aide:'Le chiffre de gauche (en couleur) dit les dizaines : '+chif(n,1)+'.'},chif(n,1),chif(n,0)))),
 hzNiveau('Le chiffre des unités','Le chiffre de droite.',{texte:'26 : le 6 est aux unités, tout à droite.',visuel:{chiffres:{n:26,pos:0}}},1293,[41,83,57,32,64,19,75,38].map(n=>hzQ({texte:'Dans '+n+', combien d’unités ?',visuel:{chiffres:{n,pos:0}},aide:'Le chiffre de droite (en couleur) dit les unités : '+chif(n,0)+'.'},chif(n,0),chif(n,1))))
);
ajoute('composer',
 hzNiveau('Dizaines et unités → un nombre','Avec des blocs.',{texte:'2 dizaines et 3 unités : j’écris 2, puis 3 → 23.',visuel:{blocs:{d:2,u:3}}},1491,[[3,1],[1,5],[4,2],[2,6],[3,4],[5,1],[1,2],[2,4]].map(([d,u])=>hzQ({texte:pl(d,'dizaine')+' et '+plU(u)+' = ?',visuel:{blocs:{d,u}},aide:'J’écris '+d+' (les dizaines), puis '+u+' (les unités) : '+(d*10+u)+'.'},d*10+u,u*10+d))),
 hzNiveau('Décomposer','34 = 30 + 4',{texte:'34, c’est 30 et 4. Donc 34 = 30 + 4.',visuel:{grand:'34 = 30 + 4'}},1492,[52,27,46,61,38,73,45,29].map(n=>hzQ({texte:n+' = '+(chif(n,1)*10)+' + ?',oral:n+' égale '+(chif(n,1)*10)+' plus combien ?',visuel:{chiffres:{n,pos:0}},aide:'Le chiffre des unités : '+chif(n,0)+'. '+n+' = '+(chif(n,1)*10)+' + '+chif(n,0)+'.'},chif(n,0),chif(n,1)))),
 hzNiveau('Avec une centaine','1 plaque, des barres, des cubes.',{texte:'1 centaine, 2 dizaines et 3 unités : 123.',visuel:{blocs:{c:1,d:2,u:3}}},1493,[[1,4],[3,2],[2,1],[4,3],[1,2],[3,5],[2,4],[5,1]].map(([d,u])=>hzQ({texte:'1 centaine, '+pl(d,'dizaine')+' et '+plU(u)+' = ?',visuel:{blocs:{c:1,d,u}},aide:'J’écris 1, puis '+d+', puis '+u+' : '+(100+d*10+u)+'.'},100+d*10+u,100+u*10+d)))
);

/* ---------- The equal sign ---------- */
ajoute('egal',
 hzNiveau('Le signe = veut dire « pareil »','Les deux côtés font le même nombre.',{texte:'2 + 2 et 3 + 1 font 4 tous les deux : c’est pareil. 2 + 2 = 3 + 1.',visuel:{grand:'🔵🔵 + 🔵🔵  =  🔵🔵🔵 + 🔵'}},1591,[
   ...[[2,2,3,1],[3,1,2,1],[1,4,2,3],[2,3,4,2]].map(([a,b,c,d])=>hzC({texte:a+' + '+b+' et '+c+' + '+d+' : est-ce pareil ?',visuel:{grand:dots('🔵',a)+' + '+dots('🔵',b)+'   ?   '+dots('🔵',c)+' + '+dots('🔵',d)},aide:a+' + '+b+' = '+(a+b)+' et '+c+' + '+d+' = '+(c+d)+'.'},a+b===c+d?'Oui, c’est pareil':'Non, ce n’est pas pareil',a+b===c+d?'Non, ce n’est pas pareil':'Oui, c’est pareil')),
   ...[[3,2],[4,1],[2,4],[1,5]].map(([a,b])=>hzQ({texte:a+' + '+b+' = ?',visuel:{grand:dots('🔵',a)+' + '+dots('🔵',b)},aide:'Compte tous les points : '+(a+b)+'.'},a+b,a+b+1))]),
 hzNiveau('Plusieurs façons de faire 5','… + ? = 5',{texte:'5 = 4 + 1 = 3 + 2 = 2 + 3.',visuel:{grand:'🍎🍎🍎🍎🍎'}},1592,[1,3,2,4,0,2,3,1].map(a=>hzQ({texte:a+' + ? = 5',oral:a+' plus combien égale 5 ?',visuel:{grand:dots('🍎',a)+' + ❓ = 🍎🍎🍎🍎🍎'},aide:'Compte de '+a+' jusqu’à 5 : il manque '+(5-a)+'.'},5-a,6-a))),
 hzNiveau('Équilibrer les deux côtés','… + … = … + ?',{texte:'3 + 2 = 4 + ? → 3 + 2 = 5, et 4 + 1 = 5. Donc ? = 1.',visuel:{grand:'3 + 2 = 4 + 1'}},1593,[[2,2,3],[3,2,4],[1,3,2],[4,2,5],[2,3,1],[3,3,4],[5,1,2],[2,4,3]].map(([a,b,c])=>hzQ({texte:a+' + '+b+' = '+c+' + ?',oral:a+' plus '+b+' égale '+c+' plus combien ?',aide:'D’abord le côté gauche : '+a+' + '+b+' = '+(a+b)+'. Puis '+c+' + ? = '+(a+b)+'.'},a+b-c,a+b-c+1)))
);

/* ---------- Comparing ---------- */
const hzGrandPetit=(a,b,k,grand)=>hzC({texte:'Quel nombre est le plus '+(grand?'grand':'petit')+' ?',visuel:{grand:k<4?a+' '+dots('🔵',a)+'     '+b+' '+dots('🔵',b):a+'     '+b},aide:k<4?'Regarde les points : le plus '+(grand?'grand a le plus':'petit a le moins')+' de points.':'Compare d’abord les dizaines, puis les unités.'},String(grand?Math.max(a,b):Math.min(a,b)),String(grand?Math.min(a,b):Math.max(a,b)));
const PAIRES=[[3,5],[7,2],[4,6],[8,5],[12,15],[18,11],[14,19],[20,16]];
ajoute('comparer',
 hzNiveau('Le plus grand','Jusqu’à 20.',{texte:'5 a plus de points que 3 : 5 est le plus grand.',visuel:{grand:'3 🔵🔵🔵     5 🔵🔵🔵🔵🔵'}},1891,PAIRES.map(([a,b],k)=>hzGrandPetit(a,b,k,true))),
 hzNiveau('Le plus petit','Jusqu’à 20.',{texte:'3 a moins de points que 5 : 3 est le plus petit.',visuel:{grand:'3 🔵🔵🔵     5 🔵🔵🔵🔵🔵'}},1892,PAIRES.map(([a,b],k)=>hzGrandPetit(b,a,k,false))),
 hzNiveau('Le signe < ou >','La pointe montre le plus petit.',{texte:'La pointe montre toujours le plus petit nombre : 3 < 8 et 8 > 3.',visuel:{grand:'3 < 8'}},1893,[[3,8],[9,4],[2,6],[7,1],[12,15],[18,13],[10,20],[16,11]].map(([a,b])=>hzC({signe:true,texte:'Choisis le bon signe : '+a+' ? '+b,visuel:{grand:a+'  ?  '+b},oral:'Compare '+a+' et '+b+'.',aide:'La pointe montre le plus petit : '+Math.min(a,b)+'.'},a<b?'<':'>',a<b?'>':'<')))
);
ajoute('situer',
 hzNiveau('Juste après','On ajoute 1.',{texte:'Juste après 6, c’est 7 : on ajoute 1.',visuel:{liste:[5,6,7]}},1991,[4,7,2,9,5,12,15,18].map(n=>hzQ({texte:'Quel nombre vient juste après '+n+' ?',visuel:{liste:[n-1,n,'?']},aide:n+' + 1 = '+(n+1)+'.'},n+1,n-1))),
 hzNiveau('Juste avant','On enlève 1.',{texte:'Juste avant 6, c’est 5 : on enlève 1.',visuel:{liste:[5,6,7]}},1992,[5,8,3,10,6,13,16,20].map(n=>hzQ({texte:'Quel nombre vient juste avant '+n+' ?',visuel:{liste:['?',n,n+1]},aide:n+' − 1 = '+(n-1)+'.'},n-1,n+1))),
 hzNiveau('Entre deux nombres','Le nombre du milieu.',{texte:'Entre 4 et 6, il y a 5 : 4, 5, 6.',visuel:{liste:[4,5,6]}},1993,[3,6,8,4,11,14,17,19].map(n=>hzQ({texte:'Quel nombre est entre '+(n-1)+' et '+(n+1)+' ?',visuel:{liste:[n-1,'?',n+1]},aide:'Compte : '+(n-1)+', '+n+', '+(n+1)+'.'},n,n+2)))
);

/* ---------- Kinds of numbers ---------- */
const PI=n=>n%2===0?'pair':'impair',AUTRE=n=>n%2===0?'impair':'pair';
ajoute('sortes',
 hzNiveau('Pair ou impair avec des points','Jusqu’à 10.',{texte:'5 : un point est tout seul → impair. Si tous les points ont un ami → pair.',visuel:{motif:{forme:'paires',n:5}}},2091,[4,3,6,5,8,7,2,9].map(n=>hzC({texte:'Fais des paires. '+n+' est-il pair ou impair ?',visuel:{motif:{forme:'paires',n}},aide:n%2===0?'Tous les points ont un ami : '+n+' est pair.':'Un point est tout seul : '+n+' est impair.'},PI(n),AUTRE(n)))),
 hzNiveau('Compter de 2 en 2','2, 4, 6…',{texte:'On saute un nombre : 2, 4, 6, 8.',visuel:{suite:[2,4,6,8]}},2092,[2,4,0,6,2,8,4,10].map(s=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s+2,s+4]},aide:'On ajoute 2 : '+(s+4)+' + 2 = '+(s+6)+'.'},s+6,s+5))),
 hzNiveau('Regarder le dernier chiffre','0, 2, 4, 6, 8 → pair.',{texte:'Si le nombre finit par 0, 2, 4, 6 ou 8, il est pair.',visuel:{grand:'0  2  4  6  8  → pair'}},2093,[12,17,24,15,30,21,28,13].map(n=>hzC({texte:n+' est-il pair ou impair ? Regarde le dernier chiffre.',visuel:{chiffres:{n,pos:0}},aide:'Le dernier chiffre est '+chif(n,0)+' : '+n+' est '+PI(n)+'.'},PI(n),AUTRE(n))))
);
ajoute('proprietes',
 hzNiveau('+ 0 ne change rien','Ajouter 0, c’est ne rien ajouter.',{texte:'5 + 0 = 5 : on n’ajoute rien.',visuel:{grand:'🍎🍎🍎🍎🍎 + 0 = 5'}},2191,[5,3,8,2,7,4,9,6].map(a=>hzQ({texte:a+' + 0 = ?',visuel:{grand:dots('🍎',a)+' + 0'},aide:'On n’ajoute rien : il reste '+a+'.'},a,a+1))),
 hzNiveau('L’ordre ne change rien','2 + 3 = 3 + 2',{texte:'2 + 3 = 5 et 3 + 2 = 5 : c’est pareil.',visuel:{grand:'🔵🔵 + 🔵🔵🔵  =  🔵🔵🔵 + 🔵🔵'}},2192,[[3,4],[2,5],[1,6],[4,5],[2,7],[3,6],[5,4],[1,8]].map(([a,b])=>hzQ({texte:a+' + '+b+' = '+(a+b)+'. Et '+b+' + '+a+' = ?',aide:'On change seulement l’ordre : la réponse est la même, '+(a+b)+'.'},a+b,a+b+1))),
 hzNiveau('Un de plus','+ 1',{texte:'9 + 1 = 10 : le nombre juste après.',visuel:{liste:[8,9,10]}},2193,[6,9,4,13,19,29,39,99].map(n=>hzQ({texte:n+' + 1 = ?',visuel:{liste:[n,'?']},aide:'Le nombre juste après '+n+' est '+(n+1)+'.'},n+1,n+10)))
);

/* ---------- Column addition and subtraction (written answers) ---------- */
ajoute('regrouper',
 hzNiveau('Additionner sans regrouper','D’abord les unités.',{texte:'23 + 14 : les unités 3 + 4 = 7, puis les dizaines 2 + 1 = 3. Réponse : 37.',visuel:{grand:'23 + 14 = 37'}},2291,[[12,5],[21,6],[13,14],[32,15],[41,23],[24,13],[52,16],[33,21]].map(([a,b])=>hzF(col(a,'+',b,AIDE_ADD0)))),
 hzNiveau('Additionner en regroupant','10 unités = 1 dizaine.',{texte:'18 + 5 : 8 + 5 = 13 unités. Je regroupe 10 unités en 1 dizaine : j’écris 3 et je mets 1 en haut des dizaines. Réponse : 23.',visuel:{grand:'18 + 5 = 23'}},2292,[[18,5],[27,6],[19,13],[26,15],[38,14],[17,17],[45,26],[29,23]].map(([a,b])=>hzF(col(a,'+',b,AIDE_ADD)))),
 hzNiveau('Soustraire sans regrouper','D’abord les unités.',{texte:'47 − 23 : les unités 7 − 3 = 4, puis les dizaines 4 − 2 = 2. Réponse : 24.',visuel:{grand:'47 − 23 = 24'}},2293,[[17,5],[28,6],[35,12],[46,23],[59,27],[64,31],[78,45],[86,52]].map(([a,b])=>hzF(col(a,'−',b,AIDE_SOU0))))
);
ajoute('decomposer',
 hzNiveau('Additionner des dizaines','20 + 30',{texte:'2 dizaines + 3 dizaines = 5 dizaines. Donc 20 + 30 = 50.',visuel:{blocs:{d:5}}},2391,[[2,3],[1,4],[3,3],[4,2],[2,5],[5,3],[1,6],[3,4]].map(([a,b])=>hzQ({texte:(a*10)+' + '+(b*10)+' = ?',visuel:{grand:pl(a,'dizaine')+' + '+pl(b,'dizaine')},aide:a+' + '+b+' = '+(a+b)+', donc '+(a*10)+' + '+(b*10)+' = '+((a+b)*10)+'.'},(a+b)*10,a+b))),
 hzNiveau('Dizaines + unités','30 + 4',{texte:'30 + 4 : 3 dizaines et 4 unités. Donc 30 + 4 = 34.',visuel:{blocs:{d:3,u:4}}},2392,[[5,2],[2,7],[6,1],[4,5],[7,3],[1,8],[8,6],[3,9]].map(([t,u])=>hzQ({texte:(t*10)+' + '+u+' = ?',visuel:{blocs:{d:t,u}},aide:t+' dizaines et '+plU(u)+' : '+(t*10+u)+'.'},t*10+u,t+u))),
 hzNiveau('Décomposer pour additionner','Les décompositions sont données.',{texte:'23 + 14 : 20 + 10 = 30, puis 3 + 4 = 7. 30 + 7 = 37.',visuel:{grand:'23 + 14 = 37'}},2393,[[21,13],[32,14],[23,15],[41,22],[34,12],[25,31],[43,24],[52,16]].map(([a,b])=>hzF(dec(a,'+',b,{donnees:true,aide:AIDE_DEC_ADD}))))
);

/* ---------- Time ---------- */
const hh=(h,m)=>h+' h'+(m?' '+m:'');
const hzHeure=(h,m,autre)=>(r,c)=>c?chx(r,{texte:'Quelle heure est-il ?',visuel:{horloge:[h,m]},aide:m?'La grande aiguille est sur le 6 : c’est la demie. La petite aiguille est après le '+h+'.':'La grande aiguille est sur le 12. La petite aiguille montre le '+h+'.'},[hh(h,m),autre]):{type:'heure',h,m};
ajoute('heure',
 hzNiveau('Les heures justes','La grande aiguille est sur le 12.',{texte:'La grande aiguille est sur le 12. La petite aiguille montre le 3 : il est 3 h.',visuel:{horloge:[3,0]}},2491,[[3,9],[6,12],[9,3],[12,6],[2,0],[5,0],[8,0],[11,0]].map(([h,a])=>hzHeure(h,0,hh(a,0)))),
 hzNiveau('Les heures et demie','La grande aiguille est sur le 6.',{texte:'La grande aiguille est sur le 6 : c’est la demie. Il est 4 h 30.',visuel:{horloge:[4,30]}},2492,[4,7,1,10,2,5,8,11].map(h=>hzHeure(h,30,hh(h,0)))),
 hzNiveau('Heure juste ou demie ?','Regarde la grande aiguille.',{texte:'Grande aiguille sur le 12 → 2 h. Grande aiguille sur le 6 → 2 h 30.',visuel:{horloge:[2,30]}},2493,[[6,0],[3,30],[9,30],[1,0],[7,30],[4,0],[10,0],[5,30]].map(([h,m])=>hzHeure(h,m,hh(h,m?0:30))))
);

/* ---------- Grid (one level) ---------- */
const NOMCASE=(c,l)=>'ABCDE'[c]+(l+1);
ajoute('trajets',
 hzNiveau('Trouver une case','La lettre en bas, puis le chiffre.',{texte:'B4 : je trouve la lettre B en bas, puis je monte jusqu’au 4.',visuel:{grand:'B4 = B ⬆ 4'}},2591,[
   ...[[1,3,'🍎',3,1],[3,1,'⭐',1,3],[0,2,'🐢',2,0],[4,0,'🌳',0,4]].map(([c,l,e,c2,l2])=>r=>{const ch=melange(r,[NOMCASE(c,l),NOMCASE(c2,l2)]);return{type:'plan',mode:'caseLire',cible:[c,l],emoji:e,choix:ch,reponse:ch.indexOf(NOMCASE(c,l)),texte:'Dans quelle case est le dessin ?',aide:'Lis d’abord la lettre en bas, puis le chiffre sur le côté.'}}),
   ...[[2,2],[0,4],[3,1],[1,0]].map(([c,l])=>hzF({type:'plan',mode:'case',cible:[c,l],reponse:NOMCASE(c,l),texte:'Clique sur la case '+NOMCASE(c,l)+', puis sur Vérifier.',aide:'Trouve d’abord la lettre '+'ABCDE'[c]+' en bas, puis monte jusqu’au '+(l+1)+'.'}))])
);

/* ---------- Money ---------- */
const ART=[['🧸','Ourson'],['🧢','Casquette'],['🍎','Pomme'],['✏️','Crayon'],['⚽','Ballon'],['🧃','Jus'],['📒','Cahier'],['🍪','Biscuit']];
const hzCher=(i,j,pa,pb,cher)=>hzF({type:'finance',title:cher?'⬆️ Le plus cher':'⬇️ Le moins cher',items:[[...ART[i],pa],[...ART[j],pb]],question:cher?'Clique sur le plus cher.':'Clique sur le moins cher.',type2:'choice',cliquer:true,choices:[ART[i][1],ART[j][1]],answer:(cher?pa>pb:pa<pb)?0:1,explain:'Compare les prix : '+pa+' $ et '+pb+' $.'});
const PRIX=[[0,1,9,2],[2,3,1,5],[4,5,8,3],[6,7,2,6],[1,4,7,4],[3,6,3,9],[5,0,2,8],[7,2,6,1]];
ajoute('finances',
 hzNiveau('Le plus cher','Deux objets seulement.',{texte:'Le plus cher, c’est le plus grand prix : 9 $ coûte plus que 2 $.',visuel:{grand:'🧸 9 $   🧢 2 $'}},2691,PRIX.map(([i,j,a,b])=>hzCher(i,j,a,b,true))),
 hzNiveau('Le moins cher','Deux objets seulement.',{texte:'Le moins cher, c’est le plus petit prix : 2 $ coûte moins que 9 $.',visuel:{grand:'🧸 9 $   🧢 2 $'}},2692,PRIX.map(([i,j,a,b])=>hzCher(i,j,a,b,false))),
 hzNiveau('Additionner deux petits prix','Jusqu’à 10 $.',{texte:'Une pomme à 2 $ et un jus à 3 $ : 2 + 3 = 5 $.',visuel:{grand:'🍎 2 $ + 🧃 3 $ = 5 $'}},2693,[[2,5,1,3],[3,6,2,2],[0,7,4,1],[1,3,5,2],[4,6,3,4],[2,5,6,2],[7,3,2,5],[6,1,3,3]].map(([i,j,a,b])=>hzF({type:'finance',title:'🧾 À la caisse',schema:{blocs:[{k:'article',e:ART[i][0],n:ART[i][1],p:a},'+',{k:'article',e:ART[j][0],n:ART[j][1],p:b},'=',{k:'inconnu',titre:'Tu paies','e':'🧾'}],calc:[[a+' $','+',b+' $','=','?']]},oral:'Tu achètes '+ART[i][1].toLowerCase()+' à '+a+' dollars et '+ART[j][1].toLowerCase()+' à '+b+' dollars. Combien dois-tu payer en tout ?',question:'Combien en tout ?',type2:'number',answer:a+b,explain:a+' + '+b+' = '+(a+b)+' $'})))
);

/* ---------- Measuring ---------- */
const hzBande=(a,b,longue)=>hzC({texte:'Quelle bande est la plus '+(longue?'longue':'courte')+' ?',visuel:{bandes:[a,b]},aide:longue?'La plus longue va le plus loin.':'La plus courte s’arrête en premier.'},(longue?a>b:a<b)?'Bande A':'Bande B',(longue?a>b:a<b)?'Bande B':'Bande A');
const BANDES=[[8,3],[2,7],[9,4],[3,8],[6,2],[4,10],[10,5],[2,6]];
ajoute('mesures',
 hzNiveau('La bande la plus longue','Une grande différence.',{texte:'La bande A va plus loin : elle est la plus longue.',visuel:{bandes:[8,3]}},2791,BANDES.map(([a,b])=>hzBande(a,b,true))),
 hzNiveau('La bande la plus courte','Une grande différence.',{texte:'La bande B s’arrête en premier : elle est la plus courte.',visuel:{bandes:[8,3]}},2792,BANDES.map(([a,b])=>hzBande(a,b,false))),
 hzNiveau('Combien de centimètres de plus ?','1, 2 ou 3 cm.',{texte:'Je compte les carrés entre la fin de A et la fin de B : 1, 2. Il faut 2 cm.',visuel:{bandes:[3,5],regle:true}},2793,[[3,2],[5,1],[2,3],[4,2],[6,1],[3,3],[2,2],[5,2]].map(([a,d])=>hzQ({texte:'Combien de centimètres faut-il ajouter à la bande A pour avoir la bande B ?',visuel:{bandes:[a,a+d],regle:true},aide:'Compte les carrés entre la fin de A et la fin de B : il y en a '+d+'.'},d,d+1,{unite:'cm'})))
);

/* ---------- Number patterns ---------- */
ajoute('suites',
 hzNiveau('De 1 en 1','On ajoute 1.',{texte:'3, 4, 5, 6 : on ajoute 1 chaque fois.',visuel:{suite:[3,4,5,6]}},2891,[3,6,1,8,12,15,4,17].map(s=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s+1,s+2]},aide:(s+2)+' + 1 = '+(s+3)+'.'},s+3,s+4))),
 hzNiveau('De 2 en 2','On ajoute 2.',{texte:'2, 4, 6, 8 : on ajoute 2 chaque fois.',visuel:{suite:[2,4,6,8]}},2892,[2,4,6,10,0,8,12,14].map(s=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s+2,s+4]},aide:(s+4)+' + 2 = '+(s+6)+'.'},s+6,s+5))),
 hzNiveau('De 10 en 10','On ajoute 10.',{texte:'10, 20, 30, 40 : on ajoute 10 chaque fois.',visuel:{suite:[10,20,30,40]}},2893,[10,20,40,30,50,10,60,20].map(s=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s+10,s+20]},aide:(s+20)+' + 10 = '+(s+30)+'.'},s+30,s+21)))
);

/* ---------- Word problems ---------- */
const PRENOMS=['Adam','Lina','Noah','Maya','Sami','Léa','Omar','Inès'];
const OBJ=[['🎈','ballons'],['🍪','biscuits'],['⭐','autocollants'],['🍎','pommes']];
ajoute('problemes',
 hzNiveau('Ajouter','On en donne encore.',{texte:'Je lis. Je regarde les dessins. Je compte tout : 2 + 1 = 3.',visuel:{grand:'🎈🎈  +  🎈'}},4191,[[2,1],[3,2],[1,4],[2,2],[4,1],[3,3],[2,4],[5,2]].map(([a,b],k)=>{const [e,o]=OBJ[k%4],p=PRENOMS[k];return hzQ({texte:p+' a '+a+' '+o+'. On lui en donne '+b+'. Combien de '+o+' a-t-il en tout ?'.replace('a-t-il',k%2?'a-t-elle':'a-t-il'),visuel:{grand:dots(e,a)+'  +  '+dots(e,b)},aide:a+' + '+b+' = '+(a+b)+'.'},a+b,a+b+1)})),
 hzNiveau('Enlever','On en mange, on en perd.',{texte:'Je lis. Les ❌ sont partis. Je compte ce qui reste : 4 − 1 = 3.',visuel:{grand:'🍪🍪🍪❌'}},4192,[[4,1],[5,2],[3,1],[5,3],[6,2],[4,3],[7,2],[6,4]].map(([a,b],k)=>{const [e,o]=OBJ[(k+1)%4],p=PRENOMS[k];return hzQ({texte:p+' a '+a+' '+o+'. '+(k%2?'Elle':'Il')+' en donne '+b+'. Combien lui en reste-t-il ?',visuel:{grand:dots(e,a-b)+dots('❌',b)},aide:a+' − '+b+' = '+(a-b)+'.'},a-b,a-b+1)})),
 hzNiveau('Partager','Chacun en a autant.',{texte:'6 biscuits pour 2 amis : un pour toi, un pour moi… Chacun en a 3.',visuel:{jetons:6,groupes:2}},4193,[[4,2],[6,3],[6,2],[8,2],[9,3],[10,2],[8,4],[12,3]].map(([t,g],k)=>hzQ({texte:t+' biscuits sont partagés entre '+g+' amis. Combien de biscuits pour chaque ami ?',visuel:{jetons:t,groupes:g},aide:'Donne un biscuit à chacun, chacun son tour. '+t+' ÷ '+g+' = '+(t/g)+'.'},t/g,t/g+1)))
);

/* ================= HARDER MATHHORIZON LEVELS =================
   Same step-by-step layout (a model, then 8 exercises), with bigger numbers.
   They come after the first three levels of each activity. */
const DUR='⭐ Défi · ';
const hzDur=(titre,description,modele,seed,liste)=>hzNiveau(titre,DUR+description,modele,seed,liste);
const encore=(id,...niv)=>{H[id]=(H[id]||[]).concat(niv)};
const hm=(h,m)=>h+' h '+String(m).padStart(2,'0');

/* Shapes */
Object.assign(NOMF,{pentagone:'Pentagone',hexagone:'Hexagone'});
Object.assign(AIDEF,{pentagone:'Le pentagone a 5 côtés.',hexagone:'L’hexagone a 6 côtés.'});
encore('formes',
 hzDur('Pentagone et hexagone','5 côtés ou 6 côtés ?',{texte:'Le pentagone a 5 côtés. L’hexagone a 6 côtés.',visuel:{forme:'hexagone'}},3101,[['pentagone','hexagone'],['hexagone','pentagone'],['carre','rectangle'],['rectangle','carre'],['pentagone','hexagone'],['hexagone','carre'],['triangle','pentagone'],['hexagone','pentagone']].map(([f,a])=>hzForme(f,a))),
 hzDur('Les sommets','Un sommet, c’est un coin.',{texte:'Le triangle a 3 sommets (3 coins).',visuel:{forme:'triangle'}},3102,['triangle','carre','pentagone','hexagone','rectangle','hexagone','pentagone','triangle'].map(f=>hzQ({texte:'Combien de sommets (coins) a cette forme ?',visuel:{forme:f,rotation:0},aide:'Un sommet, c’est un coin. Mets ton doigt sur chaque coin et compte : il y en a '+COTES[f]+'.'},COTES[f],COTES[f]+1)))
);

/* Calculations up to 20 */
encore('calculs',
 hzDur('Additionner jusqu’à 20','Passe par 10.',{texte:'8 + 5 : 8 + 2 = 10, puis 10 + 3 = 13.',visuel:{grand:'8 + 5 = 13'}},3111,[[8,5],[9,4],[7,6],[6,8],[9,7],[8,8],[7,9],[12,6]].map(([a,b])=>hzQ({texte:a+' + '+b+' = ?',oral:a+' plus '+b+', combien ?',aide:a<10&&a+b>10?'Fais 10 d’abord : '+a+' + '+(10-a)+' = 10, puis 10 + '+(b-10+a)+' = '+(a+b)+'.':'Pars de '+a+' et avance de '+b+' : '+(a+b)+'.'},a+b,a+b+1))),
 hzDur('Soustraire jusqu’à 20','Passe par 10.',{texte:'13 − 5 : 13 − 3 = 10, puis 10 − 2 = 8.',visuel:{grand:'13 − 5 = 8'}},3112,[[12,5],[15,7],[13,6],[14,8],[16,9],[11,4],[17,8],[18,9]].map(([a,b])=>hzQ({texte:a+' − '+b+' = ?',oral:a+' moins '+b+', combien ?',aide:'Recule jusqu’à 10 : '+a+' − '+(a-10)+' = 10, puis 10 − '+(b-a+10)+' = '+(a-b)+'.'},a-b,a-b+1)))
);

/* Tables */
encore('tables',
 hzDur('Les tables de 3 et de 4','Des groupes de 3 ou de 4.',{texte:'4 × 3 : 4 groupes de 3. Je compte 3, 6, 9, 12.',visuel:{grand:'🍎🍎🍎   🍎🍎🍎   🍎🍎🍎   🍎🍎🍎'}},3121,[[3,2],[4,3],[3,4],[4,5],[3,6],[4,4],[3,5],[4,6]].map(([t,k],i)=>hzTable(t,k,i))),
 hzDur('Les tables mélangées','Sans dessins.',{texte:'6 × 5 : je compte de 5 en 5, six fois. 5, 10, 15, 20, 25, 30.',visuel:{grand:'6 × 5 = 30'}},3122,[[6,2],[7,5],[8,10],[9,2],[6,5],[7,10],[8,5],[9,5]].map(([k,t])=>hzQ({texte:k+' × '+t+' = ?',oral:k+' fois '+t+', combien ?',aide:'Compte de '+t+' en '+t+', '+k+' fois : '+compte(t,k)+'.'},k*t,k*t+t)))
);

/* Missing number up to 20 */
encore('completer',
 hzDur('Le nombre caché jusqu’à 20','… + ? = …',{texte:'8 + ? = 13. De 8 à 10 : 2. De 10 à 13 : 3. 2 + 3 = 5.',visuel:{grand:'8 + 5 = 13'}},3131,[[8,13],[7,15],[9,16],[6,14],[11,18],[5,12],[12,20],[9,17]].map(([a,s])=>hzQ({texte:a+' + ? = '+s,oral:a+' plus combien égale '+s+' ?',aide:'Compte de '+a+' jusqu’à '+s+' : tu avances de '+(s-a)+'.'},s-a,s-a+1))),
 hzDur('La soustraction cachée jusqu’à 20','… − ? = …',{texte:'15 − ? = 9. De 9 à 15, il y a 6. Donc 15 − 6 = 9.',visuel:{grand:'15 − 6 = 9'}},3132,[[15,9],[13,7],[17,8],[14,6],[16,9],[12,5],[18,10],[20,12]].map(([s,v])=>hzQ({texte:s+' − ? = '+v,oral:s+' moins combien égale '+v+' ?',aide:'Compte de '+v+' jusqu’à '+s+' : il y a '+(s-v)+'.'},s-v,s-v+1)))
);

/* Fractions: reading bigger fractions, then cutting a shape and colouring it */
const hzCouper=(forme,n,d)=>()=>({type:'couper',forme,n,d,texte:'Représente '+F(n,d)+' : coupe '+NOM_COUPER_F[forme]+' en '+d+' parts égales, puis colorie '+n+(n>1?' parts.':' part.'),aide:'Le nombre du bas, '+d+', dit en combien de parts couper. Le nombre du haut, '+n+', dit combien de parts colorier.'});
const NOM_COUPER_F={pizza:'la pizza',rectangle:'le rectangle',carre:'le carré'};
encore('fractions',
 hzDur('Lire des fractions jusqu’à 10 parts','Plus de parts.',{texte:'Coupé en 8 parts égales, 3 parts coloriées : [3/8].',visuel:{frac:{forme:'barre',d:8,n:3}}},3141,[['barre',5,3],['cercle',6,5],['barre',8,3],['cercle',7,4],['barre',10,7],['cercle',8,5],['barre',9,4],['cercle',6,1]].map(([f,d,n])=>hzFrac(f,d,n,F(d-n,d)))),
 hzDur('✂️ Couper : demi, tiers, quart','La pizza, le rectangle, le carré.',{texte:'Pour [3/4] : je coupe en 4 parts égales (le nombre du bas), puis je colorie 3 parts (le nombre du haut).',visuel:{frac:{forme:'cercle',d:4,n:3}}},3142,[['pizza',1,2],['rectangle',1,3],['carre',3,4],['pizza',2,3],['rectangle',1,4],['carre',1,2],['pizza',3,4],['rectangle',2,3]].map(([f,n,d])=>hzCouper(f,n,d))),
 hzDur('✂️ Couper : jusqu’à 10 parts','La pizza, le rectangle, le carré.',{texte:'Pour [5/8] : je coupe en 8 parts égales, puis je colorie 5 parts.',visuel:{frac:{forme:'cercle',d:8,n:5}}},3143,[['pizza',5,8],['rectangle',3,5],['carre',4,9],['pizza',5,6],['rectangle',7,10],['carre',2,6],['pizza',3,8],['rectangle',4,7]].map(([f,n,d])=>hzCouper(f,n,d)))
);

/* Division */
encore('division',
 hzDur('Diviser par 4 et par 5','Avec des jetons.',{texte:'15 ÷ 5 : 15 jetons pour 5 amis. Chacun en a 3.',visuel:{jetons:15,groupes:5}},3151,[[8,4],[15,5],[12,4],[20,5],[16,4],[10,5],[20,4],[25,5]].map(([t,g])=>hzPart(t,g,'amis'))),
 hzDur('Diviser avec les tables','Sans jetons.',{texte:'24 ÷ 4 : je cherche dans la table de 4. 6 × 4 = 24, donc 24 ÷ 4 = 6.',visuel:{grand:'6 × 4 = 24  →  24 ÷ 4 = 6'}},3152,[[3,6],[4,7],[5,8],[3,9],[4,6],[6,3],[5,9],[4,8]].map(([b,q])=>hzQ({texte:(b*q)+' ÷ '+b+' = ?',oral:(b*q)+' divisé par '+b+', combien ?',aide:'Cherche dans la table de '+b+' : '+q+' × '+b+' = '+(b*q)+'.'},q,q+1)))
);
encore('partage',
 hzDur('Partager entre 5 personnes','Jusqu’à 25.',{texte:'15 jetons pour 5 personnes : chacun en a 3.',visuel:{jetons:15,groupes:5}},3161,[5,10,15,10,20,15,25,20].map(t=>hzPart(t,5,'personnes'))),
 hzDur('Partager : il en reste','Le reste ne se partage pas.',{texte:'7 jetons pour 2 amis : chacun en a 3, et il en reste 1.',visuel:{grand:'7 = 3 + 3 + 1'}},3162,[[7,2],[10,3],[9,4],[13,5],[11,2],[14,3],[17,4],[22,5]].map(([t,g])=>()=>({type:'reste',texte:'Partage '+t+' jetons entre '+g+' amis. Combien pour chacun ? Combien en reste-t-il ?',q:Math.floor(t/g),r:t%g,aide:'Donne un jeton à chacun, chacun son tour. Quand il n’y en a plus assez pour tout le monde, ce qui reste est le reste : '+t+' = '+Array(g).fill(Math.floor(t/g)).join(' + ')+' + '+(t%g)+'.'})))
);

/* Place value */
encore('dizaines',
 hzDur('Barres et cubes jusqu’à 99','Beaucoup de barres.',{texte:'4 barres et 7 cubes : 40 et 7 → 47.',visuel:{blocs:{d:4,u:7}}},3171,[[4,7],[6,5],[8,3],[5,9],[7,6],[9,4],[6,8],[8,9]].map(([d,u])=>hzQ({texte:'Combien de cubes ?',oral:'Compte les barres de dix, puis les cubes. Combien de cubes ?',visuel:{blocs:{d,u}},aide:'Les barres : '+compte(10,d)+'. Puis ajoute '+u+' cubes : '+(d*10+u)+'.'},d*10+u,u*10+d))),
 hzDur('10 de plus, 10 de moins','On ajoute ou on enlève 1 barre.',{texte:'34 + 10 = 44 : 1 barre de plus. Les unités ne changent pas.',visuel:{grand:'34 + 10 = 44'}},3172,[[34,1],[57,-1],[62,1],[45,-1],[78,1],[83,-1],[29,1],[90,-1]].map(([n,s])=>hzQ({texte:n+(s>0?' + 10':' − 10')+' = ?',visuel:{blocs:{d:chif(n,1),u:chif(n,0)}},aide:(s>0?'On ajoute':'On enlève')+' 1 barre : le chiffre des dizaines change, les unités restent '+chif(n,0)+'. Réponse : '+(n+10*s)+'.'},n+10*s,n+s)))
);
encore('centaines',
 hzDur('Plaques, barres et cubes','Les trois ensemble.',{texte:'2 plaques, 3 barres et 4 cubes : 200, 30 et 4 → 234.',visuel:{blocs:{c:2,d:3,u:4}}},3181,[[2,3,4],[1,5,2],[3,2,6],[2,4,1],[4,1,3],[1,3,7],[3,4,2],[2,6,5]].map(([c,d,u])=>hzQ({texte:'Combien de cubes ?',visuel:{blocs:{c,d,u}},aide:'Les plaques : '+(c*100)+'. Les barres : '+(d*10)+'. Les cubes : '+u+'. Réponse : '+(c*100+d*10+u)+'.'},c*100+d*10+u,c*100+u*10+d))),
 hzDur('100 de plus, 100 de moins','On ajoute ou on enlève 1 plaque.',{texte:'245 + 100 = 345 : seul le chiffre des centaines change.',visuel:{grand:'245 + 100 = 345'}},3182,[[245,1],[372,-1],[518,1],[630,-1],[407,1],[851,-1],[164,1],[926,-1]].map(([n,s])=>hzQ({texte:n+(s>0?' + 100':' − 100')+' = ?',visuel:{chiffres:{n,pos:2}},aide:'Seul le chiffre des centaines (en couleur) change : '+chif(n,2)+(s>0?' + 1 = ':' − 1 = ')+(chif(n,2)+s)+'. Réponse : '+(n+100*s)+'.'},n+100*s,n+10*s)))
);
encore('milliers',
 hzDur('Milliers et centaines','Gros cubes et plaques.',{texte:'1 gros cube et 2 plaques : 1 000 et 200 → 1 200.',visuel:{blocs:{m:1,c:2}}},3191,[[1,2],[2,3],[1,5],[3,1],[2,4],[1,7],[3,2],[2,6]].map(([m,c])=>hzQ({texte:'Combien de cubes ?',visuel:{blocs:{m,c}},aide:'Les gros cubes : '+mil(m*1000)+'. Les plaques : '+(c*100)+'. Réponse : '+mil(m*1000+c*100)+'.'},m*1000+c*100,m*1000+c*10))),
 hzDur('De 100 en 100 après 1 000','1 800, 1 900, 2 000…',{texte:'1 800, 1 900, 2 000 : 10 centaines font 1 millier de plus.',visuel:{grand:'1 800, 1 900, 2 000'}},3192,[1200,1500,2700,1800,3400,2600,1900,4100].map(d=>hzQ({texte:'Quel nombre vient après ?',oral:'On compte de cent en cent. Quel nombre vient après ?',visuel:{grand:mil(d)+', '+mil(d+100)+', ?'},aide:'On ajoute 100 : '+mil(d+100)+' + 100 = '+mil(d+200)+'.'},d+200,d+110)))
);
encore('valeur',
 hzDur('Le chiffre des centaines','Le chiffre de gauche.',{texte:'352 : le 3 est aux centaines. 3 centaines = 300.',visuel:{chiffres:{n:352,pos:2}}},3201,[352,618,247,936,481,725,569,893].map(n=>hzQ({texte:'Dans '+n+', combien de centaines ?',visuel:{chiffres:{n,pos:2}},aide:'Le chiffre de gauche (en couleur) dit les centaines : '+chif(n,2)+'.'},chif(n,2),chif(n,1)))),
 hzDur('Ce que vaut un chiffre','5 dizaines = 50.',{texte:'Dans 352, le 5 est aux dizaines : il vaut 50.',visuel:{chiffres:{n:352,pos:1}}},3202,[[352,1],[618,2],[247,1],[936,2],[481,1],[725,2],[569,1],[893,2]].map(([n,p])=>hzQ({texte:'Dans '+n+', que vaut le chiffre '+chif(n,p)+' ?',visuel:{chiffres:{n,pos:p}},aide:'Le '+chif(n,p)+' est aux '+NOMPOS[p]+' : il vaut '+(chif(n,p)*10**p)+'.'},chif(n,p)*10**p,chif(n,p))))
);
encore('composer',
 hzDur('Centaines, dizaines et unités','Un nombre à 3 chiffres.',{texte:'2 centaines, 4 dizaines et 7 unités : j’écris 2, puis 4, puis 7 → 247.',visuel:{grand:'2 C   4 D   7 U  →  247'}},3211,[[2,4,7],[3,1,5],[5,6,2],[4,8,3],[6,2,9],[7,5,1],[8,3,6],[9,7,4]].map(([c,d,u])=>hzQ({texte:pl(c,'centaine')+', '+pl(d,'dizaine')+' et '+plU(u)+' = ?',visuel:{grand:c+' C   '+d+' D   '+u+' U'},aide:'J’écris '+c+', puis '+d+', puis '+u+' : '+(c*100+d*10+u)+'.'},c*100+d*10+u,c*100+u*10+d))),
 hzDur('Décomposer un nombre à 3 chiffres','347 = 300 + 40 + 7',{texte:'347 = 300 + 40 + 7.',visuel:{grand:'347 = 300 + 40 + 7'}},3212,[347,529,684,215,763,958,431,872].map(n=>hzQ({texte:n+' = '+(chif(n,2)*100)+' + ? + '+chif(n,0),visuel:{chiffres:{n,pos:1}},aide:'Le chiffre des dizaines est '+chif(n,1)+' : il vaut '+(chif(n,1)*10)+'.'},chif(n,1)*10,chif(n,1))))
);

/* Equal sign, comparing, ordering */
encore('egal',
 hzDur('Équilibrer jusqu’à 20','… + … = … + ?',{texte:'8 + 5 = 10 + ? → 8 + 5 = 13, et 10 + 3 = 13. Donc ? = 3.',visuel:{grand:'8 + 5 = 10 + 3'}},3221,[[8,5,10],[7,6,9],[9,4,10],[6,8,7],[9,9,10],[8,7,11],[7,7,12],[9,6,8]].map(([a,b,c])=>hzQ({texte:a+' + '+b+' = '+c+' + ?',oral:a+' plus '+b+' égale '+c+' plus combien ?',aide:'D’abord le côté gauche : '+a+' + '+b+' = '+(a+b)+'. Puis '+c+' + ? = '+(a+b)+'.'},a+b-c,a+b-c+1))),
 hzDur('Vrai ou faux ?','Calcule les deux côtés.',{texte:'9 + 6 = 8 + 7 ? 9 + 6 = 15 et 8 + 7 = 15 : c’est vrai.',visuel:{grand:'9 + 6 = 8 + 7'}},3222,[[9,6,8,7],[7,5,6,7],[8,8,10,6],[6,9,7,7],[12,3,10,5],[5,7,6,5],[9,9,10,7],[11,4,8,7]].map(([a,b,c,d])=>hzC({texte:a+' + '+b+' = '+c+' + '+d+' : vrai ou faux ?',visuel:{grand:a+' + '+b+'  =  '+c+' + '+d},aide:a+' + '+b+' = '+(a+b)+' et '+c+' + '+d+' = '+(c+d)+'.'},a+b===c+d?'Vrai':'Faux',a+b===c+d?'Faux':'Vrai')))
);
const signe=(a,b,aide)=>hzC({signe:true,texte:'Choisis le bon signe : '+a+' ? '+b,visuel:{grand:a+'  ?  '+b},oral:'Compare '+a+' et '+b+'.',aide},a<b?'<':'>',a<b?'>':'<');
encore('comparer',
 hzDur('Comparer jusqu’à 100','< ou > ?',{texte:'47 < 74 : 4 dizaines, c’est moins que 7 dizaines.',visuel:{grand:'47 < 74'}},3231,[[47,74],[63,58],[29,32],[85,81],[56,65],[90,89],[38,83],[71,17]].map(([a,b])=>signe(a,b,'Compare d’abord les dizaines. Si elles sont pareilles, compare les unités. La pointe montre le plus petit.'))),
 hzDur('Comparer jusqu’à 1 000','< ou > ?',{texte:'352 > 325 : mêmes centaines, mais 5 dizaines, c’est plus que 2 dizaines.',visuel:{grand:'352 > 325'}},3232,[[352,325],[608,680],[479,497],[901,899],[236,263],[745,754],[518,581],[999,990]].map(([a,b])=>signe(a,b,'Compare les centaines, puis les dizaines, puis les unités. La pointe montre le plus petit.')))
);
encore('situer',
 hzDur('Avant et après jusqu’à 100','Attention aux dizaines !',{texte:'Juste après 39, c’est 40. Juste avant 60, c’est 59.',visuel:{liste:[38,39,40]}},3241,[[39,1],[60,-1],[79,1],[50,-1],[89,1],[71,-1],[99,1],[40,-1]].map(([n,s])=>hzQ({texte:'Quel nombre vient juste '+(s>0?'après':'avant')+' '+n+' ?',visuel:{liste:s>0?[n,'?']:['?',n]},aide:n+(s>0?' + 1 = ':' − 1 = ')+(n+s)+'.'},n+s,n-s))),
 hzDur('Avant et après jusqu’à 1 000','199, 200…',{texte:'Juste après 199, c’est 200. Juste avant 300, c’est 299.',visuel:{liste:[198,199,200]}},3242,[[199,1],[300,-1],[409,1],[500,-1],[699,1],[810,-1],[289,1],[600,-1]].map(([n,s])=>hzQ({texte:'Quel nombre vient juste '+(s>0?'après':'avant')+' '+n+' ?',visuel:{liste:s>0?[n,'?']:['?',n]},aide:n+(s>0?' + 1 = ':' − 1 = ')+(n+s)+'.'},n+s,n-s)))
);
encore('sortes',
 hzDur('Pair ou impair jusqu’à 100','Regarde le dernier chiffre.',{texte:'34 finit par 4 : pair. 57 finit par 7 : impair.',visuel:{chiffres:{n:57,pos:0}}},3251,[34,57,82,69,46,93,70,25].map(n=>hzC({texte:n+' est-il pair ou impair ?',visuel:{chiffres:{n,pos:0}},aide:'Le dernier chiffre est '+chif(n,0)+' : '+n+' est '+PI(n)+'.'},PI(n),AUTRE(n)))),
 hzDur('Compter de 5 en 5','5, 10, 15…',{texte:'5, 10, 15, 20 : on ajoute 5 chaque fois.',visuel:{suite:[5,10,15,20]}},3252,[5,15,30,20,45,10,55,35].map(s=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s+5,s+10]},aide:'On ajoute 5 : '+(s+10)+' + 5 = '+(s+15)+'.'},s+15,s+11)))
);
encore('proprietes',
 hzDur('× 1 et × 0','Deux règles à retenir.',{texte:'7 × 1 = 7 : une fois 7. 7 × 0 = 0 : zéro fois, il n’y a rien.',visuel:{grand:'7 × 1 = 7     7 × 0 = 0'}},3261,[[7,1],[6,0],[9,1],[8,0],[1,5],[0,4],[12,1],[0,9]].map(([a,b])=>{const z=a===0||b===0;return hzQ({texte:a+' × '+b+' = ?',oral:a+' fois '+b+', combien ?',aide:z?'Fois 0, la réponse est toujours 0.':'Fois 1, le nombre ne change pas : '+(a*b)+'.'},a*b,z?Math.max(a,b):a*b+1)})),
 hzDur('L’ordre ne change rien (×)','3 × 5 = 5 × 3',{texte:'3 × 5 = 15 et 5 × 3 = 15 : c’est pareil.',visuel:{grand:'3 × 5 = 5 × 3'}},3262,[[3,5],[2,7],[4,6],[5,8],[2,9],[3,7],[4,5],[10,6]].map(([a,b])=>hzQ({texte:a+' × '+b+' = '+(a*b)+'. Et '+b+' × '+a+' = ?',aide:'On change seulement l’ordre : la réponse est la même, '+(a*b)+'.'},a*b,a*b+a)))
);

/* Column work and decomposing */
encore('regrouper',
 hzDur('Soustraire en regroupant','1 dizaine devient 10 unités.',{texte:'42 − 17 : 2 − 7, impossible. Je regroupe : 1 dizaine devient 10 unités. 12 − 7 = 5, puis 3 − 1 = 2. Réponse : 25.',visuel:{grand:'42 − 17 = 25'}},3271,[[42,17],[53,28],[61,34],[70,26],[84,59],[35,18],[92,47],[56,39]].map(([a,b])=>hzF(col(a,'−',b,AIDE_SOU)))),
 hzDur('Additionner avec 3 chiffres','Un regroupement.',{texte:'145 + 238 : 5 + 8 = 13, je regroupe. Puis 1 + 4 + 3 = 8, puis 1 + 2 = 3. Réponse : 383.',visuel:{grand:'145 + 238 = 383'}},3272,[[145,238],[267,316],[352,429],[418,275],[526,147],[634,258],[173,409],[285,307]].map(([a,b])=>hzF(col(a,'+',b,AIDE_ADD))))
);
encore('decomposer',
 hzDur('Décomposer pour soustraire','Les décompositions sont données.',{texte:'57 − 23 : 50 − 20 = 30, puis 7 − 3 = 4. 30 + 4 = 34.',visuel:{grand:'57 − 23 = 34'}},3281,[[57,23],[68,35],[79,42],[86,54],[95,31],[74,22],[63,41],[88,26]].map(([a,b])=>hzF(dec(a,'−',b,{donnees:true,aide:AIDE_DEC_SOU})))),
 hzDur('Soustraire en regroupant','52 = 40 + 12',{texte:'52 − 37 : 52 = 40 + 12. (40 − 30) + (12 − 7) = 10 + 5 = 15.',visuel:{grand:'52 − 37 = 15'}},3282,[[52,37],[63,28],[71,45],[84,56],[92,67],[45,19],[73,38],[61,24]].map(([a,b])=>hzF(dec(a,'−',b,{regroupe:true,aide:AIDE_DEC_REG}))))
);

/* Time */
encore('heure',
 hzDur('Les quarts d’heure','15 et 45 minutes.',{texte:'La grande aiguille est sur le 3 : 15 minutes. Il est 3 h 15.',visuel:{horloge:[3,15]}},3291,[[3,15],[7,45],[10,15],[5,45],[2,15],[8,45],[11,15],[4,45]].map(([h,m])=>(r,c)=>c?chx(r,{texte:'Quelle heure est-il ?',visuel:{horloge:[h,m]},aide:m===15?'La grande aiguille est sur le 3 : 15 minutes.':'La grande aiguille est sur le 9 : 45 minutes.'},[hm(h,m),hm(h,60-m)]):{type:'heure',h,m})),
 hzDur('Les minutes de 5 en 5','Compte 5, 10, 15…',{texte:'La grande aiguille est sur le 4 : 5, 10, 15, 20 → 20 minutes.',visuel:{horloge:[2,20]}},3292,[[2,10],[6,25],[9,40],[1,55],[4,20],[7,35],[11,50],[3,5]].map(([h,m])=>(r,c)=>c?chx(r,{texte:'Quelle heure est-il ?',visuel:{horloge:[h,m]},aide:'Compte de 5 en 5 sur les chiffres, jusqu’à la grande aiguille : '+m+' minutes.'},[hm(h,m),hm(h,m/5)]):{type:'heure',h,m}))
);

/* Grid */
encore('trajets',
 hzDur('Ne pas confondre','B3 n’est pas C2.',{texte:'B3 : d’abord la lettre B en bas, puis le chiffre 3 sur le côté.',visuel:{grand:'B3 = B ⬆ 3'}},3301,[[1,2,'🍎'],[2,1,'⭐'],[3,0,'🐢'],[0,3,'🌳'],[4,2,'🚗'],[2,4,'🏠'],[1,3,'🎈'],[3,1,'🐟']].map(([c,l,e])=>r=>{const ch=melange(r,[NOMCASE(c,l),NOMCASE(l,c)]);return{type:'plan',mode:'caseLire',cible:[c,l],emoji:e,choix:ch,reponse:ch.indexOf(NOMCASE(c,l)),texte:'Dans quelle case est le dessin ?',aide:'La lettre d’abord (en bas), puis le chiffre (sur le côté).'}})),
 hzDur('Clique sur la case','Huit cases à trouver.',{texte:'E5 : la lettre E en bas, tout à droite, puis je monte jusqu’au 5.',visuel:{grand:'E5 = E ⬆ 5'}},3302,[[4,4],[0,0],[2,3],[3,2],[1,4],[4,1],[0,3],[3,0]].map(([c,l])=>()=>({type:'plan',mode:'case',cible:[c,l],reponse:NOMCASE(c,l),texte:'Clique sur la case '+NOMCASE(c,l)+', puis sur Vérifier.',aide:'Trouve d’abord la lettre '+'ABCDE'[c]+' en bas, puis monte jusqu’au '+(l+1)+'.'})))
);

/* Money */
encore('finances',
 hzDur('Additionner jusqu’à 20 $','Deux prix.',{texte:'Un cahier à 8 $ et un jus à 7 $ : 8 + 7 = 15 $.',visuel:{grand:'📒 8 $ + 🧃 7 $ = 15 $'}},3311,[[2,5,8,7],[0,3,9,6],[4,1,12,5],[6,7,7,8],[5,2,9,9],[3,4,11,6],[7,0,8,5],[1,6,13,4]].map(([i,j,a,b])=>hzQ({texte:'Tu achètes '+ART[i][0]+' à '+a+' $ et '+ART[j][0]+' à '+b+' $. Combien paies-tu en tout ?',oral:'Tu achètes un objet à '+a+' dollars et un autre à '+b+' dollars. Combien paies-tu en tout ?',visuel:{grand:ART[i][0]+' '+a+' $   +   '+ART[j][0]+' '+b+' $'},aide:a+' + '+b+' = '+(a+b)+' $.'},a+b,a+b+1,{unite:'$'}))),
 hzDur('Rendre la monnaie','Avec 10 $ ou 20 $.',{texte:'Je paie avec 10 $. Ça coûte 7 $. De 7 à 10, il y a 3 : on me rend 3 $.',visuel:{grand:'10 $ − 7 $ = 3 $'}},3312,[[10,7,0],[10,4,2],[20,15,4],[20,12,6],[10,3,3],[20,16,1],[20,9,5],[10,6,7]].map(([p,c,i])=>hzQ({texte:'Tu paies avec '+p+' $. L’objet '+ART[i][0]+' coûte '+c+' $. Combien d’argent te rend-on ?',oral:'Tu paies avec '+p+' dollars. L’objet coûte '+c+' dollars. Combien d’argent te rend-on ?',visuel:{grand:ART[i][0]+' '+c+' $    💵 '+p+' $'},aide:'Compte de '+c+' jusqu’à '+p+' : '+(p-c)+' $.'},p-c,p-c+1,{unite:'$'})))
);

/* Measuring */
encore('mesures',
 hzDur('Combien de centimètres de plus ?','Jusqu’à 12 cm.',{texte:'Je compte les carrés entre la fin de A et la fin de B.',visuel:{bandes:[5,9],regle:true}},3321,[[5,4],[7,3],[4,6],[6,5],[3,7],[8,4],[2,8],[6,6]].map(([a,d])=>hzQ({texte:'Combien de centimètres faut-il ajouter à la bande A pour avoir la bande B ?',visuel:{bandes:[a,a+d],regle:true},aide:'Compte les carrés entre la fin de A et la fin de B : il y en a '+d+'.'},d,d+1,{unite:'cm'}))),
 hzDur('Deux bandes bout à bout','On additionne les longueurs.',{texte:'6 cm et 5 cm bout à bout : 6 + 5 = 11 cm.',visuel:{bandes:[6,5],regle:true}},3322,[[6,5],[4,7],[8,3],[5,6],[7,4],[9,2],[3,8],[6,6]].map(([a,b])=>hzQ({texte:'La bande A mesure '+a+' cm. La bande B mesure '+b+' cm. On les met bout à bout. Combien de centimètres en tout ?',visuel:{bandes:[a,b],regle:true},aide:a+' + '+b+' = '+(a+b)+' cm.'},a+b,a+b+1,{unite:'cm'})))
);

/* Patterns */
encore('suites',
 hzDur('De 5 en 5','On ajoute 5.',{texte:'5, 10, 15, 20 : on ajoute 5 chaque fois.',visuel:{suite:[5,10,15,20]}},3331,[5,10,20,35,15,40,25,50].map(s=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s+5,s+10]},aide:(s+10)+' + 5 = '+(s+15)+'.'},s+15,s+11))),
 hzDur('En reculant','On enlève chaque fois.',{texte:'20, 18, 16, 14 : on enlève 2 chaque fois.',visuel:{suite:[20,18,16,14]}},3332,[[20,2],[50,10],[18,2],[90,10],[30,5],[16,2],[70,10],[45,5]].map(([s,p])=>hzQ({texte:'Quel nombre vient ensuite ?',visuel:{suite:[s,s-p,s-2*p]},aide:'On enlève '+p+' : '+(s-2*p)+' − '+p+' = '+(s-3*p)+'.'},s-3*p,s-3*p-1)))
);

/* Append the MathHorizon levels to each activity. */
const ACTS_HZ={formes,calculs,tables,completer,fractions,division,partage,dizaines,centaines,milliers,valeur,composer,egal,comparer,situer,sortes,proprietes,regrouper,decomposer,heure:lireHeure,trajets,finances,mesures,suites,problemes};
for(const [id,niv] of Object.entries(H))ACTS_HZ[id].niveaux.push(...niv);

{ // own block: names may repeat those above
/* ================= NEW MATHHORIZON ACTIVITIES: algebra and financial literacy =================
   Saved as "atelier-<name>" (accepted by the results server without any change).
   Each one: 3 levels, then 2 "Défi" levels. */
const NIV=(titre,desc,modele,seed,liste)=>hzNiveau(titre,desc,modele,seed,liste);
const qChoix=(base,bonne,autres)=>r=>chx(r,Object.assign({},base),[bonne,...autres]);
const mot=(e,n)=>e+' '+n;

/* ---------- Algebra: patterns ---------- */
const repete=(coeur,n)=>Array.from({length:n},(_,i)=>coeur[i%coeur.length]);
const motifQ=(coeur,n,autres)=>{const s=repete(coeur,n+1),bon=s[n];
 return qChoix({texte:'Quel dessin vient ensuite ?',visuel:{grand:s.slice(0,n).join(' ')+'  ❓'},oral:'Regarde le motif. Quel dessin vient ensuite ?',aide:'Le motif se répète : '+coeur.join(' ')+'. Dis-le à voix haute, puis continue.'},bon,autres||[...new Set(coeur)].filter(x=>x!==bon))};
const PAIRES=[['🔴','🔵'],['⭐','🌙'],['🍎','🍌'],['🐱','🐶'],['🟩','🟨'],['❤️','💙'],['🌸','🍀'],['🚗','🚲']];
const TRIOS=[['🔴','🔵','🟡'],['🍎','🍌','🍇'],['⭐','🌙','☀️'],['🟥','🟩','🟦'],['🐱','🐶','🐰'],['🌸','🍀','🌻'],['🚗','🚲','🚌'],['❤️','💛','💚']];
const atelierMotifs={id:'atelier-motifs',titre:'Les motifs',icone:'🔴🔵',couleur:'#b4532a',consigne:'Trouve ce qui vient ensuite dans le motif.',niveaux:[
 NIV('Le motif A B','Deux dessins qui se répètent.',{texte:'🔴 🔵 🔴 🔵 🔴 … Le motif est « rouge, bleu ». Après rouge vient bleu.',visuel:{grand:'🔴 🔵 🔴 🔵 🔴 🔵'}},4101,PAIRES.map((p,i)=>motifQ(p,4+i%3))),
 NIV('Le motif A B C','Trois dessins qui se répètent.',{texte:'🍎 🍌 🍇 🍎 🍌 🍇 … Après le raisin, on recommence avec la pomme.',visuel:{grand:'🍎 🍌 🍇 🍎 🍌 🍇'}},4102,TRIOS.map((t,i)=>motifQ(t,4+i%4))),
 NIV('Le motif A A B','Un dessin deux fois, puis un autre.',{texte:'⭐ ⭐ 🌙 ⭐ ⭐ 🌙 … Le motif est « étoile, étoile, lune ».',visuel:{grand:'⭐ ⭐ 🌙 ⭐ ⭐ 🌙'}},4103,PAIRES.map((p,i)=>motifQ(i%2?[p[0],p[1],p[1]]:[p[0],p[0],p[1]],4+i%3))),
 NIV('Le dessin qui manque','⭐ Défi · Un trou au milieu du motif.',{texte:'🔴 🔵 🟡 🔴 ❓ 🟡 : le motif est rouge, bleu, jaune. Il manque le bleu.',visuel:{grand:'🔴 🔵 🟡 🔴 ❓ 🟡'}},4104,TRIOS.map((t,i)=>{const s=repete(t,8),k=3+i%4,bon=s[k];s[k]='❓';return qChoix({texte:'Quel dessin manque ?',visuel:{grand:s.join(' ')},oral:'Il y a un trou dans le motif. Quel dessin manque ?',aide:'Trouve le motif au début : '+t.join(' ')+'. Puis récite-le jusqu’au trou.'},bon,t.filter(x=>x!==bon))})),
 NIV('Le motif qui grandit','⭐ Défi · Combien de carrés à l’étape suivante ?',{texte:'Étape 1 : 🟦. Étape 2 : 🟦🟦. Étape 3 : 🟦🟦🟦. On ajoute 1 carré à chaque étape : l’étape 4 a 4 carrés.',visuel:{grand:'🟦  |  🟦🟦  |  🟦🟦🟦'}},4105,[[1,1],[2,2],[1,2],[3,1],[2,1],[1,3],[2,3],[4,2]].map(([a,p])=>{const e=[a,a+p,a+2*p],n=a+3*p,em=p%2?'🟦':'🟧';return hzQ({texte:'Combien de carrés à l’étape 4 ?',visuel:{grand:e.map(x=>em.repeat(x)).join('  |  ')+'  |  ?'},oral:'Le motif grandit. Combien de carrés à l’étape 4 ?',aide:'Compte chaque étape : '+e.join(', ')+'. On ajoute '+p+' à chaque fois : '+e[2]+' + '+p+' = '+n+'.'},n,n+1)}))
]};

/* ---------- Algebra: find the rule ---------- */
const regleQ=(depart,pas,signe,autre)=>(r,choix)=>{
 const op=v=>signe==='×'?v*pas:signe==='−'?v-pas:v+pas,s=[depart];for(let i=0;i<3;i++)s.push(op(s[i]));
 const nom=signe+' '+pas,mots=signe==='+'?'On ajoute '+pas:signe==='−'?'On enlève '+pas:'On multiplie par '+pas;
 if(choix)return chx(r,{texte:'Quelle est la règle ?',visuel:{suite:s},oral:'Regarde la suite. Quelle est la règle ?',aide:'Regarde comment on passe de '+s[0]+' à '+s[1]+', puis de '+s[1]+' à '+s[2]+'. '+mots+'.'},[nom,autre]);
 return {type:'nombre',texte:'La règle est « '+nom+' ». Quel nombre vient ensuite ?',visuel:{suite:[s[0],s[1],s[2],'?']},reponse:s[3],aide:mots+' : '+s[2]+' '+signe+' '+pas+' = '+s[3]+'.'};
};
const atelierRegle={id:'atelier-regle',titre:'Trouver la règle',icone:'+2',couleur:'#1a6f7d',consigne:'Trouve la règle de la suite, puis utilise-la.',niveaux:[
 NIV('+ 1 ou + 2 ?','On ajoute toujours le même nombre.',{texte:'3, 5, 7, 9 : de 3 à 5, on ajoute 2. De 5 à 7, on ajoute 2. La règle est « + 2 ».',visuel:{suite:[3,5,7,9]}},4201,[[1,1,'+','+ 2'],[2,2,'+','+ 1'],[5,1,'+','+ 2'],[4,2,'+','+ 1'],[6,2,'+','+ 1'],[3,1,'+','+ 2'],[7,1,'+','+ 2'],[1,2,'+','+ 1']].map(([d,p,s,a])=>regleQ(d,p,s,a))),
 NIV('+ 2, + 5 ou + 10 ?','Des sauts plus grands.',{texte:'10, 20, 30, 40 : on ajoute 10 chaque fois. La règle est « + 10 ».',visuel:{suite:[10,20,30,40]}},4202,[[0,5,'+','+ 2'],[10,10,'+','+ 5'],[2,2,'+','+ 5'],[5,5,'+','+ 10'],[20,10,'+','+ 2'],[4,2,'+','+ 10'],[15,5,'+','+ 2'],[30,10,'+','+ 5']].map(([d,p,s,a])=>regleQ(d,p,s,a))),
 NIV('Les suites qui descendent','On enlève toujours le même nombre.',{texte:'10, 8, 6, 4 : de 10 à 8, on enlève 2. La règle est « − 2 ».',visuel:{suite:[10,8,6,4]}},4203,[[10,1,'−','− 2'],[12,2,'−','+ 2'],[20,5,'−','− 2'],[9,1,'−','+ 1'],[16,2,'−','− 1'],[50,10,'−','− 5'],[25,5,'−','+ 5'],[14,2,'−','− 1']].map(([d,p,s,a])=>regleQ(d,p,s,a))),
 NIV('+ 3 ou + 4 ?','⭐ Défi · Des sauts moins faciles.',{texte:'2, 5, 8, 11 : on ajoute 3 chaque fois. La règle est « + 3 ».',visuel:{suite:[2,5,8,11]}},4204,[[2,3,'+','+ 4'],[1,4,'+','+ 3'],[10,3,'+','+ 2'],[5,4,'+','+ 5'],[20,3,'+','+ 4'],[3,4,'+','+ 3'],[12,4,'+','+ 3'],[30,3,'−','+ 3']].map(([d,p,s,a])=>regleQ(d,p,s,a))),
 NIV('Doubler','⭐ Défi · La règle « × 2 ».',{texte:'1, 2, 4, 8 : chaque nombre est le double du précédent. La règle est « × 2 ». (Avec « + 2 », on aurait 1, 3, 5, 7.)',visuel:{suite:[1,2,4,8]}},4205,[[1,2,'×','+ 2'],[2,2,'×','+ 2'],[3,2,'×','+ 3'],[5,2,'×','+ 5'],[1,2,'×','+ 1'],[4,2,'×','+ 4'],[2,2,'×','+ 4'],[3,2,'×','+ 6']].map(([d,p,s,a])=>regleQ(d,p,s,a)))
]};

/* ---------- Algebra: the balance ---------- */
const balQ=(g,d,bonne,fausse,aide)=>hzQ({texte:'La balance est en équilibre. Combien vaut « ? » ?',visuel:{balance:{g,d}},oral:'La balance est en équilibre. À gauche : '+g.replace('?','combien')+'. À droite : '+d.replace('?','combien')+'. Combien vaut le point d’interrogation ?',aide},bonne,fausse);
const atelierBalance={id:'atelier-balance',titre:'La balance',icone:'⚖️',couleur:'#7a4fb0',consigne:'Quand la balance est en équilibre, les deux côtés valent la même chose.',niveaux:[
 NIV('Équilibrer jusqu’à 10','Ce qui manque d’un côté.',{texte:'3 + ? = 8 : de 3 à 8, il y a 5. Avec 5, les deux côtés valent 8.',visuel:{balance:{g:'3 + 5',d:'8'}}},4301,[[3,8],[2,7],[5,9],[4,10],[1,6],[6,9],[2,10],[7,10]].map(([a,s])=>balQ(a+' + ?',String(s),s-a,s-a+1,'Compte de '+a+' jusqu’à '+s+' : il manque '+(s-a)+'.'))),
 NIV('Un calcul de chaque côté','Calcule d’abord le côté complet.',{texte:'4 + 3 = 5 + ? : à gauche, 4 + 3 = 7. À droite, 5 + 2 = 7. Donc ? = 2.',visuel:{balance:{g:'4 + 3',d:'5 + 2'}}},4302,[[4,3,5],[2,6,4],[5,4,6],[3,3,1],[6,2,7],[1,8,5],[4,4,6],[5,5,7]].map(([a,b,c])=>balQ(a+' + '+b,c+' + ?',a+b-c,a+b-c+1,'À gauche : '+a+' + '+b+' = '+(a+b)+'. À droite, '+c+' + ? doit aussi faire '+(a+b)+'.'))),
 NIV('En équilibre ou pas ?','Calcule les deux côtés.',{texte:'5 + 2 et 4 + 3 : les deux côtés font 7. La balance est en équilibre.',visuel:{balance:{g:'5 + 2',d:'4 + 3'}}},4303,[[5,2,4,3],[6,1,3,3],[2,7,5,4],[4,4,6,3],[3,5,2,6],[8,1,4,4],[1,6,2,5],[5,3,7,2]].map(([a,b,c,d])=>hzC({texte:'Ces deux côtés valent-ils la même chose ?',visuel:{grand:a+' + '+b+'   ⚖️   '+c+' + '+d},aide:a+' + '+b+' = '+(a+b)+' et '+c+' + '+d+' = '+(c+d)+'.'},a+b===c+d?'Oui':'Non',a+b===c+d?'Non':'Oui'))),
 NIV('Équilibrer jusqu’à 20','⭐ Défi · De plus grands nombres.',{texte:'8 + ? = 15 : de 8 à 10, il y a 2. De 10 à 15, il y a 5. 2 + 5 = 7.',visuel:{balance:{g:'8 + 7',d:'15'}}},4304,[[8,15],[9,14],[7,16],[12,19],[6,13],[11,20],[9,17],[13,18]].map(([a,s],i)=>balQ(i%2?'? + '+a:a+' + ?',String(s),s-a,s-a+1,'Compte de '+a+' jusqu’à '+s+' : il manque '+(s-a)+'.'))),
 NIV('Avec la soustraction','⭐ Défi · ? − … ou … − ?',{texte:'12 − ? = 7 : de 7 à 12, il y a 5. Donc 12 − 5 = 7.',visuel:{balance:{g:'12 − 5',d:'7'}}},4305,[[12,7],[15,9],[10,4],[18,10],[14,6],[11,8],[20,12],[16,9]].map(([s,v])=>balQ(s+' − ?',String(v),s-v,s-v+1,'Compte de '+v+' jusqu’à '+s+' : '+(s-v)+'. Vérifie : '+s+' − '+(s-v)+' = '+v+'.')))
]};

/* ---------- Algebra: tables of values ---------- */
const cap=t=>t.replace(/\p{L}/u,c=>c.toUpperCase());
const tabQ=(o,p,k,lignes,n,fausse)=>hzQ({texte:'Complète le tableau : '+n+' '+o+' → combien de '+p+' ?',visuel:{tableau:{entetes:[cap(o),cap(p)],lignes:lignes.map(x=>[x,x*k]).concat([[n,'?']])}},aide:'Pour chaque ligne, on fait × '+k+' : '+n+' × '+k+' = '+(n*k)+'. Tu peux aussi compter de '+k+' en '+k+'.'},n*k,fausse===undefined?n*k+1:fausse);
const TAB2=[['🚲 vélos','roues'],['🧦 paires de chaussettes','chaussettes'],['👀 enfants','yeux'],['🐔 poules','pattes']];
const atelierTableaux={id:'atelier-tableaux',titre:'Les tableaux de valeurs',icone:'📋',couleur:'#2c62a0',consigne:'Trouve la règle du tableau, puis complète la case vide.',niveaux:[
 NIV('Fois 2','1 vélo → 2 roues.',{texte:'1 vélo a 2 roues. 2 vélos : 4 roues. 3 vélos : 6 roues. On fait × 2 (ou on compte de 2 en 2).',visuel:{tableau:{entetes:['🚲 Vélos','Roues'],lignes:[[1,2],[2,4],[3,6]]}}},4401,[0,1,2,3,0,1,2,3].map((t,i)=>tabQ(TAB2[t][0],TAB2[t][1],2,[1,2,3],4+i%2,4+i%2===4?9:11))),
 NIV('Fois 5 et fois 10','Des mains et des paquets.',{texte:'1 main a 5 doigts. 2 mains : 10 doigts. 3 mains : 15 doigts. On compte de 5 en 5.',visuel:{tableau:{entetes:['✋ Mains','Doigts'],lignes:[[1,5],[2,10],[3,15]]}}},4402,[['✋ mains','doigts',5],['📦 paquets de 10 crayons','crayons',10],['⭐ fiches de 5 étoiles','étoiles',5],['💵 billets de 10 $','dollars',10],['✋ mains','doigts',5],['📦 paquets de 10 crayons','crayons',10],['⭐ fiches de 5 étoiles','étoiles',5],['💵 billets de 10 $','dollars',10]].map(([o,p,k],i)=>tabQ(o,p,k,[1,2,3],4+i%2,(4+i%2)*k+k))),
 NIV('Fois 3 et fois 4','Des tricycles et des chats.',{texte:'1 tricycle a 3 roues. 2 tricycles : 6 roues. 3 tricycles : 9 roues. On compte de 3 en 3.',visuel:{tableau:{entetes:['🛺 Tricycles','Roues'],lignes:[[1,3],[2,6],[3,9]]}}},4403,[['🛺 tricycles','roues',3],['🐱 chats','pattes',4],['🍀 trèfles','feuilles',3],['🚗 voitures','roues',4],['🛺 tricycles','roues',3],['🐱 chats','pattes',4],['🍀 trèfles','feuilles',3],['🚗 voitures','roues',4]].map(([o,p,k],i)=>tabQ(o,p,k,[1,2,3],4+i%2,(4+i%2)*k+k))),
 NIV('La ligne qui manque','⭐ Défi · Dans les deux sens.',{texte:'2 roues pour 1 vélo. Avec 8 roues, combien de vélos ? 8 = 2 + 2 + 2 + 2 : 4 vélos.',visuel:{tableau:{entetes:['🚲 Vélos','Roues'],lignes:[[1,2],[2,4],['?',8]]}}},4404,[['🚲 vélos','roues',2,4],['🐱 chats','pattes',4,3],['✋ mains','doigts',5,4],['🛺 tricycles','roues',3,5],['🚗 voitures','roues',4,5],['🧦 paires de chaussettes','chaussettes',2,6],['✋ mains','doigts',5,6],['🛺 tricycles','roues',3,4]].map(([o,p,k,n])=>hzQ({texte:'Combien de '+o.replace(/^\S+ /,'')+' pour '+(n*k)+' '+p+' ?',visuel:{tableau:{entetes:[cap(o),cap(p)],lignes:[[1,k],[2,2*k],['?',n*k]]}},aide:'Compte de '+k+' en '+k+' jusqu’à '+(n*k)+' : '+compte(k,n)+'. Tu as compté '+n+' fois.'},n,n+1))),
 NIV('On ajoute chaque semaine','⭐ Défi · Une règle « + ».',{texte:'J’ai 5 $. Chaque semaine, j’ajoute 2 $ : 5 $, 7 $, 9 $… La règle est « + 2 ».',visuel:{tableau:{entetes:['Semaine','Argent ($)'],lignes:[[1,5],[2,7],[3,9]]}}},4405,[[5,2],[3,4],[10,5],[2,3],[6,2],[1,5],[8,3],[4,4]].map(([d,p])=>hzQ({texte:'Complète le tableau : combien d’argent à la semaine 4 ?',visuel:{tableau:{entetes:['Semaine','Argent ($)'],lignes:[[1,d],[2,d+p],[3,d+2*p],[4,'?']]}},aide:'On ajoute '+p+' $ chaque semaine : '+(d+2*p)+' + '+p+' = '+(d+3*p)+'.'},d+3*p,d+3*p+1,{unite:'$'})))
]};

/* ---------- Financial literacy: coins and bills ---------- */
const ARG=(...parts)=>({blocs:[{k:'argent',parts}]});
const valeurQ=(t,v,autre)=>hzQ({texte:'Combien vaut '+(t==='piece'?'cette pièce':'ce billet')+' ?',visuel:{schema:{blocs:[t==='piece'?{k:'piece',v}:{k:'billet',v}]}},aide:(t==='piece'?(v===1?'La pièce dorée de 1 $ s’appelle le huard.':'La pièce de 2 $ a deux couleurs : c’est le toonie.'):'Le nombre écrit dans les coins du billet est sa valeur : '+v+' $.')},v,autre,{unite:'$'});
const atelierPieces={id:'atelier-pieces',titre:'Pièces et billets',icone:'🪙',couleur:'#a87a12',consigne:'Regarde la pièce ou le billet, puis réponds.',niveaux:[
 NIV('Les pièces de 1 $ et 2 $','Le huard et le toonie.',{texte:'La pièce dorée vaut 1 $ (le huard). La pièce à deux couleurs vaut 2 $ (le toonie).',visuel:{schema:{blocs:[{k:'piece',v:1,titre:'1 $'},{k:'piece',v:2,titre:'2 $'}]}}},4501,[1,2,2,1,2,1,1,2].map(v=>valeurQ('piece',v,3-v))),
 NIV('Les billets','5 $, 10 $, 20 $.',{texte:'Le billet bleu vaut 5 $, le violet 10 $, le vert 20 $. La valeur est écrite dans les coins.',visuel:{schema:{blocs:[{k:'billet',v:5},{k:'billet',v:10},{k:'billet',v:20}]}}},4502,[[5,10],[10,20],[20,10],[5,20],[10,5],[20,5],[5,10],[10,20]].map(([v,a])=>valeurQ('billet',v,a))),
 NIV('Le plus d’argent','Lequel vaut le plus ?',{texte:'Un billet de 5 $ vaut plus qu’une pièce de 2 $ : 5 est plus grand que 2.',visuel:{schema:{blocs:[{k:'piece',v:2},'ou',{k:'billet',v:5}]}}},4503,[[['piece',2],['billet',5]],[['billet',10],['billet',5]],[['piece',1],['piece',2]],[['billet',20],['billet',10]],[['billet',5],['piece',2]],[['piece',2],['piece',1]],[['billet',10],['billet',20]],[['billet',5],['billet',10]]].map(([[ta,a],[tb,b]])=>{const g=Math.max(a,b),p=Math.min(a,b);return qChoix({texte:'Lequel vaut le plus ?',visuel:{schema:{blocs:[{k:ta,v:a},'ou',{k:tb,v:b}]}},aide:g+' $ est plus que '+p+' $.'},g+' $',[p+' $'])})),
 NIV('Échanger','⭐ Défi · Combien de pièces pour un billet ?',{texte:'Un billet de 5 $ = 5 pièces de 1 $. Un billet de 10 $ = 5 pièces de 2 $ (2, 4, 6, 8, 10).',visuel:{schema:{blocs:[{k:'billet',v:5},'=',{k:'argent',parts:[['piece',1],['piece',1],['piece',1],['piece',1],['piece',1]]}]}}},4504,[[5,1,'pièces de 1 $'],[10,2,'pièces de 2 $'],[20,5,'billets de 5 $'],[10,5,'billets de 5 $'],[4,2,'pièces de 2 $'],[20,10,'billets de 10 $'],[6,2,'pièces de 2 $'],[8,1,'pièces de 1 $']].map(([tot,v,nom])=>hzQ({texte:'Combien de '+nom+' pour faire '+tot+' $ ?',visuel:{schema:{blocs:[tot>=5&&tot%5===0?{k:'billet',v:tot}:{k:'porte',v:tot,titre:'',e:'👛'},'=',{k:v>=5?'billet':'piece',v},'× ?']}},aide:'Compte de '+v+' en '+v+' jusqu’à '+tot+' : '+compte(v,tot/v)+'. Cela fait '+(tot/v)+'.'},tot/v,tot/v+1))),
 NIV('Faire 10 $ ou 20 $','⭐ Défi · Ce qui manque.',{texte:'10 $ + 5 $ = 15 $. Pour faire 20 $, il manque 5 $.',visuel:{schema:{blocs:[{k:'argent',parts:[['billet',10],['billet',5]]},'+',{k:'inconnu',titre:'',e:'❓'},'=',{k:'porte',v:20,titre:''}]}}},4505,[[[['billet',5],['piece',2]],10],[[['billet',10],['billet',5]],20],[[['billet',5],['piece',2],['piece',1]],10],[[['billet',10],['piece',2],['piece',2]],20],[[['piece',2],['piece',2],['piece',2]],10],[[['billet',10],['billet',5],['piece',2]],20],[[['billet',5],['piece',1]],10],[[['billet',5],['billet',5],['billet',5]],20]].map(([parts,but])=>{const a=parts.reduce((s,p)=>s+p[1],0);return hzQ({texte:'Combien manque-t-il pour faire '+but+' $ ?',visuel:{schema:{blocs:[{k:'argent',parts},'+',{k:'inconnu',e:'❓'},'=',{k:'porte',v:but}]}},aide:'Tu as '+parts.map(p=>p[1]+' $').join(' + ')+' = '+a+' $. De '+a+' à '+but+', il manque '+(but-a)+' $.'},but-a,but-a+1,{unite:'$'})})
)]};

/* ---------- Financial literacy: counting money ---------- */
const P=v=>['piece',v],B=v=>['billet',v];
const somme=parts=>parts.reduce((s,p)=>s+p[1],0);
const compteQ=parts=>{const t=somme(parts),tri=parts.slice().sort((a,b)=>b[1]-a[1]);let c=0;const pas=tri.map(p=>c+=p[1]);
 return hzQ({texte:'Combien d’argent y a-t-il ?',visuel:{schema:ARG(...parts)},oral:'Compte l’argent. Combien y a-t-il de dollars ?',aide:'Commence par le plus grand, puis ajoute : '+pas.join(', ')+'. Il y a '+t+' $.'},t,t+1,{unite:'$'})};
const atelierCompter={id:'atelier-compter',titre:'Compter l’argent',icone:'💰',couleur:'#2f8a4b',consigne:'Compte l’argent, en commençant par le plus grand.',niveaux:[
 NIV('Compter les pièces','Des pièces de 1 $ et de 2 $.',{texte:'2 $ + 2 $ + 1 $ : je compte 2, 4, puis 5. Il y a 5 $.',visuel:{schema:ARG(P(2),P(2),P(1))}},4601,[[P(2),P(1)],[P(1),P(1),P(1)],[P(2),P(2)],[P(2),P(1),P(1)],[P(2),P(2),P(1)],[P(1),P(2),P(2),P(2)],[P(2),P(2),P(2),P(1)],[P(2),P(2),P(2),P(2)]].map(compteQ)),
 NIV('Compter les billets','5 $, 10 $ et 20 $.',{texte:'10 $ + 5 $ + 5 $ : je compte 10, 15, 20. Il y a 20 $.',visuel:{schema:ARG(B(10),B(5),B(5))}},4602,[[B(5),B(5)],[B(10),B(5)],[B(10),B(10)],[B(20),B(5)],[B(10),B(5),B(5)],[B(20),B(10)],[B(5),B(10),B(10)],[B(20),B(10),B(5)]].map(compteQ)),
 NIV('Billets et pièces','Un billet, puis les pièces.',{texte:'5 $ + 2 $ + 1 $ : je commence par le billet, 5, puis 7, puis 8. Il y a 8 $.',visuel:{schema:ARG(B(5),P(2),P(1))}},4603,[[B(5),P(1)],[B(5),P(2)],[B(10),P(2)],[B(5),P(2),P(1)],[B(10),P(1),P(1)],[B(10),P(2),P(2)],[P(2),B(5),P(2)],[P(1),B(10),P(2)]].map(compteQ)),
 NIV('Jusqu’à 50 $','⭐ Défi · Plus de billets.',{texte:'20 $ + 10 $ + 5 $ + 2 $ : 20, 30, 35, 37. Il y a 37 $.',visuel:{schema:ARG(B(20),B(10),B(5),P(2))}},4604,[[B(20),B(10),P(2)],[B(20),B(5),P(2),P(1)],[B(10),B(10),B(5),P(2)],[B(20),B(20),P(1)],[B(20),B(10),B(5),P(2)],[B(10),B(5),B(5),P(2),P(2)],[B(20),B(20),B(5)],[B(20),B(10),B(10),P(2),P(1)]].map(compteQ)),
 NIV('Assez pour acheter ?','⭐ Défi · Compare avec le prix.',{texte:'J’ai 5 $ + 2 $ = 7 $. Le jouet coûte 9 $. 7 $, c’est moins que 9 $ : il me manque 2 $.',visuel:{schema:{blocs:[{k:'argent',parts:[B(5),P(2)],titre:'Tu as'},'→',{k:'article',e:'🧸',n:'Ourson',p:9}]}}},4605,[[[B(5),P(2)],'🧸','Ourson',6],[[B(10),P(1)],'⚽','Ballon',12],[[B(5),P(2),P(2)],'📚','Livre',8],[[B(10),B(5)],'🎨','Peinture',17],[[B(5),P(1)],'🧢','Casquette',9],[[B(10),P(2)],'🎲','Jeu',15],[[B(5),B(5),P(2)],'🪁','Cerf-volant',14],[[B(10),P(2),P(1)],'🎒','Sac',16]].map(([parts,e,n,prix],i)=>(r,choix)=>{const t=somme(parts),base={visuel:{schema:{blocs:[{k:'argent',parts,titre:'Tu as'},'→',{k:'article',e,n,p:prix}]}}};
   if(choix)return chx(r,Object.assign(base,{texte:'As-tu assez d’argent pour acheter cet article ?',aide:'Compte ton argent : '+t+' $. Le prix est '+prix+' $. '+(t>=prix?t+' $, c’est assez.':t+' $, c’est moins que '+prix+' $.')}),t>=prix?['✅ Oui','❌ Non']:['❌ Non','✅ Oui']);
   return Object.assign(base,{type:'nombre',texte:'Tu n’as pas assez. Combien d’argent te manque-t-il ?',reponse:prix-t,unite:'$',aide:'Ton argent : '+t+' $. De '+t+' à '+prix+', il manque '+(prix-t)+' $.'})}))
]};

/* ---------- Financial literacy: needs and wants ---------- */
const BESOINS=[['🍎','des fruits'],['💧','de l’eau'],['🧥','un manteau d’hiver'],['🛏️','un lit'],['🧼','du savon'],['🥛','du lait'],['🍞','du pain'],['🦷','une brosse à dents']];
const DESIRS=[['🎮','un jeu vidéo'],['🍭','des bonbons'],['🧸','un nouveau jouet'],['🎢','une sortie au parc d’attractions'],['🍦','une crème glacée'],['⚽','un ballon neuf'],['🎧','des écouteurs'],['📱','un nouveau téléphone']];
const AIDE_BD='Un besoin, c’est ce qu’il faut pour vivre et rester en santé : manger, boire, dormir, avoir chaud, être propre. Un désir, c’est agréable, mais on peut vivre sans.';
const atelierBesoins={id:'atelier-besoins',titre:'Besoins et désirs',icone:'🛒',couleur:'#b0476b',consigne:'Un besoin, on ne peut pas s’en passer. Un désir, c’est un plaisir.',niveaux:[
 NIV('Besoin ou désir ?','Trier les achats.',{texte:'Le pain est un besoin : on en a besoin pour manger. Les bonbons sont un désir : c’est bon, mais on peut vivre sans.',visuel:{grand:'🍞 besoin    🍭 désir'}},4701,[0,1,2,3,4,5,6,7].map(i=>{const [e,n]=(i%2?DESIRS:BESOINS)[i];return hzC({texte:mot(e,n)+' : est-ce un besoin ou un désir ?',visuel:{grand:e},aide:AIDE_BD},i%2?'Un désir':'Un besoin',i%2?'Un besoin':'Un désir')})),
 NIV('Lequel est un besoin ?','Choisis entre deux.',{texte:'De l’eau ou des écouteurs ? L’eau est un besoin : on doit boire pour vivre.',visuel:{grand:'💧   ou   🎧'}},4702,[0,1,2,3,4,5,6,7].map(i=>{const b=BESOINS[i],d=DESIRS[(i+3)%8];return qChoix({texte:'Lequel est un besoin ?',visuel:{grand:b[0]+'   ou   '+d[0]},aide:AIDE_BD},mot(b[0],b[1]),[mot(d[0],d[1])])})),
 NIV('Économiser chaque semaine','Mettre de l’argent de côté.',{texte:'Je mets 2 $ de côté chaque semaine. Après 3 semaines : 2 + 2 + 2 = 6 $.',visuel:{tableau:{entetes:['Semaine','Économies ($)'],lignes:[[1,2],[2,4],[3,6]]}}},4703,[[2,3],[5,2],[1,4],[3,3],[2,5],[5,3],[4,2],[3,4]].map(([p,n])=>hzQ({texte:'Tu mets '+p+' $ de côté chaque semaine. Combien as-tu après '+n+' semaines ?',visuel:{grand:Array(n).fill('🐷 '+p+' $').join('   ')},aide:'Compte de '+p+' en '+p+', '+n+' fois : '+compte(p,n)+'.'},p*n,p*n+p,{unite:'$'}))),
 NIV('Combien de semaines ?','⭐ Défi · Économiser pour un désir.',{texte:'Le ballon coûte 12 $. J’économise 3 $ par semaine : 3, 6, 9, 12. Il faut 4 semaines.',visuel:{grand:'⚽ 12 $    🐷 3 $ par semaine'}},4704,[[['⚽','un ballon'],12,3],[['🧸','un jouet'],10,2],[['🎧','des écouteurs'],20,5],[['📚','un livre'],8,2],[['🎮','un jeu'],15,5],[['🪁','un cerf-volant'],9,3],[['🎨','une boîte de peinture'],12,4],[['🧢','une casquette'],10,5]].map(([[e,n],prix,p])=>hzQ({texte:'Tu veux '+n+' à '+prix+' $. Tu économises '+p+' $ par semaine. Combien de semaines faut-il ?',visuel:{grand:e+' '+prix+' $    🐷 '+p+' $ par semaine'},aide:'Compte de '+p+' en '+p+' jusqu’à '+prix+' : '+compte(p,prix/p)+'. Cela fait '+(prix/p)+' semaines.'},prix/p,prix/p+1))),
 NIV('Le besoin d’abord','⭐ Défi · Ce qui reste pour un désir.',{texte:'J’ai 15 $. J’achète d’abord le pain à 4 $ (un besoin). Il me reste 15 − 4 = 11 $ pour un désir.',visuel:{schema:{blocs:[{k:'porte',v:15,titre:'Tu as'},'−',{k:'article',e:'🍞',n:'Pain',p:4},'=',{k:'inconnu',titre:'Il reste',e:'👛'}]}}},4705,[[15,'🍞','Pain',4],[10,'🥛','Lait',3],[20,'🧥','Mitaines',8],[12,'🧼','Savon',5],[18,'🍎','Fruits',6],[20,'🦷','Brosse à dents',7],[14,'🍞','Pain',5],[16,'🥛','Lait',4]].map(([a,e,n,p])=>hzQ({texte:'Tu as '+a+' $. Tu achètes d’abord : '+n.toLowerCase()+' à '+p+' $ (un besoin). Combien te reste-t-il ?',visuel:{schema:{blocs:[{k:'porte',v:a,titre:'Tu as'},'−',{k:'article',e,n,p},'=',{k:'inconnu',titre:'Il reste',e:'👛'}]}},aide:a+' − '+p+' = '+(a-p)+' $. Compte de '+p+' jusqu’à '+a+'.'},a-p,a-p+1,{unite:'$'})))
]};

/* ---------- Financial literacy: comparing prices ---------- */
const OBJETS_PRIX=[['📒','Cahier'],['🧃','Jus'],['🧸','Ourson'],['⚽','Ballon'],['📚','Livre'],['🎨','Peinture'],['🧢','Casquette'],['🍎','Pomme'],['🎲','Jeu'],['✏️','Crayons']];
const prixQ=(i,j,a,b,moins)=>{const A=OBJETS_PRIX[i],Bo=OBJETS_PRIX[j],bon=(moins?a<b:a>b)?A:Bo,mal=bon===A?Bo:A;
 return qChoix({texte:moins?'Lequel coûte le moins cher ?':'Lequel coûte le plus cher ?',visuel:{schema:{blocs:[{k:'article',e:A[0],n:A[1],p:a},'ou',{k:'article',e:Bo[0],n:Bo[1],p:b}]}},aide:'Compare les prix : '+a+' $ et '+b+' $. '+Math.min(a,b)+' est plus petit que '+Math.max(a,b)+'.'},mot(bon[0],bon[1]),[mot(mal[0],mal[1])])};
const atelierPrix={id:'atelier-prix',titre:'Comparer les prix',icone:'🏷️',couleur:'#c2633a',consigne:'Regarde bien les prix avant de choisir.',niveaux:[
 NIV('Le moins cher','Le plus petit prix.',{texte:'Le jus à 3 $ ou le cahier à 5 $ ? 3 est plus petit que 5 : le jus coûte le moins cher.',visuel:{schema:{blocs:[{k:'article',e:'🧃',n:'Jus',p:3},'ou',{k:'article',e:'📒',n:'Cahier',p:5}]}}},4801,[[0,1,5,3],[2,3,8,9],[4,5,7,4],[6,7,6,2],[8,9,10,6],[1,2,4,9],[3,4,12,8],[5,6,5,7]].map(([i,j,a,b])=>prixQ(i,j,a,b,true))),
 NIV('Le plus cher','Le plus grand prix.',{texte:'L’ourson à 9 $ ou le ballon à 6 $ ? 9 est plus grand que 6 : l’ourson coûte le plus cher.',visuel:{schema:{blocs:[{k:'article',e:'🧸',n:'Ourson',p:9},'ou',{k:'article',e:'⚽',n:'Ballon',p:6}]}}},4802,[[2,3,9,6],[0,4,4,8],[5,1,7,3],[9,6,5,11],[7,8,2,10],[3,5,13,9],[4,0,6,15],[1,9,4,3]].map(([i,j,a,b])=>prixQ(i,j,a,b,false))),
 NIV('Ai-je assez d’argent ?','Compare ton argent et le prix.',{texte:'J’ai 10 $. Le livre coûte 8 $. 8 est plus petit que 10 : j’ai assez d’argent.',visuel:{schema:{blocs:[{k:'porte',v:10,titre:'Tu as'},'→',{k:'article',e:'📚',n:'Livre',p:8}]}}},4803,[[10,4,8],[5,3,7],[12,6,9],[8,2,11],[20,5,15],[6,0,6],[15,8,18],[9,1,7]].map(([a,i,p])=>{const o=OBJETS_PRIX[i],ok=a>=p;return hzC({texte:'Tu as '+a+' $. Peux-tu acheter cet article ?',visuel:{schema:{blocs:[{k:'porte',v:a,titre:'Tu as'},'→',{k:'article',e:o[0],n:o[1],p}]}},aide:'Tu as '+a+' $ et le prix est '+p+' $. '+(ok?(a===p?'C’est exactement le prix : c’est assez.':a+' est plus grand que '+p+' : c’est assez.'):a+' est plus petit que '+p+' : ce n’est pas assez.')},ok?'✅ Oui':'❌ Non',ok?'❌ Non':'✅ Oui')})),
 NIV('Combien de plus ?','⭐ Défi · La différence entre deux prix.',{texte:'Le livre coûte 9 $ et le jeu 15 $. De 9 à 15, il y a 6 : le jeu coûte 6 $ de plus.',visuel:{schema:{blocs:[{k:'article',e:'📚',n:'Livre',p:9},'et',{k:'article',e:'🎲',n:'Jeu',p:15}]}}},4804,[[4,8,9,15],[0,3,5,12],[1,2,3,10],[6,5,8,14],[7,9,2,7],[3,8,11,18],[0,6,4,13],[5,4,6,16]].map(([i,j,a,b])=>{const A=OBJETS_PRIX[i],Bo=OBJETS_PRIX[j];return hzQ({texte:'Combien de dollars de plus coûte : '+Bo[1].toLowerCase()+' ?',visuel:{schema:{blocs:[{k:'article',e:A[0],n:A[1],p:a},'et',{k:'article',e:Bo[0],n:Bo[1],p:b}]}},aide:'Compte de '+a+' jusqu’à '+b+' : '+(b-a)+'. Ou fais '+b+' − '+a+' = '+(b-a)+'.'},b-a,b-a+1,{unite:'$'})})),
 NIV('À l’unité ou en paquet ?','⭐ Défi · Le meilleur prix.',{texte:'1 crayon coûte 2 $. 3 crayons à l’unité : 2 + 2 + 2 = 6 $. Le paquet de 3 coûte 5 $. Le paquet est moins cher.',visuel:{schema:{blocs:[{k:'article',e:'✏️',n:'1 crayon',p:2},'ou',{k:'article',e:'📦',n:'Paquet de 3',p:5}]}}},4805,[[['✏️','crayon','crayons'],2,3,5],[['🧃','jus','jus'],3,2,5],[['🍎','pomme','pommes'],1,4,5],[['📒','cahier','cahiers'],4,3,10],[['🧃','jus','jus'],2,4,9],[['✏️','crayon','crayons'],1,5,4],[['🍎','pomme','pommes'],2,3,7],[['📒','cahier','cahiers'],3,2,5]].map(([[e,s,pl],u,n,paq])=>(r,choix)=>{const t=u*n,base={visuel:{schema:{blocs:[{k:'article',e,n:'1 '+s,p:u},'ou',{k:'article',e:'📦',n:'Paquet de '+n,p:paq}]}}};
   if(choix)return chx(r,Object.assign(base,{texte:'Tu veux '+n+' '+pl+'. Qu’est-ce qui coûte le moins cher ?',aide:n+' '+pl+' à l’unité : '+Array(n).fill(u).join(' + ')+' = '+t+' $. Le paquet : '+paq+' $. '+(t<paq?t+' est plus petit que '+paq+'.':paq+' est plus petit que '+t+'.')}),t<paq?['À l’unité','Le paquet']:['Le paquet','À l’unité']);
   return Object.assign(base,{type:'nombre',texte:'Combien coûtent '+n+' '+pl+' achetés à l’unité ?',reponse:t,unite:'$',aide:n+' fois '+u+' $ : '+Array(n).fill(u).join(' + ')+' = '+t+' $.'})}))
]};
var NOUVELLES_HZ={atelierMotifs,atelierRegle,atelierBalance,atelierTableaux,atelierPieces,atelierCompter,atelierBesoins,atelierPrix};
}
}



window.EC_MATHS={
  ordre:['formes','calculs','tables','completer','fractions','division','dizaines','centaines','milliers','valeur','composer','egal','comparer','situer','sortes','proprietes','regrouper','decomposer','heure','trajets','dessins','droites','finances','mesures','partage','suites','problemes','atelier-motifs','atelier-regle','atelier-balance','atelier-tableaux','atelier-pieces','atelier-compter','atelier-besoins','atelier-prix'],
  activites:{formes,calculs,tables,completer,fractions,division,dizaines,centaines,milliers,valeur,composer,egal,comparer,situer,sortes,proprietes,regrouper,decomposer,heure:lireHeure,trajets,dessins,droites,finances,mesures,partage,suites,problemes,'atelier-motifs':NOUVELLES_HZ.atelierMotifs,'atelier-regle':NOUVELLES_HZ.atelierRegle,'atelier-balance':NOUVELLES_HZ.atelierBalance,'atelier-tableaux':NOUVELLES_HZ.atelierTableaux,'atelier-pieces':NOUVELLES_HZ.atelierPieces,'atelier-compter':NOUVELLES_HZ.atelierCompter,'atelier-besoins':NOUVELLES_HZ.atelierBesoins,'atelier-prix':NOUVELLES_HZ.atelierPrix},
  formesNoms:FORMES_NOMS,scenes:SCENES,decor:DECOR,
  figures:FIGURES,coloriages:COLORIAGES,legende:LEGENDE
};
})();
