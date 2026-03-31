import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

// Providers
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Email ve Şifre",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Lütfen email ve şifre giriniz.")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          throw new Error("Kullanıcı bulunamadı veya farklı bir yöntemle (Google/TikTok) kayıt olunmuş.")
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Hatalı şifre.")
        }

        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore (role özelliği modelden geldiği için ts kuralını geçici esnetiyoruz)
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    // error: "/login", // Hata durumunda tekrar login sayfasına dönmesi için
  }
})
