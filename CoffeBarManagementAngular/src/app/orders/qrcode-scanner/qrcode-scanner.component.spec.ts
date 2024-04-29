import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodeScannerComponent } from './qrcode-scanner.component';

describe('QRCodeScannerComponent', () => {
  let component: QRCodeScannerComponent;
  let fixture: ComponentFixture<QRCodeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QRCodeScannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QRCodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
