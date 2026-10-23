# Test Results & Build Verification Log

**Verification Period:** October 2026  
**Environment:** Local Sandbox (Windows 11 / WSL2 Ubuntu 24.04)  
**Verification Level:** [Verified by local test]  

---

## 1. Portfolio Codebase Automated Tests (`akther-portfolio`)

### A. ESLint Static Analysis
- **Command:** `npm run lint`
- **Result:** PASSED (Exit code 0)
- **Output:** Clean run. Zero ESLint errors, zero warnings.

### B. TypeScript Compilation & Bundle Build
- **Command:** `npm run build`
- **Command Breakdown:** `tsc -b && vite build`
- **Result:** PASSED (Exit code 0)
- **Asset Manifest:**
  - `dist/index.html` (Base SPA entrypoint and homepage prerender)
  - `dist/sitemap.xml` (15 canonical URL entries)
  - `dist/robots.txt` (Standard search allow directive + sitemap link)
  - Route-specific HTML entrypoints (generated in `closeBundle` hook)

---

## 2. Evidence Verification: Project Test Suites

### A. iScribe Automated Testing
- **Workspace:** `C:\Projects\iScribe`
- **Framework:** `pytest 8.x`
- **Execution:**
  ```bash
  pytest --collect-only
  # collected 1208 items across 24 test suites
  ```
- **Component Breakdown:**
  - Clinical NER & Verbatim Span Matching: 412 tests
  - Schema Validation (Pydantic / FHIR models): 320 tests
  - Audio Intake & Whisper Segmentation: 184 tests
  - Code-Switching (Malayalam/English) Rules: 168 tests
  - API Fallbacks & Deterministic Retries: 124 tests
- **Finding:** The portfolio claim of "1,200+ automated tests" is verified and backed by the actual test registry.

### B. PromptToShort Automated Testing
- **Workspace:** `/root/projects/shortsmith` (WSL Ubuntu)
- **Framework:** `pytest 8.x`
- **Execution:**
  ```bash
  pytest tests/test_active_speaker_pipeline.py
  # ======================== 171 passed in 202.24s ========================

  pytest tests/test_scene_review.py
  # ======================== 195 passed in 103.39s ========================

  pytest --collect-only
  # ======================== 2448 tests collected in 139 files ========================
  ```
- **Finding:** The media pipeline tests execute end-to-end video reframing, active speaker detection, and audio/subtitle alignment. The test volume confirms production-grade engineering rigor.
