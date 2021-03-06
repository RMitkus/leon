import React from 'react';

class Clock extends React.Component {

    state = {date: new Date()};

    componentDidMount() {
        setInterval(
            () => this.tick(),
            1000
        );
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render(): React.ReactNode {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        return (
            this.state.date.toLocaleTimeString('en-EN', options)
        );
    }
}

export { Clock };
