
import React from 'react';
import { KeywordReport, CompetitionLevel, Eligibility, DemandType, TrendStatus, RankingDifficulty } from '../types';

interface ReportPreviewProps { report: KeywordReport; }

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
    { label: "Search Volume History", img: report.searchVolumeImageUrl, icon: "fa-arrow-trend-up", note: report.searchVolumeNotes }
  ];

  const vitalStats = [
    { label: "Search Vol", value: report.monthlySearchVolume.toLocaleString(), icon: "fa-magnifying-glass" },
    { label: "Est. Sales", value: report.estimatedMonthlySales.toLocaleString(), icon: "fa-cart-shopping" },
    { label: "Competition", value: report.competitionLevel, icon: "fa-gauge-simple-high" },
    { label: "Total Sellers", value: report.competitorsCount, icon: "fa-users" },
    { label: "Avg Reviews", value: report.reviews, icon: "fa-star" },
    { label: "EST Cost Price", value: `$${report.estimatedCostPrice.toFixed(2)}`, icon: "fa-tag" },
    { label: "Title Density", value: report.sellersWithKeywordInTitle, icon: "fa-heading" },
    { label: "BSR", value: `#${report.bsr.toLocaleString()}`, icon: "fa-trophy" },
    { label: "Trend", value: report.trendStatus, icon: report.trendStatus === TrendStatus.TRENDING ? "fa-fire" : "fa-minus" },
    { label: "Demand", value: report.demandType === DemandType.SEASONAL ? "Seasonal" : "Year-Round", icon: report.demandType === DemandType.SEASONAL ? "fa-cloud-sun" : "fa-calendar-days" },
    { label: "FBA Sellers", value: report.fbaSellersCount?.toString() || '0', icon: "fa-box-open" },
    { label: "FBM Sellers", value: report.fbmSellersCount?.toString() || '0', icon: "fa-truck-fast" }
  ];

  return (
    <div className="bg-white shadow-2xl rounded-[2.5rem] print:rounded-none overflow-hidden print-container border border-slate-200 flex flex-col min-h-screen">

      {/* --- PAGE 1: 25% HEADER + 75% DASHBOARD --- */}
      <div className="print:h-[270mm] print:overflow-hidden flex flex-col print:break-after-page">

        {/* Header - 25% Height Optimization for Print */}
        <div className="bg-slate-900 text-white p-8 md:p-10 print:p-4 relative overflow-hidden flex flex-col justify-center print:h-[25%] shrink-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>

          {/* Reference ID - Compact for print */}
          <div className="absolute top-8 right-8 print:top-4 print:right-4 z-20 flex flex-col items-end group print:scale-75 print:transform-gpu">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Reference ID</span>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
              <span className="text-amber-500 font-mono font-black text-xs tracking-widest">{report.reportNumber}</span>
            </div>
          </div>

          <div className="relative z-10 w-full">
            {/* Force Flex Row in Print to save space and keep image visible */}
            <div className="flex flex-col md:flex-row print:flex-row gap-6 print:gap-3 items-start print:items-center">

              {/* Product Image - Explicit Print Sizing */}
              {report.productImageUrl && (
                <div className="w-24 h-24 md:w-36 md:h-36 print:w-24 print:h-24 rounded-3xl bg-white p-1.5 shrink-0 shadow-2xl overflow-hidden border border-white/10">
                  <img src={report.productImageUrl} alt="Product" className="w-full h-full object-cover rounded-[1.2rem]" />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-3 print:space-y-1">
                <div className="flex items-center gap-3 print:gap-2">
                  <span className="px-3 py-0.5 bg-amber-500 text-slate-900 text-[8px] print:text-[6px] font-black uppercase tracking-[0.2em] rounded-full shrink-0">Market Alpha Asset</span>
                  <h1 className="text-[9px] print:text-[7px] font-bold tracking-[0.3em] text-slate-500 uppercase whitespace-nowrap">Exclusive Keyword Report</h1>
                </div>

                <div className="flex flex-col items-start gap-1 py-1">
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500 mb-0.5">Keyword product</span>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 print:px-3 print:py-1.5 rounded-[1.5rem] print:rounded-xl backdrop-blur-md shadow-inner">
                    <h2 className="text-xl md:text-2xl lg:text-3xl print:text-base font-black tracking-tight text-white leading-none italic">
                      {report.keyword || 'Keyword'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 print:text-slate-500">
                  <i className="fa-solid fa-layer-group text-amber-500/50 text-[10px] print:text-[8px]"></i>
                  <p className="text-[10px] print:text-[8px] font-black uppercase tracking-widest leading-none">{report.category || 'Category'}</p>
                </div>

                {/* Header Metrics Grid - Compact Row for Print */}
                <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-4 gap-3 print:gap-1.5 mt-8 print:mt-1.5">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl print:rounded-lg p-4 print:p-1.5 shadow-lg shadow-amber-500/5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-1.5 print:mb-0.5">
                      <span className="text-[8px] print:text-[6px] font-black uppercase tracking-widest text-amber-500 block">Opp Score</span>
                      <HeroSparkline />
                    </div>
                    <div className="text-2xl print:text-base font-black text-amber-500 flex items-baseline gap-1">
                      {report.opportunityScore}
                      <span className="text-[10px] print:text-[6px] text-slate-500 font-bold">/100</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl print:rounded-lg p-4 print:p-1.5">
                    <span className="text-[8px] print:text-[6px] font-black uppercase tracking-widest text-slate-400 block mb-1.5 print:mb-0.5">Search Vol</span>
                    <div className="text-lg print:text-xs font-black text-white">{report.monthlySearchVolume.toLocaleString()}</div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl print:rounded-lg p-4 print:p-1.5">
                    <span className="text-[8px] print:text-[6px] font-black uppercase tracking-widest text-slate-400 block mb-1.5 print:mb-0.5">Target Price</span>
                    <div className="text-lg print:text-xs font-black text-white">${report.sellingPrice.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl print:rounded-lg p-4 print:p-1.5">
                    <span className="text-[8px] print:text-[6px] font-black uppercase tracking-widest text-slate-400 block mb-1.5 print:mb-0.5">Est Profit</span>
                    <div className="text-lg print:text-xs font-black text-emerald-400">${report.estimatedMonthlyProfit.toLocaleString()}</div>
                  </div>
                </div>

                {/* Unique Entry Banner - Refined for Print */}
                <div className="mt-8 print:mt-2 flex items-center gap-5 print:gap-2 py-4 print:py-1 px-6 print:px-3 bg-slate-950/40 border border-white/5 rounded-[2rem] print:rounded-xl backdrop-blur-xl w-fit group">
                  <div className="w-12 h-12 print:w-6 print:h-6 rounded-2xl print:rounded-lg bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 transition-transform group-hover:scale-105">
                    <i className="fa-solid fa-crown text-xl print:text-[10px]"></i>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[10px] md:text-xs print:text-[7px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1 print:mb-0.5">
                      YOU ARE THE ONLY OWNER OF THIS KEYWORD ON KEYWORD WINNER.
                    </h4>
                    <span className="text-[7px] print:text-[5px] font-black text-slate-500 uppercase tracking-[0.4em]">Exclusive & Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Pill - Better Positioning for Print to prevent overlap */}
          <div className="absolute bottom-4 print:relative print:bottom-0 print:left-0 print:translate-x-0 print:mt-3 z-30 w-full flex justify-center px-4 print:px-0 print:scale-95 print:transform-gpu">
            <div className={`px-8 print:px-4 py-4 print:py-1.5 rounded-full border border-white/10 backdrop-blur-3xl flex items-center gap-8 print:gap-3 shadow-2xl ${getEligibilityStyles(report.eligibility)}`}>
              <div className="flex items-center gap-4 print:gap-1.5">
                <div className="w-9 h-9 print:w-6 print:h-6 rounded-full flex items-center justify-center border border-current bg-white/5 shadow-inner shrink-0">
                  <i className={`fa-solid ${report.eligibility === Eligibility.ELIGIBLE ? 'fa-check' : report.eligibility === Eligibility.NOT_ELIGIBLE ? 'fa-xmark' : 'fa-info'} text-xs print:text-[8px]`}></i>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] print:text-[6px] font-black uppercase tracking-[0.3em] opacity-50 leading-none mb-1 print:mb-0.5">Status Eligibility</span>
                  <span className="text-[13px] print:text-[10px] font-black uppercase tracking-tight leading-none whitespace-nowrap">{report.eligibility}</span>
                </div>
              </div>

              <div className="w-px h-8 print:h-5 bg-white/10"></div>

              <div className="flex items-center gap-4 print:gap-1.5">
                <div className="w-9 h-9 print:w-6 print:h-6 rounded-full flex items-center justify-center border border-current bg-white/5 shadow-inner shrink-0">
                  <i className="fa-solid fa-signal text-[10px] print:text-[8px]"></i>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] print:text-[6px] font-black uppercase tracking-[0.3em] opacity-50 leading-none mb-1 print:mb-0.5">Target Seller</span>
                  <span className="text-[13px] print:text-[10px] font-black uppercase tracking-tight leading-none whitespace-nowrap">{report.sellerLevel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Section - 75% Height (Allowing growth if keywords overflow) */}
        <div className="p-8 md:p-14 print:p-8 pt-16 md:pt-20 print:pt-10 space-y-10 print:space-y-6 bg-white print:min-h-[75%] flex flex-col">
          <section className="flex-1 flex flex-col">
            <div className="flex items-center mb-10 print:mb-6">
              <div className="w-10 h-0.5 bg-amber-500 mr-4"></div>
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">Market Vital Dashboard</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 print:grid-cols-4 gap-5 print:gap-3 mb-10 print:mb-4">
              {vitalStats.map((stat) => (
                <div key={stat.label} className="p-7 print:p-4 rounded-[2.5rem] print:rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/40 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:border-amber-200 group">
                  <div className="w-12 h-12 print:w-10 print:h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-5 print:mb-1 group-hover:bg-amber-50 group-hover:text-amber-500 transition-all">
                    <i className={`fa-solid ${stat.icon} text-sm print:text-xs`}></i>
                  </div>
                  <div className="text-[10px] print:text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 print:mb-1 leading-none">{stat.label}</div>
                  <div className={`text-[15px] print:text-[13px] font-black leading-none tracking-tight ${stat.label === "Demand" ? 'text-blue-600' :
                    stat.label === "Trend" && stat.value === TrendStatus.TRENDING ? 'text-amber-600' :
                      stat.label === "Competition" ? (
                        stat.value === CompetitionLevel.LOW ? 'text-emerald-600' :
                          stat.value === CompetitionLevel.HIGH ? 'text-rose-600' : 'text-amber-600'
                      ) : 'text-slate-900'
                    }`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-7 print:p-4 rounded-[2.5rem] print:rounded-2xl border shadow-sm flex flex-col md:flex-row items-center gap-7 print:gap-4 ${getRankingColorClass(report.rankingDifficulty)}`}>
              <div className="flex items-center gap-5 shrink-0 print:gap-2">
                <div className="w-14 h-14 print:w-10 print:h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                  <i className="fa-solid fa-ranking-star text-xl print:text-base"></i>
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 leading-none mb-2 print:mb-1">Ranking Protocol</div>
                  <div className="text-base print:text-sm font-black uppercase tracking-tight leading-none">{report.rankingDifficulty}</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-black/5"></div>
              <p className="text-[13px] print:text-[10px] font-bold leading-relaxed opacity-90 text-center md:text-left flex-1">
                {getRankingDescription(report.rankingDifficulty)}
              </p>
            </div>

            {/* Related Keywords - Compact for print with no truncation */}
            {report.relatedKeywords && report.relatedKeywords.length > 0 && (
              <div className="mt-8 print:mt-4 p-10 print:p-4 bg-white border border-slate-100 rounded-[2.5rem] print:rounded-2xl flex flex-col items-center gap-10 print:gap-3 shadow-sm overflow-hidden min-h-0">
                <div className="flex flex-col items-center gap-3 print:gap-1 shrink-0">
                  <div className="flex items-center gap-3 text-slate-300">
                    <i className="fa-solid fa-tags text-sm print:text-[10px]"></i>
                    <span className="text-[11px] print:text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Related Keywords</span>
                  </div>
                  <div className="w-12 h-1 print:h-0.5 bg-amber-500/20 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-3 gap-5 print:gap-1.5 w-full print:overflow-visible overflow-y-auto pr-2 custom-scrollbar">
                  {report.relatedKeywords.map((kw, i) => (
                    <a
                      key={i}
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(kw)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 print:px-2 print:py-0.5 bg-slate-50 border border-slate-200 rounded-2xl print:rounded-lg text-[12px] print:text-[8px] font-black text-slate-700 uppercase tracking-tight shadow-sm hover:border-amber-400 hover:bg-white transition-all flex items-center gap-4 print:gap-1.5 group cursor-pointer no-underline"
                    >
                      <span className="w-9 h-9 print:w-5 print:h-5 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-amber-500 font-mono text-[11px] print:text-[8px] shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        {i + 1}
                      </span>
                      <span className="flex-1 whitespace-normal break-words py-1 group-hover:text-slate-900 leading-tight">{kw}</span>
                      <i className="fa-solid fa-arrow-right text-[10px] print:hidden text-slate-300 group-hover:translate-x-1 group-hover:text-amber-500 transition-all"></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* --- PAGE 2: TECHNICAL DATA VERIFICATION ONLY --- */}
      <div className="p-8 md:p-14 print:pt-4 print:px-10 print:pb-4 bg-white print:min-h-[270mm]">
        <section className="space-y-4 print:space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-10 h-px bg-amber-500"></span> Technical Data Verification
            </h3>
          </div>
          <div className="space-y-4 print:space-y-4">
            {evidenceData.map((v) => (
              <div key={v.label} className="break-inside-avoid space-y-2 print:space-y-2">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100">
                    <i className={`fa-solid ${v.icon} text-xs`}></i>
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{v.label}</h4>
                </div>
                <div className="w-full bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col p-4 md:p-6 print:p-2 bg-gradient-to-b from-slate-50 to-white shadow-sm">
                  {v.img ? (
                    <img src={v.img} alt={v.label} className="w-full h-auto max-h-[300px] print:max-h-[220px] object-contain rounded-3xl shadow-lg border border-slate-100" />
                  ) : (
                    <div className="py-12 text-slate-200 text-[10px] uppercase font-black italic tracking-[0.4em] text-center w-full">
                      <i className="fa-solid fa-image-slash mb-3 text-2xl block opacity-20"></i>
                      Evidence Missing
                    </div>
                  )}
                  {v.note && (
                    <div className="mt-6 px-6 py-4 bg-white border border-slate-100 rounded-2xl italic text-[11px] text-slate-600 font-medium leading-relaxed shadow-sm">
                      <i className="fa-solid fa-comment-dots mr-2 text-amber-500/50"></i>
                      "{v.note}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- PAGE 3+: STRATEGIC ROADMAP --- */}
      <div className="p-8 md:p-14 print:p-10 bg-white print:min-h-[297mm] print:break-before-page flex flex-col">
        <div className="flex-1 space-y-12 pb-10">
          <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-10 h-px bg-amber-500"></span> Strategic Roadmap & Analysis
          </h3>

          <div className="space-y-16">
            {/* Competitor Issues */}
            {(report.competitorIssues.length > 0 || report.competitorAnalysis) && (
              <section className="break-inside-avoid space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-100"><i className="fa-solid fa-triangle-exclamation text-sm"></i></div>
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Competitor Vulnerability Gaps</h4>
                </div>
                <div className="p-8 bg-rose-50/30 border border-rose-100 rounded-[2.5rem] space-y-6">
                  {report.competitorIssues.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {report.competitorIssues.map(issue => (
                        <span key={issue} className="px-3 py-1.5 bg-white border border-rose-200 rounded-lg text-[10px] font-black text-rose-600 uppercase shadow-sm">{issue}</span>
                      ))}
                    </div>
                  )}
                  {report.competitorAnalysis && (
                    <div className="text-[15px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-2 border-rose-200 pl-6">
                      {report.competitorAnalysis}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Advantage & Risk Gaps */}
            <div className="flex flex-col gap-16">
              <section className="break-inside-avoid space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><i className="fa-solid fa-star text-sm"></i></div>
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Core Advantage</h4>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-emerald-50/30 border border-emerald-100 w-full space-y-8">
                  {report.keyAdvantage && (
                    <p className="text-[16px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-4 border-emerald-200 pl-8">
                      {report.keyAdvantage}
                    </p>
                  )}
                </div>
              </section>

              <section className="break-inside-avoid space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-400 flex items-center justify-center text-white"><i className="fa-solid fa-shield-virus text-sm"></i></div>
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Risk Mitigation</h4>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 w-full space-y-8">
                  {report.mainRisk && (
                    <p className="text-[16px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-4 border-slate-300 pl-8">
                      {report.mainRisk}
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Exclusive Market Logic */}
            <section className="break-inside-avoid space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white"><i className="fa-solid fa-brain text-sm"></i></div>
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Exclusive Market Logic</h4>
              </div>
              <div className="p-8 bg-orange-50/50 border border-orange-100 rounded-[2.5rem] text-[15px] font-bold italic leading-relaxed whitespace-pre-wrap border-l-2 border-amber-200 pl-6">
                {report.exclusiveReason}
              </div>
            </section>

            {/* Ownership Value */}
            {report.ownershipValue && (
              <section className="break-inside-avoid space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-100"><i className="fa-solid fa-gem text-sm"></i></div>
                  <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Ownership Value Pillar</h4>
                </div>
                <div className="p-8 bg-blue-50/30 border border-blue-100 rounded-[2.5rem] space-y-6">
                  {report.ownershipValueTags && report.ownershipValueTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {report.ownershipValueTags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-[10px] font-black text-blue-600 uppercase shadow-sm">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="text-[15px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-2 border-blue-200 pl-6">
                    {report.ownershipValue}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* --- FOOTER: REGULATORY REFERENCE --- */}
        <div className="mt-auto pt-10 border-t border-slate-100">
          <section className="space-y-12">
            <div className="max-w-4xl mx-auto px-4 break-inside-avoid">
              <div className="flex flex-col gap-6 mb-8 p-8 print:p-6 bg-slate-50 border border-slate-100 rounded-[2rem] print:rounded-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6 mb-2">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-shield-check text-slate-400 text-lg"></i>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Regulatory Reference</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase">Critical Compliance Guidelines</p>
                    </div>
                  </div>
                  <a
                    href="https://sellercentral.amazon.com/help/hub/reference/external/G200333160"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 flex items-center gap-2 underline underline-offset-4"
                  >
                    Amazon Approval Required Policy <i className="fa-solid fa-up-right-from-square text-[7px]"></i>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {report.amazonProductUrl && (
                    <div className="space-y-1 text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Amazon Target</p>
                      <a href={report.amazonProductUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 truncate block hover:underline">Product Link</a>
                    </div>
                  )}
                  {report.supplierUrl && (
                    <div className="space-y-1 text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Supply Source</p>
                      <a href={report.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 truncate block hover:underline">Sourcing Link</a>
                    </div>
                  )}
                  {report.competitorUrls && report.competitorUrls.length > 0 && (
                    <div className="space-y-2 text-left md:col-span-2 lg:col-span-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Market Rivals</p>
                      <div className="flex flex-col gap-1">
                        {report.competitorUrls.map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-blue-600 truncate block hover:underline">
                            Competitor Asset {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[7px] text-slate-400 leading-relaxed text-center font-bold uppercase tracking-tight max-w-5xl mx-auto">
                <span className="font-black text-slate-900 mr-1">DISCLAIMER:</span>
                KEYWORD WINNER PROVIDES MARKET INTELLIGENCE FOR INFORMATIONAL PURPOSES ONLY. WE DO NOT GUARANTEE FINANCIAL OUTCOMES, SALES VOLUMES, OR MARKETPLACE STABILITY. DECISIONS BASED ON THIS REPORT ARE THE SOLE RESPONSIBILITY OF THE USER. MARKET CONDITIONS ON AMAZON ARE SUBJECT TO RAPID CHANGE. WE ARE NOT AN OFFICIAL AMAZON AFFILIATE. USE OF VERIFIED TOOL SCREENSHOTS (KEEPA, HELIUM10) IS FOR COMPARATIVE HISTORICAL ANALYSIS AND DOES NOT CONSTITUTE A GUARANTEE OF FUTURE PERFORMANCE.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center pb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs shadow-lg">KW</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Keyword Winner Intelligence © 2026</div>
              </div>

              <div className="flex items-center gap-8">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Confidential</span>
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Premium Exclusive Asset</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
