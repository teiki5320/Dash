#!/usr/bin/env node
// generate-data.js — Dashboard enrichi : local git + CLAUDE.md + gh api
// Zero dépendances npm externes

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HOME      = '/Users/jeanperraudeau';
const DOCS_DIR  = path.join(HOME, 'Documents');
const REPO_ROOT = path.resolve(__dirname, '..');

// Cherche le chemin local d'un repo dans plusieurs emplacements courants
function findLocalRepo(repoName) {
  const candidates = [
    path.join(DOCS_DIR, repoName),
    path.join(DOCS_DIR, repoName.charAt(0).toUpperCase() + repoName.slice(1)),
    path.join(HOME, repoName),
    path.join(HOME, repoName.charAt(0).toUpperCase() + repoName.slice(1)),
    path.join(HOME, 'Projects', repoName),
    path.join(HOME, 'Developer', repoName),
  ];
  for (const p of candidates) {
    if (fs.existsSync(path.join(p, '.git'))) return p;
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ghApi(endpoint) {
  try {
    const out = execSync(`gh api "${endpoint}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });
    return JSON.parse(out);
  } catch (e) {
    const msg = (e.stderr || e.message || '');
    if (msg.includes('404') || (e.stdout && e.stdout.includes('"Not Found"'))) {
      throw Object.assign(new Error('404'), { is404: true });
    }
    throw e;
  }
}

function gitLocal(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch { return ''; }
}

function frenchDate(isoStr) {
  if (!isoStr) return 'Inconnue';
  const now = new Date();
  const date = new Date(isoStr);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  const w = Math.floor(diffDays / 7);
  if (w < 5) return `Il y a ${w} semaine${w > 1 ? 's' : ''}`;
  const m = Math.floor(diffDays / 30);
  return `Il y a ${m} mois`;
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
  try { md = Buffer.from(base64Content, 'base64').toString('utf8'); }
  catch { return { nextTask: 'À définir', nextTasks: [], progress: 0 }; }
  return parseRoadmapMd(md);
}

function parseRoadmapFile(filePath) {
  try {
    const md = fs.readFileSync(filePath, 'utf8');
    return parseRoadmapMd(md);
  } catch { return { nextTask: 'À définir', nextTasks: [], progress: 0 }; }
}

function parseRoadmapMd(md) {
  function cleanMd(str) {
    return str
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .split(' — ')[0].split(':')[0].trim();
  }

  const doneCheck = (md.match(/- \[x\]/gi) || []).length;
  const todoCheck = (md.match(/- \[ \]/g)  || []).length;
  const totalCheck = doneCheck + todoCheck;

  if (totalCheck > 0) {
    const progress = Math.round((doneCheck / totalCheck) * 100);
    const tasks = [];
    const secs = ['🔥 En cours', '🚧 En cours', '📋 À faire', '## En cours', '## À faire'];
    for (const sec of secs) {
      const idx = md.indexOf(sec);
      if (idx === -1) continue;
      const slice = md.slice(idx);
      const matches = [...slice.matchAll(/- \[ \] (.+)/g)];
      matches.slice(0, 3 - tasks.length).forEach(m => tasks.push(cleanMd(m[1])));
      if (tasks.length >= 3) break;
    }
    if (!tasks.length) [...md.matchAll(/- \[ \] (.+)/g)].slice(0, 3).forEach(m => tasks.push(cleanMd(m[1])));
    return { nextTask: tasks[0] || 'À définir', nextTasks: tasks, progress };
  }

  const done   = (md.match(/###\s*✅/g) || []).length;
  const active = (md.match(/###\s*🔥/g) || []).length;
  const todo   = (md.match(/###\s*📋/g) || []).length;
  const total  = done + active + todo;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const tasks = [];
  for (const sec of ['🔥 En cours', '🚧 En cours', '📋 À faire']) {
    const idx = md.indexOf(sec);
    if (idx === -1) continue;
    const slice = md.slice(idx);
    const nextH = slice.search(/\n##/);
    const content = nextH > 0 ? slice.slice(0, nextH) : slice;
    const matches = [...content.matchAll(/^- (.+)/mg)];
    matches.slice(0, 3 - tasks.length).forEach(m => tasks.push(cleanMd(m[1])));
    if (tasks.length >= 3) break;
  }
  return { nextTask: tasks[0] || 'À définir', nextTasks: tasks, progress };
}

// ─── Analyse locale ────────────────────────────────────────────────────────────

function extractSummary(repoPath, fallback) {
  const claudePath = path.join(repoPath, 'CLAUDE.md');
  if (!fs.existsSync(claudePath)) return fallback;
  try {
    const content = fs.readFileSync(claudePath, 'utf8');
    // Cherche la première ligne de description (pas un heading, pas vide)
    const lines = content.split('\n');
    for (const line of lines) {
      const l = line.trim();
      if (!l || l.startsWith('#') || l.startsWith('<!--') || l.startsWith('>')) continue;
      // Retirer le markdown bold/italic
      const clean = l.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
      if (clean.length > 30) return clean.slice(0, 200);
    }
  } catch {}
  return fallback;
}

function getLastSession(repoPath) {
  const log = gitLocal('git log --oneline --no-merges -10', repoPath);
  if (!log) return [];
  return log.split('\n')
    .map(l => l.replace(/^[a-f0-9]+ /, '').trim())
    .filter(l => l && !l.match(/^(🤖|Auto-update|Merge branch)/i))
    .slice(0, 5);
}

function calculateEnergy(repoPath) {
  const recent7  = gitLocal('git log --oneline --after="7 days ago" --no-merges', repoPath).split('\n').filter(Boolean).length;
  const recent30 = gitLocal('git log --oneline --after="30 days ago" --no-merges', repoPath).split('\n').filter(Boolean).length;
  if (recent7 >= 3)  return 'high';
  if (recent7 >= 1)  return 'medium';
  if (recent30 >= 1) return 'medium';
  return 'low';
}

function detectRelaunchCommand(repoPath, repoName) {
  if (fs.existsSync(path.join(repoPath, 'pubspec.yaml')))
    return `cd ~/Documents/${repoName} && flutter run --release`;
  if (fs.existsSync(path.join(repoPath, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(repoPath, 'package.json'), 'utf8'));
      if (pkg.scripts?.dev)   return `cd ~/Documents/${repoName} && npm run dev`;
      if (pkg.scripts?.start) return `cd ~/Documents/${repoName} && npm start`;
    } catch {}
    return `cd ~/Documents/${repoName} && npm install`;
  }
  if (fs.existsSync(path.join(repoPath, 'requirements.txt')))
    return `cd ~/Documents/${repoName} && python3 -m venv .venv && source .venv/bin/activate && python3 main.py`;
  if (fs.existsSync(path.join(repoPath, 'Makefile')))
    return `cd ~/Documents/${repoName} && make`;
  return `cd ~/Documents/${repoName}`;
}

function getLocalLastCommitDate(repoPath) {
  const iso = gitLocal('git log -1 --format=%cI', repoPath);
  return iso || null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const configPath = path.join(REPO_ROOT, 'data', 'projects.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const { owner, projects } = config;

  console.log(`\n🚀 Génération du dashboard pour @${owner}\n`);

  const results = [];

  for (const proj of projects) {
    const { name, repo, category, description, roadmapPath } = proj;
    console.log(`━━━ 📦 ${name} (${repo}) ━━━`);

    const localPath = findLocalRepo(repo);
    const hasLocal  = !!localPath;

    // ── Métadonnées repo via gh ──
    let repoData, lastCommitDate, openIssues;
    try {
      repoData = ghApi(`repos/${owner}/${repo}`);
    } catch (e) {
      if (e.is404) { console.warn(`  ⚠️  Repo ${repo} introuvable (404) — ignoré`); continue; }
      throw e;
    }

    // ── Dernier commit ──
    if (hasLocal && localPath) {
      lastCommitDate = getLocalLastCommitDate(localPath);
      if (!lastCommitDate) {
        // fallback gh api
        try {
          const commits = ghApi(`repos/${owner}/${repo}/commits?per_page=1`);
          lastCommitDate = commits[0]?.commit?.committer?.date || null;
        } catch {}
      }
    } else {
      try {
        const commits = ghApi(`repos/${owner}/${repo}/commits?per_page=1`);
        lastCommitDate = commits[0]?.commit?.committer?.date || null;
      } catch {}
    }

    // ── Issues ──
    try {
      const issues = ghApi(`repos/${owner}/${repo}/issues?state=open&per_page=100`);
      openIssues = issues.filter(i => !i.pull_request).length;
    } catch { openIssues = 0; }

    // ── Roadmap ──
    let nextTask = 'À définir', nextTasks = [], progress = 0;
    let roadmapFound = false;

    if (hasLocal && localPath && roadmapPath) {
      const localRoadmap = path.join(localPath, roadmapPath);
      if (fs.existsSync(localRoadmap)) {
        ({ nextTask, nextTasks, progress } = parseRoadmapFile(localRoadmap));
        roadmapFound = true;
        console.log(`  📍 Roadmap lue (local) — ${progress}%, ${nextTasks.length} tâches`);
      }
    }

    if (!roadmapFound && roadmapPath) {
      try {
        const rd = ghApi(`repos/${owner}/${repo}/contents/${roadmapPath}`);
        ({ nextTask, nextTasks, progress } = parseRoadmap(rd.content));
        roadmapFound = true;
        console.log(`  🌐 Roadmap lue (GitHub) — ${progress}%, ${nextTasks.length} tâches`);
      } catch (e) {
        if (e.is404) console.warn(`  ⚠️  Roadmap absente`);
        else console.warn(`  ⚠️  Roadmap erreur : ${e.message}`);
      }
    }

    // ── Données locales enrichies ──
    let summary     = description || repoData.description || '';
    let lastSession = [];
    let energy      = 'low';
    let relaunchCommand = `cd ~/Documents/${repo}`;

    if (hasLocal && localPath) {
      summary         = extractSummary(localPath, summary);
      lastSession     = getLastSession(localPath);
      energy          = calculateEnergy(localPath);
      relaunchCommand = detectRelaunchCommand(localPath, path.basename(localPath));
      console.log(`  🔋 Énergie: ${energy} | Session: ${lastSession.length} commits récents`);
    } else {
      console.log(`  ℹ️  Repo non cloné localement — données GitHub uniquement`);
    }

    // ── Bloqueurs depuis issues ──
    let blockers = null;
    if (openIssues > 0) {
      try {
        const issues = ghApi(`repos/${owner}/${repo}/issues?state=open&labels=blocker&per_page=5`);
        const blockerIssues = issues.filter(i => !i.pull_request);
        if (blockerIssues.length > 0) {
          blockers = blockerIssues[0].title;
        }
      } catch {}
    }

    const { status, statusLabel } = commitStatus(lastCommitDate);
    const defaultBranch = repoData.default_branch || 'main';

    results.push({
      name, category, status, statusLabel,
      description: description || repoData.description || '',
      summary,
      lastSession,
      nextTask, nextTasks, progress,
      blockers,
      relaunchCommand,
      energy,
      lastCommit: frenchDate(lastCommitDate),
      openIssues,
      githubUrl: `https://github.com/${owner}/${repo}`,
      roadmapUrl: roadmapFound
        ? `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${roadmapPath}`
        : null,
    });

    console.log(`  ✅ ${name} — ${statusLabel} — ${frenchDate(lastCommitDate)}\n`);
  }

  const output = { generatedAt: new Date().toISOString(), projects: results };
  const outPath = path.join(REPO_ROOT, 'projects-data.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n');

  console.log(`✅ projects-data.json : ${results.length} projet(s)`);
  console.log(`📍 ${outPath}\n`);
}

main().catch(err => {
  console.error('❌ Erreur fatale :', err.message);
  process.exit(1);
});
