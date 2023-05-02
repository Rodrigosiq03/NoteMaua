import { UserProvider } from '@/contexts/user_provider'
import './globals.css'

export const metadata = {
  title: 'NoteMauá',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          { children }
        </UserProvider>  
      </body>
    </html>
  )
}
