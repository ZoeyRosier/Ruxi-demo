/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
 * 数据
 * ============================================================ */
const DRAMAS = [
  {
    id: 'santi',
    title: '三体',
    enTitle: 'TRINISOLAN',
    container: '三体游戏拓展协议',
    nodeCount: 8,
    cover:
      'radial-gradient(ellipse at 25% 35%, rgba(80,180,120,.32), transparent 55%),' +
      'radial-gradient(ellipse at 80% 75%, rgba(120,90,170,.28), transparent 60%),' +
      'linear-gradient(140deg,#0a0f12 0%, #0e1418 60%, #14101c 100%)',
    isDemo: true,
  },
  {
    id: 'changxiangsi',
    title: '长相思',
    enTitle: 'EVERLASTING',
    container: '游魂幻梦协议',
    nodeCount: 6,
    cover:
      'radial-gradient(ellipse at 70% 30%, rgba(200,190,225,.20), transparent 55%),' +
      'radial-gradient(ellipse at 30% 80%, rgba(140,120,170,.22), transparent 60%),' +
      'linear-gradient(160deg,#0d0b14 0%, #16121f 60%, #0e0c16 100%)',
  },
  {
    id: 'qingyunian',
    title: '庆余年',
    enTitle: 'JOY OF LIFE',
    container: '鉴查院密档',
    nodeCount: 7,
    cover:
      'radial-gradient(ellipse at 30% 65%, rgba(170,80,75,.22), transparent 55%),' +
      'radial-gradient(ellipse at 80% 30%, rgba(180,150,100,.14), transparent 60%),' +
      'linear-gradient(160deg,#120c0a 0%, #1c1410 60%, #0f0a08 100%)',
  },
  {
    id: 'fanhua',
    title: '繁花',
    enTitle: 'BLOSSOMS',
    container: '黄河路记忆碎片',
    nodeCount: 5,
    cover:
      'radial-gradient(ellipse at 75% 60%, rgba(200,110,140,.22), transparent 55%),' +
      'radial-gradient(ellipse at 25% 30%, rgba(180,140,100,.16), transparent 60%),' +
      'linear-gradient(160deg,#120a10 0%, #1a0f18 60%, #0e080d 100%)',
  },
];

/* ============================================================
 * 一次性打字机
 * ============================================================ */
function useTypewriterOnce(text, speed = 60, startDelay = 0) {
  const [out, setOut] = useState('');
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    let interval;
    const startTimer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length && interval) window.clearInterval(interval);
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return out;
}

/* ============================================================
 * 主组件
 * ============================================================ */
function RuxiHomePage() {
  const slogan = useTypewriterOnce('让你不再是观众,而是故事里的人。', 75, 900);
  const [hoverId, setHoverId] = useState(null);
  const dateStr = useRef(formatDate(new Date())).current;

  return (
    <div
      className="ruxi-root min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-zh-sans)',
      }}
    >
      <StyleTokens />
      <NoiseLayer />

      {/* 顶栏 */}
      <header
        className="relative z-10 flex items-center justify-between"
        style={{ padding: '28px 64px 0' }}
      >
        <div className="flex items-baseline gap-4 ruxi-fade-in" style={{ animationDelay: '0ms' }}>
          <h1
            style={{
              fontFamily: 'var(--font-zh-serif)',
              fontWeight: 900,
              fontSize: 32,
              letterSpacing: '0.18em',
              background: 'linear-gradient(180deg,#F2F2F2 0%, #E8E8E8 60%, #A89DC8 130%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
            }}
          >
            入&nbsp;戏
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-en)',
              fontSize: 11,
              letterSpacing: '0.32em',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
            }}
          >
            Step Into Drama
          </span>
        </div>

        <button
          className="ruxi-fade-in ruxi-mark-btn"
          style={{ animationDelay: '600ms' }}
          aria-label="我的印记"
        >
          <span className="ruxi-mark-glyph" aria-hidden>◇</span>
          <span className="ruxi-mark-label">我的印记</span>
          <span className="ruxi-mark-count">00</span>
        </button>
      </header>

      {/* Hero */}
      <section
        className="relative z-10"
        style={{ padding: '120px 64px 60px', maxWidth: 1440, margin: '0 auto' }}
      >
        <div
          className="ruxi-fade-in"
          style={{
            animationDelay: '300ms',
            fontFamily: 'var(--font-en)',
            fontSize: 11,
            letterSpacing: '0.4em',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: 32,
            opacity: 0.85,
          }}
        >
          ◇  RUXI / IMMERSIVE NARRATIVE / 2026
        </div>

        <p
          style={{
            fontFamily: 'var(--font-zh-sans)',
            fontWeight: 300,
            fontSize: 30,
            lineHeight: 1.6,
            letterSpacing: '0.06em',
            color: 'var(--color-text-primary)',
            maxWidth: 820,
            minHeight: 56,
          }}
        >
          {slogan}
          <span className="ruxi-caret" aria-hidden />
        </p>

        <div
          className="ruxi-fade-in"
          style={{
            animationDelay: '1800ms',
            marginTop: 56,
            display: 'flex',
            gap: 48,
            fontFamily: 'var(--font-en)',
            fontSize: 11,
            letterSpacing: '0.22em',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>
            <span style={{ color: '#7FB89A' }}>● </span>ARCHIVE&nbsp;&nbsp;ONLINE
          </span>
          <span>4 DRAMAS · 26 NODES</span>
          <span style={{ marginLeft: 'auto' }}>{dateStr}</span>
        </div>
      </section>

      {/* 剧目网格 */}
      <section
        className="relative z-10"
        style={{ padding: '20px 64px 100px', maxWidth: 1440, margin: '0 auto' }}
      >
        <div
          className="ruxi-fade-in flex items-baseline justify-between"
          style={{
            animationDelay: '2000ms',
            paddingBottom: 16,
            marginBottom: 28,
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.32em',
              color: 'var(--color-text-secondary)',
            }}
          >
            当 前 在 库 / DRAMAS
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-en)',
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.18em',
            }}
          >
            FILTER: ALL · SORT: FEATURED
          </span>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 20,
          }}
        >
          {DRAMAS.map((d, i) => (
            <DramaCard
              key={d.id}
              drama={d}
              index={i}
              span={d.isDemo ? 6 : 2}
              hovered={hoverId === d.id}
              onHover={setHoverId}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 ruxi-fade-in"
        style={{
          animationDelay: '2400ms',
          padding: '32px 64px 40px',
          maxWidth: 1440,
          margin: '0 auto',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-en)',
          fontSize: 11,
          letterSpacing: '0.22em',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>© 2026 RUXI · ARCHIVE</span>
        <span>BRAND LAYER · v0.4</span>
        <span>made with ◇</span>
      </footer>
    </div>
  );
}

/* ============================================================
 * 剧目卡片
 * ============================================================ */
function DramaCard({ drama, index, span, hovered, onHover }) {
  const isDemo = !!drama.isDemo;

  return (
    <article
      onMouseEnter={() => onHover(drama.id)}
      onMouseLeave={() => onHover(null)}
      className="ruxi-card ruxi-fade-up"
      style={{
        gridColumn: `span ${span}`,
        animationDelay: `${1200 + index * 120}ms`,
        cursor: 'pointer',
        background: 'var(--color-bg-card)',
        border:
          hovered && isDemo
            ? '1px solid var(--color-accent)'
            : '1px solid var(--color-border)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow:
          hovered && isDemo
            ? '0 12px 40px -12px rgba(139,127,184,0.35), 0 0 0 1px rgba(139,127,184,0.15) inset'
            : '0 4px 16px -8px rgba(0,0,0,0.4)',
        transition:
          'transform 0.4s cubic-bezier(.2,.7,.2,1), border-color 0.3s, box-shadow 0.4s',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: isDemo ? 320 : 220,
          background: drama.cover,
          position: 'relative',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 18,
            fontFamily: 'var(--font-en)',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'rgba(232,232,232,0.55)',
          }}
        >
          NO. 0{index + 1}
        </div>

        {isDemo && (
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 18,
              padding: '4px 10px',
              fontFamily: 'var(--font-en)',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: '#F4F4F4',
              background: '#B8413E',
              fontWeight: 600,
            }}
          >
            DEMO
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            fontFamily: 'var(--font-zh-serif)',
            fontSize: isDemo ? 56 : 40,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.08)',
            letterSpacing: '0.15em',
            lineHeight: 1,
          }}
        >
          {drama.title}
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(135deg, transparent 0, transparent 14px, rgba(255,255,255,0.012) 14px, rgba(255,255,255,0.012) 15px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          padding: isDemo ? '24px 24px 22px' : '20px 20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-zh-serif)',
              fontSize: isDemo ? 26 : 20,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '0.06em',
              marginBottom: 4,
              lineHeight: 1.2,
            }}
          >
            《{drama.title}》
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-en)',
              fontSize: 10,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.28em',
            }}
          >
            {drama.enTitle}
          </p>
        </div>

        <p
          style={{
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
          }}
        >
          {drama.container}
        </p>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 14,
            borderTop: '1px dashed var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-en)',
              fontSize: 11,
              color:
                hovered && isDemo
                  ? 'var(--color-accent)'
                  : 'var(--color-text-secondary)',
              letterSpacing: '0.18em',
              transition: 'color 0.3s',
            }}
          >
            ✦ {drama.nodeCount} 个介入节点
          </span>
          <span
            style={{
              fontSize: 16,
              color: hovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              transition: 'transform 0.3s, color 0.3s',
            }}
          >
            →
          </span>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
 * 噪点纹理层
 * ============================================================ */
function NoiseLayer() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.06,
        mixBlendMode: 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
      }}
    />
  );
}

/* ============================================================
 * 全局 token + keyframes
 * ============================================================ */
function StyleTokens() {
  return (
    <style>{`
      :root {
        --color-bg-primary:    #0A0A0F;
        --color-bg-card:       #1A1A1F;
        --color-text-primary:  #E8E8E8;
        --color-text-secondary:#6B7280;
        --color-accent:        #8B7FB8;
        --color-border:        rgba(232,232,232,0.08);

        --font-zh-serif: 'Source Han Serif SC','Noto Serif SC','Songti SC','SimSun',serif;
        --font-zh-sans:  'Source Han Sans SC','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;
        --font-en:       'Inter','SF Mono','JetBrains Mono',ui-monospace,monospace;
      }

      @keyframes ruxi-fade-in {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes ruxi-fade-up {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .ruxi-fade-in {
        opacity: 0;
        animation: ruxi-fade-in 1s cubic-bezier(.2,.7,.2,1) forwards;
      }
      .ruxi-fade-up {
        opacity: 0;
        animation: ruxi-fade-up 0.9s cubic-bezier(.2,.7,.2,1) forwards;
      }

      .ruxi-caret {
        display: inline-block;
        width: 2px;
        height: 26px;
        margin-left: 4px;
        vertical-align: middle;
        background: var(--color-accent);
        animation: ruxi-blink 1s steps(1) infinite;
      }
      @keyframes ruxi-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      .ruxi-mark-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text-secondary);
        font-family: var(--font-en);
        font-size: 11px;
        letter-spacing: 0.22em;
        cursor: pointer;
        transition: border-color 0.3s, color 0.3s, background 0.3s;
        opacity: 0;
        animation: ruxi-fade-in 1s cubic-bezier(.2,.7,.2,1) forwards;
      }
      .ruxi-mark-btn:hover {
        border-color: var(--color-accent);
        color: var(--color-text-primary);
        background: rgba(139,127,184,0.06);
      }
      .ruxi-mark-glyph {
        font-size: 14px;
        color: var(--color-accent);
      }
      .ruxi-mark-label {
        font-family: var(--font-zh-sans);
        letter-spacing: 0.24em;
      }
      .ruxi-mark-count {
        font-family: var(--font-en);
        padding: 2px 8px;
        border-left: 1px solid var(--color-border);
        margin-left: 4px;
        color: var(--color-text-primary);
      }

      .ruxi-card { will-change: transform; }
    `}</style>
  );
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

window.RuxiHomePage = RuxiHomePage;
