import {
    ArrowLeft, ArrowRight, Award, BadgeCheck, Calendar, CalendarCheck, Check, CheckCircle,
    ChevronDown, Circle, Clock, Cuboid as Cube, DollarSign, Share2 as Facebook, FileText, Globe, Hammer, HardHat,
    HelpCircle, Camera as Instagram, Leaf, Lightbulb, Lock, Mail, MapPin, MessageCircle, MessageSquare,
    Palette, PawPrint, Phone, Ruler, Scale, Settings, Shield, ShieldCheck, Sparkles, Star, ThumbsUp,
    createIcons,
} from 'lucide';
import '../css/accessibility.css';

const siteIcons = {
    ArrowLeft, ArrowRight, Award, BadgeCheck, Calendar, CalendarCheck, Check, CheckCircle,
    ChevronDown, Circle, Clock, Cube, DollarSign, Facebook, FileText, Globe, Hammer, HardHat,
    HelpCircle, Instagram, Leaf, Lightbulb, Lock, Mail, MapPin, MessageCircle, MessageSquare,
    Palette, PawPrint, Phone, Ruler, Scale, Settings, Shield, ShieldCheck, Sparkles, Star, ThumbsUp,
};

function renderIcons(root = document) {
    createIcons({ icons: siteIcons, root });
}

// Temporary compatibility for form states that insert new icon placeholders.
window.lucide = { createIcons: ({ root = document } = {}) => renderIcons(root) };

function initMain() {
    try {
        renderIcons();
    } catch (error) {
        console.error('Icon rendering error:', error);
    }

    initSlider();
    initGallerySliders();
    initAccordions();
    initMobileMenu();
    initAccessibleIconLinks();
    initFaqNavigation();
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

    handle.setAttribute('role', 'slider');
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('aria-label', handle.getAttribute('aria-label') || 'Before and after image comparison');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    slider.style.touchAction = 'pan-y';

    function setPosition(nextPercentage) {
        percentage = Math.min(100, Math.max(0, nextPercentage));
        beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        handle.style.left = `${percentage}%`;
        handle.setAttribute('aria-valuenow', String(Math.round(percentage)));
        handle.setAttribute('aria-valuetext', `${Math.round(percentage)}% before image`);
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

    setPosition(percentage);
}

function initGallerySliders() {
    document.querySelectorAll('.gallery-card').forEach((card, index) => {
        const imageContainer = card.querySelector('.gallery-card__image');
        const beforeImage = imageContainer?.querySelector('.gallery-card__before');
        const handle = imageContainer?.querySelector('.gallery-card__slider');
        if (!imageContainer || !beforeImage || !handle) return;

        let percentage = 50;
        let dragging = false;
        const title = card.querySelector('.gallery-card__title')?.textContent.trim() || `project ${index + 1}`;

        handle.setAttribute('role', 'slider');
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('aria-label', `Before and after comparison for ${title}`);
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.style.pointerEvents = 'auto';
        handle.style.touchAction = 'pan-y';
        imageContainer.style.touchAction = 'pan-y';

        const setPosition = (nextPercentage) => {
            percentage = Math.min(100, Math.max(0, nextPercentage));
            beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            handle.style.left = `${percentage}%`;
            handle.setAttribute('aria-valuenow', String(Math.round(percentage)));
            handle.setAttribute('aria-valuetext', `${Math.round(percentage)}% before image`);
        };

        const setPositionFromPointer = (clientX) => {
            const bounds = imageContainer.getBoundingClientRect();
            if (!bounds.width) return;
            setPosition(((clientX - bounds.left) / bounds.width) * 100);
        };

        handle.addEventListener('pointerdown', (event) => {
            dragging = true;
            handle.setPointerCapture?.(event.pointerId);
            setPositionFromPointer(event.clientX);
        });
        handle.addEventListener('pointermove', (event) => {
            if (dragging) setPositionFromPointer(event.clientX);
        });
        const stopDragging = () => { dragging = false; };
        handle.addEventListener('pointerup', stopDragging);
        handle.addEventListener('pointercancel', stopDragging);
        imageContainer.addEventListener('click', (event) => {
            if (!event.target.closest('a, button')) setPositionFromPointer(event.clientX);
        });
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

        setPosition(percentage);
    });
}

function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header, .faq-accordion__header');

    headers.forEach((header, index) => {
        if (header.dataset.accordionReady === 'true') return;

        const isFaq = header.classList.contains('faq-accordion__header');
        const item = header.closest(isFaq ? '.faq-accordion__item' : '.accordion-item');
        const content = item?.querySelector(isFaq ? '.faq-accordion__content' : '.accordion-content');
        if (!item || !content) return;

        header.dataset.accordionReady = 'true';
        const contentId = content.id || `accordion-content-${index}`;
        content.id = contentId;
        header.setAttribute('aria-controls', contentId);
        const initiallyOpen = item.classList.contains('active');
        header.setAttribute('aria-expanded', String(initiallyOpen));
        content.hidden = !initiallyOpen;
        content.style.maxHeight = initiallyOpen ? `${content.scrollHeight}px` : '0px';

        header.addEventListener('click', () => {
            const willOpen = !item.classList.contains('active');
            item.classList.toggle('active', willOpen);
            header.setAttribute('aria-expanded', String(willOpen));
            if (willOpen) {
                content.hidden = false;
                content.style.maxHeight = '0px';
                requestAnimationFrame(() => {
                    content.style.maxHeight = `${content.scrollHeight}px`;
                });
            } else {
                content.style.maxHeight = '0px';
                content.hidden = true;
            }

        });
    });
}

function initAccessibleIconLinks() {
    const labels = [
        ['facebook.com', 'YardGuard on Facebook'],
        ['instagram.com', 'YardGuard on Instagram'],
        ['ygtoronto.com', 'YardGuard website'],
    ];

    document.querySelectorAll('a.footer__social-link').forEach((link) => {
        if (link.hasAttribute('aria-label') || link.textContent.trim()) return;
        const match = labels.find(([host]) => link.href.includes(host));
        link.setAttribute('aria-label', match?.[1] || 'YardGuard social profile');
    });
}

function initFaqNavigation() {
    const links = [...document.querySelectorAll('.faq-nav__link[href^="#"]')];
    if (!links.length) return;

    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActive = (sectionId, updateHash = false) => {
        const activeLink = links.find((link) => link.hash === `#${sectionId}`);
        if (!activeLink) return;

        links.forEach((link) => {
            const isActive = link === activeLink;
            link.classList.toggle('active', isActive);
            if (isActive) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });

        if (window.innerWidth <= 767) {
            activeLink.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }

        if (updateHash && window.location.hash !== activeLink.hash) {
            history.replaceState(null, '', activeLink.hash);
        }
    };

    links.forEach((link) => {
        link.addEventListener('click', () => setActive(link.hash.slice(1)));
    });

    const initialId = sections.some((section) => `#${section.id}` === window.location.hash)
        ? window.location.hash.slice(1)
        : sections[0]?.id;
    if (initialId) setActive(initialId);

    window.addEventListener('hashchange', () => {
        if (window.location.hash) setActive(window.location.hash.slice(1));
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id, true);
        }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.5] });
        sections.forEach((section) => observer.observe(section));
    }
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
