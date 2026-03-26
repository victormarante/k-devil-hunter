# K Devil Hunter – Stats Reference & Damage Tool

A fan-made character stats reference and damage calculator for the mobile game
**[K Devil Hunter](https://www.pocketgamer.com/k-devil-hunter/out-now/)** by Code Dragon.

## 🌐 Live site

> **https://victormarante.github.io/k-devil-hunter/**

## 📲 Download the game

| Platform | Link |
|---|---|
| Google Play | [com.codedragon.kdemon](https://play.google.com/store/apps/details?id=com.codedragon.kdemon) |
| App Store | [K Devil Hunter (id6757422245)](https://apps.apple.com/se/app/k-devil-hunter/id6757422245) |

## Features

- **Character Overview** – effective ATK, HP, Crit Rate, Crit DMG at a glance
- **Detailed Stats** – all eight in-game stat categories (Honing, Mastery, Equipment, Skill Collection, Buff, Blood Energy, Promotion, Monster Collection) shown in tabbed tables with real values from in-game screenshots
- **Damage Calculator** – estimates Normal / Crit / Ultra Crit / Avg damage for any skill multiplier
- **Screenshot Gallery** – 18 in-game screenshots with lightbox viewer

## Deployment

The site is a zero-dependency static site (HTML + CSS + JS).  
It is automatically deployed to [GitHub Pages](https://pages.github.com/) via the
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) workflow on every push to `main`.

To enable GitHub Pages in your own fork:
1. Go to **Settings → Pages**
2. Under *Build and deployment → Source*, select **GitHub Actions**
