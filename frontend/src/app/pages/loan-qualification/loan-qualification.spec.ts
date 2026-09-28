import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanQualification } from './loan-qualification';

describe('LoanQualification', () => {
  let component: LoanQualification;
  let fixture: ComponentFixture<LoanQualification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanQualification],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanQualification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
