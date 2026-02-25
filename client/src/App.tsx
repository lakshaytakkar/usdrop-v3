import { Switch, Route, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/auth-context";
import { UnifiedUserProvider } from "@/contexts/unified-user-context";
import { UserPlanProvider } from "@/contexts/user-plan-context";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import { Toaster } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthLoadingGate } from "@/components/auth/auth-loading-gate";

import { AdminLayout } from "@/layouts/AdminLayout";
import { DevLayout } from "@/layouts/DevLayout";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { AppLayout } from "@/layouts/AppLayout";

import MarketingPage from "@/pages/(marketing)/page";
import LoginPage from "@/pages/login/page";
import SignupPage from "@/pages/signup/page";

import AdminDashboard from "@/pages/admin/page";
import AdminProducts from "@/pages/admin/products/page";
import AdminProductDetail from "@/pages/admin/products/[id]/page";
import AdminCategories from "@/pages/admin/categories/page";
import AdminCategoryDetail from "@/pages/admin/categories/[id]/page";
import AdminCourses from "@/pages/admin/courses/page";
import AdminCourseBuilder from "@/pages/admin/courses/[courseId]/builder/page";
import AdminCompetitorStores from "@/pages/admin/competitor-stores/page";
import AdminCompetitorStoreDetail from "@/pages/admin/competitor-stores/[id]/page";
import AdminSuppliers from "@/pages/admin/suppliers/page";
import AdminExternalUsers from "@/pages/admin/external-users/page";
import AdminExternalUserDetail from "@/pages/admin/external-users/[id]/page";
import AdminInternalUsers from "@/pages/admin/internal-users/page";
import AdminInternalUserDetail from "@/pages/admin/internal-users/[id]/page";
import AdminPlans from "@/pages/admin/plans/page";
import AdminPlanDetail from "@/pages/admin/plans/[id]/page";
import AdminShopifyStores from "@/pages/admin/shopify-stores/page";
import AdminLeads from "@/pages/admin/leads/page";
import AdminLeadDetail from "@/pages/admin/leads/[id]/page";

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
import WhoIsThisFor from "@/pages/who-is-this-for/page";
import HelpCenter from "@/pages/help-center/page";
import HelpPage from "@/pages/help/page";
import WebinarsPage from "@/pages/webinars/page";
import MySessionsPage from "@/pages/my-sessions/page";
import ModelStudio from "@/pages/studio/model-studio/page";
import Whitelabelling from "@/pages/studio/whitelabelling/page";
import ResourcesPage from "@/pages/resources/page";

import MyProducts from "@/pages/my-products/page";
import MyStore from "@/pages/my-store/page";
import MyRoadmap from "@/pages/my-roadmap/page";
import MyProfile from "@/pages/my-profile/page";
import MyCredentials from "@/pages/my-credentials/page";
import MyRnD from "@/pages/my-rnd/page";
import MyPlan from "@/pages/my-plan/page";
import MyLLC from "@/pages/my-llc/page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Marketing / Landing */}
      <Route path="/" component={() => <MarketingLayout><MarketingPage /></MarketingLayout>} />
      <Route path="/shopify" component={ShopifyMarketingPage} />

      {/* Feature Marketing Pages */}
      <Route path="/features/winning-products" component={WinningProductsMarketing} />
      <Route path="/features/winning-ads" component={WinningAdsMarketing} />
      <Route path="/features/winning-stores" component={WinningStoresMarketing} />
      <Route path="/features/dashboard" component={LiveDashboardMarketing} />
      <Route path="/features/live-sessions" component={LiveSessionsMarketing} />
      <Route path="/features/courses" component={CoursesMarketing} />
      <Route path="/features/fulfilment" component={FulfilmentMarketing} />

      {/* Auth */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/auth/forgot-password" component={AuthForgotPassword} />
      <Route path="/auth/reset-password" component={AuthResetPassword} />
      <Route path="/auth/verify-email" component={AuthVerifyEmail} />
      <Route path="/auth/account-suspended" component={AuthAccountSuspended} />
      <Route path="/auth/auth-code-error" component={AuthCodeError} />
      <Route path="/auth/callback" component={AuthCallback} />

      {/* Admin */}
      <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/products" component={() => <AdminLayout><AdminProducts /></AdminLayout>} />
      <Route path="/admin/products/:id" component={() => <AdminLayout><AdminProductDetail /></AdminLayout>} />
      <Route path="/admin/categories" component={() => <AdminLayout><AdminCategories /></AdminLayout>} />
      <Route path="/admin/categories/:id" component={() => <AdminLayout><AdminCategoryDetail /></AdminLayout>} />
      <Route path="/admin/courses" component={() => <AdminLayout><AdminCourses /></AdminLayout>} />
      <Route path="/admin/courses/:courseId/builder" component={() => <AdminLayout><AdminCourseBuilder /></AdminLayout>} />
      <Route path="/admin/competitor-stores" component={() => <AdminLayout><AdminCompetitorStores /></AdminLayout>} />
      <Route path="/admin/competitor-stores/:id" component={() => <AdminLayout><AdminCompetitorStoreDetail /></AdminLayout>} />
      <Route path="/admin/suppliers" component={() => <AdminLayout><AdminSuppliers /></AdminLayout>} />
      <Route path="/admin/external-users" component={() => <AdminLayout><AdminExternalUsers /></AdminLayout>} />
      <Route path="/admin/external-users/:id" component={() => <AdminLayout><AdminExternalUserDetail /></AdminLayout>} />
      <Route path="/admin/internal-users" component={() => <AdminLayout><AdminInternalUsers /></AdminLayout>} />
      <Route path="/admin/internal-users/:id" component={() => <AdminLayout><AdminInternalUserDetail /></AdminLayout>} />
      <Route path="/admin/plans" component={() => <AdminLayout><AdminPlans /></AdminLayout>} />
      <Route path="/admin/plans/:id" component={() => <AdminLayout><AdminPlanDetail /></AdminLayout>} />
      <Route path="/admin/shopify-stores" component={() => <AdminLayout><AdminShopifyStores /></AdminLayout>} />
      <Route path="/admin/leads" component={() => <AdminLayout><AdminLeads /></AdminLayout>} />
      <Route path="/admin/leads/:id" component={() => <AdminLayout><AdminLeadDetail /></AdminLayout>} />

      {/* Dev */}
      <Route path="/dev" component={() => <DevLayout><DevDashboard /></DevLayout>} />
      <Route path="/dev/tasks" component={() => <DevLayout><DevTasks /></DevLayout>} />
      <Route path="/dev/tasks/new" component={() => <DevLayout><DevTaskNew /></DevLayout>} />
      <Route path="/dev/tasks/:id/edit" component={() => <DevLayout><DevTaskEdit /></DevLayout>} />
      <Route path="/dev/tasks/:id" component={() => <DevLayout><DevTaskDetail /></DevLayout>} />

      {/* App pages (authenticated user pages with top nav) */}
      {/* Framework (personal hub) — /framework/* */}
      <Route path="/framework" component={() => <AppLayout><HomePage /></AppLayout>} />
      <Route path="/framework/my-products" component={() => <AppLayout><MyProducts /></AppLayout>} />
      <Route path="/framework/my-store" component={() => <AppLayout><MyStore /></AppLayout>} />
      <Route path="/framework/my-roadmap" component={() => <AppLayout><MyRoadmap /></AppLayout>} />
      <Route path="/framework/my-learning" component={() => <AppLayout><MentorshipPage /></AppLayout>} />
      <Route path="/framework/my-learning/:id" component={() => <AppLayout><MentorshipDetail /></AppLayout>} />
      <Route path="/framework/my-sessions" component={() => <AppLayout><MySessionsPage /></AppLayout>} />
      <Route path="/framework/my-rnd" component={() => <AppLayout><MyRnD /></AppLayout>} />
      <Route path="/framework/my-profile" component={() => <AppLayout><MyProfile /></AppLayout>} />
      <Route path="/framework/my-credentials" component={() => <AppLayout><MyCredentials /></AppLayout>} />
      <Route path="/framework/my-plan" component={() => <AppLayout><MyPlan /></AppLayout>} />

      {/* Products — /products/* */}
      <Route path="/products/product-hunt" component={() => <AppLayout><ProductHunt /></AppLayout>} />
      <Route path="/products/product-hunt/:id" component={() => <AppLayout><ProductHuntDetail /></AppLayout>} />
      <Route path="/products/winning-products" component={() => <AppLayout><WinningProducts /></AppLayout>} />
      <Route path="/products/categories" component={() => <AppLayout><CategoriesPage /></AppLayout>} />
      <Route path="/products/seasonal-collections" component={() => <AppLayout><SeasonalCollections /></AppLayout>} />
      <Route path="/products/competitor-stores" component={() => <AppLayout><CompetitorStoresPage /></AppLayout>} />

      {/* Ads — /ads/* */}
      <Route path="/ads/meta-ads" component={() => <AppLayout><MetaAds /></AppLayout>} />
      <Route path="/ads/videos" component={() => <AppLayout><VideosPage /></AppLayout>} />

      {/* Private Supplier */}
      <Route path="/private-supplier" component={() => <AppLayout><SuppliersPage /></AppLayout>} />

      {/* LLC */}
      <Route path="/llc" component={() => <AppLayout><MyLLC /></AppLayout>} />

      {/* AI Studio — /ai-studio/* */}
      <Route path="/ai-studio/model-studio" component={() => <AppLayout><ModelStudio /></AppLayout>} />
      <Route path="/ai-studio/whitelabelling" component={() => <AppLayout><Whitelabelling /></AppLayout>} />

      {/* Tools — /tools/* */}
      <Route path="/tools/description-generator" component={() => <AppLayout><DescriptionGenerator /></AppLayout>} />
      <Route path="/tools/email-templates" component={() => <AppLayout><EmailTemplates /></AppLayout>} />
      <Route path="/tools/policy-generator" component={() => <AppLayout><PolicyGenerator /></AppLayout>} />
      <Route path="/tools/invoice-generator" component={() => <AppLayout><InvoiceGenerator /></AppLayout>} />
      <Route path="/tools/profit-calculator" component={() => <AppLayout><ProfitCalculator /></AppLayout>} />
      <Route path="/tools/shipping-calculator" component={() => <AppLayout><ShippingCalculator /></AppLayout>} />
      <Route path="/tools/cro-checklist" component={() => <AppLayout><CROChecklist /></AppLayout>} />

      {/* Resources */}
      <Route path="/resources" component={() => <AppLayout><ResourcesPage /></AppLayout>} />

      {/* Other app pages */}
      <Route path="/mentorship" component={() => <AppLayout><MentorshipPage /></AppLayout>} />
      <Route path="/mentorship/:id" component={() => <AppLayout><MentorshipDetail /></AppLayout>} />
      <Route path="/blogs" component={() => <AppLayout><BlogsPage /></AppLayout>} />
      <Route path="/blogs/:slug" component={() => <AppLayout><BlogDetail /></AppLayout>} />
      <Route path="/prompt-analyzer" component={() => <AppLayout><PromptAnalyzer /></AppLayout>} />
      <Route path="/store-research" component={() => <AppLayout><StoreResearch /></AppLayout>} />
      <Route path="/research-tools" component={() => <AppLayout><ResearchTools /></AppLayout>} />
      <Route path="/intelligence-hub" component={() => <AppLayout><IntelligenceHub /></AppLayout>} />
      <Route path="/selling-channels" component={() => <AppLayout><SellingChannels /></AppLayout>} />
      <Route path="/fulfillment" component={() => <AppLayout><Fulfillment /></AppLayout>} />
      <Route path="/shopify-stores" component={() => <AppLayout><ShopifyStores /></AppLayout>} />
      <Route path="/what-is-dropshipping" component={() => <MarketingLayout><WhatIsDropshipping /></MarketingLayout>} />
      <Route path="/who-is-this-for" component={() => <AppLayout><WhoIsThisFor /></AppLayout>} />
      <Route path="/help-center" component={() => <AppLayout><HelpCenter /></AppLayout>} />
      <Route path="/help" component={() => <AppLayout><HelpPage /></AppLayout>} />

      {/* Legacy redirects → new /menu/submenu routes */}
      <Route path="/home"><Redirect to="/framework" /></Route>
      <Route path="/my-products"><Redirect to="/framework/my-products" /></Route>
      <Route path="/my-store"><Redirect to="/framework/my-store" /></Route>
      <Route path="/my-roadmap"><Redirect to="/framework/my-roadmap" /></Route>
      <Route path="/my-learning"><Redirect to="/framework/my-learning" /></Route>
      <Route path="/my-learning/:id">{(params) => <Redirect to={`/framework/my-learning/${params.id}`} />}</Route>
      <Route path="/my-rnd"><Redirect to="/framework/my-rnd" /></Route>
      <Route path="/my-sessions"><Redirect to="/framework/my-sessions" /></Route>
      <Route path="/webinars"><Redirect to="/framework/my-sessions" /></Route>
      <Route path="/framework/my-llc"><Redirect to="/llc" /></Route>
      <Route path="/my-profile"><Redirect to="/framework/my-profile" /></Route>
      <Route path="/my-credentials"><Redirect to="/framework/my-credentials" /></Route>
      <Route path="/product-hunt"><Redirect to="/products/product-hunt" /></Route>
      <Route path="/product-hunt/:id">{(params) => <Redirect to={`/products/product-hunt/${params.id}`} />}</Route>
      <Route path="/winning-products"><Redirect to="/products/winning-products" /></Route>
      <Route path="/categories"><Redirect to="/products/categories" /></Route>
      <Route path="/seasonal-collections"><Redirect to="/products/seasonal-collections" /></Route>
      <Route path="/competitor-stores"><Redirect to="/products/competitor-stores" /></Route>
      <Route path="/meta-ads"><Redirect to="/ads/meta-ads" /></Route>
      <Route path="/suppliers"><Redirect to="/private-supplier" /></Route>
      <Route path="/tools" component={() => <AppLayout><ToolsPage /></AppLayout>} />
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
