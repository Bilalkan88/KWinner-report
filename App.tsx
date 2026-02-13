
import React, { useState, useEffect } from 'react';
import { KeywordReport, SellerLevel, CompetitionLevel, AIAnalysis, Eligibility, DemandType, TrendStatus, RankingDifficulty } from './types';
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

const PREDEFINED_ISSUES = [
  "Weak Listings",
  "Low Review Count",
  "Poor Review Quality",
  "Weak Branding",
  "Limited Variations",
  "Images",
  "Pricing",
  "Quality",
  "Product Not as Described"
];

const COMPETITOR_ISSUE_TEMPLATES: Record<string, string> = {
  "Weak Listings": "Most top competitors have weak listings with limited images and unclear product benefits, creating an opportunity for better optimization through superior content.",
  "Low Review Count": "The niche shows a low average review count among top sellers, lowering the barrier to entry for new products with a strong initial launch.",
  "Poor Review Quality": "Several competitors receive repeated complaints about product quality or poor customer service, which can be addressed with improved materials and clearer descriptions.",
  "Weak Branding": "Current competitors lack a cohesive brand identity, providing an opportunity for a professional brand to build trust and long-term customer loyalty.",
  "Limited Variations": "There is a noticeable lack of product variations (sizes/colors) in the current landscape, allowing a new seller to capture missed market segments.",
  "Images": "Competitor images are low-quality or lack lifestyle context, providing a clear path to win through superior visual marketing.",
  "Pricing": "Current market pricing is inconsistent or overpriced for the value offered, allowing for a more competitive entry strategy.",
  "Quality": "Many competitors suffer from poor review quality, with customers highlighting specific pain points that can be addressed through better product design.",
  "Product Not as Described": "Competitors frequently fail to meet customer expectations, which can be mitigated with transparent and accurate listing details."
};

const EXCLUSIVE_LOGIC_OPTIONS = [
  { label: "High Demand + Low Review Gap", value: "This keyword combines strong buyer demand with low review competition, making it easier to generate sales without heavy ad spend." },
  { label: "Healthy Price Range", value: "The typical price range supports healthy margins, enabling profitability without relying solely on price competition." },
  { label: "Sales-Proven but Underserved", value: "Existing products are generating sales, but the market is not fully optimized, leaving room for a better product to capture demand." },
  { label: "Low PPC Pressure", value: "Competition for ads is relatively low, which helps reduce advertising costs and improves overall profitability." },
  { label: "Simple Differentiation = Higher Conversion", value: "Small product improvements can significantly increase conversion rates, leading to higher profit per sale." },
  { label: "Consistent (Non-Seasonal) Demand", value: "Demand for this keyword is consistent throughout the year, providing stable sales and predictable revenue." },
  { label: "Low Return Potential", value: "The product type associated with this keyword has a low return rate, helping protect margins and reduce hidden costs." },
  { label: "Operational Simplicity", value: "The product is easy to ship and store, which lowers fulfillment costs and improves net profit." }
];

const RISK_TEMPLATES: Record<string, string> = {
  "Fragile": "This product may face a fragility risk, meaning extra care is needed in packaging to avoid damage during shipping.",
  "High Shipping Cost": "High shipping costs due to size or weight may impact margins; efficient logistics and optimized packaging are critical.",
  "High Return": "The main risk is high return potential if product size or expectations are not clearly communicated in the listing.",
  "Quality Sensitivity": "Quality sensitivity is high; any deviation from the promised standard will likely lead to negative reviews and lost sales.",
  "Seasonality": "This is a highly seasonal market; demand fluctuations require precise inventory management to avoid stockouts or overstocking.",
  "Size / Fit": "Sizing and fitment issues are common in this category, leading to higher-than-average return rates if not clearly addressed.",
  "Price Competition": "Intense price competition may lead to thin margins; success depends on building a strong brand or unique feature set.",
  "Supplier Dependency": "Heavy reliance on a single supplier poses a risk of production delays or sudden cost increases.",
  "Branding Difficulty": "Strong brand loyalty among competitors makes entry difficult; a significant launch budget is required for market penetration."
};

const OWNERSHIP_OPTIONS = [
  { label: "Saves Time", value: "Reduces weeks of keyword research by providing a ready-to-use opportunity." },
  { label: "Faster Market Entry", value: "Enables quicker product launch by removing uncertainty." },
  { label: "Clear Direction", value: "Helps the seller focus on one strong opportunity instead of many weak ones." },
  { label: "Full Strategic Control", value: "Gives full control over positioning, pricing, and launch strategy." }
];

const ADVANTAGE_OPTIONS = [
  { label: "Strong Demand", value: "Clear and consistent demand from buyers searching for this product ensures a solid foundation for sales." },
  { label: "Low Competition", value: "Relatively few competitors are fighting for visibility, making market entry significantly easier and more cost-effective." },
  { label: "Sales-Proven Market", value: "Existing products are already generating consistent sales, validating the market's appetite for this solution." },
  { label: "Low Review Competition", value: "Top competitors have low or weak review profiles, allowing a high-quality product to quickly gain authority." },
  { label: "Healthy Price & Margin", value: "The price range allows room for highly profitable margins while staying attractive to consumers." },
  { label: "Easy to Differentiate", value: "Simple improvements or unique features can clearly set a new product apart from the current options." },
  { label: "Beginner Friendly", value: "Suitable for new sellers with manageable complexity and low operational overhead." },
  { label: "Fast Market Validation", value: "Allows quick testing through targeted ads or small initial inventory batches." }
];

const REPORT_INDEX_KEY = 'KW_LAST_REPORT_INDEX';

const generateReportNumber = (index: number) => {
  const paddedIndex = String(index).padStart(3, '0');
  return `KW-2026-${paddedIndex}`;
};

const INITIAL_REPORT: KeywordReport = {
  reportNumber: '', 
  keyword: '',
  category: CATEGORIES[0],
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
  exclusiveReason: '',
  exclusiveLogicTags: [],
  ownershipValue: '',
  ownershipValueTags: [],
  keyAdvantage: '',
  keyAdvantageTags: [],
  mainRisk: '',
  mainRiskTags: [],
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
  keepaImageUrl: '',
  keepaNotes: '',
  helium10ImageUrl: '',
  helium10Notes: '',
  searchVolumeImageUrl: '',
  searchVolumeNotes: '',
  competitorIssues: [],
  competitorAnalysis: ''
};

const App: React.FC = () => {
  const [report, setReport] = useState<KeywordReport>(INITIAL_REPORT);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('');
  const [newRelatedKeyword, setNewRelatedKeyword] = useState('');

  useEffect(() => {
    const lastIndex = localStorage.getItem(REPORT_INDEX_KEY);
    const nextIndex = lastIndex ? parseInt(lastIndex, 10) : 1;
    setReport(prev => ({ ...prev, reportNumber: generateReportNumber(nextIndex) }));
  }, []);

  useEffect(() => {
    const sellingPrice = report.sellingPrice || 0;
    const costPrice = report.estimatedCostPrice || 0;
    const sales = report.estimatedMonthlySales || 0;
    const calculatedProfit = Math.round((sellingPrice - costPrice) * sales);
    if (report.estimatedMonthlyProfit !== calculatedProfit) {
      setReport(prev => ({ ...prev, estimatedMonthlyProfit: calculatedProfit }));
    }
  }, [report.sellingPrice, report.estimatedCostPrice, report.estimatedMonthlySales]);

  const incrementReportNumber = () => {
    const lastIndex = localStorage.getItem(REPORT_INDEX_KEY);
    const currentIndex = lastIndex ? parseInt(lastIndex, 10) : 1;
    const nextIndex = currentIndex + 1;
    localStorage.setItem(REPORT_INDEX_KEY, String(nextIndex));
    setReport(prev => ({ ...prev, reportNumber: generateReportNumber(nextIndex) }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumeric = [
      'opportunityScore', 
      'monthlySearchVolume', 
      'estimatedMonthlySales', 
      'competitorsCount',
      'sellingPrice',
      'estimatedCostPrice',
      'estimatedMonthlyProfit',
      'sellersWithKeywordInTitle',
      'bsr',
      'fbaSellersCount',
      'fbmSellersCount'
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

  const toggleIssue = (issue: string) => {
    setReport(prev => {
      const isAlreadySelected = prev.competitorIssues.includes(issue);
      const newIssues = isAlreadySelected
        ? prev.competitorIssues.filter(i => i !== issue)
        : [...prev.competitorIssues, issue];
      
      let newAnalysis = prev.competitorAnalysis;
      const template = COMPETITOR_ISSUE_TEMPLATES[issue];
      if (template) {
        if (!isAlreadySelected) {
          newAnalysis = newAnalysis ? `${newAnalysis}\n\n${template}` : template;
        } else {
          newAnalysis = newAnalysis.replace(template, '').replace(/\n\n\n/g, '\n\n').trim();
        }
      }

      return {
        ...prev,
        competitorIssues: newIssues,
        competitorAnalysis: newAnalysis
      };
    });
  };

  const toggleExclusiveReason = (optionLabel: string) => {
    setReport(prev => {
      const isAlreadySelected = prev.exclusiveLogicTags.includes(optionLabel);
      const newTags = isAlreadySelected
        ? prev.exclusiveLogicTags.filter(t => t !== optionLabel)
        : [...prev.exclusiveLogicTags, optionLabel];
      
      const option = EXCLUSIVE_LOGIC_OPTIONS.find(o => o.label === optionLabel);
      let newReason = prev.exclusiveReason;
      if (option) {
        if (!isAlreadySelected) {
          newReason = newReason ? `${newReason}\n\n${option.value}` : option.value;
        } else {
          newReason = newReason.replace(option.value, '').replace(/\n\n\n/g, '\n\n').trim();
        }
      }

      return {
        ...prev,
        exclusiveLogicTags: newTags,
        exclusiveReason: newReason
      };
    });
  };

  const toggleKeyAdvantage = (optionLabel: string) => {
    setReport(prev => {
      const isAlreadySelected = prev.keyAdvantageTags.includes(optionLabel);
      const newTags = isAlreadySelected
        ? prev.keyAdvantageTags.filter(t => t !== optionLabel)
        : [...prev.keyAdvantageTags, optionLabel];
      
      const option = ADVANTAGE_OPTIONS.find(o => o.label === optionLabel);
      let newAdvantage = prev.keyAdvantage;
      if (option) {
        if (!isAlreadySelected) {
          newAdvantage = newAdvantage ? `${newAdvantage}\n\n${option.value}` : option.value;
        } else {
          newAdvantage = newAdvantage.replace(option.value, '').replace(/\n\n\n/g, '\n\n').trim();
        }
      }

      return {
        ...prev,
        keyAdvantageTags: newTags,
        keyAdvantage: newAdvantage
      };
    });
  };

  const toggleOwnershipValue = (optionLabel: string) => {
    setReport(prev => {
      const isAlreadySelected = prev.ownershipValueTags.includes(optionLabel);
      const newTags = isAlreadySelected
        ? prev.ownershipValueTags.filter(t => t !== optionLabel)
        : [...prev.ownershipValueTags, optionLabel];
      
      const option = OWNERSHIP_OPTIONS.find(o => o.label === optionLabel);
      let newOwnership = prev.ownershipValue;
      if (option) {
        if (!isAlreadySelected) {
          newOwnership = newOwnership ? `${newOwnership}\n\n${option.value}` : option.value;
        } else {
          newOwnership = newOwnership.replace(option.value, '').replace(/\n\n\n/g, '\n\n').trim();
        }
      }

      return {
        ...prev,
        ownershipValueTags: newTags,
        ownershipValue: newOwnership
      };
    });
  };

  const toggleMainRisk = (riskKey: string) => {
    setReport(prev => {
      const isAlreadySelected = prev.mainRiskTags.includes(riskKey);
      const newTags = isAlreadySelected
        ? prev.mainRiskTags.filter(t => t !== riskKey)
        : [...prev.mainRiskTags, riskKey];
      
      const template = RISK_TEMPLATES[riskKey];
      let newRiskNarrative = prev.mainRisk;
      if (template) {
        if (!isAlreadySelected) {
          newRiskNarrative = newRiskNarrative ? `${newRiskNarrative}\n\n${template}` : template;
        } else {
          newRiskNarrative = newRiskNarrative.replace(template, '').replace(/\n\n\n/g, '\n\n').trim();
        }
      }

      return {
        ...prev,
        mainRiskTags: newTags,
        mainRisk: newRiskNarrative
      };
    });
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

  const handlePrint = () => {
    setActiveTab('preview');
    const oldTitle = document.title;
    const safeKeyword = (report.keyword || 'Analysis').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    document.title = `KW_Report_${safeKeyword}_${report.reportNumber}`;
    setTimeout(() => {
      try {
        window.print();
        document.title = oldTitle;
        setTimeout(() => {
          if (window.confirm("Report exported successfully. Would you like to increment the Report ID for the next analysis?")) {
            incrementReportNumber();
          }
        }, 1000);
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
            <button 
              onClick={handlePrint} 
              className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
            >
              <i className="fa-solid fa-file-pdf"></i> Save & Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {activeTab === 'edit' ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-8">
              {/* Section 1: Core Identity */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-base">1</span>
                  Core Identity & Visuals
                </h2>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-[280px] shrink-0">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Product Showcase Image</label>
                    <ImageDropzone 
                      label="Product Showcase" 
                      icon="fa-camera" 
                      currentImage={report.productImageUrl} 
                      onUpload={(data) => updateImageField('productImageUrl', data)} 
                      className="h-[280px] shadow-sm border-2 rounded-[2.5rem]"
                    />
                  </div>
                  
                  <div className="flex-1 w-full space-y-5 pt-6">
                    <InputGroup label="Target Keyword" icon="fa-key">
                      <input type="text" name="keyword" value={report.keyword} onChange={handleInputChange} placeholder="e.g. Bamboo Toothbrush" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all font-black text-lg text-slate-900" />
                    </InputGroup>
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
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 2: Reference Links */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-base">2</span>
                  Reference & Sourcing Links
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between group hover:bg-slate-800 transition-all mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white uppercase tracking-widest">Amazon Approval Required</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Direct Policy Reference Link</p>
                      </div>
                    </div>
                    <a 
                      href="https://sellercentral.amazon.com/help/hub/reference/external/G200333160" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 flex items-center gap-2"
                    >
                      Open Reference <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                  </div>

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

              <div className="h-px bg-slate-100"></div>

              {/* Section 3: Market Evidence */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-base">3</span>
                  Market Analysis Proof
                </h2>
                <div className="flex flex-col gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">1. Keepa Data Historical (Target)</label>
                    <ImageDropzone 
                      label="Keepa Data Historical" 
                      currentImage={report.keepaImageUrl} 
                      onUpload={(data) => updateImageField('keepaImageUrl', data)} 
                      className="h-64"
                      icon="fa-chart-line"
                    />
                    <input type="text" name="keepaNotes" value={report.keepaNotes} onChange={handleInputChange} placeholder="Keepa analysis summary..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">2. Helium10 Xray (Context)</label>
                    <ImageDropzone 
                      label="Helium10 Xray" 
                      currentImage={report.helium10ImageUrl} 
                      onUpload={(data) => updateImageField('helium10ImageUrl', data)} 
                      className="h-64"
                      icon="fa-flask"
                    />
                    <input type="text" name="helium10Notes" value={report.helium10Notes} onChange={handleInputChange} placeholder="Helium10 Xray summary..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">3. Search Volume History</label>
                    <ImageDropzone 
                      label="Search Volume History" 
                      icon="fa-arrow-trend-up" 
                      currentImage={report.searchVolumeImageUrl} 
                      onUpload={(data) => updateImageField('searchVolumeImageUrl', data)} 
                      className="h-64"
                    />
                    <input type="text" name="searchVolumeNotes" value={report.searchVolumeNotes} onChange={handleInputChange} placeholder="Search volume summary..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 4: Metrics */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-base">4</span>
                  Market & Financial Metrics
                </h2>
                <div className="mb-6 p-8 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="ELIGIBILITY TO SELL" icon="fa-shield-check">
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {Object.values(Eligibility).map((el) => (
                          <button key={el} type="button" onClick={() => setReport(r => ({ ...r, eligibility: el }))} className={`py-4 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${report.eligibility === el ? (el === Eligibility.ELIGIBLE ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : el === Eligibility.NOT_ELIGIBLE ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-orange-500 border-orange-500 text-white shadow-lg') : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>{el}</button>
                        ))}
                      </div>
                    </InputGroup>

                    <div className="space-y-6">
                      <InputGroup label="Demand Type" icon="fa-calendar-check">
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {Object.values(DemandType).map((dt) => (
                            <button key={dt} type="button" onClick={() => setReport(r => ({ ...r, demandType: dt }))} className={`py-4 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${report.demandType === dt ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                              <i className={`fa-solid ${dt === DemandType.SEASONAL ? 'fa-cloud-sun' : 'fa-calendar-days'} mr-2`}></i>
                              {dt}
                            </button>
                          ))}
                        </div>
                      </InputGroup>

                      <InputGroup label="Trend Status" icon="fa-arrow-trend-up">
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {Object.values(TrendStatus).map((ts) => (
                            <button key={ts} type="button" onClick={() => setReport(r => ({ ...r, trendStatus: ts }))} className={`py-4 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${report.trendStatus === ts ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                              <i className={`fa-solid ${ts === TrendStatus.TRENDING ? 'fa-fire' : 'fa-minus'} mr-2`}></i>
                              {ts}
                            </button>
                          ))}
                        </div>
                      </InputGroup>
                    </div>
                  </div>

                  {/* Ranking Difficulty */}
                  <div className="space-y-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <i className="fa-solid fa-ranking-star"></i> Ranking Difficulty
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {RANKING_DIFFICULTY_OPTIONS.map((opt) => (
                        <div key={opt.label} className="flex flex-col gap-2">
                          <button 
                            type="button" 
                            onClick={() => handleRankingDifficultySelection(opt.label)} 
                            className={`p-5 rounded-t-3xl border border-b-0 text-left transition-all group ${report.rankingDifficulty === opt.label ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[11px] font-black uppercase tracking-tighter leading-tight flex-1 mr-2">{opt.label}</span>
                              {report.rankingDifficulty === opt.label && <i className="fa-solid fa-check-circle text-sm"></i>}
                            </div>
                            <div className={`text-[10px] leading-relaxed font-bold ${report.rankingDifficulty === opt.label ? 'text-indigo-100' : 'text-slate-500'}`}>
                              Selected Narrative Applied Below
                            </div>
                          </button>
                          <textarea
                            name={opt.field}
                            value={report[opt.field]}
                            onChange={handleInputChange}
                            placeholder={`Enter narrative for ${opt.label}...`}
                            className={`w-full px-4 py-3 rounded-b-3xl border border-t-0 text-[10px] leading-relaxed font-bold outline-none transition-all h-24 ${report.rankingDifficulty === opt.label ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-600 focus:bg-white focus:border-indigo-300'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Related Keywords Input */}
                  <InputGroup label="Keywords related" icon="fa-tags">
                    <div className="flex gap-2 mb-3 mt-2">
                      <input 
                        type="text" 
                        value={newRelatedKeyword} 
                        onChange={(e) => setNewRelatedKeyword(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && addRelatedKeyword()}
                        placeholder="Add related keyword..." 
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all" 
                      />
                      <button onClick={addRelatedKeyword} className="px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {report.relatedKeywords.map((kw, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg">
                          <span className="text-xs font-bold text-amber-700">{kw}</span>
                          <button onClick={() => removeRelatedKeyword(idx)} className="text-amber-400 hover:text-amber-600">
                            <i className="fa-solid fa-circle-xmark text-sm"></i>
                          </button>
                        </div>
                      ))}
                      {report.relatedKeywords.length === 0 && <span className="text-[10px] text-slate-400 italic">No related keywords added yet.</span>}
                    </div>
                  </InputGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <InputGroup label="EST Search Volume" icon="fa-magnifying-glass"><input type="number" name="monthlySearchVolume" value={report.monthlySearchVolume} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold" /></InputGroup>
                  <InputGroup label="Est. Monthly Sales" icon="fa-chart-line"><input type="number" name="estimatedMonthlySales" value={report.estimatedMonthlySales} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold" /></InputGroup>
                  <InputGroup label="Best Sellers Rank (BSR)" icon="fa-ranking-star"><input type="number" name="bsr" value={report.bsr} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg" /></InputGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                    <label className="text-sm font-black text-slate-400 uppercase mb-4 block tracking-widest">Sellers Distribution</label>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <InputGroup label="FBA Sellers">
                        <input type="number" name="fbaSellersCount" value={report.fbaSellersCount ?? ''} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 text-lg font-bold" />
                      </InputGroup>
                      <InputGroup label="FBM Sellers">
                        <input type="number" name="fbmSellersCount" value={report.fbmSellersCount ?? ''} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg font-bold" />
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InputGroup label="Total Sellers Count" icon="fa-users">
                        <input type="number" name="competitorsCount" value={report.competitorsCount} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold" />
                      </InputGroup>
                      <InputGroup label="Competition Level" icon="fa-gauge-simple-high">
                        <select name="competitionLevel" value={report.competitionLevel} onChange={handleInputChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-amber-500">
                          {Object.values(CompetitionLevel).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <InputGroup label="Opportunity Score (0-100)" icon="fa-bolt"><input type="number" name="opportunityScore" value={report.opportunityScore} onChange={handleInputChange} min="0" max="100" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-2xl text-amber-600" /></InputGroup>
                    <InputGroup label="Avg Reviews" icon="fa-star"><input type="text" name="reviews" value={report.reviews} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold" /></InputGroup>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                  <InputGroup label="Selling Price"><input type="number" name="sellingPrice" value={report.sellingPrice} onChange={handleInputChange} step="0.01" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold" /></InputGroup>
                  <InputGroup label="Est. Cost Price"><input type="number" name="estimatedCostPrice" value={report.estimatedCostPrice} onChange={handleInputChange} step="0.01" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold" /></InputGroup>
                  <InputGroup label="Monthly Profit" icon="fa-calculator">
                    <input type="number" name="estimatedMonthlyProfit" value={report.estimatedMonthlyProfit} readOnly className="w-full px-4 py-4 bg-slate-100 border border-slate-200 rounded-xl font-black text-2xl text-emerald-600 cursor-not-allowed" />
                  </InputGroup>
                  <InputGroup label="KW in Title"><input type="number" name="sellersWithKeywordInTitle" value={report.sellersWithKeywordInTitle} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold" /></InputGroup>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Section 5: Commentary */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                  <span className="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-base">5</span>
                  Analyst Commentary
                </h2>
                <div className="space-y-16">
                  <InputGroup label="Target Seller Level">
                    <div className="flex gap-4 mt-2">
                      {[SellerLevel.BEGINNER, SellerLevel.INTERMEDIATE, SellerLevel.ADVANCED].map((lvl) => (
                        <button key={lvl} type="button" onClick={() => setReport(r => ({ ...r, sellerLevel: lvl }))} className={`flex-1 py-4 rounded-xl border text-sm font-black uppercase tracking-widest transition-all ${report.sellerLevel === lvl ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>{lvl}</button>
                      ))}
                    </div>
                  </InputGroup>

                  {/* Competitor Issues */}
                  <div className="space-y-6 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <label className="text-base font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <i className="fa-solid fa-triangle-exclamation text-rose-500"></i> Competitor Issues
                    </label>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {PREDEFINED_ISSUES.map(issue => (
                        <button key={issue} type="button" onClick={() => toggleIssue(issue)} className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${report.competitorIssues.includes(issue) ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'}`}>{issue}</button>
                      ))}
                    </div>
                    <textarea name="competitorAnalysis" value={report.competitorAnalysis} onChange={handleInputChange} rows={5} placeholder="Detailed narrative..." className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-rose-500 outline-none transition-all text-base leading-relaxed font-bold" />
                  </div>

                  {/* Exclusive Reason (Logic) */}
                  <div className="space-y-6 p-10 bg-amber-50/30 rounded-[2.5rem] border border-amber-100">
                    <label className="text-base font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <i className="fa-solid fa-brain text-amber-500"></i> Exclusive Reason (Logic)
                    </label>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {EXCLUSIVE_LOGIC_OPTIONS.map(opt => (
                        <button key={opt.label} type="button" onClick={() => toggleExclusiveReason(opt.label)} className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${report.exclusiveLogicTags.includes(opt.label) ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'}`}>{opt.label}</button>
                      ))}
                    </div>
                    <textarea name="exclusiveReason" value={report.exclusiveReason} onChange={handleInputChange} rows={5} placeholder="Exclusive market logic narrative..." className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-amber-500 outline-none transition-all text-base leading-relaxed font-bold italic" />
                  </div>

                  {/* Key Advantage */}
                  <div className="space-y-6 p-10 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100">
                    <label className="text-base font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <i className="fa-solid fa-star text-emerald-500"></i> Key Advantage
                    </label>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {ADVANTAGE_OPTIONS.map(opt => (
                        <button key={opt.label} type="button" onClick={() => toggleKeyAdvantage(opt.label)} className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${report.keyAdvantageTags.includes(opt.label) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'}`}>{opt.label}</button>
                      ))}
                    </div>
                    <textarea name="keyAdvantage" value={report.keyAdvantage} onChange={handleInputChange} rows={5} placeholder="Key advantage narrative..." className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base leading-relaxed font-bold" />
                  </div>
                  
                  {/* Ownership Value */}
                  <div className="space-y-6 p-10 bg-blue-50/30 rounded-[2.5rem] border border-blue-100">
                    <label className="text-base font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <i className="fa-solid fa-gem text-blue-500"></i> Ownership Value
                    </label>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {OWNERSHIP_OPTIONS.map(opt => (
                        <button key={opt.label} type="button" onClick={() => toggleOwnershipValue(opt.label)} className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${report.ownershipValueTags.includes(opt.label) ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'}`}>{opt.label}</button>
                      ))}
                    </div>
                    <textarea name="ownershipValue" value={report.ownershipValue} onChange={handleInputChange} rows={5} placeholder="Ownership pillar narrative..." className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base leading-relaxed font-bold" />
                  </div>
                  
                  {/* Main Risk - TRANSFORMED TO TAG/PILL STYLE */}
                  <div className="space-y-6 p-10 bg-slate-100/50 rounded-[2.5rem] border border-slate-200">
                    <label className="text-base font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                      <i className="fa-solid fa-shield-virus text-slate-500"></i> Risk Mitigation
                    </label>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {Object.keys(RISK_TEMPLATES).map(riskKey => (
                        <button key={riskKey} type="button" onClick={() => toggleMainRisk(riskKey)} className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${report.mainRiskTags.includes(riskKey) ? 'bg-slate-700 border-slate-700 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}>{riskKey}</button>
                      ))}
                    </div>
                    <textarea name="mainRisk" value={report.mainRisk} onChange={handleInputChange} rows={5} placeholder="Main risk narrative..." className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-2 focus:ring-slate-500 outline-none transition-all text-base leading-relaxed font-bold" />
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100 flex justify-center">
                <button onClick={exportCSV} className="text-slate-500 hover:text-slate-900 transition-all text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                  <i className="fa-solid fa-file-csv"></i> Export Raw CSV Data
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReportPreview report={report} />
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
