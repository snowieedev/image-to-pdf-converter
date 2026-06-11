# Image-to-PDF Converter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-success.svg)
![Vanilla JS](https://img.shields.io/badge/Made%20with-Vanilla%20JS-f7df1e.svg)
![Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38bdf8.svg)

A professional, fast, and entirely client-side web application that converts images to PDF. Built with a focus on a clean, modern UI and smooth user experience.

![Screenshot Placeholder](https://via.placeholder.com/1200x600.png?text=Image+to+PDF+Hero+Screenshot)

## 🌟 Features

- **100% Client-Side:** No server uploads required, ensuring complete privacy.
- **Drag & Drop UI:** Intuitive, beautifully animated drag-and-drop file uploader.
- **Live Reordering:** Sort your images visually before generating the PDF.
- **Multiple Formats:** Supports PNG, JPG, and WEBP.
- **Customizable Export:** Choose page size (A4, Letter), margins, quality, and fit.
- **Smart Orientation:** Automatically detects image orientation and adjusts PDF pages.
- **Sleek UX:** Toast notifications, smooth animations, and fully responsive design.

## 🚀 Demo

[Live Demo Link Placeholder]

## 🛠 Tech Stack

- **HTML5 & CSS3**
- **Vanilla JavaScript (ES6 Modules)**
- **Tailwind CSS** (via CDN for styling)
- **jsPDF** (for client-side PDF generation)
- **SortableJS** (for drag-and-drop reordering)

## 📁 Folder Structure

```
Image-to-PDF/
├── css/
│   └── style.css            # Custom CSS and Tailwind overrides
├── js/
│   ├── app.js               # Main entry point and orchestrator
│   ├── pdf-generator.js     # jsPDF generation logic
│   └── ui-manager.js        # DOM manipulation, Toasts, Drag & Drop
├── index.html               # Main HTML template
├── README.md                # Project documentation
├── LICENSE                  # MIT License
├── CONTRIBUTING.md          # Contribution guidelines
├── CHANGELOG.md             # Version history
└── .gitignore               # Git ignore rules
```

## 💻 Installation & Usage

Because this project is entirely static, no build step or package manager is required!

1. **Clone the repository:**
   ```bash
   git clone https://github.com/snowieedev/Image-to-PDF.git
   cd Image-to-PDF
   ```

2. **Run the application:**
   - Simply double-click `index.html` to open it in your browser.
   - Or, use a local server for a better experience (e.g., using VS Code Live Server, or Python):
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`

## ⚙️ Configuration

You can tweak the default PDF settings inside `index.html` by changing the `selected` attribute on the `<option>` tags within the Export Settings panel.
Tailwind configuration is located in the `<head>` of `index.html` under `tailwind.config`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to submit a pull request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👏 Credits

- Designed and built by [Your Name/Accurex].
- Built with [Tailwind CSS](https://tailwindcss.com/), [jsPDF](https://github.com/parallax/jsPDF), and [SortableJS](https://github.com/SortableJS/Sortable).
