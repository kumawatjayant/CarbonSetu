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
  ExternalLink,
  MapPin,
  Sparkles,
  Layers
} from 'lucide-react';

interface HeroSlide {
  id: string;
  listingId: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  standard: string;
  location: string;
  price: string;
  volume: string;
  vintage: string;
  highlight: string;
  imageUrl: string;
  badgeColor: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    listingId: 'list-101',
    title: 'Cordillera Oriental Native Cloud Forest Restoration',
    subtitle: 'High-Altitude Watershed & Biodiversity Corridor',
    category: 'Forestry & Afforestation',
    standard: 'Verra VCS-2041',
    location: 'Boyacá Highlands, Colombia',
    price: '$14.50 / tCO2e',
    volume: '48,500 tCO2e',
    vintage: '2023–2024',
    highlight: '18 Keystone Native Species · TÜV SÜD Audited',
    imageUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
    badgeColor: 'bg-[#218653]'
  },
  {
    id: 'slide-2',
    listingId: 'list-102',
    title: 'Rajasthan 120MW Thar Desert Solar PV Grid Displacement',
    subtitle: 'Utility-Scale Clean Power & Northern Grid Decarbonization',
    category: 'Renewable Energy',
    standard: 'Gold Standard GS-4920',
    location: 'Rajasthan Desert Belt, India',
    price: '$7.80 / tCO2e',
    volume: '92,000 tCO2e',
    vintage: '2024–2025',
    highlight: '380 GWh Clean Energy Annually · DNV GL Verified',
    imageUrl: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    badgeColor: 'bg-[#0284C7]'
  },
  {
    id: 'slide-3',
    listingId: 'list-103',
    title: 'Rift Valley Agricultural Biochar Carbon Sequestration',
    subtitle: 'Engineered Pyrolysis High-Permanence Carbon Removal',
    category: 'Biochar & Soil Carbon',
    standard: 'Puro.earth CORC-881',
    location: 'Nakuru Basin, Kenya',
    price: '$145.00 / tCO2e',
    volume: '15,400 tCO2e',
    vintage: '2024–2025',
    highlight: '800+ Year Durability · Invasive Biomass Valorization',
    imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    badgeColor: 'bg-[#84532B]'
  },
  {
    id: 'slide-4',
    listingId: 'list-104',
    title: 'Sundarbans Coastal Delta Mangrove & Blue Carbon Sanctuary',
    subtitle: 'Tidal Wetland Restoration & Coastal Storm Surge Shield',
    category: 'Blue Carbon & Mangroves',
    standard: 'Verra VCS-3118',
    location: 'Khulna Delta, Bangladesh',
    price: '$26.00 / tCO2e',
    volume: '32,000 tCO2e',
    vintage: '2023–2024',
    highlight: 'CCB Gold Distinction · 14,000 Hectares Marine Sanctuary',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    badgeColor: 'bg-[#0D9488]'
  }
];

interface HeroImageSliderProps {
  navigate: (route: string) => void;
  onSelectListing: (listingId: string) => void;
}

export const HeroImageSlider: React.FC<HeroImageSliderProps> = ({
  navigate,
  onSelectListing
}) => {
  const { listings } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [quoteListing, setQuoteListing] = useState<CreditListing | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const slideDuration = 5500; // 5.5 seconds per slide

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Auto-play interval
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  const currentSlide = HERO_SLIDES[currentIdx];
  const matchedListing = listings.find((l) => l.id === currentSlide.listingId);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpenQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (matchedListing) {
      setQuoteListing(matchedListing);
      setIsQuoteOpen(true);
    } else {
      onSelectListing(currentSlide.listingId);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-[#DDEBDD] shadow-xl overflow-hidden flex flex-col group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Verified Carbon Projects Carousel"
    >
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-[#123D2A] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#218653] animate-pulse" />
          <span className="text-xs font-bold tracking-wide">
            Verified Project Showcase ({currentIdx + 1}/{HERO_SLIDES.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded text-[#DDEBDD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause auto-rotation' : 'Play auto-rotation'}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <span className="text-[11px] font-mono text-[#DDEBDD] hidden sm:inline">
            {currentSlide.standard}
          </span>
        </div>
      </div>

      {/* Main Image Slider Viewport */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#123D2A] cursor-pointer" onClick={() => onSelectListing(currentSlide.listingId)}>
        {/* Render Slides with smooth crossfade */}
        {HERO_SLIDES.map((slide, idx) => {
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
                /* High-fidelity Vector Art Fallback */
                <ProjectArtwork category={slide.category} height="h-full" />
              ) : (
                /* Photographic Real Landscape Image */
                <div className="relative w-full h-full">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={() => handleImageError(slide.id)}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  {/* Subtle Cinematic Vignette / Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123D2A] via-[#123D2A]/35 to-black/20" />
                </div>
              )}

              {/* Floating Metadata Pill over image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-md backdrop-blur-md ${slide.badgeColor}`}>
                  {slide.category}
                </span>
                <span className="bg-[#123D2A]/85 text-[#DDEBDD] backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono border border-white/10 shadow-md">
                  {slide.standard}
                </span>
              </div>

              {/* Bottom In-Image Title Overlay */}
              <div className="absolute bottom-3 left-4 right-4 text-white space-y-1 drop-shadow-md">
                <div className="flex items-center gap-1.5 text-[11px] text-[#DDEBDD] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#218653] shrink-0" />
                  <span>{slide.location}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {slide.title}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1">
                  {slide.highlight}
                </p>
              </div>
            </div>
          );
        })}

        {/* Carousel Prev / Next Buttons */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#123D2A]/70 hover:bg-[#123D2A] text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-80 group-hover/slider:opacity-100 cursor-pointer shadow-lg"
          aria-label="Previous project slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#123D2A]/70 hover:bg-[#123D2A] text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-80 group-hover/slider:opacity-100 cursor-pointer shadow-lg"
          aria-label="Next project slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Slide Progress / Timer Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-[#218653] transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / HERO_SLIDES.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Slide Commercial Snapshot & Metrics */}
      <div className="p-4 bg-white space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center border-b border-[#DDEBDD] pb-3">
          <div className="bg-[#F7F8F4] p-2 rounded-lg border border-[#DDEBDD]/80">
            <span className="text-[10px] text-[#69746D] block">Indicative Price</span>
            <span className="text-xs font-mono font-bold text-[#218653] block truncate">
              {currentSlide.price}
            </span>
          </div>
          <div className="bg-[#F7F8F4] p-2 rounded-lg border border-[#DDEBDD]/80">
            <span className="text-[10px] text-[#69746D] block">Available Volume</span>
            <span className="text-xs font-mono font-bold text-[#123D2A] block truncate">
              {currentSlide.volume}
            </span>
          </div>
          <div className="bg-[#F7F8F4] p-2 rounded-lg border border-[#DDEBDD]/80">
            <span className="text-[10px] text-[#69746D] block">Audited Vintage</span>
            <span className="text-xs font-mono font-semibold text-[#123D2A] block truncate">
              {currentSlide.vintage}
            </span>
          </div>
        </div>

        {/* Thumbnail Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {HERO_SLIDES.map((slide, idx) => {
            const isSelected = idx === currentIdx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`py-1.5 px-1 rounded-md text-[10px] font-medium transition-all text-center truncate cursor-pointer ${
                  isSelected 
                    ? 'bg-[#123D2A] text-white shadow-xs font-bold' 
                    : 'bg-[#F7F8F4] text-[#69746D] hover:bg-[#DDEBDD]/50 border border-[#DDEBDD]'
                }`}
                title={slide.title}
              >
                {slide.category.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Actions Strip */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectListing(currentSlide.listingId)}
            className="flex-1 py-2.5 px-3 text-xs font-semibold text-[#123D2A] bg-[#F7F8F4] hover:bg-[#DDEBDD] border border-[#DDEBDD] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Project Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleOpenQuote}
            className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-[#123D2A] hover:bg-[#1B4D36] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#218653]" />
            <span>Request Quote</span>
          </button>
        </div>
      </div>

      {/* Quote Modal directly mounted for instant access from Hero */}
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
