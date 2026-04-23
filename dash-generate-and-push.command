#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  dash-generate-and-push.command                              ║
# ║  Double-clique pour générer projects-data.json + push GitHub ║
# ╚══════════════════════════════════════════════════════════════╝
set -e

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║            ⚡ Dash — Generate & Push                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── Trouver le repo Dash ──────────────────────────────────────────────────────
DASH_DIR=""
for dir in \
  "$HOME/Documents/Dash" \
  "$HOME/Projects/Dash" \
  "$HOME/Dash" \
  "$HOME/Desktop/Dash"
do
  if [ -d "$dir" ]; then
    DASH_DIR="$dir"
    break
  fi
done

if [ -z "$DASH_DIR" ]; then
  echo "❌ Repo Dash introuvable."
  echo "   Vérifie que le dossier Dash est bien dans ~/Documents/"
  read -r -p "Appuie sur Entrée pour fermer..."
  exit 1
fi

echo "📂 Repo Dash : $DASH_DIR"
cd "$DASH_DIR"

# ── Vérifier git ─────────────────────────────────────────────────────────────
if ! git rev-parse --git-dir &>/dev/null; then
  echo ""
  echo "⚙️  Initialisation du repo git..."
  git init
  git branch -M main
  echo ""
  echo "⚠️  Remote non configuré."
  echo "   Lance : git remote add origin https://github.com/teiki5320/Dash.git"
  echo "   Puis relance ce script."
  read -r -p "Appuie sur Entrée..."
  exit 1
fi

# ── Vérifier gh CLI ──────────────────────────────────────────────────────────
if ! command -v gh &>/dev/null; then
  echo ""
  echo "📦 gh CLI non trouvé. Installation via Homebrew..."
  if command -v brew &>/dev/null; then
    brew install gh
  else
    echo "❌ Homebrew non trouvé. Installe gh depuis : https://cli.github.com"
    read -r -p "Appuie sur Entrée..."
    exit 1
  fi
fi

# ── Vérifier authentification gh ─────────────────────────────────────────────
if ! gh auth status &>/dev/null; then
  echo ""
  echo "🔐 Non connecté à GitHub CLI."
  echo "   Lance dans un Terminal : gh auth login"
  read -r -p "Appuie sur Entrée après t'être connecté..."
fi

# ── Générer le JSON ───────────────────────────────────────────────────────────
echo ""
echo "⚙️  Génération de projects-data.json..."
echo ""
node scripts/generate-data.js

echo ""
echo "✅ projects-data.json généré :"
echo "─────────────────────────────"
cat projects-data.json
echo ""
echo "─────────────────────────────"

# ── Commit + Push ─────────────────────────────────────────────────────────────
echo ""
echo "📦 Commit + push vers GitHub..."
git add .
git status

if git diff --staged --quiet; then
  echo "ℹ️  Rien de nouveau à committer."
else
  git commit -m "⚙️ Dash dynamique : workflow + generator + Kultiva"
fi

# Push (avec -u si premier push)
if git push origin main 2>/dev/null || git push -u origin main; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════╗"
  echo "║  ✅ Tout est poussé sur GitHub !                         ║"
  echo "║                                                          ║"
  echo "║  Prochaines étapes MANUELLES :                          ║"
  echo "║                                                          ║"
  echo "║  1. Créer un Fine-grained token GitHub :                ║"
  echo "║     github.com/settings/tokens?type=beta                ║"
  echo "║     Nom: DASH_SCAN                                       ║"
  echo "║     Dépôts: kultiva (Contents + Issues: Read-only)       ║"
  echo "║                                                          ║"
  echo "║  2. Ajouter le secret DASH_TOKEN dans Dash :            ║"
  echo "║     github.com/teiki5320/Dash/settings/secrets/actions  ║"
  echo "║                                                          ║"
  echo "║  3. Activer GitHub Pages (branch: main, dossier: /) :   ║"
  echo "║     github.com/teiki5320/Dash/settings/pages            ║"
  echo "║                                                          ║"
  echo "║  4. Déclencher le workflow manuellement :               ║"
  echo "║     github.com/teiki5320/Dash/actions                   ║"
  echo "║                                                          ║"
  echo "║  5. Voir ton dashboard :                                 ║"
  echo "║     https://teiki5320.github.io/Dash/                   ║"
  echo "║                                                          ║"
  echo "║  ⚠️  N'oublie pas de merger la PR kultiva :              ║"
  echo "║     claude/init-project-docs-hzSyH → main               ║"
  echo "║     (pour que la roadmap soit lisible)                   ║"
  echo "╚══════════════════════════════════════════════════════════╝"
else
  echo ""
  echo "❌ Push échoué."
  echo "   Vérifie : git remote -v"
  echo "   Et que tu as bien accès au repo teiki5320/Dash."
fi

echo ""
read -r -p "Appuie sur Entrée pour fermer..."
