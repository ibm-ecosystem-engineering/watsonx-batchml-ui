
export class SelectValue {
    readonly label: string;
    readonly value: string;

    constructor({label, value}: {label?: string, value: string}) {
        this.value = value;
        this.label = label || value;
    }
}
