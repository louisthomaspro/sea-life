export const conservation_status_dict: {
  [conservation_status: string]: {
    title: {
      [lang: string]: string;
    };
  };
} = {
  CR: {
    title: {
      fr: "Gravement menacée",
      en: "Critically endangered",
    },
  },
  EN: {
    title: {
      fr: "Menacé",
      en: "Endangered",
    },
  },
};