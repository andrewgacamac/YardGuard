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

  await page.locator('.faq-nav__link[href="#cost"]').click();
  await expect(page).toHaveURL(/#cost$/);
  await expect(page.locator('.faq-nav__link[href="#cost"]')).toHaveAttribute('aria-current', 'location');
});

test('homepage, Mississauga, and Gallery comparison controls work by keyboard', async ({ page }) => {
  for (const [url, selector] of [
    ['/index.html', '#heroSlider [role="slider"]'],
    ['/artificial-turf-mississauga.html', '#heroSlider [role="slider"]'],
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
