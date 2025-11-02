document.addEventListener('DOMContentLoaded', function() {
    
    // --- Selectors ---
    const navLinks = document.querySelectorAll('nav a, .cta-button, .tab-link a, .tab-up-arrow, .cert-category-card, .view-cert-btn, .view-description-btn, .sub-tab-link'); 
    const sectionsToHide = document.querySelectorAll('.section, .content-section, .nested-content');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const tabLinks = document.querySelectorAll('.tab-link');
    
    // Select the main sections within 'About'
    const aboutContentSections = document.querySelectorAll('#skills-section, #experience-section, #education-section');

    // Select the main containers for cards (About Tabs)
    const skillsSection = document.getElementById('skills-section');
    const experienceSection = document.getElementById('experience-section');
    const educationSection = document.getElementById('education-section');

    // Selectors for CERTIFICATIONS section (including the nested Forage container)
    const certificationsMain = document.getElementById('certifications-main');
    // Renamed '#forage-certs-list' to match your HTML's actual ID: 'forage-certs-container'
    // NEW LINE: Includes the new 'global-certs-container'
// NEW LINE: Includes the new 'infosys-certs-container'
// Update the list of all certification detail sections
const certDetailSections = document.querySelectorAll('#internship-certs, #hackathon-certs, #course-certs, #forage-certs-container, #global-certs-container, #infosys-certs-container, #ibm-certs-container,#other-certs-container'); 
//                                                                                                                                                           ^ ADD THIS
    const modal = document.getElementById('projectModal'); // Assuming this is your modal ID
    const closeBtn = document.querySelector('.close-btn');
    // Selectors for ALL buttons that open the modal
    const viewBtns = document.querySelectorAll('.view-description-btn, .view-cert-btn'); 
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    
    // --- Staggered Animation Function (Reusable) ---
    function animateSectionCards(sectionElement) {
        if (!sectionElement) return;

        const cards = sectionElement.querySelectorAll('.content-item-card, .content-grid > *'); 

        if (cards.length === 0) return;

        cards.forEach((card, index) => {
            // 1. Reset state for re-triggering animation
            card.style.opacity = '0';
            card.style.transform = 'translateX(-500px)';
            card.style.animation = 'none'; 
            
            // 2. Force reflow
            void card.offsetWidth; 

            // 3. Apply the new animation
            card.style.animation = `slideInFromLeftStaggered 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards ${index * 0.15}s`;
        });
    }
    
    // A helper function to reset a specific card section's animation state
    function resetCardAnimation(section) {
        if (!section) return;
        // Target both card and grid children
        section.querySelectorAll('.content-item-card, .content-grid > *').forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateX(-500px)';
        });
    }

    // --- Content Reveal (Show/Hide) Logic (MAIN ENGINE) ---
    function revealContent(targetId) {
        let targetElement = document.getElementById(targetId);

        // 1. Hide ALL sections and reset their animations
        sectionsToHide.forEach(section => {
            resetCardAnimation(section);

            // Hide everything EXCEPT the Home page
            if (section.id !== 'home') {
                section.classList.remove('active-section');
                section.classList.add('hidden-content');
            }
        });

        // 2. Show the target element
        if (targetElement) {
            targetElement.classList.remove('hidden-content');
            targetElement.classList.add('active-section');
        }
        
        // 3. Handle the CARD ANIMATION for all relevant sections
        if (['skills-section', 'experience-section', 'education-section'].includes(targetId)) {
             // Animate About tabs
             animateSectionCards(targetElement);
        } else if (targetId === 'certifications-main') {
            // Animate Main Certs
            animateSectionCards(certificationsMain);
        } else if (targetElement && Array.from(certDetailSections).includes(targetElement)) {
            // Animate detail cert sections (#course-certs, #forage-certs-container, etc.)
            animateSectionCards(targetElement);
        }
        
        // 4. Ensure necessary parent sections remain visible for nested content
        if (['skills-section', 'experience-section', 'education-section'].includes(targetId) && aboutSection) {
            // Keep main 'about' visible for its sub-sections
            aboutSection.classList.remove('hidden-content');
            aboutSection.classList.add('active-section');
        }
        
        // CRITICAL FOR FORAGE: When showing nested content, ensure its parent is also visible
        if (targetId === 'forage-certs-container') {
             const courseCertsParent = document.getElementById('course-certs');
             if (courseCertsParent) {
                 courseCertsParent.classList.remove('hidden-content');
                 courseCertsParent.classList.add('active-section');
             }
        }

        // 5. Scroll to the element
        if (targetElement && targetId !== 'home') {
            const headerHeight = document.querySelector('header').offsetHeight; 
            
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight + 1,
                behavior: 'smooth'
            });
        }
    }
    
    // Function to handle Home link separately
    function showHome() {
        // Hide everything except home
        sectionsToHide.forEach(section => {
            if (section.id !== 'home') {
                section.classList.add('hidden-content');
                section.classList.remove('active-section');
            } else {
                section.classList.remove('hidden-content');
                section.classList.add('active-section');
            }
            resetCardAnimation(section);
        });
    }

    // --- ABOUT SPECIFIC FUNCTIONS ---
    function showAboutTabsOnly() {
        // 1. Ensure 'about' section is visible
        aboutSection.classList.remove('hidden-content');
        aboutSection.classList.add('active-section');

        // 2. Hide all sub-sections within About (Skills/Exp/Edu) and all Cert detail sections
        aboutContentSections.forEach(section => resetCardAnimation(section));
        certDetailSections.forEach(section => resetCardAnimation(section));
        
        aboutContentSections.forEach(section => section.classList.add('hidden-content'));
        certDetailSections.forEach(section => section.classList.add('hidden-content'));

        // 3. Ensure all tabs are visually inactive
        tabLinks.forEach(tl => tl.classList.remove('active-tab'));
        
        // 4. Scroll to the top of the about section
        if (aboutSection) {
            const headerHeight = document.querySelector('header').offsetHeight; 
            window.scrollTo({
                top: aboutSection.offsetTop - headerHeight + 1,
                behavior: 'smooth'
            });
        }
    }

    // --- CERTIFICATIONS SPECIFIC FUNCTIONS ---
    
    // Function to handle the Up Arrow click in Cert detail sections (back to certifications-main)
    function showCertMainOnly() {
        revealContent('certifications-main');
    }

    // Function to handle the Up Arrow click inside #forage-certs-container (back to #course-certs)
    function showCourseCertsOnly() {
        // 1. Hide the nested section
        const forageCerts = document.getElementById('forage-certs-container');
        if (forageCerts) {
            resetCardAnimation(forageCerts);
            forageCerts.classList.add('hidden-content');
            forageCerts.classList.remove('active-section');
        }
        
        // 2. Explicitly ensure #course-certs is visible
        const courseCerts = document.getElementById('course-certs');
        if (courseCerts) {
            courseCerts.classList.remove('hidden-content');
            courseCerts.classList.add('active-section');
            animateSectionCards(courseCerts); // Animate the parent cards again
            
            // 3. Scroll to the top of the section
            const headerHeight = document.querySelector('header').offsetHeight; 
            window.scrollTo({
                top: courseCerts.offsetTop - headerHeight + 1,
                behavior: 'smooth'
            });
        }
    }

    // --- Event Listeners (MAIN NAVIGATION CONSOLIDATED) ---
    // NOTE: The separate forageCardLink listener has been REMOVED as it conflicted with this main block.

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('data-target') || this.getAttribute('href')?.substring(1);
            const href = this.getAttribute('href');
            
            // 1. Prevent default behavior for all internal navigation 
            if (targetId || (href && href.startsWith('#')) || this.classList.contains('view-description-btn') || this.classList.contains('view-cert-btn')) {
                 e.preventDefault();
            }

            // --- NAVIGATION UP ARROW LOGIC (Back buttons) ---
            
            // Back from About sub-section to About tabs (href="#about")
            if (href === '#about' && this.closest('.about-tabs')) {
                 showAboutTabsOnly();
                 return;
            }
            
            // Back from Cert detail to Main Certs (href="#certifications-main")
            if (href === '#certifications-main') {
                showCertMainOnly();
                return;
            }
            
            // Back from Forage to Course Certs (href="#course-certs")
            // This is the new nested logic handling the back button
            if (href === '#course-certs' && this.closest('#forage-certs-container')) {
                 showCourseCertsOnly();
                 return;
            }

            // --- MODAL LOGIC (Handled early to prevent general navigation) ---
            if (this.classList.contains('view-description-btn') || this.classList.contains('view-cert-btn')) {
                 // The modal logic at the bottom of the file handles the rest.
                 return;
            }

            // --- PRIMARY NAVIGATION LOGIC (Show sections) ---
            
            // Home or Projects or Contact
            if (targetId === 'home') {
                 showHome();
                 tabLinks.forEach(tl => tl.classList.remove('active-tab'));
                 return;
            }
            
            // Main 'About' navigation link (reset to tabs)
            if (targetId === 'about') {
                 showAboutTabsOnly(); 
                 return;
            }
            
            // All other valid section/tab clicks (e.g., Skills, Experience, Cert Category Cards, Forage Card)
            if (targetId) {
                 revealContent(targetId);
            }

            // Tab link highlighting logic
            if (['skills-section', 'experience-section', 'education-section'].includes(targetId)) {
                 tabLinks.forEach(tl => tl.classList.remove('active-tab'));
                 const parentElement = this.closest('.tab-link');
                 if(parentElement) {
                     parentElement.classList.add('active-tab');
                 }
            } else {
                 tabLinks.forEach(tl => tl.classList.remove('active-tab'));
            }
        });
    });

    // --- Project/Certificate Description Modal ---
    viewBtns.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); 

            const title = this.getAttribute('data-title') || this.getAttribute('data-cert-title');
            const description = this.getAttribute('data-description');
            const projectLink = this.getAttribute('data-link');
            let imageUrl = this.getAttribute('data-image-url');

            document.getElementById('modalTitle').textContent = title;
            
            const modalDescription = document.getElementById('modalDescription');
            const modalCtaButton = modal.querySelector('.modal-cta-button'); 

            // 1. Clear previous content and reset styles/buttons
            modalDescription.innerHTML = '';
            if (modalCtaButton) {
                modalCtaButton.style.display = 'none';
            }
            
            if (imageUrl) {
                const driveMatch = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                
                if (driveMatch && driveMatch[1]) {
                    const fileId = driveMatch[1];
                    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

                    // CERTIFICATE LOGIC: Show image/embed
                    modalDescription.innerHTML = `
                        <div style="width: 100%; height: 500px; overflow: hidden; margin: 10px auto;">
                            <iframe src="${embedUrl}" style="border: none; width: 100%; height: 100%;" allowfullscreen></iframe>
                        </div>
                    `;
                    modalDescription.style.textAlign = 'center';
                } else {
                    // If it's a standard image link (e.g., JPEG/PNG direct link)
                    modalDescription.innerHTML = `<img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 5px; margin: 10px auto; display: block;">`;
                    modalDescription.style.textAlign = 'center';
                }
                
            } else {
                // PROJECT LOGIC: Show description text and project link
                modalDescription.textContent = description;
                modalDescription.style.textAlign = 'left';

                if (projectLink && modalCtaButton) {
                    modalCtaButton.href = projectLink;
                    modalCtaButton.textContent = 'View Project';
                    modalCtaButton.target = '_blank';
                    modalCtaButton.style.display = 'inline-block';
                }
            }

            // Show the modal
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });

    // Modal close event listeners
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); 
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open'); 
        }
    });

    // --- Scroll-to-Top Button functionality ---
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Initial Setup ---
    // Ensure all sub-sections and secondary content start hidden
    sectionsToHide.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('hidden-content');
            section.classList.remove('active-section');
        } else {
            section.classList.add('active-section');
            section.classList.remove('hidden-content');
        }
    });
    aboutContentSections.forEach(section => section.classList.add('hidden-content'));
    certDetailSections.forEach(section => section.classList.add('hidden-content'));
    tabLinks.forEach(tl => tl.classList.remove('active-tab'));


    // --- Hero Title Animation (Initial Call) ---
    function animateHeroTitle() {
        const titleH1s = [
            document.querySelector('.hero-title:nth-of-type(1)'),
            document.querySelector('.hero-title:nth-of-type(2) .name')
        ];
        
        let totalDelay = 0;

        titleH1s.forEach(element => {
            if (!element) return;
            if (element.querySelector('.letter')) return;
            
            const text = element.textContent.trim();
            element.textContent = ''; 

            for (let i = 0; i < text.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.textContent = text[i] === ' ' ? '\u00A0' : text[i]; 
                charSpan.classList.add('letter');
                
                if (element.classList.contains('name')) {
                    charSpan.classList.add('name'); 
                }

                charSpan.style.setProperty('--delay', `${totalDelay}s`);
                element.appendChild(charSpan);
                totalDelay += 0.05;
            }
        });
    }
    
    setTimeout(animateHeroTitle, 500); 
});
