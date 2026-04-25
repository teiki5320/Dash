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

// ─── Parsing roadmap & reformulation FR ─────────────────────────────────────

const COMMIT_PREFIX_RE = /^(feat|fix|chore|docs|refactor|test|build|ci|perf|style|wip|hotfix|revert|merge)(\([^)]+\))?[:!]?\s+/i;

const EMPTY_ROADMAP = {
  nextTask: 'À définir',
  nextTasks: [],
  progress: 0,
  whatsDone: [],
  whatsLeft: [],
  ideas: [],
  nextStepFr: '',
};

function slugify(name) {
  return String(name).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function reformulateFr(line) {
  if (!line) return '';
  let s = String(line).trim();
  s = s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|\s)\*([^*]+)\*(\s|$)/g, '$1$2$3')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\[[ xX]\]\s*/, '')
    .trim();
  while (COMMIT_PREFIX_RE.test(s)) s = s.replace(COMMIT_PREFIX_RE, '').trim();
  if (s.length > 0) s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function extractSection(md, headers) {
  for (const h of headers) {
    const escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('^#{1,6}\\s*' + escaped + '.*$', 'mi');
    const match = md.match(re);
    if (!match) continue;
    const start = match.index + match[0].length;
    const rest = md.slice(start);
    const stop = rest.search(/\n#{1,6}\s/);
    return stop > 0 ? rest.slice(0, stop) : rest;
  }
  return null;
}

function extractBullets(section, max) {
  if (!section) return [];
  const out = [];
  const re = /^[\t ]*[-*+]\s+(?:\[[ xX]\]\s+)?(.+?)\s*$/mg;
  let m;
  while ((m = re.exec(section)) !== null) {
    const t = reformulateFr(m[1]);
    if (t && t.length > 2) out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function parseRoadmap(base64Content) {
  let md;
  try { md = Buffer.from(base64Content, 'base64').toString('utf8'); }
  catch { return { ...EMPTY_ROADMAP }; }
  return parseRoadmapMd(md);
}

function parseRoadmapFile(filePath) {
  try {
    const md = fs.readFileSync(filePath, 'utf8');
    return parseRoadmapMd(md);
  } catch { return { ...EMPTY_ROADMAP }; }
}

function parseRoadmapMd(md) {
  // ── Progression ──
  const doneCheck = (md.match(/- \[x\]/gi) || []).length;
  const todoCheck = (md.match(/- \[ \]/g)  || []).length;
  const totalCheck = doneCheck + todoCheck;

  let progress;
  if (totalCheck > 0) {
    progress = Math.round((doneCheck / totalCheck) * 100);
  } else {
    const done   = (md.match(/###\s*✅/g) || []).length;
    const active = (md.match(/###\s*🔥/g) || []).length;
    const todo   = (md.match(/###\s*📋/g) || []).length;
    const total  = done + active + todo;
    progress = total > 0 ? Math.round((done / total) * 100) : 0;
  }

  // ── Sections ──
  const doneSection   = extractSection(md, ['✅ Fait', '✅ Terminé', '✅ Done', '✅', 'Fait', 'Terminé', 'Done']);
  const inProgressSec = extractSection(md, ['🔥 En cours', '🚧 En cours', '🔥', 'En cours']);
  const todoSection   = extractSection(md, ['📋 À faire', '📋', 'À faire', 'À venir', 'TODO']);
  const ideasSection  = extractSection(md, ['💡 Idées', '💡 Idees', '💡', 'Idées', 'Ideas', 'Pour aller plus loin']);

  const whatsDone = extractBullets(doneSection, 5);
  const inProgressBullets = extractBullets(inProgressSec, 5);
  const todoBullets = extractBullets(todoSection, 5);
  let whatsLeft = [...inProgressBullets, ...todoBullets].slice(0, 5);

  if (whatsLeft.length === 0) {
    whatsLeft = [...md.matchAll(/^[\t ]*-\s+\[ \]\s+(.+?)\s*$/mg)]
      .slice(0, 5)
      .map(m => reformulateFr(m[1]))
      .filter(Boolean);
  }

  const ideas = extractBullets(ideasSection, 3);

  // ── Legacy fields ──
  const nextTasks = whatsLeft.slice(0, 3);
  const nextTask = nextTasks[0] || 'À définir';

  // ── Phrase d'action prioritaire ──
  let nextStepFr = '';
  if (whatsLeft[0]) {
    nextStepFr = whatsLeft[0];
    if (!/[.!?…]$/.test(nextStepFr)) nextStepFr += '.';
  }

  return { nextTask, nextTasks, progress, whatsDone, whatsLeft, ideas, nextStepFr };
}

// ─── Analyse locale ────────────────────────────────────────────────────────────

function pickSummaryFromMd(md) {
  const lines = md.split('\n');
  let para = '';
  let inFence = false;
  for (const raw of lines) {
    const l = raw.trim();
    if (l.startsWith('```')) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (!l) { if (para) break; else continue; }
    if (l.startsWith('#') || l.startsWith('<!--') || l.startsWith('>') || l.startsWith('|') || l.startsWith('---')) {
      if (para) break; else continue;
    }
    if (/^[-*+]\s/.test(l) || /^\d+\.\s/.test(l)) {
      if (para) break; else continue;
    }
    const clean = l
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    para += (para ? ' ' : '') + clean;
    if (para.length > 320) break;
  }
  if (para.length < 30) return '';
  const sentences = para.match(/[^.!?…]+[.!?…]+/g);
  if (sentences && sentences.length) return sentences.slice(0, 3).join(' ').trim();
  return para.slice(0, 280);
}

function extractSummary(repoPath, fallback) {
  const candidates = [
    path.join(repoPath, 'CLAUDE.md'),
    path.join(repoPath, 'README.md'),
    path.join(repoPath, 'README.fr.md'),
  ];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    try {
      const md = fs.readFileSync(candidate, 'utf8');
      const s = pickSummaryFromMd(md);
      if (s) return s;
    } catch {}
  }
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

  // Charger les données existantes pour préserver energy/lastSession si pas de repo local
  const existingDataPath = path.join(REPO_ROOT, 'projects-data.json');
  const existingProjects = {};
  if (fs.existsSync(existingDataPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
      (existing.projects || []).forEach(p => { existingProjects[p.name] = p; });
    } catch {}
  }

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
    let roadmap = { ...EMPTY_ROADMAP };
    let roadmapFound = false;

    if (hasLocal && localPath && roadmapPath) {
      const localRoadmap = path.join(localPath, roadmapPath);
      if (fs.existsSync(localRoadmap)) {
        roadmap = parseRoadmapFile(localRoadmap);
        roadmapFound = true;
        console.log(`  📍 Roadmap lue (local) — ${roadmap.progress}%, ${roadmap.whatsLeft.length} à faire`);
      }
    }

    if (!roadmapFound && roadmapPath) {
      try {
        const rd = ghApi(`repos/${owner}/${repo}/contents/${roadmapPath}`);
        roadmap = parseRoadmap(rd.content);
        roadmapFound = true;
        console.log(`  🌐 Roadmap lue (GitHub) — ${roadmap.progress}%, ${roadmap.whatsLeft.length} à faire`);
      } catch (e) {
        if (e.is404) console.warn(`  ⚠️  Roadmap absente`);
        else console.warn(`  ⚠️  Roadmap erreur : ${e.message}`);
      }
    }

    const { nextTask, nextTasks, progress, whatsDone, whatsLeft, ideas, nextStepFr } = roadmap;

    // ── Données locales enrichies ──
    const prev = existingProjects[name] || {};
    let summary     = description || repoData.description || '';
    let lastSession = prev.lastSession || [];   // préserve si pas de repo local
    let energy      = prev.energy      || 'low'; // idem
    let relaunchCommand = prev.relaunchCommand || `cd ~/Documents/${repo}`;

    if (hasLocal && localPath) {
      summary         = extractSummary(localPath, summary);
      lastSession     = getLastSession(localPath);
      energy          = calculateEnergy(localPath);
      relaunchCommand = detectRelaunchCommand(localPath, path.basename(localPath));
      console.log(`  🔋 Énergie: ${energy} | Session: ${lastSession.length} commits récents`);
    } else {
      // Fallback GitHub API pour les commits quand le repo n'est pas cloné
      if (lastSession.length === 0) {
        try {
          const commits = ghApi(`repos/${owner}/${repo}/commits?per_page=8`);
          lastSession = commits
            .map(c => c.commit?.message?.split('\n')[0]?.trim())
            .filter(m => m && !m.match(/^(🤖|Auto-update|Merge branch)/i))
            .slice(0, 5);
          console.log(`  🌐 Session via GitHub : ${lastSession.length} commits`);
        } catch (e) {
          console.warn(`  ⚠️  Commits GitHub inaccessibles : ${e.message}`);
        }
      }
      const preserved = lastSession.length > 0 ? `${lastSession.length} commits` : 'aucune session';
      console.log(`  ℹ️  Pas de repo local — énergie: ${energy}, session: ${preserved}`);
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

    // ── Priorité : override projects.json sinon dérivée de l'énergie ──
    const allowedPriorities = new Set(['high', 'medium', 'low']);
    const priority = allowedPriorities.has(proj.priority)
      ? proj.priority
      : (energy === 'high' ? 'high' : energy === 'medium' ? 'medium' : 'low');

    // ── Préservation des champs FR si la roadmap n'a pas été trouvée ──
    const finalWhatsDone   = whatsDone.length   ? whatsDone   : (prev.whatsDone   || []);
    const finalWhatsLeft   = whatsLeft.length   ? whatsLeft   : (prev.whatsLeft   || []);
    const finalIdeas       = ideas.length       ? ideas       : (prev.ideas       || []);
    const finalNextStepFr  = nextStepFr         || prev.nextStepFr || '';

    results.push({
      id: slugify(name),
      name, category, status, statusLabel,
      priority,
      description: description || repoData.description || '',
      summary,
      whatsDone: finalWhatsDone,
      whatsLeft: finalWhatsLeft,
      ideas: finalIdeas,
      nextStepFr: finalNextStepFr,
      lastSession,
      nextTask, nextTasks, progress,
      blockers,
      relaunchCommand,
      energy,
      language: repoData.language || null,
      lastCommit: frenchDate(lastCommitDate),
      lastCommitDate: lastCommitDate || null,
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
