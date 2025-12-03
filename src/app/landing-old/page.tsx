"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  TrendingUp, 
  Trophy, 
  Store, 
  Package, 
  BarChart3,
  GraduationCap,
  Sparkles,
  Image as ImageIcon,
  User,
  Presentation,
  Badge as BadgeIcon,
  Calculator,
  Truck,
  Zap,
  Target,
  Clock,
  DollarSign,
  Users,
  Shield,
  CheckCircle2,
  Play,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react"
import { winningProducts } from "@/app/winning-products/data/products"

export default function LandingPage() {
  // Get top 4 winning products for showcase
  const topProducts = winningProducts
    .filter(p => !p.isLocked)
    .sort((a, b) => b.potRevenue - a.potRevenue)
    .slice(0, 4)

  // Calculate stats from real data
  const totalProducts = winningProducts.length
  const totalRevenue = winningProducts.reduce((sum, p) => sum + p.potRevenue, 0)
  const avgProfitMargin = winningProducts.reduce((sum, p) => sum + p.profitMargin, 0) / winningProducts.length

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-white">
        {/* Grainy texture overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.25,
            mixBlendMode: 'multiply'
          }}
        ></div>
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
            opacity: 0.15,
            mixBlendMode: 'overlay'
          }}
        ></div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The Complete Dropshipping Platform
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                Discover winning products, create AI-powered content, and scale your business faster than ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                  <Link href="/login">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  <Link href="/academy">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/images/hero/product-discovery-team.png"
                alt="Product discovery team"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {totalProducts.toLocaleString()}+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Winning Products Discovered
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                50M+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Products Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                1,000+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Active Stores
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                99.9%
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and insights to grow your dropshipping business
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Product Discovery</CardTitle>
              <CardDescription>
                Find winning products with real-time data and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/features/winning-products-display.png"
                alt="Product discovery"
                width={400}
                height={250}
                className="rounded-lg w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">AI Studio Tools</CardTitle>
              <CardDescription>
                Create professional content with AI-powered image and video generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/features/ai-studio-workspace.png"
                alt="AI Studio"
                width={400}
                height={250}
                className="rounded-lg w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Store Research</CardTitle>
              <CardDescription>
                Analyze competitor stores and discover winning strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/features/store-research-workspace.png"
                alt="Store research"
                width={400}
                height={250}
                className="rounded-lg w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Supplier Management</CardTitle>
              <CardDescription>
                Connect with verified suppliers and manage fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/suppliers/warehouse-workers-organizing.png"
                alt="Supplier management"
                width={400}
                height={250}
                className="rounded-lg w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Academy & Intelligence</CardTitle>
              <CardDescription>
                Learn from experts and stay updated with industry insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/academy/learning-environment.png"
                alt="Academy"
                width={400}
                height={250}
                className="rounded-lg w-full object-cover"
              />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-2xl">Analytics Dashboard</CardTitle>
              <CardDescription>
                Track performance with comprehensive analytics and reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="/images/intelligence/analytics-dashboard.png"
                alt="Analytics"
                width={400}
                height={250}
                className="rounded-lg w-full object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Real Data Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Winning Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See actual products discovered by our platform with real metrics
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {topProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      {product.profitMargin.toFixed(1)}% Margin
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                      ${(product.potRevenue / 1000).toFixed(0)}K Revenue
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                      {product.revenueGrowthRate.toFixed(0)}% Growth
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {product.itemsSold.toLocaleString()} items sold
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/winning-products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Tools Showcase */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Creative Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate professional content in minutes, not weeks
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ImageIcon className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Image Studio</CardTitle>
              <CardDescription>
                Generate professional product listing images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/image-studio">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <User className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Model Studio</CardTitle>
              <CardDescription>
                Create model ads for apparel products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/model-studio">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Ad Studio</CardTitle>
              <CardDescription>
                Generate compelling ad creatives with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/ad-studio">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Presentation className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Campaign Studio</CardTitle>
              <CardDescription>
                Plan and manage Meta advertising campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/campaign-studio">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BadgeIcon className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Whitelabelling</CardTitle>
              <CardDescription>
                Apply your logo to multiple images in bulk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/logo-studio">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calculator className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Profit Calculator</CardTitle>
              <CardDescription>
                Calculate dropshipping profits and margins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/profit-calculator">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Truck className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Shipping Calculator</CardTitle>
              <CardDescription>
                Calculate shipping costs and delivery times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/ai-toolkit/shipping-calculator">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Store className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Store Research</CardTitle>
              <CardDescription>
                Analyze competitor stores and strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/store-research">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose USDrop?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and scale your dropshipping business
            </p>
          </div>

          <div className="space-y-20">
            {/* Save Time */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-12 w-12 text-primary" />
                  <h3 className="text-3xl font-bold">Save Time</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Automated product discovery eliminates hours of manual research. Find winning products in seconds, not days.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Real-time product analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Automated trend detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Instant competitor insights</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[300px]">
                <Image
                  src="/images/features/product-discovery-analytics.png"
                  alt="Save time"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Increase Profits */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[300px] md:order-first">
                <Image
                  src="/images/intelligence/analytics-dashboard.png"
                  alt="Increase profits"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-12 w-12 text-primary" />
                  <h3 className="text-3xl font-bold">Increase Profits</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Data-driven decisions maximize your profit margins. See exactly which products will perform before you invest.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Profit margin analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Revenue forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>ROI calculations</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Scale Faster */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-12 w-12 text-primary" />
                  <h3 className="text-3xl font-bold">Scale Faster</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  AI-powered content creation lets you launch products faster. Generate professional images and ads in minutes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Instant product images</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>AI-generated ad creatives</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Bulk content generation</span>
                  </li>
                </ul>
              </div>
              <div className="relative h-[300px]">
                <Image
                  src="/images/features/content-creation-process.png"
                  alt="Scale faster"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Stay Ahead */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[300px] md:order-first">
                <Image
                  src="/images/features/store-research-workspace.png"
                  alt="Stay ahead"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-12 w-12 text-primary" />
                  <h3 className="text-3xl font-bold">Stay Ahead</h3>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Competitor insights and market intelligence keep you ahead of trends. Know what works before your competition.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Competitor store analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Trend prediction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Market intelligence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-white py-20">
        {/* Grainy texture overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.25,
            mixBlendMode: 'multiply'
          }}
        ></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Scale Your Business?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of successful dropshippers using USDrop to find winning products and grow faster.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
            <Link href="/login">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/winning-products" className="hover:text-foreground transition-colors">
                    Winning Products
                  </Link>
                </li>
                <li>
                  <Link href="/ai-toolkit" className="hover:text-foreground transition-colors">
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link href="/store-research" className="hover:text-foreground transition-colors">
                    Store Research
                  </Link>
                </li>
                <li>
                  <Link href="/suppliers" className="hover:text-foreground transition-colors">
                    Suppliers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/academy" className="hover:text-foreground transition-colors">
                    Academy
                  </Link>
                </li>
                <li>
                  <Link href="/intelligence" className="hover:text-foreground transition-colors">
                    Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="hover:text-foreground transition-colors">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} USDrop. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

