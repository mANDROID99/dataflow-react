import { ContextMenu } from './contextMenuTypes';

export type Subscriber = (menu?: ContextMenu | undefined) => void;

export class ContextMenuManager {
    private readonly stack: ContextMenu[] = [];
    private readonly subs: Subscriber[] = [];

    show(menu: ContextMenu): void {
        this.stack.push(menu);
        this.notify();
    }

    hide(): void {
        this.stack.pop();
        this.notify();
    }

    subscribe(sub: Subscriber): () => void {
        this.subs.push(sub);
        
        return () => {
            const i = this.subs.indexOf(sub);

            if (i >= 0) {
                this.subs.splice(i, 1);
            }
        }
    }

    getContextMenu(): ContextMenu | undefined {
        return this.stack[this.stack.length - 1];
    }

    private notify() {
        if (this.subs.length) {
            const menu = this.getContextMenu();

            for (const sub of this.subs) {
                sub(menu);
            }
        }
    }
}
