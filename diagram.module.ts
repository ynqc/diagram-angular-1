import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramComponent } from './diagram.component';
import { DiagramNodeComponent } from './diagram-node/diagram-node.component';
import { DiagramService } from './diagram.service';



@NgModule({
    declarations: [
        DiagramComponent,
        DiagramNodeComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        DiagramService
    ],
    exports: [
        DiagramComponent
    ],
})
export class DiagramModule { }
