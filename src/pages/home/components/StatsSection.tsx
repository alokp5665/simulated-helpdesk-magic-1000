
import { Card, CardContent } from "@/components/ui/card";

export const StatsSection = () => {
  return (
    <div className="mb-12 fade-in">
      <Card className="glass-card">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Trusted by Support Teams Worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <p className="text-sm text-muted-foreground">Companies</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25M+</div>
              <p className="text-sm text-muted-foreground">Tickets Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">30min</div>
              <p className="text-sm text-muted-foreground">Avg. Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
