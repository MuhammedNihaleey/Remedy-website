// ==================== FIREBASE SETUP ====================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAu7QlhcoOk4nHbLhb1oGfTAsYXQU56QZM",
  authDomain: "remedy-dental.firebaseapp.com",
  projectId: "remedy-dental",
  storageBucket: "remedy-dental.firebasestorage.app",
  messagingSenderId: "1026621034867",
  appId: "1:1026621034867:web:6c795b3a91c24f21ea7506"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase initialized successfully!');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('onclick')) return; // Skip if has onclick handler
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards and portfolio items
    document.querySelectorAll('.service-card, .portfolio-item, .team-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Initialize tooltips for service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#e8f4ff';
        });
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f5f7fa';
        });
    });

    // Handle enquiry form submission
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('enquiryName').value;
            const phone = document.getElementById('enquiryPhone').value;
            const message = document.getElementById('enquiryMessage').value;
            
            const submitBtn = document.querySelector('#enquiryForm button[type="submit"]');
            const formMessage = document.getElementById('formMessage');
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                // Add enquiry to Firestore
                const docRef = await addDoc(collection(db, 'enquiries'), {
                    name: name,
                    phone: phone,
                    message: message,
                    timestamp: new Date().toLocaleString(),
                    createdAt: new Date()
                });
                
                // Show success message
                formMessage.textContent = 'Thank you! Your enquiry has been sent successfully. We will contact you soon.';
                formMessage.style.color = 'green';
                formMessage.style.display = 'block';
                
                // Reset form
                enquiryForm.reset();
                submitBtn.textContent = 'Send Enquiry';
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } catch (error) {
                console.error('Error sending enquiry:', error);
                formMessage.textContent = 'Error sending enquiry. Please try again.';
                formMessage.style.color = 'red';
                formMessage.style.display = 'block';
                submitBtn.textContent = 'Send Enquiry';
                submitBtn.disabled = false;
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('adminInboxModal');
        if (modal && event.target === modal) {
            closeAdminInbox();
        }
    });

    // Update navbar style on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // About Carousel Auto-slide
    let aboutCarouselIndex = 0;
    
    function showCarouselSlide() {
        const slides = document.querySelectorAll('.about-carousel .carousel-slide');
        if (slides.length === 0) return;

        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = "none";
            slide.classList.remove('active');
        });

        aboutCarouselIndex++;
        if (aboutCarouselIndex > slides.length) { aboutCarouselIndex = 1; }

        // Show the current slide
        slides[aboutCarouselIndex - 1].style.display = "block";
        slides[aboutCarouselIndex - 1].classList.add('active');

        // Repeat every 3 seconds
        setTimeout(showCarouselSlide, 3000); 
    }

    // Start the carousel
    showCarouselSlide();
});

// Open admin inbox
function openAdminInbox() {
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('adminPassword');
    
    // Show password modal
    passwordModal.style.display = 'flex';
    
    // Focus on password input
    setTimeout(() => passwordInput.focus(), 100);
    
    // Allow Enter key to submit
    passwordInput.onkeypress = function(e) {
        if (e.key === 'Enter') {
            submitPassword();
        }
    };
}

// Close admin inbox
function closeAdminInbox() {
    document.getElementById('adminInboxModal').style.display = 'none';
}

// Close password modal
function closePasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    const passwordInput = document.getElementById('adminPassword');
    passwordModal.style.display = 'none';
    passwordInput.value = '';
}

// Submit password
function submitPassword() {
    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput.value;
    
    if (password === 'admin123') {
        closePasswordModal();
        loadEnquiries();
        document.getElementById('adminInboxModal').style.display = 'flex';
    } else {
        passwordInput.style.borderColor = '#ff4444';
        passwordInput.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
        alert('Incorrect password. Try again.');
        passwordInput.value = '';
        setTimeout(() => {
            passwordInput.style.borderColor = '#ddd';
            passwordInput.style.boxShadow = 'none';
        }, 1500);
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('adminPassword');
    const toggleBtn = document.querySelector('.toggle-password-btn i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Load and display enquiries in real-time
function loadEnquiries() {
    const inboxList = document.getElementById('inboxList');
    const messageCount = document.getElementById('messageCount');
    
    if (!inboxList) return; // Safety check

    const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    
    onSnapshot(q, (snapshot) => {
        messageCount.textContent = snapshot.size;
        
        if (snapshot.empty) {
            inboxList.innerHTML = '<p>No enquiries yet</p>';
            return;
        }
        
        inboxList.innerHTML = '';
        snapshot.forEach((doc) => {
            const enquiry = doc.data();
            const enquiryElement = document.createElement('div');
            enquiryElement.className = 'enquiry-item';
            
            // Using logic to handle missing fields so the whole box doesn't disappear
            enquiryElement.innerHTML = `
                <div class="enquiry-header">
                    <strong style="color: #0066cc;">${enquiry.name || 'New Lead'}</strong>
                    <span class="enquiry-date" style="color: #888; font-size: 0.8rem;">${enquiry.timestamp || ''}</span>
                </div>
                <div style="margin-top: 10px; color: #333;">
                    <p><strong>Phone:</strong> ${enquiry.phone || 'N/A'}</p>
                    <p style="background: white; padding: 10px; border-radius: 5px; margin-top: 5px; border: 1px solid #eee;">
                        ${enquiry.message || '(No message content)'}
                    </p>
                </div>
                <div class="enquiry-actions" style="margin-top: 15px; display: flex; gap: 10px;">
                    <button class="btn-delete" onclick="deleteEnquiry('${doc.id}')" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            inboxList.appendChild(enquiryElement);
        });
    }, (error) => {
        console.error("Detailed Error:", error);
        inboxList.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    });
}

// Delete single enquiry
async function deleteEnquiry(id) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
        try {
            await deleteDoc(doc(db, 'enquiries', id));
            console.log('Enquiry deleted successfully');
        } catch (error) {
            console.error('Error deleting enquiry:', error);
            alert('Error deleting enquiry. Please try again.');
        }
    }
}

// Clear all enquiries
async function clearAllEnquiries() {
    if (confirm('Are you sure you want to clear all enquiries? This cannot be undone.')) {
        try {
            const snapshot = await getDocs(collection(db, 'enquiries'));
            const deletePromises = [];
            
            snapshot.forEach((doc) => {
                deletePromises.push(deleteDoc(doc.ref));
            });
            
            await Promise.all(deletePromises);
            console.log('All enquiries cleared successfully');
        } catch (error) {
            console.error('Error clearing enquiries:', error);
            alert('Error clearing enquiries. Please try again.');
        }
    }
}

window.openAdminInbox = openAdminInbox;
window.closeAdminInbox = closeAdminInbox;
window.closePasswordModal = closePasswordModal;
window.submitPassword = submitPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.deleteEnquiry = deleteEnquiry;
window.clearAllEnquiries = clearAllEnquiries;

// ==================== SLIDESHOW FUNCTIONS ====================
// ==================== INFINITE CAROUSEL FUNCTIONS ====================
let isTransitioning = false;

function moveSlide(direction) {
    if (isTransitioning) return; // Prevent clicking too fast
    isTransitioning = true;

    const track = document.getElementById('track');
    const slides = Array.from(track.children);
    const gap = 20; // Must match CSS gap
    const slideWidth = slides[0].getBoundingClientRect().width + gap;

    if (direction === 1) {
        // MOVING FORWARD (Right)
        // 1. Slide the track to the left
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${slideWidth}px)`;

        // 2. After animation, move the first item to the end and reset
        setTimeout(() => {
            track.style.transition = 'none'; // Disable animation for instant swap
            track.appendChild(track.firstElementChild); // Move first item to the back
            track.style.transform = 'translateX(0)'; // Reset position
            isTransitioning = false;
        }, 500); // 500ms matches the CSS transition time

    } else {
        // MOVING BACKWARD (Left)
        // 1. Move last item to front INSTANTLY (offset by negative width)
        track.style.transition = 'none';
        track.prepend(track.lastElementChild);
        track.style.transform = `translateX(-${slideWidth}px)`;

        // 2. Force a tiny delay so the browser registers the position change
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = 'translateX(0)'; // Slide into view
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }, 10);
    }
}

// Auto-slide every 3 seconds
let autoSlideInterval = setInterval(() => {
    moveSlide(1);
}, 1000);

// Pause on hover (Optional but recommended)
const container = document.querySelector('.slideshow-container');
if(container) {
    container.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    container.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => moveSlide(1), 3000);
    });
}

// Expose to window for HTML onclick
window.moveSlide = moveSlide;

// ==================== ABOUT CAROUSEL FUNCTIONS ====================
function initAboutCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    showCarouselSlide(0);
    startCarousel();
}

function showCarouselSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    if (n >= slides.length) {
        carouselIndex = 0;
    }
    if (n < 0) {
        carouselIndex = slides.length - 1;
    }
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    slides[carouselIndex].classList.add('active');
}

function startCarousel() {
    setInterval(() => {
        carouselIndex++;
        showCarouselSlide(carouselIndex);
    }, 4000); // Change image every 4 seconds
}