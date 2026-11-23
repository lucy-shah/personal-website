# Inspiration content

Everything on the Inspiration page comes from the files in this folder.
To add something, add a file. There are no imports and no ids to keep in sync.

## Quickest way

```sh
npm run add
```

It asks a few questions and writes the file for you, with today's date filled in.

## Stars (the constellation map)

One JSON file per star, in the folder for its constellation:

```
inspiration/
  reading/    people/     websites/
  listening-watching/     quotes/
```

`inspiration/reading/a-book-that-rewired-my-brain.json` (books, journals, essays…):

```json
{
  "title": "A book that rewired my brain",
  "subtitle": "Author name",
  "why": "I underlined half of it",
  "description": "Longer note shown when someone clicks the star.",
  "saved": "2026-11-12",
  "link": "https://example.com"
}
```

| field         | required | notes |
|---------------|----------|-------|
| `title`       | yes      | |
| `saved`       | yes      | `YYYY-MM-DD`. Sets the draw-in order and the "newest" sort. |
| `subtitle`    |          | author / role / domain / runtime |
| `why`         |          | one line |
| `description` |          | shown in the popup |
| `kind`        |          | label on the card, e.g. `Video`, `Podcast`, `Song`. Defaults to the category's (use it in `listening-watching/`) |
| `link`        |          | adds a "Visit →" / "Read more →" link |
| `offset`      |          | `{ "x": 10, "y": -6 }` to nudge a star from its automatic spot |

**Quotes** use a simpler shape. The popup shows the whole quote, and the map and list show a shortened version:

`inspiration/quotes/manifest-no.json`:

```json
{
  "quote": "We refuse to “close the door behind” ourselves…",
  "by": "Manifest-No (Sutherland et al.)",
  "saved": "2026-11-18",
  "link": "https://www.manifestno.com/"
}
```

- **The file name is the star's id.**
- **Image:** put an image with the same name next to it, e.g. `a-book-that-rewired-my-brain.jpg` (jpg / png / webp / gif / avif). It shows at the top of the popup.
- **Placement is automatic.** Each category fills real constellations, star by star, oldest item first (the lists are the `constellations` on each cluster in `src/data/inspiration.js`; the shapes live in `src/lib/skyCatalog.js`). When one is full, the next starts beside it, so older stars never move. Constellation names aren't shown on the map. Groups shrink to fit as they grow, so they never collide.
- Files starting with `_` are ignored. Use them for drafts (e.g. `_draft-idea.json`).

## Talented people (the polaroids)

`talented-people/yara.json` + optional `talented-people/yara.jpg`:

```json
{
  "name": "Yara",
  "role": "swe @ riv",
  "link": "https://example.com",
  "added": "2026-11-18"
}
```

Polaroids are shown in `added` order. Add `"order": 1` to pin someone to the front.
The wall always shows at least 8 frames, and empty ones stay blank until you fill them.
