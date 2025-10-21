// CtrlCraft Main JavaScript - Fixed Version with Dust Animation
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
        this.initDustAnimation(); // Add dust animation initialization
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
    }

    initAnimations() {
        // Typewriter effect for hero text
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
            // Set default text for inquiry page if not set
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

        // Check if Anime.js is available
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
            // Fallback animation
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

    setupFormHandlers() {
        // Service selection functionality
        const serviceOptions = document.querySelectorAll('.service-option');
        const selectedServiceInput = document.getElementById('selected-service');
        
        serviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                serviceOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Set the hidden input value
                if (selectedServiceInput) {
                    const service = option.getAttribute('data-service');
                    selectedServiceInput.value = service;
                }
            });
        });
    }

    initCarousels() {
        // Initialize any image carousels if they exist
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

        // Hide all images except the first one
        images.forEach((img, i) => {
            if (i !== 0) {
                img.style.display = 'none';
            }
        });

        // Auto-rotate carousel
        setInterval(() => {
            images[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % totalImages;
            images[currentIndex].style.display = 'block';
        }, 4000);
    }

    createParticleEffect() {
        // Create subtle particle effect for hero sections
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

    // New method for dust animation
    initDustAnimation() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
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

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Clean up animation when leaving the page
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
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
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 5 seconds
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

// Add CSS animation for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;
document.head.appendChild(style);

// Function to check if image preview is empty
function checkEmptyPreview() {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview && imagePreview.children.length === 0) {
        imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
    }
}