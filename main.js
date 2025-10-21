// CtrlCraft Main JavaScript - Fixed Version
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
            this.typewriterEffect(heroTitle, 'Precision Gaming, Perfected');
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
            console.warn('Anime.js not loaded — using fallback CSS animation');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    setupFormHandlers() {
        const inquiryForm = document.getElementById('inquiry-form');
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleInquirySubmission(e.target);
            });
        }

        // Service selection
        const serviceCards = document.querySelectorAll('.service-option');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectService(card);
            });
        });

        // File upload handling
        const fileInput = document.getElementById('inspiration-upload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        }
    }

    selectService(selectedCard) {
        // Remove previous selections
        document.querySelectorAll('.service-option').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        selectedCard.classList.add('selected');
        
        // Update hidden form field
        const serviceInput = document.getElementById('selected-service');
        if (serviceInput) {
            serviceInput.value = selectedCard.dataset.service;
        }
    }

    handleFileUpload(input) {
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview && input.files.length > 0) {
            imagePreview.innerHTML = '';
            Array.from(input.files).forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.createImagePreview(file, e.target.result, index);
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else if (imagePreview) {
            imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
        }
    }

    createImagePreview(file, imageData, index) {
        const imagePreview = document.getElementById('image-preview');
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${imageData}" alt="${file.name}">
            <div class="file-info">
                <div class="text-white text-xs truncate">${file.name}</div>
                <div class="text-gray-400 text-xs">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove(); checkEmptyPreview();">×</button>
        `;
        
        imagePreview.appendChild(previewItem);
    }

    async handleInquirySubmission(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Inquiry sent successfully! We\'ll contact you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset service selection
            document.querySelectorAll('.service-option').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Reset file upload display
            const imagePreview = document.getElementById('image-preview');
            if (imagePreview) {
                imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
            }
            
            // Redirect to main page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification('Failed to send inquiry. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Inquiry';
        }
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