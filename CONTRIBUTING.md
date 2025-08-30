# Contributing to MKWW Biosynthetic Vessel

Thank you for your interest in contributing to the MKWW Biosynthetic Vessel project! We welcome contributions from everyone, regardless of experience level.

## 🎯 How to Contribute

### Reporting Issues
- Search existing issues before creating a new one
- Use a clear and descriptive title
- Include steps to reproduce the issue
- Describe the expected and actual behavior
- Include screenshots or screen recordings if applicable

### Feature Requests
- Explain the feature you'd like to see
- Describe why this feature would be valuable
- Include any relevant examples or references

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🛠 Development Setup

### Prerequisites
- Node.js 20.x
- npm 10.x or later
- Git

### Installation
1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`)

### Development Workflow
- Run the development server:
  ```bash
  npm run dev
  ```
- Run tests:
  ```bash
  npm test
  ```
- Run linter:
  ```bash
  npm run lint
  ```
- Run formatter:
  ```bash
  npm run format
  ```

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Add type annotations for function parameters and return types
- Use interfaces for object types
- Prefer `type` over `interface` for union/intersection types

### React
- Use functional components with hooks
- Prefer named exports
- Use TypeScript for props and state
- Keep components small and focused
- Use meaningful component and prop names

### Styling
- Use Tailwind CSS for styling
- Follow the design system in `src/styles/theme.ts`
- Use CSS modules for component-specific styles

## 🧪 Testing
- Write unit tests for all new features
- Test files should be named `*.test.tsx` or `*.spec.tsx`
- Place test files next to the code they test
- Use React Testing Library for component testing
- Aim for good test coverage

## 📦 Pull Requests
- Keep PRs focused on a single feature or bug fix
- Update documentation as needed
- Ensure all tests pass
- Request reviews from relevant team members

## 📄 License
By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## 🙏 Thank You!
Your contributions help make the MKWW Biosynthetic Vessel better for everyone. Thank you for your time and effort!
