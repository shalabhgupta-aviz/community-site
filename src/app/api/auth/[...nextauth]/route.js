// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'

const {
  WP_URL,
  WP_ADMIN_USER,
  WP_ADMIN_APP_PW,
  NEXTAUTH_SECRET
} = process.env

export const authOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId:     process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      const slug = user.email
        .replace(/@.+$/, '')         // strip domain
        .replace(/\W+/g, '-')        // sanitize
        .toLowerCase()

      const pw = Math.random().toString(36).slice(-8)

      // First check if user exists
      const checkRes = await fetch(
        `${WP_URL}/wp-json/wp/v2/users?slug=${slug}&context=edit`,
        { headers: { 'Authorization': 'Basic ' + Buffer.from(`${WP_ADMIN_USER}:${WP_ADMIN_APP_PW}`).toString('base64') } }
      )

      let wpUser
      if (checkRes.ok) {
        const existingUsers = await checkRes.json()
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
          // User exists, update their password
          wpUser = existingUsers[0]
          await fetch(`${WP_URL}/wp-json/wp/v2/users/${wpUser.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(`${WP_ADMIN_USER}:${WP_ADMIN_APP_PW}`).toString('base64'),
            },
            body: JSON.stringify({
              password: pw
            })
          })
        }
      }

      if (!wpUser) {
        // Create new user if doesn't exist
        await fetch(`${WP_URL}/wp-json/wp/v2/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${WP_ADMIN_USER}:${WP_ADMIN_APP_PW}`).toString('base64'),
          },
          body: JSON.stringify({
            username: slug,
            name: user.name,
            email: user.email,
            password: pw
          })
        }).catch(()=>{})

        // Get the newly created user
        const newUserRes = await fetch(
          `${WP_URL}/wp-json/wp/v2/users?slug=${slug}&context=edit`,
          { headers: { 'Authorization': 'Basic ' + Buffer.from(`${WP_ADMIN_USER}:${WP_ADMIN_APP_PW}`).toString('base64') } }
        )

        if (!newUserRes.ok) {
          console.error('WP user fetch failed', newUserRes.status)
          return false
        }

        const newUsers = await newUserRes.json()
        if (!Array.isArray(newUsers) || newUsers.length === 0) {
          console.error('No WP user found for slug', slug)
          return false
        }

        wpUser = newUsers[0]
      }

      // Attach the WP user object onto the NextAuth user
      user.id = wpUser.id
      user.slug = wpUser.slug
      user.wpPassword = pw
      user.wpMeta = wpUser

      return true
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.user = user    // stash WP user payload
      }
      // once only: mint a **user** JWT (not admin) so WP will recognise /me
      if (token.user && !token.wpJwt) {
        const { token: wpJwt } = await fetch(
          `${WP_URL}/wp-json/jwt-auth/v1/token`,
          {
            method: 'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({
              username: token.user.slug,
              password: token.user.wpPassword
            })
          }
        ).then(r=>r.json())
        token.wpJwt = wpJwt
      }
      console.log(token)
      return token
    },
    async session({ session, token }) {
      // expose both for client
      session.user  = token.user.wpMeta
      session.wpJwt = token.wpJwt
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }