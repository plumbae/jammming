import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    };

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  
  search() {
    this.props.onSearch(this.state.term)
  }
  
  handleTermChange(event) {
    this.setState({ term: event.target.value});
  }

  handleKeyPress(event) {
    if (event.key === 'Enter'){
      this.props.onSearch(this.state.term);
      event.target.blur();
    }
  }

  handleFocus(event) {
    event.target.select();
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.handleKeyPress} onFocus={this.handleFocus} />
        <button className="SearchButton" onClick={this.search} >SEARCH</button>
      </div>
    );
  }
}

export default SearchBar;