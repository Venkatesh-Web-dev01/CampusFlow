// Date and formatting utilities for CampusFlow

export const getDeadlineInfo = (deadlineDateStr) => {
  if (!deadlineDateStr) return { daysLeft: null, text: 'No Deadline', isUrgent: false, isExpired: false };

  const deadline = new Date(deadlineDateStr);
  const now = new Date();
  
  // Set both to start of day for accurate day difference
  deadline.setHours(23, 59, 59, 999);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { daysLeft: diffDays, text: 'Expired', isUrgent: false, isExpired: true };
  } else if (diffDays === 0) {
    return { daysLeft: 0, text: 'Closes Today!', isUrgent: true, isExpired: false };
  } else if (diffDays === 1) {
    return { daysLeft: 1, text: '1 day left', isUrgent: true, isExpired: false };
  } else if (diffDays <= 7) {
    return { daysLeft: diffDays, text: `${diffDays} days left`, isUrgent: true, isExpired: false };
  } else {
    return { daysLeft: diffDays, text: `${diffDays} days left`, isUrgent: false, isExpired: false };
  }
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const TYPE_STYLES = {
  Internship: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
  Hackathon: { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  Scholarship: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  Workshop: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  Competition: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
};

export const STATUS_OPTIONS = [
  { id: 'Saved', label: 'Saved', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  { id: 'Applied', label: 'Applied', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
  { id: 'Interviewing', label: 'Interviewing', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' },
  { id: 'Offered', label: 'Offered 🎉', color: '#34d399', bg: 'rgba(52, 211, 153, 0.2)' },
  { id: 'Rejected', label: 'Rejected', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
];
