import { LabelTemplateType } from '../types';
import { DymoOrientationType, DymoModelType } from '../components/ChargerDymoLabel';

export type BrotherOrientationType = 'horizontal' | 'rotate90' | 'rotate270';

export interface PrintPageConfig {
  template: LabelTemplateType;
  dymoModel?: DymoModelType;
  dymoOrientation?: DymoOrientationType;
  brotherTapeLength?: string;
  brotherOrientation?: BrotherOrientationType;
}

/**
 * Generates 100% valid W3C CSS Paged Media rules.
 * CRITICAL FIXES FOR CHROME & BROWSER PRINT SUBSYSTEM:
 * 1. Do NOT put "!important" inside @page descriptors (it invalidates the descriptor).
 * 2. Do NOT mix explicit length dimensions with orientation keywords like "2.0in 0.7in landscape" (syntax error).
 * 3. Use dedicated stylesheet in document.head so the browser print engine registers size before print dialog opens.
 */
export function generatePrintPageCss(config: PrintPageConfig): string {
  const {
    template,
    dymoModel = '30857',
    dymoOrientation = 'rotate90',
    brotherTapeLength = '2.0in',
    brotherOrientation = 'horizontal',
  } = config;

  const isDymo30857 = dymoModel === '30857';
  const isDymoTemplate = template === 'charger-dymo' || template === 'staff-dymo';
  const isBrotherPTouch = template === 'brother-ptouch';

  let pageRule = '';

  if (isBrotherPTouch) {
    // Brother PT-2730 0.7" Tape
    const isRotated = brotherOrientation === 'rotate90' || brotherOrientation === 'rotate270';
    const width = isRotated ? '0.7in' : brotherTapeLength;
    const height = isRotated ? brotherTapeLength : '0.7in';
    pageRule = `
      @page {
        size: ${width} ${height};
        margin: 0;
      }
    `;
  } else if (isDymoTemplate) {
    // Dymo 30857 or 30256 Roll Labels
    if (dymoOrientation === 'landscape') {
      const w = isDymo30857 ? '4.0in' : '3.5in';
      const h = isDymo30857 ? '2.25in' : '2.0in';
      pageRule = `
        @page {
          size: ${w} ${h};
          margin: 0;
        }
      `;
    } else {
      // Vertical or Rotated feed (feed through roll along 2.25" / 2.0" width)
      const w = isDymo30857 ? '2.25in' : '2.0in';
      const h = isDymo30857 ? '4.0in' : '3.5in';
      pageRule = `
        @page {
          size: ${w} ${h};
          margin: 0;
        }
      `;
    }
  } else {
    // Standard 8.5" x 11" Sheets for HP and standard printers (Avery 5160, 5874, 5523, Charger Sheet)
    pageRule = `
      @page {
        size: letter portrait;
        margin: 0;
      }
    `;
  }

  return `
    @media print {
      ${pageRule}

      /* Strict sizing and break containment to prevent blank sheets */
      .printable-sheet {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        overflow: hidden !important;
      }

      .printable-sheet:not(:last-child) {
        break-after: page !important;
        page-break-after: page !important;
      }

      .printable-sheet:last-child {
        break-after: auto !important;
        page-break-after: auto !important;
      }
    }
  `;
}

const STYLE_ELEMENT_ID = 'glen-forest-dynamic-print-styles';

/**
 * Injects or updates the valid @page stylesheet directly in document.head.
 * This guarantees the browser parses and caches the page size before window.print() is called.
 */
export function applyPrintPageStyles(config: PrintPageConfig): void {
  if (typeof document === 'undefined') return;

  let styleEl = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ELEMENT_ID;
    document.head.appendChild(styleEl);
  }

  const css = generatePrintPageCss(config);
  styleEl.textContent = css;
}

/**
 * Safely executes window.print() with layout synchronization.
 * Fixes the issue where switching from Dymo to Barcode/HP messes with layout or flips data on the first print.
 *
 * Why this works:
 * 1. Synchronously updates the head @page stylesheet.
 * 2. Forces a browser DOM reflow (via document.body.offsetHeight).
 * 3. Waits two animation frames + 80ms timeout for browser style recalculation to finish.
 * 4. Triggers window.print() only after the engine is in a clean, settled state.
 */
export async function safePrint(
  config?: PrintPageConfig,
  onBeforePrint?: () => void
): Promise<void> {
  if (config) {
    applyPrintPageStyles(config);
  }

  if (onBeforePrint) {
    onBeforePrint();
  }

  // Force reflow
  if (typeof document !== 'undefined') {
    void document.body.offsetHeight;
  }

  // Wait for browser compositor to commit styles
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 80);
      });
    });
  });

  window.print();
}
