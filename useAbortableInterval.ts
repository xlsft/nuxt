import { Ref, ref } from "vue";
/**
 * ## useAbortableInterval
 * @param {Function} callback The function to be executed at each interval
 * @param {number} timing The interval duration in milliseconds
 * @param {AbortSignal} signal The abort signal to cancel the interval
 * 
 * This function creates an abortable interval that can be cancelled using an AbortSignal.
 * It returns a ref containing the interval ID which can be used to manually clear the interval.
 *
 * ```ts
 * const controller = new AbortController();
 * const interval = useAbortableInterval(() => console.log('tick'), 1000, controller.signal);
 * // Later: controller.abort(); // Stops the interval
 * ```
 * 
 * @return {Ref<number>} A ref containing the interval ID
 */
export const useAbortableInterval = (callback: () => void, timing?: number, signal?: AbortSignal): Ref<number> => {
    if (!signal || signal.aborted) throw new Error('Signal already aborted')
    const interval = ref(setInterval(() => {
        callback();
        if (signal.aborted) clearInterval(interval.value)
    }, timing))
    signal.addEventListener('abort', () => clearInterval(interval.value))
    return interval
}
  