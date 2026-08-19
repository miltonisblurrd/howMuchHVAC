"use client";

import { createContext, useContext } from "react";
import type { PublicContact } from "@/lib/business";
import { site } from "@/lib/site";

const fallback: PublicContact = {
  displayName: "Andy",
  publicEmail: site.email,
  directDisplay: site.phones.direct.display,
  directHref: site.phones.direct.href,
  officeAddress: "",
  officeDisplay: site.phones.office.display,
  officeHref: site.phones.office.href,
  avatarUrl: null,
};

const ContactContext = createContext<PublicContact>(fallback);

export function ContactProvider({
  contact,
  children,
}: {
  contact: PublicContact;
  children: React.ReactNode;
}) {
  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>;
}

export function useContact() {
  return useContext(ContactContext);
}
