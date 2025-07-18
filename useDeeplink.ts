/**
 * ## useDeeplink
 * @param {string} uri URI of deeplink
 * 
 * Sends user to custom protocol deeplink, for example `tel:` or: `tg://`, etc.
 *
 * ```ts
 * useDeeplink('tg://resolve?domain=durov')
 * ```
 * 
 * @return void
 */
export const useDeeplink = (uri: string): void => {
    const link = document.createElement('a');
    link.href = uri;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}