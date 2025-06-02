// Copyright Epic Games, Inc. All Rights Reserved.

export * from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5';
export * from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';
import { Config, PixelStreaming, Logger, LogLevel, Flags } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5';
import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';
const PixelStreamingApplicationStyles =
    new PixelStreamingApplicationStyle();
PixelStreamingApplicationStyles.applyStyleSheet();

declare global {
    interface Window { pixelStreaming: PixelStreaming; }
}

// Authentication protection: redirect to login if not authenticated
if (!localStorage.getItem('auth_token')) {
    window.location.href = 'login.html';
}

document.body.onload = function() {
    Logger.InitLogging(LogLevel.Warning, true);

    // Create a config object with all input disabled
    const config = new Config({
        useUrlParams: true,
        initialSettings: {
            [Flags.KeyboardInput]: false,
            [Flags.MouseInput]: false,
            [Flags.TouchInput]: false,
            [Flags.GamepadInput]: false
        }
    });

    const stream = new PixelStreaming(config);

    const application = new Application({
        stream,
        onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode)
    });
    document.body.appendChild(application.rootElement);

    window.pixelStreaming = stream;
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('auth_token');
            window.location.href = 'login.html';
        });
    }
}); 