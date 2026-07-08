import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

const SITE_NAME = 'Zadex';

const RouteTitle = () => {
    const matches = useMatches();

    useEffect(() => {
        const currentTitle = [...matches]
            .reverse()
            .find(match => match.handle?.title)?.handle.title;

        document.title = currentTitle ? `${currentTitle} | ${SITE_NAME}` : SITE_NAME;
    }, [matches]);

    return null;
};

export default RouteTitle;
