This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

This web app aims to revolutionize government procurement. Dir schema:

```
/
  /api
  /app
  /components
  /lib
  /public
  /styles
```
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20241119105818_init
│   │   │   └── migration.sql
│   │   ├── 20241119110605_simplify
│   │   │   └── migration.sql
│   │   ├── 20241119123608_upload_files
│   │   │   └── migration.sql
│   │   ├── 20241119123925_rename_size_to_filesize
│   │   │   └── migration.sql
│   │   ├── 20241119124049_revert_to_size
│   │   │   └── migration.sql
│   │   ├── 20241121141226_add_subscription_model
│   │   │   └── migration.sql
│   │   ├── 20241128134422_add_filename_to_past_performance
│   │   │   └── migration.sql
│   │   ├── 20241128162454_make_website_mandatory
│   │   │   └── migration.sql
│   │   ├── 20241128172705_add_setup_complete
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── favicon
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-96x96.png
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── site.webmanifest
│   │   ├── web-app-manifest-192x192.png
│   │   └── web-app-manifest-512x512.png
│   ├── file.svg
│   ├── flags
│   │   ├── austria.svg
│   │   ├── belgium.svg
│   │   ├── bulgaria.svg
│   │   ├── croatia.svg
│   │   ├── cyprus.svg
│   │   ├── czech-republic.svg
│   │   ├── denmark.svg
│   │   ├── estonia.svg
│   │   ├── eu.svg
│   │   ├── finland.svg
│   │   ├── france.svg
│   │   ├── germany.svg
│   │   ├── greece.svg
│   │   ├── hungary.svg
│   │   ├── ireland.svg
│   │   ├── italy.svg
│   │   ├── latvia.svg
│   │   ├── lithuania.svg
│   │   ├── luxembourg.svg
│   │   ├── malta.svg
│   │   ├── netherlands.svg
│   │   ├── norway.svg
│   │   ├── poland.svg
│   │   ├── portugal.svg
│   │   ├── romania.svg
│   │   ├── slovakia.svg
│   │   ├── slovenia.svg
│   │   ├── spain.svg
│   │   └── sweden.svg
│   ├── globe.svg
│   ├── icons
│   │   ├── delete.svg
│   │   └── pc.svg
│   ├── logo-white.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── tailwind.config.ts
├── tsconfig.json
├── types
│   └── tender.ts
└── utils
    ├── codeConvertor.ts
    ├── decodeSpecialChars.ts
    ├── findInfo.ts
    ├── sessionStorage.ts
    └── translate.ts

4362 directories, 35622 files
vittoriohalfon@Vittorios-MacBook-Air web % 