
// Helper function to get sentiment badge color
export const getSentimentColor = (sentiment?: "positive" | "neutral" | "negative") => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "negative":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "neutral":
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

// Helper function to get priority badge color
export const getPriorityColor = (priority?: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "low":
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  }
};
