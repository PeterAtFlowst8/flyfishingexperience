import './style.css'

console.log('Fly Fishing Experience: Broadsheet Edition Ready.');

// 1. Intersection Observer for "Fade In" of Grid Items
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stop observing once visible to avoid re-triggering
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Target the new grid components for animation
const gridItems = document.querySelectorAll(
  '.grid-hero, .grid-mission, .grid-location, .grid-testimonials, .service-menu-item, .grid-faq, .footer-section'
);

gridItems.forEach((item, index) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Define transition here or in CSS

  // Stagger the service menu items slightly
  if (item.classList.contains('service-menu-item')) {
    // Calculate index relative to the start of service items for stagger
    // simplified stagger for now
    item.style.transitionDelay = `${(index % 3) * 0.1}s`;
  }

  observer.observe(item);
});

// Add a class to handle the "visible" state
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(styleSheet);


// 2. FAQ Accordion Logic
document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
    const accordionItem = button.parentElement;
    const isActive = accordionItem.classList.contains('active');

    // Close all other accordion items
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle current item if it wasn't already active
    if (!isActive) {
      accordionItem.classList.add('active');
    }
  });
});

// 3. Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const submitText = contactForm.querySelector('.submit-text');
    const submitLoading = contactForm.querySelector('.submit-loading');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');

    // Reset messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    // Loading state
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';

    const data = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        contactForm.reset();
        successMsg.style.display = 'block';
      } else {
        errorMsg.style.display = 'block';
      }
    } catch {
      errorMsg.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
    }
  });
}

// 4. Smooth Scroll for Anchor Links (Masthead -> Sections)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Calculate offset (masthead height approx 150px-200px, but it's static now)
      // Since it's static, we can scroll to the top of the element minus a small buffer
      const offset = 20;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});
