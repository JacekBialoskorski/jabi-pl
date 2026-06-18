Adding a new gallery photo

1. Drop the full-resolution photo into this folder, under the right category:
   - `swieckie/` for secular work
   - `sakralne/` for sacral work
   Any filename works (no need to follow sequential numbering or avoid gaps).

2. From the repo root, run:
   npm run optimize-images

   This regenerates the compressed `thumb/` and `full/` WebP variants for
   every photo here, and rewrites `img/gallery-manifest.js` so the gallery
   picks up the new photo automatically.

3. Commit the new original plus the regenerated thumb/full files and
   gallery-manifest.js.

Removing a gallery photo

1. Delete the photo from this folder (`swieckie/` or `sakralne/`).

2. From the repo root, run:
   npm run optimize-images

   This removes the now-orphaned `thumb`/`full` WebP variants and rewrites
   `img/gallery-manifest.js` so the gallery stops showing the photo.

3. Commit the deletion plus the removed thumb/full files and
   gallery-manifest.js.
