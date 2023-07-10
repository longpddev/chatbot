/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { forwardRef, memo, JSX } from 'preact/compat';
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef
} from 'preact/hooks';
import { SIZING_STYLE, SizingData, SizingProps, TextAreaAutoSizeProps } from './types';
import clsx from 'clsx';

export const pick = <Obj extends Record<string, any>, Key extends keyof Obj>(
  props: Key[],
  obj: Obj
): Pick<Obj, Key> =>
    props.reduce<Pick<Obj, Key>>((acc, prop) => {
      acc[prop] = obj[prop];
      return acc;
    }, {} as Pick<Obj, Key>);

function getSizingData (node: HTMLElement): SizingData | null {
  const style = window.getComputedStyle(node);
  if (style === null) {
    return null;
  }
  // const sizingStyle = pickStyle(SIZING_STYLE, style);
  const sizingStyle = pick(SIZING_STYLE as unknown as SizingProps[], style);
  const boxSizing = sizingStyle.boxSizing;

  // probably node is detached from DOM, can't read computed dimensions
  if (boxSizing === '') {
    return null;
  }

  const paddingSize =
    parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop);
  const borderSize =
    parseFloat(sizingStyle.borderBottomWidth) +
    parseFloat(sizingStyle.borderTopWidth);
  return {
    sizingStyle,
    paddingSize,
    borderSize
  };
}

let hiddenTextarea: HTMLTextAreaElement | null = null;

function getHeight (node: HTMLElement, sizingData: SizingData) {
  const height = node.scrollHeight;
  if (sizingData.sizingStyle.boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize;
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize;
}

function forceHiddenStyles (node: HTMLElement) {
  const HIDDEN_TEXTAREA_STYLE = {
    'min-height': '0',
    'max-height': 'none',
    height: '0',
    visibility: 'hidden',
    overflow: 'hidden',
    position: 'absolute',
    'z-index': '-1000',
    top: '0',
    right: '0'
  } as const;

  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(key => {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key as keyof typeof HIDDEN_TEXTAREA_STYLE], 'important');
  });
}

function calculateNodeHeight (sizingData: SizingData,
  value: string,
  minRows = 1,
  maxRows = Infinity) {
  if (!minRows) {
    minRows = 1;
  }
  if (!maxRows) {
    maxRows = Infinity;
  }
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.setAttribute('tabindex', '-1');
    hiddenTextarea.setAttribute('aria-hidden', 'true');
    forceHiddenStyles(hiddenTextarea);
  }
  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  }
  const { paddingSize, borderSize, sizingStyle } = sizingData;

  const { boxSizing } = sizingStyle;
  Object.keys(sizingStyle).forEach(_key => {
    // const key = _key;
    // hiddenTextarea.style[key] = sizingStyle[key];
    const key = _key as keyof typeof sizingStyle;
    if (hiddenTextarea) hiddenTextarea.style[key] = sizingStyle[key] as any;
  });
  forceHiddenStyles(hiddenTextarea);
  hiddenTextarea.value = value;
  let height = getHeight(hiddenTextarea, sizingData);
  // Double set and calc due to Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1795904
  hiddenTextarea.value = value;
  height = getHeight(hiddenTextarea, sizingData);

  // measure height of a textarea with a single row
  hiddenTextarea.value = 'x';
  const rowHeight = hiddenTextarea.scrollHeight - paddingSize;
  let minHeight = rowHeight * minRows;
  if (boxSizing === 'border-box') {
    minHeight = minHeight + paddingSize + borderSize;
  }
  height = Math.max(minHeight, height);
  let maxHeight = rowHeight * maxRows;
  if (boxSizing === 'border-box') {
    maxHeight = maxHeight + paddingSize + borderSize;
  }
  height = Math.min(maxHeight, height);
  return [height, rowHeight];
}

const TextAreaAutoSize = forwardRef<HTMLTextAreaElement, TextAreaAutoSizeProps>((
  { className = '', value = '', minRows, maxRows, onInput, onHeightChange, onPressEnter, ...props },
  ref
) => {
  // const textAreaRef = /** @type {{ current: HTMLTextAreaElement}} */ (
  //   useRef()
  // );

  const textAreaId = useId();
  const firstRenderTimeRef = useRef(true);

  const measurementsCacheRef = useRef<SizingData>();
  const heightRef = useRef(0);

  const resizeTextarea = useCallback(() => {
    const node = (document.getElementById(textAreaId) as HTMLTextAreaElement);
    // const node = /** @type {HTMLTextAreaElement} */ (ref?.current ?? document.getElementById(textAreaId));
    const nodeSizingData = measurementsCacheRef.current
      ? measurementsCacheRef.current
      : getSizingData(node);
    if (!nodeSizingData) {
      return;
    }
    measurementsCacheRef.current = nodeSizingData;
    const _calculateNodeHeight = calculateNodeHeight(
      nodeSizingData,
      node?.value || node.placeholder || 'x',
      minRows,
      maxRows
    );
    const height = _calculateNodeHeight[0];

    if (heightRef.current !== height) {
      heightRef.current = height;
      node?.style.setProperty('height', height + 'px', 'important');
      onHeightChange?.(height);
    }
  }, [minRows, maxRows, textAreaId, ref]);

  useLayoutEffect(() => {
    const isNotFirstRenderAndValueIsEmpty = !firstRenderTimeRef.current && !value;

    // Call function that cal height textarea
    if (firstRenderTimeRef.current || isNotFirstRenderAndValueIsEmpty) {
      resizeTextarea();
      if (firstRenderTimeRef.current) firstRenderTimeRef.current = false
    }
  }, [resizeTextarea, value]);

  const handleChange = (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    resizeTextarea();
    onInput?.(event);
  };

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onPressEnter?.()
    }
  };

  return (
    <textarea
      {...props}
      className={clsx("textarea", {
        className
      })}
      value={value}
      onInput={handleChange}
      ref={ref}
      id={textAreaId}
      onKeyDown={handleKeyDown}
    />
  );
})

export default memo(TextAreaAutoSize);
