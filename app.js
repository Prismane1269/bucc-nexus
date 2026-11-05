/**
 * BUCC NEXUS — Interactive Controller
 * Handles Navigation, Countdown Timer, Schedule Tabs, FAQ Accordion, and Registration Form
 */

(function() {
  'use strict';

  // 1. Header Scroll Effect
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', function() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileDrawer.classList.toggle('open');
    });

    // Close drawer when clicking a link
    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // 3. Live 72-Hour Registration Deadline Countdown Timer
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');
  const dockDeadlineTime = document.getElementById('dock-deadline-time');

  if (cdHours && cdMins && cdSecs) {
    // 72 hours registration deadline countdown
    let totalSeconds = 72 * 3600;

    function updateCountdown() {
      if (totalSeconds > 0) {
        totalSeconds--;
      }

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      const formattedH = String(h).padStart(2, '0');
      const formattedM = String(m).padStart(2, '0');
      const formattedS = String(s).padStart(2, '0');

      cdHours.textContent = formattedH;
      cdMins.textContent = formattedM;
      cdSecs.textContent = formattedS;

      if (dockDeadlineTime) {
        dockDeadlineTime.textContent = formattedH + ':' + formattedM + ':' + formattedS;
      }
    }

    setInterval(updateCountdown, 1000);
  }

  // 4. Schedule Day Tabs Switcher
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.schedule-panel');

  tabButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const targetDay = btn.getAttribute('data-day');

      // Update active button state
      tabButtons.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update visible panel
      tabPanels.forEach(function(panel) {
        if (panel.id === 'panel-' + targetDay) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // 5. FAQ Accordion
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(function(card) {
    const questionBtn = card.querySelector('.faq-question');
    questionBtn.addEventListener('click', function() {
      const isOpen = card.classList.contains('open');

      // Optional: close other open cards for an accordion feel
      faqCards.forEach(function(otherCard) {
        if (otherCard !== card) {
          otherCard.classList.remove('open');
          const btn = otherCard.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        card.classList.remove('open');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 6. Procedural Web Audio Synthesizer (Zero external dependencies)
  let audioCtx = null;
  let sfxEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiClickSound() {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
  }

  function playUiSuccessSound() {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach(function(freq, i) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.06, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.12);
      });
    } catch(e) {}
  }

  // Sound toggle on floating dock
  const dockSfxBtn = document.getElementById('dock-sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxLabel = document.getElementById('sfx-label');

  if (dockSfxBtn) {
    dockSfxBtn.addEventListener('click', function() {
      initAudio();
      sfxEnabled = !sfxEnabled;
      dockSfxBtn.classList.toggle('active', sfxEnabled);
      if (sfxIcon) sfxIcon.textContent = sfxEnabled ? '🔊' : '🔇';
      if (sfxLabel) sfxLabel.textContent = sfxEnabled ? 'SFX ON' : 'SFX OFF';
      if (sfxEnabled) playUiClickSound();
    });
  }

  // 7. Framer-Style Dynamic Spotlight Glow
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) {
    const spotlightCards = document.querySelectorAll('.spotlight-card, .metric-card, .value-card, .podium-card');
    spotlightCards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  // 8. Framer-Style Interactive Track Architecture Sandbox
  const trackData = {
    ai: {
      filename: "track-01-ai-blueprint.py",
      badge: "TRACK 01 BLUEPRINT",
      heading: "Autonomous Agentic Reasoning & Vision Pipeline",
      summary: "Build multi-agent decision systems that synthesize multimodal inputs (sensors, video, satellite imagery, or user queries) into low-latency executable actions.",
      stack: ["Python 3.11", "PyTorch / LangChain", "FastAPI", "ChromaDB / Qdrant"],
      metrics: ["✓ Reasoning Accuracy > 92%", "✓ Sub-second Inference Latency", "✓ Graceful Fallback Handling"],
      code: `<span class="c-comment"># BUCC NEXUS — Track 01: AI Agent Pipeline Starter</span>
<span class="c-keyword">import</span> asyncio
<span class="c-keyword">from</span> dataclasses <span class="c-keyword">import</span> dataclass

<span class="c-decorator">@dataclass</span>
<span class="c-keyword">class</span> <span class="c-class">CampusSensorTelemetry</span>:
    node_id: <span class="c-type">str</span>
    load_factor: <span class="c-type">float</span>
    status: <span class="c-type">str</span> = <span class="c-string">"optimal"</span>

<span class="c-keyword">async def</span> <span class="c-func">converge_agentic_flow</span>(telemetry: CampusSensorTelemetry):
    <span class="c-comment"># Autonomous reasoning and routing graph</span>
    <span class="c-keyword">if</span> telemetry.load_factor > <span class="c-number">0.85</span>:
        <span class="c-keyword">return</span> {<span class="c-string">"route"</span>: <span class="c-string">"high-priority-nexus"</span>, <span class="c-string">"rebalance"</span>: <span class="c-keyword">True</span>}
    <span class="c-keyword">return</span> {<span class="c-string">"route"</span>: <span class="c-string">"standard-edge"</span>, <span class="c-string">"rebalance"</span>: <span class="c-keyword">False</span>}

<span class="c-comment"># Run local agent loop</span>
<span class="c-keyword">if</span> __name__ == <span class="c-string">"__main__"</span>:
    data = CampusSensorTelemetry(node_id=<span class="c-string">"BRACU-UB-09"</span>, load_factor=<span class="c-number">0.91</span>)
    result = asyncio.run(converge_agentic_flow(data))
    <span class="c-func">print</span>(<span class="c-string">f"✓ NEXUS Agent Action Dispatched: {result}"</span>)`
    },
    web: {
      filename: "track-02-web-app.tsx",
      badge: "TRACK 02 BLUEPRINT",
      heading: "Real-Time Distributed Collaborative Canvas",
      summary: "Architect zero-latency reactive interfaces with synchronized client state, edge rendering, and offline-first IndexedDB persistence.",
      stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "WebSockets / Supabase"],
      metrics: ["✓ Sub-100ms P95 Interaction Latency", "✓ WCAG 2.1 AA Accessibility", "✓ Conflict-Free State Merging"],
      code: `<span class="c-comment">// BUCC NEXUS — Track 02: Next-Gen Web Starter</span>
<span class="c-keyword">import</span> { useEffect, useState } <span class="c-keyword">from</span> <span class="c-string">'react'</span>;

<span class="c-keyword">interface</span> <span class="c-class">PeerNode</span> {
  id: <span class="c-type">string</span>;
  cursorX: <span class="c-type">number</span>;
  cursorY: <span class="c-type">number</span>;
  activeTrack: <span class="c-type">string</span>;
}

<span class="c-keyword">export default function</span> <span class="c-func">CollaborativeCanvas</span>() {
  <span class="c-keyword">const</span> [nodes, setNodes] = useState&lt;<span class="c-class">PeerNode</span>[]&gt;([]);

  useEffect(() =&gt; {
    <span class="c-keyword">const</span> ws = <span class="c-keyword">new</span> WebSocket(<span class="c-string">'wss://nexus-edge.bracu.ac.bd/stream'</span>);
    ws.onmessage = (event) =&gt; {
      <span class="c-keyword">const</span> payload: <span class="c-class">PeerNode</span> = JSON.parse(event.data);
      setNodes((prev) =&gt; [...prev.filter((n) =&gt; n.id !== payload.id), payload]);
    };
    <span class="c-keyword">return</span> () =&gt; ws.close();
  }, []);

  <span class="c-keyword">return</span> (
    &lt;<span class="c-class">div</span> className=<span class="c-string">"nexus-canvas"</span>&gt;
      &lt;<span class="c-class">h1</span>&gt;Active Innovators: {nodes.length}&lt;/<span class="c-class">h1</span>&gt;
    &lt;/<span class="c-class">div</span>&gt;
  );
}`
    },
    iot: {
      filename: "track-03-esp32-rover.cpp",
      badge: "TRACK 03 BLUEPRINT",
      heading: "Edge-Vision Autonomous Obstacle Rover & Sensor Mesh",
      summary: "Program ESP32-S3 and Raspberry Pi microcontrollers for local inference, spatial LiDAR telemetry, and mesh networking across campus environments.",
      stack: ["Embedded C++", "ESP-IDF / FreeRTOS", "ROS 2 Micro", "MQTT / LoRa"],
      metrics: ["✓ &lt;15ms Local Sensor Loop", "✓ Autonomous Obstacle Avoidance", "✓ Resilient Low-Power Mesh"],
      code: `<span class="c-comment">// BUCC NEXUS — Track 03: Embedded Hardware Starter</span>
<span class="c-keyword">#include</span> <span class="c-string">&lt;WiFi.h&gt;</span>
<span class="c-keyword">#include</span> <span class="c-string">&lt;PubSubClient.h&gt;</span>

<span class="c-keyword">const char</span>* ssid = <span class="c-string">"BRACU-CAMPUS-IOT"</span>;
<span class="c-keyword">const char</span>* mqtt_server = <span class="c-string">"telemetry.nexus.bucc"</span>;
WiFiClient espClient;
PubSubClient client(espClient);

<span class="c-type">void</span> <span class="c-func">setup</span>() {
  Serial.begin(<span class="c-number">115200</span>);
  WiFi.begin(ssid, <span class="c-string">"nexus_secret_key"</span>);
  <span class="c-keyword">while</span> (WiFi.status() != WL_CONNECTED) delay(<span class="c-number">500</span>);
  Serial.println(<span class="c-string">"✓ Hardware Node Connected to NEXUS Mesh"</span>);
}

<span class="c-type">void</span> <span class="c-func">loop</span>() {
  <span class="c-type">float</span> distanceCm = readUltrasonicEcho();
  <span class="c-keyword">if</span> (distanceCm &lt; <span class="c-number">15.0</span>) {
    haltActuators();
    client.publish(<span class="c-string">"nexus/alerts/proximity"</span>, <span class="c-string">"OBSTACLE_DETECTED"</span>);
  }
  delay(<span class="c-number">50</span>);
}`
    },
    open: {
      filename: "track-04-zk-credential.py",
      badge: "TRACK 04 BLUEPRINT",
      heading: "Zero-Knowledge Student Credential Verification",
      summary: "Pioneer novel cryptographic proofs and decentralized identity protocols enabling anonymous student verification without exposing personal identifiers.",
      stack: ["Rust / Python", "Circom / SnarkJS", "FastAPI", "IPFS / Web3"],
      metrics: ["✓ Zero PII Leakage Guarantee", "✓ Instant Client-Side Proof Gen", "✓ Cross-Platform Interoperability"],
      code: `<span class="c-comment"># BUCC NEXUS — Track 04: ZK Verification Starter</span>
<span class="c-keyword">from</span> zksnark <span class="c-keyword">import</span> Groth16Prover, CircuitVerificationKey

<span class="c-keyword">def</span> <span class="c-func">generate_student_proof</span>(student_hash: <span class="c-type">str</span>, semester_status: <span class="c-type">int</span>):
    <span class="c-string">"""Proves student is enrolled at BRAC University without revealing PII."""</span>
    circuit = Groth16Prover.load(<span class="c-string">"circuits/bracu_eligibility.zkey"</span>)
    proof = circuit.prove({
        <span class="c-string">"student_secret_hash"</span>: student_hash,
        <span class="c-string">"is_undergrad"</span>: semester_status &gt;= <span class="c-number">1</span>
    })
    <span class="c-keyword">return</span> {<span class="c-string">"zk_proof"</span>: proof, <span class="c-string">"verified"</span>: <span class="c-keyword">True</span>}

<span class="c-keyword">if</span> __name__ == <span class="c-string">"__main__"</span>:
    result = generate_student_proof(<span class="c-string">"0x8f2a...c4e1"</span>, semester_status=<span class="c-number">4</span>)
    <span class="c-func">print</span>(<span class="c-string">f"✓ ZK Proof Generated for NEXUS Registration: {result['verified']}"</span>)`
    }
  };

  const trackCards = document.querySelectorAll('.track-card');
  const tabTitleEl = document.getElementById('sandbox-tab-title');
  const badgeEl = document.getElementById('sandbox-badge');
  const headingEl = document.getElementById('sandbox-heading');
  const summaryEl = document.getElementById('sandbox-summary');
  const stackEl = document.getElementById('sandbox-stack');
  const metricsEl = document.getElementById('sandbox-metrics');
  const codePreEl = document.getElementById('sandbox-code-pre');
  const copyBtn = document.getElementById('btn-copy-code');
  const copyBtnText = document.getElementById('copy-btn-text');

  let currentRawCode = "";

  function setTrackSandbox(trackKey) {
    const data = trackData[trackKey];
    if (!data) return;

    playUiClickSound();

    trackCards.forEach(function(card) {
      const isMatch = card.dataset.track === trackKey;
      card.classList.toggle('active', isMatch);
      card.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    if (tabTitleEl) tabTitleEl.textContent = data.filename;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (headingEl) headingEl.textContent = data.heading;
    if (summaryEl) summaryEl.textContent = data.summary;

    if (stackEl) {
      stackEl.innerHTML = data.stack.map(function(s) {
        return '<span class="stack-tag">' + s + '</span>';
      }).join('');
    }

    if (metricsEl) {
      metricsEl.innerHTML = data.metrics.map(function(m) {
        return '<span class="metric-pill">' + m + '</span>';
      }).join('');
    }

    if (codePreEl) {
      codePreEl.innerHTML = '<code>' + data.code + '</code>';
      // Strip HTML for copy action
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.code;
      currentRawCode = tempDiv.textContent || tempDiv.innerText || "";
    }
  }

  // Initialize with Track 01
  setTrackSandbox('ai');

  trackCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const track = card.dataset.track;
      if (track) setTrackSandbox(track);
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const track = card.dataset.track;
        if (track) setTrackSandbox(track);
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      initAudio();
      playUiClickSound();
      if (!currentRawCode && codePreEl) {
        currentRawCode = codePreEl.textContent;
      }
      navigator.clipboard.writeText(currentRawCode).then(function() {
        copyBtn.classList.add('copied');
        if (copyBtnText) copyBtnText.textContent = "✓ Copied!";
        setTimeout(function() {
          copyBtn.classList.remove('copied');
          if (copyBtnText) copyBtnText.textContent = "Copy Starter";
        }, 2200);
      }).catch(function() {});
    });
  }

  // 9. Real-Time Email Domain Verification & Registration Form
  const leadEmailInput = document.getElementById('reg-lead-email');
  const domainBadge = document.getElementById('domain-badge');
  const visionTextarea = document.getElementById('reg-project-vision');
  const charCounter = document.getElementById('char-counter');
  const sizePills = document.querySelectorAll('.size-pill');

  if (leadEmailInput && domainBadge) {
    leadEmailInput.addEventListener('input', function() {
      const val = leadEmailInput.value.trim().toLowerCase();
      if (val.endsWith('@g.bracu.ac.bd') || val.endsWith('@bracu.ac.bd')) {
        domainBadge.textContent = "✓ Verified BRACU Domain";
        domainBadge.classList.add('verified');
      } else {
        domainBadge.textContent = "Requires @g.bracu.ac.bd";
        domainBadge.classList.remove('verified');
      }
    });
  }

  if (visionTextarea && charCounter) {
    visionTextarea.addEventListener('input', function() {
      const len = visionTextarea.value.length;
      charCounter.textContent = len + " / 250";
    });
  }

  sizePills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      playUiClickSound();
      sizePills.forEach(function(p) { p.classList.remove('active'); });
      pill.classList.add('active');
    });
  });

  const regForm = document.getElementById('nexus-register-form');
  const formStatus = document.getElementById('form-status');

  if (regForm && formStatus) {
    regForm.addEventListener('submit', function(e) {
      e.preventDefault();
      initAudio();

      const leadEmail = leadEmailInput ? leadEmailInput.value.trim() : "";
      const teamName = document.getElementById('reg-team-name').value.trim();

      // Verification of BRACU domain
      if (!leadEmail.endsWith('@g.bracu.ac.bd') && !leadEmail.endsWith('@bracu.ac.bd')) {
        formStatus.textContent = 'Please use a valid BRAC University student email (@g.bracu.ac.bd).';
        formStatus.style.color = '#FF6B35';
        return;
      }

      formStatus.textContent = 'Submitting priority interest...';
      formStatus.style.color = '#6EE7FF';

      setTimeout(function() {
        playUiSuccessSound();
        formStatus.textContent = '✓ Interest registered successfully for team "' + teamName + '"! Confirmation email queued.';
        formStatus.className = 'form-status success';
        regForm.reset();
        if (domainBadge) {
          domainBadge.textContent = "Requires @g.bracu.ac.bd";
          domainBadge.classList.remove('verified');
        }
        if (charCounter) charCounter.textContent = "0 / 250";
      }, 700);
    });
  }

  // 10. Framer-Style Live FAQ Search & Filter
  const faqSearchInput = document.getElementById('faq-search-input');
  const faqClearBtn = document.getElementById('faq-clear-btn');
  const faqMatchStatus = document.getElementById('faq-match-status');
  const faqCards = document.querySelectorAll('.faq-card');

  if (faqSearchInput && faqCards.length > 0) {
    faqSearchInput.addEventListener('input', function() {
      const query = faqSearchInput.value.trim().toLowerCase();
      let matches = 0;

      if (faqClearBtn) {
        faqClearBtn.style.display = query.length > 0 ? 'flex' : 'none';
      }

      faqCards.forEach(function(card) {
        const text = card.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          card.classList.remove('filtered-out');
          matches++;
        } else {
          card.classList.add('filtered-out');
        }
      });

      if (faqMatchStatus) {
        if (query === '') {
          faqMatchStatus.textContent = "Showing all " + faqCards.length + " questions";
        } else {
          faqMatchStatus.textContent = matches === 1 ? "1 question found" : matches + " questions found";
        }
      }
    });

    if (faqClearBtn) {
      faqClearBtn.addEventListener('click', function() {
        faqSearchInput.value = '';
        faqSearchInput.dispatchEvent(new Event('input'));
        faqSearchInput.focus();
      });
    }
  }

  // 11. Framer-Style Floating Bottom Glass Dock & Section Highlighting
  const floatingDock = document.getElementById('floating-dock');
  const dockNavLinks = document.querySelectorAll('.dock-nav-link');
  const sections = document.querySelectorAll('section[id], footer');

  if (floatingDock && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          // Hide dock if in hero or footer
          if (id === 'hero' || entry.target.tagName.toLowerCase() === 'footer') {
            floatingDock.classList.add('hidden');
          } else {
            floatingDock.classList.remove('hidden');
          }

          dockNavLinks.forEach(function(link) {
            if (link.dataset.section === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function(sec) {
      sectionObserver.observe(sec);
    });
  }

  // 12. Smooth Anchor Scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        playUiClickSound();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 13. Video atlas: keep every supplied clip synchronized and expose the portal feeds.
  const allVideos = Array.from(document.querySelectorAll('video'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const syncVideoState = function() {
    allVideos.forEach(function(video) {
      if (document.hidden || reducedMotion.matches) {
        video.pause();
      } else {
        video.play().catch(function() {});
      }
    });
  };
  allVideos.forEach(function(video) {
    video.addEventListener('loadeddata', function() {
      if (!document.hidden && !reducedMotion.matches) video.play().catch(function() {});
    });
  });
  document.addEventListener('visibilitychange', syncVideoState);
  reducedMotion.addEventListener?.('change', syncVideoState);
  syncVideoState();

  const portal = document.querySelector('.portal-bezel');
  const portalVideo = document.getElementById('portal-video');
  const backgroundVideo = document.getElementById('bg-video-primary');
  const feedButtons = document.querySelectorAll('.feed-btn');
  const swapVideoSource = function(video, source) {
    if (!video || !source) return;
    const sourceNode = video.querySelector('source');
    if (!sourceNode || sourceNode.getAttribute('src') === source) return;
    sourceNode.setAttribute('src', source);
    video.load();
    video.play().catch(function() {});
  };
  feedButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      playUiClickSound();
      feedButtons.forEach(function(item) { item.classList.remove('active'); });
      button.classList.add('active');
      if (portal) {
        portal.classList.add('is-switching');
        window.setTimeout(function() { portal.classList.remove('is-switching'); }, 650);
      }
      swapVideoSource(portalVideo, button.dataset.src);
      swapVideoSource(backgroundVideo, button.dataset.bg);
    });
  });

})();
