/* ==========================================================================
   TA'MEER-E-REKHTA (تعمیر ریختہ) - MAIN JAVASCRIPT
   Router, Interactivity, Form Handler, Counters & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. ROUTING & PAGE VIEW SWITCHER
     ------------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('.nav-link, [data-target]');
  const pageViews = document.querySelectorAll('.page-view');
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');

  function navigateTo(targetId) {
    if (!targetId) targetId = 'home';
    targetId = targetId.replace('#', '');
    
    // Normalize target view ID
    let viewId = targetId + '-view';
    const targetView = document.getElementById(viewId);
    
    if (!targetView) {
      targetId = 'home';
      viewId = 'home-view';
    }

    // Hide all views
    pageViews.forEach(view => {
      view.classList.remove('active');
    });

    // Show target view
    const activeView = document.getElementById(viewId);
    if (activeView) {
      activeView.classList.add('active');
    }

    // Update nav links active class
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkTarget = link.getAttribute('data-target');
      if (linkTarget === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if open
    if (navLinksContainer) {
      navLinksContainer.classList.remove('open');
    }
  }

  // Handle click on links with data-target
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('[data-target]');
    if (link && !link.classList.contains('modal-trigger')) {
      const target = link.getAttribute('data-target');
      if (target) {
        e.preventDefault();
        window.location.hash = target;
        navigateTo(target);
      }
    }
  });

  // Handle Hash Changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== 'donate' && hash !== 'contact') {
      navigateTo(hash);
    }
  });

  // Initial load navigation check
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && ['home', 'ourwork', 'volunteer'].includes(initialHash)) {
    navigateTo(initialHash);
  } else {
    navigateTo('home');
  }

  // Mobile Menu Toggle
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });
  }

  /* ------------------------------------------------------------------------
     2. OUR WORK FILTER SYSTEM
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'grid';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     3. ANIMATED STATS COUNTER
     ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function runCounterAnimation() {
    if (animated) return;
    animated = true;

    statNumbers.forEach(stat => {
      const targetText = stat.textContent;
      const hasPlus = targetText.includes('+');
      const hasK = targetText.includes('K');
      
      let targetNum = parseInt(stat.getAttribute('data-target')) || 0;
      let count = 0;
      const speed = Math.ceil(targetNum / 40);

      const updateCount = () => {
        count += speed;
        if (count >= targetNum) {
          if (hasK) {
            stat.textContent = (targetNum / 1000) + 'K' + (hasPlus ? '+' : '');
          } else {
            stat.textContent = targetNum + (hasPlus ? '+' : '');
          }
        } else {
          if (hasK && count >= 1000) {
            stat.textContent = (count / 1000).toFixed(1) + 'K' + (hasPlus ? '+' : '');
          } else {
            stat.textContent = count + (hasPlus ? '+' : '');
          }
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    });
  }

  // Observe when stats section is in view
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounterAnimation();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else {
    runCounterAnimation();
  }

  /* ------------------------------------------------------------------------
     4. VOLUNTEER REGISTRATION FORM HANDLER
     ------------------------------------------------------------------------ */
  const volunteerForm = document.getElementById('volunteerForm');
  const applicantNameSpan = document.getElementById('applicantName');
  const successModal = document.getElementById('successModal');
  const submitBtn = document.getElementById('submitBtn');

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      
      // Submit loading state animation
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (applicantNameSpan) {
          applicantNameSpan.textContent = fullName || 'Volunteer';
        }

        openModal('successModal');
        volunteerForm.reset();
      }, 900);
    });
  }

  /* ------------------------------------------------------------------------
     5. MODAL SYSTEM HANDLERS
     ------------------------------------------------------------------------ */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Open modal triggers
  document.querySelectorAll('.modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Close modal triggers
  document.querySelectorAll('[data-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      const modalId = closeBtn.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Close modal on outside backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

});
