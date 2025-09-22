# Changelog

All notable changes to Linediff will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Linediff
- Syntax-aware diffing using tree-sitter parsers
- Support for Python, JavaScript, JSON, HTML, CSS, Rust, Go, and Java
- Multiple display modes: unified, side-by-side, inline
- Git integration with external diff support
- CI/CD check-only mode
- Robust fallback to line-based diffing
- Cross-platform support (Linux, macOS, Windows)

### Technical Details
- Core diff engine with graph-based structural diffing
- Dijkstra's algorithm for optimal diff computation
- Tree-sitter integration for syntax parsing
- Comprehensive test suite
- Type hints and documentation

## [0.1.0] - 2024-01-XX

### Added
- Initial alpha release
- Basic syntax-aware diffing for supported languages
- Command-line interface with multiple options
- Git external diff integration
- Performance optimizations for large files
- Comprehensive documentation

### Dependencies
- Python 3.8+ support
- Tree-sitter parsers for syntax awareness
- Minimal core dependencies for broad compatibility

---

## Version History

### Pre-1.0 Releases

This project follows semantic versioning. Versions 0.x.x may contain breaking changes as the API stabilizes.

### Contributing to Changelog

When contributing changes:

1. Add entries under `[Unreleased]` section
2. Categorize changes as:
   - `Added` for new features
   - `Changed` for changes in existing functionality
   - `Deprecated` for soon-to-be removed features
   - `Removed` for now removed features
   - `Fixed` for any bug fixes
   - `Security` for vulnerability fixes

3. Reference issue/PR numbers when applicable
4. Keep descriptions clear and concise

Example:
```
### Added
- New feature description (#123)

### Fixed
- Bug fix description (#124)
```

## Future Plans

### Planned for v0.2.0
- Enhanced display modes
- Color output support
- Patch application capabilities
- Three-way merge support
- Additional language support

### Long-term Vision
- Advanced semantic diffing
- IDE integrations
- Web interface
- Plugin system for custom parsers

---

For the latest updates, check the [GitHub repository](https://github.com/othmaneblial/linediff).