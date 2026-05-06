/* global React, useTypewriter, BrandHeader, DRAMA_THEMES */
const { useState: useStateB, useEffect: useEffectB, useMemo: useMemoB } = React;

// =========================================
// PAGE 1: Home (drama selection) — 100% brand layer
// =========================================
function HomePage({ onSelectDrama, onNav }) {
  const [slogan] = useTypewriter('让你不再是观众,而是故事里的人。', 70, 800);
  const [sub] = useTypewriter('RUXI · 互动叙事平台 · 内测 v0.4', 30, 3500);

  const dramas = Object.values(DRAMA_THEMES);

  return (
    <div style={{minHeight:'100vh', position:'relative', overflow:'auto'}} className="page-fade-in tex-grain">
      <BrandHeader current="home" onNav={onNav} />

      {/* HERO */}
      <section style={{
        padding: '160px 80px 80px',
        maxWidth: 1440, margin: '0 auto',
        position:'relative'
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.4em',
          color: 'var(--brand-accent)',
          textTransform: 'uppercase',
          marginBottom: 28,
          opacity: 0.85
        }}>
          ◇  RUXI / IMMERSIVE NARRATIVE / 2026
        </div>

        <h1 style={{
          fontFamily: 'var(--font-zh-serif)',
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.05,
          letterSpacing: '0.08em',
          marginBottom: 32,
          background: 'linear-gradient(180deg, #F5F5F5 0%, #E8E8E8 70%, #8B7FB8 130%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          入&nbsp;&nbsp;戏
        </h1>

        <p style={{
          fontSize: 22,
          fontWeight: 300,
          color: 'var(--brand-text)',
          letterSpacing: '0.05em',
          lineHeight: 1.7,
          maxWidth: 720,
          marginBottom: 16,
          minHeight: 38
        }}>
          {slogan}<span style={{
            display: 'inline-block', width: 2, height: 24, background: 'var(--brand-accent)',
            marginLeft: 4, verticalAlign: 'middle',
            animation: 'blink 1s steps(1) infinite'
          }}/>
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--brand-text-mute)',
          letterSpacing: '0.2em',
          minHeight: 18
        }}>{sub}</p>

        {/* small status row */}
        <div style={{
          marginTop: 56,
          display: 'flex', gap: 48,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--brand-text-mute)'
        }}>
          <span><span style={{color:'var(--brand-success)'}}>● </span>ARCHIVE  ONLINE</span>
          <span>4 DRAMAS · 26 NODES</span>
          <span>YOUR MARKS · 03</span>
          <span style={{marginLeft:'auto', color:'var(--brand-text-soft)'}}>2026.04.27</span>
        </div>
      </section>

      {/* DRAMA GRID */}
      <section style={{
        padding: '40px 80px 120px',
        maxWidth: 1440, margin: '0 auto'
      }}>
        <div style={{
          display:'flex', alignItems:'baseline', justifyContent:'space-between',
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: '1px solid var(--brand-border)'
        }}>
          <h2 style={{
            fontSize: 14, fontWeight: 500, letterSpacing: '0.3em',
            color: 'var(--brand-text-soft)'
          }}>当 前 在 库 / DRAMAS</h2>
          <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--brand-text-mute)', letterSpacing:'0.15em'}}>
            FILTER: ALL  ·  SORT: FEATURED
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24
        }}>
          {dramas.map((d, i) => (
            <DramaCard key={d.id} drama={d} index={i} featured={i===0} onSelect={() => onSelectDrama(d.id)} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '40px 80px',
        borderTop: '1px solid var(--brand-border)',
        display:'flex', justifyContent:'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: 11, letterSpacing:'0.2em',
        color:'var(--brand-text-mute)',
        maxWidth: 1440, margin:'0 auto'
      }}>
        <span>© 2026 RUXI ARCHIVE</span>
        <span>双 层 视 觉 架 构 · BRAND × THEME</span>
        <span>made with ◇</span>
      </footer>
    </div>
  );
}

// =========================================
// Drama card (brand-layer chrome + theme accent)
// =========================================
function DramaCard({ drama, index, featured, onSelect }) {
  return (
    <div className="brand-card"
      onClick={onSelect}
      style={{
        gridColumn: featured ? 'span 2' : 'span 1',
        cursor: 'pointer',
        animation: `fadeUp .8s ${index * 120}ms both cubic-bezier(.2,.7,.2,1)`,
        overflow: 'hidden',
        display:'flex', flexDirection:'column'
      }}>
      {/* cover (theme-tinted) */}
      <div style={{
        height: featured ? 320 : 220,
        background: drama.coverGradient,
        position:'relative',
        overflow:'hidden',
        borderBottom: '1px solid var(--brand-border)'
      }}>
        {/* drama-specific decorative */}
        <DramaCardDecor drama={drama} />

        {/* index number */}
        <div style={{
          position:'absolute', top:14, left:18,
          fontFamily:'var(--font-mono)', fontSize:11,
          letterSpacing:'0.2em',
          color:'rgba(255,255,255,.55)'
        }}>
          NO. 0{index+1}
        </div>
        {featured && (
          <div style={{
            position:'absolute', top:14, right:18,
            fontFamily:'var(--font-mono)', fontSize:10,
            padding:'4px 10px',
            border: `1px solid ${drama.palette.primary}`,
            color: drama.palette.primary,
            letterSpacing:'0.25em',
            background: 'rgba(0,0,0,.4)'
          }}>
            ◆ FEATURED
          </div>
        )}
      </div>

      {/* meta — all brand layer */}
      <div style={{padding: '24px 22px', display:'flex', flexDirection:'column', gap:12, flex:1}}>
        <div>
          <h3 style={{
            fontFamily:'var(--font-zh-serif)',
            fontSize: featured ? 26 : 22, fontWeight: 700,
            color:'var(--brand-text)',
            letterSpacing:'0.04em',
            marginBottom: 4
          }}>{drama.name}</h3>
          <p style={{
            fontSize: 12, color:'var(--brand-text-mute)',
            fontFamily:'var(--font-mono)', letterSpacing:'0.18em'
          }}>{drama.enName}</p>
        </div>

        <p style={{
          fontSize: 13, color:'var(--brand-text-soft)',
          letterSpacing:'0.05em', lineHeight:1.6
        }}>
          {drama.container}
        </p>

        <div style={{
          marginTop:'auto', paddingTop: 14,
          borderTop: '1px dashed var(--brand-border)',
          display:'flex', alignItems:'center', justifyContent:'space-between'
        }}>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:11,
            color: 'var(--brand-accent)',
            letterSpacing:'0.18em'
          }}>
            ✦ {drama.nodeCount} 个介入节点
          </span>
          <span style={{
            fontSize: 18,
            color: drama.palette.primary,
            transition: 'transform .3s'
          }}>→</span>
        </div>
      </div>
    </div>
  );
}

function DramaCardDecor({ drama }) {
  if (drama.id === 'santi') {
    return (
      <>
        <div style={{
          position:'absolute', inset:0,
          background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(57,255,20,.06) 2px, rgba(57,255,20,.06) 3px)'
        }}/>
        <div style={{
          position:'absolute', bottom:32, left:32,
          fontFamily:'var(--font-mono)', fontSize:10,
          color: drama.palette.primary, opacity:.7,
          letterSpacing:'0.2em'
        }}>
          1379 RX_ ▮<br/>
          <span style={{color:drama.palette.accent}}>FREQ 18.45MHz</span>
        </div>
        <div style={{
          position:'absolute', top:'40%', right:'15%',
          width: 80, height: 80,
          border: `1px solid ${drama.palette.primary}`,
          transform:'rotate(45deg)',
          opacity: 0.4,
          boxShadow: `0 0 24px ${drama.palette.primary}40`
        }}/>
      </>
    );
  }
  if (drama.id === 'changxiangsi') {
    return (
      <>
        <div style={{
          position:'absolute', inset:0,
          background: 'radial-gradient(circle at 70% 30%, rgba(232,224,245,.15), transparent 40%)'
        }}/>
        <div style={{
          position:'absolute', bottom:32, left:32,
          fontFamily:'var(--font-zh-serif)', fontSize:14,
          color: drama.palette.primary, opacity:.85,
          letterSpacing:'0.3em', writingMode:'vertical-rl'
        }}>
          月落清水 · 玉山旧梦
        </div>
      </>
    );
  }
  if (drama.id === 'qingyunian') {
    return (
      <>
        <div style={{
          position:'absolute', inset:0,
          background: 'radial-gradient(circle at 30% 70%, rgba(193,63,62,.18), transparent 50%)'
        }}/>
        <div style={{
          position:'absolute', bottom:28, left:28,
          fontFamily:'var(--font-zh-serif)', fontSize:13,
          color: drama.palette.primary, opacity:.85,
          letterSpacing:'0.3em'
        }}>
          鉴 查 院 · 密
        </div>
        <div style={{
          position:'absolute', top:'30%', right:'20%',
          width: 60, height: 60,
          border: `2px solid ${drama.palette.primary}`,
          background: 'rgba(193,63,62,.15)',
          transform:'rotate(8deg)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--font-zh-serif)', fontSize:24,
          fontWeight: 900,
          color: drama.palette.primary
        }}>密</div>
      </>
    );
  }
  // fanhua
  return (
    <>
      <div style={{
        position:'absolute', inset:0,
        background: 'radial-gradient(circle at 80% 60%, rgba(255,107,157,.22), transparent 45%)'
      }}/>
      <div style={{
        position:'absolute', bottom:30, left:28,
        fontFamily:'var(--font-zh-serif)', fontSize:13,
        color: drama.palette.primary, opacity:.85,
        letterSpacing:'0.3em',
        textShadow: `0 0 12px ${drama.palette.primary}`
      }}>
        黄河路 · 1993
      </div>
      <div style={{
        position:'absolute', top:'30%', right:'15%',
        fontFamily:'var(--font-zh-serif)', fontSize:32,
        fontWeight: 700,
        color: drama.palette.primary, opacity:.55,
        textShadow: `0 0 18px ${drama.palette.primary}`,
        letterSpacing:'0.2em'
      }}>繁花</div>
    </>
  );
}

Object.assign(window, { HomePage });
