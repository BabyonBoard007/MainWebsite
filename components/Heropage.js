import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import logoImg from '../public/logo_img.png'; 

const media1 = '/heroImg1.jpeg';
const media2 = '/heroImg2.jpeg';
const media3 = '/heroImg.jpg';
// const media4 = '/heroImg.jpg';
// const media5 = '/heroImg1.jpeg';
const media = [media1, media2, media3];
const mediaByIndex = index => media[index % media.length];

const PARALLAX_FACTOR = 1.5;

const EmblaCarousel = ({ slides }) => {
  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
    // dragFree: true
    speed: 4
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [parallaxValues, setParallaxValues] = useState([]);
  const [intervalId, setIntervalId] = useState(0);  //for autoplay

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  const onScroll = useCallback(() => {
    if (!embla) return;

    const engine = embla.internalEngine();
    const scrollProgress = embla.scrollProgress();

    const styles = embla.scrollSnapList().map((scrollSnap, index) => {
      if (!embla.slidesInView().includes(index)) return 0;
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.getTarget();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }
      return diffToTarget * (-1 / PARALLAX_FACTOR) * 100;
    });
    setParallaxValues(styles);
  }, [embla, setParallaxValues]);

  const autorun_start = ()=>{
    const newIntervalId = setInterval(() => {
      scrollNext();
    }, 5000);
    setIntervalId(newIntervalId);
  }
  const autorun_stop = ()=>{
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }
  }

  useEffect(() => {
    if (!embla) return;
    onSelect();
    onScroll();
    embla.on("select", onSelect);
    embla.on("scroll", onScroll);
    embla.on("resize", onScroll);

    // const intervalId = setInterval(() => {
    //     scrollNext();
    // }, 7000);
    // return () => clearInterval(intervalId);

  }, [embla, onSelect, onScroll]);

  return (
    <>
        {/* <div className="h-full w-full bg-transparent z-10 absolute"></div> */}
        <div className="embla relative bg-gray-100 max-w-full mx-auto">
        <div className="embla__viewport overflow-hidden w-full" ref={viewportRef}>
            <div className="embla__container flex select-none -ml-3">
            {slides.map((index) => (
                <div className="embla__slide relative min-w-[100vw]" key={index}>
                <div className="embla__slide__inner relative w-full h-[100vh] flex items-center justify-center overflow-hidden">
                    <div
                    className="embla__slide__parallax absolute top-0 right-0 bottom-0 left-0"
                    style={{ transform: `translateX(${parallaxValues[index]}%)` }}
                    >
                    <img
                        onMouseEnter={autorun_start}
                        onMouseLeave={autorun_stop}
                        className=" object-cover embla__slide__img absolute block top-1/2 left-1/2 w-auto min-h-full min-w-full translate-x-[-50%] translate-y-[-50%] "
                        src={mediaByIndex(index)}
                        alt="A cool cat."
                    />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        {/* <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} /> */}
        {/* <NextButton onClick={scrollNext} enabled={nextBtnEnabled} /> */}
        </div>
    </>
  );
};

const SLIDE_COUNT = 3;
const slides = Array.from(Array(SLIDE_COUNT).keys());


function Heropage() {
  return (
    <div className="h-screen w-[100%]">
      <div className="absolute w-72 top-[6%] left-0 z-10">
        <Image src={logoImg} alt="Logo image"/>
      </div>
     
      <EmblaCarousel slides={slides} />
      <div className=' drop-shadow-lg mt-8 heroTitle text-4xl z-0 selection:text-pink-200 lg:text-5xl absolute top-[30%] w-full text-center lg:text-left px-5 lg:pl-36 text-gray-100 font-["Righteous"] '> 
        With love for your <span className="text-sky-200">little ones...</span> 
      </div>
    </div>
  )
}

export default Heropage