# Red Ecstasy Roblox SFX and 3D Modeling Portfolio

This is a free-hostable static portfolio for Red Ecstasy, a Roblox SFX, music, and 3D modeling commission business.

## Best Free Hosting Pick

Use Cloudflare Pages for the smoothest free setup if you expect lots of media files. Cloudflare Pages currently has a free plan with static hosting, custom domains, SSL, 500 builds per month, 20,000 files per site, and a 25 MiB single-file asset limit.

GitHub Pages is also reasonable if this stays as a display portfolio and payment happens somewhere else. Keep the site focused on showcasing work and linking customers to contact you. Netlify is solid too, but its current free plan uses a monthly credit limit.

## Adding Audio

1. Put `.mp3`, `.ogg`, or `.wav` files in `assets/audio/`.
2. Open `portfolio-data.js`.
3. Add a new item inside the `audio` list:

```js
{
  title: "Laser Charge",
  category: "SFX",
  mood: "Sci-Fi",
  description: "Short charge-up sound for blasters and abilities.",
  file: "assets/audio/laser-charge.mp3",
  length: "0:05"
}
```

The site uses a custom player without a visible download button. Important: no public website can fully prevent downloading if the browser can play the file. This setup hides normal download controls and makes casual saving harder, but determined users can still inspect network files.

## Editing Site Text Privately

Most visible text is controlled from `portfolio-data.js` in the `copy` section. Edit that file to change the hero headline, button labels, section titles, commission process, contact text, footer note, and portfolio item descriptions.

Visitors cannot edit the live site. Only someone with access to the hosting project or GitHub repository can publish changes. If you use GitHub Pages from a public repo, other people may be able to view the code, but they still cannot change your live website unless you give them repository access.

Do not build a password-only editor directly into a static site. Any password placed in front-end HTML, CSS, or JavaScript can be discovered by visitors. For a true browser-based private editor, use a CMS or hosting platform with real authentication.

## Adding 3D Model Showcases

You have three options in `portfolio-data.js`.

### YouTube preview

```js
{
  title: "Weapon Showcase",
  category: "Weapons",
  description: "Video preview of a finished weapon model.",
  type: "youtube",
  src: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  tags: ["Video", "Weapon", "Showcase"]
}
```

### Interactive model preview

Export your model as `.glb` or `.gltf`, put it in `assets/models/`, then add:

```js
{
  title: "Pet Model Preview",
  category: "Pets",
  description: "Interactive model preview for customers.",
  type: "model",
  src: "assets/models/pet-preview.glb",
  poster: "assets/images/model-poster.jpg",
  tags: ["3D preview", "GLB", "Interactive"]
}
```

### Image preview

```js
{
  title: "Crate Set",
  category: "Props",
  description: "Rendered preview image.",
  type: "image",
  src: "assets/images/crate-preview.jpg",
  tags: ["Props", "Low poly", "Game ready"]
}
```

## Publishing on Cloudflare Pages

1. Create a GitHub repo and upload these files.
2. Go to Cloudflare Pages.
3. Create a project from the GitHub repo.
4. Use no build command.
5. Set the output directory to `/` or leave it as the project root.
6. Deploy.

To update the site later, upload new files and edit `portfolio-data.js`; Cloudflare Pages redeploys after you push changes.
