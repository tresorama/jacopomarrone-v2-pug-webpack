/* 
Because Google Tag MAnager is injected by another script, 
and the script will attach 'dataLayer' to the window object,
we need to use 'window.dataLayer' to access the dataLayer.

But typescript doesn't support 'window.dataLayer' yet,
so we declare that dataLayer exists in the global scope.

*/

declare global {
  interface Window {
    dataLayer: any;
  }
}

interface GTM_CustomEvent {
  event: string;
  payload: any;
}

export default class GTM_CustomEventDispatcher {
  static fire({ event, payload }: GTM_CustomEvent) {
    if (!this.GTMIsLoaded()) return;
    window.dataLayer.push({
      event,
      payload,
      payload_json_string: JSON.stringify(payload),
    });
  }

  private static GTMIsLoaded() {
    if (typeof window.dataLayer === 'undefined') {
      console.error('GTM is not loaded, cannot trigger Custom Events');
      return false;
    }
    return true;
  }
}