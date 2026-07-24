import { describe, expect, test } from 'bun:test';
import { CODE_FONT_OPTION_MAP, UI_FONT_OPTION_MAP } from '@openchamber/ui/lib/fontOptions';
import { applyVSCodeSystemFontOverrides } from './fontOverrides';

class TestStyle {
  fontFamily = '';
  readonly properties = new Map<string, string>();

  getPropertyValue(name: string): string {
    return this.properties.get(name) ?? '';
  }

  setProperty(name: string, value: string): void {
    this.properties.set(name, value);
  }
}

describe('VS Code system font overrides', () => {
  test('keeps shared system stacks runtime-neutral', () => {
    expect(UI_FONT_OPTION_MAP.system.stack).not.toContain('--vscode-');
    expect(CODE_FONT_OPTION_MAP['system-mono'].stack).not.toContain('--vscode-');
  });

  test('replaces React inline system stacks with the matching VS Code fonts', () => {
    const rootStyle = new TestStyle();
    const bodyStyle = new TestStyle();
    rootStyle.setProperty('--font-sans', UI_FONT_OPTION_MAP.system.stack);
    rootStyle.setProperty('--font-heading', UI_FONT_OPTION_MAP.system.stack);
    rootStyle.setProperty('--font-family-sans', UI_FONT_OPTION_MAP.system.stack);
    rootStyle.setProperty('--font-mono', CODE_FONT_OPTION_MAP['system-mono'].stack);
    rootStyle.setProperty('--font-family-mono', CODE_FONT_OPTION_MAP['system-mono'].stack);
    bodyStyle.fontFamily = UI_FONT_OPTION_MAP.system.stack;

    applyVSCodeSystemFontOverrides(rootStyle, bodyStyle);

    const expectedUi = `var(--vscode-font-family, ${UI_FONT_OPTION_MAP.system.stack})`;
    const expectedMono = `var(--vscode-editor-font-family, ${CODE_FONT_OPTION_MAP['system-mono'].stack})`;
    expect(rootStyle.getPropertyValue('--font-sans')).toBe(expectedUi);
    expect(rootStyle.getPropertyValue('--font-heading')).toBe(expectedUi);
    expect(rootStyle.getPropertyValue('--font-family-sans')).toBe(expectedUi);
    expect(bodyStyle.fontFamily).toBe(expectedUi);
    expect(rootStyle.getPropertyValue('--font-mono')).toBe(expectedMono);
    expect(rootStyle.getPropertyValue('--font-family-mono')).toBe(expectedMono);
  });

  test('preserves non-system font selections', () => {
    const rootStyle = new TestStyle();
    const bodyStyle = new TestStyle();
    rootStyle.setProperty('--font-sans', UI_FONT_OPTION_MAP.inter.stack);
    rootStyle.setProperty('--font-mono', CODE_FONT_OPTION_MAP['jetbrains-mono'].stack);
    bodyStyle.fontFamily = UI_FONT_OPTION_MAP.inter.stack;

    applyVSCodeSystemFontOverrides(rootStyle, bodyStyle);

    expect(rootStyle.getPropertyValue('--font-sans')).toBe(UI_FONT_OPTION_MAP.inter.stack);
    expect(rootStyle.getPropertyValue('--font-mono')).toBe(CODE_FONT_OPTION_MAP['jetbrains-mono'].stack);
    expect(bodyStyle.fontFamily).toBe(UI_FONT_OPTION_MAP.inter.stack);
  });
});
