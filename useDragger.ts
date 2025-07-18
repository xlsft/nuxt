type DraggerOptions = { drag?: boolean, scroll?: boolean, direction?: 'both' | 'x' | 'y', speed?: number, scrollbar?: boolean, tractor?: { size?: number, interval?: number } }
const uuid = () => { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random()  * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class Dragger {

    private down: boolean = false
    private ignore: boolean = false
    private currentX: number = 0
    private currentY: number = 0
    private currentTractorX: number = 0
    private currentTractorY: number = 0
    private deltaX: number = 0
    private deltaY: number = 0
    private observer: MutationObserver | null = null
    private resizeObserver: ResizeObserver | null = null;
    private cursor: boolean = true
    private options: DraggerOptions = { drag: true, scroll: true, direction: 'x', speed: 3, scrollbar: false, tractor: { size: 100, interval: 20 } }
    private container: HTMLElement | undefined
    private interval: number | null = null
    public id: string = uuid()

    public scrolled: (state: HTMLElement) => void = () => {}
    public dragged: (state: HTMLElement) => void = () => {}

    constructor(options?: DraggerOptions) {  this.options = { ...this.options, ...options } }

    public init(container: HTMLElement | undefined) {
        if (!container) return
        this.container = container
        if (!this.container) { console.error(`[DraggerError]: Container is undefined`); return }
        if (this.options.scrollbar === false) {
            this.container.classList.add(this.id)
            const style = document.createElement('style')
            style.textContent = `
                .${this.id} {
                    -ms-overflow-style: none !important;
                    scrollbar-width: none !important;
                }
                .${this.id}::-webkit-scrollbar {
                    display: none !important;
                }
            `
            document.head.appendChild(style)
        }
        if (this.options.drag) this.container!.style.cursor = 'grab'
        this.container.style.scrollBehavior = 'smooth'
        this.container.style.setProperty('scroll-behavior', 'smooth', 'important')

        const listen = () => {
            if (this.options.drag) {
                this.container!.addEventListener('mousedown', this.mouse.down)
                this.container!.addEventListener('mouseleave', this.mouse.leave)
                this.container!.addEventListener('mouseup', this.mouse.up)
                this.container!.addEventListener('mousemove', this.mouse.move)
                this.container!.addEventListener('click', this.mouse.click)
            }
            if (this.options.scroll) {
                this.container!.addEventListener('wheel', this.mouse.wheel)
            }
            this.container!.addEventListener('mousemove', this.mouse.track)
            this.container!.addEventListener('dragover', this.mouse.track)
        }
        
        this.observer = new MutationObserver(listen)
        this.observer.observe(document.body, { childList: true, subtree: true })
        listen()
        this.resize()
        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(this.container);
    }

    public clear() { this.down = false }

    public destroy() {
        if (this.observer) {
            if (this.options.drag) {
                this.container!.removeEventListener('mousedown', this.mouse.down)
                this.container!.removeEventListener('mouseleave', this.mouse.leave)
                this.container!.removeEventListener('mouseup', this.mouse.up)
                this.container!.removeEventListener('mousemove', this.mouse.move)
                this.container!.removeEventListener('click', this.mouse.click)
            }
            if (this.options.scroll) {
                this.container!.removeEventListener('wheel', this.mouse.wheel)
            }
            this.observer.disconnect()
            this.observer = null
        }
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.container!);
            this.resizeObserver = null;
        }
        if (this.options.scrollbar === false) {
            this.container?.classList.remove(this.id)
            document.querySelectorAll(`style`).forEach(style => style.textContent?.includes(this.id) ? style.remove() : null)
        }
        if (this.container) {
            this.container!.removeEventListener('mousemove', this.mouse.track)
            this.container!.removeEventListener('dragover', this.mouse.track)
            this.container?.style.removeProperty('scroll-behavior')
        }
        if (this.options.drag) this.container?.style.removeProperty('cursor')
        this.tractor.disable() 
    }

    private mouse = {
        down: (event: MouseEvent) => {
            this.mouse.track(event);
            if (this.cursor) this.container!.style.cursor = 'grabbing';
            this.down = true;
            this.currentX = event.pageX - this.container!.offsetLeft;
            this.currentY = event.pageY - this.container!.offsetTop;
            this.deltaX = this.container!.scrollLeft;
            this.deltaY = this.container!.scrollTop;
            this.ignore = false;
        },
        move: (event: MouseEvent) => {
            this.mouse.track(event);
            if (!this.down) return;
            event.preventDefault();
            const x = event.pageX - this.container!.offsetLeft;
            const y = event.pageY - this.container!.offsetTop;
            let walkX = 0, walkY = 0;
            if (this.options.direction === 'x' || this.options.direction === 'both') {
                walkX = (x - this.currentX) * this.options.speed!;
                this.container!.scrollLeft = this.deltaX - walkX;
            }
            if (this.options.direction === 'y' || this.options.direction === 'both') {
                walkY = (y - this.currentY) * this.options.speed!;
                this.container!.scrollTop = this.deltaY - walkY;
            }
            this.ignore = true;
            this.dragged(this.container!);
        },
        up: (event: MouseEvent) => {
            this.down = false;
            if (this.cursor) this.container!.style.cursor = 'grab';
            this.mouse.track(event);
        },
        leave: (event: MouseEvent) => {
            this.down = false;
            if (this.cursor) this.container!.style.cursor = 'grab';
            this.mouse.track(event);
        },
        click: (event: MouseEvent) => {
            this.ignore ? event.preventDefault() : null;
            this.mouse.track(event);
        },
        wheel: (event: WheelEvent) => {
            event.preventDefault();
            const { deltaX, deltaY, shiftKey } = event;
            if (this.options.direction === 'x') this.container!.scrollLeft += deltaX || (shiftKey ? deltaY : 0) * 5;
            else if (this.options.direction === 'y') this.container!.scrollTop += deltaY * 5;
            else if (this.options.direction === 'both') { this.container!.scrollLeft += deltaX; this.container!.scrollTop += deltaY }
            this.scrolled(this.container!);
        },
        track: (event: MouseEvent) => {
            this.currentTractorX = event.pageX;
            this.currentTractorY = event.pageY;
        }
    }

    private resize = () => {
        if (!this.container) return;
        this.cursor = this.container.scrollWidth > this.container.clientWidth;
        this.container.style.cursor = this.cursor ? 'grab' : '';
    }

    private scroll = () => {
        if (!this.container) return
        const rect = this.container.getBoundingClientRect()
        if (this.currentTractorX < rect.left + this.options.tractor!.size!) {
            this.container.scrollLeft -= this.options.speed! * 15
        } else if (this.currentTractorX > rect.right - this.options.tractor!.size!) {
            this.container.scrollLeft += this.options.speed! * 15
        }
    }

    public tractor = {
        enable: (): void => { this.interval = setInterval(this.scroll, this.options.tractor!.interval) },
        disable: (): void => { if (this.interval) { clearInterval(this.interval); this.interval = null } }    
    }

}

/**
 * ## useDragger
 * Creates a new Dragger instance that provides dragging and scrolling functionalities for a given container
 * 
 * It also manages a custom scrollbar and autoscroll feature
 * 
 * @param {DraggerOptions} [options] - Options for configuring the Dragger instance.
 * @return {Dragger} A new Dragger instance.
 * 
 * ```ts
 * const dragger = useDragger()
 * const container = ref<HTMLElement>()
 * 
 * onMounted(() => dragger.init(container.value))
 * onUnmounted(() => dragger.destroy())
 * ```
*/
export const useDragger = (options?: DraggerOptions): Dragger => new Dragger(options)