
const CONFIG = {
    // Get these from your EmailJS dashboard
    EMAILJS_SERVICE_ID: 'service_3sl9594',
    EMAILJS_TEMPLATE_ID: 'template_62qbjak',
    EMAILJS_PUBLIC_KEY: 'YtUu999CQjILjRS1A',
    YOUR_EMAIL: 'christianpaul27@gmail.com',
    MIN_MESSAGE_LENGTH: 10
};

// DOM Elements
const nameInput = document.getElementById('contactName');
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');
const sendBtn = document.getElementById('sendMessageBtn');
const feedbackDiv = document.getElementById('formFeedback');

// Initialize EmailJS
try {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
    } else {
        console.warn('EmailJS library not loaded');
        showFeedback('EmailJS library not loaded. Please check your connection.', 'error');
    }
} catch (error) {
    console.error('EmailJS initialization failed:', error);
    showFeedback('Failed to initialize email service. Please try again.', 'error');
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show feedback in form (only for loading/success/error states)
function showFeedback(message, type) {
    if (!feedbackDiv) return;
    feedbackDiv.style.display = 'block';
    feedbackDiv.className = type;
    feedbackDiv.textContent = message;

    // Auto hide after 5 seconds for non-loading states
    if (type !== 'loading') {
        if (window.feedbackTimeout) {
            clearTimeout(window.feedbackTimeout);
        }
        window.feedbackTimeout = setTimeout(() => {
            clearFeedback();
        }, 5000);
    }
}

// Clear feedback
function clearFeedback() {
    if (!feedbackDiv) return;
    feedbackDiv.style.display = 'none';
    feedbackDiv.className = '';
    feedbackDiv.textContent = '';
}

// Set loading state
function setLoadingState() {
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
}

// Reset button
function resetButton() {
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:8px;"></i> Send Message';
    }
}

// Clear form
function clearForm() {
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (messageInput) messageInput.value = '';
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) input.style.borderColor = '';
    });
}

// Save to localStorage (backup)
function saveToLocalStorage(name, email, message) {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push({
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        console.log('Message saved to localStorage backup');
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

// ===== SEND VIA EMAILJS =====
async function sendViaEmailJS(name, email, message) {
    const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: CONFIG.YOUR_EMAIL
    };

    console.log('Sending via EmailJS with params:', templateParams);

    const response = await emailjs.send(
        CONFIG.EMAILJS_SERVICE_ID,
        CONFIG.EMAILJS_TEMPLATE_ID,
        templateParams
    );

    console.log('EmailJS response:', response);

    if (response.status !== 200) {
        throw new Error(`EmailJS error: ${response.text || 'Unknown error'}`);
    }

    return response;
}

// ===== SEND VIA MAILTO (FALLBACK) =====
function sendViaMailto(name, email, message) {
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    const mailtoLink = document.createElement('a');
    mailtoLink.href = `mailto:${CONFIG.YOUR_EMAIL}?subject=${subject}&body=${body}`;
    mailtoLink.target = '_blank';
    mailtoLink.rel = 'noopener noreferrer';
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink);

    console.log('Mailto fallback triggered');
    return true;
}

// ===== MAIN HANDLER =====
async function handleSendMessage(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    clearFeedback();

    // Get values and trim
    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Store original values for fallback
    const originalName = name;
    const originalEmail = email;
    const originalMessage = message;

    // ===== VALIDATION =====
    if (!name) {
        showFeedback('Please enter your name.', 'error');
        if (nameInput) {
            nameInput.focus();
            nameInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    if (name.length < 2) {
        showFeedback('Name must be at least 2 characters.', 'error');
        if (nameInput) {
            nameInput.focus();
            nameInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    if (!email) {
        showFeedback('Please enter your email address.', 'error');
        if (emailInput) {
            emailInput.focus();
            emailInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    if (!isValidEmail(email)) {
        showFeedback('Please enter a valid email address (e.g., name@domain.com).', 'error');
        if (emailInput) {
            emailInput.focus();
            emailInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    if (!message) {
        showFeedback('Please enter your message.', 'error');
        if (messageInput) {
            messageInput.focus();
            messageInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    if (message.length < CONFIG.MIN_MESSAGE_LENGTH) {
        showFeedback(`Message must be at least ${CONFIG.MIN_MESSAGE_LENGTH} characters (${message.length}/${CONFIG.MIN_MESSAGE_LENGTH}).`, 'error');
        if (messageInput) {
            messageInput.focus();
            messageInput.style.borderColor = '#e74c3c';
        }
        return;
    }

    // Clear error styles
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) input.style.borderColor = '';
    });

    // ===== SEND =====
    showFeedback('Sending your message...', 'loading');
    setLoadingState();

    try {
        let sent = false;
        let sentVia = '';

        // Try EmailJS first
        try {
            const result = await sendViaEmailJS(originalName, originalEmail, originalMessage);
            sent = true;
            sentVia = 'EmailJS';
            console.log('Message sent via EmailJS!');
        } catch (emailJSError) {
            console.warn('EmailJS failed:', emailJSError.message);

            // Try mailto as fallback
            try {
                sendViaMailto(originalName, originalEmail, originalMessage);
                sent = true;
                sentVia = 'Mailto (fallback)';
                console.log('Mailto fallback triggered successfully!');
            } catch (mailtoError) {
                console.error('Mailto fallback failed:', mailtoError);
                throw new Error(`EmailJS: ${emailJSError.message}. Mailto: ${mailtoError.message}`);
            }
        }

        // Save backup to localStorage
        if (sent) {
            saveToLocalStorage(originalName, originalEmail, originalMessage);
        }

        // ===== SHOW SUCCESS =====
        if (sentVia === 'EmailJS') {
            showFeedback(`Message sent successfully! I'll get back to you soon, ${originalName}.`, 'success');
            clearForm();

            // Achievement unlock for sending message
            if (window.AchievementSystem) {
                window.AchievementSystem.unlock('FIRST MESSAGE', 'Sent your first contact message!');
            }
        } else {
            // For mailto fallback, just show feedback and clear form
            showFeedback(`Email client opened! Please send the email to complete, ${originalName}.`, 'success');
            clearForm();
        }

    } catch (error) {
        console.error('Error sending message:', error);
        showFeedback(`Could not send message: ${error.message}. Please email me directly at ${CONFIG.YOUR_EMAIL}`, 'error');
    } finally {
        resetButton();
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Send button - prevent default form submission
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
        sendBtn.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    // Also handle if the form exists and has submit event
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleSendMessage(e);
        });
    }

    // Clear border color on focus and input
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', function() {
                this.style.borderColor = '';
            });
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(231, 76, 60)') {
                    this.style.borderColor = '';
                }
            });
        }
    });
});