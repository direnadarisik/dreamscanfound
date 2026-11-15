// Cinematic intro (space → rocket launch → smoke → DREAMSCANFOUND title) and cruise to Mars.
const W = 1920, H = 1080;
const stars = Array.from({ length: 220 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() < 0.15 ? 4 : 2, p: Math.random() * 6 }));
export const TITLE_AT = 12.2, BUTTONS_AT = 14.4;

function ready(img) { return img && img.complete && img.naturalWidth; }
function txt(ctx, t, x, y, size, color, font = 'Press Start 2P', align = 'center') {
  ctx.font = `${size}px "${font}"`; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(t, x, y);
}
function drawStars(ctx, time, drift = 0) {
  ctx.fillStyle = '#04030a'; ctx.fillRect(0, 0, W, H);
  for (const s of stars) {
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time * 2 + s.p);
    ctx.fillStyle = '#fff';
    ctx.fillRect(((s.x - drift * s.s) % W + W) % W, s.y, s.s, s.s);
  }
  ctx.globalAlpha = 1;
}
export function drawMars(ctx, x, y, r) {
  ctx.fillStyle = '#b5472a'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d9703e'; ctx.beginPath(); ctx.arc(x - r * 0.15, y - r * 0.15, r * 0.82, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8a3019';
  for (let i = 0; i < 9; i++) { const a = i * 2.3, d = r * (0.2 + (i % 4) * 0.17); ctx.fillRect(x + Math.cos(a) * d - r * 0.08, y + Math.sin(a) * d - r * 0.05, r * 0.16, r * 0.1); }
  ctx.fillStyle = '#f4e6dc'; ctx.fillRect(x - r * 0.25, y - r * 0.97, r * 0.5, r * 0.1);
}

export function createCine(IMG, sounds) {
  const c = { t: 0, smoke: [], launched: false, stung: false, done: false };
  c.skip = () => { if (c.t < BUTTONS_AT) { c.t = BUTTONS_AT; c.smoke = []; } };
  c.update = dt => {
    c.t += dt;
    const t = c.t;
    if (t > 4.4 && !c.launched) { c.launched = true; sounds.launch(); }
    if (t > TITLE_AT && !c.stung) { c.stung = true; sounds.sting(); }
    if (t > 4.6 && t < 9.6) {
      for (let i = 0; i < 4; i++) {
        const side = Math.random() < 0.5 ? -1 : 1;
        c.smoke.push({ x: 860 + Math.random() * 60, y: 900, vx: side * (120 + Math.random() * 380), vy: -20 - Math.random() * 80, r: 30 + Math.random() * 30, a: 0.9 });
      }
    }
    for (const s of c.smoke) {
      s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.985; s.r += 70 * dt;
      if (t > 10.2) s.a -= dt * 0.45;
    }
    c.smoke = c.smoke.filter(s => s.a > 0);
  };
  c.rocketY = () => { const k = Math.max(0, c.t - 5.6); return -0.5 * 260 * k * k; };
  c.draw = (ctx, hasSave) => {
    const t = c.t;
    if (t < 4) {
      drawStars(ctx, t, t * 40);
      const e = IMG.earth;
      if (ready(e)) ctx.drawImage(e, 160, 330, 420, 420);
      drawMars(ctx, 1600, 420, 110 + t * 6);
      const sc = IMG.spacecraft, k = t / 4;
      if (ready(sc)) ctx.drawImage(sc, 520 + k * 820, 640 - k * 160, 200, 156);
      ctx.globalAlpha = Math.min(1, t, 4 - t);
      txt(ctx, 'EARTH, 2035. A CREW PREPARES FOR MARS...', W / 2, 960, 26, '#ffd9b0');
      ctx.globalAlpha = 1;
      return;
    }
    // Launch pad scene
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#05040e'); g.addColorStop(0.7, '#2a1530'); g.addColorStop(1, '#5a2a24');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of stars.slice(0, 90)) { ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(s.x, s.y * 0.6, 2, 2); }
    ctx.fillStyle = '#2b1c18'; ctx.fillRect(0, 900, W, 180);
    ctx.fillStyle = '#4a3026'; ctx.fillRect(0, 900, W, 10);
    const r = IMG.rocket, sc = 720 / 387;
    const ry = c.rocketY();
    if (ready(r)) {
      // Tower (static) and rocket (moving) are separate parts of the sprite.
      ctx.drawImage(r, 192, 0, 116, 387, 700 + 192 * sc, 900 - 387 * sc, 116 * sc, 387 * sc);
      const shake = t > 4.4 && t < 6.5 ? (Math.random() - 0.5) * 6 : 0;
      ctx.drawImage(r, 0, 0, 192, 360, 700 + shake, 900 - 387 * sc + ry, 192 * sc, 360 * sc);
      if (t > 4.4) {
        const fy = 900 - 387 * sc + 360 * sc + ry;
        const len = Math.min(1, (t - 4.4) / 1.2) * (180 + Math.random() * 60);
        for (const [fx, w] of [[700 + 96 * sc, 70], [700 + 50 * sc, 40], [700 + 142 * sc, 40]]) {
          ctx.fillStyle = '#fff6c0'; ctx.fillRect(fx - w * 0.3, fy, w * 0.6, len * 0.5);
          ctx.fillStyle = '#ffb030'; ctx.fillRect(fx - w * 0.5, fy + len * 0.15, w, len * 0.6);
          ctx.fillStyle = '#ff5a1a'; ctx.fillRect(fx - w * 0.35, fy + len * 0.5, w * 0.7, len * 0.5);
        }
        ctx.fillStyle = `rgba(255,170,60,${0.15 + Math.random() * 0.1})`;
        ctx.fillRect(0, 0, W, H);
      }
    }
    for (const s of c.smoke) {
      ctx.globalAlpha = Math.max(0, Math.min(1, s.a));
      ctx.fillStyle = '#d8cfc8';
      const q = 12, rr = Math.round(s.r / q) * q;
      ctx.fillRect(Math.round(s.x / q) * q - rr, Math.round(s.y / q) * q - rr * 0.7, rr * 2, rr * 1.4);
      ctx.fillStyle = '#b8aea8';
      ctx.fillRect(Math.round(s.x / q) * q - rr * 0.6, Math.round(s.y / q) * q, rr * 1.2, rr * 0.6);
    }
    ctx.globalAlpha = 1;
    if (t > 8.6 && t < 11.4) {
      ctx.fillStyle = `rgba(216,207,200,${Math.min(1, (t - 8.6) / 1.2) * Math.min(1, (11.4 - t) / 1.4)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (t >= TITLE_AT - 1) {
      ctx.fillStyle = `rgba(4,3,10,${Math.min(0.85, (t - TITLE_AT + 1) * 0.6)})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (t >= TITLE_AT) {
      const name = 'DREAMSCANFOUND';
      const n = Math.min(name.length, Math.floor((t - TITLE_AT) / 0.1));
      const glow = 18 + Math.sin(t * 3) * 8;
      ctx.save();
      ctx.shadowColor = '#5fffd0'; ctx.shadowBlur = glow;
      txt(ctx, name.slice(0, n), W / 2, 420, 92, '#eafffa');
      ctx.restore();
      if (t > TITLE_AT + 1.6) {
        ctx.globalAlpha = Math.min(1, (t - TITLE_AT - 1.6) * 2);
        txt(ctx, '15 DAYS ON MARS', W / 2, 530, 52, '#ff8a3d');
        txt(ctx, 'A space mission management simulation', W / 2, 600, 36, '#ffd9b0', 'VT323');
        ctx.globalAlpha = 1;
      }
    }
    if (t >= BUTTONS_AT) {
      for (const b of titleButtons(hasSave)) {
        const pulse = b.id === 'start' ? Math.sin(t * 4) * 4 : 0;
        ctx.fillStyle = b.id === 'start' ? '#ff8a3d' : '#2a6c66';
        ctx.fillRect(b.x - pulse, b.y - pulse, b.w + pulse * 2, b.h + pulse * 2);
        ctx.strokeStyle = '#fff0c9'; ctx.lineWidth = 4; ctx.strokeRect(b.x - pulse, b.y - pulse, b.w + pulse * 2, b.h + pulse * 2);
        txt(ctx, b.label, b.x + b.w / 2, b.y + b.h / 2 + 12, 26, '#fff');
      }
      txt(ctx, 'ENTER: start · C: continue saved mission', W / 2, 1010, 30, '#ffd9b0', 'VT323');
    } else {
      txt(ctx, 'SKIP ▶ (SPACE / ESC / click)', W - 40, 1050, 28, '#ffd9b0', 'VT323', 'right');
    }
  };
  return c;
}
export function titleButtons(hasSave) {
  const b = [{ id: 'start', label: 'START MISSION', x: 710, y: 700, w: 500, h: 96 }];
  if (hasSave) b.push({ id: 'continue', label: 'CONTINUE MISSION', x: 710, y: 830, w: 500, h: 80 });
  return b;
}

// Cruise from Earth to Mars, then entry, descent & landing (skippable).
export const TRAVEL_LEN = 7;
export function drawTravel(ctx, IMG, t) {
  drawStars(ctx, t, t * 120);
  const k = Math.min(1, t / 5.5);
  const e = IMG.earth;
  if (ready(e)) { const s = 360 * (1 - k * 0.8); ctx.drawImage(e, 120 - k * 100, 540 - s / 2, s, s); }
  drawMars(ctx, 1700 - k * 300, 540, 60 + k * 260);
  const sc = IMG.spacecraft;
  if (ready(sc) && t < 5.8) ctx.drawImage(sc, 300 + k * 900, 480, 180, 140);
  txt(ctx, `TRANS-MARS CRUISE · DAY ${Math.round(k * 210)}`, W / 2, 140, 34, '#7effdc');
  txt(ctx, 'Typical Earth-Mars transfers take about 6-9 months (NASA)', W / 2, 200, 32, '#ffd9b0', 'VT323');
  if (t > 5.5) {
    ctx.fillStyle = `rgba(255,120,40,${Math.min(0.8, (t - 5.5))})`;
    ctx.fillRect(0, 0, W, H);
    txt(ctx, 'ENTRY · DESCENT · LANDING', W / 2, 560, 46, '#fff');
  }
  txt(ctx, 'SKIP ▶ (SPACE / click)', W - 40, 1050, 28, '#ffd9b0', 'VT323', 'right');
}
