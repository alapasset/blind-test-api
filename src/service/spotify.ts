import got from 'got'

class SpotifyService {
  static AUTH_SPOTIFY_URL: string = 'https://accounts.spotify.com'
  static API_SPOTIFY_URL: string = 'https://api.spotify.com/v1'
  private static instance: SpotifyService;
  private code: string
  private access_token: string
  private refresh_token: string
  private access_token_expire_epoch: Date
  constructor() {}

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService()
    }

    return SpotifyService.instance;
  }
  public async setCode(code: string) {
    this.code = code
    await this.getNewAuthorization()
  }
  public static getAuthUrl () {
    return `${SpotifyService.AUTH_SPOTIFY_URL}/authorize?client_id=f80117db049c42f18beba3911fe96479&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:8081/spotify/callback')}&scope=${encodeURI('playlist-read-collaborative playlist-read-private')}`
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
      this.access_token_expire_epoch = new Date()
      this.access_token_expire_epoch.setMinutes(this.access_token_expire_epoch.getMinutes() + JSON.parse(response.body).expires_in);
    } catch (error) {
      console.log(error)
    }
  }

  private async refreshAuthorization() {
    try {
      const response = await got.post(`${SpotifyService.AUTH_SPOTIFY_URL}/api/token`, {
        body: `grant_type=refresh_token&refresh_token=${this.refresh_token}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${ Buffer.from('f80117db049c42f18beba3911fe96479:e9c4343b58484480ae6a8a1d122f12f6').toString('base64') }`
        }
      })
      this.access_token = JSON.parse(response.body).access_token
      this.access_token_expire_epoch = new Date()
      this.access_token_expire_epoch.setMinutes(this.access_token_expire_epoch.getMinutes() + JSON.parse(response.body).expires_in);
    } catch (error) {
      console.log(error)
    }
  }

  private async checkAccessToken () {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.access_token_expire_epoch) {
          resolve(false)
        } else if (Date.now() > this.access_token_expire_epoch.getTime()) {
          await this.refreshAuthorization()
          resolve(true)
        } else {
          resolve(true)
        }
      } catch (e) {
        reject()
      }
    })
  }

  private async doCallSpotifyApi(url: string) {
    try {
      const res = await got(`${SpotifyService.API_SPOTIFY_URL}${url}`, {
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

  public async getMyInformations(){
    if (! await this.checkAccessToken()) {
      return false;
    }

    return this.doCallSpotifyApi(`/me`)
  }

  public async getPlaylistInformations(playlistId: string) {
    if (! await this.checkAccessToken()) {
      return false;
    }

    return this.doCallSpotifyApi(`/playlist/${playlistId}`)
  }

  public async getPlaylistTracksInformations(playlistId: string) {
    if (! await this.checkAccessToken()) {
      return false;
    }

    return this.doCallSpotifyApi(`/playlists/${playlistId}/tracks`)
  }
}

export { SpotifyService }
