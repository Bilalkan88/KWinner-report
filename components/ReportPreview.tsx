
import React from 'react';
import { KeywordReport, CompetitionLevel, Eligibility, DemandType, TrendStatus, RankingDifficulty } from '../types';

interface ReportPreviewProps { report: KeywordReport; }

const PageHeader: React.FC = () => (
  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
    <img src="/logo.png" alt="Vetted Niche" className="h-20 object-contain block" />
    <a
      href="https://www.vettedniche.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 text-[9px] font-black underline underline-offset-8 uppercase tracking-[0.2em] hover:text-blue-800 transition-colors"
    >
      www.vettedniche.com
    </a>
  </div>
);

const PageFooter: React.FC<{ page: number }> = ({ page }) => (
  <div className="mt-auto pt-4 pb-2 border-t border-slate-100/50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
    <div className="flex-1"></div>
    <div className="flex-1 text-center whitespace-nowrap">
      This report is powered by VettedNiche
    </div>
    <div className="flex-1 text-right font-black opacity-40">
      PAGE {page}
    </div>
  </div>
);

const HeroSparkline: React.FC<{ color?: string }> = ({ color = 'bg-amber-400' }) => {
  const bars = [30, 50, 40, 70, 60, 90, 80];
  return (
    <div className="flex items-end gap-1 h-3 print:h-2">
      {bars.map((h, i) => (
        <div key={i} className={`w-0.5 ${color} rounded-full opacity-60`} style={{ height: `${h}%` }}></div>
      ))}
    </div>
  );
};

export const ReportPreview: React.FC<ReportPreviewProps> = ({ report }) => {
  let pageNum = 0;
  const nextP = () => {
    pageNum += 1;
    return pageNum;
  };

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    if (!arr) return chunks;
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const asinChunks = chunkArray(report.activeAsinsForListings || [], 50);
  const keywordChunks = chunkArray(report.topRelatedKeywordsList && report.topRelatedKeywordsList.length > 0 ? report.topRelatedKeywordsList : [{} as any], 18);

  const formatKValue = (val: string | undefined): string => {
    if (!val) return '';
    return val.replace(/\d+/g, (match) => {
      const num = parseInt(match, 10);
      if (num >= 1000000) {
        const formatted = (num / 1000000).toFixed(1);
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
      }
      if (num >= 1000) {
        const formatted = (num / 1000).toFixed(1);
        return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'k' : formatted + 'k';
      }
      return match;
    });
  };

  const formatPrice = (price: string | number | undefined): string => {
    if (!price) return '$0';
    const clean = String(price).trim();
    return clean.startsWith('$') ? clean : `$${clean}`;
  };

  const calculateTop5ClickShare = () => {
    if (!report.topCompetitorsList || report.topCompetitorsList.length === 0) return '0%';
    const top5 = report.topCompetitorsList.slice(0, 5);
    const sum = top5.reduce((acc, comp) => {
      const val = comp.clickShare ? String(comp.clickShare).replace('%', '').replace(',', '.').trim() : '0';
      const parsed = parseFloat(val);
      return acc + (isNaN(parsed) ? 0 : parsed);
    }, 0);
    return sum > 0 ? `${sum.toFixed(1)}%` : '0%';
  };

  const getEligibilityStyles = (status: Eligibility) => {
    switch (status) {
      case Eligibility.ELIGIBLE: return 'border-emerald-500/40 bg-emerald-950/60 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
      case Eligibility.NOT_ELIGIBLE: return 'border-rose-500/40 bg-rose-950/60 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
      case Eligibility.REQUIRE_APPROVAL: return 'border-orange-500/40 bg-orange-950/60 text-orange-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
      case Eligibility.REQUIRED_DOCUMENTATION: return 'border-blue-500/40 bg-blue-950/60 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]';
      default: return 'border-slate-500/40 bg-slate-900/60 text-slate-400';
    }
  };

  const getRankingDescription = (difficulty: RankingDifficulty) => {
    switch (difficulty) {
      case RankingDifficulty.EASY: return report.easyToRankDesc;
      case RankingDifficulty.MODERATE: return report.moderateDifficultyDesc;
      case RankingDifficulty.HARD: return report.hardToRankDesc;
      default: return "";
    }
  };

  const getRankingColorClass = (difficulty: RankingDifficulty) => {
    switch (difficulty) {
      case RankingDifficulty.EASY: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case RankingDifficulty.MODERATE: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case RankingDifficulty.HARD: return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const evidenceData = [
    { label: "Keepa Data History", img: report.keepaImageUrl, icon: "fa-chart-line", note: report.keepaNotes },
    { label: "Helium10 Data History", img: report.helium10ImageUrl, icon: "fa-flask", note: report.helium10Notes },
    { label: "Amazon Search Data", img: report.amazonSearchDataImageUrl, icon: "fa-magnifying-glass-chart", note: report.amazonSearchDataNotes },
    { label: "Search Volume History", img: report.searchVolumeImageUrl, icon: "fa-arrow-trend-up", note: report.searchVolumeNotes },
    { label: "Xray Product Research", img: report.xrayProductResearchImageUrl, icon: "fa-magnifying-glass", note: report.xrayProductResearchNotes }
  ];

  const totalCost = report.productCost + report.shippingCost + report.referralFee + report.fbaFee + report.ppcCost;
  const netProfitPerUnit = report.sellingPrice - totalCost;
  const roi = ((netProfitPerUnit / (report.productCost + report.shippingCost)) * 100);
  const calculatedMonthlyRevenue = report.estimatedMonthlySales * report.sellingPrice;
  const breakevenUnits = report.netProfitPerUnit > 0 ? Math.ceil((report.initialInvestment || 0) / report.netProfitPerUnit) : 0;
  const combinedAmazonFees = (report.amazonReferralFee || 0) + (report.amazonFbaFees || 0);
  const profitBeforePPC = report.targetSellingPrice - ((report.productCostFactory || 0) + (report.shippingCostSea || 0) + (report.amazonReferralFee || 0) + (report.amazonFbaFees || 0));
  const breakevenACoS = report.targetSellingPrice > 0 ? ((profitBeforePPC / report.targetSellingPrice) * 100) : 0;

  return (
    <div className="bg-slate-200 print:bg-white min-h-screen py-10 print:py-0 no-print-bg">
      {/* --- COVER PAGE --- */}
      <div className="a4-page cover-page flex flex-col items-center justify-between py-32 text-center">
        <div className="w-full">
          <img src="/logo.png" alt="Vetted Niche" className="h-44 object-contain mx-auto mb-16" />
          <h1 className="text-[28px] font-black text-slate-900 uppercase tracking-[0.1em] leading-tight">
            Product Opportunity Report
          </h1>
        </div>

        <div className="w-full space-y-4">
          <h2 className={`${(report.keyword?.length || 0) > 45 ? 'text-[32px]' : (report.keyword?.length || 0) > 25 ? 'text-[40px]' : 'text-[48px]'} font-black text-blue-600 uppercase tracking-tighter leading-none italic`}>
            {report.keyword || 'Product Name'}
          </h2>
          <div className="space-y-4">
            <p className="text-[18px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Marketplace: {report.marketReach || 'US'}
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
                <i className="fa-solid fa-handshake text-emerald-600"></i>
                <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest">
                  Product Seller Fit: {report.productSellerFit || 'New Seller'}
                </span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
                <i className="fa-solid fa-user-tag text-indigo-600"></i>
                <span className="text-[12px] font-black text-indigo-600 uppercase tracking-widest">
                  Best Fit For: {report.sellerType || 'Private Label'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-20">
          <p className="text-[20px] font-bold text-slate-800 leading-relaxed max-w-2xl mx-auto">
            Data-driven analysis of market demand,<br />
            competition, profitability, and risk.
          </p>
          <div className="space-y-12">

            <div className="text-[14px] font-black text-slate-900 uppercase tracking-[0.3em] pt-8 border-t border-slate-100 max-w-sm mx-auto">
              Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* --- PAGE 1: NEW CONSOLIDATED DASHBOARD (Sections 1 & 2) --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />

        <div className="px-10 pt-2 pb-4 flex-1 flex flex-col">
          {/* Header Section matching reference image */}
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-3 flex-1 min-w-0 pr-8">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2 h-8">
                  <i className="fa-solid fa-cube text-[10px] text-slate-400"></i>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</span>
                </div>
              </div>
              <h1 className={`${(report.keyword?.length || 0) > 60 ? 'text-lg' : (report.keyword?.length || 0) > 40 ? 'text-xl' : (report.keyword?.length || 0) > 25 ? 'text-2xl' : 'text-3xl'} font-black text-slate-900 tracking-tight leading-none uppercase`}>
                {report.keyword || 'Product Name'}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-2 w-fit shadow-sm shrink-0">
                  <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Category Path</div>
                  <div className="text-[10px] font-black text-slate-700 leading-normal pt-0.5 max-w-[400px]">
                    {report.category || 'Sports & Outdoors'} <span className="mx-1 text-slate-300">\</span> {report.subCategory || 'Niche'}
                  </div>
                </div>

              </div>
            </div>

            {/* Right side images matching reference */}
            <div className="flex gap-4 shrink-0">
              {[report.productImageUrl, report.productImageUrl2].filter(Boolean).map((img, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl border border-slate-100 overflow-hidden">
                    <img src={img} alt="Product" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 mb-4" />

          {/* 1. EXECUTIVE SUMMARY SECTION */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">1. Executive Summary</h2>
            </div>

            <div className="space-y-3 mb-3">
              {/* Top Row: Hero Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {/* Search Volume */}
                <div className="bg-[#1e1b4b] rounded-[1.5rem] p-4 text-white shadow-xl flex flex-col justify-between min-h-[110px] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 text-[80px] opacity-10 rotate-12">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Monthly Search Volume</span>
                  <div className="flex items-baseline gap-2 relative z-10">
                    <span className="text-[36px] font-black leading-none">{formatKValue(String(report.monthlySearchVolume))}</span>
                    <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">Searches</span>
                  </div>
                </div>

                {/* Mo. Revenue */}
                <div className="bg-indigo-600 rounded-[1.5rem] p-4 text-white shadow-xl flex flex-col justify-between min-h-[110px] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 text-[80px] opacity-10 rotate-12">
                    <i className="fa-solid fa-dollar-sign"></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Estimated Mo. Revenue</span>
                  <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-[36px] font-black leading-none">${formatKValue(String(report.monthlyRevenue || 0))}</span>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-emerald-600 rounded-[1.5rem] p-4 text-white shadow-xl flex flex-col justify-between min-h-[110px] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 text-[80px] opacity-10 rotate-12">
                    <i className="fa-solid fa-chart-line"></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Total Niche Revenue</span>
                  <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-[36px] font-black leading-none">${formatKValue(String(report.totalRevenue || 0))}</span>
                  </div>
                </div>
              </div>

              {/* Middle Grid: Detailed Metrics */}
              <div className="grid grid-cols-4 gap-3">
                {/* Demand Level */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-arrow-trend-up"></i> Demand
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase leading-none">{report.demandLevel}</div>
                </div>

                {/* Competition */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-amber-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-shield-halved"></i> Competition
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase leading-none">{report.competitionLevel}</div>
                </div>

                {/* Mo. Sales */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-cart-shopping"></i> Mo. Sales
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900 leading-none">{formatKValue(String(report.avgMonthlySalesTop10 || '0'))}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Units</span>
                  </div>
                </div>

                {/* Sellers > $5k */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-indigo-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-users"></i> Rev &gt; $5k
                  </div>
                  <div className="text-base font-black text-slate-900 leading-none">{report.sellersOver5kRevenue || '0'} <span className="text-[9px] text-slate-400 font-bold uppercase">Sellers</span></div>
                </div>
              </div>

              {/* Bottom Secondary Grid */}
              <div className="grid grid-cols-4 gap-3">
                {/* Avg Price */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-rose-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-tag"></i> Avg Price
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase leading-none">${report.sellingPrice.toFixed(0)}</div>
                </div>

                {/* Avg BSR */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-sky-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-ranking-star"></i> Avg BSR
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase leading-none">#{formatKValue(String(report.avgBSR || ''))}</div>
                </div>

                {/* Avg Reviews */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-amber-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-star"></i> Avg Reviews
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase leading-none">{report.avgReviewCount || '0'}</div>
                </div>

                {/* Net Margin */}
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1 border-l-4 border-l-indigo-500">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <i className="fa-solid fa-percent"></i> Net Margin
                  </div>
                  <div className="text-sm font-black text-slate-900 uppercase leading-none">
                    {report.netMarginPercentage || '0'}%
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Insight Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center shadow-sm">
                <i className="fa-regular fa-lightbulb text-blue-600 text-lg"></i>
              </div>
              <div className="space-y-1">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Executive Insight</h4>
                <p className="text-[13px] font-bold text-slate-700 leading-relaxed italic">
                  {report.insight || 'Strong demand with low competition and consistent sales performance.'}
                </p>
              </div>
            </div>
          </section>

          {/* 2. MARKET BEHAVIOR & EFFICIENCY SECTION */}
          <section className="mt-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">2. Market Behavior & Efficiency</h2>
            </div>

            <div className="space-y-3">
              {/* Row 1: The Seasonality Cycle (Timeline Banner) */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                {/* Left: Pattern Type */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  {(() => {
                    const pattern = (report.seasonalityPattern || '').toLowerCase();
                    let style = { color: 'text-slate-600', bg: 'bg-white', border: 'border-slate-200', icon: 'fa-chart-pie' };
                    
                    if (pattern.includes('year-round')) style = { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'fa-calendar-check' };
                    else if (pattern.includes('new trend')) style = { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: 'fa-bolt-lightning' };
                    else if (pattern.includes('trend')) style = { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'fa-arrow-trend-up' };
                    else if (pattern.includes('seasonal')) style = { color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200', icon: 'fa-calendar-days' };

                    return (
                      <>
                        <div className={`w-10 h-10 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center shadow-sm`}>
                          <i className={`fa-solid ${style.icon} ${style.color} text-lg`}></i>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Seasonality Pattern</h4>
                          <div className={`text-[16px] font-black ${style.color} uppercase leading-none`}>{report.seasonalityPattern}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Right: The Cycle Flow */}
                <div className="flex-1 flex items-center justify-end gap-6 border-l border-slate-200 pl-6 ml-6">
                  {/* Peak */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fa-solid fa-arrow-trend-up text-emerald-500 text-[10px]"></i>
                      <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Peak Season</span>
                    </div>
                    <div className="text-[14px] font-black text-slate-900 leading-none">
                      {report.seasonalityPeak1} {report.seasonalityPeak2 ? `- ${report.seasonalityPeak2}` : ''}
                    </div>
                    <div className="text-[11.5px] font-black text-emerald-600 mt-1">Vol: {formatKValue(String(report.seasonalityPeakVolume || '0'))}</div>
                  </div>

                  {/* Divider arrow */}
                  <div className="text-slate-300 text-sm">
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </div>

                  {/* Off-Peak */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fa-solid fa-arrow-trend-down text-orange-500 text-[10px]"></i>
                      <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest">Off-Peak</span>
                    </div>
                    <div className="text-[14px] font-black text-slate-900 leading-none">
                      {report.seasonalityOffPeak1} {report.seasonalityOffPeak2 ? `- ${report.seasonalityOffPeak2}` : ''}
                    </div>
                    <div className="text-[11.5px] font-black text-orange-600 mt-1">Vol: {formatKValue(String(report.seasonalityOffPeakVolume || '0'))}</div>
                  </div>
                </div>
              </div>

              {/* Row 2: Efficiency Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {/* Conversion Rate */}
                <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <i className="fa-solid fa-filter"></i> Conversion Rate
                    </div>
                    <div className="w-12 h-1 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[75%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-slate-900 leading-none mt-1">{report.conversionRate || '-%'}</div>
                </div>

                {/* Avg Out-of-stock */}
                <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-rose-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <i className="fa-solid fa-box-open"></i> Avg Out-of-stock
                    </div>
                    <div className="w-12 h-1 bg-rose-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 w-[20%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-slate-900 leading-none mt-1">{report.avgOutOfStock || '-%'}</div>
                </div>

                {/* Avg Listing Age */}
                <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-indigo-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <i className="fa-solid fa-clock-rotate-left"></i> Avg Listing Age
                    </div>
                    <div className="w-12 h-1 bg-indigo-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[60%] rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-black text-slate-900 leading-none">{report.avgListingAge || '-'}</span>
                    {report.avgListingAge && <span className="text-[9px] font-black text-slate-400 uppercase">Months</span>}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PageFooter page={nextP()} />
        </div>
      </div>


      {/* --- PAGE 5: COMPETITION ANALYSIS --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              3. Competition Analysis
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              {/* Top Row: Hero Competition Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {/* Active Listing Page 1 */}
                <div className="bg-indigo-600 rounded-[1.5rem] p-4 text-white shadow-md flex flex-col justify-between min-h-[100px] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 text-[80px] opacity-10 rotate-12">
                    <i className="fa-solid fa-file-lines"></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Active Listing Page 1</span>
                  <div className="text-[32px] font-black leading-none relative z-10">{report.activeSellersPage1 || '0'}</div>
                </div>

                {/* Amazon Dominancy */}
                <div className="bg-rose-600 rounded-[1.5rem] p-4 text-white shadow-md flex flex-col justify-between min-h-[100px] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 text-[80px] opacity-10 rotate-12">
                    <i className="fa-solid fa-crown"></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Amazon Dominancy</span>
                  <div className="text-[26px] font-black leading-tight relative z-10 uppercase">{report.amazonDominancy || 'N/A'}</div>
                </div>

                {/* Total Active Listing */}
                <div className="bg-blue-600 rounded-[1.5rem] p-4 text-white shadow-md flex flex-col justify-between min-h-[100px] relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 text-[80px] opacity-10 rotate-12">
                    <i className="fa-solid fa-list-ol"></i>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Total Active Listing</span>
                  <div className="text-[32px] font-black leading-none relative z-10">{report.totalActiveListing || '0'}</div>
                </div>
              </div>

              {/* Bottom Rows: Secondary Metrics */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Click Share Top 5", value: calculateTop5ClickShare(), icon: "fa-chart-pie", color: "text-violet-500", border: "border-l-violet-500" },
                    { label: "Average Rating", value: report.averageRating || 'N/A', icon: "fa-star", color: "text-amber-500", border: "border-l-amber-500" },
                    { label: "Sellers < 75 Reviews", value: report.sellersUnder75Reviews, icon: "fa-users-slash", color: "text-emerald-500", border: "border-l-emerald-500" }
                  ].map((item, i) => (
                    <div key={i} className={`bg-white border border-slate-100 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm border-l-4 ${item.border}`}>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <i className={`fa-solid ${item.icon} ${item.color}`}></i>
                        <span>{item.label}</span>
                      </div>
                      <div className="text-[15px] font-black text-slate-900 leading-none mt-1 uppercase">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Page Result Type", value: report.pageResultType || 'N/A', icon: "fa-file-invoice", color: "text-purple-500", border: "border-l-purple-500" },
                    { label: "Amazon Selling Listing", value: report.amazonSellingListing || 'N/A', icon: "fa-amazon", color: "text-orange-500", border: "border-l-orange-500" }
                  ].map((item, i) => (
                    <div key={i} className={`bg-white border border-slate-100 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm border-l-4 ${item.border}`}>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        <i className={`fa-solid ${item.icon} ${item.color}`}></i>
                        <span>{item.label}</span>
                      </div>
                      <div className="text-[15px] font-black text-slate-900 leading-none mt-1 uppercase">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {report.opportunityGap && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 flex gap-4 mt-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center shadow-sm shrink-0">
                  <i className="fa-solid fa-road text-blue-600 text-sm"></i>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">Market Opening</h4>
                  <p className="text-[12px] font-bold text-slate-700 leading-tight italic">
                    "{report.opportunityGap}"
                  </p>
                </div>
              </div>
            )}

            {/* Top Competitors Analysis Table - Optimized */}
            <div className="w-full mt-4">
              <h4 className="text-sm font-black text-[#1e1b4b] mb-3 tracking-widest text-center uppercase flex items-center justify-center gap-2">
                <i className="fa-solid fa-trophy text-amber-500"></i>
                Top Competitor Analysis
              </h4>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left text-[12px] leading-tight table-auto font-medium">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="px-2 py-3 font-black uppercase tracking-tighter text-center w-6 opacity-80">#</th>
                      <th className="px-3 py-3 font-black uppercase tracking-widest text-center w-36">ASIN</th>
                      <th className="px-3 py-3 font-black uppercase tracking-widest w-32">Brand</th>
                      <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Avg Sales<br /><span className="text-[9px] font-normal opacity-70">(Unit)</span></th>
                      <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Clicks<br /><span className="text-[9px] font-normal opacity-70 whitespace-nowrap">(past 3M)</span></th>
                      <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Cl. Share</th>
                      <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Price</th>
                      <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Reviews</th>
                      <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Age <span className="text-[9px] font-normal opacity-70">(mo)</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.topCompetitorsList.map((comp, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 even:bg-slate-50/60 hover:bg-indigo-50/40 transition-colors">
                        <td className="px-2 py-2.5 font-black text-slate-400 text-center">{idx + 1}</td>
                        <td className="px-3 py-2.5 font-black text-indigo-600 text-center whitespace-nowrap">
                          {comp.asin ? (
                            <a
                              href={`https://www.amazon.com/dp/${comp.asin.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline decoration-indigo-500/30"
                              title="View on Amazon"
                            >
                              {comp.asin}
                            </a>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-2.5 font-bold text-slate-700 truncate max-w-[120px]">{comp.brand || '—'}</td>
                        <td className="px-2 py-2.5 font-black text-slate-900 text-center">{comp.avgUnitSales || '0'}</td>
                        <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{comp.clickCount || '0'}</td>
                        <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{comp.clickShare || '0%'}</td>
                        <td className="px-2 py-2.5 font-black text-slate-900 text-center">{formatPrice(comp.avgSellingPrice)}</td>
                        <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{comp.numberOfReviews || '0'}</td>
                        <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{comp.listingAge || '0'}</td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-[#1e1b4b] text-white font-black border-t-2 border-indigo-500">
                      <td colSpan={3} className="px-3 py-3.5 text-right tracking-widest text-[11px] uppercase opacity-90 pr-6">Total / Average</td>
                      <td className="px-2 py-3.5 text-center text-emerald-400 text-[14px]">{report.topCompetitorsAverage.avgUnitSales || '0'}</td>
                      <td className="px-2 py-3.5 text-center text-[14px]">{report.topCompetitorsAverage.clickCount || '0'}</td>
                      <td className="px-2 py-3.5 text-center text-[14px]">{report.topCompetitorsAverage.clickShare || '0%'}</td>
                      <td className="px-2 py-3.5 text-center text-emerald-400 text-[14px]">{formatPrice(report.topCompetitorsAverage.avgSellingPrice)}</td>
                      <td className="px-2 py-3.5 text-center text-[14px]">{report.topCompetitorsAverage.numberOfReviews || '0'}</td>
                      <td className="px-2 py-3.5 text-center text-[14px]">{report.topCompetitorsAverage.listingAge || '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[10px] text-slate-400 font-bold tracking-tight text-center uppercase">
                * Click Share metrics depend on keyword rankings for each ASIN.
              </p>
            </div>

          </div>
        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- ASINs & KEYWORDS CONDITIONAL SEPARATION --- */}
      {(() => {
        const activeAsinsCount = (report.activeAsinsForListings || []).length;
        const topKeywordsCount = (report.topRelatedKeywordsList || []).length;
        const shouldSeparate = topKeywordsCount > 18 && activeAsinsCount > 0;

        if (shouldSeparate) {
          return (
            <>
              {/* Dedicated Page for ASINs */}
              {report.activeAsinsForListings && report.activeAsinsForListings.length > 0 && (
                <div className="a4-page flex flex-col h-full">
                  <PageHeader />
                  <section className="flex-1 space-y-6">
                    <div className="w-full">
                      <h4 className="text-sm font-black text-[#1e1b4b] mb-4 flex items-center justify-center gap-2 tracking-tight uppercase">
                        <i className="fa-solid fa-list-check text-indigo-500"></i>
                        All ASINs for Active Listings
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full border-collapse text-left text-[9.5px] table-fixed">
                          <thead>
                            <tr className="bg-slate-900 text-white border-b border-slate-700">
                              {[1, 2, 3, 4, 5].map(i => (
                                <th key={i} className="px-2 py-2.5 font-black text-white text-center uppercase tracking-widest text-[8.5px] opacity-90 border-x border-slate-800 first:border-l-0 last:border-r-0">ASIN</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const totalAsins = report.activeAsinsForListings || [];
                              const numRows = Math.max(5, Math.ceil(totalAsins.length / 5));
                              return Array.from({ length: numRows }).map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-100 last:border-0 even:bg-slate-50/60 hover:bg-indigo-50/40 transition-colors font-bold text-slate-900">
                                  {[0, 1, 2, 3, 4].map(colIndex => {
                                    const asinIndex = rowIndex + (colIndex * numRows);
                                    const asin = totalAsins[asinIndex] || '';
                                    const displayNum = asinIndex + 1;
                                    return (
                                      <td key={colIndex} className="p-1 text-center font-bold text-slate-900 break-all border-x border-slate-100 first:border-l-0 last:border-r-0">
                                        <div className="flex items-center justify-between gap-1 px-1">
                                          <span className="text-[7px] text-slate-300 w-3 shrink-0">{asin ? displayNum : ''}</span>
                                          <span className="flex-1 text-center">
                                            {asin ? (
                                              <a
                                                href={`https://www.amazon.com/dp/${asin.trim()}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-700 hover:text-indigo-600 transition-colors"
                                              >
                                                {asin}
                                              </a>
                                            ) : '—'}
                                          </span>
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                  <PageFooter page={nextP()} />
                </div>
              )}

              {/* Dedicated Page for Keywords */}
              <div className="a4-page flex flex-col h-full">
                <PageHeader />
                <section className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                      4. Keyword Analysis
                    </h2>
                  </div>

                  <div className="w-full mt-4">
                    <h4 className="text-sm font-black text-[#1e1b4b] mb-4 flex items-center justify-center gap-2 tracking-tight uppercase">
                      <i className="fa-solid fa-tags text-indigo-500"></i>
                      Top Related Keywords
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                      <table className="w-full border-collapse text-left text-[11px] leading-tight table-fixed font-medium">
                        <thead className="bg-slate-900 text-white">
                          <tr>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center w-8 opacity-80">#</th>
                            <th className="px-3 py-3 font-black uppercase tracking-widest w-[35%]">Keywords</th>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Volume</th>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Sales</th>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Comp.</th>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Title D.</th>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Cl. Share</th>
                            <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Cv. Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(report.topRelatedKeywordsList || []).map((kw, idx) => (
                            <tr key={idx} className="border-b border-slate-100 last:border-0 even:bg-slate-50/60 hover:bg-indigo-50/40 transition-colors">
                              <td className="px-2 py-2.5 font-black text-slate-400 text-center">{idx + 1}</td>
                              <td className="px-3 py-2.5 font-black text-slate-900 break-words leading-tight">
                                {kw.keyword ? (
                                  <a
                                    href={`https://www.amazon.com/s?k=${encodeURIComponent(kw.keyword)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="capitalize hover:text-indigo-600 hover:underline decoration-indigo-500/30 transition-all cursor-pointer"
                                    title={`Search "${kw.keyword}" on Amazon`}
                                  >
                                    {kw.keyword}
                                  </a>
                                ) : '—'}
                              </td>
                              <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.searchVolume || '0'}</td>
                              <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.salesMonthly || '0'}</td>
                              <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.competingProducts || '0'}</td>
                              <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.titleDensity || '0'}</td>
                              <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.clickShare || '0%'}</td>
                              <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.conversionShare || '0%'}</td>
                            </tr>
                          ))}
                          <tr className="bg-[#1e1b4b] text-white font-black border-t-2 border-indigo-500">
                            <td colSpan={2} className="px-3 py-3.5 text-right tracking-widest text-[10px] uppercase opacity-90 pr-6">Total / Average</td>
                            <td className="px-2 py-3.5 text-center text-emerald-400 text-[13px]">{report.topRelatedKeywordsTotal.searchVolume}</td>
                            <td className="px-2 py-3.5 text-center text-emerald-400 text-[13px]">{report.topRelatedKeywordsTotal.salesMonthly}</td>
                            <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.competingProducts}</td>
                            <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.titleDensity}</td>
                            <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.clickShare}</td>
                            <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.conversionShare}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-[10px] text-slate-400 font-bold tracking-tight text-center uppercase">
                      Sales are estimated on a monthly basis for each keyword.
                    </p>
                  </div>
                </section>
                <PageFooter page={nextP()} />
              </div>
            </>
          );
        } else {
          return (
            /* Unified Page (Both on the same page) */
            <div className="a4-page flex flex-col h-full">
              <PageHeader />
              <section className="flex-1 space-y-6">
                {/* ALL ASINS Table */}
                {report.activeAsinsForListings && report.activeAsinsForListings.length > 0 && (
                  <div className="w-full mb-4">
                    <h4 className="text-sm font-black text-[#1e1b4b] mb-4 flex items-center justify-center gap-2 tracking-tight uppercase">
                      <i className="fa-solid fa-list-check text-indigo-500"></i>
                      All ASINs for Active Listings
                    </h4>
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full border-collapse text-left text-[9.5px] table-fixed">
                        <thead>
                          <tr className="bg-slate-900 text-white border-b border-slate-700">
                            {[1, 2, 3, 4, 5].map(i => (
                              <th key={i} className="px-2 py-2.5 font-black text-white text-center uppercase tracking-widest text-[8.5px] opacity-90 border-x border-slate-800 first:border-l-0 last:border-r-0">ASIN</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const totalAsins = report.activeAsinsForListings || [];
                            const numRows = Math.max(5, Math.ceil(totalAsins.length / 5));
                            return Array.from({ length: numRows }).map((_, rowIndex) => (
                              <tr key={rowIndex} className="border-b border-slate-100 last:border-0 even:bg-slate-50/60 hover:bg-indigo-50/40 transition-colors font-bold text-slate-900">
                                {[0, 1, 2, 3, 4].map(colIndex => {
                                  const asinIndex = rowIndex + (colIndex * numRows);
                                  const asin = totalAsins[asinIndex] || '';
                                  const displayNum = asinIndex + 1;
                                  return (
                                    <td key={colIndex} className="p-1 text-center font-bold text-slate-900 break-all border-x border-slate-100 first:border-l-0 last:border-r-0">
                                      <div className="flex items-center justify-between gap-1 px-1">
                                        <span className="text-[7px] text-slate-300 w-3 shrink-0">{asin ? displayNum : ''}</span>
                                        <span className="flex-1 text-center">
                                          {asin ? (
                                            <a
                                              href={`https://www.amazon.com/dp/${asin.trim()}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-slate-700 hover:text-indigo-600 transition-colors"
                                            >
                                              {asin}
                                            </a>
                                          ) : '—'}
                                        </span>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                    4. Keyword Analysis
                  </h2>
                </div>

                {/* Top Related Keywords Table */}
                <div className="w-full mt-4">
                  <h4 className="text-sm font-black text-[#1e1b4b] mb-4 flex items-center justify-center gap-2 tracking-tight uppercase">
                    <i className="fa-solid fa-tags text-indigo-500"></i>
                    Top Related Keywords
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <table className="w-full border-collapse text-left text-[11px] leading-tight table-fixed font-medium">
                      <thead className="bg-slate-900 text-white">
                        <tr>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center w-8 opacity-80">#</th>
                          <th className="px-3 py-3 font-black uppercase tracking-widest w-[35%]">Keywords</th>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Volume</th>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Sales</th>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Comp.</th>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Title D.</th>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Cl. Share</th>
                          <th className="px-2 py-3 font-black uppercase tracking-widest text-center">Cv. Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(report.topRelatedKeywordsList || []).map((kw, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0 even:bg-slate-50/60 hover:bg-indigo-50/40 transition-colors">
                            <td className="px-2 py-2.5 font-black text-slate-400 text-center">{idx + 1}</td>
                            <td className="px-3 py-2.5 font-black text-slate-900 break-words leading-tight">
                              {kw.keyword ? (
                                <a
                                  href={`https://www.amazon.com/s?k=${encodeURIComponent(kw.keyword)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="capitalize hover:text-indigo-600 hover:underline decoration-indigo-500/30 transition-all cursor-pointer"
                                  title={`Search "${kw.keyword}" on Amazon`}
                                >
                                  {kw.keyword}
                                </a>
                              ) : '—'}
                            </td>
                            <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.searchVolume || '0'}</td>
                            <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.salesMonthly || '0'}</td>
                            <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.competingProducts || '0'}</td>
                            <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.titleDensity || '0'}</td>
                            <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.clickShare || '0%'}</td>
                            <td className="px-2 py-2.5 font-bold text-slate-700 text-center">{kw.conversionShare || '0%'}</td>
                          </tr>
                        ))}
                        <tr className="bg-[#1e1b4b] text-white font-black border-t-2 border-indigo-500">
                          <td colSpan={2} className="px-3 py-3.5 text-right tracking-widest text-[10px] uppercase opacity-90 pr-6">Total / Average</td>
                          <td className="px-2 py-3.5 text-center text-emerald-400 text-[13px]">{report.topRelatedKeywordsTotal.searchVolume}</td>
                          <td className="px-2 py-3.5 text-center text-emerald-400 text-[13px]">{report.topRelatedKeywordsTotal.salesMonthly}</td>
                          <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.competingProducts}</td>
                          <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.titleDensity}</td>
                          <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.clickShare}</td>
                          <td className="px-2 py-3.5 text-center text-[13px]">{report.topRelatedKeywordsTotal.conversionShare}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-400 font-bold tracking-tight text-center uppercase">
                    Sales are estimated on a monthly basis for each keyword.
                  </p>
                </div>
              </section>
              <PageFooter page={nextP()} />
            </div>
          );
        }
      })()}

      {/* --- PAGE 7: REVIEW ANALYSIS --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-12">
          <div className="space-y-6">
            {/* vertical colored line before the title */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-[3px] h-6 bg-blue-600"></div>
              <h2 className="text-[18px] font-black text-[#1e293b] uppercase tracking-widest">
                5. Review Analysis
              </h2>
            </div>

            {/* Key Insights Header pill */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-5 py-2 flex items-center gap-2 w-fit ml-4">
              <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-key text-[12px]"></i>
              </div>
              <span className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Key Insights</span>
            </div>

            {/* Large centered Key Insights content */}
            <div className="bg-blue-50/50 border border-blue-100/50 rounded-[2rem] p-8 text-center mx-2 shadow-sm">
              <p className="text-[16.5px] font-black text-slate-950 leading-relaxed max-w-2xl mx-auto italic">
                {report.keyInsights || 'Review sentiment analysis pending...'}
              </p>
            </div>

            {/* Sub-headers for drivers */}
            <div className="grid grid-cols-2 gap-8 px-4 pt-4">
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-lg px-5 py-2 flex items-center gap-2 w-fit">
                <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-[12px]"></i>
                </div>
                <span className="text-[12px] font-black text-emerald-900 uppercase tracking-widest">Positive Drivers</span>
              </div>
              <div className="bg-amber-50/50 border border-amber-100/50 rounded-lg px-5 py-2 flex items-center gap-2 w-fit">
                <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-wrench text-[12px]"></i>
                </div>
                <span className="text-[12px] font-black text-amber-900 uppercase tracking-widest">Improvement Areas</span>
              </div>
            </div>

            {/* Lists content */}
            <div className="grid grid-cols-2 gap-10 px-6">
              {/* Positive list with ✔ */}
              <div className="space-y-4">
                {(() => {
                  const points = (report.positiveDrivers || '')
                    .split(/\n|•|✔| \d\.| - /)
                    .map(p => p.trim())
                    .filter(Boolean)
                    .slice(0, 3);

                  return points.length > 0 ? (
                    points.map((point, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-emerald-600 font-black mt-0.5 shrink-0">✔</span>
                        <span className="text-[13.5px] font-semibold text-slate-700 leading-snug">{point}</span>
                      </div>
                    ))
                  ) : (
                    [1, 2, 3].map(i => (
                      <div key={i} className="flex gap-2 items-start opacity-30">
                        <span className="text-slate-400 font-bold mt-0.5">✔</span>
                        <span className="text-[14px] font-black text-slate-400">Positive factor {i}...</span>
                      </div>
                    ))
                  );
                })()}
              </div>
              {/* Improvement list with ⚠ */}
              <div className="space-y-4">
                {(() => {
                  const points = (report.improvementAreas || '')
                    .split(/\n|•|⚠| \d\.| - /)
                    .map(p => p.trim())
                    .filter(Boolean)
                    .slice(0, 3);

                  return points.length > 0 ? (
                    points.map((point, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-amber-500 font-black mt-0.5 shrink-0">⚠</span>
                        <span className="text-[13.5px] font-semibold text-slate-700 leading-snug">{point}</span>
                      </div>
                    ))
                  ) : (
                    [1, 2, 3].map(i => (
                      <div key={i} className="flex gap-2 items-start opacity-30">
                        <span className="text-slate-400 font-bold mt-0.5">⚠</span>
                        <span className="text-[14px] font-black text-slate-400">Improvement area {i}...</span>
                      </div>
                    ))
                  );
                })()}
              </div>
            </div>

            {/* Market Signal bar - exactly as image */}
            <div className="mx-2 mt-8">
              <div className="bg-blue-50/50 border border-blue-100 rounded-[1.5rem] px-6 py-5 flex items-center gap-6 shadow-sm">
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-satellite-dish text-[18px]"></i>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col text-center min-w-[80px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Market</span>
                      <span className="text-[13px] font-black text-slate-900 uppercase tracking-widest leading-tight">Signal</span>
                    </div>
                    <div className="h-10 w-[2px] bg-blue-400/30 rounded-full"></div>
                  </div>
                </div>
                <p className="text-[14px] font-semibold text-slate-700 leading-relaxed flex-1">
                  {report.marketSignal || 'Waiting for market signal analysis...'}
                </p>
              </div>
            </div>

            {/* Opportunity Insight bar - exactly as image */}
            <div className="mx-2">
              <div className="bg-blue-50/50 border border-blue-100 rounded-[1.5rem] px-6 py-5 flex items-center gap-6 shadow-sm">
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-lightbulb text-[18px]"></i>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col text-center min-w-[80px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Opportunity</span>
                      <span className="text-[13px] font-black text-slate-900 uppercase tracking-widest leading-tight">Insight</span>
                    </div>
                    <div className="h-10 w-[2px] bg-blue-400/30 rounded-full"></div>
                  </div>
                </div>
                <p className="text-[14px] font-semibold text-slate-700 leading-relaxed flex-1">
                  {report.opportunityInsight || 'Waiting for opportunity insight analysis...'}
                </p>
              </div>
            </div>
          </div>
        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE 8: NICHE ANALYSIS & PROFITABILITY --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-2">
          {/* SECTION 6: NICHE ANALYSIS */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                6. Niche Analysis
              </h2>
            </div>

            <p className="text-[13.5px] font-medium text-slate-700 leading-relaxed px-2 italic">
              {report.nicheDescription || 'Gathering niche market data...'}
            </p>

            {/* Niche Key Insights Header pill */}
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-5 py-2 flex items-center gap-2 w-fit ml-4">
              <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-key text-[12px]"></i>
              </div>
              <span className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Key Insights</span>
            </div>

            {/* List with points */}
            <div className="space-y-1.5 px-8">
              {(report.nicheKeyInsights || '').split(/\n|•| \d\.| - /).filter(t => t.trim()).slice(0, 3).length > 0 ? (
                (report.nicheKeyInsights || '').split(/\n|•| \d\.| - /).filter(t => t.trim()).slice(0, 3).map((point, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1e1b4b] mt-1.5 shrink-0"></div>
                    <span className="text-[13.5px] font-bold text-slate-900 leading-snug">{point.trim()}</span>
                  </div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 items-start opacity-30">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                    <span className="text-[15px] font-bold text-slate-400">Analysis point {i}...</span>
                  </div>
                ))
              )}
            </div>

            {/* Opportunity Signal bar */}
            <div className="mx-2 mt-2">
              <div className="bg-emerald-50/30 border border-emerald-100 rounded-[1.5rem] px-6 py-3 flex items-center gap-6 shadow-sm">
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <i className="fa-solid fa-chart-pie text-[18px]"></i>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col text-center min-w-[100px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Opportunity</span>
                      <span className="text-[13px] font-black text-slate-900 uppercase tracking-widest leading-tight">Signal</span>
                    </div>
                    <div className="h-10 w-[2px] bg-emerald-400/30 rounded-full"></div>
                  </div>
                </div>
                <p className="text-[14px] font-semibold text-slate-700 leading-relaxed flex-1">
                  {report.nicheOpportunitySignal || 'Waiting for strategic signal analysis...'}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100"></div>

          {/* SECTION 7: PROFITABILITY & UNIT ECONOMICS */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                7. Profitability & Unit Economics
              </h2>
            </div>

            {/* 1. HERO METRICS (Profit & ROI) */}
            <div className="grid grid-cols-2 gap-4 px-2">
              {/* Net Profit Card */}
              <div className="bg-[#0f172a] rounded-[1.5rem] p-5 text-white shadow-xl relative overflow-hidden flex justify-between items-center border border-slate-800">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1 block">Net Profit Per Unit</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[42px] font-black leading-none">${report.netProfitPerUnit}</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                    <i className="fa-solid fa-arrow-trend-up"></i> {report.netMarginPercentage}% Net Margin
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 text-[100px] text-emerald-400 rotate-12">
                  <i className="fa-solid fa-sack-dollar"></i>
                </div>
              </div>

              {/* ROI Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] p-5 text-white shadow-xl relative overflow-hidden flex justify-between items-center border border-blue-500">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1 block">Return on Investment (ROI)</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[42px] font-black leading-none">{report.roiPercentage}%</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                    <i className={`fa-solid ${(Number(report.roiPercentage) || 0) >= 100 ? 'fa-crown text-amber-300' : 'fa-rocket text-emerald-300'}`}></i> 
                    {(Number(report.roiPercentage) || 0) >= 100 ? 'Exceptional ROI' : (Number(report.roiPercentage) || 0) >= 50 ? 'High ROI' : 'Moderate ROI'}
                  </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 text-[100px] text-white -rotate-12">
                  <i className="fa-solid fa-percent"></i>
                </div>
              </div>
            </div>

            {/* 2. COST STRUCTURE (Waterfall logic) */}
            <div className="px-2">
              <div className="bg-slate-50 border border-slate-200 rounded-[1.25rem] p-1 flex items-center justify-between shadow-sm">
                {/* Target Price */}
                <div className="flex-1 bg-white rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1"><i className="fa-solid fa-tag text-indigo-400 mr-1"></i> Selling Price</span>
                  <span className="text-[20px] font-black text-indigo-700">${report.targetSellingPrice}</span>
                </div>
                
                <div className="text-slate-300 px-2 font-black"><i className="fa-solid fa-minus"></i></div>
                
                {/* Product Cost */}
                <div className="flex-1 bg-rose-50/30 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[8.5px] font-black uppercase tracking-[0.1em] text-rose-400 mb-1 whitespace-nowrap"><i className="fa-solid fa-industry mr-1"></i> Product Cost</span>
                  <span className="text-[18px] font-black text-slate-700">-${report.productCostFactory}</span>
                </div>

                <div className="text-slate-200 px-1 font-black"><i className="fa-solid fa-minus"></i></div>

                {/* Shipping */}
                <div className="flex-1 bg-rose-50/30 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[8.5px] font-black uppercase tracking-[0.1em] text-rose-400 mb-1 whitespace-nowrap"><i className="fa-solid fa-ship mr-1"></i> Shipping Cost</span>
                  <span className="text-[18px] font-black text-slate-700">-${report.shippingCostSea}</span>
                </div>

                <div className="text-slate-200 px-1 font-black"><i className="fa-solid fa-minus"></i></div>

                {/* Amazon Fees */}
                <div className="flex-1 bg-rose-50/30 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[8.5px] font-black uppercase tracking-[0.1em] text-rose-400 mb-1 whitespace-nowrap"><i className="fa-brands fa-amazon mr-1"></i> FBA+Ref Fees</span>
                  <span className="text-[18px] font-black text-slate-700">-${combinedAmazonFees.toFixed(2)}</span>
                </div>

                <div className="text-slate-200 px-1 font-black"><i className="fa-solid fa-minus"></i></div>

                {/* PPC */}
                <div className="flex-1 bg-rose-50/30 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1"><i className="fa-solid fa-bullseye mr-1"></i> Est. PPC</span>
                  <span className="text-[18px] font-black text-slate-700">-${report.ppcCostEstimate}</span>
                </div>
              </div>
            </div>

            {/* 3. INVESTMENT & RESILIENCE METRICS */}
            <div className="grid grid-cols-4 gap-3 px-2 mt-2">
              {/* Total Unit Cost */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-slate-400">
                <div className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  <i className="fa-solid fa-calculator"></i> Total Unit Cost
                </div>
                <div className="text-[18px] font-black text-slate-900 leading-none">${report.totalCostPerUnit}</div>
              </div>
              
              {/* Initial Investment */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-indigo-500">
                <div className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  <i className="fa-solid fa-coins"></i> Initial Invest
                </div>
                <div className="text-[18px] font-black text-slate-900 leading-none">${report.initialInvestment}</div>
              </div>

              {/* Breakeven Units */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  <i className="fa-solid fa-scale-balanced"></i> Breakeven
                </div>
                <div className="text-[18px] font-black text-slate-900 leading-none">{breakevenUnits} <span className="text-[9px] text-slate-400 uppercase">Units</span></div>
              </div>

              {/* Break ACoS */}
              <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col gap-1.5 border-l-4 border-l-rose-500">
                <div className="flex items-center gap-1.5 text-[8.5px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  <i className="fa-solid fa-bullseye"></i> Break. ACoS
                </div>
                <div className="text-[18px] font-black text-slate-900 leading-none">{breakevenACoS.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE 6: FINANCIAL METRICS EXPLAINED --- */}
      <div className="a4-page flex flex-col h-full bg-white">
        <PageHeader />

        <div className="px-10 pt-0 pb-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-indigo-700 rounded-full"></div>
              <h2 className="text-xl font-[900] text-slate-900 uppercase tracking-widest text-left">
                8. Financial Metrics Explained
              </h2>
            </div>

            <p className="text-[13px] font-bold text-slate-700 leading-tight mb-4">
              This page explains the key financial metrics used in Amazon FBA and how to interpret them.
            </p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-between py-1">
            {/* 1. Total Cost */}
            <div className="flex items-center gap-6 p-4 rounded-[2.5rem] bg-slate-50 border border-slate-100/50 shadow-sm break-inside-avoid">
              <div className="flex items-center gap-4 w-[180px] shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md">1</div>
                <div className="flex flex-col">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase leading-none mb-1">Total Cost</h3>
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.2em]">Business Analytics</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[13px] font-bold text-slate-800 leading-[1.3]">
                  Total Cost represents the full landed cost of selling a single unit on Amazon. It covers everything from the factory floor to the customer's doorstep.
                </p>
                <div className="flex items-center gap-3 p-2 px-4 rounded-xl bg-orange-50/80 border border-orange-100/50">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-orange-100">
                    <i className="fa-regular fa-lightbulb text-orange-500 text-xs"></i>
                  </div>
                  <p className="text-[11px] font-extrabold text-orange-600 leading-tight italic">
                    Ignoring PPC or hidden FBA fees is the #1 reason new sellers fail.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Net Margin */}
            <div className="flex items-center gap-6 p-4 rounded-[2.5rem] bg-slate-50 border border-slate-100/50 shadow-sm break-inside-avoid">
              <div className="flex items-center gap-4 w-[180px] shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">2</div>
                <div className="flex flex-col">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase leading-none mb-1">Net Margin</h3>
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em]">Profitability Matrix</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[13px] font-bold text-slate-800 leading-[1.3]">
                  Net Margin shows what percentage of your selling price is actual profit after all costs. It tells you how efficient your product is.
                </p>
                <div className="flex items-center justify-center p-2 px-4 rounded-xl bg-emerald-50/80 border border-emerald-100/50">
                  <p className="text-[11px] font-extrabold text-emerald-700 leading-tight text-center italic">
                    Aim for a 20–35%+ net margin — lower margins increase risk, as small changes in PPC or fees can quickly eliminate profit.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. ROI */}
            <div className="flex items-center gap-6 p-4 rounded-[2.5rem] bg-slate-50 border border-slate-100/50 shadow-sm break-inside-avoid">
              <div className="flex items-center gap-4 w-[180px] shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">3</div>
                <div className="flex flex-col">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase leading-none mb-1">ROI</h3>
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em]">Capital Efficiency</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[13px] font-bold text-slate-800 leading-[1.3]">
                  Return on Investment shows how hard your money is working for you. It's the percentage of profit earned relative to the money you spent on stock and shipping.
                </p>
                <div className="flex items-center justify-center p-2 px-4 rounded-xl bg-blue-50/80 border border-blue-100/50">
                  <p className="text-[11px] font-extrabold text-blue-700 leading-tight text-center italic">
                    Always aim for 30%+ ROI. This provides a safety net for any market shifts.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Break-even (Units) */}
            <div className="flex items-center gap-6 p-4 rounded-[2.5rem] bg-slate-50 border border-slate-100/50 shadow-sm break-inside-avoid">
              <div className="flex items-center gap-4 w-[180px] shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md">4</div>
                <div className="flex flex-col">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase leading-none mb-1">Break-even (Units)</h3>
                  <span className="text-[8px] font-black text-orange-600 uppercase tracking-[0.2em]">Risk Management</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[13px] font-bold text-slate-800 leading-[1.3]">
                  The total number of units you need to sell to get your initial investment back. Once you reach this number, every sale after that is "house money."
                </p>
                <div className="flex items-center justify-center p-2 px-4 rounded-xl bg-orange-50/80 border border-orange-100/50">
                  <p className="text-[11px] font-extrabold text-orange-700 leading-tight text-center italic">
                    Lower break-even numbers mean faster cash recovery and less total risk.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Break-even ACoS */}
            <div className="flex items-center gap-6 p-4 rounded-[2.5rem] bg-slate-50 border border-slate-100/50 shadow-sm break-inside-avoid">
              <div className="flex items-center gap-4 w-[180px] shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-md">5</div>
                <div className="flex flex-col">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase leading-none mb-1">Break-even ACoS</h3>
                  <span className="text-[8px] font-black text-rose-600 uppercase tracking-[0.2em]">The Safety Line</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[13px] font-bold text-slate-800 leading-[1.3]">
                  This is the maximum percentage you can spend on advertising for each sale without losing money. It is your "Survival Margin" in the competitive Amazon ad market.
                </p>
                <div className="flex items-center justify-center p-2 px-4 rounded-xl bg-rose-50/80 border border-rose-100/50">
                  <p className="text-[11px] font-extrabold text-rose-700 leading-tight text-center italic">
                    Keep at least 20–30% below break-even to stay safely profitable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            This report is powered by VettedNiche • Page 6
          </div>
        </div>
      </div>

      {/* --- PAGE 9: QUALIFICATION, OPPORTUNITY & RISK --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-12">
          {/* SECTION 8: PRODUCT QUALIFICATION CHECKLIST */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                9. Product Qualification Checklist
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Stable, non-seasonal demand', checked: report.isNonSeasonal },
                { label: 'Low fragility and return risk', checked: report.isNotFragile },
                { label: 'Ungated and unrestricted category', checked: report.isNotRestricted },
                { label: 'Target price within desired range ($25 - $50)', checked: report.isTargetPriceInRange },
                { label: 'FBA-friendly size and weight', checked: report.isReasonableSizeWeight },
                { label: 'Low IP/Trademark/Patent risk', checked: report.isLowIPRisk },
                { label: 'Clear differentiation opportunity', checked: report.isClearDifferentiation },
                { label: 'No major certification requirements', checked: report.isNoCertificationRequired }
              ].filter(item => item.checked).map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                    <i className="fa-solid fa-check text-[14px]"></i>
                  </div>
                  <span className="text-[14px] font-black uppercase tracking-tight text-slate-800">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-slate-100"></div>

          {/* SECTION 9: OPPORTUNITY INDICATORS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                10. Opportunity Indicators
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Strong search demand', checked: report.isStrongSearchDemand, icon: 'fa-fire-flame-curved' },
                { label: 'Recent successful launches', checked: report.isRecentSuccessfulLaunches, icon: 'fa-rocket' },
                { label: 'Multiple new sellers traction', checked: report.isNewSellersTraction, icon: 'fa-user-plus' },
                { label: 'Fragmented competition', checked: report.isFragmentedCompetition, icon: 'fa-people-group' },
                { label: 'Low review barrier', checked: report.isLowReviewBarrier, icon: 'fa-star' },
                { label: 'Weak competitor listings', checked: report.isWeakCompetitorListings, icon: 'fa-low-vision' }
              ].filter(item => item.checked).map((item, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-5 rounded-[1.5rem] border border-blue-200 bg-white shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[18px] bg-[#4155b4] text-white">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className="text-[14px] font-black uppercase tracking-tight text-slate-800">
                      {item.label}
                    </span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4155b4] shadow-[0_0_8px_rgba(65,85,180,0.4)]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-slate-100"></div>

          {/* SECTION 10: RISK INDICATORS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                11. Risk Indicators
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'High review barrier', checked: report.riskReviewBarrier },
                { label: 'Dominant brand presence', checked: report.riskBrandPresence },
                { label: 'Market saturation risk', checked: report.riskMarketSaturation },
                { label: 'Thin profit margins', checked: report.riskProfitMargins },
                { label: 'Price war risk', checked: report.riskPriceWar },
                { label: 'Complex manufacturing', checked: report.riskManufacturing },
                { label: 'High return rate risk', checked: report.riskReturnRate },
                { label: 'Patent / IP risk', checked: report.riskPatentIP },
                { label: 'Category gating', checked: report.riskCategoryGating },
                { label: 'Certification requirements', checked: report.riskCertifications },
                { label: 'Seasonality risk', checked: report.riskSeasonality },
                { label: 'High PPC cost', checked: report.riskPPCCost }
              ].filter(item => item.checked).map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 shrink-0">
                    <i className="fa-solid fa-triangle-exclamation text-[14px]"></i>
                  </div>
                  <span className="text-[14px] font-black uppercase tracking-tight text-slate-800">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE 13: EXECUTION STRATEGY & VALUE --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              12. Execution Strategy
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { title: 'Keyword Indexing & Ranking', text: report.execPPCStrategy, color: 'blue', icon: 'fa-magnifying-glass-chart' },
              { title: 'Conversion Rate Optimization', text: report.execConversionOpt, color: 'emerald', icon: 'fa-chart-line' },
              { title: 'Differentiation & Positioning', text: report.execPositioning, color: 'amber', icon: 'fa-wand-magic-sparkles' },
              { title: 'Early Reviews & Social Proof', text: report.execEarlyReviews, color: 'indigo', icon: 'fa-star-half-stroke' },
              { title: 'Launch Pricing Strategy', text: report.execPricingStrategy, color: 'rose', icon: 'fa-tags', full: true }
            ].map((item, i) => {
              const borderColors = {
                blue: 'border-l-blue-500',
                emerald: 'border-l-emerald-500',
                amber: 'border-l-amber-500',
                indigo: 'border-l-indigo-500',
                rose: 'border-l-rose-500'
              }[item.color as keyof typeof borderColors];

              const iconColors = {
                blue: 'text-blue-500 bg-blue-50',
                emerald: 'text-emerald-500 bg-emerald-50',
                amber: 'text-amber-500 bg-amber-50',
                indigo: 'text-indigo-500 bg-indigo-50',
                rose: 'text-rose-500 bg-rose-50'
              }[item.color as keyof typeof iconColors];

              return (
                <div key={i} className={`p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3 border-l-4 ${borderColors} ${item.full ? 'col-span-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-[11px] text-slate-400 shrink-0">
                      0{i + 1}
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconColors}`}>
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                    </div>
                    <h4 className="text-[14px] font-black uppercase tracking-widest text-slate-800 leading-tight">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed font-medium pl-1">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>


        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE 13: TECHNICAL DATA VERIFICATION (Part 1) --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-4 print:space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              13. Data Validation (1/2)
            </h2>
          </div>
          <div className="space-y-4 print:space-y-2">
            {evidenceData.slice(0, 3).map((v) => (
              <div key={v.label} className="break-inside-avoid space-y-2 print:space-y-1">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
                    <i className={`fa-solid ${v.icon} text-xs`}></i>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{v.label}</h4>
                </div>
                <div className="w-full bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col p-4 md:p-6 print:p-2 bg-gradient-to-b from-slate-50 to-white shadow-sm">
                  {v.img ? (
                    <img
                      src={v.img}
                      alt={v.label}
                      className="w-full h-auto max-h-[350px] print:max-h-[220px] shadow-lg object-contain rounded-3xl border border-slate-100/50 mx-auto"
                    />
                  ) : (
                    <div className="py-12 text-slate-200 text-[10px] uppercase font-black italic tracking-[0.4em] text-center w-full">
                      <i className="fa-solid fa-image-slash mb-3 text-2xl block opacity-20"></i>
                      Evidence Missing
                    </div>
                  )}
                  {v.note && (
                    <div className="mt-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl italic text-[11px] text-slate-600 font-medium leading-relaxed shadow-sm">
                      <i className="fa-solid fa-comment-dots mr-2 text-amber-500/50"></i>
                      "{v.note}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE 14: TECHNICAL DATA VERIFICATION (Part 2) --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <section className="flex-1 space-y-4 print:space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              13. Data Validation (2/2)
            </h2>
          </div>
          <div className="space-y-4 print:space-y-4">
            {evidenceData.slice(3, 5).map((v) => (
              <div key={v.label} className="break-inside-avoid space-y-2 print:space-y-2">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
                    <i className={`fa-solid ${v.icon} text-xs`}></i>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{v.label}</h4>
                </div>
                <div className={`w-full bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col ${v.label === "Xray Product Research" ? 'p-0' : 'p-4 md:p-6 print:p-2'} bg-gradient-to-b from-slate-50 to-white shadow-sm`}>
                  {v.img ? (
                    <img
                      src={v.img}
                      alt={v.label}
                      className={`w-full h-auto ${v.label === "Xray Product Research" ? 'max-h-[800px] print:max-h-[600px] rounded-none' : 'max-h-[600px] print:max-h-[500px] rounded-3xl'} shadow-lg object-contain border border-slate-100/50 mx-auto`}
                    />
                  ) : (
                    <div className="py-12 text-slate-200 text-[10px] uppercase font-black italic tracking-[0.4em] text-center w-full">
                      <i className="fa-solid fa-image-slash mb-3 text-2xl block opacity-20"></i>
                      Evidence Missing
                    </div>
                  )}
                  {v.note && (
                    <div className={`mt-4 ${v.label === "Xray Product Research" ? 'p-6' : 'px-6 py-4'} bg-white border border-slate-100 rounded-2xl italic text-[11px] text-slate-600 font-medium leading-relaxed shadow-sm`}>
                      <i className="fa-solid fa-comment-dots mr-2 text-amber-500/50"></i>
                      "{v.note}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE: DATA VALIDATION (OTHERS) --- */}
      {report.othersImageUrl && (
        <div className="a4-page flex flex-col h-full">
          <PageHeader />
          <section className="flex-1 space-y-4 print:space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                13. Data Validation (Others)
              </h2>
            </div>
            <div className="space-y-4 print:space-y-2">
              <div className="break-inside-avoid space-y-2 print:space-y-1">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
                    <i className="fa-solid fa-folder-open text-xs"></i>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Others</h4>
                </div>
                <div className="w-full bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col p-4 md:p-6 print:p-2 bg-gradient-to-b from-slate-50 to-white shadow-sm">
                  <img
                    src={report.othersImageUrl}
                    alt="Others"
                    className="w-full h-auto max-h-[500px] print:max-h-[400px] shadow-lg object-contain rounded-3xl border border-slate-100/50 mx-auto"
                  />
                  {report.othersNotes && (
                    <div className="mt-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl italic text-[11px] text-slate-600 font-medium leading-relaxed shadow-sm">
                      <i className="fa-solid fa-comment-dots mr-2 text-amber-500/50"></i>
                      "{report.othersNotes}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          <PageFooter page={nextP()} />
        </div>
      )}

      {/* --- PAGE 15: REGULATORY REFERENCE & DISCLAIMER --- */}
      <div className="a4-page flex flex-col h-full">
        <PageHeader />
        <div className="flex-1 flex flex-col justify-start pb-10 pt-8">
          <section className="space-y-12">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                  14. Reference Links
                </h2>
              </div>

              <div className="space-y-3 mb-10">
                {[
                  { title: "Amazon Approval Required", subtitle: "Direct Policy Reference Link", url: "https://sellercentral.amazon.com/help/hub/reference/external/G200333160", icon: "fa-shield-halved", color: "amber" },
                  { title: "Restricted products", subtitle: "Amazon Policy", url: "https://sellercentral.amazon.com/help/hub/reference/G200164330", icon: "fa-circle-exclamation", color: "rose" },
                  { title: "Overview of categories", subtitle: "Amazon Policy", url: "https://sellercentral.amazon.com/help/hub/reference/G200332540", icon: "fa-layer-group", color: "blue" },
                  { title: "Product & Listing Restrictions", subtitle: "Amazon Policy", url: "https://sellercentral.amazon.com/help/hub/reference/G200301050", icon: "fa-list-check", color: "emerald" },
                  { title: "Amazon Restricted Products Guide", subtitle: "Seller Assistant Guide", url: "https://www.sellerassistant.app/blog/amazon-restricted-products-complete-guide-for-sellers/?utm_source=chatgpt.com", icon: "fa-book-open", color: "indigo" },
                  { title: "How to Get Approved Guide", subtitle: "Jungle Scout Guide", url: "https://www.junglescout.com/resources/articles/amazon-restricted-categories-2/?utm_source=chatgpt.com", icon: "fa-graduation-cap", color: "orange" }
                ].map((link, i) => (
                  <div key={i} className="p-4 bg-slate-950 rounded-2xl flex items-center justify-between group shadow-xl border border-slate-900">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center`}>
                        <i className={`fa-solid ${link.icon} text-${link.color}-500 text-lg`}></i>
                      </div>
                      <div>
                        <p className="text-[14px] font-black text-white uppercase tracking-[0.1em] leading-tight mb-1">{link.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{link.subtitle}</p>
                      </div>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-8 py-3 bg-${link.color}-500 text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-${link.color}-400 transition-all flex items-center gap-3`}
                    >
                      Open <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  </div>
                ))}
              </div>

              <div className="my-10 h-px bg-slate-100 w-full relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 bg-slate-50 px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Research Links</div>
              </div>
              <div className="flex flex-col gap-3">
                {report.amazonProductUrl && (
                  <div className="p-4 bg-slate-950 rounded-2xl flex items-center justify-between group shadow-xl border border-slate-900 gap-4 overflow-hidden">
                    <div className="flex items-center gap-5 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        <i className="fa-brands fa-amazon text-orange-500 text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-black text-white uppercase tracking-[0.1em] leading-tight mb-1 truncate">PRODUCT PAGE URL</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic truncate">{report.amazonProductUrl}</p>
                      </div>
                    </div>
                    <a
                      href={report.amazonProductUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-amber-500 text-slate-950 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-400 transition-all flex items-center gap-3 shrink-0"
                    >
                      OPEN <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  </div>
                )}

                {report.supplierUrl && (
                  <div className="p-4 bg-slate-950 rounded-2xl flex items-center justify-between group shadow-xl border border-slate-900 gap-4 overflow-hidden">
                    <div className="flex items-center gap-5 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-industry text-blue-500 text-lg"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-black text-white uppercase tracking-[0.1em] leading-tight mb-1 truncate">Direct Supplier / Warehouse Link</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic truncate">{report.supplierUrl}</p>
                      </div>
                    </div>
                    <a
                      href={report.supplierUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all flex items-center gap-3 shrink-0"
                    >
                      OPEN <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  </div>
                )}

                {report.competitorUrls && report.competitorUrls.length > 0 && (
                  <div className="mt-4 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                        <i className="fa-solid fa-fire text-sm"></i>
                      </div>
                      <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Additional Competitor Benchmarks</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {report.competitorUrls.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-all flex items-center justify-between group/link shadow-sm hover:shadow-md">
                          <span className="truncate max-w-[80%] opacity-70 group-hover/link:opacity-100">Competitor Link #{idx + 1}</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-0 group-hover/link:opacity-100 transition-opacity"></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>
        <PageFooter page={nextP()} />
      </div>

      {/* --- PAGE 16: THE VALUE BEHIND THIS ANALYSIS (FINAL PAGE) --- */}
      <div className="a4-page bg-[#0f172a] flex flex-col items-center justify-center text-center px-16 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>

        <div className="w-24 h-1.5 bg-amber-500 rounded-full mb-16 opacity-80"></div>

        <div className="space-y-4 mb-20">
          <h1 className="text-[52px] font-black text-white uppercase tracking-tighter leading-none m-0">
            The Value Behind
          </h1>
          <h2 className="text-[52px] font-black text-indigo-400 uppercase tracking-widest leading-none m-0 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
            This Analysis
          </h2>
        </div>

        <p className="text-[19px] text-slate-300 font-medium leading-relaxed max-w-4xl italic px-8 mb-16">
          "Each vetted opportunity reflects extensive research, multi-layered validation, and real market intelligence.
          We don't just analyze numbers — we decode buyer behavior, expose competitive weaknesses, and identify positioning gaps that others miss."
        </p>

        <div className="w-full h-px bg-slate-800/80 mb-12"></div>

        <div className="grid grid-cols-3 gap-4 w-full mb-12">
          <div className="space-y-4">
            <div className="text-[48px] font-black text-emerald-400 leading-none drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]">98%</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Manual Verification</div>
          </div>
          <div className="space-y-4">
            <div className="text-[48px] font-black text-indigo-400 leading-none drop-shadow-[0_0_10px_rgba(129,140,248,0.2)]">80+</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Data Points Checked</div>
          </div>
          <div className="space-y-4">
            <div className="text-[48px] font-black text-amber-400 leading-none drop-shadow-[0_0_10px_rgba(251,191,36,0.2)]">01</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Priority: Your Success</div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-800/80 mb-16"></div>

        <div className="space-y-12">
          <div className="text-white text-[16px] font-black uppercase tracking-[0.4em] opacity-90">
            Better Data. Smarter Decisions. Stronger Brands.
          </div>
          <div className="w-24 h-1.5 bg-amber-500 rounded-full mx-auto opacity-80"></div>
        </div>

        <div className="absolute bottom-10 left-16 right-16 flex items-center justify-between border-t border-slate-800/50 pt-8 mt-auto text-[10px] font-black text-slate-600 uppercase tracking-widest">
          <div>THIS REPORT IS POWERED BY VETTEDNICHE</div>
          <div>PAGE 14</div>
        </div>
      </div>

      {/* --- PAGE 17: FINAL VERDICT & DISCLOSURE (ABSOLUTE FINAL PAGE) --- */}
      <div className="a4-page flex flex-col h-full bg-white">
        <PageHeader />

        <section className="flex-1 space-y-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
              15. Final Verdict & Disclosure
            </h2>
          </div>

          {/* Disclosure Card */}
          <div className="relative p-10 rounded-[3rem] bg-slate-50 border border-slate-100 overflow-hidden flex flex-col gap-8">
            {/* Disclaimer Notice */}
            <div className="space-y-3">
              <h4 className="text-[16px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                Disclaimer Notice
              </h4>
              <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                All data presented is derived from industry tools and market observations and should be used for informational purposes only. This report is not financial or legal advice.
              </p>
            </div>

            <div className="h-px bg-slate-200/60 w-full"></div>

            {/* Product Compliance Disclaimer */}
            <div className="space-y-4">
              <h4 className="text-[16px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-xs"></i>
                Product Compliance Disclaimer
              </h4>
              <div className="space-y-3 text-[13.5px] text-slate-600 leading-relaxed font-medium">
                <p>
                  Some products may require specific certifications, approvals, or compliance documentation before being listed or sold on Amazon. Requirements may vary depending on your seller account type, category approvals, regional regulations, and Amazon's policies — which are subject to change without notice.
                </p>
                <p className="text-rose-600 font-black">
                  It is solely the seller's responsibility to verify all listing requirements, obtain necessary certifications, and ensure full compliance with Amazon's policies prior to sourcing or launching any product. VettedNiche assumes no liability for any account suspensions, listing removals, financial losses, or legal consequences arising from non-compliance.
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200/60 w-full"></div>

            {/* Confidentiality & Intellectual Property */}
            <div className="space-y-3">
              <h4 className="text-[16px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-lock text-xs"></i>
                Confidentiality & Intellectual Property
              </h4>
              <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
                This report is proprietary intellectual property of VettedNiche. Unauthorized distribution, resale, or public sharing is strictly prohibited. <strong className="text-amber-600 font-black">Maintaining exclusivity is essential to preserving your competitive advantage.</strong>
              </p>
            </div>
          </div>

          <div className="flex-1"></div>

          {/* Bottom Branding Card */}
          <div className="p-10 rounded-[3rem] bg-slate-950 text-white flex items-center justify-between shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-slate-950"></div>

            <div className="relative z-10 space-y-4">
              <div className="text-amber-500 text-[11px] font-black uppercase tracking-[0.4em] mb-1">
                READY FOR GROWTH
              </div>
              <h2 className="text-[36px] font-black uppercase tracking-[0.2em] leading-none m-0 italic">
                Vetted Niche
              </h2>
              <p className="text-[14px] text-slate-300 font-medium max-w-sm leading-relaxed opacity-90">
                Vetted Products. Proven Data. Real Profit Potential.
              </p>
            </div>

            <div className="relative z-10 w-24 h-24 rounded-full border-2 border-slate-700 flex items-center justify-center p-1.5 bg-slate-800/50 shadow-[0_0_30px_rgba(30,41,59,0.5)]">
              <div className="w-full h-full rounded-full border border-slate-600 flex items-center justify-center bg-slate-900 shadow-inner">
                <i className="fa-solid fa-crown text-amber-500 text-2xl drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"></i>
              </div>
            </div>
          </div>
        </section>

        <PageFooter page={nextP()} />
      </div>
    </div>
  );
};

export default ReportPreview;
