import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAccountPage } from './personal-account.page';

describe('PersonalAccountPage', () => {
  let component: PersonalAccountPage;
  let fixture: ComponentFixture<PersonalAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
