const clientId = '9b73462f7669488c84325f571a4e7bdf';
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {

  getAccessToken() {
    
    if(accessToken) {
      return accessToken;
    }

    // check for access token match
    const usrAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    //console.log(usrAccessTokenMatch);

    if(usrAccessTokenMatch && usrAccessTokenMatch[1] && expiresInMatch && expiresInMatch[1]) {
      accessToken = usrAccessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access token', null, '/');
      console.log('Parameters cleared');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
      console.log('AccessUrl set');
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Request failed!');
      }
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks)  {
        //alert('no tracks');
        return [];
      }
      //alert('tracks?')
      console.log(jsonResponse);
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    }).catch(error => {
      console.error(error);
      return [];
    });
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