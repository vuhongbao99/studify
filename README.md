# Studify AI

Ung dung hoc thi cong an van bang 2 theo kieu the hoc, tu dong tao bo cau hoi/tra loi tu file Word `.docx` bang Gemini API.

## Cong nghe

- Next.js App Router (fullstack)
- Gemini API (`@google/genai`)
- Supabase Postgres
- Deploy tren Vercel

## Chuc nang MVP

- Moi file `.docx` tao 1 bai hoc (tu dong sinh ten bai)
- AI sinh bo the hoc (question, answer, explanation)
- Giao dien hoc dang card, co tien do va next/prev
- Tron cau hoi trong bai
- Chon nhieu bai de hoc gop mot lan

## Cai dat local

1. Tao file `.env.local` tu `.env.example`.
2. Dien bien moi truong:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Chay migration SQL:
   - `supabase/migrations/001_init.sql` (tao bang lan dau).
   - `supabase/migrations/002_cards_quiz_fields.sql` (cot `question_type`, `options` cho trac nghiem).

   Tu may local co the chay migration 002 bang lenh (can `DATABASE_URL` Postgres trong `.env.local`):

   ```bash
   npm run db:apply-quiz-fields
   ```

   `DATABASE_URL`: Supabase Dashboard -> Project Settings -> Database -> Connection string -> URI (dien password).

Hoac paste noi dung file `002_cards_quiz_fields.sql` vao SQL Editor tren Dashboard va Run.
4. Chay app:

```bash
yarn dev
```

## Test

```bash
yarn test
yarn lint
yarn build
```

## Prompt dung de sinh bo cau hoi

Prompt da duoc dong goi trong `lib/prompt.ts`, backend se chen noi dung tai lieu vao cuoi prompt theo block:

```text
Van ban dau vao:
{{DOCUMENT_TEXT}}
```

## Deploy Vercel

1. Push repo len Git.
2. Import project vao Vercel.
3. Cấu hình 4 env vars nhu tren trong Project Settings.
4. Deploy.
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
