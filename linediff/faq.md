# Frequently Asked Questions

## General Questions

### What is Linediff?

Linediff is a blazing-fast, syntax-aware diff tool that understands your code structure. Using advanced tree-sitter parsers, it generates meaningful diffs that highlight actual changes rather than just line differences. It's designed for developers who want smarter, more insightful code comparisons.

### How is Linediff different from traditional diff tools?

Traditional diff tools like `diff` or `git diff` compare files line by line. Linediff understands the syntax structure of your code, so it can show more meaningful differences. For example, it knows that moving a function parameter is different from completely changing the function.

### Is Linediff a replacement for Git?

No, Linediff enhances Git by providing better diff visualization. It integrates seamlessly with Git as an external diff tool.

## Installation

### Do I need to install tree-sitter parsers?

No, but they're highly recommended for syntax-aware diffing. Without them, Linediff gracefully falls back to smart line-based diffing.

### Can I install Linediff without admin privileges?

Yes, use `pip install --user linediff` or install in a virtual environment.

### Why do I get import errors after installation?

Ensure you've installed the optional tree-sitter dependencies: `pip install linediff[tree-sitter]`

## Usage

### How do I use Linediff with Git?

```bash
# One-time setup
git config --global diff.external linediff

# Now all git diff commands use Linediff
git diff
```

### What display modes are available?

- **Unified** (default): Traditional diff format
- **Side-by-side**: Changes shown next to each other
- **Inline**: Highlighted changes in unified format

### Can Linediff handle binary files?

Linediff works with text files. Git will handle binary files appropriately when Linediff is configured as external diff.

### How does Linediff handle large files?

Linediff automatically optimizes for large files (>1000 AST nodes) by falling back to line-based diffing for performance.

## Language Support

### Which languages does Linediff support?

Linediff supports syntax-aware diffing for:
- Python (.py, .pyw, .pyi)
- JavaScript/TypeScript (.js, .jsx, .ts, .tsx, .mjs)
- JSON (.json, .jsonc)
- HTML/XML (.html, .htm, .xml)
- CSS/SCSS/Sass/Less (.css, .scss, .sass, .less)
- Rust (.rs)
- Go (.go)
- Java (.java)

For unsupported languages, Linediff uses smart line-based diffing.

### Can I add support for a new language?

Yes! See the [contributing guide](contributing.md) for instructions on adding new language support.

### What if Linediff doesn't detect my language correctly?

Override language detection with the `--language` flag:

```bash
linediff --language javascript file.txt file2.txt
```

## Performance

### Is Linediff fast?

Yes! Linediff is optimized for performance:
- Small files (< 1KB): 2-5x faster than traditional diff
- Medium files (1KB - 100KB): Comparable speed with syntax intelligence
- Large files (> 100KB): Smart fallback to line-based diffing

### How much memory does Linediff use?

Linediff has minimal memory footprint for typical use cases and automatically optimizes for large files.

## Troubleshooting

### Linediff shows regular line diffs instead of syntax-aware diffs

Ensure tree-sitter parsers are installed:

```bash
pip install linediff[tree-sitter]
```

### I get encoding errors

Linediff expects UTF-8 encoded files. Convert your files to UTF-8 or ensure they're saved with UTF-8 encoding.

### Git diff doesn't use Linediff

Verify your Git configuration:

```bash
git config --global diff.external
# Should show "linediff"
```

### Performance is slow on large files

This is expected behavior. Linediff automatically falls back to line-based diffing for large files to maintain performance.

### Linediff crashes with "parser failed"

This usually means tree-sitter parsing failed. Linediff will automatically fall back to line-based diffing. Check the warning message for details.

## Development

### How do I contribute to Linediff?

See our [contributing guide](contributing.md) for detailed instructions.

### Can I use Linediff programmatically?

Yes, Linediff provides a Python API. See the [API reference](api.md) for details.

### How do I run the test suite?

```bash
# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run with coverage
pytest --cov=linediff
```

## Compatibility

### Which Python versions are supported?

Linediff supports Python 3.8 and higher.

### Does Linediff work on Windows?

Yes, Linediff works on Windows, macOS, and Linux.

### Can I use Linediff in CI/CD pipelines?

Absolutely! Use the `--check-only` flag for automated checks:

```bash
linediff --check-only file1.py file2.py
echo $?  # 0 = identical, 1 = different
```

## Advanced Questions

### How does Linediff's algorithm work?

Linediff uses a graph-based structural diffing algorithm:

1. Parse both files into Abstract Syntax Trees (ASTs) using tree-sitter
2. Build a diff graph representing possible changes
3. Use Dijkstra's algorithm to find the optimal diff path
4. Format the result according to the chosen display mode

### What are the limitations?

- Currently in alpha (v0.1.0)
- Large files automatically fall back to line-based diffing
- Requires tree-sitter parsers for syntax awareness
- Text files only (no binary file support)

### What's planned for future versions?

- Enhanced display modes with colors
- Patch application capabilities
- Three-way merge support
- Additional language parsers
- IDE integrations

## Getting Help

### Where can I get help?

- Check this FAQ
- Review the [documentation](https://othmaneblial.github.io/linediff/)
- Search existing [GitHub issues](https://github.com/othmaneblial/linediff/issues)
- Create a new issue if needed

### How do I report bugs?

1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Python version, Linediff version)

### Can I suggest features?

Yes! Create a GitHub issue labeled "enhancement" with your feature request.

---

If your question isn't answered here, please check the [GitHub repository](https://github.com/othmaneblial/linediff) or create an issue.