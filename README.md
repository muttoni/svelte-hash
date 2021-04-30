# Better Svelte Config for Production (Asset Hashing and JS mangling)

A `rollup.config.js` &amp; `package.json` that supports the following out of the box:
- Asset hashing in production for correct content-based cache invalidation
- Single-page-app (SPA) routing capabilities (i.e. via `sirv --single`)
- Minified AND mangled JS in production (i.e. via `npm run build`)
- Correct parsing of dependency CSS

## How it works

It copies over all files from the `public/*` folder into a `build/` folder. It builds CSS & JS bundles as normal and outputs them to the `build/` folder (and runs the hashing function in production).

## Usage

Step 1: Update your assets paths in your `index.html` to include `*.[hash].*`. Example:


```diff
<!doctype html>
<html lang="en" class="h-100">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">

+  <link rel='stylesheet' href='/bundle.[hash].css'>
+  <link rel='stylesheet' href='/global.[hash].css'>
  
  <title>Your title</title>
</head>
+ <script src="/bundle.[hash].js"></script>
</body>
</html>
```
Step 2: Keep in mind this rollup setup copies over all your `public/` files into a `build/` folder at the root of your working directory. 

Step 2: Use the usual commands `npm run dev` and `npm run build`. Everything should work as before. 

