/**
 * Manish Chakka — Personal Portfolio Scripts
 * Handles mobile navigation, scroll reveal animations, active nav links,
 * and expandable card details.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Mobile Navigation
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navMobileLinks = navMobile ? navMobile.querySelectorAll('a') : [];

  if (navToggle && navMobile) {
    const toggleMenu = (forceState) => {
      const isOpen = typeof forceState === 'boolean' ? forceState : !navMobile.classList.contains('open');
      navToggle.classList.toggle('active', isOpen);
      navMobile.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMenu());

    // Close when clicking mobile nav links
    navMobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Close if resizing above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMobile.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // 2. Navbar shadow & background on scroll
  const handleNavScroll = () => {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // 3. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav__links a[data-nav]');

  const updateActiveNavLink = () => {
    const scrollY = window.scrollY;
    const navOffset = 120; // Offset for trigger

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - navOffset;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('data-nav') === sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });

    // If at top of page, remove active class from all
    if (scrollY < 100) {
      desktopNavLinks.forEach(link => link.classList.remove('active'));
    }
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // 4. Expand / Collapse Experience & Project Details
  const expandButtons = document.querySelectorAll('[data-expand]');

  expandButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-expand');
      const targetContent = document.getElementById(targetId);

      if (!targetContent) return;

      const isExpanded = targetContent.classList.contains('open');

      if (isExpanded) {
        targetContent.classList.remove('open');
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
        if (button.textContent.includes('Hide') || button.textContent.includes('View')) {
          button.textContent = 'View Details';
        }
      } else {
        targetContent.classList.add('open');
        button.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
        if (button.textContent.includes('Hide') || button.textContent.includes('View')) {
          button.textContent = 'Hide Details';
        }
      }
    });
  });

  // 5. Scroll Reveal Animations with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('visible'));
  }
});