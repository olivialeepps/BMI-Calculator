# BMI Calculator — Multi-unit (Starter Project)

This is a static, client-side BMI calculator suitable for hosting on GitHub Pages, Netlify, or Vercel.
It supports Metric, US, and Other units, includes age and gender fields, and a simple visual gauge.

## Files
- `index.html` — Main HTML file
- `style.css` — Basic styling
- `script.js` — All JavaScript logic (no frameworks)

## How to use locally
1. Unzip the project.
2. Open `index.html` in a browser to test locally.
3. (Optional) Use VS Code + Live Server for faster iteration.

## Deploy to Netlify (Drag & Drop)
1. Go to https://app.netlify.com/drop
2. Drag the unzipped project folder and drop it.
3. Netlify will upload and give you a `*.netlify.app` URL.

## Deploy to Vercel (GitHub recommended)
1. Push this folder to a GitHub repository.
2. In Vercel, create a new project and import the repository.
3. Deploy. No build step required for static files.

## Notes
- The gauge is an SVG with a stroke-dash trick to show progress.
- Update `index.html` metadata (title/description/schema) before publishing to your final URL for SEO.
- Consider adding FAQ schema and more descriptive content on the same page for better search visibility.
