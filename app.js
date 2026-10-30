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

  // 3. Live 48-Hour Sprint Countdown Timer
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  if (cdHours && cdMins && cdSecs) {
    // 48 hours simulated countdown from page load
    let totalSeconds = 48 * 3600;

    function updateCountdown() {
      if (totalSeconds > 0) {
        totalSeconds--;
      }

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      cdHours.textContent = String(h).padStart(2, '0');
      cdMins.textContent = String(m).padStart(2, '0');
      cdSecs.textContent = String(s).padStart(2, '0');
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

  // 6. Registration Form Submission
  const regForm = document.getElementById('nexus-register-form');
  const formStatus = document.getElementById('form-status');

  if (regForm && formStatus) {
    regForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const leadName = document.getElementById('reg-lead-name').value.trim();
      const leadEmail = document.getElementById('reg-lead-email').value.trim();
      const teamName = document.getElementById('reg-team-name').value.trim();
      const track = document.getElementById('reg-track').value;

      // Verification of BRACU domain
      if (!leadEmail.endsWith('@g.bracu.ac.bd') && !leadEmail.endsWith('@bracu.ac.bd')) {
        formStatus.textContent = 'Please use a valid BRAC University student email (@g.bracu.ac.bd).';
        formStatus.style.color = '#FF6B35';
        return;
      }

      formStatus.textContent = 'Submitting priority interest...';
      formStatus.style.color = '#6EE7FF';

      setTimeout(function() {
        formStatus.textContent = '✓ Interest registered successfully for team "' + teamName + '"! Confirmation email queued.';
        formStatus.className = 'form-status success';
        regForm.reset();
      }, 700);
    });
  }

  // 7. Smooth Anchor Scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
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

  // 8. Video atlas: keep every supplied clip synchronized and expose the portal feeds.
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
