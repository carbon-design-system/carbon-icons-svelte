import { writable } from "svelte/store";

/**
 * Links to the current page's sections, set by the page, so the header's
 * side nav can list them on narrow screens.
 * @type {import("svelte/store").Writable<{ href: string; text: string; nested?: boolean }[]>}
 */
export const pageLinks = writable([]);

