# [CSV Importer](https://importer.sadmn.com)

This is a csv-importer built with `shadnc/ui`, `react-dropzone`, and `papaparse`. It is bootstrapped with `create-t3-app`.

[![CSV Importer](./public/images/screenshot.png)](https://importer.sadmn.com)

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **DND Uploader:** [react-dropzone](https://react-dropzone.js.org/)
- **Storage:** [uploadthing](https://uploadthing.com)
- **CSV Parsing:** [Papaparse](https://www.papaparse.com)

## Features

- [x] Upload CSV file using `use-upload-file.ts`
- [x] Parse CSV file using `use-parse-csv.ts`
- [x] Preview the parsed CSV data
- [x] Map the CSV fields to the corresponding table fields
- [x] Import the mapped data into the table

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/sadmann7/csv-importer
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm run dev
   ```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
