// ============================================================
//  HanziStory v3 — 真实笔画顺序动画（HanziWriter 本地版）
//  依赖: data/characters.js, lib/hanzi-writer.min.js, lib/data/*.json
//  字源 SVG: 本地 /eto-svg/ (etymology-svg 下载到本地，Cloudflare Pages 打包)
// ============================================================

let currentChar = null;
let currentWriter = null;
let activeCat = 'all';
let quizMode = false;
let alphaSort = false;

// ========== 用户收录（任意字生成后存入 localStorage，刷新仍在） ==========
const CUSTOM_KEY = 'hanziStory.custom.v1';
let CUSTOM_DB = loadCustomChars();
function loadCustomChars() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || {}; } catch (e) { return {}; }
}
function saveCustomChar(char, rec) {
  CUSTOM_DB[char] = rec;
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(CUSTOM_DB)); } catch (e) {}
}

// ========== 绘本风场景插图 ==========
const SCENE_BG = '#FFF6EC';
const SCENE_BG_NIGHT = '#2E2A3A';

function frame(inner, bg) {
  return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect x="0" y="0" width="200" height="150" rx="12" fill="${bg || SCENE_BG}"/>
    ${inner}
  </svg>`;
}

const SCENES = {
  person: frame(`
    <ellipse cx="100" cy="132" rx="46" ry="10" fill="#F0DDB5" opacity="0.6"/>
    <circle cx="100" cy="52" r="15" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <line x1="100" y1="67" x2="100" y2="104" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M100 78 L78 92 M100 78 L122 92" stroke="#D4A574" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M100 104 L86 128 M100 104 L114 128" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">person</text>`),
  mountain: frame(`
    <path d="M20 115 L70 50 L100 88 L130 42 L182 115 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <line x1="20" y1="115" x2="182" y2="115" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">mountain</text>`),
  water: frame(`
    <path d="M40 70 Q100 95 160 70" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M40 95 Q100 120 160 95" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M40 120 Q100 145 160 120" fill="none" stroke="#D4A574" stroke-width="3" stroke-linecap="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">water</text>`),
  tree: frame(`
    <line x1="100" y1="70" x2="100" y2="128" stroke="#9C6B3F" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="52" r="34" fill="#A8C686" opacity="0.85"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#9C6B3F" font-family="serif">tree</text>`),
  fire: frame(`
    <path d="M100 122 Q66 96 78 64 Q86 44 78 28 Q92 44 100 56 Q108 42 122 32 Q116 56 122 70 Q128 96 100 122 Z"
       fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M100 112 Q84 92 92 68 Q98 58 96 72 Q100 62 106 56 Q104 76 106 86 Q108 100 100 112 Z"
       fill="#E85D56" opacity="0.55"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">fire</text>`),
  sun: frame(`
    <circle cx="100" cy="66" r="30" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <circle cx="100" cy="66" r="6" fill="#C73E3A"/>
    <g stroke="#D4A574" stroke-width="3" stroke-linecap="round">
      <line x1="100" y1="20" x2="100" y2="30"/><line x1="100" y1="102" x2="100" y2="112"/>
      <line x1="54" y1="66" x2="64" y2="66"/><line x1="136" y1="66" x2="146" y2="66"/>
    </g>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">sun</text>`),
  moon: frame(`
    <rect x="0" y="0" width="200" height="150" rx="12" fill="${SCENE_BG_NIGHT}"/>
    <path d="M124 30 Q86 42 86 76 Q86 110 124 122 Q98 104 98 76 Q98 50 124 30 Z"
       fill="none" stroke="#F0DDB5" stroke-width="3.5" stroke-linejoin="round"/>
    <text x="100" y="146" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">moon</text>`),
  mouth: frame(`
    <path d="M52 60 Q100 44 148 60 Q148 96 100 104 Q52 96 52 60 Z"
       fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">mouth</text>`),
  field: frame(`
    <rect x="34" y="34" width="132" height="92" rx="6" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <line x1="100" y1="34" x2="100" y2="126" stroke="#C73E3A" stroke-width="3.5"/>
    <line x1="34" y1="80" x2="166" y2="80" stroke="#C73E3A" stroke-width="3.5"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">field</text>`),
  sky: frame(`
    <line x1="100" y1="20" x2="100" y2="34" stroke="#C73E3A" stroke-width="3.5"/>
    <circle cx="100" cy="78" r="14" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <line x1="100" y1="92" x2="100" y2="120" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M100 102 L82 116 M100 102 L118 116" stroke="#D4A574" stroke-width="3.5" stroke-linecap="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">sky</text>`),
  earth: frame(`
    <line x1="30" y1="118" x2="170" y2="118" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M100 118 L100 78" stroke="#9C6B3F" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 84 Q86 70 92 56 Q104 64 100 84" fill="#A8C686"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#9C6B3F" font-family="serif">earth</text>`),
  rain: frame(`
    <path d="M50 44 Q100 26 150 44" fill="#D4A574" opacity="0.7"/>
    <g stroke="#C73E3A" stroke-width="3" stroke-linecap="round">
      <line x1="70" y1="70" x2="62" y2="86"/><line x1="100" y1="70" x2="92" y2="86"/><line x1="130" y1="70" x2="122" y2="86"/>
      <line x1="84" y1="92" x2="76" y2="108"/><line x1="116" y1="92" x2="108" y2="108"/>
    </g>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">rain</text>`),
  horse: frame(`
    <path d="M52 116 Q60 70 96 70 Q120 70 128 54 Q132 44 124 40 Q130 34 122 32 Q116 36 116 42 Q108 40 104 48
             Q96 44 92 54 Q80 56 76 70 Q60 72 56 116 Z"
       fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">horse</text>`),
  woman: frame(`
    <ellipse cx="100" cy="130" rx="40" ry="8" fill="#F0DDB5" opacity="0.7"/>
    <circle cx="100" cy="48" r="13" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <path d="M82 96 Q82 70 100 70 Q118 70 118 96 Z" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <path d="M82 96 L74 124 M118 96 L126 124" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">woman</text>`),
  child: frame(`
    <ellipse cx="100" cy="130" rx="38" ry="8" fill="#F0DDB5" opacity="0.7"/>
    <circle cx="100" cy="52" r="16" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <path d="M82 110 Q82 74 100 74 Q118 74 118 110 Z" fill="none" stroke="#C73E3A" stroke-width="3.5"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">child</text>`),
  heart: frame(`
    <path d="M100 118 Q60 92 64 64 Q68 44 88 48 Q100 52 100 66 Q100 52 112 48 Q132 44 136 64 Q140 92 100 118 Z"
       fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M100 110 Q72 92 76 70 Q80 58 92 62 Q100 66 100 78 Q100 66 108 62 Q120 58 124 70 Q128 92 100 110 Z"
       fill="#E85D56" opacity="0.35"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">heart</text>`),
  hand: frame(`
    <ellipse cx="100" cy="130" rx="38" ry="8" fill="#F0DDB5" opacity="0.7"/>
    <path d="M78 124 L78 78 Q78 70 84 70 Q90 70 90 78 L90 64 Q90 56 96 56 Q102 56 102 64 L102 70
             Q102 62 108 62 Q114 62 114 70 L114 78 Q120 72 124 74 Q128 78 124 84 L120 124 Z"
       fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">hand</text>`),
  eye: frame(`
    <path d="M44 76 Q100 46 156 76 Q100 106 44 76 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="100" cy="76" r="11" fill="none" stroke="#D4A574" stroke-width="3"/>
    <circle cx="100" cy="76" r="3.5" fill="#C73E3A"/>
    <text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">eye</text>`),
  one: frame(`<line x1="40" y1="75" x2="160" y2="75" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">one</text>`),
  two: frame(`<line x1="44" y1="58" x2="156" y2="58" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><line x1="44" y1="92" x2="156" y2="92" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">two</text>`),
  three: frame(`<line x1="44" y1="48" x2="156" y2="48" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><line x1="44" y1="75" x2="156" y2="75" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><line x1="44" y1="102" x2="156" y2="102" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">three</text>`),
  middle: frame(`<rect x="40" y="40" width="120" height="70" rx="8" fill="none" stroke="#C73E3A" stroke-width="3.5"/><line x1="100" y1="28" x2="100" y2="122" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">middle</text>`),
  small: frame(`<line x1="100" y1="48" x2="100" y2="104" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/><circle cx="66" cy="66" r="6" fill="#D4A574"/><circle cx="134" cy="66" r="6" fill="#D4A574"/><text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">small</text>`)
};

function getScene(key) {
  return SCENES[key] || frame(`<text x="100" y="80" text-anchor="middle" font-size="24" fill="#C73E3A" font-family="serif">${key || '?'}</text>`);
}

// ========== 动态字义场景（让字"按意思动起来"） ==========
// 每个字配一段会动的 SVG 绘本插画，动画由 styles.css 里的 .m-* 类驱动。
// 与 HanziWriter（真实笔顺）互补：这里是"字的意思在动"。

function svgWrap(inner, bg) {
  return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid meet">'
    + '<rect width="200" height="150" rx="12" fill="' + (bg || '#FFF6EC') + '"/>'
    + inner + '</svg>';
}

// 字 -> 场景 key 映射
const MOTION_KEY = {
  '人':'person','山':'mountain','水':'water','木':'tree','火':'fire','日':'sun','月':'moon',
  '口':'mouth','田':'field','大':'big','一':'one','二':'two','三':'three','中':'middle',
  '心':'heart','手':'hand','目':'eye','小':'small','女':'woman','子':'child','天':'sky',
  '土':'earth','雨':'rain','马':'horse'
};

// 动态场景说明（英文优先，方便海外学习者）
const MOTION_CAP = {
  '人':'A person takes a step — that is 人 (rén), "person".',
  '山':'The sun rises behind the peaks — 山 (shān), "mountain".',
  '水':'Water ripples and flows — 水 (shuǐ), "water".',
  '木':'A tree sways and grows — 木 (mù), "tree / wood".',
  '火':'Flames flicker and dance — 火 (huǒ), "fire".',
  '日':'The sun turns and shines — 日 (rì), "sun / day".',
  '月':'Stars twinkle by the moon — 月 (yuè), "moon / month".',
  '口':'A mouth opens to speak — 口 (kǒu), "mouth".',
  '田':'A sprout grows in the field — 田 (tián), "field".',
  '大':'Arms spread wide — 大 (dà), "big / large"!',
  '一':'One line is drawn — 一 (yī), "one".',
  '二':'Two lines appear — 二 (èr), "two".',
  '三':'Three lines, one by one — 三 (sān), "three".',
  '中':'A mark hits the center — 中 (zhōng), "middle / center".',
  '心':'The heart beats — 心 (xīn), "heart".',
  '手':'A hand opens and closes — 手 (shǒu), "hand".',
  '目':'An eye blinks — 目 (mù), "eye".',
  '小':'Tiny specks shimmer — 小 (xiǎo), "small".',
  '女':'She sways with grace — 女 (nǚ), "woman".',
  '子':'A baby bounces — 子 (zǐ), "child".',
  '天':'Clouds drift across the sky — 天 (tiān), "sky / heaven".',
  '土':'A sprout breaks the soil — 土 (tǔ), "earth / soil".',
  '雨':'Rain falls from the sky — 雨 (yǔ), "rain".',
  '马':'A horse gallops — 马 (mǎ), "horse".'
};

const MOTION_SVG = {
  person: svgWrap(
    '<ellipse cx="100" cy="132" rx="46" ry="10" fill="#F0DDB5" opacity="0.6"/>'
    + '<g class="m-bob">'
    + '<circle cx="100" cy="52" r="15" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<line x1="100" y1="67" x2="100" y2="104" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path d="M100 78 L78 92 M100 78 L122 92" stroke="#D4A574" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path d="M100 104 L86 128 M100 104 L114 128" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">person · 人</text>'
  ),

  mountain: svgWrap(
    '<circle class="m-float" cx="100" cy="62" r="18" fill="#E8B04B" opacity="0.55"/>'
    + '<path d="M20 115 L70 50 L100 88 L130 42 L182 115 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<line x1="20" y1="115" x2="182" y2="115" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">mountain · 山</text>'
  ),

  water: svgWrap(
    '<g class="m-ripple">'
    + '<path d="M40 70 Q100 95 160 70" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path d="M40 95 Q100 120 160 95" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path d="M40 120 Q100 145 160 120" fill="none" stroke="#D4A574" stroke-width="3" stroke-linecap="round"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">water · 水</text>'
  ),

  tree: svgWrap(
    '<g class="m-sway">'
    + '<line x1="100" y1="70" x2="100" y2="128" stroke="#9C6B3F" stroke-width="5" stroke-linecap="round"/>'
    + '<circle cx="100" cy="52" r="34" fill="#A8C686" opacity="0.85"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#9C6B3F" font-family="serif">tree · 木</text>'
  ),

  fire: svgWrap(
    '<g class="m-flicker">'
    + '<path d="M100 122 Q66 96 78 64 Q86 44 78 28 Q92 44 100 56 Q108 42 122 32 Q116 56 122 70 Q128 96 100 122 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M100 112 Q84 92 92 68 Q98 58 96 72 Q100 62 106 56 Q104 76 106 86 Q108 100 100 112 Z" fill="#E85D56" opacity="0.55"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">fire · 火</text>'
  ),

  sun: svgWrap(
    '<circle cx="100" cy="66" r="30" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<circle cx="100" cy="66" r="6" fill="#C73E3A"/>'
    + '<g class="m-rotate" stroke="#D4A574" stroke-width="3" stroke-linecap="round">'
    + '<line x1="100" y1="20" x2="100" y2="30"/><line x1="100" y1="102" x2="100" y2="112"/>'
    + '<line x1="54" y1="66" x2="64" y2="66"/><line x1="136" y1="66" x2="146" y2="66"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">sun · 日</text>'
  ),

  moon: svgWrap(
    '<path class="m-float" d="M124 30 Q86 42 86 76 Q86 110 124 122 Q98 104 98 76 Q98 50 124 30 Z" fill="none" stroke="#F0DDB5" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<circle class="m-twinkle" cx="58" cy="42" r="2.6" fill="#F0DDB5" style="animation-delay:0s"/>'
    + '<circle class="m-twinkle" cx="150" cy="52" r="2" fill="#F0DDB5" style="animation-delay:.7s"/>'
    + '<circle class="m-twinkle" cx="142" cy="104" r="2.6" fill="#F0DDB5" style="animation-delay:1.3s"/>'
    + '<circle class="m-twinkle" cx="54" cy="106" r="2" fill="#F0DDB5" style="animation-delay:.4s"/>'
    + '<text x="100" y="146" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">moon · 月</text>',
    '#2E2A3A'
  ),

  mouth: svgWrap(
    '<g class="m-jaw">'
    + '<path d="M52 60 Q100 44 148 60 Q148 96 100 104 Q52 96 52 60 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">mouth · 口</text>'
  ),

  field: svgWrap(
    '<rect x="34" y="34" width="132" height="92" rx="6" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<line x1="100" y1="34" x2="100" y2="126" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<line x1="34" y1="80" x2="166" y2="80" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<g class="m-grow">'
    + '<path d="M100 104 L100 74" stroke="#9C6B3F" stroke-width="4" stroke-linecap="round"/>'
    + '<path d="M100 84 Q86 72 90 62 Q102 68 100 84" fill="#A8C686"/>'
    + '<path d="M100 84 Q114 72 110 62 Q98 68 100 84" fill="#A8C686"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">field · 田</text>'
  ),

  big: svgWrap(
    '<line x1="100" y1="55" x2="100" y2="120" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path d="M100 92 L86 120 M100 92 L114 120" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path class="m-spread" d="M50 78 L150 78" stroke="#D4A574" stroke-width="3.5" stroke-linecap="round"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">big · 大</text>'
  ),

  one: svgWrap(
    '<line class="m-draw" x1="40" y1="75" x2="160" y2="75" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">one · 一</text>'
  ),

  two: svgWrap(
    '<line class="m-draw" x1="44" y1="58" x2="156" y2="58" stroke="#C73E3A" stroke-width="5" stroke-linecap="round" style="animation-delay:0s"/>'
    + '<line class="m-draw" x1="44" y1="92" x2="156" y2="92" stroke="#C73E3A" stroke-width="5" stroke-linecap="round" style="animation-delay:.4s"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">two · 二</text>'
  ),

  three: svgWrap(
    '<line class="m-draw" x1="44" y1="46" x2="156" y2="46" stroke="#C73E3A" stroke-width="5" stroke-linecap="round" style="animation-delay:0s"/>'
    + '<line class="m-draw" x1="44" y1="75" x2="156" y2="75" stroke="#C73E3A" stroke-width="5" stroke-linecap="round" style="animation-delay:.4s"/>'
    + '<line class="m-draw" x1="44" y1="104" x2="156" y2="104" stroke="#C73E3A" stroke-width="5" stroke-linecap="round" style="animation-delay:.8s"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">three · 三</text>'
  ),

  middle: svgWrap(
    '<rect x="40" y="40" width="120" height="70" rx="8" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<line x1="100" y1="28" x2="100" y2="122" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/>'
    + '<circle class="m-center" cx="100" cy="75" r="5" fill="#C73E3A"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">middle · 中</text>'
  ),

  heart: svgWrap(
    '<g class="m-pulse">'
    + '<path d="M100 118 Q60 92 64 64 Q68 44 88 48 Q100 52 100 66 Q100 52 112 48 Q132 44 136 64 Q140 92 100 118 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<path d="M100 110 Q72 92 76 70 Q80 58 92 62 Q100 66 100 78 Q100 66 108 62 Q120 58 124 70 Q128 92 100 110 Z" fill="#E85D56" opacity="0.35"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">heart · 心</text>'
  ),

  hand: svgWrap(
    '<ellipse cx="100" cy="130" rx="38" ry="8" fill="#F0DDB5" opacity="0.7"/>'
    + '<g class="m-spread">'
    + '<path d="M78 124 L78 78 Q78 70 84 70 Q90 70 90 78 L90 64 Q90 56 96 56 Q102 56 102 64 L102 70 Q102 62 108 62 Q114 62 114 70 L114 78 Q120 72 124 74 Q128 78 124 84 L120 124 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">hand · 手</text>'
  ),

  eye: svgWrap(
    '<g class="m-blink">'
    + '<path d="M44 76 Q100 46 156 76 Q100 106 44 76 Z" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linejoin="round"/>'
    + '<circle cx="100" cy="76" r="11" fill="none" stroke="#D4A574" stroke-width="3"/>'
    + '<circle cx="100" cy="76" r="3.5" fill="#C73E3A"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">eye · 目</text>'
  ),

  small: svgWrap(
    '<line x1="100" y1="48" x2="100" y2="104" stroke="#C73E3A" stroke-width="5" stroke-linecap="round"/>'
    + '<circle class="m-twinkle" cx="66" cy="66" r="6" fill="#D4A574" style="animation-delay:0s"/>'
    + '<circle class="m-twinkle" cx="134" cy="66" r="6" fill="#D4A574" style="animation-delay:.6s"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">small · 小</text>'
  ),

  woman: svgWrap(
    '<ellipse cx="100" cy="130" rx="40" ry="8" fill="#F0DDB5" opacity="0.7"/>'
    + '<g class="m-sway">'
    + '<circle cx="100" cy="48" r="13" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<path d="M82 96 Q82 70 100 70 Q118 70 118 96 Z" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<path d="M82 96 L74 124 M118 96 L126 124" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">woman · 女</text>'
  ),

  child: svgWrap(
    '<ellipse cx="100" cy="130" rx="38" ry="8" fill="#F0DDB5" opacity="0.7"/>'
    + '<g class="m-bob">'
    + '<circle cx="100" cy="52" r="16" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<path d="M82 110 Q82 74 100 74 Q118 74 118 110 Z" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">child · 子</text>'
  ),

  sky: svgWrap(
    '<g class="m-float" style="animation-delay:0s"><path d="M40 52 Q40 40 56 40 Q62 28 80 34 Q98 28 104 44 Q120 44 120 56 Q120 64 110 64 L46 64 Q36 64 40 52 Z" fill="#F0DDB5" opacity="0.85"/></g>'
    + '<g class="m-float" style="animation-delay:1.3s"><path d="M120 92 Q120 82 134 82 Q140 72 154 78 Q168 74 172 88 Q182 90 178 98 L126 100 Q116 98 120 92 Z" fill="#F0DDB5" opacity="0.7"/></g>'
    + '<line x1="100" y1="20" x2="100" y2="34" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<circle cx="100" cy="78" r="14" fill="none" stroke="#C73E3A" stroke-width="3.5"/>'
    + '<line x1="100" y1="92" x2="100" y2="120" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<path d="M100 102 L82 116 M100 102 L118 116" stroke="#D4A574" stroke-width="3.5" stroke-linecap="round"/>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">sky · 天</text>'
  ),

  earth: svgWrap(
    '<line x1="30" y1="118" x2="170" y2="118" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round"/>'
    + '<g class="m-grow">'
    + '<path d="M100 118 L100 80" stroke="#9C6B3F" stroke-width="5" stroke-linecap="round"/>'
    + '<path d="M100 90 Q86 76 92 62 Q104 70 100 90" fill="#A8C686"/>'
    + '<path d="M100 90 Q114 76 108 62 Q96 70 100 90" fill="#A8C686"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#9C6B3F" font-family="serif">earth · 土</text>'
  ),

  rain: svgWrap(
    '<path d="M50 50 Q100 32 150 50" fill="#D4A574" opacity="0.7"/>'
    + '<g stroke="#C73E3A" stroke-width="3" stroke-linecap="round">'
    + '<line class="m-fall" x1="70" y1="66" x2="62" y2="84" style="animation-delay:0s"/>'
    + '<line class="m-fall" x1="100" y1="66" x2="92" y2="84" style="animation-delay:.3s"/>'
    + '<line class="m-fall" x1="130" y1="66" x2="122" y2="84" style="animation-delay:.6s"/>'
    + '<line class="m-fall" x1="84" y1="90" x2="76" y2="108" style="animation-delay:.15s"/>'
    + '<line class="m-fall" x1="116" y1="90" x2="108" y2="108" style="animation-delay:.45s"/>'
    + '<line class="m-fall" x1="100" y1="108" x2="92" y2="126" style="animation-delay:.75s"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">rain · 雨</text>'
  ),

  horse: svgWrap(
    '<g class="m-walk">'
    /* head + neck + ear */
    + '<path d="M125 42 Q128 34 134 32 Q138 30 140 34 Q141 38 137 40 L132 44" fill="none" stroke="#C73E3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M133 33 L136 26 L138 33" fill="none" stroke="#C73E3A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
    /* body back */
    + '<path d="M130 46 Q115 44 95 50 Q75 56 65 68" fill="none" stroke="#C73E3A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    /* mane */
    + '<path d="M127 43 Q120 48 112 46 Q104 44 96 48" fill="none" stroke="#C73E3A" stroke-width="2.5" stroke-linecap="round"/>'
    /* legs */
    + '<path d="M90 54 L88 78 L92 78 L94 56" fill="none" stroke="#C73E3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M80 58 L77 82 L81 82 L84 60" fill="none" stroke="#C73E3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M70 66 L66 88 L70 88 L74 68" fill="none" stroke="#C73E3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M63 72 L58 94 L62 94 L67 74" fill="none" stroke="#C73E3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    /* tail */
    + '<path d="M64 70 Q52 76 48 92 Q46 100 50 102" fill="none" stroke="#C73E3A" stroke-width="2.5" stroke-linecap="round"/>'
    + '</g>'
    + '<text x="100" y="147" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">horse · 马</text>'
  )
};

function getMotionSVG(char) {
  const key = MOTION_KEY[char] || 'person';
  return MOTION_SVG[key] || MOTION_SVG.person;
}

// ========== 字本身作为 SVG 动画（不重复写大字，直接让字的笔画按字义动） ==========

// 按部首/含义推测动画类型（不需要外部 API，纯启发式）
function guessMotionType(char) {
  if (MOTION_TYPE[char]) return MOTION_TYPE[char];
  const code = char.charCodeAt(0);
  // 常见部首 → 动画映射
  const radicalMap = [
    { r: /[\u6C35\u6C34\u6CE1\u6D41\u6CB3\u6D77\u6E56\u6CF0\u6E20\u6E2D\u6CCC\u6E7F\u6D41\u6CE5\u6CB9\u6D25\u6DE4\u6E23\u6ED1]/, t: 'ripple' },   // 氵水系 → 水波
    { r: /[\u706B\u7078\u707E\u707F\u70BD\u7110\u70EC\u70CA\u70E4\u70C8\u70B3\u70AB\u70C2\u70BB\u70AC\u7119]/, t: 'flicker' }, // 火系 → 闪烁
    { r: /[\u6728\u679D\u68EE\u6797\u69FD\u67DC\u675F\u672A\u672C\u672D\u6765\u673A\u6742\u67F1\u6839\u68D5\u67CF\u677F]/, t: 'sway' },  // 木系 → 摇摆
    { r: /[\u571F\u5730\u5854\u57CE\u582A\u578B\u575E\u5761\u57F9\u575A\u58EB]/, t: 'grow' },     // 土地系 → 生长
    { r: /[\u65E5\u6630\u65FA\u6614\u6620\u6615\u6626\u6628\u65E6\u6697\u666E\u6669]/, t: 'rotate' }, // 日系 → 旋转
    { r: /[\u6708\u80A1\u6700\u6708\u8089\u670A]/, t: 'float' },                          // 月/肉 → 浮动
    { r: /[\u53E3\u5441\u558A\u543C\u5409\u5462\u5496\u5427\u5446]/, t: 'jaw' },             // 口系 → 张合
    { r: /[\u5FC3\u5FE5\u60F3\u601D\u611F\u60C5\u6027\u5FD8\u5FC6\u5FCC\u610F]/, t: 'pulse' },  // 心系 → 心跳
    { r: /[\u76EE\u7738\u77A7\u7763\u7761]/, t: 'blink' },                              // 目系 → 眨眼
    { r: /[\u624B\u630C\u629A\u62FF\u628A\u6362\u6295\u62D2\u62D4\u62D2\u62D8\u62DA\u63D0\u62C9\u63A8\u62D2\u62D4\u62CD\u6253\u643E\u627E\u653E\u62D4\u62B5\u62D4\u6296\u63A8\u62FF\u62D4]/, t: 'lift' }, // 扌手系 → 提起/上移
    { r: /[\u8DB3\u8DD1\u8E29\u8DF3\u8DDD\u8FDE]/, t: 'walk' },                         // 足系 → 行走/奔跑
    { r: /[\u9E1F\u9E21]/, t: 'bob' },                                                  // 鸟系 → 弹跳
    { r: /[\u9C7C]/, t: 'float' },                                                       // 鱼 → 游动
    { r: /[\u98CE]/, t: 'twinkle' },                                                     // 风 → 飘忽
    { r: /[\u96E8]/, t: 'fall' },                                                        // 雨 → 下落
    { r: /[\u96EA\u51B0\u51BD\u51AE]/, t: 'twinkle' },                                   // 雪/冰 → 闪烁
    { r: /[\u5C71\u5CA9\u5D07\u5CED\u5CF0]/, t: 'float' },                               // 山系 → 漂浮
    { r: /[\u77F3\u7877\u94DC\u94F3\u94C1\u94A8]/, t: 'center' },                        // 石/金属 → 脉冲中心
    { r: /[\u8272]/, t: 'twinkle' },                                                     // 色 → 闪烁
    { r: /[\u82B1\u8349\u83B1\u83DC\u6811]/, t: 'sway' },                                // 花草树木 → 摇摆
    { r: /[\u9F99]/, t: 'walk' },                                                        // 龙 → 奔腾
    { r: /[\u9A6C]/, t: 'walk' },                                                        // 马 → 奔腾
    { r: /[\u725B]/, t: 'sway' },                                                        // 牛 → 晃动
    { r: /[\u72AC]/, t: 'bob' },                                                         // 狗 → 弹跳
    { r: /[\u732A]/, t: 'spread' },                                                      // 猪 → 展开
    { r: /[\u866B\u868C\u867F]/, t: 'twinkle' },                                        // 虫系 → 闪烁
    { r: /[\u4EBA\u4ECB\u4FDD\u50F9\u4F2F\u4F5C\u4F7F\u4F9D\u4F10]/, t: 'bob' },         // 人系 → 弹跳
    { r: /[\u5929]/, t: 'float' },                                                      // 天 → 浮动
    { r: /[\u5927]/, t: 'spread' },                                                     // 大 → 展开
    { r: /[\u5C0F]/, t: 'twinkle' },                                                    // 小 → 闪烁
    { r: /[\u4E2D\u4E2D\u90E8]/, t: 'center' },                                          // 中 → 中心脉冲
    { r: /[\u5973]/, t: 'sway' },                                                       // 女 → 摇曳
    { r: /\u5B50/, t: 'bob' },                                                         // 子 → 弹跳
    { r: /[\u96F7]/, t: 'flicker' },                                                    // 雷 → 闪烁
    { r: /[\u7535\u95EA]/, t: 'flicker' },                                              // 电/闪 → 闪烁
  ];
  for (const m of radicalMap) {
    if (m.r.test(char)) return m.t;
  }
  return 'breathe';
}

function getMotionCharSVG(char) {
  // 主体用"字义绘本插画"（MOTION_SVG）：人物会走、水会流、火会跳、太阳会转、雨会落……
  // 这些插画本身就是"字义在动"，比把整字无意义地晃动强太多。
  // 再在右上角盖上真实汉字印章，让"图画 ↔ 汉字 ↔ 字义"在同一个动效里连起来。
  const sceneKey = MOTION_KEY[char];
  const scene = sceneKey ? MOTION_SVG[sceneKey] : null;
  if (scene) {
    const badge =
      '<g class="motion-glyph-badge">' +
        '<circle cx="172" cy="30" r="20" fill="#C73E3A"/>' +
        '<text x="172" y="38" text-anchor="middle" font-family="KaiTi, STKaiti, simsun, serif" font-size="24" fill="#FFF6EC">' + char + '</text>' +
      '</g>';
    // 每个场景 SVG 都以 </svg> 结尾，在结尾前插入印章即可。
    return scene.replace('</svg>', badge + '</svg>');
  }

  // 任意字（无内置绘本）：用"柔和呼吸"式入场 + 中性字义说明，避免无意义晃动。
  const verb = HERO_VERB[guessMotionType(char)] || 'comes alive';
  return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" class="motion-any">' +
    '<rect width="200" height="150" rx="12" fill="#FFF6EC"/>' +
    '<text x="100" y="98" text-anchor="middle" font-family="KaiTi, STKaiti, simsun, serif" font-size="92" fill="#C73E3A" class="mc-breathe">' + char + '</text>' +
    '<text x="100" y="132" text-anchor="middle" font-size="13" fill="#D4A574" font-family="serif">' + verb + '</text>' +
    '</svg>';
}

// ========== 真实汉字「字义能动」：字本身跟随字义动起来 ==========
// 映射到 styles.css 里 .mh-* 动画类（复用同一组 @keyframes）。
// 数字用 breathe（m-draw 仅对 SVG 线条生效，对汉字本体无效）。
const MOTION_TYPE = {
  '人':'bob','山':'float','水':'ripple','木':'sway','火':'flicker','日':'rotate','月':'float',
  '口':'jaw','田':'grow','大':'spread','一':'breathe','二':'breathe','三':'breathe','中':'center',
  '心':'pulse','手':'spread','目':'blink','小':'twinkle','女':'sway','子':'bob','天':'float',
  '土':'grow','雨':'fall','马':'walk'
};

// 字本身如何"动"的描述（英文优先，面向海外学习者）
const HERO_VERB = {
  bob:'takes a little step', float:'drifts gently', ripple:'ripples like flowing water',
  sway:'sways like a tree in the wind', flicker:'flickers like a flame', rotate:'turns like the sun',
  jaw:'opens to speak', grow:'sprouts and grows', spread:'spreads its arms wide',
  center:'pulses at its center', pulse:'beats like a heart', blink:'blinks an eye',
  twinkle:'shimmers like a star', breathe:'breathes gently', walk:'gallops like a horse',
  fall:'falls like falling rain', lift:'lifts gently upward'
};

function heroCaption(char) {
  const verb = HERO_VERB[MOTION_TYPE[char]] || 'breathes gently';
  return 'The character ' + char + ' ' + verb + '.';
}

// ========== 字源 SVG URL 构造（本地优先，CDN 回退） ==========
// eto-svg/ 目录随项目部署到 Cloudflare Pages，不再依赖 CDN
function etoUrl(char, stage) {
  return '/eto-svg/' + stage + '/' + encodeURIComponent(char) + '.svg';
}

// ========== 英文诞生叙事 ==========
const BIRTH_EN = {
  '人': `Long ago, people watched a person walking by and drew the leaning body with a reaching arm — that is how <b>人 (rén)</b>, "person", began as a picture in oracle bone script. Over time it was cast in bronze, rounded into seal script, and became today's regular script with two graceful strokes.`,
  '山': `Ancient people looked up at three peaks rising against the sky and drew them as lines on a base — that became <b>山 (shān)</b>, "mountain", in oracle bone script. Through bronze and seal forms, it settled into regular script with one tall middle stroke flanked by two shorter ones.`,
  '水': `People watched a river flowing down the middle with ripples splashing on both sides, and drew exactly that — <b>水 (shuǐ)</b>, "water", in oracle bone script. It flowed through bronze and seal script into today's regular script: a central hook with curves on each side.`,
  '木': `Someone saw a tree — trunk in the middle, branches reaching up, roots going down — and drew it as <b>木 (mù)</b>, "tree / wood", in oracle bone script. Today's regular script still shows that cross of trunk-and-branches with roots below.`,
  '火': `People sat around flames leaping upward and drew the dancing tongues of fire — <b>火 (huǒ)</b>, "fire", in oracle bone script. Through bronze and seal script, it became the regular script we write now, like a person standing by a burning base.`,
  '日': `Looking at the round sun, ancients drew a circle with a dot inside — <b>日 (rì)</b>, "sun / day", in oracle bone script. Cast in bronze, rounded in seal script, it became the square regular script we use today.`,
  '月': `At night they saw the crescent moon and traced its curve — <b>月 (yuè)</b>, "moon / month", in oracle bone script. Through bronze and seal script, it became today's regular script, a crescent shape with two inner strokes.`,
  '口': `They copied the shape of an open mouth as a rounded square — <b>口 (kǒu)</b>, "mouth", in oracle bone script. It stayed that simple through every stage; today's regular script is still a square box.`,
  '田': `Farmers saw land divided into planted squares by paths, and drew <b>田 (tián)</b>, "field", in oracle bone script. Through every stage it became the regular script: a square split by a cross into four plots.`,
  '大': `They watched a person stand with arms spread wide, filling the space, and drew <b>大 (dà)</b>, "big / large", in oracle bone script. Today's regular script still shows that spreading figure.`,
  '一': `To mean "one" or "the beginning," ancients drew a single horizontal line — <b>一 (yī)</b>, "one". It never changed much: one stroke across all 3,000+ years of history.`,
  '二': `For "two," they added a second parallel line — <b>二 (èr)</b>, "two". Two strokes carried it from oracle bone through bronze and seal into modern times.`,
  '三': `For "three," a third line joined — <b>三 (sān)</b>, "three". Three strokes, simple and unchanged through millennia.`,
  '中': `They put a mark in the exact center of a target — <b>中 (zhōng)</b>, "middle / center", in oracle bone script. Today's regular script: a vertical line passing through the center of a box.`,
  '心': `Watching a beating heart, they drew its curved shape — <b>心 (xīn)</b>, "heart", in oracle bone script. Through bronze and seal script, it became regular script with a curved top and dots inside.`,
  '手': `They traced an open palm with spreading fingers — <b>手 (shǒu)</b>, "hand", in oracle bone script. Today's regular script still suggests fingers and a wrist.`,
  '目': `Looking at an eye, they drew the lid and pupil within — <b>目 (mù)</b>, "eye", in oracle bone script. It kept its clear eye-shape through every stage into modern script.`,
  '小': `To show something tiny, they drew three little dots — <b>小 (xiǎo)</b>, "small". The dots became strokes; regular script keeps a central line with two side marks.`,
  '女': `They drew a woman kneeling gracefully with hands folded — <b>女 (nǚ)</b>, "woman", in oracle bone script. Through bronze and seal script, it became today's regular script, still suggesting a seated figure.`,
  '子': `They drew a swaddled baby with a round head — <b>子 (zǐ)</b>, "child / son", in oracle bone script. Through bronze and seal script, it became regular script with a curved top and strokes below.`,
  '天': `Starting from 大 (person with arms spread), they added a line above to mean "what is above" — <b>天 (tiān)</b>, "sky / heaven", in oracle bone script. Today's regular script: a line over a spreading figure.`,
  '土': `They drew a sprout breaking out of the ground — <b>土 (tǔ)</b>, "earth / soil", in oracle bone script. Through bronze and seal script, it became regular script: a top stroke over a ground line with a stem below.`,
  '雨': `They drew drops falling from the sky — <b>雨 (yǔ)</b>, "rain", in oracle bone script. Through bronze and seal script, it became regular script: a "sky" top with rain-drop strokes beneath.`,
  '马': `They drew a horse with head high and mane flying — <b>马 (mǎ)</b>, "horse", in oracle bone script. Simplified through bronze and seal script, today's simplified regular script uses just three strokes.`
};

// ========== 演变时间轴定义 ==========
const EVO_STAGES = [
  { key: 'oracle', lab: 'Oracle Bone', sub: '\u7532\u9AA8\u6587', cap: 'A picture of the world (~1300 BC)', color: '#8B4513' },
  { key: 'bronze', lab: 'Bronze',     sub: '\u91D1\u6587',   cap: 'Cast in bronze vessels (~1000 BC)', color: '#B8860B' },
  { key: 'seal',   lab: 'Seal Script',sub: '\u5C0F\u7BC0',   cap: 'Standardized curves (~200 BC)',    color: '#2F4F4F' },
  { key: 'modern', lab: 'Regular',    sub: '\u6977\u4E66',   cap: 'How we write it today',            color: '#C73E3A' }
];

// ========== 古籍引文（說文解字 + 康熙字典，取自漢典 zdic.net） ==========
// 說文為完整释义引文；康熙字典在漢典以掃描圖呈現，故取其「集·部·筆畫」定位。
const CLASSICS = {
  '人': { sw: '天地之性最貴者也。', kx: '\u3010\u5B50\u96C6\u4E2D\u3011\u3010\u4EBA\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 2' },
  '山': { sw: '\u5C71\u5BA3\u4E5F\u3002\u5BA3\u6C23\u6563\u751F\u842C\u7269\uFF0C\u6709\u77F3\u800C\u9AD8\u4E5F\u3002', kx: '\u3010\u5BC5\u96C6\u4E2D\u3011\u3010\u5C71\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '水': { sw: '\u6E96\u4E5F\u3002\u5317\u65B9\u4E4B\u884C\uFF0C\u8C61\u8846\u6C34\u6D41\uFF0C\u4E2D\u6709\u5FAE\u967D\u4E4B\u6C23\u4E5F\u3002', kx: '\u3010\u5DF3\u96C6\u4E0A\u3011\u3010\u6C34\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '木': { sw: '\u5192\u4E5F\u3002\u5192\u5730\u800C\u751F\uFF0C\u6771\u65B9\u4E4B\u884C\u3002\u4ECE\u5C5C\uFF0C\u4E0B\u8C61\u5176\u6839\u3002', kx: '\u3010\u8FB0\u96C6\u4E2D\u3011\u3010\u6728\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '火': { sw: '\u706B\uFF0C\u7180\u4E5F\u3002\u5357\u65B9\u4E4B\u884C\u708A\u800C\u4E0A\u3002\u8C61\u5F62\u3002', kx: '\u3010\u5DF3\u96C6\u4E2D\u3011\u3010\u706B\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '日': { sw: '\u5BE6\u4E5F\u3002\u592A\u967D\u4E4B\u7CBE\u4E0D\u865B\u3002', kx: '\u3010\u8FB0\u96C6\u4E0A\u3011\u3010\u65E5\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '月': { sw: '\u95C7\u4E5F\u3002\u592A\u9671\u4E4B\u7CBE\u3002', kx: '\u3010\u8FB0\u96C6\u4E0A\u3011\u3010\u6708\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '口': { sw: '\u4EBA\u6240\u4EE5\u8A00\u98DF\u4E5F\u3002\u8C61\u5F62\u3002', kx: '\u3010\u4E11\u96C6\u4E0A\u3011\u3010\u53E3\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '田': { sw: '\u9673\u4E5F\u3002\u6A39\u7CAE\u66F0\u7530\uFF0C\u8C61\u56DB\u53E3\u3002\u5341\uFF0C\u961D\u964C\u4E4B\u5236\u4E5F\u3002', kx: '\u3010\u5348\u96C6\u4E0A\u3011\u3010\u7530\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 5' },
  '大': { sw: '\u5929\u5927\uFF0C\u5730\u5927\uFF0C\u4EBA\u4EA6\u5927\u3002\u8C61\u4EBA\u5F62\u3002', kx: '\u3010\u4E11\u96C6\u4E0B\u3011\u3010\u5927\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '一': { sw: '\u60DF\u521D\u5927\u59CB\uFF0C\u9053\u7ACB\u65BC\u4E00\u3002\u9020\u5206\u5929\u5730\uFF0C\u5316\u6210\u842C\u7269\u3002', kx: '\u3010\u5B50\u96C6\u4E0A\u3011\u3010\u4E00\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 1' },
  '二': { sw: '\u5730\u4E4B\u6578\u4E5F\u3002\u5F9E\u5076\u4E00\u3002', kx: '\u3010\u5B50\u96C6\u4E0A\u3011\u3010\u4E8C\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 2' },
  '三': { sw: '\u4E09\uFF0C\u5929\u5730\u4EBA\u4E4B\u9053\u4E5F\u3002\u8AC7\u4EE5\u967D\u4E4B\u4E00\u5408\u9684\u4E4B\u4E8C\uFF0C\u6B21\u7B46\u91CD\u4E4B\uFF0C\u5176\u6578\u4E09\u4E5F\u3002', kx: '\u3010\u5B50\u96C6\u4E0A\u3011\u3010\u4E00\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '中': { sw: '\u5167\u4E5F\u3002\u5F9E\u53E3\u3002\u4E28\uFF0C\u4E0A\u4E0B\u901A\u3002', kx: '\u3010\u5B50\u96C6\u4E0A\u3011\u3010\u4E28\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '心': { sw: '\u4EBA\u5FC3\uFF0C\u571F\u85CF\uFF0C\u5728\u8EAB\u4E4B\u4E2D\u3002\u8C61\u5F62\u3002\u535A\u58EB\u8AAA\u4EE5\u70BA\u706B\u85CF\u3002', kx: '\u3010\u536F\u96C6\u4E0A\u3011\u3010\u5FC3\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '手': { sw: '\u62F3\u4E5F\u3002\u8C61\u5F62\u3002', kx: '\u3010\u536F\u96C6\u4E2D\u3011\u3010\u624B\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '目': { sw: '\u4EBA\u773C\uFF0C\u8C61\u5F62\uFF0C\u91CD\u7AE5\u5B50\u4E5F\u3002', kx: '\u3010\u5348\u96C6\u4E2D\u3011\u3010\u76EE\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 5' },
  '小': { sw: '\u7269\u4E4B\u5FAE\u4E5F\u3002\u5F9E\u516B\u5F9E\u4E85\u3002\u898B\u800C\u5206\u4E4B\u3002', kx: '\u3010\u5BC5\u96C6\u4E0A\u3011\u3010\u5C0F\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '女': { sw: '\u5A66\u4EBA\u4E5F\u3002\u8C61\u5F62\u3002', kx: '\u3010\u4E11\u96C6\u4E0B\u3011\u3010\u5973\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '子': { sw: '\u5341\u4E00\u6708\u967D\u6C23\u52D5\uFF0C\u842C\u7269\u6ECB\u5165\uFF0C\u4EE5\u70BA\u7A31\u3002', kx: '\u3010\u5BC5\u96C6\u4E0A\u3011\u3010\u5B50\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '天': { sw: '\u984A\u4E5F\u3002\u81F3\u9AD8\u5728\u4E0A\uFF0C\u5F9E\u4E00\u5927\u4E5F\u3002', kx: '\u3010\u4E11\u96C6\u4E0B\u3011\u3010\u5927\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 4' },
  '土': { sw: '\u5730\u4E4B\u5410\u751F\u7269\u8005\u4E5F\u3002\u4E8C\u8C61\u5730\u4E4B\u4E0B\uFF0C\u5730\u4E4B\u4E2D\uFF0C\u4E28\u7269\u51FA\u5F62\u4E5F\u3002', kx: '\u3010\u4E11\u96C6\u4E2D\u3011\u3010\u571F\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 3' },
  '雨': { sw: '\u6C34\u4ECE\u96F2\u4E0B\u4E5F\u3002\u4E00\u8C61\u5929\uFF0C\u51C2\u8C61\u96F2\uFF0C\u6C34\u971D\u5176\u9593\u4E5F\u3002', kx: '\u3010\u620C\u96C6\u4E2D\u3011\u3010\u96E8\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 8' },
  '马': { sw: '\u6012\u4E5F\uFF0C\u6B66\u4E5F\u3002\u8C61\u99AC\u982D\u9BDB\u5C3E\u56DB\u8DB3\u4E4B\u5F62\u3002', kx: '\u3010\u4EA5\u96C6\u4E0A\u3011\u3010\u99AC\u5B57\u90E8\u3011\u00B7 \u5EB7\u719B\u7B46\u753B 10' }
};

// ========== HanziWriter：真实笔画顺序动画（本地数据 + 任意字 CDN 回退） ==========

/**
 * 先尝试本地 lib/data/{char}.json，再回退到 jsDelivr 上的 hanzi-writer-data（任意字可用），
 * 都没有则渲染一个会呼吸的静态汉字，绝不报错、绝不空白。
 */
function fetchCharData(char) {
  return new Promise(function(resolve) {
    var local = 'lib/data/' + encodeURIComponent(char) + '.json';
    fetch(local)
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function(d) { resolve(d); })
      .catch(function() {
        var cdn = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + encodeURIComponent(char) + '.json';
        fetch(cdn)
          .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
          .then(function(d) { resolve(d); })
          .catch(function() { resolve(null); });
      });
  });
}

function createWriter(targetEl, char) {
  // 清除旧实例
  if (currentWriter) { try { currentWriter = null; } catch (e) {} }
  targetEl.innerHTML = '';

  fetchCharData(char).then(function(data) {
    if (!data) {
      // 任意字：无笔画数据时，渲染会呼吸的静态汉字（仍"活着"）
      targetEl.innerHTML = '<div class="writer-static">' + char + '</div>';
      return;
    }

    var writer;
    try {
      writer = HanziWriter.create(targetEl, char, {
        width: Math.min(220, targetEl.clientWidth || 220),
        height: Math.min(220, targetEl.clientHeight || 220),
        strokeColor: '#C73E3A',
        radicalColor: '#D4A574',
        strokeWidth: 10,
        padding: 15,
        delayBetweenStrokes: 500,
        strokeAnimationSpeed: 1,
        showOutline: true,
        outlineColor: '#F0DDB5',
        charDataLoader: function(c, onComplete) { onComplete(data); },
        onComplete: function() {
          if (!quizMode) writer.showCharacter();
        }
      });
    } catch (e) {
      targetEl.innerHTML = '<div class="writer-static">' + char + '</div>';
      return;
    }

    currentWriter = writer;
    writer.animateCharacter();
  });
}



  const btn = document.getElementById('quizBtn');
  if (btn) {
    btn.textContent = '\u270F\uFE0F Show answer';
    btn.onclick = function() {
      if (currentWriter) {
        try { currentWriter.animateCharacter(); } catch(e) {}
      }
      btn.textContent = '\u270E Test my strokes';
      quizMode = false;
      btn.onclick = function() { startQuiz(); };
    };
  }
}

// ========== 加载字源 SVG（带降级处理） ==========
function loadEtoSvg(char, stage) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ url: img.src, ok: true });
    img.onerror = () => resolve({ url: null, ok: false });
    img.src = etoUrl(char, stage);
    setTimeout(() => resolve({ url: null, ok: false }), 6000);
  });
}

// ========== 动态字源演变（甲骨文→金文→篆书→楷书，逐帧动画） ==========
// 用 etymology-svg 真字形；缺失的（火·金文、手·甲骨文）用专属古风兜底 SVG；
// 其余任何加载失败自动降级为同色字，绝不出现破图。
const KNOWN_MISSING = { '火': 'bronze', '手': 'oracle', '水': 'bronze' };

// 火 · 金文（青铜时代火焰，填色圆润）
const BZ_FIRE = '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M100 128 Q58 102 72 66 Q80 46 72 28 Q90 46 100 60 Q110 42 128 30 Q118 58 128 76 Q136 104 100 128 Z" fill="#B8860B" opacity="0.92"/>' +
  '<path d="M100 118 Q82 98 92 72 Q98 62 96 78 Q100 66 108 60 Q104 82 110 92 Q112 104 100 118 Z" fill="#7A4E12" opacity="0.8"/>' +
  '</svg>';

// 水 · 金文（青铜时代流水象形：三条竖弯线，中央最长，两侧较短）
const BZ_WATER = '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">' +
  '<g fill="none" stroke="#B8860B" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M100 136 Q96 116 100 96 Q104 76 100 56 Q96 36 100 22"/>' +
  '<path d="M68 132 Q64 110 68 92 Q72 74 68 58"/>' +
  '<path d="M132 132 Q128 110 132 92 Q136 74 132 58"/>' +
  '</g></svg>';

// 手 · 甲骨文（张开五指的手掌象形）
const OR_HAND = '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">' +
  '<g stroke="#8B4513" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M62 126 Q62 86 100 86 Q138 86 138 126"/>' +
  '<line x1="72" y1="88" x2="66" y2="54"/>' +
  '<line x1="88" y1="88" x2="86" y2="46"/>' +
  '<line x1="100" y1="88" x2="100" y2="42"/>' +
  '<line x1="112" y1="88" x2="114" y2="46"/>' +
  '<line x1="128" y1="88" x2="134" y2="54"/>' +
  '</g></svg>';

function getAncientFallback(char, stage) {
  if (char === '火' && stage === 'bronze') return BZ_FIRE;
  if (char === '手' && stage === 'oracle') return OR_HAND;
  if (char === '水' && stage === 'bronze') return BZ_WATER;
  const color = { oracle: '#8B4513', bronze: '#B8860B', seal: '#2F4F4F' }[stage] || '#C73E3A';
  return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">' +
    '<text x="100" y="100" text-anchor="middle" font-size="78" fill="' + color + '" font-family="serif" opacity="0.82">' + char + '</text></svg>';
}

function getEvoStages(char, serverEto) {
  // serverEto: 后端返回的 { oracle: url, bronze: url, seal: url }，可能为 null
  return EVO_STAGES.map(function(d) {
    let content;
    if (d.key === 'modern') {
      content = '<div class="evo-modern-char">' + char + '</div>';
    } else if (KNOWN_MISSING[char] === d.key) {
      content = getAncientFallback(char, d.key);
    } else if (serverEto && serverEto[d.key]) {
      content = '<img class="evo-img" src="' + serverEto[d.key] + '" alt="' + d.lab + ' ' + char + '" loading="lazy"/>';
    } else {
      content = '<img class="evo-img" src="' + etoUrl(char, d.key) + '" alt="' + d.lab + ' ' + char + '" loading="lazy"/>';
    }
    return { key: d.key, lab: d.lab, sub: d.sub, cap: d.cap, color: d.color, content: content };
  });
}

// ========== 横排字源演变条（四格 + 箭头，用户要的原始布局） ==========
function buildEvoStripHoriz(char, serverEto) {
  const stripEl = document.getElementById('evoStrip');
  if (!stripEl) return;

  // 非内置字且无后端字源数据 → 显示友好提示（etymology-svg 对复杂字无古字形）
  const isBuiltin = !!CHARACTER_DB[char];
  const hasServerEto = serverEto && (serverEto.oracle || serverEto.bronze || serverEto.seal);
  if (!isBuiltin && !hasServerEto) {
    stripEl.innerHTML =
      '<div style="text-align:center;padding:20px 16px;color:#99825a;font-size:14px;line-height:1.7">' +
      '<div style="font-size:22px;margin-bottom:6px">📜</div>' +
      'Ancient forms for <b>' + char + '</b> are not yet in our etymology database.<br>' +
      '<span style="font-size:12.5px;color:#b0a090">Only characters with oracle-bone inscriptions have recorded evolution stages.</span></div>';
    return;
  }

  const stages = getEvoStages(char, serverEto);

  let html = '';
  stages.forEach(function(s, i) {
    var arrow = (i < stages.length - 1) ? '<div class="evo-arrow">\u2192</div>' : '';
    html += '<div class="evo-cell ' + s.key + '">' +
      '<div class="evo-glyph ' + s.key + '" style="--evo-color:' + s.color + '">' + s.content + '</div>' +
      '<div class="evo-lab">' + s.lab + '<span class="evo-sub">' + s.sub + '</span></div>' +
      '<div class="evo-cap">' + s.cap + '</div>' +
      '</div>' + arrow;
  });

  stripEl.innerHTML = html;

  // 加载失败自动降级为同色字，不出破图
  stripEl.querySelectorAll('img.evo-img').forEach(function(img) {
    img.onerror = function() {
      var slide = img.closest('.evo-cell');
      var glyph = slide ? slide.querySelector('.evo-glyph') : null;
      var color = glyph ? (glyph.style.getPropertyValue('--evo-color') || '#C73E3A') : '#C73E3A';
      var fb = document.createElement('div');
      fb.innerHTML = '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><text x="100" y="100" text-anchor="middle" font-size="78" fill="' + color + '" font-family="serif" opacity="0.82">' + char + '</text></svg>';
      img.replaceWith(fb.firstChild);
    };
  });
}

function renderEvoAnim(char) {
  const stages = getEvoStages(char);
  const viewer = document.getElementById('evoViewer');
  if (!viewer) return;

  viewer.innerHTML = stages.map(function(s, i) {
    return '<div class="evo-slide' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
      '<div class="evo-glyph ' + s.key + '" style="--evo-color:' + s.color + '">' + s.content + '</div>' +
      '<div class="evo-lab">' + s.lab + '<span class="evo-sub">' + s.sub + '</span></div>' +
      '<div class="evo-cap">' + s.cap + '</div>' +
      '</div>';
  }).join('');

  // 加载失败自动降级为同色字，不出破图
  viewer.querySelectorAll('img.evo-img').forEach(function(img) {
    img.onerror = function() {
      const slide = img.closest('.evo-slide');
      const glyph = slide ? slide.querySelector('.evo-glyph') : null;
      const color = glyph ? (glyph.style.getPropertyValue('--evo-color') || '#C73E3A') : '#C73E3A';
      const fb = document.createElement('div');
      fb.innerHTML = '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><text x="100" y="100" text-anchor="middle" font-size="78" fill="' + color + '" font-family="serif" opacity="0.82">' + char + '</text></svg>';
      img.replaceWith(fb.firstChild);
    };
  });

  const dots = document.getElementById('evoDots');
  if (dots) dots.innerHTML = stages.map(function(s, i) {
    return '<button class="evo-dot' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" title="' + s.lab + '"></button>';
  }).join('');

  window.__evo = { stages: stages, i: 0, timer: null, playing: true };
  showEvo(0);
  playEvo();

  const prev = document.getElementById('evoPrev');
  const next = document.getElementById('evoNext');
  const play = document.getElementById('evoPlay');
  const rep = document.getElementById('evoReplay');
  if (prev) prev.onclick = function() { pauseEvo(); showEvo((window.__evo.i - 1 + stages.length) % stages.length); };
  if (next) next.onclick = function() { pauseEvo(); showEvo((window.__evo.i + 1) % stages.length); };
  if (rep) rep.onclick = function() { showEvo(0); playEvo(); };
  if (play) play.onclick = function() { if (window.__evo.playing) pauseEvo(); else playEvo(); };
  if (dots) dots.querySelectorAll('.evo-dot').forEach(function(d) {
    d.onclick = function() { pauseEvo(); showEvo(parseInt(d.getAttribute('data-i'), 10)); };
  });
}

function showEvo(i) {
  const ev = window.__evo; if (!ev) return;
  ev.i = i;
  document.querySelectorAll('#evoViewer .evo-slide').forEach(function(s, idx) {
    s.classList.toggle('active', idx === i);
  });
  document.querySelectorAll('#evoDots .evo-dot').forEach(function(d, idx) {
    d.classList.toggle('active', idx === i);
  });
  const playBtn = document.getElementById('evoPlay');
  if (playBtn) playBtn.textContent = ev.playing ? '⏸ Pause' : '▶ Play';
}

function playEvo() {
  const ev = window.__evo; if (!ev) return;
  ev.playing = true;
  const playBtn = document.getElementById('evoPlay');
  if (playBtn) playBtn.textContent = '⏸ Pause';
  if (ev.timer) clearInterval(ev.timer);
  ev.timer = setInterval(function() { showEvo((ev.i + 1) % ev.stages.length); }, 2600);
}

function pauseEvo() {
  const ev = window.__evo; if (!ev) return;
  ev.playing = false;
  if (ev.timer) { clearInterval(ev.timer); ev.timer = null; }
  const playBtn = document.getElementById('evoPlay');
  if (playBtn) playBtn.textContent = '▶ Play';
}

// ========== 渲染分类筛选 ==========
function renderChips() {
  const box = document.getElementById('chips');
  box.innerHTML = '';
  Object.keys(CATEGORIES).forEach(cat => {
    const b = document.createElement('button');
    b.className = 'chip' + (cat === activeCat ? ' active' : '');
    b.textContent = CATEGORIES[cat];
    b.onclick = () => { activeCat = cat; renderChips(); renderGrid(); };
    box.appendChild(b);
  });
}

// ========== 搜索匹配 ==========
function charMatches(d, q) {
  if (!q) return true;
  const ql = q.toLowerCase();
  if (d.pinyin.toLowerCase().startsWith(ql)) return true;
  if (d.pinyin.toLowerCase().includes(ql)) return true;
  if (d.translation.toLowerCase().includes(ql)) return true;
  if (d.story && d.story.title && d.story.title.toLowerCase().includes(ql)) return true;
  return false;
}

function filteredChars() {
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  let keys = Object.keys(CHARACTER_DB).concat(Object.keys(CUSTOM_DB));
  if (activeCat !== 'all') keys = keys.filter(k => (CHARACTER_DB[k] || CUSTOM_DB[k]).category === activeCat);
  // 去重（极少数情况下自定义与内置重复）
  keys = keys.filter((k, i) => keys.indexOf(k) === i);
  if (q) keys = keys.filter(k => k === q || charMatches(CHARACTER_DB[k] || CUSTOM_DB[k], q));
  return keys;
}

// ========== 字卡网格 ==========
function renderGrid() {
  const grid = document.getElementById('grid');
  let keys = filteredChars();
  if (alphaSort) {
    keys = keys.slice().sort((a, b) => {
      const pa = ((CHARACTER_DB[a] && CHARACTER_DB[a].pinyin) || (CUSTOM_DB[a] && CUSTOM_DB[a].pinyin) || '').toLowerCase();
      const pb = ((CHARACTER_DB[b] && CHARACTER_DB[b].pinyin) || (CUSTOM_DB[b] && CUSTOM_DB[b].pinyin) || '').toLowerCase();
      return pa.localeCompare(pb);
    });
  }
  grid.innerHTML = '';
  if (!keys.length) {
    grid.innerHTML = '<div class="empty">No matching characters \u2014 try another keyword.</div>';
    return;
  }
  keys.forEach(k => {
    const d = CHARACTER_DB[k] || CUSTOM_DB[k];
    const card = document.createElement('div');
    card.className = 'card' + (CHARACTER_DB[k] ? '' : ' card-custom');
    card.innerHTML = '<div class="glyph">' + k + '</div><div class="py">' + d.pinyin + '</div><div class="tr">' + d.translation + '</div>';
    card.onclick = () => openDetail(k);
    grid.appendChild(card);
  });
}

// ========== 详情页 ==========
async function openDetail(char, data) {
  const d = data || CHARACTER_DB[char] || CUSTOM_DB[char];
  if (!d) { showError('We don\'t have a story for "' + char + '" yet.'); return; }

  currentChar = char;
  quizMode = false;
  const detail = document.getElementById('detail');
  const label = CATEGORIES[d.category] || '';
  const encChar = encodeURIComponent(char);
  // 汉典（zdic.net）对应字条：一个字一条，永远权威、零维护
  const dictUrl = 'https://www.zdic.net/hans/' + encChar;

  const birthText = BIRTH_EN[char] || 'Long ago, this character began as a picture of the world \u2014 an oracle-bone drawing that slowly became the character we write today.';

  const examples = d.example_sentences.map(s =>
    '<div class="ex"><span class="zh">' + s.chinese + '</span><span class="py">' + s.pinyin + '</span><span class="en">' + s.english + '</span></div>'
  ).join('');

  const related = d.related_characters.map(r =>
    '<div class="rel" data-char="' + r.char + '"><div class="rc">' + r.char + '</div><div class="rm">' + r.meaning + '</div></div>'
  ).join('');

  detail.innerHTML =
    '<div class="detail-top">' +
      '<div class="detail-left">' +
        '<div class="writer-target" id="writerTarget"></div>' +
        '<div class="writer-controls">' +
          '<button class="mini-btn" id="quizBtn">\u270E Test my strokes</button>' +
        '</div>' +

        '<div class="motion-card">' +
          '<div class="motion-kicker">\uD83C\uDFAC See the meaning move \u00B7 \u5B57\u4E49\u52A8\u8D77\u6765</div>' +
          '<div class="motion-stage" id="motionStage"></div>' +
          '<div class="motion-cap" id="motionCap"></div>' +
        '</div>' +

        '<div class="badges">' +
          '<div class="py-badge">' + d.pinyin + '</div>' +
          '<div class="tr-badge">' + d.translation + '</div>' +
          '<div class="cat-badge">' + ((d.generated ? (d.fromServer ? 'Saved to library \u00B7 \u5DF2\u5B58\u5165\u5B57\u5E93' : 'Your collection \u00B7 just added') : label + ' \u00B7 ' + d.stroke_count + ' strokes \u00B7 HSK' + d.hsk_level)) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="detail-right">' +
        '<button class="back-btn" id="backBtn">\u2190 Back to all characters</button>' +
        '<div class="story-title">' +
          '<div class="story-title-zh">' + char + · ' + d.story.title + '</div>' +
          '<div class="story-title-en">' + (d.story.title_en || 'Story') + '</div>' +
        '</div>' +

        '<div class="evo-strip" id="evoStrip"><div class="evo-loading">Loading ancient glyphs...</div></div>' +

        '<div class="classics-card">' +
          '<div class="classics-kicker">\uD83D\uDCDA Classical references \u00B7 \u53E4\u7C4D\u5F15\u6587</div>' +
          '<div id="classicsBody"></div>' +
        '</div>' +

        '<div class="birth-book">' +
          '<div class="birth-kicker">\uD83D\uDCD6 How was this character born?</div>' +
          '<p class="birth-text">' + birthText + '</p>' +
          '<div class="ref-note">Ancient glyph images from <a href="https://github.com/linjialiang/etymology-svg" target="_blank" rel="noopener">etymology-svg \u2197</a> (open-source, CC license). Also referenced: <a href="https://hanziyuan.net/#' + encChar + '" target="_blank" rel="noopener">Richard Sears\' Chinese Etymology (\u6C49\u5B57\u53E6\u53E8) \u2197</a>.</div>' +
        '</div>' +

        '<div class="dict-card">' +
          '<div class="dict-kicker">📖 Look it up in a dictionary · 查字典</div>' +
          '<p class="dict-text">Full entry on <b>汉典 (zdic.net)</b> — pinyin, radical, stroke count, classical quotes from 《说文解字》《康熙字典》, and modern definitions.</p>' +
          '<a class="dict-btn" href="' + dictUrl + '" target="_blank" rel="noopener">Open <span class="dict-glyph">' + char + '</span> on 汉典 ↗</a>' +
        '</div>' +

        '<div class="story-content">' + d.story.content + '</div>' +
        (d.memory_hook ? '<div class="hook">\uD83D\uDCA1 ' + d.memory_hook + '</div>' : '') +
        (d.example_sentences.length ? '<div class="ex-title">Example sentences</div>' + examples : '') +
        (d.related_characters.length ? '<div class="rel-title">Related characters</div><div class="rel-grid">' + related + '</div>' : '') +

        // Google AdSense In-Article Ad
        '<div class="ad-unit" style="margin-top:28px"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8431005592738499" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins></div>' +
      '</div>' +
    '</div>';

  detail.style.display = 'block';
  document.getElementById('home').style.display = 'none';

  // Build horizontal etymology strip with arrows（甲骨文 → 金文 → 篆书 → 楷书）
  buildEvoStripHoriz(char, d.etymology || null);

  // 触发 AdSense 广告加载
  if (typeof adsbygoogle !== 'undefined') {
    (adsbygoogle = window.adsbygoogle || []).push({});
  }

  // Inject classical references (說文解字 + 康熙字典; server-side generated chars use their own classics)
  const cl = (d && d.classics && (d.classics.sw || d.classics.kx)) ? d.classics : CLASSICS[currentChar];
  const cb = document.getElementById('classicsBody');
  if (cb) {
    if (cl) {
      let h = '';
      if (cl.sw) h += '<div class="cl-row"><span class="cl-tag">\u8AAC\u6587\u89E3\u5B57</span><span class="cl-txt">' + cl.sw + '</span></div>';
      if (cl.kx) h += '<div class="cl-row"><span class="cl-tag">\u5EB7\u719B\u5B57\u5178</span><span class="cl-txt">' + cl.kx + '</span></div>';
      cb.innerHTML = h;
    } else {
      cb.innerHTML = '<div class="cl-empty">Classical quotes for this character are not in our collection yet. Find them on <a href="' + dictUrl + '" target="_blank" rel="noopener">\u6F22\u5178 (zdic.net) \u2197</a>.</div>';
    }
  }

  // Inject character-as-SVG meaning animation (字本身的笔画按字义动起来 — 不再重复写大字)
  const motionStage = document.getElementById('motionStage');
  if (motionStage) motionStage.innerHTML = getMotionCharSVG(currentChar);
  const motionCap = document.getElementById('motionCap');
  if (motionCap) motionCap.textContent = MOTION_CAP[currentChar] || (
    'The character ' + currentChar + ' ' + (HERO_VERB[guessMotionType(currentChar)] || 'breathes gently') + '.'
  );
  const motionReplay = document.getElementById('motionReplay');
  if (motionReplay) motionReplay.onclick = function() {
    if (motionStage) motionStage.innerHTML = getMotionCharSVG(currentChar);
  };

  // Create HanziWriter with real stroke order animation
  const writerTarget = document.getElementById('writerTarget');
  if (writerTarget) {
    createWriter(writerTarget, char);
  }

  // Button handlers
  document.getElementById('quizBtn').onclick = startQuiz;
  document.getElementById('backBtn').onclick = goHome;

  detail.querySelectorAll('.rel').forEach(el => {
    el.onclick = () => openDetail(el.getAttribute('data-char'));
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  document.getElementById('detail').style.display = 'none';
  document.getElementById('home').style.display = 'block';
  currentChar = null;
  quizMode = false;
  if (currentWriter) {
    try { currentWriter = null; } catch(e) {}
  }
}

function showError(msg) {
  const e = document.getElementById('errorDiv');
  e.textContent = msg;
  e.style.display = 'block';
  setTimeout(() => { e.style.display = 'none'; }, 4000);
}

// ========== 任意字生成（用户输入 → 自动拼装并收录） ==========
function isHan(ch) { return /[一-鿿]/.test(ch); }

async function openGenerated(char) {
  // 优先调用后端字库（查一次自动入库，所有人可复用）
  let serverData = null;
  try {
    const res = await fetch('/char/' + encodeURIComponent(char));
    if (res.ok) serverData = await res.json();
  } catch (e) {
    // 离线 / 函数未部署 → 回退到纯前端生成
  }

  let rec;
  if (serverData && serverData.char) {
    // 来自服务端字库
    rec = {
      generated: true,
      fromServer: true,
      category: '',
      pinyin: '?',
      translation: '?',
      stroke_count: '?',
      hsk_level: '?',
      story: serverData.story || { title: 'A character drawn from the world', content: BIRTH_EN[char] || '' },
      memory_hook: '',
      example_sentences: [],
      related_characters: [],
      classics: serverData.classics || {},
      etymology: serverData.etymology || null,
      source: serverData.source || 'server'
    };
  } else {
    // 前端兜底（无《说文》文本，详情页引导去汉典查）
    rec = {
      generated: true,
      category: '',
      pinyin: '?',
      translation: '?',
      stroke_count: '?',
      hsk_level: '?',
      story: {
        title: 'A character drawn from the world',
        content: BIRTH_EN[char] || ('Long ago, someone looked at the world and drew <b>' + char + '</b> as a picture. Over thousands of years that picture slowly became the character we write today. Above you can watch its ancient forms appear one by one, see how it is written stroke by stroke, and open 汉典 to read its full classical record.')
      },
      memory_hook: '',
      example_sentences: [],
      related_characters: []
    };
  }
  // 收录（内存 + localStorage 离线兜底）；服务端字库由后端负责持久化
  saveCustomChar(char, rec);
  renderChips();
  renderGrid();
  openDetail(char, rec);
}

// ========== 搜索 ==========
function doSearch() {
  const q = (document.getElementById('searchInput').value || '').trim();
  if (!q) { renderGrid(); return; }
  if (q.length === 1 && isHan(q)) {
    if (CHARACTER_DB[q]) openDetail(q); else openGenerated(q);
    return;
  }
  const matches = filteredChars();
  if (matches.length === 1) { openDetail(matches[0]); return; }
  renderGrid();
  if (!matches.length) showError('No character found for "' + q + '". Try a Chinese character or English meaning.');
}

// ========== 初始化 ==========
function init() {
  renderChips();
  renderGrid();

  document.getElementById('searchInput').addEventListener('input', () => {
    const q = document.getElementById('searchInput').value.trim();
    if (q.length === 1 && isHan(q)) {
      if (CHARACTER_DB[q]) openDetail(q); else openGenerated(q);
      return;
    }
    const matches = filteredChars();
    if (matches.length === 1) { openDetail(matches[0]); return; }
    renderGrid();
  });

  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
  document.getElementById('searchBtn').onclick = doSearch;
  updateAuthUI();
}

// ========== Google 登录态 ==========
async function updateAuthUI() {
  const area = document.getElementById('authArea');
  if (!area) return;
  try {
    const res = await fetch('/auth/me', { credentials: 'same-origin' });
    const data = await res.json();
    if (data.user) {
      const u = data.user;
      area.innerHTML =
        '<div class="user-chip">' +
          (u.picture ? '<img class="user-avatar" src="' + u.picture + '" alt="">' : '') +
          '<span class="user-name">' + escapeHtml(u.name || u.email || 'User') + '</span>' +
          '<a class="signout-btn" href="/auth/logout">Sign out</a>' +
        '</div>';
    } else {
      area.innerHTML =
        '<a class="google-btn" href="/auth/google">' +
          '<svg class="g-icon" viewBox="0 0 48 48" width="18" height="18">' +
            '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
            '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
            '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
            '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
          '</svg>' +
          '<span>Sign in with Google</span>' +
        '</a>';
    }
  } catch (e) {
    // 接口不可用（离线/未部署）时静默降级为登录按钮
    area.innerHTML =
      '<a class="google-btn" href="/auth/google">' +
        '<svg class="g-icon" viewBox="0 0 48 48" width="18" height="18">' +
          '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
          '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
          '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
          '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
        '</svg>' +
        '<span>Sign in with Google</span>' +
      '</a>';
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

document.addEventListener('DOMContentLoaded', init);
