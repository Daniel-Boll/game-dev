import { en, pt } from "../assets";

export class Language {
  public static current: string = "pt";

  public static setLanguage(language: string): void {
    this.current = language;
  }

  public static getLanguage(): string {
    return this.current;
  }

  public static nextLanguage(): string {
    if (this.current === "pt") {
      this.setLanguage("en");
    } else if (this.current === "en") {
      this.setLanguage("pt");
    }

    return this.getLanguage();
  }

  public static getContent(content: string): string {
    const language = this.getLanguage();
    const notFound = "###Not Found###";

    if (language === "pt") {
      return pt.has(content) ? pt.get(content) : notFound;
    } else if (language === "en") {
      return en.has(content) ? en.get(content) : notFound;
    }

    return notFound;
  }
}
