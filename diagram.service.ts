import { Injectable } from '@angular/core';
import { DiagramNodesList } from './classes';

@Injectable({
    providedIn: 'root'
})
export class DiagramService {

    private nodesList: DiagramNodesList;

    loadNodes(nodes: any[], config) {
        this.nodesList = new DiagramNodesList(nodes, config);

        return this.nodesList;
    }

    getNode(guid) {
        return this.nodesList.getNode(guid);
    }

    newNode() {
        this.nodesList.newNode();
    }

    makerNode() {
        return this.nodesList.makerGuid;
    }

    toJsonString() {
        return JSON.stringify(this.nodesList.serialize());
    }
}
