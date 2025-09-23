# AI Section Builder Modern

A modern, React-based WordPress plugin for building beautiful page sections with a visual editor.

## 🎯 Overview

AI Section Builder Modern is a WordPress plugin that provides a powerful visual editor for creating and managing page sections. Built with React, Zustand for state management, and WordPress REST API, it offers a seamless editing experience similar to popular page builders.

## ✨ Features

### Core Functionality
- **Visual Section Editor** - Real-time preview of sections as you build
- **Multiple Section Types** - Hero, Features, FAQ, Stats, Testimonials, and more
- **Drag & Drop Reordering** - Easily rearrange sections (coming soon)
- **Auto-save** - Never lose your work (coming soon)
- **Responsive Design** - All sections are mobile-optimized

### Current Section Types
- **Hero Section** - Eye-catching opener with headline, content, media, and CTAs
- **Features Section** - Showcase key features with cards and media

### Editor Features
- **Collapsible Sidebars** - Toggle sidebars for full-width editing (Shift+S)
- **Design Tokens** - Consistent styling throughout the editor
- **Media Support** - Images and YouTube/Vimeo video embeds
- **Button Management** - Add, edit, remove, and reorder CTAs
- **Repeater Fields** - Manage collections of content easily

## 🚀 Installation

### Requirements
- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 16+ and npm (for development)

### Installation Steps

1. **Upload Plugin**
   ```bash
   # Navigate to your WordPress plugins directory
   cd wp-content/plugins/
   
   # Clone or upload the plugin
   git clone [repository-url] ai-section-builder-modern
   ```

2. **Install Dependencies**
   ```bash
   cd ai-section-builder-modern
   npm install
   ```

3. **Build Assets**
   ```bash
   npm run build
   ```

4. **Activate Plugin**
   - Go to WordPress Admin → Plugins
   - Find "AI Section Builder Modern" and click "Activate"

## 🛠️ Development

### Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run start
   ```
   This will watch for changes and automatically rebuild

3. **Build for production**
   ```bash
   npm run build
   ```

### Project Structure

```
ai-section-builder-modern/
├── build/                 # Compiled assets (git ignored)
├── includes/             # PHP classes and core functionality
│   ├── Admin/           # Admin functionality
│   ├── API/             # REST API endpoints
│   └── Core/            # Core plugin files
├── src/                  # React source code
│   ├── components/      # React components
│   │   ├── Common/     # Reusable components
│   │   ├── Editor/     # Editor UI components
│   │   ├── Providers/  # Context providers
│   │   └── Sections/   # Section components
│   ├── stores/         # Zustand stores
│   └── styles/         # CSS and design tokens
├── templates/           # PHP templates
└── assets/             # Static assets
```

### Available Scripts

- `npm run start` - Start development server with hot reload
- `npm run build` - Build production assets
- `npm run lint:js` - Lint JavaScript files
- `npm run lint:css` - Lint CSS files
- `npm run format` - Format code with Prettier

## 📖 Usage

### Adding Sections to a Page/Post

1. Edit any page or post in WordPress
2. Look for "AI Section Builder" meta box
3. Click "Launch Editor" to open the visual editor
4. Add sections from the left sidebar
5. Configure each section using the edit panel
6. Save changes when done

### Keyboard Shortcuts

- **Shift + S** - Toggle sidebars visibility

### Creating Custom Sections

To add a new section type:

1. Create component files in `src/components/Sections/YourSection/`
   - `YourSectionPreview.js` - Preview component
   - `YourSectionForm.js` - Settings form

2. Add default content in `src/stores/editorStore.js`

3. Update Canvas and LeftSidebar components to include the new section

4. Add styles in `src/styles/editor.css`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow the existing code style
- Use React hooks and functional components
- Leverage Zustand for state management
- Ensure all sections are accessible
- Test on multiple browsers
- Add appropriate comments

## 📝 License

This project is licensed under the GPL v2 or later.

## 🐛 Known Issues

- Drag and drop reordering is not yet implemented
- Auto-save functionality is in development
- Some section types are still being built

## 📮 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/your-repo/issues).

## 🙏 Credits

Built with:
- [WordPress](https://wordpress.org/)
- [React](https://reactjs.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [@wordpress/scripts](https://developer.wordpress.org/block-editor/packages/packages-scripts/)
- [DOMPurify](https://github.com/cure53/DOMPurify)

---

**Version:** 3.0.0  
**Author:** Your Name  
**WordPress Plugin URI:** https://yoursite.com/