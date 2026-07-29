/**
 * Official logos from Logos_locations, placed to match the standard
 * iFactory monthly report PDF (headers, OUR FOCUS badges, Contact Us).
 * Do not commit the reference PDF into the repo — assets live here only.
 */

import headerIfactory from "../assets/images/brand/header-ifactory.png";
import focusIfactory from "../assets/images/brand/focus-ifactory-network.png";
import focusDigitalChampion from "../assets/images/brand/focus-digital-champion.png";
import focusMaturity from "../assets/images/brand/focus-maturity-assessment.png";
import brandC4i4 from "../assets/images/brand/c4i4-square.png";
import brandIfactory from "../assets/images/brand/ifactory-network.png";

import logoPune from "../assets/images/contact/pune-c4i4.png";
import logoTrichy from "../assets/images/contact/trichy-indra-ganesan.png";
import logoLudhiana from "../assets/images/contact/ludhiana-iaht.png";
import logoJamshedpur from "../assets/images/contact/jamshedpur-tata.png";
import logoAhmedabad from "../assets/images/contact/ahmedabad-kaushalya.png";
import logoKashmir from "../assets/images/contact/kashmir-iust.png";
import logoIndore from "../assets/images/contact/indore-suas.png";
import logoVisakhapatnam from "../assets/images/contact/visakhapatnam-andhra.png";
import logoDelhi from "../assets/images/contact/delhi-nsut.png";
import linkedinQr from "../assets/images/contact/linkedin-qr.png";

/** Top-left header mark on every content page (matches PDF). */
export const HEADER_LOGO = headerIfactory;

/** Footer pair on Contact Us. */
export const CONTACT_FOOTER_LOGOS = {
  c4i4: brandC4i4,
  ifactory: brandIfactory,
};

export const LINKEDIN_QR = linkedinQr;

/**
 * Three circular badges at the bottom of the OUR FOCUS page (PDF page 02).
 * Order: iFactory Network → Digital Champion → I⁴ Maturity Assessment.
 */
export const OUR_FOCUS_BADGES = [
  { id: "ifactory", label: "iFactory Network", src: focusIfactory },
  { id: "digital-champion", label: "Digital Champion", src: focusDigitalChampion },
  { id: "maturity", label: "I⁴ Maturity Assessment", src: focusMaturity },
];

/** Partner logos keyed by common location name aliases. */
export const LOCATION_LOGOS = {
  pune: logoPune,
  trichy: logoTrichy,
  tiruchirappalli: logoTrichy,
  ludhiana: logoLudhiana,
  jamshedpur: logoJamshedpur,
  ahmedabad: logoAhmedabad,
  kashmir: logoKashmir,
  srinagar: logoKashmir,
  indore: logoIndore,
  visakhapatnam: logoVisakhapatnam,
  vizag: logoVisakhapatnam,
  delhi: logoDelhi,
};

export const getLocationLogo = (locationName = "") => {
  const key = String(locationName).trim().toLowerCase();
  if (LOCATION_LOGOS[key]) return LOCATION_LOGOS[key];
  const hit = Object.keys(LOCATION_LOGOS).find((k) => key.includes(k) || k.includes(key));
  return hit ? LOCATION_LOGOS[hit] : null;
};

export const CONTACT_LOCATIONS = [
  {
    city: "Pune",
    institution: "C4i4 Lab, Samarth Udyog Technology Forum",
    phone: "+91-9175756900",
    email: "support.ifactory@c4i4.org",
    website: "https://ifactory.c4i4.org/pune/",
    logo: logoPune,
  },
  {
    city: "Tiruchirappalli",
    institution: "Indra Ganesan College of Engineering",
    phone: "+91-8508688828",
    email: "iFactory.IG_Trichy@c4i4.org",
    website: "https://ifactory.c4i4.org/Trichy/",
    logo: logoTrichy,
  },
  {
    city: "Ludhiana",
    institution: "Institute For AutoParts and Hand Tools Technology",
    phone: "+91-8427262400",
    email: "iFactory.IAHT_Ludhiana@c4i4.org",
    website: "https://ifactory.c4i4.org/Ludhiana/",
    logo: logoLudhiana,
  },
  {
    city: "Jamshedpur",
    institution: "Management Training Center, Tata Motors Limited",
    phone: "+91-8144996632",
    email: "iFactory.TML_Jamshedpur@c4i4.org",
    website: "https://ifactory.c4i4.org/Jamshedpur/",
    logo: logoJamshedpur,
  },
  {
    city: "Ahmedabad",
    institution: "ITI Kubernagar, Kaushalya - The Skill University",
    phone: "+91-9033361466",
    email: "ifactory.ksu_ahmedabad@c4i4.org",
    website: "",
    logo: logoAhmedabad,
  },
  {
    city: "Kashmir",
    institution: "Islamic University of Science & Technology",
    phone: "+91-7006426101",
    email: "iFactory.iust_srinagar@c4i4.org",
    website: "",
    logo: logoKashmir,
  },
  {
    city: "Indore",
    institution: "Symbiosis University of Applied Sciences",
    phone: "+91-9826047547",
    email: "iFactory.suas_indore@c4i4.org",
    website: "",
    logo: logoIndore,
  },
  {
    city: "Visakhapatnam",
    institution: "Andhra University",
    phone: "+91-8686003520",
    email: "iFactory.au_vizag@c4i4.org",
    website: "",
    logo: logoVisakhapatnam,
  },
  {
    city: "Delhi",
    institution: "Netaji Subhas University Of Technology",
    phone: "+91-9999331041",
    email: "iFactory.nsut_delhi@c4i4.org",
    website: "",
    logo: logoDelhi,
  },
];
