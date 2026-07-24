import { describe, expect, test } from 'bun:test';
import { CODE_FONT_OPTION_MAP, UI_FONT_OPTION_MAP } from './fontOptions';

describe('system font stacks', () => {
    test('uses the VS Code editor font before its UI and system fallbacks', () => {
        expect(UI_FONT_OPTION_MAP.system.stack).toBe(
            'var(--vscode-editor-font-family, var(--vscode-font-family, "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif))',
        );
    });

    test('uses the VS Code editor font before the system monospace fallback', () => {
        expect(CODE_FONT_OPTION_MAP['system-mono'].stack).toBe(
            'var(--vscode-editor-font-family, ui-monospace, "SFMono-Regular", "Menlo", "Cascadia Mono", "Segoe UI Mono", monospace)',
        );
    });
});
