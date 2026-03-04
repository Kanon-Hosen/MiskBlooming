"use client";

import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Plus, Pencil, Trash2, CreditCard, Loader2, Download, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { MembershipCardForm } from "@/src/components/dashboard/membership/MembershipCardForm";
import MembershipCard from "@/src/components/dashboard/membership/MembershipCard";
import { format } from "date-fns";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const GET_CARDS = gql`
  query GetMembershipCards {
    membershipCards {
      id
      cardNumber
      cardHolderName
      expirationDate
      membershipType
      userId
      user {
        email
        firstName
        lastName
        createdAt
      }
    }
  }
`;

const GET_STORE_SETTINGS = gql`
  query GetStoreSettings {
    getStoreSettings {
      storeName
      logoUrl
    }
  }
`;

const DELETE_CARD = gql`
  mutation DeleteMembershipCard($id: ID!) {
    deleteMembershipCard(id: $id) {
      id
    }
  }
`;

const SEND_EMAIL = gql`
  mutation SendMembershipCard($id: ID!) {
    sendMembershipCard(id: $id)
  }
`;

export default function MembershipPage() {
  const { data, loading, error, refetch } = useQuery(GET_CARDS, {
    fetchPolicy: "network-only"
  });
  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);
  const storeSettings = settingsData?.getStoreSettings;

  const [deleteCard] = useMutation(DELETE_CARD);
  const [sendEmail, { loading: sendingEmail }] = useMutation(SEND_EMAIL);

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this membership card?")) {
      try {
        await deleteCard({ variables: { id } });
        toast.success("Membership card deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete card");
      }
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("membership-card-download");
    if (!element) return;

    const toastId = toast.loading("Preparing card for download...");

    try {
      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3, // Higher resolution
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("membership-card-download");
          if (clonedElement) {
            clonedElement.style.opacity = "1";
            clonedElement.style.position = "static";
            clonedElement.style.display = "block";
          }
        }
      });

      const link = document.createElement("a");
      link.download = `membership-${selectedCard.cardNumber}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      toast.success("Card downloaded successfully", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download card", { id: toastId });
    }
  };

  const handleEmail = async () => {
    if (!selectedCard) return;
    try {
      await sendEmail({ variables: { id: selectedCard.id } });
      toast.success(`Email sent to ${selectedCard.user?.email || "user"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    }
  };

  const getMemberSinceYear = (dateValue: any) => {
    try {
      const date = dateValue ? new Date(dateValue) : new Date();
      const year = date.getFullYear();
      return isNaN(year) ? new Date().getFullYear() : year;
    } catch (e) {
      return new Date().getFullYear();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Membership Cards</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCard(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCard ? "Edit Card" : "New Membership Card"}</DialogTitle>
            </DialogHeader>
            <MembershipCardForm
              initialData={selectedCard}
              onSuccess={() => {
                setIsFormOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Card Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.membershipCards?.map((card: any) => (
              <TableRow key={card.id}>
                <TableCell>
                  <div className="font-medium">{card.cardHolderName}</div>
                  <div className="text-sm text-muted-foreground">{card.user?.email || card.userId}</div>
                </TableCell>
                <TableCell className="font-mono">{card.cardNumber}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                    {card.membershipType}
                  </span>
                </TableCell>
                <TableCell>{format(new Date(card.expirationDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="default" size="icon" className="text-foreground" onClick={() => {
                    setSelectedCard(card);
                    setIsPreviewOpen(true);
                  }}>
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" onClick={() => {
                    setSelectedCard(card);
                    setIsFormOpen(true);
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(card.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.membershipCards?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No membership cards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl bg-transparent border-none shadow-none p-0 flex flex-col items-center gap-6">
          <DialogTitle className="sr-only">Membership Card Preview</DialogTitle>
          {selectedCard && (
            <>
              <div className="p-4 rounded-xl bg-background/20 backdrop-blur-sm border border-white/10">
                <MembershipCard
                  cardNumber={selectedCard.cardNumber}
                  cardHolderName={selectedCard.cardHolderName}
                  expirationDate={selectedCard.expirationDate}
                  membershipType={selectedCard.membershipType}
                  storeName={storeSettings?.storeName}
                  logoUrl={storeSettings?.logoUrl}
                  memberSince={getMemberSinceYear(selectedCard.user?.createdAt)}
                />
              </div>

              <div className="flex gap-4 bg-background p-4 rounded-2xl shadow-2xl border border-border">
                <Button onClick={handleDownload} variant="outline" className="gap-2 h-11 px-6 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                  <Download className="w-4 h-4" /> Download Card
                </Button>
                <Button onClick={handleEmail} disabled={sendingEmail} className="gap-2 h-11 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all">
                  {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Email to User
                </Button>
              </div>
              <p className="text-white/60 text-xs font-medium tracking-wide">Click card to flip</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden element for capture */}
      {selectedCard && (
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            zIndex: -1,
            opacity: 0,
            pointerEvents: "none"
          }}
        >
          <div id="membership-card-download">
            <MembershipCard
              cardNumber={selectedCard.cardNumber}
              cardHolderName={selectedCard.cardHolderName}
              expirationDate={selectedCard.expirationDate}
              membershipType={selectedCard.membershipType}
              storeName={storeSettings?.storeName}
              logoUrl={storeSettings?.logoUrl}
              memberSince={getMemberSinceYear(selectedCard.user?.createdAt)}
              variant="front"
            />
          </div>
        </div>
      )}
    </div>
  );
}
