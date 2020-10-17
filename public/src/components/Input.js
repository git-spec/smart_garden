import React, {Component} from 'react';
import './Input.css';

class Input extends Component{
    render() {
        return(
            <input type={this.props.type} className={this.props.className} placeholder={this.props.placeholder} />
        );
    };
};

export default Input;