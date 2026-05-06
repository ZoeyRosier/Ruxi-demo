/* global React, ThemeHeader, Particles, useTypewriter, useCountUp */
const { useState: useStateW, useEffect: useEffectW, useRef: useRefW } = React;

// =========================================
// Watch page — full immersion (theme layer)
// =========================================
function WatchPage({ theme, nodeIndex, onTriggerNode, onExit }) {
  const [progress, setProgress] = useStateW(38);
  const [showNodeHint, setShowNodeHint] = useStateW(false);
  const node = theme.nodes[nodeIndex] || theme.nodes[0];

  useEffectW(() => {
    const t = setTimeout(() => setShowNodeHint(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position:'relative', width:'100vw', height:'100vh',
      background: theme.palette.bg, overflow:'hidden'
    }}>
      <ThemeHeader theme={theme} onExit={onExit} label={`${theme.name} · 第03话`} />

      {/* Video placeholder area */}
      <div style={{
        position:'absolute', inset:0,
        background: theme.coverGradient,
        display:'flex', alignItems:'center', justifyContent:'center'
      }}>
        {theme.id === 'santi' && (
          <div style={{
            position:'absolute', inset:0,
            background:'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.04) 3px, rgba(57,255,20,.04) 4px)',
            animation:'scanmove 6s linear infinite'
          }}/>
        )}
        <Particles color={theme.palette.primary} density={40} />

        {/* video placeholder card */}
        <div style={{
          width: 'min(900px, 70vw)', aspectRatio: '16/9',
          border: `1px solid ${theme.palette.primary}55`,
          background: 'rgba(0,0,0,.35)',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexDirection:'column', gap:14,
          fontFamily:'var(--font-mono)', fontSize:11,
          letterSpacing:'0.25em',
          color: theme.palette.primary,
          backdropFilter:'blur(2px)',
          textShadow: `0 0 8px ${theme.palette.primary}`
        }}>
          <div style={{fontSize:14, opacity:.85}}>◇ 剧 集 视 频 占 位</div>
          <div style={{fontSize:11, opacity:.6, letterSpacing:'0.18em'}}>{theme.name} · {node.title}</div>
          <div style={{
            marginTop:14,
            width:60, height:60, borderRadius:'50%',
            border:`1px solid ${theme.palette.primary}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20
          }}>▶</div>
        </div>
      </div>

      {/* node-approaching hint */}
      {showNodeHint && (
        <div style={{
          position:'absolute', top: '50%', right: 40,
          transform: 'translateY(-50%)',
          padding: '14px 20px',
          border: `1px solid ${theme.palette.primary}`,
          background: `${theme.palette.bg}cc`,
          fontFamily:'var(--font-mono)', fontSize:11,
          color: theme.palette.primary,
          letterSpacing:'0.2em',
          animation:'fadeUp .6s both',
          textShadow: `0 0 8px ${theme.palette.primary}`,
          maxWidth: 240
        }}>
          <div style={{marginBottom:6, opacity:.7}}>◆ NODE INCOMING</div>
          <div style={{fontSize:12, color:'#fff', marginBottom:10}}>{node.title}</div>
          <div style={{fontSize:10, opacity:.65}}>触发于 {node.time}</div>
          <button onClick={onTriggerNode} style={{
            marginTop:14, width:'100%',
            padding:'10px',
            background: theme.palette.primary,
            color:'#000',
            fontWeight:700, letterSpacing:'0.2em',
            fontSize:11
          }}>
            立 即 介 入  ▶
          </button>
        </div>
      )}

      {/* Bottom controls */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding: '20px 32px',
        background:'linear-gradient(to top, rgba(0,0,0,.85), transparent)',
        zIndex: 10
      }}>
        {/* timeline */}
        <div style={{position:'relative', height:4, background:'rgba(255,255,255,.12)', marginBottom:14, cursor:'pointer'}}>
          <div style={{
            position:'absolute', left:0, top:0, bottom:0,
            width: progress + '%',
            background: theme.palette.primary,
            boxShadow: `0 0 8px ${theme.palette.primary}`
          }}/>
          {/* node markers */}
          {[18, 38, 62, 84].map((p,i) => (
            <div key={i} style={{
              position:'absolute', left: p+'%', top:'50%',
              transform:'translate(-50%, -50%)',
              width: 10, height: 10,
              background: i===1 ? theme.palette.accent : 'transparent',
              border: `1px solid ${theme.palette.accent}`,
              transform: 'translate(-50%, -50%) rotate(45deg)'
            }}/>
          ))}
        </div>
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          fontFamily:'var(--font-mono)', fontSize:11,
          color:'rgba(255,255,255,.6)', letterSpacing:'0.15em'
        }}>
          <div style={{display:'flex', gap:18, alignItems:'center'}}>
            <button style={{fontSize:18, color:'#fff'}}>❚❚</button>
            <span>23 : 08 / 41 : 22</span>
            <span style={{color: theme.palette.primary}}>● 节点 02 · 即将触发</span>
          </div>
          <div style={{display:'flex', gap:14}}>
            <span>1080P</span><span>·</span><span>1.0×</span><span>·</span><span>⊡</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================
// UI Awakening (节点唤起瞬间) — 仪式感页面
// =========================================
function AwakeningPage({ theme, onAccept }) {
  const [phase, setPhase] = useStateW(0); // 0 glitch, 1 badge, 2 name, 3 task, 4 cta
  const [name] = useTypewriter(theme.metaphors.identity, 80, 1500);
  const [task] = useTypewriter(
    theme.id === 'santi' ? '目标:阻止叶文洁按下发送键。\n你只有一次发送机会。' :
    theme.id === 'changxiangsi' ? '寄语·小夭。\n这一次,你想让她听见什么?' :
    theme.id === 'qingyunian' ? '密件已抵 · 一处。\n你写下的字,将改变一段史。' :
    '至真园·留言机。\n这一夜,你想给她留下什么?',
    50, 3000
  );

  useEffectW(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 3000);
    const t4 = setTimeout(() => setPhase(4), 5000);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:'relative', width:'100vw', height:'100vh',
      background: theme.palette.bg, overflow:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column'
    }} className="tex-grain">
      {/* heavy scanlines */}
      {theme.id==='santi' && (
        <div style={{
          position:'absolute', inset:0,
          background:'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(57,255,20,.08) 2px, rgba(57,255,20,.08) 3px)',
          animation:'scanmove 0.8s linear infinite',
          pointerEvents:'none'
        }}/>
      )}
      <Particles color={theme.palette.primary} density={60} />

      {/* corners HUD */}
      <CornerHUD theme={theme} />

      {/* Glitch flash overlay */}
      {phase < 1 && (
        <div style={{
          position:'absolute', inset:0,
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary}33, transparent)`,
          mixBlendMode:'screen', animation:'glitchOverlay 0.8s'
        }}/>
      )}

      <div style={{
        position:'relative', zIndex: 5,
        textAlign:'center', maxWidth: 720, padding: 40
      }}>
        {/* Badge / sigil */}
        <div style={{
          width:140, height:140, margin:'0 auto 40px',
          opacity: phase>=1 ? 1 : 0,
          transform: phase>=1 ? 'scale(1)' : 'scale(.85)',
          transition: 'all 1s cubic-bezier(.2,.7,.2,1)',
          position:'relative'
        }}>
          <div style={{
            position:'absolute', inset:0,
            border: `1px solid ${theme.palette.primary}`,
            transform:'rotate(45deg)',
            boxShadow: `0 0 30px ${theme.palette.primary}80, inset 0 0 30px ${theme.palette.primary}40`,
            animation: 'pulseBadge 2s ease-in-out infinite'
          }}/>
          <div style={{
            position:'absolute', inset:14,
            border: `1px solid ${theme.palette.primary}66`,
            transform:'rotate(45deg)'
          }}/>
          <div style={{
            position:'absolute', inset:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily: theme.id==='santi'?'var(--font-display)':'var(--font-zh-serif)',
            fontSize: theme.id==='santi'? 28 : 38, fontWeight:900,
            color: theme.palette.primary,
            textShadow: `0 0 14px ${theme.palette.primary}`
          }}>
            {theme.id==='santi'? '1379' : theme.id==='changxiangsi'? '寄' : theme.id==='qingyunian'? '密' : '繁'}
          </div>
        </div>

        {/* Cipher text */}
        <div style={{
          fontFamily:'var(--font-mono)', fontSize:11,
          letterSpacing:'0.4em',
          color: theme.palette.accent,
          marginBottom: 16,
          opacity: phase>=2 ? 1 : 0,
          transition: 'opacity .6s'
        }}>
          ◆ {theme.metaphors.cipher} ◆
        </div>

        {/* identity */}
        <h1 style={{
          fontFamily: theme.id==='santi' ? 'var(--font-mono)' : 'var(--font-zh-serif)',
          fontSize: 48, fontWeight:700,
          color: theme.palette.primary,
          letterSpacing:'0.15em',
          marginBottom: 36,
          textShadow: `0 0 14px ${theme.palette.primary}80`,
          minHeight: 60
        }}>{name}<span style={{
          display:'inline-block', width:3, height:40,
          background: theme.palette.primary,
          marginLeft: 6, verticalAlign:'middle',
          animation: 'blink 1s steps(1) infinite'
        }}/></h1>

        {/* task */}
        <div style={{
          fontSize:18,
          color:'rgba(255,255,255,.85)',
          letterSpacing:'0.08em',
          lineHeight: 2,
          minHeight: 80,
          marginBottom: 56,
          fontFamily: theme.id==='santi' ? 'var(--font-mono)' : 'var(--font-zh-serif)',
          whiteSpace: 'pre-line',
          opacity: phase>=3 ? 1 : 0,
          transition: 'opacity .6s'
        }}>{task}</div>

        {/* CTA */}
        <div style={{
          opacity: phase>=4 ? 1 : 0,
          transform: phase>=4 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all .8s'
        }}>
          <button onClick={onAccept} className="btn btn-theme" style={{
            padding: '18px 48px', fontSize: 13
          }}>
            ◆ 接 受 介 入  /  ACCEPT
          </button>
          <div style={{
            marginTop: 24,
            fontFamily:'var(--font-mono)', fontSize:10,
            letterSpacing:'0.3em',
            color:'rgba(255,255,255,.4)'
          }}>
            ⚠  你 只 有 一 次 介 入 机 会  · ONE-SHOT
          </div>
        </div>
      </div>
    </div>
  );
}

function CornerHUD({ theme }) {
  const c = theme.palette.primary;
  const corner = (style) => (
    <div style={{
      position:'absolute', width:28, height:28,
      border: `1px solid ${c}`, ...style
    }}/>
  );
  return (
    <>
      {corner({top:24, left:24, borderRight:'none', borderBottom:'none'})}
      {corner({top:24, right:24, borderLeft:'none', borderBottom:'none'})}
      {corner({bottom:24, left:24, borderRight:'none', borderTop:'none'})}
      {corner({bottom:24, right:24, borderLeft:'none', borderTop:'none'})}
    </>
  );
}

Object.assign(window, { WatchPage, AwakeningPage });
