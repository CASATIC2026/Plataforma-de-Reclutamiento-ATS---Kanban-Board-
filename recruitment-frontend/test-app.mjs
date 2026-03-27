import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:5173';
const SCREENSHOT_DIR = './test-screenshots';
const errors = [];
const warnings = [];
const consoleErrors = [];

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

function log(msg) { console.log(`[TEST] ${msg}`); }
function bug(msg) { errors.push(msg); console.log(`[BUG] ${msg}`); }
function warn(msg) { warnings.push(msg); console.log(`[WARN] ${msg}`); }

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Collect console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Collect network errors
  const networkErrors = [];
  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push(`${resp.status()} ${resp.url()}`);
    }
  });

  // ====== TEST 1: Landing Page ======
  log('--- TEST 1: Landing Page (/) ---');
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${SCREENSHOT_DIR}/01-landing.png`, fullPage: true });

  // Check page title/brand
  const brandText = await page.textContent('body');
  if (!brandText.includes('TalentBridge')) {
    bug('Landing page missing TalentBridge branding');
  } else {
    log('OK: TalentBridge branding found');
  }

  // Check if auth buttons exist (Iniciar sesión / Registrarse)
  const loginBtn = await page.$('text=Iniciar sesión') || await page.$('text=Iniciar Sesión');
  const registerBtn = await page.$('text=Registrarse');
  if (!loginBtn) bug('Landing page missing "Iniciar sesión" button');
  else log('OK: Login button found');
  if (!registerBtn) bug('Landing page missing "Registrarse" button');
  else log('OK: Register button found');

  // Check for hero section
  const heroTitle = await page.$('h1');
  if (!heroTitle) bug('Landing page missing h1 hero title');
  else log('OK: Hero h1 found');

  // ====== TEST 2: Navigate to Login ======
  log('\n--- TEST 2: Login Page (/login) ---');
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${SCREENSHOT_DIR}/02-login.png`, fullPage: true });

  const emailInput = await page.$('input[type="email"]');
  const passwordInput = await page.$('input[type="password"]');
  if (!emailInput) bug('Login page missing email input');
  else log('OK: Email input found');
  if (!passwordInput) bug('Login page missing password input');
  else log('OK: Password input found');

  // ====== TEST 3: Login with wrong credentials ======
  log('\n--- TEST 3: Login with wrong credentials ---');
  if (emailInput && passwordInput) {
    await emailInput.fill('wrong@email.com');
    await passwordInput.fill('wrongpassword');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/03-login-error.png`, fullPage: true });
      const pageText = await page.textContent('body');
      if (pageText.includes('incorrecto') || pageText.includes('error') || pageText.includes('Error') || pageText.includes('Incorrecto')) {
        log('OK: Error message shown for wrong credentials');
      } else {
        bug('No error message displayed for wrong credentials');
      }
    }
  }

  // ====== TEST 4: Login with admin credentials ======
  log('\n--- TEST 4: Login with admin credentials ---');
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const emailInput2 = await page.$('input[type="email"]');
  const passwordInput2 = await page.$('input[type="password"]');
  if (emailInput2 && passwordInput2) {
    await emailInput2.fill('admin@talentbridge.com');
    await passwordInput2.fill('Admin123!');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/04-after-login.png`, fullPage: true });

      const currentUrl = page.url();
      log(`After login URL: ${currentUrl}`);

      // Check if we're redirected (should go somewhere after login)
      const token = await page.evaluate(() => localStorage.getItem('tb_token'));
      if (token) {
        log('OK: JWT token stored in localStorage');
      } else {
        bug('JWT token NOT stored in localStorage after login');
      }

      const user = await page.evaluate(() => localStorage.getItem('tb_user'));
      if (user) {
        log(`OK: User data stored: ${user}`);
      } else {
        bug('User data NOT stored in localStorage after login');
      }
    }
  }

  // ====== TEST 5: Admin Vacantes Page ======
  log('\n--- TEST 5: Admin Vacantes (/admin/vacantes) ---');
  await page.goto(BASE + '/admin/vacantes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/05-admin-vacantes.png`, fullPage: true });

  const adminUrl = page.url();
  if (adminUrl.includes('/login')) {
    bug('Redirected to login even though we just logged in - auth state may be lost on navigation');
  } else {
    log('OK: Admin vacantes page accessible after login');
  }

  // ====== TEST 6: Admin Kanban ======
  log('\n--- TEST 6: Admin Kanban (/admin/kanban) ---');
  await page.goto(BASE + '/admin/kanban', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/06-admin-kanban.png`, fullPage: true });

  // Check Kanban columns exist
  const kanbanUrl = page.url();
  if (kanbanUrl.includes('/login')) {
    bug('Kanban redirects to login - auth persistence issue');
  } else {
    const pageContent = await page.textContent('body');
    const columns = ['Nuevo', 'Entrevista', 'Prueba Técnica', 'Oferta'];
    for (const col of columns) {
      if (pageContent.includes(col)) {
        log(`OK: Kanban column "${col}" found`);
      } else {
        bug(`Kanban column "${col}" missing`);
      }
    }
  }

  // ====== TEST 7: Admin Postulaciones ======
  log('\n--- TEST 7: Admin Postulaciones (/admin/postulaciones) ---');
  await page.goto(BASE + '/admin/postulaciones', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/07-admin-postulaciones.png`, fullPage: true });

  // ====== TEST 8: Register page ======
  log('\n--- TEST 8: Register Page (/login?mode=register) ---');
  // First logout
  await page.evaluate(() => {
    localStorage.removeItem('tb_token');
    localStorage.removeItem('tb_user');
  });
  await page.goto(BASE + '/login?mode=register', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/08-register.png`, fullPage: true });

  // Check register form fields
  const inputs = await page.$$('input');
  const selects = await page.$$('select');
  log(`Register form: ${inputs.length} inputs, ${selects.length} selects`);
  if (inputs.length < 4) bug(`Register form seems incomplete - only ${inputs.length} inputs found`);

  // ====== TEST 9: Register with validation ======
  log('\n--- TEST 9: Register form validation ---');
  const regSubmit = await page.$('button[type="submit"]');
  if (regSubmit) {
    await regSubmit.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/09-register-validation.png`, fullPage: true });
  }

  // ====== TEST 10: Register a new user ======
  log('\n--- TEST 10: Register new test user ---');
  await page.goto(BASE + '/login?mode=register', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Fill in register form - need to find the right inputs
  const allInputs = await page.$$('input');
  for (const input of allInputs) {
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    const name = await input.getAttribute('name');
    log(`  Input: type=${type}, name=${name}, placeholder=${placeholder}`);
  }

  // Try to register
  const nameInputs = await page.$$('input[type="text"]');
  const emailInputReg = await page.$('input[type="email"]');
  const passInputReg = await page.$('input[type="password"]');

  if (nameInputs.length >= 2 && emailInputReg && passInputReg) {
    await nameInputs[0].fill('Test');
    await nameInputs[1].fill('User');
    await emailInputReg.fill(`testuser_${Date.now()}@test.com`);
    await passInputReg.fill('Test1234!');

    // Check for career/carrera field
    if (nameInputs.length >= 3) {
      await nameInputs[2].fill('Ingeniería');
    }

    await page.screenshot({ path: `${SCREENSHOT_DIR}/10-register-filled.png`, fullPage: true });

    const regBtn = await page.$('button[type="submit"]');
    if (regBtn) {
      await regBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/11-after-register.png`, fullPage: true });

      const afterRegUrl = page.url();
      log(`After register URL: ${afterRegUrl}`);

      const tokenAfterReg = await page.evaluate(() => localStorage.getItem('tb_token'));
      if (tokenAfterReg) {
        log('OK: Auto-logged in after registration');
      } else {
        bug('Not auto-logged in after registration');
      }
    }
  } else {
    warn(`Could not find enough inputs for registration form (text: ${nameInputs.length}, email: ${!!emailInputReg}, pass: ${!!passInputReg})`);
  }

  // ====== TEST 11: Protected routes without auth ======
  log('\n--- TEST 11: Protected routes without auth ---');
  await page.evaluate(() => {
    localStorage.removeItem('tb_token');
    localStorage.removeItem('tb_user');
  });
  await page.goto(BASE + '/admin/vacantes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/12-protected-no-auth.png`, fullPage: true });

  const protectedUrl = page.url();
  if (protectedUrl.includes('/login')) {
    log('OK: Protected route redirects to login when not authenticated');
  } else {
    bug(`Protected route /admin/vacantes accessible without auth! URL: ${protectedUrl}`);
  }

  // ====== TEST 12: Public pages ======
  log('\n--- TEST 12: Public /jobs page ---');
  await page.goto(BASE + '/jobs', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/13-public-jobs.png`, fullPage: true });

  const jobsUrl = page.url();
  if (jobsUrl.includes('/login')) {
    bug('/jobs page should be public but redirects to login');
  } else {
    log('OK: /jobs page is publicly accessible');
  }

  // ====== TEST 13: Mobile responsiveness ======
  log('\n--- TEST 13: Mobile viewport test ---');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/14-mobile-landing.png`, fullPage: true });

  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/15-mobile-login.png`, fullPage: true });

  // Check for horizontal overflow
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  if (hasOverflow) {
    bug('Mobile: Page has horizontal overflow (not fully responsive)');
  } else {
    log('OK: No horizontal overflow on mobile');
  }

  // ====== TEST 14: Back to desktop - Navbar links ======
  log('\n--- TEST 14: Navbar links ---');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  const allLinks = await page.$$('a');
  const hrefs = [];
  for (const link of allLinks) {
    const href = await link.getAttribute('href');
    if (href) hrefs.push(href);
  }
  log(`Found ${hrefs.length} links on landing page: ${hrefs.slice(0, 15).join(', ')}`);

  // Check for broken internal links
  const internalLinks = hrefs.filter(h => h.startsWith('/'));
  for (const link of [...new Set(internalLinks)]) {
    if (link === '/login') continue; // Skip auth pages
    const resp = await page.goto(BASE + link, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => null);
    if (resp && resp.status() >= 400) {
      bug(`Broken link: ${link} returned ${resp.status()}`);
    }
  }

  // ====== SUMMARY ======
  console.log('\n========================================');
  console.log('         TEST SUMMARY');
  console.log('========================================');
  console.log(`\nConsole errors captured: ${consoleErrors.length}`);
  consoleErrors.forEach(e => console.log(`  [CONSOLE] ${e}`));
  console.log(`\nNetwork errors (4xx/5xx): ${networkErrors.length}`);
  networkErrors.forEach(e => console.log(`  [NETWORK] ${e}`));
  console.log(`\nBugs found: ${errors.length}`);
  errors.forEach(e => console.log(`  [BUG] ${e}`));
  console.log(`\nWarnings: ${warnings.length}`);
  warnings.forEach(e => console.log(`  [WARN] ${e}`));
  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}/`);
  console.log('========================================');

  await browser.close();
}

run().catch(err => {
  console.error('Test runner crashed:', err);
  process.exit(1);
});
