// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const themeText = themeToggle.querySelector('.theme-text');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Counter Functionality
let count = 0;
const counterElement = document.getElementById('counter');

function updateCounter() {
  count++;
  counterElement.textContent = count;
  
  // Add animation effect
  counterElement.style.animation = 'none';
  counterElement.offsetHeight; // Trigger reflow
  counterElement.style.animation = 'countUp 0.3s ease';
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes countUp {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Navigation and Section Handling
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
  document.body.classList.add('dark-mode');
  updateThemeText(true);
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  updateThemeText(isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeIcon.style.animation = 'spin 0.5s ease';
  setTimeout(() => {
    themeIcon.style.animation = '';
  }, 500);
});

// Update theme text and icon
function updateThemeText(isDark) {
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

// Handle section transitions
function handleSectionTransition(targetId) {
  // Remove active class from all links
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Add active class to clicked link
  const activeLink = document.querySelector(`nav a[href="#${targetId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Update URL hash without triggering scroll
  history.pushState(null, null, `#${targetId}`);
  
  // Update section visibility
  sections.forEach(section => {
    if (section.id === targetId) {
      section.style.opacity = '1';
      section.style.transform = 'scale(1)';
    } else {
      section.style.opacity = '0.7';
      section.style.transform = 'scale(0.98)';
    }
  });
}

// Add click handlers to navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    handleSectionTransition(targetId);
    
    // Smooth scroll to section
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const navHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight - 20;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Update active section on scroll
let scrollTimeout;
function updateActiveSection() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollPosition = window.scrollY;
    const navHeight = document.querySelector('nav').offsetHeight;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - navHeight - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const sectionId = section.getAttribute('id');
        handleSectionTransition(sectionId);
      }
    });
  }, 100);
}

// Add scroll event listener with throttling
window.addEventListener('scroll', () => {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      updateActiveSection();
      scrollTimeout = null;
    }, 100);
  }
});

// Handle initial active section
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1);
  if (hash) {
    handleSectionTransition(hash);
  } else {
    handleSectionTransition('about');
  }
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    document.body.classList.toggle('dark-mode', e.matches);
    updateThemeText(e.matches);
  }
});

// Form Validation
const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
    });

    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

function validateInput(input) {
    const errorMessage = input.nextElementSibling;
    
    if (input.validity.valid) {
        input.classList.remove('invalid');
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    } else {
        input.classList.add('invalid');
        errorMessage.textContent = getErrorMessage(input);
        errorMessage.style.display = 'block';
    }
}

function getErrorMessage(input) {
    if (input.validity.valueMissing) {
        return 'This field is required';
    }
    if (input.validity.typeMismatch) {
        return 'Please enter a valid ' + input.type;
    }
    if (input.validity.tooShort) {
        return `Please enter at least ${input.minLength} characters`;
    }
    if (input.validity.tooLong) {
        return `Please enter no more than ${input.maxLength} characters`;
    }
    if (input.validity.patternMismatch) {
        return input.title;
    }
    return 'Please enter a valid value';
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    formInputs.forEach(input => {
        if (!input.validity.valid) {
            validateInput(input);
            isValid = false;
        }
    });

    if (isValid) {
        // Here you would typically send the form data to a server
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    }
}); 