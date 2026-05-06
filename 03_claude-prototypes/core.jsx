/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// =========================================
// Hooks
// =========================================
function useTypewriter(text, speed = 40, startDelay = 0, deps = []) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(''); setDone(false);
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(id);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
    // eslint-disable-next-line
  }, [text, speed, startDelay, ...deps]);
  return [out, done];
}

function useCountUp(target, duration = 1200, trigger) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setV(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return v;
}

// =========================================
// Theme application
// =========================================
function applyTheme(theme) {
  const r = document.documentElement.style;
  r.setProperty('--theme-primary', theme.palette.primary);
  r.setProperty('--theme-accent', theme.palette.accent);
  r.setProperty('--theme-secondary', theme.palette.secondary);
  r.setProperty('--theme-tertiary', theme.palette.tertiary);
  r.setProperty('--theme-bg', theme.palette.bg);
  r.setProperty('--theme-bg-soft', theme.palette.bgSoft);
}

// =========================================
// Particle background
// =========================================
function Particles({ color, density = 30 }) {
  const items = useMemo(() => {
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 8,
      dur: 8 + Math.random() * 12,
      opacity: 0.2 + Math.random() * 0.6
    }));
  }, [density, color]);
  return (
    <div className="theme-ambience">
      {items.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: p.left + '%',
          top: p.top + '%',
          width: p.size + 'px',
          height: p.size + 'px',
          background: color,
          borderRadius: '50%',
          opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 3}px ${color}`,
          animation: `particleDrift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`
        }}/>
      ))}
    </div>
  );
}

// =========================================
// Glitch transition overlay
// =========================================
function GlitchTransition({ active, onDone, theme }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => onDone && onDone(), 1500);
    return () => clearTimeout(t);
  }, [active, onDone]);
  if (!active) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      animation: 'glitchOverlay 1.5s forwards'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(0deg, transparent 0, transparent 3px, ${theme.palette.primary}22 3px, ${theme.palette.primary}22 4px)`,
        animation: 'scanmove 0.4s linear infinite'
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 14, letterSpacing: '0.3em',
        color: theme.palette.primary,
        textShadow: `0 0 12px ${theme.palette.primary}`
      }}>
        <span className="glitch-rgb" data-text={theme.metaphors.cipher}>
          {theme.metaphors.cipher}
        </span>
      </div>
    </div>
  );
}

// Generic ink/scroll/neon transition (simpler)
function FadeTransition({ active, onDone, color = '#fff', mode = 'in' }) {
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => onDone && onDone(), 1000);
    return () => clearTimeout(t);
  }, [active, onDone]);
  if (!active) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, ${color}88 0%, #000 60%)`,
      animation: 'fadeBlink 1s forwards'
    }}/>
  );
}

// =========================================
// Top header — brand layer
// =========================================
function BrandHeader({ onNav, current }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '20px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'linear-gradient(to bottom, rgba(10,10,15,.95), rgba(10,10,15,0))',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="brand-logo-mark" onClick={() => onNav('home')} style={{cursor:'pointer'}}>
        <span className="dot"></span>
        <span>入&nbsp;戏</span>
        <span style={{fontSize:10, fontFamily:'var(--font-mono)', color:'var(--brand-text-mute)', letterSpacing:'0.2em', marginLeft:8}}>RUXI · v0.4</span>
      </div>
      <nav style={{display:'flex', gap:32, fontSize:13, letterSpacing:'0.1em'}}>
        <a className={current==='home' ? 'link-active' : 'link-underline'}
           onClick={() => onNav('home')}
           style={{cursor:'pointer', color: current==='home' ? 'var(--brand-text)' : 'var(--brand-text-soft)'}}>
          剧 目
        </a>
        <a className="link-underline"
           onClick={() => onNav('archive')}
           style={{cursor:'pointer', color: current==='archive' ? 'var(--brand-text)' : 'var(--brand-text-soft)'}}>
          我 的 印 记
        </a>
        <a className="link-underline" style={{cursor:'pointer'}}>关 于</a>
      </nav>
    </header>
  );
}

// =========================================
// Theme header — drama layer
// =========================================
function ThemeHeader({ theme, onExit, label }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '16px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: `linear-gradient(to bottom, ${theme.palette.bg}cc, transparent)`,
      pointerEvents: 'auto'
    }}>
      <div style={{
        display:'flex', alignItems:'center', gap:14,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing:'0.25em',
        color: theme.palette.primary,
        textShadow: `0 0 8px ${theme.palette.primary}80`
      }}>
        <span style={{
          width:8, height:8, borderRadius:'50%',
          background: theme.palette.primary,
          boxShadow: `0 0 10px ${theme.palette.primary}`,
          animation: 'pulseDot 1.4s infinite'
        }}/>
        <span>● REC</span>
        <span style={{color:theme.palette.accent}}>│</span>
        <span style={{color:'rgba(255,255,255,.5)'}}>{label || theme.container}</span>
      </div>
      <button onClick={onExit} style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing:'0.2em',
        color:'rgba(255,255,255,.5)',
        textTransform: 'uppercase',
        padding: '6px 14px',
        border: '1px solid rgba(255,255,255,.15)'
      }}>× EXIT</button>
    </header>
  );
}

Object.assign(window, {
  useTypewriter, useCountUp, applyTheme,
  Particles, GlitchTransition, FadeTransition,
  BrandHeader, ThemeHeader
});
