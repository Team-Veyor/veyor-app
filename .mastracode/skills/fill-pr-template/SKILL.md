---
name: fill-pr-template
description: Fill this project's GitHub PR template from the current git diff and optionally connect it to GitHub by updating the current branch PR or creating one if missing. Use when the user asks to write/fill/create/link/update a PR body, PR description, pull request template, or diff-based PR content.
---

# Fill and Connect PR Template From Diff

Use this skill to generate a pull request description that matches this repository's PR template, grounded in the actual diff. When requested, also connect it to GitHub by updating the current branch PR or creating one if no PR exists.

## Required template

```md
## 🔗 Related Issue
- Closes #
## 📝 Summary
<!-- 이번 PR에서 변경한 내용을 간단히 적어주세요. -->
## ✨ Changes
## ✅ Checklist
- [ ] 변경 사항이 의도대로 동작하는지 확인했습니다.
- [ ] 테스트/빌드/타입 체크 중 필요한 검증을 완료했습니다.
- [ ] 불필요한 변경이나 사이드 이펙트가 없는지 확인했습니다.
- [ ] 문서나 설정 변경이 필요한 경우 함께 반영했습니다.
## 📸 Screenshots
<!-- UI 변경이 있다면 첨부해주세요. -->
```

## Workflow

1. Inspect the diff and branch context.
   - Run `git status --short`.
   - Run `git branch --show-current`.
   - Run `git diff --stat`.
   - Run `git diff --cached --stat` if staged changes exist.
   - For branch-level PR content, compare against the base branch, e.g. `git diff main...HEAD --stat` and inspect relevant hunks.
   - Run `git diff` for unstaged changes and `git diff --cached` for staged changes as needed.
   - If the diff is huge, summarize by files and inspect relevant hunks with narrower commands.

2. Infer the related issue.
   - Prefer an issue number from the branch name, e.g. `feat/#1_pwa` -> `Closes #1`.
   - Also accept branch patterns like `feat/1-pwa`, `fix/issue-1`, or `#1` in commit/diff context.
   - If no issue number is inferable, keep `Closes #` unchanged rather than inventing one.

3. Fill each section from evidence in the diff.
   - `Summary`: 1-3 concise Korean sentences explaining the whole unit of work.
   - `Changes`: Korean bullet list of concrete changes grouped logically.
   - `Checklist`: mark items with `[x]` only when verified or clearly satisfied by the diff/context.
     - Mark behavior check `[x]` only if the agent ran or can cite a meaningful verification.
     - Mark tests/build/type check `[x]` only when commands were actually run successfully in the current session, or if command output/logs prove it.
     - Mark side effects `[x]` after reviewing the diff for unrelated changes.
     - Mark docs/settings `[x]` if relevant config/docs changes were reflected, or no docs/settings change was needed.
   - `Screenshots`: include the `## 📸 Screenshots` section only when there is a visible UI change. If there is no UI change, remove the entire screenshots section.

4. Preserve the exact section headings and ordering for included sections. Omit `## 📸 Screenshots` when there is no UI change.

5. Do not include unverified claims. Do not mention implementation attempts that were reverted unless they are present in the final diff.

6. If the user asks to connect, apply, update, create, or link the PR body to GitHub:
   - Write the completed PR body to a temporary file, e.g. `/tmp/veyor-pr-body.md`.
   - Run `gh pr view --json number,title,body,headRefName,baseRefName,url` to find an existing PR for the current branch.
   - If a PR exists, run `gh pr edit <number> --body-file /tmp/veyor-pr-body.md`.
   - If no PR exists, create one with `gh pr create --base main --head "$(git branch --show-current)" --title "<clear title>" --body-file /tmp/veyor-pr-body.md`.
   - Choose a concise title that describes the whole branch-level unit of work, not implementation attempts.
   - After applying, verify with `gh pr view --json number,title,body,url` and return the PR URL plus a short confirmation.

## Output format

- If only generating content: return only the completed PR body in markdown unless the user asks for explanation.
- If connecting to GitHub: return the PR URL and a short confirmation after verifying the body was applied.

## Example output

```md
## 🔗 Related Issue
- Closes #1

## 📝 Summary
PWA 설치에 필요한 manifest, 앱 아이콘, 메타데이터를 추가했습니다. Next.js 설정에 기본 보안 헤더를 적용해 배포 시 보안 기본값을 강화했습니다.

## ✨ Changes
- App Router manifest를 추가해 앱 이름, 시작 URL, 표시 방식, 테마 색상, 아이콘 정보를 설정했습니다.
- PWA 아이콘 및 Apple touch icon을 public 리소스로 추가했습니다.
- 루트 메타데이터에 Apple Web App 및 아이콘 설정을 반영했습니다.
- 전역 보안 헤더를 설정했습니다.

## ✅ Checklist
- [x] 변경 사항이 의도대로 동작하는지 확인했습니다.
- [x] 테스트/빌드/타입 체크 중 필요한 검증을 완료했습니다.
- [x] 불필요한 변경이나 사이드 이펙트가 없는지 확인했습니다.
- [x] 문서나 설정 변경이 필요한 경우 함께 반영했습니다.
```
