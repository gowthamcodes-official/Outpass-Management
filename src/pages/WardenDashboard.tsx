import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { dataStore, OutpassRequest } from "@/lib/dataStore";


const WardenDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<OutpassRequest | null>(null);
  const [comments, setComments] = useState("");
  const [requests, setRequests] = useState<OutpassRequest[]>([]);

  useEffect(() => {
    // Load requests from data store
    setRequests(dataStore.getAllRequests());
  }, []);

  const handleApproval = (requestId: string, action: 'approved' | 'rejected') => {
    dataStore.updateRequestStatus(requestId, action, comments);
    setRequests(dataStore.getAllRequests());
    
    toast({
      title: action === 'approved' ? "Request Approved" : "Request Rejected",
      description: `Outpass request ${requestId} has been ${action}.`,
    });
    
    setSelectedRequest(null);
    setComments("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-warning text-warning-foreground';
    }
  };

  const getPriorityLevel = (reason: string) => {
    const emergencyKeywords = ['emergency', 'medical', 'urgent'];
    return emergencyKeywords.some(keyword => 
      reason.toLowerCase().includes(keyword)
    ) ? 'high' : 'normal';
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

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
                <h1 className="text-2xl font-bold">Warden Dashboard</h1>
                <p className="text-primary-foreground/80">Review and approve student requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{pendingRequests.length}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold text-success">
                    {requests.filter(r => r.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Emergency</p>
                  <p className="text-2xl font-bold text-destructive">
                    {requests.filter(r => getPriorityLevel(r.reason) === 'high').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Pending Approval ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{request.studentName}</h3>
                        <Badge variant="outline">{request.rollNumber}</Badge>
                        <Badge variant="secondary">{request.department}</Badge>
                        {getPriorityLevel(request.reason) === 'high' && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <strong>Reason:</strong> {request.reason}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <strong>Destination:</strong> {request.destination}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <strong>Duration:</strong> {request.fromDate} to {request.toDate}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <strong>Contact:</strong> {request.contactNumber}
                        </div>
                      </div>
                      
                      {request.description && (
                        <div className="mt-3 p-2 bg-muted rounded text-sm">
                          <strong>Additional Details:</strong> {request.description}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Review Outpass Request - {request.id}</DialogTitle>
                          </DialogHeader>
                          
                          {selectedRequest && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Student Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Name:</strong> {selectedRequest.studentName}</p>
                                    <p><strong>Roll Number:</strong> {selectedRequest.rollNumber}</p>
                                    <p><strong>Department:</strong> {selectedRequest.department}</p>
                                    <p><strong>Contact:</strong> {selectedRequest.contactNumber}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-2">Request Details</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                                    <p><strong>Destination:</strong> {selectedRequest.destination}</p>
                                    <p><strong>From:</strong> {selectedRequest.fromDate}</p>
                                    <p><strong>To:</strong> {selectedRequest.toDate}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {selectedRequest.description && (
                                <div>
                                  <h4 className="font-semibold mb-2">Additional Details</h4>
                                  <p className="text-sm bg-muted p-3 rounded">{selectedRequest.description}</p>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-semibold mb-2">Warden Comments</h4>
                                <Textarea
                                  value={comments}
                                  onChange={(e) => setComments(e.target.value)}
                                  placeholder="Add your comments (optional)..."
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex gap-4">
                                <Button
                                  onClick={() => handleApproval(selectedRequest.id, 'approved')}
                                  className="flex-1 bg-success hover:bg-success/90"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleApproval(selectedRequest.id, 'rejected')}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
              
              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending requests at the moment.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium">{request.studentName}</p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WardenDashboard;