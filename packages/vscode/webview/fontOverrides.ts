import { CODE_FONT_OPTION_MAP, UI_FONT_OPTION_MAP } from '@openchamber/ui/lib/fontOptions';

const VSCODE_UI_FONT_STACK = `var(--vscode-font-family, ${UI_FONT_OPTION_MAP.system.stack})`;
const VSCODE_MONO_FONT_STACK = `var(--vscode-editor-font-family, ${CODE_FONT_OPTION_MAP['system-mono'].stack})`;

type FontStyle = Pick<CSSStyleDeclaration, 'fontFamily' | 'getPropertyValue' | 'setProperty'>;

export const applyVSCodeSystemFontOverrides = (rootStyle: FontStyle, bodyStyle?: FontStyle): void => {
  const usesSystemUiFont = rootStyle.getPropertyValue('--font-sans').trim() === UI_FONT_OPTION_MAP.system.stack;
  const usesSystemMonoFont = rootStyle.getPropertyValue('--font-mono').trim() === CODE_FONT_OPTION_MAP['system-mono'].stack;

  if (usesSystemUiFont) {
    rootStyle.setProperty('--font-sans', VSCODE_UI_FONT_STACK);
    rootStyle.setProperty('--font-heading', VSCODE_UI_FONT_STACK);
    rootStyle.setProperty('--font-family-sans', VSCODE_UI_FONT_STACK);
    if (bodyStyle) {
      bodyStyle.fontFamily = VSCODE_UI_FONT_STACK;
    }
  }

  if (usesSystemMonoFont) {
    rootStyle.setProperty('--font-mono', VSCODE_MONO_FONT_STACK);
    rootStyle.setProperty('--font-family-mono', VSCODE_MONO_FONT_STACK);
  }
};

export const installVSCodeSystemFontOverrides = (
  documentRef: Document = document,
  MutationObserverClass: typeof MutationObserver = MutationObserver,
): (() => void) => {
  const apply = () => applyVSCodeSystemFontOverrides(documentRef.documentElement.style, documentRef.body?.style);
  const observer = new MutationObserverClass(apply);

  observer.observe(documentRef.documentElement, { attributes: true, attributeFilter: ['style'] });
  apply();

  return () => observer.disconnect();
};
