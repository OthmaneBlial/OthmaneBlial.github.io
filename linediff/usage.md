# Usage Guide

This guide covers all the ways to use Linediff for comparing files and integrating with your workflow.

## Basic Usage

### Comparing Two Files

The simplest way to use Linediff is to compare two files:

```bash
linediff file1.py file2.py
```

This will output a unified diff showing the differences between the two files.

### Command Line Options

```bash
linediff [OPTIONS] FILE1 FILE2
```

#### Options

- `--check-only`: Check if files are identical (returns exit code 0 if same, 1 if different)
- `--language LANG`: Override automatic language detection
- `--display MODE`: Display mode - `unified` (default), `side-by-side`, or `inline`
- `--help`: Show help message

## Display Modes

### Unified (Default)

Traditional diff format with context:

```bash
linediff file1.py file2.py
```

Output:
```diff
--- file1.py
+++ file2.py
@@ -1,5 +1,6 @@
 def calculate_total(items):
-    total = 0
-    for item in items:
-        total += item.price
-    return total
+def calculate_total(items, tax_rate=0.08):
+    """Calculate total with tax."""
+    subtotal = sum(item.price for item in items)
+    tax = subtotal * tax_rate
+    return subtotal + tax
```

### Side-by-Side

See changes next to each other:

```bash
linediff --display side-by-side file1.py file2.py
```

### Inline

Highlighted changes in unified format:

```bash
linediff --display inline file1.py file2.py
```

## Git Integration

### Basic Git Diff Replacement

Replace Git's default diff tool:

```bash
git config --global diff.external linediff
```

Now `git diff` will use Linediff automatically.

### Language-Specific Configuration

Set up Linediff for specific file types:

```bash
git config --global diff.linediff.command "linediff --language python"
git config --global diff.linediff.binary false
```

### Project-Wide Configuration

Add to your `.gitattributes` file:

```gitattributes
*.py diff=linediff
*.js diff=linediff
*.json diff=linediff
*.html diff=linediff
*.css diff=linediff
```

## CI/CD Integration

### Check-Only Mode

Use in automated pipelines to check for differences:

```bash
linediff --check-only file1.py file2.py
echo $?  # 0 = identical, 1 = different
```

Example in a CI script:

```bash
#!/bin/bash
if linediff --check-only generated.py expected.py; then
    echo "✅ Files match expected output"
else
    echo "❌ Files differ from expected output"
    exit 1
fi
```

## Reading from Standard Input

### From Git Diff Output

Pipe Git diff output through Linediff:

```bash
git diff | linediff
```

### From Stdin with Separator

Provide content via stdin with a separator:

```bash
cat > /tmp/diff_input << 'EOF'
old content here
---
new content here
EOF

linediff < /tmp/diff_input
```

## Language Override

Override automatic language detection:

```bash
linediff --language javascript file1.txt file2.txt
```

Supported languages: python, javascript, json, html, css, rust, go, java

## Advanced Usage

### Large Files

Linediff automatically optimizes for large files (>1000 nodes) by falling back to line-based diffing for performance.

### Binary Files

Linediff works with text files. For binary files, Git will handle them appropriately when configured as external diff.

### Error Handling

Linediff gracefully handles:
- Missing files
- Encoding errors
- Parser failures (falls back to line-based diffing)
- Large files (automatic optimization)

## Examples

### Python Code Review

```bash
# Compare two versions of a function
linediff old_version.py new_version.py
```

### Configuration Files

```bash
# Check JSON config changes
linediff --language json config.old.json config.new.json
```

### Web Development

```bash
# Compare HTML templates
linediff template.old.html template.new.html

# Compare CSS stylesheets
linediff styles.old.css styles.new.css
```

## Performance Tips

1. **Install only needed parsers**: `pip install tree-sitter-python tree-sitter-javascript` instead of all
2. **Let auto-detection work**: Don't override language unless necessary
3. **Use check-only mode**: For CI/CD when you only need to know if files differ
4. **Side-by-side for reviews**: Use when reviewing changes interactively

## Troubleshooting

### No Syntax Highlighting

If diffs look like regular line diffs, ensure tree-sitter parsers are installed:

```bash
pip install linediff[tree-sitter]
```

### Wrong Language Detected

Override with `--language`:

```bash
linediff --language python file.js file2.js
```

### Performance Issues

For very large files, Linediff automatically falls back to line-based diffing. If you need syntax-aware diffing for large files, consider splitting them.

## Next Steps

- [API Reference](api.md) - For programmatic usage
- [Examples](examples.md) - More detailed examples
- [Contributing](contributing.md) - How to contribute