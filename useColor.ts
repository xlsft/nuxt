/**
 * ## useColor
 * 
 * This function provides utilities for color manipulation and conversion between different color formats (hex, RGB, HSL). 
 * It includes methods to calculate luminance and contrast, as well as functions to modify hue, saturation, and lightness of colors.
 * Useful for theming, styling, and UI customization in web applications.
 * 
 * ```ts
* const color = useColor();
* 
* // Conversion methods
* const rgb = color.convert.hex.rgb('#ff5733'); // { r: 255, g: 87, b: 51 }
* const hsl = color.convert.hex.hsl('#ff5733'); // { h: 14, s: 100, l: 60 }
* 
* const hex = color.convert.rgb.hex({ r: 255, g: 87, b: 51 }); // '#ff5733'
* const hslFromRgb = color.convert.rgb.hsl({ r: 255, g: 87, b: 51 }); // { h: 14, s: 100, l: 60 }
* 
* const rgbFromHsl = color.convert.hsl.rgb({ h: 14, s: 100, l: 60 }); // { r: 255, g: 87, b: 51 }
* const hexFromHsl = color.convert.hsl.hex({ h: 14, s: 100, l: 60 }); // '#ff5733'
* 
* // Parameter methods
* const luminance = color.param.luminance('#ff5733'); // 0.35
* const contrast = color.param.contrast('#ff5733', '#ffffff'); // 3.0
* 
* // Modification methods
* const newHexHue = color.modify.hue('#ff5733', 30); // Adjusts hue by 30 degrees
* const newHexSaturation = color.modify.saturation('#ff5733', -20); // Decreases saturation by 20
* const newHexLightness = color.modify.lightness('#ff5733', 10); // Increases lightness by 10
* ```
* 
* @return {object} An object containing color conversion, parameter calculations, and modification methods.
*/
export const useColor = (): {
    convert: {
        hex: {
            rgb: (hex: string) => { r: number, g: number, b: number }
            hsl: (hex: string) => { h: number, s: number, l: number }
        },
        rgb: {
            hex: (rgb: { r: number, g: number, b: number }) => string
            hsl: (rgb: { r: number, g: number, b: number }) => { h: number, s: number, l: number }
        },
        hsl: {
            hex: (hsl: { h: number, s: number, l: number }) => string
            rgb: (hsl: { h: number, s: number, l: number }) => { r: number, g: number, b: number }
        }
    },
    param: {
        luminance: (hex: string) => number
        contrast: (f: string, b: string) => number
    },
    modify: {
        hue: {
            add: (hex: string, add: number) => string
            set: (hex: string, set: number) => string
        },
        saturation: {
            add: (hex: string, add: number) => string
            set: (hex: string, set: number) => string
        },
        lightness: {
            add: (hex: string, add: number) => string
            set: (hex: string, set: number) => string
        },
    }
} => {
    const color = {
        convert: {
            hex: {
                rgb: (hex: string) => { try {
                    hex = `#${hex.replace('#', '')}`
                    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    hex = hex.replace(short, (_m, r, g, b) => r + r + g + g + b + b)
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : { r: 0, g: 0, b: 0 }
                } catch (_e) { return { r: 0, g: 0, b: 0 } } },
                hsl: (hex: string) => color.convert.rgb.hsl(color.convert.hex.rgb(hex)),
            },
            rgb: {
                hex: ({ r, g, b }: { r: number, g: number, b: number }) => { try { return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1) } catch (_e) { return '#000000' } },
                hsl: ({ r, g, b }: { r: number, g: number, b: number }) => { try {
                    r /= 255; g /= 255; b /= 255;
                    const l = Math.max(r, g, b);
                    const s = l - Math.min(r, g, b);
                    const h = s ? l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s : 0;
                    return { 
                        h: 60 * h < 0 ? 60 * h + 360 : 60 * h,  
                        s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0), 
                        l: (100 * (2 * l - s)) / 2 
                    }
                } catch (_e) { return { h: 0, s: 0, l: 0 } } },
            },
            hsl: {
                rgb: ({ h, s, l }: { h: number, s: number, l: number }) => { try {
                    s /= 100;
                    l /= 100;
                    const c = (1 - Math.abs(2 * l - 1)) * s;
                    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
                    const m = l - c / 2;
                    let r = 0, g = 0, b = 0;
                    if (h >= 0 && h < 60) { r = c; g = x; b = 0 } 
                    else if (h >= 60 && h < 120) { r = x; g = c; b = 0 } 
                    else if (h >= 120 && h < 180) { r = 0; g = c; b = x } 
                    else if (h >= 180 && h < 240) { r = 0; g = x; b = c } 
                    else if (h >= 240 && h < 300) { r = x; g = 0; b = c } 
                    else if (h >= 300 && h <= 360) { r = c; g = 0; b = x }
                    r = Math.round((r + m) * 255);
                    g = Math.round((g + m) * 255);
                    b = Math.round((b + m) * 255);
                    return { r, g, b };
                } catch (_e) { return { r: 0, g: 0, b: 0 } }},
                hex: ({ h, s, l }: { h: number, s: number, l: number }) => color.convert.rgb.hex(color.convert.hsl.rgb({ h, s, l }))
            },
        },
        param: {
            luminance: (hex: string): number => { try {
                const { r, g, b } = color.convert.hex.rgb(hex)
                const calc = (value: number): number => value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
                return 0.2126 * calc(r) + 0.7152 * calc(g) + 0.0722 * calc(b)
            } catch (_e) { return 0 }},
            contrast: (f: string, b: string): number => { try {
                const [ lf, lb ] = [color.param.luminance(f), color.param.luminance(b)]
                return (Math.max(lf, lb) - 0.2) / (Math.min(lf, lb) + 0.1)
            } catch (_e) { return 0 }}
        },
        modify: {
            hue: {
                add: (hex: string, add: number): string => {
                    let { h, s, l } = color.convert.hex.hsl(hex)
                    if (h + add <= 0) h = 0
                    else if (h + add >= 360) h = 360
                    else h = Math.min(h + add, 360)
                    return color.convert.hsl.hex({ h, s, l })
                },
                set: (hex: string, set: number): string => {
                    const { s, l } = color.convert.hex.hsl(hex)
                    return color.convert.hsl.hex({ h: Math.max(Math.min(set, 360), 0), s, l })
                },
            },
            saturation: {
                add: (hex: string, add: number): string => {
                    let { h, s, l } = color.convert.hex.hsl(hex)
                    if (s + add <= 0) s = 0
                    else if (s + add >= 100) h = 100
                    else s = Math.min(s + add, 100)
                    return color.convert.hsl.hex({ h, s, l })
                },
                set: (hex: string, set: number): string => {
                    const { h, l } = color.convert.hex.hsl(hex)
                    return color.convert.hsl.hex({ h, s: Math.max(Math.min(set, 100), 0), l })
                },
            },
            lightness: {
                add: (hex: string, add: number): string => {
                    let { h, s, l } = color.convert.hex.hsl(hex)
                    if (l + add <= 0) l = 0
                    else if (l + add >= 100) l = 100
                    else l = Math.min(l + add, 100)
                    return color.convert.hsl.hex({ h, s, l })
                },
                set: (hex: string, set: number): string => {
                    const { h, s } = color.convert.hex.hsl(hex)
                    return color.convert.hsl.hex({ h, s, l: Math.max(Math.min(set, 100), 0) })
                },
            }
        }
    }
    return color
}    
