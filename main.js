// CtrlCraft Main JavaScript - Enhanced Version with Dust Animation & Modern Effects
// Using CDN versions of libraries instead of ES6 imports

class CtrlCraftApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.setupFormHandlers();
        this.initCarousels();
        this.createParticleEffect();
        this.initDustAnimation();
        this.initModernAnimations(); // Add new modern animations
        this.initScrollEffects(); // Add scroll-based animations
        this.initInteractiveEffects(); // Add hover and interactive effects
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });

        // Add resize listener for responsive animations
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initAnimations() {
        // Typewriter effect for hero text
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            if (!heroTitle.textContent.trim()) {
                this.typewriterEffect(heroTitle, 'Precision Gaming, Perfected');
            }
        } else {
            console.warn('Hero title element not found!');
        }

        // Animate service cards on load
        setTimeout(() => {
            this.animateServiceCards();
        }, 1000);

        // Auto-trigger scroll reveal animations for inquiry page
        if (window.location.pathname.includes('inquiry.html')) {
            setTimeout(() => {
                this.triggerScrollAnimations();
            }, 500);
        }
    }

    typewriterEffect(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    animateServiceCards() {
        const cards = document.querySelectorAll('.service-card');
        if (cards.length === 0) return;

        if (typeof anime !== 'undefined') {
            anime({
                targets: '.service-card',
                opacity: [0, 1],
                translateY: [50, 0],
                easing: 'easeOutExpo',
                delay: anime.stagger(150),
                duration: 800
            });
        } else {
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    }

    triggerScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(element => {
            element.classList.add('active');
        });
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-reveal:not(.active)');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    handleResize() {
        // Handle responsive adjustments for animations
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    setupFormHandlers() {
        // Service selection functionality
        const serviceOptions = document.querySelectorAll('.service-option');
        const selectedServiceInput = document.getElementById('selected-service');
        
        serviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                serviceOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                if (selectedServiceInput) {
                    const service = option.getAttribute('data-service');
                    selectedServiceInput.value = service;
                }
            });
        });
    }

    initCarousels() {
        const carousels = document.querySelectorAll('.carousel-container');
        carousels.forEach((carousel, index) => {
            this.setupCarousel(carousel, index);
        });
    }

    setupCarousel(carousel, index) {
        const images = carousel.querySelectorAll('img');
        if (images.length <= 1) return;

        let currentIndex = 0;
        const totalImages = images.length;

        images.forEach((img, i) => {
            if (i !== 0) {
                img.style.display = 'none';
            }
        });

        setInterval(() => {
            images[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % totalImages;
            images[currentIndex].style.display = 'block';
        }, 4000);
    }

    createParticleEffect() {
        const heroSections = document.querySelectorAll('.hero-particles');
        
        heroSections.forEach(section => {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'absolute w-1 h-1 bg-teal-400 rounded-full opacity-20';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 3 + 's';
                particle.style.animation = 'float 3s ease-in-out infinite';
                
                section.appendChild(particle);
            }
        });
    }

    // Dust Animation System
    initDustAnimation() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += 0.02;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                const currentOpacity = this.opacity + Math.sin(this.pulse) * 0.1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(20, 184, 166, ${Math.max(0.1, currentOpacity)})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationId = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    // Modern Animations System
    initModernAnimations() {
        this.initGradientBackground();
        this.initFloatingElements();
        this.initTextEffects();
        this.initButtonAnimations();
    }

    // Animated gradient background
    initGradientBackground() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            .animated-gradient {
                background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #2d2d2d, #1a1a1a);
                background-size: 400% 400%;
                animation: gradientShift 15s ease infinite;
            }
        `;
        document.head.appendChild(style);

        // Apply to body
        document.body.classList.add('animated-gradient');
    }

    // Floating elements animation
    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.service-card, .form-container');
        
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.2}s`;
            element.classList.add('floating-element');
        });

        const floatStyle = document.createElement('style');
        floatStyle.textContent = `
            @keyframes subtleFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .floating-element {
                animation: subtleFloat 6s ease-in-out infinite;
            }
        `;
        document.head.appendChild(floatStyle);
    }

    // Text effects
    initTextEffects() {
        const headings = document.querySelectorAll('h1, h2, h3');
        
        headings.forEach(heading => {
            heading.addEventListener('mouseenter', () => {
                heading.style.transform = 'scale(1.05)';
                heading.style.transition = 'transform 0.3s ease';
            });
            
            heading.addEventListener('mouseleave', () => {
                heading.style.transform = 'scale(1)';
            });
        });
    }

    // Button animations
    initButtonAnimations() {
        const buttons = document.querySelectorAll('button, .btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 10px 25px rgba(20, 184, 166, 0.3)';
                button.style.transition = 'all 0.3s ease';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });
    }

    // Scroll-based animations
    initScrollEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Interactive effects
    initInteractiveEffects() {
        this.initHoverEffects();
        this.initClickEffects();
        this.initFocusEffects();
    }

    initHoverEffects() {
        const cards = document.querySelectorAll('.service-card, .portfolio-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
                card.style.boxShadow = '0 15px 35px rgba(20, 184, 166, 0.2)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }

    initClickEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, .service-option')) {
                this.createRippleEffect(e);
            }
        });
    }

    createRippleEffect(e) {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initFocusEffects() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`;
        notification.textContent = message;
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CtrlCraftApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    .drag-over {
        border-color: #14b8a6 !important;
        background: rgba(20, 184, 166, 0.1) !important;
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);

// Global function for backward compatibility
function checkEmptyPreview() {
    const imagePreview = document.getElementById('image-preview');
    if (emailHandler && emailHandler.refreshImagePreview) {
        emailHandler.refreshImagePreview();
    } else if (imagePreview && imagePreview.children.length === 0) {
        imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
    }
}