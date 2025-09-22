# Examples

This page provides detailed examples of using Linediff in various scenarios.

## Basic File Comparison

### Python Function Evolution

**Before (old.py):**
```python
def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total
```

**After (new.py):**
```python
def calculate_total(items, tax_rate=0.08):
    """Calculate total with tax."""
    subtotal = sum(item.price for item in items)
    tax = subtotal * tax_rate
    return subtotal + tax
```

**Command:**
```bash
linediff old.py new.py
```

**Output:**
```diff
--- old.py
+++ new.py
@@ -1,5 +1,6 @@
-def calculate_total(items):
-    total = 0
-    for item in items:
-        total += item.price
-    return total
+def calculate_total(items, tax_rate=0.08):
+    """Calculate total with tax."""
+    subtotal = sum(item.price for item in items)
    tax = subtotal * tax_rate
    return subtotal + tax
```

## JavaScript Object Changes

**Before (config.js):**
```javascript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};
```

**After (config.js):**
```javascript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 10000,
  retries: 3,
  headers: {
    "Authorization": "Bearer token"
  }
};
```

**Command:**
```bash
linediff config_old.js config_new.js
```

**Output:**
```diff
--- config_old.js
+++ config_new.js
@@ -1,5 +1,8 @@
 const config = {
   apiUrl: "https://api.example.com",
-  timeout: 5000,
+  timeout: 10000,
   retries: 3,
+  headers: {
+    "Authorization": "Bearer token"
+  }
 };
```

## JSON Configuration Updates

**Before (config.json):**
```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "features": ["auth", "logging"]
}
```

**After (config.json):**
```json
{
  "database": {
    "host": "prod-db.example.com",
    "port": 5432,
    "ssl": true
  },
  "features": ["auth", "logging", "metrics"]
}
```

**Command:**
```bash
linediff config_old.json config_new.json
```

**Output:**
```diff
--- config_old.json
+++ config_new.json
@@ -1,6 +1,8 @@
 {
   "database": {
-    "host": "localhost",
+    "host": "prod-db.example.com",
     "port": 5432,
+    "ssl": true
   },
   "features": ["auth", "logging", "metrics"]
 }
```

## Git Integration Examples

### Review Changes in Git

```bash
# See changes in working directory
git diff | linediff

# Compare specific commits
git diff HEAD~1 HEAD | linediff

# Compare branches
git diff main feature-branch | linediff
```

### Side-by-Side View

```bash
# View changes side by side
linediff --display side-by-side old.py new.py
```

### Check-Only Mode for CI/CD

```bash
# In a CI script
if linediff --check-only expected_output.py generated.py; then
    echo "✅ Generated code matches expected output"
else
    echo "❌ Generated code differs from expected"
    exit 1
fi
```

## Language-Specific Examples

### HTML Template Changes

**Command:**
```bash
linediff template_old.html template_new.html
```

### CSS Stylesheet Updates

**Command:**
```bash
linediff styles_old.css styles_new.css
```

### Rust Code Changes

**Command:**
```bash
linediff lib_old.rs lib_new.rs
```

## Advanced Usage Examples

### Override Language Detection

```bash
# Force JavaScript parsing for a .txt file
linediff --language javascript code.txt code2.txt
```

### Inline Display Mode

```bash
# Highlighted changes in unified format
linediff --display inline old.py new.py
```

### Reading from Standard Input

```bash
# Create test input
echo "old content
---
new content" | linediff
```

### Git External Diff Setup

```bash
# Configure Git to use Linediff
git config --global diff.external linediff

# Now all git diff commands use Linediff
git diff
git diff --cached
git diff HEAD~1
```

### Project Configuration (.gitattributes)

Create a `.gitattributes` file in your repository:

```gitattributes
# Use Linediff for these file types
*.py diff=linediff
*.js diff=linediff
*.ts diff=linediff
*.json diff=linediff
*.html diff=linediff
*.css diff=linediff
*.rs diff=linediff
*.go diff=linediff
*.java diff=linediff
```

## Real-World Scenarios

### Code Review Workflow

```bash
# Developer workflow
git checkout -b feature/new-functionality
# Make changes...
git diff  # Uses Linediff automatically if configured

# Reviewer workflow
git checkout feature/new-functionality
git diff main...HEAD | linediff --display side-by-side
```

### Automated Testing

```bash
# Test that generated code matches expected
linediff --check-only tests/expected_output.py generated.py

# Exit code 0 = files identical
# Exit code 1 = files differ
```

### Documentation Updates

```bash
# Check documentation changes
linediff docs/README_old.md docs/README_new.md
```

### Configuration Management

```bash
# Compare environment configurations
linediff config/dev.json config/prod.json

# Check deployment configuration changes
linediff k8s/deployment_old.yaml k8s/deployment_new.yaml
```

## Performance Examples

### Large Files

Linediff automatically handles large files efficiently:

```bash
# Large Python file (>1000 AST nodes)
linediff large_old.py large_new.py  # Falls back to line-based diffing
```

### Multiple Files

```bash
# Compare multiple files in a loop
for file in *.py; do
    if ! linediff --check-only "$file" "backup/$file"; then
        echo "$file has changed"
    fi
done
```

## Integration with Other Tools

### With fzf (Fuzzy Finder)

```bash
# Interactive file selection
git diff --name-only | fzf | xargs linediff
```

### With diff-so-fancy

```bash
# Use Linediff for syntax awareness, then pipe to diff-so-fancy
linediff old.py new.py | diff-so-fancy
```

### With Git Aliases

Add to your `~/.gitconfig`:

```ini
[alias]
ld = !git diff | linediff
lds = !git diff | linediff --display side-by-side
```

Then use:
```bash
git ld    # Unified diff with Linediff
git lds   # Side-by-side diff with Linediff
```

## Troubleshooting Examples

### Debug Language Detection

```bash
# Check what language is detected
linediff --language python file.txt file2.txt  # Force Python
```

### Handle Encoding Issues

```bash
# Linediff handles UTF-8 automatically
linediff file_with_unicode.py another_file.py
```

### Large File Optimization

```bash
# For very large files, Linediff optimizes automatically
linediff huge_file.py huge_file_v2.py  # Uses line-based fallback
```

## Custom Scripting

### Python Script Integration

```python
#!/usr/bin/env python3
import sys
from linediff.diff import compute_diff

def compare_files(file1, file2):
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        diff_lines = compute_diff(f1.read(), f2.read(), file1, file2)
    return diff_lines

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python compare.py file1 file2")
        sys.exit(1)

    diffs = compare_files(sys.argv[1], sys.argv[2])
    for line in diffs:
        print(line)
```

### Shell Script Wrapper

```bash
#!/bin/bash
# Wrapper script for Linediff with custom formatting

if [ $# -ne 2 ]; then
    echo "Usage: $0 file1 file2"
    exit 1
fi

echo "=== Linediff Comparison ==="
echo "Comparing: $1 vs $2"
echo

linediff "$1" "$2"

echo
echo "=== End Comparison ==="
```

These examples demonstrate the versatility of Linediff across different use cases and integration scenarios.