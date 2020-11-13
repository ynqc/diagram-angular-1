import { DiagramNode } from './diagram-node';
import { DiagramNodeMaker } from './diagram-node-maker';

export class DiagramNodesList {
    roots: DiagramNode[];
    makerGuid: string;
    draggingNodeGuid;
    private nodesList: Map<string, DiagramNode>;
    private nodeTemplate = {
        displayName: 'New node',
        children: [],
        guid: '',
        parentId: null
    };

    constructor(nodes: any[], private config) {
        this.nodesList = new Map();
        nodes.forEach(treeNode => {
            this.nodesList.set(
                treeNode.guid,
                new DiagramNode(treeNode, config, this.getThisNodeList.bind(this))
            );
        });
        this.makeRoots();
        this.makerGuid = this.uuidv4();

        const node = {
            guid: this.makerGuid,
            parentId: 'root',
            children: [],
            displayName: 'New node'
        };
        const maker = new DiagramNodeMaker(
            node,
            this.config,
            this.getThisNodeList.bind(this)
        );

        this.nodesList.set(this.makerGuid, maker);
    }

    values() {
        return this.nodesList.values();
    }

    getNode(guid: string): DiagramNode {
        return this.nodesList.get(guid);
    }

    rootNode(guid: string) {
        const node = this.getNode(guid);
        const maker = this.getNode(this.makerGuid);

        node.isDragging = false;
        node.isDragover = false;

        if (node.parentId) {
            const parent = this.getNode(node.parentId);
            parent.children.delete(guid);
        }

        node.parentId = null;

        this.makeRoots();
        maker.isDragging = false;
        maker.isDragover = false;
    }

    transfer(originId: string, targetId: string) {
        const origin = this.getNode(originId);
        const target = this.getNode(targetId);

        origin.isDragover = false;
        origin.isDragging = false;
        target.isDragover = false;

        if (origin.parentId === targetId || originId === targetId) {
            return;
        }

        const remakeRoots = origin.isRoot();

        if (origin.parentId) {
            const parent = this.getNode(origin.parentId);

            parent.children.delete(originId);

            if (!parent.hasChildren()) {
                parent.toggle(false);
            }
        }

        target.children.add(originId);
        origin.parentId = targetId;

        if (remakeRoots) {
            this.makeRoots();
        }

        this.serialize();
    }

    getThisNodeList() {
        return this;
    }

    toggleSiblings(guid: string) {
        const target = this.getNode(guid);

        if (target.parentId) {
            const parent = this.getNode(target.parentId);
            parent.children.forEach(nodeGuid => {
                if (nodeGuid === guid) {
                    return;
                }
                this.getNode(nodeGuid).toggle(false);
            });
        } else {
            for (const root of this.roots) {
                if (root.guid === guid) {
                    continue;
                }
                root.toggle(false);
            }
        }
    }

    serialize() {
        const out = [];
        this.nodesList.forEach((node: DiagramNode) => {
            const json: any = {
                guid: node.guid,
                displayName: node.displayName,
                parentId: node.parentId,
                children: Array.from(node.children),
            };

            out.push(json);
        });
        return out;
    }

    destroy(guid: string) {
        const target = this.getNode(guid);
        if (target.parentId) {
            const parent = this.getNode(target.parentId);
            parent.children.delete(guid);
        }
        if (target.hasChildren()) {
            target.children.forEach((child: string) => {
                this.nodesList.delete(child);
            });
        }
        this.nodesList.delete(guid);
    }

    newNode(parentId = null) {
        const nodeTemplate = Object.assign({}, this.nodeTemplate);
        nodeTemplate.guid = this.uuidv4();
        nodeTemplate.parentId = parentId;
        this.nodesList.set(
            nodeTemplate.guid,
            new DiagramNode(
                nodeTemplate,
                this.config,
                this.getThisNodeList.bind(this)
            )
        );
        this.makeRoots();
        return nodeTemplate.guid;
    }

    private uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:one-variable-per-declaration no-bitwise
            const r = (Math.random() * 16) | 0;
            // tslint:disable-next-line:triple-equals no-bitwise
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    private makeRoots() {
        this.roots = Array.from(this.values()).filter((node: DiagramNode) =>
            node.isRoot()
        );
    }
}
