import { Ref, ref, watch } from "vue"
import { easing as e } from "./utils/easing.ts";

type TweenedOptions = {
    delay?: number,
    duration?: number,
    easing?: (t: number) => number,
}

type Tweened = {
    current: Ref<number>
    target: Ref<number | undefined>
    update: (fn: (value: number) => void) => void
}

/**
 * ## useTweened
 * Animates a numeric value over time using tweening, providing a smooth transition from the current value to a target value.
 *
 * This utility provides a reactive way to animate numeric values in a Vue application. It supports customizable delay, duration, and easing functions for fine-grained control over the animation.
 *
 * ```ts
 * const { current, target, update } = useTweened(0, { duration: 1000, easing: quadInOut });
 * update((value: number) => console.log(value))
 * target.value = 100;
 * ```
 *
 * @param initial The initial value to start the tweening from.
 * @param options Optional object containing tweening options:
 *  - `delay`: The delay before starting the animation (in milliseconds).
 *  - `duration`: The duration of the animation (in milliseconds).
 *  - `easing`: A function defining the easing curve, taking a value from 0 to 1 and returning an eased value.
 *
 * @return An object with two refs:
 *  - `current`: The current animated value.
 *  - `target`: The target value to which the animation will tween.
 *  - `update`: Set watch function on current value
 */

export const useTweened = (initial: number, o?: TweenedOptions): Tweened => {

    const current = ref<number>(initial)
    const target = ref<number>()
    let callback: ((value: number) => void) | null = null
    
    let frame: number | null = null, 
        time: number | null = null, 
        start: number = initial, 
        end: number = initial
    const options: Required<TweenedOptions> = {
            delay: 0,
            duration: 400,
            easing: e.linear
        }

    options.delay = o?.delay || 0
    options.duration = o?.duration || 400
    options.easing = o?.easing || e.linear

    const animate = (timestamp: number): void => {
        if (!time) time = timestamp
        const elapsed = timestamp - time
        if (elapsed < options.delay) { frame = requestAnimationFrame(animate); return }
        const animation = elapsed - options.delay
        const progress = Math.min(animation / options.duration, 1)
        const eased = options.easing(progress)
        current.value = start + (end - start) * eased
        if (progress < 1) { frame = requestAnimationFrame(animate) }
        else { current.value = end; frame = null; time = null }
    }

    watch(() => target.value, () => {
        if (target.value === undefined) return
        if (current.value === undefined) { current.value = target.value; return }
        start = current.value
        end = target.value
        if (frame) { cancelAnimationFrame(frame); frame = null }
        time = null
        frame = requestAnimationFrame(animate)
    })

    watch (() => current.value, () => { if (callback) callback(current.value) })

    return {
        current,
        target,
        update: (fn: (value: number) => void) => callback = fn 
    }
}