import { useEffect } from 'react';

export type HotkeyOptions = {
  alt?: boolean;
  callback: (e: KeyboardEvent) => void;
  ctrl?: boolean;
  disabled?: boolean;
  key: string;
  meta?: boolean;
  shift?: boolean;
};

export default function useHotkey(options: HotkeyOptions) {
  useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (options.disabled) return;
      if (e.key !== options.key) return;

      if (options.alt && !e.altKey) return;
      if (options.ctrl && !e.ctrlKey) return;
      if (options.meta && !e.metaKey) return;
      if (options.shift && !e.shiftKey) return;

      if (!options.alt && e.altKey) return;
      if (!options.ctrl && e.ctrlKey) return;
      if (!options.meta && e.metaKey) return;
      if (!options.shift && e.shiftKey) return;

      e.stopPropagation();
      e.preventDefault();
      options.callback(e);
    }

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [options]);

  return {
    title: options.disabled
      ? ''
      : `(${[
          options.ctrl && 'Ctrl',
          options.alt && 'Alt',
          options.meta && 'Meta',
          options.shift && 'Shift',
          options.key.length === 1 ? options.key.toUpperCase() : options.key,
        ]
          .filter(Boolean)
          .join('+')})`,
  };
}
