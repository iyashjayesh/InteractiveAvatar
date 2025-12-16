import React from "react";

import { Button } from "../Button";
import { LoadingIcon, MicIcon, MicOffIcon } from "../Icons";
import { useConversationState } from "../logic/useConversationState";
import { useVoiceChat } from "../logic/useVoiceChat";

export const AudioInput: React.FC = () => {
  const { muteInputAudio, unmuteInputAudio, isMuted, isVoiceChatLoading } =
    useVoiceChat();
  const { isUserTalking } = useConversationState();

  const handleMouseDown = () => {
    if (!isVoiceChatLoading && isMuted) {
      unmuteInputAudio();
    }
  };

  const handleMouseUp = () => {
    if (!isVoiceChatLoading && !isMuted) {
      muteInputAudio();
    }
  };

  const handleMouseLeave = () => {
    // If user drags mouse away while holding, mute the mic
    if (!isVoiceChatLoading && !isMuted) {
      muteInputAudio();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        className={`!p-4 relative ${!isMuted ? "!bg-[#7559FF]" : ""}`}
        disabled={isVoiceChatLoading}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        <div
          className={`absolute left-0 top-0 rounded-lg border-2 border-[#7559FF] w-full h-full ${isUserTalking ? "animate-ping" : ""}`}
        />
        {isVoiceChatLoading ? (
          <LoadingIcon className="animate-spin" size={24} />
        ) : isMuted ? (
          <MicOffIcon size={24} />
        ) : (
          <MicIcon size={24} />
        )}
      </Button>
      <span className="text-xs text-zinc-400">
        {isMuted ? "Hold to talk" : "Speaking..."}
      </span>
    </div>
  );
};
