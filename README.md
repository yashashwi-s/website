# Yashashwi Singhania - Developer Portfolio

A high-performance, WebGL-integrated interactive developer portfolio built with Next.js, Framer Motion, and Three.js. This project utilizes advanced Awwwards-style frontend techniques, including custom shaders, kinetic physics interactions, and horizontal scroll hijacking.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Vanilla CSS Variables
- **Animations:** Framer Motion (for DOM layout, scroll, and physics-based interactions)
- **3D & WebGL:** Three.js, @react-three/fiber, @react-three/drei
- **Icons:** Lucide React & Custom SVGs

## ✨ Advanced Features

1. **WebGL Particle Fluid Simulation** (`ParticleBackground.jsx`)
   - A highly optimized point-cloud of 4000 particles that acts as the site's background. It reacts to the user's cursor velocity, parting like fluid using custom interaction math.
2. **Horizontal Scroll Hijacking** (`HorizontalGallery.jsx`)
   - Translates vertical scroll progress into horizontal movement for a massive, pinned "Selected Works" gallery.
3. **WebGL Image Distortion Shaders** (`WebGLDistortion.jsx`)
   - Instead of standard DOM hover effects, project images are rendered on a WebGL Canvas. A custom GLSL fragment shader generates a mathematical wave, causing the image to ripple and split its RGB channels dynamically on hover.
4. **X-Ray Typography Masking** (`About.jsx`)
   - Bio text rests at a dim 20% opacity. The cursor acts as a localized CSS radial mask (`WebkitMaskImage`), revealing a pure white 100% opacity layer underneath like an X-Ray.
5. **Kinetic Rubber-Band Buttons** (`Magnetic.jsx`)
   - An upgraded magnetic wrapper component. When a user pulls a button aggressively, it physically stretches, scales, and skews in the direction of the pull using Pythagorean theorem and Framer Motion spring physics.
6. **Velocity-Linked Marquee** (`VelocityMarquee.jsx`)
   - Infinite marquee text that dynamically skews and stretches based on how fast the user scrolls the page.
7. **5-Panel Shutter Preloader** (`Preloader.jsx`)
   - A sophisticated exit animation where the preloader slices into 5 vertical columns that zip upwards in a rapid, staggered sequence when the site is fully loaded.

## 📦 Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠 Project Data Configuration

To update the content of the portfolio without digging into the component code, simply edit the files in the `/data` directory:

- `/data/personal.js`: Contains your bio, name, and social links.
- `/data/projects.js`: Contains the list of your projects, descriptions, and links. Projects are ordered by their `order` property.

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com).
See the deployment guide below for setting up your custom domain.
