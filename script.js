/**
 * EdSmart - Main JavaScript
 * Handles all interactive functionality for the EdSmart learning platform
 */


/**
 * Initialize mobile menu functionality
 * @param {Router} router - The router instance
 */
function initMobileMenu(router) {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (!mobileMenuBtn || !navUl || !authButtons) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    const toggleMenu = (event) => {
        event.preventDefault();
        navUl.classList.toggle('show');
        authButtons.classList.toggle('show');
        
        const isExpanded = navUl.classList.contains('show');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
        
        // Toggle body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    };
    
    const closeMenu = () => {
        navUl.classList.remove('show');
        authButtons.classList.remove('show');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    };
    
    const closeMenuOnClickOutside = (event) => {
        if (!navUl.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            closeMenu();
        }
    };
    
    const closeMenuOnNavClick = (event) => {
        if (event.target.tagName === 'A') {
            closeMenu();
            
            // If it's a navigation link, navigate to the target
            const link = event.target.closest('a');
            if (link && link.getAttribute('href').startsWith('#')) {
                const path = link.getAttribute('href').substring(1);
                if (path) {
                    router.navigate(path);
                }
            }
        }
    };
    
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
    mobileMenuBtn.setAttribute('aria-controls', 'main-navigation');
    navUl.setAttribute('id', 'main-navigation');
    
    mobileMenuBtn.addEventListener('click', toggleMenu);
    document.addEventListener('click', closeMenuOnClickOutside);
    navUl.addEventListener('click', closeMenuOnNavClick);
    
    // Close menu when window is resized to desktop
    const handleResize = () => {
        if (window.innerWidth >= 992) { // Adjust breakpoint as needed
            closeMenu();
        }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
        mobileMenuBtn.removeEventListener('click', toggleMenu);
        document.removeEventListener('click', closeMenuOnClickOutside);
        navUl.removeEventListener('click', closeMenuOnNavClick);
        window.removeEventListener('resize', handleResize);
    };
}

/**
 * Animation on Scroll
 * Handles animations when elements come into view
 */
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate-fade-in');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Initialize elements with transition and add to observer
    animateElements.forEach(el => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

/**
 * Search Functionality
 * Handles the search form submission and input events
 */
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-form input[type="search"]');
    const searchButton = document.querySelector('.search-form button[type="submit"]');
    const searchLoading = document.querySelector('.search-loading');
    
    if (!searchForm || !searchInput || !searchButton) {
        console.warn('Search elements not found');
        return;
    }
    
    // Debounce function to limit how often the search function is called
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };
    
    // Handle search submission
    const handleSearch = async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Please enter a search term');
            searchInput.focus();
            return;
        }
        
        try {
            // Show loading state
            searchButton.disabled = true;
            searchButton.classList.add('loading');
            searchLoading.hidden = false;
            
            // In a real app, this would be an API call
            console.log('Searching for:', query);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show search results or redirect
            showSearchResults(query);
            
        } catch (error) {
            console.error('Search error:', error);
            showError('An error occurred while searching. Please try again.');
        } finally {
            // Reset loading state
            searchButton.disabled = false;
            searchButton.classList.remove('loading');
            searchLoading.hidden = true;
        }
    };
    
    // Handle real-time search suggestions (debounced)
    const handleSearchInput = debounce((event) => {
        const query = event.target.value.trim();
        if (query.length > 2) {
            // In a real app, fetch search suggestions here
            console.log('Fetching suggestions for:', query);
            showSearchSuggestions(query);
        } else {
            hideSearchSuggestions();
        }
    }, 300);
    
    // Add event listeners
    searchForm.addEventListener('submit', handleSearch);
    searchInput.addEventListener('input', handleSearchInput);
    
    // Add keyboard navigation for search
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            searchInput.blur();
            hideSearchSuggestions();
        }
    });
    
    // Focus management
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 2) {
            showSearchSuggestions(searchInput.value.trim());
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (event) => {
        if (!searchForm.contains(event.target)) {
            hideSearchSuggestions();
        }
    });
}

/**
 * Show search suggestions
 * @param {string} query - The search query
 */
function showSearchSuggestions(query) {
    // Remove existing suggestions
    hideSearchSuggestions();
    
    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.setAttribute('role', 'listbox');
    
    // Mock suggestions - in a real app, these would come from an API
    const suggestions = [
        'Web Development',
        'Python Programming',
        'Data Science',
        'UI/UX Design',
        'Machine Learning',
        'Mobile Development'
    ].filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase())
    );
    
    if (suggestions.length > 0) {
        suggestions.forEach((suggestion, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.setAttribute('role', 'option');
            suggestionItem.setAttribute('tabindex', '0');
            suggestionItem.textContent = suggestion;
            
            suggestionItem.addEventListener('click', () => {
                document.querySelector('#search-input').value = suggestion;
                hideSearchSuggestions();
                document.querySelector('.search-form').dispatchEvent(new Event('submit'));
            });
            
            suggestionItem.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    suggestionItem.click();
                }
            });
            
            suggestionsContainer.appendChild(suggestionItem);
        });
        
        const searchBar = document.querySelector('.search-bar');
        searchBar.appendChild(suggestionsContainer);
    }
}

/**
 * Hide search suggestions
 */
function hideSearchSuggestions() {
    const existingSuggestions = document.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
}

/**
 * Show search results
 * @param {string} query - The search query
 */
function showSearchResults(query) {
    // In a real app, this would navigate to a search results page
    // For demo purposes, show a success message and navigate to courses
    showSuccess(`Found courses for: "${query}"`);
    
    // Navigate to courses section after a short delay
    setTimeout(() => {
        const coursesLink = document.querySelector('a[href="#courses"]');
        if (coursesLink) {
            coursesLink.click();
        }
    }, 1000);
}

/**
 * Progress Bars
 * Animates progress bars when they come into view
 */
function initProgressBars() {
    const progressBars = document.querySelectorAll('.course-progress .progress-bar');
    
    if (!progressBars.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width') || '0%';
                entry.target.style.width = width;
                
                // Add completion animation
                if (width !== '0%') {
                    entry.target.classList.add('completed');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Initialize progress bars
    progressBars.forEach(bar => {
        const width = bar.style.width;
        if (width) {
            bar.setAttribute('data-width', width);
            bar.style.width = '0';
            observer.observe(bar);
        }
    });
    
    // Add progress tracking functionality
    initProgressTracking();
}

/**
 * Initialize progress tracking for courses
 */
function initProgressTracking() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const progressBar = card.querySelector('.progress-bar');
        const enrollBtn = card.querySelector('.course-enroll-btn');
        
        if (progressBar && enrollBtn) {
            const progress = parseInt(progressBar.getAttribute('data-width')) || 0;
            
            if (progress > 0) {
                // Course is in progress
                enrollBtn.textContent = 'Continue Learning';
                enrollBtn.classList.add('btn-primary');
                enrollBtn.classList.remove('btn-outline');
                
                // Add progress percentage
                const progressText = document.createElement('div');
                progressText.className = 'progress-text';
                progressText.textContent = `${progress}% Complete`;
                progressText.style.cssText = 'font-size: 0.8rem; color: var(--color-primary); margin-top: 5px; text-align: center;';
                
                const progressContainer = card.querySelector('.course-progress');
                if (progressContainer) {
                    progressContainer.appendChild(progressText);
                }
            }
        }
    });
}

/**
 * Show Error Message
 * @param {string} message - The error message to display
 */
function showError(message) {
    // In a real app, you'd want to show this in the UI
    console.error('Error:', message);
    // Example: show a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }, 100);
}

/**
 * Show Success Message
 * @param {string} message - The success message to display
 */
function showSuccess(message) {
    // In a real app, you'd want to show this in the UI
    console.log('Success:', message);
    // Example: show a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }, 100);
}

/**
 * Router
 * Handles client-side routing for the single-page application
 */
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = window.location.hash.replace('#', '') || 'home';
        this.init();
    }

    /**
     * Add a new route
     * @param {string} path - The route path
     * @param {Function} callback - Function to call when route is matched
     */
    addRoute(path, callback) {
        this.routes[path] = callback || function() {};
    }

    /**
     * Navigate to a specific path
     * @param {string} path - The path to navigate to
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Handle hash change events
     */
    handleHashChange() {
        const newPath = window.location.hash.replace('#', '') || 'home';
        if (newPath !== this.currentPath) {
            this.currentPath = newPath;
            this.executeRoute();
        }
    }

    /**
     * Execute the callback for the current route
     */
    executeRoute() {
        const route = this.routes[this.currentPath];
        if (route) {
            route();
        } else {
            // Default to home if route not found
            this.navigate('home');
        }
        this.scrollToSection();
    }

    /**
     * Scroll to the section with smooth behavior
     */
    scrollToSection() {
        const section = document.getElementById(this.currentPath);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80, // Adjust for header
                behavior: 'smooth'
            });
        }
    }

    /**
     * Initialize the router
     */
    init() {
        // Add event listener for hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Initial route execution
        this.executeRoute();
    }
}

// Initialize the application
function initApp() {
    // Initialize router
    const router = new Router();

    // Add routes
    router.addRoute('home', () => showPage('home'));
    router.addRoute('courses', () => showPage('courses'));
    router.addRoute('categories', () => showPage('categories'));
    router.addRoute('about', () => showPage('about'));
    router.addRoute('testimonials', () => showPage('testimonials'));
    router.addRoute('contact', () => showPage('contact'));

    // Execute route now that routes are registered
    router.executeRoute();

    // Initialize components
    initMobileMenu(router);
    initAnimations();
    initSearch();
    initProgressBars();
    initCourseCards(router);
    initCoursesCarousel();
    
    // Set up navigation links
    setupNavigation(router);
    
    console.log('EdSmart initialized successfully');
}

/**
 * Show a specific page/section
 * @param {string} pageId - The ID of the page/section to show
 */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested page
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
    }
    
    // Update active link
    updateActiveLink(pageId);
}

/**
 * Update the active navigation link
 * @param {string} activePage - The ID of the active page
 */
function updateActiveLink(activePage) {
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === `#${activePage}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Set up navigation links
 * @param {Router} router - The router instance
 */
function setupNavigation(router) {
    // Handle navigation links
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const path = href.substring(1);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate(path);
            });
        }
    });
}

/**
 * Initialize course cards with click handlers
 * @param {Router} router - The router instance
 */
function initCourseCards(router) {
    // Add click handlers to course cards
    document.querySelectorAll('.course-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking on a button or link inside the card
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                return;
            }
            
            const courseId = card.getAttribute('data-course-id');
            if (courseId) {
                // In a real app, you would navigate to the course detail page
                router.navigate(`course/${courseId}`);
            }
        });
    });
}

/**
 * Initialize the courses carousel
 */
function initCoursesCarousel() {
    const carousel = document.querySelector('.courses-carousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!carousel || !prevBtn || !nextBtn) {
        console.warn('Carousel elements not found');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.course-card').length;
    const slidesPerView = getSlidesPerView();
    const maxSlides = Math.max(0, totalSlides - slidesPerView);
    
    // Update carousel position
    function updateCarousel() {
        const translateX = -currentSlide * (320 + 30); // card width + gap
        carousel.style.transform = `translateX(${translateX}px)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(currentSlide / slidesPerView));
        });
        
        // Update navigation button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= maxSlides;
        
        // Update button styles
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide >= maxSlides ? '0.5' : '1';
    }
    
    // Get number of slides per view based on screen size
    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlides));
        updateCarousel();
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < maxSlides) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index * slidesPerView);
        });
    });
    
    // Keyboard navigation (prevent page scroll when using arrows)
    document.addEventListener('keydown', (e) => {
        const isTypingTarget = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;
        if (isTypingTarget) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
    
    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide >= maxSlides) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Pause auto-play on touch
    carousel.addEventListener('touchstart', stopAutoPlay);
    carousel.addEventListener('touchend', startAutoPlay);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            currentSlide = 0;
            updateCarousel();
        }
    });
    
    // Initialize carousel
    updateCarousel();
    startAutoPlay();
    
    // Return cleanup function
    return () => {
        stopAutoPlay();
    };
}

// Start the application when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export functions for testing or other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initAnimations,
        initSearch,
        initProgressBars,
        showError,
        showSuccess,
        Router
    };
}