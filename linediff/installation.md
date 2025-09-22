# Installation Guide

This guide will help you install Linediff on your system.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation Methods

### From PyPI (Recommended)

The easiest way to install Linediff is from PyPI:

```bash
pip install linediff
```

This installs the basic version with line-based diffing. For full syntax-aware functionality, continue to the next section.

### With Syntax Parsers (Full Features)

To unlock Linediff's full potential with syntax-aware diffing, install with tree-sitter parsers:

```bash
# Install all supported language parsers
pip install linediff[tree-sitter]

# Or install specific parsers for your languages
pip install tree-sitter-python tree-sitter-javascript tree-sitter-json
```

**Supported parsers:**
- `tree-sitter-python` - Python syntax parsing
- `tree-sitter-javascript` - JavaScript/TypeScript parsing
- `tree-sitter-json` - JSON parsing
- `tree-sitter-html` - HTML/XML parsing
- `tree-sitter-css` - CSS/SCSS parsing
- `tree-sitter-rust` - Rust parsing
- `tree-sitter-go` - Go parsing
- `tree-sitter-java` - Java parsing

### From Source (Development)

If you want to contribute or need the latest development version:

```bash
# Clone the repository
git clone https://github.com/othmaneblial/linediff.git
cd linediff

# Install in development mode
pip install -e .

# Or with all development dependencies
pip install -e ".[dev,tree-sitter]"
```

## Verification

After installation, verify Linediff is working:

```bash
linediff --help
```

You should see the help output with available options.

## System Requirements

### Minimum Requirements
- Python 3.8+
- 50 MB RAM
- Any modern operating system (Linux, macOS, Windows)

### Recommended Requirements
- Python 3.9+
- 100 MB RAM (for large files)
- Tree-sitter parsers installed for syntax-aware diffing

## Platform-Specific Notes

### Linux
No additional setup required. Works out of the box.

### macOS
No additional setup required. Works out of the box.

### Windows
- Ensure Python is added to your PATH
- Use Command Prompt, PowerShell, or Windows Terminal
- For best experience, use Windows Terminal with UTF-8 encoding

## Troubleshooting

### Import Errors
If you get tree-sitter import errors, ensure you installed the optional dependencies:

```bash
pip install linediff[tree-sitter]
```

### Permission Errors
If you get permission errors during installation, try:

```bash
# Install for current user only
pip install --user linediff

# Or use a virtual environment
python -m venv linediff-env
source linediff-env/bin/activate  # On Windows: linediff-env\Scripts\activate
pip install linediff
```

### Python Version Issues
Ensure you're using Python 3.8 or higher:

```bash
python --version
```

If you have multiple Python versions, specify the correct one:

```bash
python3.9 -m pip install linediff
```

## Next Steps

Once installed, check out the [usage guide](usage.md) to learn how to use Linediff effectively.