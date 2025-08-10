# Commit Message Convention

This project uses Husky to enforce commit message conventions.

## Required Format

All commit messages must start with one of the following prefixes followed by a colon:

- **add:** for adding new features or files
- **chore:** for maintenance tasks (dependencies, build configs, etc.)
- **fix:** for bug fixes
- **feat:** for new features (similar to add but more specific)
- **docs:** for documentation changes
- **style:** for formatting changes (code style, not CSS)
- **refactor:** for code refactoring without changing functionality
- **test:** for adding or modifying tests
- **perf:** for performance improvements
- **ci:** for CI/CD changes
- **build:** for build system changes
- **revert:** for reverting changes

## Examples

✅ **Valid commit messages:**
```
add: user authentication system
chore: update dependencies to latest versions
fix: resolve database connection timeout issue
feat: implement user profile dashboard
docs: update API documentation
```

❌ **Invalid commit messages:**
```
added new feature
Update README
fixed bug
WIP: working on auth
```

## Setup

The commit message validation is automatically enforced through Husky git hooks. If your commit message doesn't follow the convention, the commit will be rejected and you'll need to amend your message.

To amend your last commit message:
```bash
git commit --amend -m "add: your corrected message here"
```
