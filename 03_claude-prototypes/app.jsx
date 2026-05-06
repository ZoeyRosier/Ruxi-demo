/* global React, ReactDOM, DRAMA_THEMES, applyTheme,
   HomePage, DetailPage, WatchPage, AwakeningPage,
   ComposePage, ScorePage, BranchPage, ArchivePage,
   GlitchTransition, FadeTransition, useTweaks,
   TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakToggle */

const { useState, useEffect } = React;

const ROUTES = ['home','detail','watch','awakening','compose','score','branch','archive'];

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "drama": "santi",
    "showScanlines": true,
    "particleDensity": "medium",
    "transitionStyle": "auto"
  }/*EDITMODE-END*/);

  const drama = DRAMA_THEMES[tweaks.drama] || DRAMA_THEMES.santi;
  useEffect(() => { applyTheme(drama); }, [drama]);

  const [route, setRoute] = useState('home');
  const [selectedDramaId, setSelectedDramaId] = useState(tweaks.drama);
  const [composedMsg, setComposedMsg] = useState('');
  const [transition, setTransition] = useState(null); // 'glitch' | 'fade' | null
  const [pendingRoute, setPendingRoute] = useState(null);

  // Sync selected drama with tweak
  useEffect(() => { setSelectedDramaId(tweaks.drama); }, [tweaks.drama]);

  const navigate = (r, opts = {}) => {
    if (opts.transition) {
      setTransition(opts.transition);
      setPendingRoute(r);
    } else {
      setRoute(r);
    }
  };

  const onTransitionDone = () => {
    if (pendingRoute) setRoute(pendingRoute);
    setTransition(null);
    setPendingRoute(null);
  };

  const activeDrama = DRAMA_THEMES[selectedDramaId];

  return (
    <>
      {/* PAGE ROUTING */}
      {route === 'home' && (
        <HomePage
          onNav={(r) => navigate(r)}
          onSelectDrama={(id) => {
            setSelectedDramaId(id);
            setTweak('drama', id);
            navigate('detail');
          }} />
      )}
      {route === 'detail' && (
        <DetailPage
          dramaId={selectedDramaId}
          onNav={(r) => navigate(r)}
          onBack={() => navigate('home')}
          onEnter={() => navigate('watch', { transition: 'fade' })}
        />
      )}
      {route === 'watch' && (
        <WatchPage theme={activeDrama} nodeIndex={0}
          onTriggerNode={() => navigate('awakening', { transition: 'glitch' })}
          onExit={() => navigate('detail')} />
      )}
      {route === 'awakening' && (
        <AwakeningPage theme={activeDrama}
          onAccept={() => navigate('compose')} />
      )}
      {route === 'compose' && (
        <ComposePage theme={activeDrama}
          onSend={(msg) => { setComposedMsg(msg); navigate('score'); }}
          onExit={() => navigate('watch')} />
      )}
      {route === 'score' && (
        <ScorePage theme={activeDrama} message={composedMsg}
          onContinue={() => navigate('branch')}
          onExit={() => navigate('detail')} />
      )}
      {route === 'branch' && (
        <BranchPage theme={activeDrama}
          onArchive={() => navigate('archive', { transition: 'fade' })}
          onExit={() => navigate('home')} />
      )}
      {route === 'archive' && (
        <ArchivePage onNav={(r) => navigate(r)}
          onReplay={(id) => { setSelectedDramaId(id); setTweak('drama', id); navigate('detail'); }} />
      )}

      {/* TRANSITION OVERLAYS */}
      <GlitchTransition active={transition==='glitch'} theme={activeDrama} onDone={onTransitionDone} />
      <FadeTransition active={transition==='fade'} color={activeDrama.palette.primary} onDone={onTransitionDone} />

      {/* DEV NAV — quick jump (always visible, subtle) */}
      <DevNav route={route} setRoute={setRoute} />

      {/* TWEAKS PANEL */}
      <TweaksPanel title="Tweaks · 视觉调谐">
        <TweakSection title="主题层 / Drama Theme">
          <TweakSelect
            label="当前剧目"
            value={tweaks.drama}
            options={Object.values(DRAMA_THEMES).map(d => ({ value: d.id, label: d.name }))}
            onChange={(v) => { setTweak('drama', v); setSelectedDramaId(v); }} />
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background:'rgba(0,0,0,.3)',
            border: `1px solid ${activeDrama.palette.primary}66`,
            fontFamily:'var(--font-mono)', fontSize:10,
            color: activeDrama.palette.primary,
            letterSpacing:'0.18em', lineHeight:1.7
          }}>
            <div>● {activeDrama.enName}</div>
            <div style={{color:'rgba(255,255,255,.55)', marginTop:4}}>{activeDrama.container}</div>
          </div>
        </TweakSection>

        <TweakSection title="视觉肌理">
          <TweakToggle label="扫描线 Scanlines"
            value={tweaks.showScanlines}
            onChange={(v) => setTweak('showScanlines', v)} />
          <TweakRadio label="粒子密度"
            value={tweaks.particleDensity}
            options={[
              {value:'low', label:'稀'},
              {value:'medium', label:'中'},
              {value:'high', label:'密'}
            ]}
            onChange={(v) => setTweak('particleDensity', v)} />
        </TweakSection>

        <TweakSection title="跳转测试">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
            {ROUTES.map(r => (
              <button key={r} onClick={() => setRoute(r)}
                style={{
                  padding:'8px 10px', fontSize:11,
                  letterSpacing:'0.1em',
                  background: route===r ? activeDrama.palette.primary : 'rgba(255,255,255,.05)',
                  color: route===r ? '#000' : 'rgba(255,255,255,.7)',
                  border:'1px solid rgba(255,255,255,.1)',
                  fontFamily:'var(--font-mono)',
                  textTransform:'uppercase'
                }}>{r}</button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Always-visible mini route indicator (bottom-left)
function DevNav({ route, setRoute }) {
  const labels = {
    home: '首页', detail: '详情', watch: '观看', awakening: '唤起',
    compose: '撰写', score: '评分', branch: '分支', archive: '档案'
  };
  return (
    <div style={{
      position:'fixed', bottom: 16, left: 16, zIndex: 500,
      display:'flex', gap: 4,
      padding: '6px',
      background:'rgba(10,10,15,.85)',
      backdropFilter:'blur(8px)',
      border:'1px solid rgba(255,255,255,.08)',
      borderRadius: 4
    }}>
      {ROUTES.map((r, i) => (
        <button key={r} onClick={() => setRoute(r)} title={labels[r]}
          style={{
            padding:'6px 10px',
            fontSize: 10, fontFamily:'var(--font-mono)',
            letterSpacing:'0.1em',
            color: route===r ? 'var(--brand-text)' : 'var(--brand-text-mute)',
            background: route===r ? 'rgba(139,127,184,.18)' : 'transparent',
            border: route===r ? '1px solid var(--brand-accent)' : '1px solid transparent',
            borderRadius: 2,
            cursor:'pointer'
          }}>
          {String(i+1).padStart(2,'0')}·{labels[r]}
        </button>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
