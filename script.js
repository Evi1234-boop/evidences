/**
 * E-vide Platform JavaScript
 * This file contains common functionality used across the E-vide platform.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize form validation if forms exist
    initFormValidation();
    
    // Initialize tab switching if tabs exist
    initTabSwitching();
    
    // Initialize authentication
    initAuthentication();
});

/**
 * Authentication
 * Handles user authentication across the platform
 */
function initAuthentication() {
    // Check if logout button exists and add event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Check if we're on a protected page (not login or index)
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html' && currentPage !== 'index.html' && currentPage !== '') {
        checkAuth();
    }
}

/**
 * Check Authentication
 * Checks if user is authenticated and redirects to login if not
 */
function checkAuth() {
    const isLoggedIn = localStorage.getItem('evide_logged_in');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

/**
 * Logout
 * Logs out the user by clearing localStorage and redirecting to login
 */
function logout() {
    localStorage.removeItem('evide_logged_in');
    localStorage.removeItem('evide_user');
    window.location.href = 'login.html';
}

/**
 * Login
 * Logs in the user by setting localStorage values
 * @param {string} email - The user's email
 */
function login(email) {
    localStorage.setItem('evide_logged_in', 'true');
    localStorage.setItem('evide_user', email);
    window.location.href = 'dashboard.html';
}

/**
 * Mobile Navigation
 * Handles the mobile navigation menu toggle and animations
 */
function initMobileNav() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (!burger || !nav) return;
    
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

/**
 * Tab Switching
 * Handles tab switching functionality on pages with tabs
 */
function initTabSwitching() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabs.length || !tabContents.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-content`);
            
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

/**
 * Form Validation
 * Handles basic form validation for all forms
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    if (!forms.length) return;
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightInvalidField(field);
                } else {
                    removeInvalidHighlight(field);
                }
            });
            
            // Validate email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            
            emailFields.forEach(field => {
                if (field.value.trim() && !isValidEmail(field.value)) {
                    isValid = false;
                    highlightInvalidField(field);
                }
            });
            
            // If the form is not valid, prevent submission
            if (!isValid) {
                e.preventDefault();
                
                // Show error message
                showFormError(form, 'Please fill in all required fields correctly.');
            }
        });
    });
}

/**
 * Highlight Invalid Field
 * Adds styling to highlight an invalid form field
 */
function highlightInvalidField(field) {
    field.style.borderColor = 'var(--danger-color)';
    field.style.backgroundColor = 'rgba(255, 59, 48, 0.05)';
    
    // Add event listener to remove highlight when user starts typing
    field.addEventListener('input', function() {
        removeInvalidHighlight(field);
    }, { once: true });
}

/**
 * Remove Invalid Highlight
 * Removes the invalid styling from a form field
 */
function removeInvalidHighlight(field) {
    field.style.borderColor = '';
    field.style.backgroundColor = '';
}

/**
 * Show Form Error
 * Displays an error message for a form
 */
function showFormError(form, message) {
    // Check if error message already exists
    let errorElement = form.querySelector('.form-error-message');
    
    if (!errorElement) {
        // Create error message element
        errorElement = document.createElement('div');
        errorElement.className = 'form-error-message';
        errorElement.style.color = 'var(--danger-color)';
        errorElement.style.marginTop = '1rem';
        errorElement.style.fontSize = '0.9rem';
        
        // Add error message to form
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(errorElement, submitButton);
    }
    
    // Set error message
    errorElement.textContent = message;
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

/**
 * Is Valid Email
 * Checks if an email address is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * File Upload Preview
 * Handles file upload preview functionality
 * @param {string} fileUploadId - The ID of the file upload container
 * @param {string} fileInputId - The ID of the file input element
 * @param {string} previewContainerId - The ID of the preview container
 * @param {string} previewImageId - The ID of the preview image element
 */
function initFileUploadPreview(fileUploadId, fileInputId, previewContainerId, previewImageId) {
    const fileUpload = document.getElementById(fileUploadId);
    const fileInput = document.getElementById(fileInputId);
    const previewContainer = document.getElementById(previewContainerId);
    const imagePreview = document.getElementById(previewImageId);
    
    if (!fileUpload || !fileInput || !previewContainer || !imagePreview) return;
    
    fileUpload.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            
            reader.readAsDataURL(fileInput.files[0]);
        }
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUpload.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUpload.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUpload.style.borderColor = 'var(--primary-color)';
        fileUpload.style.backgroundColor = 'rgba(74, 111, 220, 0.1)';
    }
    
    function unhighlight() {
        fileUpload.style.borderColor = '#ddd';
        fileUpload.style.backgroundColor = 'white';
    }
    
    fileUpload.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files && files[0]) {
            fileInput.files = files;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            
            reader.readAsDataURL(files[0]);
        }
    }
}

/**
 * Payment Method Selection
 * Handles payment method selection on the payment page
 * @param {string} method - The payment method to select (card, mobile, bank, paypal)
 */
function selectPaymentMethod(method) {
    // Remove selected class from all payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked payment option
    let methodIndex;
    
    switch(method) {
        case 'card': methodIndex = 1; break;
        case 'mobile': methodIndex = 2; break;
        case 'bank': methodIndex = 3; break;
        case 'paypal': methodIndex = 4; break;
        default: methodIndex = 1;
    }
    
    const selectedOption = document.querySelector(`.payment-option:nth-child(${methodIndex})`);
    
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Hide all payment details
    document.querySelectorAll('.card-details').forEach(details => {
        details.classList.remove('active');
    });
    
    // Show selected payment details
    const detailsElement = document.getElementById(`${method}-details`);
    
    if (detailsElement) {
        detailsElement.classList.add('active');
    }
}

/**
 * Copy to Clipboard
 * Copies text to clipboard
 * @param {string} text - The text to copy
 * @param {function} callback - Callback function to execute after copying
 */
function copyToClipboard(text, callback) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(tempInput);
    
    // Execute callback if provided
    if (typeof callback === 'function') {
        callback();
    }
}

/**
 * Show Modal
 * Shows a modal dialog
 * @param {string} modalId - The ID of the modal to show
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Hide Modal
 * Hides a modal dialog
 * @param {string} modalId - The ID of the modal to hide
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Format Currency
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: USD)
 * @returns {string} - The formatted currency string
 */
function formatCurrency(amount, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode
    }).format(amount);
}

/**
 * Format Date
 * Formats a date string
 * @param {string|Date} date - The date to format
 * @returns {string} - The formatted date string
 */
function formatDate(date) {
    const dateObj = new Date(date);
    
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(dateObj);
}
