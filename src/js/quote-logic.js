
// UI Logic for Multi-step Form
// We use dynamic imports to ensure UI works even if backend modules fail initially.

// Expose navigation functions globally immediately
window.nextStep = function (targetStep) {
    const currentStepEl = document.querySelector('.form-step.active');
    const currentStep = Number(currentStepEl?.dataset.step || 1);

    if (targetStep > currentStep && currentStepEl && !validateStep(currentStepEl)) {
        const firstInvalid = currentStepEl.querySelector(':invalid');
        firstInvalid?.focus();
        firstInvalid?.reportValidity();
        return;
    }

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    // Show target step
    const targetStepEl = document.querySelector(`.form-step[data-step="${targetStep}"]`);
    if (targetStepEl) {
        targetStepEl.classList.add('active');
        targetStepEl.querySelector('input, select, textarea, button')?.focus({ preventScroll: true });
    } else {
        return;
    }

    // Update progress bar
    document.querySelectorAll('.form-progress__step').forEach(p => {
        const pStep = parseInt(p.dataset.step);
        if (pStep < targetStep) {
            p.classList.add('completed');
            p.classList.remove('active');
            p.removeAttribute('aria-current');
        } else if (pStep === targetStep) {
            p.classList.add('active');
            p.classList.remove('completed');
            p.setAttribute('aria-current', 'step');
        } else {
            p.classList.remove('active', 'completed');
            p.removeAttribute('aria-current');
        }
    });

    // Re-initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Scroll to top
    const formContainer = document.querySelector('.quote-form-container');
    if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.prevStep = function (step) {
    window.nextStep(step);
}

function validateStep(stepEl) {
    const inputs = stepEl.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            // Ensure error message is visible
            const errorMsg = input.parentNode.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'block';
        } else {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
            const errorMsg = input.parentNode.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'none';
        }
    });

    return isValid;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    // Check for package parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    if (packageParam) {
        const packageInput = document.getElementById(packageParam);
        if (packageInput) {
            packageInput.checked = true;
        }
    }

    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // input listener to remove error class on type
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
            const errorMsg = input.parentNode.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    });
});

// URL of the DigitalOcean Function that emails the lead via Resend. Set the
// deployed function URL here (or via window.QUOTE_ENDPOINT). It's a public
// endpoint, not a secret — the Resend key lives inside the function, not here.
const QUOTE_ENDPOINT =
    (typeof window !== 'undefined' && window.QUOTE_ENDPOINT) ||
    import.meta.env.VITE_QUOTE_ENDPOINT ||
    '/api/quote';

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    if (!validateStep(document.querySelector('.form-step.active'))) return;

    try {
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        // Collect the form fields into a JSON payload for the function.
        const fd = new FormData(form);
        const payload = {
            firstName: fd.get('firstName') || '',
            lastName: fd.get('lastName') || '',
            email: fd.get('email') || '',
            phone: fd.get('phone') || '',
            package: fd.get('package') || '',
            project_type: fd.getAll('project_type'),
            size: fd.get('size') || '',
            address: fd.get('address') || '',
            city: fd.get('city') || '',
            postalCode: fd.get('postalCode') || '',
            timeline: fd.get('timeline') || '',
            howHeard: fd.get('howHeard') || '',
            message: fd.get('message') || '',
            'casl-optin': fd.get('casl-optin') ? true : false,
            _gotcha: fd.get('_gotcha') || '', // honeypot
        };

        const response = await fetch(QUOTE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let message = 'Something went wrong. Please try again or call (647) 216-7787.';
            try {
                const errorData = await response.json();
                if (errorData && errorData.error) message = errorData.error;
            } catch (_) { /* non-JSON error, keep default */ }
            throw new Error(message);
        }

        // GA4 Macro-conversion: Lead Generation
        if (typeof window.gtag === 'function') {
            gtag('event', 'generate_lead', {
                'event_category': 'Leads',
                'event_label': 'Quote Form Submitted',
                'value': 1
            });
        }

        // Success State
        form.style.display = 'none';
        document.querySelector('.form-progress').style.display = 'none';
        const success = document.getElementById('formSuccess');
        success.classList.add('active');
        success.focus();
        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error('Submission Error:', error);
        alert('Error: ' + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
