import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
}

export default function StatsCard({ title, value, icon, change }: StatsCardProps) {
  const ChangeIcon = change >= 0 ? ArrowUpRight : ArrowDownRight;
  const changeColor = change >= 0 ? "text-[hsl(var(--chart-2))]" : "text-destructive";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <span className={`flex items-center font-semibold ${changeColor}`}>
            <ChangeIcon className="h-4 w-4 mr-1" />
            {change.toFixed(2)}%
          </span>
          &nbsp;from last period
        </p>
      </CardContent>
    </Card>
  );
}
