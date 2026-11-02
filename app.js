/**
 * US Senate November 2026 Election Simulator & Interactive Map Engine
 * Features all 35 contested seats (33 Regular Class II + Ohio & Florida Special Elections)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Simulation State: Map of stateCode -> 'Republican' | 'Democrat' | 'Tossup'
  let simOutcomes = {};
  let currentSelectedState = 'OH'; // Spotlight Ohio special election by default!
  let currentViewMode = '2026_focus'; // '2026_focus' | 'all_delegations'
  let instantFlipOnClick = false; // toggle for 1-click flip directly on map
  let currentBgFilter = 'all'; // 'all' | 'battlegrounds' | 'specials' | 'flipped' | 'tossups'
  let searchQuery = '';

  // Default predictions requested by user: Alaska, Texas, Ohio, North Carolina, and Maine won by Democrats!
  const DEFAULT_DEM_PREDICTIONS = ['AK', 'TX', 'OH', 'NC', 'ME'];

  // Initialize simulation with user's prediction as default
  function initSimulation() {
    Object.keys(CONTESTS_2026).forEach(code => {
      if (DEFAULT_DEM_PREDICTIONS.includes(code)) {
        simOutcomes[code] = 'Democrat';
      } else {
        simOutcomes[code] = CONTESTS_2026[code].baselineParty;
      }
    });
  }

  // DOM Elements
  const mapSvg = document.getElementById('us-senate-map');
  const tooltip = document.getElementById('map-tooltip');
  
  // Scoreboard Elements
  const gopScoreEl = document.getElementById('score-gop-count');
  const demScoreEl = document.getElementById('score-dem-count');
  const gopNetBadge = document.getElementById('gop-net-badge');
  const demNetBadge = document.getElementById('dem-net-badge');
  const tossupsBadge = document.getElementById('tossups-count-badge');
  const majorityBanner = document.getElementById('majority-outcome-banner');
  const meterGopSeg = document.getElementById('meter-gop-seg');
  const meterDemSeg = document.getElementById('meter-dem-seg');
  const meterTossupSeg = document.getElementById('meter-tossup-seg');

  // Inspector Elements
  const inspectorPlaceholder = document.getElementById('inspector-placeholder');
  const inspectorContent = document.getElementById('inspector-content');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');

  // Battlegrounds List
  const battlegroundGrid = document.getElementById('battleground-roster-grid');

  // Search & Controls
  const searchInput = document.getElementById('state-search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const viewModeBtns = document.querySelectorAll('.view-mode-btn');
  const scenarioBtns = document.querySelectorAll('.preset-btn');
  const bgFilterChips = document.querySelectorAll('.bg-filter-chip');
  const smallStateChips = document.querySelectorAll('.small-state-chip');
  const instantFlipToggle = document.getElementById('instant-flip-toggle');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');

  // Compute Current Projected Chamber Balance
  function computeBalance() {
    let gopWins = 0;
    let demWins = 0;
    let tossups = 0;
    let flippedToDem = [];
    let flippedToGop = [];

    Object.keys(CONTESTS_2026).forEach(code => {
      const outcome = simOutcomes[code];
      const baseline = CONTESTS_2026[code].baselineParty;

      if (outcome === 'Republican') {
        gopWins++;
        if (baseline === 'Democrat') flippedToGop.push(code);
      } else if (outcome === 'Democrat') {
        demWins++;
        if (baseline === 'Republican') flippedToDem.push(code);
      } else if (outcome === 'Tossup') {
        tossups++;
      }
    });

    const totalGop = SIMULATION_BASELINE.safeRepublicans + gopWins;
    const totalDem = SIMULATION_BASELINE.safeDemCoalition + demWins;
    const netGop = totalGop - 53;
    const netDem = totalDem - 47;

    return {
      totalGop,
      totalDem,
      tossups,
      gopWins,
      demWins,
      netGop,
      netDem,
      flippedToDem,
      flippedToGop
    };
  }

  // Update Chamber Balance Header & Meter
  function renderScoreboard() {
    const balance = computeBalance();

    // Numbers
    if (gopScoreEl) gopScoreEl.textContent = balance.totalGop;
    if (demScoreEl) demScoreEl.textContent = balance.totalDem;

    // Net Badges
    if (gopNetBadge) {
      if (balance.netGop > 0) {
        gopNetBadge.textContent = `+${balance.netGop} NET`;
        gopNetBadge.className = 'score-net-badge badge-plus-gop';
      } else if (balance.netGop < 0) {
        gopNetBadge.textContent = `${balance.netGop} NET`;
        gopNetBadge.className = 'score-net-badge badge-neutral';
      } else {
        gopNetBadge.textContent = 'NO NET CHG';
        gopNetBadge.className = 'score-net-badge badge-neutral';
      }
    }

    if (demNetBadge) {
      if (balance.netDem > 0) {
        demNetBadge.textContent = `+${balance.netDem} NET`;
        demNetBadge.className = 'score-net-badge badge-plus-dem';
      } else if (balance.netDem < 0) {
        demNetBadge.textContent = `${balance.netDem} NET`;
        demNetBadge.className = 'score-net-badge badge-neutral';
      } else {
        demNetBadge.textContent = 'NO NET CHG';
        demNetBadge.className = 'score-net-badge badge-neutral';
      }
    }

    // Tossup indicator
    if (tossupsBadge) {
      if (balance.tossups > 0) {
        tossupsBadge.textContent = `${balance.tossups} Tossup${balance.tossups > 1 ? 's' : ''}`;
        tossupsBadge.classList.add('visible');
      } else {
        tossupsBadge.classList.remove('visible');
      }
    }

    // Meter Bar Segments
    if (meterGopSeg) {
      meterGopSeg.style.width = `${balance.totalGop}%`;
      meterGopSeg.textContent = balance.totalGop >= 15 ? `${balance.totalGop} GOP` : `${balance.totalGop}`;
    }
    if (meterDemSeg) {
      meterDemSeg.style.width = `${balance.totalDem}%`;
      meterDemSeg.textContent = balance.totalDem >= 15 ? `${balance.totalDem} DEM` : `${balance.totalDem}`;
    }
    if (meterTossupSeg) {
      meterTossupSeg.style.width = `${balance.tossups}%`;
      meterTossupSeg.textContent = balance.tossups >= 8 ? `${balance.tossups} Tossups` : (balance.tossups > 0 ? `${balance.tossups}` : '');
      meterTossupSeg.style.display = balance.tossups > 0 ? 'flex' : 'none';
    }

    // Majority Banner
    if (majorityBanner) {
      if (balance.totalGop >= 51) {
        const lead = balance.totalGop - 51;
        majorityBanner.className = 'majority-outcome-banner banner-gop';
        majorityBanner.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>🏆 Projected Republican Majority: ${balance.totalGop} Seats (+${lead} over threshold)</span>
        `;
      } else if (balance.totalDem >= 51) {
        const lead = balance.totalDem - 51;
        majorityBanner.className = 'majority-outcome-banner banner-dem';
        majorityBanner.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>🏆 Projected Democratic Majority: ${balance.totalDem} Seats (+${lead} over threshold)</span>
        `;
      } else if (balance.totalGop === 50 && balance.totalDem === 50) {
        majorityBanner.className = 'majority-outcome-banner banner-tie';
        majorityBanner.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>⚖️ Projected 50–50 Tie (Chamber Control Decided by Vice President)</span>
        `;
      } else {
        const gopNeeded = 51 - balance.totalGop;
        const demNeeded = 51 - balance.totalDem;
        majorityBanner.className = 'majority-outcome-banner banner-tossup';
        majorityBanner.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${balance.tossups} Tossup${balance.tossups > 1 ? 's' : ''} Remaining &bull; GOP needs ${gopNeeded}, DEM needs ${demNeeded} to clinch</span>
        `;
      }
    }
  }

  // Update SVG Map State Fills & Styles based on 2026 Simulation
  function renderMapFills() {
    document.body.classList.toggle('mode-2026-focus', currentViewMode === '2026_focus');

    Object.keys(SENATE_DATA).forEach(code => {
      const path = document.getElementById(`state-${code}`);
      if (!path) return;

      const hasRace = CONTESTS_2026.hasOwnProperty(code);

      if (hasRace) {
        path.classList.add('contested');
        path.classList.remove('non-contested');

        const outcome = simOutcomes[code];
        const baseline = CONTESTS_2026[code].baselineParty;
        const isFlipped = outcome !== 'Tossup' && outcome !== baseline;

        if (outcome === 'Republican') {
          path.setAttribute('fill', 'url(#grad-rep)');
        } else if (outcome === 'Democrat') {
          path.setAttribute('fill', 'url(#grad-dem)');
        } else if (outcome === 'Tossup') {
          path.setAttribute('fill', 'url(#pattern-split-rep-ind)');
        }

        path.classList.toggle('flipped-state', isFlipped);
      } else {
        path.classList.remove('contested', 'flipped-state');
        path.classList.add('non-contested');

        if (currentViewMode === '2026_focus') {
          // Subtle muted baseline for safe states
          const info = SENATE_DATA[code];
          if (info.status === 'both_rep') {
            path.setAttribute('fill', '#7f1d1d');
          } else if (info.status === 'both_dem') {
            path.setAttribute('fill', '#1e3a8a');
          } else {
            path.setAttribute('fill', '#334155');
          }
        } else {
          // Full Chamber Delegations View
          const info = SENATE_DATA[code];
          if (info.status === 'both_rep') path.setAttribute('fill', 'url(#grad-rep)');
          else if (info.status === 'both_dem') path.setAttribute('fill', 'url(#grad-dem)');
          else if (info.status === 'split_rep_dem') path.setAttribute('fill', 'url(#pattern-split-rep-dem)');
          else if (info.status === 'split_rep_ind') path.setAttribute('fill', 'url(#pattern-split-rep-ind)');
          else if (info.status === 'dem_and_ind') path.setAttribute('fill', 'url(#pattern-split-dem-ind)');
        }
      }
    });
  }

  // Set Outcome for a 2026 Contest
  function setContestOutcome(code, outcome) {
    if (!CONTESTS_2026[code]) return;
    simOutcomes[code] = outcome;

    // Re-render UI
    renderScoreboard();
    renderMapFills();
    renderInspector(code);
    renderBattlegroundGrid();
    updatePresetButtonsState();
  }

  // Toggle/Flip a Contest between Republican and Democrat
  function flipContest(code) {
    if (!CONTESTS_2026[code]) return;
    const current = simOutcomes[code];
    const nextOutcome = current === 'Republican' ? 'Democrat' : 'Republican';
    setContestOutcome(code, nextOutcome);
  }

  // Setup Map Event Listeners
  function setupMapInteractions() {
    const statePaths = document.querySelectorAll('.state-path');

    statePaths.forEach(path => {
      const stateCode = path.getAttribute('data-state');

      // Accessibility attributes
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');

      // Mouse Events
      path.addEventListener('mouseenter', (e) => handleStateHover(e, stateCode));
      path.addEventListener('mousemove', (e) => handleStateMove(e));
      path.addEventListener('mouseleave', handleStateLeave);

      path.addEventListener('click', () => {
        if (instantFlipOnClick && CONTESTS_2026[stateCode]) {
          flipContest(stateCode);
        }
        selectState(stateCode);
      });

      // Keyboard
      path.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (instantFlipOnClick && CONTESTS_2026[stateCode]) {
            flipContest(stateCode);
          }
          selectState(stateCode);
        }
      });
    });
  }

  // Hover Tooltip
  function handleStateHover(e, stateCode) {
    const hasRace = CONTESTS_2026.hasOwnProperty(stateCode);
    const stateInfo = SENATE_DATA[stateCode];

    if (!stateInfo) {
      tooltip.innerHTML = `
        <div class="tooltip-header">
          <span class="tooltip-state-name">District of Columbia</span>
          <span class="tooltip-race-badge" style="background: rgba(255,255,255,0.1); color: var(--text-muted);">Non-voting</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">No Senate representation.</p>
      `;
      tooltip.classList.add('visible');
      handleStateMove(e);
      return;
    }

    if (hasRace) {
      const contest = CONTESTS_2026[stateCode];
      const outcome = simOutcomes[stateCode];
      const isFlipped = outcome !== 'Tossup' && outcome !== contest.baselineParty;

      let callHtml = '';
      if (outcome === 'Republican') {
        callHtml = `<span style="color: var(--color-gop);">🔴 Projected Republican</span>`;
      } else if (outcome === 'Democrat') {
        callHtml = `<span style="color: var(--color-dem);">🔵 Projected Democrat</span>`;
      } else {
        callHtml = `<span style="color: var(--color-tossup);">🟡 Tossup / Uncalled</span>`;
      }

      const flipBadge = isFlipped ? `<span class="flip-alert-tag">⚡ FLIPPED!</span>` : '';
      const specialBadge = contest.isSpecialElection ? `<span style="background: rgba(245,158,11,0.25); color:#fde68a; font-size:0.68rem; font-weight:800; padding:0.1rem 0.35rem; border-radius:3px; margin-left:0.3rem;">SPECIAL ELECTION</span>` : '';

      let opponentStr = '';
      if (contest.opponent) {
        opponentStr = `<div style="font-size: 0.8rem; color: var(--text-secondary);">Challenger: <strong>${contest.opponent}</strong> (${contest.opponentParty[0]})</div>`;
      }

      tooltip.innerHTML = `
        <div class="tooltip-header">
          <span class="tooltip-state-name">${contest.stateName} ${specialBadge}</span>
          <span class="tooltip-race-badge">★ 2026 CONTEST</span>
        </div>
        <div style="font-size: 0.82rem; margin: 0.2rem 0; color: var(--text-secondary);">
          Incumbent: <strong>${contest.incumbent}</strong> (${contest.incumbentParty[0]})
        </div>
        ${opponentStr}
        <div class="tooltip-call-line">
          ${callHtml}
          ${flipBadge}
        </div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">
          Rating: ${contest.rating} &bull; ${contest.competitiveness}
        </div>
        <div class="tooltip-hint">
          Click to inspect &amp; flip state control
        </div>
      `;
    } else {
      tooltip.innerHTML = `
        <div class="tooltip-header">
          <span class="tooltip-state-name">${stateInfo.name}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">Safe Seat (No 2026 Race)</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">
          Delegation: ${stateInfo.delegationLabel}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
          ${stateInfo.senators[0].name} &amp; ${stateInfo.senators[1].name}
        </div>
      `;
    }

    tooltip.classList.add('visible');
    handleStateMove(e);
  }

  function handleStateMove(e) {
    const padding = 15;
    let x = e.clientX;
    let y = e.clientY - padding;

    const tooltipRect = tooltip.getBoundingClientRect();
    if (x - tooltipRect.width / 2 < 10) {
      x = tooltipRect.width / 2 + 10;
    } else if (x + tooltipRect.width / 2 > window.innerWidth - 10) {
      x = window.innerWidth - tooltipRect.width / 2 - 10;
    }

    if (y - tooltipRect.height < 10) {
      y = e.clientY + tooltipRect.height + padding;
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  function handleStateLeave() {
    tooltip.classList.remove('visible');
  }

  // Select State & Render Inspector
  function selectState(code) {
    if (!code || !SENATE_DATA[code]) return;
    currentSelectedState = code;

    // Highlight map path
    document.querySelectorAll('.state-path').forEach(p => p.classList.remove('selected'));
    const path = document.getElementById(`state-${code}`);
    if (path) path.classList.add('selected');

    renderInspector(code);

    // Scroll inspector into view on smaller displays
    if (window.innerWidth <= 1180) {
      const inspector = document.getElementById('state-inspector-card');
      if (inspector) inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Render State Inspector Panel
  function renderInspector(code) {
    const stateInfo = SENATE_DATA[code];
    if (!stateInfo) return;

    const titleEl = document.getElementById('inspector-state-name');
    const postalEl = document.getElementById('inspector-postal');
    const raceBox = document.getElementById('inspector-2026-flip-box');
    const safeNotice = document.getElementById('inspector-safe-notice');
    const senatorsContainer = document.getElementById('inspector-senators-list');

    if (titleEl) titleEl.textContent = stateInfo.name;
    if (postalEl) postalEl.textContent = code;

    const hasRace = CONTESTS_2026.hasOwnProperty(code);

    if (hasRace) {
      const contest = CONTESTS_2026[code];
      const outcome = simOutcomes[code];
      const isFlipped = outcome !== 'Tossup' && outcome !== contest.baselineParty;

      if (safeNotice) safeNotice.style.display = 'none';
      if (raceBox) {
        raceBox.style.display = 'flex';

        // Rating badge
        let ratingClass = 'rating-tossup';
        if (contest.rating.includes('R')) ratingClass = 'rating-likely-r';
        if (contest.rating.includes('D')) ratingClass = 'rating-likely-d';

        // Call status banner
        let callClass = 'call-tossup';
        let callText = 'Tossup / Uncalled';
        if (outcome === 'Republican') {
          callClass = 'call-gop';
          callText = isFlipped ? '🔴 Flipped to Republican (+1 GOP)' : '🔴 Projected: Republican Win';
        } else if (outcome === 'Democrat') {
          callClass = 'call-dem';
          callText = isFlipped ? '🔵 Flipped to Democrat (+1 DEM)' : '🔵 Projected: Democrat Win';
        }

        const flipTagHtml = isFlipped ? `<span class="flip-alert-tag">⚡ FLIPPED!</span>` : '';
        const specialTitleBadge = contest.isSpecialElection ? `<span style="background: rgba(245,158,11,0.2); color:#fde68a; font-size:0.75rem; font-weight:800; padding:0.15rem 0.5rem; border-radius:4px; border:1px solid rgba(245,158,11,0.4);">★ SPECIAL ELECTION (Remainder to 2029)</span>` : '';

        let candidatesBlock = `
          <div style="font-size: 0.88rem; line-height: 1.4;">
            Incumbent: <strong>${contest.incumbent}</strong> (${contest.incumbentParty})
            ${contest.opponent ? `<br>Challenger: <strong>${contest.opponent}</strong> (${contest.opponentParty})` : ''}
          </div>
        `;

        // Resulting delegation preview
        let resultingDelegation = '';
        if (code === 'OH') {
          resultingDelegation = outcome === 'Democrat' 
            ? '<strong>Split Delegation: 1 Republican (Moreno), 1 Democrat (Brown)</strong>' 
            : '<strong>Solid Republican (Moreno & Husted)</strong>';
        } else if (code === 'FL') {
          resultingDelegation = outcome === 'Democrat' 
            ? '<strong>Split Delegation: 1 Republican (Scott), 1 Democrat (Nixon)</strong>' 
            : '<strong>Solid Republican (Scott & Moody)</strong>';
        } else if (code === 'ME') {
          resultingDelegation = outcome === 'Democrat' 
            ? '<strong>1 Democrat, 1 Independent</strong> (Dem Coalition 2)' 
            : '<strong>1 Republican (Collins), 1 Independent (King)</strong> (Split)';
        } else if (code === 'GA') {
          resultingDelegation = outcome === 'Republican' 
            ? '<strong>Split: 1 Republican, 1 Democrat (Warnock)</strong>' 
            : '<strong>Solid Democratic (2 D: Ossoff & Warnock)</strong>';
        } else {
          resultingDelegation = outcome === contest.baselineParty 
            ? `<strong>${stateInfo.delegationLabel}</strong>` 
            : `<strong>Split Delegation: 1 Republican, 1 Democrat</strong>`;
        }

        raceBox.innerHTML = `
          <div class="contest-flip-header">
            <span class="contest-tag">November 2026 Senate Contest</span>
            <span class="rating-badge ${ratingClass}">${contest.rating} &bull; ${contest.competitiveness}</span>
          </div>

          ${specialTitleBadge ? `<div style="margin: 0.1rem 0;">${specialTitleBadge}</div>` : ''}

          ${candidatesBlock}

          <div class="current-call-display ${callClass}">
            <span>${callText}</span>
            ${flipTagHtml}
          </div>

          <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--text-secondary); margin-top: 0.2rem;">
            Flip State Control:
          </div>

          <div class="flip-button-group">
            <button class="btn-flip btn-flip-gop ${outcome === 'Republican' ? 'active' : ''}" id="btn-flip-gop">
              <span>Win GOP</span>
              <span style="font-size: 0.68rem; opacity: 0.85;">(R)</span>
            </button>
            <button class="btn-flip btn-flip-dem ${outcome === 'Democrat' ? 'active' : ''}" id="btn-flip-dem">
              <span>Win DEM</span>
              <span style="font-size: 0.68rem; opacity: 0.85;">(D)</span>
            </button>
            <button class="btn-flip btn-flip-tossup ${outcome === 'Tossup' ? 'active' : ''}" id="btn-flip-tossup">
              <span>Tossup</span>
              <span style="font-size: 0.68rem; opacity: 0.85;">(?)</span>
            </button>
          </div>

          <button class="btn-quick-flip" id="btn-toggle-flip">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
            <span>One-Click Flip (Swap R &hArr; D)</span>
          </button>

          <div class="resulting-delegation-card">
            Resulting 2-Senator Delegation: ${resultingDelegation}
          </div>
        `;

        // Wire up buttons
        document.getElementById('btn-flip-gop')?.addEventListener('click', () => setContestOutcome(code, 'Republican'));
        document.getElementById('btn-flip-dem')?.addEventListener('click', () => setContestOutcome(code, 'Democrat'));
        document.getElementById('btn-flip-tossup')?.addEventListener('click', () => setContestOutcome(code, 'Tossup'));
        document.getElementById('btn-toggle-flip')?.addEventListener('click', () => flipContest(code));
      }
    } else {
      if (raceBox) raceBox.style.display = 'none';
      if (safeNotice) {
        safeNotice.style.display = 'flex';
        safeNotice.innerHTML = `
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <div>
            <strong>Safe Delegation &bull; Not Contested in 2026</strong>
            <div style="font-size: 0.78rem; margin-top: 0.15rem;">Neither of ${stateInfo.name}'s Senate seats are up for election in 2026. This seat stays locked in baseline totals.</div>
          </div>
        `;
      }
    }

    // Render Senators List
    if (senatorsContainer) {
      senatorsContainer.innerHTML = '';
      stateInfo.senators.forEach(senator => {
        const isUp2026 = senator.nextElection === 2026;
        const initials = senator.name.split(' ').map(n => n[0]).join('');
        const borderClass = senator.party === 'Republican' ? 'rep-border' : (senator.party === 'Democrat' ? 'dem-border' : 'ind-border');
        const roleHtml = senator.role ? `<div style="font-size: 0.72rem; color: var(--color-tossup); font-weight:700;">${senator.role}</div>` : '';

        const card = document.createElement('div');
        card.className = `senator-card ${borderClass} ${isUp2026 ? 'up-2026-card' : ''}`;
        card.innerHTML = `
          <div class="senator-card-top">
            <div class="senator-avatar" aria-hidden="true">${initials}</div>
            <div class="senator-info">
              <h4 class="senator-name">${senator.name}</h4>
              ${roleHtml}
              <div class="senator-meta-row">
                <span class="meta-badge">${senator.seniority} Senator</span>
                <span class="meta-badge">${senator.party}</span>
                <span class="meta-badge">Class ${senator.class}</span>
                <span class="meta-badge ${isUp2026 ? 'badge-up2026' : ''}">
                  ${isUp2026 ? '★ UP FOR ELECTION 2026' : `Next: ${senator.nextElection}`}
                </span>
              </div>
            </div>
          </div>
          <p class="senator-bio">${senator.bio}</p>
        `;
        senatorsContainer.appendChild(card);
      });
    }

    if (inspectorPlaceholder) inspectorPlaceholder.style.display = 'none';
    if (inspectorContent) inspectorContent.classList.add('active');
  }

  // Render 2026 Contests Grid
  function renderBattlegroundGrid() {
    if (!battlegroundGrid) return;
    battlegroundGrid.innerHTML = '';

    const codes = Object.keys(CONTESTS_2026).sort((a, b) => {
      return CONTESTS_2026[a].priority - CONTESTS_2026[b].priority;
    });

    codes.forEach(code => {
      const contest = CONTESTS_2026[code];
      const outcome = simOutcomes[code];
      const baseline = contest.baselineParty;
      const isFlipped = outcome !== 'Tossup' && outcome !== baseline;

      // Filtering check
      let matchesFilter = true;
      if (currentBgFilter === 'battlegrounds') {
        matchesFilter = contest.priority <= 14; // Top 14 battlegrounds (includes OH, GA, ME, NC, MI, FL, TX, IA, etc.)
      } else if (currentBgFilter === 'specials') {
        matchesFilter = !!contest.isSpecialElection; // Ohio & Florida
      } else if (currentBgFilter === 'flipped') {
        matchesFilter = isFlipped;
      } else if (currentBgFilter === 'tossups') {
        matchesFilter = (outcome === 'Tossup');
      }

      // Search check
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = contest.stateName.toLowerCase().includes(q);
        const matchInc = contest.incumbent.toLowerCase().includes(q);
        const matchOpp = contest.opponent && contest.opponent.toLowerCase().includes(q);
        const matchCode = code.toLowerCase() === q;
        if (!matchName && !matchInc && !matchOpp && !matchCode) matchesFilter = false;
      }

      if (!matchesFilter) return;

      const card = document.createElement('div');
      card.className = `bg-race-card ${isFlipped ? 'is-flipped' : ''}`;
      card.id = `bg-card-${code}`;

      // Rating badge class
      let ratingClass = 'rating-tossup';
      if (contest.rating.includes('R')) ratingClass = 'rating-likely-r';
      if (contest.rating.includes('D')) ratingClass = 'rating-likely-d';

      const flipTagHtml = isFlipped ? `<span class="flip-alert-tag">⚡ FLIP!</span>` : '';
      const specialBadgeHtml = contest.isSpecialElection ? `<span style="background: rgba(245,158,11,0.2); color:#fde68a; font-size:0.68rem; font-weight:800; padding:0.1rem 0.35rem; border-radius:3px;">SPECIAL</span>` : '';

      const matchupText = contest.opponent 
        ? `${contest.incumbent} (R) vs ${contest.opponent} (D)` 
        : `Incumbent: ${contest.incumbent} (${contest.incumbentParty[0]})`;

      card.innerHTML = `
        <div class="bg-race-card-header">
          <span class="bg-race-state-title">
            ${contest.stateName}
            <span style="font-size: 0.75rem; color: var(--text-muted); background: rgba(255,255,255,0.06); padding: 0.1rem 0.35rem; border-radius: 4px;">${code}</span>
            ${specialBadgeHtml}
          </span>
          <span class="rating-badge ${ratingClass}">${contest.rating}</span>
        </div>

        <div class="bg-race-incumbent-row">
          <span>${matchupText}</span>
          ${flipTagHtml}
        </div>

        <div class="bg-race-controls-row">
          <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 700;">Projected:</span>
          <div class="flip-segment-control" role="group" aria-label="Projected winner for ${contest.stateName}">
            <button class="segment-btn btn-seg-gop ${outcome === 'Republican' ? 'active' : ''}" data-code="${code}" data-outcome="Republican" title="Set Republican Win">GOP</button>
            <button class="segment-btn btn-seg-dem ${outcome === 'Democrat' ? 'active' : ''}" data-code="${code}" data-outcome="Democrat" title="Set Democrat Win">DEM</button>
            <button class="segment-btn btn-seg-tossup ${outcome === 'Tossup' ? 'active' : ''}" data-code="${code}" data-outcome="Tossup" title="Set Tossup">Tossup</button>
          </div>
        </div>
      `;

      // Card click highlights on map & opens inspector
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('segment-btn')) {
          selectState(code);
          const mapSection = document.getElementById('map-section');
          if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      // Segment button click
      card.querySelectorAll('.segment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetCode = btn.getAttribute('data-code');
          const targetOutcome = btn.getAttribute('data-outcome');
          setContestOutcome(targetCode, targetOutcome);
        });
      });

      battlegroundGrid.appendChild(card);
    });

    if (battlegroundGrid.children.length === 0) {
      battlegroundGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No contests match your current filter. Try selecting 'All 35 Contests' or clearing your search.
        </div>
      `;
    }
  }

  // Preset Scenario Handler
  function loadScenario(scenarioId) {
    const scenario = PRESET_SCENARIOS[scenarioId];
    if (!scenario) return;

    Object.keys(scenario.outcomes).forEach(code => {
      simOutcomes[code] = scenario.outcomes[code];
    });

    scenarioBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === scenarioId);
    });

    renderScoreboard();
    renderMapFills();
    renderInspector(currentSelectedState);
    renderBattlegroundGrid();
  }

  function updatePresetButtonsState() {
    let matchedId = null;
    Object.keys(PRESET_SCENARIOS).forEach(id => {
      const preset = PRESET_SCENARIOS[id];
      const match = Object.keys(CONTESTS_2026).every(code => {
        return simOutcomes[code] === preset.outcomes[code];
      });
      if (match) matchedId = id;
    });

    scenarioBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-scenario') === matchedId);
    });
  }

  // Setup Presets Event Listeners
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-scenario');
      loadScenario(id);
    });
  });

  // View Mode Buttons (2026 Battlegrounds vs All Delegations)
  viewModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewModeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentViewMode = btn.getAttribute('data-view');
      renderMapFills();
    });
  });

  // Instant Flip on Click Toggle Checkbox
  if (instantFlipToggle) {
    instantFlipToggle.addEventListener('change', (e) => {
      instantFlipOnClick = e.target.checked;
    });
  }

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('visible', searchQuery.length > 0);
      }
      filterMapAndRoster();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      filterMapAndRoster();
      searchInput.focus();
    });
  }

  function filterMapAndRoster() {
    const q = searchQuery.toLowerCase();
    document.querySelectorAll('.state-path').forEach(path => {
      const code = path.getAttribute('data-state');
      const name = path.getAttribute('data-name')?.toLowerCase() || '';
      const contest = CONTESTS_2026[code];

      let match = true;
      if (q) {
        const matchState = name.includes(q) || code.toLowerCase() === q;
        const matchInc = contest && contest.incumbent.toLowerCase().includes(q);
        const matchOpp = contest && contest.opponent && contest.opponent.toLowerCase().includes(q);
        match = matchState || matchInc || matchOpp;
      }

      path.classList.toggle('dimmed', !match);
    });

    renderBattlegroundGrid();
  }

  // Battleground Filter Chips (All, Top Battlegrounds, Specials, Flipped, Tossups)
  bgFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      bgFilterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentBgFilter = chip.getAttribute('data-bg-filter');
      renderBattlegroundGrid();
    });
  });

  // Quick State Chips
  smallStateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const code = chip.getAttribute('data-state');
      selectState(code);
    });
  });

  // Close Inspector Button
  if (closeInspectorBtn) {
    closeInspectorBtn.addEventListener('click', () => {
      if (inspectorContent) inspectorContent.classList.remove('active');
      if (inspectorPlaceholder) inspectorPlaceholder.style.display = 'block';
      document.querySelectorAll('.state-path').forEach(p => p.classList.remove('selected'));
      currentSelectedState = null;
    });
  }

  // Export CSV of 2026 Simulation
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const rows = [
        ['State Code', 'State Name', 'Contest Type', '2026 Incumbent', 'Incumbent Party', 'Opponent', 'Rating', 'Projected Winner 2026', 'Flipped Status', 'Notes']
      ];

      Object.keys(CONTESTS_2026).forEach(code => {
        const c = CONTESTS_2026[code];
        const outcome = simOutcomes[code];
        const isFlipped = outcome !== 'Tossup' && outcome !== c.baselineParty;
        rows.push([
          code,
          `"${c.stateName}"`,
          c.isSpecialElection ? 'Special Election' : 'Regular Class II',
          `"${c.incumbent}"`,
          c.incumbentParty,
          `"${c.opponent || ''}"`,
          c.rating,
          outcome,
          isFlipped ? `FLIPPED TO ${outcome}` : 'HOLD',
          `"${c.notes}"`
        ]);
      });

      const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `us_senate_2026_simulation_projection.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Theme Toggle
  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('senate_sim_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('senate_sim_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        <span>Dark Mode</span>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <span>Light Mode</span>
      `;
    }
  }

  // Initialize
  initSimulation();
  renderScoreboard();
  renderMapFills();
  setupMapInteractions();
  renderBattlegroundGrid();
  updatePresetButtonsState();
  selectState('OH'); // Spotlight marquee Ohio special election immediately!
});
