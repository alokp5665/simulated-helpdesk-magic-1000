
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface EmailSchedulerProps {
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
  scheduledDate: Date | null;
  setScheduledDate: React.Dispatch<React.SetStateAction<Date | null>>;
  scheduledTime: string;
  setScheduledTime: React.Dispatch<React.SetStateAction<string>>;
  handleScheduleEmail: () => void;
}

export const EmailScheduler = ({
  newEmail,
  setNewEmail,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  handleScheduleEmail,
}: EmailSchedulerProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Schedule Email</h2>
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
            className="min-h-[150px] bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Schedule Date
          </label>
          <Calendar
            mode="single"
            selected={scheduledDate}
            onSelect={setScheduledDate}
            className="border rounded-md p-2 bg-white dark:bg-gray-800"
            disabled={(date) => date < new Date()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Schedule Time
          </label>
          <Input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleScheduleEmail} className="hover-scale">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule Email
          </Button>
        </div>
      </div>
    </div>
  );
};
