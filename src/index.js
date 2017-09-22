import React from 'react';
import ReactDOM from 'react-dom';

class Simon extends React.Component {
    constructor(props) {
        super(props);

        this.redLit = '#FF3F3F';
        this.blueLit = '#3F3FFF';
        this.yellowLit = '#FFFF3F';
        this.greenLit = '#3FFF3F';

        this.redUnlit = '#BF0000';
        this.blueUnlit = '#0000BF';
        this.yellowUnlit = '#BFBF00';
        this.greenUnlit = '#00BF00';
    }

    getMessage() {
        if (this.props.message) {
            return (
                <text className="noselect" textAnchor="middle" alignmentBaseline="middle" x="400" y="440" stroke="black" strokeWidth=".1rem" fill={this.props.messageColor} style={{ fontSize: '8rem', fontWeight: 'bold' }}>{this.props.message}</text>
            );
        }
    }

    render() {
        let colorRed = this.redUnlit;
        let colorBlue = this.blueUnlit;
        let colorYellow = this.yellowUnlit;
        let colorGreen = this.greenUnlit;

        switch (this.props.lit) {
            case 'red':
                colorRed = this.redLit;
                break;
            case 'blue':
                colorBlue = this.blueLit;
                break;
            case 'yellow':
                colorYellow = this.yellowLit;
                break;
            case 'green':
                colorGreen = this.greenLit;
                break;
            default:
                break;
        }

        return (
            <svg width="1200" height="800" viewBox="0 0 800 800">
                <g>
                    <circle className="noselect" cx="400" cy="400" r="320" />
                    <path className="noselect" d="M200,340 Q400,192 600,340 L480,460 Q400,406 320,460 Z" fill={colorRed} stroke="black" strokeWidth="1" transform="rotate(45,400,400) translate(0,-160)"
                        onClick={() => this.props.onClick('red')} />
                    <path className="noselect" d="M200,340 Q400,192 600,340 L480,460 Q400,406 320,460 Z" fill={colorBlue} stroke="black" strokeWidth="1" transform="rotate(135,400,400) translate(0,-160)"
                        onClick={() => this.props.onClick('blue')} />
                    <path className="noselect" d="M200,340 Q400,192 600,340 L480,460 Q400,406 320,460 Z" fill={colorYellow} stroke="black" strokeWidth="1" transform="rotate(224,400,400) translate(0,-160)"
                        onClick={() => this.props.onClick('yellow')} />
                    <path className="noselect" d="M200,340 Q400,192 600,340 L480,460 Q400,406 320,460 Z" fill={colorGreen} stroke="black" strokeWidth="1" transform="rotate(315,400,400) translate(0,-160)"
                        onClick={() => this.props.onClick('green')} />
                    <text className="noselect" textAnchor="middle" alignmentBaseline="middle" x="400" y="360" fill="white" style={{ fontSize: '2rem' }}>steps</text>
                    <text className="noselect" textAnchor="middle" alignmentBaseline="middle" x="400" y="440" fill="white" style={{ fontSize: '3rem' }}>{this.props.steps}</text>
                    {this.getMessage()}
                </g>
            </svg>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            state: 'idle',
            lit: 'none',
            strict: false,
            message: undefined,
            messageColor: undefined
        }

        this.game = {
            stateBegin: Date.now(),
            state: 'idle',
            lit: undefined,
            lastEvent: undefined,
            click: undefined,
            pattern: undefined,
            attempt: undefined,
            index: 0
        }

        this.buttonText = {
            idle: 'Begin Game',
            play: 'Restart Game',
            listen: 'Restart Game',
            restart: 'Restart Round',
            win: 'Begin Game',
            lose: 'Begin Game',
        }

        this.greenSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
        this.redSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
        this.yellowSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
        this.blueSound = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

        this.onInterval = this.onInterval.bind(this);
        this.onClickButton = this.onClickButton.bind(this);
        this.onClickPrimary = this.onClickPrimary.bind(this);
        this.onClickSecondary = this.onClickSecondary.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.onInterval, 16);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    onInterval() {
        this.frameTime = Date.now();

        if (this.game.lit && this.frameTime - this.game.lit > 449) {
            this.game.lit = undefined;
            this.setState({
                lit: 'none'
            });
        }

        switch (this.game.state) {
            case 'idle':
                if (this.game.click) {
                    this.activateButton(this.game.click);
                    this.game.click = undefined;
                }
                break;

            case 'play':
                if (!this.game.lastEvent || this.frameTime - this.game.lastEvent > 499) {
                    if (this.game.index < this.game.pattern.length) {
                        this.game.lastEvent = Date.now();
                        this.activateButton(this.game.pattern[this.game.index++]);
                    } else {
                        this.waitForPlayer();
                    }
                }
                break;

            case 'listen':
                if (this.game.click) {
                    if (this.game.attempt.length < this.game.pattern.length) {
                        this.game.attempt.push(this.game.click);
                        this.activateButton(this.game.click);

                        this.setState({
                            attempt: this.game.attempt.slice(0)
                        });

                        const index = this.game.attempt.length - 1;

                        if (this.game.attempt[index] !== this.game.pattern[index]) {
                            if (this.state.strict) {
                                this.setGameState('lose');
                                this.setState({
                                    message: 'YOU LOSE',
                                    messageColor: 'red'
                                });
                            } else {
                                this.setGameState('restart');
                                this.setState({
                                    message: 'TRY AGAIN',
                                    messageColor: 'yellow'
                                });
                            }
                        }

                        if (this.game.attempt.length === this.game.pattern.length) {
                            this.game.lastEvent = Date.now();
                        }
                    }

                    this.game.click = undefined;
                }

                if (this.game.lastEvent && this.frameTime - this.game.lastEvent > 999) {
                    if (this.game.pattern.length < 20) {
                        this.startRound();
                    } else {
                        this.setGameState('win');
                        this.setState({
                            message: 'YOU WIN',
                            messageColor: 'green'
                        });
                    }
                }
                break;

            case 'restart':
                if (this.frameTime - this.game.stateBegin > 3999) {
                    this.setState({
                        message: undefined,
                        messageColor: undefined
                    });
                    this.restartRound();
                }
                break;

            case 'win':
            case 'lose':
                if (this.frameTime - this.game.stateBegin > 3999) {
                    this.setState({
                        message: undefined,
                        messageColor: undefined
                    });
                    this.beginGame();
                }
                break;

            default:
                console.log('game state of ' + this.game.state + ' has no logic');
                break;
        }
    }

    setGameState(state) {
        this.game.stateBegin = Date.now();
        this.game.lastEvent = undefined;
        this.game.click = undefined;
        this.game.index = 0;
        this.game.state = state;
        this.setState({
            state: this.game.state
        });
    }

    beginGame() {
        this.game.pattern = [];
        this.addColor();
        this.setGameState('play');
    }

    waitForPlayer() {
        this.game.attempt = [];
        this.setGameState('listen');
    }

    startRound() {
        this.addColor();
        this.setGameState('play');
    }

    restartRound() {
        this.setGameState('play');
    }

    addColor() {
        const color = ['red', 'blue', 'yellow', 'green'][Math.floor(Math.random() * 4)];
        this.game.pattern.push(color);
        this.setState({
            pattern: this.game.pattern.slice(0)
        });
    }

    activateButton(color) {
        this.setState({
            lit: color
        }, () => {
            switch (this.state.lit) {
                case 'red':
                    this.redSound.play();
                    break;
                case 'blue':
                    this.blueSound.play();
                    break;
                case 'yellow':
                    this.yellowSound.play();
                    break;
                case 'green':
                    this.greenSound.play();
                    break;
                default:
                    return;
            }

            this.game.lit = Date.now();
        });
    }

    onClickButton(color) {
        this.game.click = color;
    }

    onClickPrimary() {
        switch (this.game.state) {
            case 'idle':
            case 'play':
            case 'listen':
                this.beginGame();
                break;

            case 'win':
            case 'lose':
                this.setState({
                    message: undefined,
                    messageColor: undefined
                });
                this.beginGame();
                break;

            case 'restart':
                this.setState({
                    message: undefined,
                    messageColor: undefined
                });
                this.restartRound();
                break;

            default:
                console.log('game state of ' + this.game.state + ' has no logic');
                break;
        }
    }

    onClickSecondary() {
        if (this.state.strict) {
            this.setState({ strict: false });
        } else {
            this.setState({ strict: true });
        }
    }

    padLeft(num, size) {
        var value = "000000000" + num.toString();
        return value.substr(value.length - size);
    }

    render() {
        let steps;

        if (this.state.pattern) {
            steps = this.padLeft(this.state.pattern.length, 2);
        } else {
            steps = '00';
        }

        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col text-center">
                        <Simon steps={steps} lit={this.state.lit} onClick={this.onClickButton} message={this.state.message} messageColor={this.state.messageColor} />
                    </div>
                    <div className="w-100"></div>
                    <div className="w-100"></div>
                    <div className="col-6 text-center">
                        <button className="btn btn-primary btn-lg btn-block" onClick={this.onClickPrimary}>{this.buttonText[this.state.state]}</button>
                    </div>
                    <div className="col-6 text-center">
                        <button className="btn btn-primary btn-lg btn-block" onClick={this.onClickSecondary}>{this.state.strict ? 'Strict Mode: ON' : 'Strict Mode: OFF'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));