import { Injectable } from '@angular/core';
import { Web3Service } from '../blockchain/web3.service';
import { Poll, PollForm, PollVote, Voter } from '../types';
import { fromAscii, toAscii } from 'web3-utils';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  /*
  polls :Poll[] = [
    {
      id: 1,
      question: "Do you like Cats or Dogs?",
      image: "https://media.istockphoto.com/photos/british-short-hair-cat-and-golden-retriever-picture-id992637094?k=20&m=992637094&s=612x612&w=0&h=TsroJcfNHlnIuOsoyosl-NQJITGHAnI79ROvHU7lPs8=",
      options: ["Cats", "Dogs", "Neither", "Both"],
      results: [18,7,0,5],
      voted: true
    },
    {
      id: 2,
      question: "Where would you go to holiday?",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHhis2sY28tcEOXmVLRIsJkYVfHbxdlPdDZSf7nNz6UEGS4hgqCfUS8AxGJOJzl2UHi-U&usqp=CAU",
      options: ["Beach", "Mountain", "Ocean", "Safari"],
      results: [10,9,4,9],
      voted: false
    }
  ];
  */

  constructor(private web3: Web3Service) { }

  private parseVoter(rawVoter) :Voter{
    return {
      id: rawVoter[0],
      voted: rawVoter[1] ?
        rawVoter[1].map((pollId) => parseInt(pollId)) :
        []
    }
  }
  private parsePoll(rawPoll, voter:Voter) :Poll{
    return {
      id: parseInt(rawPoll[0]),
      question: rawPoll[1],
      image: rawPoll[2],
      results: rawPoll[3].map(r => parseInt(r)),
      options: rawPoll[4].map(opt => toAscii(opt).replace(/\0/g, '')),
      voted: voter.voted.length && voter.voted.includes(parseInt(rawPoll[0]))
    }
  }

  async getPolls(): Promise<Poll[]> {
    const polls: Poll[] = [];

    const totalPolls = await this.web3.executeCall('getTotalPolls');
    const acc = await this.web3.getAccount();
    const voter = await this.web3.executeCall('getVoter', acc);
    const voterNormalized = this.parseVoter(voter);

    for (let i = 0; i < totalPolls; i++) {
      const pollRaw = await this.web3.executeCall('getPoll', i);
      const pollNormalized = this.parsePoll(pollRaw, voterNormalized);
      polls.push(pollNormalized);
    }

    return polls;
  }


  async vote(pollVoteData :PollVote){
    await this.web3.executeTransaction(
      'acceptVote',
      pollVoteData.id,
      pollVoteData.vote
    );
  }

  createPoll(pollFormData :PollForm){
    this.web3.executeTransaction(
      'createPoll',
      pollFormData.question,
      pollFormData.image,
      pollFormData.options.map(opt => fromAscii(opt))
    );
  }

  onBlockchainEvent(name: string) {
    return this.web3.onEvent(name);
  }
}
