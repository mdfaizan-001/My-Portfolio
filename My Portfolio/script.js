document.addEventListener('DOMContentLoaded', () => {

  /* 1. Mouse-follow glow */
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
  });

  /* 2. 3D tilt on cards */
  const tiltSelectors = '.project-card, .skill-card, .info-card';
  const tiltEls = document.querySelectorAll(tiltSelectors);

  tiltEls.forEach((el) => {
    const maxTilt = 8; // degrees

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;

      el.style.transform =
        `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      // for project-card radial spotlight
      el.style.setProperty('--px', `${px * 100}%`);
      el.style.setProperty('--py', `${py * 100}%`);
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  /* 3. Scroll reveal */
  const revealTargets = document.querySelectorAll(
    '.section-heading, .about-text, .info-card, .skill-card, .project-card, .timeline-item, .education-card, .contact-content'
  );
  revealTargets.forEach((el) => el.setAttribute('data-reveal', ''));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));

  /* Respect reduced motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltEls.forEach((el) => (el.style.transform = 'none'));
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
});