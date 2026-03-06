import { useLanguage } from '../context/LanguageContext';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggle = () => setLang(lang === 'pt' ? 'en' : 'pt');

  return (
    <button
      onClick={toggle}
      className="btn-control"
      aria-label={`Switch to ${lang === 'pt' ? 'English' : 'Português'}`}
      title={`Switch language — current: ${lang === 'pt' ? 'PT-BR' : 'EN'}`}
    >
      <span className="text-xs font-bold tracking-wider w-5 text-center leading-none">
        {lang === 'pt' ? 'PT' : 'EN'}
      </span>
    </button>
  );
}
