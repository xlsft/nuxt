import { useColor } from "./useColor.ts"

/**
 * ## useBadge
 * @param {string} color The hex color string to convert (default is black).
 * 
 * This function is intended to provide color manipulation and conversion methods, returning the 
 * computed foreground color, background color, and border color based on the provided hex value.
 *
 * ```ts
 * const style = useBadge('ff5733'); // Returns color, background, and borderColor based on the input.
 * ```
 * 
 * @return {{ color: string, background: string, borderColor: string, stroke: string, borderStyle: string, borderWidth: string }} An object containing the computed styles.
 */
export const useBadge = (hex: string, constants: { white?: string, black?: string } = { white: '#ffffff', black: '#1f2937' }): {
    color: string,
    background: string,
    borderColor: string,
    stroke: string,
    borderStyle: string,
    borderWidth: string,
} => {
    const color = useColor()
    if (!hex) return {
        color: constants.black || '#1f2937',
        background: constants.white || '#ffffff',
        borderColor: constants.black || '#1f2937',
        stroke: constants.black || '#1f2937',
        borderStyle: 'solid',
        borderWidth: '1px',
    }
    const { h, s, l } = color.convert.hex.hsl(hex)
    const calc = {
        background: (): string => l > 99 ? constants.white || '#ffffff' : `#${hex.replace('#', '')}`,
        foreground: (): string => (l > 75 || color.param.contrast(constants.white || '#ffffff', calc.background()) < 1.5) ? constants.black || '#1f2937' : constants.white || '#ffffff',
        border: (): string => {
            const { l } = color.convert.hex.hsl(calc.background())
            return color.convert.hsl.hex({ h, s, l: l > 70 ? Math.max(l - 10, 0) : l })
        }
    }

    return {
        color: calc.foreground(),
        background: calc.background(),
        borderColor: calc.border(),
        stroke: calc.foreground(),
        borderStyle: 'solid',
        borderWidth: '1px',
    }
}
