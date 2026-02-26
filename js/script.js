document.addEventListener('DOMContentLoaded', function() {

    const navLinks = document.querySelectorAll('nav a, .cta-button, .tab-link a, .tab-up-arrow, .cert-category-card, .view-cert-btn, .view-description-btn, .sub-tab-link');
    const sectionsToHide = document.querySelectorAll('.section, .content-section, .nested-content');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const tabLinks = document.querySelectorAll('.tab-link');
    const aboutContentSections = document.querySelectorAll('#skills-section, #experience-section, #education-section');
    const certificationsMain = document.getElementById('certifications-main');
    const certDetailSections = document.querySelectorAll('#internship-certs, #hackathon-certs, #course-certs, #forage-certs-container, #global-certs-container, #infosys-certs-container, #ibm-certs-container,#other-certs-container');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-btn');
    const viewBtns = document.querySelectorAll('.view-description-btn, .view-cert-btn');
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    function animateSectionCards(sectionElement) {
        if (!sectionElement) return;
        const cards = sectionElement.querySelectorAll('.content-item-card, .content-grid > *');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-500px)';
            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = `slideInFromLeftStaggered 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards ${index * 0.15}s`;
        });
    }

    function resetCardAnimation(section) {
        if (!section) return;
        section.querySelectorAll('.content-item-card, .content-grid > *').forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateX(-500px)';
        });
    }

    function revealContent(targetId, addToHistory = true) {
        const targetElement = document.getElementById(targetId);

        sectionsToHide.forEach(section => {
            resetCardAnimation(section);
            if (section.id !== 'home') {
                section.classList.remove('active-section');
                section.classList.add('hidden-content');
            }
        });

        if (targetElement) {
            targetElement.classList.remove('hidden-content');
            targetElement.classList.add('active-section');
            if (addToHistory) {
                history.pushState({ section: targetId }, "", `#${targetId}`);
            }
        }

        if (['skills-section','experience-section','education-section'].includes(targetId)) {
            animateSectionCards(targetElement);
            aboutSection.classList.remove('hidden-content');
            aboutSection.classList.add('active-section');
        }

        if (targetId === 'certifications-main') {
            animateSectionCards(certificationsMain);
        }

        if (targetElement && Array.from(certDetailSections).includes(targetElement)) {
            animateSectionCards(targetElement);
        }

        if (targetId !== 'home' && targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight + 1,
                behavior: 'smooth'
            });
        }
    }

    function showHome(addToHistory = true) {
        sectionsToHide.forEach(section => {
            resetCardAnimation(section);
            if (section.id !== 'home') {
                section.classList.add('hidden-content');
                section.classList.remove('active-section');
            } else {
                section.classList.remove('hidden-content');
                section.classList.add('active-section');
            }
        });
        if (addToHistory) {
            history.pushState({ section: 'home' }, "", "#home");
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('data-target') || this.getAttribute('href')?.substring(1);
            const href = this.getAttribute('href');

            if (targetId || (href && href.startsWith('#'))) {
                e.preventDefault();
            }

            if (this.classList.contains('view-description-btn') || this.classList.contains('view-cert-btn')) {
                return;
            }

            if (targetId === 'home') {
                showHome();
                tabLinks.forEach(tl => tl.classList.remove('active-tab'));
                return;
            }

            if (targetId === 'about') {
                revealContent('about');
                return;
            }

            if (targetId) {
                revealContent(targetId);
            }

            if (['skills-section','experience-section','education-section'].includes(targetId)) {
                tabLinks.forEach(tl => tl.classList.remove('active-tab'));
                const parent = this.closest('.tab-link');
                if (parent) parent.classList.add('active-tab');
            } else {
                tabLinks.forEach(tl => tl.classList.remove('active-tab'));
            }
        });
    });

    viewBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const title = this.getAttribute('data-title') || this.getAttribute('data-cert-title');
            const description = this.getAttribute('data-description');
            const projectLink = this.getAttribute('data-link');
            let imageUrl = this.getAttribute('data-image-url');

            document.getElementById('modalTitle').textContent = title;
            const modalDescription = document.getElementById('modalDescription');
            const modalCtaButton = modal.querySelector('.modal-cta-button');

            modalDescription.innerHTML = '';
            if (modalCtaButton) modalCtaButton.style.display = 'none';

            if (imageUrl) {
                const driveMatch = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (driveMatch && driveMatch[1]) {
                    const fileId = driveMatch[1];
                    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                    modalDescription.innerHTML = `
                        <div style="width:100%;height:500px;overflow:hidden;margin:10px auto;">
                            <iframe src="${embedUrl}" style="border:none;width:100%;height:100%;" allowfullscreen></iframe>
                        </div>`;
                } else {
                    modalDescription.innerHTML = `<img src="${imageUrl}" style="max-width:100%;height:auto;border-radius:5px;margin:10px auto;display:block;">`;
                }
                modalDescription.style.textAlign = 'center';
            } else {
                modalDescription.textContent = description;
                modalDescription.style.textAlign = 'left';
                if (projectLink && modalCtaButton) {
                    modalCtaButton.href = projectLink;
                    modalCtaButton.textContent = 'View Project';
                    modalCtaButton.target = '_blank';
                    modalCtaButton.style.display = 'inline-block';
                }
            }

            modal.style.display = 'block';
            document.body.classList.add('modal-open');
        });
    });

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

    window.addEventListener("popstate", function() {
        const sectionId = location.hash.replace("#", "");
        if (sectionId) {
            revealContent(sectionId, false);
        } else {
            showHome(false);
        }
    });

    window.addEventListener('scroll', function() {
        if (document.documentElement.scrollTop > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    sectionsToHide.forEach(section => {
        if (section.id !== 'home') {
            section.classList.add('hidden-content');
        } else {
            section.classList.add('active-section');
        }
    });
});
