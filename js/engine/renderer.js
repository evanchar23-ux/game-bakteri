/**
 * renderer.js
 * Visual Rendering Khusus Tiap Area Organ Tubuh (Ultra-HD Confocal Microscopic Engine)
 * Menghadirkan lingkungan jaringan biologis ultra-detail, kontras tinggi, dan bertekstur nyata:
 * - Dasar Jaringan Seluler Heksagonal (Epithelial Honeycomb Matrix) dengan inti sel bernapas
 * - Jaringan Anyaman Pembuluh Kapiler Mikro (Microvascular Network)
 * - Paru-paru: Kantung Alveoli 3D kaya surfaktan, septa interalveolar, dan pita aerosol silia
 * - Usus: Karpet Vili intestinal beludru 3D, kripta Lieberkühn, sel goblet, dan gelombang peristaltik
 * - Kulit: Jaring Fibrin pembekuan darah berdefinisi tinggi, lempeng keratin, dan kolam plasma
 * - Pembuluh Darah: Paving sel endotel polygonal, tautan ketat (tight junctions), dan arus hemodinamik
 * - Lensa Optik Konfokal: Vignette mikroskop laser dan retikel skala 20µm
 */

export class WorldRenderer {
  constructor() {
    this.animTime = 0;
  }

  renderBackground(ctx, camera, organDef, particles) {
    this.animTime += 0.016;
    const theme = organDef.themeType || 'lungs';
    const cam = camera.getRenderOffset();
    const t = this.animTime;

    // 1. Fill base deep organic gradient background
    const bgGrad = ctx.createRadialGradient(
      camera.viewportWidth / 2, camera.viewportHeight / 2, 80,
      camera.viewportWidth / 2, camera.viewportHeight / 2, camera.viewportWidth * 0.85
    );
    bgGrad.addColorStop(0, organDef.bgColor || '#031422');
    bgGrad.addColorStop(1, '#01080e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, camera.viewportWidth, camera.viewportHeight);

    // 2. Render Living Epithelial Honeycomb Matrix (Dasar Seluler Organ)
    this.renderCellularFloor(ctx, camera, theme);

    // 3. Render Microvascular Capillary Network (Anyaman Pembuluh Darah Kapiler)
    this.renderCapillaryNetwork(ctx, camera, theme);

    // 4. Living Systolic Heartbeat Pulse Wave (Rhythmic organ fluid expansion)
    const heartPulse = Math.pow(Math.max(0, Math.sin(t * 2.2)), 8);
    if (heartPulse > 0.04) {
      ctx.save();
      const gradPulse = ctx.createRadialGradient(
        camera.viewportWidth / 2, camera.viewportHeight / 2, 60,
        camera.viewportWidth / 2, camera.viewportHeight / 2, camera.viewportWidth * 0.75
      );
      gradPulse.addColorStop(0, organDef.fluidTint || 'rgba(0, 210, 255, 0.16)');
      gradPulse.addColorStop(0.7, 'rgba(0, 0, 0, 0.02)');
      gradPulse.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradPulse;
      ctx.globalAlpha = heartPulse * 0.85;
      ctx.fillRect(0, 0, camera.viewportWidth, camera.viewportHeight);
      ctx.restore();
    }

    // 5. Render organ-specific detailed anatomical landscape
    if (theme === 'lungs') {
      this.renderLungsLandscape(ctx, camera, organDef);
    } else if (theme === 'gut') {
      this.renderGutLandscape(ctx, camera, organDef);
    } else if (theme === 'skin') {
      this.renderSkinLandscape(ctx, camera, organDef);
    } else if (theme === 'bloodstream') {
      this.renderBloodstreamLandscape(ctx, camera, organDef);
    }

    // 6. Render organ ambient floating particles (erythrocytes, cilia flakes, bile micelles)
    particles.renderBackgroundCells(ctx, camera);

    // 7. Render specialized biological organ borders
    this.renderOrganBorders(ctx, camera, theme, organDef);

    // 8. Confocal Microscope Optical Lens Overlay (HD Vignette & Scientific Scale)
    this.renderMicroscopeOptics(ctx, camera);
  }

  // =========================================================================
  // CELLULAR EPITHELIAL HONEYCOMB FLOOR (Fondasi Seluler Organ)
  // =========================================================================
  renderCellularFloor(ctx, camera, theme) {
    const cam = camera.getRenderOffset();
    const cellSize = 80;
    const h = cellSize * Math.sqrt(3);

    let borderColor = 'rgba(0, 210, 255, 0.08)';
    let nucleusColor = 'rgba(0, 242, 254, 0.25)';
    if (theme === 'gut') {
      borderColor = 'rgba(42, 157, 143, 0.10)';
      nucleusColor = 'rgba(233, 196, 106, 0.22)';
    } else if (theme === 'skin') {
      borderColor = 'rgba(231, 111, 81, 0.10)';
      nucleusColor = 'rgba(244, 162, 97, 0.24)';
    } else if (theme === 'bloodstream') {
      borderColor = 'rgba(230, 57, 70, 0.12)';
      nucleusColor = 'rgba(255, 183, 3, 0.26)';
    }

    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.2;

    const startCol = Math.floor(cam.x / (cellSize * 1.5)) - 1;
    const endCol = Math.ceil((cam.x + camera.viewportWidth) / (cellSize * 1.5)) + 1;
    const startRow = Math.floor(cam.y / h) - 1;
    const endRow = Math.ceil((cam.y + camera.viewportHeight) / h) + 1;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const cx = c * cellSize * 1.5 - cam.x;
        const cy = r * h + (c % 2 === 0 ? 0 : h / 2) - cam.y;

        // Draw hexagon cell boundary
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const px = cx + Math.cos(a) * (cellSize * 0.52);
          const py = cy + Math.sin(a) * (cellSize * 0.52);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Cell Nucleus Dot (Inti sel biologis)
        ctx.fillStyle = nucleusColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // MICROVASCULAR CAPILLARY NETWORK (Anyaman Pembuluh Darah Mikro)
  // =========================================================================
  renderCapillaryNetwork(ctx, camera, theme) {
    const cam = camera.getRenderOffset();
    const t = this.animTime;
    const netSpacing = 420;

    ctx.save();
    ctx.lineWidth = 4;
    ctx.strokeStyle = theme === 'bloodstream' ? 'rgba(230, 57, 70, 0.28)' : 'rgba(180, 25, 45, 0.18)';
    ctx.shadowColor = '#e63946';
    ctx.shadowBlur = 8;

    const startX = Math.floor(cam.x / netSpacing) - 1;
    const endX = Math.ceil((cam.x + camera.viewportWidth) / netSpacing) + 1;

    for (let i = startX; i <= endX; i++) {
      const worldX = i * netSpacing;
      const sx = worldX - cam.x;

      ctx.beginPath();
      ctx.moveTo(sx, 0);
      const wave1 = Math.sin(t * 1.2 + i * 1.5) * 45;
      const wave2 = Math.cos(t * 1.4 + i) * 55;
      ctx.bezierCurveTo(
        sx + wave1, camera.viewportHeight * 0.35,
        sx + wave2, camera.viewportHeight * 0.7,
        sx + wave1 * 0.5, camera.viewportHeight
      );
      ctx.stroke();

      // Branching micro-vessel twigs
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(sx + wave1, camera.viewportHeight * 0.35);
      ctx.lineTo(sx + wave1 + 80, camera.viewportHeight * 0.35 - 30);
      ctx.moveTo(sx + wave2, camera.viewportHeight * 0.7);
      ctx.lineTo(sx + wave2 - 75, camera.viewportHeight * 0.7 + 35);
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // 1. PARU-PARU (PULMO): Alveoli 3D, Lapisan Surfaktan, & Aliran Silia HD
  // =========================================================================
  renderLungsLandscape(ctx, camera, organDef) {
    const cam = camera.getRenderOffset();
    const t = this.animTime;

    // Alveolar Clusters (Kantung Alveoli kaya surfaktan padat)
    ctx.save();
    const sacSpacing = 240; // Dense spacing for rich view
    const startCol = Math.floor(cam.x / sacSpacing) - 1;
    const endCol = Math.ceil((cam.x + camera.viewportWidth) / sacSpacing) + 1;
    const startRow = Math.floor(cam.y / sacSpacing) - 1;
    const endRow = Math.ceil((cam.y + camera.viewportHeight) / sacSpacing) + 1;

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const cx = c * sacSpacing + (Math.sin(r * 2.5) * 50) - cam.x;
        const cy = r * sacSpacing + (Math.cos(c * 2.2) * 50) - cam.y;

        // 1. Alveolar 3D depth sphere
        const radPulse = Math.sin(t * 1.6 + c + r) * 5;
        const mainRadius = 88 + radPulse;

        const grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, mainRadius);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0.22)');
        grad.addColorStop(0.55, 'rgba(0, 160, 220, 0.10)');
        grad.addColorStop(0.85, 'rgba(0, 90, 150, 0.05)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, mainRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Surfactant Lipid Sheen (Cincin pembatas surfaktan berkilau cerah)
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, mainRadius - 6, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Septa interalveolar vesicles (Sub-kantung alveolus)
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.22)';
        ctx.shadowBlur = 4;
        for (let sub = 0; sub < 4; sub++) {
          const subAng = (sub * Math.PI) / 2 + (c * 0.4);
          const sx = cx + Math.cos(subAng) * 44;
          const sy = cy + Math.sin(subAng) * 44;
          ctx.beginPath();
          ctx.arc(sx, sy, 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // Upward Aerosol Mist Streamlines (Pita aerosol berkilau jelas)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.20)';
    ctx.lineWidth = 2.8;
    ctx.shadowColor = '#00d2ff';
    ctx.shadowBlur = 8;
    const streamSpacing = 140;
    const startStream = Math.floor(cam.x / streamSpacing) - 1;
    const endStream = Math.ceil((cam.x + camera.viewportWidth) / streamSpacing) + 1;

    for (let s = startStream; s <= endStream; s++) {
      const sx = s * streamSpacing - cam.x;
      const waveOffset = Math.sin(t * 2.2 + s * 1.1) * 30;

      ctx.beginPath();
      ctx.moveTo(sx + waveOffset, 0);
      ctx.bezierCurveTo(
        sx + waveOffset + 35, camera.viewportHeight * 0.33,
        sx + waveOffset - 35, camera.viewportHeight * 0.66,
        sx + waveOffset, camera.viewportHeight
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // 2. SALURAN PENCERNAAN (USUS): Karpet Vili 3D, Kripta, & Gelombang Mukosa
  // =========================================================================
  renderGutLandscape(ctx, camera, organDef) {
    const cam = camera.getRenderOffset();
    const t = this.animTime;

    // Peristaltic Wave Ripple (Gelombang kontraksi otot dinding usus HD)
    ctx.save();
    const rippleX = ((t * 90) % (camera.worldWidth)) - cam.x;
    const gradRipple = ctx.createLinearGradient(rippleX - 120, 0, rippleX + 120, 0);
    gradRipple.addColorStop(0, 'rgba(42, 157, 143, 0)');
    gradRipple.addColorStop(0.5, 'rgba(82, 183, 136, 0.25)');
    gradRipple.addColorStop(1, 'rgba(42, 157, 143, 0)');
    ctx.fillStyle = gradRipple;
    ctx.fillRect(rippleX - 120, 0, 240, camera.viewportHeight);
    ctx.restore();

    // Intestinal Villi Rows (Karpet Vili Usus 3D beludru menonjol rapat)
    ctx.save();
    const villiSpacing = 75; // Rapat & bertekstur
    const startV = Math.floor(cam.y / villiSpacing) - 1;
    const endV = Math.ceil((cam.y + camera.viewportHeight) / villiSpacing) + 1;

    for (let v = startV; v <= endV; v++) {
      const vy = v * villiSpacing - cam.y;

      // 3D Villus Ridge with mucosal gradient highlight
      const wave = Math.sin(t * 2 + v * 0.8) * 16;
      ctx.strokeStyle = 'rgba(42, 157, 143, 0.35)';
      ctx.fillStyle = 'rgba(42, 157, 143, 0.10)';
      ctx.lineWidth = 3.2;
      ctx.shadowColor = '#2a9d8f';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(-cam.x, vy + wave);
      for (let x = 0; x <= camera.viewportWidth + 60; x += 50) {
        const villusHeight = Math.sin((x + cam.x) * 0.025 + v) * 38;
        ctx.lineTo(x, vy + wave + villusHeight);
      }
      ctx.stroke();

      // Goblet Cells / Crypts of Lieberkühn (Pori sekresi mukus berlendir keemasan)
      ctx.fillStyle = 'rgba(233, 196, 106, 0.35)';
      ctx.shadowColor = '#e9c46a';
      ctx.shadowBlur = 6;
      for (let x = 25; x <= camera.viewportWidth; x += 110) {
        ctx.beginPath();
        ctx.arc(x, vy + wave + 8, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // 3. EPIDERMIS / LUKA KULIT: Anyaman Fibrin Clot Emas & Lempeng Keratin HD
  // =========================================================================
  renderSkinLandscape(ctx, camera, organDef) {
    const cam = camera.getRenderOffset();
    const t = this.animTime;

    // Fibrin Clot Net (Jaring benang fibrin pembekuan darah berkontras tinggi)
    ctx.save();
    ctx.strokeStyle = 'rgba(231, 111, 81, 0.38)';
    ctx.lineWidth = 2.6;
    ctx.shadowColor = '#e76f51';
    ctx.shadowBlur = 10;

    const meshSpacing = 160;
    const startX = -(cam.x % meshSpacing) - meshSpacing;

    // Interlocking diagonal fibrin fibers
    for (let x = startX; x < camera.viewportWidth + meshSpacing; x += meshSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + camera.viewportHeight * 0.65, camera.viewportHeight);
      ctx.stroke();
    }
    for (let x = startX + meshSpacing * 2; x > -meshSpacing; x -= meshSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - camera.viewportHeight * 0.65, camera.viewportHeight);
      ctx.stroke();
    }

    // Platelet Aggregations on Fibrin Node Junctions (Gumpalan trombosit menyala)
    ctx.fillStyle = 'rgba(255, 183, 3, 0.45)';
    ctx.shadowColor = '#ffb703';
    ctx.shadowBlur = 8;
    for (let x = startX + 40; x < camera.viewportWidth; x += meshSpacing) {
      for (let y = 60; y < camera.viewportHeight; y += meshSpacing * 0.8) {
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Torn Keratin Fractures (Patahan lempeng keratin kasar)
    ctx.strokeStyle = 'rgba(244, 162, 97, 0.30)';
    ctx.lineWidth = 4;
    const crackSpacing = 320;
    const startCrack = Math.floor(cam.x / crackSpacing) - 1;
    const endCrack = Math.ceil((cam.x + camera.viewportWidth) / crackSpacing) + 1;

    for (let k = startCrack; k <= endCrack; k++) {
      const kx = k * crackSpacing - cam.x;
      ctx.beginPath();
      ctx.moveTo(kx, 0);
      ctx.lineTo(kx + 45, camera.viewportHeight * 0.25);
      ctx.lineTo(kx - 35, camera.viewportHeight * 0.55);
      ctx.lineTo(kx + 55, camera.viewportHeight * 0.85);
      ctx.lineTo(kx, camera.viewportHeight);
      ctx.stroke();
    }

    // Shimmering Serum Exudate Pools (Kolam plasma kaya nutrisi berkilau)
    const puddleSpacing = 380;
    const startPuddleCol = Math.floor(cam.x / puddleSpacing) - 1;
    const endPuddleCol = Math.ceil((cam.x + camera.viewportWidth) / puddleSpacing) + 1;
    const startPuddleRow = Math.floor(cam.y / puddleSpacing) - 1;
    const endPuddleRow = Math.ceil((cam.y + camera.viewportHeight) / puddleSpacing) + 1;

    for (let pc = startPuddleCol; pc <= endPuddleCol; pc++) {
      for (let pr = startPuddleRow; pr <= endPuddleRow; pr++) {
        const px = pc * puddleSpacing + 120 - cam.x;
        const py = pr * puddleSpacing + 180 - cam.y;

        const gradPuddle = ctx.createRadialGradient(px, py, 15, px, py, 95);
        gradPuddle.addColorStop(0, 'rgba(230, 40, 70, 0.25)');
        gradPuddle.addColorStop(0.6, 'rgba(244, 162, 97, 0.12)');
        gradPuddle.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradPuddle;
        ctx.beginPath();
        ctx.ellipse(px, py, 95, 60, 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // 4. PEMBULUH DARAH: Sel Endotel Cobblestone, Tautan Rapat, & Arus Deras HD
  // =========================================================================
  renderBloodstreamLandscape(ctx, camera, organDef) {
    const cam = camera.getRenderOffset();
    const t = this.animTime;

    // Endothelial Cobblestone Tiles (Paving sel endotel polygonal bergaris jelas)
    ctx.save();
    ctx.strokeStyle = 'rgba(230, 57, 70, 0.22)';
    ctx.lineWidth = 1.8;
    const cellW = 140;
    const cellH = 55;

    const startX = -(cam.x % cellW) - cellW;
    const startY = -(cam.y % cellH) - cellH;

    for (let y = startY; y < camera.viewportHeight + cellH; y += cellH) {
      const rowOffset = (Math.floor((y + cam.y) / cellH) % 2 === 0) ? 0 : cellW / 2;
      for (let x = startX + rowOffset; x < camera.viewportWidth + cellW; x += cellW) {
        ctx.strokeRect(x, y, cellW, cellH);

        // Endothelial cell nucleus
        ctx.fillStyle = 'rgba(0, 242, 254, 0.30)';
        ctx.beginPath();
        ctx.ellipse(x + cellW / 2, y + cellH / 2, 7, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Arterial Hemodynamic Torrential Streamlines (Garis arus darah kecepatan tinggi)
    ctx.strokeStyle = 'rgba(230, 57, 70, 0.35)';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#e63946';
    ctx.shadowBlur = 12;

    const streamSpacing = 80;
    const startS = Math.floor(cam.y / streamSpacing) - 1;
    const endS = Math.ceil((cam.y + camera.viewportHeight) / streamSpacing) + 1;

    for (let s = startS; s <= endS; s++) {
      const sy = s * streamSpacing - cam.y;
      const waveY = Math.sin(t * 3.5 + s) * 10;
      ctx.beginPath();
      ctx.moveTo(0, sy + waveY);
      ctx.lineTo(camera.viewportWidth, sy + waveY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // ORGAN-SPECIFIC ARENA BORDERS & TISSUE WALLS
  // =========================================================================
  renderOrganBorders(ctx, camera, theme, organDef) {
    const cam = camera.getRenderOffset();
    const minX = 0 - cam.x;
    const minY = 0 - cam.y;
    const maxX = camera.worldWidth - cam.x;
    const maxY = camera.worldHeight - cam.y;
    const t = this.animTime;

    ctx.save();

    if (theme === 'lungs') {
      // Bronchial Ciliated Wall (Bulu-bulu Silia aktif berdenyut di perbatasan)
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.85)';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 18;
      ctx.strokeRect(minX, minY, camera.worldWidth, camera.worldHeight);

      // Cilia Hair Fringe on borders
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
      ctx.lineWidth = 2.4;
      const step = 20;

      for (let x = Math.max(0, minX); x <= Math.min(camera.viewportWidth, maxX); x += step) {
        const worldX = x + cam.x;
        const wave = Math.sin(t * 6 + worldX * 0.05) * 14;

        if (minY > -30 && minY < camera.viewportHeight + 30) {
          ctx.beginPath();
          ctx.moveTo(x, minY);
          ctx.lineTo(x + wave, minY + 18);
          ctx.stroke();
        }
        if (maxY > -30 && maxY < camera.viewportHeight + 30) {
          ctx.beginPath();
          ctx.moveTo(x, maxY);
          ctx.lineTo(x - wave, maxY - 18);
          ctx.stroke();
        }
      }
    } else if (theme === 'gut') {
      ctx.strokeStyle = 'rgba(42, 157, 143, 0.9)';
      ctx.lineWidth = 7;
      ctx.shadowColor = '#2a9d8f';
      ctx.shadowBlur = 18;
      ctx.strokeRect(minX, minY, camera.worldWidth, camera.worldHeight);

      ctx.fillStyle = 'rgba(42, 157, 143, 0.35)';
      const step = 40;
      for (let x = Math.max(0, minX); x <= Math.min(camera.viewportWidth, maxX); x += step) {
        const wave = Math.sin(t * 3 + x * 0.08) * 10;
        if (minY > -30 && minY < camera.viewportHeight + 30) {
          ctx.beginPath();
          ctx.arc(x, minY + 10 + wave, 16, 0, Math.PI);
          ctx.fill();
        }
        if (maxY > -30 && maxY < camera.viewportHeight + 30) {
          ctx.beginPath();
          ctx.arc(x, maxY - 10 - wave, 16, Math.PI, 0);
          ctx.fill();
        }
      }
    } else if (theme === 'skin') {
      ctx.strokeStyle = 'rgba(231, 111, 81, 0.95)';
      ctx.lineWidth = 7;
      ctx.shadowColor = '#ff3366';
      ctx.shadowBlur = 20;
      ctx.strokeRect(minX, minY, camera.worldWidth, camera.worldHeight);

      ctx.fillStyle = 'rgba(220, 20, 50, 0.65)';
      const step = 32;
      for (let x = Math.max(0, minX); x <= Math.min(camera.viewportWidth, maxX); x += step) {
        const jag = (x % 64 === 0) ? 25 : 12;
        if (minY > -30 && minY < camera.viewportHeight + 30) {
          ctx.beginPath();
          ctx.moveTo(x, minY);
          ctx.lineTo(x + 16, minY + jag);
          ctx.lineTo(x + 32, minY);
          ctx.fill();
        }
        if (maxY > -30 && maxY < camera.viewportHeight + 30) {
          ctx.beginPath();
          ctx.moveTo(x, maxY);
          ctx.lineTo(x + 16, maxY - jag);
          ctx.lineTo(x + 32, maxY);
          ctx.fill();
        }
      }
    } else {
      const pulse = Math.sin(t * 4) * 4;
      ctx.strokeStyle = 'rgba(230, 57, 70, 0.95)';
      ctx.lineWidth = 8 + pulse;
      ctx.shadowColor = '#e63946';
      ctx.shadowBlur = 22;
      ctx.strokeRect(minX, minY, camera.worldWidth, camera.worldHeight);
    }

    ctx.restore();
  }

  // =========================================================================
  // MICROSCOPE OPTICS OVERLAY (HD Lens Vignette & Scientific Micro-Scale)
  // =========================================================================
  renderMicroscopeOptics(ctx, camera) {
    ctx.save();

    // 1. Radial Microscope Lens Vignette (Dark contrast at periphery)
    const vigGrad = ctx.createRadialGradient(
      camera.viewportWidth / 2, camera.viewportHeight / 2, camera.viewportWidth * 0.42,
      camera.viewportWidth / 2, camera.viewportHeight / 2, camera.viewportWidth * 0.78
    );
    vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vigGrad.addColorStop(1, 'rgba(0, 5, 12, 0.55)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, camera.viewportWidth, camera.viewportHeight);

    // 2. Scientific Micro-Scale Reticle watermark (Bottom Left)
    const barX = 25;
    const barY = camera.viewportHeight - 25;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(barX, barY - 4);
    ctx.lineTo(barX, barY);
    ctx.lineTo(barX + 70, barY);
    ctx.lineTo(barX + 70, barY - 4);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '600 10px Rajdhani, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('20 µm // CONFOCAL SCANNER 2500x', barX, barY - 7);

    ctx.restore();
  }
}
