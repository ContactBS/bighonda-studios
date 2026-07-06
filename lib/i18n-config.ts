export const locales = ["en", "fr", "sv"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  sv: "Svenska"
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "French",
  sv: "Swedish"
};

export const localeOg: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  sv: "sv_SE"
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function stripLocale(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) {
    const stripped = `/${parts.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped.replace(/\/$/, "") || "/";
  }
  return pathname || "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  return normalizeLocale(pathname.split("/").filter(Boolean)[0]);
}

export function localizedPath(pathname: string, locale: Locale) {
  const path = stripLocale(pathname);
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function localizedInternalHref(href: string, locale: Locale) {
  if (locale === defaultLocale || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }
  return localizedPath(href, locale);
}

export const localizedRoutes = [
  "/",
  "/about",
  "/books",
  "/podcast",
  "/photography",
  "/teaching-events",
  "/teaching-videos",
  "/music-by-saul",
  "/contact"
];

export const ui = {
  en: {
    nav: {
      primary: "Primary navigation",
      home: "Home",
      books: "Books",
      podcast: "Podcast",
      music: "Music by Saul",
      photography: "Photography",
      videos: "Teaching Videos",
      events: "Teaching & Events",
      about: "About",
      contact: "Contact",
      language: "Language"
    },
    footer: {
      explore: "Explore",
      links: "Links",
      copyright: "All rights reserved."
    },
    buttons: {
      exploreBooks: "Explore Books",
      listenPodcast: "Listen to Podcast",
      musicBySaul: "Music by Saul",
      bookSaul: "Book Saul",
      viewEpisodes: "View Episodes",
      exploreMusic: "Explore Music",
      viewGallery: "View Gallery",
      contactSaul: "Contact Saul",
      inviteTeach: "Invite Saul to Teach",
      listenSpotify: "Listen on Spotify",
      listenAppleMusic: "Listen on Apple Music",
      discussMusic: "Discuss music or creative work",
      bookTime: "Book a Time",
      emailSaul: "Email Saul",
      composeEmail: "Compose Email",
      requestUpdates: "Request Updates",
      viewBook: "View Book",
      buyBook: "Buy Book",
      openTransistor: "Open Transistor Page",
      suggestTopic: "Suggest a Conversation Topic",
      bookSermon: "Book Saul for a Sermon or Workshop"
    },
    common: {
      alsoPublished: "Also published",
      podcast: "Podcast",
      photography: "Photography",
      events: "Teaching & Events",
      newsletter: "Newsletter / Contact",
      recentReleases: "Recent Releases",
      artistPage: "Artist page",
      latestEpisodes: "Latest Episodes",
      upcomingBooks: "Upcoming Books",
      creativePillars: "Creative Pillars",
      bookingForm: "Booking Form",
      faq: "FAQ",
      author: "Author",
      format: "Format",
      topics: "Topics",
      status: "Status",
      relatedPodcast: "Related podcast",
      inviteSaul: "Invite Saul",
      bookDetailsEvents: "Events",
      idealFor: "Ideal for:",
      duration: "Duration:",
      socialLinks: "Social Links",
      books: "Books"
    },
    photoGallery: {
      all: "All",
      close: "Close",
      closeDetails: "Close photo details",
      buyPrint: "Buy Print",
      requestPrint: "Request Print",
      licensePhoto: "License This Photo",
      location: "Location",
      availability: "Availability",
      price: "Price",
      printSizes: "Print sizes",
      inquire: "Inquire",
      filterLabel: "Filter photographs by category"
    },
    form: {
      name: "Name",
      email: "Email",
      organization: "Organization",
      eventType: "Event type",
      inquiryType: "Inquiry type",
      preferredDate: "Preferred date",
      locationOnline: "Location / online",
      audienceSize: "Audience size",
      budgetRange: "Budget range",
      message: "Message"
    },
    pages: {
      homeRole: "Writer, podcaster, photographer, songwriter, music producer, teacher, speaker",
      musicTitle: "Songs of faith, conviction, and transformation.",
      photoTitle: "A purchasable gallery for quiet, attentive images.",
      eventsTitle: "Book Saul for thoughtful rooms.",
      aboutPillarsTitle: "One studio, several faithful forms.",
      booksTitle: "Published and upcoming work from Saul Loubassa Bighonda.",
      booksDescription: "Books on belief, doubt, fatherhood, purpose, faith, identity, and spiritual transformation.",
      upcomingBooksTitle: "Future titles can be added without changing component code.",
      upcomingBooksDescription: "Edit content/books.json to add draft, upcoming, or coming-soon books.",
      bookInviteTitle: "Teach or speak from this subject matter.",
      bookInviteDescription: "Book a sermon, workshop, interview, moderated conversation, or community gathering connected to this book.",
      podcastEpisodesTitle: "Short sermons for renewal and resistance to conformity.",
      podcastEpisodesDescription: "Episodes are fetched from the Be Ye Transformed RSS feed during static generation, with local fallback content if the feed is unavailable.",
      musicArtistTitle: "Faith, reflection, and experimental production.",
      musicArtistDescription: "Listen through Saul's artist profiles, then update the local release list as new songs are published.",
      musicReleasesDescription: "Explore recent songs written and produced by Saul Loubassa Bighonda.",
      photographyTitle: "Fine-art, editorial, and commissioned images.",
      photographyDescription: "Browse photographs by category, request prints, license images, or commission Saul for a creative session. Images can use local fallback content now and CMS-managed entries after admin setup.",
      teachingEventsTitle: "Invite Saul into rooms built for thought, faith, and transformation.",
      teachingEventsDescription: "Available for teaching, speaking, sermons, workshops, book talks, podcast interviews, church and community events, photography exhibitions, and custom gatherings.",
      bookingTitle: "Start the conversation.",
      bookingDescription: "The form opens an email with the event details. Add NEXT_PUBLIC_BOOKING_URL for a Calendly or Cal.com button.",
      faqTitle: "Practical notes before booking.",
      teachingVideosTitle: "Teaching, sermons, lessons, and reflections.",
      teachingVideosDescription: "A space for Saul Loubassa Bighonda to share teaching videos, sermons, lessons, reflections, workshops, and other video-based instruction.",
      videoUnsupported: "Your browser does not support the video tag.",
      contactTitle: "For books, sermons, interviews, photos, and thoughtful gatherings.",
      contactDescription: "Send a general note, request a booking, inquire about photography prints or licensing, or invite Saul into a conversation.",
      contactPodcastLink: "Listen or share the podcast"
    }
  },
  fr: {
    nav: {
      primary: "Navigation principale",
      home: "Accueil",
      books: "Livres",
      podcast: "Podcast",
      music: "Musique par Saul",
      photography: "Photographie",
      videos: "Vidéos d'enseignement",
      events: "Enseignement & événements",
      about: "À propos",
      contact: "Contact",
      language: "Langue"
    },
    footer: {
      explore: "Explorer",
      links: "Liens",
      copyright: "Tous droits réservés."
    },
    buttons: {
      exploreBooks: "Explorer les livres",
      listenPodcast: "Écouter le podcast",
      musicBySaul: "Musique par Saul",
      bookSaul: "Inviter Saul",
      viewEpisodes: "Voir les épisodes",
      exploreMusic: "Explorer la musique",
      viewGallery: "Voir la galerie",
      contactSaul: "Contacter Saul",
      inviteTeach: "Inviter Saul à enseigner",
      listenSpotify: "Écouter sur Spotify",
      listenAppleMusic: "Écouter sur Apple Music",
      discussMusic: "Parler musique ou création",
      bookTime: "Réserver un créneau",
      emailSaul: "Écrire à Saul",
      composeEmail: "Composer l'e-mail",
      requestUpdates: "Demander des nouvelles",
      viewBook: "Voir le livre",
      buyBook: "Acheter le livre",
      openTransistor: "Ouvrir la page Transistor",
      suggestTopic: "Suggérer un sujet",
      bookSermon: "Inviter Saul pour une prédication ou un atelier"
    },
    common: {
      alsoPublished: "Également publié",
      podcast: "Podcast",
      photography: "Photographie",
      events: "Enseignement & événements",
      newsletter: "Newsletter / Contact",
      recentReleases: "Sorties récentes",
      artistPage: "Page artiste",
      latestEpisodes: "Derniers épisodes",
      upcomingBooks: "Livres à venir",
      creativePillars: "Piliers créatifs",
      bookingForm: "Formulaire de réservation",
      faq: "FAQ",
      author: "Auteur",
      format: "Format",
      topics: "Thèmes",
      status: "Statut",
      relatedPodcast: "Podcast lié",
      inviteSaul: "Inviter Saul",
      bookDetailsEvents: "Événements",
      idealFor: "Idéal pour :",
      duration: "Durée :",
      socialLinks: "Réseaux sociaux",
      books: "Livres"
    },
    photoGallery: {
      all: "Tout",
      close: "Fermer",
      closeDetails: "Fermer les détails de la photo",
      buyPrint: "Acheter un tirage",
      requestPrint: "Demander un tirage",
      licensePhoto: "Licencier cette photo",
      location: "Lieu",
      availability: "Disponibilité",
      price: "Prix",
      printSizes: "Formats de tirage",
      inquire: "Sur demande",
      filterLabel: "Filtrer les photographies par catégorie"
    },
    form: {
      name: "Nom",
      email: "E-mail",
      organization: "Organisation",
      eventType: "Type d'événement",
      inquiryType: "Type de demande",
      preferredDate: "Date souhaitée",
      locationOnline: "Lieu / en ligne",
      audienceSize: "Taille du public",
      budgetRange: "Fourchette de budget",
      message: "Message"
    },
    pages: {
      homeRole: "Écrivain, podcasteur, photographe, auteur-compositeur, producteur musical, enseignant, conférencier",
      musicTitle: "Des chants de foi, de conviction et de transformation.",
      photoTitle: "Une galerie à acquérir, faite d'images calmes et attentives.",
      eventsTitle: "Inviter Saul dans des espaces de réflexion.",
      aboutPillarsTitle: "Un studio, plusieurs formes fidèles.",
      booksTitle: "Livres publiés et à venir de Saul Loubassa Bighonda.",
      booksDescription: "Des livres sur la croyance, le doute, la paternité, le but, la foi, l'identité et la transformation spirituelle.",
      upcomingBooksTitle: "Les futurs titres peuvent être ajoutés sans modifier le code des composants.",
      upcomingBooksDescription: "Modifiez content/books.json pour ajouter des livres en brouillon, à venir ou annoncés.",
      bookInviteTitle: "Enseigner ou prendre la parole à partir de ce sujet.",
      bookInviteDescription: "Invitez Saul pour une prédication, un atelier, une interview, une conversation animée ou une rencontre communautaire liée à ce livre.",
      podcastEpisodesTitle: "De courtes prédications pour le renouvellement et la résistance au conformisme.",
      podcastEpisodesDescription: "Les épisodes sont récupérés depuis le flux RSS Be Ye Transformed pendant la génération statique, avec un contenu local de secours si le flux est indisponible.",
      musicArtistTitle: "Foi, réflexion et production expérimentale.",
      musicArtistDescription: "Écoutez les profils artiste de Saul, puis mettez à jour la liste locale des sorties lorsque de nouveaux chants sont publiés.",
      musicReleasesDescription: "Découvrez des chants récents écrits et produits par Saul Loubassa Bighonda.",
      photographyTitle: "Images d'art, éditoriales et commandées.",
      photographyDescription: "Parcourez les photographies par catégorie, demandez des tirages, des licences d'image ou une séance créative avec Saul.",
      teachingEventsTitle: "Invitez Saul dans des espaces faits pour la pensée, la foi et la transformation.",
      teachingEventsDescription: "Disponible pour enseignements, prises de parole, prédications, ateliers, rencontres autour des livres, interviews, événements d'église et communautaires, expositions photo et rencontres sur mesure.",
      bookingTitle: "Commencer la conversation.",
      bookingDescription: "Le formulaire ouvre un e-mail avec les détails de l'événement. Ajoutez NEXT_PUBLIC_BOOKING_URL pour afficher un bouton Calendly ou Cal.com.",
      faqTitle: "Notes pratiques avant de réserver.",
      teachingVideosTitle: "Enseignements, prédications, leçons et réflexions.",
      teachingVideosDescription: "Un espace pour partager les vidéos d'enseignement, prédications, leçons, réflexions, ateliers et autres instructions vidéo de Saul Loubassa Bighonda.",
      videoUnsupported: "Votre navigateur ne prend pas en charge la vidéo.",
      contactTitle: "Pour les livres, prédications, interviews, photos et rencontres réfléchies.",
      contactDescription: "Envoyez un message, demandez une réservation, renseignez-vous sur les tirages ou licences photo, ou invitez Saul dans une conversation.",
      contactPodcastLink: "Écouter ou partager le podcast"
    }
  },
  sv: {
    nav: {
      primary: "Primär navigering",
      home: "Hem",
      books: "Böcker",
      podcast: "Podcast",
      music: "Musik av Saul",
      photography: "Fotografi",
      videos: "Undervisningsvideor",
      events: "Undervisning & event",
      about: "Om",
      contact: "Kontakt",
      language: "Språk"
    },
    footer: {
      explore: "Utforska",
      links: "Länkar",
      copyright: "Alla rättigheter förbehållna."
    },
    buttons: {
      exploreBooks: "Utforska böcker",
      listenPodcast: "Lyssna på podcasten",
      musicBySaul: "Musik av Saul",
      bookSaul: "Boka Saul",
      viewEpisodes: "Visa avsnitt",
      exploreMusic: "Utforska musiken",
      viewGallery: "Visa galleriet",
      contactSaul: "Kontakta Saul",
      inviteTeach: "Bjud in Saul att undervisa",
      listenSpotify: "Lyssna på Spotify",
      listenAppleMusic: "Lyssna på Apple Music",
      discussMusic: "Prata musik eller kreativt arbete",
      bookTime: "Boka en tid",
      emailSaul: "Mejla Saul",
      composeEmail: "Skapa e-post",
      requestUpdates: "Be om uppdateringar",
      viewBook: "Visa boken",
      buyBook: "Köp boken",
      openTransistor: "Öppna Transistor-sidan",
      suggestTopic: "Föreslå ett samtalsämne",
      bookSermon: "Boka Saul för predikan eller workshop"
    },
    common: {
      alsoPublished: "Även publicerad",
      podcast: "Podcast",
      photography: "Fotografi",
      events: "Undervisning & event",
      newsletter: "Nyhetsbrev / Kontakt",
      recentReleases: "Senaste släpp",
      artistPage: "Artistsida",
      latestEpisodes: "Senaste avsnitt",
      upcomingBooks: "Kommande böcker",
      creativePillars: "Kreativa pelare",
      bookingForm: "Bokningsformulär",
      faq: "FAQ",
      author: "Författare",
      format: "Format",
      topics: "Ämnen",
      status: "Status",
      relatedPodcast: "Relaterad podcast",
      inviteSaul: "Bjud in Saul",
      bookDetailsEvents: "Event",
      idealFor: "Passar för:",
      duration: "Längd:",
      socialLinks: "Sociala länkar",
      books: "Böcker"
    },
    photoGallery: {
      all: "Alla",
      close: "Stäng",
      closeDetails: "Stäng fotodetaljer",
      buyPrint: "Köp print",
      requestPrint: "Begär print",
      licensePhoto: "Licensiera detta foto",
      location: "Plats",
      availability: "Tillgänglighet",
      price: "Pris",
      printSizes: "Printstorlekar",
      inquire: "På förfrågan",
      filterLabel: "Filtrera fotografier efter kategori"
    },
    form: {
      name: "Namn",
      email: "E-post",
      organization: "Organisation",
      eventType: "Typ av event",
      inquiryType: "Typ av förfrågan",
      preferredDate: "Önskat datum",
      locationOnline: "Plats / online",
      audienceSize: "Publikstorlek",
      budgetRange: "Budgetintervall",
      message: "Meddelande"
    },
    pages: {
      homeRole: "Författare, poddare, fotograf, låtskrivare, musikproducent, lärare, talare",
      musicTitle: "Sånger om tro, övertygelse och förvandling.",
      photoTitle: "Ett galleri med stillsamma, uppmärksamma bilder att köpa.",
      eventsTitle: "Boka Saul för eftertänksamma rum.",
      aboutPillarsTitle: "En studio, flera trofasta former.",
      booksTitle: "Publicerade och kommande verk av Saul Loubassa Bighonda.",
      booksDescription: "Böcker om tro, tvivel, faderskap, syfte, identitet och andlig förvandling.",
      upcomingBooksTitle: "Framtida titlar kan läggas till utan att ändra komponentkod.",
      upcomingBooksDescription: "Redigera content/books.json för att lägga till utkast, kommande böcker eller titlar som snart lanseras.",
      bookInviteTitle: "Undervisa eller tala utifrån detta ämne.",
      bookInviteDescription: "Boka en predikan, workshop, intervju, modererat samtal eller gemenskapsträff kopplad till denna bok.",
      podcastEpisodesTitle: "Korta predikningar för förnyelse och motstånd mot anpassning.",
      podcastEpisodesDescription: "Avsnitt hämtas från Be Ye Transformed RSS-flöde vid statisk generering, med lokalt reservinnehåll om flödet inte är tillgängligt.",
      musicArtistTitle: "Tro, reflektion och experimentell produktion.",
      musicArtistDescription: "Lyssna via Sauls artistprofiler och uppdatera sedan den lokala listan när nya sånger publiceras.",
      musicReleasesDescription: "Utforska nya sånger skrivna och producerade av Saul Loubassa Bighonda.",
      photographyTitle: "Konstnärliga, redaktionella och beställda bilder.",
      photographyDescription: "Bläddra bland fotografier efter kategori, beställ prints, licensiera bilder eller boka en kreativ session med Saul.",
      teachingEventsTitle: "Bjud in Saul till rum byggda för tanke, tro och förvandling.",
      teachingEventsDescription: "Tillgänglig för undervisning, tal, predikningar, workshops, boksamtal, podcastintervjuer, kyrko- och communityevent, fotoutställningar och skräddarsydda samlingar.",
      bookingTitle: "Starta samtalet.",
      bookingDescription: "Formuläret öppnar ett e-postmeddelande med eventdetaljerna. Lägg till NEXT_PUBLIC_BOOKING_URL för en Calendly- eller Cal.com-knapp.",
      faqTitle: "Praktiska anteckningar innan bokning.",
      teachingVideosTitle: "Undervisning, predikningar, lektioner och reflektioner.",
      teachingVideosDescription: "En plats där Saul Loubassa Bighonda kan dela undervisningsvideor, predikningar, lektioner, reflektioner, workshops och annan videobaserad undervisning.",
      videoUnsupported: "Din webbläsare stöder inte videotaggen.",
      contactTitle: "För böcker, predikningar, intervjuer, foton och eftertänksamma samlingar.",
      contactDescription: "Skicka ett meddelande, be om en bokning, fråga om fotoprints eller licenser, eller bjud in Saul till ett samtal.",
      contactPodcastLink: "Lyssna på eller dela podcasten"
    }
  }
} as const;
