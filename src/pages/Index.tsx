import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, QrCode, CheckCircle, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();


  const userRoles = [
    {
      title: "Student",
      description: "Submit and track your outpass requests",
      icon: <Users className="h-12 w-12 text-primary" />,
      path: "/student-login"
    },
    {
      title: "Warden/Faculty",
      description: "Review and approve student requests",
      icon: <Shield className="h-12 w-12 text-primary" />,
      path: "/warden-login"
    },
    {
      title: "Security",
      description: "Verify outpasses at gate checkpoints",
      icon: <QrCode className="h-12 w-12 text-primary" />,
      path: "/security-login"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Outpass Management
            </h1>
          </div>
        </div>
      </section>


      {/* User Roles Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Portal
            </h2>
            <p className="text-xl text-muted-foreground">
              Access your dedicated dashboard based on your role
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <Card 
                key={index} 
                className="text-center p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
                onClick={() => navigate(role.path)}
              >
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-6">
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {role.description}
                  </p>
                  <Button className="w-full" variant="outline">
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Outpass Guardian</h3>
          <p className="text-background/80">
            Simplifying hostel management, one outpass at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;