// Drama theme configurations - the heart of the dual-layer architecture
window.DRAMA_THEMES = {
  santi: {
    id: 'santi',
    name: '《三体》',
    enName: 'TRINISOLAN',
    container: '三体游戏·拓展协议',
    tagline: '让你不再是观众,而是故事里的人',
    nodeCount: 8,
    palette: {
      primary: '#39FF14',
      accent: '#FFB347',
      secondary: '#00D4FF',
      tertiary: '#9D4EDD',
      bg: '#0D1117',
      bgSoft: '#0F1A14'
    },
    fonts: {
      display: "'Orbitron', monospace",
      mono: "'JetBrains Mono', 'Courier New', monospace"
    },
    metaphors: {
      identity: '三体监听员 1379 号',
      target: '叶文洁',
      location: '红岸基地 · 1971',
      cipher: 'TRINISOLAN-CIPHER-7E2F'
    },
    coverGradient: 'radial-gradient(ellipse at 30% 40%, rgba(57,255,20,.32), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(157,78,221,.35), transparent 60%), linear-gradient(135deg, #050a05 0%, #0a0f1a 60%, #1a0a1f 100%)',
    textures: ['scanlines', 'grain', 'glow'],
    transitionEnter: 'glitch',
    nodes: [
      { id: 'n1', time: '12:34', title: '叶文洁初次回应外星信号', desc: '1971·齐家屯,她按下了发送键。' },
      { id: 'n2', time: '23:08', title: '红岸接收外星警告', desc: '"不要回答!"——监听员的第一封信。' },
      { id: 'n3', time: '41:22', title: '智子封锁基础物理', desc: '人类科学的死刑宣判。' }
    ]
  },
  changxiangsi: {
    id: 'changxiangsi',
    name: '《长相思》',
    enName: 'EVERLASTING',
    container: '游魂幻梦·寄思协议',
    tagline: '一念千年,一字寄情',
    nodeCount: 6,
    palette: {
      primary: '#E8E0F5',
      accent: '#9B8BB5',
      secondary: '#C9B8E8',
      tertiary: '#7A6B95',
      bg: '#13101C',
      bgSoft: '#1A1528'
    },
    fonts: {
      display: "'Noto Serif SC', serif",
      mono: "'Noto Serif SC', serif"
    },
    metaphors: {
      identity: '玉山旧识·过路人',
      target: '小夭',
      location: '清水镇 · 玉山',
      cipher: '玉简·寄·壹'
    },
    coverGradient: 'radial-gradient(ellipse at 30% 40%, rgba(232,224,245,.18), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(155,139,181,.28), transparent 60%), linear-gradient(160deg, #0a0814 0%, #1a1228 50%, #0d0a18 100%)',
    textures: ['mist', 'ink'],
    transitionEnter: 'ink',
    nodes: [
      { id: 'n1', time: '08:14', title: '清水镇·初遇', desc: '小夭蹲在药铺前,你恰巧路过。' },
      { id: 'n2', time: '22:40', title: '相柳现身', desc: '九头妖神的真身只属于一个人。' }
    ]
  },
  qingyunian: {
    id: 'qingyunian',
    name: '《庆余年》',
    enName: 'JOY OF LIFE',
    container: '鉴查院·密档介入',
    tagline: '一封密信,一段历史',
    nodeCount: 7,
    palette: {
      primary: '#C13F3E',
      accent: '#8B6F47',
      secondary: '#E5C97D',
      tertiary: '#3A2418',
      bg: '#1A0F0A',
      bgSoft: '#241612'
    },
    fonts: {
      display: "'Noto Serif SC', serif",
      mono: "'Noto Serif SC', serif"
    },
    metaphors: {
      identity: '鉴查院·一处密探',
      target: '范闲',
      location: '京都 · 鉴查院',
      cipher: '密令·壹'
    },
    coverGradient: 'radial-gradient(ellipse at 30% 40%, rgba(193,63,62,.30), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(229,201,125,.18), transparent 60%), linear-gradient(160deg, #0a0604 0%, #2a1108 50%, #1a0a06 100%)',
    textures: ['paper', 'seal'],
    transitionEnter: 'scroll',
    nodes: [
      { id: 'n1', time: '15:20', title: '范闲初入京都', desc: '一封密信,改变命运的起点。' },
      { id: 'n2', time: '38:55', title: '陈萍萍的局', desc: '鉴查院的真正主人浮出水面。' }
    ]
  },
  fanhua: {
    id: 'fanhua',
    name: '《繁花》',
    enName: 'BLOSSOMS',
    container: '黄河路·记忆碎片',
    tagline: '一场旧梦,一段留言',
    nodeCount: 5,
    palette: {
      primary: '#FF6B9D',
      accent: '#D4A574',
      secondary: '#7DD3D8',
      tertiary: '#5A2E4A',
      bg: '#0F0814',
      bgSoft: '#1A0E1F'
    },
    fonts: {
      display: "'Noto Serif SC', serif",
      mono: "'JetBrains Mono', monospace"
    },
    metaphors: {
      identity: '黄河路常客',
      target: '汪小姐',
      location: '上海 · 1993',
      cipher: 'BLOSSOMS-93'
    },
    coverGradient: 'radial-gradient(ellipse at 30% 40%, rgba(255,107,157,.32), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(212,165,116,.22), transparent 60%), linear-gradient(160deg, #0a050a 0%, #2a0e1f 50%, #14081a 100%)',
    textures: ['neon', 'rain'],
    transitionEnter: 'neon',
    nodes: [
      { id: 'n1', time: '10:42', title: '至真园的霓虹', desc: '汪小姐推门而入,雨夜灯红。' },
      { id: 'n2', time: '29:18', title: '夜东京的转折', desc: '一通电话,改变两个人的人生。' }
    ]
  }
};
