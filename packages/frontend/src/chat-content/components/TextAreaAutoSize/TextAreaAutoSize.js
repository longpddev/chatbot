/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { forwardRef, memo } from 'preact/compat';
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef
} from 'preact/hooks';

const pickStyle = function pick (props, obj) {
  return props.reduce((acc, prop) => {
    acc[prop] = obj[prop];
    return acc;
  }, {});
};

const SIZING_STYLE = [
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
];

function getSizingData (node) {
  const style = window.getComputedStyle(node);
  if (style === null) {
    return null;
  }
  const sizingStyle = pickStyle(SIZING_STYLE, style);
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

let hiddenTextarea = null;

function getHeight (node, sizingData) {
  const height = node.scrollHeight;
  if (sizingData.sizingStyle.boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize;
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize;
}

function forceHiddenStyles (node) {
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
  };

  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(key => {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], 'important');
  });
}

function calculateNodeHeight (sizingData, value, minRows, maxRows) {
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
    const key = _key;
    hiddenTextarea.style[key] = sizingStyle[key];
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

/**
 * @param {import('preact').JSX.HTMLAttributes<HTMLTextAreaElement>
 * & { className?: string, minHeight?: number, minRows?: number, maxRows?: number }} props
 * @param {{current: HTMLTextAreaElement} | undefined} ref
 */
function TextAreaAutoSize (
  { className = '', value = '', minRows, maxRows, onInput, onHeightChange, onPressEnter, ...props },
  ref
) {
  // const textAreaRef = /** @type {{ current: HTMLTextAreaElement}} */ (
  //   useRef()
  // );

  const textAreaId = useId();

  const measurementsCacheRef = useRef();
  const heightRef = useRef(0);

  const resizeTextarea = useCallback(() => {
    const node = /** @type {HTMLTextAreaElement} */ (ref?.current ?? document.getElementById(textAreaId));
    const nodeSizingData = measurementsCacheRef.current
      ? measurementsCacheRef.current
      : getSizingData(node);
    if (!nodeSizingData) {
      return;
    }
    measurementsCacheRef.current = nodeSizingData;
    const _calculateNodeHeight = calculateNodeHeight(
      nodeSizingData,
      node.value || node.placeholder || 'x',
      minRows,
      maxRows
    );
    const height = _calculateNodeHeight[0];

    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty('height', height + 'px', 'important');
      onHeightChange?.(height);
    }
  }, [minRows, maxRows, textAreaId, ref]);

  useLayoutEffect(() => {
    resizeTextarea();
  }, [resizeTextarea]);

  const handleChange = event => {
    resizeTextarea();
    onInput?.(event);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onPressEnter?.()
    }
  };

  return (
    <textarea
      {...props}
      className={`textarea ${className}`}
      value={value}
      onInput={handleChange}
      ref={ref}
      id={textAreaId}
      onKeyDown={handleKeyDown}
    />
  );
}

export default memo(forwardRef(TextAreaAutoSize));
