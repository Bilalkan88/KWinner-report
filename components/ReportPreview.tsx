
import React from 'react';
import { KeywordReport, CompetitionLevel, Eligibility, DemandType, TrendStatus, RankingDifficulty } from '../types';

interface ReportPreviewProps { report: KeywordReport; }

const HeroSparkline: React.FC<{ color?: string }> = ({ color = 'bg-amber-400' }) => {
  const bars = [30, 50, 40, 70, 60, 90, 80];
  return (
    <div className="flex items-end gap-1 h-4">
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
    <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden print-container border border-slate-200 flex flex-col min-h-screen">
      
      {/* --- PAGE 1: EXECUTIVE SUMMARY & VITAL METRICS --- */}
      <div className="page-break-after-always">
        <div className="bg-slate-900 text-white p-8 md:p-10 relative overflow-hidden pb-20 md:pb-24">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
          
          <div className="absolute top-8 right-8 z-20 flex flex-col items-end group no-print">
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Reference ID</span>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
              <span className="text-amber-500 font-mono font-black text-xs tracking-widest">{report.reportNumber}</span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {report.productImageUrl && (
                <div className="w-24 h-24 md:w-36 md:h-36 rounded-3xl bg-white p-1.5 shrink-0 shadow-2xl overflow-hidden border border-white/10">
                  <img src={report.productImageUrl} alt="Product" className="w-full h-full object-cover rounded-[1.2rem]" />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-0.5 bg-amber-500 text-slate-900 text-[8px] font-black uppercase tracking-[0.2em] rounded-full shrink-0">Market Alpha Asset</span>
                  <h1 className="text-[9px] font-bold tracking-[0.3em] text-slate-500 uppercase">Exclusive Keyword Report</h1>
                </div>
                
                <div className="flex flex-col items-start gap-1 py-1">
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Keyword product</span>
                  <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-[1.5rem] backdrop-blur-md shadow-inner">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white leading-none">
                      {report.keyword || 'Keyword'}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <i className="fa-solid fa-layer-group text-amber-500/50 text-[10px]"></i>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">{report.category || 'Category'}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 shadow-lg shadow-amber-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-12 h-12 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 block">Opp Score</span>
                      <HeroSparkline />
                    </div>
                    <div className="text-2xl font-black text-amber-500 flex items-baseline gap-1">
                      {report.opportunityScore}
                      <span className="text-[10px] text-slate-500 font-bold">/100</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Search Volume</span>
                    <div className="text-lg font-black text-white">{report.monthlySearchVolume.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Target Price</span>
                    <div className="text-lg font-black text-white">${report.sellingPrice.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">Est Profit</span>
                    <div className="text-lg font-black text-emerald-400">${report.estimatedMonthlyProfit.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-5 py-4 px-6 bg-slate-950/40 border border-white/5 rounded-[2rem] backdrop-blur-xl w-fit group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/5 shrink-0 transition-transform group-hover:scale-105">
                    <i className="fa-solid fa-crown text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-[10px] md:text-xs font-black text-amber-500 uppercase tracking-widest leading-none mb-1.5">
                      You are the only owner of this keyword on Keyword Winner.
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-[1px] bg-slate-700"></div>
                      <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em]">Verified Unique Entry</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-full flex justify-center px-4">
            <div className={`px-8 py-4 rounded-full border border-white/10 backdrop-blur-3xl flex items-center gap-8 transition-all hover:scale-[1.02] duration-500 ${getEligibilityStyles(report.eligibility)}`}>
               <div className="flex items-center gap-4">
                 <div className="w-9 h-9 rounded-full flex items-center justify-center border border-current bg-white/5 shadow-inner shrink-0">
                   <i className={`fa-solid ${report.eligibility === Eligibility.ELIGIBLE ? 'fa-check' : report.eligibility === Eligibility.NOT_ELIGIBLE ? 'fa-xmark' : 'fa-info'} text-xs`}></i>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50 leading-none mb-1">Status Eligibility</span>
                    <span className="text-[13px] font-black uppercase tracking-tight leading-none whitespace-nowrap">{report.eligibility}</span>
                 </div>
               </div>

               <div className="w-px h-8 bg-white/10 no-print"></div>

               <div className="flex items-center gap-4">
                 <div className="w-9 h-9 rounded-full flex items-center justify-center border border-current bg-white/5 shadow-inner shrink-0">
                   <i className="fa-solid fa-signal text-[10px]"></i>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50 leading-none mb-1">Target Seller</span>
                    <span className="text-[13px] font-black uppercase tracking-tight leading-none whitespace-nowrap">{report.sellerLevel}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-14 pt-16 md:pt-20 space-y-10 bg-white">
          <section className="page-break-avoid">
            <div className="flex items-center mb-10">
              <div className="w-10 h-0.5 bg-amber-500 mr-4"></div>
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">
                Market Vital Dashboard
              </h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {vitalStats.map((stat) => (
                <div key={stat.label} className="p-7 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/40 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:border-amber-200 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-5 group-hover:bg-amber-50 group-hover:text-amber-500 transition-all">
                    <i className={`fa-solid ${stat.icon} text-sm`}></i>
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 leading-none">{stat.label}</div>
                  <div className={`text-[15px] font-black leading-none tracking-tight ${
                    stat.label === "Demand" ? 'text-blue-600' : 
                    stat.label === "Trend" && stat.value === TrendStatus.TRENDING ? 'text-amber-600' : 
                    stat.label === "Competition" ? (
                      stat.value === CompetitionLevel.LOW ? 'text-emerald-600' :
                      stat.value === CompetitionLevel.HIGH ? 'text-rose-600' : 'text-amber-600'
                    ) :
                    stat.label === "FBA Sellers" ? 'text-orange-600' :
                    stat.label === "FBM Sellers" ? 'text-blue-500' :
                    'text-slate-900'
                  }`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-10 p-7 rounded-[2.5rem] border shadow-sm flex flex-col md:flex-row items-center gap-7 ${getRankingColorClass(report.rankingDifficulty)}`}>
              <div className="flex items-center gap-5 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                  <i className="fa-solid fa-ranking-star text-xl"></i>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 leading-none mb-2">Ranking Protocol</div>
                  <div className="text-base font-black uppercase tracking-tight leading-none">{report.rankingDifficulty}</div>
                </div>
              </div>
              <div className="hidden md:block w-px h-10 bg-black/5"></div>
              <p className="text-[13px] font-bold leading-relaxed opacity-90 text-center md:text-left flex-1">
                {getRankingDescription(report.rankingDifficulty)}
              </p>
            </div>
            
            {/* UPDATED RELATED KEYWORDS SECTION: COMPACT HEIGHT + ACTIVE AMAZON SEARCH LINKS */}
            {report.relatedKeywords && report.relatedKeywords.length > 0 && (
              <div className="mt-8 p-10 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center gap-10 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 text-slate-300">
                    <i className="fa-solid fa-tags text-sm"></i>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Related Keywords</span>
                  </div>
                  <div className="w-12 h-1 bg-amber-500/20 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  {report.relatedKeywords.map((kw, i) => (
                    <a 
                      key={i} 
                      href={`https://www.amazon.com/s?k=${encodeURIComponent(kw)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black text-slate-700 uppercase tracking-tight shadow-sm hover:border-amber-400 hover:bg-white transition-all flex items-center gap-4 group cursor-pointer no-underline"
                    >
                      <span className="w-9 h-9 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-amber-500 font-mono text-[11px] shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        {i + 1}
                      </span>
                      <span className="flex-1 whitespace-normal break-words py-1 group-hover:text-slate-900">{kw}</span>
                      <i className="fa-solid fa-arrow-right text-[10px] text-slate-300 group-hover:translate-x-1 group-hover:text-amber-500 transition-all"></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* --- PAGE 2: MARKET EVIDENCE --- */}
      <div className="p-8 md:p-14 space-y-12 bg-white">
        <section className="space-y-10">
          <div className="flex items-center gap-4">
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
               <span className="w-10 h-px bg-amber-500"></span> Technical Data Verification
             </h3>
          </div>
          <div className="space-y-16">
            {evidenceData.map((v) => (
              <div key={v.label} className="page-break-avoid space-y-5">
                <div className="flex items-center gap-3 px-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-amber-500 shadow-sm border border-slate-100">
                      <i className={`fa-solid ${v.icon} text-xs`}></i>
                   </div>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">{v.label}</h4>
                </div>
                <div className="w-full bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col p-4 md:p-6 bg-gradient-to-b from-slate-50 to-white">
                  {v.img ? (
                    <img src={v.img} alt={v.label} className="w-full h-auto object-contain rounded-3xl shadow-lg border border-slate-100 max-h-[400px]" />
                  ) : (
                    <div className="py-20 text-slate-200 text-[10px] uppercase font-black italic tracking-[0.4em] text-center w-full">
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

      {/* --- PAGE 3: STRATEGIC ROADMAP --- */}
      <div className="p-8 md:p-14 space-y-12 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-10">
          <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
             <span className="w-10 h-px bg-amber-500"></span> Strategic Roadmap & Analysis
          </h3>
          
          <div className="space-y-16">
            {/* 1. Competitor Issues */}
            { (report.competitorIssues.length > 0 || report.competitorAnalysis) && (
              <section className="page-break-avoid space-y-5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-100">
                     <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                   </div>
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

            {/* 2. Advantage & Risk - STACKED VERTICALLY FULL WIDTH */}
            <div className="flex flex-col gap-16">
              <section className="page-break-avoid space-y-5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                     <i className="fa-solid fa-star text-sm"></i>
                   </div>
                   <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Core Advantage</h4>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-emerald-50/30 border border-emerald-100 w-full space-y-8">
                   {report.keyAdvantageTags.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {report.keyAdvantageTags.map(tag => (
                        <span key={tag} className="px-4 py-2 bg-white border border-emerald-200 rounded-xl text-[11px] font-black text-emerald-600 uppercase shadow-sm">{tag}</span>
                      ))}
                    </div>
                   )}
                   {report.keyAdvantage && (
                     <p className="text-[16px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-4 border-emerald-200 pl-8">
                       {report.keyAdvantage}
                     </p>
                   )}
                </div>
              </section>

              <section className="page-break-avoid space-y-5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-400 flex items-center justify-center text-white">
                     <i className="fa-solid fa-shield-virus text-sm"></i>
                   </div>
                   <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Risk Mitigation</h4>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 w-full space-y-8">
                   {report.mainRiskTags.length > 0 && (
                     <div className="flex flex-wrap gap-3">
                       {report.mainRiskTags.map(tag => (
                         <span key={tag} className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-[11px] font-black text-slate-600 uppercase shadow-sm">{tag}</span>
                       ))}
                     </div>
                   )}
                   {report.mainRisk && (
                     <p className="text-[16px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-4 border-slate-300 pl-8">
                       {report.mainRisk}
                     </p>
                   )}
                </div>
              </section>
            </div>

            {/* 3. Exclusive Reason (Logic) */}
            { (report.exclusiveLogicTags.length > 0 || report.exclusiveReason) && (
              <section className="page-break-avoid space-y-5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                     <i className="fa-solid fa-brain text-sm"></i>
                   </div>
                   <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Exclusive Market Logic</h4>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-orange-50/50 border border-orange-100 space-y-6">
                   {report.exclusiveLogicTags.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                       {report.exclusiveLogicTags.map(tag => (
                         <span key={tag} className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-[10px] font-black text-amber-600 uppercase shadow-sm">{tag}</span>
                       ))}
                     </div>
                   )}
                   {report.exclusiveReason && (
                     <p className="text-[15px] font-bold text-slate-800 leading-relaxed whitespace-pre-wrap border-l-2 border-amber-200 pl-6 italic">
                      {report.exclusiveReason}
                     </p>
                   )}
                </div>
              </section>
            )}

            <section className="page-break-avoid space-y-5">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                   <i className="fa-solid fa-fingerprint text-sm"></i>
                 </div>
                 <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Strategic Ownership Pillar</h4>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-slate-100 border border-slate-200 text-slate-900 shadow-sm space-y-6">
                 {report.ownershipValueTags.length > 0 && (
                   <div className="flex flex-wrap gap-4 mb-4">
                     {report.ownershipValueTags.map(tag => (
                       <span key={tag} className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-[10px] font-black text-slate-600 uppercase shadow-sm">{tag}</span>
                     ))}
                   </div>
                 )}
                 {report.ownershipValue && (
                   <p className="text-[15px] font-bold leading-relaxed italic border-l-2 border-slate-400 pl-6">{report.ownershipValue}</p>
                 )}
                 <div className="flex items-center gap-2 mt-6">
                   <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                   <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Validated Exclusive Entry</span>
                 </div>
              </div>
            </section>
          </div>
        </div>

        <section className="pt-20 pb-10 space-y-12 mt-auto">
           <div className="max-w-4xl mx-auto px-4 page-break-avoid">
             <div className="flex flex-col gap-6 mb-8 p-8 bg-slate-50 border border-slate-100 rounded-[2rem]">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
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

               {(report.amazonProductUrl || report.supplierUrl || (report.competitorUrls && report.competitorUrls.length > 0)) && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {report.amazonProductUrl && (
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Amazon Target</p>
                        <a href={report.amazonProductUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 truncate max-w-full">
                          <i className="fa-brands fa-amazon"></i> Product Link
                        </a>
                      </div>
                    )}
                    {report.supplierUrl && (
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Supply Source</p>
                        <a href={report.supplierUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 truncate max-w-full">
                          <i className="fa-solid fa-industry"></i> Sourcing Link
                        </a>
                      </div>
                    )}
                    {report.competitorUrls && report.competitorUrls.length > 0 && (
                      <div className="space-y-2 col-span-1 md:col-span-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Competitors</p>
                        <div className="flex flex-col gap-1.5">
                          {report.competitorUrls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 truncate max-w-full">
                              <i className="fa-solid fa-users-between-lines"></i> Benchmark {i+1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
               )}
             </div>

             <p className="text-[8px] text-slate-400 leading-relaxed text-left font-medium uppercase tracking-tight">
               <span className="font-black text-slate-600 mr-1">Disclaimer:</span> 
               Keyword Winner provides market intelligence for informational purposes only. Decisions based on this report are the sole responsibility of the user. Market conditions on Amazon are subject to rapid change.
             </p>
           </div>

           <div className="flex flex-col items-center justify-center space-y-6 page-break-avoid">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs shadow-lg">KW</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Keyword Winner Intelligence © 2026</div>
              </div>
              <div className="flex items-center justify-center gap-12 pt-2">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Confidential</span>
                 <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.4em]">Premium Exclusive Asset</span>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};
