// Mock data for FlowSight PM Dashboard

export interface TeamMember {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    currentActivity?: string;
    todayHours: number;
    weekHours: number;
    monthHours: number;
}

export interface WorkSession {
    id: string;
    userId: string;
    userName: string;
    durationSeconds: number;
    summary: string;
    categoryBreakdown: Record<string, number>;
    jiraBreakdown: Record<string, number>;
    createdAt: Date;
}

export interface JiraTicket {
    id: string;
    key: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    hoursWorked: number;
}

export interface ActivityFeedItem {
    id: string;
    timestamp: Date;
    userName: string;
    activity: string;
    category: string;
}

// Team Members
export const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Manuel Castillo',
        isOnline: true,
        currentActivity: 'Writing Report',
        todayHours: 8.2,
        weekHours: 38.5,
        monthHours: 142,
    },
    {
        id: '2',
        name: 'Ana García',
        isOnline: true,
        currentActivity: 'Reviewing Proposal',
        todayHours: 6.1,
        weekHours: 32.4,
        monthHours: 128,
    },
    {
        id: '3',
        name: 'Carlos Rodríguez',
        isOnline: false,
        currentActivity: undefined,
        todayHours: 5.8,
        weekHours: 29.2,
        monthHours: 118,
    },
    {
        id: '4',
        name: 'Laura Martínez',
        isOnline: true,
        currentActivity: 'Design',
        todayHours: 4.2,
        weekHours: 22.1,
        monthHours: 95,
    },
    {
        id: '5',
        name: 'Pedro Sánchez',
        isOnline: false,
        currentActivity: undefined,
        todayHours: 3.9,
        weekHours: 18.6,
        monthHours: 82,
    },
];

// Category breakdown for charts
export const categoryData = [
    { name: 'Focus Work', value: 65, color: '#10B981' },
    { name: 'Meetings', value: 15, color: '#F59E0B' },
    { name: 'Design', value: 12, color: '#8B5CF6' },
    { name: 'Other', value: 8, color: '#94A3B8' },
];

// Timeline data for stacked area chart
export const timelineData = [
    { time: '9am', Focus: 120, Design: 30, Meeting: 10, Other: 0 },
    { time: '10am', Focus: 140, Design: 20, Meeting: 40, Other: 10 },
    { time: '11am', Focus: 100, Design: 60, Meeting: 20, Other: 15 },
    { time: '12pm', Focus: 60, Design: 30, Meeting: 60, Other: 20 },
    { time: '1pm', Focus: 40, Design: 10, Meeting: 80, Other: 10 },
    { time: '2pm', Focus: 130, Design: 40, Meeting: 20, Other: 5 },
    { time: '3pm', Focus: 150, Design: 50, Meeting: 10, Other: 10 },
    { time: '4pm', Focus: 110, Design: 30, Meeting: 30, Other: 15 },
];

// Jira Tickets
export const jiraTickets: JiraTicket[] = [
    { id: '1', key: 'TASK-1', title: 'Q3 Financial Analysis', status: 'done', hoursWorked: 22.5 },
    { id: '2', key: 'TASK-2', title: 'Client Onboarding Plan', status: 'in_progress', hoursWorked: 16.2 },
    { id: '3', key: 'TASK-3', title: 'Website Copy Review', status: 'in_progress', hoursWorked: 8.1 },
    { id: '4', key: 'TASK-4', title: 'competitor Analysis', status: 'todo', hoursWorked: 5.0 },
    { id: '5', key: 'TASK-5', title: 'Weekly Team Update', status: 'todo', hoursWorked: 2.5 },
];

// Active tickets for dashboard
export const activeTickets = [
    { key: 'TASK-1', hours: 4.5, maxHours: 8 },
    { key: 'TASK-2', hours: 2.8, maxHours: 6 },
    { key: 'TASK-3', hours: 2.1, maxHours: 5 },
    { key: 'TASK-4', hours: 1.0, maxHours: 4 },
    { key: 'TASK-5', hours: 0.5, maxHours: 3 },
];

// Live Activity Feed
export const activityFeed: ActivityFeedItem[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        userName: 'Manuel C.',
        activity: 'Writing Q3 Financial Analysis',
        category: 'Focus Work',
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        userName: 'Manuel C.',
        activity: 'Drafting Client Onboarding Plan',
        category: 'Focus Work',
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        userName: 'Ana G.',
        activity: 'Reviewing PR #234 - New API endpoints',
        category: 'Communication',
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
        userName: 'Carlos R.',
        activity: 'Meeting in Google Meet',
        category: 'Meeting',
    },
    {
        id: '5',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        userName: 'Laura M.',
        activity: 'Designing new dashboard layout',
        category: 'Design',
    },
];

// Weekly report data
export const weeklyData = [
    { day: 'Mon', hours: 36 },
    { day: 'Tue', hours: 42 },
    { day: 'Wed', hours: 38 },
    { day: 'Thu', hours: 40 },
    { day: 'Fri', hours: 30 },
];

// Developer activity by hour (for modal)
export const developerHourlyActivity = [
    { hour: '9', Focus: 45, Design: 10, Meeting: 5 },
    { hour: '10', Coding: 55, Design: 5, Meeting: 0 },
    { hour: '11', Coding: 40, Design: 15, Meeting: 5 },
    { hour: '12', Coding: 20, Design: 10, Meeting: 30 },
    { hour: '13', Coding: 50, Design: 10, Meeting: 0 },
    { hour: '14', Coding: 60, Design: 0, Meeting: 0 },
    { hour: '15', Coding: 55, Design: 5, Meeting: 0 },
    { hour: '16', Coding: 45, Design: 10, Meeting: 5 },
];

// Developer ticket breakdown
export const developerTickets = [
    { key: 'SCRUM-2', title: 'Fix OAuth refresh', hours: 3.5 },
    { key: 'SCRUM-4', title: 'Optimize polling', hours: 2.1 },
    { key: 'SCRUM-7', title: 'Update prompts', hours: 1.5 },
];

// KPI summary stats
export const kpiStats = {
    todayHours: 12.5,
    todayChange: 15,
    weekHours: 42.3,
    weekChange: -5,
    activeDevs: 5,
    onlineDevs: 3,
    totalTasks: 23,
    inProgressTasks: 8,
};

// Weekly summary for reports
export const weeklySummary = {
    totalHours: 186.4,
    avgPerDev: 37.3,
    topCategory: 'Coding',
    topCategoryPercent: 68,
    mostActiveDay: 'Tuesday',
    mostActiveDayHours: 42.1,
};
