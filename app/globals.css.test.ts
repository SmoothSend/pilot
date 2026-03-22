/**
 * Bug Condition Exploration Test for CSS Layout Fix
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 * 
 * Property 1: Bug Condition - Tailwind Utility Classes Missing from Compiled CSS
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test encodes the EXPECTED behavior (what should happen after the fix).
 * When run on UNFIXED code, it will FAIL, proving the bug exists.
 * When run on FIXED code, it will PASS, confirming the fix works.
 * 
 * Scoped PBT Approach: Testing concrete failing cases to ensure reproducibility
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import fs from 'fs';
import path from 'path';

describe('Property 1: Bug Condition - Tailwind Utility Classes Generated and Applied', () => {
  let globalsCssContent: string;
  let compiledCssContent: string;

  beforeAll(() => {
    // Read the globals.css source file
    const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');
    globalsCssContent = fs.readFileSync(globalsCssPath, 'utf-8');

    // Read the compiled CSS from .next/static/chunks/ (Next.js 16 with Turbopack)
    // Note: This requires the Next.js dev server or build to have run
    const nextStaticChunksDir = path.join(process.cwd(), '.next', 'static', 'chunks');
    
    try {
      const cssFiles = fs.readdirSync(nextStaticChunksDir).filter(f => f.endsWith('.css'));
      if (cssFiles.length > 0) {
        // Read all CSS files and concatenate them
        compiledCssContent = cssFiles
          .map(f => fs.readFileSync(path.join(nextStaticChunksDir, f), 'utf-8'))
          .join('\n');
      } else {
        compiledCssContent = '';
      }
    } catch (error) {
      // If .next/static/chunks doesn't exist, the build hasn't run
      compiledCssContent = '';
    }
  });

  /**
   * Test that Tailwind v4 layer imports are present in globals.css
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - globals.css only has @import "tailwindcss"
   * - Missing @import "tailwindcss/theme"
   * - Missing @import "tailwindcss/utilities"
   */
  it('should have Tailwind v4 layer imports in globals.css', () => {
    expect(globalsCssContent).toContain('@import "tailwindcss/theme"');
    expect(globalsCssContent).toContain('@import "tailwindcss/utilities"');
  });

  /**
   * Property-based test: All Tailwind utility classes used in the codebase
   * should be generated in the compiled CSS
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - Utility classes like .w-full, .py-5, .gap-2, .max-w-lg are NOT in compiled CSS
   * 
   * Scoped to concrete failing cases from the bug report
   */
  it('should generate Tailwind utility classes in compiled CSS', () => {
    // These are the specific utility classes mentioned in the bug report
    const requiredUtilityClasses = [
      'w-full',
      'py-5',
      'gap-2',
      'gap-3',
      'max-w-lg',
      'flex',
      'items-center',
      'justify-between',
      'grid',
      'grid-cols-2',
      'space-y-5',
      'space-y-7',
    ];

    // Check that compiled CSS contains these utility classes
    for (const utilityClass of requiredUtilityClasses) {
      // Utility classes appear as .classname in CSS (may be wrapped in :where() or other selectors)
      const cssClassPattern = new RegExp(`\\.${utilityClass.replace(/-/g, '\\-')}`);
      expect(
        compiledCssContent,
        `Expected compiled CSS to contain utility class: .${utilityClass}`
      ).toMatch(cssClassPattern);
    }
  });

  /**
   * Property-based test: Generate random combinations of Tailwind utility classes
   * and verify they exist in compiled CSS
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - Most generated utility classes will NOT be in compiled CSS
   */
  it('should generate all Tailwind utility classes (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          // Width utilities
          'w-full', 'w-1/2', 'w-auto',
          // Padding utilities
          'p-4', 'px-4', 'py-5', 'pt-2', 'pb-3',
          // Margin utilities
          'm-4', 'mx-auto', 'my-2', 'mt-1', 'mb-2',
          // Gap utilities
          'gap-1', 'gap-2', 'gap-3', 'gap-4',
          // Max-width utilities
          'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl',
          // Flex utilities
          'flex', 'flex-col', 'flex-row',
          'items-center', 'items-start', 'items-end',
          'justify-center', 'justify-between', 'justify-around',
          // Grid utilities
          'grid', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3',
          // Spacing utilities
          'space-x-2', 'space-y-2', 'space-y-5', 'space-y-7'
        ),
        (utilityClass) => {
          // Each utility class should exist in the compiled CSS (may be wrapped in :where() or other selectors)
          const cssClassPattern = new RegExp(`\\.${utilityClass.replace(/[/-]/g, '\\$&')}`);
          
          // This assertion will FAIL on unfixed code because utility classes are not generated
          expect(
            compiledCssContent,
            `Utility class .${utilityClass} should be generated in compiled CSS`
          ).toMatch(cssClassPattern);
        }
      ),
      { numRuns: 20 } // Test 20 random utility classes
    );
  });

  /**
   * Test that form inputs would have non-zero width with utility classes
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - .w-full utility class is not generated
   * - Form inputs with className="form-input" (which uses w-full internally) would have 0 width
   */
  it('should generate width utilities for form inputs', () => {
    // The .form-input class in globals.css uses "width: 100%"
    // But if Tailwind utilities are used elsewhere, they should be generated
    expect(compiledCssContent).toMatch(/\.w-full/);
  });

  /**
   * Test that padding utilities are generated for vertical spacing
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - .py-5 utility class is not generated
   * - Elements with py-5 would have 0 padding
   */
  it('should generate padding utilities (py-5) for vertical spacing', () => {
    expect(compiledCssContent).toMatch(/\.py-5/);
  });

  /**
   * Test that gap utilities are generated for flex/grid layouts
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - .gap-2, .gap-3 utility classes are not generated
   * - Elements with gap-* would have no gaps
   */
  it('should generate gap utilities for flex/grid layouts', () => {
    expect(compiledCssContent).toMatch(/\.gap-2/);
    expect(compiledCssContent).toMatch(/\.gap-3/);
  });

  /**
   * Test that max-width utilities are generated for container constraints
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - .max-w-lg utility class is not generated
   * - Form containers would span full width instead of being constrained
   */
  it('should generate max-width utilities (max-w-lg) for containers', () => {
    expect(compiledCssContent).toMatch(/\.max-w-lg/);
  });

  /**
   * Property-based test: Verify that spacing utilities generate correct CSS values
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: FAIL
   * - Spacing utilities are not generated at all
   */
  it('should generate spacing utilities with correct values (property-based)', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom('space-y', 'space-x', 'gap'),
          value: fc.constantFrom('1', '2', '3', '4', '5', '6', '7', '8'),
        }),
        ({ type, value }) => {
          const utilityClass = `${type}-${value}`;
          const cssClassPattern = new RegExp(`\\.${utilityClass.replace(/-/g, '\\-')}`);
          
          // This assertion will FAIL on unfixed code
          expect(
            compiledCssContent,
            `Spacing utility .${utilityClass} should be generated`
          ).toMatch(cssClassPattern);
        }
      ),
      { numRuns: 15 }
    );
  });
});

/**
 * ============================================================================
 * TASK 2: PRESERVATION PROPERTY TESTS
 * ============================================================================
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * Property 2: Preservation - Custom CSS Classes Render Identically
 * 
 * IMPORTANT: These tests follow observation-first methodology
 * - Run on UNFIXED code to establish baseline behavior
 * - EXPECTED OUTCOME: Tests PASS (confirms baseline to preserve)
 * - After fix is applied, these same tests should still PASS
 * 
 * These tests verify that custom CSS classes (buttons, cards, form inputs,
 * animations, design tokens, typography gradients) continue to work exactly
 * as they do now after the Tailwind v4 layer imports fix is applied.
 */

describe('Property 2: Preservation - Custom CSS Classes Render Identically', () => {
  let globalsCssContent: string;

  beforeAll(() => {
    const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');
    globalsCssContent = fs.readFileSync(globalsCssPath, 'utf-8');
  });

  /**
   * Test that button custom classes are defined in globals.css
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .btn-primary, .btn-secondary, .btn-ghost are defined
   */
  it('should preserve button custom classes (.btn-primary, .btn-secondary, .btn-ghost)', () => {
    expect(globalsCssContent).toContain('.btn-primary');
    expect(globalsCssContent).toContain('.btn-secondary');
    expect(globalsCssContent).toContain('.btn-ghost');
  });

  /**
   * Property-based test: Button classes have expected CSS properties
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - Button classes contain display, background, color, padding properties
   */
  it('should preserve button styling properties (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('btn-primary', 'btn-secondary', 'btn-ghost'),
        (buttonClass) => {
          // Find the button class definition in CSS
          const classRegex = new RegExp(`\\.${buttonClass}\\s*\\{[^}]+\\}`, 's');
          const match = globalsCssContent.match(classRegex);
          
          expect(match, `Button class .${buttonClass} should be defined`).toBeTruthy();
          
          if (match) {
            const classDefinition = match[0];
            // Verify essential button properties are present
            expect(classDefinition).toContain('display:');
            expect(classDefinition).toContain('background');
            expect(classDefinition).toContain('color:');
            expect(classDefinition).toContain('padding:');
          }
        }
      ),
      { numRuns: 3 } // Test all 3 button classes
    );
  });

  /**
   * Test that card custom classes are defined in globals.css
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .card, .card-elevated, .card-flat are defined
   */
  it('should preserve card custom classes (.card, .card-elevated, .card-flat)', () => {
    expect(globalsCssContent).toContain('.card');
    expect(globalsCssContent).toContain('.card-elevated');
    expect(globalsCssContent).toContain('.card-flat');
  });

  /**
   * Property-based test: Card classes have expected CSS properties
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - Card classes contain background, border, border-radius, box-shadow
   */
  it('should preserve card styling properties (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('card', 'card-elevated', 'card-flat'),
        (cardClass) => {
          // Find the card class definition in CSS
          const classRegex = new RegExp(`\\.${cardClass}\\s*\\{[^}]+\\}`, 's');
          const match = globalsCssContent.match(classRegex);
          
          expect(match, `Card class .${cardClass} should be defined`).toBeTruthy();
          
          if (match) {
            const classDefinition = match[0];
            // Verify essential card properties are present
            expect(classDefinition).toContain('background');
            expect(classDefinition).toContain('border');
            expect(classDefinition).toContain('border-radius');
            expect(classDefinition).toContain('box-shadow');
          }
        }
      ),
      { numRuns: 3 } // Test all 3 card classes
    );
  });

  /**
   * Test that form input custom class is defined in globals.css
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .form-input is defined with proper styling
   */
  it('should preserve form input custom class (.form-input)', () => {
    expect(globalsCssContent).toContain('.form-input');
    
    // Verify form-input has essential properties
    const formInputRegex = /\.form-input\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(formInputRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const classDefinition = match[0];
      expect(classDefinition).toContain('width: 100%');
      expect(classDefinition).toContain('background');
      expect(classDefinition).toContain('border');
      expect(classDefinition).toContain('padding');
    }
  });

  /**
   * Test that form input focus states are preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .form-input:focus and .form-input:hover are defined
   */
  it('should preserve form input focus and hover states', () => {
    expect(globalsCssContent).toContain('.form-input:hover');
    expect(globalsCssContent).toContain('.form-input:focus');
    
    // Verify focus state has border-color and box-shadow
    const focusRegex = /\.form-input:focus\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(focusRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const focusDefinition = match[0];
      expect(focusDefinition).toContain('border-color');
      expect(focusDefinition).toContain('box-shadow');
    }
  });

  /**
   * Test that animation keyframes are defined in globals.css
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - @keyframes blob-float, fade-up, shimmer-text are defined
   */
  it('should preserve animation keyframes', () => {
    expect(globalsCssContent).toContain('@keyframes blob-float');
    expect(globalsCssContent).toContain('@keyframes fade-up');
    expect(globalsCssContent).toContain('@keyframes shimmer-text');
    expect(globalsCssContent).toContain('@keyframes fade-in');
    expect(globalsCssContent).toContain('@keyframes scale-in');
  });

  /**
   * Property-based test: Animation classes are defined
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .animate-fade-up, .animate-fade-in, .animate-scale-in classes exist
   */
  it('should preserve animation classes (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          'animate-fade-up',
          'animate-fade-in',
          'animate-scale-in',
          'animate-spin',
          'animate-pulse-ring'
        ),
        (animationClass) => {
          expect(
            globalsCssContent,
            `Animation class .${animationClass} should be defined`
          ).toContain(`.${animationClass}`);
          
          // Verify the class has animation property
          const classRegex = new RegExp(`\\.${animationClass.replace('-', '\\-')}\\s*\\{[^}]+\\}`, 's');
          const match = globalsCssContent.match(classRegex);
          
          expect(match, `Animation class .${animationClass} should have definition`).toBeTruthy();
          if (match) {
            expect(match[0]).toContain('animation');
          }
        }
      ),
      { numRuns: 5 } // Test all 5 animation classes
    );
  });

  /**
   * Test that CSS custom properties (design tokens) are defined
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - :root block contains --primary, --background, --foreground, etc.
   */
  it('should preserve CSS custom properties (design tokens)', () => {
    expect(globalsCssContent).toContain(':root');
    expect(globalsCssContent).toContain('--primary:');
    expect(globalsCssContent).toContain('--background:');
    expect(globalsCssContent).toContain('--foreground:');
    expect(globalsCssContent).toContain('--border:');
    expect(globalsCssContent).toContain('--success:');
    expect(globalsCssContent).toContain('--destructive:');
  });

  /**
   * Property-based test: Design tokens have expected values
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - Design tokens are defined with color values
   */
  it('should preserve design token values (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { token: '--primary', expectedPattern: /#[0-9A-Fa-f]{6}/ },
          { token: '--background', expectedPattern: /#[0-9A-Fa-f]{6}/ },
          { token: '--foreground', expectedPattern: /#[0-9A-Fa-f]{6}/ },
          { token: '--success', expectedPattern: /#[0-9A-Fa-f]{6}/ },
          { token: '--destructive', expectedPattern: /#[0-9A-Fa-f]{6}/ }
        ),
        ({ token, expectedPattern }) => {
          // Find the token definition
          const tokenRegex = new RegExp(`${token}:\\s*([^;]+);`);
          const match = globalsCssContent.match(tokenRegex);
          
          expect(match, `Design token ${token} should be defined`).toBeTruthy();
          if (match) {
            const tokenValue = match[1].trim();
            expect(
              tokenValue,
              `Design token ${token} should have a color value`
            ).toMatch(expectedPattern);
          }
        }
      ),
      { numRuns: 5 } // Test 5 key design tokens
    );
  });

  /**
   * Test that typography gradient classes are defined
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .text-gradient-white, .text-gradient-primary are defined
   */
  it('should preserve typography gradient classes', () => {
    expect(globalsCssContent).toContain('.text-gradient-white');
    expect(globalsCssContent).toContain('.text-gradient-primary');
    expect(globalsCssContent).toContain('.text-gradient-cyan');
  });

  /**
   * Property-based test: Typography gradient classes have gradient properties
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - Gradient classes contain background, background-clip, -webkit-text-fill-color
   */
  it('should preserve typography gradient properties (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('text-gradient-white', 'text-gradient-primary', 'text-gradient-cyan'),
        (gradientClass) => {
          // Find the gradient class definition
          const classRegex = new RegExp(`\\.${gradientClass}\\s*\\{[^}]+\\}`, 's');
          const match = globalsCssContent.match(classRegex);
          
          expect(match, `Gradient class .${gradientClass} should be defined`).toBeTruthy();
          
          if (match) {
            const classDefinition = match[0];
            // Verify gradient properties are present
            expect(classDefinition).toContain('background');
            expect(classDefinition).toContain('background-clip');
            expect(classDefinition).toContain('-webkit-text-fill-color');
          }
        }
      ),
      { numRuns: 3 } // Test all 3 gradient classes
    );
  });

  /**
   * Test that background system classes are defined
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .page-bg, .blob-primary, .blob-secondary, .blob-tertiary are defined
   */
  it('should preserve background system classes', () => {
    expect(globalsCssContent).toContain('.page-bg');
    expect(globalsCssContent).toContain('.blob-primary');
    expect(globalsCssContent).toContain('.blob-secondary');
    expect(globalsCssContent).toContain('.blob-tertiary');
  });

  /**
   * Property-based test: Background blob classes have animation
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - Blob classes contain animation: blob-float
   */
  it('should preserve background blob animations (property-based)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('blob-primary', 'blob-secondary', 'blob-tertiary'),
        (blobClass) => {
          // Find the blob class definition
          const classRegex = new RegExp(`\\.${blobClass}\\s*\\{[^}]+\\}`, 's');
          const match = globalsCssContent.match(classRegex);
          
          expect(match, `Blob class .${blobClass} should be defined`).toBeTruthy();
          
          if (match) {
            const classDefinition = match[0];
            // Verify blob has animation property
            expect(classDefinition).toContain('animation');
            expect(classDefinition).toContain('blob-float');
          }
        }
      ),
      { numRuns: 3 } // Test all 3 blob classes
    );
  });

  /**
   * Test that @theme block is preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - @theme block exists with color and font definitions
   */
  it('should preserve @theme block with Tailwind v4 theme tokens', () => {
    expect(globalsCssContent).toContain('@theme');
    expect(globalsCssContent).toContain('--color-background');
    expect(globalsCssContent).toContain('--color-foreground');
    expect(globalsCssContent).toContain('--color-primary');
    expect(globalsCssContent).toContain('--font-sans');
    expect(globalsCssContent).toContain('--font-mono');
  });

  /**
   * Test that layout utility classes are preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .container-main is defined
   */
  it('should preserve layout utility classes (.container-main)', () => {
    expect(globalsCssContent).toContain('.container-main');
    
    // Verify container-main has max-width and margin
    const containerRegex = /\.container-main\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(containerRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const classDefinition = match[0];
      expect(classDefinition).toContain('max-width');
      expect(classDefinition).toContain('margin');
    }
  });

  /**
   * Test that form label and hint classes are preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .form-label, .form-hint are defined
   */
  it('should preserve form label and hint classes', () => {
    expect(globalsCssContent).toContain('.form-label');
    expect(globalsCssContent).toContain('.form-hint');
  });

  /**
   * Test that radio option custom class is preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .radio-option is defined with proper styling
   */
  it('should preserve radio option custom class (.radio-option)', () => {
    expect(globalsCssContent).toContain('.radio-option');
    
    // Verify radio-option has essential properties
    const radioRegex = /\.radio-option\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(radioRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const classDefinition = match[0];
      expect(classDefinition).toContain('width');
      expect(classDefinition).toContain('padding');
      expect(classDefinition).toContain('border-radius');
      expect(classDefinition).toContain('background');
      expect(classDefinition).toContain('border');
    }
  });

  /**
   * Test that badge custom class is preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .badge is defined
   */
  it('should preserve badge custom class (.badge)', () => {
    expect(globalsCssContent).toContain('.badge');
    
    // Verify badge has essential properties
    const badgeRegex = /\.badge\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(badgeRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const classDefinition = match[0];
      expect(classDefinition).toContain('display');
      expect(classDefinition).toContain('padding');
      expect(classDefinition).toContain('border-radius');
      expect(classDefinition).toContain('font-size');
    }
  });

  /**
   * Property-based test: All custom component classes remain unchanged
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - Comprehensive check that all custom classes are present
   */
  it('should preserve all custom component classes (comprehensive property-based)', () => {
    const customClasses = [
      'btn-primary', 'btn-secondary', 'btn-ghost',
      'card', 'card-elevated', 'card-flat',
      'form-input', 'form-label', 'form-hint',
      'radio-option', 'badge',
      'page-bg', 'blob-primary', 'blob-secondary', 'blob-tertiary',
      'text-gradient-white', 'text-gradient-primary', 'text-gradient-cyan',
      'label-mono', 'container-main', 'section-divider',
      'animate-fade-up', 'animate-fade-in', 'animate-scale-in',
      'row-hover'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...customClasses),
        (customClass) => {
          expect(
            globalsCssContent,
            `Custom class .${customClass} should be preserved in globals.css`
          ).toContain(`.${customClass}`);
        }
      ),
      { numRuns: customClasses.length } // Test all custom classes
    );
  });

  /**
   * Test that animation delay classes are preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - .delay-100, .delay-200, etc. are defined
   */
  it('should preserve animation delay classes', () => {
    expect(globalsCssContent).toContain('.delay-100');
    expect(globalsCssContent).toContain('.delay-200');
    expect(globalsCssContent).toContain('.delay-300');
    expect(globalsCssContent).toContain('.delay-400');
    expect(globalsCssContent).toContain('.delay-500');
    expect(globalsCssContent).toContain('.delay-600');
  });

  /**
   * Test that @layer base block is preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - @layer base block exists with reset styles
   */
  it('should preserve @layer base block with reset styles', () => {
    expect(globalsCssContent).toContain('@layer base');
    
    // Verify base layer has essential reset styles
    const baseLayerRegex = /@layer base\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(baseLayerRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const baseLayerContent = match[0];
      expect(baseLayerContent).toContain('box-sizing');
    }
    
    // Check that focus-visible styles exist (may be outside the first block)
    expect(globalsCssContent).toContain('*:focus-visible');
  });

  /**
   * Test that scrollbar styles are preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - ::-webkit-scrollbar styles are defined
   */
  it('should preserve scrollbar custom styles', () => {
    expect(globalsCssContent).toContain('::-webkit-scrollbar');
    expect(globalsCssContent).toContain('::-webkit-scrollbar-track');
    expect(globalsCssContent).toContain('::-webkit-scrollbar-thumb');
  });

  /**
   * Test that prefers-reduced-motion media query is preserved
   * 
   * EXPECTED OUTCOME ON UNFIXED CODE: PASS
   * - @media (prefers-reduced-motion: reduce) block exists
   */
  it('should preserve prefers-reduced-motion accessibility feature', () => {
    expect(globalsCssContent).toContain('@media (prefers-reduced-motion: reduce)');
    
    // Verify reduced motion block has animation overrides
    const reducedMotionRegex = /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]+\}/s;
    const match = globalsCssContent.match(reducedMotionRegex);
    
    expect(match).toBeTruthy();
    if (match) {
      const reducedMotionContent = match[0];
      expect(reducedMotionContent).toContain('animation-duration');
      expect(reducedMotionContent).toContain('transition-duration');
    }
  });
});
