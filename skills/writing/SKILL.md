---
name: writing
description: "Draft and edit copy, product text, reports and Korean updates using the bundled writing playbook, the user's own writing rules and a focused review of factual meaning."
version: "0.1.0"
---

# Writing

This skill should be used when drafting or editing copy, product text,
reports or Korean updates within the existing writing workflow.

## Authority and context

Follow the current request and the user's own writing and voice rules
(their agent instructions or style guide, if they have one) before the
bundled playbook. Keep their language, channel, length and delivery
requirements. This package does not replace those rules or authorize
publication.

Read [the bundled writing playbook](references/writing-playbook.md),
including its coverage limits. Its citations and historical examples are
carried forward from the existing study, not independently reverified by
this package. The source study's full `PLAYBOOK.md` is not bundled here.

For Korean prose, also read
[the meaning-preservation review](references/korean-review.md).
It supplements the existing workflow with manual review details.

## Work

1. Establish the reader, purpose, requested form and evidence available.
   Separate observed facts, attributed statements, estimates and proposals.
2. Draft or edit with the bundled playbook where it agrees with the current
   request and the user's rules. Use concrete language only as far as the evidence
   supports it.
3. Compare the result with its source. Preserve each claim's actor, action,
   scope, polarity, time, confidence and obligation. Keep numbers attached
   to their subjects and preserve literal quotations and identifiers.
4. When you edited an existing text, save the original and the edit and run
   `bun scripts/fact-keep-check.mjs --before <original> --after <edit>` from this skill's folder.
   Fix every reported problem; read every warning against the original.
5. Before sending, re-read the exact final text against the user's own
   delivery rules. A clean style check does not verify its facts or
   authorize sending it.

Return the requested artifact. Explain unresolved factual ambiguity when it
affects the result; retain the original wording when an equivalent edit
cannot be established. Do not assign an authorship probability or a
language-quality score from word counts.

## Package scope

This is the entry for an earlier writing study, with one independently
written Korean review reference and the fact-keep-check tool. It adds no
automatic rewriter, hook, model call or delivery mechanism.
