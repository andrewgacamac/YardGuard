const { test, expect } = require('playwright/test');
const publicPages = require('../../config/public-pages.json');

for (const publicPage of publicPages) {
  test(`${publicPage} loads without page errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    const response = await page.goto(`/${publicPage}`, { waitUntil: 'domcontentloaded' });
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1').first()).toBeVisible();
    await page.waitForTimeout(100);
    expect(errors).toEqual([]);
  });
}

test('mobile navigation opens, closes, and returns focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/index.html');
  await expect(page.locator('.header__nav')).toBeVisible();
  await expect(page.locator('.mobile-menu-toggle')).toBeHidden();

  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.locator('.mobile-menu-toggle');
  const navigation = page.locator('.header__nav');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toHaveClass(/active/);
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('Gallery filters expose only matching projects', async ({ page }) => {
  await page.goto('/gallery.html');
  await page.locator('.filter-btn[data-filter="toronto"]').click();
  await expect(page.locator('.filter-btn[data-filter="toronto"]')).toHaveClass(/active/);
  await expect(page.locator('.gallery-card[data-city="toronto"]')).toBeVisible();
  for (const card of await page.locator('.gallery-card:not([data-city="toronto"])').all()) {
    await expect(card).toBeHidden();
  }
});

test('FAQ accordions and mobile category navigation expose synchronized state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/faq.html');
  const firstHeader = page.locator('.faq-accordion__header').first();
  const panel = page.locator(`#${await firstHeader.getAttribute('aria-controls')}`);
  await firstHeader.click();
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toHaveAttribute('hidden', '');
  await firstHeader.click();
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).not.toHaveAttribute('hidden', '');

  const headers = page.locator('.faq-accordion__header');
  await expect(headers).toHaveCount(29);
  for (let index = 0; index < 29; index += 1) {
    const header = headers.nth(index);
    const controlledPanel = page.locator(`#${await header.getAttribute('aria-controls')}`);
    if ((await header.getAttribute('aria-expanded')) === 'true') await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await expect(controlledPanel).toHaveAttribute('hidden', '');
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await expect(controlledPanel).not.toHaveAttribute('hidden', '');
  }

  await page.locator('.faq-nav__link[href="#cost"]').click();
  await expect(page).toHaveURL(/#cost$/);
  await expect(page.locator('.faq-nav__link[href="#cost"]')).toHaveAttribute('aria-current', 'location');
});

test('homepage, Mississauga, and Gallery comparison controls work by keyboard', async ({ page }) => {
  for (const [url, selector] of [
    ['/index.html', '#heroSlider [role="slider"]'],
    ['/artificial-turf-mississauga.html', '#heroSlider [role="slider"]'],
    ['/partner-program.html', '#heroSlider [role="slider"]'],
    ['/gallery.html', '.gallery-card__slider[role="slider"]'],
  ]) {
    await page.goto(url);
    const slider = page.locator(selector).first();
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '52');
  }
});

test('@desktop-slider visible before-and-after controls accept a desktop mouse drag', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const comparison of [
    {
      url: '/index.html',
      track: '#heroSlider',
      handle: '#heroSlider [role="slider"]',
      before: '#heroSlider .hero__image--before',
    },
    {
      url: '/artificial-turf-mississauga.html',
      track: '#heroSlider',
      handle: '#heroSlider [role="slider"]',
      before: '#heroSlider .hero__image--before',
    },
    {
      url: '/partner-program.html',
      track: '#heroSlider',
      handle: '#heroSlider [role="slider"]',
      before: '#heroSlider .hero__image--before',
    },
    {
      url: '/gallery.html',
      track: '.gallery-card__image',
      handle: '.gallery-card__slider[role="slider"]',
      before: '.gallery-card__before',
    },
  ]) {
    await page.goto(comparison.url);

    const track = page.locator(comparison.track).first();
    const handle = page.locator(comparison.handle).first();
    const before = page.locator(comparison.before).first();
    await handle.scrollIntoViewIfNeeded();
    await expect(handle).toHaveAttribute('aria-valuenow', '50');

    const knob = await handle.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const computedTop = getComputedStyle(element, '::before').top;
      const offset = computedTop.endsWith('%')
        ? bounds.height * Number.parseFloat(computedTop) / 100
        : Number.parseFloat(computedTop);
      return {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + offset,
      };
    });

    expect(await page.evaluate(({ x, y }) => (
      Boolean(document.elementFromPoint(x, y)?.closest('[role="slider"]'))
    ), knob)).toBe(true);

    const trackBounds = await track.boundingBox();
    expect(trackBounds).not.toBeNull();
    await page.mouse.move(knob.x, knob.y);
    await page.mouse.down();
    await page.mouse.move(trackBounds.x + trackBounds.width * 0.75, knob.y, { steps: 8 });
    await page.mouse.up();

    const value = Number(await handle.getAttribute('aria-valuenow'));
    expect(value).toBeGreaterThanOrEqual(74);
    expect(value).toBeLessThanOrEqual(76);
    await expect(handle).toHaveAttribute('aria-valuetext', /^(74|75|76)% before image$/);
    await expect(handle).toHaveAttribute('style', /left: 7[4-6](?:\.\d+)?%/);
    await expect(before).toHaveAttribute('style', /clip-path:.*7[4-6](?:\.\d+)?%/);
  }
});

test('quote validation is inline and a valid local submission succeeds without email', async ({ page }) => {
  await page.goto('/quote.html');
  await page.getByRole('button', { name: /Continue/ }).first().click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page.locator('#formStatus')).toBeFocused();
  await expect(page.locator('#firstName')).toHaveAttribute('aria-invalid', 'true');

  await page.locator('#firstName').fill('Jane');
  await page.locator('#lastName').fill('Homeowner');
  await page.locator('#email').fill('jane@example.com');
  await page.locator('#phone').fill('(647) 555-1234');
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByRole('button', { name: /Get My Free Quote/ }).click();
  await expect(page.locator('#formSuccess')).toHaveClass(/active/);
  await expect(page.locator('#formSuccess')).toBeFocused();
});

test('Learning Centre search filters guides and announces the result count', async ({ page }) => {
  await page.goto('/learn.html');
  const cards = page.locator('[data-learn-library] .learn-card');
  const total = await cards.count();
  expect(total).toBeGreaterThan(20);
  await expect(page.locator('#learn-search-status')).toHaveText(`${total} guides available.`);

  await page.locator('#learn-search-input').fill('PFAS');
  await expect(page.locator('#learn-search-status')).toHaveText(/^[1-9]\d* guides? found\.$/);
  const visibleCards = cards.filter({ visible: true });
  expect(await visibleCards.count()).toBeLessThan(total);
  for (const card of await visibleCards.all()) {
    await expect(card).toContainText(/PFAS/i);
  }

  await page.locator('#learn-search-input').fill('a phrase that does not exist anywhere');
  await expect(page.locator('#learn-search-status')).toHaveText('0 guides found.');
  await expect(cards.first()).toBeHidden();
});

test('technical glossary search filters definitions and announces the result count', async ({ page }) => {
  await page.goto('/learn-glossary.html');
  const terms = page.locator('[data-glossary-term]');
  const total = await terms.count();
  expect(total).toBeGreaterThanOrEqual(70);
  await expect(page.locator('#learn-glossary-status')).toHaveText(`${total} terms shown.`);

  await page.locator('#learn-glossary-input').fill('zeolite');
  await expect(page.locator('#learn-glossary-status')).toHaveText('1 term shown.');
  await expect(terms.filter({ visible: true })).toHaveCount(1);
  await expect(terms.filter({ visible: true })).toContainText(/zeolite/i);
});

test('comparison worksheet statements toggle their associated checkboxes', async ({ page }) => {
  await page.goto('/learn-product-comparison-checklist.html');
  const firstItem = page.locator('.learn-checklist label').first();
  const checkbox = firstItem.locator('input[type="checkbox"]');
  await expect(checkbox).not.toBeChecked();
  await firstItem.locator('span').click();
  await expect(checkbox).toBeChecked();
});
