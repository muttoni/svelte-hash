# Better Svelte Config for Production (Asset Hashing and JS mangling)

A `rollup.config.js` &amp; `package.json` that supports the following out of the box:
- Asset hashing in production
- Single-page-app (SPA) routing capabilities (i.e. via `sirv --single`)
- Minified AND mangled JS in production (i.e. via `npm run build`)
- correct parsing of dependency CSS

## Usage

Step 1: Rename your `index.html` files to include \*.[hash].\* and point from the route (i.e. the usual `public/build/` will be created at the root now, and all `public/*` files will be copied over and then hashed (in production). 

Specifically

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

Step 2: Use the usual commands `npm run dev` and `npm run build`. Everything should work as before. 

