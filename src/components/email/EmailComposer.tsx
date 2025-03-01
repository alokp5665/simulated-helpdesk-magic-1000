
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface EmailComposerProps {
  newEmail: {
    to: string;
    subject: string;
    content: string;
  };
  setNewEmail: React.Dispatch<React.SetStateAction<{
    to: string;
    subject: string;
    content: string;
  }>>;
  handleSendEmail: () => void;
}

export const EmailComposer = ({
  newEmail,
  setNewEmail,
  handleSendEmail,
}: EmailComposerProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Compose New Email</h2>
      <div className="space-y-4">
        <div>
          <Input
            placeholder="To"
            value={newEmail.to}
            onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <Input
            placeholder="Subject"
            value={newEmail.subject}
            onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <Textarea
            placeholder="Message"
            value={newEmail.content}
            onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
            className="min-h-[200px] bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSendEmail} className="hover-scale">
            <Send className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
};
