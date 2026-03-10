// ==========================================
// HELDER SANTANA - MODERN PORTFOLIO v2.0
// Clean & Professional JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initNavigation();
    initTypingEffect();
    initCounterAnimation();
    initSkillTabs();
    initSkillBars();
    initScrollAnimations();
    initContactForm();
    
    // Set initial counter values
    initializeCounters();
});

// ==========================================
// PARTICLE BACKGROUND (Light Theme Optimized)
// ==========================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 200 };

    // Light theme colors - softer blue tones
    const colors = [
        'rgba(0, 102, 255, 0.3)',   // primary
        'rgba(0, 201, 167, 0.25)',  // secondary
        'rgba(124, 58, 237, 0.2)',  // accent
        'rgba(0, 102, 255, 0.15)'   // light primary
    ];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Mouse move with throttle for performance
    let mouseTimeout;
    window.addEventListener('mousemove', (e) => {
        if (mouseTimeout) return;
        
        mouseTimeout = setTimeout(() => {
            mouse.x = e.x;
            mouse.y = e.y;
            mouseTimeout = null;
        }, 10);
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Mouse interaction - subtle repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * 0.5;
                    const moveY = Math.sin(angle) * force * 0.5;
                    
                    this.x -= moveX;
                    this.y -= moveY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.1;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    createParticles();
    animateParticles();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            createParticles();
        }, 200);
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar || !navToggle || !navMenu) return;

    // Scroll effect with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Smooth scroll
            document.querySelector(targetId)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Update active link based on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id], [id="home"]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Set initial active link
    updateActiveLink();
}

// ==========================================
// TYPING EFFECT
// ==========================================
function initTypingEffect() {
    const element = document.getElementById('typingText');
    if (!element) return;

    const texts = [
        'Network Engineer',
        'Cybersecurity Analyst',
        'FortiGate Specialist',
        'Blue Team Defender',
        'Python Automation',
        'SOC Analyst',
        'Firewall Administrator',
        'Infrastructure Security'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = counter.getAttribute('data-target');
        counter.textContent = '0';
    });
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    let animated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = Date.now();
            const startValue = 0;

            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeOutCubic * (target - startValue) + startValue);

                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }

            updateCounter();
        });
    }

    // Trigger when stats section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3, rootMargin: '0px' });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ==========================================
// SKILLS TABS
// ==========================================
function initSkillTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active to current
            btn.classList.add('active');
            
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Re-animate skill bars in active tab
                animateSkillBars(targetContent);
            }
        });
    });
}

function animateSkillBars(container) {
    const bars = container.querySelectorAll('.skill-progress');
    bars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        if (progress) {
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 100);
        }
    });
}

// ==========================================
// SKILL BARS ANIMATION
// ==========================================
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    if (progress) {
                        setTimeout(() => {
                            bar.style.width = `${progress}%`;
                        }, 300);
                    }
                });
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    // Observe all skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Optional: unobserve after animation
                setTimeout(() => {
                    observer.unobserve(entry.target);
                }, 1000);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.skill-card, .service-card, .timeline-item, .cert-card, .lab-card, .contact-method, .tool-item, .info-card'
    );

    animateElements.forEach((el, index) => {
        el.style.setProperty('--animation-order', index);
        observer.observe(el);
    });
}

// ==========================================
// CONTACT FORM
// ==========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;

        // Validate form
        if (!validateForm(form)) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Disable button and show loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';

        try {
            // Simulate form submission
            await simulateFormSubmit(form);
            
            // Success
            btn.innerHTML = '<i class="fas fa-check"></i> <span>Mensagem Enviada!</span>';
            btn.style.background = 'var(--success)';
            
            showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);

        } catch (error) {
            // Error
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Erro ao enviar</span>';
            btn.style.background = 'var(--danger)';
            
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger)';
            
            // Add shake animation
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
            
            isValid = false;
        } else {
            input.style.borderColor = '';
            
            // Email validation
            if (input.type === 'email' && !isValidEmail(input.value)) {
                input.style.borderColor = 'var(--danger)';
                isValid = false;
            }
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function simulateFormSubmit(form) {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--success-light)' : 
                    type === 'error' ? '#fee2e2' : 'var(--primary-light)'};
        border: 1px solid ${type === 'success' ? 'var(--success)' : 
                           type === 'error' ? 'var(--danger)' : 'var(--primary)'};
        border-radius: var(--radius-md);
        color: ${type === 'success' ? 'var(--success)' : 
                type === 'error' ? 'var(--danger)' : 'var(--primary)'};
        font-family: var(--font-mono);
        font-size: 0.85rem;
        z-index: 10000;
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add animation keyframes if not exist
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .shake {
                animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
            }
            @keyframes shake {
                10%, 90% { transform: translateX(-1px); }
                20%, 80% { transform: translateX(2px); }
                30%, 50%, 70% { transform: translateX(-4px); }
                40%, 60% { transform: translateX(4px); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// PARALLAX EFFECT FOR HERO (Optional)
// ==========================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    
    // Subtle parallax for hero visual
    const visual = document.querySelector('.hero-visual');
    if (visual) {
        visual.style.transform = `translateY(${rate * 0.1}px)`;
    }
});

// ==========================================
// LAZY LOADING FOR SECTIONS
// ==========================================
if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    });

    document.querySelectorAll('.section').forEach(section => {
        lazyObserver.observe(section);
    });
}

// ==========================================
// PERFORMANCE OPTIMIZATIONS
// ==========================================
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// PAGE LOAD ANIMATION
// ==========================================
window.addEventListener('load', () => {
    // Fade in body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Trigger initial animations for visible elements
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('fade-in-up');
        }
    }, 100);
});

// ==========================================
// ERROR HANDLING
// ============================s==============
window.addEventListener('error', (e) => {
    console.error('Script error:', e.message);
    // Optionally show user-friendly message
});

// ==========================================
// EXPORT FOR MODULE USE (if needed)
// ==========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initTypingEffect,
        initCounterAnimation,
        initSkillTabs,
        initContactForm
    };
}