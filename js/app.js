(() => {
/* ============ data (cards live in js/cards.js) ============ */

const ROUNDS = [
  null,
  {n:1, pill:'var(--r1)', rule:'Use any words, sounds, or gestures', sub:"You can't say the name itself"},
  {n:2, pill:'var(--r2)', rule:'Use only one word', sub:'You can repeat it and use gestures'},
  {n:3, pill:'var(--r3)', rule:'Act it out', sub:'No words at all. Sound effects are okay'}
];
// One card shown across the three rounds, used in How to play and the round intro help
const ROUND_EX = [null,
  {card:'Jeepney', say:'You say', clue:'"Colorful ride. You say <i>para</i> to get off."', coach:'Describe this card to your team without saying its name'},
  {card:'Jeepney', say:'You say', clue:'"Para!"', coach:'Give your team just one word'},
  {card:'Jeepney', say:'You act', clue:'Grab an overhead bar and bounce.', coach:'Act it out. No words, sound effects are okay'}];
const TURN_MS = 60000, PER_PLAYER = 5, EXTRA = 10, MIN_P = 4, MAX_P = 8;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============ icons ============ */
const I = {
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/></svg>',
  pencil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 13v-2h10v2H7z"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7v2z"/></svg>',
  dice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6M6 18h.01M10 14h.01M15 6h.01M18 9h.01"/></svg>',  // lucide "dices", ISC
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  expand:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21v-8h2v4.6L17.6 5H13V3h8v8h-2V6.4L6.4 19H11v2H3z"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  exit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  cube:'<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#1e1e1e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M29.3333 20.6667V11.3333L16 2.66667L2.66667 11.3333V20.6667L16 29.3333L29.3333 20.6667ZM16 2.66667V11.3333M29.3333 11.3333L16 20.6667M29.3333 20.6667L16 11.3333M16 29.3333V20.6667M2.66667 20.6667L16 11.3333M2.66667 11.3333L16 20.6667"/></svg>',
  hand:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#1d1b20"><path d="M12 12V2C12 1.71667 12.0958 1.47917 12.2875 1.2875C12.4792 1.09583 12.7167 1 13 1C13.2833 1 13.5208 1.09583 13.7125 1.2875C13.9042 1.47917 14 1.71667 14 2V12H12ZM8 12V3C8 2.71667 8.09583 2.47917 8.2875 2.2875C8.47917 2.09583 8.71667 2 9 2C9.28333 2 9.52083 2.09583 9.7125 2.2875C9.90417 2.47917 10 2.71667 10 3V12H8ZM12.5 23C10.1333 23 8.125 22.175 6.475 20.525C4.825 18.875 4 16.8667 4 14.5V5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4C5.28333 4 5.52083 4.09583 5.7125 4.2875C5.90417 4.47917 6 4.71667 6 5V14.5C6 16.3167 6.62917 17.8542 7.8875 19.1125C9.14583 20.3708 10.6833 21 12.5 21C14.3167 21 15.8542 20.3708 17.1125 19.1125C18.3708 17.8542 19 16.3167 19 14.5V11C18.7167 11 18.4792 11.0958 18.2875 11.2875C18.0958 11.4792 18 11.7167 18 12V16H15C14.45 16 13.9792 16.1958 13.5875 16.5875C13.1958 16.9792 13 17.45 13 18V19H11V18C11 16.9 11.3917 15.9583 12.175 15.175C12.9583 14.3917 13.9 14 15 14H16V4C16 3.71667 16.0958 3.47917 16.2875 3.2875C16.4792 3.09583 16.7167 3 17 3C17.2833 3 17.5208 3.09583 17.7125 3.2875C17.9042 3.47917 18 3.71667 18 4V9.175C18.1667 9.125 18.3292 9.08333 18.4875 9.05C18.6458 9.01667 18.8167 9 19 9H21V14.5C21 16.8667 20.175 18.875 18.525 20.525C16.875 22.175 14.8667 23 12.5 23Z"/></svg>'
};

/* ============ faces for the cover ============ */
/* Drawn from the Figma cover (node 2506:1810): 45x45 faces, five rows of three. */
const MOUTH = '#c73123', BLK = '#000', TEAL = '#3d97a7';
const eye = (x, y, {r=8.5, p=4.5, dx=0, ring=false}={}) =>
  `<g class="blink"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff"${ring ? ` stroke="${BLK}" stroke-width="2"` : ''}/><circle class="pupil" cx="${x+dx}" cy="${y}" r="${p}" fill="${BLK}"/></g>`;
const eyes = (a, b, y=8.5, o) => eye(a, y, o) + eye(b, y, o);
const SPIRAL = [
  'M14.3246 12.0455C14.0981 11.8157 13.7028 11.8156 13.4762 12.0455C12.373 13.1652 10.9066 13.7818 9.34725 13.7818C7.788 13.7818 6.3218 13.1652 5.21858 12.0455C3.19316 9.9896 3.19316 6.64423 5.21858 4.5878C6.09029 3.70294 7.24947 3.21571 8.48223 3.21571C9.71507 3.21571 10.8743 3.70294 11.7459 4.5878C12.5329 5.38678 12.9843 6.5009 12.9843 7.6444C12.9843 8.75419 12.5719 9.78382 11.8231 10.5437C11.1485 11.2287 10.1863 11.6216 9.18284 11.6216C8.17948 11.6216 7.21719 11.2288 6.54223 10.5437C5.94068 9.93268 5.60528 9.0665 5.62251 8.16718C5.63935 7.27342 5.98777 6.463 6.60317 5.88467C7.07925 5.43747 7.69576 5.19112 8.33892 5.19112C9.09763 5.19112 9.83417 5.51892 10.4126 6.11433C11.2876 7.01499 11.088 8.41947 10.3526 9.16636C9.98659 9.53766 9.51704 9.74239 9.03052 9.74239C8.57768 9.74239 8.14798 9.5711 7.78809 9.24719C7.51803 9.00399 7.349 8.51873 7.37697 8.06663C7.3937 7.7946 7.48798 7.41889 7.84075 7.1738C7.97314 7.08197 8.06226 6.94329 8.0918 6.78342C8.12144 6.62335 8.08777 6.46118 7.99721 6.327C7.8169 6.05948 7.42736 5.98452 7.16298 6.16819C6.57611 6.57585 6.22653 7.22315 6.17902 7.99028C6.1278 8.81685 6.44702 9.66805 6.99175 10.1585C7.57088 10.6798 8.29534 10.9669 9.03185 10.9669C9.83384 10.9669 10.6042 10.6332 11.2009 10.0277C12.4833 8.72617 12.5135 6.54228 11.2669 5.25899C10.4586 4.42687 9.41881 3.96889 8.33954 3.96889C7.39577 3.96889 6.48956 4.332 5.78776 4.99095C4.94302 5.7846 4.44555 6.93381 4.42242 8.14389C4.39898 9.37299 4.86246 10.5617 5.69356 11.4052C6.59129 12.3168 7.86315 12.8397 9.18272 12.8397C10.5023 12.8397 11.774 12.3169 12.6719 11.4052C13.6473 10.4155 14.1844 9.07997 14.1844 7.64474C14.1844 6.18042 13.6047 4.75238 12.5945 3.72672C11.4978 2.61336 10.0375 2 8.48251 2C6.92738 2 5.46684 2.61333 4.36997 3.72672C1.87664 6.25787 1.87672 10.3764 4.36997 12.9072C5.69925 14.2568 7.4668 15 9.347 15C11.2276 15 12.9953 14.2567 14.3246 12.9072C14.5585 12.6698 14.5585 12.2834 14.3246 12.0456L14.3246 12.0455Z',
  'M8.34182 1.68306C8.42758 1.99408 8.23 2.33649 7.91763 2.41776C6.39627 2.81329 5.12913 3.77488 4.34944 5.12535C3.56981 6.4757 3.37071 8.05377 3.78883 9.56906C4.55655 12.3511 7.45373 14.0237 10.2474 13.2979C11.4495 12.9854 12.4511 12.2251 13.0674 11.1575C13.6839 10.0899 13.8415 8.84236 13.511 7.64508C13.2126 6.564 12.4734 5.61603 11.4831 5.04428C10.522 4.48939 9.42414 4.33169 8.39164 4.60022C7.46114 4.84203 6.6398 5.47883 6.13807 6.34786C5.63638 7.2168 5.49541 8.24656 5.75119 9.17361C5.9796 10.0001 6.56203 10.7237 7.34948 11.1584C8.13192 11.5907 9.00797 11.6942 9.81653 11.4504C10.4418 11.2617 10.9635 10.8509 11.285 10.2939C11.6644 9.63687 11.7488 8.83511 11.5223 8.03649C11.1799 6.82837 9.86373 6.29902 8.84921 6.56243C8.34466 6.69374 7.93258 6.99802 7.68932 7.41936C7.4629 7.81153 7.39639 8.26931 7.49696 8.74294C7.57255 9.09841 7.90828 9.48743 8.31379 9.68926C8.55775 9.81079 8.93026 9.91699 9.3189 9.73402C9.46462 9.66528 9.62928 9.65744 9.7825 9.7118C9.93594 9.76617 10.0596 9.87641 10.1305 10.0219C10.272 10.3118 10.1421 10.6867 9.8509 10.8238C9.20442 11.1282 8.46905 11.1073 7.78094 10.7649C7.0395 10.396 6.46194 9.69391 6.30955 8.97691C6.14764 8.21472 6.26131 7.44382 6.62957 6.80598C7.03056 6.11143 7.70474 5.61109 8.52743 5.39708C10.2958 4.93725 12.2022 6.00309 12.6903 7.72429C13.0068 8.84034 12.8835 9.96985 12.3438 10.9045C11.8719 11.7219 11.1044 12.3251 10.1828 12.6034C9.07312 12.9381 7.82914 12.7944 6.76961 12.2093C5.69345 11.6151 4.89571 10.6193 4.58077 9.47782C4.24017 8.24458 4.42329 6.88168 5.08308 5.7389C5.74287 4.59611 6.83143 3.75619 8.06993 3.43442C9.4148 3.0846 10.8399 3.2872 12.0829 4.00482C13.351 4.73698 14.2979 5.95299 14.681 7.34067C15.0969 8.84713 14.8979 10.4185 14.1204 11.7651C13.3429 13.1119 12.0814 14.0701 10.5688 14.4634C7.13006 15.3571 3.56339 13.2978 2.6182 9.87309C2.1141 8.04713 2.35424 6.14478 3.29434 4.51647C4.23461 2.88787 5.76223 1.7286 7.5955 1.25215C7.91808 1.1683 8.2527 1.3615 8.34173 1.68299L8.34182 1.68306Z'
];
const FACES = [
  // above the wordmark
  () => eye(22.5, 8.5) + `<rect y="25" width="45" height="20" rx="10" fill="${MOUTH}"/>`,
  () => eyes(8.5, 36.5) + `<rect y="29" width="45" height="4" rx="2" fill="${MOUTH}"/><path d="M8.5 33h6l-3 6zM30.5 33h6l-3 6z" fill="${MOUTH}"/>`,
  () => eyes(8.5, 36.5) + `<path d="M1 23h43v.5a21.5 21.5 0 0 1-43 0z" fill="${MOUTH}"/>`,
  () => eye(8.5, 8.5, {dx:1}) + eye(36.5, 8.5, {dx:-1}) + `<rect y="29" width="45" height="4" rx="2" fill="${MOUTH}"/><path d="M18.5 33h8v2a4 4 0 0 1-8 0z" fill="${MOUTH}"/>`,
  () => [0, 28].map(x => `<g transform="translate(${x} 0)"><path d="M0 0h17v.5a8.5 8.5 0 0 1-17 0z" fill="#fff"/><path d="M4 0h9v.5a4.5 4.5 0 0 1-9 0z" fill="${BLK}"/></g>`).join('')
    + `<g transform="translate(1 15)"><path d="M0 21.5C0 9.63 9.63 0 21.5 0S43 9.63 43 21.5V22H0z" fill="${MOUTH}"/><path d="M31 20c2.21 0 4 1.68 4 3.75V28" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`,
  () => eyes(10, 35) + `<path d="M0 35v-2a8 8 0 0 1 8-8h29a8 8 0 0 1 8 8v2z" fill="${BLK}"/>`,
  // below the wordmark
  () => eye(9.5, 8.5) + `<path d="M27 0h11a6 6 0 0 1 6 6v11H33a6 6 0 0 1-6-6z" fill="${BLK}"/>`
    + `<path d="M1 23h43a17 17 0 0 1-17 17h-9A17 17 0 0 1 1 23z" fill="${MOUTH}"/><path d="M9 23h4v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" fill="#f90"/>`,
  i => `<defs><clipPath id="squint${i}"><rect y="7" width="16" height="7" rx="3.5"/></clipPath></defs>`
    + `<g class="blink"><rect y="7" width="16" height="7" rx="3.5" fill="#fff"/><g clip-path="url(#squint${i})"><circle class="pupil" cx="8" cy="10.5" r="4" fill="${BLK}"/></g></g>`
    + eye(34.5, 10.5, {r:10.5}) + `<rect x="16.5" y="33" width="12" height="4" rx="2" fill="${MOUTH}"/>`,
  () => eyes(8.5, 36.5) + `<path d="M1 45v-.5a21.5 21.5 0 0 1 43 0v.5z" fill="${MOUTH}"/>`,
  () => SPIRAL.map((d, k) => `<g class="blink"><circle cx="${10 + k*25}" cy="8.5" r="8.5" fill="#fff"/><path transform="translate(${1.5 + k*25} 0)" d="${d}" fill="${TEAL}"/></g>`).join('')
    + `<rect x="9.5" y="25" width="26" height="4" rx="2" fill="${MOUTH}"/>`,
  () => eyes(10, 35) + `<rect x="14.5" y="25" width="16" height="16" rx="6" fill="${MOUTH}"/><path d="M19 25h4v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z" fill="#d9d9d9"/>`,
  () => `<circle cx=".5" cy="10.5" r="1" fill="${BLK}"/><circle cx="44.5" cy="10.5" r="1" fill="${BLK}"/>`
    + eyes(12, 33, 10.5, {r:10.5, ring:true}) + `<rect x="10.5" y="33" width="24" height="4" rx="2" fill="${MOUTH}"/>`,
  () => eyes(8.5, 36.5) + `<g fill="${BLK}"><rect x=".25" y="28.7" width="44.5" height="8" transform="rotate(15.17 22.5 32.7)"/><rect x=".25" y="28.7" width="44.5" height="8" transform="rotate(-15.17 22.5 32.7)"/></g>`
    + `<rect x="14.5" y="24" width="16" height="18" rx="3" fill="${MOUTH}"/>`,
  () => [8.5, 36.5].map(x => `<g class="blink"><circle cx="${x}" cy="8.5" r="8.5" fill="#fff"/><rect class="pupil" x="${x-1.5}" y="3" width="3" height="11" rx="1" fill="${BLK}"/></g>`).join('')
    + `<rect x="6.5" y="29" width="32" height="4" rx="2" fill="${MOUTH}"/><rect x="19.5" y="33" width="6" height="12" fill="${MOUTH}"/>`,
  () => `<rect x="6.5" width="32" height="45" rx="6" fill="${MOUTH}"/><circle cx="22.5" cy="12" r="8" fill="#fff"/><circle cx="22.5" cy="12" r="7" fill="${BLK}"/><circle cx="22.5" cy="12" r="3" fill="#cb2601"/>`
    + `<g fill="${BLK}">${[29.5, 34.5, 39.5].map(y => [0,1,2,3,4,5].map(k => `<circle cx="${12 + k*4.2}" cy="${y}" r="1.5"/>`).join('')).join('')}</g>`
];
function face(draw, i){
  return `<svg viewBox="0 0 45 45" aria-hidden="true" style="--d:${(i*0.73)%5}s">${draw(i)}</svg>`;
}
// Team icons: one of the cover faces on a colored circle. Players can change both on the "Who goes first" screen.
const AV_COLORS = ['#c5e8ff','#beffb4','#ffd6e6','#fff1a6','#e4d7ff','#ffdcc2'];  // soft pastels so the faces read clearly
function avatar(t, cls=''){ const a=S.avatars[t]; return `<span class="avatar ${cls}" style="background:${AV_COLORS[a.c]}">${face(FACES[a.f], a.f)}</span>`; }
function faceGrid(list, offset=0){
  return `<div class="faces">${list.map((f,i)=>face(f,i+offset)).join('')}</div>`;
}

/* ============ state ============ */
const fresh = () => ({
  screen:'cover', players:4, names:['Team A','Team B'], first:null, avatars:[{f:8,c:0},{f:6,c:1}], editTeam:0,
  pickTeam:0, dealt:[[],[]], picks:[[],[]], pool:[],
  round:1, deck:[], turnTeam:0, nextTeam:0, scores:[[0,0,0],[0,0,0]],
  remaining:TURN_MS, turnDur:TURN_MS, carry:0, leftover:0, cleared:false,
  turnGot:[], turnPassed:0, running:false, paused:false, menu:false, dialog:null
});
let S = fresh();
const app = document.getElementById('app');
const device = document.getElementById('device');
const LIGHT_TONE = new Set(['cover','final','handoff','timesup']);
let raf = 0, wake = null, audio = null, lastSec = null, toastT = 0, busy = false;

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]} return a; };
const need = () => PER_PLAYER * Math.ceil(S.players/2);
const name = t => esc(S.names[t].trim() || (t ? 'Team B' : 'Team A'));
const total = t => S.scores[t].reduce((a,b)=>a+b,0);
const ptsColor = p => `var(--p${p})`;
const fmt = ms => { const s = Math.ceil(ms/1000); return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; };
const teamSizes = () => [Math.ceil(S.players/2), Math.floor(S.players/2)];

/* ============ screens ============ */
const bar = (title, {back=true, right='', stack=null}={}) => `
  <div class="bar">
    ${back ? `<button class="icon-btn" data-a="back" aria-label="Back">${I.back}</button>` : '<span class="spacer"></span>'}
    ${stack ? `<div class="stack"><b>${stack[0]}</b><span id="${stack[2]||'left'}">${stack[1]}</span></div>` : `<h1>${title}</h1>`}
    ${right || '<span class="spacer"></span>'}
  </div>`;

const V = {
cover: () => `
  <section class="screen cover">
    <div class="cover-mid">
      ${faceGrid(FACES.slice(0,6))}
      <p class="wordmark">MONIKERS</p>
      ${faceGrid(FACES.slice(6),6)}
    </div>
    <div class="foot">
      <button class="btn btn-line" data-a="play">Play Monikers</button>
      <button class="btn btn-ghost" data-a="howto">How to play</button>
    </div>
  </section>`,

howto: () => `
  <section class="screen">
    ${bar('How to play')}
    <div class="body"><div class="rules">
      <p>Two teams race to guess the same deck of cards three times. Each round has a stricter rule, so the clues get shorter and the jokes from earlier rounds start to pay off.</p>
      <h2>Setup</h2>
      <p>Each team picks cards from a hand of options, about 5 for every player. All the picks get shuffled into one deck that both teams play.</p>
      <h2>The rounds</h2>
      ${[1,2,3].map(n=>`<div class="round-card" style="--round-color:${ROUNDS[n].pill}">
        <div class="rc-head"><span class="rc-num">Round ${n}</span><b>${ROUNDS[n].rule}</b><span>${ROUNDS[n].sub}</span></div>
        <div class="rc-body">
          ${roundExample(n)}
          <button class="btn btn-line rc-btn" data-a="practice" data-r="${n}">${I.play} Practice round ${n}</button>
        </div>
      </div>`).join('')}
      <h2>A turn</h2>
      <p>One player gives clues for 60 seconds while their team guesses. Tap <b>Correct</b> or swipe right when they get it. Tap <b>Pass</b> or swipe left to send a card to the bottom of the deck. You can pass as often as you like.</p>
      <h2>Scoring</h2>
      <p>Every card is worth 1 to 4 points. The round ends when the deck runs out. Most points after three rounds wins.</p>
    </div></div>
    <div class="foot"><button class="btn btn-red" data-a="play">Start a game</button></div>
  </section>`,

players: () => { const [a,b] = teamSizes(); return `
  <section class="screen setup">
    ${bar('Game setup')}
    <div class="body">
      <div class="setup-head">
        <p class="q">Who's playing?</p>
        <p class="sub">Tap a face or a name to change it</p>
      </div>
      <div class="vs-count">
        <div class="vs-count-row">
          <b>Players</b>
          <div class="stepper">
            <button class="step" data-a="minus" aria-label="Fewer players" ${S.players<=MIN_P?'disabled':''}>${I.minus}</button>
            <div class="count" aria-live="polite">${S.players}</div>
            <button class="step" data-a="plusp" aria-label="More players" ${S.players>=maxPlayers()?'disabled':''}>${I.plus}</button>
          </div>
        </div>
        <p class="deck-line">${need()} cards per team · ${need()*2}-card deck</p>
      </div>
      <hr class="vs-rule">
      <div class="vs">
        ${[0,1].map(t=>`<div class="vs-team">
          <button class="av-btn" data-a="edit-avatar" data-t="${t}" aria-label="Change ${name(t)}'s icon" title="Change icon">${avatar(t,'lg')}<span class="av-pencil">${I.pencil}</span></button>
          <input id="n${t}" maxlength="16" value="${esc(S.names[t])}" autocomplete="off" aria-label="Team ${t+1} name">
          <small>${[a,b][t]} players</small>
        </div>`).join('<span class="vs-mid" aria-hidden="true">vs</span>')}
      </div>
    </div>
    <div class="foot"><button class="btn btn-red" data-a="to-first">Next</button></div>
    ${avatarSheet()}
  </section>`; },

first: () => `
  <section class="screen">
    ${bar('Game setup')}
    <div class="body">
      <p class="q">Who should go first?</p>
      <div class="tiles">
        ${[0,1].map(t=>`<div class="tile-wrap">
          <button class="tile ${S.first===t?'is-on':''} ${S.popped===t?'pop':''}" data-a="first" data-t="${t}" aria-pressed="${S.first===t}">
            ${S.first===t?`<span class="mc-check"><svg viewBox="0 0 32 32" fill="none" stroke="#fff" stroke-width="2"><path d="M12 16.57l2.41 2.3L20 13.13"/></svg></span>`:''}
            ${avatar(t)}<span class="tile-name">${name(t)}</span></button>
        </div>`).join('')}
      </div>
    </div>
    <div class="foot">
      <button class="btn btn-line btn-square" data-a="any" aria-label="Pick a team at random" title="Pick at random">${I.dice}</button>
      <button class="btn btn-red" data-a="deal" ${S.first===null?'disabled':''}>Next</button>
    </div>
  </section>`,

handoff: () => { const t=S.pickTeam, peek=S.dealt[t].slice(0,3).map(id=>CARDS[id]); return `
  <section class="screen handoff">
    ${bar('')}
    <div class="handoff-mid">
      <p class="eyebrow">Pick your cards</p>
      <div class="fan" aria-hidden="true">
        ${peek.map((c,k)=>fanCard(c,k)).join('')}
      </div>
      <h2>Pass the phone to <span class="hl">${name(t)}</span></h2>
      <div class="chips"><span>Pick <b>${need()}</b> of ${need()+EXTRA}</span></div>
      <p class="handoff-sub">Both teams play every card, so choose ones you'd enjoy describing.</p>
    </div>
    <div class="foot"><button class="btn btn-white" data-a="show-cards">Pick cards ${I.arrow}</button></div>
  </section>`; },

pick: () => { const t=S.pickTeam, sel=S.picks[t], n=need(); return `
  <section class="screen pick">
    ${bar('', {stack:[name(t), pickLabel(sel.length, n), 'pickcount'],
      right:`<div class="bar-actions"><button class="icon-btn" data-a="pick-help" aria-label="How to pick cards" title="How to pick">${I.info}</button><button class="icon-btn" data-a="menu" aria-label="Card options" aria-expanded="${S.menu}">${I.dots}</button></div>`})}
    <div class="body" style="padding:0">
      <div class="grid">${S.dealt[t].map(id=>miniCard(CARDS[id], sel.includes(id))).join('')}</div>
    </div>
    <div class="foot">
      <button class="btn btn-line btn-square" data-a="random-pick" aria-label="Pick random cards to fill your hand" title="Pick random cards">${I.dice}</button>
      <button class="btn btn-red" data-a="done-pick" id="donebtn" ${sel.length<n?'disabled':''}>Done</button>
    </div>
    ${S.menu ? `<div class="menu" role="menu">
      <button role="menuitem" data-a="clear-picks" ${sel.length?'':'disabled'}>${I.undo} Clear selection</button></div>` : ''}
    <div class="toast" id="toast"></div>
    ${pickHelp()}
  </section>`; },

intro: () => { const R=ROUNDS[S.round]; return `
  <section class="screen round-intro" style="--round-color:${R.pill}">
    ${bar('', {right:`<div class="bar-actions"><button class="icon-btn" data-a="turn-help" aria-label="How a turn works" title="How to play">${I.info}</button><button class="icon-btn" data-a="ask-leave" aria-label="End game">${I.exit}</button></div>`})}
    <div class="ri-top">
      <span class="ri-label">Round ${R.n} of 3</span>
      <div class="ri-dots" aria-hidden="true">${[1,2,3].map(k=>`<i class="${k<=R.n?'on':''}"></i>`).join('')}</div>
      <h2>${R.rule}</h2>
      <p>${R.sub}</p>
    </div>
    <div class="ri-sheet">
      <div class="ri-strip" aria-label="Score: ${name(0)} ${total(0)}, ${name(1)} ${total(1)}">
        ${[0,1].map(t=>`<div class="ri-side ${t?'r':''}">${avatar(t)}<span>${name(t)}</span><b>${total(t)}</b></div>`).join('<i aria-hidden="true"></i>')}
      </div>
      <div class="ri-hero">
        ${avatar(S.turnTeam)}
        <span class="ri-now">Now playing</span>
        <h3>${name(S.turnTeam)}</h3>
        <p>Hand the phone to your clue-giver</p>
      </div>
      <p class="ri-deck">${S.deck.length} cards in the deck</p>
    </div>
    <div class="foot"><button class="btn btn-red" data-a="go">Let's go ${I.arrow}</button></div>
    ${turnHelp()}
    ${dialog()}
  </section>`; },

countdown: () => { const R=ROUNDS[S.round]; return `
  <button class="screen countdown" style="--round-color:${R.pill}" data-a="skip-count" aria-label="Skip countdown">
    <span class="cd-who">${avatar(S.turnTeam,'sm')}${name(S.turnTeam)} · Round ${R.n}</span>
    <span class="cd-num ${S.cd>0?'':'is-go'}" aria-live="assertive">${S.cd>0?S.cd:'Go!'}</span>
    <span class="cd-hint">Tap to skip</span>
  </button>`; },

turn: () => `
  <section class="screen ${S.remaining<=10000?'is-low':''}" id="turn">
    ${bar('', {stack:[`Round ${S.round}`, `${S.deck.length} cards left`],
      right:`<button class="icon-btn" data-a="menu" aria-label="Game menu" aria-expanded="${S.menu}">${I.dots}</button>`})}
    ${S.practice ? `<span class="practice-tag">Practice · Round ${S.round} · doesn't count</span>` : ''}
    <div class="progress"><i id="bar" style="width:${S.remaining/S.turnDur*100}%"></i></div>
    <p class="timer" id="timer">${fmt(S.remaining)}</p>
    <div class="card-zone">
      <div class="pcard" id="pcard">${bigCard(CARDS[S.deck[0]])}</div>
      <div class="big-stamp" id="bigStamp" aria-live="polite"></div>
      ${S.practice && !S.coached ? `<div class="coach-tips" id="coach" aria-hidden="true">
        <div class="coach c-top"><b>Clue-giver · Round ${S.round}</b>${ROUND_EX[S.round].coach}</div>
        <div class="coach c-left"><b>Stuck?</b>Swipe left or tap Pass</div>
        <div class="coach c-right"><b>Got it?</b>Swipe right or tap Correct</div></div>` : ''}
      ${S.paused ? `<div class="veil"><h3>Paused</h3><p>The card is hidden until you resume.</p><button class="btn btn-red" data-a="resume">${I.play} Resume</button></div>` : ''}
    </div>
    <div class="foot">
      <button class="btn btn-pass" data-a="pass">${I.undo} Pass</button>
      <button class="btn btn-ok" data-a="correct">Correct ${I.check}</button>
    </div>
    ${S.menu ? `<div class="menu" role="menu">
      <button role="menuitem" data-a="${S.paused?'resume':'pause'}">${S.paused?I.play:I.pause} ${S.paused?'Resume':'Pause'}</button>
      ${S.practice ? `<button role="menuitem" data-a="end-practice">${I.exit} End practice</button>` : `<button role="menuitem" data-a="ask-leave">${I.exit} End game</button>`}</div>` : ''}
    ${dialog()}
  </section>`,

timesup: () => `<button class="screen timesup" data-a="to-summary" aria-label="Continue"><h2>Time's up!</h2></button>`,

summary: () => { const kept=S.turnGot.filter(g=>g.keep), pts=kept.reduce((a,g)=>a+CARDS[g.id].p,0);
  const deckAfter = S.deck.length + S.turnGot.length - kept.length;
  const nextLabel = deckAfter===0 ? (S.round===3?'See final scores':`Finish round ${S.round}`) : `Next: ${name(1-S.turnTeam)}`;
  return `
  <section class="screen">
    ${bar(S.cleared ? 'Deck cleared!' : `${name(S.turnTeam)}'s turn`, {back:false})}
    <div class="body">
      <p class="big-score">+${pts}<small>pts</small></p>
      <p class="sub">${kept.length} correct · ${S.turnPassed} passed</p>
      ${S.turnGot.length ? `<div class="list">${S.turnGot.map((g,i)=>{const c=CARDS[g.id]; return `
        <button class="row ${g.keep?'':'off'}" data-a="undo" data-i="${i}" aria-pressed="${g.keep}">
          <span class="t"><b>${esc(c.t)}</b><span style="color:${ptsColor(c.p)}">${c.c}</span></span>
          <span class="pts">${c.p} pt${c.p>1?'s':''}</span><span class="box">${I.check}</span></button>`}).join('')}</div>
        <p class="sub" style="margin-top:12px">Tapped by mistake? Uncheck a card to put it back in the deck.</p>`
        : `<p class="empty">No cards this turn. It happens.</p>`}
    </div>
    <div class="foot"><button class="btn btn-red" data-a="summary-next">${nextLabel} ${I.arrow}</button></div>
  </section>`; },

roundEnd: () => { const done=ROUNDS[S.round], R=ROUNDS[S.round+1], a=total(0), b=total(1), lead = a===b ? -1 : (a>b?0:1);
  const top=Math.max(a,b,1), h=v=>Math.max(10, Math.round(v/top*190));
  return `
  <section class="screen round-end" style="--round-color:${done.pill};--next-color:${R.pill}">
    <div class="re-band">
      <span class="re-label">Round ${done.n} complete</span>
      <h2>${lead<0 ? "It's a tie" : `${name(lead)} is ahead`}</h2>
      <p>${lead<0 ? `${a} points each after round ${done.n}` : `by ${Math.abs(a-b)} point${Math.abs(a-b)===1?'':'s'} after round ${done.n}`}</p>
      <div class="re-cols" role="img" aria-label="${name(0)} ${a} points, ${name(1)} ${b} points">
        ${[0,1].map(t=>`<div class="re-col">${avatar(t)}<b>${total(t)}</b><span class="re-bar" style="height:${h(total(t))}px"></span></div>`).join('')}
      </div>
    </div>
    <div class="re-sheet">
      <div class="re-names">${[0,1].map(t=>`<div><b>${name(t)}</b><small>+${S.scores[t][S.round-1]} this round</small></div>`).join('')}</div>
      <div class="re-next"><span class="re-dot" aria-hidden="true"></span><div><small>Up next · Round ${R.n}</small><b>${R.rule}</b></div></div>
    </div>
    <div class="foot"><button class="btn btn-red" data-a="next-round">Start round ${R.n} ${I.arrow}</button></div>
  </section>`; },

final: () => { const a=total(0), b=total(1), w = a===b ? -1 : (a>b?0:1); return `
  <section class="screen final">
    <div class="body">
      ${faceGrid(FACES.slice(0,3), 20)}
      <h2>${w<0 ? "It's a tie!" : `${name(w)} wins!`}</h2>
      <p class="sub">${w<0 ? `Both teams finished on ${a} points.` : `${Math.max(a,b)} to ${Math.min(a,b)} after three rounds.`}</p>
      <div class="sheet" style="overflow-x:auto"><table>
        <thead><tr><th>Round</th><th>${name(0)}</th><th>${name(1)}</th></tr></thead>
        <tbody>${[0,1,2].map(r=>`<tr><td>${ROUNDS[r+1].rule}</td><td>${S.scores[0][r]}</td><td>${S.scores[1][r]}</td></tr>`).join('')}</tbody>
        <tfoot><tr><td>Total</td><td>${a}</td><td>${b}</td></tr></tfoot>
      </table></div>
    </div>
    <div class="foot">
      <button class="btn btn-line" data-a="home">Home</button>
      <button class="btn btn-white" data-a="again">Play again</button>
    </div>
  </section>`; }
};

/* Card / Small (Figma 127:1225): the pickable card. Call fitCards() after it's in the page. */
// A non-interactive copy of a card, fanned out on the "Pick your cards" handoff screen.
function fanCard(c, k){ return `
  <div class="mcard fan-card" style="--k:${k}">
    <span class="mc-body">
      <span class="mc-title">${esc(c.t)}</span>
      <span class="mc-desc">${esc(c.d)}</span>
    </span>
    <span class="mc-foot">
      <span class="mc-cat" style="color:${ptsColor(c.p)}">${c.c}</span>
      <span class="mc-pts" style="background:${ptsColor(c.p)}">${c.p}</span>
    </span>
  </div>`; }
function miniCard(c, sel){ return `
  <div class="mcard-wrap">
  <button class="mcard ${sel?'is-sel':''}" data-a="toggle" data-id="${c.id}" aria-pressed="${sel}">
    ${sel?`<span class="mc-check"><svg viewBox="0 0 32 32" fill="none" stroke="#fff" stroke-width="2"><path d="M12 16.57l2.41 2.3L20 13.13"/></svg></span>`:''}
    <span class="mc-body">
      <span class="mc-title">${esc(c.t)}</span>
      <span class="mc-desc">${esc(c.d)}</span>
    </span>
    <span class="mc-foot">
      <span class="mc-cat" style="color:${ptsColor(c.p)}">${c.c}</span>
      <span class="mc-pts" style="background:${ptsColor(c.p)}">${c.p}</span>
    </span>
  </button>
  <button class="mc-more" data-a="peek" data-id="${c.id}" aria-label="Read all of ${esc(c.t)}" title="Read the full card">${I.expand}</button>
  </div>`; }
// The card enlarged in a modal (long press or the expand button), so a clipped description can be read before choosing.
function peekCard(c, sel){ return `
  <div class="scrim peek-scrim" data-a="close-peek" id="peek"><div class="peek-dlg" role="dialog" aria-modal="true" aria-labelledby="peekT" tabindex="-1">
    <div class="peek-card">
      <h3 id="peekT">${esc(c.t)}</h3>
      <p>${esc(c.d)}</p>
      <span class="mc-foot">
        <span class="mc-cat" style="color:${ptsColor(c.p)}">${c.c}</span>
        <span class="mc-pts" style="background:${ptsColor(c.p)}">${c.p}</span>
      </span>
    </div>
    <div class="row-btns"><button class="btn btn-line" data-a="close-peek">Close</button><button class="btn btn-red" data-a="peek-toggle" data-id="${c.id}">${sel?'Unselect':'Select'}</button></div>
  </div></div>`; }
let peekFrom = null;
// Cards are a fixed height, so each description gets as many lines as its title leaves room for.
// Cards that still cut text off get .is-clipped, which shows their expand button.
function fitCards(){
  app.querySelectorAll('.mc-desc').forEach(d => {
    d.style.display = ''; d.style.webkitLineClamp = 'none';
    const body = d.parentElement, lh = parseFloat(getComputedStyle(d).lineHeight);
    const lines = Math.floor((body.offsetTop + body.clientHeight - d.offsetTop) / lh);
    d.closest('.mcard-wrap').classList.toggle('is-clipped', Math.round(d.scrollHeight / lh) > lines);
    if(lines < 1) d.style.display = 'none'; else d.style.webkitLineClamp = lines;
  });
}
function bigCard(c){ if(!c) return ''; return `
  <h2 class="pc-title">${esc(c.t)}</h2>
  <p class="pc-desc">${esc(c.d)}</p>
  <div class="pc-cat" style="color:${ptsColor(c.p)}">${c.c}</div>
  <div class="pc-pts" style="background:${ptsColor(c.p)}"><b>${c.p}</b><span>point${c.p>1?'s':''}</span></div>`; }
function avatarSheet(){ if(S.dialog!=='avatar') return ''; const t=S.editTeam, a=S.avatars[t]; return `
  <div class="scrim" data-a="keep"><div class="sheet-dlg" role="dialog" aria-modal="true" aria-labelledby="avT">
    <h3 id="avT">${name(t)}'s icon</h3>
    <div class="avatar-grid">${FACES.map((f,k)=>`<button class="avatar-opt ${a.f===k?'is-on':''}" style="background:${AV_COLORS[a.c]}" data-a="set-face" data-k="${k}" aria-label="Face ${k+1}" aria-pressed="${a.f===k}">${face(f,k)}</button>`).join('')}</div>
    <div class="swatches">${AV_COLORS.map((c,k)=>`<button class="swatch ${a.c===k?'is-on':''}" style="background:${c}" data-a="set-color" data-k="${k}" aria-label="Color ${k+1}" aria-pressed="${a.c===k}"></button>`).join('')}</div>
    <div class="row-btns"><button class="btn btn-red" data-a="keep">Done</button></div>
  </div></div>`; }
// Card picking: an instruction instead of a counter, e.g. "Pick 10 cards", "Pick 3 more cards", "All 10 cards picked"
function pickLabel(k, n){ const left=n-k; return k===0 ? `Pick ${n} cards` : left>0 ? `Pick ${left} more card${left===1?'':'s'}` : `All ${n} cards picked`; }
function pickHelp(){ if(S.dialog!=='pick-help') return ''; const n=need(); return `
  <div class="scrim" data-a="keep"><div class="sheet-dlg help-sheet" role="dialog" aria-modal="true" aria-labelledby="phT">
    <h3 id="phT">How to pick</h3>
    <ol class="help-list">
      <li><span><b>Pick ${n} cards your team would enjoy describing.</b> Both teams play every card, so go for fun ones.</span></li>
      <li><span><b>Tap a card</b> to pick it. Tap it again to put it back.</span></li>
      <li><span><b>Tap ${I.expand}</b> on a card to read the whole description.</span></li>
      <li><span><b>Points go from 1 to 4.</b> Harder cards are worth more.</span></li>
      <li><span><b>Stuck?</b> Tap the dice to fill the rest at random.</span></li>
    </ol>
    <div class="row-btns"><button class="btn btn-red" data-a="keep">Got it</button></div>
  </div></div>`; }
// Round intro (i): how a turn works, the same card across all three rounds, and a practice card
// Shared example block: the card on the left, what the clue-giver says or does on the right
function roundExample(n){ const e=ROUND_EX[n]; return `
  <div class="rc-ex" style="--round-color:${ROUNDS[n].pill}">
    <span class="rc-card"><small>The card</small><b>${e.card}</b></span>
    <span class="rc-arrow" aria-hidden="true">${I.arrow}</span>
    <span class="rc-say"><small>${e.say}</small>${e.clue}</span>
  </div>`; }
function turnHelp(){ if(S.dialog!=='turn-help') return ''; return `
  <div class="scrim" data-a="keep"><div class="sheet-dlg help-sheet" role="dialog" aria-modal="true" aria-labelledby="thT">
    <h3 id="thT">How a turn works</h3>
    <ol class="help-list">
      <li><span><b>One player gives clues</b> and the rest of their team guesses. The other team just watches.</span></li>
      <li><span><b>You have 60 seconds.</b> Get through as many cards as you can.</span></li>
      <li><span><b>Got it? Swipe right</b> or tap Correct. <b>Stuck? Swipe left</b> or tap Pass to send it back.</span></li>
    </ol>
    <p class="help-ex-title">Example for round ${S.round}</p>
    <div class="help-ex-wrap">${roundExample(S.round)}</div>
    <div class="row-btns"><button class="btn btn-line" data-a="practice">Try a practice card</button><button class="btn btn-red" data-a="keep">Got it</button></div>
  </div></div>`; }
function dialog(){ if(S.dialog!=='leave') return ''; return `
  <div class="scrim" data-a="keep"><div class="sheet-dlg" role="dialog" aria-modal="true" aria-labelledby="dlgT">
    <h3 id="dlgT">End this game?</h3><p>Scores and card picks will be lost. You'll go back to the start screen.</p>
    <div class="row-btns"><button class="btn btn-line" data-a="keep">Keep playing</button><button class="btn btn-red" data-a="leave">End game</button></div>
  </div></div>`; }

/* ============ render ============ */
function render(){
  const same = app.dataset.screen===S.screen, top = same ? app.querySelector('.body')?.scrollTop : 0;
  app.innerHTML = V[S.screen](); app.dataset.screen = S.screen;
  if(same && top){ const b=app.querySelector('.body'); if(b) b.scrollTop=top; }
  device.dataset.tone = LIGHT_TONE.has(S.screen) ? 'light' : 'dark';
  S.popped = null;
  if(S.screen==='turn') bindSwipe();
  if(S.screen==='pick'){ fitCards(); document.fonts?.ready.then(()=>{ if(S.screen==='pick') fitCards(); }); }
  if(S.screen==='cover' || S.screen==='final') trackEyes();
}

/* ============ game logic ============ */
function deal(){
  S.pool = shuffle(CARDS.map(c=>c.id));
  const n = need()+EXTRA;
  S.dealt = [S.pool.splice(0,n), S.pool.splice(0,n)];
  S.picks = [[],[]]; S.pickTeam = 0;
}
function startGame(){
  S.round=1; S.scores=[[0,0,0],[0,0,0]]; S.carry=0;
  S.deck = shuffle(S.picks[0].concat(S.picks[1]));
  S.turnTeam = S.first; S.screen='intro';
}
// 3, 2, 1, Go! before every turn, so the clue-giver can get ready. Tap anywhere to skip.
let cdT = 0;
function countdown(){
  initAudio(); clearTimeout(cdT);
  S.screen='countdown'; S.cd=3; render(); tone(660,.12,.08);
  const tick=()=>{
    if(S.screen!=='countdown') return;
    S.cd--; render();
    if(S.cd>0){ tone(660,.12,.08); cdT=setTimeout(tick, 800); }
    else { tone(990,.25,.1); cdT=setTimeout(()=>{ if(S.screen==='countdown') startTurn(); }, 550); }
  };
  cdT=setTimeout(tick, 800);
}
// Practice: a 20-second turn with spare cards that aren't in this game. Nothing is scored.
const PRACTICE_MS = 20000;
function startPractice(round){
  let spare = S.pool.length >= 3 ? S.pool : S.dealt.flat().filter(id=>!S.picks[0].includes(id)&&!S.picks[1].includes(id));
  if(spare.length < 3) spare = CARDS.map(c=>c.id);          // from How to play, before any cards are dealt
  S.practiceSave = { deck:S.deck.slice(), round:S.round, screen:S.screen };
  if(round) S.round = round;
  S.deck = shuffle(spare).slice(0,5);
  S.practice = true; S.coached = false; S.dialog = null;
  S.turnDur = S.remaining = PRACTICE_MS; S.turnGot=[]; S.turnPassed=0; S.paused=false; S.menu=false;
  S.screen='turn'; initAudio(); render(); run(); lockScreen();
}
function endPractice(){
  S.running=false; release(); cancelAnimationFrame(raf);
  const back = S.practiceSave || {screen:'intro'};
  if(S.practiceSave){ S.deck = back.deck; S.round = back.round; }
  S.practice=false; S.practiceSave=null; S.turnGot=[]; S.turnPassed=0; S.paused=false; S.menu=false; S.dialog=null;
  S.screen = back.screen==='howto' ? 'howto' : 'intro'; render();
}
function startTurn(){
  S.turnDur = S.remaining = S.carry || TURN_MS; S.carry = 0;
  S.turnGot=[]; S.turnPassed=0; S.leftover=0; S.cleared=false;
  S.paused=false; S.menu=false; S.screen='turn';
  initAudio(); render(); run(); lockScreen();
}
function run(){ S.running=true; S.endAt=performance.now()+S.remaining; lastSec=null; cancelAnimationFrame(raf); raf=requestAnimationFrame(loop); }
function loop(){
  if(S.screen!=='turn' || !S.running) return;
  S.remaining = Math.max(0, S.endAt - performance.now());
  paintTimer();
  if(S.remaining<=0) return timesUp();
  raf = requestAnimationFrame(loop);
}
function paintTimer(){
  const t=document.getElementById('timer'), b=document.getElementById('bar'), s=document.getElementById('turn');
  if(!t) return;
  t.textContent = fmt(S.remaining);
  b.style.width = (S.remaining/S.turnDur*100)+'%';
  s.classList.toggle('is-low', S.remaining<=10000);
  const sec = Math.ceil(S.remaining/1000);
  if(sec!==lastSec){ if(lastSec!==null && sec<=3 && sec>0) tone(880,.06,.05); lastSec=sec; }
}
function pause(){ if(!S.running) return; S.remaining=Math.max(0,S.endAt-performance.now()); S.running=false; S.paused=true; S.menu=false; render(); }
function resume(){ S.paused=false; S.menu=false; render(); run(); }
function timesUp(){
  if(S.practice){ tone(440,.35,.12); return endPractice(); }
  S.running=false; S.remaining=0; S.leftover=0; release();
  tone(440,.35,.12); setTimeout(()=>tone(330,.45,.12),180);
  try{ navigator.vibrate && navigator.vibrate(300); }catch(e){}
  S.screen='timesup'; render();
  setTimeout(()=>{ if(S.screen==='timesup'){ S.screen='summary'; render(); } }, 1600);
}
// Big stamp over the card area: stays put while the card flies off, so it's readable at speed.
function stampHTML(ok){ const c=CARDS[S.deck[0]]; return ok ? `Correct<small>+${c.p} point${c.p>1?'s':''}</small>` : 'Pass'; }
function flashStamp(ok){
  const el=document.getElementById('bigStamp'); if(!el) return;
  el.style.opacity=''; el.className='big-stamp'; el.innerHTML=stampHTML(ok);
  void el.offsetWidth; el.className='big-stamp show '+(ok?'yes':'no');
}
// while dragging: the same big stamp fades in with the swipe, then flashStamp takes over on release
function previewStamp(dx){
  const el=document.getElementById('bigStamp'); if(!el) return;
  const ok=dx>0, k=Math.max(0,Math.min(1,Math.abs(dx)/90));
  if(!el.classList.contains(ok?'yes':'no') || el.classList.contains('show')){ el.className='big-stamp '+(ok?'yes':'no'); el.innerHTML=stampHTML(ok); }
  el.style.opacity=k;
}
function clearStamp(){ const el=document.getElementById('bigStamp'); if(el){ el.style.opacity=''; el.className='big-stamp'; } }
function answer(ok){
  if(busy || !S.running || !S.deck.length) return;
  flashStamp(ok);
  if(S.practice && !S.coached){ S.coached=true; document.getElementById('coach')?.remove(); }
  const card = document.getElementById('pcard');
  const apply = () => {
    const id = S.deck.shift();
    if(ok){ S.turnGot.push({id, keep:true}); tone(1046,.08,.06); }
    else { S.deck.push(id); S.turnPassed++; }
    if(S.practice && !S.deck.length){ endPractice(); return false; }
    if(!S.deck.length){
      S.leftover = Math.max(0,S.endAt-performance.now()); S.running=false; S.cleared=true; release();
      S.screen='summary'; render(); return false;
    }
    document.getElementById('left').textContent = `${S.deck.length} cards left`;
    return true;
  };
  if(reduce || !card){ if(apply()) { card.innerHTML = bigCard(CARDS[S.deck[0]]); card.style.transform=''; } return; }
  busy = true; const dir = ok?1:-1;
  card.style.transition='transform .2s ease-in, opacity .2s';
  card.style.transform=`translateX(${dir*130}%) rotate(${dir*16}deg)`; card.style.opacity='0';
  setTimeout(()=>{
    busy=false;
    if(!apply()) return;
    card.style.transition='none'; card.style.transform='translateY(10px) scale(.96)';
    card.innerHTML = bigCard(CARDS[S.deck[0]]);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ card.style.transition='transform .18s ease-out, opacity .18s'; card.style.transform=''; card.style.opacity='1'; }));
  }, 200);
}
function summaryNext(){
  const kept = S.turnGot.filter(g=>g.keep), back = S.turnGot.filter(g=>!g.keep).map(g=>g.id);
  S.scores[S.turnTeam][S.round-1] += kept.reduce((a,g)=>a+CARDS[g.id].p,0);
  if(back.length) S.deck = shuffle(S.deck.concat(back));
  S.turnGot=[];
  if(!S.deck.length){
    // No leftover time carries over: the other team always starts the next round with a full turn.
    S.carry = 0; S.nextTeam = 1-S.turnTeam;
    S.screen = S.round===3 ? 'final' : 'roundEnd';
  } else {
    S.carry = 0; S.turnTeam = 1-S.turnTeam; S.screen='intro';
  }
  S.cleared=false; S.leftover=0;
}

/* ============ extras: swipe, eyes, sound, wake lock ============ */
function bindSwipe(){
  const card = document.getElementById('pcard'); if(!card) return;
  let x0=null, dx=0, id=null;
  card.addEventListener('pointerdown', e => { if(!S.running||busy) return; x0=e.clientX; dx=0; id=e.pointerId; card.setPointerCapture(id); card.style.transition='none'; });
  card.addEventListener('pointermove', e => {
    if(x0===null || e.pointerId!==id) return; dx=e.clientX-x0;
    card.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
    previewStamp(dx);
  });
  const end = () => {
    if(x0===null) return; x0=null;
    if(Math.abs(dx)>90) return answer(dx>0);
    card.style.transition='transform .2s'; card.style.transform='';
    clearStamp();
  };
  card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
}
function trackEyes(){}
let px=null, py=null;
window.addEventListener('pointermove', e => {
  if(reduce || (S.screen!=='cover' && S.screen!=='final')) return;
  px=e.clientX; py=e.clientY;
  document.querySelectorAll('.faces svg').forEach(svg=>{
    const r=svg.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height*0.3;
    const a=Math.atan2(py-cy, px-cx), d=Math.min(2.2, Math.hypot(px-cx,py-cy)/40);
    svg.querySelectorAll('.pupil').forEach(p=>p.setAttribute('transform',`translate(${Math.cos(a)*d} ${Math.sin(a)*d})`));
  });
}, {passive:true});
function initAudio(){ try{ audio = audio || new (window.AudioContext||window.webkitAudioContext)(); audio.resume && audio.resume(); }catch(e){ audio=null; } }
function tone(f, dur, vol){
  if(!audio) return;
  try{ const o=audio.createOscillator(), g=audio.createGain(); o.type='triangle'; o.frequency.value=f;
    g.gain.setValueAtTime(vol,audio.currentTime); g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+dur);
    o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime+dur); }catch(e){}
}
async function lockScreen(){ try{ wake = await navigator.wakeLock?.request('screen'); }catch(e){ wake=null; } }
function release(){ try{ wake && wake.release(); }catch(e){} wake=null; }
document.addEventListener('visibilitychange', () => { if(document.hidden && S.screen==='turn' && S.running) pause(); });

function toast(msg){
  const t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2000);
}

/* ============ actions ============ */
const A = {
  play(){ S.screen='players'; },
  howto(){ S.screen='howto'; },
  back(){
    const m = {howto:'cover', players:'cover', first:'players'};
    if(m[S.screen]) S.screen = m[S.screen];
    else if(S.screen==='handoff'){ if(S.pickTeam===0) S.screen='first'; else { S.pickTeam=0; S.screen='pick'; } }
    else if(S.screen==='pick') S.screen='handoff';
    else if(S.screen==='turn' && S.practice){ endPractice(); return false; }
    else if(S.screen==='intro' || S.screen==='turn') return A['ask-leave']();
  },
  minus(){ S.players=Math.max(MIN_P,S.players-1); },
  plusp(){ S.players=Math.min(maxPlayers(),S.players+1); },
  'to-first'(){ S.screen='first'; },
  first(el){ S.first=+el.dataset.t; S.popped=S.first; },
  any(){
    if(busy) return false;
    const tiles=[...app.querySelectorAll('.tile')], final=Math.random()<.5?0:1;
    if(reduce || tiles.length<2){ S.first=final; S.popped=final; render(); return false; }
    busy=true; let n=0, cur=S.first===0?1:0; const flips=7+final+(cur===final?1:0);
    const step=()=>{ cur=1-cur; tiles.forEach((el,k)=>el.classList.toggle('is-on',k===cur)); n++;
      if(n<flips) setTimeout(step, 70+n*18); else { busy=false; S.first=final; S.popped=final; render(); } };
    step(); return false;
  },
  'edit-avatar'(el){ S.editTeam=+el.dataset.t; S.dialog='avatar'; },
  'set-face'(el){ S.avatars[S.editTeam].f=+el.dataset.k; },
  'set-color'(el){ S.avatars[S.editTeam].c=+el.dataset.k; },
  deal(){ if(S.first===null) return; deal(); S.screen='handoff'; },
  'turn-help'(){ S.dialog='turn-help'; },
  practice(el){ startPractice(+el.dataset.r || 0); return false; },
  'end-practice'(){ endPractice(); return false; },
  'pick-help'(){ S.menu=false; S.dialog='pick-help'; },
  'show-cards'(){ S.screen='pick'; },
  peek(el){
    const id=+el.dataset.id; peekFrom=el; A['close-peek']();
    app.querySelector('.screen').insertAdjacentHTML('beforeend', peekCard(CARDS[id], S.picks[S.pickTeam].includes(id)));
    app.querySelector('#peek .peek-dlg').focus();
    return false;
  },
  'close-peek'(){
    const p=document.getElementById('peek'); if(!p) return false;
    p.remove(); if(peekFrom && peekFrom.isConnected) peekFrom.focus();
    return false;
  },
  'peek-toggle'(el){
    const card=app.querySelector(`.mcard[data-id="${el.dataset.id}"]`);
    A['close-peek'](); if(card) A.toggle(card);
    return false;
  },
  toggle(el){
    const id=+el.dataset.id, sel=S.picks[S.pickTeam], i=sel.indexOf(id);
    if(i>=0) sel.splice(i,1);
    else if(sel.length>=need()){ toast(`You've picked ${need()}. Unselect one to swap it out.`); return false; }
    else sel.push(id);
    const on = sel.includes(id);
    el.closest('.mcard-wrap').outerHTML = miniCard(CARDS[id], on);
    fitCards();
    document.getElementById('pickcount').textContent = pickLabel(sel.length, need());
    document.getElementById('donebtn').disabled = sel.length<need();
    return false;
  },
  'random-pick'(){
    const t=S.pickTeam, sel=S.picks[t], left=need()-sel.length;
    if(left<=0){ toast(`You've picked ${need()}. Unselect some to let the dice choose.`); return false; }
    sel.push(...shuffle(S.dealt[t].filter(id=>!sel.includes(id))).slice(0,left));
    const scroller = app.querySelector('.body'), top = scroller ? scroller.scrollTop : 0;
    render(); const b=app.querySelector('.body'); if(b) b.scrollTop=top;
    toast(`Picked ${left} random card${left>1?'s':''}`); return false;
  },
  'done-pick'(){
    if(S.picks[S.pickTeam].length<need()) return false;
    if(S.pickTeam===0){ S.pickTeam=1; S.screen='handoff'; } else startGame();
  },
  go(){ countdown(); return false; },
  'skip-count'(){ if(S.screen==='countdown'){ clearTimeout(cdT); startTurn(); } return false; },
  correct(){ answer(true); return false; },
  pass(){ answer(false); return false; },
  menu(){ S.menu=!S.menu; },
  'clear-picks'(){ S.picks[S.pickTeam]=[]; S.menu=false; },
  pause(){ pause(); return false; },
  resume(){ resume(); return false; },
  'ask-leave'(){ if(S.screen==='turn' && S.running){ S.remaining=Math.max(0,S.endAt-performance.now()); S.running=false; S.paused=true; } S.menu=false; S.dialog='leave'; },
  keep(){ S.dialog=null; },
  leave(){ release(); cancelAnimationFrame(raf); const keep={players:S.players,names:S.names,avatars:S.avatars}; S=fresh(); Object.assign(S,keep); },
  'to-summary'(){ S.screen='summary'; },
  undo(el){ const g=S.turnGot[+el.dataset.i]; g.keep=!g.keep; },
  'summary-next'(){ summaryNext(); },
  'next-round'(){ S.round++; S.deck=shuffle(S.picks[0].concat(S.picks[1])); S.turnTeam=S.nextTeam; S.screen='intro'; },
  again(){ deal(); S.screen='handoff'; },
  home(){ const keep={players:S.players,names:S.names,avatars:S.avatars}; S=fresh(); Object.assign(S,keep); }
};

// Long press on a pick card opens it enlarged; the click that follows the press is swallowed so it doesn't also select.
let pressT = 0, pressXY = null, pressed = false;
app.addEventListener('pointerdown', e => {
  pressed = false; clearTimeout(pressT);
  const card = e.target.closest('.mcard'); if(!card || e.button > 0) return;
  pressXY = [e.clientX, e.clientY];
  pressT = setTimeout(() => { pressed = true; try{ navigator.vibrate && navigator.vibrate(10); }catch(_){} A.peek(card); }, 450);
});
app.addEventListener('pointermove', e => { if(pressXY && Math.hypot(e.clientX-pressXY[0], e.clientY-pressXY[1]) > 10) clearTimeout(pressT); });
['pointerup','pointercancel'].forEach(t => app.addEventListener(t, () => { clearTimeout(pressT); pressXY = null; }));
app.addEventListener('contextmenu', e => { if(e.target.closest('.mcard')) e.preventDefault(); });
app.addEventListener('click', e => {
  if(pressed){ pressed = false; if(e.target.closest('.mcard')) return; }
  const el = e.target.closest('[data-a]'); if(!el || !app.contains(el)) return;
  if(el.classList.contains('scrim') && e.target!==el) return;
  const fn = A[el.dataset.a]; if(!fn) return;
  if(fn(el)!==false) render();
});
app.addEventListener('input', e => {
  if(e.target.id==='n0') S.names[0]=e.target.value;
  if(e.target.id==='n1') S.names[1]=e.target.value;
});
document.addEventListener('keydown', e => {
  if(e.target.tagName==='INPUT') return;
  if(S.screen==='turn' && !S.dialog){
    if(e.key==='ArrowRight'){ e.preventDefault(); answer(true); }
    else if(e.key==='ArrowLeft'){ e.preventDefault(); answer(false); }
    else if(e.key===' ' || e.key==='p'){ e.preventDefault(); S.paused ? resume() : pause(); }
  }
  if(e.key==='Escape' && document.getElementById('peek')){ A['close-peek'](); return; }
  if(e.key==='Escape' && (S.dialog || S.menu)){ S.dialog=null; S.menu=false; render(); }
});


/* ============ iPhone frame: live clock + scale to fit the window ============ */
function clock(){
  const d = new Date(), h = d.getHours()%12 || 12;
  const el = document.getElementById('clock'); if(el) el.textContent = `${h}:${String(d.getMinutes()).padStart(2,'0')}`;
}
clock(); setInterval(clock, 15000);
function fit(){
  const slot = document.querySelector('.device-slot');
  if(matchMedia('(max-width:520px)').matches){ device.style.transform=''; return; }
  const cap = document.querySelector('.caption');
  const availH = innerHeight - 40 - (cap ? cap.offsetHeight + 18 : 0), availW = innerWidth - 32;
  const k = Math.min(1, availH/876, availW/417);
  device.style.transform = `scale(${k})`;
  slot.style.width = 417*k + 'px'; slot.style.height = 876*k + 'px';
}
addEventListener('resize', fit); fit();

/* ============ boot with state kept across live updates ============ */
/* ============ deck from Google Sheets (falls back to js/cards.js) ============ */
// Each team is dealt (picks + EXTRA) cards, so the deck size limits how many can play.
function maxPlayers(){ let p=MAX_P; while(p>MIN_P && 2*(PER_PLAYER*Math.ceil(p/2)+EXTRA) > CARDS.length) p--; return p; }
function parseCSV(text){
  const rows=[]; let row=[], cell='', q=false;
  for(let i=0;i<text.length;i++){ const ch=text[i];
    if(q){ if(ch==='"'){ if(text[i+1]==='"'){ cell+='"'; i++; } else q=false; } else cell+=ch; }
    else if(ch==='"') q=true;
    else if(ch===','){ row.push(cell); cell=''; }
    else if(ch==='\n'||ch==='\r'){ if(ch==='\r'&&text[i+1]==='\n') i++; row.push(cell); rows.push(row); row=[]; cell=''; }
    else cell+=ch; }
  if(cell||row.length){ row.push(cell); rows.push(row); }
  return rows;
}
async function loadSheetDeck(){
  if(typeof SHEET_CSV_URL==='undefined' || !SHEET_CSV_URL) return;
  try{
    const ctl = new AbortController(); setTimeout(()=>ctl.abort(), 4000);  // never keep the cover waiting more than 4s
    const res = await fetch(SHEET_CSV_URL, {cache:'no-store', signal:ctl.signal}); if(!res.ok) throw new Error(res.status);
    const rows = parseCSV(await res.text()); const head = rows.shift().map(h=>h.trim().toLowerCase());
    const col = k => head.indexOf(k);
    const cards = rows.map(r=>({t:(r[col('name')]||'').trim(), d:(r[col('description')]||'').trim(),
        c:(r[col('category')]||'ET CETERA').trim().toUpperCase()||'ET CETERA', p:Math.min(4,Math.max(1,parseInt(r[col('points')],10)||1))}))
      .filter(c=>c.t);
    if(cards.length < 2*(PER_PLAYER*2+EXTRA)){ console.warn(`Sheet has ${cards.length} cards, need at least ${2*(PER_PLAYER*2+EXTRA)}. Using the built-in deck.`); return; }
    CARDS.length = 0; cards.forEach((c,id)=>CARDS.push({id, ...c}));
    if(S.players>maxPlayers()) S.players=maxPlayers();
  }catch(e){ console.warn('Could not load the Google Sheet deck, using the built-in one.', e); }
}

function start(data){
  if(data && data.S){ S = Object.assign(fresh(), data.S); if(S.screen==='turn'){ S.running=false; S.paused=true; } if(S.screen==='timesup') S.screen='summary'; if(S.screen==='countdown') S.screen='intro'; if(S.practice){ const b=S.practiceSave||{}; if(b.deck){ S.deck=b.deck; S.round=b.round; } S.practice=false; S.practiceSave=null; S.screen=b.screen==='howto'?'howto':'intro'; } }
  render();
}
window.claude?.hot?.snapshot?.(() => {
  const s = JSON.parse(JSON.stringify(S));
  if(s.screen==='turn' && S.running) s.remaining = Math.max(0, S.endAt-performance.now());
  return {S:s};
});
const boot = d => loadSheetDeck().finally(()=>start(d));
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
})();
