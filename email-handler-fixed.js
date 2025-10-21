// Email Handler for CtrlCraft - Enhanced Version with Image Support
// This solution requires no server, database, or Firebase

class EmailHandler {
    constructor() {
        // EmailJS Configuration
        // You'll need to sign up at https://www.emailjs.com and get these values
        this.SERVICE_ID = 'service_vh27g2b'; // Replace with your EmailJS service ID
        this.TEMPLATE_ID = 'template_a957hvd'; // Replace with your EmailJS template ID
        this.PUBLIC_KEY = 'S0zUDXqxW2Kw0getx'; // Replace with your EmailJS public key
        
        // Image collection array - now supports multiple images better
        this.collectedImages = [];
        this.emailjsLoaded = false;
        this.uploadedFiles = new Set(); // Track uploaded files to prevent duplicates
        this.isUploading = false; // Prevent multiple uploads
        this.maxImages = 10; // Maximum number of images allowed
        this.maxFileSize = 10 * 1024 * 1024; // 10MB max file size
        
        this.init();
    }

    init() {
        // Load EmailJS SDK
        this.loadEmailJS();
        
        // Setup form handlers
        this.setupFormHandlers();
        this.setupImageCollection();
        this.setupDragAndDrop(); // Add drag and drop support
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

    setupDragAndDrop() {
        const uploadArea = document.querySelector('.file-upload');
        if (!uploadArea) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-over'), false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        }, false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileUpload(files) {
        // Prevent multiple simultaneous uploads
        if (this.isUploading) {
            console.log('Upload already in progress, skipping...');
            return;
        }
        
        this.isUploading = true;
        const imagePreview = document.getElementById('image-preview');
        if (!imagePreview) {
            this.isUploading = false;
            return;
        }

        // Convert FileList to Array for easier handling
        const fileArray = Array.from(files);
        
        // Filter for image files only
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showNotification('Please select valid image files.', 'error');
            this.isUploading = false;
            return;
        }

        // Check total image limit
        const totalImages = this.collectedImages.length + imageFiles.length;
        if (totalImages > this.maxImages) {
            this.showNotification(`Maximum ${this.maxImages} images allowed. You have ${this.collectedImages.length} already uploaded.`, 'error');
            this.isUploading = false;
            return;
        }

        // Clear "no files selected" message if this is the first upload
        if (this.collectedImages.length === 0) {
            imagePreview.innerHTML = '';
        }

        // Process each file
        let processedCount = 0;
        let errorCount = 0;

        imageFiles.forEach((file, index) => {
            // Check file size
            if (file.size > this.maxFileSize) {
                this.showNotification(`File ${file.name} is too large. Maximum size is 10MB.`, 'error');
                errorCount++;
                processedCount++;
                return;
            }

            const fileKey = `${file.name}-${file.size}`;
            
            // Skip if this file is already processed
            if (this.uploadedFiles.has(fileKey)) {
                console.log('Skipping duplicate file:', file.name);
                processedCount++;
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                // Store image data
                const imageData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result
                };
                
                this.collectedImages.push(imageData);
                this.uploadedFiles.add(fileKey);
                
                // Create image preview
                this.createImagePreview(file, e.target.result, this.collectedImages.length - 1);
                
                processedCount++;
                
                // Check if all files are processed
                if (processedCount === imageFiles.length) {
                    this.isUploading = false;
                    if (errorCount === 0) {
                        this.showNotification(`${imageFiles.length} image(s) uploaded successfully!`, 'success');
                    }
                }
            };
            
            reader.onerror = () => {
                this.showNotification(`Failed to read file: ${file.name}`, 'error');
                processedCount++;
                errorCount++;
                if (processedCount === imageFiles.length) {
                    this.isUploading = false;
                }
            };
            
            reader.readAsDataURL(file);
        });
    }

    createImagePreview(file, imageData, index) {
        const imagePreview = document.getElementById('image-preview');
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${imageData}" alt="${file.name}" loading="lazy">
            <div class="file-info">
                <div class="text-white text-xs truncate">${file.name}</div>
                <div class="text-gray-400 text-xs">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button type="button" class="remove-btn" onclick="emailHandler.removeImage(${index})">×</button>
        `;
        
        imagePreview.appendChild(previewItem);
    }

    removeImage(index) {
        // Remove from collected images
        if (index >= 0 && index < this.collectedImages.length) {
            const removedImage = this.collectedImages[index];
            this.collectedImages.splice(index, 1);
            
            // Remove from uploaded files tracking
            const fileKey = `${removedImage.name}-${removedImage.size}`;
            this.uploadedFiles.delete(fileKey);
            
            // Refresh the preview
            this.refreshImagePreview();
            
            this.showNotification('Image removed successfully', 'success');
        }
    }

    refreshImagePreview() {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = '';
        
        if (this.collectedImages.length === 0) {
            imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
            return;
        }
        
        this.collectedImages.forEach((img, index) => {
            this.createImagePreview(img, img.data, index);
        });
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
        const inquiryForm = document.getElementById('inquiry-form');
        if (inquiryForm) {
            inquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleInquirySubmission(e.target);
            });
        }
    }

    async handleInquirySubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            if (!this.emailjsLoaded || typeof emailjs === 'undefined') {
                throw new Error('Email service is not ready. Please wait a moment and try again.');
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Form data:', data);
            
            if (!data.name || !data.email || !data.message || !data['shipping-confirm']) {
                throw new Error('Please fill in all required fields and confirm shipping requirements');
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Prepare image data
            let imageHtml = '<p><strong>No images uploaded</strong></p>';
            let imageText = 'No images uploaded';
            
            if (this.collectedImages.length > 0) {
                imageHtml = '<div style="margin: 20px 0;"><h3>Reference Images:</h3>';
                imageText = 'Reference Images:\n';
                
                this.collectedImages.forEach((img, index) => {
                    imageHtml += `
                        <div style="display: inline-block; margin: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                            <img src="${img.data}" alt="${img.name}" style="max-width: 200px; max-height: 200px; display: block; margin-bottom: 5px;">
                            <p style="font-size: 12px; margin: 0; text-align: center;"><strong>Image ${index + 1}:</strong> ${img.name}</p>
                            <p style="font-size: 11px; margin: 0; text-align: center; color: #666;">Size: ${(img.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    `;
                    imageText += `Image ${index + 1}: ${img.name} (${(img.size / 1024 / 1024).toFixed(2)} MB)\n`;
                });
                
                imageHtml += '</div>';
            }
            
            const emailParams = {
                to_email: 'mackenzie5688@gmail.com',
                from_name: data.name.trim(),
                from_email: data.email.trim(),
                phone: data.phone || 'Not provided',
                service_type: data.service || 'Not specified',
                controller_type: data['controller-type'] || 'Not specified',
                timeline: data.timeline || 'Not specified',
                message: data.message.trim(),
                image_html: imageHtml.trim(),
                image_text: imageText.trim(),
                image_count: this.collectedImages.length.toString(),
                reply_to: data.email.trim()
            };
            
            console.log('Email params:', emailParams);
            console.log('Images collected:', this.collectedImages.length);
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                emailParams
            );
            
            console.log('EmailJS response:', response);
            
            if (response.status === 200 || response.text === 'OK') {
                this.showNotification('Inquiry sent successfully! I\'ll contact you soon.', 'success');
                form.reset();
                this.resetForm();
                
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
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    resetForm() {
        this.collectedImages = [];
        this.uploadedFiles.clear();
        
        // Reset service selection
        document.querySelectorAll('.service-option').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset image preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
        }
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

// Initialize the email handler when the page loads
let emailHandler;
document.addEventListener('DOMContentLoaded', () => {
    emailHandler = new EmailHandler();
});

// Global function for backward compatibility
function checkEmptyPreview() {
    const imagePreview = document.getElementById('image-preview');
    if (imagePreview && imagePreview.children.length === 0) {
        imagePreview.innerHTML = '<p class="text-gray-400 text-sm text-center">No files selected</p>';
    }
}