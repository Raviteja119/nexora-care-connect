import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Eye, Pill, Clock, User, RefreshCw, Phone, MapPin, FileText } from "lucide-react";

const mockPrescriptions = [
  {
    id: "RX001",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-01-15",
    diagnosis: "Hypertension",
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", remaining: 25 },
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days", remaining: 25 }
    ],
    instructions: "Take with food. Monitor blood pressure regularly. Check-up required after 30 days.",
    status: "Active",
    pharmacy: "HealthCare Pharmacy",
    pharmacyPhone: "+1-555-0123",
    refillsRemaining: 2
  },
  {
    id: "RX002",
    doctorName: "Dr. Michael Chen",
    date: "2024-01-10",
    diagnosis: "Common Cold",
    medications: [
      { name: "Paracetamol", dosage: "500mg", frequency: "Every 6 hours", duration: "5 days", remaining: 0 },
      { name: "Cough Syrup", dosage: "10ml", frequency: "Twice daily", duration: "7 days", remaining: 0 }
    ],
    instructions: "Complete the course. Rest and drink plenty of fluids.",
    status: "Completed",
    pharmacy: "City Medical Store",
    pharmacyPhone: "+1-555-0124",
    refillsRemaining: 0
  },
  {
    id: "RX003", 
    doctorName: "Dr. Emily Davis",
    date: "2024-01-20",
    diagnosis: "Diabetes Management",
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "90 days", remaining: 88 },
      { name: "Insulin", dosage: "10 units", frequency: "Before meals", duration: "30 days", remaining: 28 }
    ],
    instructions: "Monitor blood sugar levels daily. Follow diabetic diet plan.",
    status: "Active",
    pharmacy: "Community Pharmacy",
    pharmacyPhone: "+1-555-0125",
    refillsRemaining: 5
  }
];

const activePrescriptions = mockPrescriptions.filter(p => p.status === "Active");
const completedPrescriptions = mockPrescriptions.filter(p => p.status === "Completed");

export default function Prescriptions() {
  const [selectedPrescription, setSelectedPrescription] = useState(mockPrescriptions[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Completed": return "secondary";
      default: return "outline";
    }
  };

  const handleViewFull = (prescriptionId: string) => {
    alert(`Opening full prescription view for ${prescriptionId}. This would show complete medical details, dosage instructions, and doctor's notes.`);
  };

  const handleDownloadPDF = (prescriptionId: string) => {
    alert(`Downloading PDF for prescription ${prescriptionId}. In a real app, this would generate and download a PDF file.`);
  };

  const handleRequestRefill = (prescriptionId: string) => {
    if (confirm("Request refill for this prescription? Your pharmacy will be notified.")) {
      alert(`Refill request submitted for prescription ${prescriptionId}. You will receive confirmation within 2 hours.`);
    }
  };

  const handleCallPharmacy = (pharmacyPhone: string) => {
    alert(`Calling pharmacy at ${pharmacyPhone}. In a real app, this would initiate a phone call.`);
  };

  const handleViewDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Medical Prescriptions</h1>
          <p className="text-muted-foreground">View and manage your prescription history</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Prescriptions</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Prescription List</h2>
                {mockPrescriptions.map((prescription) => (
                  <Card 
                    key={prescription.id}
                    className={`cursor-pointer transition-all ${
                      selectedPrescription.id === prescription.id 
                        ? 'ring-2 ring-medical-primary border-medical-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{prescription.id}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {prescription.doctorName}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusColor(prescription.status) as any}>
                          {prescription.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {prescription.date}
                        </div>
                        <div>{prescription.diagnosis}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Prescription Details</h2>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="h-5 w-5 text-medical-primary" />
                          {selectedPrescription.id}
                        </CardTitle>
                        <CardDescription>{selectedPrescription.doctorName}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(selectedPrescription.status) as any}>
                        {selectedPrescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Diagnosis</h3>
                      <p className="text-muted-foreground">{selectedPrescription.diagnosis}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Medications</h3>
                      <div className="space-y-3">
                        {selectedPrescription.medications.map((med, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{med.name}</div>
                              {med.remaining !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {med.remaining} pills left
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <div className="mb-1">
                                <span className="mr-4">Dosage: {med.dosage}</span>
                                <span className="mr-4">Frequency: {med.frequency}</span>
                                <span>Duration: {med.duration}</span>
                              </div>
                              {med.remaining !== undefined && med.remaining <= 5 && med.remaining > 0 && (
                                <div className="text-amber-600 text-xs mt-1">
                                  ⚠️ Running low - consider refilling soon
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Instructions</h3>
                      <p className="text-muted-foreground">{selectedPrescription.instructions}</p>
                    </div>

                    {selectedPrescription.pharmacy && (
                      <div>
                        <h3 className="font-semibold mb-2">Pharmacy Information</h3>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{selectedPrescription.pharmacy}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{selectedPrescription.pharmacyPhone}</span>
                          </div>
                          {selectedPrescription.refillsRemaining > 0 && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Refills remaining: {selectedPrescription.refillsRemaining}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Complete Prescription Details</DialogTitle>
                            <DialogDescription>
                              Full prescription information for {selectedPrescription.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold">Doctor Information</h4>
                                <p>{selectedPrescription.doctorName}</p>
                                <p className="text-sm text-muted-foreground">Date: {selectedPrescription.date}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold">Patient Information</h4>
                                <p>John Doe</p>
                                <p className="text-sm text-muted-foreground">Age: 45, Male</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Diagnosis</h4>
                              <p className="bg-muted p-3 rounded">{selectedPrescription.diagnosis}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Detailed Medications</h4>
                              {selectedPrescription.medications.map((med, index) => (
                                <div key={index} className="border rounded p-3 mb-2">
                                  <h5 className="font-medium">{med.name}</h5>
                                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-1">
                                    <p>Dosage: {med.dosage}</p>
                                    <p>Frequency: {med.frequency}</p>
                                    <p>Duration: {med.duration}</p>
                                    <p>Remaining: {med.remaining} pills</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Doctor's Instructions</h4>
                              <p className="bg-muted p-3 rounded">{selectedPrescription.instructions}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(selectedPrescription.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      {selectedPrescription.status === "Active" && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleRequestRefill(selectedPrescription.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Request Refill
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCallPharmacy(selectedPrescription.pharmacyPhone)}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Pharmacy
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activePrescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-medical-primary" />
                        {prescription.id}
                      </CardTitle>
                      <CardDescription>{prescription.doctorName}</CardDescription>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </div>
                    <div className="text-sm">
                      <strong>Medications:</strong> {prescription.medications.length} items
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(prescription)}>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRequestRefill(prescription.id)}>
                        Request Refill
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedPrescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-muted-foreground" />
                        {prescription.id}
                      </CardTitle>
                      <CardDescription>{prescription.doctorName}</CardDescription>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </div>
                    <div className="text-sm">
                      <strong>Date:</strong> {prescription.date}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(prescription)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
                        <Eye className="h-4 w-4 mr-2" />
                        View Full
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      {selectedPrescription.status === "Active" && (
                        <>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Request Refill
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call Pharmacy
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activePrescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-medical-primary" />
                        {prescription.id}
                      </CardTitle>
                      <CardDescription>{prescription.doctorName}</CardDescription>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </div>
                    <div className="text-sm">
                      <strong>Medications:</strong> {prescription.medications.length} items
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedPrescription(prescription)}>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Request Refill
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedPrescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-muted-foreground" />
                        {prescription.id}
                      </CardTitle>
                      <CardDescription>{prescription.doctorName}</CardDescription>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <strong>Diagnosis:</strong> {prescription.diagnosis}
                    </div>
                    <div className="text-sm">
                      <strong>Date:</strong> {prescription.date}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}