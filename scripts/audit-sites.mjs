import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Normal Lighthouse presets, cold cache, sequential runs: no score overrides or
// concurrent browsers competing for the CPU. Pin the tool for repeatability.
const requireAgentic = process.argv.includes('--require-agentic');
const requiredAgenticAudits = ['agent-accessibility-tree', 'cumulative-layout-shift', 'llms-txt'];
const view = process.argv.includes('--view');
const local = process.argv.includes('--local');
const devices = process.argv.includes('--mobile-only') ? ['mobile'] : ['mobile', 'desktop'];
const output = path.resolve(process.env.AUDIT_OUTPUT || `docs/performance/${new Date().toISOString().slice(0, 10)}-${local ? 'local' : 'live'}`);
const port = process.env.AUDIT_PORT || '3100';
const sites = local
  ? [['portfolio', `http://localhost:${port}`], ['arras', `http://arras.localhost:${port}`], ['puremac', `http://puremac.localhost:${port}`]]
  : [['portfolio', 'https://yashashwi.me'], ['arras', 'https://arras.yashashwi.me'], ['puremac', 'https://puremac.yashashwi.me']];
const summaries = [];
await mkdir(output, { recursive: true });
for (const [name, url] of sites) {
  for (const device of devices) {
    const reportPath = path.join(output, `${name}-${device}.json`);
    console.log(`Auditing ${url} (${device})`);
    const args = ['--yes', 'lighthouse@13.4.1', url, '--chrome-flags=--headless',
      '--only-categories=performance,accessibility,best-practices,seo,agentic-browsing',
      '--output=json', `--output-path=${reportPath}`, '--quiet'];
    if (view) args.push('--output=html', '--view');
    if (device === 'desktop') args.push('--preset=desktop');
    await new Promise((resolve, reject) => {
      const child = spawn('npx', args, { stdio: 'inherit' });
      child.on('error', reject);
      child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Lighthouse exited ${code}: ${url}`)));
    });
    const report = JSON.parse(await readFile(view ? reportPath.replace(/\.json$/, '.report.json') : reportPath, 'utf8'));
    if (report.runtimeError) throw new Error(`${url}: ${report.runtimeError.message}`);
    const categories = Object.fromEntries(Object.entries(report.categories)
      .filter(([id]) => id !== 'agentic-browsing')
      .map(([id, c]) => [id, c.score == null ? null : Math.round(c.score * 100)]));
    const refs = report.categories['agentic-browsing'].auditRefs.filter(ref => ref.weight > 0);
    const passed = requiredAgenticAudits.filter(id =>
      refs.some(ref => ref.id === id) && report.audits[id]?.score === 1).length;
    const agenticTargetMet = passed === requiredAgenticAudits.length;
    const result = { name, url, device, measuredAt: report.fetchTime, ...categories,
      agentic: `${passed}/${requiredAgenticAudits.length}`,
      agenticScore: Math.round(report.categories['agentic-browsing'].score * 100),
      agenticTargetMet,
      lcpMs: report.audits['largest-contentful-paint'].numericValue,
      tbtMs: report.audits['total-blocking-time'].numericValue,
      cls: report.audits['cumulative-layout-shift'].numericValue,
      targetMet: Object.values(categories).every(score => score === 100) && agenticTargetMet };
    summaries.push(result);
    console.log(JSON.stringify(result));
    await writeFile(path.join(output, 'summary.json'), JSON.stringify(summaries, null, 2) + '\n');
  }
}
console.table(summaries.map(({ name, device, performance, accessibility, seo, agentic, targetMet }) =>
  ({ name, device, performance, accessibility, seo, agentic, targetMet })));
console.log(`Reports: ${output}`);
if (summaries.some(result => requireAgentic ? !result.agenticTargetMet : !result.targetMet)) process.exitCode = 1;
