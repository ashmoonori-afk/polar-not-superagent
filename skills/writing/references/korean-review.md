# Preserve meaning while editing Korean

Use this manual pass when editing an existing Korean draft. Its purpose is
to improve comprehension while preserving what the draft says. The current
request and the user's own rules decide the voice and format.

## Establish what must survive

Keep the original available. For each claim, identify:

- The actor, action or state, and the object affected.
- Every number with its subject, sign, unit, denominator, time period and
  exact or approximate status.
- Names, code identifiers, dates, literal quotations and their attribution.
- Negation, exceptions, conditions, causal direction and comparison scope.
- Whether something is observed, completed, ongoing, planned, possible,
  required or merely proposed.

Preserve the relationship between these elements, including repeated
occurrences. Keeping the same set of numeric strings does not preserve
which outcome each number describes. Keeping one hedge somewhere in a
paragraph does not preserve the uncertainty of another sentence.

## Make a local, justified edit

Edit a span because it obstructs comprehension, not because a catalog lists
one of its words. Useful questions include:

- Does a repeated preposition or introductory phrase hide the main action?
- Is a pronoun's antecedent clear from the supplied context?
- Can a long modifier or comma-separated clause be divided without changing
  attribution, chronology or the condition on the claim?
- Does a connective express a real cause, exception or contrast? Preserve
  that relationship even if the wording becomes shorter.
- Does an abstract noun or passive verb hide an actor that the source
  actually identifies? Do not invent an actor or implementation detail.

Ordinary Korean connectives, pronouns and cautious endings are not defects
by themselves. Preserve uncertainty in conversational forms as well as
formal forms. A replacement must keep the original degree of possibility,
confidence or obligation; a different ending is not automatically equivalent.

Keep the requested register and useful structure. In a status update,
preserve the required conclusion, useful numbered evidence, requested
length and any house markers the user asked for. Do not add long sentences, remove every list, vary tense
or rearrange the decision merely to meet a rhythm or punctuation quota.

Do not supply missing scenes, people, emotions, sources, dates or causal
mechanisms to make a sentence more vivid. If the claim itself needs more
evidence, identify that gap rather than filling it with prose.

## Compare propositions after editing

Review every changed, merged, moved and deleted sentence against the
original. In particular:

| Change | Question |
|---|---|
| A shorter result statement | Did a condition, approximation or uncertainty disappear? |
| A new active verb | Did it introduce an actor or imply that planned work already happened? |
| Two sentences combined | Do both claims retain their own scope and obligation? |
| A repeated phrase removed | Was repetition carrying a distinct fact or attribution? |
| A number reformatted | Is its value, sign, unit, association and time basis unchanged? |
| A quotation or identifier | Is the protected literal text still intact? |

Keep a literal quotation intact unless the task specifically asks for a
translation or paraphrase. Explain necessary technical terms without
silently replacing an identifier.

If equivalence is uncertain, keep the original span and identify the
ambiguity when it matters. Do not automatically restore a whole source
sentence into a merged or split passage: doing so can duplicate or delete
another claim.

## Check the facts mechanically, then the style

After editing, compare the original and the edit:

```sh
bun scripts/fact-keep-check.mjs --before "$original" --after "$draft"
```

It fails when a number is lost, added or changed, when its sign flips, when
a Korean large-number unit changes, or when a subject now carries another
subject's number (swapped counts). It warns when negation or possibility
markers change, because rewording can move them legitimately; read each
warning against the original. A pass covers numbers only. Actor, scope,
causal direction and attribution still need the manual comparison above.

Check the exact final draft and correct any reported failure. If an edit
changes that draft, check the changed draft. Delivery follows the existing
channel and authorization rules; this reference does not send anything.

A style pass is not factual evidence. Substring preservation, a low edit
ratio and a successful process exit each establish only their own narrow
condition. Report an unavailable check as unavailable.

## Provenance and limits

Independently adapted from the complete source/test review of
`epoko77-ai/im-not-ai@b37e0206d31fffd9149bf57168d4d62eb2086bee` and an earlier
writing workflow. The review mapped all 85 catalog IDs: 53 were
already covered, 13 added useful review detail and 19 required house-rule
or meaning-preservation precedence.

The source contains useful corrections to overbroad style rules, but its
numeric proxies, historical calibration outputs and deterministic gates
do not establish general semantic fidelity or authorship. This reference
does not adopt them. No real-message benchmark or measured improvement in
naturalness is claimed.
