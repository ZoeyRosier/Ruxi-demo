/* global React, ThemeHeader, useTypewriter, useCountUp, Particles */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

// =========================================
// Compose / message page (核心交互)
// =========================================
function ComposePage({ theme, onSend, onExit }) {
  const [text, setText] = useStateC('');
  const [sending, setSending] = useStateC(false);
  const max = 280;
  const placeholder = {
    santi: '> 输入跨越光年的讯息...',
    changxiangsi: '在玉简上写下心意...',
    qingyunian: '在密信上落笔...',
    fanhua: '对着留言机说一句话...'
  }[theme.id];

  const recipient = theme.metaphors.target;

  const handleSend = () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setTimeout(() => onSend(text), 1400);
  };

  return (
    <div style={{
      position:'relative', width:'100vw', height:'100vh',
      background: theme.palette.bg, overflow:'hidden',
      color:'#fff'
    }} className="tex-grain">
      <ThemeHeader theme={theme} onExit={onExit} label={`${theme.metaphors.cipher} · 介入终端`} />

      {theme.id==='santi' && (
        <div style={{
          position:'absolute', inset:0,
          background:'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.04) 3px, rgba(57,255,20,.04) 4px)',
          animation:'scanmove 6s linear infinite',
          pointerEvents:'none'
        }}/>
      )}

      {/* warning */}
      <div style={{
        position:'absolute', top: 70, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        padding: '10px 24px',
        border: `1px solid ${theme.palette.accent}`,
        background: 'rgba(0,0,0,.5)',
        fontFamily: 'var(--font-mono)', fontSize:11,
        color: theme.palette.accent, letterSpacing:'0.3em',
        textShadow: `0 0 8px ${theme.palette.accent}`
      }}>
        ⚠  ONE-SHOT  ·  你 只 有 一 次 发 送 机 会
      </div>

      {/* split layout */}
      <div style={{
        position:'absolute', inset:0,
        paddingTop: 130, paddingBottom: 110,
        display:'grid', gridTemplateColumns:'1fr 80px 1fr',
        gap: 0
      }}>
        {/* LEFT — sender terminal */}
        <div style={{
          margin: '0 0 0 32px',
          border: `1px solid ${theme.palette.primary}`,
          background: 'rgba(0,0,0,.55)',
          boxShadow: `inset 0 0 40px ${theme.palette.primary}15, 0 0 30px ${theme.palette.primary}25`,
          display:'flex', flexDirection:'column'
        }}>
          {/* term header */}
          <div style={{
            padding:'12px 18px',
            borderBottom: `1px solid ${theme.palette.primary}55`,
            fontFamily:'var(--font-mono)', fontSize:11,
            color: theme.palette.primary, letterSpacing:'0.2em',
            display:'flex', justifyContent:'space-between'
          }}>
            <span>SENDER · {theme.metaphors.identity}</span>
            <span>{theme.id==='santi'?'TX 18.45 MHz':'OUTBOUND'}</span>
          </div>
          {/* compose area */}
          <div style={{flex:1, padding:'24px 22px', display:'flex', flexDirection:'column'}}>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:11,
              color: theme.palette.primary, letterSpacing:'0.2em',
              marginBottom: 14, opacity: 0.7
            }}>
              &gt; {new Date().toISOString().slice(0,19)} · CONNECTING TO {recipient.toUpperCase()}...
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, max))}
              placeholder={placeholder}
              disabled={sending}
              style={{
                flex:1, width:'100%',
                background:'transparent',
                color: theme.palette.primary,
                fontFamily: theme.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
                fontSize: theme.id==='santi'?15:18,
                lineHeight: 1.8,
                letterSpacing:'0.05em',
                resize: 'none',
                textShadow: `0 0 6px ${theme.palette.primary}80`
              }}
            />
            <div style={{
              marginTop: 14,
              display:'flex', justifyContent:'space-between',
              fontFamily:'var(--font-mono)', fontSize:11,
              color:'rgba(255,255,255,.4)', letterSpacing:'0.15em'
            }}>
              <span style={{color: theme.palette.primary, opacity:.7}}>
                ▮ INPUT_ACTIVE
              </span>
              <span>{text.length} / {max}</span>
            </div>
          </div>
        </div>

        {/* MIDDLE — data flow */}
        <div style={{
          position:'relative',
          display:'flex', alignItems:'center', justifyContent:'center'
        }}>
          <DataFlow theme={theme} active={text.length > 0} />
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%, -50%) rotate(-90deg)',
            fontFamily:'var(--font-mono)', fontSize:9,
            color: theme.palette.secondary,
            letterSpacing:'0.4em',
            whiteSpace:'nowrap', opacity:.7
          }}>
            {theme.id==='santi'?'1.27 LIGHT YEARS':'寄  ·  渡  ·  达'}
          </div>
        </div>

        {/* RIGHT — recipient view */}
        <div style={{
          margin: '0 32px 0 0',
          border: `1px solid ${theme.palette.accent}`,
          background: 'rgba(0,0,0,.55)',
          boxShadow: `inset 0 0 40px ${theme.palette.accent}15`,
          display:'flex', flexDirection:'column',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{
            padding:'12px 18px',
            borderBottom: `1px solid ${theme.palette.accent}55`,
            fontFamily:'var(--font-mono)', fontSize:11,
            color: theme.palette.accent, letterSpacing:'0.2em',
            display:'flex', justifyContent:'space-between'
          }}>
            <span>RECEIVER · {recipient.toUpperCase()}</span>
            <span>{theme.id==='santi'?'红岸基地':theme.metaphors.location}</span>
          </div>
          <div style={{flex:1, position:'relative'}}>
            <div style={{
              position:'absolute', inset:0,
              background: theme.coverGradient,
              opacity:.5
            }}/>
            <div style={{
              position:'absolute', inset:0,
              padding: 24,
              display:'flex', flexDirection:'column', justifyContent:'flex-end',
              fontFamily: theme.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
              color: theme.palette.accent,
              fontSize: theme.id==='santi'?14:16,
              lineHeight: 1.8
            }}>
              {/* live mirror */}
              {text && (
                <div style={{
                  padding:'14px 18px',
                  background:'rgba(0,0,0,.65)',
                  border: `1px solid ${theme.palette.accent}55`,
                  borderRadius: 2,
                  textShadow: `0 0 6px ${theme.palette.accent}60`,
                  whiteSpace:'pre-wrap',
                  animation:'fadeUp .3s'
                }}>
                  {text}
                  <span style={{
                    display:'inline-block', width:8, height:14,
                    background: theme.palette.accent,
                    marginLeft: 4,
                    animation:'blink 1s steps(1) infinite'
                  }}/>
                </div>
              )}
              {!text && (
                <div style={{
                  fontFamily:'var(--font-mono)', fontSize:11,
                  color:'rgba(255,255,255,.4)', letterSpacing:'0.2em',
                  textAlign:'center', padding: 30
                }}>
                  · · ·  WAITING FOR SIGNAL  · · ·
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* bottom send bar */}
      <div style={{
        position:'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 32px',
        borderTop: `1px solid ${theme.palette.primary}33`,
        background: 'rgba(0,0,0,.5)',
        display:'flex', alignItems:'center', justifyContent:'space-between'
      }}>
        <div style={{
          fontFamily:'var(--font-mono)', fontSize:11,
          color:'rgba(255,255,255,.5)', letterSpacing:'0.18em',
          display:'flex', gap:24
        }}>
          <span><span style={{color:theme.palette.primary}}>●</span> CHANNEL OPEN</span>
          <span>ENCRYPTION: {theme.metaphors.cipher}</span>
          <span>LATENCY: 0.0042s</span>
        </div>
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="btn btn-theme"
          style={{
            padding: '14px 36px', fontSize: 13,
            opacity: !text.trim() || sending ? 0.4 : 1,
            cursor: !text.trim() || sending ? 'not-allowed' : 'pointer'
          }}>
          {sending ? '◇ TRANSMITTING ...' : '▶ 发送 / TRANSMIT'}
        </button>
      </div>
    </div>
  );
}

function DataFlow({ theme, active }) {
  return (
    <div style={{
      width: '100%', height: '60%',
      position: 'relative', overflow:'hidden'
    }}>
      <div style={{
        position:'absolute', top:'50%', left:0, right:0, height:1,
        background: `linear-gradient(90deg, transparent, ${theme.palette.primary}, ${theme.palette.accent}, transparent)`,
        opacity: active ? 0.8 : 0.25,
        transition:'opacity .3s'
      }}/>
      {active && Array.from({length: 12}).map((_, i) => (
        <div key={i} style={{
          position:'absolute', top: '50%', left: 0,
          width: 4, height: 4, borderRadius:'50%',
          background: i%2 ? theme.palette.primary : theme.palette.secondary,
          boxShadow: `0 0 8px ${i%2 ? theme.palette.primary : theme.palette.secondary}`,
          animation: `flowRight ${1.2 + (i%4)*0.3}s ${i*0.15}s linear infinite`,
          transform: 'translateY(-50%)'
        }}/>
      ))}
    </div>
  );
}

// =========================================
// AI SCORING PAGE
// =========================================
function ScorePage({ theme, message, onContinue, onExit }) {
  const [phase, setPhase] = useStateC(0);
  const total = 82;
  const score = useCountUp(total, 1500, phase >= 1);
  const dimensions = [
    { key: '情感共鸣', val: 88 },
    { key: '历史克制', val: 76 },
    { key: '叙事韵脚', val: 81 },
    { key: '介入克制', val: 83 }
  ];
  const [reasoning] = useTypewriter(
    '她的母亲在文革中被打死。你提到了她童年记忆里那只逃走的鸟——这击中了她最深处的犹豫。她的手指在发送键上停留了 4.2 秒。',
    25, 2200
  );

  useEffectC(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 4500);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:'relative', width:'100vw', height:'100vh',
      background: theme.palette.bg, overflow:'auto',
      color:'#fff'
    }} className="tex-grain">
      <ThemeHeader theme={theme} onExit={onExit} label="AI 评分 · 影响力解析" />

      {theme.id==='santi' && (
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.03) 3px, rgba(57,255,20,.03) 4px)'
        }}/>
      )}

      <div style={{
        maxWidth: 1300, margin:'0 auto',
        padding: '120px 60px 80px',
        display:'grid', gridTemplateColumns:'1.1fr 1fr', gap: 60
      }}>
        {/* LEFT — radar */}
        <div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:11,
            letterSpacing:'0.3em', color: theme.palette.accent,
            marginBottom: 24
          }}>◆ INFLUENCE / 4D ANALYSIS</div>

          <RadarChart dims={dimensions} theme={theme} active={phase>=1} />

          <div style={{marginTop: 40, display:'flex', alignItems:'baseline', gap:24}}>
            <div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:11,
                color:'rgba(255,255,255,.5)', letterSpacing:'0.2em', marginBottom:6
              }}>TOTAL · 影响力</div>
              <div style={{
                fontFamily:'var(--font-display)',
                fontSize: 96, fontWeight:900,
                color: theme.palette.primary,
                textShadow: `0 0 28px ${theme.palette.primary}aa`,
                lineHeight: 1, letterSpacing:'0.05em'
              }}>{score}</div>
            </div>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:12,
              color: theme.palette.accent,
              letterSpacing:'0.15em',
              padding:'6px 14px',
              border:`1px solid ${theme.palette.accent}`,
              opacity: phase>=2 ? 1 : 0,
              transition:'opacity .5s'
            }}>RANK · S</div>
          </div>
        </div>

        {/* RIGHT — reasoning + msg */}
        <div>
          <div style={{
            padding: 22,
            border: `1px solid ${theme.palette.primary}55`,
            background: 'rgba(0,0,0,.4)',
            marginBottom: 28
          }}>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:10,
              letterSpacing:'0.3em', color: theme.palette.primary,
              marginBottom: 12
            }}>YOUR MESSAGE</div>
            <div style={{
              fontSize: 15, lineHeight: 1.8,
              color:'rgba(255,255,255,.92)',
              fontFamily: theme.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
              whiteSpace:'pre-wrap'
            }}>{message || '——'}</div>
          </div>

          <div style={{
            fontFamily:'var(--font-mono)', fontSize:11,
            letterSpacing:'0.3em', color: theme.palette.accent, marginBottom:14
          }}>◇ AI REASONING</div>
          <div style={{
            padding: 22,
            border: `1px dashed ${theme.palette.accent}66`,
            background: `${theme.palette.accent}08`,
            fontSize: 14, lineHeight: 1.9,
            color:'rgba(255,255,255,.85)',
            minHeight: 140,
            fontFamily: theme.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
            marginBottom: 30
          }}>{reasoning}<span className="cursor-blink"/></div>

          <div style={{
            fontFamily:'var(--font-mono)', fontSize:11,
            color: theme.palette.primary, letterSpacing:'0.2em',
            marginBottom: 18, opacity: phase>=3 ? 1 : 0,
            transition:'opacity .5s'
          }}>● {theme.metaphors.target} 正在阅读 ...</div>

          <button onClick={onContinue} className="btn btn-theme" style={{
            padding:'16px 32px', fontSize:13,
            opacity: phase>=3 ? 1 : 0.4
          }}>查 看 她 的 反 应  ▶</button>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ dims, theme, active }) {
  const size = 360;
  const c = size/2;
  const r = 130;
  const n = dims.length;
  const points = dims.map((d, i) => {
    const angle = -Math.PI/2 + (i * 2*Math.PI/n);
    const ratio = active ? d.val/100 : 0;
    return [c + Math.cos(angle)*r*ratio, c + Math.sin(angle)*r*ratio];
  });
  const labels = dims.map((d, i) => {
    const angle = -Math.PI/2 + (i * 2*Math.PI/n);
    return [c + Math.cos(angle)*(r+30), c + Math.sin(angle)*(r+30)];
  });
  const grid = [0.25, 0.5, 0.75, 1].map(g => {
    const pts = dims.map((_, i) => {
      const angle = -Math.PI/2 + (i * 2*Math.PI/n);
      return [c + Math.cos(angle)*r*g, c + Math.sin(angle)*r*g].join(',');
    }).join(' ');
    return pts;
  });

  return (
    <svg width={size} height={size} style={{transition:'all 1.2s'}}>
      {/* grid (brand layer) */}
      {grid.map((g, i) => (
        <polygon key={i} points={g} fill="none"
          stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      ))}
      {/* axes */}
      {dims.map((_, i) => {
        const angle = -Math.PI/2 + (i * 2*Math.PI/n);
        return <line key={i}
          x1={c} y1={c}
          x2={c + Math.cos(angle)*r} y2={c + Math.sin(angle)*r}
          stroke="rgba(255,255,255,.1)" strokeWidth="1" />;
      })}
      {/* fill */}
      <polygon
        points={points.map(p => p.join(',')).join(' ')}
        fill={`${theme.palette.primary}33`}
        stroke={theme.palette.primary}
        strokeWidth="2"
        style={{
          filter: `drop-shadow(0 0 12px ${theme.palette.primary})`,
          transition: 'all 1.4s cubic-bezier(.2,.7,.2,1)'
        }}
      />
      {/* dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4"
          fill={theme.palette.primary}
          style={{filter: `drop-shadow(0 0 6px ${theme.palette.primary})`}}/>
      ))}
      {/* labels */}
      {labels.map((p, i) => (
        <g key={i}>
          <text x={p[0]} y={p[1]}
            fontFamily="var(--font-mono)"
            fontSize="11" letterSpacing="0.15em"
            fill="rgba(255,255,255,.85)"
            textAnchor="middle" dominantBaseline="middle">
            {dims[i].key}
          </text>
          <text x={p[0]} y={p[1]+16}
            fontFamily="var(--font-display)"
            fontSize="13" fontWeight="700"
            fill={theme.palette.primary}
            textAnchor="middle" dominantBaseline="middle"
            style={{filter:`drop-shadow(0 0 4px ${theme.palette.primary})`}}>
            {active ? dims[i].val : 0}
          </text>
        </g>
      ))}
    </svg>
  );
}

// =========================================
// BRANCH VIDEO PAGE
// =========================================
function BranchPage({ theme, onArchive, onExit }) {
  const [phase, setPhase] = useStateC(0);
  const lines = theme.id==='santi' ? [
    '她没有按下发送键。',
    '人类还有时间。',
    '— 你拯救了一个时间线。'
  ] : theme.id==='changxiangsi' ? [
    '她抬头看了眼月亮。',
    '心头的那块石,落了。',
    '— 这一念,你替她说了。'
  ] : theme.id==='qingyunian' ? [
    '密信被烧毁。',
    '风暴未起。',
    '— 一段史,因你改写。'
  ] : [
    '她笑了一下,挂了电话。',
    '雨停了。',
    '— 一夜,被你重写。'
  ];

  useEffectC(() => {
    const ts = lines.map((_, i) => setTimeout(() => setPhase(i+1), 2000 + i*1500));
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:'relative', width:'100vw', height:'100vh',
      background:'#000', overflow:'hidden',
      color:'#fff', display:'flex', flexDirection:'column'
    }}>
      <ThemeHeader theme={theme} onExit={onExit} label="分支结局 · ENDING" />

      {/* video placeholder */}
      <div style={{flex:1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{
          position:'absolute', inset:0,
          background: theme.coverGradient
        }}/>
        {theme.id==='santi' && (
          <div style={{
            position:'absolute', inset:0,
            background:'repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(57,255,20,.05) 3px, rgba(57,255,20,.05) 4px)',
            animation:'scanmove 4s linear infinite'
          }}/>
        )}
        <div style={{
          position:'relative', zIndex:5,
          width:'min(820px, 70vw)', aspectRatio:'16/9',
          border:`1px solid ${theme.palette.primary}55`,
          background:'rgba(0,0,0,.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexDirection:'column', gap:18,
          fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.2em',
          color: theme.palette.primary
        }}>
          <div style={{fontSize:13}}>◇ 分 支 视 频  /  BRANCH CLIP</div>
          <div style={{fontSize:10, opacity:.6}}>5s · {theme.metaphors.target.toUpperCase()} · CLOSE-UP</div>
          <div style={{
            width:50, height:50, borderRadius:'50%',
            border:`1px solid ${theme.palette.primary}`,
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>▶</div>
        </div>
      </div>

      {/* ending text */}
      <div style={{
        padding:'40px 60px 60px',
        textAlign:'center'
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{
            fontFamily: theme.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
            fontSize: i===2 ? 18 : 26,
            color: i===2 ? theme.palette.accent : theme.palette.primary,
            letterSpacing:'0.15em',
            marginBottom: 14,
            opacity: phase > i ? 1 : 0,
            transform: phase > i ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s',
            textShadow: `0 0 14px ${(i===2?theme.palette.accent:theme.palette.primary)}80`
          }}>{l}</div>
        ))}
        <button onClick={onArchive} className="btn btn-theme-outline" style={{
          marginTop: 30, padding:'14px 36px',
          opacity: phase >= lines.length ? 1 : 0,
          transition:'opacity .8s'
        }}>◇ 查 看 我 的 印 记 / VIEW MARK</button>
      </div>
    </div>
  );
}

Object.assign(window, { ComposePage, ScorePage, BranchPage });
