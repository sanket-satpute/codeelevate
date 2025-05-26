function toggleFaq(card) {
    // Close all other cards
    const allCards = document.querySelectorAll('.faq-card');
    allCards.forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('active')) {
            otherCard.classList.remove('active');
        }
    });
    
    // Toggle current card
    card.classList.toggle('active');
}

// Add stagger animation to FAQ cards
document.addEventListener('DOMContentLoaded', function() {
    const faqCards = document.querySelectorAll('.faq-card');
    faqCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.faq-card, .batch-text, .batch-cta').forEach(el => {
    observer.observe(el);
});



// GLOBAL VARIABLES
let whatsappgroupjoinlink = "https://chat.whatsapp.com/F14xeNjomO2FBOZ0tOq8zs";

// actual methods
function whatsappGroupJoin() {
    // open page for whatsapp group joining

    // Basic validation to ensure the link is not the placeholder
    if (whatsappgroupjoinlink.trim() === '') {
      alert('The WhatsApp group link is not configured. Please contact the site administrator.');
      return;
    }

    // Open the WhatsApp group invite link in a new tab
    window.open(whatsappgroupjoinlink, '_blank');
}


// model chat with mentors
let selectedMentor = null;

function openModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Clear previous selections
    selectedMentor = null;
    updateChatButton();
    hideError();
    
    // Clear mentor selections
    document.querySelectorAll('.mentor-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    setTimeout(() => {
        selectedMentor = null;
        document.getElementById('messageInput').value = '';
        document.querySelectorAll('.mentor-card').forEach(card => {
            card.classList.remove('selected');
        });
        updateChatButton();
        hideError();
    }, 300);
}

function selectMentor(mentor) {
    // Remove previous selection
    document.querySelectorAll('.mentor-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked mentor
    const mentorCard = document.querySelector(`[data-mentor="${mentor}"]`);
    mentorCard.classList.add('selected');
    
    selectedMentor = mentor;
    updateChatButton();
    hideError();
    
    // Add selection animation
    mentorCard.style.animation = 'none';
    setTimeout(() => {
        mentorCard.style.animation = 'selectPulse 0.3s ease-out';
    }, 10);
}

function updateChatButton() {
    const chatButton = document.getElementById('chatButton');
    if (selectedMentor) {
        chatButton.disabled = false;
        chatButton.innerHTML = `
            <i class="fab fa-whatsapp"></i>
            Chat with ${selectedMentor === 'sanket' ? 'Sanket' : 'Harshal'}
        `;
    } else {
        chatButton.disabled = true;
        chatButton.innerHTML = `
            <i class="fab fa-whatsapp"></i>
            Start Chat
        `;
    }
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorElement.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.classList.remove('show');
}

function startChat() {
    if (!selectedMentor) {
        showError('Please select a mentor to continue.');
        return;
    }
    
    const message = document.getElementById('messageInput').value.trim();
    
    // Add loading state
    const chatButton = document.getElementById('chatButton');
    const originalContent = chatButton.innerHTML;
    chatButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    chatButton.disabled = true;
    
    setTimeout(() => {
        try {
            chatWithMentors(selectedMentor, message);
            closeModal();
        } catch (error) {
            console.error('Error starting chat:', error);
            showError('Unable to start chat. Please try again.');
        } finally {
            // Restore button state
            chatButton.innerHTML = originalContent;
            chatButton.disabled = false;
        }
    }, 800);
}

function chatWithMentors(who, message) {
    const phoneNumberSanket = '919325571685';
    const phoneNumberHarshal = "919075909891";
    let targetPhoneNumber;
    
    if (who && typeof who === 'string') {
        const lowerCaseWho = who.toLowerCase();
        if (lowerCaseWho === "sanket") {
            targetPhoneNumber = phoneNumberSanket;
        } else if (lowerCaseWho === "harshal") {
            targetPhoneNumber = phoneNumberHarshal;
        } else {
            console.error("Invalid 'who' parameter. Expected 'sanket' or 'harshal'.");
            showError("Error: Invalid recipient specified.");
            return;
        }
    } else {
        console.error("Invalid 'who' parameter. It must be a string.");
        showError("Error: Recipient not specified correctly.");
        return;
    }
    
    if (!targetPhoneNumber || !/^\d+$/.test(targetPhoneNumber)) {
        showError('The WhatsApp phone number is not configured correctly for the selected mentor.');
        return;
    }
    
    let whatsappURL = `https://wa.me/${targetPhoneNumber}`;
    
    if (message && typeof message === 'string' && message.trim() !== "") {
        const encodedMessage = encodeURIComponent(message.trim());
        whatsappURL += `?text=${encodedMessage}`;
    }
    
    if (whatsappURL) {
        window.open(whatsappURL, '_blank');
    }
}

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Auto-resize textarea
document.getElementById('messageInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});