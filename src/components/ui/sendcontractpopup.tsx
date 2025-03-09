import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner"; // Import Sonner toast

const SendContractPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);

    try {
      // Simulate sending process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success toast
      toast.success("Contract Sent!", {
        description: `The contract was sent successfully to ${email}.`,
      });

      setOpen(false); // Close dialog
      setEmail(""); // Clear email field
    } catch (error) {
      console.error("Failed to send contract", error);
      toast.error("Failed to send contract", {
        description: "Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Send className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Contract</DialogTitle>
          </DialogHeader>

          <Input 
            type="email" 
            placeholder="Enter recipient's email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <DialogFooter>
            <Button 
              onClick={handleSend} 
              disabled={!email || sending}
            >
              {sending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendContractPopup;
