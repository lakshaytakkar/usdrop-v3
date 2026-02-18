

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EMAIL_VARIABLES, getVariablesByCategory } from "@/lib/email/variables"
import { EmailVariable } from "@/lib/email/variables"

interface EmailVariableSelectorProps {
  onVariableSelect?: (variable: string) => void
  className?: string
}

export function EmailVariableSelector({ onVariableSelect, className }: EmailVariableSelectorProps) {
  const [search, setSearch] = useState("")

  const filteredVariables = EMAIL_VARIABLES.filter((v) =>
    v.key.toLowerCase().includes(search.toLowerCase()) ||
    v.label.toLowerCase().includes(search.toLowerCase())
  )

  const userVariables = getVariablesByCategory('user')
  const orderVariables = getVariablesByCategory('order')
  const systemVariables = getVariablesByCategory('system')
  const companyVariables = getVariablesByCategory('company')

  const handleVariableClick = (variable: EmailVariable) => {
    if (onVariableSelect) {
      onVariableSelect(variable.key)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm">Available Variables</CardTitle>
        <Input
          placeholder="Search variables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <CardContent>
        {search ? (
          <div className="flex flex-wrap gap-2">
            {filteredVariables.map((variable) => (
              <Badge
                key={variable.key}
                variant="outline"
                className="font-mono text-xs cursor-pointer hover:bg-primary/10"
                onClick={() => handleVariableClick(variable)}
                title={variable.description}
              >
                {variable.key}
              </Badge>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="user" className="text-xs">User</TabsTrigger>
              <TabsTrigger value="order" className="text-xs">Order</TabsTrigger>
              <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
              <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {userVariables.map((variable) => (
                  <Badge
                    key={variable.key}
                    variant="outline"
                    className="font-mono text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handleVariableClick(variable)}
                    title={variable.description}
                  >
                    {variable.key}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="order" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {orderVariables.map((variable) => (
                  <Badge
                    key={variable.key}
                    variant="outline"
                    className="font-mono text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handleVariableClick(variable)}
                    title={variable.description}
                  >
                    {variable.key}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="system" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {systemVariables.map((variable) => (
                  <Badge
                    key={variable.key}
                    variant="outline"
                    className="font-mono text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handleVariableClick(variable)}
                    title={variable.description}
                  >
                    {variable.key}
                  </Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-4">
              <div className="flex flex-wrap gap-2">
                {companyVariables.map((variable) => (
                  <Badge
                    key={variable.key}
                    variant="outline"
                    className="font-mono text-xs cursor-pointer hover:bg-primary/10"
                    onClick={() => handleVariableClick(variable)}
                    title={variable.description}
                  >
                    {variable.key}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}














