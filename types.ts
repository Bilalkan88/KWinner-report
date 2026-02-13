
export enum SellerLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum CompetitionLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum RankingDifficulty {
  EASY = 'Easy to Rank',
  MODERATE = 'Moderate Difficulty',
  HARD = 'Hard to Rank'
}

export enum Eligibility {
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'NOT ELIGIBLE',
  REQUIRE_APPROVAL = 'Require Approval',
  REQUIRED_DOCUMENTATION = 'Required Documentation'
}

export enum DemandType {
  SEASONAL = 'Seasonal Demand',
  YEAR_ROUND = 'Year-Round Demand'
}

export enum TrendStatus {
  TRENDING = 'Trending',
  NOT_TRENDING = 'Not Trending'
}

export interface KeywordReport {
  reportNumber: string;
  keyword: string;
  category: string;
  opportunityScore: number;
  monthlySearchVolume: number;
  estimatedMonthlySales: number;
  competitionLevel: CompetitionLevel;
  rankingDifficulty: RankingDifficulty;
  easyToRankDesc: string;
  moderateDifficultyDesc: string;
  hardToRankDesc: string;
  competitorsCount: number;
  reviews: string;
  sellerLevel: SellerLevel;
  exclusiveReason: string;
  exclusiveLogicTags: string[];
  ownershipValue: string;
  ownershipValueTags: string[];
  keyAdvantage: string;
  keyAdvantageTags: string[];
  mainRisk: string;
  mainRiskTags: string[];
  // Financial & Structural metrics
  sellingPrice: number;
  estimatedCostPrice: number;
  estimatedMonthlyProfit: number;
  sellersWithKeywordInTitle: number;
  eligibility: Eligibility;
  demandType: DemandType;
  trendStatus: TrendStatus;
  bsr: number;
  relatedKeywords: string[];
  // Fulfillment metrics
  fbaSellersCount: number | null;
  fbmSellersCount: number | null;
  // Reference Links
  amazonProductUrl: string;
  competitorUrls: string[];
  supplierUrl: string;
  // Visual Evidence (Base64 or URLs)
  productImageUrl: string;
  keepaImageUrl: string;
  keepaNotes: string;
  helium10ImageUrl: string;
  helium10Notes: string;
  searchVolumeImageUrl: string;
  searchVolumeNotes: string;
  // Competitor Analysis
  competitorIssues: string[];
  competitorAnalysis: string;
}

export interface AIAnalysis {
  executiveSummary: string;
  marketOutlook: string;
}
