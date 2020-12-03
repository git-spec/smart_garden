import React, {Component} from 'react';

class Range extends Component {
    render() {
        return(
            <div className="wrap-range"role="group" aria-label="multi thumb slider with ruler">
                <label className="sr-only" htmlFor="a">value a</label>
                <input id="a" type="range" min = "min" max = "max" className={this.props.className} />
                <output htmlFor="a" aria-hidden="true"></output>
                <output htmlFor="a" aria-hidden="true"></output>
                <output htmlFor="a" aria-hidden="true"></output>
                <label className="sr-only" htmlFor="b">value b</label>
                <input id="b" type="range" min = "min" max = "max" className={this.props.className} />
                <output htmlFor="b" aria-hidden="true"></output>
                <output htmlFor="b" aria-hidden="true"></output>
                <output htmlFor="b" aria-hidden="true"></output>
                <div></div>            
            </div>
        );
    };
};

export default Range;