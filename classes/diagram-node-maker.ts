import { DiagramNode } from './diagram-node';

export class DiagramNodeMaker extends DiagramNode {
    private isMakerState = true;

    get isMaker() {
        return this.isMakerState;
    }

    drop(event) {
        event.preventDefault();
        const guid = this.getThisNodeList().draggingNodeGuid;
        this.getThisNodeList().rootNode(guid);
        this.displayName = 'New node';
        return false;
    }

    dragenter(event) {
        event.dataTransfer.dropEffect = 'move';
        const guid = this.getThisNodeList().draggingNodeGuid;
        const node = this.getThisNodeList().getNode(guid);
        if (node.parentId) {
            this.displayName = 'Root';
        }
    }

    dragover(event) {
        event.preventDefault();
        const guid = this.getThisNodeList().draggingNodeGuid;
        const node = this.getThisNodeList().getNode(guid);
        if (!this.isDragging && node.parentId) {
            this.isDragover = true;
            event.dataTransfer.dropEffect = 'move';
        }
        return false;
    }

    dragleave() {
        this.displayName = 'New node';
        this.isDragover = false;
    }
}
