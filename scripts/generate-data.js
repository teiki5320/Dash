#!/usr/bin/env node
// generate-data.js — Zero npm dependencies, uses gh CLI
// Usage: node scripts/generate-data.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ghApi(endpoint) {
  try {
    const out = execSync(`gh api "${endpoint}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(out);
  } catch (e) {
    const msg = e.stderr || e.message || '';
    if (msg.includes('404') || (e.stdout && e.stdout.includes('"Not Found"'))) {
      throw Object.assign(new Error('404'), { is404: true });
    }
    throw e;
  }
}

function frenchDate(isoStr) {
  if (!isoStr) return 'Inconnue';
  const now = new Date();
  const date = new Date(isoStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`;
  const diffMonths = Math.floor(diffDays / 30);
  return `Il y a ${diffMonths} mois`;
}

function commitStatus(isoStr) {
  if (!isoStr) return { status: 'blocked', statusLabel: 'Dormant' };
  const diffDays = Math.floor((Date.now() - new Date(isoStr)) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7)  return { status: 'active',  statusLabel: 'En cours' };
  if (diffDays <= 30) return { status: 'active',  statusLabel: 'Actif' };
  if (diffDays <= 90) return { status: 'paused',  statusLabel: 'En pause' };
  return { status: 'blocked', statusLabel: 'Dormant' };
}

function parseRoadmap(base64Content) {
  let md;
  try {
    md = Buffer.from(base64Content, 'base64').toString('utf8');
  } catch {
    return { nextTask: 'À définir', progress: 0 };
  }

  // Count completed and uncompleted checkboxes globally
  const done  = (md.match(/- \[x\]/gi) || []).length;
  const todo  = (md.match(/- \[ \]/g)  || []).length;
  const total = done + todo;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  // Find nextTask: look first in "En cours" section, fallback to "À faire"
  let nextTask = 'À définir';

  const sections = ['🔥 En cours', '📋 À faire', '## En cours', '## À faire'];
  for (const sec of sections) {
    const idx = md.indexOf(sec);
    if (idx === -1) continue;
    // Find first uncompleted checkbox after this section header
    const slice = md.slice(idx);
    const match = slice.match(/- \[ \] (.+)/);
    if (match) {
      nextTask = match[1].trim();
      break;
    }
  }

  // Ultimate fallback: first uncompleted checkbox anywhere
  if (nextTask === 'À définir') {
    const match = md.match(/- \[ \] (.+)/);
    if (match) nextTask = match[1].trim();
  }

  return { nextTask, progress };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const configPath = path.join(repoRoot, 'data', 'projects.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ data/projects.json introuvable');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const owner = config.owner;
  const results = [];

  console.log(`\n🚀 Génération du dashboard pour @${owner}\n`);

  for (const proj of config.projects) {
    const { name, repo, category, description, roadmapPath } = proj;
    console.log(`📦 Traitement de ${name} (${owner}/${repo})...`);

    // ── Métadonnées du repo ──
    let repoData, lastCommitDate, openIssues;

    try {
      repoData = ghApi(`repos/${owner}/${repo}`);
    } catch (e) {
      if (e.is404) {
        console.warn(`  ⚠️  Repo introuvable (404) — skipped`);
        continue;
      }
      throw e;
    }

    // ── Dernier commit ──
    try {
      const commits = ghApi(`repos/${owner}/${repo}/commits?per_page=1`);
      lastCommitDate = commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date || null;
    } catch (e) {
      console.warn(`  ⚠️  Impossible de lire les commits : ${e.message}`);
      lastCommitDate = null;
    }

    // ── Issues ouvertes (pas les PRs) ──
    try {
      const issues = ghApi(`repos/${owner}/${repo}/issues?state=open&per_page=100`);
      openIssues = issues.filter(i => !i.pull_request).length;
    } catch (e) {
      console.warn(`  ⚠️  Impossible de lire les issues : ${e.message}`);
      openIssues = 0;
    }

    // ── Roadmap ──
    let nextTask = 'À définir';
    let progress = 0;

    if (roadmapPath) {
      try {
        const roadmapData = ghApi(`repos/${owner}/${repo}/contents/${roadmapPath}`);
        const rawMd = Buffer.from(roadmapData.content, 'base64').toString('utf8');
        const checkboxCount = (rawMd.match(/- \[[ x]\]/gi) || []).length;
        if (checkboxCount === 0) {
          console.warn(`  ⚠️  Roadmap trouvée mais sans cases à cocher (- [ ] / - [x])`);
          console.warn(`      Premières lignes : ${rawMd.split('\n').slice(0, 5).join(' | ')}`);
        }
        ({ nextTask, progress } = parseRoadmap(roadmapData.content));
        console.log(`  ✅ Roadmap lue — progress: ${progress}%, nextTask: "${nextTask}"`);
      } catch (e) {
        if (e.is404) {
          console.warn(`  ⚠️  Roadmap absente (${roadmapPath}) — nextTask par défaut`);
        } else {
          console.warn(`  ⚠️  Erreur roadmap : ${e.message}`);
        }
      }
    }

    const { status, statusLabel } = commitStatus(lastCommitDate);

    results.push({
      name,
      category,
      status,
      statusLabel,
      description,
      nextTask,
      progress,
      lastCommit: frenchDate(lastCommitDate),
      openIssues,
      githubUrl: `https://github.com/${owner}/${repo}`,
      roadmapUrl: roadmapPath
        ? `https://github.com/${owner}/${repo}/blob/main/${roadmapPath}`
        : null,
    });

    console.log(`  ✅ ${name} — ${statusLabel} — dernier commit: ${frenchDate(lastCommitDate)}\n`);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    projects: results,
  };

  const outPath = path.join(repoRoot, 'projects-data.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');

  console.log(`✅ projects-data.json écrit (${results.length} projet(s))`);
  console.log(`📍 ${outPath}\n`);
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
