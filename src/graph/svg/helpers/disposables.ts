
export class Disposables {
    private disposables: (() => void)[] = [];

    push(disposable: () => void) {
        this.disposables.push(disposable);
        return disposable;
    }

    dispose() {
        for (let disposable of this.disposables) {
            disposable();
        }
    }
}
