import { testAuth } from './admin-auth.test';
import { testDashboard } from './admin-dashboard.test';
import { testPipeline } from './admin-pipeline.test';
import { testClients } from './admin-clients.test';
import { testLLC } from './admin-llc.test';
import { testTickets } from './admin-tickets.test';
import { testUsers } from './admin-users.test';
import { testContent } from './admin-content.test';
import { testCatalog } from './admin-catalog.test';
import { testSettings } from './admin-settings.test';
import { testCrud } from './admin-crud.test';
import { testNavigation } from './admin-navigation.test';

interface SuiteResult {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ name: string; passed: boolean; error?: string }>;
}

async function runAll() {
  console.log('═══════════════════════════════════════════════');
  console.log('  USDrop Admin — Full E2E Test Suite');
  console.log('═══════════════════════════════════════════════');

  const suites: SuiteResult[] = [];

  suites.push(await testAuth());
  suites.push(await testDashboard());
  suites.push(await testPipeline());
  suites.push(await testClients());
  suites.push(await testLLC());
  suites.push(await testTickets());
  suites.push(await testUsers());
  suites.push(await testContent());
  suites.push(await testCatalog());
  suites.push(await testSettings());
  suites.push(await testCrud());
  suites.push(await testNavigation());

  console.log('\n═══════════════════════════════════════════════');
  console.log('  OVERALL RESULTS');
  console.log('═══════════════════════════════════════════════');

  const totalPassed = suites.reduce((s, r) => s + r.passed, 0);
  const totalFailed = suites.reduce((s, r) => s + r.failed, 0);
  const totalTests = suites.reduce((s, r) => s + r.total, 0);

  console.log(`\n  Total: ${totalTests} | Passed: ${totalPassed} | Failed: ${totalFailed}`);

  const allFailed = suites.flatMap(s => s.results.filter(r => !r.passed));
  if (allFailed.length > 0) {
    console.log('\n  ❌ FAILURES:');
    for (const f of allFailed) {
      console.log(`    - ${f.name}: ${f.error}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
