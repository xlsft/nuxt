import { useClipboard } from "./useClipboard.ts"

type ShareData = {
    title: string
    text: string
    url: string
}

/**
 * ## useShare
 * Shares content through the native share dialog if supported; otherwise, copies the URL to the clipboard.
 *
 * This utility leverages the Web Share API to share data such as title, text, and URL. If the API is not supported or fails, it falls back to copying the URL to the clipboard.
 *
 * ```ts
 * const data = { title: "Check this out!", text: "Amazing content", url: "https://example.com" }
 * await useShare(data);
 * ```
 *
 * @param data Object containing shareable data:
 *  - `title`: The title to share.
 *  - `text`: The accompanying text to share.
 *  - `url`: The URL to share.
 *
 * @return void
 */
export const useShare = async (data: ShareData): Promise<void> => { try {
    if (navigator.canShare(data)) await navigator.share(data)
    else useClipboard(`${data.url}`)
} catch (_) { useClipboard(`${data.url}`) }}