/// <reference types="vite/client" />

// `moment`/`$`/`jQuery`/`Swal` are provided by the Hubble host page at runtime
// (not an npm dependency we ship), so there's no real type surface to declare
// for them.
declare const moment: any;
declare const $: any;
declare const jQuery: any;
declare const Swal: any;

interface Window {
  moment?: typeof moment;
  __hubbleThemeInit?: boolean;
  __hubbleTimelineThemeInit?: boolean;
  __checkoutHoverHelper?: { destroy?: () => void };
  __hubbleProfileSettingsInit?: boolean;
  __hubbleAllModeInterceptorInit?: boolean;
  __hubbleAutoApproveInit?: boolean;
}
