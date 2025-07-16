import { Ref, ref } from "vue";

/**
 * ## useAbortableTimeout
 * @param {Function} callback The function to be executed after the timeout
 * @param {number} delay The delay duration in milliseconds
 * @param {AbortSignal} signal The abort signal to cancel the timeout
 * 
 * This function creates an abortable timeout that can be cancelled using an AbortSignal.
 * It returns a ref containing the timeout ID which can be used to manually clear the timeout.
 *
 * ```ts
 * const controller = new AbortController();
 * const timeout = useAbortableTimeout(() => console.log('done'), 1000, controller.signal);
 * // Later: controller.abort(); // Cancels the timeout
 * ```
 * 
 * @return {Ref<number>} A ref containing the timeout ID
 */
export const useAbortableTimeout = (callback: () => void, delay?: number, signal?: AbortSignal): Ref<number> => {
    if (!signal || signal.aborted) throw new Error('Signal already aborted')
    const timeout = ref(setTimeout(() => {
        callback();
        if (signal.aborted) clearTimeout(timeout.value)
    }, delay))
    signal.addEventListener('abort', () => clearTimeout(timeout.value))
    return timeout
}