import { Component } from '@angular/core';
import { PollService } from './poll-service/poll.service';
import { Poll, PollForm, PollVote } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blockpoll';
  showForm = false;
  activePoll = null;
  loading = false;

  polls = this.ps.getPolls();

  constructor(private ps :PollService){

  }
  ngOnInit(): void {
    this.activePoll = this.polls[0];
    this.ps.onBlockchainEvent('PollCreated').subscribe(()=>{
      this.polls = this.ps.getPolls();
    });
  }
  setActivePoll(poll){
    this.activePoll = poll;
  }
  handlePollCreate(pollFormData:PollForm){
    this.ps.createPoll(pollFormData);
  }
  handlePollVote(pollVoteData:PollVote){
    this.ps.vote(pollVoteData);
    this.activePoll = null;
    setTimeout(()=>{
      this.polls = this.ps.getPolls();
    }, 5000);
  }
}
