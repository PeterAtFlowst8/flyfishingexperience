import './style.css'

console.log('Fly Fishing Experience is ready to cast!');

// Navbar Scroll Effect with Enhanced Glassmorphism
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Parallax Effect on Hero Background
const heroBackground = document.querySelector('.hero-bg');
if (heroBackground) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxSpeed = 0.5;
    heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
  });
}

// Intersection Observer for Scroll-Triggered Animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: unobserve after animation to improve performance
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections for fade-in animations
const sections = document.querySelectorAll('.mission, .services, .faq, .footer');
sections.forEach(section => {
  section.classList.add('scroll-fade-in');
  observer.observe(section);
});

// Observe service cards individually for stagger effect
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
  card.classList.add('scroll-fade-in');
  card.style.transitionDelay = `${index * 0.1}s`;
  observer.observe(card);
});

// FAQ Accordion Logic with Enhanced Animation
document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
    const accordionItem = button.parentElement;
    const wasActive = accordionItem.classList.contains('active');

    // Close all other accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
      if (item !== accordionItem) {
        item.classList.remove('active');
      }
    });

    // Toggle current item
    accordionItem.classList.toggle('active');
  });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add cursor pointer class to interactive elements (accessibility)
const interactiveElements = document.querySelectorAll('.service-card, .accordion-header, button:not(.btn)');
interactiveElements.forEach(el => {
  if (!el.style.cursor) {
    el.style.cursor = 'pointer';
  }
});
