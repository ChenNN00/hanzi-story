// ============================================================
//  HanziStory — 汉字资源数据库 (Resource Database)
//  24 个常用汉字：字源演变 + 绘本故事 + 出处 + 插图映射
//  扩展方式：往 CHARACTER_DB 里加一个条目即可，页面自动读取。
// ============================================================

const HOT_CHARACTERS = ['人','山','水','木','火','日','月','口','田','大','心','手','目','天'];

const SOURCES = [
  { title: '《说文解字》', desc: '许慎（东汉，约公元 121 年）— 中国第一部系统分析字源、字形、字义的字典' },
  { title: '郭沫若《甲骨文合集》', desc: '甲骨文字形考释权威，看商代象形本貌' },
  { title: 'Chinese Etymology', desc: 'chineseetymology.org — 甲骨文 / 金文 / 篆书 对照数据库' },
  { title: 'Outlier Linguistics', desc: '基于现代古文字学的部件拆解分析' },
  { title: '字源 (hanziyuan.net)', desc: '汉字字形演变可视化档案' }
];

const CHARACTER_DB = {

  // ---------- 原 10 字（保留你的文案） ----------
  '人': {
    pinyin: 'rén', translation: 'person, human', stroke_count: 2, hsk_level: 1, radical: '人',
    category: 'people', illustration: 'person',
    etymology: {
      oracle_bone: '一个侧身站立的人——两笔勾出身体和弯曲的手臂。',
      bronze: '与甲骨文相近，线条更圆润流畅。',
      seal_script: '手臂向下延伸，字形更对称。',
      modern: '两笔：向左的撇（丿）与向右的捺（乀）。',
      origin: '象形字，描摹侧身站立的人。'
    },
    story: {
      title: '走路的人',
      content: `Imagine an ancient Chinese artist watching a person walk by. They didn't try to draw every detail — no face, no clothes, no fingers. Instead, they captured the essence: two strokes, one leaning left like a body, one leaning right like an arm reaching forward. That's 人 (rén) — "person." Simple, elegant, and instantly recognizable. Thousands of years later, we still see that walking figure in every 人 we write.`
    },
    source: '《说文解字》："天地之性最贵者也。" 象形（侧面人形），参考 chineseetymology.org 甲骨文。',
    components: [ { part: '人', type: 'standalone', meaning: 'person — this character doesn\'t break into smaller parts' } ],
    example_sentences: [
      { chinese: '这个人很高。', pinyin: 'Zhè ge rén hěn gāo.', english: 'This person is very tall.', difficulty: 'beginner' },
      { chinese: '三个人在吃饭。', pinyin: 'Sān ge rén zài chīfàn.', english: 'Three people are eating.', difficulty: 'beginner' },
      { chinese: '他是一个善良的人。', pinyin: 'Tā shì yí ge shànliáng de rén.', english: 'He is a kind person.', difficulty: 'intermediate' }
    ],
    memory_hook: 'Think of 人 as two legs walking — a person on the move!',
    related_characters: [
      { char: '从', pinyin: 'cóng', meaning: 'follow — two people, one behind the other' },
      { char: '众', pinyin: 'zhòng', meaning: 'crowd — three people together' },
      { char: '休', pinyin: 'xiū', meaning: 'rest — a person leaning against a tree' },
      { char: '他', pinyin: 'tā', meaning: 'he/other — with 亻(person radical)' }
    ]
  },

  '山': {
    pinyin: 'shān', translation: 'mountain', stroke_count: 3, hsk_level: 1, radical: '山',
    category: 'nature', illustration: 'mountain',
    etymology: {
      oracle_bone: '三座山峰从地面隆起——直接画出山脉。',
      bronze: '三峰更分明，底部一条横线。',
      seal_script: '山峰化为曲线，更程式化。',
      modern: '中间一竖最高，两侧两竖较短，由一横相连。',
      origin: '象形字，描摹山峰。'
    },
    story: {
      title: '三座山峰',
      content: `Picture yourself standing in a valley, looking up at three mountain peaks against the sky. That's exactly what the ancient Chinese saw when they created 山 (shān). Three vertical lines rise from a horizontal base — the middle one tallest, like the king of mountains, with two shorter peaks on either side. No abstraction, no metaphor. Just a picture of what they saw every day. When you write 山, you're drawing mountains.`
    },
    source: '《说文解字》："宣也。宣气散，生万物。" 象形，参考 字源网 金文字形。',
    components: [ { part: '山', type: 'standalone', meaning: 'mountain — a pictograph that doesn\'t break into smaller parts' } ],
    example_sentences: [
      { chinese: '这座山很高。', pinyin: 'Zhè zuò shān hěn gāo.', english: 'This mountain is very tall.', difficulty: 'beginner' },
      { chinese: '我们去爬山吧。', pinyin: 'Wǒmen qù pá shān ba.', english: 'Let\'s go climb a mountain.', difficulty: 'beginner' },
      { chinese: '山上有很多树。', pinyin: 'Shān shàng yǒu hěn duō shù.', english: 'There are many trees on the mountain.', difficulty: 'intermediate' }
    ],
    memory_hook: 'Three peaks rising up — that\'s a mountain, plain and simple!',
    related_characters: [
      { char: '出', pinyin: 'chū', meaning: 'go out — a foot stepping over a mountain' },
      { char: '仙', pinyin: 'xiān', meaning: 'immortal — a person (亻) living in the mountains (山)' },
      { char: '岩', pinyin: 'yán', meaning: 'rock — mountain (山) over stone (石)' },
      { char: '岛', pinyin: 'dǎo', meaning: 'island — a mountain in the sea' }
    ]
  },

  '水': {
    pinyin: 'shuǐ', translation: 'water', stroke_count: 4, hsk_level: 1, radical: '水',
    category: 'nature', illustration: 'water',
    etymology: {
      oracle_bone: '蜿蜒的河流，两侧点画表示水珠或涟漪。',
      bronze: '水流线更连续，点画并入曲线。',
      seal_script: '中间一竖流，两侧弯曲如流水。',
      modern: '中间竖钩，左右各一弯笔。',
      origin: '象形字，描摹流水与涟漪。'
    },
    story: {
      title: '流动的河',
      content: `Close your eyes and picture a river. See the water flowing downward in the middle, with little ripples and splashes on both sides. That's what the ancient Chinese captured in 水 (shuǐ). The center stroke is the main current — steady, flowing down. The strokes on either side are the ripples, the waves, the droplets catching sunlight as they splash. Every time you write 水, you're painting a river. You can almost hear it flow.`
    },
    source: '《说文解字》："准也。北方之行。" 象形（流水），参考 chineseetymology.org。',
    components: [ { part: '水', type: 'standalone', meaning: 'water — a pictograph of flowing water' } ],
    example_sentences: [
      { chinese: '我要喝水。', pinyin: 'Wǒ yào hē shuǐ.', english: 'I want to drink water.', difficulty: 'beginner' },
      { chinese: '水很干净。', pinyin: 'Shuǐ hěn gānjìng.', english: 'The water is very clean.', difficulty: 'beginner' },
      { chinese: '这条河水流很急。', pinyin: 'Zhè tiáo hé shuǐ liú hěn jí.', english: 'This river flows fast.', difficulty: 'intermediate' }
    ],
    memory_hook: 'A river flowing down with splashes on both sides — that\'s water!',
    related_characters: [
      { char: '冰', pinyin: 'bīng', meaning: 'ice — water (水) turned solid' },
      { char: '河', pinyin: 'hé', meaning: 'river — water (氵) + 可' },
      { char: '海', pinyin: 'hǎi', meaning: 'sea — water (氵) + 每' },
      { char: '泉', pinyin: 'quán', meaning: 'spring — water bubbling up from a source' }
    ]
  },

  '木': {
    pinyin: 'mù', translation: 'tree, wood', stroke_count: 4, hsk_level: 1, radical: '木',
    category: 'nature', illustration: 'tree',
    etymology: {
      oracle_bone: '一棵树，枝向上、根向下，中间一道树干。',
      bronze: '与甲骨文相近，枝根更分明。',
      seal_script: '枝与根对称外展。',
      modern: '一个"十"字，加两斜笔——上斜为枝、下斜为根。',
      origin: '象形字，描摹有枝有根的树。'
    },
    story: {
      title: '生命之树',
      content: `Think of a tree. There's a trunk in the middle, branches reaching up toward the sun, and roots digging deep into the earth below. The ancient Chinese drew exactly this when they created 木 (mù). The vertical stroke is the trunk — strong and straight. The horizontal stroke is the ground line. The two strokes pointing up are branches reaching for light. The two strokes pointing down are roots gripping the soil. Above ground, it grows. Below ground, it holds on. That's a tree — and that's 木.`
    },
    source: '《说文解字》："冒也。冒地而生。" 象形（树木），参考 字源网。',
    components: [ { part: '木', type: 'standalone', meaning: 'tree — branches above, roots below' } ],
    example_sentences: [
      { chinese: '这是一棵大树。', pinyin: 'Zhè shì yì kē dà shù.', english: 'This is a big tree.', difficulty: 'beginner' },
      { chinese: '木头的颜色很好看。', pinyin: 'Mùtou de yánsè hěn hǎokàn.', english: 'The color of the wood looks nice.', difficulty: 'beginner' },
      { chinese: '院子种了很多木本植物。', pinyin: 'Yuànzi zhòng le hěn duō mùběn zhíwù.', english: 'Many woody plants are grown in the yard.', difficulty: 'intermediate' }
    ],
    memory_hook: 'Branches up, roots down, trunk in the middle — that\'s a tree!',
    related_characters: [
      { char: '林', pinyin: 'lín', meaning: 'woods — two trees together' },
      { char: '森', pinyin: 'sēn', meaning: 'forest — three trees, lots of trees!' },
      { char: '休', pinyin: 'xiū', meaning: 'rest — a person (亻) leaning on a tree (木)' },
      { char: '本', pinyin: 'běn', meaning: 'root — a mark at the base of a tree' }
    ]
  },

  '火': {
    pinyin: 'huǒ', translation: 'fire', stroke_count: 4, hsk_level: 1, radical: '火',
    category: 'nature', illustration: 'fire',
    etymology: {
      oracle_bone: '跳动的火焰，火星向上飞溅——生动的火。',
      bronze: '火焰更规整，呈三道主焰。',
      seal_script: '火焰化为曲线笔画。',
      modern: '两点（火星）在上，两笔（火焰）在下，中间一竖带捺。',
      origin: '象形字，描摹火焰与火星。'
    },
    story: {
      title: '跳舞的火苗',
      content: `Imagine sitting around a campfire in ancient China. You watch the flames dance and leap, sending sparks flying up into the night sky. That's what the creator of 火 (huǒ) saw. The strokes in the middle are the main flames, reaching upward. The two dots are sparks, breaking free and floating away. The sweeping bottom stroke is the base of the fire, where the fuel burns hottest. When you write 火, you're not just writing a word — you're drawing fire itself, with all its energy and danger and warmth.`
    },
    source: '《说文解字》："燬也。南方之行。" 象形（火焰），参考 chineseetymology.org 甲骨文。',
    components: [ { part: '火', type: 'standalone', meaning: 'fire — flames and sparks' } ],
    example_sentences: [
      { chinese: '火很大！', pinyin: 'Huǒ hěn dà!', english: 'The fire is big!', difficulty: 'beginner' },
      { chinese: '不要玩火。', pinyin: 'Bú yào wán huǒ.', english: 'Don\'t play with fire.', difficulty: 'beginner' },
      { chinese: '消防员很快灭了火。', pinyin: 'Xiāofángyuán hěn kuài miè le huǒ.', english: 'The firefighters quickly put out the fire.', difficulty: 'intermediate' }
    ],
    memory_hook: 'Sparks flying up from dancing flames — that\'s fire!',
    related_characters: [
      { char: '灾', pinyin: 'zāi', meaning: 'disaster — fire (火) in a house (宀)' },
      { char: '灭', pinyin: 'miè', meaning: 'extinguish — a cover over fire' },
      { char: '灰', pinyin: 'huī', meaning: 'ash — what fire leaves behind' },
      { char: '炉', pinyin: 'lú', meaning: 'stove — fire (火) inside a vessel' }
    ]
  },

  '日': {
    pinyin: 'rì', translation: 'sun, day', stroke_count: 4, hsk_level: 1, radical: '日',
    category: 'nature', illustration: 'sun',
    etymology: {
      oracle_bone: '一个圆，中间一点或一短横——太阳与其光芒。',
      bronze: '圆趋椭圆，中点更明显。',
      seal_script: '圆被拉成方，中点成一横。',
      modern: '方框中一横——最简的太阳。',
      origin: '象形字，描摹太阳。'
    },
    story: {
      title: '盒子里的太阳',
      content: `The ancient Chinese looked up at the sun and drew a circle with a dot in the middle — simple, direct, unmistakable. Over thousands of years, that circle slowly became a rectangle, and the dot became a line. Why? Because when you carve characters into hard materials like bone and bronze, circles are hard to make but rectangles are easy. So 日 (rì) went from a round sun to a boxy one. But look closely — that horizontal line inside? That's the old center dot, still there after 3,000 years. The sun hasn't changed. We just draw it differently now.`
    },
    source: '《说文解字》："实也。太阳之精。" 象形（日轮），参考 字源网。',
    components: [ { part: '日', type: 'standalone', meaning: 'sun — originally a circle with a dot' } ],
    example_sentences: [
      { chinese: '今天日很好。', pinyin: 'Jīntiān rì hěn hǎo.', english: 'Today the sun is nice.', difficulty: 'beginner' },
      { chinese: '一日三餐。', pinyin: 'Yí rì sān cān.', english: 'Three meals a day.', difficulty: 'beginner' },
      { chinese: '日本在中国的东边。', pinyin: 'Rìběn zài Zhōngguó de dōngbian.', english: 'Japan is to the east of China.', difficulty: 'intermediate' }
    ],
    memory_hook: 'A box with a line inside — the sun, squared up for easy carving!',
    related_characters: [
      { char: '明', pinyin: 'míng', meaning: 'bright — sun (日) + moon (月)' },
      { char: '早', pinyin: 'zǎo', meaning: 'early — the sun (日) rising above' },
      { char: '时', pinyin: 'shí', meaning: 'time — the sun (日) measuring' },
      { char: '春', pinyin: 'chūn', meaning: 'spring — the sun (日) bringing life' }
    ]
  },

  '月': {
    pinyin: 'yuè', translation: 'moon, month', stroke_count: 4, hsk_level: 1, radical: '月',
    category: 'nature', illustration: 'moon',
    etymology: {
      oracle_bone: '一弯月牙——带一道内线的弯曲形状。',
      bronze: '月牙更分明。',
      seal_script: '弯月拉直为竖弯，内线变横。',
      modern: '方框状，左侧弯、内两横——楷体中的月。',
      origin: '象形字，描摹弯月。'
    },
    story: {
      title: '弯弯的月亮',
      content: `Look up at the night sky and find a crescent moon. That curved, gentle shape is exactly what the ancient Chinese drew when they created 月 (yuè). The outer curve is the moon's bright edge. The line inside represents the moon's body, the part that glows. Over centuries, the crescent was gradually straightened into a box shape for easier writing, but those two horizontal lines inside? They're the old markings of the moon's surface. So every time you see 月, remember: you're looking at a crescent moon, flattened by time but still glowing in the night sky.`
    },
    source: '《说文解字》："阙也。太阴之精。" 象形（月牙），参考 chineseetymology.org。',
    components: [ { part: '月', type: 'standalone', meaning: 'moon — originally a crescent shape' } ],
    example_sentences: [
      { chinese: '月亮很圆。', pinyin: 'Yuèliang hěn yuán.', english: 'The moon is very round.', difficulty: 'beginner' },
      { chinese: '一个月有三十天。', pinyin: 'Yí ge yuè yǒu sānshí tiān.', english: 'A month has thirty days.', difficulty: 'beginner' },
      { chinese: '中秋节是赏月的好时候。', pinyin: 'Zhōngqiū jié shì shǎng yuè de hǎo shíhou.', english: 'Mid-Autumn Festival is a good time to enjoy the moon.', difficulty: 'intermediate' }
    ],
    memory_hook: 'A crescent moon flattened into a box — still glowing inside!',
    related_characters: [
      { char: '明', pinyin: 'míng', meaning: 'bright — moon (月) + sun (日)' },
      { char: '朋', pinyin: 'péng', meaning: 'friend — two moons side by side' },
      { char: '期', pinyin: 'qī', meaning: 'period — the moon (月) marking time' },
      { char: '望', pinyin: 'wàng', meaning: 'gaze — looking up at the moon' }
    ]
  },

  '口': {
    pinyin: 'kǒu', translation: 'mouth', stroke_count: 3, hsk_level: 1, radical: '口',
    category: 'body', illustration: 'mouth',
    etymology: {
      oracle_bone: '张开的嘴——一个椭圆或圆角方形的口。',
      bronze: '更趋矩形，仍示开口。',
      seal_script: '圆角方形的嘴。',
      modern: '一个方口——最基础的"开口"形象。',
      origin: '象形字，描摹张开的嘴。'
    },
    story: {
      title: '张开的嘴',
      content: `What's the simplest way to draw a mouth? Just draw an opening. That's what the ancient Chinese did with 口 (kǒu). One look and you know what it is — a hole, an opening, a mouth. It started as a rounded shape, like real lips, and over time became a clean square for easier writing. But the meaning never changed. 口 is everywhere in Chinese characters because mouths do so much — we eat, speak, shout, sing, and breathe through them. When you see 口 inside a character, think "mouth" or "opening," and you'll often guess the meaning right.`
    },
    source: '《说文解字》："人所以言食也。" 象形（口），参考 字源网。',
    components: [ { part: '口', type: 'standalone', meaning: 'mouth — a simple drawing of an opening' } ],
    example_sentences: [
      { chinese: '张开嘴。', pinyin: 'Zhāngkāi kǒu.', english: 'Open your mouth.', difficulty: 'beginner' },
      { chinese: '他口渴了。', pinyin: 'Tā kǒukě le.', english: 'He is thirsty.', difficulty: 'beginner' },
      { chinese: '这家餐厅口碑很好。', pinyin: 'Zhè jiā cāntīng kǒubēi hěn hǎo.', english: 'This restaurant has a good reputation.', difficulty: 'intermediate' }
    ],
    memory_hook: 'A square hole — that\'s a mouth, plain and simple!',
    related_characters: [
      { char: '吃', pinyin: 'chī', meaning: 'eat — mouth (口) + begging' },
      { char: '喝', pinyin: 'hē', meaning: 'drink — mouth (口) + thirsty' },
      { char: '唱', pinyin: 'chàng', meaning: 'sing — two mouths making music' },
      { char: '问', pinyin: 'wèn', meaning: 'ask — mouth (口) speaking from the heart' }
    ]
  },

  '田': {
    pinyin: 'tián', translation: 'field, farmland', stroke_count: 5, hsk_level: 1, radical: '田',
    category: 'nature', illustration: 'field',
    etymology: {
      oracle_bone: '一个被分成四格的正方形——俯瞰的分割农田。',
      bronze: '相似的网格，田界更粗。',
      seal_script: '方框内含十字——经典田形。',
      modern: '方框内一横一竖交叉，分成四块。',
      origin: '象形字，描摹分割的农田。'
    },
    story: {
      title: '分格的田',
      content: `Imagine you're a farmer in ancient China, looking down at your fields from a hilltop. You see neat squares of land, divided by paths and irrigation channels into equal plots. That's exactly what 田 (tián) shows — a square of land, split into four by a cross. Each section is a different crop, a different season's planting. The character hasn't changed in 3,000 years because the layout of fields hasn't changed. When you write 田, you're drawing a map of farmland, seen from above, exactly as farmers saw it when they first carved this character into bone.`
    },
    source: '《说文解字》："陈也。树谷曰田。" 象形（田畴），参考 chineseetymology.org。',
    components: [ { part: '田', type: 'standalone', meaning: 'field — divided land seen from above' } ],
    example_sentences: [
      { chinese: '他在田里工作。', pinyin: 'Tā zài tián lǐ gōngzuò.', english: 'He works in the field.', difficulty: 'beginner' },
      { chinese: '这片田很大。', pinyin: 'Zhè piàn tián hěn dà.', english: 'This field is very big.', difficulty: 'beginner' },
      { chinese: '农民正在田里种水稻。', pinyin: 'Nóngmín zhèngzài tián lǐ zhòng shuǐdào.', english: 'The farmers are planting rice in the fields.', difficulty: 'intermediate' }
    ],
    memory_hook: 'A square divided into four — farmland seen from the sky!',
    related_characters: [
      { char: '男', pinyin: 'nán', meaning: 'male — strength (力) working in the field (田)' },
      { char: '界', pinyin: 'jiè', meaning: 'boundary — a field (田) marking the edge' },
      { char: '画', pinyin: 'huà', meaning: 'draw/picture — lines within a field boundary' },
      { char: '富', pinyin: 'fù', meaning: 'rich — a full house with fields (田)' }
    ]
  },

  '大': {
    pinyin: 'dà', translation: 'big, large', stroke_count: 3, hsk_level: 1, radical: '大',
    category: 'people', illustration: 'person',
    etymology: {
      oracle_bone: '一个张开双臂站立的人——"看，多大！"',
      bronze: '相似的形体，双臂展开示大。',
      seal_script: '形体更对称，双臂平展。',
      modern: '一横（双臂）压一人形——双臂张开。',
      origin: '象形字，张臂的人表示"大"。'
    },
    story: {
      title: '张开双臂',
      content: `How do you show "big" without words? You spread your arms as wide as they go and say "THIS big!" That's exactly what the ancient Chinese did. The character 大 (dà) is a person — the same 人 we already know — but with arms stretched out to their fullest. The horizontal stroke is those outstretched arms, saying "look at this, it's huge!" It's the universal gesture for "big" that every child around the world instinctively makes. The Chinese just turned it into a character that's lasted 3,000 years.`
    },
    source: '《说文解字》："天大，地大，人亦大。" 象形（张臂人形），参考 字源网。',
    components: [ { part: '大', type: 'standalone', meaning: 'big — a person with arms spread wide' } ],
    example_sentences: [
      { chinese: '这个苹果很大。', pinyin: 'Zhè ge píngguǒ hěn dà.', english: 'This apple is very big.', difficulty: 'beginner' },
      { chinese: '我家有一个大院子。', pinyin: 'Wǒ jiā yǒu yí ge dà yuànzi.', english: 'My house has a big yard.', difficulty: 'beginner' },
      { chinese: '这是一项重大决定。', pinyin: 'Zhè shì yí xiàng zhòngdà juédìng.', english: 'This is a major decision.', difficulty: 'intermediate' }
    ],
    memory_hook: 'A person spreading arms wide — "it\'s THIS big!"',
    related_characters: [
      { char: '天', pinyin: 'tiān', meaning: 'sky — big (大) person above (一)' },
      { char: '太', pinyin: 'tài', meaning: 'too much — big (大) with an extra mark' },
      { char: '夫', pinyin: 'fū', meaning: 'husband — a big (大) person' },
      { char: '美', pinyin: 'měi', meaning: 'beautiful — big (大) sheep (羊)' }
    ]
  },

  // ---------- 新增 14 字 ----------
  '一': {
    pinyin: 'yī', translation: 'one', stroke_count: 1, hsk_level: 1, radical: '一',
    category: 'numbers', illustration: 'one',
    etymology: {
      oracle_bone: '一道横线——最朴素的计数。',
      bronze: '一道横。',
      seal_script: '干净的横笔。',
      modern: '一横。',
      origin: '指事字，以一画表"一"。'
    },
    story: {
      title: '第一道线',
      content: `In ancient China, counting began with a single stroke. One horizontal line — 一 — meant "one." No frills, no decoration. Just the first mark on the bone. Every number after it is built by adding more lines. It is the seed of all mathematics, drawn in a single breath.`
    },
    source: '《说文解字》："惟初太始，道立于一。" 指事，参考 chineseetymology.org。',
    components: [ { part: '一', type: 'standalone', meaning: 'one — a single horizontal stroke' } ],
    example_sentences: [
      { chinese: '一个苹果。', pinyin: 'Yí ge píngguǒ.', english: 'One apple.', difficulty: 'beginner' },
      { chinese: '第一天。', pinyin: 'Dì-yī tiān.', english: 'The first day.', difficulty: 'beginner' },
      { chinese: '他一心一意地工作。', pinyin: 'Tā yìxīnyíyì de gōngzuò.', english: 'He works with single-hearted devotion.', difficulty: 'intermediate' }
    ],
    memory_hook: 'One line, one count — the start of everything!',
    related_characters: [
      { char: '二', pinyin: 'èr', meaning: 'two — one line more' },
      { char: '三', pinyin: 'sān', meaning: 'three — three lines' },
      { char: '十', pinyin: 'shí', meaning: 'ten — a vertical across one' },
      { char: '上', pinyin: 'shàng', meaning: 'up — a mark above the line' }
    ]
  },

  '二': {
    pinyin: 'èr', translation: 'two', stroke_count: 2, hsk_level: 1, radical: '二',
    category: 'numbers', illustration: 'two',
    etymology: {
      oracle_bone: '上下两道横线。',
      bronze: '两横。',
      seal_script: '两横，上短下长或相等。',
      modern: '两横。',
      origin: '指事字，以两画表"二"。'
    },
    story: {
      title: '两道线',
      content: `Two lines, one stacked on the other — that's two. 二. The ancient scribes simply added a second stroke below the first. Some say the upper line is heaven and the lower is earth. Either way, it is counting made visible, one stroke at a time.`
    },
    source: '《说文解字》："地之数也。" 指事，参考 字源网。',
    components: [ { part: '二', type: 'standalone', meaning: 'two — two horizontal strokes' } ],
    example_sentences: [
      { chinese: '二月。', pinyin: 'Èr yuè.', english: 'February / the second month.', difficulty: 'beginner' },
      { chinese: '二手手机。', pinyin: 'Èrshǒu shǒujī.', english: 'Second-hand phone.', difficulty: 'beginner' },
      { chinese: '他三心二意。', pinyin: 'Tā sānxīn-èryì.', english: 'He is of two minds.', difficulty: 'intermediate' }
    ],
    memory_hook: 'One line, then another — that\'s two!',
    related_characters: [
      { char: '一', pinyin: 'yī', meaning: 'one' },
      { char: '三', pinyin: 'sān', meaning: 'three' },
      { char: '仁', pinyin: 'rén', meaning: 'benevolence — person (亻) + two (二)' }
    ]
  },

  '三': {
    pinyin: 'sān', translation: 'three', stroke_count: 3, hsk_level: 1, radical: '三',
    category: 'numbers', illustration: 'three',
    etymology: {
      oracle_bone: '三道横线。',
      bronze: '三横。',
      seal_script: '三横。',
      modern: '三横。',
      origin: '指事字，以三画表"三"；古亦表"多"。'
    },
    story: {
      title: '三道线',
      content: `Three lines — 三 — "three." One, two, three: the scribes stacked strokes to count. Three also meant "many" in old Chinese, because beyond three, things grew countless. So 三 is both a number and a stand-in for "a lot."`
    },
    source: '《说文解字》："天地人之道也。" 指事，参考 chineseetymology.org。',
    components: [ { part: '三', type: 'standalone', meaning: 'three — three horizontal strokes' } ],
    example_sentences: [
      { chinese: '三岁。', pinyin: 'Sān suì.', english: 'Three years old.', difficulty: 'beginner' },
      { chinese: '三个月。', pinyin: 'Sān ge yuè.', english: 'Three months.', difficulty: 'beginner' },
      { chinese: '做事要三思而行。', pinyin: 'Zuòshì yào sānsī-érxíng.', english: 'Think thrice before you act.', difficulty: 'intermediate' }
    ],
    memory_hook: 'One, two, three — and "three" meant "many"!',
    related_characters: [
      { char: '一', pinyin: 'yī', meaning: 'one' },
      { char: '二', pinyin: 'èr', meaning: 'two' },
      { char: '森', pinyin: 'sēn', meaning: 'forest — three trees' },
      { char: '众', pinyin: 'zhòng', meaning: 'crowd — three people' }
    ]
  },

  '中': {
    pinyin: 'zhōng', translation: 'middle, center', stroke_count: 4, hsk_level: 1, radical: '丨',
    category: 'concept', illustration: 'middle',
    etymology: {
      oracle_bone: '旗杆穿于方框中央——靶心之象。',
      bronze: '方框中一竖。',
      seal_script: '方框中竖，上下出头。',
      modern: '扁口框中一竖。',
      origin: '指事字，以竖穿框表"中央"。'
    },
    story: {
      title: '正中靶心',
      content: `Picture an ancient target — a square frame with a vertical pole straight through its heart. 中 means "middle," "center." The pole hits dead center, the bullseye. To be 中 is to be right in the middle of things, perfectly placed.`
    },
    source: '甲骨文象旗旌贯于☲中，引伸为"中央"，参考 字源网。',
    components: [ { part: '中', type: 'standalone', meaning: 'middle — a pole through the center' } ],
    example_sentences: [
      { chinese: '中国。', pinyin: 'Zhōngguó.', english: 'China (the middle kingdom).', difficulty: 'beginner' },
      { chinese: '中间。', pinyin: 'zhōngjiān.', english: 'the middle.', difficulty: 'beginner' },
      { chinese: '中午吃午饭。', pinyin: 'Zhōngwǔ chī wǔfàn.', english: 'Eat lunch at noon.', difficulty: 'beginner' }
    ],
    memory_hook: 'A pole straight through the center — bullseye!',
    related_characters: [
      { char: '种', pinyin: 'zhǒng', meaning: 'seed — middle (中) + plant (禾)' },
      { char: '钟', pinyin: 'zhōng', meaning: 'bell/clock — metal (钅) + middle (中)' },
      { char: '忠', pinyin: 'zhōng', meaning: 'loyal — heart (心) + middle (中)' }
    ]
  },

  '心': {
    pinyin: 'xīn', translation: 'heart', stroke_count: 4, hsk_level: 1, radical: '心',
    category: 'body', illustration: 'heart',
    etymology: {
      oracle_bone: '带心室的心脏形状。',
      bronze: '心形更明显。',
      seal_script: '心形，下有三钩。',
      modern: '卧心形，下三点。',
      origin: '象形字，描摹心脏。'
    },
    story: {
      title: '会感受的心',
      content: `Look at 心 — those three little dips at the bottom? They're the heart's chambers, drawn thousands of years ago. The ancient Chinese saw the heart as the seat of feeling and thought, not just a pump. Every time you feel something deeply, you are using 心.`
    },
    source: '《说文解字》："人心，土藏也。" 象形，参考 chineseetymology.org。',
    components: [ { part: '心', type: 'standalone', meaning: 'heart — the seat of feeling' } ],
    example_sentences: [
      { chinese: '我很开心。', pinyin: 'Wǒ hěn kāixīn.', english: 'I am very happy.', difficulty: 'beginner' },
      { chinese: '小心！', pinyin: 'Xiǎoxīn!', english: 'Be careful!', difficulty: 'beginner' },
      { chinese: '他的心情很好。', pinyin: 'Tā de xīnqíng hěn hǎo.', english: 'He is in a good mood.', difficulty: 'beginner' }
    ],
    memory_hook: 'Three little chambers at the bottom — that\'s a heart!',
    related_characters: [
      { char: '想', pinyin: 'xiǎng', meaning: 'think — appearance (相) + heart (心)' },
      { char: '思', pinyin: 'sī', meaning: 'ponder — field (田) + heart (心)' },
      { char: '怕', pinyin: 'pà', meaning: 'fear — heart (忄) + white (白)' },
      { char: '念', pinyin: 'niàn', meaning: 'miss — now (今) + heart (心)' }
    ]
  },

  '手': {
    pinyin: 'shǒu', translation: 'hand', stroke_count: 4, hsk_level: 1, radical: '手',
    category: 'body', illustration: 'hand',
    etymology: {
      oracle_bone: '五指张开的手掌。',
      bronze: '手形。',
      seal_script: '腕下展指。',
      modern: '上展指、下为腕。',
      origin: '象形字，描摹手。'
    },
    story: {
      title: '能做事的手',
      content: `手 is a hand — a wrist at the bottom, fingers spreading at the top. The ancient drawn hand reached, grabbed, made, built. It is one of the most useful characters: with hands we do everything, from writing 人 to planting 木.`
    },
    source: '《说文解字》："手，拳也。" 象形，参考 字源网。',
    components: [ { part: '手', type: 'standalone', meaning: 'hand — wrist with spreading fingers' } ],
    example_sentences: [
      { chinese: '手机。', pinyin: 'Shǒujī.', english: 'Mobile phone (hand machine).', difficulty: 'beginner' },
      { chinese: '洗手。', pinyin: 'Xǐ shǒu.', english: 'Wash hands.', difficulty: 'beginner' },
      { chinese: '手心出汗。', pinyin: 'Shǒuxīn chū hàn.', english: 'Palms are sweating.', difficulty: 'intermediate' }
    ],
    memory_hook: 'Wrist down, fingers up — that\'s a hand!',
    related_characters: [
      { char: '拿', pinyin: 'ná', meaning: 'hold — hand (手) over (合)' },
      { char: '打', pinyin: 'dǎ', meaning: 'hit — hand (扌) + ding (丁)' },
      { char: '看', pinyin: 'kàn', meaning: 'look — hand (手) over eye (目)' },
      { char: '拜', pinyin: 'bài', meaning: 'bow — two hands (手)' }
    ]
  },

  '目': {
    pinyin: 'mù', translation: 'eye', stroke_count: 5, hsk_level: 1, radical: '目',
    category: 'body', illustration: 'eye',
    etymology: {
      oracle_bone: '横置的眼，中有瞳。',
      bronze: '眼形。',
      seal_script: '竖眼，中有瞳。',
      modern: '方框中两横，象眼眶与瞳。',
      origin: '象形字，描摹眼睛。'
    },
    story: {
      title: '会看的眼',
      content: `目 is an eye. The ancient form looks just like an almond eye with its pupil in the center. Turn it sideways and you'll see it. Eyes watch, read, cry — 目 is in every character about seeing.`
    },
    source: '《说文解字》："人眼也。" 象形，参考 chineseetymology.org。',
    components: [ { part: '目', type: 'standalone', meaning: 'eye — an almond shape with a pupil' } ],
    example_sentences: [
      { chinese: '目光。', pinyin: 'Mùguāng.', english: 'Gaze / look.', difficulty: 'beginner' },
      { chinese: '节目。', pinyin: 'Jiémù.', english: 'Program / show.', difficulty: 'beginner' },
      { chinese: '他的目标很明确。', pinyin: 'Tā de mùbiāo hěn míngquè.', english: 'His goal is clear.', difficulty: 'intermediate' }
    ],
    memory_hook: 'An almond eye with a pupil — that\'s 目!',
    related_characters: [
      { char: '看', pinyin: 'kàn', meaning: 'look — hand (手) over eye (目)' },
      { char: '眼', pinyin: 'yǎn', meaning: 'eye — eye (目) + edge (艮)' },
      { char: '睡', pinyin: 'shuì', meaning: 'sleep — eye (目) + fall (垂)' },
      { char: '盲', pinyin: 'máng', meaning: 'blind — eye (目) +亡' }
    ]
  },

  '小': {
    pinyin: 'xiǎo', translation: 'small', stroke_count: 3, hsk_level: 1, radical: '小',
    category: 'concept', illustration: 'small',
    etymology: {
      oracle_bone: '中竖带两点，如微粒。',
      bronze: '小形。',
      seal_script: '中竖，左右点。',
      modern: '中竖，左右两点。',
      origin: '指事字，以三点表"微小"。'
    },
    story: {
      title: '微小的点',
      content: `小 shows three little marks — a center stroke with two dots on the sides, like grains of sand or specks of dust. That's "small." The tiniest things, scattered, easy to miss — yet they make up the world.`
    },
    source: '《说文解字》："物之微也。" 指事，参考 字源网。',
    components: [ { part: '小', type: 'standalone', meaning: 'small — specks of dust' } ],
    example_sentences: [
      { chinese: '小猫。', pinyin: 'Xiǎo māo.', english: 'Little cat.', difficulty: 'beginner' },
      { chinese: '小学。', pinyin: 'Xiǎoxué.', english: 'Primary school.', difficulty: 'beginner' },
      { chinese: '小心台阶。', pinyin: 'Xiǎoxīn táijiē.', english: 'Mind the step.', difficulty: 'beginner' }
    ],
    memory_hook: 'Tiny specks on each side — that\'s small!',
    related_characters: [
      { char: '少', pinyin: 'shǎo', meaning: 'few — small (小) + a slash' },
      { char: '尖', pinyin: 'jiān', meaning: 'sharp — small (小) over big (大)' },
      { char: '尘', pinyin: 'chén', meaning: 'dust — small (小) + earth (土)' }
    ]
  },

  '女': {
    pinyin: 'nǚ', translation: 'woman', stroke_count: 3, hsk_level: 1, radical: '女',
    category: 'people', illustration: 'woman',
    etymology: {
      oracle_bone: '双臂交叠跪坐的人形。',
      bronze: '交臂人形。',
      seal_script: '交臂形。',
      modern: '撇点、撇、横。',
      origin: '象形字，描摹交臂端坐的女子。'
    },
    story: {
      title: '端坐的女子',
      content: `女 shows a person with arms folded across the body, a humble, graceful posture. In ancient China this was how a woman was often depicted — composed and dignified. The character carries thousands of years of culture in its curves.`
    },
    source: '《说文解字》："妇人也。" 象形，参考 chineseetymology.org。',
    components: [ { part: '女', type: 'standalone', meaning: 'woman — arms folded, seated gracefully' } ],
    example_sentences: [
      { chinese: '女孩。', pinyin: 'Nǚhái.', english: 'Girl.', difficulty: 'beginner' },
      { chinese: '女儿。', pinyin: 'Nǚ\'er.', english: 'Daughter.', difficulty: 'beginner' },
      { chinese: '她是个女人。', pinyin: 'Tā shì ge nǚrén.', english: 'She is a woman.', difficulty: 'beginner' }
    ],
    memory_hook: 'Arms folded, seated with grace — that\'s 女!',
    related_characters: [
      { char: '妈', pinyin: 'mā', meaning: 'mother — woman (女) + horse (马)' },
      { char: '好', pinyin: 'hǎo', meaning: 'good — woman (女) + child (子)' },
      { char: '她', pinyin: 'tā', meaning: 'she — woman (女) + 也' },
      { char: '妹', pinyin: 'mèi', meaning: 'younger sister — woman (女) + 未' }
    ]
  },

  '子': {
    pinyin: 'zǐ', translation: 'child, son', stroke_count: 3, hsk_level: 1, radical: '子',
    category: 'people', illustration: 'child',
    etymology: {
      oracle_bone: '襁褓中的婴儿——大头、小臂、包身。',
      bronze: '婴儿形。',
      seal_script: '大头小子形。',
      modern: '横撇、竖钩、横。',
      origin: '象形字，描摹包裹的婴儿。'
    },
    story: {
      title: '包裹的婴儿',
      content: `子 is a baby — a big head, little arms, wrapped snug. The ancient drawing captured a child bundled in cloth. "Son," "child," "seed" — 子 is where life continues, the next generation written in a single soft shape.`
    },
    source: '《说文解字》："十一月，阳气动，万物滋。" 象形，参考 字源网。',
    components: [ { part: '子', type: 'standalone', meaning: 'child — a swaddled baby' } ],
    example_sentences: [
      { chinese: '孩子。', pinyin: 'Háizi.', english: 'Child.', difficulty: 'beginner' },
      { chinese: '儿子。', pinyin: 'Érzi.', english: 'Son.', difficulty: 'beginner' },
      { chinese: '桌子上有一本书。', pinyin: 'Zhuōzi shàng yǒu yì běn shū.', english: 'There is a book on the table.', difficulty: 'beginner' }
    ],
    memory_hook: 'Big head, tiny arms, wrapped up — that\'s a baby!',
    related_characters: [
      { char: '字', pinyin: 'zì', meaning: 'character — roof (宀) + child (子)' },
      { char: '学', pinyin: 'xué', meaning: 'study — child (子) under a roof' },
      { char: '好', pinyin: 'hǎo', meaning: 'good — woman (女) + child (子)' },
      { char: '孩', pinyin: 'hái', meaning: 'child — child (子) + 亥' }
    ]
  },

  '天': {
    pinyin: 'tiān', translation: 'sky, heaven', stroke_count: 4, hsk_level: 1, radical: '大',
    category: 'nature', illustration: 'sky',
    etymology: {
      oracle_bone: '人形头顶一横，表天覆盖。',
      bronze: '人上加横。',
      seal_script: '人形，上横。',
      modern: '一大上加一横。',
      origin: '指事字，以一横在人上表"天"。'
    },
    story: {
      title: '头顶的天空',
      content: `天 is a person with a line drawn above the head — that line is the sky, the heavens. Stand tall (大) and the sky covers you. The ancient Chinese saw 天 as the vast power above all people, the dome that shelters the world.`
    },
    source: '《说文解字》："颠也。至高无上。" 指事，参考 chineseetymology.org。',
    components: [ { part: '天', type: 'compound', meaning: 'big (大) + a line above = sky' } ],
    example_sentences: [
      { chinese: '天气。', pinyin: 'Tiānqì.', english: 'Weather.', difficulty: 'beginner' },
      { chinese: '天空。', pinyin: 'Tiānkōng.', english: 'Sky.', difficulty: 'beginner' },
      { chinese: '今天星期一。', pinyin: 'Jīntiān xīngqīyī.', english: 'Today is Monday.', difficulty: 'beginner' }
    ],
    memory_hook: 'A person with a line overhead — that\'s the sky!',
    related_characters: [
      { char: '大', pinyin: 'dà', meaning: 'big — the base of 天' },
      { char: '夫', pinyin: 'fū', meaning: 'husband — big (大) + a mark' },
      { char: '太', pinyin: 'tài', meaning: 'too — big (大) + a dot' },
      { char: '笑', pinyin: 'xiào', meaning: 'smile — bamboo (竹) + 夭' }
    ]
  },

  '土': {
    pinyin: 'tǔ', translation: 'earth, soil', stroke_count: 3, hsk_level: 1, radical: '土',
    category: 'nature', illustration: 'earth',
    etymology: {
      oracle_bone: '地上一垛土——横为地，竖为隆起。',
      bronze: '土堆形。',
      seal_script: '上横、竖、下横。',
      modern: '上横、竖、下横。',
      origin: '象形字，描摹土堆。'
    },
    story: {
      title: '隆起的土堆',
      content: `土 is a heap of earth — a horizontal ground line with a stroke rising up from it, like a small hill of soil. The farmer's world: solid ground beneath everything we build and grow.`
    },
    source: '《说文解字》："地之吐生物者也。" 象形，参考 字源网。',
    components: [ { part: '土', type: 'standalone', meaning: 'earth — a mound rising from the ground' } ],
    example_sentences: [
      { chinese: '土地。', pinyin: 'Tǔdì.', english: 'Land / soil.', difficulty: 'beginner' },
      { chinese: '土豆。', pinyin: 'Tǔdòu.', english: 'Potato.', difficulty: 'beginner' },
      { chinese: '泥土很湿。', pinyin: 'Nítǔ hěn shī.', english: 'The mud is wet.', difficulty: 'beginner' }
    ],
    memory_hook: 'A mound rising from the ground line — that\'s earth!',
    related_characters: [
      { char: '地', pinyin: 'dì', meaning: 'ground — earth (土) + also (也)' },
      { char: '坐', pinyin: 'zuò', meaning: 'sit — two (人) on earth (土)' },
      { char: '里', pinyin: 'lǐ', meaning: 'inside — field (田) + earth (土)' },
      { char: '尘', pinyin: 'chén', meaning: 'dust — small (小) + earth (土)' }
    ]
  },

  '雨': {
    pinyin: 'yǔ', translation: 'rain', stroke_count: 8, hsk_level: 1, radical: '雨',
    category: 'nature', illustration: 'rain',
    etymology: {
      oracle_bone: '顶横为天，下四点象雨滴。',
      bronze: '天幕垂雨。',
      seal_script: '雨字头，内点。',
      modern: '横、竖、横折钩，内四点。',
      origin: '象形字，描摹天落雨滴。'
    },
    story: {
      title: '从天而落的雨',
      content: `雨 shows the sky (the top stroke) with little droplets falling beneath it. The ancient drew rain exactly as we see it — lines of water dropping from above. Look up next time it pours; you're seeing 雨.`
    },
    source: '《说文解字》："水从云下也。" 象形，参考 chineseetymology.org。',
    components: [ { part: '雨', type: 'standalone', meaning: 'rain — water dropping from the sky' } ],
    example_sentences: [
      { chinese: '下雨。', pinyin: 'Xià yǔ.', english: 'It rains.', difficulty: 'beginner' },
      { chinese: '雨天。', pinyin: 'Yǔtiān.', english: 'Rainy day.', difficulty: 'beginner' },
      { chinese: '别忘了带雨伞。', pinyin: 'Bié wàngle dài yǔsǎn.', english: 'Don\'t forget your umbrella.', difficulty: 'beginner' }
    ],
    memory_hook: 'Drops falling under the sky — that\'s rain!',
    related_characters: [
      { char: '雪', pinyin: 'xuě', meaning: 'snow — rain (雨) + 彐' },
      { char: '云', pinyin: 'yún', meaning: 'cloud — where rain comes from' },
      { char: '雷', pinyin: 'léi', meaning: 'thunder — rain (雨) + 田' },
      { char: '电', pinyin: 'diàn', meaning: 'lightning — rain (雨) + 电' }
    ]
  },

  '马': {
    pinyin: 'mǎ', translation: 'horse', stroke_count: 3, hsk_level: 1, radical: '马',
    category: 'nature', illustration: 'horse',
    etymology: {
      oracle_bone: '有鬃、身、四腿的马的象形。',
      bronze: '马形，鬃尾分明。',
      seal_script: '马形，笔画化。',
      modern: '横折、竖折钩、横。',
      origin: '象形字，描摹奔马。'
    },
    story: {
      title: '奔跑的马',
      content: `马 is a horse — originally a lively drawing with a mane, body, and legs. Over time it was simplified to a neat character with a flowing top, but the spirit of the running horse remains. The horse carried China: in war, in trade, in travel.`
    },
    source: '《说文解字》："怒也。武也。" 象形，参考 字源网。',
    components: [ { part: '马', type: 'standalone', meaning: 'horse — a running steed' } ],
    example_sentences: [
      { chinese: '马车。', pinyin: 'Mǎchē.', english: 'Horse cart.', difficulty: 'beginner' },
      { chinese: '马上。', pinyin: 'Mǎshàng.', english: 'Immediately (on horseback).', difficulty: 'beginner' },
      { chinese: '一匹白马。', pinyin: 'Yì pǐ bái mǎ.', english: 'A white horse.', difficulty: 'beginner' }
    ],
    memory_hook: 'A flowing mane on top — that\'s a horse!',
    related_characters: [
      { char: '妈', pinyin: 'mā', meaning: 'mother — woman (女) + horse (马)' },
      { char: '骑', pinyin: 'qí', meaning: 'ride — horse (马) + 奇' },
      { char: '驴', pinyin: 'lǘ', meaning: 'donkey — horse (马) + 户' },
      { char: '骄', pinyin: 'jiāo', meaning: 'proud — horse (马) + 乔' }
    ]
  }

};

// 分类标签（用于筛选）
const CATEGORIES = {
  all: 'All 全部',
  nature: 'Nature 自然',
  people: 'People 人物',
  body: 'Body 身体',
  numbers: 'Numbers 数字',
  concept: 'Ideas 抽象'
};
