# File storage

This is a File storage small app for uploading files and share it with friends build with **Next.js** with support for clerk authentication and a dashboard for logged-in users.
![Project preview](https://github.com/user-attachments/assets/f4471356-155d-471d-bf21-798f048e77b1)
**Demo: [https://file-storage-learning-project.vercel.app/](https://file-storage-learning-project.vercel.app/)**

## Features

- upload and delete files with simple Dashboard
- favorite or unfavorite feature
- restore deleted files feature
- create organisations and invite friends and share files
- Global middleware to protect logged-in routes
- Local middleware to protect Server Actions or validate Zod schemas
## project sections

![upload section](https://github.com/user-attachments/assets/b96afda3-7fe0-4fde-a215-2b3b44f27dc0)
![favorite section](https://github.com/user-attachments/assets/a80d7133-467b-43b9-af67-aaa3dd6bf2a9)
![delete and restore section](https://github.com/user-attachments/assets/4ef9d375-e98d-476a-bfea-74f3b25a19d0)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **backend service**: [convex](https://www.convex.dev/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

```bash
git clone https://github.com/Raslen-korbosli/file-storage-learning-project.git
cd file-storage-learning-project
npm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
npm run dev
```


You can, of course, create new users as well through `/sign-up`.



Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.



