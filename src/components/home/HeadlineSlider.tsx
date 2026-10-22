import React, { useState, useEffect, useRef } from 'react';
import { ProjectArtwork } from '../common/ProjectArtwork';
import { ProjectCategory, CreditListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { QuoteModal } from '../marketplace/QuoteModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowUpRight, 
  ShieldCheck, 
  MapPin,
  Sparkles,
  TreePine,
  Sun,
  Flame,
  Waves
} from 'lucide-react';

export interface ProjectSlide {
  id: string;
  listingId: string;
  title: string;
  shortName: string;
  category: ProjectCategory;
  standard: string;
  location: string;
  price: string;
  volume: string;
  vintage: string;
  keyWork: string;
  imageUrl: string;
  badgeBg: string;
  icon: React.ElementType;
}

export const CARBON_PROJECT_SLIDES: ProjectSlide[] = [
  {
    id: 'proj-forestry',
    listingId: 'list-101',
    title: 'Cordillera Oriental Native Cloud Forest Restoration',
    shortName: 'Native Reforestation',
    category: 'Forestry & Afforestation',
    standard: 'Verra VCS-2041',
    location: 'Boyacá Highlands, Colombia',
    price: '$14.50 / tCO2e',
    volume: '48,500 tCO2e',
    vintage: '2023–2024',
    keyWork: 'Biodiversity corridor & native Andean canopy reforestation',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
    badgeBg: 'bg-[#218653]',
    icon: TreePine
  },
  {
    id: 'proj-solar',
    listingId: 'list-102',
    title: 'Rajasthan 120MW Thar Desert Solar PV Grid Displacement',
    shortName: 'Solar PV Clean Energy',
    category: 'Renewable Energy',
    standard: 'Gold Standard GS-4920',
    location: 'Rajasthan Desert Belt, India',
    price: '$7.80 / tCO2e',
    volume: '92,000 tCO2e',
    vintage: '2024–2025',
    keyWork: 'Utility-scale solar panels replacing coal grid power',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    badgeBg: 'bg-[#0284C7]',
    icon: Sun
  },
  {
    id: 'proj-biochar',
    listingId: 'list-103',
    title: 'Rift Valley Agricultural Biochar Pyrolysis Sequestration',
    shortName: 'Biochar CDR',
    category: 'Biochar & Soil Carbon',
    standard: 'Puro.earth CORC-881',
    location: 'Nakuru Basin, Kenya',
    price: '$145.00 / tCO2e',
    volume: '15,400 tCO2e',
    vintage: '2024–2025',
    keyWork: '800+ year durable high-permanence carbon mineralization',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    badgeBg: 'bg-[#84532B]',
    icon: Flame
  },
  {
    id: 'proj-mangrove',
    listingId: 'list-104',
    title: 'Sundarbans Coastal Delta Mangrove & Marine Sanctuary',
    shortName: 'Blue Carbon Mangroves',
    category: 'Blue Carbon & Mangroves',
    standard: 'Verra VCS-3118 (CCB Gold)',
    location: 'Khulna Delta, Bangladesh',
    price: '$26.00 / tCO2e',
    volume: '32,000 tCO2e',
    vintage: '2023–2024',
    keyWork: 'Tidal wetland restoration & marine blue carbon sequestration',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    badgeBg: 'bg-[#0D9488]',
    icon: Waves
  }
];

interface HeadlineSliderProps {
  onSelectListing: (listingId: string) => void;
  className?: string;
}

export const HeadlineSlider: React.FC<HeadlineSliderProps> = ({
  onSelectListing,
  className = ''
}) => {
  const { listings } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [quoteListing, setQuoteListing] = useState<CreditListing | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 5000;

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % CARBON_PROJECT_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + CARBON_PROJECT_SLIDES.length) % CARBON_PROJECT_SLIDES.length);
  };

  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, slideDuration);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, currentIdx]);

  const currentSlide = CARBON_PROJECT_SLIDES[currentIdx];
  const matchedListing = listings.find((l) => l.id === currentSlide.listingId);

  const handleOpenQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (matchedListing) {
      setQuoteListing(matchedListing);
      setIsQuoteOpen(true);
    } else {
      onSelectListing(currentSlide.listingId);
    }
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div 
      className={`rounded-2xl border border-[#DDEBDD] bg-white shadow-lg overflow-hidden group/slider ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="region"
      aria-label="Carbon Credit Projects Slider"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }}
    >
      {/* Interactive Photo Selection Chips (Quick Jump) */}
      <div className="bg-[#123D2A] px-3 py-2 flex items-center justify-between gap-2 text-white border-b border-[#218653]/30">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CARBON_PROJECT_SLIDES.map((slide, idx) => {
            const isSelected = idx === currentIdx;
            const Icon = slide.icon;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isSelected 
                    ? 'bg-[#218653] text-white shadow-xs font-semibold' 
                    : 'bg-white/10 text-[#DDEBDD] hover:bg-white/20'
                }`}
              >
                <img 
                  src={slide.imageUrl} 
                  alt={slide.shortName}
                  className="w-4 h-4 rounded-full object-cover shrink-0 border border-white/40"
                  referrerPolicy="no-referrer"
                />
                <Icon className="w-3 h-3 shrink-0" />
                <span className="text-[11px]">{slide.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Play/Pause & Slide indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[#DDEBDD] hidden sm:inline">
            {currentIdx + 1} / {CARBON_PROJECT_SLIDES.length}
          </span>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded text-[#DDEBDD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div 
        className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-[#123D2A] cursor-pointer"
        onClick={() => onSelectListing(currentSlide.listingId)}
      >
        {CARBON_PROJECT_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIdx;
          const hasError = imageErrors[slide.id];

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {hasError ? (
                <ProjectArtwork category={slide.category} height="h-full" />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={() => handleImageError(slide.id)}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle Dark Vignette for clean readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123D2A] via-[#123D2A]/40 to-transparent" />
                </div>
              )}

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-md backdrop-blur-md ${slide.badgeBg}`}>
                  {slide.category}
                </span>
                <span className="bg-[#123D2A]/85 text-[#DDEBDD] backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono border border-white/10 shadow-md">
                  {slide.standard}
                </span>
              </div>

              {/* In-Image Caption & Location */}
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#DDEBDD] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#218653] shrink-0" />
                  <span className="truncate">{slide.location}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {slide.title}
                </h4>
                <p className="text-[11px] text-white/90 line-clamp-1">
                  {slide.keyWork}
                </p>
              </div>
            </div>
          );
        })}

        {/* Previous Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#123D2A]/80 hover:bg-[#123D2A] text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-85 group-hover/slider:opacity-100 cursor-pointer shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#123D2A]/80 hover:bg-[#123D2A] text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-85 group-hover/slider:opacity-100 cursor-pointer shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-[#218653] transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / CARBON_PROJECT_SLIDES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Snapshot Bar with Price & Quick Quote */}
      <div className="p-3 bg-[#F7F8F4] flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#DDEBDD]">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-[#69746D] block">Indicative Unit Price</span>
            <span className="font-mono font-bold text-[#218653]">{currentSlide.price}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#69746D] block">Available Volume</span>
            <span className="font-mono font-bold text-[#123D2A]">{currentSlide.volume}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] text-[#69746D] block">Verified Vintage</span>
            <span className="font-mono text-[#123D2A]">{currentSlide.vintage}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectListing(currentSlide.listingId)}
            className="px-3 py-1.5 text-xs font-semibold text-[#123D2A] bg-white hover:bg-[#DDEBDD]/50 border border-[#DDEBDD] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={handleOpenQuote}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-[#218653]" />
            <span>Request Quote</span>
          </button>
        </div>
      </div>

      {/* Quote Modal */}
      {matchedListing && (
        <QuoteModal
          isOpen={isQuoteOpen}
          onClose={() => setIsQuoteOpen(false)}
          listing={matchedListing}
        />
      )}
    </div>
  );
};
