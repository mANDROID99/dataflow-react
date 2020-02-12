
export type PortState = {
    x: number;
    y: number;
}

export type PortId = {
    nodeId: string;
    portName: string;
    portOut: boolean;
}

type Subscriber = (portState: PortState | undefined) => void;

export class GraphNodePortRefs {
    private readonly subscribers: Map<string, Subscriber[]> = new Map();
    private readonly ports: Map<string, PortState> = new Map();

    getPortState(portId: PortId): PortState | undefined {
        const key = this.getPortKey(portId);
        return this.ports.get(key);
    }

    setPortState(portId: PortId, portState: PortState) {
        const portkey = this.getPortKey(portId);
        const prevState = this.ports.get(portkey);

        if (prevState && (
            prevState.x === portState.x && prevState.y === portState.y
        )) {
            return;
        }

        this.ports.set(portkey, portState);
        this.notifyChanges(portkey, portState);
    }

    clearPortState(portId: PortId) {
        const portkey = this.getPortKey(portId);
        this.ports.delete(portkey);
        this.notifyChanges(portkey, undefined);
    }

    subscribe(port: PortId, sub: Subscriber) {
        const portKey = this.getPortKey(port);
        let subs = this.subscribers.get(portKey);

        if (!subs) {
            subs = [];
            this.subscribers.set(portKey, subs);
        }
        
        subs.push(sub);
        return this.unsubscribe.bind(this, portKey, sub);
    }

    private unsubscribe(portKey: string, sub: Subscriber) {
        const subs = this.subscribers.get(portKey);

        if (subs) {
            const i = subs.indexOf(sub);

            if (i >= 0) {
                subs.splice(i, 1);
            }
        }
    }

    private notifyChanges(portKey: string, portState: PortState | undefined) {
        const subs = this.subscribers.get(portKey);
        if (!subs) {
            return;
        }
        
        for(let i = 0, n = subs.length; i < n; i++) {
            subs[i](portState);
        }
    }

    private getPortKey(portId: PortId) {
        return portId.nodeId + '__' + portId.portName + (portId.portOut ? '__out' : '__in');
    }
}
