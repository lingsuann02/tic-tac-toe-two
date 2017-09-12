import { Component } from '@angular/core';

class Square {
  state: string;
  display: string;

  constructor(state: string, display: string) {
    this.state = state;
    this.display = display;
  }
}

class CombinationSquare {
  combination: Array<number>;
  score: number;

  constructor(combination: Array<number>, score: number) {
    this.combination = combination;
    this.score = score;
  }
}


@Component({
  selector: 'my-app',
  template: `
  
    <div id="ttt-game">

      <div class="game-restart text-center">
        <span (click)="onRestart()">Restart</span>
      </div>

      <div class="game-title text-center">
        <p>Tic Tac Toe</p>
      </div>
    
      <div class="game-board center-block">

        <div *ngFor="let sq of squares; let c = index;" class="square sq-{{c}}" [ngSwitch]="sq.state" (click)="onSquareSelect(c)">
          <div [ngClass]="{'sq-hidden': turns == 0}" class="sq-available" *ngSwitchCase="'sq-available'">{{user}}</div>
          <div class="{{sq.state}}" *ngSwitchDefault>{{sq.display}}</div>
        </div>    

      </div>

      <div class="game-alert text-center">
        <p>{{alert}}</p>
      </div>

    </div>

  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  user: string = "X";
  opponent: string = "O";
  turns: number = 9;
  alert: string = "";

  squares: Array<Square> = [
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',""),
    new Square('sq-available',"")
  ];

  winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  onRestart(): void {
    this.user = "X";
    this.opponent = "O";
    this.turns = 9;
    this.alert = "";

    this.squares = [
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',""),
      new Square('sq-available',"")
    ];
  }

  onPlayerChange(player: string) : void {
    this.user = player;
  }

  onSquareSelect(square: number) : void {

    if (this.turns == 0 || this.squares[square].display.length > 0) {
      return;
    }

    this.selectSquare(square, this.user);
    this.turns--;
    let bestCombination: CombinationSquare = this.checkBoard(this.user);
    if (bestCombination.score == 3) {
      this.highlightWinningRow(bestCombination.combination);
      this.alert = "You have won.";
      this.turns = 0;
    }
    else {
      this.opponentMove();
    }
  }

  opponentMove(): void {
    let bestCombination: CombinationSquare = this.checkNextBestMove(this.opponent);
    for (let i = 0; i < 3; i++) {
      if (!this.squares[bestCombination.combination[i]].display) {
        this.selectSquare(bestCombination.combination[i], this.opponent);
        this.turns--;
        break;
      }
    }
    if (this.checkRowComplete(this.opponent, bestCombination.combination) == 3) {
      this.highlightWinningRow(bestCombination.combination);
      this.alert = "You have lost.";
      this.turns = 0;
    }
    else if (this.turns === 0) {
      this.alert = "It's a draw!";
    }
  }


  selectSquare(square: number, player: string): void {
    this.squares[square].state = "sq-unavailable";
    this.squares[square].display = player;
  }

  checkRowComplete(player: string, row: Array<number>): number {
    let score = 0;
    if (this.squares[row[0]].display == player) {
      score++;
    }
    if (this.squares[row[1]].display == player) {
      score++;
    }
    if (this.squares[row[2]].display == player) {
      score++;
    }
    return score;
  }

  // check if any winning combination has been achieved
  checkBoard(player: string): any {
    let strongestCombination = 0;
    let highestScore = 0;

    for (let i = 0; i < this.winningCombinations.length; i++) {
      let score = 0;

      if (this.squares[this.winningCombinations[i][0]].display == player) {
        score++;
      }
      // don't bother working out the rest of the score as the player can't win with this row
      else if (this.squares[this.winningCombinations[i][0]].display && this.squares[this.winningCombinations[i][0]].display != player) {
        continue;
      }
      if (this.squares[this.winningCombinations[i][1]].display == player) {
        score++;
      }
      else if (this.squares[this.winningCombinations[i][1]].display && this.squares[this.winningCombinations[i][1]].display != player) {
        continue;
      }
      if (this.squares[this.winningCombinations[i][2]].display == player) {
        score++;
      }
      else if (this.squares[this.winningCombinations[i][2]].display && this.squares[this.winningCombinations[i][2]].display != player) {
        continue;
      }

      if (score > highestScore) {
        strongestCombination = i;
        highestScore = score;

        if (score == 3) {
          break;
        }
      }
    }
    return new CombinationSquare(this.winningCombinations[strongestCombination], highestScore);
  }

  // check whether the AI must play defensively or offensively
  checkNextBestMove(player: string): CombinationSquare {
    let strongestUserCombination = this.checkBoard(this.user);
    let strongestOpponentCombination = this.checkBoard(this.opponent);

    if (strongestOpponentCombination.score >= strongestUserCombination.score) {
      return strongestOpponentCombination;
    }
    else {
      return strongestUserCombination;
    }
  }

  highlightWinningRow(row: Array<number>): void {
    for (let i = 0; i < 3; i++) {
      this.squares[row[i]].state = 'sq-winner';
    }
  }
}
