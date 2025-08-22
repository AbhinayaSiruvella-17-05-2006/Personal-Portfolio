document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('.section');
    const contentSections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('nav a');
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.close-btn');
    const viewBtns = document.querySelectorAll('.view-description-btn');
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    const aboutTabLinks = document.querySelectorAll('.tab-link a');
    
    // Show only the target section and hide all others
    function showSection(targetId) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'flex';
        }
    }
    
    // Initial: show home
    showSection('home');
    
    // Nav click event
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            showSection(target);
            history.pushState(null, '', `#${target}`);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = location.hash.replace('#','');
        if(hash && document.getElementById(hash)) showSection(hash);
        else showSection('home');
    });
    
    // Animate hero title letters individually
    const heroTitle = document.querySelector('.hero-title');
    if(heroTitle){
        const letters = heroTitle.textContent.split('');
        heroTitle.innerHTML = '';
        letters.forEach((letter,index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.animationDelay = `${index*0.05}s`;
            span.classList.add('letter');
            heroTitle.appendChild(span);
        });
    }
    
    // Intersection Observer for fade-in on scroll
    const fadeSections = document.querySelectorAll('.section');
    if(fadeSections.length > 0){
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if(entry.isIntersecting) entry.target.classList.add('is-visible');
                else entry.target.classList.remove('is-visible');
            });
        }, { threshold: 0.1 });
    
        fadeSections.forEach(section => {
            section.classList.add('fade-in-on-scroll');
            observer.observe(section);
        });
    }
    
    // Modal functionality
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-title');
            const description = btn.getAttribute('data-description');
    
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modal.style.display = 'block';
        });
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Scroll-to-Top Button functionality
    window.onscroll = function() {
        scrollFunction();
    };
    
    function scrollFunction() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            scrollToTopBtn.style.display = "block";
            setTimeout(() => {
                scrollToTopBtn.style.opacity = "1";
                scrollToTopBtn.style.pointerEvents = "auto";
            }, 10);
        } else {
            scrollToTopBtn.style.opacity = "0";
            scrollToTopBtn.style.pointerEvents = "none";
            setTimeout(() => {
                scrollToTopBtn.style.display = "none";
            }, 300);
        }
    }
    
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // New functionality for About Me section to scroll to content
    aboutTabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
    
            // Ensure main content sections are visible
            sections.forEach(section => {
                if (section.id === 'about') {
                    section.style.display = 'flex';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Show the target scrolling section and hide others
            contentSections.forEach(section => {
                 section.style.display = 'none';
            });
            
            const targetId = link.getAttribute('href').substring(1); // Remove the '#'
            const targetSection = document.getElementById(targetId);
    
            if (targetSection) {
                targetSection.style.display = 'flex';
                // Scroll to the target section smoothly
                window.scrollTo({
                    top: targetSection.offsetTop - document.querySelector('header').offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
});