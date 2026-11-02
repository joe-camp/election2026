/**
 * US Senate 119th Congress & November 2026 Election Dataset
 * Includes all 50 states, 100 Senators, and all 35 Contested Senate Seats in November 2026:
 * - 33 Regular Class II Seats
 * - 2 High-Profile Special Elections: Ohio (JD Vance vacancy) & Florida (Marco Rubio vacancy)
 */

const SENATE_SUMMARY = {
  totalSeats: 100,
  republicans: 53,
  democrats: 45,
  independents: 2,
  coalitionDemocrats: 47, // 45 Democrats + 2 Independents who caucus with Democrats
  majorityThreshold: 51,
  majorityParty: "Republican",
  majorityLead: 2, // 53 - 51
  leadership: {
    majorityLeader: { name: "John Thune", state: "SD", party: "Republican", title: "Senate Majority Leader" },
    minorityLeader: { name: "Chuck Schumer", state: "NY", party: "Democrat", title: "Senate Minority Leader" }
  },
  seatsUpIn2026: 35, // 33 Class II regular + 2 Special Elections (OH & FL)
  regularClass2Seats: 33,
  specialElections: 2,
  delegationBreakdown: {
    bothRepublican: 25,
    bothDemocratic: 21,
    splitRepDem: 2, // PA, WI
    splitRepInd: 1, // ME
    demAndInd: 1    // VT
  }
};

// Baseline seats NOT up for election in 2026 (Safe baseline going into 2026)
const SIMULATION_BASELINE = {
  safeRepublicans: 31, // 53 total - 22 contested GOP seats (20 Class II + OH special + FL special)
  safeDemCoalition: 34, // 47 total - 13 contested Dem seats (32 Democrats + 2 Independents)
  contestedSeats: 35,  // 22 Republican defended + 13 Democratic defended
  gopDefended: 22,
  demDefended: 13
};

// Complete metadata for all 35 Senate seats up in November 2026
const CONTESTS_2026 = {
  "OH": {
    stateCode: "OH",
    stateName: "Ohio",
    isSpecialElection: true,
    specialElectionTerm: "Remainder of term ending Jan 2029",
    incumbent: "Jon Husted",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    opponent: "Sherrod Brown",
    opponentParty: "Democrat",
    rating: "Tilt D",
    competitiveness: "Marquee Battleground",
    priority: 1,
    otherSenator: { name: "Bernie Moreno", party: "Republican" },
    notes: "Inside Elections rates the Ohio special election as Tilt Democrat with Sherrod Brown challenging Jon Husted."
  },
  "GA": {
    stateCode: "GA",
    stateName: "Georgia",
    isSpecialElection: false,
    incumbent: "Jon Ossoff",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Likely D",
    competitiveness: "Top Battleground",
    priority: 2,
    otherSenator: { name: "Raphael Warnock", party: "Democrat" },
    notes: "Inside Elections rates Georgia as Likely Democrat for Jon Ossoff."
  },
  "ME": {
    stateCode: "ME",
    stateName: "Maine",
    isSpecialElection: false,
    incumbent: "Susan Collins",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Toss-up",
    competitiveness: "Top Battleground",
    priority: 3,
    otherSenator: { name: "Angus King", party: "Independent", caucus: "Democrat" },
    notes: "Inside Elections rates Maine as Toss-up for Susan Collins."
  },
  "NC": {
    stateCode: "NC",
    stateName: "North Carolina",
    isSpecialElection: false,
    incumbent: "Thom Tillis",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Lean D",
    competitiveness: "Key Battleground",
    priority: 4,
    otherSenator: { name: "Ted Budd", party: "Republican" },
    notes: "Inside Elections rates North Carolina as Lean Democrat, projecting Thom Tillis as vulnerable."
  },
  "MI": {
    stateCode: "MI",
    stateName: "Michigan",
    isSpecialElection: false,
    incumbent: "Gary Peters",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Tilt D",
    competitiveness: "Key Battleground",
    priority: 5,
    otherSenator: { name: "Elissa Slotkin", party: "Democrat" },
    notes: "Inside Elections rates Michigan as Tilt Democrat for Gary Peters."
  },
  "FL": {
    stateCode: "FL",
    stateName: "Florida",
    isSpecialElection: true,
    specialElectionTerm: "Remainder of term ending Jan 2029",
    incumbent: "Ashley Moody",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    opponent: "Angie Nixon",
    opponentParty: "Democrat",
    rating: "Likely R",
    competitiveness: "Competitive Special",
    priority: 6,
    otherSenator: { name: "Rick Scott", party: "Republican" },
    notes: "Inside Elections rates Florida special election as Likely Republican for Ashley Moody."
  },
  "TX": {
    stateCode: "TX",
    stateName: "Texas",
    isSpecialElection: false,
    incumbent: "John Cornyn",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Tilt D",
    competitiveness: "Target Race",
    priority: 7,
    otherSenator: { name: "Ted Cruz", party: "Republican" },
    notes: "Inside Elections rates Texas as Tilt Democrat, projecting John Cornyn as vulnerable to a flip."
  },
  "IA": {
    stateCode: "IA",
    stateName: "Iowa",
    isSpecialElection: false,
    incumbent: "Joni Ernst",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Toss-up",
    competitiveness: "Target Race",
    priority: 8,
    otherSenator: { name: "Chuck Grassley", party: "Republican" },
    notes: "Inside Elections rates Iowa as Toss-up for Joni Ernst."
  },
  "NH": {
    stateCode: "NH",
    stateName: "New Hampshire",
    isSpecialElection: false,
    incumbent: "Jeanne Shaheen",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Tilt D",
    competitiveness: "Competitive",
    priority: 9,
    otherSenator: { name: "Maggie Hassan", party: "Democrat" },
    notes: "Inside Elections rates New Hampshire as Tilt Democrat for Jeanne Shaheen."
  },
  "MN": {
    stateCode: "MN",
    stateName: "Minnesota",
    isSpecialElection: false,
    incumbent: "Tina Smith",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Lean D",
    competitiveness: "Competitive",
    priority: 10,
    otherSenator: { name: "Amy Klobuchar", party: "Democrat" },
    notes: "Inside Elections rates Minnesota as Lean Democrat for Tina Smith."
  },
  "AK": {
    stateCode: "AK",
    stateName: "Alaska",
    isSpecialElection: false,
    incumbent: "Dan Sullivan",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Toss-up",
    competitiveness: "Competitive",
    priority: 11,
    otherSenator: { name: "Lisa Murkowski", party: "Republican" },
    notes: "Inside Elections rates Alaska as Toss-up for Dan Sullivan."
  },
  "VA": {
    stateCode: "VA",
    stateName: "Virginia",
    isSpecialElection: false,
    incumbent: "Mark Warner",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Competitive",
    priority: 12,
    otherSenator: { name: "Tim Kaine", party: "Democrat" },
    notes: "Inside Elections rates Virginia as Solid Democrat."
  },
  "NM": {
    stateCode: "NM",
    stateName: "New Mexico",
    isSpecialElection: false,
    incumbent: "Ben Ray Luján",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Competitive",
    priority: 13,
    otherSenator: { name: "Martin Heinrich", party: "Democrat" },
    notes: "Inside Elections rates New Mexico as Solid Democrat."
  },
  "CO": {
    stateCode: "CO",
    stateName: "Colorado",
    isSpecialElection: false,
    incumbent: "John Hickenlooper",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Target Race",
    priority: 14,
    otherSenator: { name: "Michael Bennet", party: "Democrat" },
    notes: "Inside Elections rates Colorado as Solid Democrat."
  },
  "MT": {
    stateCode: "MT",
    stateName: "Montana",
    isSpecialElection: false,
    incumbent: "Steve Daines",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 15,
    otherSenator: { name: "Tim Sheehy", party: "Republican" },
    notes: "Inside Elections rates Montana as Solid Republican."
  },
  "KS": {
    stateCode: "KS",
    stateName: "Kansas",
    isSpecialElection: false,
    incumbent: "Roger Marshall",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Toss-up",
    competitiveness: "Safe Incumbent",
    priority: 16,
    otherSenator: { name: "Jerry Moran", party: "Republican" },
    notes: "Inside Elections rates Kansas as Toss-up for Roger Marshall."
  },
  "SC": {
    stateCode: "SC",
    stateName: "South Carolina",
    isSpecialElection: false,
    incumbent: "Lindsey Graham",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Tilt R",
    competitiveness: "Safe Incumbent",
    priority: 17,
    otherSenator: { name: "Tim Scott", party: "Republican" },
    notes: "Inside Elections rates South Carolina as Tilt Republican for Lindsey Graham."
  },
  "KY": {
    stateCode: "KY",
    stateName: "Kentucky",
    isSpecialElection: false,
    incumbent: "Mitch McConnell",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 18,
    otherSenator: { name: "Rand Paul", party: "Republican" },
    notes: "Inside Elections rates Kentucky as Solid Republican."
  },
  "AL": {
    stateCode: "AL",
    stateName: "Alabama",
    isSpecialElection: false,
    incumbent: "Tommy Tuberville",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 19,
    otherSenator: { name: "Katie Britt", party: "Republican" },
    notes: "Inside Elections rates Alabama as Solid Republican."
  },
  "AR": {
    stateCode: "AR",
    stateName: "Arkansas",
    isSpecialElection: false,
    incumbent: "Tom Cotton",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 20,
    otherSenator: { name: "John Boozman", party: "Republican" },
    notes: "Inside Elections rates Arkansas as Solid Republican."
  },
  "ID": {
    stateCode: "ID",
    stateName: "Idaho",
    isSpecialElection: false,
    incumbent: "Jim Risch",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 21,
    otherSenator: { name: "Mike Crapo", party: "Republican" },
    notes: "Inside Elections rates Idaho as Solid Republican."
  },
  "IL": {
    stateCode: "IL",
    stateName: "Illinois",
    isSpecialElection: false,
    incumbent: "Dick Durbin",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Safe Incumbent",
    priority: 22,
    otherSenator: { name: "Tammy Duckworth", party: "Democrat" },
    notes: "Inside Elections rates Illinois as Solid Democrat."
  },
  "LA": {
    stateCode: "LA",
    stateName: "Louisiana",
    isSpecialElection: false,
    incumbent: "Bill Cassidy",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Likely R",
    competitiveness: "Safe Incumbent",
    priority: 23,
    otherSenator: { name: "John Kennedy", party: "Republican" },
    notes: "Inside Elections rates Louisiana as Likely Republican for Bill Cassidy."
  },
  "MA": {
    stateCode: "MA",
    stateName: "Massachusetts",
    isSpecialElection: false,
    incumbent: "Ed Markey",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Safe Incumbent",
    priority: 24,
    otherSenator: { name: "Elizabeth Warren", party: "Democrat" },
    notes: "Inside Elections rates Massachusetts as Solid Democrat."
  },
  "MS": {
    stateCode: "MS",
    stateName: "Mississippi",
    isSpecialElection: false,
    incumbent: "Cindy Hyde-Smith",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Likely R",
    competitiveness: "Safe Incumbent",
    priority: 25,
    otherSenator: { name: "Roger Wicker", party: "Republican" },
    notes: "Inside Elections rates Mississippi as Likely Republican for Cindy Hyde-Smith."
  },
  "NE": {
    stateCode: "NE",
    stateName: "Nebraska",
    isSpecialElection: false,
    incumbent: "Pete Ricketts",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Tilt R",
    competitiveness: "Safe Incumbent",
    priority: 26,
    otherSenator: { name: "Deb Fischer", party: "Republican" },
    notes: "Inside Elections rates Nebraska as Tilt Republican for Pete Ricketts."
  },
  "NJ": {
    stateCode: "NJ",
    stateName: "New Jersey",
    isSpecialElection: false,
    incumbent: "Cory Booker",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Safe Incumbent",
    priority: 27,
    otherSenator: { name: "Andy Kim", party: "Democrat" },
    notes: "Inside Elections rates New Jersey as Solid Democrat."
  },
  "OK": {
    stateCode: "OK",
    stateName: "Oklahoma",
    isSpecialElection: false,
    incumbent: "Markwayne Mullin",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 28,
    otherSenator: { name: "James Lankford", party: "Republican" },
    notes: "Inside Elections rates Oklahoma as Solid Republican."
  },
  "OR": {
    stateCode: "OR",
    stateName: "Oregon",
    isSpecialElection: false,
    incumbent: "Jeff Merkley",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Safe Incumbent",
    priority: 29,
    otherSenator: { name: "Ron Wyden", party: "Democrat" },
    notes: "Inside Elections rates Oregon as Solid Democrat."
  },
  "RI": {
    stateCode: "RI",
    stateName: "Rhode Island",
    isSpecialElection: false,
    incumbent: "Jack Reed",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Safe Incumbent",
    priority: 30,
    otherSenator: { name: "Sheldon Whitehouse", party: "Democrat" },
    notes: "Inside Elections rates Rhode Island as Solid Democrat."
  },
  "SD": {
    stateCode: "SD",
    stateName: "South Dakota",
    isSpecialElection: false,
    incumbent: "Mike Rounds",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 31,
    otherSenator: { name: "John Thune", party: "Republican" },
    notes: "Inside Elections rates South Dakota as Solid Republican."
  },
  "TN": {
    stateCode: "TN",
    stateName: "Tennessee",
    isSpecialElection: false,
    incumbent: "Bill Hagerty",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 32,
    otherSenator: { name: "Marsha Blackburn", party: "Republican" },
    notes: "Inside Elections rates Tennessee as Solid Republican."
  },
  "WV": {
    stateCode: "WV",
    stateName: "West Virginia",
    isSpecialElection: false,
    incumbent: "Shelley Moore Capito",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 33,
    otherSenator: { name: "Jim Justice", party: "Republican" },
    notes: "Inside Elections rates West Virginia as Solid Republican."
  },
  "WY": {
    stateCode: "WY",
    stateName: "Wyoming",
    isSpecialElection: false,
    incumbent: "Cynthia Lummis",
    incumbentParty: "Republican",
    baselineParty: "Republican",
    rating: "Solid R",
    competitiveness: "Safe Incumbent",
    priority: 34,
    otherSenator: { name: "John Barrasso", party: "Republican" },
    notes: "Inside Elections rates Wyoming as Solid Republican."
  },
  "DE": {
    stateCode: "DE",
    stateName: "Delaware",
    isSpecialElection: false,
    incumbent: "Chris Coons",
    incumbentParty: "Democrat",
    baselineParty: "Democrat",
    rating: "Solid D",
    competitiveness: "Safe Incumbent",
    priority: 35,
    otherSenator: { name: "Lisa Blunt Rochester", party: "Democrat" },
    notes: "Inside Elections rates Delaware as Solid Democrat."
  }
};

// Preset Scenarios for quick 1-click simulation
const PRESET_SCENARIOS = {
  user_prediction: {
    id: "user_prediction",
    name: "User Prediction",
    badge: "52 D – 48 R",
    description: "Democrats flip Alaska (Sullivan), Texas (Cornyn), Ohio (Husted), North Carolina (Tillis), and Maine (Collins) to win a 52-seat Senate Majority (+5 net gain).",
    outcomes: (() => {
      const o = Object.keys(CONTESTS_2026).reduce((acc, code) => {
        acc[code] = CONTESTS_2026[code].baselineParty;
        return acc;
      }, {});
      o["AK"] = "Democrat";
      o["TX"] = "Democrat";
      o["OH"] = "Democrat";
      o["NC"] = "Democrat";
      o["ME"] = "Democrat";
      return o;
    })()
  },
  baseline: {
    id: "baseline",
    name: "2025 Baseline",
    badge: "53 R – 47 D",
    description: "All 35 incumbents hold their seats, including Jon Husted in Ohio and Ashley Moody in Florida.",
    outcomes: Object.keys(CONTESTS_2026).reduce((acc, code) => {
      acc[code] = CONTESTS_2026[code].baselineParty;
      return acc;
    }, {})
  },
  dem_flip_51: {
    id: "dem_flip_51",
    name: "Democratic Flip (51 Maj)",
    badge: "51 D – 49 R",
    description: "Sherrod Brown flips Ohio (OH), and Democrats flip Maine (ME), North Carolina (NC), and Texas (TX) while holding Georgia & Michigan to capture the Senate majority.",
    outcomes: (() => {
      const o = Object.keys(CONTESTS_2026).reduce((acc, code) => {
        acc[code] = CONTESTS_2026[code].baselineParty;
        return acc;
      }, {});
      o["OH"] = "Democrat"; // Sherrod Brown win
      o["ME"] = "Democrat"; // Collins seat flip
      o["NC"] = "Democrat"; // Tillis seat flip
      o["TX"] = "Democrat"; // Cornyn seat flip
      return o;
    })()
  },
  gop_expansion_55: {
    id: "gop_expansion_55",
    name: "GOP Wave (55 Maj)",
    badge: "55 R – 45 D",
    description: "Republicans hold Ohio, Florida, Maine, and all 22 defended seats, and flip battlegrounds Georgia and Michigan to expand their majority to 55.",
    outcomes: (() => {
      const o = Object.keys(CONTESTS_2026).reduce((acc, code) => {
        acc[code] = CONTESTS_2026[code].baselineParty;
        return acc;
      }, {});
      o["GA"] = "Republican";
      o["MI"] = "Republican";
      return o;
    })()
  },
  tie_50_50: {
    id: "tie_50_50",
    name: "50-50 Tie Battleground",
    badge: "50 R – 50 D",
    description: "Democrats flip Ohio (Sherrod Brown), Maine (Susan Collins), and North Carolina (Thom Tillis), producing a historic 50-50 tie.",
    outcomes: (() => {
      const o = Object.keys(CONTESTS_2026).reduce((acc, code) => {
        acc[code] = CONTESTS_2026[code].baselineParty;
        return acc;
      }, {});
      o["OH"] = "Democrat";
      o["ME"] = "Democrat";
      o["NC"] = "Democrat";
      return o;
    })()
  },
  all_tossup: {
    id: "all_tossup",
    name: "All 35 Contests Tossup",
    badge: "35 Tossups",
    description: "Sets all 35 seats up for grabs to Tossup/Uncalled. Safe baseline: 31 Republicans, 34 Democratic Coalition.",
    outcomes: Object.keys(CONTESTS_2026).reduce((acc, code) => {
      acc[code] = "Tossup";
      return acc;
    }, {})
  }
};

// All 50 states full dataset for reference & inspection
const SENATE_DATA = {
  "AL": {
    name: "Alabama",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Tommy Tuberville", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2021, bio: "Former college football coach serving as Senior Senator." },
      { name: "Katie Britt", party: "Republican", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2023, bio: "First woman elected to the U.S. Senate from Alabama." }
    ]
  },
  "AK": {
    name: "Alaska",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Lisa Murkowski", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2002, bio: "Senior Senator from Alaska and key bipartisan dealmaker." },
      { name: "Dan Sullivan", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2015, bio: "Junior Senator and U.S. Marine Corps Reserve colonel." }
    ]
  },
  "AZ": {
    name: "Arizona",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Mark Kelly", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2020, bio: "Former NASA astronaut and U.S. Navy combat pilot." },
      { name: "Ruben Gallego", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; Iraq War veteran and former U.S. Representative." }
    ]
  },
  "AR": {
    name: "Arkansas",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "John Boozman", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2011, bio: "Senior Senator and ranking leader on agriculture and defense." },
      { name: "Tom Cotton", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2015, bio: "U.S. Army veteran and member of the Senate Republican leadership." }
    ]
  },
  "CA": {
    name: "California",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Alex Padilla", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2021, bio: "First Latino Senator representing California." },
      { name: "Adam Schiff", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; former House Intelligence Committee Chairman." }
    ]
  },
  "CO": {
    name: "Colorado",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Michael Bennet", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2009, bio: "Senior Senator focusing on conservation, education, and finance." },
      { name: "John Hickenlooper", party: "Democrat", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2021, bio: "Former Governor of Colorado and geologist/entrepreneur." }
    ]
  },
  "CT": {
    name: "Connecticut",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Richard Blumenthal", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2011, bio: "Former state Attorney General focusing on consumer protection and judiciary." },
      { name: "Chris Murphy", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2013, bio: "Leading advocate for gun safety legislation and foreign policy." }
    ]
  },
  "DE": {
    name: "Delaware",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Chris Coons", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2010, bio: "Senior Senator and member of Foreign Relations and Judiciary." },
      { name: "Lisa Blunt Rochester", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; first Black woman Senator from Delaware." }
    ]
  },
  "FL": {
    name: "Florida",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Rick Scott", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2019, bio: "Former Florida Governor and businessman; re-elected in 2024." },
      { name: "Ashley Moody", party: "Republican", class: 3, nextElection: 2026, seniority: "Junior", assumedOffice: 2025, role: "2026 Special Election Candidate", note: "Appointed to fill vacant Rubio seat; contested in Nov 2026 special election", bio: "Former Florida Attorney General appointed to U.S. Senate; running in 2026 special election." }
    ]
  },
  "GA": {
    name: "Georgia",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Jon Ossoff", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2021, bio: "Investigative journalist and leading Democratic battleground defender." },
      { name: "Raphael Warnock", party: "Democrat", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2021, bio: "Senior Pastor of Ebenezer Baptist Church in Atlanta." }
    ]
  },
  "HI": {
    name: "Hawaii",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Brian Schatz", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2012, bio: "Senior Senator and leader on clean energy and appropriations." },
      { name: "Mazie Hirono", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2013, bio: "First Asian American woman elected to the U.S. Senate." }
    ]
  },
  "ID": {
    name: "Idaho",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Mike Crapo", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 1999, bio: "Senior Senator and ranking member of the Senate Finance Committee." },
      { name: "Jim Risch", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2009, bio: "Leading voice on foreign relations and national security." }
    ]
  },
  "IL": {
    name: "Illinois",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Dick Durbin", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 1997, role: "Senate Democratic Whip", bio: "Long-serving Democratic Whip and former Judiciary Committee Chairman." },
      { name: "Tammy Duckworth", party: "Democrat", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2017, bio: "Combat veteran, Purple Heart recipient, and former Assistant VA Secretary." }
    ]
  },
  "IN": {
    name: "Indiana",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: false,
    senators: [
      { name: "Todd Young", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2017, bio: "Former U.S. Marine intelligence officer and CHIPS Act architect." },
      { name: "Jim Banks", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; U.S. Navy Reserve veteran and conservative leader." }
    ]
  },
  "IA": {
    name: "Iowa",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Chuck Grassley", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 1981, bio: "Longest-serving Republican Senator in U.S. history." },
      { name: "Joni Ernst", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2015, bio: "First female combat veteran elected to the U.S. Senate." }
    ]
  },
  "KS": {
    name: "Kansas",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Jerry Moran", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2011, bio: "Senior Senator advocating for veterans affairs and agriculture." },
      { name: "Roger Marshall", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2021, bio: "Physician and former U.S. Representative." }
    ]
  },
  "KY": {
    name: "Kentucky",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Mitch McConnell", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 1985, bio: "Longest-serving Senate party leader in American history." },
      { name: "Rand Paul", party: "Republican", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2011, bio: "Physician and prominent libertarian-conservative voice." }
    ]
  },
  "LA": {
    name: "Louisiana",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Bill Cassidy", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2015, bio: "Gastroenterologist and ranking member on HELP committee." },
      { name: "John Kennedy", party: "Republican", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2017, bio: "Former state Treasurer known for sharp committee hearings." }
    ]
  },
  "ME": {
    name: "Maine",
    status: "split_rep_ind",
    delegationLabel: "Split: 1 Republican, 1 Independent (caucuses D)",
    hasRace2026: true,
    senators: [
      { name: "Susan Collins", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 1997, bio: "Leading moderate Republican and key Appropriations Committee leader." },
      { name: "Angus King", party: "Independent", caucus: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2013, bio: "Former Maine Governor; independent caucusing with Democrats." }
    ]
  },
  "MD": {
    name: "Maryland",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Chris Van Hollen", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2017, bio: "Leader on appropriations, federal workforce, and foreign relations." },
      { name: "Angela Alsobrooks", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; first Black Senator from Maryland." }
    ]
  },
  "MA": {
    name: "Massachusetts",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Elizabeth Warren", party: "Democrat", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2013, bio: "Former Harvard Law professor and consumer finance champion." },
      { name: "Ed Markey", party: "Democrat", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2013, bio: "Co-author of the Green New Deal and climate policy leader." }
    ]
  },
  "MI": {
    name: "Michigan",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Gary Peters", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2015, bio: "U.S. Navy Reserve veteran and Homeland Security Committee leader." },
      { name: "Elissa Slotkin", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; former CIA analyst and Department of Defense official." }
    ]
  },
  "MN": {
    name: "Minnesota",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Amy Klobuchar", party: "Democrat", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2007, bio: "Senior Senator and Rules Committee leader; re-elected in 2024." },
      { name: "Tina Smith", party: "Democrat", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2018, bio: "Former Lieutenant Governor focused on healthcare and agriculture." }
    ]
  },
  "MS": {
    name: "Mississippi",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Roger Wicker", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2007, bio: "Armed Services Committee leader; U.S. Air Force veteran." },
      { name: "Cindy Hyde-Smith", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2018, bio: "First woman to represent Mississippi in the U.S. Congress." }
    ]
  },
  "MO": {
    name: "Missouri",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: false,
    senators: [
      { name: "Josh Hawley", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2019, bio: "Former state Attorney General; re-elected in 2024." },
      { name: "Eric Schmitt", party: "Republican", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2023, bio: "Former Missouri Attorney General and state Treasurer." }
    ]
  },
  "MT": {
    name: "Montana",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Steve Daines", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2015, bio: "Former NRSC chair and private sector technology executive." },
      { name: "Tim Sheehy", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; former Navy SEAL and aerial firefighting entrepreneur." }
    ]
  },
  "NE": {
    name: "Nebraska",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Deb Fischer", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2013, bio: "Senior Senator; rancher and leader on Armed Services; re-elected in 2024." },
      { name: "Pete Ricketts", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2023, bio: "Former Nebraska Governor; won 2024 special election to finish term." }
    ]
  },
  "NV": {
    name: "Nevada",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Catherine Cortez Masto", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2017, bio: "First Latina elected to the United States Senate." },
      { name: "Jacky Rosen", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2019, bio: "Former computer programmer and synagogue president; re-elected in 2024." }
    ]
  },
  "NH": {
    name: "New Hampshire",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Jeanne Shaheen", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2009, bio: "First woman in U.S. history elected as both Governor and U.S. Senator." },
      { name: "Maggie Hassan", party: "Democrat", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2017, bio: "Former Governor of New Hampshire and leader on bipartisan infrastructure." }
    ]
  },
  "NJ": {
    name: "New Jersey",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Cory Booker", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2013, bio: "Former Mayor of Newark; Judiciary and Foreign Relations leader." },
      { name: "Andy Kim", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; first Korean American elected to the U.S. Senate." }
    ]
  },
  "NM": {
    name: "New Mexico",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Martin Heinrich", party: "Democrat", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2013, bio: "Mechanical engineer and energy/natural resources leader; re-elected in 2024." },
      { name: "Ben Ray Luján", party: "Democrat", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2021, bio: "Former House Assistant Speaker and champion for broadband access." }
    ]
  },
  "NY": {
    name: "New York",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Chuck Schumer", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 1999, role: "Senate Minority Leader", bio: "Senate Minority Leader and long-time champion for New York." },
      { name: "Kirsten Gillibrand", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2009, bio: "Leader on military justice reform and paid family leave; re-elected in 2024." }
    ]
  },
  "NC": {
    name: "North Carolina",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Thom Tillis", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2015, bio: "Senior Senator and key negotiator on bipartisan compromises." },
      { name: "Ted Budd", party: "Republican", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2023, bio: "Small business owner and former U.S. Representative." }
    ]
  },
  "ND": {
    name: "North Dakota",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: false,
    senators: [
      { name: "John Hoeven", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2011, bio: "Former North Dakota Governor and energy policy leader." },
      { name: "Kevin Cramer", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2019, bio: "Former Public Service Commissioner; re-elected in 2024." }
    ]
  },
  "OH": {
    name: "Ohio",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Bernie Moreno", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2025, bio: "Elected in 2024; entrepreneur and technology executive." },
      { name: "Jon Husted", party: "Republican", class: 3, nextElection: 2026, seniority: "Junior", assumedOffice: 2025, role: "2026 Special Election Candidate", note: "Appointed to fill Vance seat; running in Nov 2026 special election against Sherrod Brown", bio: "Former Ohio Lieutenant Governor and Secretary of State running in 2026 special election." }
    ]
  },
  "OK": {
    name: "Oklahoma",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "James Lankford", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2015, bio: "Senior Senator and leader on ethics and intelligence." },
      { name: "Markwayne Mullin", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2023, bio: "Former MMA fighter, plumber, and enrolled member of the Cherokee Nation." }
    ]
  },
  "OR": {
    name: "Oregon",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Ron Wyden", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 1996, bio: "Chairman/Ranking Member of Senate Finance; privacy advocate." },
      { name: "Jeff Merkley", party: "Democrat", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2009, bio: "Advocate for housing affordability and senate filibuster reform." }
    ]
  },
  "PA": {
    name: "Pennsylvania",
    status: "split_rep_dem",
    delegationLabel: "Split: 1 Democrat, 1 Republican",
    hasRace2026: false,
    senators: [
      { name: "John Fetterman", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2023, bio: "Former Pennsylvania Lieutenant Governor and Mayor of Braddock." },
      { name: "Dave McCormick", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; Army combat veteran (Bronze Star) and business leader." }
    ]
  },
  "RI": {
    name: "Rhode Island",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Jack Reed", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 1997, bio: "West Point graduate, Army Ranger, and leader on Armed Services." },
      { name: "Sheldon Whitehouse", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2007, bio: "Leader on Budget, Judiciary, and judicial ethics; re-elected in 2024." }
    ]
  },
  "SC": {
    name: "South Carolina",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Lindsey Graham", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2003, bio: "Senior Senator and former Senate Judiciary Committee Chairman." },
      { name: "Tim Scott", party: "Republican", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2013, bio: "Leader on Senate Banking Committee and opportunity zone pioneer." }
    ]
  },
  "SD": {
    name: "South Dakota",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "John Thune", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2005, role: "Senate Majority Leader", bio: "Senate Majority Leader for the 119th Congress." },
      { name: "Mike Rounds", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2015, bio: "Former South Dakota Governor and cybersecurity subcommittee leader." }
    ]
  },
  "TN": {
    name: "Tennessee",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Marsha Blackburn", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2019, bio: "First woman to represent Tennessee in the U.S. Senate; re-elected in 2024." },
      { name: "Bill Hagerty", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2021, bio: "Former U.S. Ambassador to Japan and private equity executive." }
    ]
  },
  "TX": {
    name: "Texas",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "John Cornyn", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2002, bio: "Senior Senator, former Texas Attorney General, and former GOP Whip." },
      { name: "Ted Cruz", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2013, bio: "Former Texas Solicitor General; Commerce Committee leader; re-elected in 2024." }
    ]
  },
  "UT": {
    name: "Utah",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: false,
    senators: [
      { name: "Mike Lee", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2011, bio: "Constitutional lawyer and leader on Judiciary and Energy committees." },
      { name: "John Curtis", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; former Mayor of Provo and founder of Conservative Climate Caucus." }
    ]
  },
  "VT": {
    name: "Vermont",
    status: "dem_and_ind",
    delegationLabel: "Democratic Coalition: 1 Democrat, 1 Independent (caucuses D)",
    hasRace2026: false,
    senators: [
      { name: "Bernie Sanders", party: "Independent", caucus: "Democrat", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2007, bio: "Longest-serving independent in congressional history; HELP committee leader." },
      { name: "Peter Welch", party: "Democrat", class: 3, nextElection: 2028, seniority: "Junior", assumedOffice: 2023, bio: "Former U.S. Representative and Vermont state senate president pro tempore." }
    ]
  },
  "VA": {
    name: "Virginia",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: true,
    senators: [
      { name: "Mark Warner", party: "Democrat", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2009, bio: "Former Virginia Governor and Chairman of Senate Intelligence Committee." },
      { name: "Tim Kaine", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2013, bio: "Former Virginia Governor and 2016 VP nominee; re-elected in 2024." }
    ]
  },
  "WA": {
    name: "Washington",
    status: "both_dem",
    delegationLabel: "Solid Democratic (2 D)",
    hasRace2026: false,
    senators: [
      { name: "Patty Murray", party: "Democrat", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 1993, bio: "Dean of Senate women, former President Pro Tempore, and Appropriations leader." },
      { name: "Maria Cantwell", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2001, bio: "Commerce, Science, and Transportation Committee leader; re-elected in 2024." }
    ]
  },
  "WV": {
    name: "West Virginia",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "Shelley Moore Capito", party: "Republican", class: 2, nextElection: 2026, seniority: "Senior", assumedOffice: 2015, bio: "EPW Committee leader and first female Senator from West Virginia." },
      { name: "Jim Justice", party: "Republican", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2025, bio: "Elected in 2024; two-term Governor of West Virginia and businessman." }
    ]
  },
  "WI": {
    name: "Wisconsin",
    status: "split_rep_dem",
    delegationLabel: "Split: 1 Democrat, 1 Republican",
    hasRace2026: false,
    senators: [
      { name: "Ron Johnson", party: "Republican", class: 3, nextElection: 2028, seniority: "Senior", assumedOffice: 2011, bio: "Plastics manufacturer and conservative leader on Homeland Security." },
      { name: "Tammy Baldwin", party: "Democrat", class: 1, nextElection: 2030, seniority: "Junior", assumedOffice: 2013, bio: "First openly LGBTQ+ person elected to the U.S. Senate; re-elected in 2024." }
    ]
  },
  "WY": {
    name: "Wyoming",
    status: "both_rep",
    delegationLabel: "Solid Republican (2 R)",
    hasRace2026: true,
    senators: [
      { name: "John Barrasso", party: "Republican", class: 1, nextElection: 2030, seniority: "Senior", assumedOffice: 2007, role: "Senate Republican Whip", bio: "Orthopedic surgeon and Senate Republican Whip; re-elected in 2024." },
      { name: "Cynthia Lummis", party: "Republican", class: 2, nextElection: 2026, seniority: "Junior", assumedOffice: 2021, bio: "Former state Treasurer, rancher, and advocate for financial technology." }
    ]
  }
};
