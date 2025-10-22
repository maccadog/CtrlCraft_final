// Email Handler for CtrlCraft - INTEGRATED VERSION with Enhanced Functionality
class EmailHandler {
    constructor() {
        // EmailJS Configuration
        this.SERVICE_ID = 'service_vh27g2b';
        this.TEMPLATE_ID = 'template_a957hvd';
        this.PUBLIC_KEY = 'S0zUDXqxW2Kw0getx';
        
        this.collectedImages = [];
        this.emailjsLoaded = false;
        this.uploadedFiles = new Set();
        this.isUploading = false;
        this.maxImages = 10;
        this.maxFileSize = 10 * 1024 * 1024;
        
        this.init();
    }

    init() {
        this.loadEmailJS();
        this.setupFormHandlers();
        this.setupImageCollection();
        this.setupDragAndDrop();
    }

    loadEmailJS() {
        if (typeof emailjs !== 'undefined') {
            this.emailjsLoaded = true;
            emailjs.init(this.PUBLIC_KEY);
            console.log('EmailJS already loaded and initialized');
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/sdk/v3/email.min.js';
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
            
            console.log('Form data collected:', data);
            
            // FIXED: Correct field name validation - matches your actual form fields
            if (!data.first_name || !data.last_name || !data.email || !data.design_description || 
                !data.controller_type || !data.service_type || !data.shipping_requirement) {
                let missingFields = [];
                if (!data.first_name) missingFields.push('First Name');
                if (!data.last_name) missingFields.push('Last Name');
                if (!data.email) missingFields.push('Email');
                if (!data.design_description) missingFields.push('Design Description');
                if (!data.controller_type) missingFields.push('Controller Type');
                if (!data.service_type) missingFields.push('Service Type');
                if (!data.shipping_requirement) missingFields.push('Shipping Agreement');
                
                throw new Error(`Please complete: ${missingFields.join(', ')}`);
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Prepare color information
            let colorInfo = 'No specific color selected';
            if (data.selected_paint_color) {
                colorInfo = `Paint Color: ${data.selected_paint_color}`;
                if (data.custom_paint_color) {
                    colorInfo += ` (${data.custom_paint_color})`;
                }
            } else if (data.selected_metallic_color) {
                colorInfo = `Metallic Finish: ${data.selected_metallic_color}`;
                if (data.custom_metallic_color) {
                    colorInfo += ` (${data.custom_metallic_color})`;
                }
            } else if (data.custom_paint_color || data.custom_metallic_color) {
                colorInfo = `Custom: ${data.custom_paint_color || data.custom_metallic_color}`;
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
                from_name: `${data.first_name} ${data.last_name}`.trim(),
                from_email: data.email.trim(),
                phone: data.phone || 'Not provided',
                service_type: data.service_type,
                controller_type: data.controller_type,
                timeline: data.timeline,
                color_choice: colorInfo,
                message: data.design_description.trim(),
                additional_notes: data.additional_notes || 'None',
                image_html: imageHtml.trim(),
                image_text: imageText.trim(),
                image_count: this.collectedImages.length.toString(),
                reply_to: data.email.trim()
            };
            
            console.log('Sending email with params:', emailParams);
            
            const response = await emailjs.send(
                this.SERVICE_ID,
                this.TEMPLATE_ID,
                emailParams
            );
            
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

    setupImageCollection() {
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

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-over'), false);
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        }, false);

        // Click to upload
        uploadArea.addEventListener('click', () => {
            document.getElementById('inspiration-upload').click();
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileUpload(files) {
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

        const fileArray = Array.from(files);
        const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showNotification('Please select valid image files.', 'error');
            this.isUploading = false;
            return;
        }

        if (this.collectedImages.length + imageFiles.length > this.maxImages) {
            this.showNotification(`Maximum ${this.maxImages} images allowed.`, 'error');
            this.isUploading = false;
            return;
        }

        imageFiles.forEach(file => {
            if (file.size > this.maxFileSize) {
                this.showNotification(`File ${file.name} is too large. Maximum 10MB allowed.`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result,
                    lastModified: file.lastModified
                };
                
                this.collectedImages.push(imageData);
                this.createImagePreview(imageData, e.target.result, this.collectedImages.length - 1);
            };
            reader.readAsDataURL(file);
        });
        
        this.isUploading = false;
    }

    createImagePreview(imageData, dataUrl, index) {
        const imagePreview = document.getElementById('image-preview');
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${dataUrl}" alt="${imageData.name}">
            <div class="absolute top-2 right-2">
                <button type="button" class="remove-image bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600" data-index="${index}">
                    ×
                </button>
            </div>
            <div class="p-2">
                <p class="text-xs text-gray-300 truncate">${imageData.name}</p>
                <p class="text-xs text-gray-400">${(imageData.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
        `;
        
        imagePreview.appendChild(previewItem);
        
        const removeBtn = previewItem.querySelector('.remove-image');
        removeBtn.addEventListener('click', () => {
            this.removeImage(index);
        });
    }

    removeImage(index) {
        this.collectedImages.splice(index, 1);
        this.refreshImagePreview();
        this.showNotification('Image removed successfully', 'success');
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

    resetForm() {
        this.collectedImages = [];
        this.uploadedFiles.clear();
        
        // Reset hidden inputs
        const selectedController = document.getElementById('selected-controller');
        const selectedService = document.getElementById('selected-service');
        const selectedPaintColor = document.getElementById('selected-paint-color');
        const selectedMetallicColor = document.getElementById('selected-metallic-color');
        
        if (selectedController) selectedController.value = '';
        if (selectedService) selectedService.value = '';
        if (selectedPaintColor) selectedPaintColor.value = '';
        if (selectedMetallicColor) selectedMetallicColor.value = '';
        
        // Reset visual selections
        document.querySelectorAll('.service-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelectorAll('.color-options-container').forEach(container => {
            container.classList.remove('active');
        });
        
        this.refreshImagePreview();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'
        }`;
        notification.textContent = message;
        notification.style.zIndex = '9999';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make page fade in immediately
    document.body.classList.add('visible');
    
    // Initialize email handler
    new EmailHandler();
    
    // Initialize form interactions
    const selectedControllerInput = document.getElementById('selected-controller');
    const selectedServiceInput = document.getElementById('selected-service');

    // Controller selection handlers
    document.querySelectorAll('.service-option[data-controller]').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.service-option[data-controller]').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            if (selectedControllerInput) {
                selectedControllerInput.value = this.dataset.controller;
            }
            console.log('Controller selected:', this.dataset.controller);
        });
    });

    // Service selection handlers
    document.querySelectorAll('.service-option[data-service]').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.service-option[data-service]').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            if (selectedServiceInput) {
                selectedServiceInput.value = this.dataset.service;
            }
            console.log('Service selected:', this.dataset.service);

            // Show/hide color options based on service
            const paintingColors = document.getElementById('painting-colors');
            const metallizingColors = document.getElementById('metallizing-colors');
            
            if (paintingColors) paintingColors.classList.remove('active');
            if (metallizingColors) metallizingColors.classList.remove('active');

            if (this.dataset.service === 'custom-painting') {
                setTimeout(() => {
                    if (paintingColors) paintingColors.classList.add('active');
                }, 100);
            } else if (this.dataset.service === 'vacuum-metallizing') {
                setTimeout(() => {
                    if (metallizingColors) metallizingColors.classList.add('active');
                }, 100);
            }
        });
    });

    // Color selection handlers
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const container = this.closest('.color-options-container');
            const options = container.querySelectorAll('.color-option');
            
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const color = this.getAttribute('data-color');
            if (container.id === 'painting-colors') {
                const selectedPaintColor = document.getElementById('selected-paint-color');
                if (selectedPaintColor) selectedPaintColor.value = color;
                console.log('Paint color selected:', color);
            } else if (container.id === 'metallizing-colors') {
                const selectedMetallicColor = document.getElementById('selected-metallic-color');
                if (selectedMetallicColor) selectedMetallicColor.value = color;
                console.log('Metallic color selected:', color);
            }
        });
    });

    console.log('Inquiry form initialized successfully!');
});