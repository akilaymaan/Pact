import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const baseUrl = process.env.UI_URL || 'http://localhost:5174/';
const screenshot = name => join(tmpdir(), name);
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(baseUrl)) errors.push(`${response.status()} ${response.url()}`); });
await page.addInitScript(() => {
  window.__layoutShift = 0;
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__layoutShift += entry.value;
  }).observe({ type: 'layout-shift', buffered: true });
});
const report = [];
const heroRefreshReport = [];
for (const viewport of [{ width: 375, height: 600 }, { width: 390, height: 640 }]) {
  await page.setViewportSize(viewport);
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion });
    await page.goto(baseUrl);
    for (const load of ['initial', 'refresh']) {
      if (load === 'refresh') await page.reload();
      await page.locator('.hero-title > span').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1400);
      const headline = await page.locator('.hero-title > span').evaluateAll(lines => lines.map(line => {
        const style = getComputedStyle(line);
        return { text: line.textContent, clip: style.clipPath, opacity: style.opacity, visibility: style.visibility };
      }));
      assert.deepEqual(headline.map(line => line.text), ['Let agents', 'land deals.', 'You decide.']);
      assert.ok(headline.every(line => (line.clip === 'none' || /^inset\(0(?:px|%)?(?: 0(?:px|%)?){0,3}\)$/.test(line.clip)) && Number(line.opacity) === 1 && line.visibility === 'visible'), `Headline hidden on ${load} at ${viewport.width}x${viewport.height} (${reducedMotion}): ${JSON.stringify(headline)}`);
      assert.equal(await page.evaluate(() => scrollY), 0);
      assert.ok(await page.locator('.hero-product').evaluate(el => el.getBoundingClientRect().top >= innerHeight), 'Regression case must keep the product demo below the viewport');
      heroRefreshReport.push({ ...viewport, reducedMotion, load, visible: true });
    }
  }
}
await page.emulateMedia({ reducedMotion: 'no-preference' });

for (const width of process.env.UI_QUICK ? [375] : [1920, 1440, 1200, 1024, 768, 480, 390, 375]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(baseUrl);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const fonts = await page.evaluate(() => ['DM Sans'].map(family => ({ family, loaded: [...document.fonts].some(font => font.family === family && font.status === 'loaded') })));
  assert.ok(fonts.every(font => font.loaded), `Font loading failed: ${JSON.stringify(fonts)}`);
  assert.ok(await page.locator('h1 > span').evaluateAll(lines => lines.every(line => line.scrollWidth <= line.clientWidth + 1)), `Hero text overflows at ${width}`);
  const layoutShift = await page.evaluate(() => window.__layoutShift);
  assert.ok(layoutShift < 0.1, `Initial layout shift ${layoutShift} at ${width}`);
  const sections = await page.locator('main > section').count();
  assert.equal(sections, 15);
  const hero = await page.locator('.hero-copy').boundingBox();
  const product = await page.locator('.hero-product').boundingBox();
  assert.ok(hero.x + hero.width <= product.x + 1 || product.x + product.width <= hero.x + 1 || hero.y + hero.height <= product.y + 1 || product.y + product.height <= hero.y + 1, `Hero overlaps at ${width}`);
  const overflow = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(el => {
    if (el.closest('.hero-bg, .cta-bg, .journey-track, .marquee-track, .fw-svg, .netmap-svg')) return false;
    if (!(el instanceof HTMLElement) || !el.getClientRects().length) return false;
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(el => ({ class: el.className, text: el.textContent.slice(0, 45), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) })));
  report.push({ width, sections, fonts, layoutShift, pageOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), overflow });
  if (width === 1440 || width === 390) {
    await page.screenshot({ path: screenshot(`pact-hero-${width}.png`) });
    for (const selector of ['#negotiation', '.flywheel-section', '.activity-section', '#network']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.locator(selector).screenshot({ path: screenshot(`pact-${selector.replace(/[.#]/g, '')}-${width}.png`), style: '.nav, .skip-link { visibility: hidden !important; }' });
    }
  }
  if (width >= 1024) {
    const stageReport = [];
    for (const [i, progress] of [0.05, 0.15, 0.28, 0.45, 0.58, 0.7, 0.83, 0.99].entries()) {
      await page.evaluate(p => {
        const el = document.querySelector('#how');
        window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + p * (el.offsetHeight - innerHeight), behavior: 'instant' });
      }, progress);
      await page.waitForTimeout(1000);
      const name = await page.locator('.how-card.is-active .how-name').innerText();
      const box = await page.locator('.how-card.is-active').boundingBox();
      const internalOverflow = await page.locator('.how-card.is-active').evaluate(el => {
        const bounds = el.getBoundingClientRect();
        return [...el.querySelectorAll('*')].filter(child => {
          if (!(child instanceof HTMLElement) || !child.getClientRects().length || child.closest('.scan-beam')) return false;
          const r = child.getBoundingClientRect();
          return r.left < bounds.left - 1 || r.right > bounds.right + 1 || r.bottom > bounds.bottom + 1;
        }).map(el => el.className);
      });
      stageReport.push({ i, name, centered: Math.abs(box.x + box.width / 2 - width / 2) < 2, internalOverflow });
      if (width === 1440 && [2, 3, 7].includes(i)) await page.screenshot({ path: screenshot(`pact-journey-${i}.png`) });
    }
    report.push({ width, stages: stageReport });
  } else {
    assert.equal(await page.locator('.m-card').count(), 8);
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false');
  }
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(baseUrl);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const scrollToStage = async (progress) => {
  await page.evaluate(p => {
    const el = document.querySelector('#how');
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + p * (el.offsetHeight - innerHeight), behavior: 'instant' });
  }, progress);
  await page.waitForFunction(name => document.querySelector('.how-card.is-active .how-name')?.textContent === name, 'Approve', { timeout: 5000 });
};
await scrollToStage(0.45);
const approval = page.locator('.how-card.is-active');
assert.equal(await approval.locator('.stamp').count(), 0);
await approval.getByRole('button', { name: 'Decline', exact: true }).click();
assert.match(await approval.getByRole('status').innerText(), /declined/);
await approval.getByRole('button', { name: 'Request changes', exact: true }).click();
assert.match(await approval.getByRole('status').innerText(), /Changes requested/);
await approval.getByRole('button', { name: 'Approve deal', exact: true }).click();
assert.match(await approval.getByRole('status').innerText(), /approved by you/);
assert.equal(await approval.locator('.stamp').count(), 1);
await approval.getByRole('button', { name: 'Reset demo', exact: true }).click();
assert.equal(await approval.locator('.stamp').count(), 0);

await page.locator('#human-approval').scrollIntoViewIfNeeded();
await page.waitForTimeout(4000);
assert.equal(await page.getByRole('button', { name: 'Approve demo proposal', exact: true }).count(), 1);
await page.getByRole('button', { name: 'Approve demo proposal', exact: true }).click();
assert.match(await page.locator('#human-approval [role=status]').innerText(), /Approved by you/i);

await page.locator('#negotiation').scrollIntoViewIfNeeded();
await page.getByRole('button', { name: 'Pause demo', exact: true }).click();
const pausedTerms = await page.locator('.nd-terms').innerText();
await page.waitForTimeout(2700);
assert.equal(await page.locator('.nd-terms').innerText(), pausedTerms);
await page.getByRole('button', { name: 'Resume demo', exact: true }).click();

await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(baseUrl);
assert.equal(await page.locator('.m-card').count(), 8);
assert.equal(await page.locator('.how-sticky').count(), 0);
await page.locator('.m-card').nth(6).scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
assert.match(await page.locator('.m-card').nth(6).innerText(), /104K/);
assert.match(await page.locator('.m-card').nth(6).innerText(), /PERFORMANCE VERIFIED/i);
assert.equal(await page.locator('.m-card').nth(3).locator('.stamp').count(), 0);
const reducedActivity = await page.locator('.act-list').innerText();
await page.locator('.act').scrollIntoViewIfNeeded();
await page.waitForTimeout(3500);
assert.equal(await page.locator('.act-list').innerText(), reducedActivity);

const reducedMarquee = await page.locator('.marquee-track').evaluate(el => getComputedStyle(el).animationName);
assert.equal(reducedMarquee, 'none');
assert.equal(await page.locator('.marquee-group[aria-hidden="true"]').isVisible(), false);

await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.setViewportSize({ width: 375, height: 844 });
await page.goto(baseUrl);
await page.getByRole('link', { name: 'Skip to content' }).waitFor();
await page.keyboard.press('Tab');
assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Skip to content');
await page.keyboard.press('Tab');
await page.keyboard.press('Tab');
assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Open menu');
await page.keyboard.press('Enter');
assert.equal(await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded'), 'true');
await page.keyboard.press('Escape');
assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Open menu');
const anchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => href !== '#'));
for (const anchor of new Set(anchors)) assert.equal(await page.locator(anchor).count(), 1, `Missing navigation destination ${anchor}`);

await page.getByRole('button', { name: 'Pause hero animation' }).click();
assert.equal(await page.getByRole('button', { name: 'Resume hero animation' }).getAttribute('aria-pressed'), 'true');
assert.equal(await page.locator('.marquee-track').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
await page.getByRole('button', { name: 'Resume hero animation' }).click();

for (const viewport of [{ width: 1200, height: 720 }, { width: 1024, height: 768 }, { width: 1440, height: 650 }]) {
  await page.setViewportSize(viewport);
  await page.goto(baseUrl);
  await page.evaluate(() => document.fonts.ready);
  if (viewport.height > 700) {
    await scrollToStage(0.45);
    await page.waitForTimeout(900);
    const card = page.locator('.how-card.is-active');
    await card.getByRole('button', { name: 'Approve deal', exact: true }).click();
    assert.match(await card.getByRole('status').innerText(), /approved by you/);
    await card.locator('.how-card-body').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await card.getByRole('button', { name: 'Reset demo' }).click();
    const body = card.locator('.how-card-body');
    assert.equal(await body.evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
  } else assert.equal(await page.locator('.m-card').count(), 8);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}
console.log(JSON.stringify({ report, errors, interactionTests: 'passed', reducedMotionTests: 'passed', keyboardAndNavigationTests: 'passed', shortViewportTests: 'passed' }, null, 2));
await browser.close();
assert.equal(errors.length, 0, 'Browser errors found');
assert.ok(report.every(r => !r.pageOverflow && (!r.overflow || r.overflow.length === 0)), 'Responsive overflow found');
assert.ok(report.every(r => !r.stages || r.stages.every(s => s.centered && s.internalOverflow.length === 0)), 'Journey layout issue found');
