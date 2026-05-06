/* global React, BrandHeader, DRAMA_THEMES */
const { useState: useStateA } = React;

function ArchivePage({ onNav, onReplay }) {
  const [filter, setFilter] = useStateA('all');
  const records = [
    { id: 3, dramaId: 'santi', date: '2026.04.27', node: '叶文洁·发送键', score: 82, ending: '拯救', msg: '她已经太久没有想起母亲了。那只逃走的鸟,还在你身上。', highlight: true },
    { id: 2, dramaId: 'changxiangsi', date: '2026.04.21', node: '玉山·分别', score: 71, ending: '寄思', msg: '不必送了。我会记得这条路。' },
    { id: 1, dramaId: 'qingyunian', date: '2026.04.14', node: '一处·密信', score: 64, ending: '改写', msg: '此事再议。三日内不得动手。' }
  ];
  const filtered = filter==='all' ? records : records.filter(r => r.dramaId===filter);

  return (
    <div className="page-fade-in tex-grain" style={{minHeight:'100vh', overflow:'auto', position:'relative'}}>
      <BrandHeader current="archive" onNav={onNav} />

      <section style={{maxWidth: 1280, margin:'0 auto', padding:'140px 60px 40px'}}>
        <div style={{
          fontFamily:'var(--font-mono)', fontSize:11,
          letterSpacing:'0.4em', color:'var(--brand-accent)', marginBottom: 18
        }}>◇ MY MARKS · 印记档案室</div>
        <h1 style={{
          fontFamily:'var(--font-zh-serif)', fontSize: 56, fontWeight:900,
          letterSpacing:'0.08em', color:'var(--brand-text)',
          marginBottom: 20
        }}>我 的 印 记</h1>
        <p style={{fontSize:15, color:'var(--brand-text-soft)', maxWidth: 620, lineHeight:1.7}}>
          每一次你按下的发送键,都在这里留下一道光。跨越剧目,跨越时间。
        </p>

        {/* stat row */}
        <div style={{
          marginTop: 40, display:'grid', gridTemplateColumns:'repeat(4, 1fr)',
          gap: 0, borderTop:'1px solid var(--brand-border)',
          borderBottom:'1px solid var(--brand-border)'
        }}>
          {[
            ['总介入次数', '03', ''],
            ['最高影响力', '82', '/ 100'],
            ['解锁分支', '02', '/ 8'],
            ['加权排名', '#284', '/ 12,940']
          ].map(([k,v,u], i) => (
            <div key={k} style={{
              padding:'24px 20px',
              borderRight: i<3 ? '1px solid var(--brand-border)' : 'none'
            }}>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:10,
                letterSpacing:'0.25em', color:'var(--brand-text-mute)',
                marginBottom: 10
              }}>{k.toUpperCase()}</div>
              <div style={{
                display:'flex', alignItems:'baseline', gap:6,
                fontFamily:'var(--font-display)', fontWeight:700,
                color:'var(--brand-text)'
              }}>
                <span style={{fontSize: 36}}>{v}</span>
                <span style={{fontSize:13, color:'var(--brand-text-mute)'}}>{u}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{maxWidth: 1280, margin:'0 auto', padding:'10px 60px 100px'}}>
        {/* filter row */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom: 24, paddingBottom: 16,
          borderBottom:'1px solid var(--brand-border)'
        }}>
          <div style={{display:'flex', gap: 18, fontSize:12, fontFamily:'var(--font-mono)', letterSpacing:'0.2em'}}>
            {[['all','全部'], ...Object.values(DRAMA_THEMES).map(d => [d.id, d.name])].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)}
                style={{
                  padding: '6px 12px',
                  color: filter===k ? 'var(--brand-text)' : 'var(--brand-text-mute)',
                  borderBottom: filter===k ? '1px solid var(--brand-text)' : '1px solid transparent'
                }}>{label}</button>
            ))}
          </div>
          <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--brand-text-mute)', letterSpacing:'0.18em'}}>
            {filtered.length} ENTRIES · SORT BY DATE
          </span>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          {filtered.map(rec => {
            const drama = DRAMA_THEMES[rec.dramaId];
            return (
              <div key={rec.id} className="brand-card" style={{
                padding:'24px 28px',
                display:'grid', gridTemplateColumns:'80px 1fr 240px 140px',
                gap: 24, alignItems:'center'
              }}>
                {/* num */}
                <div>
                  <div style={{
                    fontFamily:'var(--font-mono)', fontSize:10,
                    color:'var(--brand-text-mute)', letterSpacing:'0.2em', marginBottom:4
                  }}>MARK</div>
                  <div style={{
                    fontFamily:'var(--font-display)', fontSize:28, fontWeight:900,
                    color:'var(--brand-text)'
                  }}>#{String(rec.id).padStart(3,'0')}</div>
                </div>
                {/* meta */}
                <div>
                  <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
                    <span style={{
                      width:8, height:8, borderRadius:'50%',
                      background: drama.palette.primary,
                      boxShadow:`0 0 8px ${drama.palette.primary}`
                    }}/>
                    <span style={{
                      fontFamily:'var(--font-mono)', fontSize:11,
                      color: drama.palette.primary, letterSpacing:'0.2em'
                    }}>{drama.name.replace(/[《》]/g,'')}</span>
                    <span style={{color:'var(--brand-border-hi)'}}>│</span>
                    <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--brand-text-mute)', letterSpacing:'0.15em'}}>{rec.date}</span>
                    <span style={{color:'var(--brand-border-hi)'}}>│</span>
                    <span style={{fontSize:12, color:'var(--brand-text-soft)'}}>{rec.node}</span>
                  </div>
                  <div style={{
                    fontFamily: drama.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
                    fontSize: 14, color:'var(--brand-text)', lineHeight:1.7,
                    paddingLeft: 14,
                    borderLeft: `2px solid ${drama.palette.primary}55`
                  }}>"{rec.msg}"</div>
                </div>
                {/* mini radar */}
                <div style={{display:'flex', alignItems:'center', gap:14}}>
                  <MiniRadar color={drama.palette.primary} score={rec.score}/>
                  <div>
                    <div style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--brand-text-mute)', letterSpacing:'0.2em', marginBottom:3}}>SCORE</div>
                    <div style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, color:drama.palette.primary, textShadow:`0 0 8px ${drama.palette.primary}55`}}>{rec.score}</div>
                  </div>
                </div>
                {/* end + cta */}
                <div style={{display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end'}}>
                  <span style={{
                    padding:'4px 10px',
                    border:`1px solid ${drama.palette.primary}55`,
                    color: drama.palette.primary,
                    fontFamily:'var(--font-mono)', fontSize:10,
                    letterSpacing:'0.2em'
                  }}>✓ {rec.ending}</span>
                  <button onClick={() => onReplay && onReplay(rec.dramaId)}
                    className="btn btn-ghost" style={{padding:'8px 14px', fontSize:11}}>
                    再次介入 →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: 40,
          padding: '36px',
          border:'1px dashed var(--brand-border-hi)',
          textAlign:'center'
        }}>
          <div style={{fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.3em', color:'var(--brand-text-mute)', marginBottom:8}}>
            ◇ MORE NODES AWAIT
          </div>
          <div style={{fontSize:14, color:'var(--brand-text-soft)'}}>
            还有 21 个介入节点等你介入。
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniRadar({ color, score }) {
  const dims = [score, score-10, score+5, score-3];
  const c = 36, r = 28;
  const pts = dims.map((d, i) => {
    const a = -Math.PI/2 + i*Math.PI/2;
    const ratio = d/100;
    return [c + Math.cos(a)*r*ratio, c + Math.sin(a)*r*ratio].join(',');
  }).join(' ');
  return (
    <svg width="72" height="72">
      <polygon points={`${c},${c-r} ${c+r},${c} ${c},${c+r} ${c-r},${c}`}
        fill="none" stroke="rgba(255,255,255,.1)" />
      <polygon points={pts} fill={`${color}33`} stroke={color} strokeWidth="1.5"
        style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
    </svg>
  );
}

Object.assign(window, { ArchivePage });
