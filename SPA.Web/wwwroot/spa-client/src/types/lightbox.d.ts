declare namespace lightbox {
  interface Options {
    fadeDuration?: number;
    resizeDuration?: number;
    positionFromTop?: number;
    showImageNumberLabel?: boolean;
    alwaysShowNavOnTouchDevices?: boolean;
    wrapAround?: boolean;
    albumLabel?: string;
    maxWidth?: number;
    maxHeight?: number;
    disableScrolling?: boolean;
    enableKeyboardNav?: boolean;
    onOpen?: () => void;
    onLoad?: () => void;
    onComplete?: () => void;
    onCleanup?: () => void;
    onClose?: () => void;
  }

  function init(options?: Options): void;
  function start(element: HTMLElement): void;
  function end(): void;
}

declare const lightbox: typeof lightbox; 