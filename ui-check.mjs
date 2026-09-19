import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
const report = [];

for (const width of process.env.UI_QUICK ? [390] : [1440, 1200, 1024, 768, 480, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('http://localhost:5174/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const sections = await page.locator('main > section').count();
  assert.equal(sections, 15);
  const hero = await page.locator('.hero-copy').boundingBox();
  const product = await page.locator('.hero-product').boundingBox();
  assert.ok(hero.x + hero.width <= product.x + 1 || hero.y + hero.height <= product.y + 1, `Hero overlaps at ${width}`);
  const overflow = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(el => {
    if (el.closest('.hero-bg, .cta-bg, .journey-track, .fw-svg, .netmap-svg')) return false;
    if (!(el instanceof HTMLElement) || !el.getClientRects().length) return false;
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
  }).map(el => ({ class: el.className, text: el.textContent.slice(0, 45), left: Math.round(el.getBoundingClientRect().left), right: Math.round(el.getBoundingClientRect().right) })));
  report.push({ width, sections, pageOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), overflow });
  if (width === 1440 || width === 390) {
    await page.screenshot({ path: `pact-hero-${width}.png` });
    for (const selector of ['#negotiation', '.flywheel-section', '.activity-section', '#network']) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await page.locator(selector).screenshot({ path: `pact-${selector.replace(/[.#]/g, '')}-${width}.png`, style: '.nav, .skip-link { visibility: hidden !important; }' });
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
      if (width === 1440 && [2, 3, 7].includes(i)) await page.screenshot({ path: `pact-journey-${i}.png` });
    }
    report.push({ width, stages: stageReport });
  } else {
    assert.equal(await page.locator('.m-card').count(), 8);
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('button', { name: 'Open menu', exact: true }).getAttribute('aria-expanded'), 'false');
  }
}

console.log(JSON.stringify({ report }, null, 2));
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:5174/');
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
await page.goto('http://localhost:5174/');
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

console.log(JSON.stringify({ report, errors, interactionTests: 'passed', reducedMotionTests: 'passed' }, null, 2));
await browser.close();
assert.equal(errors.length, 0, 'Browser errors found');
assert.ok(report.every(r => !r.pageOverflow && (!r.overflow || r.overflow.length === 0)), 'Responsive overflow found');
assert.ok(report.every(r => !r.stages || r.stages.every(s => s.centered && s.internalOverflow.length === 0)), 'Journey layout issue found');
