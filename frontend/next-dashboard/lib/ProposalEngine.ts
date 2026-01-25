export interface Proposal {
    id: string;
    type: 'green_corridor' | 'carbon_scrubber' | 'rooftop_garden' | 'algae_panel';
    title: string;
    description: string;
    impact: string; // e.g. "-12% CO2"
    location: { lat: number, lon: number };
    cost: number;
    confidence: number;
}

// Mocking Vertex AI (Gemini Pro) Logic
export const generateProposals = async (center: { lat: number, lon: number }): Promise<Proposal[]> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Heuristic: Generate proposals scattered around the center
    const proposals: Proposal[] = [
        {
            id: 'p1',
            type: 'green_corridor',
            title: 'Urban Green Corridor A',
            description: 'Proposed vegetation strip to reduce heat island effect.',
            impact: '-4.2% CO2',
            location: { lat: center.lat + 0.002, lon: center.lon - 0.002 },
            cost: 150000,
            confidence: 0.94
        },
        {
            id: 'p2',
            type: 'carbon_scrubber',
            title: 'DAC Module Alpha',
            description: 'Direct Air Capture unit near high-traffic intersection.',
            impact: '-8.5% CO2',
            location: { lat: center.lat - 0.0015, lon: center.lon + 0.001 },
            cost: 320000,
            confidence: 0.88
        },
        {
            id: 'p3',
            type: 'rooftop_garden',
            title: 'Skywalk Gardens',
            description: 'Retrofitting commercial roofs with intensive greenery.',
            impact: '-2.1% CO2',
            location: { lat: center.lat + 0.001, lon: center.lon + 0.0025 },
            cost: 85000,
            confidence: 0.91
        },
        {
            id: 'p4',
            type: 'algae_panel',
            title: 'Bio-Reactive Facade',
            description: 'Algae photo-bioreactors installed on building exterior.',
            impact: '-5.3% CO2',
            location: { lat: center.lat - 0.002, lon: center.lon - 0.001 },
            cost: 210000,
            confidence: 0.85
        }
    ];

    return proposals;
};
