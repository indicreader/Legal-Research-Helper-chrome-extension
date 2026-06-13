# Graph Report - .  (2026-06-13)

## Corpus Check
- Corpus is ~2,599 words - fits in a single context window. You may not need a graph.

## Summary
- 35 nodes · 31 edges · 7 communities (6 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 200 input · 100 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Manifest Settings|Manifest Settings]]
- [[_COMMUNITY_Content Script Logic|Content Script Logic]]
- [[_COMMUNITY_Dictionary Configuration|Dictionary Configuration]]
- [[_COMMUNITY_Extension Core Files|Extension Core Files]]
- [[_COMMUNITY_Icon Configuration|Icon Configuration]]
- [[_COMMUNITY_Extension Metadata|Extension Metadata]]

## God Nodes (most connected - your core abstractions)
1. `icons` - 4 edges
2. `Content Script` - 3 edges
3. `Manifest Configuration` - 3 edges
4. `loadDictionary()` - 2 edges
5. `processDocument()` - 2 edges
6. `statutory_acts` - 2 edges
7. `case_law` - 2 edges
8. `international_treaties` - 2 edges
9. `background` - 2 edges
10. `Background Script` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Manifest Configuration` --references--> `LexLink Icon`  [EXTRACTED]
  manifest.json → icon.png
- `Content Script` --calls--> `Background Script`  [EXTRACTED]
  content.js → background.js
- `Manifest Configuration` --references--> `Background Script`  [EXTRACTED]
  manifest.json → background.js
- `Content Script` --references--> `LexLink Dictionary`  [EXTRACTED]
  content.js → dictionary.json
- `Manifest Configuration` --references--> `Content Script`  [EXTRACTED]
  manifest.json → content.js

## Import Cycles
- None detected.

## Communities (7 total, 1 thin omitted)

### Community 0 - "Manifest Settings"
Cohesion: 0.20
Nodes (9): background, service_worker, content_scripts, description, manifest_version, name, permissions, version (+1 more)

### Community 1 - "Content Script Logic"
Cohesion: 0.33
Nodes (5): genericTerms, loadDictionary(), patterns, processDocument(), seenTokens

### Community 2 - "Dictionary Configuration"
Cohesion: 0.29
Nodes (6): case_law, patterns, international_treaties, patterns, statutory_acts, patterns

### Community 3 - "Extension Core Files"
Cohesion: 0.50
Nodes (5): Background Script, Content Script, LexLink Dictionary, LexLink Icon, Manifest Configuration

### Community 4 - "Icon Configuration"
Cohesion: 0.50
Nodes (4): icons, 128, 16, 48

## Knowledge Gaps
- **19 isolated node(s):** `patterns`, `seenTokens`, `genericTerms`, `patterns`, `patterns` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `icons` connect `Icon Configuration` to `Manifest Settings`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `patterns`, `seenTokens`, `genericTerms` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._