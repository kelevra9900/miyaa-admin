import {SearchIcon} from '@/components/icons/search-icon';
import {searchModalInitialValues} from '@/utils/constants';
import Link from '@/components/ui/link';
import Scrollbar from '@/components/ui/scrollbar';
import {
  getAuthCredentials,
  hasAccess
} from '@/utils/auth-utils';
import {STAFF} from '@/utils/constants';
import cn from 'classnames';
import {useAtom} from 'jotai';
import {isEmpty} from 'lodash';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
import {Fragment,useEffect,useState} from 'react';
import {ChildMenu} from '@/utils/searched-url';
import {TermsIcon} from '@/components/icons/sidebar/terms';

type IProps = {};

const SearchBar: React.FC<IProps> = ({ }: IProps) => {
  const {t} = useTranslation();
  const initialItem: ChildMenu[] = [];
  const [searchText,setSearchText] = useState('');
  const [searchItem,setSearchItem] = useState(initialItem);
  const [searchModal] = useAtom(searchModalInitialValues);
  let {
    query: {shop},
  } = useRouter();
  const {permissions: currentUserPermissions} = getAuthCredentials();

  const getAuthorizedURL = (links: any[]): any[] => {
    return [...links].filter((link) =>
      hasAccess(link?.permissions!,currentUserPermissions)
    );
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text || text.length < 1) {
      setSearchItem([]);
      return;
    }

    let searchAbleLinks = [];
    let flattenShop = [];

    if (hasAccess([STAFF],currentUserPermissions)) {
      // shop = me?.managed_shop?.slug!;
    }

    switch (true) {
      default:
        searchAbleLinks = getAuthorizedURL(['/']);
        break;
    }
  };

  useEffect(() => {
    if (searchText === '') {
      setSearchItem(initialItem);
    } else {
      handleSearch(searchText);
    }
  },[searchText]);

  return (
    <Fragment>
      <div
        className={cn('fixed inset-0',searchText === '' && 'hidden')}
        onClick={() => setSearchText('')}
      />
      <div className="relative w-full max-w-lg rounded-3xl">
        <SearchIcon className="absolute inset-y-0 left-4 my-auto h-4 w-4" />
        <input
          type="text"
          className="block w-full rounded-3xl border border-solid border-border-200 bg-gray-50 py-2 text-sm text-heading transition-[border] placeholder:text-gray-400 focus:border-accent focus:bg-white focus:outline-none focus:ring-0 ltr:pl-12 rtl:pr-12 sm:text-sm sm:leading-6"
          placeholder={t('text-top-bar-search-placeholder') ?? 'Buscar...'}
          value={searchText}
          onChange={(e) => handleSearch(e?.target?.value)}
        />
        {!isEmpty(searchItem) && (
          <button
            className="absolute top-1/2 h-auto w-auto -translate-y-1/2 px-0 text-sm font-medium text-gray-500 hover:text-accent-hover ltr:right-4 rtl:left-4"
            onClick={(e) => {
              e.preventDefault();
              setSearchText('');
            }}
          >
            {t('text-clear')}
          </button>
        )}
      </div>

      {!isEmpty(searchItem) ? (
        <div className="sidebar-scrollbar absolute top-12 z-30 h-[418px] max-h-[418px] w-full max-w-lg rounded-xl border border-solid border-gray-200 bg-white py-4 shadow-box lg:top-[74px]">
          <Scrollbar
            className="max-h-full w-full"
            options={{
              scrollbars: {
                autoHide: 'never',
              },
            }}
          >
            <div className="flex flex-col">
              <h4 className="px-6 pb-2 text-sm font-medium text-black xl:text-base">
                {t('text-quick-page-links')}
              </h4>
              <div className="mx-3">
                {searchItem?.map((item) => {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setSearchItem([]);
                        setSearchText('');
                      }}
                      className="group flex items-center rounded-lg py-2.5 px-3 text-sm text-gray-700 transition duration-200 ease-in-out hover:bg-gray-100 hover:text-heading"
                    >
                      <span className="inline-flex shrink-0 items-center justify-center rounded-md border border-gray-200 p-2 text-gray-500 group-hover:border-gray-300">
                        <TermsIcon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col ltr:pl-3 rtl:pr-3">
                        <span className="whitespace-nowrap font-medium capitalize">
                          {isEmpty(shop) ? t(item.customLabel!) : t(item.label) ?? 'No label'}
                        </span>
                        <span className="text-gray-500">{item?.href}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Scrollbar>
        </div>
      ) : null}
    </Fragment>
  );
};

export default SearchBar;
