/* global React, BrandHeader, DRAMA_THEMES, useTypewriter */

function DetailPage({ dramaId, onBack, onEnter, onNav }) {
  const drama = DRAMA_THEMES[dramaId];
  const [introTxt] = useTypewriter(drama.tagline, 50, 400);

  return (
    <div className="page-fade-in tex-grain" style={{minHeight:'100vh', overflow:'auto', position:'relative'}}>
      <BrandHeader current="home" onNav={onNav} />

      {/* Banner — 30% theme layer */}
      <section style={{
        position:'relative',
        height: 520,
        background: drama.coverGradient,
        marginTop: 64,
        overflow:'hidden',
        borderBottom: `1px solid ${drama.palette.primary}33`
      }}>
        {drama.id === 'santi' && (
          <div style={{
            position:'absolute', inset:0,
            background:'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(57,255,20,.05) 2px, rgba(57,255,20,.05) 3px)'
          }}/>
        )}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'0 80px 60px',
          maxWidth: 1440, margin:'0 auto',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between'
        }}>
          <div style={{maxWidth: 720}}>
            <div style={{
              fontFamily:'var(--font-mono)', fontSize:11,
              letterSpacing:'0.3em', color: drama.palette.primary,
              textShadow: `0 0 10px ${drama.palette.primary}`,
              marginBottom: 18
            }}>
              ◆ {drama.container.toUpperCase()}
            </div>
            <h1 style={{
              fontFamily:'var(--font-zh-serif)', fontSize: 84, fontWeight:900,
              color:'#fff', letterSpacing:'0.08em', lineHeight:1,
              marginBottom: 24,
              textShadow: `0 4px 30px rgba(0,0,0,.6)`
            }}>{drama.name}</h1>
            <p style={{
              fontSize: 18, color:'rgba(255,255,255,.85)',
              letterSpacing:'0.05em', minHeight:30
            }}>{introTxt}<span style={{
              display:'inline-block', width:2, height:20,
              background: drama.palette.primary, marginLeft:4, verticalAlign:'middle',
              animation:'blink 1s steps(1) infinite'
            }}/></p>
          </div>
          <div style={{
            fontFamily:'var(--font-mono)', fontSize:11,
            color: drama.palette.primary, letterSpacing:'0.2em',
            textAlign:'right', opacity:.85
          }}>
            <div>EP. 03 / 24</div>
            <div style={{marginTop:6}}>{drama.metaphors.location}</div>
          </div>
        </div>
      </section>

      {/* Body — 70% brand layer */}
      <section style={{padding:'56px 80px 100px', maxWidth:1440, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:48}}>
          {/* LEFT */}
          <div>
            <h2 style={{
              fontSize:13, letterSpacing:'0.3em', color:'var(--brand-text-soft)',
              fontWeight:500, marginBottom:18, paddingBottom:12,
              borderBottom:'1px solid var(--brand-border)'
            }}>剧 情 简 介  /  SYNOPSIS</h2>
            <p style={{
              fontSize:15, lineHeight:1.9, color:'var(--brand-text)',
              fontWeight:300, letterSpacing:'0.04em',
              maxWidth: 680, marginBottom:48
            }}>
              {drama.id==='santi' && '1971年,文化大革命的尾声。物理学家叶文洁被流放至黑龙江大兴安岭,意外加入秘密的"红岸工程"——一个对外星文明发射信号的军事基地。一个清晨,她按下了那枚或许改变人类命运的发送键。半个世纪后,你成为了那位监听员1379号——你能否阻止她?'}
              {drama.id==='changxiangsi' && '上古洪荒,玄幻三界。神农族小公主玖瑶在一场宫变中失忆流落人间,化名小夭。三百年后她回到清水镇行医为生,身边围绕着王不平、玱玹、相柳、涂山璟。每一段相遇都是一次寄思的机会——你是路过此地的旧识,你能否替她说出从未说出口的那句话?'}
              {drama.id==='qingyunian' && '一个穿越者在另一个世界从京都鉴查院的低阶探子做起。鉴查院的密档里,藏着无数个改变历史的"另一种可能"。你成为了一处的密探,某一日收到一封需要立即回复的密信——你写下的每一个字,都可能影响这场风暴。'}
              {drama.id==='fanhua' && '1990年代的上海,黄河路上的霓虹灯下。阿宝、汪小姐、玲子、李李——四个人的命运在一个雨夜交织。你是黄河路上的一名常客,某个深夜,你在至真园的留言机上按下了录音键——你的话,会不会改变那个夜晚?'}
            </p>

            {/* identity card */}
            <h2 style={{
              fontSize:13, letterSpacing:'0.3em', color:'var(--brand-text-soft)',
              fontWeight:500, marginBottom:18, paddingBottom:12,
              borderBottom:'1px solid var(--brand-border)'
            }}>你 的 身 份  /  YOUR ROLE</h2>
            <div className="brand-card" style={{
              padding: 28, marginBottom:48,
              display:'flex', alignItems:'center', gap:24,
              background: `linear-gradient(135deg, var(--brand-card) 60%, ${drama.palette.primary}10 100%)`
            }}>
              <div style={{
                width: 96, height: 96, flexShrink:0,
                background: drama.coverGradient,
                border: `1px solid ${drama.palette.primary}66`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily: drama.id==='santi'?'var(--font-mono)':'var(--font-zh-serif)',
                color: drama.palette.primary, fontSize:11, letterSpacing:'0.2em',
                textAlign:'center', padding:8,
                textShadow: `0 0 8px ${drama.palette.primary}`
              }}>
                {drama.id==='santi'? '1379_ID': drama.metaphors.identity.slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <div style={{
                  fontFamily:'var(--font-mono)', fontSize:11,
                  color:'var(--brand-text-mute)', letterSpacing:'0.2em', marginBottom:6
                }}>IDENTITY · {drama.metaphors.cipher}</div>
                <div style={{fontSize:22, fontFamily:'var(--font-zh-serif)', fontWeight:700, marginBottom:6, color:'var(--brand-text)'}}>
                  {drama.metaphors.identity}
                </div>
                <div style={{fontSize:13, color:'var(--brand-text-soft)', letterSpacing:'0.05em'}}>
                  目标:<span style={{color: drama.palette.primary}}>{drama.metaphors.target}</span>
                  <span style={{margin:'0 12px', color:'var(--brand-border-hi)'}}>│</span>
                  位置:{drama.metaphors.location}
                </div>
              </div>
            </div>

            {/* nodes */}
            <h2 style={{
              fontSize:13, letterSpacing:'0.3em', color:'var(--brand-text-soft)',
              fontWeight:500, marginBottom:18, paddingBottom:12,
              borderBottom:'1px solid var(--brand-border)',
              display:'flex', justifyContent:'space-between'
            }}>
              <span>介 入 节 点  /  NODES</span>
              <span style={{fontFamily:'var(--font-mono)', color:'var(--brand-text-mute)'}}>
                {drama.nodes.length} / {drama.nodeCount}
              </span>
            </h2>
            <div style={{display:'flex', flexDirection:'column', gap:12}}>
              {drama.nodes.map((n, i) => (
                <div key={n.id} className="brand-card" style={{
                  padding:'18px 24px',
                  display:'flex', alignItems:'center', gap:20
                }}>
                  <div style={{
                    fontFamily:'var(--font-mono)', fontSize:14,
                    color: drama.palette.primary, letterSpacing:'0.1em',
                    minWidth: 72,
                    textShadow: `0 0 6px ${drama.palette.primary}80`
                  }}>{n.time}</div>
                  <div style={{
                    width:1, height:36, background:'var(--brand-border-hi)'
                  }}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15, fontWeight:500, color:'var(--brand-text)', marginBottom:4}}>
                      {n.title}
                    </div>
                    <div style={{fontSize:12, color:'var(--brand-text-mute)', letterSpacing:'0.04em'}}>{n.desc}</div>
                  </div>
                  <span style={{
                    fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.2em',
                    padding:'4px 10px',
                    border:'1px solid var(--brand-border-hi)',
                    color:'var(--brand-text-mute)'
                  }}>NODE_{i+1}</span>
                </div>
              ))}
              {Array.from({length: drama.nodeCount - drama.nodes.length}).map((_, i) => (
                <div key={'lk'+i} style={{
                  padding:'14px 24px',
                  border:'1px dashed var(--brand-border)',
                  borderRadius:4,
                  display:'flex', alignItems:'center', gap:16,
                  fontSize:12, color:'var(--brand-text-mute)',
                  fontFamily:'var(--font-mono)', letterSpacing:'0.18em'
                }}>
                  <span style={{minWidth:72}}>--:--</span>
                  <span>· · ·</span>
                  <span>LOCKED · 通关后解锁</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — sidebar */}
          <aside>
            <div className="brand-card" style={{padding: 28, marginBottom: 20}}>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.25em',
                color:'var(--brand-text-mute)', marginBottom:14
              }}>STATS</div>
              {[
                ['介入次数', '128,432'],
                ['平均影响力', '67.4'],
                ['存档分支', '3'],
                ['全球排名', '#284 / 12,940']
              ].map(([k,v]) => (
                <div key={k} style={{
                  display:'flex', justifyContent:'space-between',
                  padding:'10px 0', borderBottom:'1px dashed var(--brand-border)',
                  fontSize:13
                }}>
                  <span style={{color:'var(--brand-text-soft)'}}>{k}</span>
                  <span style={{fontFamily:'var(--font-mono)', color:'var(--brand-text)', letterSpacing:'0.05em'}}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={onEnter} className="btn btn-theme" style={{
              width:'100%', padding:'18px', fontSize:13
            }}>
              ▶ 进入观看
            </button>
            <button className="btn btn-ghost" style={{width:'100%', marginTop:10, padding:'14px'}}>
              ◇ 加入印记柜
            </button>
            <p style={{
              marginTop:24, padding:16,
              border:'1px solid var(--brand-border)',
              fontSize:12, color:'var(--brand-text-mute)',
              lineHeight:1.7, letterSpacing:'0.04em'
            }}>
              <span style={{color:drama.palette.accent, fontFamily:'var(--font-mono)'}}>NOTE  /</span><br/>
              进入剧目后,《入戏》品牌界面将隐没。
              你将完整进入该剧的世界,直到节点触发。
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DetailPage });
