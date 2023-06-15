import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Error = () => {
  const { t } = useTranslation();
  return (
    <>
      <h3>{t('notFound.header')}</h3>
      <div>
        {t('notFound.message')}
        <Link to="/signup"> {t('notFound.linkText')}</Link>
      </div>
    </>
  );
};

export default Error;
