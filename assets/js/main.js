function initMain() {
    if (window.lucide) {
        try {
            window.lucide.createIcons();
        } catch (error) {
            console.error('Icon rendering error:', error);
        }
    }

    initSlider();
    initAccordions();
    initMobileMenu();
    initAnalytics();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain, { once: true });
} else {
    initMain();
}

// Accessible before/after comparison slider.
function initSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const beforeImage = slider.querySelector('.hero__image--before');
    const handle = slider.querySelector('.hero__slider-handle');
    if (!beforeImage || !handle) return;

    let percentage = 50;
    let dragging = false;

    function setPosition(nextPercentage) {
        percentage = Math.min(100, Math.max(0, nextPercentage));
        beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        handle.style.left = `${percentage}%`;
        handle.setAttribute('aria-valuenow', String(Math.round(percentage)));
    }

    function setPositionFromPointer(clientX) {
        const bounds = slider.getBoundingClientRect();
        if (!bounds.width) return;
        setPosition(((clientX - bounds.left) / bounds.width) * 100);
    }

    slider.addEventListener('pointerdown', (event) => {
        if (event.target.closest('a, button')) return;
        dragging = true;
        slider.setPointerCapture?.(event.pointerId);
        slider.classList.add('active');
        setPositionFromPointer(event.clientX);
    });

    slider.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        setPositionFromPointer(event.clientX);
    });

    const stopDragging = () => {
        dragging = false;
        slider.classList.remove('active');
    };

    slider.addEventListener('pointerup', stopDragging);
    slider.addEventListener('pointercancel', stopDragging);

    handle.addEventListener('keydown', (event) => {
        const step = event.shiftKey ? 10 : 2;
        const controls = {
            ArrowLeft: percentage - step,
            ArrowDown: percentage - step,
            ArrowRight: percentage + step,
            ArrowUp: percentage + step,
            Home: 0,
            End: 100,
        };

        if (controls[event.key] === undefined) return;
        event.preventDefault();
        setPosition(controls[event.key]);
    });
}

function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header, .faq-accordion__header');

    headers.forEach((header, index) => {
        const isFaq = header.classList.contains('faq-accordion__header');
        const item = header.closest(isFaq ? '.faq-accordion__item' : '.accordion-item');
        const content = item?.querySelector(isFaq ? '.faq-accordion__content' : '.accordion-content');
        if (!item || !content) return;

        const contentId = content.id || `accordion-content-${index}`;
        content.id = contentId;
        header.setAttribute('aria-controls', contentId);
        header.setAttribute('aria-expanded', String(item.classList.contains('active')));

        header.addEventListener('click', () => {
            const willOpen = !item.classList.contains('active');
            item.classList.toggle('active', willOpen);
            header.setAttribute('aria-expanded', String(willOpen));

            if (willOpen && typeof window.gtag === 'function') {
                window.gtag('event', 'accordion_expand', {
                    event_category: 'Engagement',
                    event_label: header.innerText.trim(),
                });
            }
        });
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.header__nav');
    if (!toggle || !navigation) return;

    const setOpen = (isOpen) => {
        navigation.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    toggle.addEventListener('click', () => {
        setOpen(!navigation.classList.contains('active'));
    });

    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navigation.classList.contains('active')) {
            setOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!navigation.classList.contains('active')) return;
        if (!navigation.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1023) setOpen(false);
    });
}

function initAnalytics() {
    document.querySelectorAll('.problem-card').forEach((card) => {
        card.addEventListener('click', () => {
            if (typeof window.gtag !== 'function') return;
            window.gtag('event', 'click_problem_card', {
                event_category: 'Engagement',
                event_label: card.querySelector('.problem-card__title')?.innerText || 'Unknown Problem',
            });
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
        link.addEventListener('click', () => {
            if (typeof window.gtag !== 'function') return;
            window.gtag('event', 'click_to_call', {
                event_category: 'Leads',
                event_label: link.href,
            });
        });
    });
}
