"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface MembershipCardProps {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string | Date;
  membershipType: "Mmbebr" | "VIP" | "PREMIUM" | "GOLD" | "PLATINUM";
  storeName?: string;
  logoUrl?: string;
  memberSince?: string | number;
  className?: string;
}

const CardFront = ({
  cardNumber,
  cardHolderName,
  expirationDate,
  membershipType,
  storeName = "MISK BLOOMING",
  logoUrl,
  memberSince = new Date().getFullYear()
}: any) => {
  const displayYear = (!memberSince || isNaN(Number(memberSince)))
    ? new Date().getFullYear()
    : memberSince;

  return (
    <div
      className="w-full h-full rounded-2xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)", // Gold Gradient
      }}
    >
      {/* Decorative elements for "premium" feel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl" />

      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <div className="w-10 h-10 relative overflow-hidden rounded-full border-2 border-white/30 bg-white">
              <Image src={logoUrl} alt={storeName} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold border-2 border-white/30">
              {storeName.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-black font-bold text-lg leading-none uppercase tracking-tight">{storeName}</h2>
            <p className="text-black/70 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">
              {membershipType === "Mmbebr" ? "MEMBER" : `${membershipType} MEMBERSHIP`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-black/60 text-[10px] font-bold tracking-widest">MEMBER SINCE</p>
          <p className="text-black font-bold text-sm tracking-tighter">{displayYear}</p>
        </div>
      </div>

      {/* Chip visual */}
      <div className="mt-4 w-12 h-9 rounded-md bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-700 border border-yellow-800/20 shadow-inner relative overflow-hidden opacity-90">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/10" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-black/10" />
        <div className="absolute inset-y-0 right-1/3 w-px bg-black/10" />
      </div>

      {/* Card Details */}
      <div className="mt-auto relative z-10">
        <div className="flex justify-between items-end mb-3">
          <p className="text-black font-mono text-xl tracking-[0.25em] drop-shadow-sm font-semibold">{cardNumber}</p>
        </div>

        <div className="flex justify-between items-end">
          <div className="max-w-[70%]">
            <p className="text-black/50 text-[9px] font-bold tracking-widest uppercase mb-0.5">CARD HOLDER</p>
            <p className="text-black font-bold uppercase tracking-wider text-sm truncate">{cardHolderName}</p>
          </div>
          <div className="text-right">
            <p className="text-black/50 text-[9px] font-bold tracking-widest uppercase mb-0.5">EXPIRES</p>
            <p className="text-black font-bold text-sm">{format(new Date(expirationDate), "MM/yy")}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

const CardBack = ({ cardHolderName, membershipType, storeName = "MISK BLOOMING" }: any) => (
  <div
    className="w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
    style={{
      background: "#121212",
    }}
  >
    {/* Magnetic Stripe */}
    <div className="w-full h-12 bg-black mt-8 shadow-inner"></div>

    <div className="px-6 flex-1 flex flex-col pt-4 pb-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1 font-bold">Membership Type</p>
          <div className="px-3 py-1 bg-yellow-600/10 border border-yellow-600/30 rounded text-yellow-500 font-bold text-[10px] inline-block uppercase tracking-wider">
            {membershipType}
          </div>
        </div>
        {/* Logo/Name placeholder */}
        <div className="text-right">
          <p className="text-white/20 font-serif text-sm font-bold tracking-wider italic">{storeName}</p>
        </div>
      </div>

      <div className="mt-auto mb-4">
        <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1 font-bold">Authorized Signature</p>
        <div className="w-full h-10 bg-white/5 border border-white/10 rounded-md flex items-center px-4 overflow-hidden">
          <p className="text-white/90 font-serif italic text-lg opacity-60 select-none" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>
            {cardHolderName}
          </p>
        </div>
      </div>

      <p className="text-white/20 text-[7px] text-center px-4 leading-normal mt-2">
        This card is issued by {storeName} and remains their property. It is non-transferable and subject to terms of use.
        If found, please return to any {storeName} outlet or contact support.
      </p>
    </div>
  </div>
);

const MembershipCard: React.FC<MembershipCardProps & { variant?: "default" | "front" | "back" }> = ({
  cardNumber,
  cardHolderName,
  expirationDate,
  membershipType,
  storeName,
  logoUrl,
  memberSince,
  className,
  variant = "default",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (variant === "default") {
      setIsFlipped(!isFlipped);
    }
  };

  const commonProps = {
    cardNumber,
    cardHolderName,
    expirationDate,
    membershipType,
    storeName,
    logoUrl,
    memberSince
  };

  if (variant === "front") {
    return (
      <div className={cn("w-[400px] h-[250px]", className)}>
        <CardFront {...commonProps} />
      </div>
    );
  }

  if (variant === "back") {
    return (
      <div className={cn("w-[400px] h-[250px]", className)}>
        <CardBack {...commonProps} />
      </div>
    );
  }

  return (
    <div className={cn("perspective-1000 w-[400px] h-[250px] cursor-pointer", className)} onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardFront {...commonProps} />
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <CardBack {...commonProps} />
        </div>
      </motion.div>
    </div>
  );
};

export default MembershipCard;
