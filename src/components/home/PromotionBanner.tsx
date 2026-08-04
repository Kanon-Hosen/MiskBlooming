"use client";


import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Tag, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

const AUTO_PLAY_INTERVAL = 10000;

export default function PromotionBanner({ promotions = [] }: { promotions?: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const activePromotions = promotions.filter(
        (p: any) => p.status === "ACTIVE" && p.isActive
    );

    useEffect(() => {
        if (activePromotions.length <= 1) return;

        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
            setProgress(newProgress);

            if (elapsed >= AUTO_PLAY_INTERVAL) {
                setCurrentIndex((prev) => (prev + 1) % activePromotions.length);
                setProgress(0);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [currentIndex, activePromotions.length]);



    if (activePromotions.length === 0) return null;

    const currentPromo = activePromotions[currentIndex];

    return (
        <section className="relative w-full overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8">
            {/* Background Texture/Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

            <div className="max-w-[1400px] mx-auto">
                <div className="relative h-[600px] lg:h-[750px] w-full flex flex-col lg:flex-row items-center gap-0 lg:gap-12">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPromo.id}
                            className="relative w-full h-full flex flex-col lg:flex-row items-center"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            {/* Image Container (Asymmetric) */}
                            <motion.div
                                className="relative w-full lg:w-[65%] h-[400px] lg:h-full overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]"
                                variants={{
                                    initial: { opacity: 0, x: -50, scale: 1.05 },
                                    animate: { opacity: 1, x: 0, scale: 1 },
                                    exit: { opacity: 0, x: 50, scale: 1.05 }
                                }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <motion.div
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1.05 }}
                                    transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: "linear" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={currentPromo.imageUrl || "/placeholder-promotion.jpg"}
                                        alt={currentPromo.name}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                                </motion.div>

                                {/* Image Overlay for Mobile readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
                            </motion.div>

                            {/* Floating Content Card */}
                            <motion.div
                                className="z-10 absolute bottom-[-40px] lg:bottom-auto lg:right-0 w-[90%] lg:w-[45%] bg-card/90 backdrop-blur-3xl p-10 lg:p-16 rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] border border-border ring-1 ring-luxury-500/10"
                                variants={{
                                    initial: { opacity: 0, y: 50, rotateX: -10 },
                                    animate: { opacity: 1, y: 0, rotateX: 0 },
                                    exit: { opacity: 0, y: -50, rotateX: 10 }
                                }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Editorial Badge */}
                                <motion.div
                                    className="mb-10 inline-flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span className="h-[1px] w-8 bg-luxury-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-600">
                                        Collection N°0{currentIndex + 1}
                                    </span>
                                </motion.div>

                                <motion.h2
                                    className="font-cormorant text-5xl lg:text-7xl font-bold text-foreground leading-[1] mb-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    {currentPromo.name}
                                </motion.h2>

                                <motion.div
                                    className="mb-10 space-y-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <p className="text-lg text-muted-foreground font-inter font-light leading-relaxed">
                                        Exquisite arrangements crafted for the most discerning aesthetic.
                                        Experience the pinnacle of floral artistry today.
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-luxury-500">Access Code</p>
                                        <div className="inline-flex items-center self-start px-6 py-3 bg-muted rounded-xl border border-border shadow-inner">
                                            <span className="font-playfair text-2xl font-bold text-foreground tracking-widest">{currentPromo.promoCode}</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <Button
                                        variant="luxury"
                                        className="h-16 px-12 rounded-full text-lg group bg-charcoal-900 text-white hover:bg-luxury-600 border-none shadow-xl transition-all duration-500"
                                    >
                                        Inquire Now
                                        <ArrowRight className="ml-3 w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
                                    </Button>
                                </motion.div>

                                {/* Floating Seal/Discount Badge */}
                                <motion.div
                                    className="absolute -top-10 -right-10 hidden lg:flex w-32 h-32 rounded-full bg-luxury-500 items-center justify-center border-4 border-white shadow-2xl rotate-12"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 12 }}
                                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                                >
                                    <div className="text-center text-white">
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Limited</p>
                                        <p className="font-playfair text-3xl font-bold italic leading-none my-0.5">Edit</p>
                                        <Tag className="w-5 h-5 mx-auto opacity-50" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Editorial Slider Controls */}
                    <div className="absolute bottom-[-80px] lg:bottom-12 left-0 right-0 lg:left-auto lg:right-16 flex items-center justify-center lg:justify-end gap-12 z-20">
                        <div className="flex items-center gap-6">
                            {activePromotions.map((_: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        setProgress(0);
                                    }}
                                    className="group relative flex flex-col items-start gap-3 py-4"
                                >
                                    <span className={`text-[10px] font-bold transition-colors duration-500 ${idx === currentIndex ? 'text-luxury-600' : 'text-charcoal-300'}`}>
                                        0{idx + 1}
                                    </span>
                                    <div className={`h-[1px] bg-luxury-500/20 rounded-full transition-all duration-700 overflow-hidden ${idx === currentIndex ? 'w-24' : 'w-8 group-hover:w-12 group-hover:bg-luxury-500/40'}`}>
                                        {idx === currentIndex && (
                                            <motion.div
                                                className="h-full bg-luxury-600"
                                                initial={{ x: "-100%" }}
                                                animate={{ x: `${progress - 100}%` }}
                                                transition={{ ease: "linear" }}
                                            />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="hidden lg:block h-12 w-[1px] bg-charcoal-100 mx-4" />

                        <div className="hidden lg:flex items-center text-charcoal-300 font-inter text-xs font-medium tracking-[0.2em]">
                            <span className="text-charcoal-900 font-bold">0{currentIndex + 1}</span>
                            <span className="mx-2">/</span>
                            <span>0{activePromotions.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
