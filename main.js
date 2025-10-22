// CtrlCraft Main JavaScript - Fixed Version for Inquiry Page Compatibility
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
        this.initModernAnimations();
        this.initScrollEffects();
        this.initInteractiveEffects();
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
                delay: anime.stagger(200),
                duration: 800,
                easing: 'easeOutQuart'
            });
        }
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
        // FIXED: Only set up form handlers if we're NOT on the inquiry page
        // This prevents conflicts with the inquiry page's own form handling
        if (window.location.pathname.includes('inquiry.html')) {
            console.log('On inquiry page - skipping main.js form handlers');
            return;
        }

        // Service selection for non-inquiry pages
        const serviceOptions = document.querySelectorAll('.service-option[data-service]');
        const selectedServiceInput = document.getElementById('selected-service');

        serviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                serviceOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                if (selectedServiceInput) {
                    selectedServiceInput.value = option.dataset.service;
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
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(20, 184, 166, ${this.opacity})`;
                ctx.fill();
            }
        }

        function createParticles() {
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationId = requestAnimationFrame(animate);
        }

        createParticles();
        animate();
    }

    initModernAnimations() {
        // Add modern animation effects
        if (typeof anime !== 'undefined') {
            // Floating animation for elements
            anime({
                targets: '.float-element',
                translateY: [-10, 10],
                duration: 3000,
                loop: true,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });
        }
    }

    initScrollEffects() {
        // Enhanced scroll-based animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    initInteractiveEffects() {
        // Add hover effects and interactive animations
        document.querySelectorAll('.hover-lift').forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: element,
                        translateY: -5,
                        scale: 1.02,
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                }
            });

            element.addEventListener('mouseleave', () => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: element,
                        translateY: 0,
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                }
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('CtrlCraft App initializing...');
    new CtrlCraftApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(20, 184, 166, 0.5); }
        50% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.8); }
    }
    
    .glow-effect {
        animation: glow 2s ease-in-out infinite;
    }
`;
document.head.appendChild(style);