import { useEffect } from 'react';

function useEventListener(
    toolbox: Stage.Types.WidgetlessToolbox,
    event: string | undefined,
    handler: (...args: any[]) => void
) {
    useEffect(() => {
        if (event) {
            toolbox.getEventBus().on(event, handler);
            return () => toolbox.getEventBus().off(event, handler);
        }

        return undefined;
    }, [event, handler]);
}

declare global {
    namespace Stage {
        interface Hooks {
            useEventListener: typeof useEventListener;
        }
    }
}
Stage.defineHook({ useEventListener });
