
"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { GameCover } from "@/components/game-cover";

type GameFormValues = {
  imageUrl: string;
  title: string;
  playStoreUrl: string;
  description: string;
  budget: number | undefined;
  maxPlayers: number;
  levels: { name: string; reward: number | undefined }[];
};

export type NewGame = {
  imageUrl: string;
  title: string;
  playStoreUrl: string;
  description: string;
  budget: number;
  maxPlayers: number;
  levels: { id: string; name: string; reward: number }[];
};

export function AddGameDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (game: NewGame) => void;
}) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<GameFormValues>({
    defaultValues: {
      imageUrl: "",
      title: "",
      playStoreUrl: "",
      description: "",
      budget: undefined,
      levels: [{ name: "", reward: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "levels",
  });

  const budget = useWatch({ control, name: "budget" });
  const imageUrl = useWatch({ control, name: "imageUrl" });
  const levels = useWatch({ control, name: "levels" });

  const totalRewardPerPlayer = (levels ?? []).reduce(
    (total, level) =>
      total +
      (Number(level.reward) > 0 ? Number(level.reward) : 0),
    0,
  );

  const playerLimit =
    Number(budget) > 0 && totalRewardPerPlayer > 0
      ? Math.floor(Number(budget) / totalRewardPerPlayer)
      : 0;

  const uploadCover = async (file?: File) => {
    setImageError("");

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be 5 MB or smaller.");
      return;
    }

    setUploadingImage(true);

    try {
      const imageData = await readAndCompressImage(file);

      setValue("imageUrl", imageData, {
        shouldDirty: true,
        shouldValidate: true,
      });

      clearErrors("imageUrl");
    } catch (error) {
      console.error("Unable to process the uploaded game image.", error);

      setImageError(
        "We couldn't read that image. Try another JPG, PNG, or WebP file.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (values: GameFormValues) => {
    if (uploadingImage) return;

    const rewards = values.levels.map((level) => Number(level.reward));

    const rewardsPerPlayer = rewards.reduce(
      (total, reward) => total + reward,
      0,
    );

    const maxPlayers =
      rewardsPerPlayer > 0
        ? Math.floor(Number(values.budget) / rewardsPerPlayer)
        : 0;

    if (maxPlayers < 1) {
      setError("budget", {
        type: "validate",
        message:
          "Budget must cover at least one player’s complete set of rewards.",
      });

      return;
    }

    onCreate({
      ...values,
      imageUrl: values.imageUrl.trim(),
      title: values.title.trim(),
      playStoreUrl: values.playStoreUrl.trim(),
      description: values.description.trim(),
      budget: Number(values.budget),
      maxPlayers,
      levels: values.levels.map((level) => ({
        id: crypto.randomUUID(),
        name: level.name.trim(),
        reward: Number(level.reward),
      })),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex h-dvh w-full justify-center overflow-y-auto bg-white"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-game-title"
        className="min-h-dvh w-full bg-white"
      >
        <div className="sticky top-0 z-10 border-b border-[#e9e9e6] bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="mx-auto flex h-17 max-w-260 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full p-2 text-[#777] hover:bg-[#f2f2f0]"
              >
                <X size={18} />
              </button>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#888]">
                  New campaign
                </p>
                <h2 id="add-game-title" className="text-sm font-semibold">
                  Add a game
                </h2>
              </div>
            </div>

            <span className="hidden text-xs text-[#888] sm:block">
              Your campaign is saved in this browser
            </span>
          </div>
        </div>

        <form
          className="mx-auto grid max-w-260 gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:gap-12 lg:py-10"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#888]">
                01 — Game details
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.06em]">
                Tell us about your game.
              </h3>
              <p className="mt-1 text-sm text-[#777]">
                Add a few details so players know what they’re playing.
              </p>
            </div>

            <div className="block text-xs font-medium text-[#454545]">
              Game cover

              <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-dashed border-[#dcdcd8] bg-[#fafaf8] p-4 sm:flex-row sm:items-center">
                <GameCover
                  title="Game cover preview"
                  imageUrl={imageUrl}
                  className="size-24 shrink-0 rounded-xl sm:size-28"
                />

                <div className="min-w-0">
                  <p className="text-xs font-medium">
                    Upload your game image
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#777]">
                    JPG, PNG, or WebP · max 5 MB
                    <br />
                    Recommended size: 512 × 512 px or larger
                  </p>

                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e4e4e1] bg-white px-3.5 py-2 text-[11px] font-medium hover:bg-[#f3f3f0]">
                    <Upload size={13} />
                    {uploadingImage
                      ? "Preparing image…"
                      : "Choose image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploadingImage}
                      className="sr-only"
                      onChange={(event) => {
                        void uploadCover(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              {(imageError || errors.imageUrl?.message) && (
                <span className="mt-1 block text-[11px] font-normal text-red-600">
                  {imageError || errors.imageUrl?.message}
                </span>
              )}
            </div>

            <FormField label="Game title" error={errors.title?.message}>
              <input
                {...register("title", {
                  required: "Add a title for your game.",
                })}
                placeholder="The name players will see"
                className={fieldClass}
              />
            </FormField>

            <FormField
              label="Google Play Store link"
              error={errors.playStoreUrl?.message}
            >
              <input
                {...register("playStoreUrl", {
                  required: "Add the Google Play Store link.",
                  pattern: {
                    value: /^https?:\/\/\S+$/i,
                    message:
                      "Enter a valid link starting with http:// or https://.",
                  },
                })}
                type="url"
                placeholder="https://play.google.com/store/apps/details?id=..."
                className={fieldClass}
              />
            </FormField>

            <FormField
              label="Description"
              error={errors.description?.message}
            >
              <textarea
                {...register("description", {
                  required: "Add a short description.",
                  maxLength: {
                    value: 280,
                    message: "Keep the description under 280 characters.",
                  },
                })}
                rows={3}
                placeholder="What makes your game fun?"
                className={`${fieldClass} resize-y`}
              />
            </FormField>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#888]">
                02 — Campaign setup
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.06em]">
                Set the rewards.
              </h3>
              <p className="mt-1 text-sm text-[#777]">
                The player limit updates automatically from your budget.
              </p>
            </div>

            <FormField
              label="Total campaign budget"
              error={errors.budget?.message}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#777]">
                  $
                </span>

                <input
                  {...register("budget", {
                    valueAsNumber: true,
                    required: "Set a campaign budget.",
                    min: {
                      value: 1,
                      message: "Budget must be more than $0.",
                    },
                  })}
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="1,000"
                  className={`${fieldClass} pl-8`}
                />
              </div>
            </FormField>

            <div className="rounded-2xl border border-[#e9e9e6] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold">Reward levels</h4>
                  <p className="mt-1 text-[11px] text-[#888]">
                    Milestones and player rewards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => append({ name: "", reward: undefined })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e7e7e4] px-3 py-2 text-xs font-medium hover:bg-[#f7f7f5]"
                >
                  <Plus size={14} />
                  Add level
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_105px_32px] items-start gap-2"
                  >
                    <label className="block text-[10px] text-[#777]">
                      Level {index + 1}

                      <input
                        {...register(`levels.${index}.name`, {
                          required: "Enter a milestone name.",
                        })}
                        placeholder="Reach level 5"
                        className={`${fieldClass} mt-1 text-xs`}
                      />

                      {errors.levels?.[index]?.name?.message && (
                        <span className="mt-1 block text-[10px] text-red-600">
                          {errors.levels[index]?.name?.message}
                        </span>
                      )}
                    </label>

                    <label className="block text-[10px] text-[#777]">
                      Reward

                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#777]">
                          $
                        </span>

                        <input
                          {...register(`levels.${index}.reward`, {
                            valueAsNumber: true,
                            required: "Add a reward.",
                            min: {
                              value: 0.01,
                              message: "Reward must be positive.",
                            },
                          })}
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="2.00"
                          className={`${fieldClass} pl-7 text-xs`}
                        />
                      </div>

                      {errors.levels?.[index]?.reward?.message && (
                        <span className="mt-1 block text-[10px] text-red-600">
                          {errors.levels[index]?.reward?.message}
                        </span>
                      )}
                    </label>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      aria-label={`Remove level ${index + 1}`}
                      className="mt-6.25 rounded-lg p-2 text-[#999] transition hover:bg-[#f5eeee] hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#f4f5f0] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#777]">
                    Estimated player limit
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#777]">
                    Budget ÷ total reward per player
                  </p>
                </div>

                <ImagePlus size={17} className="text-[#777]" />
              </div>

              <p className="mt-4 text-4xl font-semibold tracking-[-0.07em]">
                {playerLimit > 0
                  ? playerLimit.toLocaleString("en-US")
                  : "—"}

                <span className="ml-2 text-sm font-normal tracking-normal text-[#777]">
                  players
                </span>
              </p>

              <p className="mt-2 text-[11px] leading-5 text-[#777]">
                {playerLimit > 0
                  ? `${currency(Number(budget))} budget ÷ ${currency(totalRewardPerPlayer)} rewards per player. This cap keeps the full reward journey within budget.`
                  : "Enter a budget and rewards to calculate how many players your campaign can support."}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#ececea] pt-5 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#e5e5e2] px-4 py-3 text-sm font-medium hover:bg-[#f7f7f5]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploadingImage}
                className="flex-1 rounded-xl bg-[#151515] px-4 py-3 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-wait disabled:opacity-60"
              >
                {uploadingImage
                  ? "Preparing image…"
                  : "Create campaign"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function readAndCompressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read image."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Invalid image file."));

      image.onload = () => {
        const maxDimension = 1200;

        const scale = Math.min(
          1,
          maxDimension / Math.max(image.width, image.height),
        );

        const canvas = document.createElement("canvas");

        canvas.width = Math.max(
          1,
          Math.round(image.width * scale),
        );

        canvas.height = Math.max(
          1,
          Math.round(image.height * scale),
        );

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Canvas is unavailable."));
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#e5e5e2] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa] focus:border-[#999]";

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-medium text-[#454545]">
      {label}
      {children}

      {error && (
        <span className="mt-1 block text-[11px] font-normal text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
