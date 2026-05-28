export type RiskLevel = 'None' | 'Low' | 'Moderate' | 'High';

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

export enum DemandLevel {
  LOW = 'Low / Declining',
  MODERATE = 'Moderate / Stable',
  HIGH = 'High / Rising',
  RISING = 'Rising rapidly'
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

export enum SeasonalityType {
  YEAR_ROUND = 'Year-Round',
  SEASONAL = 'Seasonal',
  TRENDS = 'Trends',
  NEW_TREND = 'New Trend'
}

export enum TrendStatus {
  TRENDING = 'Trending',
  NOT_TRENDING = 'Not Trending'
}

export interface CompetitorData {
  asin: string;
  brand: string;
  avgUnitSales: string;
  clickCount: string;
  clickShare: string;
  conversionShare: string;
  avgSellingPrice: string;
  numberOfReviews: string;
  launchDate: string;
  listingAge: string;
}

export interface TopRelatedKeyword {
  keyword: string;
  searchVolume: string;
  salesMonthly: string;
  competingProducts: string;
  titleDensity: string;
  clickShare: string;
  conversionShare: string;
}

export interface KeywordReport {
  reportNumber: string;
  keyword: string;
  category: string;
  subCategory: string;
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
  productImageUrl2: string;
  keepaImageUrl: string;
  keepaNotes: string;
  helium10ImageUrl: string;
  helium10Notes: string;
  searchVolumeImageUrl: string;
  searchVolumeNotes: string;
  xrayProductResearchImageUrl: string;
  xrayProductResearchNotes: string;
  // Market Analysis Proof fields
  amazonSearchDataImageUrl: string;
  amazonSearchDataNotes: string;
  amazonInsightsTrendsImageUrl: string;
  amazonInsightsTrendsNotes: string;
  amazonSearchNicheImageUrl: string;
  amazonSearchNicheNotes: string;
  amazonTopClickedProductsImageUrl: string;
  amazonTopClickedProductsNotes: string;
  amazonReturnsInsightsImageUrl: string;
  amazonReturnsInsightsNotes: string;
  othersImageUrl: string;
  othersNotes: string;
  // Executive Dashboard specific fields
  demandLevel: DemandLevel;
  netProfitMargin: number;
  monthlyRevenue: number;
  totalRevenue: number;
  estimatedMonthlyRevenueTop10Avg: number;
  totalActiveListing: number;
  activeSellersPage1: number;
  insight: string;
  // Market Intelligence & Keywords specific fields
  mainKeyword: string;
  sellerType: string;
  marketReach: string;
  marketShare: number;
  avgBSR: number;
  avgMonthlySalesTop10: number;
  // Market Behavior & Efficiency specific fields
  // Market Behavior & Efficiency
  marketSize: string;
  demandGrowthRate: string;
  seasonalityPattern: SeasonalityType;
  seasonalityPeak1: string;
  seasonalityPeak2: string;
  seasonalityPeakVolume: string;
  seasonalityOffPeak1: string;
  seasonalityOffPeak2: string;
  seasonalityOffPeakVolume: string;
  conversionRate: string;
  avgOutOfStock: string;
  avgListingAge: string;
  competitiveConcentration: string;
  clickShareTop5: string;
  activeBrandsCount: string;
  brandEntriesYoY: string;
  winningFormula: string;
  winningFormulaTechnical: string;
  winningFormulaContent: string;
  winningFormulaComponents: string;
  winningFormulaPrice: string;
  // Competition Analysis specific fields
  averageRating: string;
  sellersUnder75Reviews: string;
  pageResultType: string;
  amazonSellingListing: string;
  amazonDominancy: string;
  opportunityGap: string;
  topCompetitorsList: CompetitorData[];
  topCompetitorsAverage: Partial<CompetitorData>;
  // Keyword Analysis fields
  highIntentBuyerKeywords: string;
  longTailOpportunities: string;
  topRelatedKeywordsList: TopRelatedKeyword[];
  topRelatedKeywordsTotal: Partial<TopRelatedKeyword>;
  // Product Qualification Checklist fields
  isNonSeasonal: boolean;
  isNotFragile: boolean;
  isNotRestricted: boolean;
  isTargetPriceInRange: boolean;
  isReasonableSizeWeight: boolean;
  isLowIPRisk: boolean;
  isClearDifferentiation: boolean;
  isNoCertificationRequired: boolean;
  // Opportunity Indicators fields
  isStrongSearchDemand: boolean;
  isRecentSuccessfulLaunches: boolean;
  isNewSellersTraction: boolean;
  isFragmentedCompetition: boolean;
  isLowReviewBarrier: boolean;
  isWeakCompetitorListings: boolean;
  isQualityComplaintsFound: boolean;
  isOverpricedCompetitors: boolean;
  isClearImprovementOpp: boolean;
  isHealthyPriceRange: boolean;
  // Risk Indicators fields
  riskReviewBarrier: boolean;
  riskBrandPresence: boolean;
  riskMarketSaturation: boolean;
  riskProfitMargins: boolean;
  riskPriceWar: boolean;
  riskManufacturing: boolean;
  riskReturnRate: boolean;
  riskPatentIP: boolean;
  riskCategoryGating: boolean;
  riskCertifications: boolean;
  riskSeasonality: boolean;
  riskPPCCost: boolean;
  // Execution Strategy fields
  execPPCStrategy: string;
  execConversionOpt: string;
  execPositioning: string;
  execEarlyReviews: string;
  execPricingStrategy: string;
  // Review Analysis fields
  keyInsights: string;
  positiveDrivers: string;
  improvementAreas: string;
  marketSignal: string;
  opportunityInsight: string;
  reviewAnalysisPasteText?: string;
  // Niche Analysis fields
  nicheDescription: string;
  nicheKeyInsights: string;
  nicheOpportunitySignal: string;
  nicheAnalysisPasteText?: string;
  // Profitability & Unit Economics fields
  targetSellingPrice: number;
  productCostFactory: number;
  shippingCostSea: number;
  amazonReferralFee: number;
  amazonFbaFees: number;
  ppcCostEstimate: number;
  totalCostPerUnit: number;
  netProfitPerUnit: number;
  netMarginPercentage: number;
  roiPercentage: number;
  initialInvestment: number;
  estimatedUnitsPurchased: number;
  // Dashboard additions
  sellersOver5kRevenue?: string;
  avgReviewCount?: number;
  activeAsinsForListings?: string[];
}

export interface AIAnalysis {
  executiveSummary: string;
  marketOutlook: string;
}
