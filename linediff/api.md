# API Reference

This document provides technical details about Linediff's internal API for developers who want to integrate or extend the functionality.

## Core Functions

### `linediff.diff.compute_diff`

```python
def compute_diff(left_content: str, right_content: str, left_file_path: Optional[str] = None, right_file_path: Optional[str] = None) -> List[str]:
```

Main entry point for computing diffs between two text contents.

**Parameters:**
- `left_content` (str): Content of the left/first file
- `right_content` (str): Content of the right/second file
- `left_file_path` (Optional[str]): Path to left file for language detection
- `right_file_path` (Optional[str]): Path to right file for language detection

**Returns:**
- `List[str]`: List of diff lines in unified format

**Example:**
```python
from linediff.diff import compute_diff

diff_lines = compute_diff(
    "def hello():\n    print('hello')",
    "def hello():\n    print('world')",
    "old.py",
    "new.py"
)
print('\n'.join(diff_lines))
```

## Parser API

### `linediff.parser.parse_to_tree`

```python
def parse_to_tree(content: str, file_path: Optional[str] = None) -> ListNode:
```

Parse content into a syntax tree using tree-sitter or fallback parsing.

**Parameters:**
- `content` (str): Source code content to parse
- `file_path` (Optional[str]): File path for language detection

**Returns:**
- `ListNode`: Root node of the syntax tree

### `linediff.parser.TreeSitterParser`

Main parser class for syntax-aware parsing.

#### Methods

```python
def detect_language(self, file_path: str) -> Optional[str]:
```
Detect programming language from file extension.

```python
def parse_content(self, content: str, language: Optional[str] = None, file_path: Optional[str] = None) -> ListNode:
```
Parse content with optional language override.

```python
def get_supported_languages(self) -> List[str]:
```
Get list of supported languages.

```python
def is_language_supported(self, language: str) -> bool:
```
Check if a language is supported.

## Data Structures

### `Atom`

```python
@dataclass
class Atom:
    value: str
    position: int
```

Represents an atomic element in the syntax tree (leaf nodes).

### `ListNode`

```python
@dataclass
class ListNode:
    children: List[Union['ListNode', Atom]]
    position: int
```

Represents a list node in the syntax tree (internal nodes with children).

## Diff Engine

### `DiffEngine`

Core diff computation engine.

#### Methods

```python
def build_graph(self, left_tree: ListNode, right_tree: ListNode) -> None:
```
Build the diff graph from two syntax trees.

```python
def dijkstra_shortest_path(self, start: Vertex, end: Vertex) -> List[Edge]:
```
Find optimal diff path using Dijkstra's algorithm.

```python
def fallback_diff(self, left_lines: List[str], right_lines: List[str]) -> List[str]:
```
Fallback to line-based diffing using difflib.

## CLI Interface

### Main Entry Point

```python
def main():
```

Command-line interface entry point. Handles argument parsing and diff computation.

**Supported arguments:**
- `files`: File paths to compare (2 files or 7 for Git external diff)
- `--check-only`: Exit code only mode
- `--language`: Language override
- `--display`: Display mode (unified, side-by-side, inline)

## Language Support

### Supported Languages

Linediff supports the following languages through tree-sitter parsers:

- `python`: Python files (.py, .pyw, .pyi)
- `javascript`: JavaScript/TypeScript (.js, .jsx, .ts, .tsx, .mjs)
- `json`: JSON files (.json, .jsonc)
- `html`: HTML/XML (.html, .htm, .xml)
- `css`: CSS/SCSS (.css, .scss, .sass, .less)
- `rust`: Rust (.rs)
- `go`: Go (.go)
- `java`: Java (.java)

### Adding New Languages

To add support for a new language:

1. Create a `LanguageConfig` in `parser.py`
2. Define atom types, list types, and delimiter types
3. Add tree-sitter parser dependency to `pyproject.toml`

Example:
```python
'kotlin': LanguageConfig(
    name='kotlin',
    extensions=['.kt', '.kts'],
    parser_class=tree_sitter_kotlin.language(),
    atom_types={'string', 'integer', 'identifier'},
    list_types={'source_file', 'function_declaration', 'class_declaration'},
    delimiter_types={
        'function_declaration': '\n\n',
        'class_declaration': '\n\n'
    }
)
```

## Error Handling

Linediff includes robust error handling:

- **Parser failures**: Falls back to line-based diffing
- **Encoding errors**: Graceful handling with warnings
- **Large files**: Automatic fallback for performance (>1000 nodes)
- **Missing dependencies**: Graceful degradation

## Performance Considerations

- **Tree size limits**: Files with >1000 AST nodes use line-based fallback
- **Parser caching**: Tree-sitter parsers are cached for repeated use
- **Memory optimization**: Minimal memory footprint for typical use cases

## Integration Examples

### Custom Diff Tool

```python
from linediff.diff import compute_diff

def custom_diff_tool(file1, file2):
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        diff = compute_diff(f1.read(), f2.read(), file1, file2)
    return '\n'.join(diff)
```

### Syntax Tree Analysis

```python
from linediff.parser import parse_to_tree
from linediff.diff import count_nodes

tree = parse_to_tree(code_string, "file.py")
node_count = count_nodes(tree)
print(f"AST has {node_count} nodes")
```

### Language Detection

```python
from linediff.parser import get_parser

parser = get_parser()
lang = parser.detect_language("script.py")  # Returns 'python'
```

## Constants and Configuration

- `TREE_SITTER_PARSER_AVAILABLE`: Boolean indicating if tree-sitter is available
- `LANGUAGE_CONFIGS`: Dictionary of language configurations
- Default display mode: `'unified'`
- Default language detection: Based on file extension

## Dependencies

### Required
- `typing-extensions` (for Python < 3.10)

### Optional (for syntax-aware diffing)
- `tree-sitter` and language-specific parsers

## Version Information

Current version: 0.1.0 (Alpha)

For the latest API changes, check the [changelog](changelog.md).