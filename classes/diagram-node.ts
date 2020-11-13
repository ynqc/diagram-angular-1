import { DiagramNodesList } from './diagram-nodes-list';

export class DiagramNode {
    parentId: string | null;
    guid: string;
    width: number;
    height: number;
    isDragover: boolean;
    isDragging: boolean;
    children: Set<string>;
    displayName: string;

    get isMaker() {
        return false;
    }

    get isExpanded() {
        return this._toggleState;
    }

    private _toggleState: boolean;

    constructor(
        props,
        config,
        public getThisNodeList: () => DiagramNodesList
    ) {
        if (!props.guid) {
            return;
        }
        for (const prop in props) {
            if (props.hasOwnProperty(prop)) {
                this[prop] = props[prop];
            }
        }

        this._toggleState = true;

        if (config.nodeWidth) {
            this.width = config.nodeWidth;
        }

        if (config.nodeHeight) {
            this.height = config.nodeHeight;
        }

        this.children = new Set(props.children as string[]);
    }

    destroy() {
        this.getThisNodeList().destroy(this.guid);
    }

    hasChildren() {
        return !!this.children.size;
    }

    toggle(state = !this._toggleState) {
        this._toggleState = state;

        if (state) {
            this.getThisNodeList().toggleSiblings(this.guid);
        }
    }

    childrenCount() {
        return this.children.size;
    }

    isRoot() {
        return this.parentId == null;
    }

    dragenter(event) {
        event.dataTransfer.dropEffect = 'move';
    }

    dragleave(event) {
        this.isDragover = false;
    }

    dragstart(event) {
        event.dataTransfer.effectAllowed = 'move';
        this.isDragging = true;
        this.toggle(false);
        this.getThisNodeList().draggingNodeGuid = this.guid;
    }

    dragover(event) {
        event.preventDefault();

        if (!this.isDragging) {
            this.isDragover = true;
        }

        event.dataTransfer.dropEffect = 'move';
        return false;
    }

    dragend() {
        this.isDragover = false;
        this.isDragging = false;
    }

    drop(event) {
        event.preventDefault();

        const guid = this.getThisNodeList().draggingNodeGuid;

        this.getThisNodeList().transfer(guid, this.guid);
        return false;
    }

    addChild() {
        const newNodeGuid = this.getThisNodeList().newNode(this.guid);

        this.children.add(newNodeGuid);
        this.toggle(true);
    }
}
