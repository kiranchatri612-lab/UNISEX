/* ==========================================================
   ÉCLAT HAUTE COIFFURE & LUXURY SPA
   Main Controller & Micro-Interactions Script
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Counter & Reveal
  const preloader = document.getElementById('preloader');
  const barFill = document.querySelector('.preloader-bar-fill');
  const counter = document.querySelector('.preloader-counter');

  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (barFill) barFill.style.width = '100%';
        if (counter) counter.textContent = '100%';
        
        setTimeout(() => {
          preloader.classList.add('fade-out');
          initScrollReveals();
        }, 500);
      } else {
        if (barFill) barFill.style.width = `${progress}%`;
        if (counter) counter.textContent = `${progress}%`;
      }
    }, 60);
  }

  // 2. Navbar Scroll Morphing & Progress Bar
  const navbar = document.querySelector('.navbar');
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Navbar glass state
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll Progress
    if (progressBar) {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollY / windowHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 600) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. Scroll Reveal Observer
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
  }

  // 5. Animated Counter Stats
  const statNumbers = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target') || '0', 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.ceil(target / 40);

          const counterInterval = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(counterInterval);
            }
            stat.textContent = `${count.toLocaleString('en-IN')}${suffix}`;
          }, 40);
        });
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // 6. Services Tab Switcher
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-tab');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 7. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (header && body) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other FAQs
        faqItems.forEach(other => {
          other.classList.remove('is-open');
          const otherBody = other.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('is-open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // 8. Testimonials / Reviews Carousel Slider
  const reviewsTrack = document.getElementById('reviewsTrack');
  const prevReviewBtn = document.getElementById('prevReviewBtn');
  const nextReviewBtn = document.getElementById('nextReviewBtn');

  if (reviewsTrack) {
    let currentSlide = 0;
    const totalSlides = reviewsTrack.children.length;

    function updateSliderPosition() {
      reviewsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    if (nextReviewBtn) {
      nextReviewBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSliderPosition();
      });
    }

    if (prevReviewBtn) {
      prevReviewBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSliderPosition();
      });
    }

    // Auto-advance reviews every 6 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSliderPosition();
    }, 6000);
  }
});
