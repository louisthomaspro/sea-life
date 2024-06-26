import { AMREntry, AuthenticatorAssuranceLevels, UserAppMetadata, UserMetadata } from "@supabase/supabase-js"
import { JwtPayload } from "jsonwebtoken"

export type AuthTokens = {
  access_token: string
  refresh_token: string
}

export interface SupabaseJwtPayload extends JwtPayload {
  sub: string
  id: string
  aud: string
  role?: string
  email?: string
  phone?: string
  is_anonymous?: boolean
  app_metadata: UserAppMetadata
  user_metadata: UserMetadata
  session_id?: string
  aal?: AuthenticatorAssuranceLevels
  amr?: AMREntry
}

export type AuthResponse = {
  status: "success" | "error"
  data?: SupabaseJwtPayload
  error?: string
}
