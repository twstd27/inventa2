import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import GlobalToaster from '../components/GlobalToaster'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
      <GlobalToaster />
    </div>
  )
}

export default DefaultLayout
