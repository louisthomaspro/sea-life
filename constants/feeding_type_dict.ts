export const feeding_type_dict: {
  [feeding_type: string]: {
    title: {
      [lang: string]: string
    }
    description: {
      [lang: string]: string
    }
  }
} = {
  carnivore: {
    title: {
      en: "Carnivore",
      fr: "Carnivore",
    },
    description: {
      en: "Fish that primarily eat other animals, such as smaller fish, crustaceans, and mollusks.",
      fr: "Les poissons qui se nourrissent principalement d'autres animaux, comme les poissons plus petits, les crustacés et les mollusques.",
    },
  },
  herbivore: {
    title: {
      en: "Herbivore",
      fr: "Herbivore",
    },
    description: {
      en: "Fish that primarily eat plants, such as algae or seagrasses.",
      fr: "Les poissons qui se nourrissent principalement de plantes, comme les algues ou les herbes de mer.",
    },
  },
  omnivore: {
    title: {
      en: "Omnivore",
      fr: "Omnivore",
    },
    description: {
      en: "Fish that eat both plants and animals as part of their diet.",
      fr: "Les poissons qui se nourrissent de plantes et d'animaux dans leur alimentation.",
    },
  },
  planktivore: {
    title: {
      en: "Planktivore",
      fr: "Planktivore",
    },
    description: {
      en: "Fish that primarily eat plankton, which are small floating organisms such as diatoms and copepods.",
      fr: "Les poissons qui se nourrissent principalement de plancton, qui sont de petits organismes flottants comme les diatomées et les copépodes.",
    },
  },
  benthivore: {
    title: {
      en: "Benthivore",
      fr: "Benthivore",
    },
    description: {
      en: "Fish that primarily feed on organisms that live on the bottom of the sea or freshwater.",
      fr: "Les poissons qui se nourrissent principalement d'organismes vivant au fond de la mer ou d'eau douce.",
    },
  },
  piscivore: {
    title: {
      en: "Piscivore",
      fr: "Piscivore",
    },
    description: {
      en: "Fish that primarily eat other fish.",
      fr: "Les poissons qui se nourrissent principalement d'autres poissons.",
    },
  },
  invertivore: {
    title: {
      en: "Invertivore",
      fr: "Invertivore",
    },
    description: {
      en: "Fish that primarily eat invertebrates, such as insects, worms, and crustaceans.",
      fr: "Les poissons qui se nourrissent principalement d'invertébrés, comme les insectes, les vers et les crustacés.",
    },
  },
  filter_feeder: {
    title: {
      en: "Filter-feeder",
      fr: "Filtreur",
    },
    description: {
      en: "Fish that filter food particles from the water using specialized structures such as gills or mouth parts.",
      fr: "Les poissons qui filtrent les particules alimentaires de l'eau à l'aide de structures spécialisées comme les branchies ou les pièces buccales.",
    },
  },
  parasite: {
    title: {
      en: "Parasite",
      fr: "Parasite",
    },
    description: {
      en: "Fish that feed on the body fluids of other organisms, often causing harm to the host organism.",
      fr: "Les poissons qui se nourrissent des fluides corporels d'autres organismes, causant souvent des dommages à l'organisme hôte.",
    },
  },
  detritivore: {
    title: {
      en: "Detritivore",
      fr: "Détritivore",
    },
    description: {
      en: "Fish that primarily eat detritus, which are non-living organic materials such as dead leaves and wood.",
      fr: "Les poissons qui se nourrissent principalement de déchets organiques, comme les feuilles et le bois morts.",
    },
  },
}
