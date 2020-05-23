import got from 'got'

class SpotifyService {
  private static instance: SpotifyService;

  private code: string

  private access_token: string

  private refresh_token: string

  private access_token_expire_epoch: Date

  constructor() {}

  static AUTH_SPOTIFY_URL: string = 'https://accounts.spotify.com'
  static API_SPOTIFY_URL: string = 'https://api.spotify.com/v1'

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService()
    }

    return SpotifyService.instance;
  }

  static getAuthUrl () {
    return `${SpotifyService.AUTH_SPOTIFY_URL}/authorize?client_id=f80117db049c42f18beba3911fe96479&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:8081/spotify/callback')}&scope=${encodeURI('playlist-read-collaborative playlist-read-private')}`
  }
  async setCode(code: string) {
    this.code = code
    await this.getNewAuthorization()
  }

  async getMyInformations(){
    try {
      const res = await got(`${SpotifyService.API_SPOTIFY_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${this.access_token}`
        },
        responseType: 'json'
      })
      return res.body
    } catch (error) {
      console.log(error)
    }
  }

  private async getNewAuthorization() {
    try {
      const response = await got.post(`${SpotifyService.AUTH_SPOTIFY_URL}/api/token`, {
        body: `grant_type=authorization_code&code=${this.code}&redirect_uri=${encodeURIComponent('http://localhost:8081/spotify/callback')}&client_id=f80117db049c42f18beba3911fe96479&client_secret=e9c4343b58484480ae6a8a1d122f12f6`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      this.access_token = JSON.parse(response.body).access_token
      this.refresh_token = JSON.parse(response.body).refresh_token
      this.access_token_expire_epoch = Date.now() + JSON.parse(response.body).expires_in
    } catch (error) {
      console.log(error)
    }
  }

  // private refreshAccessToken() {

  // }

  // private async checkAccessToken2 () {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       if (this.accessTokenEpoch === 0) {
  //         await this.getNewAuthorization()
  //         resolve()
  //       } else if (Date.now() > (this.accessTokenEpoch - 300)) {
  //         await this.refreshAccessToken()
  //         resolve()
  //       } else {
  //         resolve()
  //       }
  //     } catch (e) {
  //       reject()
  //     }
  //   })
  // }

  // public async getPlaylistInformations(playlistId: string) {
  //   await this.checkAccessToken2()
  //   const playlistInformations = await this.spotifyApi.getPlaylist(playlistId)
  //   return playlistInformations
  // }

  // public async getPlaylistTracksInformations(playlistId: string) {
  //   await this.checkAccessToken2()
  //   const playlistInformations = await this.spotifyApi.getPlaylistTracks(playlistId, {market: 'FR'})
  //   return playlistInformations
  // }
}

export { SpotifyService }
