const clientId = '9b73462f7669488c84325f571a4e7bdf';
const redirectUri = 'http://localhost:3000';
let accessToken;

const Spotify = {

  getAccessToken() {
    if(accessToken) {
      console.log('There is a accessToken');
      return accessToken;
    }
    console.log('No accessToken');

    // check for access token match
    const usrAccessTokenMatch = window.location.href.match(/acccess_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if(usrAccessTokenMatch && expiresInMatch) {
      accessToken = usrAccessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse)  {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist[0].name,
        album: track.album.name,
        uri: track.uri
      }))
    })
  },

  savePlayList(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};
    let userId;
    return fetch('https://api.spotify.com/v1/me', { headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name})

      }).then(response => response.json()
      ).then(jsonResponse => {
        const playListId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`,
          {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackURIs })
        })
      })
    })
  }
}

export default Spotify;