import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Scan, CheckCircle, XCircle, Search, User, MapPin, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dataStore, OutpassRecord } from "@/lib/dataStore";


const SecurityDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanInput, setScanInput] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<OutpassRecord | null>(null);
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [outpassRecords, setOutpassRecords] = useState<OutpassRecord[]>([]);

  useEffect(() => {
    // Load security records from data store
    setOutpassRecords(dataStore.getAllSecurityRecords());
  }, []);

  const handleScan = () => {
    // Try to parse QR code data (JSON format)
    let searchId = scanInput.toUpperCase();
    try {
      const qrData = JSON.parse(scanInput);
      if (qrData.id) {
        searchId = qrData.id;
      }
    } catch {
      // If not JSON, use as plain text ID
    }

    const record = dataStore.getSecurityRecordById(searchId);
    if (record) {
      setSelectedRecord(record);
      setShowScanDialog(true);
      setScanInput("");
    } else {
      toast({
        title: "Invalid QR Code",
        description: "No valid outpass found for this QR code.",
        variant: "destructive"
      });
    }
  };

  const handleExit = () => {
    if (selectedRecord) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      dataStore.updateSecurityRecord(selectedRecord.id, { 
        exitTime: currentTime, 
        isActive: true 
      });
      setOutpassRecords(dataStore.getAllSecurityRecords());
      toast({
        title: "Exit Recorded",
        description: `${selectedRecord.studentName} has been marked as exited.`,
      });
      setShowScanDialog(false);
      setSelectedRecord(null);
    }
  };

  const handleReturn = () => {
    if (selectedRecord) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      dataStore.updateSecurityRecord(selectedRecord.id, { 
        returnTime: currentTime, 
        isActive: false 
      });
      setOutpassRecords(dataStore.getAllSecurityRecords());
      toast({
        title: "Return Recorded",
        description: `${selectedRecord.studentName} has been marked as returned.`,
      });
      setShowScanDialog(false);
      setSelectedRecord(null);
    }
  };

  const activeOutpasses = outpassRecords.filter(r => r.isActive);
  const todayExits = outpassRecords.filter(r => r.exitTime);
  const todayReturns = outpassRecords.filter(r => r.returnTime);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Security Dashboard</h1>
                <p className="text-primary-foreground/80">QR Code Verification & Tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('currentUser');
                  navigate('/');
                }}
                className="text-primary-foreground hover:bg-white/10"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* QR Scanner Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 max-w-md">
              <Input
                placeholder="Enter outpass ID or scan QR code"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleScan} disabled={!scanInput.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Verify
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Outpasses</p>
                  <p className="text-2xl font-bold text-warning">{activeOutpasses.length}</p>
                </div>
                <User className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Exits</p>
                  <p className="text-2xl font-bold text-primary">{todayExits.length}</p>
                </div>
                <ArrowLeft className="h-8 w-8 text-primary rotate-180" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Returns</p>
                  <p className="text-2xl font-bold text-success">{todayReturns.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Returns</p>
                  <p className="text-2xl font-bold text-destructive">
                    {activeOutpasses.length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Outpasses */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-warning" />
              Currently Outside ({activeOutpasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOutpasses.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{record.studentName}</h3>
                        <Badge variant="outline">{record.rollNumber}</Badge>
                        <Badge className="bg-warning text-warning-foreground">Active</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <strong>Destination:</strong> {record.destination}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <strong>Exit Time:</strong> {record.exitTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <strong>Return By:</strong> {record.toDate}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {activeOutpasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>All students are currently in the hostel.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outpassRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${record.isActive ? 'bg-warning' : 'bg-success'}`}></div>
                    <div>
                      <p className="font-medium">{record.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.isActive ? `Exited at ${record.exitTime}` : `Returned at ${record.returnTime}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={record.isActive ? "secondary" : "outline"}>
                    {record.isActive ? "Outside" : "Returned"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Result Dialog */}
      <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Outpass Verification - {selectedRecord?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Student Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedRecord.studentName}</p>
                    <p><strong>Roll Number:</strong> {selectedRecord.rollNumber}</p>
                    <p><strong>Department:</strong> {selectedRecord.department}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Outpass Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Reason:</strong> {selectedRecord.reason}</p>
                    <p><strong>Destination:</strong> {selectedRecord.destination}</p>
                    <p><strong>Valid Until:</strong> {selectedRecord.toDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium text-success-foreground">Valid Outpass - Approved</span>
              </div>
              
              <div className="flex gap-4">
                {!selectedRecord.exitTime ? (
                  <Button onClick={handleExit} className="flex-1">
                    <User className="h-4 w-4 mr-2" />
                    Mark Exit
                  </Button>
                ) : selectedRecord.isActive ? (
                  <Button onClick={handleReturn} className="flex-1 bg-success hover:bg-success/90">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Return
                  </Button>
                ) : (
                  <div className="flex-1 p-3 bg-muted rounded text-center text-muted-foreground">
                    Student already returned at {selectedRecord.returnTime}
                  </div>
                )}
                <Button variant="outline" onClick={() => setShowScanDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityDashboard;