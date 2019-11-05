export class Disposables {
    private disposables: (() => void)[] = [];

    push(disposable: () => void): () => void {
        this.disposables.push(disposable);
        return disposable;
    }

    dispose(): void {
        for (const disposable of this.disposables) {
            disposable();
        }
    }
}
