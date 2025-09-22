# Contributing to Linediff

Thank you for your interest in contributing to Linediff! We welcome contributions from the community and appreciate your help in making Linediff better.

## Development Setup

### Prerequisites

- Python 3.8 or higher
- Git
- pip

### Setting up the Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/linediff.git
   cd linediff
   ```

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install the package in development mode with all dependencies:**
   ```bash
   pip install -e ".[dev,tree-sitter]"
   ```

5. **Install pre-commit hooks:**
   ```bash
   pre-commit install
   ```

## Development Workflow

### 1. Choose an Issue

- Check the [Issues](https://github.com/othmaneblial/linediff/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to indicate you're working on it

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

### 3. Make Your Changes

- Write clear, concise commit messages
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 4. Run Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=linediff

# Run specific test file
pytest tests/test_specific.py

# Run tests in verbose mode
pytest -v
```

### 5. Code Quality Checks

```bash
# Run linting
flake8 src/

# Run type checking
mypy src/

# Format code
black src/

# Sort imports
isort src/

# Run all quality checks
pre-commit run --all-files
```

### 6. Update Documentation

- Update README.md if adding new features
- Add docstrings to new functions/classes
- Update type hints
- Add examples for new functionality

### 7. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code restructuring
- `test:` for adding tests
- `chore:` for maintenance

### 8. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with a clear description of your changes.

## Adding Language Support

To add support for a new programming language:

1. **Find the tree-sitter parser**: Check if a tree-sitter parser exists for the language at https://tree-sitter.github.io/
2. **Add dependency**: Update `pyproject.toml` with the new parser dependency
3. **Create configuration**: Add language config in `src/linediff/parser.py`
4. **Test parsing**: Add test cases for the new language
5. **Update documentation**: Add the language to supported languages list

### Example: Adding Kotlin Support

1. **Find parser**: `tree-sitter-kotlin`
2. **Update pyproject.toml:**
   ```toml
   tree-sitter-kotlin>=0.20.0
   ```
3. **Add configuration in parser.py:**
   ```python
   'kotlin': LanguageConfig(
       name='kotlin',
       extensions=['.kt', '.kts'],
       parser_class=tree_sitter_kotlin.language(),
       atom_types={'string', 'integer', 'identifier', 'comment'},
       list_types={'source_file', 'function_declaration', 'class_declaration', 'block'},
       delimiter_types={
           'function_declaration': '\n\n',
           'class_declaration': '\n\n',
           'block': '\n'
       }
   )
   ```
4. **Add tests** in `tests/test_languages.py`
5. **Update documentation** in README.md and this file

## Testing Guidelines

### Unit Tests

- Place tests in `tests/` directory
- Name test files as `test_*.py`
- Use descriptive test function names: `test_function_name_should_do_something`
- Test both success and failure cases
- Mock external dependencies when appropriate

### Integration Tests

- Test end-to-end functionality
- Test with real files when possible
- Test different input formats (files, stdin, Git integration)

### Test Coverage

- Aim for >80% code coverage
- Cover edge cases and error conditions
- Test different file sizes and types

## Code Style

### Python Style

- Follow PEP 8
- Use type hints for all function parameters and return values
- Write descriptive variable and function names
- Keep functions small and focused
- Use docstrings for all public functions/classes

### Commit Messages

- Use conventional commit format
- Keep first line under 50 characters
- Use imperative mood: "Add feature" not "Added feature"
- Reference issue numbers when applicable

### Documentation

- Use Google-style docstrings
- Document all public APIs
- Include examples in docstrings when helpful
- Keep README.md up to date

## Reporting Issues

When reporting bugs or requesting features:

1. Check existing issues first
2. Use issue templates when available
3. Provide clear reproduction steps
4. Include version information and environment details
5. Attach sample files if relevant

## Getting Help

- Check the [documentation](https://othmaneblial.github.io/linediff/)
- Ask questions in GitHub Discussions
- Join our community chat (if available)

## Recognition

Contributors will be recognized in:
- The repository's contributor list
- Release notes for significant contributions
- Our hearts ❤️

Thank you for contributing to Linediff! Your help makes the tool better for everyone. 🎉