// Global variables
const currentTab = "eod"
const currentResort = "all"
const activityData = []
const googleAdsData = {}

// Sample data
const resortData = {
  all: {
    eod: { conversionRate: "24.8%", totalLeads: "1,247", revenue: "$89,420", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "8,934", revenue: "$634,280", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "124,567", revenue: "$12.4M", avgBooking: "$3,120" },
  },
  "sleeping-giant": {
    eod: { conversionRate: "24.8%", totalLeads: "224", revenue: "$16,096", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "1,608", revenue: "$114,170", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "22,422", revenue: "$2.2M", avgBooking: "$3,120" },
  },
  "jaguar-reef": {
    eod: { conversionRate: "24.8%", totalLeads: "274", revenue: "$19,652", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "1,965", revenue: "$139,542", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "27,405", revenue: "$2.7M", avgBooking: "$3,120" },
  },
  "almond-beach": {
    eod: { conversionRate: "24.8%", totalLeads: "187", revenue: "$13,413", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "1,340", revenue: "$95,142", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "18,685", revenue: "$1.9M", avgBooking: "$3,120" },
  },
  colonial: {
    eod: { conversionRate: "24.8%", totalLeads: "150", revenue: "$10,730", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "1,072", revenue: "$76,114", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "14,948", revenue: "$1.5M", avgBooking: "$3,120" },
  },
  umaya: {
    eod: { conversionRate: "24.8%", totalLeads: "249", revenue: "$17,884", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "1,787", revenue: "$126,856", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "24,913", revenue: "$2.5M", avgBooking: "$3,120" },
  },
  "the-banks": {
    eod: { conversionRate: "24.8%", totalLeads: "162", revenue: "$11,625", avgBooking: "$2,840" },
    eow: { conversionRate: "26.3%", totalLeads: "1,161", revenue: "$82,456", avgBooking: "$2,920" },
    eoy: { conversionRate: "28.7%", totalLeads: "16,194", revenue: "$1.6M", avgBooking: "$3,120" },
  },
}

const sampleActivities = {
  eod: [
    {
      id: 1,
      name: "Sarah M.",
      resort: "Sleeping Giant",
      value: "$3,200",
      time: "2h ago",
      source: "Google Ads",
      type: "conversion",
      demographics: { age: "35-44", gender: "Female", location: "California, USA", device: "Mobile" },
      adDetails: { campaign: "Luxury Resort Experience", keyword: "belize luxury resort", adGroup: "Premium Stays" },
    },
    {
      id: 2,
      name: "Mike R.",
      resort: "Jaguar Reef",
      value: "High Intent",
      time: "3h ago",
      source: "AI Bot",
      type: "lead",
      demographics: { age: "45-54", gender: "Male", location: "Texas, USA", device: "Desktop" },
      adDetails: { campaign: "Adventure Packages", keyword: "belize adventure vacation", adGroup: "Activity Tours" },
    },
    {
      id: 3,
      name: "Emma L.",
      resort: "Almond Beach",
      value: "$2,850",
      time: "4h ago",
      source: "Google Ads",
      type: "conversion",
      demographics: { age: "25-34", gender: "Female", location: "New York, USA", device: "Mobile" },
      adDetails: { campaign: "Beach Paradise", keyword: "belize beach resort", adGroup: "Beachfront Hotels" },
    },
    {
      id: 4,
      name: "David K.",
      resort: "Colonial",
      value: "Medium Intent",
      time: "5h ago",
      source: "AI Bot",
      type: "lead",
      demographics: { age: "55+", gender: "Male", location: "Florida, USA", device: "Tablet" },
      adDetails: { campaign: "Cultural Heritage", keyword: "belize historical tours", adGroup: "Cultural Experiences" },
    },
  ],
}

// Chart data
const chartData = {
  conversion: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Google Ads",
        data: [22, 25, 28, 24, 26, 30, 27],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
      },
      {
        label: "AI Bot",
        data: [18, 21, 24, 20, 23, 26, 24],
        borderColor: "#e83a77",
        backgroundColor: "rgba(232, 58, 119, 0.1)",
        tension: 0.4,
      },
    ],
  },
  journey: {
    labels: ["Awareness", "Interest", "Consideration", "Intent", "Purchase"],
    datasets: [
      {
        label: "Conversion Rate",
        data: [100, 68, 45, 32, 24],
        borderColor: "#3d0c3a",
        backgroundColor: "rgba(61, 12, 58, 0.1)",
        tension: 0.4,
      },
    ],
  },
  campaign: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Impressions",
        data: [450000, 520000, 480000, 560000],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        yAxisID: "y",
      },
      {
        label: "Clicks",
        data: [28000, 32000, 30000, 35000],
        borderColor: "#e83a77",
        backgroundColor: "rgba(232, 58, 119, 0.1)",
        yAxisID: "y1",
      },
    ],
  },
}
