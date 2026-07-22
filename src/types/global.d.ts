// Type declarations for window object (dev/test automation)
export {};

declare global {
  interface Window {
    __gameStore?: any;
    __iranCards?: any[];
  }
}
