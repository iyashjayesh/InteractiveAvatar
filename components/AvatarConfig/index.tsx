import {
  StartAvatarRequest
} from "@heygen/streaming-avatar";
import React, { useMemo, useState } from "react";

import { Input } from "../Input";
import { PDFUpload } from "../PDFUpload";

import { Field } from "./Field";

import { AVATARS } from "@/app/lib/constants";

interface AvatarConfigProps {
  onConfigChange: (config: StartAvatarRequest) => void;
  config: StartAvatarRequest;
}

export const AvatarConfig: React.FC<AvatarConfigProps> = ({
  onConfigChange,
  config,
}) => {
  const onChange = <T extends keyof StartAvatarRequest>(
    key: T,
    value: StartAvatarRequest[T],
  ) => {
    onConfigChange({ ...config, [key]: value });
  };
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [useExistingKB, setUseExistingKB] = useState<boolean>(false);

  const selectedAvatar = useMemo(() => {
    const avatar = AVATARS.find(
      (avatar) => avatar.avatar_id === config.avatarName,
    );

    if (!avatar) {
      return {
        isCustom: true,
        name: "Custom Avatar ID",
        avatarId: null,
      };
    } else {
      return {
        isCustom: false,
        name: avatar.name,
        avatarId: avatar.avatar_id,
      };
    }
  }, [config.avatarName]);

  return (
    <div className="relative flex flex-col gap-4 w-[550px] py-8 max-h-full overflow-y-auto px-4">
      <Field label="Knowledge Base">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!useExistingKB}
                onChange={() => setUseExistingKB(false)}
                className="cursor-pointer"
              />
              <span className="text-sm text-zinc-300">Upload PDF</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={useExistingKB}
                onChange={() => setUseExistingKB(true)}
                className="cursor-pointer"
              />
              <span className="text-sm text-zinc-300">Use Existing ID</span>
            </label>
          </div>

          {useExistingKB ? (
            <Input
              placeholder="Enter existing Knowledge Base ID"
              value={config.knowledgeId}
              onChange={(value) => onChange("knowledgeId", value)}
            />
          ) : (
            <PDFUpload
              onUploadComplete={(knowledgeId) => onChange("knowledgeId", knowledgeId)}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          )}
        </div>
      </Field>
    </div>
  );
};
