// Shared data store for outpass management
export interface OutpassRequest {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  email: string;
  reason: string;
  destination: string;
  fromDate: string;
  toDate: string;
  contactNumber: string;
  parentContactNumber: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  wardenComments?: string;
  qrCode?: string;
}

export interface OutpassRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  reason: string;
  destination: string;
  fromDate: string;
  toDate: string;
  status: 'approved' | 'rejected';
  exitTime?: string;
  returnTime?: string;
  isActive: boolean;
}

class DataStore {
  private requests: OutpassRequest[] = [
    {
      id: "OP001",
      studentName: "John Doe",
      rollNumber: "CS21B001",
      department: "Computer Science",
      email: "john.doe@student.edu",
      reason: "Medical Appointment",
      destination: "City Hospital",
      fromDate: "2024-01-15",
      toDate: "2024-01-15",
      contactNumber: "+91 9876543210",
      parentContactNumber: "+91 9876543299",
      status: "approved",
      submittedAt: "2024-01-14",
      description: "Follow-up appointment with cardiologist",
      wardenComments: "Approved for medical emergency"
    },
    {
      id: "OP002",
      studentName: "Jane Smith", 
      rollNumber: "EC21B012",
      department: "Electronics",
      email: "jane.smith@student.edu",
      reason: "Family Emergency",
      destination: "Home Town",
      fromDate: "2024-01-20",
      toDate: "2024-01-22",
      contactNumber: "+91 9876543211",
      parentContactNumber: "+91 9876543288",
      status: "pending",
      submittedAt: "2024-01-18",
      description: "Grandfather's health emergency"
    },
    {
      id: "OP003",
      studentName: "Mike Johnson",
      rollNumber: "ME21B025",
      department: "Mechanical",
      email: "mike.johnson@student.edu",
      reason: "Academic Purpose",
      destination: "IIT Delhi",
      fromDate: "2024-01-25",
      toDate: "2024-01-27",
      contactNumber: "+91 9876543212",
      parentContactNumber: "+91 9876543277",
      status: "approved",
      submittedAt: "2024-01-20",
      description: "Conference presentation",
      wardenComments: "Approved for academic conference"
    }
  ];

  private securityRecords: OutpassRecord[] = [
    
    {
      id: "OP003",
      studentName: "Mike Johnson",
      rollNumber: "ME21B025", 
      department: "Mechanical",
      reason: "Academic Purpose",
      destination: "IIT Delhi",
      fromDate: "2024-01-25",
      toDate: "2024-01-27",
      status: "approved",
      exitTime: "07:45 AM",
      returnTime: "08:15 PM",
      isActive: false
    }
  ];

  // Outpass Requests Management
  getAllRequests(): OutpassRequest[] {
    return [...this.requests];
  }

  addRequest(request: Omit<OutpassRequest, 'id' | 'submittedAt' | 'status'>): OutpassRequest {
    const newRequest: OutpassRequest = {
      ...request,
      id: `OP${String(this.requests.length + 1).padStart(3, '0')}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    this.requests.push(newRequest);
    return newRequest;
  }

  updateRequestStatus(id: string, status: 'approved' | 'rejected', comments?: string): void {
    const index = this.requests.findIndex(r => r.id === id);
    if (index !== -1) {
      this.requests[index] = { 
        ...this.requests[index], 
        status, 
        wardenComments: comments 
      };
      
      // If approved, add to security records
      if (status === 'approved') {
        const request = this.requests[index];
        const securityRecord: OutpassRecord = {
          id: request.id,
          studentName: request.studentName,
          rollNumber: request.rollNumber,
          department: request.department,
          reason: request.reason,
          destination: request.destination,
          fromDate: request.fromDate,
          toDate: request.toDate,
          status: 'approved',
          isActive: false
        };
        this.securityRecords.push(securityRecord);
      }
    }
  }

  getRequestById(id: string): OutpassRequest | undefined {
    return this.requests.find(r => r.id === id);
  }

  // Security Records Management
  getAllSecurityRecords(): OutpassRecord[] {
    return [...this.securityRecords];
  }

  updateSecurityRecord(id: string, updates: Partial<OutpassRecord>): void {
    const index = this.securityRecords.findIndex(r => r.id === id);
    if (index !== -1) {
      this.securityRecords[index] = { ...this.securityRecords[index], ...updates };
    }
  }

  getSecurityRecordById(id: string): OutpassRecord | undefined {
    return this.securityRecords.find(r => r.id === id);
  }
}

export const dataStore = new DataStore();