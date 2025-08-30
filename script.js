// Static form validation - no server submission
function validateContactForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    let isValid = true;
    
    hideAllErrors();
    
    if (name === '') {
        showError('name-error', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('name-error', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    if (email === '') {
        showError('email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email-error', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (subject === '') {
        showError('subject-error', 'Subject is required');
        isValid = false;
    } else if (subject.length < 5) {
        showError('subject-error', 'Subject must be at least 5 characters long');
        isValid = false;
    }
    
    if (message === '') {
        showError('message-error', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('message-error', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    if (phone === '') {
        showError('phone-error', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone-error', 'Please enter a valid phone number (10 digits)');
        isValid = false;
    }
    
    if (isValid) {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = 'background: #27ae60; color: white; padding: 1rem; border-radius: 5px; margin: 1rem 0; text-align: center; font-weight: bold;';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        
        const form = document.getElementById('contact-form');
        form.parentNode.insertBefore(successMessage, form);
        form.reset();
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
    
    return false;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideAllErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.style.display = 'none';
    });
}

// Simple cart functionality
function addToCart(productName, price) {
    const confirmationMessage = document.createElement('div');
    confirmationMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: bold;
        max-width: 300px;
    `;
    confirmationMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>✓</span>
            <div>
                <div>${productName}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">Added to cart - Rs. ${price}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationMessage);
    
    setTimeout(() => {
        confirmationMessage.remove();
    }, 4000);
}

function removeCartItem(productName) {
    const table = document.querySelector('.cart-table tbody');
    if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            // Skip total rows and empty rows
            if (row.classList.contains('total-row') || !row.cells[0]) return;
            
            if (row.cells[0].textContent.trim() === productName) {
                row.remove();
                updateCartTotal();
            }
        });
    }
    
    const confirmationMessage = document.createElement('div');
    confirmationMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: bold;
        max-width: 300px;
    `;
    confirmationMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>✗</span>
            <div>
                <div>${productName} removed</div>
                <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.25rem;">Item removed from cart</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationMessage);
    
    setTimeout(() => {
        confirmationMessage.remove();
    }, 3000);
}

function updateCartTotal() {
    const table = document.querySelector('.cart-table tbody');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    let subtotal = 0;
    let itemCount = 0;
    
    rows.forEach(row => {
        // Skip total rows and rows without proper cells
        if (row.classList.contains('total-row') || row.cells.length < 4) return;
        
        const totalCell = row.cells[3].textContent;
        const price = parseInt(totalCell.replace(/[^\d]/g, ''));
        if (!isNaN(price)) {
            subtotal += price;
            itemCount++;
        }
    });
    
    // If no items left, show empty cart message
    if (itemCount === 0) {
        const emptyRow = table.insertRow(0);
        emptyRow.innerHTML = '<td colspan="5" style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</td>';
        subtotal = 0;
    }
    
    const deliveryCharges = subtotal > 0 ? 500 : 0;
    const taxRate = 0.13;
    const tax = Math.round(subtotal * taxRate);
    const grandTotal = subtotal + deliveryCharges + tax;
    
    // Update subtotal
    const subtotalRow = table.querySelector('.total-row');
    if (subtotalRow && subtotalRow.cells[1]) {
        subtotalRow.cells[1].innerHTML = `<strong>Rs. ${subtotal.toLocaleString()}</strong>`;
    }
    
    // Update delivery charges
    const deliveryRow = subtotalRow?.nextElementSibling;
    if (deliveryRow && deliveryRow.cells[1]) {
        deliveryRow.cells[1].textContent = `Rs. ${deliveryCharges.toLocaleString()}`;
    }
    
    // Update tax
    const taxRow = deliveryRow?.nextElementSibling;
    if (taxRow && taxRow.cells[1]) {
        taxRow.cells[1].textContent = `Rs. ${tax.toLocaleString()}`;
    }
    
    // Update grand total
    const grandTotalRow = taxRow?.nextElementSibling;
    if (grandTotalRow && grandTotalRow.cells[1]) {
        grandTotalRow.cells[1].innerHTML = `<strong>Rs. ${grandTotal.toLocaleString()}</strong>`;
    }
}

function toggleDetails(detailsId) {
    const allDetails = document.querySelectorAll('.product-details, .specifications-section');
    allDetails.forEach(detail => {
        if (detail.id !== detailsId) {
            detail.style.display = 'none';
        }
    });
    
    const detailsSection = document.getElementById(detailsId);
    if (detailsSection) {
        if (detailsSection.style.display === 'none' || detailsSection.style.display === '') {
            detailsSection.style.display = 'block';
            setTimeout(() => {
                detailsSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        } else {
            detailsSection.style.display = 'none';
        }
    }
}

// Buyer contact form validation
function validateBuyerContactForm() {
    const name = document.getElementById('buyer-name');
    const email = document.getElementById('buyer-email');
    const phone = document.getElementById('buyer-phone');
    
    let isValid = true;
    
    // Clear previous errors
    clearErrors(['buyer-name-error', 'buyer-email-error', 'buyer-phone-error']);
    
    // Validate name
    if (!name.value.trim()) {
        showError('buyer-name-error', 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError('buyer-name-error', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showError('buyer-email-error', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError('buyer-email-error', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!phone.value.trim()) {
        showError('buyer-phone-error', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone.value.trim())) {
        showError('buyer-phone-error', 'Please enter a valid phone number (10 digits)');
        isValid = false;
    }
    
    if (isValid) {
        alert('Thank you for contacting us! We will respond to your inquiry soon.');
        document.getElementById('buyer-contact-form').reset();
    }
}

// Location functionality
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                alert(`Your current location: Latitude ${lat.toFixed(4)}, Longitude ${lng.toFixed(4)}`);
            },
            function(error) {
                alert('Unable to retrieve your location. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Initialize functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateContactForm();
        });
    }
    
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Update hamburger icon
            if (nav.classList.contains('active')) {
                mobileMenuToggle.innerHTML = '✕';
            } else {
                mobileMenuToggle.innerHTML = '☰';
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.innerHTML = '☰';
            }
        });
    }
});
