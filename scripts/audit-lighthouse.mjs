import { spawn } from 'node:child_process';

const pages = [
  'index.html',
  'projects.html',
  'cv.html',
  'research-hotel.html',
  'research-ev.html',
  'research-hanoi-phaseout.html',
  'research-hotel-prca.html',
  'research-hotel-value.html',
  'research-leveraging-influencer.html',
  'research-virtual-influencers.html',
  'research-buffet.html',
  'research-nutrition.html',
  'research-psych-ownership.html',
  'research-arts-workshop.html',
  'research-motorbike-ban.html'
];

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 4179;

const server = spawn('python3', ['-m', 'http.server', String(port)], {
  stdio: 'ignore',
  detached: true
});
server.unref();

const desktopFlags = '--preset=desktop';
const mobileFlags = '--preset=perf';

try {
  for (const page of pages) {
    const url = `http://127.0.0.1:${port}/${page}`;
    console.log(`\\n[desktop] ${page}`);
    await run('npx', [
      'lighthouse',
      url,
      '--chrome-path', chromePath,
      '--chrome-flags', '"--headless=new --no-sandbox"',
      '--only-categories', 'performance,accessibility,best-practices,seo',
      desktopFlags
    ]);

    if (page === 'index.html' || page === 'projects.html' || page.startsWith('research-')) {
      console.log(`\\n[mobile] ${page}`);
      await run('npx', [
        'lighthouse',
        url,
        '--chrome-path', chromePath,
        '--chrome-flags', '"--headless=new --no-sandbox"',
        '--only-categories', 'performance',
        mobileFlags
      ]);
    }
  }
} finally {
  process.kill(-server.pid, 'SIGTERM');
}
