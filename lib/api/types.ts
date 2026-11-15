export interface ApiErrorShape {
  msg?: string
  message?: string
  [k: string]: any
}

export interface BackendLoginResponse {
  user: {
    id: string
    username: string
    email: string
    displayName?: string
  }
  accessToken?: string
  refreshToken?: string
  token?: string
  msg?: string
}

export interface BackendRegisterResponse {
  msg?: string
  user: {
    id: string
    userName?: string
    username?: string
    email?: string
    displayName?: string
  }
  token?: string
}
