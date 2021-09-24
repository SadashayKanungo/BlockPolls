import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Poll, PollVote } from '../types';

@Component({
  selector: 'app-poll-vote',
  templateUrl: './poll-vote.component.html',
  styleUrls: ['./poll-vote.component.scss']
})
export class PollVoteComponent implements OnInit,OnChanges {
  // @Input() question :string;
  // @Input() voted :boolean;
  // @Input() options :string[];
  // @Input() results :number[];

  @Input() poll :Poll;
  question :string;
  voted :boolean;
  options :string[];
  results :number[];

  @Output() pollVoted :EventEmitter<PollVote> = new EventEmitter();

  numberOfVotes :number;
  percentageOfVotes :string[];

  voteForm: FormGroup;

  constructor(private fb:FormBuilder) {
    this.voteForm = this.fb.group({
      selected: this.fb.control('', [Validators.required])
    });
  }

  ngOnInit(): void {
    if(this.poll.results.length){
      this.question = this.poll.question;
      this.voted = this.poll.voted;
      this.results = this.poll.results;
      this.options = this.poll.options;
      this.numberOfVotes = this.poll.results.reduce((sum,i)=>{return sum += i});
      this.percentageOfVotes = this.poll.results.map((n,i) => {return "width:" + Math.floor(n*100/this.numberOfVotes) + "%;"; });
    }
  }
  submitForm(){
    const pollVoteData :PollVote ={
      id: this.poll.id,
      vote: this.voteForm.get("selected").value
    }
    this.pollVoted.emit(pollVoteData)
  }
  ngOnChanges(changes: SimpleChanges){
    this.question = this.poll.question;
    this.voted = this.poll.voted;
    this.results = this.poll.results;
    this.options = this.poll.options;
    this.numberOfVotes = changes.poll.currentValue.results.reduce((sum,i)=>{return sum += i});
    this.percentageOfVotes = changes.poll.currentValue.results.map((n) => {return "width:" + Math.floor(n*100/this.numberOfVotes) + "%;"; });
  }

}
