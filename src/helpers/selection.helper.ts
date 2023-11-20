// @ts-expect-error
import rangy from 'rangy/lib/rangy-selectionsaverestore';

export function saveSelection($element: Element) {
  const sel = rangy.getSelection();
  const stop = {};

  let charIndex = 0;
  let start = 0;
  let end = 0;
  let foundStart = false;

  function traverseTextNodes(node: any, range: any) {
    if (node.nodeType == 3) {
      if (!foundStart && node == range.startContainer) {
        start = charIndex + range.startOffset;
        foundStart = true;
      }
      if (foundStart && node == range.endContainer) {
        end = charIndex + range.endOffset;
        throw stop;
      }
      charIndex += node.length;
    } else {
      for (let i = 0, len = node.childNodes.length; i < len; ++i) {
        traverseTextNodes(node.childNodes[i], range);
      }
    }
  }

  if (sel.rangeCount) {
    try {
      traverseTextNodes($element, sel.getRangeAt(0));
    } catch (ex) {
      if (ex != stop) {
        throw ex;
      }
    }
  }

  return { end, start };
}

export function restoreSelection($element: Element, savedSelection: { end: number; start: number }) {
  const range = rangy.createRange();
  const stop = {};

  let charIndex = 0;
  let foundStart = false;

  range.collapseToPoint($element, 0);

  function traverseTextNodes(node: any) {
    if (node.nodeType == 3) {
      const nextCharIndex = charIndex + node.length;
      if (!foundStart && savedSelection.start >= charIndex && savedSelection.start <= nextCharIndex) {
        range.setStart(node, savedSelection.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSelection.end >= charIndex && savedSelection.end <= nextCharIndex) {
        range.setEnd(node, savedSelection.end - charIndex);
        throw stop;
      }
      charIndex = nextCharIndex;
    } else {
      for (let i = 0, len = node.childNodes.length; i < len; ++i) {
        traverseTextNodes(node.childNodes[i]);
      }
    }
  }

  try {
    traverseTextNodes($element);
  } catch (ex) {
    if (ex == stop) {
      rangy.getSelection().setSingleRange(range);
    } else {
      throw ex;
    }
  }
}
