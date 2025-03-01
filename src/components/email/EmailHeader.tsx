
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Filter,
  RefreshCw,
  MailPlus,
  Circle,
  Star,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";

interface EmailHeaderProps {
  filterBy: "all" | "unread" | "starred" | "resolved";
  setFilterBy: (filter: "all" | "unread" | "starred" | "resolved") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleRefresh: () => void;
  isRefreshing: boolean;
  setShowScheduler: (show: boolean) => void;
  setShowCompose: (show: boolean) => void;
  unreadCount: number;
}

export const EmailHeader = ({
  filterBy,
  setFilterBy,
  searchQuery,
  setSearchQuery,
  handleRefresh,
  isRefreshing,
  setShowScheduler,
  setShowCompose,
  unreadCount,
}: EmailHeaderProps) => {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Email Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage, respond and track all customer communications
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className={`relative hover-scale ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button 
            onClick={() => {
              setShowScheduler(true);
              setShowCompose(false);
            }}
            variant="outline"
            size="sm"
            className="hover-scale"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          
          <Button 
            onClick={() => {
              setShowCompose(true);
              setShowScheduler(false);
            }}
            variant="premium"
            className="hover-scale"
          >
            <MailPlus className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Input
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-950 bg-opacity-50 backdrop-blur-sm"
          />
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Button
            variant={filterBy === "all" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilterBy("all")}
            className="whitespace-nowrap"
          >
            <Mail className="mr-2 h-4 w-4" />
            All Emails
          </Button>
          <Button
            variant={filterBy === "unread" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilterBy("unread")}
            className="whitespace-nowrap"
          >
            <Circle className="mr-2 h-4 w-4" />
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-indigo-600" variant="default">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={filterBy === "starred" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilterBy("starred")}
            className="whitespace-nowrap"
          >
            <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
            Starred
          </Button>
          <Button
            variant={filterBy === "resolved" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilterBy("resolved")}
            className="whitespace-nowrap"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Resolved
          </Button>
        </div>
      </div>
    </>
  );
};
