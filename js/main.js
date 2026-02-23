/**
 * Resume Website - Main JavaScript
 * Vanilla JS implementation (no jQuery)
 */

(function() {
    'use strict';

    // ============================================
    // State
    // ============================================
    
    let currentLang = 'ru';
    let langData = null;

    // ============================================
    // DOM Elements
    // ============================================
    
    const elements = {
        container: document.querySelector('.container'),
        langButtons: document.querySelectorAll('.lang-btn'),
        experienceList: document.getElementById('experience-list'),
        skillsGrid: document.getElementById('skills-grid'),
        languagesList: document.getElementById('languages-list'),
        currentYear: document.getElementById('current-year')
    };

    // ============================================
    // Initialization
    // ============================================

    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        // Set current year
        if (elements.currentYear) {
            elements.currentYear.textContent = new Date().getFullYear();
        }

        // Load language data
        try {
            const response = await fetch('lang.json');
            if (!response.ok) throw new Error('Failed to load language data');
            langData = await response.json();
            
            // Get saved language or default
            const savedLang = localStorage.getItem('preferred-lang');
            currentLang = savedLang && langData[savedLang] ? savedLang : 'ru';
            
            // Initial render
            renderPage();
            
            // Setup language switcher
            setupLanguageSwitcher();
            
            // Show container with animation
            if (elements.container) {
                elements.container.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error initializing page:', error);
        }
    }

    // ============================================
    // Language Switcher
    // ============================================

    function setupLanguageSwitcher() {
        elements.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang !== currentLang && langData[lang]) {
                    currentLang = lang;
                    localStorage.setItem('preferred-lang', lang);
                    updateLangButtons();
                    renderPage();
                }
            });
        });
        updateLangButtons();
    }

    function updateLangButtons() {
        elements.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
    }

    // ============================================
    // Rendering
    // ============================================

    function renderPage() {
        const data = langData[currentLang];
        if (!data) return;

        // Update title
        document.title = data.title;

        // Update simple text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const value = getNestedValue(data, key);
            if (value !== undefined) {
                el.textContent = value;
            }
        });

        // Update HTML content elements
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            const value = getNestedValue(data, key);
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    el.innerHTML = value.map(p => `<p>${p}</p>`).join('');
                } else {
                    el.innerHTML = value;
                }
            }
        });

        // Update list elements
        document.querySelectorAll('[data-i18n-list]').forEach(el => {
            const key = el.dataset.i18nList;
            const value = getNestedValue(data, key);
            if (Array.isArray(value)) {
                el.innerHTML = value.map(item => `<li>${item}</li>`).join('');
            }
        });

        // Render complex sections
        renderExperience(data.experience);
        renderSkills(data.skills);
        renderLanguages(data.languages);
    }

    function renderExperience(experience) {
        if (!elements.experienceList || !experience?.items) return;

        elements.experienceList.innerHTML = experience.items.map(item => `
            <article class="experience-card">
                <header class="experience-card__header">
                    <h3 class="experience-card__company">
                        ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">${item.company}</a>` : item.company}
                    </h3>
                    <span class="experience-card__period">${item.period}</span>
                </header>
                <p class="experience-card__position">${item.position}</p>
                <ul class="experience-card__description">
                    ${item.description.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </article>
        `).join('');
    }

    function renderSkills(skills) {
        if (!elements.skillsGrid || !skills) return;

        const skillGroups = [
            { key: 'technical', icon: getTechIcon() },
            { key: 'architecture', icon: getArchIcon() },
            { key: 'soft', icon: getSoftIcon() }
        ];

        elements.skillsGrid.innerHTML = skillGroups
            .filter(group => skills[group.key])
            .map(group => `
                <div class="skill-group">
                    <h3 class="skill-group__title">${skills[group.key].header}</h3>
                    <div class="skill-tags">
                        ${skills[group.key].items.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
    }

    function renderLanguages(languages) {
        if (!elements.languagesList || !languages?.items) return;

        elements.languagesList.innerHTML = languages.items.map(item => `
            <div class="language-item">
                <span class="language-item__name">${item.name}</span>
                <span class="language-item__level">${item.level}</span>
            </div>
        `).join('');
    }

    // ============================================
    // Helpers
    // ============================================

    function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    function getTechIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
        </svg>`;
    }

    function getArchIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>`;
    }

    function getSoftIcon() {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>`;
    }

    // ============================================
    // Scroll Animations
    // ============================================

    function initScrollAnimations() {
        // Define animation types for different elements
        const animationConfig = [
            { selector: '.header', animation: 'scroll-animate--fade-up' },
            { selector: '.contacts', animation: 'scroll-animate--fade-left' },
            { selector: '.section:nth-child(odd)', animation: 'scroll-animate--fade-left' },
            { selector: '.section:nth-child(even)', animation: 'scroll-animate--fade-right' },
            { selector: '.experience-card', animation: 'scroll-animate--fade-up' },
            { selector: '.skill-group', animation: 'scroll-animate--scale' },
            { selector: '.skill-tag', animation: 'scroll-animate--bounce' },
            { selector: '.education-card', animation: 'scroll-animate--blur' },
            { selector: '.language-item', animation: 'scroll-animate--fade-right' },
            { selector: '.footer', animation: 'scroll-animate--fade-up' }
        ];

        // Apply animation classes to elements
        animationConfig.forEach(config => {
            document.querySelectorAll(config.selector).forEach((el, index) => {
                el.classList.add(config.animation);
                el.style.transitionDelay = `${index * 0.1}s`;
            });
        });

        // Create Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.scroll-animate--fade-up, .scroll-animate--fade-left, .scroll-animate--fade-right, .scroll-animate--scale, .scroll-animate--blur, .scroll-animate--bounce, .scroll-animate--flip').forEach(el => {
            observer.observe(el);
        });

        // Staggered animation for skill tags
        document.querySelectorAll('.skill-tags').forEach(container => {
            const tags = container.querySelectorAll('.skill-tag');
            tags.forEach((tag, index) => {
                tag.style.transitionDelay = `${index * 0.05}s`;
            });
        });

    }

    // Initialize scroll animations after render
    const originalRenderPage = renderPage;
    renderPage = function() {
        originalRenderPage();
        // Small delay to ensure DOM is ready
        setTimeout(initScrollAnimations, 100);
    };

    // ============================================
    // Avatar Lightbox
    // ============================================

    function initAvatarLightbox() {
        const avatarImg = document.querySelector('.header__avatar-img');
        if (!avatarImg) return;

        let isOpen = false;

        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'avatar-lightbox';
        lightbox.innerHTML = `<img src="${avatarImg.src}" alt="${avatarImg.alt}" class="avatar-lightbox__image">`;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.avatar-lightbox__image');

        // Toggle lightbox on avatar click
        function toggleLightbox() {
            const rect = avatarImg.getBoundingClientRect();
            const scale = 3;
            
            // Calculate absolute position relative to document
            const absoluteLeft = rect.left + window.scrollX;
            const absoluteTop = rect.top + window.scrollY;
            
            if (!isOpen) {
                // Hide original avatar
                avatarImg.style.opacity = '0';
                
                // Set initial position and size (same as avatar)
                lightboxImg.style.width = `${rect.width}px`;
                lightboxImg.style.height = `${rect.height}px`;
                lightboxImg.style.left = `${absoluteLeft}px`;
                lightboxImg.style.top = `${absoluteTop}px`;
                lightboxImg.style.transition = 'none';
                lightboxImg.style.transform = 'scale(1)';
                
                // Force reflow
                lightboxImg.offsetHeight;
                
                // Show lightbox
                lightbox.classList.add('active');
                
                // Animate scale up
                requestAnimationFrame(() => {
                    lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    lightboxImg.style.transform = `scale(${scale})`;
                });
                
                isOpen = true;
            } else {
                // Animate scale down
                lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                lightboxImg.style.transform = 'scale(1)';
                
                // Hide after animation and show original avatar
                setTimeout(() => {
                    lightbox.classList.remove('active');
                    avatarImg.style.opacity = '';
                }, 300);
                
                isOpen = false;
            }
        }

        // Toggle on avatar click
        avatarImg.addEventListener('click', toggleLightbox);

        // Close on click anywhere when open
        document.addEventListener('click', (e) => {
            if (isOpen && !avatarImg.contains(e.target)) {
                toggleLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleLightbox();
            }
        });

        // Close on scroll
        window.addEventListener('scroll', () => {
            if (isOpen) {
                toggleLightbox();
            }
        }, { passive: true });

        // Update position on window resize
        window.addEventListener('resize', () => {
            if (isOpen) {
                const rect = avatarImg.getBoundingClientRect();
                lightboxImg.style.transition = 'none';
                lightboxImg.style.width = `${rect.width}px`;
                lightboxImg.style.height = `${rect.height}px`;
                lightboxImg.style.left = `${rect.left}px`;
                lightboxImg.style.top = `${rect.top}px`;
                // Re-apply transform after position update
                requestAnimationFrame(() => {
                    lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    lightboxImg.style.transform = 'scale(2)';
                });
            }
        });
    }

    // Initialize avatar lightbox on DOM ready
    document.addEventListener('DOMContentLoaded', initAvatarLightbox);

})();
