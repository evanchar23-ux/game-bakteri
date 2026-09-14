/**
 * specimenVisualizer.js
 * Generator Ilustrasi Visual Mikroskopik & Foto Spesimen Biologis Resolusi Tinggi
 * Menghasilkan visualisasi sel imun, virion, koloni bakteri, dan kristal nutrisi
 * untuk Halaman Kiri E-Book Atlas Imunologi.
 */

export function getSpecimenIllustrationSVG(visualType) {
  switch (visualType) {
    case 'macrophage':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-macro" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#38ef7d" stop-opacity="0.95"/>
              <stop offset="60%" stop-color="#11998e" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#093834" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-macro" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <!-- Grid Reticle Overlay -->
          <circle cx="160" cy="160" r="140" fill="none" stroke="#2fe7c8" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>
          <circle cx="160" cy="160" r="90" fill="none" stroke="#2fe7c8" stroke-width="0.8" opacity="0.2"/>
          <line x1="160" y1="10" x2="160" y2="40" stroke="#2fe7c8" stroke-width="1.5" opacity="0.4"/>
          <line x1="160" y1="280" x2="160" y2="310" stroke="#2fe7c8" stroke-width="1.5" opacity="0.4"/>
          <line x1="10" y1="160" x2="40" y2="160" stroke="#2fe7c8" stroke-width="1.5" opacity="0.4"/>
          <line x1="280" y1="160" x2="310" y2="160" stroke="#2fe7c8" stroke-width="1.5" opacity="0.4"/>

          <!-- Amoeboid Cell Body (Pseudopodia) -->
          <path d="M160 50 C220 30, 260 80, 250 140 C285 170, 275 230, 220 255 C180 285, 120 270, 80 235 C40 210, 35 150, 70 100 C95 60, 125 70, 160 50 Z"
                fill="url(#grad-macro)" filter="url(#glow-macro)" stroke="#38ef7d" stroke-width="2"/>

          <!-- Kidney-Shaped Nucleus -->
          <path d="M130 110 C165 95, 200 120, 195 160 C190 195, 155 210, 125 190 C105 175, 110 145, 125 130 C135 120, 120 115, 130 110 Z"
                fill="#062e29" stroke="#38ef7d" stroke-width="1.8" opacity="0.9"/>
          <circle cx="140" cy="140" r="10" fill="#2fe7c8" opacity="0.3"/>

          <!-- Phagosomes & Lysosomes -->
          <circle cx="210" cy="110" r="12" fill="#ff3d78" opacity="0.85" stroke="#fff" stroke-width="1"/>
          <circle cx="95" cy="180" r="8" fill="#ffb44d" opacity="0.9"/>
          <circle cx="190" cy="210" r="14" fill="#082b26" stroke="#2fe7c8" stroke-width="1.2"/>
          <circle cx="105" cy="130" r="6" fill="#8b6bff" opacity="0.7"/>

          <!-- Engulfed Microbe in Pseudopod -->
          <g transform="translate(230, 175) rotate(25)">
            <ellipse cx="0" cy="0" rx="14" ry="7" fill="#ff3d78" stroke="#ff80a6" stroke-width="1"/>
            <path d="M-10 0 L10 0" stroke="#fff" stroke-width="1" opacity="0.6"/>
          </g>
          <!-- Cytoplasm Granules -->
          <circle cx="140" cy="80" r="2.5" fill="#38ef7d" opacity="0.7"/>
          <circle cx="170" cy="85" r="3" fill="#38ef7d" opacity="0.6"/>
          <circle cx="175" cy="240" r="3" fill="#38ef7d" opacity="0.7"/>
          <circle cx="75" cy="150" r="2" fill="#38ef7d" opacity="0.6"/>
        </svg>
      `;

    case 'neutrophil':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-neutro" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#ffd200" stop-opacity="0.95"/>
              <stop offset="65%" stop-color="#f7971e" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#5a3103" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-neutro" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#ffb44d" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>
          <circle cx="160" cy="160" r="105" fill="none" stroke="#ffb44d" stroke-width="0.8" opacity="0.2"/>

          <!-- NETs (Extracellular Traps) filigree -->
          <path d="M80 60 Q120 100, 70 140 T40 220" stroke="#ffb44d" stroke-width="1.2" fill="none" opacity="0.45" stroke-dasharray="3 3"/>
          <path d="M240 70 Q210 120, 270 160 T250 250" stroke="#ffb44d" stroke-width="1.2" fill="none" opacity="0.45" stroke-dasharray="3 3"/>

          <!-- Spherical Granulocyte Cell Body -->
          <circle cx="160" cy="160" r="95" fill="url(#grad-neutro)" filter="url(#glow-neutro)" stroke="#ffd200" stroke-width="2"/>

          <!-- Multilobulated Nucleus (3 connected lobes) -->
          <g fill="#3a1c02" stroke="#ffd200" stroke-width="1.5">
            <ellipse cx="130" cy="135" rx="22" ry="18" transform="rotate(-15 130 135)"/>
            <ellipse cx="185" cy="130" rx="20" ry="17" transform="rotate(20 185 130)"/>
            <ellipse cx="160" cy="185" rx="24" ry="19" transform="rotate(5 160 185)"/>
            <!-- Nuclear Bridges -->
            <path d="M148 135 Q160 125, 168 132" stroke="#3a1c02" stroke-width="10" stroke-linecap="round"/>
            <path d="M178 145 Q180 165, 172 175" stroke="#3a1c02" stroke-width="9" stroke-linecap="round"/>
            <path d="M140 148 Q145 170, 150 178" stroke="#3a1c02" stroke-width="9" stroke-linecap="round"/>
          </g>

          <!-- Toxic Antimicrobial Granules -->
          <g fill="#fff" opacity="0.85">
            <circle cx="105" cy="120" r="2.5"/><circle cx="115" cy="160" r="3"/><circle cx="120" cy="205" r="2.5"/>
            <circle cx="210" cy="125" r="2.5"/><circle cx="215" cy="165" r="3"/><circle cx="195" cy="200" r="2.5"/>
            <circle cx="160" cy="95" r="3"/><circle cx="160" cy="230" r="3"/>
          </g>
        </svg>
      `;

    case 'bcell':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-bcell" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#4facfe" stop-opacity="0.95"/>
              <stop offset="65%" stop-color="#00f2fe" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#02294f" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-bcell" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#00f2fe" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Surface B-Cell Receptors (BCR / Antibodies Y-shape) -->
          <g stroke="#00f2fe" stroke-width="2" fill="none">
            <!-- Top BCR -->
            <path d="M160 80 L160 58 M160 58 L150 46 M160 58 L170 46"/>
            <!-- Right BCR -->
            <path d="M240 160 L262 160 M262 160 L274 150 M262 160 L274 170"/>
            <!-- Bottom BCR -->
            <path d="M160 240 L160 262 M160 262 L150 274 M160 262 L170 274"/>
            <!-- Left BCR -->
            <path d="M80 160 L58 160 M58 160 L46 150 M58 160 L46 170"/>
            <!-- Angled BCRs -->
            <path d="M215 105 L232 88 M232 88 L244 86 M232 88 L234 100"/>
            <path d="M105 215 L88 232 M88 232 L76 234 M88 232 L86 220"/>
            <path d="M215 215 L232 232 M232 232 L244 230 M232 232 L230 244"/>
            <path d="M105 105 L88 88 M88 88 L76 90 M88 88 L90 76"/>
          </g>

          <!-- Main Lymphocyte Body -->
          <circle cx="160" cy="160" r="80" fill="url(#grad-bcell)" filter="url(#glow-bcell)" stroke="#00f2fe" stroke-width="2"/>

          <!-- Large Dense Lymphocyte Nucleus -->
          <circle cx="160" cy="160" r="56" fill="#011b36" stroke="#00f2fe" stroke-width="1.5" opacity="0.9"/>
          <!-- Chromatin condensations -->
          <circle cx="145" cy="145" r="16" fill="#00f2fe" opacity="0.15"/>
          <circle cx="175" cy="170" r="14" fill="#00f2fe" opacity="0.12"/>
          <circle cx="150" cy="180" r="10" fill="#00f2fe" opacity="0.18"/>

          <!-- Secreted Soluble Antibodies Floating -->
          <g stroke="#00f2fe" stroke-width="1.6" fill="none" opacity="0.75">
            <path d="M260 80 L260 70 M260 70 L253 62 M260 70 L267 62"/>
            <path d="M50 240 L50 230 M50 230 L43 222 M50 230 L57 222"/>
          </g>
        </svg>
      `;

    case 'tcell':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-tcell" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#b92b27" stop-opacity="0.95"/>
              <stop offset="65%" stop-color="#1565c0" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#0a192f" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-tcell" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#ff3d78" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- TCR & CD8 Receptor Arrays -->
          <g stroke="#ff3d78" stroke-width="2" fill="none">
            <line x1="160" y1="78" x2="160" y2="52"/><circle cx="160" cy="50" r="4" fill="#ff3d78"/>
            <line x1="242" y1="160" x2="268" y2="160"/><circle cx="270" cy="160" r="4" fill="#ff3d78"/>
            <line x1="160" y1="242" x2="160" y2="268"/><circle cx="160" cy="270" r="4" fill="#ff3d78"/>
            <line x1="78" y1="160" x2="52" y2="160"/><circle cx="50" cy="160" r="4" fill="#ff3d78"/>
            <line x1="218" y1="102" x2="238" y2="82"/><circle cx="240" cy="80" r="3.5" fill="#ff3d78"/>
            <line x1="102" y1="218" x2="82" y2="238"/><circle cx="80" cy="240" r="3.5" fill="#ff3d78"/>
          </g>

          <!-- Cytotoxic T-Cell Body -->
          <circle cx="160" cy="160" r="82" fill="url(#grad-tcell)" filter="url(#glow-tcell)" stroke="#ff3d78" stroke-width="2"/>

          <!-- Nucleus with indented rim -->
          <path d="M130 115 C170 110, 210 135, 205 180 C200 215, 155 215, 125 190 C105 170, 110 130, 130 115 Z"
                fill="#1c0710" stroke="#ff3d78" stroke-width="1.4" opacity="0.9"/>

          <!-- Perforin & Granzyme Secretory Granules (Ready to fire) -->
          <g fill="#ff3d78" opacity="0.9">
            <circle cx="185" cy="140" r="5" stroke="#fff" stroke-width="0.8"/>
            <circle cx="170" cy="130" r="4.5"/>
            <circle cx="195" cy="160" r="5" stroke="#fff" stroke-width="0.8"/>
            <circle cx="185" cy="180" r="4"/>
          </g>
          <!-- Perforin Dart Beams -->
          <g stroke="#ff3d78" stroke-width="1.5" opacity="0.6">
            <line x1="225" y1="145" x2="255" y2="135" stroke-dasharray="2 2"/>
            <line x1="225" y1="165" x2="260" y2="170" stroke-dasharray="2 2"/>
          </g>
        </svg>
      `;

    case 'influenza':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-flu" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#ff758c" stop-opacity="0.95"/>
              <stop offset="70%" stop-color="#ff3d78" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#4a041a" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-flu" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#ff3d78" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Hemagglutinin (HA - rod) and Neuraminidase (NA - mushroom) surface spikes -->
          <g stroke="#ff3d78" stroke-width="2.2">
            <!-- 12 radial spikes around envelope -->
            <g transform="translate(160, 160)">
              ${Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                const isHA = i % 2 === 0;
                return `
                  <g transform="rotate(${angle})">
                    <line x1="0" y1="-82" x2="0" y2="-108"/>
                    ${isHA ? '<rect x="-3" y="-114" width="6" height="8" rx="2" fill="#ff758c"/>' : '<circle cx="0" cy="-110" r="5" fill="#ffb44d"/>'}
                  </g>
                `;
              }).join('')}
            </g>
          </g>

          <!-- Lipid Bilayer Viral Envelope -->
          <circle cx="160" cy="160" r="82" fill="url(#grad-flu)" filter="url(#glow-flu)" stroke="#ff758c" stroke-width="2"/>
          <circle cx="160" cy="160" r="74" fill="none" stroke="#ffb44d" stroke-width="1.2" opacity="0.4" stroke-dasharray="4 3"/>

          <!-- 8 Segmented ssRNA Viral Genomes (Ribonucleoprotein complexes) -->
          <g stroke="#fff" stroke-width="2.2" fill="none" opacity="0.9">
            <path d="M140 120 Q145 140, 138 160 Q143 180, 138 200"/>
            <path d="M152 115 Q158 135, 150 160 Q156 185, 150 205"/>
            <path d="M165 115 Q171 135, 163 160 Q169 185, 163 205"/>
            <path d="M178 120 Q183 140, 176 160 Q181 180, 176 200"/>
            <path d="M125 135 Q130 155, 126 175 Q131 185, 127 195"/>
            <path d="M190 135 Q195 155, 191 175 Q196 185, 192 195"/>
            <circle cx="160" cy="135" r="2.5" fill="#ffb44d"/>
            <circle cx="160" cy="180" r="2.5" fill="#ffb44d"/>
          </g>
        </svg>
      `;

    case 'coronavirus':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-covid" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#ff416c" stop-opacity="0.95"/>
              <stop offset="65%" stop-color="#ff4b2b" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#3d0300" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-covid" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#ff416c" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Crown-like Spike Glycoproteins (S-Trimer) -->
          <g fill="#ff416c" stroke="#ff758c" stroke-width="1.5">
            <g transform="translate(160, 160)">
              ${Array.from({ length: 18 }).map((_, i) => {
                const angle = (i * 360) / 18;
                return `
                  <g transform="rotate(${angle})">
                    <line x1="0" y1="-78" x2="0" y2="-112" stroke="#ff416c" stroke-width="3"/>
                    <!-- Trimeric clover-leaf head -->
                    <circle cx="-4" cy="-114" r="4"/>
                    <circle cx="4" cy="-114" r="4"/>
                    <circle cx="0" cy="-119" r="4.5"/>
                  </g>
                `;
              }).join('')}
            </g>
          </g>

          <!-- Viral Lipid Membrane Envelope -->
          <circle cx="160" cy="160" r="78" fill="url(#grad-covid)" filter="url(#glow-covid)" stroke="#ff758c" stroke-width="2.5"/>

          <!-- Coiled Single-Strand (+) RNA Genome with Nucleocapsid (N) -->
          <path d="M125 150 C120 120, 160 115, 175 130 C190 145, 140 165, 155 185 C170 205, 200 180, 185 160 C170 140, 145 180, 130 165 Z"
                fill="none" stroke="#ffe600" stroke-width="3.5" stroke-linecap="round" filter="drop-shadow(0 0 6px #ffe600)"/>

          <!-- M & E Proteins embedded in membrane -->
          <circle cx="110" cy="130" r="3" fill="#00f2fe"/>
          <circle cx="210" cy="130" r="3" fill="#00f2fe"/>
          <circle cx="120" cy="200" r="3" fill="#00f2fe"/>
          <circle cx="200" cy="200" r="3" fill="#00f2fe"/>
        </svg>
      `;

    case 'rhinovirus':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-rhino" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.95"/>
              <stop offset="70%" stop-color="#4facfe" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#051937" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-rhino" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#00f2fe" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Naked Icosahedral Capsid Facets -->
          <polygon points="160,70 235,115 235,205 160,250 85,205 85,115"
                   fill="url(#grad-rhino)" filter="url(#glow-rhino)" stroke="#00f2fe" stroke-width="2.5"/>

          <!-- Capsid Triangular Facet Tessellation (VP1, VP2, VP3, VP4) -->
          <g stroke="#00f2fe" stroke-width="1.5" fill="none" opacity="0.7">
            <line x1="160" y1="70" x2="160" y2="250"/>
            <line x1="85" y1="115" x2="235" y2="205"/>
            <line x1="85" y1="205" x2="235" y2="115"/>
            <!-- Inner Facet Center -->
            <polygon points="160,115 197,140 197,180 160,205 123,180 123,140" stroke="#fff" stroke-width="1.5"/>
          </g>

          <!-- Core (+) ssRNA -->
          <circle cx="160" cy="160" r="28" fill="#032042" stroke="#00f2fe" stroke-width="1.5"/>
          <path d="M150 150 Q160 140, 170 150 T160 170" fill="none" stroke="#fff" stroke-width="2"/>
        </svg>
      `;

    case 'streptococcus':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-strep" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#b06ab3" stop-opacity="0.95"/>
              <stop offset="70%" stop-color="#4568dc" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#141838" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-strep" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#4568dc" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Polysaccharide Slime Capsule Halo (Outer defense) -->
          <path d="M60 195 C55 130, 95 100, 140 100 C190 95, 230 110, 260 140 C280 165, 275 210, 240 225 C200 240, 150 235, 110 230 C75 225, 62 215, 60 195 Z"
                fill="rgba(69, 104, 220, 0.15)" stroke="#4568dc" stroke-width="1.5" stroke-dasharray="5 4"/>

          <!-- Diplococcus in short chains -->
          <g filter="url(#glow-strep)" stroke="#b06ab3" stroke-width="2">
            <!-- Coccus 1 -->
            <circle cx="95" cy="180" r="26" fill="url(#grad-strep)"/>
            <!-- Coccus 2 (Diplococcus pair) -->
            <circle cx="138" cy="155" r="28" fill="url(#grad-strep)"/>
            <!-- Coccus 3 -->
            <circle cx="182" cy="140" r="27" fill="url(#grad-strep)"/>
            <!-- Coccus 4 -->
            <circle cx="225" cy="160" r="25" fill="url(#grad-strep)"/>
          </g>

          <!-- Thick Gram-Positive Peptidoglycan Cell Wall Highlights -->
          <g fill="none" stroke="#fff" stroke-width="1" opacity="0.4">
            <circle cx="95" cy="180" r="21"/>
            <circle cx="138" cy="155" r="23"/>
            <circle cx="182" cy="140" r="22"/>
            <circle cx="225" cy="160" r="20"/>
          </g>
          <!-- Bacterial Nucleoid DNA loop -->
          <path d="M132 150 Q142 145, 144 160" stroke="#ffb44d" stroke-width="2" fill="none"/>
          <path d="M176 135 Q186 130, 188 145" stroke="#ffb44d" stroke-width="2" fill="none"/>
        </svg>
      `;

    case 'staphylococcus':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-staph" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffe259" stop-opacity="1"/>
              <stop offset="60%" stop-color="#ffa751" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#4d2c00" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-staph" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#ffe259" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Sticky Biofilm Matrix Sheath -->
          <path d="M70 140 C65 90, 130 65, 180 75 C240 85, 270 140, 255 195 C240 245, 175 260, 120 245 C75 230, 75 190, 70 140 Z"
                fill="rgba(255, 167, 81, 0.12)" stroke="#ffa751" stroke-width="1.2" stroke-dasharray="4 4"/>

          <!-- Grape-like Golden Cluster (Staphylococcal cluster) -->
          <g filter="url(#glow-staph)" stroke="#ffe259" stroke-width="1.8">
            <circle cx="130" cy="115" r="24" fill="url(#grad-staph)"/>
            <circle cx="175" cy="110" r="23" fill="url(#grad-staph)"/>
            <circle cx="215" cy="130" r="22" fill="url(#grad-staph)"/>
            <circle cx="105" cy="150" r="22" fill="url(#grad-staph)"/>
            <circle cx="150" cy="150" r="25" fill="url(#grad-staph)"/>
            <circle cx="195" cy="160" r="24" fill="url(#grad-staph)"/>
            <circle cx="120" cy="190" r="23" fill="url(#grad-staph)"/>
            <circle cx="165" cy="195" r="24" fill="url(#grad-staph)"/>
            <circle cx="205" cy="205" r="21" fill="url(#grad-staph)"/>
            <circle cx="150" cy="235" r="20" fill="url(#grad-staph)"/>
          </g>

          <!-- Golden Gloss Reflexes -->
          <circle cx="145" cy="142" r="6" fill="#fff" opacity="0.6"/>
          <circle cx="125" cy="108" r="5" fill="#fff" opacity="0.6"/>
          <circle cx="170" cy="103" r="5" fill="#fff" opacity="0.6"/>
        </svg>
      `;

    case 'ecoli':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-ecoli" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#11998e" stop-opacity="0.95"/>
              <stop offset="70%" stop-color="#38ef7d" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#04382c" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-ecoli" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#38ef7d" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Peritrichous Flagella (Whiplike motile tails) -->
          <g stroke="#38ef7d" stroke-width="1.6" fill="none" opacity="0.75">
            <path d="M85 130 C50 110, 30 140, 10 120"/>
            <path d="M85 160 C40 160, 20 190, 5 180"/>
            <path d="M85 190 C50 210, 30 200, 15 230"/>
            <path d="M235 130 C270 100, 290 130, 310 110"/>
            <path d="M235 170 C280 180, 295 160, 315 190"/>
            <path d="M160 100 C170 60, 150 40, 165 15"/>
            <path d="M160 220 C150 260, 170 280, 155 305"/>
          </g>

          <!-- Gram-Negative Bacillus (Rod-shaped capsule) -->
          <rect x="90" y="115" width="140" height="90" rx="45"
                fill="url(#grad-ecoli)" filter="url(#glow-ecoli)" stroke="#38ef7d" stroke-width="2.5"/>

          <!-- Outer LPS Membrane & Peptidoglycan Layer -->
          <rect x="96" y="121" width="128" height="78" rx="39"
                fill="none" stroke="#2fe7c8" stroke-width="1.2" opacity="0.5"/>

          <!-- Circular Bacterial Chromosome (Nucleoid) -->
          <path d="M125 150 Q145 135, 160 150 T195 150 Q180 170, 160 165 T125 150"
                fill="none" stroke="#ffb44d" stroke-width="2.5" stroke-dasharray="4 2"/>

          <!-- Plasmids (Circular extra DNA) -->
          <circle cx="130" cy="175" r="7" fill="none" stroke="#ff3d78" stroke-width="1.8"/>
          <circle cx="190" cy="135" r="5" fill="none" stroke="#ff3d78" stroke-width="1.5"/>
        </svg>
      `;

    case 'vitc':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-vitc" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#ffb347" stop-opacity="1"/>
              <stop offset="70%" stop-color="#ffcc33" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#7a4b00" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-vitc" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#ffcc33" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Antioxidant Electron Wave Glow -->
          <circle cx="160" cy="160" r="110" fill="none" stroke="#ffcc33" stroke-width="1" opacity="0.3"/>
          <circle cx="160" cy="160" r="75" fill="none" stroke="#ffb347" stroke-width="1.5" opacity="0.4"/>

          <!-- Chemical Molecular Lactone Ring Geometry -->
          <polygon points="160,85 225,125 205,205 115,205 95,125"
                   fill="url(#grad-vitc)" filter="url(#glow-vitc)" stroke="#ffcc33" stroke-width="2.5"/>

          <!-- Hydroxyl (-OH) and Carbonyl (=O) chemical branches -->
          <g stroke="#fff" stroke-width="2.2" fill="none">
            <line x1="160" y1="85" x2="160" y2="55"/><circle cx="160" cy="50" r="5" fill="#ff3d78"/>
            <line x1="225" y1="125" x2="255" y2="110"/><circle cx="260" cy="107" r="5" fill="#00f2fe"/>
            <line x1="205" y1="205" x2="230" y2="235"/><circle cx="234" cy="240" r="5" fill="#00f2fe"/>
            <line x1="115" y1="205" x2="90" y2="235"/><circle cx="86" cy="240" r="5" fill="#00f2fe"/>
            <line x1="95" y1="125" x2="65" y2="110"/><circle cx="60" cy="107" r="5" fill="#00f2fe"/>
          </g>
          <!-- Center Ascorbate Core -->
          <circle cx="160" cy="155" r="18" fill="#543001" stroke="#ffcc33" stroke-width="1.5"/>
          <text x="160" y="161" fill="#ffcc33" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">C6H8O6</text>
        </svg>
      `;

    case 'vitd':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-vitd" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#fff200" stop-opacity="1"/>
              <stop offset="65%" stop-color="#ff9900" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#542800" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-vitd" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#fff200" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Solar Ray Steroid Activation Aura -->
          <g stroke="#fff200" stroke-width="1.8" opacity="0.5">
            ${Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              return `<line x1="160" y1="160" x2="${160 + 130 * Math.cos((angle * Math.PI) / 180)}" y2="${160 + 130 * Math.sin((angle * Math.PI) / 180)}" stroke-dasharray="6 8"/>`;
            }).join('')}
          </g>

          <!-- Cholecalciferol Secosteroid 4-Ring Complex (A, B, C, D rings) -->
          <g filter="url(#glow-vitd)" stroke="#fff200" stroke-width="2" fill="url(#grad-vitd)">
            <polygon points="110,135 135,120 160,135 160,165 135,180 110,165"/>
            <polygon points="160,135 185,120 210,135 210,165 185,180 160,165"/>
            <polygon points="185,180 210,165 235,180 235,210 210,225 185,210"/>
          </g>
          <!-- Aliphatic Side Chain Tail -->
          <path d="M235 180 L260 170 L275 190 L295 180" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="110" cy="165" r="6" fill="#00f2fe" stroke="#fff" stroke-width="1"/>
        </svg>
      `;

    case 'zinc':
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <defs>
            <radialGradient id="grad-zinc" cx="45%" cy="45%" r="55%">
              <stop offset="0%" stop-color="#00f2fe" stop-opacity="1"/>
              <stop offset="65%" stop-color="#4facfe" stop-opacity="0.9"/>
              <stop offset="100%" stop-color="#021c3b" stop-opacity="0.95"/>
            </radialGradient>
            <filter id="glow-zinc" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <circle cx="160" cy="160" r="140" fill="none" stroke="#00f2fe" stroke-width="1" stroke-dasharray="4 6" opacity="0.25"/>

          <!-- Electron Orbital Shells (2, 8, 18, 2) -->
          <ellipse cx="160" cy="160" rx="125" ry="45" fill="none" stroke="#00f2fe" stroke-width="1.2" opacity="0.3" transform="rotate(30 160 160)"/>
          <ellipse cx="160" cy="160" rx="125" ry="45" fill="none" stroke="#00f2fe" stroke-width="1.2" opacity="0.3" transform="rotate(-30 160 160)"/>
          <ellipse cx="160" cy="160" rx="125" ry="45" fill="none" stroke="#00f2fe" stroke-width="1.2" opacity="0.3" transform="rotate(90 160 160)"/>

          <!-- Orbital Valence Electrons -->
          <circle cx="80" cy="115" r="4" fill="#fff" filter="drop-shadow(0 0 6px #00f2fe)"/>
          <circle cx="240" cy="205" r="4" fill="#fff" filter="drop-shadow(0 0 6px #00f2fe)"/>
          <circle cx="225" cy="100" r="4" fill="#fff" filter="drop-shadow(0 0 6px #00f2fe)"/>
          <circle cx="95" cy="220" r="4" fill="#fff" filter="drop-shadow(0 0 6px #00f2fe)"/>

          <!-- Central Zinc Ion Core (Zn²⁺) -->
          <circle cx="160" cy="160" r="48" fill="url(#grad-zinc)" filter="url(#glow-zinc)" stroke="#00f2fe" stroke-width="2.5"/>
          <text x="160" y="165" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle" font-family="'Space Grotesk', sans-serif">Zn²⁺</text>
          <text x="160" y="180" fill="#00f2fe" font-size="10" font-weight="bold" text-anchor="middle" font-family="monospace">Z = 30</text>
        </svg>
      `;

    default:
      return `
        <svg viewBox="0 0 320 320" width="100%" height="100%" class="specimen-svg">
          <circle cx="160" cy="160" r="70" fill="#2fe7c8" opacity="0.8"/>
          <text x="160" y="165" fill="#000" font-size="28" text-anchor="middle">🔬</text>
        </svg>
      `;
  }
}
