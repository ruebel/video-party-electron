import React, { Component } from 'react';
import styled from 'styled-components';
import Dashboard from '../Dashboard';
import Player from '../Player';

const Wrapper = styled.div`
  background: ${p => p.theme.color.dark};
  color: ${p => p.theme.color.light};
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
  width: 100%;
`;

class App extends Component {
  state = {
    id: null,
    main: false
  };

  componentDidMount() {
    const id = window.location.search.substring(
      1,
      window.location.search.length
    );
    if (id === 'main') {
      this.setState({
        main: true
      });
    } else {
      this.setState({ id });
    }
  }

  render() {
    return (
      <Wrapper>
        {this.state.main ? <Dashboard /> : <Player id={this.state.id} />}
      </Wrapper>
    );
  }
}

export default App;
