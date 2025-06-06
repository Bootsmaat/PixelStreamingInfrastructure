// Copyright Epic Games, Inc. All Rights Reserved.

import { Logger } from '@epicgames-ps/lib-pixelstreamingcommon-ue5.6';

export class ResponseController {
    responseEventListeners: Map<string, (response: string) => void> = new Map();

    /**
     * Add a response event listener to the response map
     * @param name - The name of the response
     * @param listener - The method to be activated when the response is selected
     */
    addResponseEventListener(name: string, listener: (response: string) => void) {
        this.responseEventListeners.set(name, listener);
    }

    /**
     * Remove a response event listener to the response map
     * @param name - The name of the response
     */
    removeResponseEventListener(name: string) {
        this.responseEventListeners.delete(name);
    }

    /**
     * Handle a response when receiving one form the streamer
     * @param message - Data received from the data channel with the command in question
     */
    onResponse(message: ArrayBuffer) {
        Logger.Info('DataChannelReceiveMessageType.Response');
        const responses = new TextDecoder('utf-16').decode(message.slice(1));

        Logger.Info(responses);
        this.responseEventListeners.forEach((listener: (response: string) => void) => {
            listener(responses);
        });
    }
}
