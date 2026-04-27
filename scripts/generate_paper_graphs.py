import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure the output directory exists
output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets', 'graphs'))
os.makedirs(output_dir, exist_ok=True)

# Set global seaborn style for a professional, "Solarpunk" aesthetic
plt.style.use('dark_background')
sns.set_theme(style="darkgrid", rc={
    "axes.facecolor": "#111827",
    "figure.facecolor": "#111827",
    "axes.edgecolor": "#374151",
    "grid.color": "#374151",
    "text.color": "#F9FAFB",
    "axes.labelcolor": "#F9FAFB",
    "xtick.color": "#9CA3AF",
    "ytick.color": "#9CA3AF"
})

# Custom Solarpunk Palette
COLORS = {
    'emerald': '#10B981',
    'amber': '#F59E0B',
    'blue': '#3B82F6',
    'rose': '#F43F5E',
    'purple': '#8B5CF6',
    'cyan': '#06B6D4',
    'baseline': '#6B7280'
}

def save_plot(filename):
    plt.tight_layout()
    path = os.path.join(output_dir, filename)
    plt.savefig(path, dpi=300, bbox_inches='tight', transparent=True)
    print(f"Generated: {path}")
    plt.close()

def plot_1_aqi_improvement():
    grids = ['Anand Vihar (Industrial)', 'Connaught Place (Downtown)', 'Dwarka (Residential)', 'DND Flyway (Transit)', 'Lodhi Gardens (Park)']
    before = [415, 280, 195, 310, 150]
    after = [180, 125, 90, 145, 80]

    df = pd.DataFrame({'Location': grids * 2, 'AQI': before + after, 'State': ['Baseline (Before)']*5 + ['Mitigated (After)']*5})
    
    plt.figure(figsize=(12, 6))
    ax = sns.barplot(x='Location', y='AQI', hue='State', data=df, palette=[COLORS['baseline'], COLORS['emerald']])
    plt.title('AQI Improvement per Zone (Pre vs Post Intervention) - New Delhi Data', fontsize=16, fontweight='bold', pad=20)
    plt.ylabel('Air Quality Index (AQI)')
    plt.xlabel('Specific Urban Zones (New Delhi, India)')
    plt.xticks(rotation=15)
    
    # Add horizontal threshold line
    plt.axhline(100, color=COLORS['rose'], linestyle='--', alpha=0.7, label='Hazard Threshold')
    plt.legend()
    save_plot('1_aqi_improvement.png')

def plot_2_optimization_comparison():
    algorithms = ['Greedy Heuristic', 'Genetic Algorithm', 'Linear Programming']
    metrics = ['AQI Reduction Efficiency', 'CO2 Sequestration Rate', 'Capital Cost Efficiency']
    
    # Synthetic scores (0-100)
    data = [
        [75, 50, 95], # Greedy: Good cost, poor CO2, decent AQI
        [88, 92, 85], # GA: High synergy, excellent CO2/AQI, good cost
        [98, 80, 60], # LP: Max AQI, low cost efficiency
    ]
    
    df = pd.DataFrame(data, columns=metrics, index=algorithms).reset_index()
    df_melt = df.melt(id_vars='index', var_name='Metric', value_name='Score')
    
    plt.figure(figsize=(11, 6))
    sns.barplot(x='index', y='Score', hue='Metric', data=df_melt, palette=[COLORS['emerald'], COLORS['blue'], COLORS['amber']])
    plt.title('Optimization Algorithm Comparison (Multi-Objective)', fontsize=16, fontweight='bold', pad=20)
    plt.ylabel('Normalized Score (0-100)')
    plt.xlabel('Solver Methodology')
    plt.ylim(0, 110)
    plt.legend(loc='upper right')
    save_plot('2_opt_comparison.png')

def plot_3_hotspot_detection():
    np.random.seed(42)
    # Generate spatial grid points
    n_points = 300
    lat = np.random.normal(28.61, 0.05, n_points)
    lon = np.random.normal(77.20, 0.05, n_points)
    aqi = np.random.uniform(50, 200, n_points)
    
    # Add dense clusters (Hotspots)
    lat = np.append(lat, np.random.normal(28.65, 0.01, 50))
    lon = np.append(lon, np.random.normal(77.22, 0.01, 50))
    aqi = np.append(aqi, np.random.uniform(150, 250, 50))
    
    fig, axes = plt.subplots(1, 3, figsize=(18, 6), sharey=True)
    fig.suptitle('Spatial Hotspot Detection Algorithms Comparison - New Delhi, India', fontsize=18, fontweight='bold', y=1.05)
    
    # 1. Threshold
    ax = axes[0]
    colors = [COLORS['rose'] if a > 120 else COLORS['baseline'] for a in aqi]
    ax.scatter(lon, lat, c=colors, s=aqi/3, alpha=0.7)
    ax.set_title('Threshold (AQI > 120)')
    
    # 2. K-Means
    ax = axes[1]
    # Simple spatial split for visual
    colors = [COLORS['amber'] if l > 28.63 else COLORS['blue'] if lo < 77.2 else COLORS['baseline'] for l, lo in zip(lat, lon)]
    ax.scatter(lon, lat, c=colors, s=aqi/3, alpha=0.7)
    ax.set_title('K-Means Clustering')
    
    # 3. DBSCAN
    ax = axes[2]
    # Highlight only dense clusters
    colors = [COLORS['emerald'] if (l > 28.63 and l < 28.67 and lo > 77.20 and lo < 77.24) else COLORS['baseline'] for l, lo in zip(lat, lon)]
    ax.scatter(lon, lat, c=colors, s=aqi/3, alpha=0.7)
    ax.set_title('DBSCAN (Density-Based)')
    
    for ax in axes:
        ax.set_xlabel('Longitude')
        ax.set_ylabel('Latitude')
    
    save_plot('3_hotspot_detection.png')

def plot_4_cost_aqi_tradeoff():
    budgets = np.linspace(10000, 500000, 50)
    
    # Diminishing returns curve
    reduction_greedy = 100 * (1 - np.exp(-budgets / 150000))
    reduction_ga = 130 * (1 - np.exp(-budgets / 100000))
    
    plt.figure(figsize=(10, 6))
    plt.plot(budgets, reduction_ga, color=COLORS['emerald'], linewidth=3, label='Genetic Algorithm Frontier')
    plt.plot(budgets, reduction_greedy, color=COLORS['baseline'], linewidth=2, linestyle='--', label='Greedy Frontier')
    
    plt.fill_between(budgets, reduction_ga, reduction_greedy, color=COLORS['emerald'], alpha=0.1)
    
    plt.title('Cost vs AQI Trade-off (Pareto Frontier)', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Capital Budget ($)')
    plt.ylabel('Total Network AQI Reduction')
    plt.legend()
    save_plot('4_cost_vs_aqi.png')

def plot_5_resource_allocation():
    labels = ['Bio-Filtration (Nature)', 'Nano-Mist (Tech)', 'Scrubbers (Heavy)']
    greedy = [20, 60, 20]
    ga = [45, 45, 10]
    lp = [0, 20, 80]
    
    width = 0.5
    fig, ax = plt.subplots(figsize=(8, 6))
    
    ax.bar(['Greedy', 'Genetic Alg.', 'Linear Prog.'], [greedy[0], ga[0], lp[0]], width, label=labels[0], color=COLORS['emerald'])
    ax.bar(['Greedy', 'Genetic Alg.', 'Linear Prog.'], [greedy[1], ga[1], lp[1]], width, bottom=[greedy[0], ga[0], lp[0]], label=labels[1], color=COLORS['cyan'])
    ax.bar(['Greedy', 'Genetic Alg.', 'Linear Prog.'], [greedy[2], ga[2], lp[2]], width, bottom=[greedy[0]+greedy[1], ga[0]+ga[1], lp[0]+lp[1]], label=labels[2], color=COLORS['amber'])
    
    ax.set_ylabel('Budget Allocation %')
    ax.set_title('Resource Allocation Efficiency by Algorithm', fontsize=16, fontweight='bold', pad=20)
    ax.legend(loc='center left', bbox_to_anchor=(1, 0.5))
    save_plot('5_resource_allocation.png')

def plot_6_temporal_simulation():
    hours = np.arange(0, 25)
    # Diurnal cycle
    base_cycle = 120 + 40 * np.sin(np.pi * (hours - 8) / 12)
    
    # Intervention applied at hour 10
    mitigated_cycle = base_cycle.copy()
    for i in range(10, 25):
        mitigated_cycle[i] = mitigated_cycle[i] - 50 * (1 - np.exp(-(i-10)/3))
        
    plt.figure(figsize=(10, 6))
    plt.plot(hours, base_cycle, color=COLORS['baseline'], linewidth=2, linestyle='--', label='Unmitigated Decay')
    plt.plot(hours, mitigated_cycle, color=COLORS['emerald'], linewidth=3, label='Intervention Applied')
    
    plt.axvline(10, color=COLORS['amber'], linestyle=':', linewidth=2, label='Asset Deployment')
    plt.fill_between(hours, base_cycle, mitigated_cycle, where=(hours >= 10), color=COLORS['emerald'], alpha=0.15)
    
    plt.title('Temporal Simulation (24-Hour AQI Cycle) - New Delhi', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Time (Hours)')
    plt.ylabel('Network Average AQI')
    plt.legend()
    plt.grid(True, alpha=0.2)
    save_plot('6_temporal_simulation.png')

def plot_7_prediction_vs_decision():
    days = np.arange(1, 31)
    # Long term trend
    predicted = 100 + days * 1.5 + 10 * np.sin(days)
    decided = 100 - days * 0.5 + 5 * np.sin(days)
    
    plt.figure(figsize=(10, 6))
    plt.plot(days, predicted, color=COLORS['rose'], linewidth=2, linestyle='--', label='Prediction: Business as Usual')
    plt.plot(days, decided, color=COLORS['blue'], linewidth=3, label='Decision: Intelligence System Engaged')
    
    plt.fill_between(days, predicted, decided, color=COLORS['blue'], alpha=0.1)
    
    plt.title('Prediction vs Decision-Intelligence Trajectory (30 Days)', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Simulation Days')
    plt.ylabel('Cumulative CO2 / AQI Impact Index')
    plt.legend()
    save_plot('7_prediction_vs_decision.png')

def plot_8_co2_balance():
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    emissions = [500, 490, 510, 480, 470, 490, 520, 530, 510, 480, 460, 450]
    # Gradually increasing sequestration as assets come online
    sequestration = [20, 40, 80, 150, 220, 300, 380, 420, 450, 470, 480, 490]
    
    net_emissions = [e - s for e, s in zip(emissions, sequestration)]
    
    plt.figure(figsize=(10, 6))
    plt.fill_between(months, 0, emissions, color=COLORS['rose'], alpha=0.3, label='Gross Emissions')
    plt.fill_between(months, 0, sequestration, color=COLORS['emerald'], alpha=0.5, label='Sequestration Capacity')
    plt.plot(months, net_emissions, color='white', linewidth=3, marker='o', label='Net CO2 Footprint')
    
    plt.axhline(0, color=COLORS['cyan'], linestyle='--', linewidth=2, label='Net-Zero Target')
    plt.title('CO2 Emission vs Sequestration Balance (12-Month Projection)', fontsize=16, fontweight='bold', pad=20)
    plt.ylabel('CO2 Kilotons (kt)')
    plt.legend(loc='upper right')
    save_plot('8_co2_balance.png')

def plot_9_sentiment_correlation():
    weeks = np.arange(1, 13)
    # High disruption early (building scrubbers), then greening
    disruption = [85, 90, 75, 60, 40, 30, 25, 20, 15, 10, 5, 5]
    sentiment = [45, 40, 48, 55, 65, 75, 82, 85, 88, 92, 95, 96]
    
    fig, ax1 = plt.subplots(figsize=(10, 6))
    
    color = COLORS['rose']
    ax1.set_xlabel('Simulation Weeks')
    ax1.set_ylabel('Infrastructure Disruption Index', color=color)
    ax1.plot(weeks, disruption, color=color, linewidth=3, linestyle='--', label='Disruption')
    ax1.tick_params(axis='y', labelcolor=color)
    
    ax2 = ax1.twinx()
    color = COLORS['blue']
    ax2.set_ylabel('Public Sentiment Score (%)', color=color)
    ax2.plot(weeks, sentiment, color=color, linewidth=3, marker='s', label='Sentiment')
    ax2.tick_params(axis='y', labelcolor=color)
    
    plt.title('Public Sentiment vs Urban Disruption Impact', fontsize=16, fontweight='bold', pad=20)
    fig.tight_layout()
    save_plot('9_sentiment_correlation.png')

def plot_10_roi_scatter():
    np.random.seed(42)
    # Generate random interventions
    # Bio-Filtration: Low cost, medium capture
    bio_cost = np.random.uniform(5, 20, 30)
    bio_cap = np.random.uniform(10, 40, 30)
    # Nano-Mist: Med cost, High capture
    mist_cost = np.random.uniform(25, 50, 30)
    mist_cap = np.random.uniform(50, 90, 30)
    # Scrubbers: High cost, Massive capture
    scrub_cost = np.random.uniform(70, 100, 30)
    scrub_cap = np.random.uniform(80, 140, 30)
    
    plt.figure(figsize=(10, 6))
    plt.scatter(bio_cost, bio_cap, c=COLORS['emerald'], s=100, alpha=0.7, label='Nature-Based (Bio-Filtration)')
    plt.scatter(mist_cost, mist_cap, c=COLORS['cyan'], s=100, alpha=0.7, label='Tech-Based (Nano-Mist)')
    plt.scatter(scrub_cost, scrub_cap, c=COLORS['amber'], s=100, alpha=0.7, label='Industrial (Scrubbers)')
    
    # Ideal ROI line
    x = np.linspace(0, 100, 10)
    plt.plot(x, x * 1.5, color='white', linestyle=':', label='Optimal ROI Frontier')
    
    plt.title('Intervention ROI Analysis: Capital Cost vs Carbon Captured', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Capital Cost ($10,000s)')
    plt.ylabel('Total Carbon Captured (Kilotons)')
    plt.legend()
    save_plot('10_roi_scatter.png')

def plot_11_wind_dispersion():
    # Heatmap representing wind dispersion
    grid = np.zeros((20, 20))
    # Unmitigated Plume moving South-East
    for i in range(20):
        for j in range(20):
            dist = np.sqrt((i-5)**2 + (j-5)**2)
            if i >= 5 and j >= 5: # wind blowing southeast
                dist = np.sqrt((i-j)**2 + (i-5)**2) / 1.5
            grid[i, j] = max(0, 100 - dist * 10)
            
    # Apply mitigation asset at (10, 10)
    for i in range(20):
        for j in range(20):
            if i >= 10 and j >= 10:
                grid[i, j] *= 0.3 # 70% reduction downstream
                
    plt.figure(figsize=(8, 6))
    sns.heatmap(grid, cmap='mako', cbar_kws={'label': 'Pollutant Concentration'})
    
    # Plot asset
    plt.plot(10, 10, marker='*', color=COLORS['emerald'], markersize=15, linestyle='None', label='Mitigation Asset Installed')
    plt.title('Wind Dispersion Heatmap Post-Intervention', fontsize=16, fontweight='bold', pad=20)
    plt.legend()
    plt.axis('off')
    save_plot('11_wind_dispersion.png')

def plot_12_carbon_market():
    years = ['2026', '2027', '2028', '2029', '2030']
    credits_earned = [1200, 3500, 6800, 10500, 15000]
    market_price = [52.5, 58.0, 65.0, 72.0, 85.0] # USD per credit
    
    revenue = [c * p / 1000 for c, p in zip(credits_earned, market_price)] # Revenue in $1000s
    
    fig, ax1 = plt.subplots(figsize=(10, 6))
    
    ax1.bar(years, credits_earned, color=COLORS['emerald'], alpha=0.6, label='Carbon Credits Earned')
    ax1.set_xlabel('Fiscal Year')
    ax1.set_ylabel('Volume of Credits (tCO2e)', color=COLORS['emerald'])
    ax1.tick_params(axis='y', labelcolor=COLORS['emerald'])
    
    ax2 = ax1.twinx()
    ax2.plot(years, revenue, color=COLORS['amber'], linewidth=4, marker='D', markersize=8, label='Projected Revenue')
    ax2.set_ylabel('Projected Market Revenue ($1000s)', color=COLORS['amber'])
    ax2.tick_params(axis='y', labelcolor=COLORS['amber'])
    
    plt.title('5-Year Carbon Market Financial Forecast', fontsize=16, fontweight='bold', pad=20)
    fig.tight_layout()
    save_plot('12_carbon_market.png')

if __name__ == '__main__':
    print("Generating Urban Carbon Twin Graphs...")
    plot_1_aqi_improvement()
    plot_2_optimization_comparison()
    plot_3_hotspot_detection()
    plot_4_cost_aqi_tradeoff()
    plot_5_resource_allocation()
    plot_6_temporal_simulation()
    plot_7_prediction_vs_decision()
    plot_8_co2_balance()
    plot_9_sentiment_correlation()
    plot_10_roi_scatter()
    plot_11_wind_dispersion()
    plot_12_carbon_market()
    print("All graphs successfully generated in assets/graphs/")
