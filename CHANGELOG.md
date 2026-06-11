# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-11

### Added
- Complete file structure reorganization (separated CSS, JS modules, HTML).
- Toast notification system for success and error handling.
- Drag-and-drop sortable interface with empty state toggling.
- `PDFGenerator` class for encapsulated jsPDF logic.
- ARIA accessibility improvements.
- Professional open-source documentation (`README.md`, `CONTRIBUTING.md`, etc.).

### Fixed
- Fixed critical bug where PDF orientation reassignment caused a crash.
- Fixed duplicate image upload handling.
- Addressed memory leaks with `URL.revokeObjectURL()`.
