"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EMAIL_TOUCHPOINTS, getTouchpointsByStage, getTouchpointsByCategory } from "@/lib/email/touchpoints"
import { EmailTouchpoint } from "@/types/admin/email-automation"

export function EmailTouchpoints() {
  const awarenessTouchpoints = getTouchpointsByStage('awareness')
  const considerationTouchpoints = getTouchpointsByStage('consideration')
  const purchaseTouchpoints = getTouchpointsByStage('purchase')
  const retentionTouchpoints = getTouchpointsByStage('retention')
  const advocacyTouchpoints = getTouchpointsByStage('advocacy')

  const utilityTouchpoints = EMAIL_TOUCHPOINTS.filter(tp => 
    tp.category === 'welcome' || 
    tp.category === 'password-reset' || 
    tp.category === 'order-confirmation' || 
    tp.category === 'shipping-notification' ||
    tp.category === 'onboarding'
  )

  const marketingTouchpoints = EMAIL_TOUCHPOINTS.filter(tp => 
    tp.category === 'abandoned-cart' || 
    tp.category === 're-engagement' || 
    tp.category === 'promotional' || 
    tp.category === 'newsletter'
  )

  const getPriorityColor = (priority: EmailTouchpoint['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Touchpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user-journey" className="w-full">
          <TabsList>
            <TabsTrigger value="user-journey">User Journey</TabsTrigger>
            <TabsTrigger value="utility">Utility Emails</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Emails</TabsTrigger>
          </TabsList>

          <TabsContent value="user-journey" className="mt-4 space-y-6">
            {/* Awareness Stage */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                Awareness
              </h3>
              <div className="space-y-2">
                {awarenessTouchpoints.map((touchpoint) => (
                  <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                          <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                            {touchpoint.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consideration Stage */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent"></span>
                Consideration
              </h3>
              <div className="space-y-2">
                {considerationTouchpoints.map((touchpoint) => (
                  <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                          <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                            {touchpoint.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Stage */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Purchase
              </h3>
              <div className="space-y-2">
                {purchaseTouchpoints.map((touchpoint) => (
                  <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                          <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                            {touchpoint.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Retention Stage */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Retention
              </h3>
              <div className="space-y-2">
                {retentionTouchpoints.map((touchpoint) => (
                  <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                          <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                            {touchpoint.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advocacy Stage */}
            {advocacyTouchpoints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                  Advocacy
                </h3>
                <div className="space-y-2">
                  {advocacyTouchpoints.map((touchpoint) => (
                    <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                            <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                              {touchpoint.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="utility" className="mt-4">
            <div className="space-y-2">
              {utilityTouchpoints.map((touchpoint) => (
                <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                        <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                          {touchpoint.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Trigger: <span className="font-mono">{touchpoint.trigger}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="mt-4">
            <div className="space-y-2">
              {marketingTouchpoints.map((touchpoint) => (
                <div key={touchpoint.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{touchpoint.name}</h4>
                        <Badge variant={getPriorityColor(touchpoint.priority)} className="text-xs">
                          {touchpoint.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{touchpoint.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Trigger: <span className="font-mono">{touchpoint.trigger}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}














