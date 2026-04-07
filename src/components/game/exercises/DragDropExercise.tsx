import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "../../ui/Button";
import { CheckCircle2, XCircle, GripVertical } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useTranslation } from "react-i18next";

interface SortableItemProps {
  id: string;
}

const SortableItem = ({ id }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm transition-colors",
        isDragging && "shadow-xl border-brand-blue"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400">
        <GripVertical className="w-6 h-6" />
      </div>
      <span className="text-xl font-bold dark:text-white">{id}</span>
    </div>
  );
};

interface DragDropExerciseProps {
  options: string[];
  correctAnswer: string; // Expected sequence joined by comma
  onCorrect: () => void;
  onIncorrect: () => void;
}

export const DragDropExercise = ({
  options,
  correctAnswer,
  onCorrect,
  onIncorrect,
}: DragDropExerciseProps) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(options);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const correct = items.join(",") === correctAnswer.replace(/\s/g, "");
    setIsCorrect(correct);

    setTimeout(() => {
      if (correct) onCorrect();
      else onIncorrect();
      setSubmitted(false);
      setIsCorrect(null);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {items.map((id) => (
              <SortableItem key={id} id={id} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={submitted}
          className="w-full py-6 text-xl rounded-2xl"
        >
          {t('common.check', { defaultValue: 'Check' })}
        </Button>

        {isCorrect !== null && (
          <div className={cn(
            "p-4 rounded-2xl w-full text-center font-bold",
            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {isCorrect ? t('quiz.mascot_correct') : t('quiz.mascot_wrong')}
          </div>
        )}
      </div>
    </div>
  );
};
