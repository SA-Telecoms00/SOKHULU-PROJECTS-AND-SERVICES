/**
 * SOKHULU PROJECTS AND SERVICES
 * Main JavaScript File
 * Handles navigation, mobile menu, FAQ accordion, form submissions, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initHeaderScroll();
    initMobileMenu();
    initFAQAccordion();
    initFormSubmissions();
    initSmoothScroll();
    initScrollAnimations();
    initWhatsAppPopup();
});

/**
 * Header scroll effect - adds shadow and styling when scrolling
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for shadow effect
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial check
    updateHeader();
}

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.getElementById('navList');
    
    if (!mobileMenuBtn || !navList) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
    
    // Close menu when clicking a nav link
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navList.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !navList.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navList.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/**
 * FAQ Accordion functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (!question) return;
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            this.setAttribute('aria-expanded', !isActive);
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Form submission handling with validation
 */
function initFormSubmissions() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Support form
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#dc3545';
            
            // Remove error styling on input
            field.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate form submission (replace with actual AJAX call)
    setTimeout(function() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
    }, 1500);
}

/**
 * Show notification toast
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification-toast ' + type;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#1a472a' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        font-weight: 500;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(function() {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after 4 seconds
    setTimeout(function() {
        notification.style.transform = 'translateX(120%)';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 4000);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll animations for elements
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .why-us-card, .testimonial-card, .about-feature, .faq-item');
    
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * WhatsApp Popup - Floating chat button
 */
function initWhatsAppPopup() {
    // Check if already exists
    if (document.querySelector('.whatsapp-popup')) return;
    
    const phoneNumber = '+27670526292';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'whatsapp-popup';
    popup.innerHTML = `
        <button class="whatsapp-close" aria-label="Close WhatsApp popup">×</button>
        <div class="whatsapp-icon">
            <i class="fab fa-whatsapp"></i>
        </div>
        <div class="whatsapp-text">
            <strong>Chat on WhatsApp</strong>
            <span>Click to message us</span>
        </div>
    `;
    
    // Click to open WhatsApp
    popup.addEventListener('click', function(e) {
        if (e.target.closest('.whatsapp-close')) {
            e.stopPropagation();
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(20px)';
            setTimeout(() => popup.remove(), 300);
            
            // Store in session that user closed it
            sessionStorage.setItem('whatsappPopupClosed', 'true');
            return;
        }
        
        window.open(whatsappUrl, '_blank');
    });
    
    document.body.appendChild(popup);
    
    // Animate in
    requestAnimationFrame(function() {
        popup.style.opacity = '1';
    });
}

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHeaderScroll,
        initMobileMenu,
        initFAQAccordion,
        initFormSubmissions,
        initSmoothScroll,
        initScrollAnimations,
        showNotification,
        debounce,
        throttle,
        initWhatsAppPopup
    };
}
