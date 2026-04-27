#!/bin/bash
# =============================================================================
# auto-improve.sh — 自動改善ループのエントリーポイント
# =============================================================================
#
# 使い方:
#   ./scripts/auto-improve.sh
#
# 処理:
#   1. タイムスタンプ付きログディレクトリを作成
#   2. main から新しいブランチを作成
#   3. Copilot CLI で実行するオーケストレーターのプロンプトを出力
#
# =============================================================================

set -euo pipefail

# --- 設定 ---
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
LOG_DIR="${PROJECT_ROOT}/logs/auto-improve/${TIMESTAMP}"
BRANCH_NAME="improve/${TIMESTAMP}"

# --- 色付き出力 ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}ℹ${NC}  $1"; }
ok()    { echo -e "${GREEN}✅${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠️${NC}  $1"; }
error() { echo -e "${RED}❌${NC} $1"; }

# --- メイン処理 ---
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🚀 自動改善ループ — Universe Kids Race            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "${PROJECT_ROOT}"

# 1. 前提条件チェック
info "前提条件を確認中..."

if ! command -v gh &> /dev/null; then
  error "gh CLI がインストールされていません"
  exit 1
fi

if ! gh auth status &> /dev/null; then
  error "gh CLI が認証されていません (gh auth login を実行してください)"
  exit 1
fi

if ! git diff --quiet 2>/dev/null; then
  error "未コミットの変更があります。先にコミットまたはスタッシュしてください"
  exit 1
fi

ok "前提条件 OK"

# 2. main ブランチに切り替え
info "main ブランチに切り替え中..."
git checkout main --quiet
git pull --quiet origin main 2>/dev/null || true
ok "main ブランチ最新"

# 3. ログディレクトリ作成
info "ログディレクトリを作成中..."
mkdir -p "${LOG_DIR}"
ok "ログディレクトリ: ${LOG_DIR}"

# 4. 新しいブランチ作成
info "新しいブランチを作成中..."
git checkout -b "${BRANCH_NAME}" --quiet
ok "ブランチ: ${BRANCH_NAME}"

# 5. 現在の状態を記録
info "プロジェクト状態を記録中..."
cat > "${LOG_DIR}/00-environment.md" << EOF
# 環境情報

- **タイムスタンプ**: ${TIMESTAMP}
- **ブランチ**: ${BRANCH_NAME}
- **ベースコミット**: $(git rev-parse HEAD)
- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **プロジェクト**: $(pwd)
EOF
ok "環境情報を記録"

# 6. オーケストレータープロンプト生成
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📋 準備完了                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
info "以下のプロンプトを Copilot CLI に入力してください:"
echo ""
echo "─────────────────────────────────────────────────────────────"
cat << 'PROMPT'

@orchestrator 自動改善を実行してください。

環境情報:
PROMPT

cat << EOF
- ログディレクトリ: ${LOG_DIR}
- ブランチ: ${BRANCH_NAME}
- プロジェクトルート: ${PROJECT_ROOT}
EOF

echo ""
echo "─────────────────────────────────────────────────────────────"
echo ""
info "オーケストレーターが完了したら、結果は ${LOG_DIR}/ に記録されます"
info "PR が作成された場合、人間のレビューとマージ承認をお願いします"
echo ""
