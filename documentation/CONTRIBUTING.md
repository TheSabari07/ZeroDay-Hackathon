# Contributing Guide

## Welcome Contributors

Thank you for your interest in contributing to the ZeroDay Campus App! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Git
- MongoDB (local or Atlas)
- Code editor (VS Code recommended)

### Setup Development Environment
1. Fork the repository
2. Clone your fork locally
3. Follow the setup guide in `documentation/SETUP_GUIDE.md`
4. Create a feature branch

## Contribution Guidelines

### Code Style

#### JavaScript/React
- Use ES6+ features
- Prefer functional components with hooks
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

#### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use CSS custom properties for theming

#### Backend
- Follow RESTful API conventions
- Use async/await for asynchronous operations
- Implement proper error handling
- Add input validation
- Use meaningful HTTP status codes

### File Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Pages**: PascalCase with Page suffix (e.g., `DashboardPage.jsx`)
- **Services**: camelCase with Service suffix (e.g., `authService.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Commit Message Format
Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add password reset functionality
fix(ui): resolve navigation menu alignment issue
docs(api): update authentication endpoint documentation
style(components): format code with prettier
refactor(services): simplify API service structure
test(auth): add unit tests for login validation
chore(deps): update dependencies to latest versions
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, well-documented code
   - Add tests if applicable
   - Update documentation
   - Follow existing code patterns

3. **Test Your Changes**
   - Run the application locally
   - Test all affected features
   - Check for console errors
   - Verify responsive design

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use descriptive title
   - Add detailed description
   - Include screenshots if UI changes
   - Link related issues

### Pull Request Template

```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design verified

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Environment variables documented
```

## Development Workflow

### Feature Development
1. **Plan**: Understand requirements and design
2. **Branch**: Create feature branch from main
3. **Develop**: Write code with tests
4. **Test**: Verify functionality locally
5. **Review**: Self-review and refactor
6. **Submit**: Create pull request

### Bug Fixes
1. **Reproduce**: Confirm bug exists
2. **Investigate**: Find root cause
3. **Fix**: Implement solution
4. **Test**: Verify fix works
5. **Document**: Update documentation if needed

### Code Review Process
1. **Automated Checks**: CI/CD pipeline validation
2. **Peer Review**: Code review by maintainers
3. **Testing**: Manual testing of changes
4. **Approval**: Maintainer approval required
5. **Merge**: Changes merged to main branch

## Project Structure

### Frontend (client/)
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service functions
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── middleware/    # Frontend middleware
```

### Backend (server/)
```
├── controllers/   # Request handlers
├── models/        # Database models
├── routes/        # API route definitions
├── middlewares/   # Express middlewares
├── config/        # Configuration files
└── uploads/       # File upload directory
```

## Testing Guidelines

### Frontend Testing
- Test component rendering
- Test user interactions
- Test form validation
- Test API integration
- Test responsive design

### Backend Testing
- Test API endpoints
- Test authentication
- Test data validation
- Test error handling
- Test database operations

### Manual Testing Checklist
- [ ] All features work as expected
- [ ] No console errors
- [ ] Responsive on mobile devices
- [ ] Loading states work properly
- [ ] Error messages are clear
- [ ] Navigation works correctly

## Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Explain business rules
- Add inline comments where needed

### API Documentation
- Update API documentation for new endpoints
- Include request/response examples
- Document error codes
- Add authentication requirements

### User Documentation
- Update user guides for new features
- Add screenshots for UI changes
- Document configuration options
- Provide troubleshooting guides

## Performance Guidelines

### Frontend Performance
- Optimize bundle size
- Use lazy loading for components
- Minimize re-renders
- Optimize images
- Use proper caching strategies

### Backend Performance
- Optimize database queries
- Implement proper indexing
- Use connection pooling
- Add response caching
- Monitor API response times

## Security Guidelines

### Frontend Security
- Validate user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper authentication
- Protect against XSS attacks

### Backend Security
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Secure file uploads
- Use environment variables for secrets

## Communication

### Issues
- Use descriptive issue titles
- Provide detailed descriptions
- Include steps to reproduce
- Add screenshots if applicable
- Use appropriate labels

### Discussions
- Be respectful and constructive
- Ask questions when unclear
- Share knowledge and insights
- Help other contributors

### Code Reviews
- Be constructive and helpful
- Focus on code quality
- Suggest improvements
- Respect different approaches
- Provide clear feedback

## Recognition

### Contributors
- All contributors will be listed in the README
- Significant contributions will be highlighted
- Contributors will be mentioned in release notes

### Contribution Types
- Code contributions
- Documentation improvements
- Bug reports
- Feature suggestions
- Testing and feedback

## Getting Help

### Resources
- Project documentation
- GitHub issues
- Community discussions
- Code examples in repository

### Contact
- Create GitHub issue for bugs
- Start discussion for questions
- Contact maintainers for urgent issues

## Code of Conduct

### Standards
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement
- Unacceptable behavior will not be tolerated
- Maintainers will address violations
- Consequences may include temporary or permanent ban

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to the ZeroDay Campus App! Your contributions help make this project better for everyone. 