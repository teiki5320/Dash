#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  update-dashboard.sh
#  Analyse les repos locaux + push Dash sur GitHub
#  Lancé par launchd toutes les 6h (ou manuellement)
# ─────────────────────────────────────────────────────────────

# PATH explicite pour launchd (qui n'hérite pas du PATH utilisateur)
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="/Users/jeanperraudeau"

DASH_DIR="$HOME/Documents/Dash"
LOG_DIR="$HOME/.config/dash/logs"
LOG="$LOG_DIR/main.log"

mkdir -p "$LOG_DIR"

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG"; }

log "━━━ Démarrage mise à jour Dash ━━━"

# ── Aller dans Dash ──────────────────────────────────────────
cd "$DASH_DIR" || { log "❌ Dash introuvable : $DASH_DIR"; exit 1; }

# ── Récupérer les dernières modifs de Dash ───────────────────
log "📥 git pull Dash..."
git pull --quiet --rebase origin main 2>> "$LOG" || log "⚠️  git pull échoué (continue quand même)"

# ── Lancer l'analyse ─────────────────────────────────────────
log "⚙️  Lancement de generate-data.js..."
node "$DASH_DIR/scripts/generate-data.js" 2>&1 | tee -a "$LOG"
EXITCODE=${PIPESTATUS[0]}

if [ $EXITCODE -ne 0 ]; then
  log "❌ generate-data.js a échoué (code $EXITCODE)"
  exit $EXITCODE
fi

log "✅ Analyse terminée"

# ── Commit + push si changements ─────────────────────────────
if git diff --quiet projects-data.json; then
  log "ℹ️  Pas de changements dans projects-data.json"
else
  log "📦 Commit + push..."
  git add projects-data.json
  git commit -m "🤖 Auto-update: $(date -u '+%Y-%m-%d_%H:%M')" 2>> "$LOG"
  git pull --rebase --quiet 2>> "$LOG" || true
  git push 2>> "$LOG" && log "✅ Pushé sur GitHub" || log "❌ Push échoué"
fi

log "━━━ Fin mise à jour Dash ━━━"
