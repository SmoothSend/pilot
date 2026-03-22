# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Tailwind Utility Classes Missing from Compiled CSS
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: For deterministic bugs, scope the property to the concrete failing case(s) to ensure reproducibility
  - Test that Tailwind utility classes (`w-full`, `py-5`, `gap-2`, `max-w-lg`) are present in compiled CSS output
  - Test that form inputs with utility classes have non-zero computed width
  - Test that elements with `py-5` have computed padding-top and padding-bottom values
  - Test that elements with `gap-2` have computed gap values
  - Test that elements with `max-w-lg` have computed max-width values
  - The test assertions should match the Expected Behavior Properties from design (Property 1: Bug Condition)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: which utility classes are missing, which elements have zero dimensions
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Custom CSS Classes Render Identically
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for custom CSS classes (`.card`, `.btn-primary`, `.form-input`, `.page-bg`, `.text-gradient-white`, animations)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test that `.btn-primary`, `.btn-secondary`, `.btn-ghost` buttons render with correct computed styles
  - Test that `.card`, `.card-elevated`, `.card-flat` components render with correct background, border, and box-shadow
  - Test that `.form-input` custom styles (background, border, focus states) work correctly
  - Test that animations (`.animate-fade-up`, `.blob-float`, `.shimmer-text`) execute correctly
  - Test that CSS custom properties (`--primary`, `--background`, `--foreground`) are applied correctly
  - Test that `.text-gradient-white`, `.text-gradient-primary` render with correct gradient effects
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for missing Tailwind v4 layer imports

  - [x] 3.1 Implement the fix
    - Replace `@import "tailwindcss";` with explicit Tailwind v4 layer imports
    - Add `@import "tailwindcss/theme"` after Google Fonts import to generate theme layer
    - Add `@import "tailwindcss/utilities"` after theme import to generate utility classes
    - Verify import order: Google Fonts → Tailwind theme → Tailwind utilities → Custom CSS
    - Preserve all existing custom CSS (design tokens, component classes, animations, keyframes)
    - _Bug_Condition: isBugCondition(element) where element.className contains Tailwind utility classes AND those classes are not in generatedCSS AND missingLayerImports(globals.css) == true_
    - _Expected_Behavior: All Tailwind utility classes used in JSX are generated in compiled CSS and applied correctly to elements, causing form inputs to be visible with proper dimensions, layout elements to have correct spacing and centering, and gaps to appear between elements_
    - _Preservation: All custom CSS classes (`.card`, `.btn-primary`, `.form-input`, `.page-bg`, `.text-gradient-white`, animations, design tokens) produce exactly the same visual result as before the fix_
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Tailwind Utility Classes Generated and Applied
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify that Tailwind utility classes now exist in compiled CSS
    - Verify that form inputs have non-zero width and are visible
    - Verify that elements with `py-*` classes have correct padding values
    - Verify that elements with `gap-*` classes have correct gap values
    - Verify that elements with `max-w-*` classes have correct max-width values
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Custom CSS Classes Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all custom CSS classes continue to render identically
    - Confirm animations continue to work correctly
    - Confirm design tokens continue to be applied correctly
    - Confirm no visual regressions for any custom components
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
