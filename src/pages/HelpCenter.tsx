import React, { useState } from "react";
import { Search, ChevronDown, Upload, Mail, Phone, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const HelpCenter = () => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click the 'Sign Up' button on the homepage and fill out the required information. You will receive a confirmation email to verify your account."
    },
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to reset your password."
    },
    {
      question: "What are the transaction fees?",
      answer: "Our transaction fees vary depending on the type of transaction. For a detailed breakdown, please visit our 'Fees & Pricing' page in the website footer."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security protocols to protect your data. For more details, you can review our Privacy Policy."
    }
  ];

  const tickets = [
    { id: "#74682", title: "Login problem", status: "Open", updated: "2 hours ago" },
    { id: "#74651", title: "Fee inquiry", status: "Closed", updated: "1 day ago" }
  ];

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 pt-20 md:pt-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Help Center</h1>
          <p className="text-muted-foreground">How can we help you?</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Search and FAQ Section */}
          <section className="glassmorphism rounded-xl">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-12"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-4">Popular Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <p className="font-medium text-foreground">{faq.question}</p>
                      <ChevronDown 
                        className={`text-muted-foreground transition-transform duration-300 h-4 w-4 ${
                          activeAccordion === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    {activeAccordion === index && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Support Ticket Form */}
          <section className="glassmorphism p-4 md:p-6 lg:p-8 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Submit a Support Ticket</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="subject">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g., Issue with my latest transaction"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="category">
                  Category
                </label>
                <select className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm">
                  <option>Billing</option>
                  <option>Technical Issue</option>
                  <option>Account Access</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2" htmlFor="attachment">
                  File Attachment (Optional)
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                  <div className="text-center">
                    <Upload className="text-muted-foreground h-10 w-10 mx-auto" />
                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                      <label className="relative cursor-pointer rounded-md bg-muted font-semibold text-primary hover:text-primary/80">
                        <span>Upload a file</span>
                        <input className="sr-only" type="file" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Button className="w-full">Submit Ticket</Button>
              </div>
            </form>
          </section>
        </div>

        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          {/* Track Tickets */}
          <section className="glassmorphism p-4 md:p-6 lg:p-8 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Track Your Tickets</h2>
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-foreground">{ticket.id} - {ticket.title}</p>
                    <span className={`text-xs font-medium py-1 px-2 rounded-full ${
                      ticket.status === 'Open' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Updated: {ticket.updated}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Support */}
          <section className="glassmorphism p-4 md:p-6 lg:p-8 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Contact Support</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Mail className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a className="text-sm text-muted-foreground hover:text-primary" href="mailto:support@example.com">
                    support@example.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="rounded-full p-4 shadow-lg">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HelpCenter;