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

  // ── Priorité 1 : format checkbox standard [ ] / [x] ──────────────
  const doneCheck = (md.match(/- \[x\]/gi) || []).length;
  const todoCheck = (md.match(/- \[ \]/g)  || []).length;
  const totalCheck = doneCheck + todoCheck;

  if (totalCheck > 0) {
    const progress = Math.round((doneCheck / totalCheck) * 100);
    let nextTask = 'À définir';
    const taskSections = ['🔥 En cours', '📋 À faire', '🚧 En cours', '## En cours', '## À faire'];
    for (const sec of taskSections) {
      const idx = md.indexOf(sec);
      if (idx === -1) continue;
      const match = md.slice(idx).match(/- \[ \] (.+)/);
      if (match) { nextTask = match[1].trim(); break; }
    }
    if (nextTask === 'À définir') {
      const m = md.match(/- \[ \] (.+)/);
      if (m) nextTask = m[1].trim();
    }
    return { nextTask, progress };
  }

  // ── Priorité 2 : format jalons avec sections ✅ / 🔥 / 📋 ────────
  // Compte les sections "done" (✅) et "todo" (🔥 En cours + 📋 À faire)
  const doneSections  = (md.match(/###\s*✅/g)  || []).length;
  const activeSections = (md.match(/###\s*🔥/g) || []).length;
  const todoSections  = (md.match(/###\s*📋/g)  || []).length;
  const totalSections = doneSections + activeSections + todoSections;
  const progress = totalSections > 0
    ? Math.round((doneSections / totalSections) * 100)
    : 0;

  // Extraire la première tâche depuis la section 🔥 En cours puis 📋 À faire
  let nextTask = 'À définir';
  const bulletSections = ['🔥 En cours', '🚧 En cours', '📋 À faire', '📌 À faire'];
  for (const sec of bulletSections) {
    const idx = md.indexOf(sec);
    if (idx === -1) continue;
    // Chercher prochaine section header (##) pour délimiter
    const slice = md.slice(idx);
    const nextHeaderIdx = slice.search(/\n##/);
    const sectionContent = nextHeaderIdx > 0 ? slice.slice(0, nextHeaderIdx) : slice;
    // Première ligne de type "- xxx" ou "- **xxx**"
    const bulletMatch = sectionContent.match(/^- (.+)/m);
    if (bulletMatch) {
      // Nettoyer le markdown (retirer **bold**, liens, etc.)
      nextTask = bulletMatch[1]
        .replace(/\*\*([^*]+)\*\*/g, '$1')       // **bold** → bold
        .replace(/`([^`]+)`/g, '$1')              // `code` → code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url) → link
        .split(' — ')[0]                          // garder avant le " — "
        .split(':')[0]                            // ou avant le ":"
        .trim();
      break;
    }
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
          const lines = rawMd.split('\n').slice(0, 40);
          console.warn(`      Structure (${lines.length} premières lignes) :`);
          lines.forEach((l, i) => console.warn(`      ${String(i+1).padStart(2)}: ${l}`));
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
