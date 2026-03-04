"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Heart, Truck, Award, Leaf, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

// Animation Variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const iconMap: { [key: string]: any } = {
    Heart,
    Truck,
    Award,
    Leaf,
    Gift,
};

interface StatItem {
    number: string;
    label: string;
}

interface ValueItem {
    icon: string;
    title: string;
    description: string;
}

interface TeamMember {
    name: string;
    role: string;
    image: string;
    description: string;
}

interface AboutClientProps {
    content: {
        heroTitle: string;
        heroDesc: string;
        heroImage: string | null;
        storyTitle: string;
        storyDesc1: string;
        storyDesc2: string;
        storyImage: string | null;
    };
    stats: StatItem[];
    values: ValueItem[];
    team: TeamMember[];
}

export default function AboutClient({ content, stats, values, team }: AboutClientProps) {
    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {content?.heroImage ? (
                    <div className="absolute inset-0 z-[-10]">
                        <Image
                            src={content.heroImage}
                            alt="About Hero"
                            fill
                            className="object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>
                ) : (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
                        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    </>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 tracking-wide">
                            Est. 2019 • Dubai, UAE
                        </span>
                        <h1 className="font-cormorant text-5xl md:text-7xl font-bold mb-8 leading-tight text-foreground">
                            {content?.heroTitle}
                        </h1>
                        <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed">
                            {content?.heroDesc}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 md:py-28 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                        >
                            <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-6">
                                {content?.storyTitle}
                            </h2>
                            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                                <p>{content?.storyDesc1}</p>
                                <p>{content?.storyDesc2}</p>
                                <div className="pt-4">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center text-primary font-semibold hover:underline"
                                    >
                                        View our collections <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeInUp}
                        >
                            <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl transform translate-x-4 translate-y-4 z-0" />
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted z-10 shadow-xl">
                                <Image
                                    src={content?.storyImage || ""}
                                    alt="Misk Blooming Flower Arrangement"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-4"
                                variants={fadeInUp}
                            >
                                <div className="font-cormorant text-4xl md:text-6xl font-bold mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-primary-foreground/80 font-medium text-sm md:text-base uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 md:py-28 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            The principles that guide every bouquet we arrange and every
                            delivery we make.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-card text-card-foreground p-8 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                                    {(() => {
                                        const IconComponent = iconMap[value.icon] || Heart;
                                        return <IconComponent className="w-6 h-6" />;
                                    })()}
                                </div>
                                <h3 className="font-cormorant text-2xl font-semibold mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 md:py-28 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Meet Our Team
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            The passionate individuals behind Misk Blooming UAE.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="group relative bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="relative h-80 w-full bg-muted overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="p-6 text-center">
                                    <h3 className="font-cormorant text-2xl font-bold text-foreground mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-primary font-medium text-sm mb-4 uppercase tracking-wider">
                                        {member.role}
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {member.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
