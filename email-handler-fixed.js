// Email Handler for CtrlCraft - Enhanced Version with Image Support
// This solution requires no server, database, or Firebase

class EmailHandler {
    constructor() {
        // EmailJS Configuration
        // You'll need to sign up at https://www.emailjs.com and get these values
        this.SERVICE_ID = 'service_vh27g2b'; // Replace with your EmailJS service ID
        this.TEMPLATE_ID = 'template_a957hvd'; // Replace with your EmailJS template ID
        this.PUBLIC_KEY = 'S0zUDXqxW2Kw0getx'; // Replace with your EmailJS public key
        
        // Image collection array
        this.collectedImages = [];
        this.emailjsLoaded = false;
        this.uploadedFiles = new Set(); // Track uploaded files to prevent duplicates
        
        this.init();
    }

    init() {
        // Load EmailJS SDK
        this.loadEmailJS();
        
        // Setup form handlers
        this.setupFormHandlers();
        this.setupImageCollection();
    }

    setupImageCollection() {
        // Handle file uploads and store image data
        const fileInput = document.getElementById('inspiration-upload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }

    handleFileUpload(files) {
        const imagePreview = document.getElementById('image-preview');
        if (!imagePreview) return;

        // Clear existing previews if this is a new selection (not adding to existing)
        if (files.length > 0) {
            imagePreview.innerHTML = '';
            this.collectedImages = [];
            this.uploadedFiles.clear();
        }

        if (files.length === 0) {
            imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
            return;
        }

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const fileKey = `${file.name}-${file.size}`;
                
                // Skip if this file is already uploaded
                if (this.uploadedFiles.has(fileKey)) {
                    console.log('Skipping duplicate file:', file.name);
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Store base64 image data
                    this.collectedImages.push({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        data: e.target.result
                    });
                    
                    // Mark this file as uploaded
                    this.uploadedFiles.add(fileKey);
                    
                    // Create image preview
                    this.createImagePreview(file, e.target.result, index);
                };
                reader.readAsDataURL(file);
            }
        });
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

    loadEmailJS() {
        // Check if EmailJS is already loaded
        if (typeof emailjs !== 'undefined') {
            this.emailjsLoaded = true;
            emailjs.init(this.PUBLIC_KEY);
            console.log('EmailJS already loaded and initialized');
            return;
        }

        // Add EmailJS script to head
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
            // Initialize EmailJS with your public key
            if (typeof emailjs !== 'undefined') {
                emailjs.init(this.PUBLIC_KEY);
                this.emailjsLoaded = true;
                console.log('EmailJS initialized successfully');
            } else {
                console.error('EmailJS failed to load');
                this.showNotification('Email service failed to load. Please refresh the page.', 'error');
            }
        };
        script.onerror = () => {
            console.error('EmailJS script failed to load');
            this.showNotification('Email service unavailable. Please contact directly.', 'error');
        };
        document.head.appendChild(script);
    }

    setupFormHandlers() {
        // Handle inquiry form submissions
        const inquiryForm = document.getElementById('inquiry-form');
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleInquirySubmission(e.target);
            });
        }

        // Handle contact form submissions (if any)
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmission(e.target);
            });
        }
    }

    async handleInquirySubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Check if EmailJS is loaded
            if (!this.emailjsLoaded || typeof emailjs === 'undefined') {
                throw new Error('Email service is not ready. Please wait a moment and try again.');
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Debug: Log form data
            console.log('Form data:', data);
            
            // Validate required fields
            if (!data.name || !data.email || !data.message || !data['shipping-confirm']) {
                throw new Error('Please fill in all required fields and confirm shipping requirements');
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Prepare image data for email - create HTML with embedded images
            let imageHtml = '<p><strong>No images uploaded</strong></p>';
            let imageText = 'No images uploaded';
            
            if (this.collectedImages.length > 0) {
                imageHtml = '<div style="margin: 20px 0;"><h3>Reference Images:</h3>';
                imageText = 'Reference Images:\n';
                
                this.collectedImages.forEach((img, index) => {
                    // Add image to HTML email
                    imageHtml += `
                        <div style="display: inline-block; margin: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                            <img src="${img.data}" alt="${img.name}" style="max-width: 200px; max-height: 200px; display: block; margin-bottom: 5px;">
                            <p style="font-size: 12px; margin: 0; text-align: center;"><strong>Image ${index + 1}:</strong> ${img.name}</p>
                            <p style="font-size: 11px; margin: 0; text-align: center; color: #666;">Size: ${(img.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    `;
                    
                    // Add to plain text
                    imageText += `Image ${index + 1}: ${img.name} (${(img.size / 1024 / 1024).toFixed(2)} MB)\n`;
                });
                
                imageHtml += '</div>';
            }
            
            // Prepare email parameters
            const emailParams = {
                to_email: 'mackenzie5688@gmail.com', // Your email address
                from_name: data.name.trim(),
                from_email: data.email.trim(),
                phone: data.phone || 'Not provided',
                service_type: data.service || 'Not specified',
                controller_type: data['controller-type'] || 'Not specified',
                timeline: data.timeline || 'Not specified',
                message: data.message.trim(),
                image_html: imageHtml,
                image_text: imageText,
                image_count: this.collectedImages.length.toString(),
                reply_to: data.email.trim()
            };
            
            // Debug: Log email parameters
            console.log('Email params:', emailParams);
            console.log('Images collected:', this.collectedImages.length);
            
            // Send email using EmailJS
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                emailParams
            );
            
            // Debug: Log response
            console.log('EmailJS response:', response);
            
            if (response.status === 200 || response.text === 'OK') {
                this.showNotification('Inquiry sent successfully! I\'ll contact you soon.', 'success');
                form.reset();
                this.collectedImages = [];
                this.uploadedFiles.clear();
                
                // Reset service selection if exists
                document.querySelectorAll('.service-option').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Reset image preview
                const imagePreview = document.getElementById('image-preview');
                if (imagePreview) {
                    imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
                }
                
                // Redirect to main page after 3 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                throw new Error(`Failed to send email: ${response.text || 'Unknown error'}`);
            }
            
        } catch (error) {
            console.error('Email sending error:', error);
            this.showNotification(error.message || 'Failed to send inquiry. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`;
        notification.textContent = message;
        
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

// Initialize the email handler when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EmailHandler();
});

// Service card selection functionality
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-option');
    const serviceInput = document.getElementById('selected-service');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from all cards
            serviceCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            card.classList.add('selected');
            
            // Update hidden form field
            if (serviceInput) {
                serviceInput.value = card.dataset.service;
            }
        });
    });
});

// Function to check if image preview is empty
function checkEmptyPreview() {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview && imagePreview.children.length === 0) {
        imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
    }
}