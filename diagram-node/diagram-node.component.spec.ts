import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramNodeComponent } from './diagram-node.component';

describe('DiagramNodeComponent', () => {
  let component: DiagramNodeComponent;
  let fixture: ComponentFixture<DiagramNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
