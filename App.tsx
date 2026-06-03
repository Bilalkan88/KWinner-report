
import React, { useState, useEffect } from 'react';
import { KeywordReport, SellerLevel, CompetitionLevel, DemandLevel, SeasonalityType, AIAnalysis, Eligibility, DemandType, TrendStatus, RankingDifficulty, CompetitorData, TopRelatedKeyword } from './types';
import { InputGroup } from './components/InputGroup';
import { ReportPreview } from './components/ReportPreview';
import { ImageDropzone } from './components/ImageDropzone';

const CATEGORIES = [
  "Appliances",
  "Arts, Crafts & Sewing",
  "Automotive Parts & Accessories",
  "Baby",
  "Beauty & Personal Care",
  "Cell Phones & Accessories",
  "Clothing, Shoes & Jewelry",
  "Collectibles & Fine Art",
  "Computers",
  "Electronics",
  "Garden & Outdoor",
  "Grocery & Gourmet Food",
  "Handmade",
  "Health, Household & Baby Care",
  "Home & Kitchen",
  "Industrial & Scientific",
  "Luggage & Travel Gear",
  "Office Products",
  "Patio, Lawn & Garden",
  "Pet Supplies",
  "Software",
  "Sports & Outdoors",
  "Subscribe & Save",
  "Tools & Home Improvement",
  "Toys & Games"
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const RESTRICTED_CATEGORIES = [
  "Automotive Parts & Accessories",
  "Beauty & Personal Care",
  "Clothing, Shoes & Jewelry",
  "Grocery & Gourmet Food",
  "Health, Household & Baby Care",
  "Luggage & Travel Gear",
  "Jewelry",
  "Watches"
];

const MARKETPLACES = [
  'US', 'UK', 'Germany', 'Canada', 'Mexico', 'France', 'Italy', 'Spain', 'UAE'
];

const REPORT_INDEX_KEY = 'KW_LAST_REPORT_INDEX';

const generateReportNumber = (index: number) => {
  const paddedIndex = String(index).padStart(3, '0');
  return `KW-2026-${paddedIndex}`;
};

const calculateListingAge = (dateStr: string): string => {
  if (!dateStr || dateStr.trim() === '') return '';
  const clean = dateStr.trim().replace(/-/g, '/');

  let date: Date | null = null;
  const parts = clean.split('/');

  if (parts.length === 2) {
    // Handle MM/YYYY or M/YY
    let month = parseInt(parts[0]);
    let year = parseInt(parts[1]);
    if (year < 100) year += 2000;
    if (!isNaN(month) && !isNaN(year)) {
      date = new Date(year, month - 1, 1);
    }
  } else if (parts.length === 3) {
    // Handle MM/DD/YYYY or DD/MM/YYYY
    let m = parseInt(parts[0]);
    let d = parseInt(parts[1]);
    let y = parseInt(parts[2]);
    if (y < 100) y += 2000;
    if (!isNaN(m) && !isNaN(d) && !isNaN(y)) {
      date = new Date(y, m - 1, d);
    }
  }

  // Fallback to standard constructor
  if (!date || isNaN(date.getTime())) {
    date = new Date(clean);
  }

  if (isNaN(date.getTime())) return '';
  const today = new Date();
  const months = (today.getFullYear() - date.getFullYear()) * 12 + (today.getMonth() - date.getMonth());
  return months >= 0 ? months.toString() : '0';
};

const INITIAL_REPORT: KeywordReport = {
  reportNumber: '',
  keyword: '',
  category: CATEGORIES[0],
  subCategory: '',
  opportunityScore: 75,
  monthlySearchVolume: 12500,
  estimatedMonthlySales: 450,
  competitionLevel: CompetitionLevel.LOW,
  rankingDifficulty: RankingDifficulty.EASY,
  easyToRankDesc: "Low competition makes it easier to rank organically without heavy ad spend.",
  moderateDifficultyDesc: "Some competition exists, and ranking is achievable with proper optimization and a moderate advertising budget.",
  hardToRankDesc: "Strong competitors dominate the results, requiring significant effort and budget to rank.",
  competitorsCount: 12,
  reviews: '50-150',
  sellerLevel: SellerLevel.BEGINNER,
  // Financial & Structural metrics
  sellingPrice: 24.99,
  estimatedCostPrice: 8.50,
  estimatedMonthlyProfit: 7420,
  sellersWithKeywordInTitle: 4,
  eligibility: Eligibility.ELIGIBLE,
  demandType: DemandType.YEAR_ROUND,
  trendStatus: TrendStatus.NOT_TRENDING,
  bsr: 1500,
  relatedKeywords: [],
  fbaSellersCount: 8,
  fbmSellersCount: 4,
  amazonProductUrl: '',
  competitorUrls: [],
  supplierUrl: '',
  productImageUrl: '',
  productImageUrl2: '',
  keepaImageUrl: '',
  keepaNotes: '',
  helium10ImageUrl: '',
  helium10Notes: '',
  searchVolumeImageUrl: '',
  searchVolumeNotes: '',
  xrayProductResearchImageUrl: '',
  xrayProductResearchNotes: '',
  amazonSearchDataImageUrl: '',
  amazonSearchDataNotes: '',
  amazonInsightsTrendsImageUrl: '',
  amazonInsightsTrendsNotes: '',
  amazonSearchNicheImageUrl: '',
  amazonSearchNicheNotes: '',
  amazonTopClickedProductsImageUrl: '',
  amazonTopClickedProductsNotes: '',
  amazonReturnsInsightsImageUrl: '',
  amazonReturnsInsightsNotes: '',
  othersImageUrl: '',
  othersNotes: '',
  demandLevel: DemandLevel.HIGH,
  netProfitMargin: 25,
  monthlyRevenue: 15000,
  totalRevenue: 250000,
  estimatedMonthlyRevenueTop10Avg: 12000,
  totalActiveListing: 45,
  activeSellersPage1: 18,
  insight: '',
  // Market Intelligence & Keywords specific fields
  mainKeyword: '',
  sellerType: 'Private Label',
  marketReach: 'US',
  marketShare: 15,
  avgBSR: 1200,
  avgMonthlySalesTop10: 850,
  // Market Behavior & Efficiency specific fields
  marketSize: '$80K – $202K+ revenue per month in the top 10.',
  demandGrowthRate: '+142% Year-over-Year Search Growth',
  seasonalityPattern: SeasonalityType.SEASONAL,
  seasonalityPeak1: 'July',
  seasonalityPeak2: 'December',
  seasonalityPeakVolume: '10k - 25k',
  seasonalityOffPeak1: 'January',
  seasonalityOffPeak2: 'February',
  seasonalityOffPeakVolume: '5k - 8k',
  conversionRate: '15%',
  avgOutOfStock: '12%',
  avgListingAge: '24 Months',
  competitiveConcentration: 'High concentration with few brands dominating click share.',
  clickShareTop5: '70.7%+',
  activeBrandsCount: '13 Brands',
  brandEntriesYoY: '+116%',
  winningFormula: 'To dominate this niche, the product must meet specific technical and branding standards.',
  winningFormulaTechnical: '12-season system',
  winningFormulaContent: 'Step-by-step Guide',
  winningFormulaComponents: '36+ Fabric Drapes',
  winningFormulaPrice: '$50–$80 Range',
  // Competition Analysis specific fields
  averageRating: '4.5',
  sellersUnder75Reviews: '4',
  pageResultType: 'Organic',
  amazonSellingListing: 'No',
  amazonDominancy: 'No',
  opportunityGap: '',
  topCompetitorsList: Array.from({ length: 10 }, () => ({
    asin: '', brand: '', avgUnitSales: '', clickCount: '', clickShare: '',
    conversionShare: '', avgSellingPrice: '', numberOfReviews: '', launchDate: '', listingAge: ''
  })),
  topCompetitorsAverage: {
    avgUnitSales: '', clickCount: '', clickShare: '', conversionShare: '',
    avgSellingPrice: '', numberOfReviews: '', launchDate: '', listingAge: ''
  },
  // Keyword Analysis fields
  highIntentBuyerKeywords: '',
  longTailOpportunities: '',
  topRelatedKeywordsList: Array.from({ length: 12 }, () => ({
    keyword: '', searchVolume: '', salesMonthly: '', competingProducts: '',
    titleDensity: '', clickShare: '', conversionShare: ''
  })),
  topRelatedKeywordsTotal: {
    keyword: '', searchVolume: '', salesMonthly: '', competingProducts: '',
    titleDensity: '', clickShare: '', conversionShare: ''
  },
  // Product Qualification Checklist initial values
  isNonSeasonal: false,
  isNotFragile: false,
  isNotRestricted: false,
  isTargetPriceInRange: false,
  isReasonableSizeWeight: false,
  isLowIPRisk: false,
  isClearDifferentiation: false,
  isNoCertificationRequired: false,
  // Opportunity Indicators initial values
  isStrongSearchDemand: false,
  isRecentSuccessfulLaunches: false,
  isNewSellersTraction: false,
  isFragmentedCompetition: false,
  isLowReviewBarrier: false,
  isWeakCompetitorListings: false,
  isQualityComplaintsFound: false,
  isOverpricedCompetitors: false,
  isClearImprovementOpp: false,
  isHealthyPriceRange: false,
  // Risk Indicators initial values
  riskReviewBarrier: false,
  riskBrandPresence: false,
  riskMarketSaturation: false,
  riskProfitMargins: false,
  riskPriceWar: false,
  riskManufacturing: false,
  riskReturnRate: false,
  riskPatentIP: false,
  riskCategoryGating: false,
  riskCertifications: false,
  riskSeasonality: false,
  riskPPCCost: false,
  // Execution Strategy initial values
  execPPCStrategy: 'Focus initial PPC on high-intent exact-match keywords to secure indexing and accelerate early ranking',
  execConversionOpt: 'Optimized listing designed to maximize CTR and conversion through strong visuals, clear value proposition, and keyword-optimized titles.',
  execPositioning: 'The product differentiates from competitors through improved design, packaging, bundling, or added value',
  execEarlyReviews: 'Early reviews build trust and improve conversion, supported by programs like Amazon Vine and post-purchase review strategies.',
  execPricingStrategy: 'Start with competitive or break-even pricing to drive early sales velocity and ranking',
  // Review Analysis initial values
  keyInsights: '',
  positiveDrivers: '',
  improvementAreas: '',
  marketSignal: '',
  opportunityInsight: '',
  reviewAnalysisPasteText: '',
  // Niche Analysis initial values
  nicheDescription: '',
  nicheKeyInsights: '',
  nicheOpportunitySignal: '',
  nicheAnalysisPasteText: '',
  // Profitability & Unit Economics initial values
  targetSellingPrice: 0,
  productCostFactory: 0,
  shippingCostSea: 0,
  amazonReferralFee: 0,
  amazonFbaFees: 0,
  ppcCostEstimate: 0,
  totalCostPerUnit: 0,
  netProfitPerUnit: 0,
  netMarginPercentage: 0,
  roiPercentage: 0,
  initialInvestment: 0,
  estimatedUnitsPurchased: 500,
  sellersOver5kRevenue: '0',
  avgReviewCount: 0,
  activeAsinsForListings: []
};

const App: React.FC = () => {
  const [report, setReport] = useState<KeywordReport>(INITIAL_REPORT);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('');
  const [newRelatedKeyword, setNewRelatedKeyword] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lastIndex = localStorage.getItem(REPORT_INDEX_KEY);
    const nextIndex = lastIndex ? parseInt(lastIndex, 10) : 1;
    setReport(prev => ({ ...prev, reportNumber: generateReportNumber(nextIndex) }));
  }, []);

  useEffect(() => {
    const sellingPrice = report.sellingPrice || 0;
    const sales = report.estimatedMonthlySales || 0;
    const calculatedMonthlyRevenue = Math.round(sellingPrice * sales);

    if (report.monthlyRevenue !== calculatedMonthlyRevenue) {
      setReport(prev => ({
        ...prev,
        monthlyRevenue: calculatedMonthlyRevenue
      }));
    }
  }, [
    report.sellingPrice,
    report.estimatedMonthlySales
  ]);

  // Sync Target Selling Price with Avg Selling Price initially or when updated
  useEffect(() => {
    if (report.sellingPrice > 0 && (report.targetSellingPrice === 0 || report.targetSellingPrice !== report.sellingPrice)) {
      setReport(prev => ({
        ...prev,
        targetSellingPrice: prev.sellingPrice
      }));
    }
  }, [report.sellingPrice]);

  useEffect(() => {
    const totalCost = (report.productCostFactory || 0) + (report.shippingCostSea || 0) + (report.amazonReferralFee || 0) + (report.amazonFbaFees || 0) + (report.ppcCostEstimate || 0);
    const netProfit = (report.targetSellingPrice || 0) - totalCost;

    const margin = report.targetSellingPrice > 0 ? (netProfit / report.targetSellingPrice) * 100 : 0;

    const unitCost = (report.productCostFactory || 0) + (report.shippingCostSea || 0);
    const roi = unitCost > 0 ? (netProfit / unitCost) * 100 : 0;

    const round2 = (num: number) => Math.round(num * 100) / 100;

    if (
      report.totalCostPerUnit !== round2(totalCost) ||
      report.netProfitPerUnit !== round2(netProfit) ||
      report.netMarginPercentage !== round2(margin) ||
      report.netProfitMargin !== round2(margin) ||
      report.roiPercentage !== round2(roi)
    ) {
      setReport(prev => ({
        ...prev,
        totalCostPerUnit: round2(totalCost),
        netProfitPerUnit: round2(netProfit),
        netMarginPercentage: round2(margin),
        netProfitMargin: round2(margin),
        roiPercentage: round2(roi),
      }));
    }
  }, [
    report.targetSellingPrice,
    report.productCostFactory,
    report.shippingCostSea,
    report.amazonReferralFee,
    report.amazonFbaFees,
    report.ppcCostEstimate,
    report.totalCostPerUnit,
    report.netProfitPerUnit,
    report.netMarginPercentage,
    report.roiPercentage
  ]);

  // Auto-calculate Estimated Units Purchased based on Investment / (Cost + Shipping)
  useEffect(() => {
    const sourcingCost = (report.productCostFactory || 0) + (report.shippingCostSea || 0);
    const investment = report.initialInvestment || 0;
    if (sourcingCost > 0) {
      const calculatedUnits = Math.floor(investment / sourcingCost);
      if (report.estimatedUnitsPurchased !== calculatedUnits) {
        setReport(prev => ({ ...prev, estimatedUnitsPurchased: calculatedUnits }));
      }
    }
  }, [report.initialInvestment, report.productCostFactory, report.shippingCostSea, report.estimatedUnitsPurchased]);

  const incrementReportNumber = () => {
    const lastIndex = localStorage.getItem(REPORT_INDEX_KEY);
    const currentIndex = lastIndex ? parseInt(lastIndex, 10) : 1;
    const nextIndex = currentIndex + 1;
    localStorage.setItem(REPORT_INDEX_KEY, String(nextIndex));
    setReport(prev => ({ ...prev, reportNumber: generateReportNumber(nextIndex) }));
  };

  useEffect(() => {
    const list = report.topCompetitorsList;
    if (!list || list.length === 0) return;

    const parseNumber = (str: string) => {
      if (!str) return NaN;
      const numStr = str.replace(/[^0-9.-]/g, '');
      return parseFloat(numStr);
    };

    let salesSum = 0, salesCount = 0;
    let priceSum = 0, priceCount = 0;
    let reviewsSum = 0, reviewsCount = 0;
    let ageSum = 0, ageCount = 0;
    let clicksSum = 0, clicksCount = 0;
    let clickShareSumTable = 0, clickShareCount = 0;
    let conversionShareSum = 0, conversionShareCount = 0;

    list.forEach(comp => {
      const sales = parseNumber(comp.avgUnitSales);
      if (!isNaN(sales)) { salesSum += sales; salesCount++; }

      const price = parseNumber(comp.avgSellingPrice);
      if (!isNaN(price)) { priceSum += price; priceCount++; }

      const reviews = parseNumber(comp.numberOfReviews);
      if (!isNaN(reviews)) { reviewsSum += reviews; reviewsCount++; }

      const age = parseNumber(comp.listingAge);
      if (!isNaN(age)) { ageSum += age; ageCount++; }

      const clicks = parseNumber(comp.clickCount);
      if (!isNaN(clicks)) { clicksSum += clicks; clicksCount++; }

      const cs = parseNumber(comp.clickShare);
      if (!isNaN(cs)) { clickShareSumTable += cs; clickShareCount++; }

      const cvs = parseNumber(comp.conversionShare);
      if (!isNaN(cvs)) { conversionShareSum += cvs; conversionShareCount++; }
    });

    const formatAvg = (sum: number, count: number, isPrice = false, isPercent = false) => {
      if (count === 0) return '';
      const avg = sum / count;
      if (isPrice) return '$' + avg.toFixed(2);
      if (isPercent) return avg.toFixed(1) + '%';
      return Math.round(avg).toLocaleString();
    };

    const newSalesAvg = formatAvg(salesSum, salesCount);
    const newPriceAvg = formatAvg(priceSum, priceCount, true);
    const newReviewsAvg = formatAvg(reviewsSum, reviewsCount);
    const newAgeAvg = formatAvg(ageSum, ageCount);
    const newClicksAvg = formatAvg(clicksSum, clicksCount);
    const newClickShareAvg = formatAvg(clickShareSumTable, clickShareCount, false, true);
    const newConversionShareAvg = formatAvg(conversionShareSum, conversionShareCount, false, true);

    // Calculate Top 5 Click Share Automatically (for the summary card)
    const clickShareSumTop5 = list.slice(0, 5).reduce((acc, comp) => {
      if (!comp.clickShare) return acc;
      const cleanVal = String(comp.clickShare).replace('%', '').replace(',', '.').trim();
      const numValue = parseFloat(cleanVal);
      return acc + (isNaN(numValue) ? 0 : numValue);
    }, 0);
    const newClickShareTopAuto = clickShareSumTop5 > 0 ? `${clickShareSumTop5.toFixed(1)}%` : '0%';

    const isDifferent =
      report.topCompetitorsAverage.avgUnitSales !== newSalesAvg ||
      report.topCompetitorsAverage.avgSellingPrice !== newPriceAvg ||
      report.topCompetitorsAverage.numberOfReviews !== newReviewsAvg ||
      report.topCompetitorsAverage.listingAge !== newAgeAvg ||
      report.topCompetitorsAverage.clickCount !== newClicksAvg ||
      report.topCompetitorsAverage.clickShare !== newClickShareAvg ||
      report.topCompetitorsAverage.conversionShare !== newConversionShareAvg ||
      report.clickShareTop5 !== newClickShareTopAuto;

    if (isDifferent) {
      setReport(prev => ({
        ...prev,
        clickShareTop5: newClickShareTopAuto,
        topCompetitorsAverage: {
          ...prev.topCompetitorsAverage,
          avgUnitSales: newSalesAvg,
          avgSellingPrice: newPriceAvg,
          numberOfReviews: newReviewsAvg,
          listingAge: newAgeAvg,
          clickCount: newClicksAvg,
          clickShare: newClickShareAvg,
          conversionShare: newConversionShareAvg
        }
      }));
    }
  }, [report.topCompetitorsList, report.clickShareTop5, report.topCompetitorsAverage]);

  useEffect(() => {
    const list = report.topRelatedKeywordsList;
    if (!list || list.length === 0) return;

    const parseNumber = (str: string) => {
      if (!str) return NaN;
      const numStr = str.replace(/[^0-9.-]/g, '');
      return parseFloat(numStr);
    };

    let searchVolumeSum = 0;
    let salesMonthlySum = 0;
    let clickShareSumTable = 0, clickShareCount = 0;
    let conversionShareSumTable = 0, conversionShareCount = 0;

    list.forEach(kw => {
      const sv = parseNumber(kw.searchVolume);
      if (!isNaN(sv)) { searchVolumeSum += sv; }

      const sales = parseNumber(kw.salesMonthly);
      if (!isNaN(sales)) { salesMonthlySum += sales; }

      const cs = parseNumber(kw.clickShare);
      if (!isNaN(cs)) { clickShareSumTable += cs; clickShareCount++; }

      const cvs = parseNumber(kw.conversionShare);
      if (!isNaN(cvs)) { conversionShareSumTable += cvs; conversionShareCount++; }
    });

    const formatSum = (sum: number) => {
      if (sum === 0) return '';
      return sum.toLocaleString();
    };

    const formatAvgPercent = (sum: number, count: number) => {
      if (count === 0) return '';
      return (sum / count).toFixed(1) + '%';
    };

    const newSearchVolumeTotal = formatSum(searchVolumeSum);
    const newSalesMonthlyTotal = formatSum(salesMonthlySum);
    const newClickShareAvg = formatAvgPercent(clickShareSumTable, clickShareCount);
    const newConversionShareAvg = formatAvgPercent(conversionShareSumTable, conversionShareCount);

    const isDifferent =
      report.topRelatedKeywordsTotal.searchVolume !== newSearchVolumeTotal ||
      report.topRelatedKeywordsTotal.salesMonthly !== newSalesMonthlyTotal ||
      report.topRelatedKeywordsTotal.clickShare !== newClickShareAvg ||
      report.topRelatedKeywordsTotal.conversionShare !== newConversionShareAvg;

    if (isDifferent) {
      setReport(prev => ({
        ...prev,
        topRelatedKeywordsTotal: {
          ...prev.topRelatedKeywordsTotal,
          searchVolume: newSearchVolumeTotal,
          salesMonthly: newSalesMonthlyTotal,
          clickShare: newClickShareAvg,
          conversionShare: newConversionShareAvg
        }
      }));
    }
  }, [report.topRelatedKeywordsList, report.topRelatedKeywordsTotal]);

  const handleCompetitorChange = (index: number, field: keyof CompetitorData, value: string) => {
    setReport(prev => {
      const newList = [...prev.topCompetitorsList];
      const updatedItem = { ...newList[index], [field]: value };

      // Auto-calculate age if Launch Date is changed
      if (field === 'launchDate' && value) {
        updatedItem.listingAge = calculateListingAge(value) || updatedItem.listingAge;
      }

      newList[index] = updatedItem;
      return { ...prev, topCompetitorsList: newList };
    });
  };

  const handleCompetitorAverageChange = (field: keyof CompetitorData, value: string) => {
    setReport(prev => {
      const updatedAvg = { ...prev.topCompetitorsAverage, [field]: value };

      // Auto-calculate age if average Launch Date is changed
      if (field === 'launchDate' && value) {
        updatedAvg.listingAge = calculateListingAge(value) || updatedAvg.listingAge;
      }

      return {
        ...prev,
        topCompetitorsAverage: updatedAvg
      };
    });
  };

  const handleAddCompetitor = () => {
    setReport(prev => ({
      ...prev,
      topCompetitorsList: [
        ...prev.topCompetitorsList,
        {
          asin: '', brand: '', avgUnitSales: '', clickCount: '', clickShare: '',
          conversionShare: '', avgSellingPrice: '', numberOfReviews: '', launchDate: '', listingAge: ''
        }
      ]
    }));
  };

  const handleRemoveCompetitor = (index: number) => {
    setReport(prev => {
      const newList = [...prev.topCompetitorsList];
      newList.splice(index, 1);
      return { ...prev, topCompetitorsList: newList };
    });
  };

  const handleRelatedKeywordChange = (index: number, field: keyof TopRelatedKeyword, value: string) => {
    setReport(prev => {
      const newList = [...prev.topRelatedKeywordsList];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, topRelatedKeywordsList: newList };
    });
  };

  const handleRelatedKeywordTotalChange = (field: keyof TopRelatedKeyword, value: string) => {
    setReport(prev => ({
      ...prev,
      topRelatedKeywordsTotal: { ...prev.topRelatedKeywordsTotal, [field]: value }
    }));
  };

  const handleClearCompetitors = () => {
    if (window.confirm('Are you sure you want to clear all data in the Top Competitors table?')) {
      setReport(prev => ({
        ...prev,
        topCompetitorsList: prev.topCompetitorsList.map(() => ({
          asin: '', brand: '', avgUnitSales: '', clickCount: '', clickShare: '',
          conversionShare: '', avgSellingPrice: '', numberOfReviews: '', launchDate: '', listingAge: ''
        }))
      }));
    }
  };

  const handleClearKeywords = () => {
    if (window.confirm('Are you sure you want to clear all data in the Top Related Keywords table?')) {
      setReport(prev => ({
        ...prev,
        topRelatedKeywordsList: prev.topRelatedKeywordsList.map(() => ({
          keyword: '', searchVolume: '', salesMonthly: '', competingProducts: '',
          titleDensity: '', clickShare: '', conversionShare: ''
        }))
      }));
    }
  };

  const handleAddRelatedKeyword = () => {
    setReport(prev => ({
      ...prev,
      topRelatedKeywordsList: [
        ...prev.topRelatedKeywordsList,
        {
          keyword: '', searchVolume: '', salesMonthly: '', competingProducts: '',
          titleDensity: '', clickShare: '', conversionShare: ''
        }
      ]
    }));
  };

  const handleCompetitorPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text');
    if (!pasteData) return;

    // Check if it's likely a bulk paste
    if (!pasteData.includes('\t') && !pasteData.includes('\n') && !pasteData.includes(',')) return;

    e.preventDefault();
    e.stopPropagation();

    const rows = pasteData.trim().split(/\r?\n/);
    const newCompetitors = rows.map(row => {
      // Intelligent split: Try tab, then multi-space, then comma
      let cells = row.split('\t');
      if (cells.length === 1) cells = row.split(/[ ]{3,}/);
      if (cells.length === 1) cells = row.split(',');

      const lDate = cells[7]?.trim() || '';
      return {
        asin: cells[0]?.trim() || '',
        brand: cells[1]?.trim() || '',
        avgUnitSales: cells[2]?.trim() || '',
        clickCount: cells[3]?.trim() || '',
        clickShare: cells[4]?.trim() || '',
        conversionShare: '', // Not in UI table
        avgSellingPrice: cells[5]?.trim() || '',
        numberOfReviews: cells[6]?.trim() || '',
        launchDate: lDate,
        listingAge: cells[8]?.trim() || calculateListingAge(lDate)
      };
    });

    if (newCompetitors.length > 0) {
      setReport(prev => ({
        ...prev,
        topCompetitorsList: [...newCompetitors]
      }));
    }
  };

  const handleKeywordsPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text');
    if (!pasteData) return;

    // Check if it's likely a bulk paste
    if (!pasteData.includes('\t') && !pasteData.includes('\n') && !pasteData.includes(',')) return;

    e.preventDefault();
    e.stopPropagation();

    const rows = pasteData.trim().split(/\r?\n/);
    const newKeywords = rows.map(row => {
      let cells = row.split('\t');
      if (cells.length === 1) cells = row.split(/[ ]{3,}/);
      if (cells.length === 1) cells = row.split(',');

      return {
        keyword: cells[0]?.trim() || '',
        searchVolume: cells[1]?.trim() || '',
        salesMonthly: cells[2]?.trim() || '',
        competingProducts: cells[3]?.trim() || '',
        titleDensity: cells[4]?.trim() || '',
        clickShare: cells[5]?.trim() || '',
        conversionShare: cells[6]?.trim() || ''
      };
    });

    if (newKeywords.length > 0) {
      setReport(prev => ({
        ...prev,
        topRelatedKeywordsList: [...newKeywords]
      }));
    }
  };

  const handleAllActiveAsinsPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData('text');
    if (!pasteData) return;

    e.preventDefault();
    e.stopPropagation();

    // Extract anything that looks like an ASIN (10 chars, usually starts with B0)
    // We'll be more flexible: any word that is 10 chars long
    const asins = pasteData.trim().split(/[\s,\t\n]+/).filter(a => a.trim().length === 10);

    if (asins.length > 0) {
      setReport(prev => ({
        ...prev,
        activeAsinsForListings: asins
      }));
    }
  };

  const handleClearActiveAsins = () => {
    if (window.confirm('Are you sure you want to clear all ASINs?')) {
      setReport(prev => ({ ...prev, activeAsinsForListings: [] }));
    }
  };

  const handleAddActiveAsinRow = () => {
    setReport(prev => ({
      ...prev,
      activeAsinsForListings: [
        ...(prev.activeAsinsForListings || []),
        '', '', '', '', ''
      ]
    }));
  };

  const handleRemoveActiveAsinRow = (rowIndex: number) => {
    setReport(prev => {
      const newList = [...(prev.activeAsinsForListings || [])];
      newList.splice(rowIndex * 5, 5);
      return { ...prev, activeAsinsForListings: newList };
    });
  };

  const handleRemoveRelatedKeyword = (index: number) => {
    setReport(prev => {
      const newList = [...prev.topRelatedKeywordsList];
      newList.splice(index, 1);
      return { ...prev, topRelatedKeywordsList: newList };
    });
  };

  const formatPercentage = (val: string) => {
    if (!val.trim()) return '';
    const clean = val.replace(',', '.');
    const num = clean.replace(/[^0-9.]/g, '');
    if (!num) return '';
    return `${num}%`;
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setReport(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = [
      'opportunityScore',
      'monthlySearchVolume',
      'estimatedMonthlySales',
      'competitorsCount',
      'sellingPrice',
      'sellersWithKeywordInTitle',
      'bsr',
      'fbaSellersCount',
      'fbmSellersCount',
      'monthlyRevenue',
      'estimatedMonthlyRevenueTop10Avg',
      'totalActiveListing',
      'activeSellersPage1',
      'marketShare',
      'avgBSR',
      'avgMonthlySalesTop10',
      'avgReviewCount',
      'sellersUnder100Reviews',
      'sellersOver10kRevenue',
      'listingsUnder12Months',
      'keywordDifficultyScore',
      'targetSellingPrice',
      'productCostFactory',
      'shippingCostSea',
      'amazonReferralFee',
      'amazonFbaFees',
      'ppcCostEstimate',
      'totalCostPerUnit',
      'netProfitPerUnit',
      'netMarginPercentage',
      'roiPercentage',
      'initialInvestment',
      'estimatedUnitsPurchased'
    ].includes(name);

    setReport(prev => {
      const updated = {
        ...prev,
        [name]: isNumeric ? (value === '' ? 0 : Number(value)) : value
      };

      if (name === 'category') {
        if (RESTRICTED_CATEGORIES.some(cat => value.includes(cat) || cat.includes(value))) {
          updated.eligibility = Eligibility.REQUIRE_APPROVAL;
        } else {
          updated.eligibility = Eligibility.ELIGIBLE;
        }
      }

      return updated;
    });
  };

  const updateImageField = (field: keyof KeywordReport, dataUrl: string) => {
    setReport(prev => ({ ...prev, [field]: dataUrl }));
  };

  const handleRankingDifficultySelection = (value: RankingDifficulty) => {
    setReport(prev => ({ ...prev, rankingDifficulty: value }));
  };

  const addCompetitorUrl = () => {
    if (newCompetitorUrl.trim()) {
      setReport(prev => ({
        ...prev,
        competitorUrls: [...prev.competitorUrls, newCompetitorUrl.trim()]
      }));
      setNewCompetitorUrl('');
    }
  };

  const removeCompetitorUrl = (index: number) => {
    setReport(prev => ({
      ...prev,
      competitorUrls: prev.competitorUrls.filter((_, i) => i !== index)
    }));
  };

  const addRelatedKeyword = () => {
    if (newRelatedKeyword.trim()) {
      setReport(prev => ({
        ...prev,
        relatedKeywords: [...prev.relatedKeywords, newRelatedKeyword.trim()]
      }));
      setNewRelatedKeyword('');
    }
  };

  const removeRelatedKeyword = (index: number) => {
    setReport(prev => ({
      ...prev,
      relatedKeywords: prev.relatedKeywords.filter((_, i) => i !== index)
    }));
  };

  const exportCSV = () => {
    const headers = Object.keys(report).join(',');
    const values = Object.values(report).map(val => Array.isArray(val) ? `"${val.join('|')}"` : `"${val}"`).join(',');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${values}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KW_Report_${report.reportNumber || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `KW_Report_Data_${(report.keyword || 'export').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${report.reportNumber || ''}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          setReport(prev => ({
            ...INITIAL_REPORT,
            ...parsed
          }));
          alert('Report imported successfully!');
        } else {
          alert('Invalid file format.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse file. Make sure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  const triggerImportClick = () => {
    fileInputRef.current?.click();
  };

  const handlePrint = () => {
    setActiveTab('preview');
    const oldTitle = document.title;
    const safeKeyword = (report.keyword || 'Analysis').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    document.title = `KW_Report_${safeKeyword}_${report.reportNumber}`;
    setTimeout(() => {
      try {
        window.print();
        document.title = oldTitle;
      } catch (err) {
        console.error("Print error:", err);
        document.title = oldTitle;
      }
    }, 800);
  };

  const RANKING_DIFFICULTY_OPTIONS = [
    { label: RankingDifficulty.EASY, field: 'easyToRankDesc' as const },
    { label: RankingDifficulty.MODERATE, field: 'moderateDifficultyDesc' as const },
    { label: RankingDifficulty.HARD, field: 'hardToRankDesc' as const }
  ];

  const SECTIONS = [
    { id: 'section-1', label: '1. Core Identity', icon: 'fa-id-card' },
    { id: 'section-2', label: '2. Executive Summary', icon: 'fa-bolt' },
    { id: 'section-3', label: '3. Market Behavior', icon: 'fa-chart-line' },
    { id: 'section-4', label: '4. Competition', icon: 'fa-shield-halved' },
    { id: 'section-5', label: '5. Keywords', icon: 'fa-key' },
    { id: 'section-6', label: '6. Reviews', icon: 'fa-star' },
    { id: 'section-7', label: '7. Niche', icon: 'fa-box-open' },
    { id: 'section-8', label: '8. Economics', icon: 'fa-dollar-sign' },
    { id: 'section-9', label: '9. Qualification', icon: 'fa-check-double' },
    { id: 'section-10', label: '10. Indicators', icon: 'fa-arrow-up-right-dots' },
    { id: 'section-11', label: '11. Risk', icon: 'fa-triangle-exclamation' },
    { id: 'section-12', label: '12. Strategy', icon: 'fa-chess-king' },
    { id: 'section-13', label: '13. Proof', icon: 'fa-magnifying-glass' },
    { id: 'section-14', label: '14. Links', icon: 'fa-link' }
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const breakevenUnits = report.netProfitPerUnit > 0 ? Math.ceil((report.initialInvestment || 0) / report.netProfitPerUnit) : 0;

  const getRiskInfo = () => {
    const estUnits = report.estimatedUnitsPurchased || 0;
    if (estUnits <= 0) return { text: "N/A", color: "text-slate-400", bg: "bg-slate-50 border-slate-100" };
    const ratio = breakevenUnits / estUnits;
    if (ratio > 0.8) return { text: "High Risk", color: "text-rose-300", bg: "bg-rose-500/20" };
    if (ratio >= 0.7) return { text: "Medium Risk", color: "text-amber-300", bg: "bg-amber-500/20" };
    return { text: "Low Risk", color: "text-emerald-300", bg: "bg-emerald-500/20" };
  };

  const riskInfo = getRiskInfo();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 w-10 h-10 rounded-xl flex items-center justify-center text-slate-900">
              <i className="fa-solid fa-trophy text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">Keyword Winner</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyst Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              <i className="fa-solid fa-pen-to-square mr-2"></i> Edit
            </button>
            <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
              <i className="fa-solid fa-eye mr-2"></i> Preview
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />
            
            <button
              onClick={triggerImportClick}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              title="Import Data File"
            >
              <i className="fa-solid fa-file-import"></i> Import Data
            </button>
            
            <button
              onClick={exportJSON}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              title="Export Data File"
            >
              <i className="fa-solid fa-file-export"></i> Export Data
            </button>

            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
            >
              <i className="fa-solid fa-file-pdf"></i> Save & Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto p-4 md:p-6 print:p-0 print:m-0">
        {activeTab === 'edit' ? (
          <div className="flex gap-6 max-w-[1600px] mx-auto items-start">
            {/* Sidebar Navigation */}
            <aside className="w-72 sticky top-24 hidden lg:block shrink-0">
              <nav className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-hidden">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 px-3">Navigate Sections</p>
                <div className="space-y-1.5">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-4 group"
                    >
                      <i className={`fa-solid ${s.icon} w-6 text-center text-base opacity-40 group-hover:opacity-100 transition-opacity`}></i>
                      <span className="truncate leading-none">{s.label}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </aside>

            {/* Editor Content */}
            <div className="flex-1 min-w-0 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-10">

              {/* Section 1: Core Identity */}
              <div id="section-1" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                  Core Identity & Visuals
                </h2>

                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="w-full md:w-[240px] shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Image 1</label>
                      <ImageDropzone
                        label="Product Image 1"
                        icon="fa-camera"
                        currentImage={report.productImageUrl}
                        onUpload={(data) => updateImageField('productImageUrl', data)}
                        className="h-[240px] shadow-sm border-2 rounded-[2.5rem]"
                      />
                    </div>

                    <div className="w-full md:w-[240px] shrink-0">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Image 2</label>
                      <ImageDropzone
                        label="Product Image 2"
                        icon="fa-camera"
                        currentImage={report.productImageUrl2}
                        onUpload={(data) => updateImageField('productImageUrl2', data)}
                        className="h-[240px] shadow-sm border-2 rounded-[2.5rem]"
                      />
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-5 pt-6">
                    <InputGroup label="Target Keyword" icon="fa-key">
                      <input type="text" name="keyword" value={report.keyword} onChange={handleInputChange} placeholder="e.g. Bamboo Toothbrush" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-black text-lg text-slate-900" />
                    </InputGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputGroup label="Best Fit For" icon="fa-user-tag text-indigo-500">
                        <select name="sellerType" value={report.sellerType} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold">
                          <option value="Private Label">Private Label</option>
                          <option value="Wholesale">Wholesale</option>
                          <option value="Arbitrage">Arbitrage</option>
                        </select>
                      </InputGroup>
                      <InputGroup label="Product Seller Fit" icon="fa-handshake text-emerald-500">
                        <select name="productSellerFit" value={report.productSellerFit} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold">
                          <option value="New Seller">New Seller</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputGroup label="Report ID" icon="fa-hashtag">
                        <input type="text" name="reportNumber" value={report.reportNumber} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-slate-900" />
                      </InputGroup>
                      <InputGroup label="Category" icon="fa-folder">
                        <select name="category" value={report.category} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold">
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      <InputGroup label="Sub Category" icon="fa-folder-tree">
                        <input type="text" name="subCategory" value={report.subCategory} onChange={handleInputChange} placeholder="e.g. Health & Care" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-slate-900" />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 2: Executive Summary */}
              <div id="section-2" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                  Executive Summary
                </h2>

                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InputGroup label="Search Volume" icon="fa-magnifying-glass">
                      <input type="number" name="monthlySearchVolume" value={report.monthlySearchVolume} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Demand Level" icon="fa-arrow-up-right-dots">
                      <select name="demandLevel" value={report.demandLevel} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                        {Object.values(DemandLevel).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                    </InputGroup>

                    <InputGroup label="Competition" icon="fa-gauge">
                      <select name="competitionLevel" value={report.competitionLevel} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                        {Object.values(CompetitionLevel).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                    </InputGroup>

                    <InputGroup label="Mo. Revenue" icon="fa-dollar-sign">
                      <input type="number" name="monthlyRevenue" value={report.monthlyRevenue} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Total Revenue" icon="fa-chart-line">
                      <input type="number" name="totalRevenue" value={report.totalRevenue} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Revenue over $5,000 (Sellers)" icon="fa-chart-line">
                      <input type="text" name="sellersOver5kRevenue" value={report.sellersOver5kRevenue} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Avg Monthly Sales (Page 1)" icon="fa-cart-shopping">
                      <input type="number" name="avgMonthlySalesTop10" value={report.avgMonthlySalesTop10} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Avg Selling Price" icon="fa-tag">
                      <input type="number" name="sellingPrice" value={report.sellingPrice} step="0.01" onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Avg BSR" icon="fa-trophy">
                      <input type="number" name="avgBSR" value={report.avgBSR} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Avg Reviews" icon="fa-star">
                      <input type="number" name="avgReviewCount" value={report.avgReviewCount} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Net Margin" icon="fa-percent">
                      <input type="number" name="netProfitMargin" value={report.netProfitMargin} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-bold text-emerald-600 cursor-not-allowed" />
                    </InputGroup>

                    <InputGroup label="Marketplace" icon="fa-earth-americas">
                      <select name="marketReach" value={report.marketReach} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                        {MARKETPLACES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </InputGroup>
                  </div>

                  <div className="mt-8">
                    <InputGroup label="Insight" icon="fa-lightbulb">
                      <textarea name="insight" value={report.insight || ''} onChange={handleInputChange} rows={3} placeholder="Add your executive insights here..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 3: Market Behavior & Efficiency */}
              <div id="section-3" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                  Market Behavior & Efficiency
                </h2>

                <div className="p-8 rounded-[2.5rem] bg-amber-50/10 border border-amber-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InputGroup label="Seasonality" icon="fa-calendar-days">
                      <select name="seasonalityPattern" value={report.seasonalityPattern} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                        {Object.values(SeasonalityType).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                    </InputGroup>

                    <InputGroup label="Peak" icon="fa-arrow-up-right-dots">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <select name="seasonalityPeak1" value={report.seasonalityPeak1} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                            <option value="">-Select-</option>
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select name="seasonalityPeak2" value={report.seasonalityPeak2} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                            <option value="">-Select-</option>
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <input type="text" name="seasonalityPeakVolume" value={report.seasonalityPeakVolume} onChange={handleInputChange} placeholder="Volume (e.g. 6k - 18k)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm" />
                      </div>
                    </InputGroup>

                    <InputGroup label="Off-Peak" icon="fa-arrow-trend-down">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <select name="seasonalityOffPeak1" value={report.seasonalityOffPeak1} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                            <option value="">-Select-</option>
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <select name="seasonalityOffPeak2" value={report.seasonalityOffPeak2} onChange={handleInputChange} className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none">
                            <option value="">-Select-</option>
                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                        <input type="text" name="seasonalityOffPeakVolume" value={report.seasonalityOffPeakVolume} onChange={handleInputChange} placeholder="Volume (e.g. 6k - 18k)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm" />
                      </div>
                    </InputGroup>

                    <InputGroup label="Conversion Rate" icon="fa-percent">
                      <input type="text" name="conversionRate" value={report.conversionRate} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Avg Out-of-Stock" icon="fa-box-open">
                      <input type="text" name="avgOutOfStock" value={report.avgOutOfStock} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Avg Listing Age" icon="fa-clock-rotate-left">
                      <input type="text" name="avgListingAge" value={report.avgListingAge} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>

                    <InputGroup label="Competitive Concentration" icon="fa-arrows-to-circle">
                      <textarea name="competitiveConcentration" value={report.competitiveConcentration} onChange={handleInputChange} rows={1} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                    </InputGroup>

                    <InputGroup label="Click Share Top 5" icon="fa-chart-pie">
                      <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-violet-600 flex items-center justify-between">
                        <span>{report.clickShareTop5 || '0%'}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest">Linked Metric</span>
                      </div>
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 4: Competition Analysis */}
              <div id="section-4" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                  Competition Analysis
                </h2>
                <div className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <InputGroup label="Average Rating" icon="fa-star">
                      <input type="text" name="averageRating" value={report.averageRating} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>
                    <InputGroup label="Sellers < 75 REVIEWS" icon="fa-users-slash">
                      <input type="text" name="sellersUnder75Reviews" value={report.sellersUnder75Reviews} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>
                    <InputGroup label="Total Active Listing" icon="fa-list-ol">
                      <input type="number" name="totalActiveListing" value={report.totalActiveListing} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>
                    <InputGroup label="Active Listing Page1" icon="fa-file-lines">
                      <input type="number" name="activeSellersPage1" value={report.activeSellersPage1} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>
                    <InputGroup label="Page Result Type" icon="fa-file-invoice">
                      <select name="pageResultType" value={report.pageResultType} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold appearance-none cursor-pointer">
                        <option value="16">16</option>
                        <option value="48">48</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Amazon Selling Listing" icon="fa-amazon">
                      <select name="amazonSellingListing" value={report.amazonSellingListing} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold appearance-none cursor-pointer">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Amazon Dominancy" icon="fa-crown">
                      <select name="amazonDominancy" value={report.amazonDominancy} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold appearance-none cursor-pointer">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Opportunity Gap Identified" icon="fa-bridge">
                      <input type="text" name="opportunityGap" value={report.opportunityGap} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                    </InputGroup>
                    <InputGroup label="Click Share Top 5 (Auto)" icon="fa-chart-pie">
                      <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-violet-600 flex items-center justify-between">
                        <span>{report.clickShareTop5 || '0%'}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest">Calculated</span>
                      </div>
                    </InputGroup>
                  </div>
                </div>



                <div className="mt-8 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-x-auto relative group">
                  <div className="absolute top-8 right-8 z-10 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
                      <i className="fa-solid fa-copy text-amber-500"></i>
                      Bulk Paste (Excel/Sheets) Enabled
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider text-center">Top Competitor Analysis</h3>
                  <table onPasteCapture={handleCompetitorPaste} className="w-full text-left border-collapse min-w-[1000px] bg-white rounded-xl shadow-sm text-sm border-hidden">
                    <thead>
                      <tr className="bg-slate-200/50">
                        <th className="border border-slate-300 font-black text-center w-12"><div className="resize-x overflow-hidden px-1 py-3 min-w-[30px] w-full">#</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">ASIN</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[100px]">Brand</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Avg<br />Unit<br />Sales</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Click<br />Count<br /><span className="text-[10px] font-normal">(past 3M)</span></div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Click<br />Share</div></th>

                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Avg<br />Selling<br />Price</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Number<br />Of<br />Reviews</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[100px]">Launch<br />Date</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Listing<br />age<br />(mo)</div></th>
                        <th className="border border-slate-300 font-black text-center w-10 text-slate-400"><div className="resize-x overflow-hidden px-1 py-3 w-full min-w-[40px]"><i className="fa-solid fa-trash-can"></i></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topCompetitorsList.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-3 border border-slate-200 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-2 border border-slate-200">
                            <div className="flex items-center gap-1 group/asin">
                              <input
                                type="text"
                                value={comp.asin}
                                onChange={e => handleCompetitorChange(idx, 'asin', e.target.value)}
                                className="w-full font-bold outline-none text-center bg-transparent"
                              />
                              {comp.asin && (
                                <a
                                  href={`https://www.amazon.com/dp/${comp.asin.trim()}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 opacity-0 group-hover/asin:opacity-100 transition-all p-1"
                                  title="Check on Amazon"
                                >
                                  <i className="fa-solid fa-up-right-from-square text-[10px]"></i>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.brand} onChange={e => handleCompetitorChange(idx, 'brand', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.avgUnitSales} onChange={e => handleCompetitorChange(idx, 'avgUnitSales', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.clickCount} onChange={e => handleCompetitorChange(idx, 'clickCount', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.clickShare} onChange={e => handleCompetitorChange(idx, 'clickShare', e.target.value)} onBlur={e => handleCompetitorChange(idx, 'clickShare', formatPercentage(e.target.value))} className="w-full font-bold outline-none text-center bg-transparent" /></td>

                          <td className="p-2 border border-slate-200"><input type="text" value={comp.avgSellingPrice} onChange={e => handleCompetitorChange(idx, 'avgSellingPrice', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.numberOfReviews} onChange={e => handleCompetitorChange(idx, 'numberOfReviews', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.launchDate} onChange={e => handleCompetitorChange(idx, 'launchDate', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={comp.listingAge} onChange={e => handleCompetitorChange(idx, 'listingAge', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-1 border border-slate-200 text-center">
                            <button onClick={() => handleRemoveCompetitor(idx)} className="opacity-30 group-hover:opacity-100 text-red-500 hover:text-white transition-all w-7 h-7 rounded-md hover:bg-red-500 flex items-center justify-center m-auto">
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-black">
                        <td colSpan={3} className="p-3 border border-slate-300 text-center text-lg uppercase tracking-wider text-slate-900">Total / Avg</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.avgUnitSales}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.clickCount}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.clickShare}</td>

                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.avgSellingPrice}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.numberOfReviews}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.launchDate}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topCompetitorsAverage.listingAge}</td>
                        <td className="border-r border-slate-300 bg-slate-100"></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-6 flex justify-end gap-4">
                    <button onClick={handleClearCompetitors} className="bg-white text-rose-600 border border-rose-200 px-6 py-3 rounded-xl font-black text-sm flex items-center gap-3 hover:bg-rose-50 transition-all shadow-sm hover:shadow-md">
                      <i className="fa-solid fa-trash-can"></i>
                      CLEAR ALL
                    </button>
                    <button onClick={handleAddCompetitor} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <i className="fa-solid fa-plus"></i>
                      ADD ROW
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-8 rounded-[2.5rem] bg-slate-100/50 border border-slate-200 relative group">
                  <div className="absolute top-8 right-8 z-10 flex items-center gap-3">
                    <button
                      onClick={handleClearActiveAsins}
                      className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-rose-100 hover:bg-rose-50 transition-colors shadow-sm"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={handleAddActiveAsinRow}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      Add Row
                    </button>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
                      <i className="fa-solid fa-copy text-blue-500"></i>
                      Bulk Paste ASINs
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-wider text-center">All ASINs for Active Listings</h3>

                  <div onPasteCapture={handleAllActiveAsinsPaste} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full table-fixed text-left border-collapse text-sm">
                      <thead>
                        <colgroup>
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                          <col className="w-[18%]" />
                          <col className="w-[10%]" />
                        </colgroup>
                        <tr className="bg-slate-200/50">
                          {[1, 2, 3, 4, 5].map(i => (
                            <th key={i} className="p-2 bg-slate-100 border border-slate-200 font-black text-center text-slate-400 text-[10px] uppercase tracking-widest">ASIN</th>
                          ))}
                          <th className="p-2 bg-slate-100 border border-slate-200"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const totalAsins = report.activeAsinsForListings || [];
                          const numRows = Math.max(1, Math.ceil(totalAsins.length / 5));
                          return Array.from({ length: numRows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-slate-100 last:border-0 group/row hover:bg-slate-50 transition-colors">
                              {[0, 1, 2, 3, 4].map(colIndex => {
                                const asinIndex = (rowIndex * 5) + colIndex;
                                const asin = totalAsins[asinIndex] || '';
                                const displayNum = asinIndex + 1;
                                return (
                                  <td key={colIndex} className="p-1 border border-slate-100 text-center font-bold text-slate-700 min-h-[35px]">
                                    <div className="flex items-center gap-1 group/asin px-1">
                                      <span className="text-[7px] text-slate-300 w-3 shrink-0">{displayNum}</span>
                                      <input
                                        type="text"
                                        value={asin}
                                        onChange={(e) => {
                                          const newList = [...totalAsins];
                                          while (newList.length <= asinIndex) newList.push('');
                                          newList[asinIndex] = e.target.value.toUpperCase();
                                          setReport(prev => ({ ...prev, activeAsinsForListings: newList }));
                                        }}
                                        placeholder="—"
                                        className="flex-1 text-center outline-none bg-transparent py-1 text-[10px] font-black tracking-wider placeholder:text-slate-200"
                                      />
                                      {asin && (
                                        <a
                                          href={`https://www.amazon.com/dp/${asin.trim()}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 hover:text-blue-700 opacity-0 group-hover/asin:opacity-100 transition-all pointer-events-auto"
                                          title="Check on Amazon"
                                        >
                                          <i className="fa-solid fa-search text-[8px]"></i>
                                        </a>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="p-1 border border-slate-100 text-center">
                                <button
                                  onClick={() => handleRemoveActiveAsinRow(rowIndex)}
                                  className="opacity-20 group-hover/row:opacity-100 text-slate-400 hover:text-white hover:bg-rose-500 w-6 h-6 rounded-md transition-all flex items-center justify-center m-auto border border-transparent hover:border-rose-600 shadow-sm"
                                  title="Remove this row"
                                >
                                  <i className="fa-solid fa-xmark text-[10px]"></i>
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest px-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-info text-blue-400"></i>
                      <span>Each Row Contains 5 ASINs</span>
                    </div>
                    <button
                      onClick={handleAddActiveAsinRow}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                      <i className="fa-solid fa-plus text-emerald-500"></i>
                      Add New Row
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 5: Keyword Analysis */}
              <div id="section-5" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                  Keyword Analysis
                </h2>


                {/* Top Related Keywords Table */}
                <div className="mt-8 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-x-auto relative group">
                  <div className="absolute top-8 right-8 z-10 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
                      <i className="fa-solid fa-copy text-emerald-500"></i>
                      Bulk Paste Mode On
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-6 tracking-wide text-center">Top Related Keywords</h3>
                  <table onPasteCapture={handleKeywordsPaste} className="w-full text-left border-collapse min-w-[800px] bg-white rounded-xl shadow-sm text-sm border-hidden">
                    <thead>
                      <tr className="bg-slate-200/50">
                        <th className="border border-slate-300 font-black text-center w-12"><div className="resize-x overflow-hidden px-1 py-3 min-w-[30px] w-full">#</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[150px]">Keywords</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Search<br />Volume</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Sales<br /><span className="text-[10px] font-normal">(Monthly)</span></div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Competing<br />Products</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Title<br />Density</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Click<br />Share</div></th>
                        <th className="border border-slate-300 font-black text-center"><div className="resize-x overflow-hidden px-3 py-3 w-full min-w-[80px]">Conversion<br />Share</div></th>
                        <th className="border border-slate-300 font-black text-center w-10 text-slate-400"><div className="resize-x overflow-hidden px-1 py-3 w-full min-w-[40px]"><i className="fa-solid fa-trash-can"></i></div></th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topRelatedKeywordsList.map((kw, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-3 border border-slate-200 text-center font-bold text-slate-500">{idx + 1}</td>
                          <td className="p-2 border border-slate-200">
                            <div className="flex items-center gap-1 group/kw">
                              <input
                                type="text"
                                value={kw.keyword}
                                onChange={e => handleRelatedKeywordChange(idx, 'keyword', e.target.value)}
                                className="w-full font-bold outline-none text-center bg-transparent capitalize"
                              />
                              {kw.keyword && (
                                <a
                                  href={`https://www.amazon.com/s?k=${encodeURIComponent(kw.keyword)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 opacity-0 group-hover/kw:opacity-100 transition-all p-1"
                                  title="Search on Amazon"
                                >
                                  <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-2 border border-slate-200"><input type="text" value={kw.searchVolume} onChange={e => handleRelatedKeywordChange(idx, 'searchVolume', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={kw.salesMonthly} onChange={e => handleRelatedKeywordChange(idx, 'salesMonthly', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={kw.competingProducts} onChange={e => handleRelatedKeywordChange(idx, 'competingProducts', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={kw.titleDensity} onChange={e => handleRelatedKeywordChange(idx, 'titleDensity', e.target.value)} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={kw.clickShare} onChange={e => handleRelatedKeywordChange(idx, 'clickShare', e.target.value)} onBlur={e => handleRelatedKeywordChange(idx, 'clickShare', formatPercentage(e.target.value))} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-2 border border-slate-200"><input type="text" value={kw.conversionShare} onChange={e => handleRelatedKeywordChange(idx, 'conversionShare', e.target.value)} onBlur={e => handleRelatedKeywordChange(idx, 'conversionShare', formatPercentage(e.target.value))} className="w-full font-bold outline-none text-center bg-transparent" /></td>
                          <td className="p-1 border border-slate-200 text-center">
                            <button onClick={() => handleRemoveRelatedKeyword(idx)} className="opacity-30 group-hover:opacity-100 text-red-500 hover:text-white transition-all w-7 h-7 rounded-md hover:bg-red-500 flex items-center justify-center m-auto">
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-100 font-black">
                        <td colSpan={2} className="p-3 border border-slate-300 text-center text-lg tracking-wider text-slate-900">Total / Avg</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topRelatedKeywordsTotal.searchVolume}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topRelatedKeywordsTotal.salesMonthly}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topRelatedKeywordsTotal.competingProducts}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topRelatedKeywordsTotal.titleDensity}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topRelatedKeywordsTotal.clickShare}</td>
                        <td className="p-2 border border-slate-300 text-center text-slate-800">{report.topRelatedKeywordsTotal.conversionShare}</td>
                        <td className="border-r border-slate-300 bg-slate-100"></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-6 flex justify-end gap-4">
                    <button onClick={handleClearKeywords} className="bg-white text-rose-600 border border-rose-200 px-6 py-3 rounded-xl font-black text-sm flex items-center gap-3 hover:bg-rose-50 transition-all shadow-sm hover:shadow-md">
                      <i className="fa-solid fa-trash-can"></i>
                      CLEAR ALL
                    </button>
                    <button onClick={handleAddRelatedKeyword} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                      <i className="fa-solid fa-plus"></i>
                      ADD ROW
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 6: Review Analysis */}
              <div id="section-6" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">6</span>
                  Review Analysis
                </h2>
                <div className="p-4 rounded-[1.5rem] bg-indigo-50/20 border border-indigo-100 space-y-4">
                  {/* Smart Paste Block */}
                  <div className="mb-6 bg-white/60 p-6 rounded-2xl border border-indigo-100/50 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-black text-indigo-600 uppercase tracking-widest leading-none">Smart Data Paste</label>
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Enter all fields in one shot to save time</span>
                      </div>
                    </div>
                    <textarea
                      rows={6}
                      name="reviewAnalysisPasteText"
                      value={report.reviewAnalysisPasteText}
                      className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl font-bold outline-none text-[13px] leading-relaxed placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-inner"
                      placeholder="KEY INSIGHTS: ...&#10;POSITIVE DRIVERS: ...&#10;IMPROVEMENT AREAS: ...&#10;MARKET SIGNAL: ...&#10;OPPORTUNITY INSIGHT: ..."
                      onChange={(e) => {
                        const text = e.target.value;
                        const headerMap: Record<string, string[]> = {
                          keyInsights: ["KEY INSIGHTS", "Key Insight"],
                          positiveDrivers: ["POSITIVE DRIVERS", "Positive Driver"],
                          improvementAreas: ["IMPROVEMENT AREAS", "Improvement Area"],
                          marketSignal: ["MARKET SIGNAL", "Market Signal"],
                          opportunityInsight: ["OPPORTUNITY INSIGHT", "Opportunity Insight"],
                        };

                        const lowerText = text.toLowerCase();
                        const updates: any = { reviewAnalysisPasteText: text };

                        Object.entries(headerMap).forEach(([field, headers]) => {
                          let startIdx = -1;
                          let matchedLen = 0;

                          for (const h of headers) {
                            const idx = lowerText.indexOf(h.toLowerCase());
                            if (idx !== -1) {
                              startIdx = idx;
                              matchedLen = h.length;
                              break;
                            }
                          }

                          if (startIdx !== -1) {
                            let endIdx = text.length;
                            // Find the next closest header
                            Object.values(headerMap).flat().forEach(h => {
                              const otherIdx = lowerText.indexOf(h.toLowerCase(), startIdx + matchedLen);
                              if (otherIdx !== -1 && otherIdx < endIdx) {
                                endIdx = otherIdx;
                              }
                            });

                            let segment = text.slice(startIdx + matchedLen, endIdx).trim();
                            if (segment.startsWith(':')) segment = segment.slice(1).trim();
                            if (segment) updates[field] = segment;
                          }
                        });

                        setReport(prev => ({ ...prev, ...updates }));
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Key Insights" icon="fa-key">
                      <input type="text" name="keyInsights" value={report.keyInsights} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" placeholder="Enter key insights..." />
                    </InputGroup>
                    <InputGroup label="Positive Drivers" icon="fa-arrow-trend-up">
                      <input type="text" name="positiveDrivers" value={report.positiveDrivers} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" placeholder="Enter positive drivers..." />
                    </InputGroup>
                    <InputGroup label="Improvement Areas" icon="fa-wrench">
                      <input type="text" name="improvementAreas" value={report.improvementAreas} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" placeholder="Enter improvement areas..." />
                    </InputGroup>
                    <InputGroup label="Market Signal" icon="fa-satellite-dish">
                      <input type="text" name="marketSignal" value={report.marketSignal} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" placeholder="Enter market signal..." />
                    </InputGroup>
                    <InputGroup label="Opportunity Insight" icon="fa-lightbulb">
                      <input type="text" name="opportunityInsight" value={report.opportunityInsight} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" placeholder="Enter opportunity insight..." />
                    </InputGroup>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 7: Niche Analysis */}
              <div id="section-7" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">7</span>
                  Niche Analysis
                </h2>
                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8">
                  {/* Smart Paste Block for Niche Analysis */}
                  <div className="mb-6 bg-white/60 p-6 rounded-2xl border border-slate-200/50 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                        <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-none">Smart Data Paste (NICHE)</label>
                        <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Enter Description, Insights, and Signals in one shot</span>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      name="nicheAnalysisPasteText"
                      value={report.nicheAnalysisPasteText}
                      className="w-full px-5 py-4 bg-white/80 border border-slate-200 rounded-2xl font-bold outline-none text-[13px] leading-relaxed placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-inner"
                      placeholder="NICHE DESCRIPTION: ...&#10;NICHE KEY INSIGHTS: ...&#10;OPPORTUNITY SIGNAL: ..."
                      onChange={(e) => {
                        const text = e.target.value;
                        const headerMap: Record<string, string[]> = {
                          nicheDescription: ["NICHE DESCRIPTION", "Description"],
                          nicheKeyInsights: ["NICHE KEY INSIGHTS", "Key Insights"],
                          nicheOpportunitySignal: ["OPPORTUNITY SIGNAL", "Opportunity Signal", "Opportunity Insight"],
                        };

                        const lowerText = text.toLowerCase();
                        const updates: any = { nicheAnalysisPasteText: text };

                        Object.entries(headerMap).forEach(([field, headers]) => {
                          let startIdx = -1;
                          let matchedLen = 0;

                          for (const h of headers) {
                            const idx = lowerText.indexOf(h.toLowerCase());
                            if (idx !== -1) {
                              startIdx = idx;
                              matchedLen = h.length;
                              break;
                            }
                          }

                          if (startIdx !== -1) {
                            let endIdx = text.length;
                            // Find the next closest header
                            Object.values(headerMap).flat().forEach(h => {
                              const otherIdx = lowerText.indexOf(h.toLowerCase(), startIdx + matchedLen);
                              if (otherIdx !== -1 && otherIdx < endIdx) {
                                endIdx = otherIdx;
                              }
                            });

                            let segment = text.slice(startIdx + matchedLen, endIdx).trim();
                            if (segment.startsWith(':')) segment = segment.slice(1).trim();
                            if (segment) updates[field] = segment;
                          }
                        });

                        setReport(prev => ({ ...prev, ...updates }));
                      }}
                    />
                  </div>

                  <div className="space-y-6">
                    <InputGroup label="Niche Description" icon="fa-align-left">
                      <textarea name="nicheDescription" value={report.nicheDescription} onChange={handleInputChange} rows={3} placeholder="Enter description..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                    </InputGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputGroup label="Key Insights" icon="fa-key">
                        <textarea name="nicheKeyInsights" value={report.nicheKeyInsights} onChange={handleInputChange} rows={3} placeholder="Enter key insights..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                      </InputGroup>
                      <InputGroup label="Opportunity Signal" icon="fa-chart-pie">
                        <textarea name="nicheOpportunitySignal" value={report.nicheOpportunitySignal} onChange={handleInputChange} rows={3} placeholder="Enter opportunity signals..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 8: Profitability & Unit Economics */}
              <div id="section-8" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">8</span>
                  Profitability & Unit Economics
                </h2>
                <div className="p-4 rounded-[1.5rem] bg-indigo-50/20 border border-indigo-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup label="Target Selling Price" icon="fa-tag">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="targetSellingPrice" value={report.targetSellingPrice} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                    <InputGroup label="Product Cost (Factory)" icon="fa-industry">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="productCostFactory" value={report.productCostFactory} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                    <InputGroup label="Shipping Cost (Sea)" icon="fa-ship">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="shippingCostSea" value={report.shippingCostSea} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                    <InputGroup label="Initial Investment" icon="fa-coins">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="initialInvestment" value={report.initialInvestment} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                    <InputGroup label="Estimated Units Purchased (Calculated)" icon="fa-boxes-stacked">
                      <div className="relative">
                        <input type="number" name="estimatedUnitsPurchased" value={report.estimatedUnitsPurchased} onChange={handleInputChange} readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold italic text-indigo-600 cursor-not-allowed" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto</div>
                      </div>
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputGroup label="Amazon Referral Fee" icon="fa-amazon">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="amazonReferralFee" value={report.amazonReferralFee} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                    <InputGroup label="Amazon FBA Fees" icon="fa-box">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="amazonFbaFees" value={report.amazonFbaFees} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                    <InputGroup label="PPC Cost per Unit" icon="fa-bullseye">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input type="number" name="ppcCostEstimate" value={report.ppcCostEstimate} onChange={handleInputChange} className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                      </div>
                    </InputGroup>
                  </div>

                  <div className="mt-8 p-6 bg-indigo-600 rounded-[2rem] shadow-xl text-white">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 divide-x divide-indigo-500/50">
                      <div className="text-center">
                        <span className="block text-[11px] font-black uppercase tracking-widest text-indigo-200 mb-2">Total Cost / Unit</span>
                        <div className="text-2xl font-black">${report.totalCostPerUnit}</div>
                      </div>
                      <div className="text-center">
                        <span className="block text-[11px] font-black uppercase tracking-widest text-emerald-200 mb-2">Net Profit / Unit</span>
                        <div className="text-2xl font-black text-emerald-300">${report.netProfitPerUnit}</div>
                      </div>
                      <div className="text-center">
                        <span className="block text-[11px] font-black uppercase tracking-widest text-amber-200 mb-2">Net Margin</span>
                        <div className="text-2xl font-black text-amber-300">{report.netMarginPercentage}%</div>
                      </div>
                      <div className="text-center border-r border-indigo-500/50">
                        <span className="block text-[11px] font-black uppercase tracking-widest text-blue-200 mb-2">ROI</span>
                        <div className="text-2xl font-black text-blue-300">{report.roiPercentage}%</div>
                      </div>
                      <div className="text-center border-r border-indigo-500/50">
                        <span className="block text-[11px] font-black uppercase tracking-widest text-indigo-100 mb-2">Breakeven</span>
                        <div className="text-2xl font-black text-white">{breakevenUnits} <span className="text-sm opacity-50 font-normal">units</span></div>
                      </div>
                      <div className="text-center">
                        <span className="block text-[11px] font-black uppercase tracking-widest text-indigo-100 mb-2">Risk Flag</span>
                        <div className={`text-xl font-black ${riskInfo.color}`}>{riskInfo.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 9: Product Qualification Checklist */}
              <div id="section-9" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">9</span>
                  Product Qualification Checklist
                </h2>
                <div className="p-4 rounded-[1.5rem] bg-rose-50/20 border border-rose-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'isNonSeasonal', label: 'Stable, non-seasonal demand' },
                      { name: 'isNotFragile', label: 'Low fragility and return risk' },
                      { name: 'isNotRestricted', label: 'Ungated and unrestricted category' },
                      { name: 'isTargetPriceInRange', label: 'Target price within desired range ($25 - $50)' },
                      { name: 'isReasonableSizeWeight', label: 'FBA-friendly size and weight' },
                      { name: 'isLowIPRisk', label: 'Low IP/Trademark/Patent risk' },
                      { name: 'isClearDifferentiation', label: 'Clear differentiation opportunity' },
                      { name: 'isNoCertificationRequired', label: 'No major certification requirements' }
                    ].map((item) => (
                      <label key={item.name} className="flex items-center gap-4 p-4 bg-white border border-rose-100 rounded-2xl cursor-pointer hover:bg-rose-50 transition-all">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={(report as any)[item.name]}
                          onChange={handleCheckboxChange}
                          className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>



              {/* Section 10: Opportunity Indicators */}
              <div id="section-10" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">10</span>
                  Opportunity Indicators
                </h2>
                <div className="p-8 rounded-[2.5rem] bg-indigo-50/20 border border-indigo-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'isStrongSearchDemand', label: 'Strong search demand' },
                      { name: 'isRecentSuccessfulLaunches', label: 'Recent successful product launches' },
                      { name: 'isNewSellersTraction', label: 'Multiple new sellers are gaining traction' },
                      { name: 'isFragmentedCompetition', label: 'Fragmented competition' },
                      { name: 'isLowReviewBarrier', label: 'Low review barrier' },
                      { name: 'isWeakCompetitorListings', label: 'Weak competitor listings (SEO & images)' },
                      { name: 'isQualityComplaintsFound', label: 'Quality complaints in customer reviews' },
                      { name: 'isOverpricedCompetitors', label: 'Overpriced competitors' },
                      { name: 'isClearImprovementOpp', label: 'Clear product improvement opportunities' },
                      { name: 'isHealthyPriceRange', label: 'Healthy price range supporting margins' }
                    ].map((item) => (
                      <label key={item.name} className="flex items-center gap-4 p-4 bg-white border border-indigo-100 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-all">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={(report as any)[item.name]}
                          onChange={handleCheckboxChange}
                          className="w-5 h-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 11: Risk Indicators */}
              <div id="section-11" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">11</span>
                  Risk Indicators
                </h2>
                <div className="p-4 rounded-[1.5rem] bg-rose-50/20 border border-rose-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'riskReviewBarrier', label: 'High review barrier' },
                      { name: 'riskBrandPresence', label: 'Dominant brand presence' },
                      { name: 'riskMarketSaturation', label: 'Market saturation risk' },
                      { name: 'riskProfitMargins', label: 'Thin profit margins' },
                      { name: 'riskPriceWar', label: 'Price war risk' },
                      { name: 'riskManufacturing', label: 'Complex manufacturing' },
                      { name: 'riskReturnRate', label: 'High return rate risk' },
                      { name: 'riskPatentIP', label: 'Patent / IP risk' },
                      { name: 'riskCategoryGating', label: 'Category gating' },
                      { name: 'riskCertifications', label: 'Certification requirements' },
                      { name: 'riskSeasonality', label: 'Seasonality risk' },
                      { name: 'riskPPCCost', label: 'High PPC cost' }
                    ].map((item) => (
                      <label key={item.name} className="flex items-center gap-4 p-4 bg-white border border-rose-100 rounded-2xl cursor-pointer hover:bg-rose-50 transition-all">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={(report as any)[item.name]}
                          onChange={handleCheckboxChange}
                          className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-sm font-bold text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 12: Execution Strategy */}
              <div id="section-12" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">12</span>
                  Execution Strategy
                </h2>
                <div className="p-4 rounded-[1.5rem] bg-indigo-50/20 border border-indigo-100 space-y-4">
                  <InputGroup label="1. Keyword Indexing & Ranking" icon="fa-magnifying-glass-location">
                    <textarea name="execPPCStrategy" value={report.execPPCStrategy} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                  </InputGroup>
                  <InputGroup label="2. Conversion Optimization" icon="fa-chart-line-up">
                    <textarea name="execConversionOpt" value={report.execConversionOpt} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                  </InputGroup>
                  <InputGroup label="3. Differentiation & Positioning" icon="fa-bullseye-arrow">
                    <textarea name="execPositioning" value={report.execPositioning} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                  </InputGroup>
                  <InputGroup label="4. Early Reviews & Social Proof" icon="fa-star-shooting">
                    <textarea name="execEarlyReviews" value={report.execEarlyReviews} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                  </InputGroup>
                  <InputGroup label="5. Launch Pricing Strategy" icon="fa-tag">
                    <textarea name="execPricingStrategy" value={report.execPricingStrategy} onChange={handleInputChange} rows={2} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" />
                  </InputGroup>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 13: Data Validation */}
              <div id="section-13" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">13</span>
                  Data Validation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center truncate">1. Keepa Data Historical</label>
                    <ImageDropzone
                      label="Keepa Data History"
                      currentImage={report.keepaImageUrl}
                      onUpload={(data) => updateImageField('keepaImageUrl', data)}
                      className="h-48"
                      icon="fa-chart-line"
                    />
                    <input type="text" name="keepaNotes" value={report.keepaNotes} onChange={handleInputChange} placeholder="Notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center truncate">2. Helium10 Data History</label>
                    <ImageDropzone
                      label="Helium10 Data History"
                      currentImage={report.helium10ImageUrl}
                      onUpload={(data) => updateImageField('helium10ImageUrl', data)}
                      className="h-48"
                      icon="fa-flask"
                    />
                    <input type="text" name="helium10Notes" value={report.helium10Notes} onChange={handleInputChange} placeholder="Notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center truncate">3. Search Volume History</label>
                    <ImageDropzone
                      label="Search Volume History"
                      currentImage={report.searchVolumeImageUrl}
                      onUpload={(data) => updateImageField('searchVolumeImageUrl', data)}
                      className="h-48"
                      icon="fa-arrow-trend-up"
                    />
                    <input type="text" name="searchVolumeNotes" value={report.searchVolumeNotes} onChange={handleInputChange} placeholder="Notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center truncate">4. Xray Product Research</label>
                    <ImageDropzone
                      label="Xray Product Research"
                      icon="fa-magnifying-glass"
                      currentImage={report.xrayProductResearchImageUrl}
                      onUpload={(data) => updateImageField('xrayProductResearchImageUrl', data)}
                      className="h-48"
                    />
                    <input type="text" name="xrayProductResearchNotes" value={report.xrayProductResearchNotes} onChange={handleInputChange} placeholder="Notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center truncate">5. Amazon Search Data</label>
                    <ImageDropzone
                      label="Amazon Search Data"
                      icon="fa-magnifying-glass-chart"
                      currentImage={report.amazonSearchDataImageUrl}
                      onUpload={(data) => updateImageField('amazonSearchDataImageUrl', data)}
                      className="h-48"
                    />
                    <input type="text" name="amazonSearchDataNotes" value={report.amazonSearchDataNotes} onChange={handleInputChange} placeholder="Notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block text-center truncate">6. Others</label>
                    <ImageDropzone
                      label="Others"
                      icon="fa-folder-open"
                      currentImage={report.othersImageUrl}
                      onUpload={(data) => updateImageField('othersImageUrl', data)}
                      className="h-48"
                    />
                    <input type="text" name="othersNotes" value={report.othersNotes} onChange={handleInputChange} placeholder="Notes..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 14: Reference Links */}
              <div id="section-14" className="scroll-mt-24">
                <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">14</span>
                  Reference & Sourcing Links
                </h2>
                <div className="space-y-4">
                  {[
                    { title: "Amazon Approval Required", subtitle: "Direct Policy Reference Link", url: "https://sellercentral.amazon.com/help/hub/reference/external/G200333160", icon: "fa-shield-halved", color: "amber" },
                    { title: "Restricted products", subtitle: "Amazon Policy", url: "https://sellercentral.amazon.com/help/hub/reference/G200164330", icon: "fa-ban", color: "rose" },
                    { title: "Overview of categories", subtitle: "Amazon Policy", url: "https://sellercentral.amazon.com/help/hub/reference/G200332540", icon: "fa-layer-group", color: "blue" },
                    { title: "Product & Listing Restrictions", subtitle: "Amazon Policy", url: "https://sellercentral.amazon.com/help/hub/reference/G200301050", icon: "fa-list-check", color: "emerald" },
                    { title: "Amazon Restricted Products Guide", subtitle: "Seller Assistant Guide", url: "https://www.sellerassistant.app/blog/amazon-restricted-products-complete-guide-for-sellers/?utm_source=chatgpt.com", icon: "fa-book-open", color: "indigo" },
                    { title: "How to Get Approved Guide", subtitle: "Jungle Scout Guide", url: "https://www.junglescout.com/resources/articles/amazon-restricted-categories-2/?utm_source=chatgpt.com", icon: "fa-graduation-cap", color: "orange" }
                  ].map((link, i) => (
                    <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between group hover:bg-slate-800 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-${link.color}-500/10 flex items-center justify-center text-${link.color}-500`}>
                          <i className={`fa-solid ${link.icon} text-xs`}></i>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">{link.title}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">{link.subtitle}</p>
                        </div>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 bg-${link.color}-500 text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-${link.color}-400 transition-all active:scale-95 flex items-center gap-2`}
                      >
                        Open <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    </div>
                  ))}

                  <InputGroup label="Amazon Product URL" icon="fa-brands fa-amazon">
                    <input type="url" name="amazonProductUrl" value={report.amazonProductUrl} onChange={handleInputChange} placeholder="https://www.amazon.com/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-base" />
                  </InputGroup>
                  <InputGroup label="Supplier URL (Alibaba, etc.)" icon="fa-industry">
                    <input type="url" name="supplierUrl" value={report.supplierUrl} onChange={handleInputChange} placeholder="https://www.alibaba.com/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-base" />
                  </InputGroup>
                  <InputGroup label="Competitor URLs" icon="fa-users-between-lines">
                    <div className="flex gap-2 mb-2">
                      <input type="url" value={newCompetitorUrl} onChange={(e) => setNewCompetitorUrl(e.target.value)} placeholder="Add competitor link..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-base" />
                      <button onClick={addCompetitorUrl} className="px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Add</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {report.competitorUrls.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 p-2 rounded-xl shadow-sm">
                          <span className="text-xs text-slate-600 truncate max-w-[80%]">{url}</span>
                          <button onClick={() => removeCompetitorUrl(idx)} className="text-rose-500 hover:text-rose-700 p-1"><i className="fa-solid fa-trash-can text-sm"></i></button>
                        </div>
                      ))}
                    </div>
                  </InputGroup>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4 justify-center">
                <div className="flex gap-4">
                  <button onClick={triggerImportClick} className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-black uppercase tracking-[0.1em] flex items-center gap-2 transition-all">
                    <i className="fa-solid fa-file-import"></i> Import Data (JSON)
                  </button>
                  <button onClick={exportJSON} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-[0.1em] flex items-center gap-2 transition-all">
                    <i className="fa-solid fa-file-export"></i> Export Data (JSON)
                  </button>
                </div>
                <button onClick={exportCSV} className="text-slate-400 hover:text-slate-600 transition-all text-xs font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                  <i className="fa-solid fa-file-csv"></i> Export Raw CSV Data
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto print:max-w-none print:p-0 print:m-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="print-container">
              <ReportPreview report={report} />
            </div>
            <div className="mt-12 flex justify-center no-print pb-24">
              <button onClick={() => setActiveTab('edit')} className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-black uppercase tracking-[0.2em] hover:shadow-2xl transition-all flex items-center gap-4 scale-110">
                <i className="fa-solid fa-arrow-left"></i> Back to Editor
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Keyword Winner Internal Tool • Exclusive Use Only</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
