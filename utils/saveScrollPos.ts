/**
 * Based on https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81
 * - see https://github.com/vercel/next.js/issues/3303#issuecomment-628400930
 * - see https://github.com/vercel/next.js/issues/12530#issuecomment-628864374
 */
import { useEffect, useState } from 'react';

import Router, { useRouter } from 'next/router';

function saveScrollPos(asPath: string) {
    sessionStorage.setItem(`scrollPos:${asPath}`, JSON.stringify({ x: window.scrollX, y: window.scrollY }));
}

function restoreScrollPos(asPath: string) {
    const json = sessionStorage.getItem(`scrollPos:${asPath}`);
    const scrollPos = json ? JSON.parse(json) : undefined;
    if (scrollPos) {
        window.scrollTo(scrollPos.x, scrollPos.y);
    }
}

export const useScrollRestoration = (): void => {
    const router = useRouter();
    const [shouldScrollRestore, setShouldScrollRestore] = useState(false);

    useEffect(() => {
        if (shouldScrollRestore) {
            restoreScrollPos(router.asPath);
        }
    }, [router.asPath, shouldScrollRestore]);

    useEffect(() => {
        if (!('scrollRestoration' in window.history)) return;
        window.history.scrollRestoration = 'manual';

        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            saveScrollPos(router.asPath);
            delete event['returnValue'];
        };

        const onRouteChangeStart = () => {
            saveScrollPos(router.asPath);
        };

        const onRouteChangeComplete = () => {
            setShouldScrollRestore(false);
        };

        window.addEventListener('beforeunload', onBeforeUnload);
        Router.events.on('routeChangeStart', onRouteChangeStart);
        Router.events.on('routeChangeComplete', onRouteChangeComplete);
        Router.beforePopState(() => {
            setShouldScrollRestore(true);
            return true;
        });

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            Router.events.off('routeChangeStart', onRouteChangeStart);
            Router.events.off('routeChangeComplete', onRouteChangeComplete);
            Router.beforePopState(() => true);
        };
    }, [router, shouldScrollRestore]);
};