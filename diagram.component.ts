import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DiagramService } from './diagram.service';

@Component({
    selector: 'tam-diagram',
    templateUrl: './diagram.component.html',
    styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {

    @Input() set data(data: { config: any; json: any[] }) {
        if (!data || !Array.isArray(data.json)) {
            return;
        }
        if (typeof data.config === 'object') {
            this.config = Object.assign(this.config, data.config);
        }
        this.nodes = this.nodesService.loadNodes(data.json, this.config);
    }

    nodes;

    get paneTransform() {
        return this._paneTransformState;
    }
    set paneTransform(value) {
        this._paneTransformState = value;
    }

    private config = {
        nodeWidth: 200,
        nodeHeight: 100
    };
    private _paneDragging = false;
    private _paneTransformState;
    private _zoom = 1;
    private _paneX = 0;
    private _paneY = 0;

    constructor(
        private nodesService: DiagramService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
    }

    onmousedown() {
        this._paneDragging = true;
    }

    onmousemove(event) {
        if (this._paneDragging) {
            const { movementX, movementY } = event;
            this._paneX += movementX;
            this._paneY += movementY;
            this._makeTransform();
        }
    }

    onmouseup() {
        this._paneDragging = false;
    }

    preventMouse(event) {
        event.stopPropagation();
    }

    onmousewheel(event) {
        event.preventDefault();
        const delta = event.detail || event.wheelDelta;
        this._zoom += delta / 1000 / 2;
        this._zoom = Math.min(Math.max(this._zoom, 0.2), 3);

        this._makeTransform();
    }

    private _makeTransform() {
        this.paneTransform = this.sanitizer.bypassSecurityTrustStyle(
            `translate(${this._paneX}px, ${this._paneY}px) scale(${this._zoom})`
        );
    }

}
