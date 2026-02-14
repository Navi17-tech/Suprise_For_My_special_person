/**
 * Valentine Experience — Interactive script
 * Handles: preloader, typing, chat simulation, gallery modal, gift, proposal, cursor, scroll progress
 */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const preloader = document.getElementById('preloader');
  const scrollProgress = document.querySelector('.scroll-progress');
  const cursorGlow = document.querySelector('.cursor-glow');
  const landing = document.getElementById('landing');
  const mainExperience = document.getElementById('main-experience');
  const btnEnter = document.getElementById('btn-enter');
  const typingTextEl = document.getElementById('typing-text');
  const chatMessages = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('typing-indicator');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryModal = document.getElementById('gallery-modal');
  const modalBackdrop = galleryModal?.querySelector('.modal-backdrop');
  const modalClose = galleryModal?.querySelector('.modal-close');
  const modalImage = galleryModal?.querySelector('.modal-image');
  const modalCaption = galleryModal?.querySelector('.modal-caption');
  const giftBox = document.getElementById('gift-box');
  const giftMessageOverlay = document.getElementById('gift-message');
  const btnCloseGift = document.getElementById('btn-close-gift');
  const proposalQuestion = document.getElementById('proposal-question');
  const btnYes = document.getElementById('btn-yes');
  const btnAlways = document.getElementById('btn-always');
  const proposalFinal = document.getElementById('proposal-final');
  const heartExplosion = document.getElementById('heart-explosion');
  const proposalScreenGlow = document.getElementById('proposal-screen-glow');
  const proposalRingHearts = document.getElementById('proposal-ring-hearts');
  const giftRevealImages = document.getElementById('gift-reveal-images');
  const giftRevealHearts = document.querySelector('.gift-reveal-hearts');
  const btnMusic = document.getElementById('btn-music');
  const bgMusic = document.getElementById('bg-music');
  const musicFloatWrap = document.getElementById('music-float-wrap');
  const btnMusicFloat = document.getElementById('btn-music-float');

  // Fallback placeholder for gift images (heart SVG) when gallery image fails or is missing
  var GIFT_IMG_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath fill="%23faf6f1" d="M50 85C50 85 20 60 20 40c0-15 12-25 30-25 12 0 22 6 28 16 2-10 10-16 22-16 18 0 30 10 30 25 0 20-30 45-30 45z"/%3E%3C/svg%3E';

  // ---------- Config ----------
  const TYPING_PHRASE = "I made something special for you...";
  const TYPING_SPEED = 80;
  const CHAT_LINES = [
    "Do you know when my life changed?",
    "The day you smiled at me.",
    "You are my favorite notification.",
    "Every day with you feels like a gift.",
    "I fall for you more every single day. ♥",
  ];
  const CHAT_DELAY_BETWEEN = 2200;
  const CHAT_TYPING_DURATION = 800;
  const AVATAR_HER = 'assets/my-image.jpeg';

  // ---------- Preloader ----------
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    setTimeout(function () {
      preloader.style.display = 'none';
    }, 650);
  }

  function initPreloader() {
    window.addEventListener('load', function () {
      setTimeout(hidePreloader, 800);
    });
    // Fallback if load event already fired
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 400);
    }
  }

  // ---------- Scroll progress ----------
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = height > 0 ? (winScroll / height) * 100 : 0;
    scrollProgress.style.width = percent + '%';
  }

  window.addEventListener('scroll', function () {
    requestAnimationFrame(updateScrollProgress);
  }, { passive: true });

  // ---------- Cursor glow ----------
  function initCursorGlow() {
    if (!cursorGlow) return;
    let x = 0, y = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animate() {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      cursorGlow.style.left = x + 'px';
      cursorGlow.style.top = y + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ---------- Typing animation (landing) ----------
  function typeWriter(el, text, speed, onComplete) {
    if (!el) return;
    let i = 0;
    el.textContent = '';

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (onComplete) {
        onComplete();
      }
    }
    type();
  }

  function startTyping() {
    if (!typingTextEl) return;
    setTimeout(function () {
      typeWriter(typingTextEl, TYPING_PHRASE, TYPING_SPEED);
    }, 1200);
  }

  // ---------- Enter button → reveal main ----------
  function revealMain() {
    if (!mainExperience || !landing) return;
    mainExperience.setAttribute('aria-hidden', 'false');
    mainExperience.classList.add('revealed');
    landing.style.opacity = '0';
    landing.style.pointerEvents = 'none';
    landing.style.transition = 'opacity 0.8s ease';

    // Show floating music button so user can start music from anywhere
    if (musicFloatWrap) {
      musicFloatWrap.classList.remove('hidden');
      musicFloatWrap.setAttribute('aria-hidden', 'false');
    }

    // Start background music on first user interaction (browsers require this)
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(function () {
        if (btnMusic) btnMusic.classList.add('playing');
        if (btnMusicFloat) btnMusicFloat.classList.add('playing');
      }).catch(function () {});
    }

    setTimeout(function () {
      mainExperience.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  if (btnEnter) {
    btnEnter.addEventListener('click', revealMain);
  }

  // ---------- Chat simulation ----------
  function createBubble(text, isSent, avatarSrc) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg' + (isSent ? ' sent' : '');
    // Logic update: Show avatar if it's NOT sent (received), or if explicitly requested
    // "Received" messages (isSent=false) should have the avatar.
    const showAvatar = !isSent && avatarSrc;
    const avatarHtml = showAvatar
      ? '<img class="avatar-small" src="' + escapeHtml(avatarSrc) + '" alt="">'
      : '';
    wrap.innerHTML = avatarHtml + '<span class="bubble">' + escapeHtml(text) + '</span>';
    return wrap;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function showTypingIndicator(show) {
    if (!typingIndicator) return;
    if (show) {
      typingIndicator.classList.remove('hidden');
      typingIndicator.setAttribute('aria-hidden', 'false');
    } else {
      typingIndicator.classList.add('hidden');
      typingIndicator.setAttribute('aria-hidden', 'true');
    }
  }

  function addChatMessage(text, isSent) {
    if (!chatMessages) return;
    showTypingIndicator(false);
    // Pass AVATAR_HER for received messages (isSent=false)
    const bubble = createBubble(text, isSent, !isSent ? AVATAR_HER : '');
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function runChatSequence() {
    if (!chatMessages) return;
    let index = 0;

    function next() {
      if (index >= CHAT_LINES.length) return;
      showTypingIndicator(true);
      setTimeout(function () {
        // CHANGED: isSent passed as false to align to left
        addChatMessage(CHAT_LINES[index], false);
        index++;
        if (index < CHAT_LINES.length) {
          setTimeout(next, CHAT_DELAY_BETWEEN);
        }
      }, CHAT_TYPING_DURATION);
    }

    // Start when chat section is in view
    const chatSection = document.getElementById('chat');
    if (!chatSection) {
      next();
      return;
    }
    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && index === 0) {
          next();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(chatSection);
  }

  // ---------- Gallery: scroll reveal + modal ----------
  function initGalleryReveal() {
    if (!galleryGrid) return;
    const items = galleryGrid.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function openModal(src, caption) {
    if (!galleryModal || !modalImage || !modalCaption) return;
    modalImage.src = src;
    modalImage.alt = caption || 'Memory';
    modalCaption.textContent = caption || '';
    galleryModal.hidden = false;
    galleryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!galleryModal) return;
    galleryModal.classList.remove('open');
    galleryModal.hidden = true;
    document.body.style.overflow = '';
  }

  function initGalleryModal() {
    if (!galleryGrid) return;
    galleryGrid.addEventListener('click', function (e) {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || '';
      if (img && img.src) openModal(img.src, caption);
    });
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ---------- Gift box ----------
  function setGiftRevealImageFallback(imgEl, index) {
    if (!imgEl) return;
    var num = (index || 0) + 1;
    imgEl.onerror = function () {
      var src = this.getAttribute('data-src') || '';
      if (src && src.indexOf('.jpg') !== -1) {
        this.onerror = function () {
          this.onerror = null;
          this.src = GIFT_IMG_FALLBACK;
        };
        this.src = src.replace('.jpg', '.png');
        return;
      }
      this.onerror = null;
      this.src = GIFT_IMG_FALLBACK;
    };
  }

  function addGiftFloatingHearts() {
    if (!giftRevealHearts) return;
    giftRevealHearts.innerHTML = '';
    var emojis = ['♥', '💕', '💗', '♥'];
    for (var h = 0; h < 12; h++) {
      var span = document.createElement('span');
      span.className = 'gift-float-heart';
      span.textContent = emojis[h % emojis.length];
      span.style.left = Math.random() * 100 + '%';
      span.style.top = Math.random() * 100 + '%';
      span.style.animationDelay = (Math.random() * 4) + 's';
      giftRevealHearts.appendChild(span);
    }
  }

  function openGift() {
    if (!giftBox || !giftMessageOverlay) return;
    giftBox.classList.add('open');
    giftBox.setAttribute('aria-label', 'Gift opened');
    // Move overlay to end of body so position:fixed covers full viewport (not clipped by main's transform)
    if (giftMessageOverlay.parentNode !== document.body) {
      document.body.appendChild(giftMessageOverlay);
    }
    giftMessageOverlay.classList.add('open');
    giftMessageOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    addGiftFloatingHearts();

    // Start music on gift click (user gesture) if not playing
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(function () {
        if (btnMusic) btnMusic.classList.add('playing');
        if (btnMusicFloat) btnMusicFloat.classList.add('playing');
      }).catch(function () {});
    }

    // Show the gift section's own images: use original HTML src (assets/gift-1.jpg etc.) so your images display
    var revealImgs = giftRevealImages ? giftRevealImages.querySelectorAll('.gift-reveal-img') : [];
    for (var i = 0; i < revealImgs.length; i++) {
      var img = revealImgs[i];
      var originalSrc = img.getAttribute('src') || ('gift-' + (i + 1) + '.jpg');
      img.setAttribute('data-src', originalSrc);
      setGiftRevealImageFallback(img, i);
      img.src = originalSrc;
    }

    if (giftRevealImages) {
      giftRevealImages.classList.remove('animate');
      void giftRevealImages.offsetWidth;
      setTimeout(function () {
        giftRevealImages.classList.add('animate');
      }, 80);
    }
    triggerConfetti();
  }

  function closeGiftMessage() {
    if (!giftMessageOverlay) return;
    giftMessageOverlay.classList.remove('open');
    giftMessageOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (giftRevealImages) giftRevealImages.classList.remove('animate');
  }

  function triggerConfetti() {
    const colors = ['#b76e79', '#e8b4b8', '#c9a9a6', '#faf6f1'];
    const count = 40;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      el.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
      el.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
      document.body.appendChild(el);
      setTimeout(function () {
        el.remove();
      }, 2600);
    }
  }

  if (giftBox) {
    giftBox.addEventListener('click', openGift);
    giftBox.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGift();
      }
    });
  }
  if (btnCloseGift) btnCloseGift.addEventListener('click', closeGiftMessage);
  if (giftMessageOverlay) {
    giftMessageOverlay.addEventListener('click', function (e) {
      if (e.target === giftMessageOverlay) closeGiftMessage();
    });
  }

  // ---------- Proposal: YES / ALWAYS (different effects + text) ----------
  let proposalTriggered = false;

  function createHeartParticle(x, y) {
    const el = document.createElement('span');
    el.className = 'heart-particle';
    el.textContent = '♥';
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 120;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    return el;
  }

  function triggerHeartExplosion() {
    if (!heartExplosion) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const count = 24;
    for (let i = 0; i < count; i++) {
      const p = createHeartParticle(centerX, centerY);
      heartExplosion.appendChild(p);
      setTimeout(function () {
        p.remove();
      }, 1300);
    }
  }

  function showProposalMessage(text, type) {
    if (!proposalFinal) return;
    proposalFinal.textContent = text;
    proposalFinal.classList.remove('yes-message', 'always-message');
    proposalFinal.classList.add(type + '-message', 'visible');
  }

  function onYesClick() {
    if (proposalTriggered) return;
    proposalTriggered = true;
    if (proposalQuestion) proposalQuestion.style.opacity = '0.85';
    triggerHeartExplosion();
    showProposalMessage('You said yes! My heart is yours forever. ❤️', 'yes');
  }

  function triggerScreenGlow() {
    if (!proposalScreenGlow) return;
    proposalScreenGlow.classList.remove('animate');
    void proposalScreenGlow.offsetWidth;
    proposalScreenGlow.classList.add('animate');
    setTimeout(function () {
      proposalScreenGlow.classList.remove('animate');
    }, 1900);
  }

  function triggerRingOfHearts() {
    if (!proposalRingHearts) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const count = 16;
    const radius = 60;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const el = document.createElement('span');
      el.className = 'ring-heart';
      el.textContent = '♥';
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const tx = Math.cos(angle) * 180;
      const ty = Math.sin(angle) * 180;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--rx', tx + 'px');
      el.style.setProperty('--ry', ty + 'px');
      proposalRingHearts.appendChild(el);
      setTimeout(function () {
        el.remove();
      }, 1600);
    }
  }

  function onAlwaysClick() {
    if (proposalTriggered) return;
    proposalTriggered = true;
    if (proposalQuestion) proposalQuestion.style.opacity = '0.85';
    triggerScreenGlow();
    triggerRingOfHearts();
    showProposalMessage('Always and forever. I love you. ❤️', 'always');
  }

  if (btnYes) btnYes.addEventListener('click', onYesClick);
  if (btnAlways) btnAlways.addEventListener('click', onAlwaysClick);

  // ---------- Background music ----------
  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      bgMusic.play().then(function () {
        if (btnMusic) { btnMusic.classList.add('playing'); btnMusic.setAttribute('aria-label', 'Mute background music'); }
        if (btnMusicFloat) btnMusicFloat.classList.add('playing');
      }).catch(function () {});
    } else {
      bgMusic.pause();
      if (btnMusic) { btnMusic.classList.remove('playing'); btnMusic.setAttribute('aria-label', 'Play background music'); }
      if (btnMusicFloat) btnMusicFloat.classList.remove('playing');
    }
  }

  if (btnMusic) btnMusic.addEventListener('click', toggleMusic);
  if (btnMusicFloat) btnMusicFloat.addEventListener('click', toggleMusic);

  // ---------- Parallax (subtle) ----------
  function initParallax() {
    const el = document.querySelector('[data-parallax]');
    if (!el) return;
    window.addEventListener('scroll', function () {
      const rect = el.getBoundingClientRect();
      const rate = rect.top * 0.03;
      const bg = el.querySelector('.landing-bg');
      if (bg) bg.style.transform = 'translateY(' + rate + 'px)';
    }, { passive: true });
  }

  // ---------- Init ----------
  initPreloader();
  startTyping();
  initCursorGlow();
  runChatSequence();
  initGalleryReveal();
  initGalleryModal();
  initParallax();
  updateScrollProgress();
})();

