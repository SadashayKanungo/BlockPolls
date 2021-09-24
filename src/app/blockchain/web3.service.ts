import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';

const contractAbi = require("./contractAbi.json");

declare var window:any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: Web3;
  private contract :Contract;
  private contractAddress = "0x79AB577cba7fEf6567c13Ae0Af02Efaf2BAe4d3f";

  constructor(private zone:NgZone) {
    if(window.web3){
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(
        contractAbi,
        this.contractAddress
      );
      window.ethereum.enable().catch((error)=>{
        console.log('Etherium enable error', error);
      })
    }
    else{
      alert("Please install or enable METAMASK to connect to the Blockchain.")
    }
  }

  getAccount():Promise<string>{
    return this.web3.eth.getAccounts().then((accounts) => accounts[0] || "");
  }

  async executeTransaction(fnName:string, ...args:any[]) :Promise<void>{
    const account = await this.getAccount();
    this.contract.methods[fnName](...args).send({from:account});
    return;
  }
  async executeCall(fnName:string, ...args:any[]) {
    const account = await this.getAccount();
    return this.contract.methods[fnName](...args).call({from:account});
  }

  onEvent(event: string) :Observable<any> {
    return new Observable((observer) => {
      this.contract.events[event]().on('data', (data) => {
        this.zone.run(() => {
          observer.next({
            event: data.event,
            payload: data.returnValues,
          });
        });
      });
    });
  }
}
