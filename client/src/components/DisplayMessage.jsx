import React, { Component } from 'react';

class DisplayMessage extends Component {
    
    render() {
        return(
            <div className="alert alert-primary" role="alert">
                {this.props.message}
            </div>
        );
    }

}

export default DisplayMessage;