import React from "react";
import Track from "../Track/Track";
import './TrackList.css';

class TrackList extends React.Component {
  render() {
    const { tracks } = this.props;
    if (!tracks) {
      return <div>Loading tracks...</div>;
    }
    //console.log('TrackList props:', this.props);
    return(
      <div className="TrackList">
        {this.props.tracks.map((track) => (
          <Track key={track.id} track={track} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} onRemove={this.props.onRemove} />
        ))}
      </div>
    );
  }
}

export default TrackList;