import { Switch, Route, Redirect, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { UnifiedUserProvider } from "@/contexts/unified-user-context";
import { UserPlanProvider } from "@/contexts/user-plan-context";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import { Toaster } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthLoadingGate } from "@/components/auth/auth-loading-gate";
import { useUserMetadata } from "@/hooks/use-user-metadata";

import { AdminLayout } from "@/layouts/AdminLayout";
import { DevLayout } from "@/layouts/DevLayout";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { AppLayout } from "@/layouts/AppLayout";

import MarketingPage from "@/pages/(marketing)/page";
import LoginPage from "@/pages/login/page";
import SignupPage from "@/pages/signup/page";

import AdminDashboard from "@/pages/admin/page";
import AdminCourses from "@/pages/admin/courses/page";
import AdminCourseBuilder from "@/pages/admin/courses/[courseId]/builder/page";
import AdminProducts from "@/pages/admin/products/page";
import AdminProductDetail from "@/pages/admin/products/[id]/page";
import AdminCategories from "@/pages/admin/categories/page";
import AdminCategoryDetail from "@/pages/admin/categories/[id]/page";
import AdminPipeline from "@/pages/admin/pipeline/page";
import AdminAccessControl from "@/pages/admin/access-control/page";
import AdminSessions from "@/pages/admin/sessions/page";
import AdminClients from "@/pages/admin/clients/page";
import AdminLLC from "@/pages/admin/llc/page";
import AdminTickets from "@/pages/admin/tickets/page";
import AdminTicketDetail from "@/pages/admin/tickets/[id]/page";
import AdminUsers from "@/pages/admin/users/page";
import AdminUserDetail from "@/pages/admin/users/[id]/page";
import AdminBatchDetail from "@/pages/admin/batches/[id]/page";
import AdminFreeLearning from "@/pages/admin/content/free-learning/page";
import AdminRoadmapContent from "@/pages/admin/content/roadmap/page";
import AdminCROContent from "@/pages/admin/content/cro-checklist/page";
import AdminVideos from "@/pages/admin/videos/page";
import AdminImportantLinks from "@/pages/admin/important-links/page";
import AdminPlans from "@/pages/admin/plans/page";
import PublicPaymentPage from "@/pages/payment/[id]/page";

import DevDashboard from "@/pages/dev/page";
import DevTasks from "@/pages/dev/tasks/page";
import DevTaskDetail from "@/pages/dev/tasks/[id]/page";
import DevTaskEdit from "@/pages/dev/tasks/[id]/edit/page";
import DevTaskNew from "@/pages/dev/tasks/new/page";

import AuthForgotPassword from "@/pages/auth/forgot-password/page";
import AuthResetPassword from "@/pages/auth/reset-password/page";
import AuthVerifyEmail from "@/pages/auth/verify-email/page";
import AuthAccountSuspended from "@/pages/auth/account-suspended/page";
import AuthCodeError from "@/pages/auth/auth-code-error/page";
import AuthCallback from "@/pages/auth/callback/page";

import HomePage from "@/pages/home/page";
import ProductHunt from "@/pages/product-hunt/page";
import ProductHuntDetail from "@/pages/product-hunt/[id]/page";
import CategoriesPage from "@/pages/categories/page";
import SuppliersPage from "@/pages/suppliers/page";
import CompetitorStoresPage from "@/pages/competitor-stores/page";
import MentorshipPage from "@/pages/mentorship/page";
import MentorshipDetail from "@/pages/mentorship/[id]/page";
import BlogsPage from "@/pages/blogs/page";
import BlogDetail from "@/pages/blogs/[slug]/page";
import ToolsPage from "@/pages/tools/page";
import DescriptionGenerator from "@/pages/tools/description-generator/page";
import EmailTemplates from "@/pages/tools/email-templates/page";
import InvoiceGenerator from "@/pages/tools/invoice-generator/page";
import PolicyGenerator from "@/pages/tools/policy-generator/page";
import ProfitCalculator from "@/pages/tools/profit-calculator/page";
import ShippingCalculator from "@/pages/shipping-calculator/page";
import CROChecklist from "@/pages/tools/cro-checklist/page";
import PromptAnalyzer from "@/pages/prompt-analyzer/page";
import StoreResearch from "@/pages/store-research/page";
import ResearchTools from "@/pages/research-tools/page";
import IntelligenceHub from "@/pages/intelligence-hub/page";
import MetaAds from "@/pages/meta-ads/page";
import VideosPage from "@/pages/videos/page";
import SellingChannels from "@/pages/selling-channels/page";
import SeasonalCollections from "@/pages/seasonal-collections/page";
import WinningProducts from "@/pages/winning-products/page";
import TrendingProducts from "@/pages/trending-products/page";
import Fulfillment from "@/pages/fulfillment/page";
import ShopifyStores from "@/pages/shopify-stores/page";
import ShopifyMarketingPage from "@/pages/shopify/page";
import WhatIsDropshipping from "@/pages/what-is-dropshipping/page";

import WinningProductsMarketing from "@/pages/(marketing)/winning-products/page";
import WinningAdsMarketing from "@/pages/(marketing)/winning-ads/page";
import WinningStoresMarketing from "@/pages/(marketing)/winning-stores/page";
import LiveDashboardMarketing from "@/pages/(marketing)/live-dashboard/page";
import LiveSessionsMarketing from "@/pages/(marketing)/live-sessions/page";
import CoursesMarketing from "@/pages/(marketing)/courses/page";
import FulfilmentMarketing from "@/pages/(marketing)/fulfilment/page";
import MentorshipMarketingPage from "@/pages/(marketing)/mentorship/page";
import WhoIsThisFor from "@/pages/who-is-this-for/page";
import HelpCenter from "@/pages/help-center/page";
import HelpPage from "@/pages/help/page";
import WebinarsPage from "@/pages/webinars/page";
import MySessionsPage from "@/pages/my-sessions/page";
import ModelStudio from "@/pages/studio/model-studio/page";
import Whitelabelling from "@/pages/studio/whitelabelling/page";
import ResourcesPage from "@/pages/resources/page";
import FreeLearningPage from "@/pages/free-learning/page";
import FreeLearningLessonPage from "@/pages/free-learning/[lessonId]/page";
import SupportPage from "@/pages/support/page";

import MyProducts from "@/pages/my-products/page";
import MyStore from "@/pages/my-store/page";
import StoreDetail from "@/pages/my-store/[id]/page";
import MyRoadmap from "@/pages/my-roadmap/page";
import MyProfile from "@/pages/my-profile/page";
import MyRnD from "@/pages/my-rnd/page";
import MyAds from "@/pages/my-ads/page";
import MyPlan from "@/pages/my-plan/page";
import MyApps from "@/pages/my-apps/page";
import MyLLC from "@/pages/my-llc/page";
import ClaimStore from "@/pages/claim-store/page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { isInternal, loading: metaLoading } = useUserMetadata()

  if (authLoading || metaLoading) return null
  if (!user) return <Redirect to="/login" />
  if (!isInternal) return <Redirect to="/framework" />

  return <>{children}</>
}

function UserGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { isInternal, loading: metaLoading } = useUserMetadata()

  if (authLoading || metaLoading) return null
  if (!user) return <Redirect to="/login" />
  if (isInternal) return <Redirect to="/admin" />

  return <>{children}</>
}

function NotFound() {
  const { user, loading: authLoading } = useAuth()
  const { isInternal, loading: metaLoading } = useUserMetadata()
  const [, navigate] = useLocation()
  const [countdown, setCountdown] = useState(5)

  const isLoading = authLoading || metaLoading

  const redirectPath = !user ? "/login" : isInternal ? "/admin" : "/framework"
  const redirectLabel = redirectPath === "/login" ? "Login" : redirectPath === "/admin" ? "Dashboard" : "Home"

  useEffect(() => {
    if (isLoading) return

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isLoading])

  useEffect(() => {
    if (countdown <= 0 && !isLoading) {
      navigate(redirectPath)
    }
  }, [countdown, isLoading, redirectPath])

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#F5F5F7' }}>
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-300" data-testid="text-404">404</h1>
        <p className="text-lg text-muted-foreground" data-testid="text-not-found">This page doesn't exist</p>
        <p className="text-sm text-muted-foreground" data-testid="text-redirect-countdown">
          {isLoading ? "Loading..." : `Redirecting to ${redirectLabel} in ${countdown}s...`}
        </p>
        <button
          onClick={() => navigate(redirectPath)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors cursor-pointer"
          data-testid="button-go-back"
        >
          Go to {redirectLabel}
        </button>
      </div>
    </div>
  )
}

function Router() {
  return (
    <Switch>
      {/* Marketing / Landing */}
      <Route path="/" component={() => <MarketingLayout><MarketingPage /></MarketingLayout>} />
      <Route path="/shopify" component={ShopifyMarketingPage} />

      {/* Free Learning (public, but uses app shell) */}
      <Route path="/free-learning" component={() => <AppLayout><FreeLearningPage /></AppLayout>} />
      <Route path="/free-learning/:lessonId" component={() => <AppLayout><FreeLearningLessonPage /></AppLayout>} />

      {/* Feature Marketing Pages */}
      <Route path="/features/winning-products" component={WinningProductsMarketing} />
      <Route path="/features/winning-ads" component={WinningAdsMarketing} />
      <Route path="/features/winning-stores" component={WinningStoresMarketing} />
      <Route path="/features/dashboard" component={LiveDashboardMarketing} />
      <Route path="/features/live-sessions" component={LiveSessionsMarketing} />
      <Route path="/features/courses" component={CoursesMarketing} />
      <Route path="/features/fulfilment" component={FulfilmentMarketing} />
      <Route path="/mentorship" component={MentorshipPage} />
      <Route path="/1on1-mentorship" component={MentorshipMarketingPage} />

      {/* Auth */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/auth/forgot-password" component={AuthForgotPassword} />
      <Route path="/auth/reset-password" component={AuthResetPassword} />
      <Route path="/auth/verify-email" component={AuthVerifyEmail} />
      <Route path="/auth/account-suspended" component={AuthAccountSuspended} />
      <Route path="/auth/auth-code-error" component={AuthCodeError} />
      <Route path="/auth/callback" component={AuthCallback} />

      {/* Admin (internal users only) */}
      <Route path="/admin" component={() => <AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
      <Route path="/admin/courses" component={() => <AdminGuard><AdminLayout><AdminCourses /></AdminLayout></AdminGuard>} />
      <Route path="/admin/courses/:courseId/builder" component={() => <AdminGuard><AdminLayout><AdminCourseBuilder /></AdminLayout></AdminGuard>} />
      <Route path="/admin/products" component={() => <AdminGuard><AdminLayout><AdminProducts /></AdminLayout></AdminGuard>} />
      <Route path="/admin/products/:id" component={() => <AdminGuard><AdminLayout><AdminProductDetail /></AdminLayout></AdminGuard>} />
      <Route path="/admin/categories" component={() => <AdminGuard><AdminLayout><AdminCategories /></AdminLayout></AdminGuard>} />
      <Route path="/admin/categories/:id" component={() => <AdminGuard><AdminLayout><AdminCategoryDetail /></AdminLayout></AdminGuard>} />
      <Route path="/admin/pipeline/:id">{(params: { id: string }) => <Redirect to={`/admin/users/${params.id}`} />}</Route>
      <Route path="/admin/pipeline" component={() => <AdminGuard><AdminLayout><AdminPipeline /></AdminLayout></AdminGuard>} />
      <Route path="/admin/access-control" component={() => <AdminGuard><AdminLayout><AdminAccessControl /></AdminLayout></AdminGuard>} />
      <Route path="/admin/sessions" component={() => <AdminGuard><AdminLayout><AdminSessions /></AdminLayout></AdminGuard>} />
      <Route path="/admin/clients" component={() => <AdminGuard><AdminLayout><AdminClients /></AdminLayout></AdminGuard>} />
      <Route path="/admin/llc" component={() => <AdminGuard><AdminLayout><AdminLLC /></AdminLayout></AdminGuard>} />
      <Route path="/admin/tickets" component={() => <AdminGuard><AdminLayout><AdminTickets /></AdminLayout></AdminGuard>} />
      <Route path="/admin/tickets/:id" component={() => <AdminGuard><AdminLayout><AdminTicketDetail /></AdminLayout></AdminGuard>} />
      <Route path="/admin/users" component={() => <AdminGuard><AdminLayout><AdminUsers /></AdminLayout></AdminGuard>} />
      <Route path="/admin/users/:id" component={() => <AdminGuard><AdminLayout><AdminUserDetail /></AdminLayout></AdminGuard>} />
      <Route path="/admin/batches/:id" component={() => <AdminGuard><AdminLayout><AdminBatchDetail /></AdminLayout></AdminGuard>} />
      <Route path="/admin/content/free-learning" component={() => <AdminGuard><AdminLayout><AdminFreeLearning /></AdminLayout></AdminGuard>} />
      <Route path="/admin/content/roadmap" component={() => <AdminGuard><AdminLayout><AdminRoadmapContent /></AdminLayout></AdminGuard>} />
      <Route path="/admin/content/cro-checklist" component={() => <AdminGuard><AdminLayout><AdminCROContent /></AdminLayout></AdminGuard>} />
      <Route path="/admin/videos" component={() => <AdminGuard><AdminLayout><AdminVideos /></AdminLayout></AdminGuard>} />
      <Route path="/admin/important-links" component={() => <AdminGuard><AdminLayout><AdminImportantLinks /></AdminLayout></AdminGuard>} />
      <Route path="/admin/plans" component={() => <AdminGuard><AdminLayout><AdminPlans /></AdminLayout></AdminGuard>} />

      {/* Public payment page */}
      <Route path="/payment/:id" component={PublicPaymentPage} />

      {/* Dev */}
      <Route path="/dev" component={() => <DevLayout><DevDashboard /></DevLayout>} />
      <Route path="/dev/tasks" component={() => <DevLayout><DevTasks /></DevLayout>} />
      <Route path="/dev/tasks/new" component={() => <DevLayout><DevTaskNew /></DevLayout>} />
      <Route path="/dev/tasks/:id/edit" component={() => <DevLayout><DevTaskEdit /></DevLayout>} />
      <Route path="/dev/tasks/:id" component={() => <DevLayout><DevTaskDetail /></DevLayout>} />

      {/* App pages (external users only — admin users redirected to /admin) */}
      {/* Framework (personal hub) — /framework/* */}
      <Route path="/framework" component={() => <UserGuard><AppLayout><HomePage /></AppLayout></UserGuard>} />
      <Route path="/framework/my-products" component={() => <UserGuard><AppLayout><MyProducts /></AppLayout></UserGuard>} />
      <Route path="/framework/my-store" component={() => <UserGuard><AppLayout><MyStore /></AppLayout></UserGuard>} />
      <Route path="/framework/my-store/:id" component={() => <UserGuard><AppLayout><StoreDetail /></AppLayout></UserGuard>} />
      <Route path="/framework/my-roadmap" component={() => <UserGuard><AppLayout><MyRoadmap /></AppLayout></UserGuard>} />
      <Route path="/framework/my-learning" component={() => <UserGuard><AppLayout><MentorshipPage /></AppLayout></UserGuard>} />
      <Route path="/framework/my-learning/:id" component={() => <UserGuard><AppLayout><MentorshipDetail /></AppLayout></UserGuard>} />
      <Route path="/framework/my-sessions" component={() => <UserGuard><AppLayout><MySessionsPage /></AppLayout></UserGuard>} />
      <Route path="/framework/my-rnd" component={() => <UserGuard><AppLayout><MyRnD /></AppLayout></UserGuard>} />
      <Route path="/framework/my-ads" component={() => <UserGuard><AppLayout><MyAds /></AppLayout></UserGuard>} />
      <Route path="/framework/my-profile" component={() => <UserGuard><AppLayout><MyProfile /></AppLayout></UserGuard>} />
      <Route path="/framework/my-apps" component={() => <UserGuard><AppLayout><MyApps /></AppLayout></UserGuard>} />
      <Route path="/framework/my-plan" component={() => <UserGuard><AppLayout><MyPlan /></AppLayout></UserGuard>} />

      {/* Claim Store */}
      <Route path="/claim-store" component={() => <UserGuard><AppLayout><ClaimStore /></AppLayout></UserGuard>} />

      {/* Products — /products/* */}
      <Route path="/products/product-hunt" component={() => <UserGuard><AppLayout><ProductHunt /></AppLayout></UserGuard>} />
      <Route path="/products/product-hunt/:id" component={() => <UserGuard><AppLayout><ProductHuntDetail /></AppLayout></UserGuard>} />
      <Route path="/products/winning-products" component={() => <UserGuard><AppLayout><WinningProducts /></AppLayout></UserGuard>} />
      <Route path="/products/categories" component={() => <UserGuard><AppLayout><CategoriesPage /></AppLayout></UserGuard>} />
      <Route path="/products/seasonal-collections" component={() => <UserGuard><AppLayout><SeasonalCollections /></AppLayout></UserGuard>} />
      <Route path="/products/trending" component={() => <UserGuard><AppLayout><TrendingProducts /></AppLayout></UserGuard>} />
      <Route path="/products/competitor-stores" component={() => <UserGuard><AppLayout><CompetitorStoresPage /></AppLayout></UserGuard>} />

      {/* Ads — /ads/* */}
      <Route path="/ads/meta-ads" component={() => <UserGuard><AppLayout><MetaAds /></AppLayout></UserGuard>} />
      <Route path="/ads/videos" component={() => <UserGuard><AppLayout><VideosPage /></AppLayout></UserGuard>} />

      {/* Private Supplier */}
      <Route path="/private-supplier" component={() => <UserGuard><AppLayout><SuppliersPage /></AppLayout></UserGuard>} />

      {/* LLC */}
      <Route path="/llc" component={() => <MarketingLayout><MyLLC /></MarketingLayout>} />

      {/* AI Studio — /ai-studio/* */}
      <Route path="/ai-studio/model-studio" component={() => <UserGuard><AppLayout><ModelStudio /></AppLayout></UserGuard>} />
      <Route path="/ai-studio/whitelabelling" component={() => <UserGuard><AppLayout><Whitelabelling /></AppLayout></UserGuard>} />

      {/* Tools — /tools/* */}
      <Route path="/tools/description-generator" component={() => <UserGuard><AppLayout><DescriptionGenerator /></AppLayout></UserGuard>} />
      <Route path="/tools/email-templates" component={() => <UserGuard><AppLayout><EmailTemplates /></AppLayout></UserGuard>} />
      <Route path="/tools/policy-generator" component={() => <UserGuard><AppLayout><PolicyGenerator /></AppLayout></UserGuard>} />
      <Route path="/tools/invoice-generator" component={() => <UserGuard><AppLayout><InvoiceGenerator /></AppLayout></UserGuard>} />
      <Route path="/tools/profit-calculator" component={() => <UserGuard><AppLayout><ProfitCalculator /></AppLayout></UserGuard>} />
      <Route path="/tools/shipping-calculator" component={() => <UserGuard><AppLayout><ShippingCalculator /></AppLayout></UserGuard>} />
      <Route path="/tools/cro-checklist" component={() => <UserGuard><AppLayout><CROChecklist /></AppLayout></UserGuard>} />

      {/* Resources */}
      <Route path="/resources" component={() => <UserGuard><AppLayout><ResourcesPage /></AppLayout></UserGuard>} />

      {/* Other app pages */}
      <Route path="/mentorship" component={() => <UserGuard><AppLayout><MentorshipPage /></AppLayout></UserGuard>} />
      <Route path="/mentorship/:id" component={() => <UserGuard><AppLayout><MentorshipDetail /></AppLayout></UserGuard>} />
      <Route path="/blogs" component={() => <UserGuard><AppLayout><BlogsPage /></AppLayout></UserGuard>} />
      <Route path="/blogs/:slug" component={() => <UserGuard><AppLayout><BlogDetail /></AppLayout></UserGuard>} />
      <Route path="/prompt-analyzer" component={() => <UserGuard><AppLayout><PromptAnalyzer /></AppLayout></UserGuard>} />
      <Route path="/store-research" component={() => <UserGuard><AppLayout><StoreResearch /></AppLayout></UserGuard>} />
      <Route path="/research-tools" component={() => <UserGuard><AppLayout><ResearchTools /></AppLayout></UserGuard>} />
      <Route path="/intelligence-hub" component={() => <UserGuard><AppLayout><IntelligenceHub /></AppLayout></UserGuard>} />
      <Route path="/selling-channels" component={() => <UserGuard><AppLayout><SellingChannels /></AppLayout></UserGuard>} />
      <Route path="/fulfillment" component={() => <UserGuard><AppLayout><Fulfillment /></AppLayout></UserGuard>} />
      <Route path="/shopify-stores">{() => { window.location.replace('/framework/my-store'); return null; }}</Route>
      <Route path="/what-is-dropshipping" component={() => <MarketingLayout><WhatIsDropshipping /></MarketingLayout>} />
      <Route path="/who-is-this-for" component={() => <UserGuard><AppLayout><WhoIsThisFor /></AppLayout></UserGuard>} />
      <Route path="/help-center" component={() => <UserGuard><AppLayout><HelpCenter /></AppLayout></UserGuard>} />
      <Route path="/support" component={() => <UserGuard><AppLayout><SupportPage /></AppLayout></UserGuard>} />
      <Route path="/help" component={() => <UserGuard><AppLayout><HelpPage /></AppLayout></UserGuard>} />

      {/* Legacy redirects → new /menu/submenu routes */}
      <Route path="/home"><Redirect to="/framework" /></Route>
      <Route path="/my-products"><Redirect to="/framework/my-products" /></Route>
      <Route path="/my-store"><Redirect to="/framework/my-store" /></Route>
      <Route path="/my-roadmap"><Redirect to="/framework/my-roadmap" /></Route>
      <Route path="/my-learning"><Redirect to="/framework/my-learning" /></Route>
      <Route path="/my-learning/:id">{(params) => <Redirect to={`/framework/my-learning/${params.id}`} />}</Route>
      <Route path="/my-rnd"><Redirect to="/framework/my-rnd" /></Route>
      <Route path="/my-ads"><Redirect to="/framework/my-ads" /></Route>
      <Route path="/my-sessions"><Redirect to="/framework/my-sessions" /></Route>
      <Route path="/webinars"><Redirect to="/framework/my-sessions" /></Route>
      <Route path="/framework/my-llc"><Redirect to="/llc" /></Route>
      <Route path="/my-profile"><Redirect to="/framework/my-profile" /></Route>
      <Route path="/product-hunt"><Redirect to="/products/product-hunt" /></Route>
      <Route path="/product-hunt/:id">{(params) => <Redirect to={`/products/product-hunt/${params.id}`} />}</Route>
      <Route path="/winning-products"><Redirect to="/products/winning-products" /></Route>
      <Route path="/categories"><Redirect to="/products/categories" /></Route>
      <Route path="/seasonal-collections"><Redirect to="/products/seasonal-collections" /></Route>
      <Route path="/competitor-stores"><Redirect to="/products/competitor-stores" /></Route>
      <Route path="/meta-ads"><Redirect to="/ads/meta-ads" /></Route>
      <Route path="/suppliers"><Redirect to="/private-supplier" /></Route>
      <Route path="/tools" component={() => <UserGuard><AppLayout><ToolsPage /></AppLayout></UserGuard>} />
      <Route path="/shipping-calculator"><Redirect to="/tools/shipping-calculator" /></Route>
      <Route path="/studio/model-studio"><Redirect to="/ai-studio/model-studio" /></Route>
      <Route path="/studio/whitelabelling"><Redirect to="/ai-studio/whitelabelling" /></Route>
      <Route path="/tools/model-studio"><Redirect to="/ai-studio/model-studio" /></Route>
      <Route path="/tools/whitelabelling"><Redirect to="/ai-studio/whitelabelling" /></Route>
      <Route path="/ai-studio/description-generator"><Redirect to="/tools/description-generator" /></Route>
      <Route path="/ai-studio/email-templates"><Redirect to="/tools/email-templates" /></Route>
      <Route path="/ai-studio/policy-generator"><Redirect to="/tools/policy-generator" /></Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UnifiedUserProvider>
          <UserPlanProvider>
            <OnboardingProvider>
              <ErrorBoundary>
                <AuthLoadingGate>
                  <Router />
                </AuthLoadingGate>
              </ErrorBoundary>
              <Toaster />
            </OnboardingProvider>
          </UserPlanProvider>
        </UnifiedUserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
