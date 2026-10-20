import React, { useState } from "react";
import { Modal } from "./Modal";
import { ExerciseAnimation } from "./ExerciseAnimation";
import { Exercise } from "../types";
import { Dumbbell, Clock, Flame, CheckCircle, AlertTriangle, Lightbulb, Play, Video } from "lucide-react";

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartExercise?: (exercise: Exercise) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStartExercise
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<"animation" | "video">("animation");

  if (!exercise) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={exercise.name} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Media Switcher */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActiveMediaTab("animation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMediaTab === "animation"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Play size={13} />
              Biomechanical Motion
            </button>
            {exercise.videoUrl && (
              <button
                onClick={() => setActiveMediaTab("video")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMediaTab === "video"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Video size={13} />
                Video Demo
              </button>
            )}
          </div>

          {activeMediaTab === "animation" ? (
            <ExerciseAnimation
              type={exercise.animationType}
              name={exercise.name}
              category={exercise.category}
            />
          ) : exercise.videoUrl ? (
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md">
              <iframe
                src={exercise.videoUrl}
                title={`${exercise.name} demonstration`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>

        {/* Quick Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">Category</span>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{exercise.category}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">Equipment</span>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{exercise.equipment}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">Protocol</span>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{exercise.sets} × {exercise.reps}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-0.5">Rest Time</span>
            <span className="font-semibold text-sm text-blue-600 dark:text-blue-400">{exercise.restSeconds} sec</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Overview</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{exercise.description}</p>
        </div>

        {/* Target Muscles */}
        {exercise.muscles && exercise.muscles.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Muscles</h4>
            <div className="flex flex-wrap gap-1.5">
              {exercise.muscles.map((muscle, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-900/50"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        {exercise.instructions && exercise.instructions.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle size={14} className="text-blue-500" />
              Step-by-Step Execution
            </h4>
            <ol className="space-y-2">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Pro Tips */}
        {exercise.tips && exercise.tips.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
            <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-600" />
              Coaching Cues & Tips
            </h4>
            <ul className="space-y-1">
              {exercise.tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-amber-900 dark:text-amber-200 list-disc list-inside">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Mistakes */}
        {exercise.mistakes && exercise.mistakes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-600" />
              Common Mistakes to Avoid
            </h4>
            <ul className="space-y-1">
              {exercise.mistakes.map((mistake, idx) => (
                <li key={idx} className="text-xs text-rose-900 dark:text-rose-200 list-disc list-inside">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        {onStartExercise && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onStartExercise(exercise);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Dumbbell size={16} />
              Train This Exercise
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
