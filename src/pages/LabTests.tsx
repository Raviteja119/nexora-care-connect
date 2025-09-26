import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestTube, Calendar as CalendarIcon, Clock, Download, Eye, Search } from "lucide-react";

const mockLabTests = [
  {
    id: "LAB001",
    testName: "Complete Blood Count (CBC)",
    orderedBy: "Dr. Sarah Johnson",
    dateOrdered: "2024-01-15",
    dateCompleted: "2024-01-16",
    status: "Completed",
    results: {
      "Hemoglobin": { value: "14.2", range: "12.0-15.5", unit: "g/dL", status: "Normal" },
      "WBC Count": { value: "7.5", range: "4.0-11.0", unit: "×10³/μL", status: "Normal" },
      "Platelet Count": { value: "285", range: "150-450", unit: "×10³/μL", status: "Normal" }
    }
  },
  {
    id: "LAB002",
    testName: "Lipid Profile",
    orderedBy: "Dr. Michael Chen",
    dateOrdered: "2024-01-18",
    dateCompleted: null,
    status: "Processing",
    results: null
  },
  {
    id: "LAB003",
    testName: "Thyroid Function Test",
    orderedBy: "Dr. Emily Davis",
    dateOrdered: "2024-01-20",
    dateCompleted: null,
    status: "Scheduled",
    results: null
  }
];

const availableTests = [
  { id: "t1", name: "Complete Blood Count (CBC)", price: "$45", fasting: false },
  { id: "t2", name: "Lipid Profile", price: "$35", fasting: true },
  { id: "t3", name: "Thyroid Function Test", price: "$60", fasting: false },
  { id: "t4", name: "Liver Function Test", price: "$50", fasting: true },
  { id: "t5", name: "Kidney Function Test", price: "$40", fasting: false },
  { id: "t6", name: "Diabetes Panel", price: "$55", fasting: true }
];

const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM"
];

export default function LabTests() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabTest, setSelectedLabTest] = useState(mockLabTests[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "default";
      case "Processing": return "secondary";
      case "Scheduled": return "outline";
      default: return "outline";
    }
  };

  const getResultStatus = (status: string) => {
    switch (status) {
      case "Normal": return "text-green-600";
      case "High": return "text-red-600";
      case "Low": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const handleBookTest = () => {
    if (selectedTest && selectedTime && selectedDate) {
      const testName = filteredTests.find(t => t.id === selectedTest)?.name;
      alert(`Lab test booked: ${testName} on ${selectedDate.toDateString()} at ${selectedTime}`);
      setSelectedTest("");
      setSelectedTime("");
      setSelectedDate(new Date());
    }
  };

  const filteredTests = availableTests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-background to-medical-muted">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Laboratory Tests</h1>
          <p className="text-muted-foreground">Book lab tests and view your results</p>
        </div>

        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="book">Book New Test</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Test History</h2>
                {mockLabTests.map((test) => (
                  <Card 
                    key={test.id}
                    className={`cursor-pointer transition-all ${
                      selectedLabTest.id === test.id 
                        ? 'ring-2 ring-medical-primary border-medical-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedLabTest(test)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{test.testName}</CardTitle>
                          <CardDescription>Ordered by {test.orderedBy}</CardDescription>
                        </div>
                        <Badge variant={getStatusColor(test.status) as any}>
                          {test.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          Ordered: {test.dateOrdered}
                        </div>
                        {test.dateCompleted && (
                          <div>Completed: {test.dateCompleted}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Test Details</h2>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="h-5 w-5 text-medical-primary" />
                          {selectedLabTest.testName}
                        </CardTitle>
                        <CardDescription>ID: {selectedLabTest.id}</CardDescription>
                      </div>
                      <Badge variant={getStatusColor(selectedLabTest.status) as any}>
                        {selectedLabTest.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ordered by: {selectedLabTest.orderedBy}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date Ordered: {selectedLabTest.dateOrdered}
                      </p>
                      {selectedLabTest.dateCompleted && (
                        <p className="text-sm text-muted-foreground">
                          Date Completed: {selectedLabTest.dateCompleted}
                        </p>
                      )}
                    </div>

                    {selectedLabTest.results ? (
                      <div>
                        <h3 className="font-semibold mb-3">Test Results</h3>
                        <div className="space-y-3">
                          {Object.entries(selectedLabTest.results).map(([key, result]) => (
                            <div key={key} className="border rounded-lg p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{key}</span>
                                <span className={`font-semibold ${getResultStatus(result.status)}`}>
                                  {result.status}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                <span className="mr-4">Value: {result.value} {result.unit}</span>
                                <span>Normal Range: {result.range} {result.unit}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          {selectedLabTest.status === "Processing" 
                            ? "Results are being processed. You'll be notified when ready."
                            : "Test is scheduled. Results will be available after completion."
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="book" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Tests</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search tests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredTests.map((test) => (
                      <div 
                        key={test.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedTest === test.id 
                            ? 'ring-2 ring-medical-primary border-medical-primary' 
                            : 'hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedTest(test.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{test.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Price: {test.price}
                            </p>
                          </div>
                          {test.fasting && (
                            <Badge variant="outline" className="text-xs">
                              Fasting Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Book Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Time</label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTest && (
                    <div className="border rounded-lg p-3 bg-muted/50">
                      <h3 className="font-medium mb-2">Selected Test</h3>
                      <p className="text-sm">
                        {filteredTests.find(t => t.id === selectedTest)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {filteredTests.find(t => t.id === selectedTest)?.price}
                      </p>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-medical-primary hover:bg-medical-primary/90"
                    disabled={!selectedTest || !selectedTime || !selectedDate}
                    onClick={handleBookTest}
                  >
                    Book Lab Test
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}