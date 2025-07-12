// Initialize AOS
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out-quart'
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Mobile Menu Toggle - Enhanced Version
const mobileMenu = document.querySelector('.mobile-menu');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const topBar = navToggle.querySelector('span > span:nth-child(1)');
const middleBar = navToggle.querySelector('span > span:nth-child(2)');
const bottomBar = navToggle.querySelector('span > span:nth-child(3)');

function toggleMobileMenu() {
  const isHidden = mobileMenu.classList.toggle('hidden');

  // Update ARIA attributes
  mobileMenuButton.setAttribute('aria-expanded', !isHidden);

  // Animate hamburger icon
  if (isHidden) {
    topBar.style.transform = '';
    middleBar.style.opacity = '';
    bottomBar.style.transform = '';
  } else {
    topBar.style.transform = 'rotate(45deg) translate(5px, 5px)';
    middleBar.style.opacity = '0';
    bottomBar.style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  // Toggle body scroll
  document.body.classList.toggle('overflow-hidden', !isHidden);
}

navToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMobileMenu();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
    toggleMobileMenu();
  }
});

// Close menu when clicking nav links (except resume button)
document.querySelectorAll('.mobile-menu a').forEach(link => {
  if (!link.classList.contains('modal-trigger')) {
    link.addEventListener('click', toggleMobileMenu);
  }
});

// Back to Top Button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 3000) {
    backToTop.classList.remove('opacity-0', 'invisible', 'translate-y-10');
  } else {
    backToTop.classList.add('opacity-0', 'invisible', 'translate-y-10');
  }
});

backToTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Particle Animation System
document.addEventListener('DOMContentLoaded', () => {
  const liquidBlob = document.querySelector('.liquid-blob');
  const particleStorm = document.querySelector('.particle-storm');
  const lightTrail = document.querySelector('.light-trail');
  let mouseX = 0, mouseY = 0;
  let particles = [];
  let time = 0;

  // Create particles
  for (let i = 0; i < 200; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particleStorm.appendChild(particle);
    particles.push({
      element: particle,
      offset: Math.random() * Math.PI * 3
    });
  }

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update light trail
    if (lightTrail) {
      lightTrail.style.left = `${mouseX - 1}px`;
      lightTrail.style.top = `${mouseY - 1}px`;
      lightTrail.style.opacity = '0.4';
      setTimeout(() => lightTrail.style.opacity = '0', 50);
    }
  });

  // Animation loop
  function animate() {
    time += 0.01;

    // Move liquid blob
    if (liquidBlob) {
      const blobX = mouseX - window.innerWidth / 5;
      const blobY = mouseY - window.innerHeight / 5;
      liquidBlob.style.transform = `
        translate(${blobX * 0.05}px, ${blobY * 0.01}px)
        rotate(${blobX * 0.9}deg)
      `;
    }

    // Animate particles
    particles.forEach(({ element, offset }) => {
      const rect = element.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;

      const deltaX = mouseX - particleX;
      const deltaY = mouseY - particleY;
      const distance = Math.sqrt(deltaX ** 1.2 + deltaY ** 1.2);

      const waveX = Math.sin(time + offset) * 100;
      const waveY = Math.cos(time + offset) * 100;

      if (distance < 300) {
        const angle = Math.atan2(deltaY, deltaX);
        const force = 300 / distance;

        element.style.transform = `
          translate(${waveX + Math.cos(angle) * -force}px, 
                    ${waveY + Math.sin(angle) * -force}px)
          scale(${1 + force / 20})
        `;
        element.style.background = `rgba(16, 185, 129,${0.8 - force / 50})`;
      } else {
        element.style.transform = `translate(${waveX}px, ${waveY}px) scale(1)`;
        element.style.background = 'rgba(2,114,182,0.8)';
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
});

// Modal System
document.addEventListener('DOMContentLoaded', () => {
  const projectModal = document.getElementById('project-modal');
  const closeProjectModal = document.getElementById('close-project-modal');
  const closeResumeModal = document.getElementById('close-resume-modal');
  const resumeModalButton = document.getElementById('resume-modal-button');
  const mobileResumeModalButton = document.getElementById('mobile-resume-modal-button');
  const resumeModal = document.getElementById('resume-modal');
  const bottomLink = document.getElementById('bottom-resume-link');

  function closeAllModals() {
    [projectModal, resumeModal].forEach(modal => {
      if (modal) modal.classList.add('hidden');
    });
    document.body.classList.remove('overflow-hidden');
  }

  // Project Modal
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;

      const details = JSON.parse(card.dataset.details);
      const imgSrc = card.querySelector('img').src;

      // Populate modal
      document.getElementById('modal-title').textContent = details.title;
      document.getElementById('modal-image').src = imgSrc;
      document.getElementById('modal-description').textContent = details.description;
      document.getElementById('modal-duration').textContent = details.duration;
      document.getElementById('modal-team').textContent = details.team;

      populateList('modal-features', details.features);
      populateList('modal-challenges', details.challenges);

      const techStack = document.getElementById('modal-tech');
      techStack.innerHTML = details.tech.map(tech => `
        <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          ${tech}
        </span> 
      `).join('');

      projectModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  function populateList(id, items) {
    const list = document.getElementById(id);
    if (list) {
      list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    }
  }

  // Resume Modal
  [resumeModalButton, mobileResumeModalButton, bottomLink].forEach(button => {
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        if (button === mobileResumeModalButton) {
          toggleMobileMenu();
        }
      });
    }
  });

  // Close modals
  [closeProjectModal, closeResumeModal].forEach(button => {
    if (button) {
      button.addEventListener('click', closeAllModals);
    }
  });

  // Close modals when clicking outside
  [projectModal, resumeModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    }
  });

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
});
