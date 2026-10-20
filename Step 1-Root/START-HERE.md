# Smart MUET Hub · new platform (style v6)

## Five menus (the same on every page)

| Menu | Page | Main colour | What is inside |
| --- | --- | --- | --- |
| Home | `index.html` | Electric Blue | First MUET / Returning switch, target band, eBook, **Five stages to your band**, four papers |
| eBook | `ebook.html` | Royal Navy | Progress (pages, stars, games), 8 chapters, Read → Learn → Try routes. The flip-book reader is `book/index.html` |
| Learn | `learn.html` | paper colour | Four learning folders, **Language bank**, **Trap spotter**, then the 6-step guides in `guides/` |
| Practice | `practice.html` | Vibrant Coral | 10-minute check, Review again, Practice Lab (`labs/`), MUET Vault (`vault/`), Arcade (`arcade/`, now with **Thunder Lock**) |
| Certificate | `certificate.html` | Royal Navy | 9-activity checklist that ticks itself; when all 9 are done the certificate of accomplishment is issued (name, class, Mock 1 practice band, date, ID) and can be printed or saved as PDF. Add `?preview` to see a sample |
| Me | `me.html` | Fresh Mint | Vault 1 / Vault 2 / Mock 1 results /360, **Error log**, **Lecturer rubric**, badges, XP, records, **Band guide**, print/PDF/CSV |

## Folders

```
index.html  ebook.html  learn.html  practice.html  me.html
welcome/   Know MUET tour          guides/  4 six-step guides
account/   account & registration  labs/    4 Labs, 10-minute check, Review again
book/      53-page eBook reader    vault/   Vault 1, Vault 2, Mock 1 papers
arcade/    4 games                 shared/  styles, scripts, fonts, stickers, photos, badges
```

## Put it on GitHub Pages

1. Create a new repository (for example `Smart-MUET-Hub`).
2. Upload everything inside this folder, keeping the subfolders. Upload in batches if GitHub asks (the `vault/assets` audio is the largest part).
3. Settings → Pages → Branch `main`, folder `/ (root)` → Save.
4. Open the Pages link. Home is `index.html`.

Everything a student does is saved in their own browser (localStorage). Nothing is uploaded.
