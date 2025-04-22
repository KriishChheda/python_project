// Wait for the DOM to be fully loaded before executing any code
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger to X
            const bars = this.querySelectorAll('.bar');
            bars.forEach(bar => bar.classList.toggle('active'));
            
            // Update aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    }
    
    // Event Category Dropdown
    const categoryDropdown = document.getElementById('categoryDropdown');
    const eventDropdown = document.getElementById('eventDropdown');
    
    if (categoryDropdown && eventDropdown) {
        categoryDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            eventDropdown.classList.toggle('show');
            
            // Update dropdown button text to show status
            this.textContent = eventDropdown.classList.contains('show') ? 
                'Browse Events ▲' : 'Browse Events ▼';
        });
        
        // Close dropdown when clicking outside
        window.addEventListener('click', function(e) {
            if (!e.target.matches('.dropbtn') && !e.target.matches('#eventDropdown a')) {
                if (eventDropdown.classList.contains('show')) {
                    eventDropdown.classList.remove('show');
                    categoryDropdown.textContent = 'Browse Events ▼';
                }
            }
        });
        
        // Handle dropdown links
        const dropdownLinks = eventDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
                
                // Close the dropdown after selection
                eventDropdown.classList.remove('show');
                categoryDropdown.textContent = 'Browse Events ▼';
            });
        });
    }
    
    // Search Functionality
    const searchInput = document.getElementById('event-search');
    const searchButton = document.getElementById('search-button');
    const committeeCards = document.querySelectorAll('.committee-card');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Reset all cards to visible if search is empty
            committeeCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }
        
        // Filter cards based on search term
        committeeCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                // Highlight the match with a subtle effect
                card.classList.add('search-matched');
                setTimeout(() => {
                    card.classList.remove('search-matched');
                }, 2000);
            } else {
                card.style.display = 'none';
            }
        });
        
        // Scroll to committees section
        const committeesSection = document.getElementById('committees');
        if (committeesSection) {
            window.scrollTo({
                top: committeesSection.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }
    
    // Committee Modal Functionality
    const committeeModal = document.getElementById('committeeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelectorAll('.close-modal');
    
    // Add click event to all committee cards
    committeeCards.forEach(card => {
        card.addEventListener('click', function() {
            const committeeId = this.getAttribute('data-committee');
            const committeeName = this.querySelector('h3').textContent;
            const committeeDesc = this.querySelector('p').textContent;
            
            // Set modal content
            modalTitle.textContent = committeeName;
            
            // Create content for modal
            modalContent.innerHTML = `
                <div class="committee-detail">
                    <div class="committee-desc">
                        <p>${committeeDesc}</p>
                    </div>
                    <div class="committee-events">
                        <h3>Upcoming Events</h3>
                        <div class="event-list">
                            <div class="event-item">
                                <h4>Annual Meet</h4>
                                <p>Join us for our annual gathering where we discuss our achievements and future plans.</p>
                                <p class="event-date">May 15, 2025</p>
                            </div>
                            <div class="event-item">
                                <h4>Workshop Series</h4>
                                <p>A series of workshops to enhance your skills in related fields.</p>
                                <p class="event-date">June 2-10, 2025</p>
                            </div>
                        </div>
                    </div>
                    <div class="committee-contact">
                        <h3>Contact ${committeeName}</h3>
                        <p>Email: ${committeeId}@college.edu</p>
                        <p>Instagram: @${committeeId}</p>
                    </div>
                </div>
            `;
            
            // Display modal
            committeeModal.style.display = 'block';
            
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal functionality
    closeModal.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close modal if clicked outside content
    window.addEventListener('click', function(e) {
        if (e.target === committeeModal) {
            committeeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            // Here you would typically send the data to a server
            
            // Show success modal
            if (successModal) {
                successModal.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Hide success modal after 3 seconds
                setTimeout(() => {
                    successModal.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = this.querySelector('input[type="email"]').value;
            // Here you would typically send the email to a server
            
            // Show confirmation
            const button = this.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'Subscribed!';
            button.disabled = true;
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
            
            // Reset form
            this.reset();
        });
    }
    
    // Add CSS for mobile menu toggle animation
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-toggle .bar.active:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-toggle .bar.active:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-toggle .bar.active:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
        .search-matched {
            animation: highlight 2s ease;
        }
        @keyframes highlight {
            0% { box-shadow: 0 0 0 rgba(74, 109, 229, 0); }
            50% { box-shadow: 0 0 15px rgba(74, 109, 229, 0.8); }
            100% { box-shadow: 0 0 0 rgba(74, 109, 229, 0); }
        }
        .committee-detail {
            display: grid;
            gap: 20px;
        }
        .event-item {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .event-date {
            color: var(--secondary-color);
            font-weight: bold;
            margin-top: 8px;
        }
    `;
    document.head.appendChild(style);
});