import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, CheckCircle, Clock, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Header from '@/components/dashboard/Header';

const KYCVerification = () => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const StepIndicator = ({ stepNumber, icon, label, isActive, isCompleted }: {
    stepNumber: number;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isCompleted: boolean;
  }) => (
    <div className="flex flex-col items-center flex-1 relative">
      {stepNumber > 1 && (
        <div className={`absolute right-1/2 top-5 w-full h-0.5 -z-10 ${
          isCompleted ? 'bg-primary' : 'bg-border'
        }`} />
      )}
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${
        isActive || isCompleted 
          ? 'bg-primary border-primary text-primary-foreground' 
          : 'bg-card border-border text-muted-foreground'
      }`}>
        {icon}
      </div>
      <div className={`text-center mt-3 font-medium text-sm transition-all duration-300 ${
        isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
      }`}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">KYC Verification</h1>
      </div>
      
      <main className="p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          {/* Step Indicator */}
          <div className="flex items-start w-full max-w-2xl mx-auto mb-12">
            <StepIndicator
              stepNumber={1}
              icon={<User className="w-5 h-5" />}
              label="Upload ID"
              isActive={step === 1}
              isCompleted={step > 1}
            />
            <StepIndicator
              stepNumber={2}
              icon={<Camera className="w-5 h-5" />}
              label="Selfie"
              isActive={step === 2}
              isCompleted={step > 2}
            />
            <StepIndicator
              stepNumber={3}
              icon={<Clock className="w-5 h-5" />}
              label="In Review"
              isActive={step === 3}
              isCompleted={false}
            />
          </div>

          {/* Step 1: Upload ID */}
          {step === 1 && (
            <div className="w-full max-w-lg mx-auto">
              <section className="glass p-6 md:p-8 rounded-xl">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Verify your Identity
                  </h1>
                  <p className="text-muted-foreground">
                    Please upload a valid government-issued ID.
                  </p>
                </div>
                
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="id-type" className="text-foreground">Document Type</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="drivers-license">Driver's License</SelectItem>
                        <SelectItem value="national-id">National ID Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-foreground">Upload Document</Label>
                    <div
                      className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10 hover:border-primary/50 transition-colors cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                        <div className="flex text-sm leading-6 text-muted-foreground">
                          <span className="font-semibold text-primary hover:text-primary/80">
                            Upload a file
                          </span>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground mt-2">
                          PNG, JPG, PDF up to 10MB
                        </p>
                        {selectedFile && (
                          <p className="text-sm text-primary mt-2">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleFileSelect}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full"
                      disabled={!selectedFile}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* Step 2: Selfie */}
          {step === 2 && (
            <div className="w-full max-w-lg mx-auto">
              <section className="glass p-6 md:p-8 rounded-xl">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Selfie Verification
                  </h1>
                  <p className="text-muted-foreground">
                    Please take a clear selfie to match with your ID.
                  </p>
                </div>
                
                <div className="w-64 h-64 mx-auto bg-card/50 rounded-full flex items-center justify-center border-4 border-border mb-8">
                  <User className="w-32 h-32 text-muted-foreground" />
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Make sure your face is well-lit and fits within the circle. Remove any hats or glasses.
                </p>
                
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Selfie
                  </Button>
                </div>
              </section>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="w-full max-w-lg mx-auto">
              <section className="glass p-6 md:p-8 rounded-xl">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary mb-6">
                    <Clock className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">
                    Documents in Review
                  </h1>
                  <p className="text-muted-foreground">
                    We are currently reviewing your documents. This usually takes a few minutes. 
                    We'll notify you once the process is complete.
                  </p>
                </div>
                
                <div className="bg-card/50 p-4 rounded-lg space-y-3 mb-8">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground">ID Document</p>
                    <span className="flex items-center text-xs font-medium text-green-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Uploaded
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground">Selfie Verification</p>
                    <span className="flex items-center text-xs font-medium text-green-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Uploaded
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-foreground">Verification Status</p>
                    <span className="flex items-center text-xs font-medium text-yellow-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Pending
                    </span>
                  </div>
                </div>
                
                <Button className="w-full">
                  Go to Dashboard
                </Button>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default KYCVerification;