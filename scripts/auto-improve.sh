#!/bin/bash
# =============================================================================
# auto-improve.sh — 自動改善ループ（無限ループ）
# =============================================================================
#
# 使い方:
#   ./scripts/auto-improve.sh
#
# Ctrl+C で停止すると、実行中のブランチを削除してロールバックします。
#
# 各イテレーションは独立したブランチで実行され、
# 成功すれば PR が自動作成されます。
# 1回のイテレーションが失敗しても次に進みます。
#
# =============================================================================

set -uo pipefail

# --- 設定 ---
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
COPILOT_TIMEOUT_SEC=1800  # copilot CLI の最大実行時間（秒）= 30分
COPILOT_PID=""
CURRENT_BRANCH=""          # 実行中のブランチ名（ロールバック用）
CURRENT_LOG_DIR=""         # 実行中のログディレクトリ（クリーンアップ用）
ITERATION_NUM=0
SUCCESS_COUNT=0
FAIL_COUNT=0

# --- 色付き出力 ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${BLUE}ℹ${NC}  $1"; }
ok()    { echo -e "${GREEN}✅${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠️${NC}  $1"; }
error() { echo -e "${RED}❌${NC} $1"; }

# --- クリーンアップ & ロールバック ---
cleanup() {
  local sig="${1:-UNKNOWN}"
  echo ""
  warn "シグナル ${sig} を受信。クリーンアップ中..."

  # copilot プロセスが残っていれば終了
  if [[ -n "${COPILOT_PID}" ]] && kill -0 "${COPILOT_PID}" 2>/dev/null; then
    kill "${COPILOT_PID}" 2>/dev/null || true
    wait "${COPILOT_PID}" 2>/dev/null || true
    warn "copilot プロセス (PID: ${COPILOT_PID}) を終了しました"
  fi

  # 実行中のブランチがあればロールバック
  if [[ -n "${CURRENT_BRANCH}" ]]; then
    warn "ブランチ '${CURRENT_BRANCH}' をロールバック中..."

    # 未コミットの変更を破棄
    git checkout -- . 2>/dev/null || true
    git clean -fd 2>/dev/null || true

    # main に戻る
    git checkout main --quiet 2>/dev/null || true

    # ローカルブランチを削除
    if git branch --list "${CURRENT_BRANCH}" | grep -q .; then
      git branch -D "${CURRENT_BRANCH}" --quiet 2>/dev/null || true
      ok "ローカルブランチ '${CURRENT_BRANCH}' を削除しました"
    fi

    # リモートブランチが存在すれば削除
    if git ls-remote --heads origin "${CURRENT_BRANCH}" 2>/dev/null | grep -q .; then
      git push origin --delete "${CURRENT_BRANCH}" --quiet 2>/dev/null || true
      ok "リモートブランチ '${CURRENT_BRANCH}' を削除しました"
    fi

    # 中断されたイテレーションのログディレクトリを削除
    if [[ -n "${CURRENT_LOG_DIR}" ]] && [[ -d "${CURRENT_LOG_DIR}" ]]; then
      rm -rf "${CURRENT_LOG_DIR}"
      ok "中断ログ '${CURRENT_LOG_DIR}' を削除しました"
    fi
  else
    # ブランチ作成前に中断された場合は main に戻るだけ
    git checkout main --quiet 2>/dev/null || true
  fi

  # サマリー出力
  local completed=$((ITERATION_NUM - 1))
  if [[ ${completed} -gt 0 ]]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    📊 中断サマリー                          ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    info "完了済み: ${completed} 回 / 成功: ${SUCCESS_COUNT} / 失敗: ${FAIL_COUNT}"
    echo ""
  fi

  error "中断されました"
  exit 130
}

trap 'cleanup INT' INT
trap 'cleanup TERM' TERM

# --- 前提条件チェック ---
check_prerequisites() {
  info "前提条件を確認中..."

  if ! command -v copilot &> /dev/null; then
    error "copilot CLI がインストールされていません"
    exit 1
  fi

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
}

# --- 1回のイテレーション ---
run_iteration() {
  local iteration_num="$1"
  local timestamp
  timestamp="$(date +%Y%m%d_%H%M%S)"
  local log_dir="${PROJECT_ROOT}/logs/auto-improve/${timestamp}"
  local branch_name="improve/${timestamp}"

  # ブランチ追跡を開始
  CURRENT_LOG_DIR="${log_dir}"

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║  🔄 イテレーション #${iteration_num}                                       ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""

  # main ブランチに切り替え
  info "main ブランチに切り替え中..."
  git checkout main --quiet
  git pull --quiet origin main 2>/dev/null || true
  ok "main ブランチ最新"

  # ログディレクトリ作成
  mkdir -p "${log_dir}"
  ok "ログディレクトリ: ${log_dir}"

  # 新しいブランチ作成
  git checkout -b "${branch_name}" --quiet
  CURRENT_BRANCH="${branch_name}"
  ok "ブランチ: ${branch_name}"

  # 環境情報を記録
  cat > "${log_dir}/00-environment.md" << EOF
# 環境情報

- **イテレーション**: #${iteration_num}
- **タイムスタンプ**: ${timestamp}
- **ブランチ**: ${branch_name}
- **ベースコミット**: $(git rev-parse HEAD)
- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **プロジェクト**: $(pwd)
EOF

  # オーケストレーター自動実行
  info "オーケストレーターを起動中..."

  local prompt
  prompt="@orchestrator 自動改善を実行してください。

環境情報:
- ログディレクトリ: ${log_dir}
- ブランチ: ${branch_name}
- プロジェクトルート: ${PROJECT_ROOT}"

  local exit_code=0
  # タイムアウト付きで copilot を実行（ハング防止）
  copilot -p "${prompt}" --agent orchestrator --yolo 2>&1 | tee "${log_dir}/copilot-output.log" &
  COPILOT_PID=$!

  # watchdog: バックグラウンドでタイムアウト監視
  (
    sleep "${COPILOT_TIMEOUT_SEC}"
    if kill -0 "${COPILOT_PID}" 2>/dev/null; then
      kill "${COPILOT_PID}" 2>/dev/null || true
    fi
  ) &
  local watchdog_pid=$!

  wait "${COPILOT_PID}" || exit_code=$?
  COPILOT_PID=""

  # watchdog を停止
  kill "${watchdog_pid}" 2>/dev/null || true
  wait "${watchdog_pid}" 2>/dev/null || true

  # SIGTERM による終了は 143 (128 + 15)
  if [ "${exit_code}" -eq 143 ]; then
    exit_code=124
    error "copilot CLI がタイムアウトしました（${COPILOT_TIMEOUT_SEC}秒）"
  fi

  # コンソール出力を MD に変換
  cat > "${log_dir}/05-copilot-console.md" << MDEOF
# Copilot CLI コンソール出力

## 実行情報
- **タイムスタンプ**: ${timestamp}
- **ブランチ**: ${branch_name}
- **イテレーション**: #${iteration_num}
- **終了コード**: ${exit_code}

## コンソール出力

\`\`\`
$(cat "${log_dir}/copilot-output.log")
\`\`\`
MDEOF
  rm -f "${log_dir}/copilot-output.log"

  if [ "${exit_code}" -eq 0 ]; then
    ok "イテレーション #${iteration_num} 完了"
    CURRENT_BRANCH=""
    CURRENT_LOG_DIR=""
    return 0
  else
    error "イテレーション #${iteration_num} 失敗（終了コード: ${exit_code}）"
    CURRENT_BRANCH=""
    CURRENT_LOG_DIR=""
    return 1
  fi
}

# --- メイン処理 ---
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🚀 自動改善ループ — Universe Kids Race            ║"
echo "║           モード: 無限ループ (Ctrl+C で停止)                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "${PROJECT_ROOT}"
check_prerequisites

# 無限ループ
while true; do
  ITERATION_NUM=$((ITERATION_NUM + 1))

  if run_iteration "${ITERATION_NUM}"; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi

  # 次のイテレーションのために main に戻る
  git checkout main --quiet 2>/dev/null || true

  # イテレーション間に少し待つ（API レート制限対策）
  info "次のイテレーションまで 5 秒待機..."
  sleep 5
done
