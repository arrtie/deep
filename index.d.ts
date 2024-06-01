export {};
declare global {
  interface WindowEventMap {
    StateChange: CustomEvent;
  }
}
