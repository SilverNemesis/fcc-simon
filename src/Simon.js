import React from 'react';

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

export default Simon;
