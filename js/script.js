// Initialize AOS
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out-quart'
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navToggle = document.querySelector('.nav-toggle');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
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
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

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
    particles.push(particle);
  }

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update light trail
    lightTrail.style.left = `${mouseX - 50}px`;
    lightTrail.style.top = `${mouseY - 50}px`;
    lightTrail.style.opacity = '0.4';
    setTimeout(() => lightTrail.style.opacity = '0', 50);
  });

  // Animation loop
  function animate() {
    time += 0.01; // Increment time for oscillation

    // Move liquid blob
    const blobX = mouseX - window.innerWidth / 2;
    const blobY = mouseY - window.innerHeight / 2;
    liquidBlob.style.transform = `
    translate(${blobX * 100}px, ${blobY * 100}px)
    rotate(${blobX * 0.9}deg)
  `;

    // Animate particles
    particles.forEach((particle, index) => {
      if (!particle.offset) {
        particle.offset = Math.random() * Math.PI * 2; // Assign random offset
      }

      const rect = particle.getBoundingClientRect();
      const particleX = rect.left + rect.width / 2;
      const particleY = rect.top + rect.height / 2;

      const deltaX = mouseX - particleX;
      const deltaY = mouseY - particleY;
      const distance = Math.sqrt(deltaX ** 1.2 + deltaY ** 1.2);

      // Slight oscillation in position
      const waveX = Math.sin(time + particle.offset) * 100; // Small movement in X
      const waveY = Math.cos(time + particle.offset) * 100; // Small movement in Y

      if (distance < 300) {
        const angle = Math.atan2(deltaY, deltaX);
        const force = 300 / distance;

        particle.style.transform = `
        translate(${waveX + Math.cos(angle) * -force}px, 
                  ${waveY + Math.sin(angle) * -force}px)
        scale(${1 + force / 20})
      `;
        particle.style.background = `rgba(16, 185, 129,${0.8 - force / 50})`;
      } else {
        particle.style.transform = `translate(${waveX}px, ${waveY}px) scale(1)`;
        particle.style.background = 'rgba(2,114,182,0.8)';
      }
    });



    requestAnimationFrame(animate);
  }

  animate();
});

document.addEventListener('DOMContentLoaded', () => {
  const projectModal = document.getElementById('project-modal');
  const closeProjectModal = document.getElementById('close-project-modal');
  const closeResumeModal = document.getElementById('close-resume-modal');
  const resumeModalButton = document.getElementById('resume-modal-button');
  const mobileResumeModalButton = document.getElementById('mobile-resume-modal-button');
  const resumeModal = document.getElementById('resume-modal');
  const bottomLink = document.getElementById('bottom-resume-link');

  bottomLink.addEventListener('click', function(event) {
    event.preventDefault();
    resumeModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  });

  // Attach closeProjectModal listener
  if (closeProjectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden'); // Remove overflow-hidden
    });
  }

  // Attach closeResumeModal listener
  if (closeResumeModal) {
    closeResumeModal.addEventListener('click', () => {
      resumeModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden'); // Remove overflow-hidden
    });
  }

  // Attach modal background click listener for project modal
  projectModal.addEventListener('click', (event) => {
    if (event.target === projectModal) {
      projectModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden'); // Remove overflow-hidden
    }
  });

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
    list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
  }

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectModal.classList.add('hidden');
      resumeModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden'); // Remove overflow-hidden
    }
  });

  // Resume Modal
  resumeModalButton.addEventListener('click', () => {
    resumeModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  });

  mobileResumeModalButton.addEventListener('click', () => {
    resumeModal.classList.remove('hidden');
    mobileMenu.classList.add('hidden');
    document.body.classList.add('overflow-hidden');
  });

  window.addEventListener('click', (event) => {
    if (event.target === resumeModal) {
      resumeModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  });
});
