import { JSX } from 'preact/compat';

export const SIZING_STYLE = [
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'boxSizing',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'letterSpacing',
  'lineHeight',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  // non-standard
  'tabSize',
  'textIndent',
  // non-standard
  'textRendering',
  'textTransform',
  'width',
  'wordBreak'
] as const;

export type SizingProps = Extract<
(typeof SIZING_STYLE)[number],
keyof CSSStyleDeclaration
>;

type SizingStyle = Pick<CSSStyleDeclaration, SizingProps>;

export interface SizingData {
  sizingStyle: SizingStyle
  paddingSize: number
  borderSize: number
}

export interface TextAreaAutoSizeProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  minRows?: number
  maxRows?: number
  onHeightChange?: (height: number) => void
  onPressEnter?: () => void
}