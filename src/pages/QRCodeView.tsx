import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, Share2, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import QRCodeLib from "qrcode";
import { dataStore } from "@/lib/dataStore";

const QRCodeView = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Mock data - in real app this would come from API
  const outpassData = {
    id: "OP001",
    studentName: "John Doe",
    rollNumber: "CS21B001",
    reason: "Medical Appointment",
    destination: "City Hospital",
    fromDate: "2024-01-15",
    toDate: "2024-01-15",
    approvedBy: "Dr. Smith",
    approvedAt: "2024-01-14 14:30",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAABlBMVEX///8AAABVwtN+AAACM0lEQVR42u3a0QqDMAwF0P//6GZgL2Ot2iZpevpeDGTQnhpIkuu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6ruu6rut6CyiKoihSO+i6rus6O+i6rus6O+i6rus6O+i6ruvsJ9B1Xdd1Xdd1nR103edd13Vd13Vd13Vd13VdZ/9A13Vd13Vd13Vd13Vd19k/0HVd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D3Rd13Vd13Vd13Vd13X2D"
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `outpass-${outpassData.id}-qr.png`;
      link.click();
    }
  };

  useEffect(() => {
    const generateQRCode = async () => {
      if (!outpassData) return;
      
      try {
        const qrData = JSON.stringify({
          id: outpassData.id,
          studentName: outpassData.studentName,
          rollNumber: outpassData.rollNumber,
          approvedBy: outpassData.approvedBy,
          validUntil: outpassData.toDate,
          timestamp: Date.now()
        });
        
        const qrUrl = await QRCodeLib.toDataURL(qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [outpassData]);

  const handleShare = async () => {
    if (!outpassData) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Outpass ${outpassData.id}`,
          text: `Approved outpass for ${outpassData.studentName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!outpassData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">Fetching outpass details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary-foreground hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Outpass QR Code</h1>
              <p className="text-primary-foreground/80">Scan at security checkpoint</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="h-6 w-6 text-primary" />
                Security QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Image */}
              <div className="flex justify-center">
                <div className="p-6 bg-white rounded-lg shadow-inner border-2 border-dashed border-primary/20">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="Outpass QR Code" 
                      className="w-64 h-64 rounded-lg"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="h-32 w-32 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <p className="font-medium mb-2">Instructions:</p>
                <ul className="text-left space-y-1">
                  <li>• Show this QR code to security at the gate</li>
                  <li>• Keep your student ID card ready</li>
                  <li>• Return before the approved time</li>
                  <li>• Scan again when returning to hostel</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Outpass Details */}
          <Card>
            <CardHeader>
              <CardTitle>Outpass Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Request ID</label>
                  <p className="font-mono text-lg">{outpassData.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-success font-medium">Approved</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Student Name</label>
                  <p className="text-lg font-medium">{outpassData.studentName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                  <p className="font-mono">{outpassData.rollNumber}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason</label>
                  <p>{outpassData.reason}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Destination</label>
                  <p>{outpassData.destination}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From Date</label>
                    <p>{outpassData.fromDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">To Date</label>
                    <p>{outpassData.toDate}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                  <p>{outpassData.approvedBy}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approved At</label>
                  <p>{outpassData.approvedAt}</p>
                </div>
              </div>

              {/* Warning Box */}
              <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning-foreground">
                  ⚠️ Important: This QR code is valid only for the approved dates and times. 
                  Late return may result in disciplinary action.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodeView;