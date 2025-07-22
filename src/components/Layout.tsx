import { Suspense } from "react"
import { useLocation } from "react-router-dom"
import Header from "./Header"
import LeftSidebar from "./LeftSidebar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  const location = useLocation()
  const isSignInPage = location.pathname === "/sign-in"
  const isSignUpPage = location.pathname === "/sign-up"
  const isMessagerPage = location.pathname === "/messager"

  if (isSignInPage || isSignUpPage) {
    return <Outlet />
  }

  // Hide sidebar on messager page for full-width chat experience
  if (isMessagerPage) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans">
        <Header />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <main className="h-[calc(100vh-56px)] md:h-[calc(100vh-64px)]">
            <Outlet />
          </main>
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <div className="flex relative">
        <LeftSidebar />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <main className="flex-1 px-2 sm:px-4 py-4 min-h-screen lg:ml-80">
            <div className="max-w-4xl mx-auto">
              <Outlet />
            </div>
          </main>
        </Suspense>
      </div>
    </div>
  )
}

export default Layout
