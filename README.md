# Docify

<p align="center">
  <img src="./public/logo.png" width=460 alt="Docify Preview" />
</p>

A web application that allows users to generate professional Word documents (`.docx` or `.doc`) directly from JavaScript (`.js`) configuration files, entirely within the client-side environment. 

## 🚀 Features

- **Client-Side Generation:** Generate `.docx` reports without relying on any backend servers, ensuring privacy and speed.
- **Local Preview:** Instantly preview generated documents locally using `docx-preview`.
- **Watermark-Free:** Produces clean, professional documents without unwanted watermarks.
- **Modern UI:** Built with a sleek, responsive interface using Radix UI primitives and Tailwind CSS.
- **Progress Tracking:** Real-time visual progress bar to track document conversion status.
- **Download Ready:** Generate and download the resulting `.docx` file in a single click.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
- **Document Generation:** [docx](https://docx.js.org/)
- **Document Preview:** [docx-preview](https://github.com/VolodymyrBaydalka/docxjs)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Bimsara-Janakantha/Docify.git
   cd Docify
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## 📜 Scripts

- `npm run dev` - Starts the Vite development server.
- `npm run build` - Builds the application for production.
- `npm run preview` - Locally previews the production build.
- `npm run lint` - Runs ESLint to catch issues.
- `npm run format` - Formats the code using Prettier.

## 📄 License

This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE) file for more details.
