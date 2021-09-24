export interface Poll extends PollForm{
  id: number;
  results: number[]; // List of nos of votes for each option
  voted: boolean; // if our user has voted
}
export interface PollForm{
  question: string;
  options: string[];
  image: string; // image url
}
export interface PollVote{
  id: number;
  vote: number;
}

export interface Voter{
  id: String;
  voted: number[]; //List of ids of polls
}
