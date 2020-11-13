import { Component, OnInit, Input } from '@angular/core';
import { DiagramNode, DiagramNodeMaker } from '../classes';
import { DomSanitizer } from '@angular/platform-browser';
import { DiagramService } from '../diagram.service';

@Component({
    selector: 'tam-diagram-node',
    templateUrl: './diagram-node.component.html',
    styleUrls: ['./diagram-node.component.scss']
})
export class DiagramNodeComponent implements OnInit {

    @Input() set nodeId(guid) {
        this.node = this.nodesService.getNode(guid);

        const calculation = `translate(calc(-50% + ${Math.round(
            this.node.width / 2
        )}px), 45px)`;

        this.childrenTransform = this.sanitizer.bypassSecurityTrustStyle(
            calculation
        );
    }

    node: DiagramNode | DiagramNodeMaker;
    childrenTransform;

    constructor(
        private nodesService: DiagramService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
    }

    onNodeBlur(event, nodeId) {
        const node = this.nodesService.getNode(nodeId);
        node.displayName = event.target.innerText;
    }
}
