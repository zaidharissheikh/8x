'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    category: 'Fashion',
    eyebrow: 'The Fall Edit',
    title: 'ELEVATE YOUR EVERYDAY.',
    description: 'Considered pieces for the days that move with you.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    alt: 'Clothing arranged on a rail',
    actions: [
      { label: 'Shop Women', href: '/s?category=womens-fashion', outline: false },
      { label: 'Shop Men', href: '/s?category=mens-fashion', outline: true },
    ],
  },
  {
    category: 'Technology',
    eyebrow: 'The Work / Play Edit',
    title: 'DESIGN MEETS PERFORMANCE.',
    description: 'Tools with the clarity and power to keep pace.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2070&auto=format&fit=crop',
    alt: 'Laptop on a clean workspace',
    actions: [
      { label: 'Shop Electronics', href: '/s?category=electronics', outline: false },
      { label: 'Browse All', href: '/s', outline: true },
    ],
  },
  {
    category: 'Beauty',
    eyebrow: 'The Daily Ritual',
    title: 'RITUALS WORTH KEEPING.',
    description: 'Small, considered upgrades for your everyday reset.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=2070&auto=format&fit=crop',
    alt: 'Minimal skincare bottles',
    actions: [
      { label: 'Shop Beauty', href: '/s?category=beauty', outline: false },
      { label: 'Browse All', href: '/s', outline: true },
    ],
  },
  {
    category: 'Home',
    eyebrow: 'The Living Edit',
    title: 'MAKE ROOM FOR BETTER LIVING.',
    description: 'Objects that give the everyday a little more intention.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    alt: 'Sculptural sofa in a calm living room',
    actions: [
      { label: 'Shop Home', href: '/s?category=home-kitchen', outline: false },
      { label: 'Browse All', href: '/s', outline: true },
    ],
  },
] as const;

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      aria-label="Featured collections"
      aria-roledescription="carousel"
      className="relative flex min-h-[85svh] w-full items-center justify-center overflow-hidden bg-black text-white"
    >
      {heroSlides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.category}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 transition-opacity duration-[1400ms] ease-in-out',
              isActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] ease-out',
                isActive ? 'scale-100' : 'scale-105'
              )}
            />
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 flex h-full w-full items-center justify-center px-6 pb-16 pt-24 text-center">
              <div className="flex max-w-5xl flex-col items-center">
                <Badge variant="outline" className="mb-7 border-white/25 bg-transparent text-white backdrop-blur-md">
                  {slide.eyebrow}
                </Badge>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white/65">
                  {slide.category}
                </p>
                <h1 className="font-heading text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight">
                  {slide.title}
                </h1>
                <p className="mt-7 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
                  {slide.description}
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  {slide.actions.map((action) => (
                    <Link key={action.label} href={action.href} tabIndex={isActive ? 0 : -1}>
                      <Button
                        size="lg"
                        variant={action.outline ? 'outline' : 'primary'}
                        className={action.outline
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : 'border-transparent bg-white text-black hover:bg-concrete'}
                      >
                        {action.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/75 sm:flex">
        <span aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span>
        <div className="flex items-center gap-2" role="tablist" aria-label="Featured collections">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.category}
              type="button"
              role="tab"
              aria-label={`Show ${slide.category} collection`}
              aria-selected={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
                index === activeIndex ? 'w-10 bg-white' : 'w-5 bg-white/35 hover:bg-white/70'
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          className="hidden border-b border-white/40 pb-1 hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:inline"
        >
          {isPaused ? 'Play' : 'Pause'}
        </button>
      </div>
    </section>
  );
}
