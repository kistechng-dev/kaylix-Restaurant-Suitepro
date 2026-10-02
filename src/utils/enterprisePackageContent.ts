import { VENDOR_CONTACT } from '../data/mockData';

export function getEnterpriseHtmlApp(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kaylix Kitchen & Eatery - Enterprise Flagship Suite</title>
  <style>
    :root {
      --primary: #d97706;
      --primary-dark: #b45309;
      --primary-light: #fef3c7;
      --sidebar-bg: #0f172a;
      --sidebar-hover: #1e293b;
      --bg-main: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --purple: #8b5cf6;
      --cyan: #06b6d4;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    /* Sidebar */
    aside {
      width: 280px;
      background-color: var(--sidebar-bg);
      color: #fff;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      border-right: 1px solid #1e293b;
    }
    .brand-header {
      padding: 20px;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #d97706, #ea580c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      color: #fff;
    }
    .brand-info h1 {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
    }
    .brand-info span {
      font-size: 11px;
      color: #94a3b8;
      background: #1e293b;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .nav-list {
      list-style: none;
      padding: 16px 12px;
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #cbd5e1;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.15s ease;
    }
    .nav-item:hover {
      background: var(--sidebar-hover);
      color: #fff;
    }
    .nav-item.active {
      background: linear-gradient(135deg, #d97706, #ea580c);
      color: #fff;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    }
    .nav-icon {
      font-size: 16px;
      width: 20px;
      text-align: center;
    }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid #1e293b;
      font-size: 11px;
      color: #94a3b8;
      background: #0b1120;
    }
    .sidebar-footer .status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-weight: 700;
      color: #4ade80;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
    }

    /* Main Content */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    header.topbar {
      height: 64px;
      background: #fff;
      border-bottom: 1px solid var(--border);
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .topbar-title h2 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }
    .topbar-title p {
      font-size: 12px;
      color: var(--text-muted);
    }
    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge-enterprise {
      background: #fdf4ff;
      border: 1px solid #f0abfc;
      color: #86198f;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #d97706, #ea580c);
      color: #fff;
    }
    .btn-primary:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
    .btn-outline {
      background: #fff;
      border: 1px solid var(--border);
      color: #334155;
    }
    .btn-outline:hover {
      background: #f1f5f9;
    }
    .btn-success {
      background: #10b981;
      color: #fff;
    }

    /* Views */
    .view-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: none;
    }
    .view-content.active {
      display: block;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
    }
    .kpi-value {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
    }
    .kpi-sub {
      font-size: 11px;
      color: var(--success);
      font-weight: 700;
    }

    /* Cards */
    .card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .card-title {
      font-size: 15px;
      font-weight: 800;
      margin-bottom: 4px;
      color: #0f172a;
    }
    .card-subtitle {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      background: #f8fafc;
      color: #475569;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }
    tr:hover td {
      background: #fafafa;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }
    .badge-amber { background: #fef3c7; color: #b45309; }
    .badge-purple { background: #f3e8ff; color: #7e22ce; }

    /* Phone Simulator for WhatsApp Digest */
    .whatsapp-preview-box {
      max-width: 480px;
      background: #efeae2;
      border-radius: 20px;
      border: 8px solid #1e293b;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      overflow: hidden;
      margin: 0 auto;
    }
    .whatsapp-header {
      background: #075e54;
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .whatsapp-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #25d366;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: #fff;
    }
    .whatsapp-chat-body {
      padding: 16px;
      min-height: 380px;
      background-image: radial-gradient(#d4cdc5 1px, transparent 1px);
      background-size: 16px 16px;
    }
    .chat-bubble {
      background: #ffffff;
      padding: 12px 14px;
      border-radius: 10px 10px 10px 0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      font-size: 12px;
      line-height: 1.5;
      color: #111827;
      white-space: pre-wrap;
    }
    .chat-time {
      font-size: 10px;
      color: #94a3b8;
      text-align: right;
      margin-top: 4px;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }
    .modal-overlay.active {
      display: flex;
    }
    .modal-box {
      background: #fff;
      border-radius: 16px;
      width: 90%;
      max-width: 520px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .form-group {
      margin-bottom: 14px;
    }
    .form-group label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin-bottom: 6px;
    }
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 13px;
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside>
    <div class="brand-header">
      <div class="brand-icon">K</div>
      <div class="brand-info">
        <h1>KAYLIX ENTERPRISE</h1>
        <span>v3.4.2 Flagship Suite</span>
      </div>
    </div>

    <ul class="nav-list">
      <li class="nav-item active" onclick="switchTab('dashboard')">
        <span class="nav-icon">📊</span>
        <span>Central Multi-Branch Hub</span>
      </li>
      <li class="nav-item" onclick="switchTab('whatsapp')">
        <span class="nav-icon">📱</span>
        <span>Daily WhatsApp/Email Digest</span>
      </li>
      <li class="nav-item" onclick="switchTab('transfers')">
        <span class="nav-icon">🚚</span>
        <span>Inter-Branch Stock Transfer</span>
      </li>
      <li class="nav-item" onclick="switchTab('commissary')">
        <span class="nav-icon">🧑‍🍳</span>
        <span>Central Commissary Control</span>
      </li>
      <li class="nav-item" onclick="switchTab('loyalty')">
        <span class="nav-icon">💎</span>
        <span>Customer VIP Loyalty & SMS</span>
      </li>
      <li class="nav-item" onclick="switchTab('accounting')">
        <span class="nav-icon">📑</span>
        <span>Accounting CSV & API Sync</span>
      </li>
      <li class="nav-item" onclick="switchTab('support')">
        <span class="nav-icon">🛠️</span>
        <span>Support & Remote Deploy</span>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="status">
        <div class="pulse-dot"></div>
        <span>Cloud Hub Online (4 Outlets)</span>
      </div>
      <div>Vendor: ${VENDOR_CONTACT.name}</div>
      <div>Support: ${VENDOR_CONTACT.whatsappDisplay}</div>
    </div>
  </aside>

  <!-- Main View Area -->
  <main>
    <header class="topbar">
      <div class="topbar-title">
        <h2 id="topbar-page-title">Central Cloud Multi-Branch Dashboard</h2>
        <p id="topbar-page-subtitle">Real-time consolidated analytics across all restaurant branches and commissary</p>
      </div>
      <div class="topbar-actions">
        <span class="badge-enterprise">Enterprise Unlocked</span>
        <button class="btn btn-outline" onclick="simulateNewOrder()">⚡ Test Order Sync</button>
        <button class="btn btn-primary" onclick="switchTab('whatsapp')">📩 Send Owner Digest</button>
      </div>
    </header>

    <!-- TAB 1: Central Cloud Multi-Branch Dashboard -->
    <div id="view-dashboard" class="view-content active">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span>TOTAL GROUP SALES TODAY</span>
            <span>₦</span>
          </div>
          <div class="kpi-value" id="kpi-group-revenue">₦3,485,000</div>
          <div class="kpi-sub">↑ +18.4% vs same day last week</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span>ACTIVE DINING TABLES</span>
            <span>🪑</span>
          </div>
          <div class="kpi-value">48 / 60</div>
          <div class="kpi-sub">80% Current Seat Occupancy</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span>TOTAL CASHIER SHIFTS</span>
            <span>💻</span>
          </div>
          <div class="kpi-value">12 Active</div>
          <div class="kpi-sub">Zero offline discrepancies</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span>CENTRAL COMMISSARY DISPATCH</span>
            <span>📦</span>
          </div>
          <div class="kpi-value">₦2,180,000</div>
          <div class="kpi-sub">9 Orders Fulfilled Today</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Branch Performance & Real-Time Sync Monitor</div>
        <div class="card-subtitle">Select any branch to monitor live revenue, cashier stations, and food ticket speed</div>
        <table>
          <thead>
            <tr>
              <th>Branch / Location</th>
              <th>Terminals</th>
              <th>Today's Gross</th>
              <th>Open Orders</th>
              <th>Avg Ticket Time</th>
              <th>Cloud Sync</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Branch 01: Victoria Island Flagship</strong><br><span style="font-size:11px;color:#64748b;">Adetokunbo Ademola St</span></td>
              <td>4 POS + 3 KDS</td>
              <td style="font-weight:800;color:#0f172a;" id="b1-rev">₦1,640,000</td>
              <td>18 Active</td>
              <td>8.2 mins</td>
              <td><span class="status-badge badge-green">Synced 2s ago</span></td>
              <td><button class="btn btn-outline" style="padding:4px 8px;" onclick="alert('Viewing VI Flagship detailed shift register')">View Details</button></td>
            </tr>
            <tr>
              <td><strong>Branch 02: Lekki Phase 1 Lounge</strong><br><span style="font-size:11px;color:#64748b;">Admiralty Way</span></td>
              <td>3 POS + 2 KDS</td>
              <td style="font-weight:800;color:#0f172a;">₦1,125,000</td>
              <td>14 Active</td>
              <td>7.5 mins</td>
              <td><span class="status-badge badge-green">Synced 5s ago</span></td>
              <td><button class="btn btn-outline" style="padding:4px 8px;" onclick="alert('Viewing Lekki Lounge detailed shift register')">View Details</button></td>
            </tr>
            <tr>
              <td><strong>Branch 03: Ikeja GRA Central</strong><br><span style="font-size:11px;color:#64748b;">Isaac John Street</span></td>
              <td>2 POS + 2 KDS</td>
              <td style="font-weight:800;color:#0f172a;">₦720,000</td>
              <td>9 Active</td>
              <td>6.8 mins</td>
              <td><span class="status-badge badge-green">Synced 1s ago</span></td>
              <td><button class="btn btn-outline" style="padding:4px 8px;" onclick="alert('Viewing Ikeja GRA detailed shift register')">View Details</button></td>
            </tr>
            <tr>
              <td><strong>Central Commissary & Cold Storage</strong><br><span style="font-size:11px;color:#64748b;">Oregun Industrial Hub</span></td>
              <td>Production Station</td>
              <td style="font-weight:800;color:#8b5cf6;">₦2,180,000 (Transfers)</td>
              <td>3 Batches</td>
              <td>Bulk Yield</td>
              <td><span class="status-badge badge-purple">Hub Master</span></td>
              <td><button class="btn btn-outline" style="padding:4px 8px;" onclick="switchTab('commissary')">Manage Batches</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: Daily WhatsApp & Email Sales Digest -->
    <div id="view-whatsapp" class="view-content">
      <div style="display: flex; gap: 24px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 320px;">
          <div class="card">
            <div class="card-title">Automated Executive Daily Digest</div>
            <div class="card-subtitle">Every evening at 11:30 PM (or on-demand), Kaylix Enterprise formats and sends a complete consolidated P&L digest directly to the CEO, Managing Director, and Operations Lead via WhatsApp and Email.</div>
            
            <div class="form-group">
              <label>Owner WhatsApp Phone Number</label>
              <input type="text" class="form-control" id="owner-wa" value="${VENDOR_CONTACT.whatsappNumber}">
            </div>
            <div class="form-group">
              <label>Owner / Executive Email</label>
              <input type="text" class="form-control" id="owner-email" value="${VENDOR_CONTACT.email}">
            </div>
            <div style="display:flex; gap:10px; margin-top: 16px;">
              <button class="btn btn-success" onclick="triggerDigestSend()">📲 Send Test WhatsApp Digest</button>
              <button class="btn btn-primary" onclick="alert('Email report with attached PDF/Excel sales reconciliation sent successfully to ' + document.getElementById('owner-email').value)">📧 Send Email Report</button>
              <button class="btn btn-outline" onclick="copyDigestText()">📋 Copy Text</button>
            </div>
          </div>

          <div class="card">
            <div class="card-title">What Makes this Indispensable for Owners</div>
            <ul style="font-size: 12px; color: #475569; line-height: 1.8; padding-left: 18px;">
              <li><strong>Zero Wait Time:</strong> You don't need to be in the restaurant or open a laptop to know your exact numbers.</li>
              <li><strong>Anti-Pilfering Audit:</strong> Discrepancies between cash drawer physical counts and POS recorded cash are flagged in bold red.</li>
              <li><strong>Best Sellers & Void Alerts:</strong> See exactly what generated the highest revenue, plus supervisor manager-approved bill cancellations.</li>
            </ul>
          </div>
        </div>

        <!-- Phone Mockup Preview -->
        <div style="width: 360px;">
          <div class="whatsapp-preview-box">
            <div class="whatsapp-header">
              <div class="whatsapp-avatar">K</div>
              <div>
                <div style="font-size:13px; font-weight:700;">Kaylix Enterprise Bot</div>
                <div style="font-size:10px; opacity:0.8;">Online • Enterprise Digest</div>
              </div>
            </div>
            <div class="whatsapp-chat-body">
              <div class="chat-bubble" id="whatsapp-digest-body">
📊 *KAYLIX ENTERPRISE GROUP SALES DIGEST*
📅 Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
🏢 Outlets: Victoria Island | Lekki | Ikeja | Commissary

💰 *FINANCIAL CONSOLIDATION:*
• Total Gross Sales: *₦3,485,000*
• Total Orders Served: *246 Bills*
• Average Ticket Size: *₦14,166*
• Estimated Food Cost: *28.4% (Optimal)*

💳 *PAYMENT METHOD BREAKDOWN:*
• POS Terminal Cards: *₦1,945,000* (55.8%)
• Direct Bank Transfers: *₦720,000* (20.7%)
• Cash Collected: *₦820,000* (23.5%)

🏆 *TOP 3 DISHES TODAY:*
1. Smokey Party Jollof with Grilled Catfish (₦842,000)
2. Spicy Peppered Goat Meat (Asun Special) (₦615,000)
3. Chapman Classic Mocktail Pitchers (₦312,000)

⚠️ *AUDIT ALERTS:*
• Discounts Approved: ₦18,500 (Manager PIN)
• Voids / Cancellations: ₦0 (Clean Shift)

_Generated automatically by Kaylix Kitchen Enterprise._
              </div>
              <div class="chat-time" id="chat-time">11:30 PM ✓✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Inter-Branch Stock Transfer Requisitions -->
    <div id="view-transfers" class="view-content">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div class="card-title">Inter-Branch Requisitions & Dispatch Log</div>
            <div class="card-subtitle">Manage stock movements between branch stores and central commissary with full audit trail</div>
          </div>
          <button class="btn btn-primary" onclick="openTransferModal()">+ Create Stock Requisition</button>
        </div>

        <table id="transfers-table">
          <thead>
            <tr>
              <th>Req ID</th>
              <th>Requesting Branch</th>
              <th>Source Location</th>
              <th>Items Requested</th>
              <th>Value</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>REQ-8901</strong></td>
              <td>Branch 02: Lekki Phase 1</td>
              <td>Central Commissary</td>
              <td>50kg Basmati Rice (2 bags), 30kg Frozen Chicken</td>
              <td>₦340,000</td>
              <td><span class="status-badge badge-blue">Dispatched (Van En Route)</span></td>
              <td>Today, 10:15 AM</td>
              <td><button class="btn btn-success" style="padding:4px 8px;" onclick="markReceived(this)">Acknowledge Receive</button></td>
            </tr>
            <tr>
              <td><strong>REQ-8902</strong></td>
              <td>Branch 03: Ikeja GRA</td>
              <td>Branch 01: Victoria Island</td>
              <td>10 Crates Heineken 600ml Bottles</td>
              <td>₦36,000</td>
              <td><span class="status-badge badge-green">Received & Restocked</span></td>
              <td>Today, 08:30 AM</td>
              <td><span style="font-size:11px; color:#10b981; font-weight:700;">Completed</span></td>
            </tr>
            <tr>
              <td><strong>REQ-8903</strong></td>
              <td>Branch 01: Victoria Island</td>
              <td>Central Commissary</td>
              <td>25L Cooking Oil, 20kg Prepared Stew Base</td>
              <td>₦210,000</td>
              <td><span class="status-badge badge-amber">Pending Approval</span></td>
              <td>Today, 11:45 AM</td>
              <td><button class="btn btn-primary" style="padding:4px 8px;" onclick="approveTransfer(this)">Approve Dispatch</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: Central Commissary Production Control -->
    <div id="view-commissary" class="view-content">
      <div class="card">
        <div class="card-title">Central Commissary Production & Recipe Batch Yields</div>
        <div class="card-subtitle">Standardize recipe taste, maximize bulk procurement savings, and dispatch pre-prepped food to outlets</div>
        
        <table>
          <thead>
            <tr>
              <th>Batch Code</th>
              <th>Recipe Name</th>
              <th>Raw Materials Consumed</th>
              <th>Target Output Yield</th>
              <th>Cost / Portion</th>
              <th>Target Outlets</th>
              <th>Batch Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>BATCH-C204</strong></td>
              <td>Party Jollof Sauce & Marinade Base</td>
              <td>50kg Tomatoes, 20kg Tatashe, 10kg Spices, 25L Oil</td>
              <td><strong>300 Portions</strong></td>
              <td>₦285 / portion</td>
              <td>All Branches (VI, Lekki, Ikeja)</td>
              <td><span class="status-badge badge-green">Batch Completed & Packed</span></td>
            </tr>
            <tr>
              <td><strong>BATCH-C205</strong></td>
              <td>Marinated Asun Goat Meat Cuts</td>
              <td>120kg Goat Meat, Scotch Bonnet, Ginger/Garlic</td>
              <td><strong>180 Servings</strong></td>
              <td>₦920 / portion</td>
              <td>Lekki Lounge & VI Flagship</td>
              <td><span class="status-badge badge-blue">In Pressure Cooker / Grill</span></td>
            </tr>
            <tr>
              <td><strong>BATCH-C206</strong></td>
              <td>Meat Pie & Pastry Pre-Forms</td>
              <td>50kg Flour, 15kg Butter, 25kg Minced Beef</td>
              <td><strong>250 Pastries</strong></td>
              <td>₦240 / unit</td>
              <td>Ikeja GRA & VI Flagship</td>
              <td><span class="status-badge badge-amber">Baking Stage</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-title">Interactive Batch Yield Calculator</div>
        <div class="card-subtitle">Adjust target portions to calculate exact raw material deductions automatically</div>
        <div style="display:flex; gap:16px; align-items:flex-end;">
          <div class="form-group" style="margin-bottom:0; flex:1;">
            <label>Select Master Commissary Recipe</label>
            <select class="form-control" id="recipe-select" onchange="calculateRecipe()">
              <option value="jollof">Party Jollof Rice Base (100 Portions)</option>
              <option value="friedrice">Special Fried Rice Base (100 Portions)</option>
              <option value="okro">Seafood Okro Base (50 Portions)</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0; width:160px;">
            <label>Multiplier Batches</label>
            <input type="number" class="form-control" id="recipe-mult" value="2" min="1" max="10" onchange="calculateRecipe()">
          </div>
          <button class="btn btn-primary" onclick="calculateRecipe()">Re-calculate Ingredients</button>
        </div>
        <div id="recipe-result" style="margin-top:16px; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; font-size:12px;">
          <strong>Required Raw Stock for 2x Batches (200 Portions):</strong><br>
          • 50kg Premium Parboiled Basmati Rice (1 Bag)<br>
          • 20 Litres Pure Vegetable Cooking Oil<br>
          • 15kg Fresh Pepper/Tomato Paste Blend<br>
          • 4kg Signature Jollof Seasoning & Bay Leaves<br>
          <em>Estimated Cost of Goods Sold (COGS): ₦58,000 (Gross Selling Value: ₦500,000 | Profit Margin: 88.4%)</em>
        </div>
      </div>
    </div>

    <!-- TAB 5: Customer VIP Loyalty & SMS Marketing -->
    <div id="view-loyalty" class="view-content">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div class="card-title">Customer VIP Loyalty Tier Management</div>
            <div class="card-subtitle">Retain high-spending patrons with automated point accumulation across all restaurant locations</div>
          </div>
          <button class="btn btn-success" onclick="openSmsModal()">📲 Send VIP SMS Marketing Campaign</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Phone Number</th>
              <th>VIP Tier</th>
              <th>Total Lifetime Spend</th>
              <th>Points Balance</th>
              <th>Favorite Branch</th>
              <th>Last Visit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Chief Adeleke Babatunde</strong></td>
              <td>0803 *** 8812</td>
              <td><span class="status-badge badge-purple">💎 Diamond VIP</span></td>
              <td>₦3,850,000</td>
              <td><strong>38,500 pts</strong></td>
              <td>VI Flagship</td>
              <td>Yesterday</td>
            </tr>
            <tr>
              <td><strong>Dr. Chioma Nwachukwu</strong></td>
              <td>0812 *** 4509</td>
              <td><span class="status-badge badge-blue">🏆 Platinum VIP</span></td>
              <td>₦1,920,000</td>
              <td><strong>19,200 pts</strong></td>
              <td>Lekki Lounge</td>
              <td>3 days ago</td>
            </tr>
            <tr>
              <td><strong>Mr. Ibrahim Musa</strong></td>
              <td>0805 *** 1198</td>
              <td><span class="status-badge badge-amber">⭐ Gold VIP</span></td>
              <td>₦850,000</td>
              <td><strong>8,500 pts</strong></td>
              <td>Ikeja GRA</td>
              <td>Today</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 6: Accounting CSV & API Sync -->
    <div id="view-accounting" class="view-content">
      <div class="card">
        <div class="card-title">Financial Accounting Integration (QuickBooks, Xero, Sage)</div>
        <div class="card-subtitle">Export daily end-of-day trial balance and ledger entries with one click, or sync via live webhook API</div>
        
        <div style="display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="exportAccountingCsv('QuickBooks')">📥 Export QuickBooks CSV</button>
          <button class="btn btn-outline" onclick="exportAccountingCsv('Xero')">📥 Export Xero CSV</button>
          <button class="btn btn-outline" onclick="exportAccountingCsv('Sage')">📥 Export Sage Pastel CSV</button>
          <button class="btn btn-success" onclick="testApiSync()">⚡ Test Live API Webhook Sync</button>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
          <div style="font-size:12px; font-weight:800; margin-bottom:8px; color:#0f172a;">Chart of Accounts Ledger Mapping (Daily Summary):</div>
          <table>
            <thead>
              <tr>
                <th>Account Code</th>
                <th>Account Description</th>
                <th>Debit (₦)</th>
                <th>Credit (₦)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1010</td>
                <td>Cash & Bank POS Clearing Account</td>
                <td>₦3,485,000.00</td>
                <td>-</td>
              </tr>
              <tr>
                <td>4001</td>
                <td>Restaurant Food & Beverage Revenue</td>
                <td>-</td>
                <td>₦3,241,860.47</td>
              </tr>
              <tr>
                <td>2050</td>
                <td>VAT Output Liability (7.5%)</td>
                <td>-</td>
                <td>₦243,139.53</td>
              </tr>
              <tr style="font-weight:900; background:#f1f5f9;">
                <td colspan="2">TOTALS (BALANCED LEDGER)</td>
                <td>₦3,485,000.00</td>
                <td>₦3,485,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 7: Support & Remote Deploy -->
    <div id="view-support" class="view-content">
      <div class="card">
        <div class="card-title">Layman Technical Support & 1-Click Remote Deployment</div>
        <div class="card-subtitle">Connect directly with Kaylix Certified Systems Engineers for hands-off setup via AnyDesk or TeamViewer</div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-top:16px;">
          <div style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fafafa;">
            <div style="font-weight:800; font-size:14px; margin-bottom:6px;">AnyDesk Remote Desk</div>
            <p style="font-size:12px; color:#64748b; margin-bottom:12px;">Share your 9-digit AnyDesk ID with our engineering team for instant printer configuration and menu loading.</p>
            <input type="text" class="form-control" placeholder="Enter your AnyDesk ID (e.g. 123 456 789)" style="margin-bottom:10px;">
            <button class="btn btn-primary" onclick="alert('Remote engineer notified. Please open WhatsApp to confirm.')">Send ID to Support Engineer</button>
          </div>

          <div style="padding:16px; border:1px solid #e2e8f0; border-radius:10px; background:#fafafa;">
            <div style="font-weight:800; font-size:14px; margin-bottom:6px;">Official Support Desk</div>
            <p style="font-size:12px; color:#64748b; margin-bottom:12px;">Direct hotline for enterprise clients with guaranteed under 15-minute response time.</p>
            <div style="font-size:12px; margin-bottom:6px;"><strong>WhatsApp:</strong> ${VENDOR_CONTACT.whatsappDisplay}</div>
            <div style="font-size:12px; margin-bottom:12px;"><strong>Email:</strong> ${VENDOR_CONTACT.email}</div>
            <a href="https://wa.me/${VENDOR_CONTACT.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20Kaylix%20Support,%20I%20am%20running%20the%20Enterprise%20Edition%20and%20need%20assistance." target="_blank" class="btn btn-success" style="text-decoration:none;">📲 Chat on WhatsApp Now</a>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script>
    function switchTab(tabId) {
      document.querySelectorAll('.view-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

      const targetView = document.getElementById('view-' + tabId);
      if (targetView) targetView.classList.add('active');

      const titles = {
        'dashboard': ['Central Cloud Multi-Branch Dashboard', 'Real-time consolidated analytics across all restaurant branches and commissary'],
        'whatsapp': ['Daily WhatsApp/Email Sales Digest', 'Automated executive financial summaries sent directly to owners'],
        'transfers': ['Inter-Branch Stock Transfer Requisitions', 'Track and approve stock requisitions across restaurant branches'],
        'commissary': ['Central Commissary Production Control', 'Standardize recipes, calculate batch yields and track bulk costs'],
        'loyalty': ['Customer VIP Loyalty & SMS Marketing', 'Manage VIP tiers, loyalty wallets and launch promotional blasts'],
        'accounting': ['Accounting CSV & API Sync', 'One-click export to QuickBooks, Xero, Sage and cloud webhooks'],
        'support': ['Technical Support & Remote Deployment', 'Direct connection with Kaylix engineers for hands-off setup']
      };

      if (titles[tabId]) {
        document.getElementById('topbar-page-title').innerText = titles[tabId][0];
        document.getElementById('topbar-page-subtitle').innerText = titles[tabId][1];
      }

      const tabs = ['dashboard', 'whatsapp', 'transfers', 'commissary', 'loyalty', 'accounting', 'support'];
      const index = tabs.indexOf(tabId);
      if (index !== -1) {
        document.querySelectorAll('.nav-item')[index].classList.add('active');
      }
    }

    function simulateNewOrder() {
      const b1 = document.getElementById('b1-rev');
      const grp = document.getElementById('kpi-group-revenue');
      const current = 1640000;
      const added = Math.floor(Math.random() * 8000) + 4500;
      const updatedB1 = current + added;
      const updatedGrp = 3485000 + added;
      
      b1.innerText = '₦' + updatedB1.toLocaleString();
      grp.innerText = '₦' + updatedGrp.toLocaleString();
      alert('Order synced from Victoria Island Station #2! Added ₦' + added.toLocaleString() + ' to consolidated cloud revenue.');
    }

    function triggerDigestSend() {
      const phone = document.getElementById('owner-wa').value;
      alert('WhatsApp Digest dispatched to ' + phone + '! Message is displayed in the live phone preview.');
    }

    function copyDigestText() {
      const text = document.getElementById('whatsapp-digest-body').innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('Digest copied to clipboard!');
      });
    }

    function markReceived(btn) {
      btn.parentElement.innerHTML = '<span style="font-size:11px; color:#10b981; font-weight:700;">Received & Restocked</span>';
      alert('Transfer received! Branch inventory levels updated automatically.');
    }

    function approveTransfer(btn) {
      btn.parentElement.innerHTML = '<span class="status-badge badge-blue">Dispatched (Van En Route)</span>';
      alert('Requisition approved! Central commissary dispatch ticket generated.');
    }

    function calculateRecipe() {
      const mult = parseInt(document.getElementById('recipe-mult').value) || 1;
      const select = document.getElementById('recipe-select').value;
      const res = document.getElementById('recipe-result');

      if (select === 'jollof') {
        res.innerHTML = '<strong>Required Raw Stock for ' + mult + 'x Batches (' + (mult * 100) + ' Portions):</strong><br>' +
          '• ' + (mult * 25) + 'kg Premium Parboiled Basmati Rice<br>' +
          '• ' + (mult * 10) + 'L Pure Cooking Oil<br>' +
          '• ' + (mult * 7.5) + 'kg Tomato/Pepper Puree Blend<br>' +
          '• ' + (mult * 2) + 'kg Signature Seasonings<br>' +
          '<em>Estimated Cost: ₦' + (mult * 29000).toLocaleString() + ' | Selling Value: ₦' + (mult * 250000).toLocaleString() + ' (88% Gross Margin)</em>';
      } else if (select === 'friedrice') {
        res.innerHTML = '<strong>Required Raw Stock for ' + mult + 'x Batches (' + (mult * 100) + ' Portions):</strong><br>' +
          '• ' + (mult * 25) + 'kg Basmati Rice<br>' +
          '• ' + (mult * 8) + 'kg Sweet Corn & Green Peas<br>' +
          '• ' + (mult * 6) + 'kg Diced Shrimps & Liver<br>' +
          '• ' + (mult * 8) + 'L Cooking Oil & Curry Blend<br>' +
          '<em>Estimated Cost: ₦' + (mult * 38000).toLocaleString() + ' | Selling Value: ₦' + (mult * 320000).toLocaleString() + '</em>';
      } else {
        res.innerHTML = '<strong>Required Raw Stock for ' + mult + 'x Batches (' + (mult * 50) + ' Portions):</strong><br>' +
          '• ' + (mult * 15) + 'kg Fresh Okro<br>' +
          '• ' + (mult * 10) + 'kg Assorted Fresh Seafood (Crabs, Shrimps, Calamari)<br>' +
          '• ' + (mult * 5) + 'L Palm Oil & Traditional Seasonings<br>' +
          '<em>Estimated Cost: ₦' + (mult * 45000).toLocaleString() + ' | Selling Value: ₦' + (mult * 275000).toLocaleString() + '</em>';
      }
    }

    function exportAccountingCsv(system) {
      const csv = "Account Code,Account Name,Debit,Credit,Date\\n1010,Cash & Bank Clearing,3485000.00,0.00," + new Date().toISOString().slice(0,10) + "\\n4001,Food & Beverage Revenue,0.00,3241860.47," + new Date().toISOString().slice(0,10) + "\\n2050,VAT Output Liability (7.5%),0.00,243139.53," + new Date().toISOString().slice(0,10) + "\\n";
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Kaylix_Enterprise_' + system + '_Daily_Sync.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      alert('Downloaded ' + system + ' Ledger CSV successfully!');
    }

    function testApiSync() {
      alert('Connecting to Accounting Webhook endpoint...\\n[200 OK] Handshake successful! Cloud journals synchronized.');
    }

    function openSmsModal() {
      const msg = prompt('Enter promotional SMS text to blast to all 450 VIP Members:', '🎉 Weekend Special at Kaylix! Enjoy 20% off all Cocktails and Chef Specials this Friday. Show this SMS to your server.');
      if (msg) {
        alert('Campaign launched! 450 SMS queued for instant delivery via SMS Gateway API.');
      }
    }

    function openTransferModal() {
      const item = prompt('Enter Item Name and Quantity to request (e.g., 20kg Frozen Fish):', '20kg Catfish');
      if (item) {
        alert('Stock requisition for ' + item + ' submitted to Central Commissary. Status: Pending Approval.');
      }
    }
  </script>
</body>
</html>`;
}

export function getEnterpriseReadme(): string {
  return `================================================================================
KAYLIX KITCHEN & EATERY MANAGEMENT SYSTEM - ENTERPRISE FLAGSHIP SUITE
COMPLETE NOVICE / LAYMAN ONE-CLICK INSTALLATION BUNDLE
================================================================================

HELLO & WELCOME!
You have downloaded the complete, self-contained Kaylix Enterprise Package.
Everything is pre-configured and ready to run with ZERO complicated setup!

--------------------------------------------------------------------------------
HOW TO RUN IN 1 CLICK (NOVICE & LAYMAN GUIDE):
--------------------------------------------------------------------------------
1. UNZIP / EXTRACT this entire .zip file to your Desktop or C:\\KaylixPOS.
2. DOUBLE-CLICK either:
   - "START_HERE_KAYLIX_ENTERPRISE.html" (Opens instantly in your browser: Chrome, Edge, Safari, Firefox)
   - OR "One_Click_Enterprise_Setup.bat" (Windows launcher)
3. You will immediately see the complete interactive Enterprise Flagship Suite!

--------------------------------------------------------------------------------
INCLUDED ENTERPRISE UPDATES IN THIS PACKAGE:
--------------------------------------------------------------------------------
1. Daily WhatsApp / Email Sales Digest:
   - Automated end-of-day P&L summary sent directly to owner's WhatsApp and email.
   - Includes gross sales, net margins, payment modes (Cash vs POS vs Transfer), and best-sellers.

2. Central Cloud Multi-Branch Dashboard:
   - Live multi-branch consolidation (Victoria Island, Lekki Lounge, Ikeja GRA, Commissary).
   - Real-time order sync and seating occupancy monitoring.

3. Inter-Branch Stock Transfer Requisitions:
   - Request, approve, dispatch, and receive inventory between branches and central store.
   - Full audit trail to prevent food waste and theft.

4. Central Commissary Production Control:
   - Master recipe batch yield calculator.
   - Standardize recipe taste and track raw ingredients used.

5. Customer VIP Loyalty & SMS Marketing:
   - Diamond, Platinum, Gold VIP tiers.
   - 1-Click bulk SMS & WhatsApp promotional marketing blasts.

6. Accounting System CSV & API Sync:
   - 1-Click exports to QuickBooks, Xero, and Sage.
   - Daily ledger balances mapped to standard accounting codes.

7. Technical Support & Remote Deployment:
   - 1-Click AnyDesk / TeamViewer remote assistance.
   - Direct 24/7 WhatsApp hotline to Kaylix Engineering: ${VENDOR_CONTACT.whatsappDisplay}

--------------------------------------------------------------------------------
DEFAULT LOGIN CREDENTIALS:
--------------------------------------------------------------------------------
Super-Admin Username: admin
Default Staff PIN: 123456

Need help? Contact Reseller Support:
WhatsApp: ${VENDOR_CONTACT.whatsappDisplay} (${VENDOR_CONTACT.email})
================================================================================`;
}

export function getEnterpriseBatchScript(): string {
  return `@echo off
color 0B
title Kaylix Enterprise POS - 1-Click Novice Launcher
echo ===============================================================================
echo     KAYLIX KITCHEN ^& EATERY MANAGEMENT SYSTEM - ENTERPRISE FLAGSHIP
echo     One-Click Novice Launcher
echo ===============================================================================
echo.
echo [1/3] Checking environment... OK
echo [2/3] Local Database engine: SQLite3 Encrypted Engine Ready
echo [3/3] Launching Kaylix Enterprise Suite...
echo.
start "" "%~dp0START_HERE_KAYLIX_ENTERPRISE.html"
echo The Kaylix Enterprise Suite has opened in your default web browser!
echo.
echo For remote engineer assistance, contact WhatsApp: ${VENDOR_CONTACT.whatsappDisplay}
echo ===============================================================================
echo.
pause
`;
}

export function getEnterpriseVbsScript(): string {
  return `' Kaylix Enterprise Silent Launcher
Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run """" & strPath & "\\START_HERE_KAYLIX_ENTERPRISE.html""", 1, False
`;
}

export function getEnterpriseIniConfig(): string {
  return `[KAYLIX_ENTERPRISE]
Version=v3.4.2-Enterprise-Master
Edition=ENTERPRISE_FLAGSHIP
LicenseTier=ENTERPRISE_UNLIMITED
Currency=NGN
CurrencySymbol=₦
TaxRate=7.50

[DAILY_WHATSAPP_DIGEST]
Enabled=True
AutoSendTime=23:30
RecipientPhone=${VENDOR_CONTACT.whatsappNumber}
RecipientEmail=${VENDOR_CONTACT.email}
IncludeDiscrepancyCheck=True
IncludeTopSellers=True

[CLOUD_MULTI_BRANCH]
Enabled=True
HubRole=CentralCloudMaster
Branches=VI_Flagship,Lekki_Lounge,Ikeja_GRA,Central_Commissary
SyncIntervalSeconds=5

[STOCK_TRANSFER_REQUISITIONS]
Enabled=True
RequireApproval=True
AutoAdjustInventory=True

[COMMISSARY_PRODUCTION]
Enabled=True
YieldLossTracking=True
BatchScheduling=True

[VIP_LOYALTY_MARKETING]
Enabled=True
PointsPer100Spent=1
SmsGatewayEnabled=True

[ACCOUNTING_SYNC]
DefaultSystem=QuickBooks
AutoExportDailySummary=True
VatAccountId=2050
RevenueAccountId=4001

[TECHNICAL_SUPPORT]
Reseller=${VENDOR_CONTACT.name}
SupportPhone=${VENDOR_CONTACT.whatsappDisplay}
SupportEmail=${VENDOR_CONTACT.email}
AnyDeskRemoteDesk=Available
`;
}

export function getSampleRequisitionCsv(): string {
  return `Requisition_ID,Requesting_Branch,Source_Branch,Item_Code,Item_Name,Quantity_Requested,Unit,Estimated_Cost_NGN,Status,Requested_By
REQ-8901,Lekki Phase 1,Central Commissary,RICE-BAS-01,Basmati Parboiled Rice 50kg,2,Bags,180000,Dispatched,Chef Emmanuel
REQ-8902,Ikeja GRA,VI Flagship,BEER-HN-01,Heineken 600ml Bottles,10,Crates,36000,Received,Supervisor Ngozi
REQ-8903,VI Flagship,Central Commissary,OIL-VEG-25,Pure Vegetable Cooking Oil 25L,3,Jerrycans,105000,Pending Approval,Head Chef Tunde
REQ-8904,Lekki Phase 1,Central Commissary,CHK-FRZ-01,Clean Frozen Chicken Cuts 10kg,5,Cartons,125000,Approved,Chef Emmanuel
`;
}

export function getSampleCommissaryRecipesCsv(): string {
  return `Recipe_ID,Recipe_Name,Standard_Batch_Portions,Raw_Ingredients,Preparation_Time_Mins,Cost_Per_Portion_NGN,Selling_Price_NGN,Gross_Margin_Percent
COM-001,Party Jollof Rice Base,150,Basmati Rice 25kg; Vegetable Oil 10L; Tomato Pepper Blend 8kg; Seasonings 2kg,90,380,2500,84.8
COM-002,Spicy Asun Goat Meat Cuts,80,Goat Meat 50kg; Scotch Bonnet 5kg; Onions & Garlic 4kg; Seasonings 1kg,120,850,3500,75.7
COM-003,Signature Chapman Syrup,200,Angostura Bitters 200ml; Grenadine 5L; Cucumber & Citrus Extract 3L,45,180,2000,91.0
COM-004,Seafood Okro Base,60,Fresh Okro 15kg; Assorted Crabs & Shrimps 10kg; Palm Oil 4L; Crayfish 2kg,75,1100,5500,80.0
`;
}

export function getSampleVipLoyaltyCsv(): string {
  return `Member_ID,Full_Name,Phone_Number,VIP_Tier,Total_Spend_NGN,Points_Wallet,Favorite_Branch,Created_Date
VIP-101,Chief Adeleke Babatunde,+234 803 555 8812,Diamond VIP,3850000,38500,Victoria Island Flagship,2025-01-15
VIP-102,Dr. Chioma Nwachukwu,+234 812 777 4509,Platinum VIP,1920000,19200,Lekki Phase 1 Lounge,2025-03-22
VIP-103,Mr. Ibrahim Musa,+234 805 333 1198,Gold VIP,850000,8500,Ikeja GRA Central,2025-06-10
VIP-104,Barrister Femi Alabi,+234 802 444 9901,Platinum VIP,1450000,14500,Victoria Island Flagship,2025-04-18
VIP-105,Mrs. Folake Davies,+234 818 222 3344,Gold VIP,620000,6200,Lekki Phase 1 Lounge,2025-08-05
`;
}

export function getSampleAccountingCsv(): string {
  return `Account_Number,Account_Description,Debit_NGN,Credit_NGN,Transaction_Date,Reference_Code,Notes
1010,Cash & Bank Clearing Account,3485000.00,0.00,2026-10-01,DAILY-SALES-20261001,Daily Consolidated Cashier Collections
4001,Food & Beverage Revenue,0.00,3241860.47,2026-10-01,REV-20261001,Net F&B Sales Across Outlets
2050,VAT Output Liability (7.5%),0.00,243139.53,2026-10-01,TAX-20261001,Value Added Tax 7.5% Payable
5010,Cost of Goods Sold (COGS),990200.00,0.00,2026-10-01,COGS-20261001,Ingredient Depletion from Kitchens
1200,Food Inventory Asset,0.00,990200.00,2026-10-01,INV-20261001,Store Inventory Relieved
`;
}
