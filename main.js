// Initialize PWA
document.addEventListener("DOMContentLoaded", () => {
  initializePWA()
  loadActivityFeed()
  updateResortData()
  initializeCharts()
})

function initializePWA() {
  // Register service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swCode = `
                const CACHE_NAME = 'viva-belize-v1';
                const urlsToCache = [
                    '/',
                    '/index.html',
                    '/guest-analytics.html',
                    '/google-ads.html',
                    '/settings.html',
                    '/styles/main.css',
                    '/styles/components.css',
                    '/styles/charts.css',
                    '/js/main.js',
                    '/js/data.js',
                    '/js/charts.js'
                ];

                self.addEventListener('install', function(event) {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                return cache.addAll(urlsToCache);
                            })
                    );
                });

                self.addEventListener('fetch', function(event) {
                    event.respondWith(
                        caches.match(event.request)
                            .then(function(response) {
                                if (response) {
                                    return response;
                                }
                                return fetch(event.request);
                            }
                        )
                    );
                });
            `

      const blob = new Blob([swCode], { type: "application/javascript" })
      const swUrl = URL.createObjectURL(blob)

      navigator.serviceWorker.register(swUrl).then(
        (registration) => {
          console.log("ServiceWorker registration successful")
        },
        (err) => {
          console.log("ServiceWorker registration failed: ", err)
        },
      )
    })
  }

  // PWA install prompt
  let deferredPrompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault()
    deferredPrompt = e

    setTimeout(() => {
      if (deferredPrompt) {
        showToast("Install App", "Install Viva Belize Analytics for offline access")
      }
    }, 5000)
  })
}

// Tab switching
function switchTab(tabName) {
  currentTab = tabName

  // Update tab triggers
  document.querySelectorAll(".tab-trigger").forEach((trigger) => {
    trigger.classList.remove("active")
  })
  event.target.classList.add("active")

  // Update tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active")
  })
  const targetContent = document.getElementById(tabName + "-content")
  if (targetContent) {
    targetContent.classList.add("active")
  }

  // Update metrics for current tab
  updateMetrics()
}

// Sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  sidebar.classList.toggle("open")
}

// Resort data update
function updateResortData() {
  const selector = document.getElementById("resortSelector")
  if (selector) {
    currentResort = selector.value
  }
  updateMetrics()
  loadActivityFeed()
}

function updateMetrics() {
  if (!resortData[currentResort] || !resortData[currentResort][currentTab]) {
    return
  }

  const data = resortData[currentResort][currentTab]

  // Update only if elements exist
  const conversionRateEl = document.getElementById("conversionRate")
  const totalLeadsEl = document.getElementById("totalLeads")
  const revenueEl = document.getElementById("revenue")
  const avgBookingEl = document.getElementById("avgBooking")

  if (conversionRateEl) conversionRateEl.textContent = data.conversionRate
  if (totalLeadsEl) totalLeadsEl.textContent = data.totalLeads
  if (revenueEl) revenueEl.textContent = data.revenue
  if (avgBookingEl) avgBookingEl.textContent = data.avgBooking
}

// Activity feed
function loadActivityFeed() {
  const activityFeed = document.getElementById("activityFeed")
  if (!activityFeed) return

  let activities = sampleActivities[currentTab] || sampleActivities.eod

  // Filter by resort if not "all"
  if (currentResort !== "all") {
    const resortNames = {
      "sleeping-giant": "Sleeping Giant",
      "jaguar-reef": "Jaguar Reef",
      "almond-beach": "Almond Beach",
      colonial: "Colonial",
      umaya: "Umaya",
      "the-banks": "The Banks",
    }
    const resortName = resortNames[currentResort]
    activities = activities.filter((activity) => activity.resort === resortName)
  }

  activityFeed.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-item" onclick="showActivityDetails(${activity.id})">
            <div class="activity-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${
                      activity.source === "Google Ads"
                        ? '<circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path>'
                        : '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>'
                    }
                </svg>
            </div>
            <div class="activity-content">
                <div class="activity-header">
                    <span class="activity-name">${activity.name}</span>
                    <span class="badge ${activity.type === "conversion" ? "badge-success" : "badge-warning"}">${activity.value}</span>
                </div>
                <div class="activity-details">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${activity.resort}</span>
                    <span>•</span>
                    <span style="color: var(--accent-pink); font-weight: 500;">${activity.source}</span>
                    <span>•</span>
                    <span>${activity.time}</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Show activity details
function showActivityDetails(activityId) {
  const activity = sampleActivities.eod.find((a) => a.id === activityId)
  if (!activity) return

  const content = generateActivityDetailsContent(activity)
  openFullScreen(`${activity.name} - ${activity.source} Details`, content)
}

function generateActivityDetailsContent(activity) {
  return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Guest Information</div>
                </div>
                <div class="card-content">
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Name:</span>
                            <span style="font-weight: 600;">${activity.name}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Resort:</span>
                            <span style="font-weight: 600;">${activity.resort}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Value:</span>
                            <span style="font-weight: 600; color: var(--green-600);">${activity.value}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Source:</span>
                            <span style="font-weight: 600; color: var(--accent-pink);">${activity.source}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Time:</span>
                            <span style="font-weight: 600;">${activity.time}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Demographics</div>
                </div>
                <div class="card-content">
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Age Group:</span>
                            <span style="font-weight: 600;">${activity.demographics.age}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Gender:</span>
                            <span style="font-weight: 600;">${activity.demographics.gender}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Location:</span>
                            <span style="font-weight: 600;">${activity.demographics.location}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Device:</span>
                            <span style="font-weight: 600;">${activity.demographics.device}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${
              activity.source === "Google Ads"
                ? `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Google Ads Details</div>
                </div>
                <div class="card-content">
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Campaign:</span>
                            <span style="font-weight: 600;">${activity.adDetails.campaign}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Keyword:</span>
                            <span style="font-weight: 600;">${activity.adDetails.keyword}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Ad Group:</span>
                            <span style="font-weight: 600;">${activity.adDetails.adGroup}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: var(--gray-600);">Match Type:</span>
                            <span style="font-weight: 600;">Broad Match</span>
                        </div>
                    </div>
                </div>
            </div>
            `
                : ""
            }
        </div>
    `
}

// Full screen modal
function openFullScreen(title, contentType) {
  const modal = document.getElementById("fullScreenModal")
  const modalTitle = document.getElementById("modalTitle")
  const modalBody = document.getElementById("modalBody")

  modalTitle.textContent = title

  let content = ""

  switch (contentType) {
    case "conversionDetails":
      content = generateConversionDetails()
      break
    case "leadsDetails":
      content = generateLeadsDetails()
      break
    case "revenueDetails":
      content = generateRevenueDetails()
      break
    case "bookingDetails":
      content = generateBookingDetails()
      break
    case "chartDetails":
      content = generateChartDetails()
      break
    case "activityDetails":
      content = generateActivityDetails()
      break
    case "googleAdsDetails":
      content = generateGoogleAdsDetails()
      break
    default:
      content = contentType // If it's already HTML content
  }

  modalBody.innerHTML = content
  modal.classList.add("active")
}

function closeFullScreen() {
  document.getElementById("fullScreenModal").classList.remove("active")
}

// Content generators for full screen views
function generateConversionDetails() {
  return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Conversion Rate Breakdown</div>
                </div>
                <div class="card-content">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--primary-purple);">24.8%</div>
                        <div style="color: var(--gray-600);">Overall Conversion Rate</div>
                    </div>
                    <div style="display: grid; gap: 1rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Google Ads</span>
                                <span style="font-weight: 600;">26.3%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-blue" style="width: 26.3%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>AI Bot</span>
                                <span style="font-weight: 600;">23.7%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-pink" style="width: 23.7%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Direct</span>
                                <span style="font-weight: 600;">21.2%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-purple" style="width: 21.2%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function generateLeadsDetails() {
  return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Lead Sources</div>
                </div>
                <div class="card-content">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--primary-purple);">1,247</div>
                        <div style="color: var(--gray-600);">Total Leads Today</div>
                    </div>
                    <div style="display: grid; gap: 1rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Google Ads</span>
                                <span style="font-weight: 600;">68% (848)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-blue" style="width: 68%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>AI Bot</span>
                                <span style="font-weight: 600;">23% (287)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-pink" style="width: 23%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Direct</span>
                                <span style="font-weight: 600;">9% (112)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-purple" style="width: 9%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function generateRevenueDetails() {
  return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Revenue by Resort</div>
                </div>
                <div class="card-content">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--accent-pink);">$89,420</div>
                        <div style="color: var(--gray-600);">Total Revenue Today</div>
                    </div>
                    <div style="display: grid; gap: 1rem;">
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Jaguar Reef</span>
                                <span style="font-weight: 600;">22% ($19,652)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-blue" style="width: 22%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Umaya</span>
                                <span style="font-weight: 600;">20% ($17,884)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-pink" style="width: 20%;"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <span>Sleeping Giant</span>
                                <span style="font-weight: 600;">18% ($16,096)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill bg-green" style="width: 18%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function generateBookingDetails() {
  return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Average Booking Value</div>
                </div>
                <div class="card-content">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--primary-purple);">$2,840</div>
                        <div style="color: var(--gray-600);">Average Booking Value</div>
                    </div>
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--gray-50); border-radius: 6px;">
                            <span>Highest Value Resort:</span>
                            <span style="font-weight: 600;">Umaya ($3,200)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--gray-50); border-radius: 6px;">
                            <span>Most Bookings:</span>
                            <span style="font-weight: 600;">Jaguar Reef (47)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--gray-50); border-radius: 6px;">
                            <span>Average Stay:</span>
                            <span style="font-weight: 600;">4.2 nights</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

function generateChartDetails() {
  return `
        <div style="display: grid; gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Detailed Conversion Chart</div>
                </div>
                <div class="card-content">
                    <canvas id="fullScreenChart" style="width: 100%; height: 400px;"></canvas>
                </div>
            </div>
        </div>
    `
}

function generateActivityDetails() {
  return `
        <div style="display: grid; gap: 1rem;">
            ${sampleActivities.eod
              .map(
                (activity) => `
                <div class="card">
                    <div class="card-content">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 0.5rem;">${activity.name}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">${activity.resort}</div>
                                <div style="font-size: 0.875rem; color: var(--accent-pink); font-weight: 500;">${activity.source}</div>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: var(--green-600);">${activity.value}</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">${activity.time}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.875rem; color: var(--gray-600);">Demographics:</div>
                                <div style="font-size: 0.875rem;">${activity.demographics.age}, ${activity.demographics.gender}</div>
                                <div style="font-size: 0.875rem;">${activity.demographics.location}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `
}

function generateGoogleAdsDetails() {
  return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Campaign Performance</div>
                </div>
                <div class="card-content">
                    <div style="display: grid; gap: 1rem;">
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--gray-50); border-radius: 6px;">
                            <span>Luxury Resort Experience</span>
                            <span style="font-weight: 600; color: var(--green-600);">28.4% CTR</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--gray-50); border-radius: 6px;">
                            <span>Adventure Packages</span>
                            <span style="font-weight: 600; color: var(--green-600);">24.7% CTR</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: var(--gray-50); border-radius: 6px;">
                            <span>Beach Paradise</span>
                            <span style="font-weight: 600; color: var(--green-600);">22.1% CTR</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Export functionality
function exportData() {
  const data = {
    resort: currentResort,
    timeframe: currentTab,
    metrics: resortData[currentResort][currentTab],
    activities: sampleActivities[currentTab] || sampleActivities.eod,
    timestamp: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `viva-belize-analytics-${currentResort}-${currentTab}-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  showToast("Export Complete", "Your Viva Belize data has been exported successfully!")
}

// Settings functionality
function saveSettings() {
  showToast("Settings Saved", "Your preferences have been saved successfully!")
}

// Toast notifications
function showToast(title, message) {
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toastTitle")
  const toastMessage = document.getElementById("toastMessage")

  toastTitle.textContent = title
  toastMessage.textContent = message

  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 5000)
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("fullScreenModal")
  if (e.target === modal) {
    closeFullScreen()
  }

  // Close sidebar when clicking outside on mobile
  const sidebar = document.getElementById("sidebar")
  const menuBtn = document.querySelector(".menu-btn")

  if (
    window.innerWidth < 1024 &&
    sidebar &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    menuBtn &&
    !menuBtn.contains(e.target)
  ) {
    toggleSidebar()
  }
})

// Handle window resize
window.addEventListener("resize", () => {
  const sidebar = document.getElementById("sidebar")
  if (sidebar && window.innerWidth >= 1024) {
    sidebar.classList.remove("open")
  }

  // Reinitialize charts on resize
  setTimeout(initializeCharts, 100)
})
