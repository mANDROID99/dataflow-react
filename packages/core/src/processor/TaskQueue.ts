
export class TaskQueue {
    private readonly queue: (() => void)[] = [];
    private updateScheduled = false;

    constructor() {
        this.tick = this.tick.bind(this);
    }

    enqueue(task: () => void) {
        this.queue.push(task);

        if (!this.updateScheduled) {
            this.updateScheduled = true;
            requestAnimationFrame(this.tick);
        }
    }

    tick() {
        const q = this.queue;
        
        while (q.length) {
            const task = q.pop();
            
            if (task) {
                task();
            }
        }

        this.updateScheduled = false;
    }
}
