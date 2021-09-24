import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PollForm } from '../types';

@Component({
  selector: 'app-poll-create',
  templateUrl: './poll-create.component.html',
  styleUrls: ['./poll-create.component.scss']
})
export class PollCreateComponent implements OnInit {
  pollForm: FormGroup;

  @Output() pollCreated :EventEmitter<PollForm> = new EventEmitter();

  constructor(private fb:FormBuilder) {
    this.pollForm = this.fb.group({
      question: this.fb.control('', [Validators.required]),
      image: this.fb.control(''),
      options: this.fb.control('')
    });
  }
  submitForm() {
    const formData :PollForm = {
      question: this.pollForm.get("question").value,
      image: this.pollForm.get("image").value,
      options: this.pollForm.get("options").value.split(',').map(str => str.trim())
    };
    this.pollCreated.emit(formData);
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
