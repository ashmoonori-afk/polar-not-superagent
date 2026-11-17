# Third-party notices for skills/

The skills in `skills/` other than `dori-mode` are not covered by the repository's Sustainable Use License. Adapted skills keep their upstream licence and notice in their own folder (`LICENSE`, `NOTICE`). Skills marked "written here" were written for this project. Where one of them names an outside project, that project was read for ideas and none of its code was copied.

| Skill | Upstream | Commit | Licence and copyright | Changes in this copy |
|---|---|---|---|---|
| agent-link | written here, from a working deployment of [changeroa/agent-mailbox](https://github.com/changeroa/agent-mailbox) | `43f5a0b` | no upstream code or text included; the endpoints it calls are that project's API | - |
| bookforge | [gongnyang/bookforge](https://github.com/gongnyang/bookforge) | `3f1e85e` | MIT, Copyright (c) 2026 gongnyang; bundled Pretendard, Noto Serif KR, Paperlogy, Gmarket Sans and Barlow fonts under SIL OFL 1.1 (`assets/fonts/`) | Code unchanged except `scripts/convert_fonts.py`, which now converts Noto Serif KR only; Pretendard swapped for the official release TTFs (Reserved Font Name), README, AGENTS.md and the 44 example PDFs and PNGs left out; see `NOTICE` |
| design-taste | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills), [elayadesign/redesign-skill](https://github.com/elayadesign/redesign-skill) | `2f97a85`, `12af471`, `456d9e0`, `7df13f6` | Apache-2.0, Copyright 2025 Paul Bakaus; MIT, Copyright (c) 2026 Leonxlnx; MIT, Copyright (c) 2026 Elaya (two projects) | Condensed and merged; see `skills/design-taste/NOTICE` |
| desktop-evidence | written here, from a review of [vercel-labs/agent-desktop](https://github.com/vercel-labs/agent-desktop) | `6660fba` | no upstream code included | - |
| dimensional-drawing | [enesozturk/dimensional-drawing](https://github.com/enesozturk/dimensional-drawing) | `5c45743` | MIT, Copyright (c) 2026 Enes Ozturk | Unchanged; LICENSE added to the folder |
| dimensional-drawing-motion | [enesozturk/dimensional-drawing](https://github.com/enesozturk/dimensional-drawing) | `5c45743` | MIT, Copyright (c) 2026 Enes Ozturk | Unchanged; LICENSE added to the folder |
| figma-designer | [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) | `456d9e0` | MIT, Copyright (c) 2026 Elaya | Motion timing aligned with design-taste; see `NOTICE` |
| generative-ui | written here | - | - | - |
| hyperframes | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | `a04b45a` | Apache-2.0 | Shortened; one pinned CLI version, telemetry off; see `NOTICE` |
| instatoon | written here | - | - | - |
| ponytail | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | `96608e0` | MIT, Copyright (c) 2026 DietrichGebert | Rules only, no hooks; see `NOTICE` |
| security-audit | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | `c1c8a8c` | MIT, Copyright (c) 2025-2026 Cloudflare, Inc. | SKILL.md shortened; companion files and validators unchanged; see `NOTICE` |
| stack-diagram | [caru-ini/stack-diagram](https://github.com/caru-ini/stack-diagram) | `15701b1` | MIT, Copyright (c) 2026 caru-ini; bundled Geist and JetBrains Mono fonts under SIL OFL 1.1 (`assets/fonts/`) | Public gallery upload removed; PNG render tries full browsers first |
| ui-ux-guardrails | written here; rules adapted from [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), each linked to its source page | - | Not affiliated with or endorsed by Apple. HIG text is not reproduced; per-page extraction notes are not included | - |
| video-use | [browser-use/video-use](https://github.com/browser-use/video-use) | `43cfc56` | MIT, Copyright (c) 2026 Browser Use | Local mlx-whisper transcription by default (`helpers/transcribe.py`, `SKILL.md`, `pyproject.toml`); README, poster, banner, lockfile and the `manim-video` sub-skill left out |
| writing | written here; `references/korean-review.md` from a review of [epoko77-ai/im-not-ai](https://github.com/epoko77-ai/im-not-ai) (MIT) | `b37e020` | no upstream code included | - |
