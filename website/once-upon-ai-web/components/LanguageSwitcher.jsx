import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import English from "language-icons/icons/en.svg";
import Dutch from "language-icons/icons/nl.svg";
import Image from "next/image";
 
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { asPath, locale } = router;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ul>
      {locale !== "en" && (
        <li>
          <Link href={asPath} locale="en" onClick={() => changeLanguage("en")}>
            <Image alt="English" src="https://unpkg.com/language-icons/icons/en.svg" width={24} height={24} />
          </Link>
        </li>
      )}
      {locale !== "nl" && (
        <li>
          <Link href={asPath} locale="nl" onClick={() => changeLanguage("nl")}>
            <Image alt="Dutch" src="https://unpkg.com/language-icons/icons/nl.svg" width={24} height={24} />
          </Link>
        </li>
      )}
    </ul>
  );
}

export default LanguageSwitcher;
