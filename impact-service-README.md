# Decision Impact Analysis Service

A real-time backend service that analyzes AGORA chat messages and updates six Decision Impact metrics based on keyword analysis and agent credibility.

## Endpoints

### POST /api/chat
Processes a single chat message and updates impact metrics.

**Request Body:**
```json
{
  "agent": "alpha",
  "text": "Implementing renewable energy systems to boost ecological sustainability"
}
```

**Response:**
```json
{
  "success": true,
  "deltas": {
    "ecological": 2.4,
    "wellbeing": 0.1,
    "efficiency": 1.2,
    "resilience": 0.3,
    "equity": 0.0,
    "innovation": 0.8
  },
  "metrics": {
    "ecological": 80.4,
    "wellbeing": 82.1,
    "efficiency": 75.2,
    "resilience": 71.3,
    "equity": 79.0,
    "innovation": 76.8
  },
  "keywords": { ... }
}
```

### GET /api/impact
Server-Sent Events stream that pushes updated metrics whenever they change.

**Response Stream:**
```
data: {"ecological": 80.4, "wellbeing": 82.1, "efficiency": 75.2, "resilience": 71.3, "equity": 79.0, "innovation": 76.8}

data: {"ecological": 81.2, "wellbeing": 82.3, ...}
```

### POST /api/test-impact
Test endpoint that processes sample messages to verify scoring behavior.

## Scoring Rules

### Keywords
Each metric has positive and negative keyword sets with weights (0.5-3.0):

- **Ecological**: rewilding (+3), renewable (+2), pollution (-2.5), deforest (-3)
- **Wellbeing**: health (+2), nutrition (+2), stress (-1.5), disease (-2) 
- **Efficiency**: optimize (+2.5), automate (+2), slow (-1.5), bottleneck (-2)
- **Resilience**: backup (+2), redundancy (+2.5), vulnerable (-2), failure (-2.5)
- **Equity**: fair (+2), inclusive (+2.5), discrimination (-2.5), inequality (-2.5)
- **Innovation**: breakthrough (+2.5), research (+2), outdated (-2), obsolete (-2.5)

### Context Modifiers
- **Amplify** (increase, expand, boost): +30% weight
- **Invert** (reduce, cut, eliminate): flip sign for appropriate context
- **Strong** (phase out, completely, fully): +50% weight

### Agent Credibility Multipliers
Agents get +10-20% boost for relevant metrics:
- **Alpha** (Infrastructure): resilience +20%, efficiency +15%
- **Beta** (Energy): efficiency +20%, ecological +10%
- **Gamma** (Environment): ecological +20%, resilience +10%
- **Delta** (Food): wellbeing +20%, equity +15%
- **Epsilon** (Transport): efficiency +15%, resilience +15%
- **Zeta** (Health): wellbeing +20%
- **Eta** (Education): innovation +20%, equity +15%
- **Theta** (Infrastructure): resilience +20%, efficiency +15%
- **Iota** (Resources): equity +20%, efficiency +15%
- **Kappa** (Culture): equity +15%, ecological +10%

### Smoothing
- Exponential moving average (α = 0.7) for natural ring animations
- Idle drift: 2% movement toward baseline (75) every 10 seconds
- Deltas clamped to [-3, +3] range per message

## Sample Test Messages

1. **Energy optimization**: "Implementing renewable energy grid optimization with solar panel efficiency boost"
   - Expected: ecological ↑↑, efficiency ↑↑

2. **Rewilding project**: "Initiating rewilding project to restore biodiversity and ecosystem health"  
   - Expected: ecological ↑↑↑, wellbeing ↑

3. **Accessibility upgrade**: "Upgrading accessibility features for inclusive community participation"
   - Expected: equity ↑↑, innovation ↑

4. **Diesel phase-out**: "Phase out diesel generators completely, replacing with clean energy systems"
   - Expected: ecological ↑↑↑ (removing pollution + clean replacement)

5. **Organic food expansion**: "Expanding organic food production to improve nutrition and wellbeing"
   - Expected: wellbeing ↑↑, ecological ↑

The service logs each processed message with extracted keywords, metric deltas, and post-update values for debugging and verification.