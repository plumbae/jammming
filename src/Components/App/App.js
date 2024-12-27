import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: 'New Playlist',
      playListTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    };
    this.setState(prevState => ({
      playListTracks: [...prevState.playListTracks, track]
    }));
  }
  removeTrack(track) {
    this.setState(prevState => ({
      playListTracks: prevState.playListTracks.filter(savedTrack => savedTrack.id !== track.id)
    }));
  }
  updatePlaylistName(name) {
    this.setState({ playListName: name });
  }
  savePlaylist() {
    const trackURIs = this.state.playListTracks.map(track => track.uri);
    const playListName = this.state.playListName;
    console.log(`Saving playlist: ${playListName}`);
    console.log('Track URIs:', trackURIs);
    Spotify.savePlayList(playListName, trackURIs).then(() => {
      this.setState({
        playListName: 'New Playlist',
        playListTracks: []
      })
    });
  }
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
            searchResults={this.state.searchResults}
            onAdd={this.addTrack} />
            <Playlist
            playListName={this.state.playListName}
            playListTracks={this.state.playListTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
